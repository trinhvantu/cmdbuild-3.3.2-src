/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.cmdbuild.email.inner;

import static com.google.common.base.Preconditions.checkNotNull;
import java.util.List;
import javax.annotation.Nullable;
import static org.apache.commons.lang3.StringUtils.isNotBlank;
import static org.apache.commons.lang3.math.NumberUtils.isNumber;
import static org.cmdbuild.dao.constants.SystemAttributes.ATTR_CODE;
import static org.cmdbuild.dao.constants.SystemAttributes.ATTR_ID;
import static org.cmdbuild.dao.core.q3.CompositeWhereOperator.OR;
import org.cmdbuild.dao.core.q3.DaoService;
import static org.cmdbuild.dao.core.q3.QueryBuilder.EQ;
import org.cmdbuild.data.filter.CmdbFilter;
import org.cmdbuild.email.EmailSysTemplateRepository;
import org.cmdbuild.email.EmailTemplate;
import org.cmdbuild.email.EmailTemplateBindings;
import org.cmdbuild.email.EmailTemplateInlineConfig;
import org.cmdbuild.email.EmailTemplateService;
import org.cmdbuild.email.beans.EmailTemplateImpl;
import org.cmdbuild.email.template.EmailTemplateProcessorService;
import static org.cmdbuild.utils.lang.CmConvertUtils.toLong;
import static org.cmdbuild.utils.lang.CmPreconditions.checkNotBlank;
import org.springframework.stereotype.Component;

@Component
public class EmailTemplateServiceImpl implements EmailTemplateService {

    private final EmailSysTemplateRepository sysTemplateRepository;
    private final EmailTemplateProcessorService processorService;
    private final DaoService dao;

    public EmailTemplateServiceImpl(EmailSysTemplateRepository sysTemplateRepository, EmailTemplateProcessorService processorService, DaoService dao) {
        this.sysTemplateRepository = checkNotNull(sysTemplateRepository);
        this.processorService = checkNotNull(processorService);
        this.dao = checkNotNull(dao);
    }

    @Override
    public List<EmailTemplate> getAll() {
        return dao.selectAll().from(EmailTemplate.class).orderBy(ATTR_CODE).asList();
    }

    @Override
    public List<EmailTemplate> getMany(CmdbFilter filter) {
        return dao.selectAll().from(EmailTemplate.class).orderBy(ATTR_CODE).where(filter).asList();
    }

    @Override
    public EmailTemplate getOne(long id) {
        return dao.getById(EmailTemplate.class, id);
    }

    @Override
    @Nullable
    public EmailTemplate getByNameOrNull(String name) {
        return dao.selectAll().from(EmailTemplate.class).where(ATTR_CODE, EQ, checkNotBlank(name)).getOneOrNull();
    }

    @Override
    @Nullable
    public EmailTemplate getByNameOrIdOrNull(String idOrCode) {
        checkNotBlank(idOrCode);
        if (isNumber(idOrCode)) {
            return dao.selectAll().from(EmailTemplate.class).where(OR, q -> q.where(ATTR_CODE, EQ, idOrCode).where(ATTR_ID, EQ, toLong(idOrCode))).getOneOrNull();
        } else {
            return getByNameOrNull(idOrCode);
        }
    }

    @Override
    public EmailTemplate createEmailTemplate(EmailTemplate emailTemplate) {
        return dao.create(emailTemplate);
    }

    @Override
    public EmailTemplate updateEmailTemplate(EmailTemplate emailTemplate) {
        return dao.update(emailTemplate);
    }

    @Override
    public void deleteEmailTemplate(long id) {
        dao.delete(EmailTemplate.class, id);
    }

    @Override
    public EmailTemplateBindings getEmailTemplateBindings(EmailTemplate emailTemplate) {
        return processorService.getEmailTemplateBindings(emailTemplate);
    }

    @Override
    public EmailTemplate getSystemTemplateOrNull(String sysTemplateId) {
        return sysTemplateRepository.getSystemTemplateOrNull(sysTemplateId);
    }

    @Override
    public EmailTemplate getTemplate(EmailTemplateInlineConfig config) {
        return EmailTemplateImpl.copyOf(getByName(config.getTemplate())).withId(null).accept(t -> {
            if (config.getDelay() != null) {
                t.withDelay(config.getDelay());
            }
            if (isNotBlank(config.getContent())) {
                t.withBody(config.getContent());
            }
            if (!config.getReportList().isEmpty()) {
                t.withReports(config.getReportList());//TODO validate reports (??)
            }
        }).build();
    }

}
