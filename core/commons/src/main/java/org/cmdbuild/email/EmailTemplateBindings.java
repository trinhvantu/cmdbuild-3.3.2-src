/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.cmdbuild.email;

import java.util.Collection;

public interface EmailTemplateBindings {

    Collection<String> getClientBindings();

    Collection<String> getServerBindings();

}
