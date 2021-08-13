/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.cmdbuild.report.inner;

import static com.google.common.base.Objects.equal;
import static com.google.common.base.Preconditions.checkArgument;
import static com.google.common.base.Preconditions.checkNotNull;
import com.google.common.base.Stopwatch;
import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.sql.Connection;
import java.util.List;
import java.util.Map;
import java.util.concurrent.TimeUnit;
import static java.util.stream.Collectors.toList;
import javax.activation.DataHandler;
import javax.sql.DataSource;
import net.sf.jasperreports.engine.JasperFillManager;
import net.sf.jasperreports.engine.JasperPrint;
import net.sf.jasperreports.engine.JasperReport;
import org.cmdbuild.api.fluent.CmApiService;
import static org.cmdbuild.api.fluent.CmApiService.CMDB_API_PARAM;
import org.cmdbuild.report.ReportException;
import org.cmdbuild.report.ReportFormat;
import static org.cmdbuild.report.inner.utils.ReportUtils.exportReportTemplatesAsZip;
import static org.cmdbuild.report.inner.utils.ReportUtils.getBaseFileName;
import static org.cmdbuild.report.inner.utils.ReportUtils.getReportImageName;
import static org.cmdbuild.report.inner.utils.ReportUtils.getReportParameters;
import static org.cmdbuild.report.inner.utils.ReportUtils.getSubreportName;
import static org.cmdbuild.utils.lang.CmMapUtils.map;
import static org.cmdbuild.utils.lang.CmMapUtils.toMap;
import static org.cmdbuild.utils.lang.CmStringUtils.mapToLoggableString;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Component
public class ReportProcessorServiceImpl implements ReportProcessorService {

    private final Logger logger = LoggerFactory.getLogger(getClass());

    private final ReportHelper reportHelper;
    private final DataSource dataSource;
    private final ReportPreferencesHelperService preferencesHelper;
    private final JasperReportContextService contextService;
    private final CmApiService apiService;

    public ReportProcessorServiceImpl(ReportHelper reportHelper, DataSource dataSource, ReportPreferencesHelperService preferencesHelper, JasperReportContextService contextService, CmApiService apiService) {
        this.reportHelper = checkNotNull(reportHelper);
        this.dataSource = checkNotNull(dataSource);
        this.preferencesHelper = checkNotNull(preferencesHelper);
        this.contextService = checkNotNull(contextService);
        this.apiService = checkNotNull(apiService);
    }

    @Override
    public DataHandler executeReport(ReportDataExt report, ReportFormat reportExtension, Map<String, Object> parameters) {
        try {
            return new DbReportProcessorHelper(report, reportExtension, parameters).executeReport();
        } catch (Exception e) {
            throw new ReportException(e, "error processing report = %s", report);
        }
    }

    private class DbReportProcessorHelper {

        private final ReportDataExt reportData;
        private final ReportFormat reportExtension;
        private final Map<String, Object> params;

        public DbReportProcessorHelper(ReportDataExt reportData, ReportFormat reportExtension, Map<String, Object> params) {
            this.reportData = checkNotNull(reportData);
            this.reportExtension = checkNotNull(reportExtension);
            this.params = map(checkNotNull(params)).immutable();
        }

        public DataHandler executeReport() {
            if (equal(reportExtension, ReportFormat.ZIP)) {
                return new DataHandler(exportReportTemplatesAsZip(reportData));
            } else {
                return reportHelper.exportReport(doExecuteReport(), getBaseFileName(reportData), reportExtension);
            }
        }

        private JasperPrint doExecuteReport() {
            try {
                List<JasperReport> subReports = reportData.getSubJasperReports();
                List<InputStream> images = reportData.getImages().stream().map((b) -> new ByteArrayInputStream(b)).collect(toList());
                JasperReport jasperReport = reportData.getMasterJasperReport();

                checkNotNull(params, "must set parameters for report");

                Map<String, Object> userParams = getReportParameters(jasperReport).stream().collect(toMap(ReportParameter::getName, (parameter) -> {
                    String key = parameter.getName();
                    Object rawValue = params.get(key);
                    Object value = parameter.parseValue(rawValue);
                    checkArgument(parameter.isOptional() || value != null, "missing report param value for key = %s", key);
                    return value;
                }));

                logger.trace("report params =\n\n{}\n", mapToLoggableString(userParams));

                Map<String, Object> resourcesParams = map((m) -> {
                    for (int i = 0; i < subReports.size(); i++) {
                        m.put(getSubreportName(i), subReports.get(i));
                    }
                    for (int i = 0; i < images.size(); i++) {
                        m.put(getReportImageName(i), images.get(i));
                    }
                });

                logger.trace("report resources =\n\n{}\n", mapToLoggableString(resourcesParams));

                Map<String, Object> paramsForReport = map(userParams).with(resourcesParams).with(preferencesHelper.getUserPreferencesReportParams()).with(CMDB_API_PARAM, apiService.getCmApi());

                logger.debug("executing report = {}", reportData);
                Stopwatch stopwatch = Stopwatch.createStarted();
                JasperPrint jasperPrint;
                try (Connection connection = dataSource.getConnection()) {
                    jasperPrint = JasperFillManager.getInstance(contextService.getContext()).fill(jasperReport, paramsForReport, connection);
                }
                logger.debug("executed report = {} in {} secs", reportData, stopwatch.elapsed(TimeUnit.MILLISECONDS) / 1000d);
                return jasperPrint;

            } catch (Exception exception) {
                throw new ReportException(exception, "error processing report = %s", reportData);
            }
        }

        public String getContentType() {
            return reportHelper.getContentTypeForReportFormat(reportExtension);
        }

    }

}
