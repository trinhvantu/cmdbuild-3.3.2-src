/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.cmdbuild.email.test;

import org.cmdbuild.email.beans.EmailAccountImpl;
import org.cmdbuild.email.utils.EmailMtaUtils;
import org.junit.Ignore;
import org.junit.Test;

public class EmailMtaUtilsTest {

    @Test
    @Ignore("set account params to run this test")
    public void testImapConnect() {
        EmailMtaUtils.testImapConnection(EmailAccountImpl.builder()
                .withUsername("test@gmail.com").withPassword("____")
                .withImapServer("imap.gmail.com").withImapPort(993).withImapSsl(true).withImapStartTls(false)
                .build());
    }

    @Test
    @Ignore("set account params to run this test")
    public void testSmtpConnect() {
        EmailMtaUtils.testSmtpConnection(EmailAccountImpl.builder()
                .withUsername("test@gmail.com").withPassword("____")
                .withSmtpServer("smtp.gmail.com").withSmtpPort(465).withSmtpSsl(true).withSmtpStartTls(false)
                .build());
    }

}
