/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.cmdbuild.dao.orm;

import org.cmdbuild.dao.beans.Item;

public interface SetterContext {

    Item getItem(String type, long id);

}