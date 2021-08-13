package org.cmdbuild.dms.core;

import static com.google.common.base.Objects.equal;
import java.util.List;
import java.util.Map;

import javax.activation.DataHandler;

import static com.google.common.base.Preconditions.checkArgument;
import static com.google.common.base.Preconditions.checkNotNull;
import com.google.common.base.Predicates;
import com.google.common.base.Splitter;
import static com.google.common.base.Strings.nullToEmpty;
import com.google.common.collect.ImmutableList;
import static com.google.common.collect.ImmutableSet.toImmutableSet;
import com.google.common.collect.Maps;
import static com.google.common.collect.MoreCollectors.toOptional;
import static java.lang.String.format;
import static java.util.Collections.emptyList;
import static java.util.Collections.emptyMap;
import java.util.Optional;
import static java.util.stream.Collectors.toList;
import javax.annotation.Nullable;
import org.apache.commons.io.FilenameUtils;
import static org.apache.commons.io.FilenameUtils.getExtension;
import static org.apache.commons.lang.NumberUtils.isNumber;
import static org.apache.commons.lang.StringUtils.isBlank;
import static org.apache.commons.lang.StringUtils.isNotBlank;
import org.cmdbuild.auth.user.OperationUserSupplier;
import org.cmdbuild.dao.beans.Card;
import org.cmdbuild.dao.beans.CardImpl;
import static org.cmdbuild.utils.lang.CmExceptionUtils.marker;
import org.cmdbuild.dao.core.q3.DaoService;
import static org.cmdbuild.dao.core.q3.QueryBuilder.EQ;
import org.cmdbuild.dao.entrytype.Classe;
import org.cmdbuild.data.filter.CmdbFilter;
import static org.cmdbuild.data.filter.utils.CmdbFilterUtils.noopFilter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.cmdbuild.dms.DmsConfiguration;
import org.cmdbuild.dms.inner.DocumentInfoAndDetail;
import org.cmdbuild.dms.DmsService;
import org.cmdbuild.dms.DocumentData;
import org.cmdbuild.dms.DocumentDataImpl;
import org.cmdbuild.dms.inner.DmsProviderService;
import static org.cmdbuild.dms.inner.DmsProviderService.DMS_PROVIDER_CMIS;
import org.cmdbuild.dms.inner.DocumentInfoAndDetailImpl;
import org.cmdbuild.exception.DmsException;
import org.cmdbuild.lookup.LookupService;
import org.cmdbuild.lookup.LookupType;
import org.cmdbuild.services.MinionStatus;
import static org.cmdbuild.utils.lang.CmPreconditions.firstNotBlank;
import static org.cmdbuild.utils.lang.CmStringUtils.toStringNotBlank;
import static org.cmdbuild.utils.lang.CmStringUtils.toStringOrNull;
import static org.cmdbuild.utils.lang.CmConvertUtils.toLongOrNull;
import static org.cmdbuild.utils.lang.CmNullableUtils.isNullOrLtEqZero;
import org.cmdbuild.services.MinionComponent;
import static org.cmdbuild.services.MinionStatus.MS_READY;
import static org.cmdbuild.services.MinionStatus.MS_ERROR;
import static org.cmdbuild.services.MinionStatus.MS_DISABLED;
import org.cmdbuild.utils.ScriptService;
import org.cmdbuild.utils.date.CmDateUtils;
import static org.cmdbuild.utils.io.CmIoUtils.newDataHandler;
import static org.cmdbuild.utils.lang.CmConvertUtils.toLong;
import static org.cmdbuild.utils.lang.CmCollectionUtils.list;
import static org.cmdbuild.utils.lang.CmMapUtils.map;
import org.cmdbuild.utils.lang.CmPreconditions;
import static org.cmdbuild.utils.lang.KeyFromPartsUtils.key;
import org.cmdbuild.lookup.LookupValue;
import static org.cmdbuild.utils.lang.CmPreconditions.checkNotBlank;

