/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.cmdbuild.etl.database.job;

import static com.google.common.base.Preconditions.checkArgument;
import static com.google.common.base.Preconditions.checkNotNull;
import com.google.common.base.Supplier;
import static com.google.common.collect.ImmutableList.toImmutableList;
import static java.lang.String.format;
import java.util.List;
import java.util.Map;
import static java.util.stream.Collectors.joining;
import org.apache.commons.dbcp2.BasicDataSource;
import org.cmdbuild.email.EmailService;
import static org.cmdbuild.email.EmailStatus.ES_OUTGOING;
import org.cmdbuild.email.EmailTemplate;
import org.cmdbuild.email.EmailTemplateService;
import org.cmdbuild.email.beans.EmailImpl;
import org.cmdbuild.etl.EtlException;
import org.cmdbuild.etl.gate.inner.EtlGateHandlerType;
import static org.cmdbuild.etl.gate.inner.EtlGateHandlerType.ETLHT_DATABASE;
import org.cmdbuild.etl.job.EtlLoadHandler;
import org.cmdbuild.etl.job.EtlLoaderApi;
import static org.cmdbuild.etl.loader.EtlFileFormat.EFF_DATABASE;
import org.cmdbuild.etl.loader.EtlHandlerContext;
import org.cmdbuild.etl.loader.EtlHandlerContextImpl;
import org.cmdbuild.etl.loader.EtlProcessingResult;
import org.cmdbuild.etl.loader.EtlTemplate;
import org.cmdbuild.etl.loader.EtlTemplateColumnConfig;
import org.cmdbuild.etl.loader.EtlTemplateColumnConfigImpl;
import org.cmdbuild.etl.loader.EtlTemplateImpl;
import org.cmdbuild.etl.loader.EtlTemplateService;
import org.cmdbuild.etl.loader.EtlTemplateWithData;
import org.cmdbuild.etl.loader.EtlTemplateWithDataImpl;
import static org.cmdbuild.etl.utils.EtlResultUtils.prepareEmailData;
import static org.cmdbuild.utils.lang.CmConvertUtils.parseEnum;
import static org.cmdbuild.utils.lang.CmConvertUtils.toLongOrNull;
import static org.cmdbuild.utils.lang.CmExceptionUtils.marker;
import static org.cmdbuild.utils.lang.CmExecutorUtils.runSafe;
import static org.cmdbuild.utils.lang.CmMapUtils.mapOf;
import static org.cmdbuild.utils.lang.CmNullableUtils.getClassNameOfNullable;
import static org.cmdbuild.utils.lang.CmNullableUtils.isNotBlank;
import static org.cmdbuild.utils.lang.CmNullableUtils.isNullOrLtEqZero;
import static org.cmdbuild.utils.lang.CmPreconditions.firstNotBlank;
import static org.cmdbuild.utils.lang.CmPreconditions.trimAndCheckNotBlank;
import static org.cmdbuild.utils.lang.LambdaExceptionUtils.rethrowConsumer;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
public class DatabaseEtlLoadHandler implements EtlLoadHandler {

    private final Logger logger = LoggerFactory.getLogger(getClass());

    private final EtlTemplateService importService;

    public DatabaseEtlLoadHandler(EtlTemplateService importService) {
        this.importService = checkNotNull(importService);
    }

    @Override
    public EtlGateHandlerType getType() {
        return ETLHT_DATABASE;
    }

    private enum DatabaseImportSourceType {
        JDBC
    }

    @Override
    public EtlHandlerContext load(EtlLoaderApi api) {
        EtlProcessingResult result = new DatabaseImportJobHelper(api).executeImportJob();
        return new EtlHandlerContextImpl(result, api.getMeta());
    }

    private class DatabaseImportJobConfig {

        protected final String sqlDriver, jdbcUrl, username, password, testQuery;
        protected final List<EtlTemplate> templates;
        protected final DatabaseImportSourceType sourceType;

