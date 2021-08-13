/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.cmdbuild.log;

import ch.qos.logback.classic.spi.IThrowableProxy;
import ch.qos.logback.classic.spi.ThrowableProxy;
import static com.google.common.collect.Lists.newArrayList;
import java.io.IOException;
import java.io.StringReader;
import java.io.StringWriter;
import java.util.List;
import javax.annotation.Nullable;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import javax.xml.transform.OutputKeys;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerException;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.dom.DOMSource;
import javax.xml.transform.stream.StreamResult;
import static org.cmdbuild.utils.lang.CmExceptionUtils.runtime;
import org.w3c.dom.Document;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.xml.sax.InputSource;
import org.xml.sax.SAXException;

public class LogbackUtils {

    public static List<Node> asList(NodeList nodeList) {//TODO move this to common xml lib
        List<Node> list = newArrayList();
        for (int i = 0; i < nodeList.getLength(); i++) {
            list.add(nodeList.item(i));
        }
        return list;
    }

    public static Document stringToDocument(String content) {//TODO move this to common xml lib
        try {
            DocumentBuilderFactory documentBuilderFactory = DocumentBuilderFactory.newInstance();
            documentBuilderFactory.setNamespaceAware(false);
            DocumentBuilder documentBuilder = documentBuilderFactory.newDocumentBuilder();
            return documentBuilder.parse(new InputSource(new StringReader(content)));
        } catch (ParserConfigurationException | SAXException | IOException ex) {
            throw runtime(ex);
        }
    }

    public static String documentToString(Document document) {//TODO move this to common xml lib
        try {
            Transformer transformer = TransformerFactory.newInstance().newTransformer();
            transformer.setOutputProperty(OutputKeys.OMIT_XML_DECLARATION, "yes");
            StringWriter writer = new StringWriter();
            transformer.transform(new DOMSource(document), new StreamResult(writer));
            return writer.toString();
        } catch (TransformerException ex) {
            throw runtime(ex);
        }
    }

    @Nullable
    public static Exception getExceptionFromLogbackIThrowableProxy(@Nullable IThrowableProxy proxy) {
        if (proxy == null || !(proxy instanceof ThrowableProxy)) {
            return null;
        } else {
            if (((ThrowableProxy) proxy).getThrowable() instanceof Exception) {
                return (Exception) ((ThrowableProxy) proxy).getThrowable();
            } else {
                return new RuntimeException(((ThrowableProxy) proxy).getThrowable());
            }
        }
    }
}
