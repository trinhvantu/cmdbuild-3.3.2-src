/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.cmdbuild.client.rest.api;

import java.io.InputStream;
import javax.annotation.Nullable;
import org.cmdbuild.client.rest.model.CustomComponentInfo;

public interface CustomComponentApi {

    CustomComponentApiResponse uploadCustomPage(InputStream data, String description, @Nullable String targetDevice);
    
    CustomComponentApiResponse uploadCustomWidget(InputStream data, String description, @Nullable String targetDevice);
    
    CustomComponentApiResponse uploadCustomContextMenu(InputStream data, String description, @Nullable String targetDevice);

    interface CustomComponentApiResponse {

        CustomComponentInfo getCustomComponentInfo();

        CustomComponentApi then();
    }

}
