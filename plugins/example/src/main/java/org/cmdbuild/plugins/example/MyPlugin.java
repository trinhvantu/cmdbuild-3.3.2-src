/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.cmdbuild.plugins.example;

import static java.lang.String.format;

public class MyPlugin {

    public static String hello(String param) {
        return format("hello %s!", param);
    }

}
