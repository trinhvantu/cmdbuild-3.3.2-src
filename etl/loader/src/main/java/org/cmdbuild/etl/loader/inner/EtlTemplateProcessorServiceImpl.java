/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.cmdbuild.etl.loader.inner;

import org.cmdbuild.userconfig.UserPrefHelper;
import static com.google.common.base.Objects.equal;
import static com.google.common.base.Preconditions.checkArgument;
import static com.google.common.base.Preconditions.checkNotNull;
import static com.google.common.base.Predicates.not;
import static com.google.common.base.Strings.nullToEmpty;
import com.google.common.cache.Cache;
import com.google.common.cache.CacheBuilder;
import static com.google.common.collect.ImmutableList.toImmutableList;
import static com.google.common.collect.Iterables.transform;
import static com.google.common.collect.Maps.uniqueIndex;
import com.google.common.collect.Ordering;
import com.google.common.eventbus.EventBus;
import java.io.ByteArrayOutputStream;
import java.io.InputStreamReader;
import java.io.StringWriter;
import static java.lang.Math.round;
import static java.lang.String.format;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.ZonedDateTime;
import java.util.Collection;
import static java.util.Collections.emptyMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.TreeSet;
import java.util.concurrent.ArrayBlockingQueue;
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.function.Consumer;
import java.util.function.Function;
import static java.util.function.Function.identity;
import java.util.function.Supplier;
import static java.util.stream.Collectors.toList;
import static java.util.stream.Collectors.toSet;
import java.util.stream.Stream;
import javax.activation.DataSource;
import javax.annotation.Nullable;
import static org.apache.commons.codec.binary.Base64.encodeBase64;
import static org.apache.commons.codec.binary.StringUtils.newStringUsAscii;
import static org.apache.commons.io.FileUtils.byteCountToDisplaySize;
import org.apache.commons.io.input.BOMInputStream;
import static org.apache.commons.lang3.math.NumberUtils.isNumber;
import org.apache.commons.lang3.tuple.Pair;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import static org.apache.poi.ss.usermodel.CellType.BLANK;
import static org.apache.poi.ss.usermodel.CellType.BOOLEAN;
import static org.apache.poi.ss.usermodel.CellType.NUMERIC;
import static org.apache.poi.ss.usermodel.CellType.STRING;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.cmdbuild.auth.user.OperationUserSupplier;
import org.cmdbuild.classe.access.UserCardAccess;
import org.cmdbuild.classe.access.UserCardService;
import static org.cmdbuild.utils.lang.CmExceptionUtils.marker;
import org.cmdbuild.dao.beans.CMRelation;
import org.cmdbuild.dao.beans.Card;
import org.cmdbuild.common.beans.CardIdAndClassName;
import org.cmdbuild.dao.beans.CardImpl;
import org.cmdbuild.dao.beans.DatabaseRecord;
import org.cmdbuild.common.beans.IdAndDescription;
import org.cmdbuild.config.CoreConfiguration;
import org.cmdbuild.config.EtlConfiguration;
import static org.cmdbuild.common.beans.CardIdAndClassNameImpl.card;
import org.cmdbuild.dao.beans.IdAndDescriptionImpl;
import org.cmdbuild.dao.beans.RelationImpl;
import static org.cmdbuild.dao.constants.SystemAttributes.ATTR_CODE;
import static org.cmdbuild.dao.constants.SystemAttributes.ATTR_DESCRIPTION;
import static org.cmdbuild.dao.constants.SystemAttributes.ATTR_ID;
import static org.cmdbuild.dao.constants.SystemAttributes.ATTR_IDOBJ1;
import static org.cmdbuild.dao.constants.SystemAttributes.ATTR_IDOBJ2;
import static org.cmdbuild.dao.constants.SystemAttributes.ATTR_IDTENANT;
import org.cmdbuild.dao.core.q3.DaoService;
import static org.cmdbuild.dao.core.q3.QueryBuilder.EQ;
import org.cmdbuild.dao.entrytype.Attribute;
import org.cmdbuild.dao.entrytype.Classe;
import org.cmdbuild.dao.entrytype.Domain;
import org.cmdbuild.dao.entrytype.EntryType;
import static org.cmdbuild.dao.entrytype.attributetype.AttributeTypeName.FOREIGNKEY;
import static org.cmdbuild.dao.entrytype.attributetype.AttributeTypeName.LOOKUP;
import static org.cmdbuild.dao.entrytype.attributetype.AttributeTypeName.REFERENCE;
import static org.cmdbuild.dao.entrytype.attributetype.AttributeTypeName.TIMESTAMP;
import org.cmdbuild.dao.entrytype.attributetype.LookupAttributeType;
import org.cmdbuild.dao.postgres.q3.RefAttrHelperService;
import static org.cmdbuild.dao.utils.AttributeConversionUtils.rawToSystem;
import org.cmdbuild.data.filter.CmdbFilter;
import org.cmdbuild.etl.EtlException;
import org.cmdbuild.etl.loader.EtlTemplateColumnConfigImpl;
import org.cmdbuild.etl.loader.EtlProcessingResultDetailsImpl;
import static org.cmdbuild.etl.utils.EtlTemplateUtils.buildWorkbook;
import static org.cmdbuild.etl.utils.EtlTemplateUtils.getCsvPreference;
import org.cmdbuild.etl.utils.WorkbookInfo;
import static org.cmdbuild.etl.utils.XlsProcessingUtils.getRecordsFromXlsFile;
import static org.cmdbuild.etl.utils.XlsProcessingUtils.lazyRecordToString;
import org.cmdbuild.lookup.LookupService;
import org.cmdbuild.utils.date.CmDateUtils;
import static org.cmdbuild.utils.date.CmDateUtils.toDateTime;
import static org.cmdbuild.utils.date.CmDateUtils.toJavaDate;
import static org.cmdbuild.utils.date.CmDateUtils.toIsoTime;
import static org.cmdbuild.utils.io.CmIoUtils.countBytes;
import static org.cmdbuild.utils.io.CmIoUtils.newDataSource;
import static org.cmdbuild.utils.lang.CmCollectionUtils.list;
import static org.cmdbuild.utils.lang.CmCollectionUtils.set;
import static org.cmdbuild.utils.lang.CmConvertUtils.convert;
import static org.cmdbuild.utils.lang.CmConvertUtils.toBoolean;
import static org.cmdbuild.utils.lang.CmConvertUtils.toDouble;
import static org.cmdbuild.utils.lang.CmConvertUtils.toLong;
import static org.cmdbuild.utils.lang.CmExceptionUtils.lazyString;
import static org.cmdbuild.utils.lang.CmMapUtils.map;
import static org.cmdbuild.utils.lang.CmNullableUtils.getClassOfNullable;
import static org.cmdbuild.utils.lang.CmNullableUtils.isNullOrBlank;
import static org.cmdbuild.utils.lang.CmNullableUtils.isNullOrLtEqZero;
import static org.cmdbuild.utils.lang.CmPreconditions.checkNotBlank;
import static org.cmdbuild.utils.lang.CmStringUtils.mapDifferencesToLoggableString;
import static org.cmdbuild.utils.lang.CmStringUtils.mapToLoggableStringLazy;
import static org.cmdbuild.utils.lang.CmStringUtils.normalize;
import static org.cmdbuild.utils.lang.CmStringUtils.toStringNotBlank;
import static org.cmdbuild.utils.lang.CmStringUtils.toStringOrEmpty;
import static org.cmdbuild.utils.lang.LambdaExceptionUtils.rethrowConsumer;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Component;
import org.supercsv.io.CsvListReader;
import org.supercsv.io.CsvListWriter;
import org.supercsv.prefs.CsvPreference;
import org.cmdbuild.userconfig.UserPreferencesService;
import static org.cmdbuild.utils.date.CmDateUtils.toDate;
import static org.cmdbuild.utils.date.CmDateUtils.toTime;
import static org.cmdbuild.utils.lang.CmConvertUtils.toInt;
import static org.cmdbuild.utils.lang.CmExceptionUtils.exceptionToMessage;
import static org.cmdbuild.utils.lang.CmExceptionUtils.exceptionToUserMessage;
import org.cmdbuild.utils.lang.CmMapUtils.FluentMap;
import org.cmdbuild.utils.lang.CmNullableUtils;
import static org.cmdbuild.utils.lang.CmNullableUtils.isNotBlank;
import static org.cmdbuild.etl.utils.XlsProcessingUtils.dateFormatPatternToXls;
import static org.cmdbuild.utils.lang.CmNullableUtils.getClassNameOfNullable;
import static org.cmdbuild.etl.loader.EtlMergeMode.EM_LEAVE_MISSING;
import static org.cmdbuild.etl.loader.EtlFileFormat.EFF_CSV;
import static org.cmdbuild.etl.loader.EtlFileFormat.EFF_XLS;
import static org.cmdbuild.etl.loader.EtlFileFormat.EFF_XLSX;
import static org.cmdbuild.etl.loader.EtlFileFormat.EFF_OTHER;
import static org.cmdbuild.etl.loader.EtlMergeMode.EM_DELETE_MISSING;
import static org.cmdbuild.etl.loader.EtlMergeMode.EM_NO_MERGE;
import static org.cmdbuild.etl.loader.EtlMergeMode.EM_UPDATE_ATTR_ON_MISSING;
import org.cmdbuild.etl.loader.EtlTemplate;
import org.cmdbuild.etl.loader.EtlTemplateColumnConfig;
import static org.cmdbuild.etl.loader.EtlTemplateColumnMode.ETCM_DESCRIPTION;
import static org.cmdbuild.etl.loader.EtlTemplateColumnMode.ETCM_CODE;
import static org.cmdbuild.etl.loader.EtlTemplateColumnMode.ETCM_ID;
import static org.cmdbuild.etl.loader.EtlTemplateColumnMode.ETCM_IGNORE;
import org.cmdbuild.etl.loader.EtlProcessingResult;
import org.cmdbuild.etl.loader.EtlProcessingResultError;
import org.cmdbuild.etl.loader.EtlProcessingResultDetails;
import org.cmdbuild.etl.loader.EtlRecordInfo;
import org.cmdbuild.etl.loader.EtlTemplateFieldFormatConfig;
import static org.cmdbuild.etl.loader.EtlTemplateTarget.ET_CLASS;
import org.cmdbuild.etl.loader.EtlTemplateWithData;
import org.cmdbuild.gis.GisAttribute;
import org.cmdbuild.gis.GisService;
import org.cmdbuild.gis.GisValue;
import org.cmdbuild.gis.model.GisValueImpl;
import static org.cmdbuild.gis.utils.GisUtils.cmGeometryToPostgisSql;
import static org.cmdbuild.gis.utils.GisUtils.parseGeometry;
import org.cmdbuild.requestcontext.RequestContext;
import org.cmdbuild.requestcontext.RequestContextService;
import static org.cmdbuild.utils.io.CmIoUtils.getCharsetFromContentType;
import static org.cmdbuild.utils.io.CmIoUtils.getContentType;
import static org.cmdbuild.utils.io.CmIoUtils.setCharsetInContentType;
import static org.cmdbuild.utils.io.CmStreamProgressUtils.buildProgressListener;
import org.cmdbuild.utils.lang.CmConvertUtils;
import static org.cmdbuild.utils.lang.CmConvertUtils.serializeEnum;
import static org.cmdbuild.utils.lang.CmConvertUtils.toLongOrNull;
import static org.cmdbuild.utils.lang.CmExceptionUtils.runtime;
import static org.cmdbuild.utils.lang.CmExecutorUtils.shutdownQuietly;
import static org.cmdbuild.utils.lang.CmMapUtils.toImmutableMap;
import static org.cmdbuild.utils.lang.CmMapUtils.toMap;
import static org.cmdbuild.utils.lang.CmNullableUtils.isNotNullAndGtZero;
import static org.cmdbuild.utils.lang.CmNullableUtils.ltEqZeroToNull;
import static org.cmdbuild.utils.lang.CmObjectUtils.estimateObjectSizeBytes;
import static org.cmdbuild.utils.lang.CmPreconditions.checkNotNullAndGtZero;
import static org.cmdbuild.utils.lang.CmPreconditions.firstNotBlank;
import static org.cmdbuild.utils.lang.CmPreconditions.firstNotBlankOrNull;
import org.cmdbuild.utils.lang.CmStringUtils;
import static org.cmdbuild.utils.lang.KeyFromPartsUtils.key;
import static org.cmdbuild.utils.lang.LambdaExceptionUtils.rethrowFunction;
import org.slf4j.MDC;
import org.cmdbuild.etl.loader.EtlTemplateInlineProcessorService;
import static org.cmdbuild.etl.utils.XlsProcessingUtils.dateTimeFormatPatternToXls;
import org.cmdbuild.userconfig.DateAndFormatPreferences;
import org.cmdbuild.userconfig.DateAndFormatPreferencesImpl;
import org.cmdbuild.userconfig.UserPrefHelperImpl;
import static org.cmdbuild.utils.date.CmDateUtils.now;
import static org.cmdbuild.utils.date.ExtjsDateUtils.extjsDateTimeFormatToJavaDateTimeFormat;
import static org.cmdbuild.utils.lang.CmExecutorUtils.namedThreadFactory;
import static org.cmdbuild.utils.lang.EventBusUtils.logExceptions;
import static org.cmdbuild.utils.lang.CmExecutorUtils.safe;
import static org.cmdbuild.requestcontext.RequestContextUtils.isInterrupted;
import static org.cmdbuild.utils.lang.CmRuntimeUtils.hasEnoughFreeMemory;
import static org.cmdbuild.utils.lang.CmRuntimeUtils.memBytesToDisplaySize;