@Component
@MinionComponent(name = "DMS Service", configBean = DmsConfiguration.class, canStartStop = true)
public class DmsServiceImpl implements DmsService {

    private final Logger logger = LoggerFactory.getLogger(getClass());

    private final DmsConfiguration config;
    private final Map<String, DmsProviderService> services;
    private final LookupService lookupService;
    private final DaoService dao;
    private final OperationUserSupplier userSupplier;
    private final ScriptService scriptService;

    public DmsServiceImpl(List<DmsProviderService> services, DmsConfiguration configuration, LookupService lookupService, DaoService dao, OperationUserSupplier userSupplier, ScriptService scriptService) {
        this.config = checkNotNull(configuration);
        this.services = Maps.uniqueIndex(checkNotNull(services), DmsProviderService::getDmsProviderServiceName);
        this.lookupService = checkNotNull(lookupService);
        this.dao = checkNotNull(dao);
        this.userSupplier = checkNotNull(userSupplier);
        this.scriptService = checkNotNull(scriptService);
    }

    public MinionStatus getServiceStatus() {
        if (!config.isEnabled()) {
            return MS_DISABLED;
        } else if (isDmsServiceOk()) {
            return MS_READY;
        } else {
            return MS_ERROR;
        }
    }

    private boolean isDmsServiceOk() {
        try {
            DmsProviderService service = getService();
            service.checkService();
            return true;
        } catch (Exception ex) {
            logger.warn("dms service is NOT OK : {}", ex.toString());
            return false;
        }
    }

    @Override
    public DmsProviderService getService() {
        return checkNotNull(services.get(config.getService()), "dms service not found for name = %s", config.getService());
    }

    @Override
    public boolean isEnabled() {
        return config.isEnabled();
    }

    @Override
    public LookupValue getCategoryLookup(String classId, String category) {
        return getCategoryLookup(dao.getClasse(classId), category);
    }

    @Override
    public LookupValue getCategoryLookup(Classe classe, String category) {
        return lookupService.getLookupByTypeAndId(getCategoryLookupType(classe).getName(), toLong(category));
    }

    @Override
    public LookupType getCategoryLookupType(String classId) {
        return getCategoryLookupType(dao.getClasse(classId));
    }

    @Override
    public LookupType getCategoryLookupType(Classe classe) {
        return lookupService.getLookupType(firstNotBlank(classe.getDmsCategoryOrNull(), config.getDefaultDmsCategory()));
    }

    @Override
    public DocumentInfoAndDetail getCardAttachmentById(String className, long cardId, String documentId) {
        checkDmsEnabled();
        DmsCategoryHelper helper = helper(className);
        DocumentInfoAndDetail document = getService().getDocument(documentId);
        document = helper.cmisCategoryToCmdbuildCategory(document);
        document = helper.getDocumentMetadata(document, cardId);
        return document;
    }

    @Override
    public List<DocumentInfoAndDetail> getCardAttachments(String className, long cardId, CmdbFilter filter, boolean includeMetadata) {
        checkDmsEnabled();
        logger.debug("search all documents for className = {} and cardId = {}", className, cardId);
        DmsCategoryHelper helper = helper(className);
        List<DocumentInfoAndDetail> documents = getService().getDocuments(className, cardId);
        List<DocumentInfoAndDetail> documentsWithMatchingContent = list();
        documents = list(documents).map(helper::cmisCategoryToCmdbuildCategory);
        if (includeMetadata) {
            documents = list(documents).map(d -> helper.getDocumentMetadataSafe(d, cardId));
        }
        if (!filter.isNoop()) {
            if (filter.hasFulltextFilter() && getService().getDmsProviderServiceName().equals(DMS_PROVIDER_CMIS)) {
                List<String> attachmentsMatchingFilter = getService().queryDocumentsForCard(filter.getFulltextFilter().getQuery(), className, cardId);
                documentsWithMatchingContent = list(documents).stream().filter(d -> attachmentsMatchingFilter.contains(d.getDocumentId())).collect(toList());
            }
            documents = list(documents).withOnly(Predicates.compose(
                    dao.select(DOCUMENT_ATTR_DOCUMENTID)
                            .from(DMS_MODEL_PARENT_CLASS)
                            .where(DOCUMENT_ATTR_CARD, EQ, cardId)
                            .where(filter)
                            .getCards().stream().map(c -> c.getString(DOCUMENT_ATTR_DOCUMENTID))
                            .collect(toImmutableSet())::contains, DocumentInfoAndDetail::getDocumentId));
            documentsWithMatchingContent.removeAll(documents);
            documents.addAll(documentsWithMatchingContent);
        }
        return documents;
    }

