/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.cmdbuild.config;

import java.util.List;

public interface UiConfiguration {

    int getUiTimeout();

    int getDetailWindowHeight();

    int getInlineCardHeight();

    int getDetailWindowWidth();

    int getPopupWindowWidth();

    int getPopupWindowHeight();
    
    int getStartDay();

    boolean getKeepFilterOnUpdatedCard();

    int getReferencecombolimit();

    String getDateFormat();

    String getDecimalsSeparator();

    String getThousandsSeparator();

    String getTimeFormat();

    boolean isCorsEnabled();

    List<String> getCorsAllowedOrigins();
}