@Component
@Primary
public class EtlTemplateProcessorServiceImpl implements EtlTemplateInlineProcessorService {

    private final Logger logger = LoggerFactory.getLogger(getClass());

    public static final String IMPORT_RECORD_LINE_NUMBER = "CM_IMPORT_RECORD_LINE_NUMBER", CM_IMPORT_RECORD_ID = "CM_IMPORT_RECORD_ID";

    private final CoreConfiguration config;
    private final LookupService lookupService;
    private final UserCardService cardService;
    private final UserPreferencesService userPreferencesService;
    private final DaoService dao;
    private final GisService gis;
    private final RequestContextService requestContextService;
    private final OperationUserSupplier operationUser;
    private final RefAttrHelperService refAttrHelperService;
    private final EtlConfiguration etlConfiguration;

    public EtlTemplateProcessorServiceImpl(
            CoreConfiguration config,
            LookupService lookupService,
            UserCardService cardService,
            UserPreferencesService userPreferencesService,
            DaoService dao,
            GisService gis,
            RequestContextService requestContextService,
            OperationUserSupplier operationUser,
            RefAttrHelperService refAttrHelperService,
            EtlConfiguration etlConfiguration) {
        this.config = checkNotNull(config);
        this.lookupService = checkNotNull(lookupService);
        this.cardService = checkNotNull(cardService);
        this.userPreferencesService = checkNotNull(userPreferencesService);
        this.dao = checkNotNull(dao);
        this.gis = checkNotNull(gis);
        this.requestContextService = checkNotNull(requestContextService);
        this.operationUser = checkNotNull(operationUser);
        this.refAttrHelperService = checkNotNull(refAttrHelperService);
        this.etlConfiguration = checkNotNull(etlConfiguration);
    }

    @Override
    public EtlProcessingResult importDataWithTemplates(List<EtlTemplateWithData> templatesWithData) {
        try {
            logger.info("execute multi import operation with templates = {}", list(templatesWithData).map(t -> t.getTemplate().getCode()));
            ImportRegister register = new ImportRegister();
            List<ImportProcessor> helpers = list(templatesWithData).map(rethrowFunction(td -> buildImportProcessor(new ImportContext(td.getTemplate(), register, prepareData(td.getData()), td.getCallback()))));
            logger.info("prepare data");
            helpers.forEach(rethrowConsumer(ImportProcessor::prepareData));
            logger.info("create/update records");
            helpers.forEach(rethrowConsumer(ImportProcessor::createUpdateRecords));
            logger.info("handle missing/deleted records");
            helpers.forEach(rethrowConsumer(ImportProcessor::handleMissingRecords));
            EtlProcessingResult result = register.getAggregateResult();
            logger.info("completed import with templates = {} result: {}", list(templatesWithData).map(t -> t.getTemplate().getCode()), result.getResultDescription());
            return result;
        } catch (Exception ex) {
            throw new EtlException(ex, "import error");
        }
    }

    @Override
    public DataSource exportDataWithTemplate(EtlTemplate template) {
        try {
            logger.info("start data export for template = {}", template);
            checkNotNull(template, "invalid template: template is null");
            DataSource dataSource = buildExportProcessor(template).exportData();
            logger.info("completed export with template = {} output file = {} ({} {})", template, dataSource.getName(), byteCountToDisplaySize(countBytes(dataSource)), dataSource.getContentType());
            return dataSource;
        } catch (Exception ex) {
            throw new EtlException(ex, "export error with template = %s", template);
        }
    }

    @Override
    public EtlProcessingResult importDataWithTemplate(Object data, EtlTemplate template) {
        try {
            checkNotNull(template, "invalid template: template is null");
            checkNotNull(data, "invalid data: data is null");
            EtlProcessingResult result = buildImportProcessor(new ImportContext(template, new ImportRegister(), prepareData(data))).importData();
            logger.info("completed import with template = {} result: {}", template, result.getResultDescription());
            return result;
        } catch (Exception ex) {
            throw new EtlException(ex, "import error with template = %s", template);
        }
    }

    @Override
    public DataSource exportDataInline(List<? extends DatabaseRecord> data, EtlTemplate template) {
        try {
            return buildExportProcessor(template).exportData(data);
        } catch (Exception ex) {
            throw new EtlException(ex, "inline export error");
        }
    }

    @Override
    public <T extends DatabaseRecord> List<T> importDataInline(Object data, EntryType type, EtlTemplate template) {
        try {
            return (List) buildImportProcessor(new ImportContext(template, new ImportRegister(), prepareData(data))).importDataInline((Classe) type);
        } catch (Exception ex) {
            throw new EtlException(ex, "inline import error");
        }
    }

    private Object prepareData(Object data) {
        if (data instanceof List) {
            logger.info("load import data = LIST[{}]", ((List) data).size());
        } else {
            if (data instanceof String) {
                data = newDataSource((String) data, "text/plain");
            } else if (data instanceof byte[]) {
                data = newDataSource((byte[]) data, "application/octet-stream");
            } else if (data instanceof DataSource) {
                //nothing to do
            } else {
                throw new IllegalArgumentException(format("invalid data type =< %s >", getClassNameOfNullable(data)));
            }
            logger.info("load import data = {} {}", byteCountToDisplaySize(countBytes((DataSource) data)), getContentType((DataSource) data));
        }
        return data;
    }

    private class ImportContext {

        private final EtlTemplate template;
        private final ImportRegister register;
        private final Object data;
        private final Optional<Object> eventListener;

        public ImportContext(EtlTemplate template, ImportRegister register, Object data) {
            this(template, register, data, null);
        }

        public ImportContext(EtlTemplate template, ImportRegister register, Object data, @Nullable Object callback) {
            this.template = checkNotNull(template);
            this.register = checkNotNull(register);
            this.data = checkNotNull(data);
            eventListener = Optional.ofNullable(callback);
        }

        public EtlTemplate getTemplate() {
            return template;
        }

        public ImportRegister getRegister() {
            return register;
        }

        public Object getData() {
            return data;
        }

        public Optional<Object> getEventListener() {
            return eventListener;
        }

    }

    private ExportProcessor buildExportProcessor(EtlTemplate template) throws Exception {
        switch (template.getFileFormat()) {
            case EFF_CSV:
                return new CsvExportProcessor(template);
            case EFF_XLS:
            case EFF_XLSX:
                return new XlsExportProcessor(template);
            default:
                throw new EtlException("unsupported template file format = %s", template.getFileFormat());
        }
    }