    @Override
    @Nullable
    public DocumentInfoAndDetail getCardAttachmentOrNull(String className, long cardId, String fileName) {
        checkDmsEnabled();
        return getCardAttachments(className, cardId, noopFilter(), true).stream().filter((input) -> input.getFileName().equals(fileName)).collect(toOptional()).orElse(null);//TODO replace with more efficent query
    }

    @Override
    public List<DocumentInfoAndDetail> getCardAttachmentVersions(String className, long cardId, String filename) {
        checkDmsEnabled();
        DocumentInfoAndDetail document = getCardAttachmentWithFilename(className, cardId, filename);
        List<DocumentInfoAndDetail> documents = getService().getDocumentVersions(document.getDocumentId());
        documents = list(documents).map(helper(className)::cmisCategoryToCmdbuildCategory);
        return documents;
    }

    @Override
    public DocumentInfoAndDetail create(String className, long cardId, DocumentData documentData) {
        return doCreate(className, cardId, documentData, false);
    }

    @Override
    public DocumentInfoAndDetail createAndSkipExisting(String className, long cardId, DocumentData documentData) {
        return doCreate(className, cardId, documentData, true);
    }

    @Override
    public DocumentInfoAndDetail updateDocumentWithAttachmentId(String className, long cardId, String documentId, DocumentData documentData) {
        checkDmsEnabled();
        DocumentInfoAndDetail old = getCardAttachmentById(className, cardId, documentId);
        checkArgument(!documentData.hasData() || equal(getExtension(old.getFileName()).toLowerCase(), getExtension(documentData.getFilename())), "CM: invalid file extension (old file =< %s >, new file =< %s >", old.getFileName(), documentData.getFilename());
        checkArgument(equal(documentData.getCategory(), old.getCategory()));
        DmsCategoryHelper helper = helper(className);
        documentData = helper.cmdbuildCategoryToCmisCategory(documentData);
        documentData = DocumentDataImpl.copyOf(documentData).withAuthor(userSupplier.getUsername()).build();
        DocumentInfoAndDetail newDocument = getService().update(documentId, documentData);//TODO validate card id, class id
        newDocument = helper.cmisCategoryToCmdbuildCategory(newDocument);
        newDocument = helper.setDocumentMetadata(documentId, newDocument, documentData, cardId);
        autoLink(className, cardId, old, newDocument);
        return newDocument;
    }

    @Override
    public DataHandler download(String attachmentId, @Nullable String version) {
        checkDmsEnabled();
        return getService().download(attachmentId, version);
    }

    @Override
    public Optional<DataHandler> preview(String attachmentId) {
        checkDmsEnabled();
        return getService().preview(attachmentId);
    }

    @Override
    public void delete(String className, long cardId, String filename) {
        checkDmsEnabled();
        DmsCategoryHelper helper = helper(className);
        DocumentInfoAndDetail document = getCardAttachmentWithFilename(className, cardId, filename);
        getService().delete(document.getDocumentId());
        helper.clearDocumentMetadata(document, cardId);
        autoLink(className, cardId, document, null);
    }

