package org.cmdbuild.dao.entrytype;

import javax.annotation.Nullable;
import static org.apache.commons.lang3.StringUtils.isBlank;
import org.cmdbuild.dao.entrytype.attributetype.CardAttributeType;
import static org.cmdbuild.utils.lang.CmNullableUtils.isNotBlank;
import static org.cmdbuild.utils.lang.CmPreconditions.checkNotBlank;
import static org.cmdbuild.utils.lang.CmPreconditions.firstNotBlank;

public interface AttributeWithoutOwner extends AttributePermissions {

    CardAttributeType<?> getType();

    String getName();

    AttributeMetadata getMetadata();

    default String getDescription() {
        return firstNotBlank(getMetadata().getDescription(), getName());
    }

    default boolean isInherited() {
        return getMetadata().isInherited();
    }

    default boolean isActive() {
        return getMetadata().isActive();
    }

    default boolean showInGrid() {
        return getMetadata().showInGrid();
    }

    default boolean showInReducedGrid() {
        return getMetadata().showInReducedGrid();
    }

    default boolean isMandatory() {
        return getMetadata().isMandatory();
    }

    default boolean isUnique() {
        return getMetadata().isUnique();
    }

    default AttributePermissionMode getMode() {
        return getMetadata().getMode();
    }

    default int getIndex() {
        return getMetadata().getIndex();
    }

    default String getDefaultValue() {
        return getMetadata().getDefaultValue();
    }

    default boolean hasGroup() {
        return isNotBlank(getGroupNameOrNull());
    }

    default String getGroupName() {
        return checkNotBlank(getGroupNameOrNull());
    }

    @Nullable
    default String getGroupNameOrNull() {
        return getMetadata().getGroup();
    }

    default int getClassOrder() {
        return getMetadata().getClassOrder();
    }

    @Nullable
    default AttrEditorType getEditorType() {
        return getMetadata().getEditorType();
    }

    default boolean isDomainKey() {
        return getMetadata().isDomainKey();
    }

    default String getFilter() {
        return getMetadata().getFilter();
    }

    default boolean hasFilter() {
        return !isBlank(getFilter());
    }

    default String getForeignKeyDestinationClassName() {
        return getMetadata().getForeignKeyDestinationClassName();
    }

    default boolean isHtmlSafe() {
        switch (getMetadata().getTextContentSecurity()) {
            case TCS_HTML_ALL:
            case TCS_HTML_SAFE:
                return true;
            default:
                return false;
        }
    }

}