    private ImportProcessor buildImportProcessor(ImportContext context) throws Exception {
        switch (context.getTemplate().getFileFormat()) {
            case EFF_CSV:
                return new CsvImportProcessor(context);
            case EFF_XLS:
            case EFF_XLSX:
                return new XlsImportProcessor(context);
            case EFF_OTHER:
            case EFF_DATABASE:
            case EFF_IFC:
            case EFF_CAD:
                return new BeanImportProcessor(context);
            default:
                throw new EtlException("unsupported template file format = %s", context.getTemplate().getFileFormat());
        }
    }

    private class CsvImportProcessor extends ImportProcessor {

        public CsvImportProcessor(ImportContext context) {
            super(context);
            checkArgument(equal(template.getFileFormat(), EFF_CSV));
        }

        @Override
        protected List<Map<String, Object>> getRecords(DataSource data) throws Exception {
            List<Map<String, Object>> list = list();
            String charset = firstNotBlank(template.getCharset(), getCharsetFromContentType(data.getContentType()), userPreferencesService.getUserPreferences().getPreferredFileCharset());
            logger.debug("using charset =< {} >", charset);
            try (CsvListReader csvReader = new CsvListReader(new InputStreamReader(new BOMInputStream(data.getInputStream()), charset), getCsvPreference(template))) {
                List<String> line;
                int lineNumber = -1;
                while ((line = csvReader.read()) != null) {
                    lineNumber++;
                    if (lineNumber == 0 && template.getUseHeader()) {
                        checkHeader(line);
                    } else {
                        try {
                            list.add(parseLine(line).with(IMPORT_RECORD_LINE_NUMBER, lineNumber));
                        } catch (Exception ex) {
                            throw new EtlException(ex, "error while parsing line = %s", lineNumber);
                        }
                    }
                }
            }
            logger.debug("loaded {} records from file", list.size());
            return list;
        }

        private FluentMap<String, Object> parseLine(List<String> line) {
            checkArgument(line.size() >= columns.size(), "invalid line size = %s (expected size = %s)", line.size(), columns.size());
            Iterator<String> iterator = line.iterator();
            return (FluentMap) map().accept(m -> columns.stream().forEach((c) -> {
                Object value = iterator.next();
                if (c.doNotIgnoreColumn()) {
                    m.put(c.getAttributeName(), value);
                }
            }));
        }

    }

    private class BeanImportProcessor extends ImportProcessor {

        public BeanImportProcessor(ImportContext context) {
            super(context);
        }

        @Override
        protected List<Map<String, Object>> getRecords(DataSource data) throws Exception {
            throw new UnsupportedOperationException();
        }

    }

    private class XlsImportProcessor extends ImportProcessor {

        private final int headerRow, dataRow, columnOffset;

        public XlsImportProcessor(ImportContext context) {
            super(context);
            checkArgument(set(EFF_XLS, EFF_XLSX).contains(template.getFileFormat()));
            headerRow = isNullOrLtEqZero(template.getHeaderRow()) ? 0 : template.getHeaderRow() - 1;
            dataRow = isNullOrLtEqZero(template.getDataRow()) ? (template.getUseHeader() ? 1 : 0) : template.getDataRow() - 1;
            columnOffset = isNullOrLtEqZero(template.getFirstCol()) ? 0 : template.getFirstCol() - 1;
            logger.debug("start import with header row = {} data row = {} column offset = {}", headerRow, dataRow, columnOffset);
        }

        @Override
        protected List<Map<String, Object>> getRecords(DataSource data) throws Exception {
            List<List<Object>> rawRecords = getRecordsFromXlsFile(data, template.getFileFormat(), template.getSkipUnknownColumns() ? null : columns.size(), columnOffset);
            List<Map<String, Object>> list = list();
            for (int rowIndex = 0; rowIndex < rawRecords.size(); rowIndex++) {
                List<Object> rawRecord = rawRecords.get(rowIndex);
                if (rowIndex == headerRow && template.getUseHeader()) {
                    logger.debug("check header row = {}", rowIndex);
                    checkHeader(rawRecord);
                } else if (rowIndex >= dataRow) {
                    try {
                        logger.trace("parse data row = {}", rowIndex);
                        list.add(parseRow(rawRecord).with(IMPORT_RECORD_LINE_NUMBER, rowIndex + 1));
                    } catch (Exception ex) {
                        throw new EtlException(ex, "error while parsing line = %s", rowIndex);
                    }
                } else {
                    logger.trace("skipping row = {}", rowIndex);
                }
            }
            logger.debug("loaded {} records from file", list.size());
            return list;
        }

        private FluentMap<String, Object> parseRow(List<Object> row) {
            return (FluentMap) map().accept(m -> {
                for (int i = 0; i < columns.size(); i++) {
                    Object value = i < row.size() ? row.get(i) : null;
                    if (columns.get(i).doNotIgnoreColumn()) {
                        m.put(columns.get(i).getAttributeName(), value);
                    }
                }
            });
        }

    }

    private class ImportRegister {

        private final ZonedDateTime begin = now();
        private final Map<String, ImportRegisterClassInfo> infoByClass = map();
        private final Map<String, CardIdAndClassName> processedRecordsByRecordId = map();

        public ImportRegisterClassInfo getInfoByClass(String classId) {
            ImportRegisterClassInfo info = infoByClass.get(classId);
            if (info == null) {
                infoByClass.put(classId, info = new ImportRegisterClassInfo(classId) {

                    @Override
                    public void addUnmodifiedRecord(Map<String, Object> record, long id) {
                        super.addUnmodifiedRecord(record, id);
                        addProcessedRecord(record, classId, id);
                    }

                    @Override
                    public void addModifiedRecord(Map<String, Object> record, long id) {
                        super.addModifiedRecord(record, id);
                        addProcessedRecord(record, classId, id);
                    }

                    @Override
                    public void addCreatedRecord(Map<String, Object> record, long id) {
                        super.addCreatedRecord(record, id);
                        addProcessedRecord(record, classId, id);
                    }

                });
            }
            return info;
        }

        public EtlProcessingResult getAggregateResult() {
            int created = 0, modified = 0, unmodified = 0, deleted = 0, processed = 0;
            List<EtlProcessingResultError> errors = list();
            for (ImportRegisterClassInfo info : infoByClass.values()) {
                created += info.getCreatedCount();
                modified += info.getModifiedCount();
                unmodified += info.getUnmodifiedCount();
                deleted += info.getDeletedCount();
                processed += info.getProcessedCount();
                info.getErrorsOrdered().forEach(errors::add);
            }
            return new EtlProcessingResultImpl(created, modified, unmodified, deleted, processed, errors).withTime(begin, now());
        }

        private void addProcessedRecord(Map<String, Object> record, String classId, long id) {
            if (isNotBlank(record.get(CM_IMPORT_RECORD_ID))) {
                processedRecordsByRecordId.put(toStringNotBlank(record.get(CM_IMPORT_RECORD_ID)), card(classId, id));
            }
        }
    }

    private class ImportRegisterClassInfo {

        protected final Set<Long> createdRecords = set(), modifiedRecords = set(), deletedRecords = set(), unmodifiedRecords = set(), processedRecords = set();
        protected final List<EtlProcessingResultError> errors = list();

        protected final String classId;

        public ImportRegisterClassInfo(String classId) {
            this.classId = checkNotBlank(classId);
        }

        public void addCreatedRecord(Map<String, Object> record, long id) {
            createdRecords.add(id);
            processedRecords.add(id);
        }

        public void addModifiedRecord(Map<String, Object> record, long id) {
            modifiedRecords.add(id);
            processedRecords.add(id);
        }

        public void addUnmodifiedRecord(Map<String, Object> record, long id) {
            unmodifiedRecords.add(id);
            processedRecords.add(id);
        }

        public void addDeletedRecord(long id) {
            deletedRecords.add(id);
        }

        public void addError(EtlProcessingResultError error) {
            errors.add(error);
        }

        public Collection<Long> getCreatedRecords() {
            return createdRecords;
        }

        public Collection<Long> getModifiedRecords() {
            return modifiedRecords;
        }

        public Collection<Long> getUnmodifiedRecords() {
            return unmodifiedRecords;
        }

        public Collection<Long> getDeletedRecords() {
            return deletedRecords;
        }

        public List<EtlProcessingResultError> getErrors() {
            return errors;
        }

        public Stream<EtlProcessingResultError> getErrorsOrdered() {
            return getErrors().stream().sorted(Ordering.natural().onResultOf(e -> e.getRecordIndex()));
        }

        public int getCreatedCount() {
            return createdRecords.size();
        }

        public int getModifiedCount() {
            return modifiedRecords.size();
        }

        public int getUnmodifiedCount() {
            return unmodifiedRecords.size();
        }

        public int getDeletedCount() {
            return deletedRecords.size();
        }

        public boolean hasProcessedRecord(long id) {
            return processedRecords.contains(id);
        }

        public boolean hasErrors() {
            return !errors.isEmpty();
        }

        public int getProcessedCount() {
            return processedRecords.size();
        }

        public EtlProcessingResult toProcessingResult(boolean includeDetails) {
            EtlProcessingResultDetails details = includeDetails ? new EtlProcessingResultDetailsImpl(getCreatedRecords(), getModifiedRecords(), getDeletedRecords()) : null;
            return new EtlProcessingResultImpl(getCreatedCount(), getModifiedCount(), getUnmodifiedCount(), getDeletedCount(), getProcessedCount(), getErrorsOrdered().collect(toImmutableList()), details);
        }

    }

    private abstract class BaseProcessor {

        protected final EventBus eventBus = new EventBus(logExceptions(logger));
        protected final DateAndFormatPreferences userPreferences = userPreferencesService.getUserPreferences(), templatePreferences;
        protected final EtlTemplate template;

        protected BaseProcessor(EtlTemplate template) {
            this.template = checkNotNull(template);
            templatePreferences = buildPreferences(userPreferences, template);
        }

        protected UserPrefHelper getHelper(EtlTemplateColumnConfig column) {//TODO cache this
            return new UserPrefHelperImpl(buildPreferences(templatePreferences, column));
        }

    }

