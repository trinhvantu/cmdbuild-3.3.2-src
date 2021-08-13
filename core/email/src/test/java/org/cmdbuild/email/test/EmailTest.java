/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.cmdbuild.email.test;

import org.cmdbuild.email.Email;
import static org.cmdbuild.email.EmailStatus.ES_DRAFT;
import static org.cmdbuild.email.EmailStatus.ES_OUTGOING;
import org.cmdbuild.email.beans.EmailImpl;
import static org.cmdbuild.utils.io.CmIoUtils.readToString;
import static org.cmdbuild.utils.lang.CmCollectionUtils.list;
import static org.junit.Assert.assertEquals;
import org.junit.Test;

public class EmailTest {

    @Test
    public void testEmailBuilder() {
        Email email = EmailImpl.builder().withStatus(ES_DRAFT)
                .withFromAddress("oneuser@onehost.net")
                .withToAddresses("seconduser@secondhost.net")
                .withCcAddresses("cc@others.net")
                .withBccAddresses("bcc@otherhost.net")
                .build();

        assertEquals("oneuser@onehost.net", email.getFromAddress());
        assertEquals("seconduser@secondhost.net", email.getToAddresses());
        assertEquals("cc@others.net", email.getCcAddresses());
        assertEquals("bcc@otherhost.net", email.getBccAddresses());

        email = EmailImpl.copyOf(email)
                .withFromAddress("from1@host.net")
                .withToAddresses(list("to1a@host.net", "to1b@host.net"))
                .withCcAddresses(list("cc1a@host.net", "\"cc1\" <cc1b@host.net>"))
                .withBccAddresses(list("bcc1a@host.net", "bcc1b@host.net"))
                .build();

        assertEquals("from1@host.net", email.getFromAddress());
        assertEquals("to1a@host.net, to1b@host.net", email.getToAddresses());
        assertEquals("cc1a@host.net, \"cc1\" <cc1b@host.net>", email.getCcAddresses());
        assertEquals("bcc1a@host.net, bcc1b@host.net", email.getBccAddresses());
        assertEquals(list("to1a@host.net", "to1b@host.net"), email.getToEmailAddressList());
        assertEquals(list("cc1a@host.net", "cc1b@host.net"), email.getCcEmailAddressList());
        assertEquals(list("bcc1a@host.net", "bcc1b@host.net"), email.getBccEmailAddressList());
        assertEquals(list("to1a@host.net", "to1b@host.net"), email.getToRawAddressList());
        assertEquals(list("cc1a@host.net", "cc1 <cc1b@host.net>"), email.getCcRawAddressList());
        assertEquals(list("bcc1a@host.net", "bcc1b@host.net"), email.getBccRawAddressList());

        Email otherEmail = EmailImpl.copyOf(email)
                .addToAddress("\"to\" <to2@host.net>")
                .addCcAddress("\"cc\" <cc2@host.net>")
                .addBccAddress("\"bcc\" <bcc2@host.net>")
                .build();

        assertEquals("from1@host.net", otherEmail.getFromAddress());
        assertEquals("to1a@host.net, to1b@host.net, \"to\" <to2@host.net>", otherEmail.getToAddresses());
        assertEquals("cc1a@host.net, cc1 <cc1b@host.net>, \"cc\" <cc2@host.net>", otherEmail.getCcAddresses());
        assertEquals("bcc1a@host.net, bcc1b@host.net, \"bcc\" <bcc2@host.net>", otherEmail.getBccAddresses());
        assertEquals(list("to1a@host.net", "to1b@host.net", "to2@host.net"), otherEmail.getToEmailAddressList());
        assertEquals(list("cc1a@host.net", "cc1b@host.net", "cc2@host.net"), otherEmail.getCcEmailAddressList());
        assertEquals(list("bcc1a@host.net", "bcc1b@host.net", "bcc2@host.net"), otherEmail.getBccEmailAddressList());
        assertEquals(list("to1a@host.net", "to1b@host.net", "to <to2@host.net>"), otherEmail.getToRawAddressList());
        assertEquals(list("cc1a@host.net", "cc1 <cc1b@host.net>", "cc <cc2@host.net>"), otherEmail.getCcRawAddressList());
        assertEquals(list("bcc1a@host.net", "bcc1b@host.net", "bcc <bcc2@host.net>"), otherEmail.getBccRawAddressList());

        otherEmail = EmailImpl.copyOf(email)
                .addToAddresses(list("\"to\" <to2@host.net>"))
                .addCcAddresses(list("\"cc\" <cc2@host.net>"))
                .addBccAddresses(list("\"bcc\" <bcc2@host.net>"))
                .build();

        assertEquals("from1@host.net", otherEmail.getFromAddress());
        assertEquals("to1a@host.net, to1b@host.net, \"to\" <to2@host.net>", otherEmail.getToAddresses());
        assertEquals("cc1a@host.net, cc1 <cc1b@host.net>, \"cc\" <cc2@host.net>", otherEmail.getCcAddresses());
        assertEquals("bcc1a@host.net, bcc1b@host.net, \"bcc\" <bcc2@host.net>", otherEmail.getBccAddresses());
        assertEquals(list("to1a@host.net", "to1b@host.net", "to2@host.net"), otherEmail.getToEmailAddressList());
        assertEquals(list("cc1a@host.net", "cc1b@host.net", "cc2@host.net"), otherEmail.getCcEmailAddressList());
        assertEquals(list("bcc1a@host.net", "bcc1b@host.net", "bcc2@host.net"), otherEmail.getBccEmailAddressList());
        assertEquals(list("to1a@host.net", "to1b@host.net", "to <to2@host.net>"), otherEmail.getToRawAddressList());
        assertEquals(list("cc1a@host.net", "cc1 <cc1b@host.net>", "cc <cc2@host.net>"), otherEmail.getCcRawAddressList());
        assertEquals(list("bcc1a@host.net", "bcc1b@host.net", "bcc <bcc2@host.net>"), otherEmail.getBccRawAddressList());
    }

    @Test
    public void testEmailContent4() {
        Email email = EmailImpl.builder().withStatus(ES_OUTGOING).withFromAddress("my.sender@email.net").withToAddresses("my.dest@email.net").withSubject("My Subject")
                .withContentType("application/octet-stream")
                .withContent(readToString(getClass().getResourceAsStream("/org/cmdbuild/test/core/email/email_4_content.txt"))).build();
        assertEquals("text/html", email.getContentType());
    }

    @Test
    public void testEmailContent5() {
        Email email = EmailImpl.builder().withStatus(ES_OUTGOING).withFromAddress("my.sender@email.net").withToAddresses("my.dest@email.net").withSubject("My Subject")
                .withContentType("application/octet-stream")
                .withContent(readToString(getClass().getResourceAsStream("/org/cmdbuild/test/core/email/email_5_content.txt"))).build();
        assertEquals("text/html", email.getContentType());
    }

}
