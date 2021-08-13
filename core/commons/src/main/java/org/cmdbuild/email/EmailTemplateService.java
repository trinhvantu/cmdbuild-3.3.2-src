/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.cmdbuild.email;

import static com.google.common.base.Preconditions.checkNotNull;
import java.util.List;
import javax.annotation.Nullable;
import org.cmdbuild.data.filter.CmdbFilter;

public interface EmailTemplateService extends EmailSysTemplateRepository {

    List<EmailTemplate> getAll();

    List<EmailTemplate> getMany(CmdbFilter filter);

    EmailTemplate getOne(long id);

    @Nullable
    EmailTemplate getByNameOrNull(String name);

    @Nullable
    EmailTemplate getByNameOrIdOrNull(String idOrCode);

    EmailTemplate createEmailTemplate(EmailTemplate emailTemplate);

    EmailTemplate updateEmailTemplate(EmailTemplate emailTemplate);

    void deleteEmailTemplate(long id);

    EmailTemplateBindings getEmailTemplateBindings(EmailTemplate emailTemplate);

    EmailTemplate getTemplate(EmailTemplateInlineConfig notification);

    default EmailTemplate getByName(String code) {
        return checkNotNull(getByNameOrNull(code), "email template not found for code =< %s >", code);
    }

    default EmailTemplate getByNameOrId(String idOrCode) {
        return checkNotNull(getByNameOrIdOrNull(idOrCode), "email template not found for id or code =< %s >", idOrCode);
    }
}
