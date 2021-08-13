/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.cmdbuild.utils.alfresco.migrator.inner;

import java.util.function.Consumer;
import org.cmdbuild.utils.alfresco.migrator.AlfrescoSourceDocument;
import org.cmdbuild.utils.alfresco.migrator.AlfrescoSourceDocumentInfo;

public interface AlfrescoSource extends AutoCloseable {

    void readSourceDocumentInfos(Consumer<AlfrescoSourceDocumentInfo> consumer);

    void readSourceDocuments(Consumer<AlfrescoSourceDocument> consumer);

}
