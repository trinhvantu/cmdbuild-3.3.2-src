package org.cmdbuild.dms;

import static com.google.common.base.Preconditions.checkNotNull;
import java.util.List;
import java.util.Optional;

import javax.activation.DataHandler;

import javax.annotation.Nullable;
import org.cmdbuild.common.beans.CardIdAndClassName;
import org.cmdbuild.dao.entrytype.Classe;
import org.cmdbuild.data.filter.CmdbFilter;
import static org.cmdbuild.data.filter.utils.CmdbFilterUtils.noopFilter;
import org.cmdbuild.dms.inner.DmsProviderService;
import org.cmdbuild.dms.inner.DocumentInfoAndDetail;
import org.cmdbuild.lookup.LookupType;
import static org.cmdbuild.utils.io.CmIoUtils.toByteArray;
import org.cmdbuild.lookup.LookupValue;

public interface DmsService {

    final String DOCUMENT_ATTR_DOCUMENTID = "DocumentId",
            DOCUMENT_ATTR_CARD = "Card",
            DOCUMENT_ATTR_DESCRIPTION = "Description",
            DOCUMENT_ATTR_FILENAME = "FileName",
            DOCUMENT_ATTR_MIMETYPE = "MimeType",
            DOCUMENT_ATTR_SIZE = "Size",
            DOCUMENT_ATTR_HASH = "Hash",
            DOCUMENT_ATTR_CREATED = "CreationDate",
            DOCUMENT_ATTR_CATEGORY = "Category",
            DOCUMENT_ATTR_VERSION = "Version",
            DMS_MODEL_PARENT_CLASS = "DmsModel",
            DMS_MODEL_DEFAULT_CLASS = "BaseDocument";

    Classe getDmsModel(String className, @Nullable String category);

    List<DocumentInfoAndDetail> getCardAttachments(String className, long cardId, CmdbFilter filter, boolean includeMetadata);

    @Nullable
    DocumentInfoAndDetail getCardAttachmentOrNull(String className, long cardId, String fileName);

    DocumentInfoAndDetail getCardAttachmentById(String className, long cardId, String documentId);

    List<DocumentInfoAndDetail> getCardAttachmentVersions(String className, long cardId, String filename);

    DocumentInfoAndDetail create(String className, long cardId, DocumentData document);

    DocumentInfoAndDetail createAndSkipExisting(String className, long cardId, DocumentData document);

    DocumentInfoAndDetail updateDocumentWithAttachmentId(String className, long cardId, String attachmentId, DocumentData documentData);

    DataHandler download(String documentId, @Nullable String version);

    Optional<DataHandler> preview(String documentId);

    void delete(String className, long cardId, String filename);

    LookupType getCategoryLookupType(String classId);

    LookupType getCategoryLookupType(Classe classe);

    LookupValue getCategoryLookup(String classId, String category);

    LookupValue getCategoryLookup(Classe classe, String category);

    DataHandler exportAllDocuments();

    boolean isEnabled();

    void checkRegularFileAttachment(DocumentData document);
    
    void checkRegularFileSize(DocumentData document);

    void checkIncomingEmailAttachment(DocumentData document);

    DmsProviderService getService();

    default LookupValue getCategoryLookupForAttachment(Classe classe, DocumentInfoAndDetail document) {
        return getCategoryLookup(classe, document.getCategory());
    }

    default Classe getDmsModel(String className, long category) {
        return getDmsModel(className, Long.toString(category));
    }

    default List<DocumentInfoAndDetail> getCardAttachments(String className, long cardId, CmdbFilter filter) {
        return getCardAttachments(className, cardId, filter, false);
    }

    default List<DocumentInfoAndDetail> getCardAttachments(String className, long cardId) {
        return getCardAttachments(className, cardId, noopFilter());
    }

    default List<DocumentInfoAndDetail> getCardAttachments(CardIdAndClassName card) {
        return getCardAttachments(card.getClassName(), card.getId());
    }

    default DocumentInfoAndDetail copy(CardIdAndClassName sourceCard, String fileName, CardIdAndClassName targetCard) {
        DocumentInfoAndDetail source = getCardAttachmentWithFilename(sourceCard.getClassName(), sourceCard.getId(), fileName);
        return create(targetCard.getClassName(), targetCard.getId(), DocumentDataImpl.copyOf(source).withData(DmsService.this.getDocumentBytes(source.getDocumentId())).build());
    }

    default DocumentInfoAndDetail copyAndMerge(CardIdAndClassName sourceCard, String fileName, CardIdAndClassName targetCard) {
        DocumentInfoAndDetail source = getCardAttachmentWithFilename(sourceCard.getClassName(), sourceCard.getId(), fileName);
        return createAndSkipExisting(targetCard.getClassName(), targetCard.getId(), DocumentDataImpl.copyOf(source).withData(DmsService.this.getDocumentBytes(source.getDocumentId())).build());
    }

    default DocumentInfoAndDetail move(CardIdAndClassName sourceCard, String fileName, CardIdAndClassName targetCard) {
        DocumentInfoAndDetail res = copy(sourceCard, fileName, targetCard);
        delete(sourceCard.getClassName(), sourceCard.getId(), fileName);
        return res;
    }

    default DocumentInfoAndDetail getCardAttachmentWithFilename(String className, long cardId, String fileName) {
        return checkNotNull(getCardAttachmentOrNull(className, cardId, fileName), "card attachment not found for class = %s card = %s fileName = %s", className, cardId, fileName);
    }

    default boolean hasCardAttachmentWithFileName(String className, long cardId, String fileName) {
        return getCardAttachmentOrNull(className, cardId, fileName) != null;
    }

    default DocumentInfoAndDetail create(CardIdAndClassName card, DocumentData document) {
        return create(card.getClassName(), card.getId(), document);
    }

    default DataHandler getDocumentData(String className, long cardId, String filename) {
        return DmsService.this.getDocumentData(className, cardId, filename, null);
    }

    default DataHandler getDocumentData(String className, long cardId, String filename, @Nullable String version) {
        DocumentInfoAndDetail document = getCardAttachmentWithFilename(className, cardId, filename);
        return download(document.getDocumentId(), version);
    }

    default DataHandler getDocumentData(String documentId) {
        return download(documentId, null);
    }

    default byte[] getDocumentBytes(String documentId) {
        return toByteArray(DmsService.this.getDocumentData(documentId));
    }

    default DocumentInfoAndDetail updateDocumentWithFilename(String className, long cardId, String filename, DocumentData documentData) {
        DocumentInfoAndDetail document = getCardAttachmentWithFilename(className, cardId, filename);
        return updateDocumentWithAttachmentId(className, cardId, document.getDocumentId(), documentData);
    }

    default byte[] getDocumentBytes(DocumentInfoAndDetail documentInfo) {
        return DmsService.this.getDocumentBytes(documentInfo.getDocumentId());
    }

    default void deleteByAttachmentId(String classId, long cardId, String attachmentId) {
        DocumentInfoAndDetail document = getCardAttachmentById(classId, cardId, attachmentId);
        delete(classId, cardId, document.getFileName());
    }

}
