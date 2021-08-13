/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.cmdbuild.translation.file;

import static com.google.common.base.Preconditions.checkNotNull;
import com.google.common.collect.HashMultimap;
import com.google.common.collect.ImmutableList;
import com.google.common.collect.Multimap;
import java.io.File;
import static java.nio.charset.StandardCharsets.UTF_8;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import javax.annotation.Nullable;
import org.apache.commons.io.FileUtils;
import org.cmdbuild.config.api.DirectoryService;
import org.cmdbuild.services.PostStartup;
import org.cmdbuild.translation.dao.Translation;
import org.cmdbuild.translation.dao.TranslationSource;
import static org.cmdbuild.translation.file.TranslationFromFileUtils.loadTranslations;
import static org.cmdbuild.utils.io.CmIoUtils.readToString;
import static org.cmdbuild.utils.lang.CmPreconditions.checkNotBlank;
import static org.cmdbuild.utils.lang.KeyFromPartsUtils.key;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Component
public class TranslationSourceFromFileImpl implements TranslationSource { //TODO improve this service

    private final Logger logger = LoggerFactory.getLogger(getClass());

    private final DirectoryService directoryService;

    private final Multimap<String, Translation> translationsByCode = HashMultimap.create();
    private final Map<String, Translation> translationsByCodeAndLang = new ConcurrentHashMap<>();

    public TranslationSourceFromFileImpl(DirectoryService directoryService) {
        this.directoryService = checkNotNull(directoryService);
    }

    @PostStartup
    public void loadStaticTranslationsFromFile() {
        if (!directoryService.hasWebappDirectory()) {
            logger.warn("cannot load sstatic translations from file: webapp folder not available");
        } else {
            File localesDir = new File(directoryService.getWebappDirectory(), "ui/app/locales");
            FileUtils.listFiles(localesDir, new String[]{"js"}, true).stream().filter(f -> f.getName().matches("Locales.js")).forEach(f -> {
                logger.debug("load translations from file =< {} >", f.getAbsolutePath());
                loadTranslations(readToString(f, UTF_8)).forEach(TranslationSourceFromFileImpl.this::load);
            });
        }
    }

    @Override
    public List<Translation> getTranslations(String code) {
        return ImmutableList.copyOf(translationsByCode.get(checkNotBlank(code)));
    }

    @Override
    @Nullable
    public String getTranslationOrNull(String code, String lang) {
        return Optional.ofNullable(translationsByCodeAndLang.get(key(checkNotBlank(code), checkNotBlank(lang)))).map(Translation::getValue).orElse(null);
    }

    private void load(Translation translation) {
        logger.debug("load translation code =< {} > lang =< {} > value =< {} >", translation.getCode(), translation.getLang(), translation.getValue());
        translationsByCode.put(translation.getCode(), translation);
        translationsByCodeAndLang.put(key(translation.getCode(), translation.getLang()), translation);
    }

}