    private DateAndFormatPreferences buildPreferences(DateAndFormatPreferences inner, EtlTemplateFieldFormatConfig config) {
        return DateAndFormatPreferencesImpl.copyOf(inner).accept(c -> {
            if (config.hasDecimalSeparator()) {
                c.withDecimalSeparator(config.getDecimalSeparator());
            }
            if (config.hasThousandsSeparator()) {
                c.withNumberGroupingSeparator(config.getThousandsSeparator());
            }
            if (etlConfiguration.getThousandsSeparator() != null) {
                c.withNumberGroupingSeparator(etlConfiguration.getThousandsSeparator());
            }
            if (config.hasDateFormat()) {
                c.withDateFormat(extjsDateTimeFormatToJavaDateTimeFormat(config.getDateFormat()));
            }
            if (config.hasTimeFormat()) {
                c.withTimeFormat(extjsDateTimeFormatToJavaDateTimeFormat(config.getTimeFormat()));
            }
            if (config.hasDateTimeFormat()) {
                c.withDateTimeFormat(extjsDateTimeFormatToJavaDateTimeFormat(config.getDateTimeFormat()));
            }
        }).build();
    }

    private abstract class ImportProcessor extends BaseProcessor {

        protected final ImportRegisterClassInfo info;
        protected final ImportRegister register;
        protected final List<EtlTemplateColumnConfig> columns;
        protected EntryTypeHelper entryTypeHelper;
        protected Object data;
        protected boolean hasLineNumber = false;
        protected final List<Pair<RecordReadyForImport, EtlRecordInfo>> batchInsert = list();
        protected final boolean enablebatchInsert, alwaysHandleMissingRecords;
        private final Cache<String, Optional<IdAndDescription>> referenceHelperCache = CacheBuilder.newBuilder().maximumSize(10000).build();
        protected final Map<String, Object> defaults;
        protected final ZonedDateTime begin = now();

        public ImportProcessor(ImportContext context) {
            super(context.getTemplate());
            checkArgument(template.isImportTemplate(), "invalid template: this is not an import template");
            columns = list(template.getColumns());
            register = context.getRegister();
            alwaysHandleMissingRecords = template.getAlwaysHandleMissingRecords();
            info = context.getRegister().getInfoByClass(template.getTargetName());
            data = context.getData();
            defaults = template.getColumns().stream().filter(EtlTemplateColumnConfig::hasDefault).collect(toImmutableMap(EtlTemplateColumnConfig::getAttributeName, EtlTemplateColumnConfig::getDefault));
            enablebatchInsert = equal(template.getTargetType(), ET_CLASS) && config.isImportBatchInsertEnabled();//TODO handle domain also
            if (enablebatchInsert) {
                checkNotNullAndGtZero(config.getImportBatchInsertMaxSize(), "invalid batch size");
                logger.debug("batch insert enabled = {} (batch size = {})", enablebatchInsert, config.getImportBatchInsertMaxSize());
            }
            context.getEventListener().ifPresent(eventBus::register);
        }

        private CmdbFilter getFilter() {
            return template.getFilter().mapValues(map(v -> register.processedRecordsByRecordId.containsKey(v) ? register.processedRecordsByRecordId.get(v).getId().toString() : v));
        }

        public List<? extends DatabaseRecord> importDataInline(Classe entryType) throws Exception {
            checkArgument(equal(template.getMergeMode(), EM_NO_MERGE), "invalid templat merge mode for inline import, required no_merge");
            entryTypeHelper = new ClassHelper(entryType);
            return list(prepareData()).map(r -> entryTypeHelper.prepareRecord(r, true, false).getRecord());
        }

        public EtlProcessingResult importData() throws Exception {
            createUpdateRecords(true, true);
            handleMissingRecords();
            return getResult().withTime(begin, now());
        }

        public void createNewRecords() throws Exception {
            createUpdateRecords(true, false);
        }

        public void updateExistingRecords() throws Exception {
            createUpdateRecords(false, true);
        }

        public void createUpdateRecords() throws Exception {
            createUpdateRecords(true, true);
        }

        private void createUpdateRecords(boolean create, boolean update) throws Exception {
            List<Map<String, Object>> rawRecords = prepareData();
            prepareHelper();
            int size = rawRecords.size();
            logger.info("load {} records (create = {}, update = {})", size, create, update);
            Consumer<Long> processProgressListener = size > 100 ? buildProgressListener(size, (e) -> logger.info("import progress: {}", e.getProgressDescriptionDetailed())) : e -> {
            };

            Set<String> keys = set();
            String mdcCmId = MDC.get("cm_id");//TODO improve mdc copy
            RequestContext requestContext = requestContextService.getRequestContext();

            int threadCount = Runtime.getRuntime().availableProcessors();

            ExecutorService executor = Executors.newFixedThreadPool(threadCount, namedThreadFactory(getClass()));

            List<BlockingQueue<Pair<EtlRecordInfo, RecordReadyForImport>>> queues = list();

            for (int i = 0; i < threadCount; i++) {
                int threadNumber = i;
                BlockingQueue<Pair<EtlRecordInfo, RecordReadyForImport>> queue = new ArrayBlockingQueue<>(1000);
                queues.add(queue);
                executor.submit(safe(() -> {
                    MDC.put("cm_type", "req");
                    MDC.put("cm_id", format("%s:%s", mdcCmId, threadNumber));//TODO improve mdc copy
                    requestContextService.initCurrentRequestContext("import thread " + threadNumber, requestContext);
                    logger.debug("start thread {}/{}", threadNumber, threadCount);
                    for (int recordNumber = threadNumber; recordNumber < size; recordNumber += threadCount) {
                        if (Thread.currentThread().isInterrupted()) {
                            logger.warn("thread {}/{} is interrupted, shutting down", threadNumber, threadCount);
                            return;
                        }
                        Map<String, Object> fileRecord = rawRecords.get(recordNumber);
                        int recordLineNumber;
                        if (hasLineNumber) {
                            recordLineNumber = toInt(fileRecord.get(IMPORT_RECORD_LINE_NUMBER));
                            fileRecord = map(fileRecord).withoutKey(IMPORT_RECORD_LINE_NUMBER);
                        } else {
                            recordLineNumber = recordNumber;
                        }
                        EtlRecordInfo recordInfo = new EtlRecordInfoImpl(recordNumber, recordLineNumber, fileRecord);
                        Pair<EtlRecordInfo, RecordReadyForImport> res;
                        try {
                            RecordReadyForImport recordReadyForImport = entryTypeHelper.prepareRecord(fileRecord, create, update);
                            res = Pair.of(recordInfo, recordReadyForImport);
                        } catch (Exception ex) {
                            handleRecordError(ex, recordInfo);
                            res = Pair.of(recordInfo, null);
                        }
                        queue.put(res);
                    }
                    logger.debug("completed work for thread {}/{}", threadNumber, threadCount);
                }));
            }
            for (int j = 0; j < size; j++) {
                Pair<EtlRecordInfo, RecordReadyForImport> item = queues.get(j % threadCount).take();
                if (isInterrupted()) {
                    logger.warn("request process is interrupted, terminate import operation");
                    break;
                }
                try {
                    if (item.getRight() != null) {
                        try {
                            if (isMergeEnabled()) {
                                checkArgument(keys.add(nullToEmpty(item.getRight().getKey())), "invalid record: duplicate key =< %s >", item.getRight().getKey());
                            }
                        } catch (Exception ex) {
                            handleRecordError(ex, item.getLeft());
                            continue;
                        }
                        if (item.getRight().isCreate()) {
                            if (enablebatchInsert) {
                                addBatchRecord(item.getRight(), item.getLeft());
                            } else {
                                processBatchCreate(item.getRight(), item.getLeft());
                            }
                        } else if (item.getRight().isUpdate()) {
                            item.getRight().doUpdate();
                        }
                    }
                } finally {
                    processProgressListener.accept((long) j + 1);
                }
            }
            shutdownQuietly(executor);
            processBatchCreate();
        }

        private void prepareHelper() {
            if (entryTypeHelper == null) {
                entryTypeHelper = getTarget(template);
            }
        }

        private boolean isMergeEnabled() {
            switch (template.getMergeMode()) {
                case EM_NO_MERGE:
                    return false;
                default:
                    return true;
            }
        }

        private void addBatchRecord(RecordReadyForImport recordReadyForImport, EtlRecordInfo recordInfo) {
            batchInsert.add(Pair.of(recordReadyForImport, recordInfo));
            if (batchInsert.size() >= config.getImportBatchInsertMaxSize()) {
                processBatchCreate();
            }
        }

        private synchronized void handleRecordError(Exception ex, EtlRecordInfo recordInfo) {
            logger.warn(marker(), "error loading record = {}", recordInfo, ex);
            info.addError(new EtlProcessingResultErrorImpl(recordInfo, exceptionToUserMessage(ex), exceptionToMessage(ex)));
        }

        private void processBatchCreate() {
            if (!batchInsert.isEmpty()) {
                logger.debug("processing batch insert of {} records", batchInsert.size());
                try {
                    List<Long> ids = dao.createBatch((List) list(batchInsert).map(p -> p.getLeft().getRecord()));
                    for (int i = 0; i < batchInsert.size(); i++) {
                        batchInsert.get(i).getLeft().postCreate(ids.get(i), batchInsert.get(i).getLeft().getRecord(), batchInsert.get(i).getRight().getRawRecord());
                    }
                } catch (Exception ex) {
                    logger.warn("batch record import error, retry record by record", ex);
                    batchInsert.forEach(p -> processBatchCreate(p.getLeft(), p.getRight()));
                }
                batchInsert.clear();
            }
        }

        private void processBatchCreate(RecordReadyForImport record, EtlRecordInfo recordInfo) {
            try {
                record.postCreate(dao.createOnly(record.getRecord()), record.getRecord(), recordInfo.getRawRecord());
            } catch (Exception ex) {
                handleRecordError(ex, recordInfo);
            }
        }

        public void handleMissingRecords() throws Exception {
            if (isInterrupted()) {
                logger.warn(marker(), "process was interrupted, skipping missing records processing");
            } else {
                prepareData();
                prepareHelper();
                if (template.hasMergeMode(EM_DELETE_MISSING, EM_UPDATE_ATTR_ON_MISSING)) {
                    if (info.hasErrors() && !alwaysHandleMissingRecords) {
                        logger.warn(marker(), "import has errors, skip processing of missing records");
                    } else if (info.getProcessedCount() == 0 && !alwaysHandleMissingRecords) {
                        logger.warn(marker(), "import has processed 0 records, skip processing of missing records");
                    } else {
                        logger.debug("handle missing records");
                        entryTypeHelper.handleMissingRecords();
                    }
                }
            }
        }

