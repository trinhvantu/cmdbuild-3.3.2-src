/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.cmdbuild.email;

import javax.activation.DataHandler;
import javax.annotation.Nullable;
import static org.apache.commons.lang3.StringUtils.isNotBlank;
import org.cmdbuild.utils.io.CmIoUtils;
import static org.cmdbuild.utils.io.CmIoUtils.newDataHandler;
import static org.cmdbuild.utils.io.CmIoUtils.readToString;

public interface EmailAttachment {

    String getFileName();

    String getContentType();

    @Nullable
    String getContentId();

    byte[] getData();

    default boolean hasContentId() {
        return isNotBlank(getContentId());
    }

    default boolean isOfType(String mimetype) {
        return CmIoUtils.isContentType(getContentType(), mimetype);
    }

    default String getDataAsString() {
        return readToString(getData(), getContentType());
    }

    default DataHandler getDataHandler() {
        return newDataHandler(getData(), getContentType(), getFileName());
    }

}
