package org.cmdbuild.report.inner;

import static com.google.common.base.Preconditions.checkArgument;
import java.util.Map;

import javax.activation.DataHandler;

import static com.google.common.base.Preconditions.checkNotNull;
import java.util.List;
import static java.util.stream.Collectors.toList;
import org.cmdbuild.auth.grant.PrivilegeSubjectWithInfo;
import static org.cmdbuild.auth.role.RolePrivilege.RP_ADMIN_REPORTS_MODIFY;
import static org.cmdbuild.auth.role.RolePrivilege.RP_ADMIN_REPORTS_VIEW;
import org.cmdbuild.auth.user.OperationUserStore;
import org.cmdbuild.dao.entrytype.Attribute;
import org.cmdbuild.report.ReportFormat;
import org.cmdbuild.report.ReportInfo;
import org.cmdbuild.report.ReportService;
import org.cmdbuild.report.ReportData;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.cmdbuild.report.dao.ReportRepository;
import org.cmdbuild.report.dao.ReportDataImpl;
import static org.cmdbuild.report.inner.utils.ReportUtils.updateReportData;
import static org.cmdbuild.report.inner.utils.ReportUtils.getReportParameters;
import static org.cmdbuild.report.inner.utils.ReportUtils.loadReport;

@Component
public class ReportServiceImpl implements ReportService {//TODO localization of report (description, other)

    private final Logger logger = LoggerFactory.getLogger(getClass());

    private final ReportRepository reportRepository;
    private final OperationUserStore operationUser;
    private final ReportProcessorService processor;

    public ReportServiceImpl(ReportRepository reportStore, OperationUserStore operationUser, ReportProcessorService processor) {
        this.reportRepository = checkNotNull(reportStore);
        this.operationUser = checkNotNull(operationUser);
        this.processor = checkNotNull(processor);
    }

    @Override
    public List<ReportInfo> getAll() {
        return (List) reportRepository.getAllActiveReports();
    }

    @Override
    public List<ReportInfo> getForCurrentUser() {
        return reportRepository.getAllActiveReports().stream().filter(this::canRead).map(ReportInfo.class::cast).collect(toList());
    }

    @Override
    public ReportInfo getById(long reportId) {
        return reportRepository.getById(reportId);
    }

    @Override
    public PrivilegeSubjectWithInfo getReportAsPrivilegeSubjectById(long reportId) {
        return reportRepository.getById(reportId);
    }

    @Override
    public boolean isAccessibleByCode(String reportCode) {
        return canRead(reportRepository.getReportByCode(reportCode));
    }

    @Override
    public ReportInfo getByCode(String code) {
        return reportRepository.getReportByCode(code);
    }

    @Override
    public ReportData getReportData(long reportId) {
        return reportRepository.getById(reportId);
    }

    @Override
    public ReportData updateReportTemplate(long reportId, Map<String, byte[]> reportFiles) {
        ReportData reportData = checkCanWrite(getReportData(reportId));
        reportData = ReportDataImpl.copyOf(reportData).accept(updateReportData(reportFiles)).build();
        reportData = ReportDataImpl.copyOf(loadReport(reportData)).build();
        return reportRepository.updateReport(reportData);
    }

    @Override
    public ReportData createReport(ReportInfo data, Map<String, byte[]> files) {
        checkCanCreate();
        ReportData reportData = ReportDataImpl.copyOf(data).accept(updateReportData(files)).build();
        reportData = ReportDataImpl.copyOf(loadReport(reportData)).build();
        return reportRepository.createReport(reportData);
    }

    @Override
    public ReportData updateReportInfo(ReportInfo info) {
        ReportData reportData = getReportData(info.getId());
        reportData = ReportDataImpl.copyOf(reportData).withInfo(info).build();
        return reportRepository.updateReport(reportData);
    }

    @Override
    public ReportData updateReport(ReportInfo info, Map<String, byte[]> files) {
        ReportData reportData = checkCanWrite(getReportData(info.getId()));
        reportData = ReportDataImpl.copyOf(reportData).withInfo(info).accept(updateReportData(files)).build();
        reportData = ReportDataImpl.copyOf(loadReport(reportData)).build();
        return reportRepository.updateReport(reportData);
    }

    @Override
    public void deleteReport(long reportId) {
        ReportInfo report = checkCanWrite(getReportData(reportId));
        reportRepository.deleteReportById(report.getId());
    }

    @Override
    public ReportInfo getForUserByIdOrCode(String idOrCode) {
        ReportInfo report = getByIdOrCode(idOrCode);
        checkArgument(canRead(report), "CM: access denied: you are not allowed to access this report");
        return report;
    }

    private boolean canRead(ReportInfo report) {
        return operationUser.hasPrivileges((p) -> p.hasPrivileges(RP_ADMIN_REPORTS_VIEW) || p.hasReadAccess(report));//TODO auto grant read from reports view
    }

    private <T extends ReportInfo> T checkCanWrite(T report) {
        checkArgument(operationUser.getPrivileges().hasPrivileges(RP_ADMIN_REPORTS_MODIFY), "CM: permission denied: you are not allowed to modify this report");
        return report;
    }

    private void checkCanCreate() {
        checkArgument(operationUser.getPrivileges().hasPrivileges(RP_ADMIN_REPORTS_MODIFY), "CM: permission denied: you are not allowed to create reports");
    }

    @Override
    public List<Attribute> getParamsById(long id) {
        ReportDataExt reportData = reportRepository.getById(id);
        return getReportParameters(reportData).stream().map(ReportParameter::toCardAttribute).collect(toList());
    }

    @Override
    public DataHandler executeReportAndDownload(long reportId, ReportFormat reportExtension, Map<String, Object> parameters) {
        ReportDataExt report = reportRepository.getById(reportId);
        return processor.executeReport(report, reportExtension, parameters);
    }

}
