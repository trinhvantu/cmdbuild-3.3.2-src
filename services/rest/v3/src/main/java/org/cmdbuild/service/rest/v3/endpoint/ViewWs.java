package org.cmdbuild.service.rest.v3.endpoint;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.JsonNode;
import static com.google.common.base.Preconditions.checkNotNull;
import static java.lang.String.format;
import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.function.Consumer;
import static java.util.stream.Collectors.toList;
import javax.activation.DataHandler;
import javax.annotation.Nullable;
import javax.ws.rs.DELETE;
import javax.ws.rs.DefaultValue;
import javax.ws.rs.GET;
import javax.ws.rs.HeaderParam;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import static javax.ws.rs.core.MediaType.APPLICATION_JSON;
import static javax.ws.rs.core.MediaType.APPLICATION_OCTET_STREAM;
import static org.apache.commons.lang3.StringUtils.EMPTY;
import static org.apache.commons.lang3.StringUtils.isBlank;
import org.cmdbuild.view.View;
import static org.cmdbuild.service.rest.common.utils.WsResponseUtils.response;
import static org.cmdbuild.service.rest.common.utils.WsResponseUtils.success;
import org.cmdbuild.translation.ObjectTranslationService;
import static org.cmdbuild.utils.lang.CmMapUtils.map;
import static org.cmdbuild.utils.lang.CmPreconditions.checkNotBlank;
import org.cmdbuild.view.ViewImpl;
import org.cmdbuild.view.ViewImpl.ViewImplBuilder;
import org.cmdbuild.view.ViewType;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import static org.apache.commons.lang3.math.NumberUtils.isNumber;
import org.apache.commons.lang3.tuple.Pair;
import static org.cmdbuild.auth.grant.GrantConstants.GDCP_PRINT;

import org.cmdbuild.auth.user.OperationUserSupplier;
import static org.cmdbuild.config.api.ConfigValue.FALSE;
import org.cmdbuild.dao.beans.RelationDirection;
import org.cmdbuild.dao.core.q3.DaoService;
import org.cmdbuild.dao.driver.postgres.q3.DaoQueryOptions;
import org.cmdbuild.dao.driver.postgres.q3.DaoQueryOptionsImpl;
import org.cmdbuild.dao.entrytype.Attribute;
import org.cmdbuild.dao.user.UserDaoHelperService;
import org.cmdbuild.data.filter.CmdbFilter;
import org.cmdbuild.data.filter.CmdbSorter;
import static org.cmdbuild.data.filter.utils.CmdbFilterUtils.parseFilter;
import static org.cmdbuild.data.filter.utils.CmdbFilterUtils.serializeFilter;
import static org.cmdbuild.data.filter.utils.CmdbSorterUtils.parseSorter;
import static org.cmdbuild.data.filter.utils.CmdbSorterUtils.serializeSorter;
import org.cmdbuild.formstructure.FormStructure;
import org.cmdbuild.formstructure.FormStructureImpl;
import org.cmdbuild.formstructure.FormStructureService;
import org.cmdbuild.report.SysReportService;
import static org.cmdbuild.report.utils.ReportExtUtils.reportExtFromString;
import org.cmdbuild.service.rest.common.serializationhelpers.AttributeTypeConversionService;
import static org.cmdbuild.service.rest.common.utils.WsRequestUtils.isAdminViewMode;
import static org.cmdbuild.service.rest.common.utils.WsSerializationAttrs.DETAILED;
import static org.cmdbuild.service.rest.common.utils.WsSerializationAttrs.EXTENSION;
import static org.cmdbuild.service.rest.common.utils.WsSerializationAttrs.FILTER;
import static org.cmdbuild.service.rest.common.utils.WsSerializationAttrs.LIMIT;
import static org.cmdbuild.service.rest.common.utils.WsSerializationAttrs.SORT;
import static org.cmdbuild.service.rest.common.utils.WsSerializationAttrs.START;
import static org.cmdbuild.service.rest.common.utils.WsSerializationAttrs.VIEW_MODE_HEADER_PARAM;
import static org.cmdbuild.utils.json.CmJsonUtils.LIST_OF_STRINGS;
import static org.cmdbuild.utils.json.CmJsonUtils.fromJson;
import static org.cmdbuild.utils.json.CmJsonUtils.nullableToJson;
import static org.cmdbuild.utils.json.CmJsonUtils.toJson;
import static org.cmdbuild.utils.lang.CmCollectionUtils.list;
import static org.cmdbuild.utils.lang.CmCollectionUtils.nullToEmpty;
import static org.cmdbuild.utils.lang.CmConvertUtils.parseEnum;
import static org.cmdbuild.utils.lang.CmConvertUtils.serializeEnum;
import static org.cmdbuild.utils.lang.CmConvertUtils.toBooleanOrDefault;
import static org.cmdbuild.utils.lang.CmConvertUtils.toLong;
import org.cmdbuild.utils.lang.CmMapUtils.FluentMap;
import org.cmdbuild.view.ViewService;
import static org.cmdbuild.view.ViewService.ATTR_DESCR_INHERITED_FROM;
import static org.cmdbuild.view.ViewType.VT_JOIN;
import org.cmdbuild.view.join.JoinAttribute;
import org.cmdbuild.view.join.JoinAttributeGroup;
import org.cmdbuild.view.join.JoinAttributeGroupImpl;
import org.cmdbuild.view.join.JoinAttributeImpl;
import org.cmdbuild.view.join.JoinElement;
import org.cmdbuild.view.join.JoinElementImpl;
import org.cmdbuild.view.join.JoinType;
import org.cmdbuild.view.join.JoinViewConfig;
import org.cmdbuild.view.join.JoinViewConfigImpl;
import static org.cmdbuild.view.join.utils.JoinViewUtils.parseAttributeExpr;

