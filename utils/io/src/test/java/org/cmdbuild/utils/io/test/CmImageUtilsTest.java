/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.cmdbuild.utils.io.test;

import java.io.IOException;
import javax.imageio.ImageIO;
import static org.cmdbuild.utils.io.CmImageUtils.imageEquals;
import static org.junit.Assert.assertTrue;
import org.junit.Test;

public class CmImageUtilsTest {

    @Test
    public void testImageEquals() throws IOException {
        assertTrue(imageEquals(ImageIO.read(getClass().getResourceAsStream("/org/cmdbuild/utils/io/test/image1.jpg")), ImageIO.read(getClass().getResourceAsStream("/org/cmdbuild/utils/io/test/image1.jpg"))));
    }

}
