package org.cmdbuild.dao.entrytype.attributetype;

import javax.annotation.Nullable;
import static org.cmdbuild.utils.lang.CmNullableUtils.firstNotNull;
import static org.cmdbuild.utils.lang.CmNullableUtils.ltEqZeroToNull;

public class StringAttributeType implements CardAttributeType<String> {

    public final int length;

    public StringAttributeType(@Nullable Integer length) {
        this.length = firstNotNull(ltEqZeroToNull(length), Integer.MAX_VALUE);
    }

    public StringAttributeType() {
        this(null);
    }

    public int getLength() {
        return length;
    }

    public boolean hasLength() {
        return length != Integer.MAX_VALUE;
    }

    @Override
    public void accept(CMAttributeTypeVisitor visitor) {
        visitor.visit(this);
    }

    @Override
    public String toString() {
        return "StringAttributeType{" + "length=" + length + '}';
    }

    @Override
    public AttributeTypeName getName() {
        return AttributeTypeName.STRING;
    }
}
