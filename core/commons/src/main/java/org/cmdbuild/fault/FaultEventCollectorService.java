/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.cmdbuild.fault;

import java.util.List;
import java.util.Optional;

/**
 * service that provides {@link FaultEventCollector} instances, to
 * collect error and warning events that may happen in a request and should be
 * reported to user
 *
 * @author davide
 */
public interface FaultEventCollectorService {

    FaultEventCollector getCurrentRequestEventCollector();

    Optional<FaultEventCollector> getCurrentRequestEventCollectorIfExists();

    FaultEventCollector newEventCollector();

    List buildMessagesForJsonResponse(Throwable... additionalExceptions);
}
