/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.cmdbuild.report.inner;

import static com.google.common.base.Preconditions.checkNotNull;
import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.List;
import java.util.Map;
import static java.util.stream.Collectors.toList;
import net.sf.jasperreports.engine.JasperReportsContext;
import net.sf.jasperreports.engine.SimpleJasperReportsContext;
import net.sf.jasperreports.engine.fonts.FontFamily;
import net.sf.jasperreports.engine.fonts.SimpleFontFamily;
import net.sf.jasperreports.repo.FileRepositoryPersistenceServiceFactory;
import net.sf.jasperreports.repo.FileRepositoryService;
import net.sf.jasperreports.repo.PersistenceService;
import net.sf.jasperreports.repo.PersistenceServiceFactory;
import net.sf.jasperreports.repo.PersistenceUtil;
import net.sf.jasperreports.repo.RepositoryService;
import net.sf.jasperreports.repo.Resource;
import net.sf.jasperreports.repo.StreamRepositoryService;
import org.apache.commons.beanutils.BeanUtils;
import static org.apache.commons.lang3.StringUtils.trimToNull;
import org.cmdbuild.cache.CacheService;
import org.cmdbuild.cache.Holder;
import org.cmdbuild.config.ReportConfiguration;
import org.cmdbuild.config.api.ConfigListener;
import org.cmdbuild.config.api.DirectoryService;
import org.cmdbuild.easyupload.EasyuploadItem;
import org.cmdbuild.easyupload.EasyuploadService;
import org.cmdbuild.report.ReportException;
import org.cmdbuild.services.PostStartup;
import static org.cmdbuild.utils.lang.CmCollectionUtils.list;
import static org.cmdbuild.utils.lang.CmMapUtils.map;
import static org.cmdbuild.utils.lang.CmMapUtils.mapOf;
import static org.cmdbuild.utils.lang.CmStringUtils.mapToLoggableStringLazy;
import static org.cmdbuild.utils.lang.CmStringUtils.toStringOrNull;
import static org.cmdbuild.utils.lang.LambdaExceptionUtils.rethrowBiConsumer;
import static org.cmdbuild.utils.lang.LambdaExceptionUtils.rethrowFunction;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Component
public class JasperReportContextServiceImpl implements JasperReportContextService {

    private final Logger logger = LoggerFactory.getLogger(getClass());

    private final EasyuploadService easyuploadService;
    private final DirectoryService directoryService;
    private final ReportConfiguration reportConfiguration;

    private final Holder<JasperReportsContext> reportContext;

    public JasperReportContextServiceImpl(DirectoryService directoryService, EasyuploadService easyuploadService, ReportConfiguration reportConfiguration, CacheService cacheService) {
        this.reportConfiguration = checkNotNull(reportConfiguration);
        this.directoryService = checkNotNull(directoryService);
        this.easyuploadService = checkNotNull(easyuploadService);
        reportContext = cacheService.newHolder("jasper_report_context");
    }

    @ConfigListener(ReportConfiguration.class)
    public void reloadReportContext() {
        reportContext.invalidate();
        getContext();
    }

    @PostStartup
    public void loadJasperReportsContext() {
        getContext();
    }

    @Override
    public JasperReportsContext getContext() {
        return reportContext.get(this::doGetContext);
    }

    private JasperReportsContext doGetContext() {
        try {
            logger.debug("load jasper report context");
            SimpleJasperReportsContext context = new SimpleJasperReportsContext();

            Map<String, String> config = mapOf(String.class, String.class).skipNullValues().with(
                    "net.sf.jasperreports.awt.ignore.missing.font", toStringOrNull(reportConfiguration.ignoreMissingFont()),
                    "net.sf.jasperreports.default.pdf.encoding", trimToNull(reportConfiguration.getDefaultPdfEncoding()),
                    "net.sf.jasperreports.default.pdf.font.name", trimToNull(reportConfiguration.getDefaultPdfFont())
            ).with(reportConfiguration.getOtherReportConfigs());

            logger.debug("set jasper report config params = \n\n{}\n", mapToLoggableStringLazy(config));

            config.forEach(context::setProperty);

            context.setExtensions(map(
                    RepositoryService.class, list((RepositoryService) new CmRepositoryService(context)).accept(l -> {
                        if (directoryService.hasConfigDirectory()) {
                            logger.debug("add resource repository from path =< {} >", directoryService.getConfigDirectory().getAbsolutePath());
                            l.add(new FileRepositoryService(context, directoryService.getConfigDirectory().getAbsolutePath(), false));
                        }
                    }),
                    PersistenceServiceFactory.class, list(FileRepositoryPersistenceServiceFactory.getInstance())
            ));

            logger.debug("load jasper report font configs");
            List<FontFamily> fontConfigs = reportConfiguration.getFontConfigs().stream().map(rethrowFunction((fc) -> {
                logger.debug("load font family = \n\n{}\n", mapToLoggableStringLazy(fc));
                SimpleFontFamily fontFamily = new SimpleFontFamily(context);
                fc.forEach(rethrowBiConsumer((k, v) -> {
                    try {
                        BeanUtils.setProperty(fontFamily, k, v);
                    } catch (Exception ex) {
                        throw new ReportException(ex, "error setting font family property key =< %s > value =< %s >", k, v);
                    }
                }));
                return fontFamily;
            })).collect(toList());

            context.setExtensions(FontFamily.class, fontConfigs);

            logger.debug("jasper report context is ready");
            return context;
        } catch (Exception ex) {
            throw new ReportException(ex, "error loading jasper report context");
        }
    }

    private class CmRepositoryService implements RepositoryService, StreamRepositoryService {

        private final JasperReportsContext context;

        public CmRepositoryService(JasperReportsContext context) {
            this.context = checkNotNull(context);
        }

        @Override
        public Resource getResource(String uri) {
            return null;
        }

        @Override
        public void saveResource(String uri, Resource resource) {
        }

        @Override
        public <K extends Resource> K getResource(String uri, Class<K> resourceType) {
            logger.debug("get resource from uri =< {} > of type = {}", uri, resourceType);
            PersistenceService persistenceService = PersistenceUtil.getInstance(context).getService(FileRepositoryService.class, resourceType);//TODO improve this, get service for MyRepositoryService
            K resource;
            if (persistenceService != null) {
                resource = (K) persistenceService.load(uri, this);
            } else {
                resource = null;
            }
            logger.debug("found resource = {}", resource);
            return resource;
        }

        @Override
        public InputStream getInputStream(String uri) {
            EasyuploadItem item = easyuploadService.getByPathOrNull(uri);
            if (item == null) {
                return null;
            } else {
                return new ByteArrayInputStream(item.getContent());
            }
        }

        @Override
        public OutputStream getOutputStream(String uri) {
            return null;
        }

    }

}
