/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.cmdbuild.dao.entrytype;

import static com.google.common.base.Objects.equal;
import static com.google.common.base.Preconditions.checkNotNull;
import java.util.List;
import javax.annotation.Nullable;
import static org.apache.commons.lang3.StringUtils.isNotBlank;
import org.cmdbuild.common.beans.CardIdAndClassName;
import org.cmdbuild.lookup.DmsCategoryConfig;
import static org.cmdbuild.utils.lang.CmExceptionUtils.illegalArgument;
import static org.cmdbuild.utils.lang.CmPreconditions.checkNotBlank;
import static org.cmdbuild.dao.entrytype.ClassMetadata.ClassSpeciality.CS_DMSMODEL;
import static org.cmdbuild.dao.entrytype.ClassMetadata.ClassSpeciality.CS_PROCESS;
import static org.cmdbuild.dao.entrytype.ClassMetadata.ClassSpeciality.CS_DEFAULT;

public interface ClassMetadata extends EntryTypeMetadata, DmsCategoryConfig {

    static final String SUPERCLASS = "cm_superclass",
            CLASS_TYPE = "cm_class_type",
            CLASS_TYPE_SIMPLE = "simpleclass",
            CLASS_TYPE_STANDARD = "class",
            USER_STOPPABLE = "cm_stoppable",
            WORKFLOW_STATUS_ATTR = "cm_workflow_status_attr",
            WORKFLOW_MESSAGE_ATTR = "cm_workflow_message_attr",
            WORKFLOW_ENABLE_SAVE_BUTTON = "cm_workflow_enable_save_button",
            WORKFLOW_PROVIDER = "cm_workflow_provider",
            DMS_CATEGORY = "cm_dms_category",
            DEFAULT_FILTER = "cm_default_filter",
            DEFAULT_IMPORT_TEMPLATE = "cm_default_import_template",
            DEFAULT_EXPORT_TEMPLATE = "cm_default_export_template",
            NOTE_INLINE = "cm_note_inline",
            NOTE_INLINE_CLOSED = "cm_note_inline_closed",
            ATTACHMENTS_INLINE = "cm_attachments_inline",
            ATTACHMENTS_INLINE_CLOSED = "cm_attachments_inline_closed",
            VALIDATION_RULE = "cm_validation_rule",
            CLASS_ICON = "cm_class_icon",
            PROCESS_ENGINE = "cm_process_engine",
            MULTITENANT_MODE = "cm_multitenant_mode",
            DOMAIN_ORDER = "cm_domain_order",
            CLASS_SPECIALITY = "cm_class_speciality",
            HELP_MESSAGE = "cm_help",
            TEMPLATE_TYPE_TEMPLATE = "template",
            TEMPLATE_TYPE_GATE = "gate";

    boolean isSuperclass();

    ClassType getClassType();

    boolean isWfUserStoppable();

    ClassSpeciality getClassSpeciality();

    @Nullable
    String getFlowStatusAttr();

    @Nullable
    String getFlowProviderOrNull();

    @Nullable
    String getMessageAttr();

    @Nullable
    Boolean isFlowSaveButtonEnabled();

    @Nullable
    String getDmsCategoryOrNull();

    @Nullable
    CardIdAndClassName getDefaultImportTemplateOrNull();

    @Nullable
    Long getDefaultFilterOrNull();

    @Nullable
    Long getDefaultExportTemplateOrNull();

    @Nullable
    String getValidationRuleOrNull();

    boolean getNoteInline();

    boolean getNoteInlineClosed();

    boolean getAttachmentsInline();

    boolean getAttachmentsInlineClosed();

    ClassMultitenantMode getMultitenantMode();

    List<String> getDomainOrder();

    @Nullable
    String getHelpMessage();

    default CardIdAndClassName getDefaultImportTemplate() {
        return checkNotNull(getDefaultImportTemplateOrNull());
    }

    default boolean isDmsModel() {
        return equal(getClassSpeciality(), CS_DMSMODEL);
    }

    default boolean isProcess() {
        return equal(getClassSpeciality(), CS_PROCESS);
    }

    default boolean isDefaultSpeciality() {
        return equal(getClassSpeciality(), CS_DEFAULT);
    }

    default boolean holdsHistory() {
        switch (getClassType()) {
            case CT_STANDARD:
                return true;
            case CT_SIMPLE:
                return false;
            default:
                throw illegalArgument("unsupproted class type = %s", getClassType());
        }
    }

    default boolean hasIcon() {
        return isNotBlank(getAll().get(CLASS_ICON));
    }

    default String getIcon() {
        return checkNotBlank(getAll().get(CLASS_ICON));
    }

    default boolean isSimpleClass() {
        return equal(getClassType(), ClassType.CT_SIMPLE);
    }

    default boolean isStandardClass() {
        return equal(getClassType(), ClassType.CT_STANDARD);
    }

    enum ClassSpeciality {
        CS_DEFAULT, CS_DMSMODEL, CS_PROCESS
    }

}
