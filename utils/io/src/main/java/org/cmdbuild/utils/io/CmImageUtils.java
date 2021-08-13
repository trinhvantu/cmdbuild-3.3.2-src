/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.cmdbuild.utils.io;

import java.awt.image.RenderedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.Arrays;
import javax.imageio.ImageIO;
import static org.cmdbuild.utils.lang.CmExceptionUtils.runtime;

public class CmImageUtils {

    public static byte[] toByteArray(RenderedImage image, String format) {
        try {
            ByteArrayOutputStream out = new ByteArrayOutputStream();
            ImageIO.write(image, format, out);
            return out.toByteArray();
        } catch (IOException ex) {
            throw runtime(ex);
        }
    }

    public static boolean imageEquals(RenderedImage one, RenderedImage two) { //TODO improve this (?)
        byte[] data1 = toByteArray(one, "png"), data2 = toByteArray(two, "png");
        return Arrays.equals(data1, data2);
    }

}
