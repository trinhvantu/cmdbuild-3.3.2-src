/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.cmdbuild.etl.loader;

import java.util.List;
import javax.activation.DataSource;
import static org.apache.commons.lang3.math.NumberUtils.isNumber;
import static org.cmdbuild.utils.lang.CmConvertUtils.toLong;

public interface EtlTemplateService extends EtlTemplateRepository, EtlTemplateProcessorService {

    EtlTemplate getForUserById(long id);

    EtlTemplate getForUserByCode(String code);

    EtlTemplate getForUserByIdWithFilter(long id, String filter);

    EtlTemplate getForUserByCodeWithFilter(String code, String filter);

    List<EtlTemplate> getAllForUser();

    List<EtlTemplate> getForUserForTargetClassAndRelatedDomains(String classId);

    List<EtlTemplate> getForUserForTarget(EtlTemplateTarget target, String classId);

    DataSource buildImportResultReport(EtlProcessingResult result, EtlTemplate template);

    EtlProcessingResult importForUserDataWithTemplate(DataSource toDataSource, EtlTemplate template);

    default DataSource exportForUserDataWithTemplate(long id) {
        return exportDataWithTemplate(getForUserById(id));
    }

    default DataSource exportForUserDataWithTemplate(String idOrCode) {
        return exportDataWithTemplate(getForUserByIdOrCode(idOrCode));
    }

    default DataSource exportForUserDataWithTemplateAndFilter(String idOrCode, String filter) {
        return exportDataWithTemplate(getForUserByIdOrCodeWithFilter(idOrCode, filter));
    }

    default DataSource exportDataWithTemplate(long templateId) {
        return exportDataWithTemplate(getOne(templateId));
    }

    default EtlProcessingResult importDataWithTemplate(DataSource data, long templateId) {
        return importDataWithTemplate(data, getOne(templateId));
    }

    default EtlTemplate getForUserByIdOrCode(String code) {
        if (isNumber(code)) {
            return getForUserById(toLong(code));
        } else {
            return getForUserByCode(code);
        }
    }

    default EtlTemplate getForUserByIdOrCodeWithFilter(String idOrCode, String filter) {
        if (isNumber(idOrCode)) {
            return getForUserByIdWithFilter(toLong(idOrCode), filter);
        } else {
            return getForUserByCodeWithFilter(idOrCode, filter);
        }
    }

}
