/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.cmdbuild.common.beans;

import static com.google.common.base.Preconditions.checkArgument;
import static java.lang.String.format;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import javax.annotation.Nullable;
import static org.apache.commons.lang3.StringUtils.isBlank;
import static org.apache.commons.lang3.math.NumberUtils.isNumber;
import static org.cmdbuild.common.beans.CardIdAndClassNameImpl.card;
import static org.cmdbuild.utils.lang.CmConvertUtils.toLong;

public class CardIdAndClassNameUtils {

    @Nullable
    public static CardIdAndClassName parseCardIdAndClassName(@Nullable String expr) {
        if (isBlank(expr)) {
            return null;
        } else {
            Matcher matcher = Pattern.compile("\\s*([a-zA-Z0-9_]+)\\s*[.:|\\[]\\s*([0-9]+)\\s*\\]?\\s*").matcher(expr);
            checkArgument(matcher.matches(), "invalid class/card format for expr =< %s >", expr);
            return card(matcher.group(1), toLong(matcher.group(2)));
        }
    }

    @Nullable
    public static CardIdAndClassName parseCardIdAndClassName(@Nullable String expr, String defaultClass) {
        if (isBlank(expr)) {
            return null;
        } else {
            return isNumber(expr) ? card(defaultClass, toLong(expr)) : parseCardIdAndClassName(expr);
        }
    }

    @Nullable
    public static String serializeCardIdAndClassName(@Nullable CardIdAndClassName cardIdAndClassName) {
        if (cardIdAndClassName == null) {
            return null;
        } else {
            checkArgument(cardIdAndClassName.hasId());
            checkArgument(cardIdAndClassName.hasType());
            return format("%s:%s", cardIdAndClassName.getClassName(), cardIdAndClassName.getId());
        }
    }
}
