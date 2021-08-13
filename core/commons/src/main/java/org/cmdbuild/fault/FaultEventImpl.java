/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.cmdbuild.fault;

import static com.google.common.base.Preconditions.checkArgument;
import static com.google.common.base.Preconditions.checkNotNull;
import static java.lang.String.format;
import javax.annotation.Nullable;
import static org.apache.commons.lang3.StringUtils.isBlank;
import static org.apache.commons.lang3.StringUtils.isNotBlank;
import org.apache.commons.lang3.exception.ExceptionUtils;
import static org.cmdbuild.utils.lang.CmExceptionUtils.exceptionToMessage;
import static org.cmdbuild.utils.lang.CmPreconditions.checkNotBlank;

public class FaultEventImpl implements FaultEvent {

    private final String message, stacktrace;
    private final FaultEventLevel level;
    private final Throwable exception;

    public FaultEventImpl(@Nullable String message, FaultEventLevel level) {
        this(message, level, (String) null);
    }

    public FaultEventImpl(@Nullable String message, FaultEventLevel level, @Nullable String stacktrace) {
        this.message = checkNotBlank(message);
        this.level = checkNotNull(level);
        this.stacktrace = stacktrace;
        this.exception = null;
    }

    public FaultEventImpl(@Nullable String message, FaultEventLevel level, @Nullable Throwable exception) {
        checkArgument(isNotBlank(message) || exception != null, "must provide message or exception");
        if (message == null) {
            this.message = exceptionToMessage(exception);
        } else {
            String exMessage = exceptionToMessage(exception);
            if (isBlank(exMessage)) {
                this.message = message;
            } else {
                this.message = format("%s: %s", message, exMessage);
            }
        }
        this.level = checkNotNull(level);
        this.exception = exception;
        stacktrace = exception == null ? null : ExceptionUtils.getStackTrace(exception);
    }

    @Override
    public String getMessage() {
        return message;
    }

    @Override
    public FaultEventLevel getLevel() {
        return level;
    }

    @Override
    @Nullable
    public Throwable getException() {
        return exception;
    }

    @Override
    @Nullable
    public String getStacktrace() {
        return stacktrace;
    }

}
