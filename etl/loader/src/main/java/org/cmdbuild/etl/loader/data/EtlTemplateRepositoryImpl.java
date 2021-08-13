/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.cmdbuild.etl.loader.data;

import static com.google.common.base.Objects.equal;
import static com.google.common.base.Preconditions.checkArgument;
import static com.google.common.base.Preconditions.checkNotNull;
import static com.google.common.collect.ImmutableList.toImmutableList;
import java.util.List;
import org.cmdbuild.cache.CacheService;
import org.cmdbuild.cache.CmCache;
import org.cmdbuild.cache.Holder;
import static org.cmdbuild.utils.lang.CmExceptionUtils.marker;
import static org.cmdbuild.dao.constants.SystemAttributes.ATTR_IDOBJ1;
import static org.cmdbuild.dao.constants.SystemAttributes.ATTR_IDOBJ2;
import org.cmdbuild.dao.core.q3.DaoService;
import org.cmdbuild.dao.entrytype.Attribute;
import org.cmdbuild.dao.entrytype.Classe;
import org.cmdbuild.dao.entrytype.Domain;
import org.cmdbuild.dao.entrytype.EntryType;
import static org.cmdbuild.dao.entrytype.attributetype.AttributeTypeName.FOREIGNKEY;
import static org.cmdbuild.dao.entrytype.attributetype.AttributeTypeName.LOOKUP;
import static org.cmdbuild.dao.entrytype.attributetype.AttributeTypeName.REFERENCE;
import org.cmdbuild.etl.EtlException;
import org.cmdbuild.etl.loader.EtlTemplateImpl;
import org.cmdbuild.etl.loader.EtlTemplateTarget;
import static org.cmdbuild.etl.utils.EtlTemplateUtils.serializeImportExportTemplateTarget;
import static org.cmdbuild.utils.lang.CmCollectionUtils.list;
import static org.cmdbuild.utils.lang.CmCollectionUtils.onlyElement;
import static org.cmdbuild.utils.lang.CmCollectionUtils.set;
import static org.cmdbuild.utils.lang.CmPreconditions.checkNotBlank;
import static org.cmdbuild.utils.lang.KeyFromPartsUtils.key;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Component;
import static org.cmdbuild.etl.loader.EtlTemplateTarget.ET_CLASS;
import static org.cmdbuild.etl.loader.EtlTemplateTarget.ET_DOMAIN;
import org.cmdbuild.etl.loader.EtlTemplate;
import static org.cmdbuild.etl.loader.EtlTemplateColumnMode.ETCM_DEFAULT;
import org.cmdbuild.etl.loader.EtlTemplateRepository;

@Component
@Primary
public class EtlTemplateRepositoryImpl implements EtlTemplateRepository {

    private final Logger logger = LoggerFactory.getLogger(getClass());

    private final DaoService dao;
    private final CmCache<List<EtlTemplate>> templatesByTarget;
    private final CmCache<EtlTemplate> templatesById, templatesByName;
    private final Holder<List<EtlTemplate>> templates;

    public EtlTemplateRepositoryImpl(DaoService dao, CacheService cacheService) {
        this.dao = checkNotNull(dao);
        templatesByTarget = cacheService.newCache("ietemplates_by_target");
        templatesByName = cacheService.newCache("ietemplates_by_name");
        templatesById = cacheService.newCache("ietemplates_by_id");
        templates = cacheService.newHolder("ietemplates_all");
    }

    private void invalidateCaches() {
        templatesByTarget.invalidateAll();
        templatesById.invalidateAll();
        templatesByName.invalidateAll();
        templates.invalidate();
    }

    @Override
    public List<EtlTemplate> getAll() {
        return templates.get(() -> dao.selectAll().from(EtlTemplateData.class).asList(EtlTemplateData.class).stream().map(this::dataToTemplate).collect(toImmutableList()));
    }

    @Override
    public List<EtlTemplate> getAllForTarget(EtlTemplateTarget type, String name) {
        checkNotNull(type);
        checkNotBlank(name);
        return templatesByTarget.get(key(serializeImportExportTemplateTarget(type), name), () -> getAll().stream().filter(t -> equal(t.getTargetType(), type) && equal(t.getTargetName(), name)).collect(toImmutableList()));
    }

