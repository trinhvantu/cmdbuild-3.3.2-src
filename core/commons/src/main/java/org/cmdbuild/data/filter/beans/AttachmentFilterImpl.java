/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.cmdbuild.data.filter.beans;

import org.cmdbuild.data.filter.AttachmentFilter;
import static org.cmdbuild.utils.lang.CmPreconditions.checkNotBlank;

public class AttachmentFilterImpl implements AttachmentFilter {

    private final String query;

    public AttachmentFilterImpl(String query) {
        this.query = checkNotBlank(query);
    }

    @Override
    public String getQuery() {
        return query;
    }

}
