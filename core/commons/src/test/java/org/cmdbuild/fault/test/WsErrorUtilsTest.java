package org.cmdbuild.fault.test;

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
import static com.google.common.collect.Iterables.getOnlyElement;
import java.io.IOException;
import java.util.List;
import java.util.Map;
import static org.cmdbuild.fault.FaultUtils.errorToJsonMessages;
import org.cmdbuild.fault.FaultEventLevel;
import org.cmdbuild.fault.FaultEventImpl;
import static org.cmdbuild.utils.lang.CmCollectionUtils.onlyElement;
import static org.junit.Assert.assertEquals;
import org.junit.Test;

public class WsErrorUtilsTest {

    @Test
    public void testErrorToMessage1() {
        List messages = errorToJsonMessages(new FaultEventImpl(null, FaultEventLevel.ERROR, new NullPointerException("attribute value is null or missing for key = cm_filter_mark_ResponsabileMarketing+role:Direzione within entry = CardImpl{id=6230503, code=AD01 - AperturaPortale, type=AccountDemoCMDBuild}")));

        assertEquals(1, messages.size());

        Map<String, String> element = (Map) getOnlyElement(messages);

        assertEquals(false, element.get("show_user"));
        assertEquals("ERROR", element.get("level"));
        assertEquals("java.lang.NullPointerException: attribute value is null or missing for key = cm_filter_mark_ResponsabileMarketing+role:Direzione within entry = CardImpl{id=6230503, code=AD01 - AperturaPortale, type=AccountDemoCMDBuild}", element.get("message"));
    }

    @Test
    public void testErrorToMessage2() {
        List messages = errorToJsonMessages(new FaultEventImpl(null, FaultEventLevel.ERROR, new NullPointerException("CM: attribute value is null or missing for key = cm_filter_mark_ResponsabileMarketing+role:Direzione within entry = CardImpl{id=6230503, code=AD01 - AperturaPortale, type=AccountDemoCMDBuild}")));

        assertEquals(2, messages.size());

        {
            Map<String, String> element = (Map<String, String>) messages.stream().filter(m -> (boolean) ((Map) m).get("show_user") == true).collect(onlyElement());

            assertEquals(true, element.get("show_user"));
            assertEquals("ERROR", element.get("level"));
            assertEquals("attribute value is null or missing for key = cm_filter_mark_ResponsabileMarketing+role:Direzione within entry = CardImpl{id=6230503, code=AD01 - AperturaPortale, type=AccountDemoCMDBuild}", element.get("message"));
        }

        {
            Map<String, String> element = (Map<String, String>) messages.stream().filter(m -> (boolean) ((Map) m).get("show_user") == false).collect(onlyElement());

            assertEquals(false, element.get("show_user"));
            assertEquals("ERROR", element.get("level"));
            assertEquals("java.lang.NullPointerException: CM: attribute value is null or missing for key = cm_filter_mark_ResponsabileMarketing+role:Direzione within entry = CardImpl{id=6230503, code=AD01 - AperturaPortale, type=AccountDemoCMDBuild}", element.get("message"));
        }
    }

    @Test
    public void testErrorToMessage3() {
        List messages = errorToJsonMessages(new FaultEventImpl(null, FaultEventLevel.ERROR, new IOException(new RuntimeException("uncategorized SQLException for SQL []; SQL state [P0001]; error code [0]; ERRORE: CM_CUSTOM_EXCEPTION: friendly exception!; nested exception is org.postgresql.util.PSQLException: ERRORE: CM_CUSTOM_EXCEPTION: friendly exception!, caused by: org.postgresql.util.PSQLException: ERRORE: CM_CUSTOM_EXCEPTION: friendly exception!"))));

        assertEquals(2, messages.size());

        {
            Map<String, String> element = (Map<String, String>) messages.stream().filter(m -> (boolean) ((Map) m).get("show_user") == true).collect(onlyElement());

            assertEquals(true, element.get("show_user"));
            assertEquals("ERROR", element.get("level"));
            assertEquals("friendly exception!", element.get("message"));
        }

        {
            Map<String, String> element = (Map<String, String>) messages.stream().filter(m -> (boolean) ((Map) m).get("show_user") == false).collect(onlyElement());

            assertEquals(false, element.get("show_user"));
            assertEquals("ERROR", element.get("level"));
            assertEquals("java.io.IOException: java.lang.RuntimeException: uncategorized SQLException for SQL []; SQL state [P0001]; error code [0]; ERRORE: CM_CUSTOM_EXCEPTION: friendly exception!; nested exception is org.postgresql.util.PSQLException: ERRORE: CM_CUSTOM_EXCEPTION: friendly exception!, caused by: org.postgresql.util.PSQLException: ERRORE: CM_CUSTOM_EXCEPTION: friendly exception!, caused by: java.lang.RuntimeException: uncategorized SQLException for SQL []; SQL state [P0001]; error code [0]; ERRORE: CM_CUSTOM_EXCEPTION: friendly exception!; nested exception is org.postgresql.util.PSQLException: ERRORE: CM_CUSTOM_EXCEPTION: friendly exception!, caused by: org.postgresql.util.PSQLException: ERRORE: CM_CUSTOM_EXCEPTION: friendly exception!", element.get("message"));
        }
    }

