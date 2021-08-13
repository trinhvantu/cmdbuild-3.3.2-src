/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.cmdbuild.translation.dao;

import static com.google.common.base.Preconditions.checkNotNull;
import static java.lang.String.format;
import java.util.Collection;
import java.util.List;
import java.util.Optional;
import javax.annotation.Nullable;
import static org.apache.commons.lang3.StringUtils.isNotBlank;
import org.cmdbuild.cache.CacheService;
import static org.cmdbuild.utils.lang.KeyFromPartsUtils.key;
import org.cmdbuild.common.utils.PagedElements;
import static org.cmdbuild.common.utils.PagedElements.isPaged;
import static org.cmdbuild.common.utils.PagedElements.paged;
import static org.cmdbuild.dao.constants.SystemAttributes.ATTR_CODE;
import static org.cmdbuild.utils.lang.CmPreconditions.checkNotBlank;
import org.springframework.stereotype.Component;
import org.cmdbuild.dao.core.q3.DaoService;
import static org.cmdbuild.dao.core.q3.WhereOperator.EQ;
import static org.cmdbuild.dao.core.q3.WhereOperator.LIKE;
import static org.cmdbuild.data.filter.SorterElementDirection.ASC;
import org.cmdbuild.cache.CmCache;
import static org.cmdbuild.dao.core.q3.WhereOperator.IN;
import org.cmdbuild.translation.file.TranslationSourceFromFileImpl;
import static org.cmdbuild.utils.lang.CmCollectionUtils.set;

@Component
public class TranslationRepositoryImpl implements TranslationRepository {

    private final DaoService dao;
    private final TranslationSource translationFromFile;
    private final CmCache<Optional<String>> translationByCodeAndLang;

    public TranslationRepositoryImpl(DaoService dao, CacheService cacheService, TranslationSourceFromFileImpl translationFromFile) {
        this.dao = checkNotNull(dao);
        this.translationFromFile = checkNotNull(translationFromFile);
        translationByCodeAndLang = cacheService.newCache("translation_by_code_and_lang");
    }

    @Override
    public List<Translation> getTranslations(String code) {
        return dao.selectAll().from(TranslationImpl.class).where(ATTR_CODE, EQ, checkNotBlank(code, "translation code cannot be null")).asList();
    }

    @Override
    @Nullable
    public String getTranslationOrNull(String code, String lang) {
        return translationByCodeAndLang.get(key(code, lang), () -> Optional.ofNullable(doGetTranslationOrNull(code, lang))).orElse(null);
    }

    @Nullable
    private String doGetTranslationOrNull(String code, String lang) {
        return Optional.ofNullable(translationFromFile.getTranslationOrNull(code, lang))//TODO improve this
                .or(() -> Optional.ofNullable(getTranslationRecordOrNull(code, lang)).map(TranslationImpl::getValue)).orElse(null);
    }

    @Override
    public PagedElements<Translation> getTranslations(@Nullable String filter, @Nullable Integer offset, @Nullable Integer limit) {
        List<Translation> list = dao.selectAll()
                .from(TranslationImpl.class)
                .orderBy(ATTR_CODE, ASC, "Lang", ASC)
                .paginate(offset, limit)
                .accept((q) -> {
                    if (isNotBlank(filter)) {
                        q.where(ATTR_CODE, LIKE, format("%%%s%%", filter));
                    }
                })
                .asList();
        if (isPaged(offset, limit)) {
            long count = dao.selectCount().from(TranslationImpl.class)
                    .accept((q) -> {
                        if (isNotBlank(filter)) {
                            q.where(ATTR_CODE, LIKE, format("%%%s%%", filter));
                        }
                    })
                    .getCount();
            return paged(list, count);
        } else {
            return paged(list);
        }
    }

    @Override
    public Translation setTranslation(String code, String lang, String value) {
        TranslationImpl record = getTranslationRecordOrNull(code, lang);
        if (record == null) {
            record = dao.create(TranslationImpl.builder().withCode(code).withLang(lang).withValue(value).build());
        } else {
            record = dao.update(TranslationImpl.copyOf(record).withValue(value).build());
        }
        translationByCodeAndLang.invalidate(key(code, lang));
        return record;
    }

    @Override
    public void deleteTranslationIfExists(String code, String lang) {
        TranslationImpl record = getTranslationRecordOrNull(code, lang);
        if (record != null) {
            deleteTranslation(record);
        }
    }

    @Override
    public void deleteTranslations(String code) {
        getTranslations(code).forEach(this::deleteTranslation);
    }

    private void deleteTranslation(Translation record) {
        dao.delete(record);
        translationByCodeAndLang.invalidate(key(record.getCode(), record.getLang()));
    }

    @Nullable
    private TranslationImpl getTranslationRecordOrNull(String code, String lang) {
        return dao.selectAll().from(TranslationImpl.class)
                .where(ATTR_CODE, EQ, checkNotBlank(code))
                .where("Lang", EQ, checkNotBlank(lang))
                .getOneOrNull();
    }

    @Override
    public List<Translation> getAllForLanguages(Collection<String> languages) {
        return dao.selectAll().from(Translation.class).where("Lang", IN, set(languages)).orderBy("Lang", ASC, ATTR_CODE, ASC).asList();
    }

}
