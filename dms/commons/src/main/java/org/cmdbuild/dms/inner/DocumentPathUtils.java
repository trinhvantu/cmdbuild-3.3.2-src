/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.cmdbuild.dms.inner;

import static com.google.common.base.Predicates.equalTo;
import static com.google.common.base.Predicates.not;
import static java.lang.String.format;
import static java.util.stream.Collectors.joining;
import static java.util.stream.Collectors.toList;
import static org.cmdbuild.common.Constants.BASE_CLASS_NAME;
import org.cmdbuild.dao.entrytype.Classe;
import org.cmdbuild.utils.lang.CmCollectionUtils.FluentList;
import static org.cmdbuild.utils.lang.CmCollectionUtils.list;

public class DocumentPathUtils {

    public static String buildDocumentPath(Classe classe, long cardId) {
        return buildDocumentPathList(classe, cardId).collect(joining("/"));
    }

    public static String buildClassFolderPath(Classe classe) {
        return buildClassFolderPathList(classe).collect(joining("/"));
    }

    public static FluentList<String> buildDocumentPathList(Classe classe, long cardId) {
        return buildClassFolderPathList(classe).with(format("Id%s", cardId));
    }

    public static FluentList<String> buildClassFolderPathList(Classe classe) {
        return list(classe.getAncestorsAndSelf().stream().filter(not(equalTo(BASE_CLASS_NAME))).collect(toList()));
    }

}
