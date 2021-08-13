/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.cmdbuild.etl.loader.inner;

import static com.google.common.base.Preconditions.checkNotNull;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.StringWriter;
import static java.lang.Math.max;
import static java.lang.String.format;
import java.nio.charset.StandardCharsets;
import java.util.List;
import static java.util.stream.Collectors.joining;
import static java.util.stream.Collectors.toList;
import javax.activation.DataSource;
import org.apache.poi.ss.usermodel.Cell;
import static org.apache.poi.ss.usermodel.CellType.STRING;
import org.apache.poi.ss.usermodel.Row;
import org.cmdbuild.auth.user.OperationUserSupplier;
import org.cmdbuild.data.filter.utils.CmdbFilterUtils;
import org.cmdbuild.etl.EtlException;
import org.cmdbuild.etl.loader.EtlTemplateTarget;
import static org.cmdbuild.etl.utils.EtlTemplateUtils.buildWorkbook;
import static org.cmdbuild.etl.utils.EtlTemplateUtils.getCsvPreference;
import org.cmdbuild.etl.utils.WorkbookInfo;
import static org.cmdbuild.utils.io.CmIoUtils.newDataSource;
import static org.cmdbuild.utils.lang.CmCollectionUtils.list;
import static org.cmdbuild.utils.lang.CmStringUtils.toStringOrEmpty;
import static org.cmdbuild.utils.lang.LambdaExceptionUtils.rethrowConsumer;
import org.springframework.stereotype.Component;
import org.supercsv.io.CsvListWriter;
import org.cmdbuild.etl.loader.EtlTemplate;
import org.cmdbuild.etl.loader.EtlTemplateProcessorService;
import org.cmdbuild.etl.loader.EtlProcessingResult;
import org.cmdbuild.etl.loader.EtlTemplateImpl;
import org.cmdbuild.etl.loader.EtlTemplateRepository;
import org.cmdbuild.etl.loader.EtlTemplateService;
import org.cmdbuild.etl.loader.EtlTemplateWithData;

@Component
public class EtlTemplateServiceImpl implements EtlTemplateService {

    private final EtlTemplateRepository templateService;
    private final EtlTemplateProcessorService processorService;
    private final OperationUserSupplier userSupplier;

    public EtlTemplateServiceImpl(EtlTemplateRepository templateService, EtlTemplateProcessorService processorService, OperationUserSupplier userSupplier) {
        this.templateService = checkNotNull(templateService);
        this.processorService = checkNotNull(processorService);
        this.userSupplier = checkNotNull(userSupplier);
    }

    @Override
    public EtlProcessingResult importDataWithTemplate(Object data, EtlTemplate template) {
        return processorService.importDataWithTemplate(data, template);
    }

    @Override
    public EtlProcessingResult importDataWithTemplates(List<EtlTemplateWithData> templatesWithData) {
        return processorService.importDataWithTemplates(templatesWithData);
    }

    @Override
    public List<EtlTemplate> getAllForUser() {
        return getAll().stream().filter(t -> userSupplier.hasPrivileges(p -> p.hasReadAccess(t))).collect(toList());
    }

    @Override
    public EtlTemplate getForUserById(long id) {
        EtlTemplate template = getOne(id);
        userSupplier.checkPrivileges(p -> p.hasReadAccess(template), "user not authorized to access template = %s", id);
        return template;
    }

    @Override
    public EtlTemplate getForUserByCode(String code) {
        EtlTemplate template = getTemplateByName(code);
        userSupplier.checkPrivileges(p -> p.hasReadAccess(template), "user not authorized to access template = %s", code);
        return template;
    }

    @Override
    public EtlTemplate getForUserByIdWithFilter(long id, String filter) {
        EtlTemplate template = getOne(id);
        userSupplier.checkPrivileges(p -> p.hasReadAccess(template), "user not authorized to access template = %s", id);
        return EtlTemplateImpl.copyOf(template).withFilter(template.getFilter().and(CmdbFilterUtils.parseFilter(filter))).build();
    }

    @Override
    public EtlTemplate getForUserByCodeWithFilter(String code, String filter) {
        EtlTemplate template = getTemplateByName(code);
        userSupplier.checkPrivileges(p -> p.hasReadAccess(template), "user not authorized to access template = %s", code);
        return EtlTemplateImpl.copyOf(template).withFilter(template.getFilter().and(CmdbFilterUtils.parseFilter(filter))).build();
    }