        public EtlProcessingResult getResult() {
            return info.toProcessingResult(true);
        }

        private List<Map<String, Object>> prepareData() throws Exception {
            if (data instanceof DataSource) {
                logger.info("read source records");
                data = getRecords((DataSource) data).stream()
                        .filter(r -> !template.getColumns().stream().filter(EtlTemplateColumnConfig::doNotIgnoreColumn).map(EtlTemplateColumnConfig::getAttributeName).map(r::get).allMatch(CmNullableUtils::isNullOrEmpty))
                        .collect(toImmutableList());
                hasLineNumber = true;
            }
            return (List) data;
        }

        protected void checkHeader(List<? extends Object> row) {
            logger.trace("check header row data = {}", lazyRecordToString(row));//TODO improve row debug dump
            List<String> rawLine = list(transform(row, s -> toStringOrEmpty(s).trim())),
                    expected = list(transform(columns, EtlTemplateColumnConfig::getColumnName)),
                    lineToCheck = rawLine;
            if (template.getSkipUnknownColumns()) {
                lineToCheck = list(lineToCheck).without(not(expected::contains));
            }
            if (lineToCheck.size() > columns.size()) {
                lineToCheck = lineToCheck.subList(0, columns.size());
            }
            if (template.getIgnoreColumnOrder()) {
                checkArgument(lineToCheck.size() == columns.size() && equal(set(lineToCheck), set(expected)), "invalid header row: expected (in any order) = %s but found = %s", new TreeSet(expected), rawLine);
                reorderColumnConfigs(rawLine);
                logger.debug("actual column order = {}", list(transform(columns, EtlTemplateColumnConfig::getColumnName)));
            } else {
                checkArgument(equal(lineToCheck, expected), "invalid header row: expected (in this order) = %s but found = %s", expected, rawLine);
            }
            logger.debug("header is ok");
        }

        protected void reorderColumnConfigs(List<String> colHeaders) {
            Map<String, EtlTemplateColumnConfig> configsByColumnHeader = uniqueIndex(template.getColumns(), EtlTemplateColumnConfig::getColumnName);
            columns.clear();
            colHeaders.stream().map(c -> {
                EtlTemplateColumnConfig col = configsByColumnHeader.get(c);
                if (template.getSkipUnknownColumns() && col == null) {
                    col = EtlTemplateColumnConfigImpl.builder().withMode(ETCM_IGNORE).build();
                }
                return checkNotNull(col, "config not found for column header =< %s >", c);
            }).forEach(columns::add);
        }

        @Nullable
        private <T> T convertValueToSystem(String attributeName, @Nullable Object value) {
            String columnName = "<undefined>";
            try {
                Attribute attribute = entryTypeHelper.getEntryType().getAttribute(attributeName);
                EtlTemplateColumnConfig columnConfig = template.getColumnByAttrName(attributeName);
                columnName = columnConfig.getColumnName();
                T converted = convertValueToSystem(attribute, columnConfig, value);
                if (attribute.isMandatory()) {
                    checkArgument(isNotBlank(converted), "CM: missing value for required attr = %s", attribute.getName());
                }
                return converted;
            } catch (Exception ex) {
                throw new EtlException(ex, "error importing value for attribute =< %s > column =< %s > value =< %s >", attributeName, columnName, value);
            }
        }

        @Nullable
        private <T> T convertValueToSystem(Attribute attribute, EtlTemplateColumnConfig columnConfig, @Nullable Object value) {
            if (attribute.getOwner().isDomain() && set(ATTR_IDOBJ1, ATTR_IDOBJ2).contains(attribute.getName())) {
                Classe target;
                switch (attribute.getName()) {
                    case ATTR_IDOBJ1:
                        target = ((Domain) attribute.getOwner()).getSourceClass();
                        break;
                    case ATTR_IDOBJ2:
                        target = ((Domain) attribute.getOwner()).getTargetClass();
                        break;
                    default:
                        throw new IllegalArgumentException("unsupported attribute = " + attribute);
                }
                IdAndDescription card = processRefValue(target, columnConfig, value);
                value = card == null ? null : card.getId();
            } else {
                switch (attribute.getType().getName()) {
                    case REFERENCE:
                    case FOREIGNKEY:
                        if (isNullOrBlank(value)) {
                            return null;
                        } else {
                            value = processRefValue(refAttrHelperService.getTargetClassForAttribute(attribute), columnConfig, value);
                        }
                        break;
                    case LOOKUP:
                        if (isNullOrBlank(value)) {
                            return null;
                        } else {
                            String lookupType = attribute.getType().as(LookupAttributeType.class).getLookupTypeName();
                            switch (columnConfig.getMode()) {
                                case ETCM_CODE:
                                    value = checkNotNull(lookupService.getLookupByTypeAndCodeOrNull(lookupType, toStringNotBlank(value)), "CM: lookup not found for code =< %s >", value);
                                    break;
                                case ETCM_DESCRIPTION:
                                    value = checkNotNull(lookupService.getLookupByTypeAndDescriptionOrNull(lookupType, toStringNotBlank(value)), "CM: lookup not found for description =< %s >", value);
                                    break;
                                case ETCM_ID:
                                    value = checkNotNull(lookupService.getLookupOrNull(toLong(value)), "CM: lookup not found for id =< %s >", value);
                                    break;
                                default:
                                    throw new EtlException("invalid column mode = %s for attr = %s", columnConfig.getMode(), attribute);
                            }
                        }
                        break;
                    case TIMESTAMP:
                        value = getHelper(columnConfig).parseDateTime(value);
                        break;
                    case DATE:
                        value = getHelper(columnConfig).parseDate(value);
                        break;
                    case TIME:
                        value = getHelper(columnConfig).parseTime(value);
                        break;
                    case DECIMAL:
                    case DOUBLE:
                    case FLOAT:
                    case INTEGER:
                    case LONG:
                        if (value instanceof String) {
                            value = getHelper(columnConfig).parseNumber((String) value);
                        }
                }
            }
            value = rawToSystem(attribute, value);
            return (T) value;
        }

        private IdAndDescription processRefValue(Classe target, EtlTemplateColumnConfig columnConfig, Object value) {
            IdAndDescription res;
            if (equal(template.getTargetName(), target.getName())) {
                res = doProcessRefValue(target, columnConfig, value);
            } else {
                try {
                    res = referenceHelperCache.get(key(target.getName(), columnConfig.getMode(), toStringOrEmpty(value)), () -> Optional.ofNullable(doProcessRefValue(target, columnConfig, value)).map(c -> IdAndDescriptionImpl.copyOf(c))).orElse(null);
                } catch (ExecutionException ex) {
                    throw runtime(ex);
                }
            }
            return checkNotNull(res, "CM: card not found for type = %s,  %s =< %s >", target.getName(), serializeEnum(columnConfig.getMode()), value);
        }

        @Nullable
        private IdAndDescription doProcessRefValue(Classe target, EtlTemplateColumnConfig columnConfig, Object value) {
            switch (columnConfig.getMode()) {
                case ETCM_CODE:
                    return dao.select(ATTR_ID).from(target).where(ATTR_CODE, EQ, toStringNotBlank(value)).getCardOrNull();
                case ETCM_DESCRIPTION:
                    return dao.select(ATTR_ID).from(target).where(ATTR_DESCRIPTION, EQ, toStringOrEmpty(value)).getCardOrNull();
                case ETCM_ID:
                    return dao.getCardOrNull(target, toLong(value));
//                    return dao.select(ATTR_ID).from(target).where(ATTR_ID, EQ, toLong(value)).getCardOrNull(); CHECK THIS
                case ETCM_RECORDID:
                    return register.processedRecordsByRecordId.get(toStringNotBlank(value));
                default:
                    throw new EtlException("invalid column mode = %s", columnConfig.getMode());
            }
        }

        protected abstract List<Map<String, Object>> getRecords(DataSource data) throws Exception;

        private EntryTypeHelper getTarget(EtlTemplate template) {
            switch (template.getTargetType()) {
                case ET_CLASS:
                    return new ClassHelper();
                case ET_DOMAIN:
                    return new DomainHelper();
                default:
                    throw new EtlException("unsupported template target type = %s", template.getTargetType());
            }
        }

        private abstract class EntryTypeHelper {

            public abstract EntryType getEntryType();

            public abstract RecordReadyForImport prepareRecord(Map<String, Object> record, boolean create, boolean update);

            public abstract void handleMissingRecords();

            protected void handleMissingRecordSafe(long cardId) {
                try {
                    handleMissingRecord(cardId);
                } catch (Exception ex) {
                    logger.warn(marker(), "error processing missing record = {}", cardId, ex);
                    info.addError(new EtlProcessingResultErrorImpl(0l, 0l, map(ATTR_ID, cardId), exceptionToUserMessage(ex), exceptionToMessage(ex)));                    //TODO check record info (??)
                }
            }

            protected void handleMissingRecord(long cardId) {
                switch (template.getMergeMode()) {
                    case EM_DELETE_MISSING:
                        logger.debug("delete missing record = {}", cardId);
                        dao.delete(getEntryType(), cardId);
                        info.addDeletedRecord(cardId);
                        break;
                    case EM_UPDATE_ATTR_ON_MISSING:
                        String attributeName = checkNotBlank(template.getAttributeNameForUpdateAttrOnMissing());
                        Attribute attribute = getEntryType().getAttribute(attributeName);
                        EtlTemplateColumnConfig colConfig = EtlTemplateColumnConfigImpl.builder().withAttributeName(attributeName).withColumnName("DUMMY").accept(c -> {
                            if (attribute.isOfType(REFERENCE, FOREIGNKEY, LOOKUP)) {
                                if (isNumber(template.getAttributeValueForUpdateAttrOnMissing())) {
                                    c.withMode(ETCM_ID);
                                } else {
                                    c.withMode(ETCM_CODE);
                                }
                            }
                        }).build();
                        Object value = convertValueToSystem(attribute, colConfig, template.getAttributeValueForUpdateAttrOnMissing());
                        DatabaseRecord dbRecord = dao.getRecord(getEntryType(), cardId);
                        logger.debug("update missing record = {} set attr = {} to value = {}", dbRecord, attributeName, value);
                        updateRecord(dbRecord, attributeName, value);
                        info.addDeletedRecord(dbRecord.getId());//TODO mark deleted only if not already deleted (add filter on query for missing records)
                        break;
                    case EM_LEAVE_MISSING:
                        break;//do nothing 
                    default:
                        throw new EtlException("unsupported merge mode for missing record processing = %s", template.getMergeMode());
                }
            }

