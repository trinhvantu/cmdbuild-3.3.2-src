/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.cmdbuild.translation;

import com.google.common.base.Joiner;
import static com.google.common.base.Objects.equal;
import static com.google.common.base.Preconditions.checkArgument;
import static com.google.common.base.Preconditions.checkNotNull;
import static com.google.common.base.Strings.emptyToNull;
import static com.google.common.base.Strings.nullToEmpty;
import static com.google.common.collect.Maps.uniqueIndex;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.StringWriter;
import static java.lang.String.format;
import java.nio.charset.StandardCharsets;
import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import static java.util.function.Function.identity;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import static java.util.stream.Collectors.toList;
import java.util.stream.Stream;
import javax.activation.DataHandler;
import javax.annotation.Nullable;
import static org.apache.commons.lang3.ObjectUtils.firstNonNull;
import static org.apache.commons.lang3.StringUtils.isBlank;
import static org.cmdbuild.utils.lang.KeyFromPartsUtils.key;
import static org.cmdbuild.utils.lang.CmExceptionUtils.marker;
import org.cmdbuild.common.localization.LanguageService;
import org.cmdbuild.common.utils.PagedElements;
import org.cmdbuild.dao.driver.repository.ClasseRepository;
import org.cmdbuild.dao.entrytype.Attribute;
import org.cmdbuild.dao.entrytype.AttributeGroupInfo;
import org.cmdbuild.dao.entrytype.Classe;
import org.cmdbuild.dao.entrytype.EntryType;
import static org.cmdbuild.translation.TranslationUtils.attributeDescriptionTranslationCode;
import static org.cmdbuild.translation.TranslationUtils.attributeGroupDescriptionTranslationCode;
import org.springframework.stereotype.Component;
import org.cmdbuild.translation.dao.TranslationRepository;
import static org.cmdbuild.utils.lang.CmPreconditions.checkNotBlank;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.cmdbuild.translation.dao.Translation;
import static org.cmdbuild.utils.io.CmIoUtils.newDataHandler;
import org.cmdbuild.utils.lang.CmCollectionUtils;
import static org.cmdbuild.utils.lang.CmCollectionUtils.isNullOrEmpty;
import static org.cmdbuild.utils.lang.CmCollectionUtils.set;
import static org.cmdbuild.utils.lang.CmExceptionUtils.runtime;
import static org.cmdbuild.utils.lang.CmMapUtils.toMap;
import org.supercsv.io.CsvListWriter;
import org.supercsv.prefs.CsvPreference;
import static org.cmdbuild.utils.lang.CmCollectionUtils.list;
import static org.cmdbuild.utils.lang.CmCollectionUtils.setOf;
import static org.cmdbuild.utils.lang.CmMapUtils.map;
import static org.cmdbuild.utils.lang.LambdaExceptionUtils.rethrowConsumer;
import org.supercsv.io.CsvListReader;

@Component
public class TranslationServiceImpl implements TranslationService, ObjectTranslationService {

    private final Logger logger = LoggerFactory.getLogger(getClass());

    private final ClasseRepository classeRepository;
    private final TranslationRepository translationRepository;
    private final LanguageService languageService;
    private final TranslationObjectsService objectsService;

    public TranslationServiceImpl(ClasseRepository classeRepository, TranslationRepository translationRepository, LanguageService languageService, TranslationObjectsService objectsService) {
        this.classeRepository = checkNotNull(classeRepository);
        this.translationRepository = checkNotNull(translationRepository);
        this.languageService = checkNotNull(languageService);
        this.objectsService = checkNotNull(objectsService);
    }

    @Override
    public String translateAttributeDescription(Attribute attribute) {
        String value = translateByCode(attributeDescriptionTranslationCode(attribute));
        if (attribute.isInherited() && attribute.getOwner().isRegularClass()) {
            Classe classe = ((Classe) attribute.getOwner());
            while (value == null && classe.hasParent()) {
                classe = classeRepository.getClasse(classe.getParent());
                Attribute inherited = classe.getAttributeOrNull(attribute.getName());
                if (inherited != null && equal(attribute.getDescription(), inherited.getDescription())) {
                    value = translateByCode(attributeDescriptionTranslationCode(inherited));
                } else {
                    break;
                }
            }
        }
        return firstNonNull(value, nullToEmpty(attribute.getDescription()));
    }