    @Override
    public List<EtlTemplate> getAllForTargetClassAndRelatedDomains(String classId) {
        Classe classe = dao.getClasse(classId);
        List<Domain> domains = dao.getDomainsForClasse(classe);
        return list(getAllForTarget(ET_CLASS, classe.getName())).accept(l -> domains.stream().map(d -> getAllForTarget(ET_DOMAIN, d.getName())).forEach(l::addAll));
    }

    @Override
    public EtlTemplate getOne(long templateId) {
        return templatesById.get(templateId, () -> getAll().stream().filter(t -> equal(t.getId(), templateId)).collect(onlyElement("import/export template not found for id = %s", templateId)));
    }

    @Override
    public EtlTemplate getTemplateByName(String templateName) {
        return templatesByName.get(templateName, () -> doGetTemplateByName(templateName));
    }

    @Override
    public EtlTemplate create(EtlTemplate template) {
        template = dataToTemplate(dao.create(templateToData(template)));
        invalidateCaches();
        return template;
    }

    @Override
    public EtlTemplate update(EtlTemplate template) {
        template = dataToTemplate(dao.update(templateToData(template)));
        invalidateCaches();
        return template;
    }

    @Override
    public void delete(long templateId) {
        dao.delete(EtlTemplateData.class, templateId);
        invalidateCaches();
    }

    private EtlTemplate doGetTemplateByName(String templateName) {
        return getAll().stream().filter(t -> equal(t.getCode(), templateName)).collect(onlyElement("import/export template not found for name = %s", templateName));
    }

    private EtlTemplate dataToTemplate(EtlTemplateData data) {
        try {
            EtlTemplate template = EtlTemplateImpl.copyOf(data.getConfig())
                    .withId(data.getId())
                    .withActive(data.isActive())
                    .withCode(data.getCode())
                    .withDescription(data.getDescription())
//                    .withErrorEmailAccountId(data.getErrorEmailAccountId())
//                    .withErrorEmailTemplateId(data.getErrorEmailTemplateId())
                    .build();
            validateTemplateSafe(template);
            return template;
        } catch (Exception ex) {
            throw new EtlException(ex, "error processing template = %s", data);
        }
    }

    private EtlTemplateData templateToData(EtlTemplate template) {
        validateTemplate(template);
        return EtlTemplateDataImpl.builder()
                .withActive(template.isActive())
                .withCode(template.getCode())
                .withDescription(template.getDescription())
//                .withErrorEmailAccountId(template.getErrorEmailAccountId())
//                .withErrorEmailTemplateId(template.getErrorEmailTemplateId())
                .withId(template.getId())
                .withConfig(EtlTemplateConfigImpl.copyOf(template).build())
                .build();
    }

    private void validateTemplateSafe(EtlTemplate template) {
        try {
            validateTemplate(template);
        } catch (Exception ex) {
            logger.warn(marker(), "invalid template = {}", template, ex);
        }
    }

    private void validateTemplate(EtlTemplate template) {
        EntryType entryType;
        switch (template.getTargetType()) {
            case ET_CLASS:
                entryType = dao.getClasse(template.getTargetName());
                if (template.isImportTemplate()) {
                    checkArgument(!((Classe) entryType).isSuperclass(), "cannot create an import template on a super class");
                }
                break;
            case ET_DOMAIN:
                entryType = dao.getDomain(template.getTargetName());
                break;
            default:
                throw new IllegalArgumentException("unsupported target type = " + template.getTargetType());
        }
//        template.getColumns().forEach(c -> { TODO fix this, handle geo attributes
//            Attribute attribute = entryType.getAttribute(c.getAttributeName());
//            if (attribute.isOfType(REFERENCE, LOOKUP, FOREIGNKEY) || set(ATTR_IDOBJ1, ATTR_IDOBJ2).contains(attribute.getName())) {
//                checkArgument(!equal(c.getMode(), ETCM_DEFAULT), "invalid column mode = %s for attribute = %s", c.getMode(), attribute);
//            } else {
//                checkArgument(equal(c.getMode(), ETCM_DEFAULT), "invalid column mode = %s for attribute = %s", c.getMode(), attribute);
//            }
//        });
    }

}