    private DocumentInfoAndDetail doCreate(String className, long cardId, DocumentData documentData, boolean skipExisting) {
        checkDmsEnabled();
        DmsCategoryHelper helper = helper(className);
        documentData = helper.cmdbuildCategoryToCmisCategory(documentData);
        documentData = DocumentDataImpl.copyOf(documentData).withAuthor(userSupplier.getUsername()).build();
        if (getCardAttachmentOrNull(className, cardId, documentData.getFilename()) != null) {
            if (skipExisting) {
                logger.debug("document with filename {} already exists, skipping creation", documentData.getFilename());
                return null;
            } else {
                throw new DmsException("CM: file name conflict: a document with file name =< %s > does already exist for class = %s card = %s ", documentData.getFilename(), className, cardId);
            }
        } else {
            logger.debug("create document = {}", documentData);
            DocumentInfoAndDetail document = getService().create(className, cardId, documentData);
            document = helper.cmisCategoryToCmdbuildCategory(document);
            document = helper.setDocumentMetadata(document.getDocumentId(), document, documentData, cardId);
            autoLink(className, cardId, null, document);
            return document;
        }
    }

    @Nullable
    private String categoryToCmis(@Nullable String categoryLookup, @Nullable String value) {
        if (isBlank(value) || (isNumber(value) && isNullOrLtEqZero(toLongOrNull(value)))) {
            return null;
        } else {
            return lookupService.getLookupByTypeAndCodeOrDescriptionOrId(firstNotBlank(categoryLookup, config.getDefaultDmsCategory()), value).getCode();
        }
    }

    @Nullable
    private String categoryFromCmis(@Nullable String categoryLookup, @Nullable Object value) {
        if (isBlank(toStringOrNull(value))) {
            return null;
        } else {
            try {
                return lookupService.getLookupByTypeAndCodeOrDescriptionOrId(firstNotBlank(categoryLookup, config.getDefaultDmsCategory()), toStringNotBlank(value)).getId().toString();
            } catch (Exception ex) {
                logger.warn(marker(), "received invalid category code from cmis =< {} >", value, ex);
                return null;
            }
        }
    }

    @Override
    public DataHandler exportAllDocuments() {
        return newDataHandler(getService().exportAllDocumentsAsZipFile(), "application/zip", format("dms_export_%s.zip", CmDateUtils.dateTimeFileSuffix()));
    }

    @Override
    public void checkRegularFileAttachment(DocumentData documentData) {
        if (config.isRegularAttachmentsFileExtensionCheckEnabled() && isNotBlank(documentData.getFilename())) {
            checkArgument(config.getRegularAttachmentsAllowedFileExtensions().contains(FilenameUtils.getExtension(documentData.getFilename()).toLowerCase()), "CM: invalid file =< %s > : file type not allowed", documentData.getFilename());
        }
    }

    @Override
    public void checkRegularFileSize(DocumentData documentData) {
        if (config.isMaxFileSizeCheckEnabled()) {
            checkArgument((documentData.getData().length / 1048576) < config.getMaxFileSize(), "CM: File =< %s > exceeds maximum file size of %s MB", documentData.getFilename(), config.getMaxFileSize());
        }
    }

    @Override
    public void checkIncomingEmailAttachment(DocumentData documentData) {
        if (config.isIncomingEmailFileExtensionCheckEnabled() && isNotBlank(documentData.getFilename())) {
            checkArgument(config.getIncomingEmailAttachmentsAllowedFileExtensions().contains(FilenameUtils.getExtension(documentData.getFilename()).toLowerCase()), "CM: invalid file =< %s > : file type not allowed", documentData.getFilename());
        }
    }

    @Override
    public Classe getDmsModel(String className, @Nullable String category) {
        return helper(className).getDmsModel(category);
    }

    private void checkDmsEnabled() {
        checkArgument(isEnabled(), "dms service is not enabled");
    }

    private DmsCategoryHelper helper(String className) {
        return helper(dao.getClasse(className));
    }

    private DmsCategoryHelper helper(Classe classe) {
        return new DmsCategoryHelper(classe);
    }

    private void autoLink(String classId, long cardId, @Nullable DocumentInfoAndDetail previousDocument, @Nullable DocumentInfoAndDetail nextDocument) {
        if (config.hasAutolinkHelperScript()) {
            autoLink(dao.getCard(classId, cardId), previousDocument, nextDocument);
        }
    }