    @Override
    public EtlProcessingResult importForUserDataWithTemplate(DataSource data, EtlTemplate template) {
        userSupplier.checkPrivileges(p -> p.hasReadAccess(template), "user not authorized to import with template = %s", template.getId());
        return importDataWithTemplate(data, template);
    }

    @Override
    public List<EtlTemplate> getForUserForTargetClassAndRelatedDomains(String classId) {
        return getAllForTargetClassAndRelatedDomains(classId).stream().filter(t -> userSupplier.hasPrivileges(p -> p.hasReadAccess(t))).collect(toList());
    }

    @Override
    public List<EtlTemplate> getForUserForTarget(EtlTemplateTarget target, String classId) {
        return getAllForTarget(target, classId).stream().filter(t -> userSupplier.hasPrivileges(p -> p.hasReadAccess(t))).collect(toList());
    }

    @Override
    public List<EtlTemplate> getAll() {
        return templateService.getAll();
    }

    @Override
    public List<EtlTemplate> getAllForTarget(EtlTemplateTarget type, String name) {
        return templateService.getAllForTarget(type, name);
    }

    @Override
    public List<EtlTemplate> getAllForTargetClassAndRelatedDomains(String classId) {
        return templateService.getAllForTargetClassAndRelatedDomains(classId);
    }

    @Override
    public EtlTemplate getOne(long templateId) {
        return templateService.getOne(templateId);
    }

    @Override
    public EtlTemplate create(EtlTemplate template) {
        return templateService.create(template);
    }

    @Override
    public EtlTemplate update(EtlTemplate template) {
        return templateService.update(template);
    }

    @Override
    public void delete(long templateId) {
        templateService.delete(templateId);
    }

    @Override
    public DataSource exportDataWithTemplate(EtlTemplate template) {
        return processorService.exportDataWithTemplate(template);
    }

    @Override
    public EtlTemplate getTemplateByName(String templateName) {
        return templateService.getTemplateByName(templateName);
    }

    @Override
    public DataSource buildImportResultReport(EtlProcessingResult result, EtlTemplate template) {
        try {
            List<List<?>> reportData = list(
                    list(""),
                    list("processed", result.getProcessedRecordCount()),
                    list("created", result.getCreatedRecordCount()),
                    list("modified", result.getModifiedRecordCount()),
                    list("deleted", result.getDeletedRecordCount()),
                    list("unmodified", result.getUnmodifiedRecordCount()),
                    list("errors", result.getErrors().size()),
                    list(""),
                    list("record", "line", "error", "detail", "data")
            );
            result.getErrors().stream().map(e -> list(e.getRecordIndex(), e.getRecordLineNumber(), e.getUserErrorMessage(), e.getTechErrorMessage(), e.getRecordData().stream().map(r -> format("%s = %s", r.getKey(), r.getValue())).collect(joining(", ")))).forEach(reportData::add);
            switch (template.getFileFormat()) {
                case EFF_CSV:
                    StringWriter writer = new StringWriter();
                    try (CsvListWriter csv = new CsvListWriter(writer, getCsvPreference(template))) {
                        reportData.forEach(rethrowConsumer(e -> csv.write(e)));
                    }
                    return newDataSource(writer.toString().getBytes(StandardCharsets.UTF_8), "text/csv", "export.csv");
                case EFF_XLS:
                case EFF_XLSX:
                    WorkbookInfo workbookInfo = buildWorkbook(template, "report");
                    reportData.forEach(r -> {
                        Row row = workbookInfo.getSheet().createRow(max(workbookInfo.getSheet().getLastRowNum(), 0) + 1);
                        r.forEach(c -> {
                            Cell cell = row.createCell(max(row.getLastCellNum(), 0), STRING);
                            cell.setCellValue(toStringOrEmpty(c));
                        });
                    });
                    ByteArrayOutputStream out = new ByteArrayOutputStream();
                    workbookInfo.getWorkbook().write(out);
                    return newDataSource(out.toByteArray(), workbookInfo.getContentType(), "report." + workbookInfo.getFileExt());
                default:
                    throw new EtlException("unsupported template file format = %s", template.getFileFormat());
            }
        } catch (IOException ex) {
            throw new EtlException(ex);
        }
    }

}