            protected abstract void updateRecord(DatabaseRecord dbRecord, String attributeName, Object value);

        }

        private class ClassHelper extends EntryTypeHelper {

            private final Classe classe;
            private final Map<String, GisAttribute> geoAttributes;
            private final Function<List<Object>, Card> cardLoaderFunction;
            private final Supplier<Stream<Long>> cardIdsLoaderFunction;

            public ClassHelper() {
                this(dao.getClasse(template.getTargetName()));
            }

            public ClassHelper(Classe classe) {
                this.classe = checkNotNull(classe);
                logger.debug("import to class = {}", classe);

                CmdbFilter filter;

                if (classe.hasId()) {
                    geoAttributes = gis.isGisEnabled() ? gis.getGisAttributesByOwnerClassIncludeInherited(classe.getName())
                            .stream().filter(a -> template.hasColumnWithAttrName(a.getLayerName()))
                            .collect(toImmutableMap(GisAttribute::getLayerName, identity())) : emptyMap();
                    UserCardAccess cardAccess = cardService.getUserCardAccess(classe.getName());
                    filter = getFilter().and(cardAccess.getWholeClassFilter());//TODO handle attr permission, etc
                } else {
                    geoAttributes = emptyMap();
                    filter = getFilter();
                }

                boolean preloadCards = isMergeEnabled();//TODO preload cards eurystic/etc

                /*
                
                idea: per partizionare/parallelizzare in caso di dataset da db troppo grandi per essere caricati in memoria:
                    1. query da db, ordinata sul campo chiave, paginata;
                    2. per ogni pagina, identifichiamo i valori chiave massimi/minimi e li usiamo per definire la partizione su cui lavorare
                    3. preleviamo dai dati sorgente i record appartenenti alla partizione considerata (in base al range di valori chiave che abbiamo identificato)
                    4. elaboriamo i dati; gli update possono essere eseguiti subito; gli insert devono essere raccolti ed eseguiti in seguito (per non interferire con la paginazione); 
                        in alternativa la query su db deve includere un filtro su id o begindate per escludere gli insert eseguiti nel corso dell'elaborazione;
                    5. al termine, eseguiamo insert e delete;        
                
                 */
                long cardsOnDb, estimateCardSizeBytes, estimateMemoryUsageBytes;
                if (preloadCards) {
                    cardsOnDb = dao.selectCount().from(classe).where(filter).getCount();
                    estimateCardSizeBytes = round(dao.selectAll().from(classe).where(filter).limit(100).getCards().stream().mapToLong(c -> estimateObjectSizeBytes(c.getAllValuesAsMap())).average().orElse(0));
                    estimateMemoryUsageBytes = estimateCardSizeBytes * cardsOnDb;
                    if (hasEnoughFreeMemory(estimateMemoryUsageBytes)) {
                        logger.info("preload {} cards from db for import merge, key attr[s] = {}, estimate memory usage = {}", cardsOnDb, template.getImportKeyAttributes(), memBytesToDisplaySize(estimateMemoryUsageBytes));
                    } else {
                        logger.info("skip card preload, estimate memory usage too big ( {} )", memBytesToDisplaySize(estimateMemoryUsageBytes));
                        preloadCards = false;
                    }
                }
                if (preloadCards) {
                    Map<String, Card> currentCardsByKeyAttributes = map();
                    dao.selectAll().from(classe).where(filter).getCards().forEach(card -> currentCardsByKeyAttributes.put(key(template.getImportKeyAttributes().stream().map(card::get).map(CmConvertUtils::extractCmPrimitiveIfAvailable).map(CmStringUtils::toStringOrEmpty).collect(toImmutableList())), card));
                    logger.debug("loaded {} cards from db", currentCardsByKeyAttributes.size());
                    cardLoaderFunction = k -> currentCardsByKeyAttributes.get(key(k.stream().map(CmConvertUtils::extractCmPrimitiveIfAvailable).map(CmStringUtils::toStringOrEmpty).collect(toImmutableList())));
                    cardIdsLoaderFunction = () -> currentCardsByKeyAttributes.values().stream().map(Card::getId);
                } else {
                    cardLoaderFunction = k -> dao.selectAll().from(classe).where(filter).accept(q -> {
                        for (int i = 0; i < template.getImportKeyAttributes().size(); i++) {
                            q.where(template.getImportKeyAttributes().get(i), EQ, k.get(i));
                        }
                    }).getCardOrNull();
                    cardIdsLoaderFunction = () -> dao.select(ATTR_ID).from(classe).where(filter).getCards().stream().map(Card::getId);
                }
            }

            @Override
            public EntryType getEntryType() {
                return classe;
            }

            @Override
            public RecordReadyForImport prepareRecord(Map<String, Object> record, boolean create, boolean update) {
                logger.trace("import class record, raw data = \n\n{}\n", mapToLoggableStringLazy(record));
                Map<String, Object> attrs = map(record).filterKeys(not(geoAttributes::containsKey))
                        .mapValues((k, v) -> firstNotBlankOrNull(v, defaults.get(k)))
                        .mapValues((k, v) -> (template.hasColumnWithAttrName(k) && !geoAttributes.containsKey(k)) ? convertValueToSystem(k, v) : v);
                Map<String, String> newGeoAttrs = map(record).filterKeys(geoAttributes::containsKey).mapValues(String.class::cast);
                logger.trace("import class record, processed data = \n\n{}\n", mapToLoggableStringLazy(attrs));
                Card currentCard;
                Map<String, String> currentGeoAttrs;
                String key;
                if (isMergeEnabled()) {
                    List<Object> keyValues = template.getImportKeyAttributes().stream().map(attrs::get).map(CmConvertUtils::extractCmPrimitiveIfAvailable).map(CmStringUtils::toStringOrEmpty).collect(toImmutableList());
                    key = key(keyValues);
                    currentCard = cardLoaderFunction.apply(keyValues);
                    currentGeoAttrs = (geoAttributes.isEmpty() || currentCard == null) ? emptyMap() : gis.getGisValues(classe.getName(), currentCard.getId()).stream()
                            .filter(g -> geoAttributes.containsKey(g.getLayerName())).collect(toMap(GisValue::getLayerName, a -> cmGeometryToPostgisSql(a.getGeometry())));
                } else {
                    currentCard = null;
                    currentGeoAttrs = emptyMap();
                    key = null;//not required                    
                }
                if (currentCard == null) {
                    if (create) {
                        Card newCard = CardImpl.builder().withType(classe).withAttributes(attrs).accept(c -> {
                            if (classe.hasMultitenantEnabled()) {
                                Long idTenant = ltEqZeroToNull(toLongOrNull(attrs.get(ATTR_IDTENANT)));
                                if (classe.hasMultitenantModeAlways() && idTenant == null) {
                                    idTenant = operationUser.getUser().getUserTenantContext().getDefaultTenantId();
                                }
                                checkArgument(!classe.hasMultitenantModeAlways() || isNotNullAndGtZero(idTenant), "missing tenant id");
                                checkArgument(idTenant == null || operationUser.getUser().getUserTenantContext().canAccessTenant(idTenant), "invalid tenant id = %s: access denied", idTenant);
                                c.withAttribute(ATTR_IDTENANT, idTenant);
                            }
                        }).build();
                        logger.debug("create new card = {}", newCard);
                        return new RecordReadyForImport() {
                            @Override
                            public boolean isCreate() {
                                return true;
                            }

                            @Override
                            public DatabaseRecord getRecord() {
                                return newCard;
                            }

                            @Override
                            public String getKey() {
                                return key;
                            }

                            @Override
                            public void postCreate(long id, DatabaseRecord card, Map<String, Object> record) {
                                updateGeoAttributes(card(classe.getName(), id), newGeoAttrs);
                                info.addCreatedRecord(record, id);
                                if (card.getType().isClasse()) {
                                    eventBus.post(new CardCreatedEventImpl(CardImpl.copyOf(card).withId(id).build(), record));
                                }
                            }

                        };
                    }
                } else {
                    if (update) {
                        Card newCard = CardImpl.copyOf(currentCard).withAttributes(attrs).build();
                        Set<String> attrsChanged = currentCard.getAttrsChangedFrom(newCard),
                                geoAttrsChanged = set(currentGeoAttrs.keySet()).with(newGeoAttrs.keySet()).stream().filter(k -> !equal(currentGeoAttrs.get(k), newGeoAttrs.get(k))).collect(toSet());
                        if (!attrsChanged.isEmpty() || !geoAttrsChanged.isEmpty()) {
                            if (logger.isDebugEnabled()) {
                                logger.debug("detected changes in these attributes = \n\n{}\n", mapDifferencesToLoggableString(
                                        map(currentCard.toMap()).withKeys(attrsChanged::contains).with(map(currentGeoAttrs).withKeys(geoAttrsChanged::contains)),
                                        map(newCard.toMap()).withKeys(attrsChanged::contains).with(map(newGeoAttrs).withKeys(geoAttrsChanged::contains))));
                            }
                            logger.debug("update card = {}", newCard);
                            return new RecordReadyForImport() {
                                @Override
                                public boolean isUpdate() {
                                    return true;
                                }

                                @Override
                                public String getKey() {
                                    return key;
                                }

                                @Override
                                public void doUpdate() {
                                    dao.updateOnly(newCard);
                                    updateGeoAttributes(newCard, newGeoAttrs);
                                    info.addModifiedRecord(record, newCard.getId());
                                    eventBus.post(new CardUpdatedEventImpl(newCard, record));
                                }
                            };
                        } else {
                            logger.trace("skipping unmodified card = {}", currentCard);
                            synchronized (info) {
                                info.addUnmodifiedRecord(record, currentCard.getId());
                                eventBus.post(new CardUnmodifiedEventImpl(currentCard, record));
                            }
                        }
                    }
                }
                return new RecordReadyForImport() {
                    @Override
                    public String getKey() {
                        return key;
                    }
                };
            }