    private void autoLink(Card card, @Nullable DocumentInfoAndDetail previousDocument, @Nullable DocumentInfoAndDetail nextDocument) {
        if (config.hasAutolinkHelperScript()) {
            logger.debug("execute autolink operations for document {} -> {}", previousDocument, nextDocument);
            List<AutolinkOperation> before = previousDocument == null ? emptyList() : getAutolinkOperationsForDocument(card, previousDocument), after = nextDocument == null ? emptyList() : getAutolinkOperationsForDocument(card, nextDocument);
            List<String> basepath = Splitter.on("/").omitEmptyStrings().splitToList(nullToEmpty(config.getAutolinkBasePath()));
            before.forEach(o -> {
                logger.debug("revert autolink operation = {}", o);
                getService().deleteLink(list(basepath).with(o.getTargetLink()));
            });
            after.forEach(o -> {
                logger.debug("execute autolink operation = {}", o);
                getService().createLink(nextDocument, list(basepath).with(o.getTargetLink()));
            });
        }
    }

    private List<AutolinkOperation> getAutolinkOperationsForDocument(Card card, DocumentInfoAndDetail document) {
        List<AutolinkOperation> list = list();
        logger.debug("get autolink operations for card = {} document = {}", card, document);
        scriptService.helper(getClass())
                .withScript(config.getAutolinkHelperScript())
                .withData("autolink", new AutolinkApi() {
                    @Override
                    public void addLink(Iterable<String> path) {
                        list.add(new AutolinkOperation(list(path)));
                    }
                }).withData("document", map("filename", document.getFileName(), "category", document.getCategory()), "card", map(card.getAllValuesAsMap()).with("_id", card.getIdOrNull(), "_type", card.getTypeName()))
                .execute();
        return list;
    }

    public interface AutolinkApi {

        void addLink(Iterable<String> path);

        default void addLink(String path) {
            AutolinkApi.this.addLink(Splitter.on("/").omitEmptyStrings().split(path));
        }
    }

    private static class AutolinkOperation {

        private final List<String> targetLink;

        public AutolinkOperation(List<String> targetLink) {
            this.targetLink = ImmutableList.copyOf(targetLink);
            targetLink.forEach(CmPreconditions::checkNotBlank);
        }

        public List<String> getTargetLink() {
            return targetLink;
        }

        public String getKey() {
            return key(getTargetLink());
        }

        @Override
        public String toString() {
            return "AutolinkOperation{" + "targetLink=" + targetLink + '}';
        }

    }

    private class DmsCategoryHelper {

        private final Classe classe;

        public DmsCategoryHelper(Classe classe) {
            this.classe = checkNotNull(classe);
        }

        private DocumentInfoAndDetail cmisCategoryToCmdbuildCategory(DocumentInfoAndDetail document) {
            if (isBlank(document.getCategory())) {
                return document;
            } else {
                return DocumentInfoAndDetailImpl.copyOf(document).withCategory(categoryFromCmis(classe.getDmsCategoryOrNull(), document.getCategory())).build();
            }
        }

        private DocumentData cmdbuildCategoryToCmisCategory(DocumentData documentData) {
            if (isBlank(documentData.getCategory())) {
                return documentData;
            } else {
                return DocumentDataImpl.copyOf(documentData).withCategory(categoryToCmis(classe.getDmsCategoryOrNull(), documentData.getCategory())).build();
            }
        }

        private String getCategoryType() {
            return firstNotBlank(classe.getDmsCategoryOrNull(), config.getDefaultDmsCategory());
        }

        private DocumentInfoAndDetail getDocumentMetadata(DocumentInfoAndDetail document, long cardId) {
            return DocumentInfoAndDetailImpl.copyOf(document).withMetadata(getDocumentMetadataCardCreateIfMissing(document, cardId)).build();
        }

        private DocumentInfoAndDetail getDocumentMetadataSafe(DocumentInfoAndDetail document, long cardId) {
            try {
                return getDocumentMetadata(document, cardId);
            } catch (Exception ex) {
                logger.warn(marker(), "error retrieving document metadata for document = {} card = {}", document, cardId, ex);
                return document;
            }
        }