    @Override
    public String translateAttributeGroupDescription(EntryType owner, AttributeGroupInfo attributeGroup) {
        String value = translateByCode(attributeGroupDescriptionTranslationCode(owner, attributeGroup));
        String defaultValue = attributeGroup.getDescription();
        if (owner.isClasse()) {
            Classe classe = ((Classe) owner);
            while (value == null) {
                Classe parent = classe.hasParent() ? classeRepository.getClasse(classe.getParent()) : null;
                if (parent == null || !parent.hasAttributeGroup(attributeGroup.getName()) || !equal(parent.getAttributeGroup(attributeGroup.getName()).getDescription(), attributeGroup.getDescription())) {
                    break;
                } else {
                    value = translateByCode(attributeGroupDescriptionTranslationCode(owner, attributeGroup));
                    classe = parent;
                }
            }
        }
        return firstNonNull(value, nullToEmpty(defaultValue));
    }

    @Override
    public String translateExpr(String source) {
        Matcher matcher = Pattern.compile("[{]translate:[^}]*[}]", Pattern.DOTALL).matcher(source);
        if (matcher.find()) {
            StringBuffer stringBuffer = new StringBuffer();
            matcher.reset();
            while (matcher.find()) {
                String from = matcher.group();
                Matcher blockMatcher = Pattern.compile("[{]translate:([^:}]*)(:[^}]*)?[}]").matcher(from);
                checkArgument(blockMatcher.find());
                String code = checkNotBlank(blockMatcher.group(1));
                String defaultValue = emptyToNull(blockMatcher.group(2));
                String value = translateByCode(code);
                if (value == null) {
                    if (defaultValue != null) {
                        value = defaultValue.replaceFirst(":", "");
                    } else {
                        logger.warn(marker(), "translation not found for code =< {} > and user language =< {} >", code, languageService.getRequestLanguage());
                        value = format("missing_translation('%s')", code);
                    }
                }
                matcher.appendReplacement(stringBuffer, Matcher.quoteReplacement(value));
            }
            matcher.appendTail(stringBuffer);
            return stringBuffer.toString();
        } else {
            return source;
        }
    }

    @Nullable
    @Override
    public String translateByCode(String code) {
        checkNotBlank(code);
        String lang = languageService.getRequestLanguage();
        if (isBlank(lang)) {
            return null;
        } else {
            return translationRepository.getTranslationOrNull(code, lang);
        }
    }

    @Override
    public String getTranslationForCodeAndCurrentUser(String code) {
        return checkNotNull(translateByCode(code), format("unable to find translation for code =< %s > and user language =< %s >", code, languageService.getRequestLanguage()));
    }

    @Override
    public String getTranslationValueForCodeAndLang(String code, String lang) {
        return translationRepository.getTranslation(code, lang);
    }

    @Override
    public Map<String, String> getTranslationValueMapByLangForCode(String code) {
        return translationRepository.getTranslations(code).stream().collect(toMap(Translation::getLang, Translation::getValue));
    }

    @Override
    public PagedElements<Translation> getTranslations(@Nullable String filter, @Nullable Integer offset, @Nullable Integer limit) {
        return translationRepository.getTranslations(filter, offset, limit);
    }

    @Override
    public Translation setTranslation(String code, String lang, String value) {
        return translationRepository.setTranslation(code, lang, value);
    }

    @Override
    public void deleteTranslationIfExists(String code, String lang) {
        translationRepository.deleteTranslationIfExists(code, lang);
    }

    @Override
    public void deleteTranslations(String code) {
        translationRepository.deleteTranslations(code);
    }

    @Override
    public TranslationExportHelper exportHelper() {
        return new TranslationExportHelperImpl();
    }

    @Override
    public TranslationImportHelper importHelper() {
        return new TranslationImportHelperImpl();
    }

    private class TranslationExportHelperImpl extends TranslationImportExportCommons<TranslationExportHelperImpl> implements TranslationExportHelper {

        private boolean generateEmptyRecordsForAllObjects = false, includeRecordsWithoutDefault = false;
        private TranslationSection section;
        private Set<String> languages;

