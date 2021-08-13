/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.cmdbuild.utils.groovy;

import static com.google.common.base.Preconditions.checkNotNull;
import com.google.common.collect.ImmutableList;
import java.io.IOException;
import java.io.StringReader;
import static java.lang.String.format;
import java.util.List;
import org.apache.commons.io.IOUtils;
import static org.cmdbuild.utils.lang.CmCollectionUtils.list;
import static org.cmdbuild.utils.lang.CmExceptionUtils.runtime;
import static org.cmdbuild.utils.lang.CmPreconditions.checkNotBlank;

public class GroovyScriptToClassHelper {

    private final String scriptContent, className;
    private final List<String> paramNames;
    private List<String> contentLines, importLines;

    public GroovyScriptToClassHelper(String className, String scriptContent, Iterable<String> paramNames) {
        this.className = checkNotBlank(className);
        this.scriptContent = checkNotNull(scriptContent);
        this.paramNames = ImmutableList.copyOf(paramNames);
    }

    public GroovyScriptClass buildGroovyClassScript() {
        try {
            contentLines = IOUtils.readLines(new StringReader(scriptContent));

            separateImportLines();

            StringBuilder groovyScript = new StringBuilder();
            importLines.forEach((importLine) -> {
                groovyScript.append(importLine).append("\n");
            });
            groovyScript.append(format("class %s implements %s {\n\n    public void execute(Map<String, Object> dataIn, Map<String, Object> dataOut){\n\n", className, GroovyScript.class.getCanonicalName()));
            paramNames.forEach((param) -> {
                groovyScript.append(format("        def %s = dataIn.get(\"%s\");\n", param, param));
            });
            groovyScript.append("\n");
            contentLines.forEach((contentLine) -> {
                groovyScript.append("        ").append(contentLine).append("\n");
            });
            groovyScript.append("\n\n");
            paramNames.forEach((param) -> {
                groovyScript.append(format("        dataOut.put(\"%s\",%s);\n", param, param));
            });
            groovyScript.append("\n    }\n\n}\n");

            return new GroovyScriptClassImpl(className, groovyScript.toString(), 6 + paramNames.size());
        } catch (IOException ex) {
            throw new GroovyScriptException(ex);
        }
    }

    private void separateImportLines() {
        List<String> allScriptContentLines = contentLines;

        importLines = list();
        contentLines = list();

        allScriptContentLines.forEach((line) -> {
            if (line.matches("^\\s*import\\s+.*")) {
                importLines.add(line);
            } else {
                contentLines.add(line);
            }
        });

    }

    private static class GroovyScriptClassImpl implements GroovyScriptClass {

        final String code;
        private final String className;
        final int offset;

        public GroovyScriptClassImpl(String className, String code, int offset) {
            this.code = checkNotBlank(code);
            this.className = checkNotBlank(className);
            this.offset = offset;
        }

        @Override
        public String getCode() {
            return code;
        }

        @Override
        public String getClassName() {
            return className;
        }

        @Override
        public int getScriptOffset() {
            return offset;
        }

    }

}
