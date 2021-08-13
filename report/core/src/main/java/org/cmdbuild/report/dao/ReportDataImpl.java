package org.cmdbuild.report.dao;

import static com.google.common.base.Preconditions.checkArgument;
import org.cmdbuild.report.ReportData;
import java.util.List;

import com.google.common.collect.ImmutableList;
import static java.util.Collections.emptyList;
import javax.annotation.Nullable;
import static org.cmdbuild.dao.constants.SystemAttributes.ATTR_CODE;
import static org.cmdbuild.dao.constants.SystemAttributes.ATTR_DESCRIPTION;
import static org.cmdbuild.dao.constants.SystemAttributes.ATTR_ID;
import org.cmdbuild.dao.orm.annotations.CardAttr;
import org.cmdbuild.dao.orm.annotations.CardMapping;
import org.cmdbuild.report.ReportInfo;
import org.cmdbuild.utils.lang.Builder;
import static org.cmdbuild.utils.lang.CmCollectionUtils.list;
import static org.cmdbuild.utils.lang.CmCollectionUtils.nullToEmpty;
import static org.cmdbuild.utils.lang.CmNullableUtils.firstNotNull;
import static org.cmdbuild.utils.lang.CmNullableUtils.isNullOrEmpty;
import static org.cmdbuild.utils.lang.CmPreconditions.checkNotBlank;
import static org.cmdbuild.utils.lang.CmPreconditions.firstNotBlank;

@CardMapping("_Report")
public class ReportDataImpl implements ReportData {

    private final Long id;
    private final String code;
    private final String description;
    private final boolean isActive;
    private final String query;
    private final List<byte[]> images, compiledReports;
    private final List<String> imageNames, reports;

    private ReportDataImpl(ReportDataImplBuilder builder) {
        this.id = builder.id;
        this.code = checkNotBlank(builder.code, "report code cannot be null");
        this.description = firstNotBlank(builder.description, code);
        this.query = builder.query;
        byte[] mainReport = builder.mainReport;
        List<byte[]> subreports = nullToEmpty(builder.subReports);
        if (isNullOrEmpty(mainReport)) {
            compiledReports = emptyList();
        } else {
            compiledReports = ImmutableList.<byte[]>builder().add(mainReport).addAll(subreports).build();
        }
        this.images = ImmutableList.copyOf(nullToEmpty(builder.images));
        this.imageNames = ImmutableList.copyOf(nullToEmpty(builder.imageNames));
        this.reports = ImmutableList.copyOf(nullToEmpty(builder.reports));
        this.isActive = firstNotNull(builder.isActive, true);

        checkArgument(imageNames.size() == images.size(), "images data and names mismatch");
        checkArgument(!compiledReports.isEmpty() || !reports.isEmpty(), "must have either compiled reports or text reports");
    }

    @Override
    @Nullable
    @CardAttr(ATTR_ID)
    public Long getId() {
        return id;
    }

    @Override
    @CardAttr(ATTR_CODE)
    public String getCode() {
        return code;
    }

    @Override
    @CardAttr(ATTR_DESCRIPTION)
    public String getDescription() {
        return description;
    }

    @Override
    @CardAttr("Query")
    public String getQuery() {
        return query;
    }

    @CardAttr("MainReport")
    @Nullable
    public byte[] getMainReport() {
        return compiledReports.isEmpty() ? null : compiledReports.get(0);
    }

    @CardAttr("SubReports")
    public List<byte[]> getSubReports() {
        return compiledReports.isEmpty() ? emptyList() : compiledReports.subList(1, compiledReports.size());
    }

    @Override
    @CardAttr("Reports")
    public List<String> getSourceReports() {
        return reports;
    }

    @Override
    public List<byte[]> getCompiledReports() {
        return compiledReports;
    }

    @Override
    @CardAttr("Images")
    public List<byte[]> getImages() {
        return images;
    }

    @Override
    @CardAttr("ImageNames")
    public List<String> getImageNames() {
        return imageNames;
    }

    @Override
    @CardAttr("Active")
    public boolean isActive() {
        return isActive;
    }

    @Override
    public String toString() {
        return "ReportData{" + "id=" + id + ", code=" + code + '}';
    }

    public static ReportDataImplBuilder builder() {
        return new ReportDataImplBuilder();
    }

    public static ReportDataImplBuilder copyOf(ReportInfo source) {
        return new ReportDataImplBuilder().withInfo(source);

    }

    public static ReportDataImplBuilder copyOf(ReportData source) {
        return new ReportDataImplBuilder().withInfo(source)
                .withQuery(source.getQuery())
                .withCompiledReports(source.getCompiledReports())
                .withSourceReports(source.getSourceReports())
                .withImages(source.getImages())
                .withImageNames(source.getImageNames());

    }

    public static class ReportDataImplBuilder implements Builder<ReportDataImpl, ReportDataImplBuilder> {

        private Long id;
        private String code;
        private String description;
        private String query;
        private byte[] mainReport;
        private List<byte[]> subReports, images;
        private List<String> imageNames, reports;
        private Boolean isActive;

        public ReportDataImplBuilder withInfo(ReportInfo info) {
            return this
                    .withId(info.getId())
                    .withCode(info.getCode())
                    .withDescription(info.getDescription())
                    .withActive(info.isActive());
        }

        public ReportDataImplBuilder withId(Long id) {
            this.id = id;
            return this;
        }

        public ReportDataImplBuilder withCode(String code) {
            this.code = code;
            return this;
        }

        public ReportDataImplBuilder withDescription(String description) {
            this.description = description;
            return this;
        }

        public ReportDataImplBuilder withQuery(String query) {
            this.query = query;
            return this;
        }

        public ReportDataImplBuilder withMainReport(byte[] mainReport) {
            this.mainReport = mainReport;
            return this;
        }

        public ReportDataImplBuilder withSubReports(List<byte[]> subReports) {
            this.subReports = subReports;
            return this;
        }

        public ReportDataImplBuilder withCompiledReports(List<byte[]> compiledReports) {
            if (compiledReports == null || compiledReports.isEmpty()) {
                mainReport = null;
                subReports = emptyList();
            } else {
                mainReport = compiledReports.get(0);
                subReports = list(compiledReports.subList(1, compiledReports.size()));
            }
            return this;
        }

        public ReportDataImplBuilder withImages(List<byte[]> images) {
            this.images = images;
            return this;
        }

        public ReportDataImplBuilder withImageNames(List<String> imagesName) {
            this.imageNames = imagesName;
            return this;
        }

        public ReportDataImplBuilder withSourceReports(List<String> reports) {
            this.reports = reports;
            return this;
        }

        public ReportDataImplBuilder withActive(Boolean isActive) {
            this.isActive = isActive;
            return this;
        }

        @Override
        public ReportDataImpl build() {
            return new ReportDataImpl(this);
        }

    }
}
