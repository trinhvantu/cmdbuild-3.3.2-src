/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.cmdbuild.translation.test;

import java.io.File;
import java.util.List;
import org.cmdbuild.translation.dao.Translation;
import static org.cmdbuild.translation.file.TranslationFromFileUtils.loadTranslations;
import static org.cmdbuild.utils.io.CmIoUtils.readToString;
import static org.junit.Assert.assertFalse;
import org.junit.Test;

public class TranslationFromFileTest {

    @Test
    public void testFileParsing1() {
        String fileContent = readToString(new File("../../ui/app/locales/Locales.js"));
        List<Translation> translations = loadTranslations(fileContent);
        assertFalse(translations.isEmpty());
    }

    @Test
    public void testFileParsing2() {
        String fileContent = readToString(new File("../../ui/app/locales/de/Locales.js"));
        List<Translation> translations = loadTranslations(fileContent);
        assertFalse(translations.isEmpty());
    }

}
