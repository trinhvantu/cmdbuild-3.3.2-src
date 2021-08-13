/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.cmdbuild.utils.groovy.test;

import static java.util.Collections.emptyMap;
import java.util.Map;
import org.cmdbuild.utils.classpath.MoreClasspathUtils;
import org.cmdbuild.utils.groovy.GroovyScriptExecutor;
import org.cmdbuild.utils.groovy.GroovyScriptExecutorImpl;
import org.cmdbuild.utils.groovy.SimpleGroovyScriptServiceImpl;
import static org.cmdbuild.utils.lang.CmConvertUtils.toInt;
import static org.cmdbuild.utils.lang.CmMapUtils.map;
import static org.cmdbuild.utils.lang.CmStringUtils.toStringNotBlank;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import org.junit.Test;

public class GroovyScriptExecutionTest {

    @Test
    public void testGroovyScript() {
        Map<String, Object> params = map("input", 3, "output", null);
        GroovyScriptExecutor groovyScriptExecutor = new GroovyScriptExecutorImpl("GroovyScriptDd6ypehc80l0zhp5s8m81rfh", "output = input + 1", null, params.keySet(), emptyMap());
        Map<String, Object> res = groovyScriptExecutor.execute(params);
        assertNotNull(res.get("output"));
        assertEquals(4, toInt(res.get("output")));
    }

    @Test
    public void testGroovyScriptService1() {
        assertEquals(3, toInt(new SimpleGroovyScriptServiceImpl().executeScript("output = input + 2", map("input", 1, "output", null)).get("output")));
    }

    @Test
    public void testGroovyScriptService2() {
        assertEquals(5, toInt(new SimpleGroovyScriptServiceImpl().executeScript("def three = one + two; output = three", map("one", 1, "two", 4, "output", null)).get("output")));
    }

    @Test(expected = Exception.class)
    public void testGroovyScriptWithCustomClasspath1() {
        assertEquals("ciao", toStringNotBlank(new SimpleGroovyScriptServiceImpl().executeScript("output = (new org.cmdbuild.utils.groovy.test.MyClass()).getMessage()", map("output", null)).get("output")));
    }

    @Test
    public void testGroovyScriptWithCustomClasspath2() {
        assertEquals("ciao", toStringNotBlank(new SimpleGroovyScriptServiceImpl().executeScript("output = (new org.cmdbuild.utils.groovy.test.MyClass()).getMessage()",
                MoreClasspathUtils.buildClassloaderWithJarOverride(getClass().getResourceAsStream("/org/cmdbuild/utils/groovy/test/custom_classpath_test.jar")),
                map("output", null)).get("output")));
    }

    @Test
    public void testGroovyScriptWithImport() {
        assertEquals("WITH IMPORT", toStringNotBlank(new SimpleGroovyScriptServiceImpl().executeScript("import org.cmdbuild.utils.groovy.test.beans.MyTestBean\n"
                + "import static org.cmdbuild.utils.groovy.test.beans.MyTestBean.getMyFirstString\n"
                + "output = getMyFirstString() + ' ' + new MyTestBean().getMySecondString()",
                map("output", null)).get("output")));
    }
}