@Path("views/")
@Produces(APPLICATION_JSON)
public class ViewWs {

    private final Logger logger = LoggerFactory.getLogger(getClass());

    private final ViewService viewService;
    private final ObjectTranslationService translationService;
    private final SysReportService reportService;
    private final UserDaoHelperService userHelper;
    private final AttributeTypeConversionService attributeHelper;
    private final FormStructureService formStructureService;
    private final OperationUserSupplier userStore;
    private final DaoService daoService;

    public ViewWs(ViewService viewService, ObjectTranslationService translationService, SysReportService reportService, UserDaoHelperService userHelper, AttributeTypeConversionService attributeHelper, FormStructureService formStructureService, OperationUserSupplier userStore, DaoService daoService) {
        this.viewService = checkNotNull(viewService);
        this.translationService = checkNotNull(translationService);
        this.reportService = checkNotNull(reportService);
        this.userHelper = checkNotNull(userHelper);
        this.attributeHelper = checkNotNull(attributeHelper);
        this.formStructureService = checkNotNull(formStructureService);
        this.userStore = checkNotNull(userStore);
        this.daoService = checkNotNull(daoService);
    }

    @GET
    @Path(EMPTY)
    public Object getMany(@HeaderParam(VIEW_MODE_HEADER_PARAM) String viewMode, @QueryParam(LIMIT) Long limit, @QueryParam(START) Long offset, @QueryParam(DETAILED) @DefaultValue(FALSE) Boolean detailed, @QueryParam("shared") @DefaultValue(FALSE) Boolean sharedOnly) {
        logger.debug("list all views");
        List<View> views = isAdminViewMode(viewMode) ? viewService.getAllSharedViews() : viewService.getActiveViewsForCurrentUser();
        logger.trace("processing views = {}", views);
        return response(views.stream().map(detailed ? this::serializeDetailedView : this::serializeView).collect(toList()));
    }

    @GET
    @Path("{viewId}")
    public Object getOne(@PathParam("viewId") String viewId) {
        View view = viewService.getForCurrentUserByIdOrName(viewId);
        return response(serializeDetailedView(view));
    }