            private void updateGeoAttributes(CardIdAndClassName card, Map<String, String> geoAttrs) {
                geoAttrs.forEach((k, v) -> {
                    gis.setGisValue(GisValueImpl.builder()
                            .withOwnerClassId(card.getClassName())
                            .withOwnerCardId(card.getId())
                            .withLayerName(k)
                            .withGeometry(parseGeometry(v)).build());
                });
            }

            @Override
            public void handleMissingRecords() {
                cardIdsLoaderFunction.get().filter(not(info::hasProcessedRecord)).forEach(this::handleMissingRecordSafe);
            }

            @Override
            protected void updateRecord(DatabaseRecord dbRecord, String attributeName, Object value) {
                dao.update(CardImpl.copyOf((Card) dbRecord).withAttribute(attributeName, value).build());
            }

        }

        private class DomainHelper extends EntryTypeHelper {

            private final Domain domain;

            public DomainHelper() {
                domain = dao.getDomain(template.getTargetName());
                logger.debug("import to domain = {}", domain);
            }

            @Override
            public EntryType getEntryType() {
                return domain;
            }

            @Override
            public RecordReadyForImport prepareRecord(Map<String, Object> record, boolean create, boolean update) {
                Map<String, Object> attrs = map(record)
                        .filterKeys(not(set(ATTR_IDOBJ1, ATTR_IDOBJ2)::contains))
                        .mapValues((k, v) -> firstNotBlankOrNull(v, defaults.get(k)))
                        .mapValues(ImportProcessor.this::convertValueToSystem);
                long sourceId = convertValueToSystem(ATTR_IDOBJ1, record.get(ATTR_IDOBJ1)),
                        targetId = convertValueToSystem(ATTR_IDOBJ2, record.get(ATTR_IDOBJ2));
                CMRelation relation = dao.getRelationOrNull(domain, sourceId, targetId);
                String key = key(sourceId, targetId);
                if (relation == null) {
                    if (create) {
                        Card sourceCard = dao.getCard(domain.getSourceClass(), sourceId),
                                targetCard = dao.getCard(domain.getTargetClass(), targetId);
                        CMRelation toCreate = RelationImpl.builder()
                                .withType(domain)
                                .withSourceCard(sourceCard)
                                .withTargetCard(targetCard)
                                .withAttributes(attrs).build();
                        logger.debug("create new relation = {}", relation);
                        return new RecordReadyForImport() {
                            @Override
                            public String getKey() {
                                return key;
                            }

                            @Override
                            public boolean isCreate() {
                                return true;
                            }

                            @Override
                            public DatabaseRecord getRecord() {
                                return toCreate;
                            }

                            @Override
                            public void postCreate(long id, DatabaseRecord card, Map<String, Object> record) {
                                info.addCreatedRecord(record, id);
                                if (card.getType().isClasse()) {
                                    eventBus.post(new CardCreatedEventImpl(CardImpl.copyOf(card).withId(id).build(), record));
                                }
                            }

                        };
                    }
                } else {
                    if (update) {
                        CMRelation newRelation = RelationImpl.copyOf(relation).addAttributes(attrs).build();
                        if (!relation.allValuesEqualTo(newRelation)) {
                            logger.debug("update relation = {}", newRelation);
                            return new RecordReadyForImport() {
                                @Override
                                public boolean isUpdate() {
                                    return true;
                                }

                                @Override
                                public String getKey() {
                                    return key;
                                }

                                @Override
                                public void doUpdate() {
                                    CMRelation updated = dao.update(newRelation);
                                    info.addModifiedRecord(record, updated.getId());
                                }
                            };
                        } else {
                            logger.debug("skipping unmodified relation = {}", relation);
                            synchronized (info) {
                                info.addUnmodifiedRecord(record, relation.getId());
                                eventBus.post(new CardUnmodifiedEventImpl(relation, record));
                            }
                        }
                    }
                }
                return new RecordReadyForImport() {
                    @Override
                    public String getKey() {
                        return key;
                    }
                };
            }

            @Override
            public void handleMissingRecords() {
                dao.selectAll().from(domain).where(getFilter()).getRelations() //TODO access control
                        .stream().filter(c -> !info.hasProcessedRecord(c.getId())).map(CMRelation::getId).forEach(this::handleMissingRecordSafe);
            }

            @Override
            protected void updateRecord(DatabaseRecord dbRecord, String attributeName, Object value) {
                dao.update(RelationImpl.copyOf((CMRelation) dbRecord).addAttribute(attributeName, value).build());
            }

        }
    }

    private class XlsExportProcessor extends ExportProcessor {

        private final WorkbookInfo workbookInfo;
        private final Workbook workbook;
        private final Sheet sheet;
        private final CellStyle dateCellStyle, dateTimeCellStyle, timeCellStyle;
        private int rowIndex;
        private final int headerRow, dataRow, columnOffset;

        public XlsExportProcessor(EtlTemplate template) {
            super(template);
            checkArgument(set(EFF_XLS, EFF_XLSX).contains(template.getFileFormat()));

            workbookInfo = buildWorkbook(template, "export");
            workbook = workbookInfo.getWorkbook();
            sheet = workbookInfo.getSheet();
            String dateFormat = dateFormatPatternToXls(templatePreferences.getDateFormatPattern()),
                    dateTimeFormat = dateTimeFormatPatternToXls(templatePreferences.getDateTimeFormatPattern()),
                    timeFormat = dateTimeFormatPatternToXls(templatePreferences.getTimeFormatPattern());
            logger.debug("use date format pattern =< {} >, datetime format pattern =< {} >", dateFormat, dateTimeFormat);
            dateCellStyle = workbook.createCellStyle();
            dateCellStyle.setDataFormat(workbook.getCreationHelper().createDataFormat().getFormat(dateFormat));
            dateTimeCellStyle = workbook.createCellStyle();
            dateTimeCellStyle.setDataFormat(workbook.getCreationHelper().createDataFormat().getFormat(dateTimeFormat));
            timeCellStyle = workbook.createCellStyle();
            timeCellStyle.setDataFormat(workbook.getCreationHelper().createDataFormat().getFormat(timeFormat));

            headerRow = isNullOrLtEqZero(template.getHeaderRow()) ? 0 : template.getHeaderRow() - 1;
            dataRow = isNullOrLtEqZero(template.getDataRow()) ? (template.getUseHeader() ? 1 : 0) : template.getDataRow() - 1;
            columnOffset = isNullOrLtEqZero(template.getFirstCol()) ? 0 : template.getFirstCol() - 1;

            if (template.getUseHeader()) {
                Row row = sheet.createRow(headerRow);
                for (int i = 0; i < template.getColumns().size(); i++) {
                    Cell cell = row.createCell(i + columnOffset, STRING);
                    cell.setCellValue(template.getColumns().get(i).getColumnName());
                }
            }

            rowIndex = dataRow - 1;
        }

        @Override
        protected void addRecordToResponse(DatabaseRecord record) throws Exception {
            Row row = sheet.createRow(++rowIndex);
            for (int i = 0; i < template.getColumns().size(); i++) {
                EtlTemplateColumnConfig config = template.getColumns().get(i);
                Pair<Attribute, Object> pair = getAttributeAndValue(record, config);
                serializeAttributeValue(row, i + columnOffset, config, pair.getLeft(), pair.getRight());
            }
        }

        @Override
        protected DataSource doExportData() throws Exception {
            ByteArrayOutputStream out = new ByteArrayOutputStream();
            workbook.write(out);
            byte[] data = out.toByteArray();
            logger.trace("export {} data = \n\n{}\n", workbookInfo.getFileExt(), lazyString(() -> newStringUsAscii(encodeBase64(data, true))));
            return newDataSource(data, workbookInfo.getContentType(), format("export_%s_%s.%s", normalize(template.getCode()), CmDateUtils.dateTimeFileSuffix(), workbookInfo.getFileExt()));
        }

        private void serializeAttributeValue(Row row, int columnIndex, EtlTemplateColumnConfig columnConfig, @Nullable Attribute attribute, @Nullable Object value) throws ParseException {
            if (attribute == null || isNullOrBlank(value)) {
                row.createCell(columnIndex, BLANK);
            } else {
                switch (attribute.getType().getName()) {
                    case BOOLEAN:
                        row.createCell(columnIndex, BOOLEAN).setCellValue(toBoolean(value));
                        break;
                    case CHAR:
                    case INET:
                    case JSON:
                    case REGCLASS:
                    case STRING:
                    case GEOMETRY:
                    case TEXT:
                        row.createCell(columnIndex, STRING).setCellValue(convert(value, String.class));
                        break;
                    case DECIMAL:
                    case DOUBLE:
                    case FLOAT:
                        row.createCell(columnIndex, NUMERIC).setCellValue(toDouble(value));
                        break;
                    case INTEGER:
                    case LONG:
                        row.createCell(columnIndex, NUMERIC).setCellValue(toLong(value));
                        break;
                    case DATE:
                        Cell dateCell = row.createCell(columnIndex, NUMERIC);
                        dateCell.setCellValue(toJavaDate(value));
                        dateCell.setCellStyle(dateCellStyle);
                        break;
                    case TIMESTAMP:
                        Cell dateTimeCell = row.createCell(columnIndex, NUMERIC);
//                        dateTimeCell.setCellValue(helper.zonedDateTimeToUserLocalJavaDate(toDateTime(value)));
                        dateTimeCell.setCellValue(toJavaDate(value));
                        dateTimeCell.setCellStyle(dateTimeCellStyle);
                        break;
                    case TIME:
                        Cell timeCell = row.createCell(columnIndex, NUMERIC);
                        timeCell.setCellStyle(timeCellStyle);
                        SimpleDateFormat sdf;
                        if (attribute.getMetadata().showSeconds()) {
                            sdf = new SimpleDateFormat("HH:mm:ss");
                        } else {
                            sdf = new SimpleDateFormat("HH:mm");
                        }
                        timeCell.setCellValue(sdf.parse(toIsoTime(value)));
                        break;
                    case REFERENCE:
                    case FOREIGNKEY:
                    case LOOKUP:
                        IdAndDescription idAndDescription = (IdAndDescription) value;
                        if (isNullOrLtEqZero(idAndDescription.getId())) {
                            row.createCell(columnIndex, BLANK);
                        } else {
                            switch (columnConfig.getMode()) {
                                case ETCM_CODE:
                                    row.createCell(columnIndex, STRING).setCellValue(checkNotBlank(idAndDescription.getCode(), "invalid code export for value = %s : code is null", idAndDescription));
                                    break;
                                case ETCM_DESCRIPTION:
                                    row.createCell(columnIndex, STRING).setCellValue(checkNotBlank(idAndDescription.getDescription(), "invalid description export for value = %s : description is null", idAndDescription));
                                    break;
                                case ETCM_ID:
                                    row.createCell(columnIndex, NUMERIC).setCellValue(idAndDescription.getId());
                                    break;
                                default:
                                    throw new EtlException("unsupported column export mode = %s for attribute = %s", columnConfig.getMode(), attribute);
                            }
                        }
                        break;
                    default:
                        throw new EtlException("unable to export attribute = %s: unsupported attribute type", attribute);
                }
            }
            logger.trace("export column = {} with value = {} ({}) to cell = {}", columnConfig.getColumnName(), value, getClassOfNullable(value).getName(), row.getCell(rowIndex));
        }

    }

