/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.cmdbuild.workflow.api;

public interface CmdbuildClientConfig {

	String getUrl();

	String getUsername();

	String getPassword();

	boolean isTokenEnabled();

}
