/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.cmdbuild.temp;

import static com.google.common.base.Preconditions.checkArgument;
import static java.lang.Long.parseLong;
import static java.lang.String.format;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import static org.apache.commons.lang3.math.NumberUtils.isNumber;
import static org.cmdbuild.utils.encode.CmEncodeUtils.decodeString;
import static org.cmdbuild.utils.encode.CmEncodeUtils.encodeString;
import static org.cmdbuild.utils.hash.CmHashUtils.hash;
import static org.cmdbuild.utils.lang.CmPreconditions.checkNotBlank;
import static org.cmdbuild.utils.lang.CmPreconditions.checkNotNullAndGtZero;
import org.slf4j.LoggerFactory;

public class TempServiceUtils {

    public static String cardIdToTempId(long cardId) {
        return encodeString(format("%stemp%s", hash(Long.toString(cardId), 4), checkNotNullAndGtZero(cardId)));
    }

    public static boolean isTempId(String str) {
        checkNotBlank(str);
        try {
            return !isNumber(str) && decodeString(str).matches("[a-z0-9]{4}temp[0-9]+");
        } catch (Exception ex) {
            LoggerFactory.getLogger(TempServiceUtils.class).warn("error checking temp id = {}", str, ex);
            return false;
        }
    }

    public static long tempIdToCardId(String tempId) {
        String str = decodeString(tempId);
        Matcher matcher = Pattern.compile("[a-z0-9]{4}temp([0-9]+)").matcher(str);
        checkArgument(matcher.matches(), "invalid temp id syntax for str = %s", tempId);
        return checkNotNullAndGtZero(parseLong(matcher.group(1)));
    }

}