    @Test
    public void testErrorToMessage4() {
        List messages = errorToJsonMessages(new FaultEventImpl(null, FaultEventLevel.ERROR, new IOException(new RuntimeException("uncategorized SQLException for SQL []; SQL state [P0001]; error code [0]; ERROR: CM_CUSTOM_EXCEPTION: friendly exception!\n  Where: PL/pgSQL function exception_test_function() line 1 at RAISE"))));

        assertEquals(2, messages.size());

        {
            Map<String, String> element = (Map<String, String>) messages.stream().filter(m -> (boolean) ((Map) m).get("show_user") == true).collect(onlyElement());

            assertEquals(true, element.get("show_user"));
            assertEquals("ERROR", element.get("level"));
            assertEquals("friendly exception!", element.get("message"));
        }

        {
            Map<String, String> element = (Map<String, String>) messages.stream().filter(m -> (boolean) ((Map) m).get("show_user") == false).collect(onlyElement());

            assertEquals(false, element.get("show_user"));
            assertEquals("ERROR", element.get("level"));
            assertEquals("java.io.IOException: java.lang.RuntimeException: uncategorized SQLException for SQL []; SQL state [P0001]; error code [0]; ERROR: CM_CUSTOM_EXCEPTION: friendly exception!\n  Where: PL/pgSQL function exception_test_function() line 1 at RAISE, caused by: java.lang.RuntimeException: uncategorized SQLException for SQL []; SQL state [P0001]; error code [0]; ERROR: CM_CUSTOM_EXCEPTION: friendly exception!\n  Where: PL/pgSQL function exception_test_function() line 1 at RAISE", element.get("message"));
        }
    }

    @Test
    public void testErrorCodes1() {
        List messages = errorToJsonMessages(new FaultEventImpl(null, FaultEventLevel.ERROR, new NullPointerException("CME 123: attribute value is null or missing for key = cm_filter_mark_ResponsabileMarketing+role:Direzione within entry = CardImpl{id=6230503, code=AD01 - AperturaPortale, type=AccountDemoCMDBuild}")));

        assertEquals(1, messages.size());

        Map<String, String> element = (Map) getOnlyElement(messages);

        assertEquals(false, element.get("show_user"));
        assertEquals("ERROR", element.get("level"));
        assertEquals("123", element.get("code"));
        assertEquals("java.lang.NullPointerException: CME 123: attribute value is null or missing for key = cm_filter_mark_ResponsabileMarketing+role:Direzione within entry = CardImpl{id=6230503, code=AD01 - AperturaPortale, type=AccountDemoCMDBuild}", element.get("message"));

        assertEquals("123", getOnlyElement(errorToJsonMessages(new FaultEventImpl(null, FaultEventLevel.ERROR, new NullPointerException("CME 123; test")))).get("code"));
        assertEquals("123", getOnlyElement(errorToJsonMessages(new FaultEventImpl(null, FaultEventLevel.ERROR, new NullPointerException("CME 123 test")))).get("code"));
        assertEquals("123", getOnlyElement(errorToJsonMessages(new FaultEventImpl(null, FaultEventLevel.ERROR, new NullPointerException("CME[123] test")))).get("code"));
        assertEquals("123", getOnlyElement(errorToJsonMessages(new FaultEventImpl(null, FaultEventLevel.ERROR, new NullPointerException("CME(123) test")))).get("code"));
    }

    @Test
    public void testErrorCodes2() {
        List messages = errorToJsonMessages(new FaultEventImpl(null, FaultEventLevel.ERROR, new NullPointerException("CME 123: CM: attribute value is null or missing for key = cm_filter_mark_ResponsabileMarketing+role:Direzione within entry = CardImpl{id=6230503, code=AD01 - AperturaPortale, type=AccountDemoCMDBuild}")));

        assertEquals(2, messages.size());

        {
            Map<String, String> element = (Map<String, String>) messages.stream().filter(m -> (boolean) ((Map) m).get("show_user") == true).collect(onlyElement());

            assertEquals(true, element.get("show_user"));
            assertEquals("ERROR", element.get("level"));
            assertEquals("123", element.get("code"));
            assertEquals("attribute value is null or missing for key = cm_filter_mark_ResponsabileMarketing+role:Direzione within entry = CardImpl{id=6230503, code=AD01 - AperturaPortale, type=AccountDemoCMDBuild}", element.get("message"));
        }

        {
            Map<String, String> element = (Map<String, String>) messages.stream().filter(m -> (boolean) ((Map) m).get("show_user") == false).collect(onlyElement());

            assertEquals(false, element.get("show_user"));
            assertEquals("ERROR", element.get("level"));
            assertEquals("123", element.get("code"));
            assertEquals("java.lang.NullPointerException: CME 123: CM: attribute value is null or missing for key = cm_filter_mark_ResponsabileMarketing+role:Direzione within entry = CardImpl{id=6230503, code=AD01 - AperturaPortale, type=AccountDemoCMDBuild}", element.get("message"));
        }
    }

}