        @Override
        public TranslationExportHelper withLanguages(@Nullable Collection<String> languages) {
            this.languages = CmCollectionUtils.emptyToNull(set(CmCollectionUtils.nullToEmpty(languages)));
            return this;
        }

        @Override
        public TranslationExportHelper withEmptyRecordsForAllObjects(boolean generateEmptyRecordsForAllObjects) {
            this.generateEmptyRecordsForAllObjects = generateEmptyRecordsForAllObjects;
            return this;
        }

        @Override
        public TranslationExportHelper withIncludeRecordsWithoutDefault(boolean includeRecordsWithoutDefault) {
            this.includeRecordsWithoutDefault = includeRecordsWithoutDefault;
            return this;
        }

        @Override
        public TranslationExportHelper withSection(TranslationSection section) {
            this.section = section;
            return this;
        }

        @Override
        public List<String> getLanguages() {
            if (isNullOrEmpty(languages)) {
                languages = set(languageService.getEnabledLanguages());
            }
            return list(languages);
        }

        @Override
        public List<ExportRecord> exportRecords() {
            List<Translation> currentTranslations = translationRepository.getAllForLanguages(getLanguages());
            List<TranslationObject> candidateTranslations = objectsService.getAllTranslableObjectsAndDefaults();
            Map<String, Translation> currentTranslationsByLangCode = uniqueIndex(currentTranslations, t -> key(t.getLang(), t.getCode()));
            Map<String, String> defaultValues = map(candidateTranslations, TranslationObject::getCode, TranslationObject::getDefaultValue);

            Stream<String> codes;
            if (generateEmptyRecordsForAllObjects) {
                codes = setOf(String.class).accept(s -> {
                    candidateTranslations.stream().map(TranslationObject::getCode).forEach(s::add);
                    currentTranslations.stream().map(Translation::getCode).forEach(s::add);
                }).stream().sorted();
            } else {
                codes = currentTranslations.stream().map(Translation::getCode).sorted().distinct();
            }

            codes = filterCodesBySection(codes);

            if (!includeRecordsWithoutDefault) {
                codes = codes.filter(defaultValues::containsKey);
            }

            return codes.map(code -> {
                String defaultValue = nullToEmpty(defaultValues.get(code));
                Map<String, String> translations = getLanguages().stream()
                        .collect(toMap(identity(), lang -> Optional.ofNullable(currentTranslationsByLangCode.get(key(lang, code)))
                        .map(Translation::getValue).orElse(null)));
                return new ExportRecordImpl(code, defaultValue, translations);
            }).collect(toList());
        }

        private Stream<String> filterCodesBySection(Stream<String> codes) {
            switch (section) {
                case TS_ALL:
                    return codes;
                case TS_LOOKUPTYPES:
                    return codes.filter(c -> c.matches("^lookup[.].*"));
                case TS_MENU:
                    return codes.filter(c -> c.matches("^menuitem[.].*"));
                case TS_VIEWS:
                    return codes.filter(c -> c.matches("^view[.].*"));
                case TS_REPORTS:
                    return codes.filter(c -> c.matches("^report[.].*"));
                case TS_SEARCHFILTERS:
                    return codes.filter(c -> c.matches("^filter[.].*"));
                case TS_DOMAINS:
                    return codes.filter(c -> c.matches("^(domain|attributedomain|attributegroupdomain)[.].*"));
                case TS_CLASSES:
                    //Add widgets
                    return codes.filter(c -> {
                        Matcher matcher = Pattern.compile("^(class|attributegroupclass|attributeclass)[.]([^.]+)[.].*").matcher(c);
                        if (matcher.find()) {
                            Classe classe = classeRepository.getClasseOrNull(matcher.group(2));
                            return classe != null && !classe.isProcess();
                        }
                        return false;
                    });
                case TS_PROCESSES:
                    //Add widgets
                    return codes.filter(c -> {
                        Matcher matcher = Pattern.compile("^(class|attributegroupclass|attributeclass|activity)[.]([^.]+)[.].*").matcher(c);
                        if (matcher.find()) {
                            Classe classe = classeRepository.getClasseOrNull(matcher.group(2));
                            return classe != null && classe.isProcess();
                        }
                        return false;
                    });
                case TS_DASHBOARDS:
                    return codes.filter(c -> c.matches("^dashboard[.].*"));
                case TS_GROUPS:
                    return codes.filter(c -> c.matches("^role[.].*"));
                default:
                    throw new IllegalArgumentException("invalid section = " + section);
            }
        }

