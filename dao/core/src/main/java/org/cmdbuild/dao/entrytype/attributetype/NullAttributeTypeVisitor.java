package org.cmdbuild.dao.entrytype.attributetype;

public class NullAttributeTypeVisitor implements CMAttributeTypeVisitor {

    private static final NullAttributeTypeVisitor INSTANCE = new NullAttributeTypeVisitor();

    public static NullAttributeTypeVisitor getInstance() {
        return INSTANCE;
    }

    protected NullAttributeTypeVisitor() {
        // use factory method
    }

    @Override
    public void visit(final BooleanAttributeType attributeType) {
        // nothing to do
    }

    @Override
    public void visit(final CharAttributeType attributeType) {
        // nothing to do
    }

    @Override
    public void visit(final DateAttributeType attributeType) {
        // nothing to do
    }

    @Override
    public void visit(final DateTimeAttributeType attributeType) {
        // nothing to do
    }

    @Override
    public void visit(final DecimalAttributeType attributeType) {
        // nothing to do
    }

    @Override
    public void visit(final DoubleAttributeType attributeType) {
        // nothing to do
    }

    @Override
    public void visit(final FloatAttributeType attributeType) {
        // nothing to do
    }

    @Override
    public void visit(final RegclassAttributeType attributeType) {
        // nothing to do
    }

    @Override
    public void visit(final ForeignKeyAttributeType attributeType) {
        // nothing to do
    }

    @Override
    public void visit(final IntegerAttributeType attributeType) {
        // nothing to do
    }

    @Override
    public void visit(LongAttributeType attributeType) {
        // nothing to do		
    }

    @Override
    public void visit(final IpAddressAttributeType attributeType) {
        // nothing to do
    }

    @Override
    public void visit(final LookupAttributeType attributeType) {
        // nothing to do
    }

    @Override
    public void visit(final ReferenceAttributeType attributeType) {
        // nothing to do
    }

    @Override
    public void visit(final StringArrayAttributeType attributeType) {
        // nothing to do
    }

    @Override
    public void visit(final StringAttributeType attributeType) {
        // nothing to do
    }

    @Override
    public void visit(final TextAttributeType attributeType) {
        // nothing to do
    }

    @Override
    public void visit(final TimeAttributeType attributeType) {
        // nothing to do
    }

    @Override
    public void visit(ByteArrayAttributeType attributeType) {
        // nothing to do
    }

    @Override
    public void visit(ReferenceArrayAttributeType attributeType) {
        // nothing to do
    }

    @Override
    public void visit(JsonAttributeType attributeType) {
        // nothing to do
    }

    @Override
    public void visit(IntervalAttributeType attributeType) {
        // nothing to do
    }

    @Override
    public void visit(LongArrayAttributeType attributeType) {
        // nothing to do
    }

}