        public DatabaseImportJobConfig(EtlLoaderApi api) {
            sourceType = parseEnum(api.getConfigNotBlank("sourceType"), DatabaseImportSourceType.class);
            sqlDriver = api.getConfigNotBlank("jdbcDriverClassName");
            jdbcUrl = api.getConfigNotBlank("jdbcUrl");
            username = api.getConfigNotBlank("jdbcUsername");
            password = api.getConfigNotBlank("jdbcPassword");
            String testQueryConfig = firstNotBlank(api.getConfig("jdbcTestQuery"), sqlDriver.toLowerCase().contains("oracle") ? "SELECT 1 FROM DUAL" : "SELECT 1");
            testQuery = testQueryConfig.trim().toLowerCase().matches("false|disabled") ? null : testQueryConfig;

            templates = api.getTemplates();
            templates.forEach(t -> checkArgument(t.hasFormat(EFF_DATABASE), "invalid template format for template = %s", t));

            try {
                Class.forName(sqlDriver);
            } catch (ClassNotFoundException ex) {
                throw new EtlException(ex, "error loading sql driver class");
            }
        }
    }

    private class DatabaseImportJobHelper extends DatabaseImportJobConfig {

        private JdbcTemplate jdbcTemplate;

        public DatabaseImportJobHelper(EtlLoaderApi api) {
            super(api);
        }

        public EtlProcessingResult executeImportJob() {
            logger.info("execute database import job");
            try (BasicDataSource dataSource = new BasicDataSource()) {
                dataSource.setDriverClassName(sqlDriver);
                dataSource.setUrl(jdbcUrl);
                dataSource.setUsername(username);
                dataSource.setPassword(password);
                if (isNotBlank(testQuery)) {
                    dataSource.setValidationQuery(testQuery);
                }
                jdbcTemplate = new JdbcTemplate(dataSource);
                List<EtlTemplateWithData> data = templates.stream().map(this::loadDataForTemplate).collect(toImmutableList());
                EtlProcessingResult result = importService.importDataWithTemplates(data);
                logger.info(marker(), "import job completed: {}", result.getResultDescription());
                return result;
            } catch (Exception ex) {
                throw new EtlException(ex, "error executing database import job");
            } finally {
                jdbcTemplate = null;
            }
        }

        public JdbcTemplate getJdbcTemplate() {
            return checkNotNull(jdbcTemplate, "jdbc template not available");
        }

        private EtlTemplateWithData loadDataForTemplate(EtlTemplate template) {
            logger.debug("prepare data loader for template = {}", template);

            List<EtlTemplateColumnConfig> columns = template.getColumns();

            String query = format("SELECT %s FROM %s",
                    columns.stream().map(EtlTemplateColumnConfig::getColumnName).collect(joining(",")),//TODO column name escape??
                    trimAndCheckNotBlank(template.getSource(), "missing template source table"));//TODO table name escape??

            Supplier<List<Map<String, ?>>> data = () -> {
                logger.info("load data for template = {}: execute sql query =< {} >", template, query);
                return getJdbcTemplate().query(query, (r, n) -> mapOf(String.class, Object.class).accept(rethrowConsumer((m) -> {
                    for (int i = 0; i < columns.size(); i++) {
                        EtlTemplateColumnConfig config = columns.get(i);
                        Object value = r.getObject(i + 1);
                        checkArgument(value == null || value instanceof String || value instanceof Number, "unsupported value type for column =< %s > record = %s, type = %s", config.getColumnName(), n, getClassNameOfNullable(value));
                        m.put(config.getAttributeName(), value);
                    }
                })));
            };

            EtlTemplate actualTemplate = EtlTemplateImpl.copyOf(template)
                    .withColumns(columns.stream().map(c -> EtlTemplateColumnConfigImpl.copyOf(c).withColumnName(c.getAttributeName()).build()).collect(toImmutableList())).build();

            return new EtlTemplateWithDataImpl(actualTemplate, data);
        }

    }
}
