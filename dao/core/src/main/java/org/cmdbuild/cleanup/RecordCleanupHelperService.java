/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.cmdbuild.cleanup;

import javax.annotation.Nullable;

public interface RecordCleanupHelperService {

    void cleanupRecords(Class model, @Nullable Integer maxRecordsToKeep, @Nullable Long maxRecordAgeToKeep, @Nullable Object queryOptions);

    default void cleanupRecords(Class model, @Nullable Integer maxRecordsToKeep, @Nullable Long maxRecordAgeToKeep) {
        cleanupRecords(model, maxRecordsToKeep, maxRecordAgeToKeep, null);
    }

}
