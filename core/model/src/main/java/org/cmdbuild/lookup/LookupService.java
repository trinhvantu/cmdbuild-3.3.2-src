package org.cmdbuild.lookup;

import static com.google.common.base.Objects.equal;
import static com.google.common.base.Preconditions.checkArgument;
import static com.google.common.base.Preconditions.checkNotNull;
import static com.google.common.collect.MoreCollectors.toOptional;
import java.util.List;
import org.cmdbuild.common.utils.PagedElements;

import javax.annotation.Nullable;
import static org.cmdbuild.common.utils.PagedElements.paged;
import org.cmdbuild.data.filter.CmdbFilter;
import org.cmdbuild.data.filter.utils.CmdbFilterUtils;
import static org.cmdbuild.utils.lang.CmConvertUtils.serializeEnum;

public interface LookupService {

    List<LookupType> getAllTypes(@Nullable String filter);

    PagedElements<LookupValue> getAllLookup(String type, @Nullable Integer offset, @Nullable Integer limit, CmdbFilter filter);

    PagedElements<LookupValue> getActiveLookup(String type, @Nullable Integer offset, @Nullable Integer limit, CmdbFilter filter);

    @Nullable
    LookupValue getLookupByTypeAndCodeOrNull(String type, String code);

    Iterable<LookupValue> getAllLookupOfParent(LookupType type);

    @Nullable
    LookupValue getLookupByTypeAndCodeOrDescriptionOrIdOrNull(String type, String value);

    List<LookupValue> getAllTranslatedLookup(String type);

    @Nullable
    LookupValue getLookupOrNull(Long id);

    LookupValue getLookup(Long id);

    LookupValue createOrUpdateLookup(LookupValue lookup);

    LookupValue createOrUpdateLookup(LookupType lookupType, String code);

    LookupType getLookupType(String lookupTypeId);

    LookupType getLookupType(long lookupTypeId);

    LookupType getLookupTypeCreateIfMissing(String type);

    LookupType createLookupType(LookupType lookupType);

    void deleteLookupValue(String lookupTypeId, long lookupId);

    void deleteLookupType(String lookupTypeId);

    default LookupValue createOrUpdateLookup(String lookupType, String code) {
        return createOrUpdateLookup(getLookupType(lookupType), code);
    }

    default LookupValue getLookupByTypeAndCodeOrDescriptionOrId(String type, String value) {
        return checkNotNull(getLookupByTypeAndCodeOrDescriptionOrIdOrNull(type, value), "lookup not found for type =< %s > and code or desc (translated) or id =< %s >", type, value);
    }

    default PagedElements<LookupType> getAllTypes(@Nullable Integer offset, @Nullable Integer limit, @Nullable String filter) {
        return paged(getAllTypes(filter), offset, limit);
    }

    default LookupValue createLookup(LookupValue lookup) {
        checkArgument(getLookupByTypeAndCodeOrNull(lookup.getTypeName(), lookup.getCode()) == null, "cannot create lookup = %s : lookup already existing with this type and code");
        return createOrUpdateLookup(lookup);
    }

    default <E extends Enum> LookupValue getLookup(E value) {
        LookupTypeEnum annotation = checkNotNull((LookupTypeEnum) value.getDeclaringClass().getAnnotation(LookupTypeEnum.class), "cannot convert enum %s to lookup, missing @LookupTypeEnum annotation", value);
        return getLookupByTypeAndCode(annotation.value(), serializeEnum(value));
    }

    default LookupValue getLookupByTypeAndId(String type, long id) {
        LookupValue lookup = getLookup(id);
        checkArgument(equal(lookup.getType().getName(), type), "lookup not found for type =< %s > and id =< %s >", type, id);
        return lookup;
    }

    default PagedElements<LookupType> getAllTypes() {
        return getAllTypes(null, null, null);
    }

    default PagedElements<LookupValue> getAllLookup(String type) {
        return getAllLookup(type, null, null);
    }

    default PagedElements<LookupValue> getAllLookup(LookupType type) {
        return getAllLookup(type, null, null);
    }

    default PagedElements<LookupValue> getAllLookup(String type, @Nullable Integer offset, @Nullable Integer limit) {
        return getAllLookup(type, offset, limit, CmdbFilterUtils.noopFilter());
    }

    default PagedElements<LookupValue> getAllLookup(LookupType type, @Nullable Integer offset, @Nullable Integer limit) {
        return getAllLookup(type.getName(), offset, limit);
    }

    default LookupValue getLookupByTypeAndCode(String type, String code) {
        return checkNotNull(getLookupByTypeAndCodeOrNull(type, code), "lookup not found for type =< %s > and code =< %s >", type, code);
    }

    LookupType createLookupType(String lookupType);
//        return createLookupType(LookupTypeImpl.builder().withName(lookupType).build());
//    }

    @Nullable
    default LookupValue getLookupByTypeAndDescriptionOrNull(String lookupType, String description) {
        return getAllLookup(lookupType).stream().filter(l -> equal(l.getDescription(), description)).collect(toOptional()).orElse(null);
    }

    default LookupValue getLookupByTypeAndDescription(String lookupType, String description) {
        return checkNotNull(getLookupByTypeAndDescriptionOrNull(lookupType, description), "lookup not found for type =< %s > description =< %s >", lookupType, description);
    }

}
