/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.cmdbuild.fault;

import static com.google.common.base.Preconditions.checkNotNull;
import static com.google.common.collect.ImmutableList.toImmutableList;
import com.google.common.collect.Ordering;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import static java.util.regex.Pattern.DOTALL;
import javax.annotation.Nullable;
import static org.apache.commons.lang3.StringUtils.isNotBlank;
import org.cmdbuild.fault.FaultEvent.LeveOrderErrorsFirst;
import static org.cmdbuild.utils.lang.CmCollectionUtils.list;
import static org.cmdbuild.utils.lang.CmConvertUtils.serializeEnum;
import org.cmdbuild.utils.lang.CmMapUtils.FluentMap;
import static org.cmdbuild.utils.lang.CmMapUtils.map;
import static org.cmdbuild.utils.lang.CmPreconditions.checkNotBlank;

public class FaultUtils {

    public static List<ErrorMessage> errorToMessage(FaultEvent event) {
        List<ErrorMessage> list = list();
        String message = event.getMessage();
        String errorCode;
        {
            Matcher matcher = Pattern.compile("(CME[\\[\\(\\s:]+([^;:\\s\\]\\)]+)[;:\\s\\]\\)]*)", DOTALL).matcher(message);
            if (matcher.find()) {
                errorCode = checkNotBlank(matcher.group(2));
                message = matcher.replaceFirst("");
            } else {
                errorCode = null;
            }
        }
        Matcher matcher = Pattern.compile("(CM_CUSTOM_EXCEPTION|CM|CMO)\\s*:\\s*([^\n\r]+?)\\s*([\n\r].*|(:\\s*|;\\s*nested exception is )?[a-zA-Z0-9_.-]+[.][a-zA-Z0-9_]+(Exception|Error):.*)?$", DOTALL).matcher(message);
        boolean addTechMessage = true;
        if (matcher.find()) {
            String userMessage = matcher.group(2);
            list.add(new ErrorMessageImpl(event.getLevel(), userMessage, errorCode, true));
            if (matcher.group(1).equals("CMO")) {
                addTechMessage = false;
            }
        }
        if (addTechMessage) {
            list.add(new ErrorMessageImpl(event.getLevel(), event.getMessage(), errorCode, false));
        }
        return list;
    }

    public static List buildResponseMessages(FaultEventCollector errors) {
        return buildResponseMessages(errors.getCollectedEvents());
    }

    public static List buildResponseMessages(List<FaultEvent> events) {
        return events.stream().sorted(Ordering.from(LeveOrderErrorsFirst.INSTANCE).onResultOf(FaultEvent::getLevel)).map(FaultUtils::errorToJsonMessages).flatMap(List::stream).collect(toImmutableList());
    }

    public static List<Map<String, Object>> errorToJsonMessages(FaultEvent event) {
        return FaultUtils.errorToMessage(event).stream().map(e -> buildMessageForResponse(e.getLevel(), e.showUser(), e.getMessage()).accept(m -> {
            if (e.hasCode()) {
                m.with("code", e.getCode());
            }
        })).collect(toImmutableList());
    }

    public static FluentMap<String, Object> buildMessageForResponse(FaultEventLevel level, boolean showUser, String message) {
        return map("level", serializeEnum(level).toUpperCase(), "show_user", showUser, "message", message);
    }

    public static List buildMessageListForResponse(FaultEventLevel level, boolean showUser, String message) {
        return list(buildMessageForResponse(level, showUser, message));
    }

    public static interface ErrorMessage {

        FaultEventLevel getLevel();

        String getMessage();

        @Nullable
        String getCode();

        boolean showUser();

        default boolean hasCode() {
            return isNotBlank(getCode());
        }
    }

    private static class ErrorMessageImpl implements ErrorMessage {

        private final FaultEventLevel level;
        private final String message, code;
        private final boolean showUser;

        public ErrorMessageImpl(FaultEventLevel level, String message, String code, boolean showUser) {
            this.level = checkNotNull(level);
            this.message = checkNotBlank(message);
            this.code = code;
            this.showUser = showUser;
        }

        @Override
        public FaultEventLevel getLevel() {
            return level;
        }

        @Override
        public String getMessage() {
            return message;
        }

        public String getCode() {
            return code;
        }

        @Override
        public boolean showUser() {
            return showUser;
        }

    }
}