    @GET
    @Path("{viewId}/attributes")
    public Object getAttributes(@PathParam("viewId") String viewId) {
        Collection<Attribute> attributesForView = viewService.getAttributesForView(viewService.getForCurrentUserByIdOrName(viewId));
        return response(attributesForView.stream().map(a -> attributeHelper.serializeAttributeType(a).accept(m -> {
            if (a.getMetadata().hasValue(ATTR_DESCR_INHERITED_FROM)) {
                Pair<String, String> pair = parseAttributeExpr(a.getMetadata().get(ATTR_DESCR_INHERITED_FROM));
                m.put("_description_translation", translationService.translateAttributeDescription(daoService.getClasse(pair.getLeft()).getAttribute(pair.getRight())));//TODO improve this
            }
        })).collect(toList()));
    }

    @POST
    @Path("")
    public Object create(WsViewData data) {
        View view = viewService.createForCurrentUser(data.toView().accept(setCurrentUser(data)).build());
        formStructureService.setFormForView(view, data.getFormStructure());
        return response(serializeView(view));
    }

    @PUT
    @Path("{viewId}")
    public Object update(@PathParam("viewId") String viewId, WsViewData data) {
        View view = viewService.updateForCurrentUser(data.toView().accept(setViewId(viewId)).accept(setCurrentUser(data)).build());//TODO use viewId ???
        formStructureService.setFormForView(view, data.getFormStructure());
        return response(serializeView(view));
    }

    @DELETE
    @Path("{viewId}")
    public Object delete(@PathParam("viewId") String viewId) {
        viewService.delete(viewService.getForCurrentUserByIdOrName(viewId).getId());
        return success();
    }

    @GET
    @Path("{viewId}/print/{file}")
    @Produces(APPLICATION_OCTET_STREAM)
    public DataHandler printView(@PathParam("viewId") String viewId, @QueryParam(FILTER) String filterStr, @QueryParam(SORT) String sort, @QueryParam(LIMIT) Long limit, @QueryParam(START) Long offset, @QueryParam(EXTENSION) String extension, @QueryParam("attributes") String attributes) {
        DaoQueryOptions queryOptions = DaoQueryOptionsImpl.builder().withFilter(filterStr).withSorter(sort).withPaging(offset, limit).withAttrs(isBlank(attributes) ? (List) null : fromJson(attributes, LIST_OF_STRINGS)).build();
        return reportService.executeViewReport(viewService.getSharedForCurrentUserByNameOrId(viewId), reportExtFromString(extension), queryOptions);
    }

    private Consumer<ViewImplBuilder> setViewId(String viewId) {
        return (b) -> {
            if (isNumber(viewId)) {
                b.withId(toLong(viewId));
            } else {
                b.withName(viewId);
            }
        };
    }

    private Consumer<ViewImplBuilder> setCurrentUser(WsViewData data) {
        return (b) -> {
            if (!data.shared) {
                b.withUserId(userStore.getUser().getLoginUser().getId());
            }
        };
    }

    private FluentMap<?, ?> serializeView(View view) {
        return map(
                "_id", view.isShared() ? view.getName() : view.getId(),//TODO check constraint, access, etc
                "name", view.getName(),
                "type", serializeEnum(view.getType()).toUpperCase(),
                "description", view.getDescription(),
                "_description_translation", translationService.translateViewDesciption(view.getName(), view.getDescription()),
                "filter", view.getFilter(),
                "sourceClassName", view.getSourceClass(),
                "sourceFunction", view.getSourceFunction(),
                "active", view.isActive(),
                "shared", view.isShared()
        ).accept(m -> {
            Map<String, Object> otherPrivileges = userHelper.getPrivilegesForObject(view).getMinPrivilegesForAllRecords().getCustomPrivileges();
            list(GDCP_PRINT).forEach(k -> m.put(format("_can_%s", k), toBooleanOrDefault(otherPrivileges.get(k), true)));
        });
    }