        @Override
        public DataHandler export() {
            try {
                List<ExportRecord> records = exportRecords();

                CsvPreference csvPreference = buildCsvPreference();
                StringWriter writer = new StringWriter();
                try (CsvListWriter csv = new CsvListWriter(writer, csvPreference)) {
                    csv.write(list("identifier", "description", "default").with(getLanguages()));
                    records.forEach(rethrowConsumer(r -> {
                        csv.write(list(r.getCode(), "", nullToEmpty(r.getDefault())).accept((line) -> getLanguages().stream().map(l -> nullToEmpty(r.getTranslationsByLanguage().get(l))).forEach(line::add)));
                    }));
                }
                return newDataHandler(writer.toString().getBytes(StandardCharsets.UTF_8), "text/csv", "translations.csv");
            } catch (IOException ex) {
                throw runtime(ex);
            }
        }

    }

    private static class ExportRecordImpl implements ExportRecord {

        private final String code;
        private final String defaultValue;
        private final Map<String, String> translations;

        public ExportRecordImpl(String code, @Nullable String defaultValue, Map<String, String> translations) {
            this.code = checkNotBlank(code);
            this.defaultValue = defaultValue;
            this.translations = map(translations).immutable();
        }

        @Override
        public String getCode() {
            return code;
        }

        @Override
        @Nullable
        public String getDefault() {
            return defaultValue;
        }

        @Override
        public Map<String, String> getTranslationsByLanguage() {
            return translations;
        }

    }

    private class TranslationImportHelperImpl extends TranslationImportExportCommons<TranslationImportHelperImpl> implements TranslationImportHelper {

        @Override
        public void importTranslations(DataHandler data) {
            try {
                CsvPreference csvPreference = buildCsvPreference();
                try (CsvListReader reader = new CsvListReader(new InputStreamReader(data.getInputStream()), csvPreference)) {
                    List<String> header = reader.read();
                    List<String> row;
                    long processed = 0, updated = 0;
                    logger.info("loading translations for languages = {}", Joiner.on(", ").join(header.subList(3, header.size())));
                    while ((row = reader.read()) != null) {
                        String code = checkNotBlank(row.get(0));
                        logger.trace("processing translation row {} with key =< {} > values = {}", processed++, code, row.subList(3, row.size()));
                        for (int i = 3; i < header.size(); i++) {
                            String lang = checkNotBlank(header.get(i)), value = nullToEmpty(row.get(i));
                            if (!equal(nullToEmpty(translationRepository.getTranslationOrNull(code, lang)), value)) {
                                if (!isBlank(value)) {
                                    logger.debug("set translation record with key =< {} > lang = {} value = {}", code, lang, value);
                                    translationRepository.setTranslation(code, lang, value);
                                    updated++;
                                } else {
                                    logger.trace("skip translation record with key =< {} > lang = {} due to blank value", code, lang);
                                }
                            } else {
                                logger.trace("skip translation record with key =< {} > lang = {} value = {} (not changed)", code, lang, value);
                            }
                        }
                    }
                    logger.info(marker(), "processed {} lines ( {} records ), updated {} records", processed, processed * (header.size() - 3), updated);
                }
            } catch (IOException ex) {
                throw runtime(ex);
            }
        }

    }

    private abstract class TranslationImportExportCommons<T extends TranslationImportExportCommons> {

        private String separator;

        public T withSeparator(String separator) {
            this.separator = separator;
            return (T) this;
        }

        protected CsvPreference buildCsvPreference() {
            if (isBlank(separator)) {
                separator = Character.valueOf((char) CsvPreference.STANDARD_PREFERENCE.getDelimiterChar()).toString();
            }
            return new CsvPreference.Builder(CsvPreference.STANDARD_PREFERENCE.getQuoteChar(), separator.charAt(0), CsvPreference.STANDARD_PREFERENCE.getEndOfLineSymbols()).build();
        }
    }

}
