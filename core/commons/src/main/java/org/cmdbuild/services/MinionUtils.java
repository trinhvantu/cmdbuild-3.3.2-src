/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.cmdbuild.services;

import static org.cmdbuild.services.MinionStatus.MS_DISABLED;
import static org.cmdbuild.services.MinionStatus.MS_READY;

public class MinionUtils {

    public static MinionStatus getMinionStatus(boolean isEnabled) {
        return isEnabled ? MS_READY : MS_DISABLED;
    }
//    public static MinionStatus getStatus(boolean isEnabled, boolean isStopped) {
//        if (isEnabled) {
//            if (isStopped) {
//                return MS_NOTRUNNING;
//            } else {
//                return MS_READY;
//            }
//        } else {
//            return MS_DISABLED;
//        }
//    }

}