    private Object serializeDetailedView(View view) {
        return serializeView(view).accept(m -> {
            if (view.isOfType(VT_JOIN)) {
                AtomicInteger attributeGroupIndex = new AtomicInteger(0);
                JoinViewConfig c = view.getJoinConfigNotNull();
                m.put(
                        "masterClass", c.getMasterClass(),
                        "masterClassAlias", c.getMasterClassAlias(),
                        "sorter", fromJson(serializeSorter(c.getSorter()), JsonNode.class),
                        "filter", serializeFilter(c.getFilter()),
                        "join", list(c.getJoinElements()).map(j -> map(
                        "source", j.getSource(),
                        "domain", j.getDomain(),
                        "targetType", j.getTargetType(),
                        "domainAlias", j.getDomainAlias(),
                        "targetAlias", j.getTargetAlias(),
                        "direction", serializeEnum(j.getDirection()),
                        "joinType", serializeEnum(j.getJoinType())
                )),
                        "attributes", list(c.getAttributes()).map(a -> map(
                        "expr", a.getExpr(),
                        "name", a.getName(),
                        "description", a.getDescription(),
                        "_description_translation", translationService.translateViewAttributeDescription(view.getName(), a.getName(), a.getDescription()),
                        "group", a.getGroup(),
                        "showInGrid", a.getShowInGrid(),
                        "showInReducedGrid", a.getShowInReducedGrid()
                )),
                        "attributeGroups", list(c.getAttributeGroups()).map(g -> map(
                        "name", g.getName(),
                        "_id", g.getName(),
                        "index", attributeGroupIndex.incrementAndGet(),
                        "defaultDisplayMode", g.getDefaultDisplayMode(),
                        "description", g.getDescription(),
                        "_description_translation", translationService.translateViewAttributeGroupDescription(view.getName(), g.getName(), g.getDescription())
                )));
            }
            Optional.ofNullable(formStructureService.getFormForViewOrNull(view)).ifPresent(f -> {
                m.put("formStructure", fromJson(f.getData(), JsonNode.class));
            });
        });
    }

    public static class WsViewData {

        private final String name;
        private final String description;
        private final String sourceClassName;
        private final String sourceFunction;
        private final ViewType type;
        private final Boolean active, shared;
        private final String masterClass, masterClassAlias;
        private final CmdbFilter filter;
        private final CmdbSorter sorter;
        private final List<WsJoinElement> joinElements;
        private final List<WsJoinAttribute> attributes;
        private final List<WsJoinAttributeGroup> attributeGroups;
        private final JsonNode formStructure;

        public WsViewData(
                @JsonProperty("name") String name,
                @JsonProperty("description") String description,
                @JsonProperty("sourceClassName") String sourceClassName,
                @JsonProperty("sourceFunction") String sourceFunction,
                @JsonProperty("filter") String filter,
                @JsonProperty("active") Boolean active,
                @JsonProperty("shared") Boolean shared,
                @JsonProperty("type") String type,
                @JsonProperty("masterClass") String masterClass,
                @JsonProperty("masterClassAlias") String masterClassAlias,
                @JsonProperty("sorter") JsonNode sorter,
                @JsonProperty("join") List<WsJoinElement> joinElements,
                @JsonProperty("attributes") List<WsJoinAttribute> attributes,
                @JsonProperty("attributeGroups") List<WsJoinAttributeGroup> attributeGroups,
                @JsonProperty("formStructure") JsonNode formStructure) {
            this.name = checkNotBlank(name);
            this.description = description;
            this.sourceClassName = sourceClassName;
            this.sourceFunction = sourceFunction;
            this.filter = parseFilter(filter);
            this.active = active;
            this.shared = shared;
            this.type = parseEnum(type, ViewType.class);
            this.masterClass = masterClass;
            this.masterClassAlias = masterClassAlias;
            this.sorter = parseSorter(nullableToJson(sorter));
            this.joinElements = nullToEmpty(joinElements);
            this.attributes = attributes;
            this.attributeGroups = nullToEmpty(attributeGroups);
            this.formStructure = formStructure;
        }

