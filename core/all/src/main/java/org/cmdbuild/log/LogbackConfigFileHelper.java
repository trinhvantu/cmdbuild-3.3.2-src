/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.cmdbuild.log;

import static com.google.common.base.Preconditions.checkNotNull;
import java.io.File;
import static java.lang.String.format;
import javax.xml.xpath.XPath;
import static javax.xml.xpath.XPathConstants.NODE;
import javax.xml.xpath.XPathExpressionException;
import javax.xml.xpath.XPathFactory;
import org.cmdbuild.config.api.DirectoryService;
import static org.cmdbuild.log.LogbackUtils.documentToString;
import static org.cmdbuild.log.LogbackUtils.stringToDocument;
import static org.cmdbuild.utils.io.CmIoUtils.javaTmpDir;
import static org.cmdbuild.utils.lang.CmExceptionUtils.runtime;
import static org.cmdbuild.utils.lang.CmPreconditions.checkNotBlank;
import static org.cmdbuild.utils.lang.CmPreconditions.firstNotBlank;
import static org.cmdbuild.utils.random.CmRandomUtils.randomId;
import org.w3c.dom.Document;
import org.w3c.dom.Element;

public class LogbackConfigFileHelper {

    private final LogbackConfigRepository repository;
    private final DirectoryService directoryService;

    public LogbackConfigFileHelper(LogbackConfigRepository repository, DirectoryService directoryService) {
        this.repository = checkNotNull(repository);
        this.directoryService = checkNotNull(directoryService);
    }

    public String getConfigFileContentOrDefault() {
        return setConfigPropertiesInLogbackConfig(getConfigContentOrTemplate());
    }

    public String setConfigPropertiesInLogbackConfig(String logbackConfig) {
        Document document = stringToDocument(logbackConfig);
        String logname = checkNotBlank(directoryService.getContextName());
        String logDir;
        if (directoryService.hasLogDirectory()) {
            logDir = directoryService.getLogDirectory().getAbsolutePath();
        } else {
            logDir = new File(javaTmpDir(), "cmdbuild_logs_" + randomId(4)).getAbsolutePath();
        }
        setXmlConfigProperty(document, "CM_LOG_DIR", logDir.replace('\\', '/'));
        setXmlConfigProperty(document, "CM_LOG_NAME", logname);
        return documentToString(document);
    }

    public boolean hasConfigFile() {
        return repository.hasConfigFile();
    }

    private String getConfigContentOrTemplate() {
        return firstNotBlank(repository.getLogbackConfig(), repository.getDefaultLogbackConfig());
    }

    private static void setXmlConfigProperty(Document document, String key, String value) {
        try {
            XPath xpath = XPathFactory.newInstance().newXPath();
            Element element = (Element) xpath.evaluate(format("/*[local-name()='configuration']/*[local-name()='property'][@name='%s']", key), document, NODE);
            if (element != null) {
                element.setAttribute("value", value);
            }
        } catch (XPathExpressionException ex) {
            throw runtime(ex);
        }
    }

}
