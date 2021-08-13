/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.cmdbuild.temp;

import java.nio.charset.StandardCharsets;
import java.util.Map;
import javax.activation.DataHandler;
import javax.activation.DataSource;
import org.cmdbuild.utils.io.BigByteArray;
import static org.cmdbuild.utils.io.CmIoUtils.newDataHandler;

public interface TempService {

    String putTempData(DataHandler data);

    String putTempData(DataSource data);

    String putTempData(BigByteArray data);

    String putTempData(String data, Map<String, String> info);

    String putTempData(DataSource data, TempInfoSource source);//TODO improve this api

    DataHandler getTempData(String key);

    BigByteArray getTempDataBigBytes(String key);

    TempInfo getTempInfo(String key);

    default byte[] getTempDataBytes(String key) {
        return getTempDataBigBytes(key).toByteArray();
    }

    default String getTempDataAsString(String key) {
        return new String(getTempDataBytes(key), StandardCharsets.UTF_8);
    }

    default String putTempData(String data) {
        return putTempData(data.getBytes(StandardCharsets.UTF_8));
    }

    default String putTempData(byte[] data) {
        return putTempData(newDataHandler(data));
    }

}