        public ViewImplBuilder toView() {
            return ViewImpl.builder()
                    .withName(name)
                    .withDescription(description)
                    .withSourceClass(sourceClassName)
                    .withSourceFunction(sourceFunction)
                    .withType(type)
                    .withActive(active)
                    .withShared(shared)
                    .accept(b -> {
                        switch (type) {
                            case VT_JOIN:
                                b.withJoinConfig(toJoinConfig());
                                break;
                            default:
                                b.withFilter(serializeFilter(filter));
                        }
                    });
        }

        public JoinViewConfig toJoinConfig() {
            return JoinViewConfigImpl.builder()
                    .withFilter(filter)
                    .withMasterClass(masterClass)
                    .withMasterClassAlias(masterClassAlias)
                    .withSorter(sorter)
                    .withAttributes(list(attributes).map(WsJoinAttribute::toJoinAttribute))
                    .withAttributeGroups(list(attributeGroups).map(WsJoinAttributeGroup::toJoinAttributeGroup))
                    .withJoinElements(list(joinElements).map(WsJoinElement::toJoinElement))
                    .build();
        }

        @Nullable
        public FormStructure getFormStructure() {
            return formStructure == null ? null : new FormStructureImpl(toJson(formStructure));
        }
    }

    public static class WsJoinElement {

        private final String source, domain, targetType, domainAlias, targetAlias;
        private final RelationDirection direction;
        private final JoinType joinType;

        public WsJoinElement(
                @JsonProperty("source") String source,
                @JsonProperty("domain") String domain,
                @JsonProperty("targetType") String targetType,
                @JsonProperty("domainAlias") String domainAlias,
                @JsonProperty("targetAlias") String targetAlias,
                @JsonProperty("direction") String direction,
                @JsonProperty("joinType") String joinType) {
            this.source = source;
            this.domain = domain;
            this.targetType = targetType;
            this.domainAlias = domainAlias;
            this.targetAlias = targetAlias;
            this.direction = parseEnum(direction, RelationDirection.class);
            this.joinType = parseEnum(joinType, JoinType.class);
        }

        public JoinElement toJoinElement() {
            return JoinElementImpl.builder()
                    .withDirection(direction)
                    .withDomain(domain)
                    .withDomainAlias(domainAlias)
                    .withJoinType(joinType)
                    .withSource(source)
                    .withTargetAlias(targetAlias)
                    .withTargetType(targetType)
                    .build();
        }

    }

    public static class WsJoinAttribute {

        private final String expr, name, description, group;
        private final Boolean showInGrid, showInReducedGrid;

        public WsJoinAttribute(
                @JsonProperty("expr") String expr,
                @JsonProperty("name") String name,
                @JsonProperty("description") String description,
                @JsonProperty("group") String group,
                @JsonProperty("showInGrid") Boolean showInGrid,
                @JsonProperty("showInReducedGrid") Boolean showInReducedGrid) {
            this.expr = expr;
            this.name = name;
            this.description = description;
            this.group = group;
            this.showInGrid = showInGrid;
            this.showInReducedGrid = showInReducedGrid;
        }

        public JoinAttribute toJoinAttribute() {
            return JoinAttributeImpl.builder()
                    .withExpr(expr)
                    .withDescription(description)
                    .withGroup(group)
                    .withName(name)
                    .withShowInGrid(showInGrid)
                    .withShowInReducedGrid(showInReducedGrid)
                    .build();
        }
    }

    public static class WsJoinAttributeGroup {

        private final String name, description, defaultDisplayMode;

        public WsJoinAttributeGroup(@JsonProperty("name") String name, @JsonProperty("description") String description, @JsonProperty("defaultDisplayMode") String defaultDisplayMode) {
            this.name = name;
            this.description = description;
            this.defaultDisplayMode = defaultDisplayMode;
        }

        public JoinAttributeGroup toJoinAttributeGroup() {
            return JoinAttributeGroupImpl.builder().withName(name).withDescription(description).withDefaultDisplayMode(defaultDisplayMode).build();
        }
    }
}
