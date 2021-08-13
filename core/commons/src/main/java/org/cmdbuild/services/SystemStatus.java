/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.cmdbuild.services;

public enum SystemStatus {

    SYST_WAITING_FOR_APP_CONTEXT,
    SYST_PREPARING_SERVICES,
    SYST_LOADING_CONFIG_FILES,
    SYST_BEFORE_DATABASE_CHECK,
    SYST_CHECKING_DATABASE,
    SYST_BEFORE_PATCH_CHECK,
    SYST_CHECKING_PATCH,
    SYST_WAITING_FOR_PATCH_MANAGER,
    SYST_WAITING_FOR_DATABASE_CONFIGURATION,
    SYST_BEFORE_LOADING_CONFIG,
    SYST_LOADING_CONFIG,
    SYST_BEFORE_STARTING_SERVICES,
    SYST_STARTING_SERVICES,
    SYST_BEFORE_READY,
    SYST_READY,
    SYST_BEFORE_STOPPING_SERVICES,
    SYST_STOPPING_SERVICES,
    SYST_NOT_RUNNING,
    SYST_ERROR

}