        private DocumentInfoAndDetail setDocumentMetadata(String documentId, DocumentInfoAndDetail document, DocumentData data, long cardId) {
            return setDocumentMetadata(documentId, document, data.getMetadata(), cardId);
        }

        private void clearDocumentMetadata(DocumentInfoAndDetail document, long cardId) {
            Card card = getDocumentMetadataCardOrNull(cardId, document);
            if (card != null) {
                dao.delete(card);
            }
        }

        private DocumentInfoAndDetail setDocumentMetadata(String documentId, DocumentInfoAndDetail document, Map<String, Object> data, long cardId) {
            Classe dmsModel = checkNotNull(getDmsModel(document), "cannot set document metadata: dms model not available for document = %s", document);
            Card card = getDocumentMetadataCardOrNull(cardId, document.getCategory(), documentId);
            Map<String, Object> attrs = map(data)
                    .filterKeys(k -> dmsModel.hasAttributeActive(k) && dmsModel.getAttribute(k).hasServiceWritePermission())
                    .with(DOCUMENT_ATTR_DESCRIPTION, document.getDescription(),
                            DOCUMENT_ATTR_DOCUMENTID, document.getDocumentId(),
                            DOCUMENT_ATTR_CARD, cardId,
                            DOCUMENT_ATTR_FILENAME, document.getFileName(),
                            DOCUMENT_ATTR_VERSION, document.getVersion(),
                            DOCUMENT_ATTR_MIMETYPE, document.getMimeType(),
                            DOCUMENT_ATTR_CATEGORY, document.getCategory(),
                            DOCUMENT_ATTR_SIZE, document.getFileSize(),
                            DOCUMENT_ATTR_HASH, document.getHash(),
                            DOCUMENT_ATTR_CREATED, document.getCreated());
            if (card != null) {
                card = dao.update(CardImpl.copyOf(card).withAttributes(attrs).build());
            } else {
                card = dao.create(CardImpl.buildCard(dmsModel, attrs));
            }
            return DocumentInfoAndDetailImpl.copyOf(document).withMetadata(card).build();
        }

        private Card getDocumentMetadataCardCreateIfMissing(DocumentInfoAndDetail document, long cardId) {
            Card card = getDocumentMetadataCardOrNull(cardId, document);
            if (card == null) {
                card = checkNotNull(setDocumentMetadata(document.getDocumentId(), document, emptyMap(), cardId).getMetadata());
            }
            return card;
        }

        @Nullable
        private Card getDocumentMetadataCardOrNull(long cardId, DocumentInfoAndDetail document) {
            return getDocumentMetadataCardOrNull(cardId, document.getCategory(), document.getDocumentId());
        }

        @Nullable
        private Card getDocumentMetadataCardOrNull(long cardId, String category, String documentId) {
            return dao.selectAll().from(getDmsModel(category)).whereExpr("\"Card\" = ? AND \"DocumentId\" = ?", cardId, checkNotBlank(documentId)).getCardOrNull();
        }

        @Nullable
        private Classe getDmsModel(DocumentInfoAndDetail document) {
            return getDmsModel(document.getCategory());
        }

        @Nullable
        private Classe getDmsModel(@Nullable String category) {
            if (isBlank(category)) {
                return dao.getClasse(DMS_MODEL_DEFAULT_CLASS);
            } else {
                LookupValue lookup = lookupService.getLookupByTypeAndId(getCategoryType(), toLong(category));
                checkArgument(lookup.getType().isDmsCategorySpeciality(), "invalid dms category lookup = %s", lookup);
                Classe dmsModel = dao.getClasse(firstNotBlank(lookup.getConfig().getDmsModelClass(), DMS_MODEL_DEFAULT_CLASS));
                checkArgument(dmsModel.isDmsModel(), "invalid dms model class = %s", dmsModel);
                return dmsModel;
            }
        }

    }

}