    private class CsvExportProcessor extends ExportProcessor {

        private final StringWriter writer;
        private final CsvListWriter csv;

        public CsvExportProcessor(EtlTemplate template) throws Exception {
            super(template);
            checkArgument(equal(template.getFileFormat(), EFF_CSV));

            CsvPreference csvPreference = getCsvPreference(template);

            writer = new StringWriter();
            csv = new CsvListWriter(writer, csvPreference);
            if (template.getUseHeader()) {
                csv.write(list(transform(template.getColumns(), EtlTemplateColumnConfig::getColumnName)));
            }
        }

        @Override
        protected void addRecordToResponse(DatabaseRecord record) throws Exception {
            logger.info("export row = {}", record);
            csv.write(list(transform(template.getColumns(), (c) -> {
                Pair<Attribute, Object> pair = getAttributeAndValue(record, c);
                return nullToEmpty(serializeAttributeValue(c, pair.getLeft(), pair.getValue()));
            })));
        }

        @Override
        protected DataSource doExportData() throws Exception {
            csv.close();
            String csvString = writer.toString();
            logger.trace("export csv data = \n\n{}\n", csvString);
            String charset = firstNotBlank(template.getCharset(), userPreferencesService.getUserPreferences().getPreferredFileCharset());
            logger.debug("export csv with charset =< {} >", charset);
            return newDataSource(csvString.getBytes(charset), setCharsetInContentType("text/csv", charset), format("export_%s_%s.csv", normalize(template.getCode()), CmDateUtils.dateTimeFileSuffix()));
        }

        private String serializeAttributeValue(EtlTemplateColumnConfig columnConfig, @Nullable Attribute attribute, @Nullable Object value) {
            if (attribute == null || isNullOrBlank(value)) {
                return "";
            } else {
                switch (attribute.getType().getName()) {
                    case DECIMAL:
                    case DOUBLE:
                    case FLOAT:
                    case INTEGER:
                    case LONG:
                        return getHelper(columnConfig).serializeNumber(convert(value, Number.class));
                    case BOOLEAN:
                    case CHAR:
                    case INET:
                    case JSON:
                    case REGCLASS:
                    case STRING:
                    case GEOMETRY:
                    case TEXT:
                        return convert(value, String.class);
                    case DATE:
                        return getHelper(columnConfig).serializeDate(toDate(value));
                    case TIME:
                        return getHelper(columnConfig).serializeTime(toTime(value));
                    case TIMESTAMP:
                        return getHelper(columnConfig).serializeDateTime(toDateTime(value));
                    case REFERENCE:
                    case FOREIGNKEY:
                    case LOOKUP:
                        IdAndDescription idAndDescription = (IdAndDescription) value;
                        if (isNullOrLtEqZero(idAndDescription.getId())) {
                            return "";
                        } else {
                            switch (columnConfig.getMode()) {
                                case ETCM_CODE:
                                    return checkNotBlank(idAndDescription.getCode(), "invalid code export for value = %s : code is null", idAndDescription);
                                case ETCM_DESCRIPTION:
                                    return checkNotBlank(idAndDescription.getDescription(), "invalid description export for value = %s : description is null", idAndDescription);
                                case ETCM_ID:
                                    return idAndDescription.getId().toString();
                                default:
                                    throw new EtlException("unsupported column export mode = %s for attribute = %s", columnConfig.getMode(), attribute);
                            }
                        }
                    default:
                        throw new EtlException("unable to export attribute = %s: unsupported attribute type", attribute);
                }
            }
        }

    }

    private abstract class ExportProcessor extends BaseProcessor {

        public ExportProcessor(EtlTemplate template) {
            super(template);
            checkArgument(template.isExportTemplate(), "invalid template: this is not an export template");
        }

        public DataSource exportData() throws Exception {
            CmdbFilter filter = template.getExportFilter().and(template.getFilter());
            switch (template.getTargetType()) {
                case ET_CLASS:
                    Classe classe = dao.getClasse(template.getTargetName());
                    template.getColumns().stream().filter(EtlTemplateColumnConfig::doNotIgnoreColumn).forEach(c -> checkArgument(classe.hasAttribute(c.getAttributeName()), "invalid template: attribute not found in class = %s for name = %s", classe, c.getAttributeName()));
                    UserCardAccess cardAccess = cardService.getUserCardAccess(template.getTargetName());
                    CmdbFilter cardAccessFilter = cardAccess.getWholeClassFilter();
                    filter = filter.and(cardAccessFilter);
                    List<Card> cards = dao.selectAll()//TODO fix this, use user access service
                            .from(template.getTargetName())
                            //                .orderBy(sorter)TODO check order
                            .where(filter)
                            .orderBy(classe.getDefaultOrder())
                            .accept(cardAccess.addSubsetFilterMarkersToQueryVisitor()::accept)
                            .getCards().stream()
                            .map(cardAccess::addCardAccessPermissionsFromSubfilterMark)
                            .collect(toList());
                    logger.info("building export with {} card rows", cards.size());
                    cards.forEach(rethrowConsumer(this::addRecordToResponse));
                    return doExportData();
                case ET_DOMAIN:
                    Domain domain = dao.getDomain(template.getTargetName());
                    template.getColumns().stream().filter(EtlTemplateColumnConfig::doNotIgnoreColumn).forEach(c -> checkArgument(domain.hasAttribute(c.getAttributeName()), "invalid template: attribute not found in domain = %s for name = %s", domain, c.getAttributeName()));
                    List<CMRelation> relations = dao.selectAll()
                            .from(domain)
                            .where(filter)
                            .orderBy(domain.getDefaultOrder())
                            .getRelations(); //TODO access control
                    logger.info("building export with {} relation rows", relations.size());
                    relations.forEach(rethrowConsumer(this::addRecordToResponse));
                    return doExportData();
                default:
                    throw new EtlException("unsupported target type = %s", template.getTargetType());
            }
        }

        public DataSource exportData(List<? extends DatabaseRecord> data) throws Exception {
            data.forEach(rethrowConsumer(this::addRecordToResponse));
            return doExportData();
        }

        protected Pair<Attribute, Object> getAttributeAndValue(DatabaseRecord record, EtlTemplateColumnConfig c) {
            Attribute attribute;
            Object value;
            if (c.ignoreColumn()) {
                attribute = null;
                value = null;
            } else {
                if (record.getType().isDomain() && set(ATTR_IDOBJ1, ATTR_IDOBJ2).contains(c.getAttributeName())) {
                    attribute = record.getType().asDomain().getIdObjAttrAsFkAttr(c.getAttributeName());
                    value = ((CMRelation) record).getIdObjAttrValueAsFkAttrValue(c.getAttributeName());
                } else {
                    attribute = record.getType().getAttributeOrNull(c.getAttributeName());
                    value = record.get(c.getAttributeName());
                }
            }
            logger.trace("export column = {} with value = {} ({})", c, value, getClassOfNullable(value).getName());
            return Pair.of(attribute, value);
        }

        protected abstract void addRecordToResponse(DatabaseRecord record) throws Exception;

        protected abstract DataSource doExportData() throws Exception;

    }

    interface RecordReadyForImport {

        String getKey();

        default boolean isCreate() {
            return false;
        }

        default boolean isUpdate() {
            return false;
        }

        default DatabaseRecord getRecord() {
            throw new UnsupportedOperationException();
        }

        default void postCreate(long id, DatabaseRecord card, Map<String, Object> record) {
        }

        default void doUpdate() {
            throw new UnsupportedOperationException();
        }

    }

    private abstract class CardEventImpl implements CardEvent {

        final DatabaseRecord card;
        final Map<String, Object> record;

        public CardEventImpl(DatabaseRecord card, Map<String, Object> record) {
            this.card = checkNotNull(card);
            this.record = checkNotNull(record);
        }

        @Override
        public DatabaseRecord getCard() {
            return card;
        }

        @Override
        public Map<String, Object> getRecord() {
            return record;
        }

    }

    private class CardCreatedEventImpl extends CardEventImpl implements CardCreatedEvent {

        public CardCreatedEventImpl(DatabaseRecord card, Map<String, Object> record) {
            super(card, record);
        }

    }

    private class CardUpdatedEventImpl extends CardEventImpl implements CardUpdatedEvent {

        public CardUpdatedEventImpl(DatabaseRecord card, Map<String, Object> record) {
            super(card, record);
        }

    }

    private class CardUnmodifiedEventImpl extends CardEventImpl implements CardUnmodifiedEvent {

        public CardUnmodifiedEventImpl(DatabaseRecord card, Map<String, Object> record) {
            super(card, record);
        }

    }
}
