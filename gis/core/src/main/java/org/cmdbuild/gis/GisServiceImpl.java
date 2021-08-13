package org.cmdbuild.gis;

import org.cmdbuild.gis.geoserver.GisGeoserverLayerImpl;
import static com.google.common.base.Objects.equal;
import static com.google.common.base.Preconditions.checkArgument;
import static com.google.common.base.Preconditions.checkNotNull;
import static com.google.common.base.Predicates.notNull;

import static com.google.common.collect.ImmutableList.toImmutableList;
import static com.google.common.collect.ImmutableSet.toImmutableSet;
import static com.google.common.collect.Multimaps.index;
import static java.lang.String.format;
import java.util.List;

import org.cmdbuild.config.GisConfiguration;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collection;
import java.util.Set;
import java.util.concurrent.atomic.AtomicInteger;
import static java.util.stream.Collectors.toList;
import static java.util.stream.Collectors.toSet;
import javax.activation.DataHandler;
import javax.annotation.Nullable;
import static org.cmdbuild.utils.lang.CmExceptionUtils.marker;
import org.cmdbuild.config.api.ConfigListener;
import org.cmdbuild.dao.beans.Card;
import static org.cmdbuild.dao.constants.SystemAttributes.ATTR_ID;
import org.cmdbuild.dao.core.q3.DaoService;
import static org.cmdbuild.dao.core.q3.WhereOperator.IN;
import org.cmdbuild.dao.entrytype.Classe;
import org.cmdbuild.data.filter.CmdbFilter;
import org.cmdbuild.services.PostStartup;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.cmdbuild.gis.geoserver.GeoserverService;
import static org.cmdbuild.gis.utils.GisUtils.cmGeometryToPostgisSql;
import org.cmdbuild.services.MinionStatus;
import org.cmdbuild.services.MinionComponent;
import static org.cmdbuild.services.MinionStatus.MS_READY;
import static org.cmdbuild.services.MinionStatus.MS_ERROR;
import static org.cmdbuild.services.MinionStatus.MS_DISABLED;
import static org.cmdbuild.utils.lang.CmCollectionUtils.set;
import org.cmdbuild.navtree.NavTreeNode;
import org.cmdbuild.navtree.NavTreeService;
import static org.cmdbuild.utils.io.CmIoUtils.toBigByteArray;
import static org.cmdbuild.utils.lang.CmCollectionUtils.list;
import org.cmdbuild.gis.geoserver.GisGeoserverLayerRepository;
import static org.cmdbuild.utils.lang.CmCollectionUtils.onlyElement;

@Component("gisService")
@MinionComponent(name = "GIS Service", configBean = GisConfiguration.class, canStartStop = true)
public class GisServiceImpl implements GisService {

    private static final String DOMAIN_TREE_TYPE = "gisnavigation";

    private final Logger logger = LoggerFactory.getLogger(getClass());

    private final DaoService dao;
    private final GisAttributeRepository gisAttributeRepository;
    private final GisValueRepository gisValueRepository;
    private final NavTreeService domainTreeStore;
    private final GisConfiguration configuration;
    private final GeoserverService geoserverService;
    private final GisGeoserverLayerRepository geoserverLayerRepository;

    public GisServiceImpl(NavTreeService domainTreeRepository, GisGeoserverLayerRepository layerRepository, DaoService dao, GisValueRepository geoFeatureStore, GisConfiguration configuration, GeoserverService geoServerService, GisAttributeRepository layerStore) {
        this.dao = checkNotNull(dao);
        this.gisAttributeRepository = checkNotNull(layerStore);
        this.domainTreeStore = checkNotNull(domainTreeRepository);
        this.gisValueRepository = checkNotNull(geoFeatureStore);
        this.configuration = checkNotNull(configuration);
        this.geoserverService = checkNotNull(geoServerService);
        this.geoserverLayerRepository = checkNotNull(layerRepository);
    }

    public MinionStatus getServiceStatus() {
        if (!isGisEnabled()) {
            return MS_DISABLED;
        } else {
            if (gisValueRepository.isGisSchemaOk()) {
                return MS_READY;
            } else {
                return MS_ERROR;
            }
        }
    }

    @PostStartup
    public void init() {
        checkGisConfiguration();
    }

    @Override
    public boolean isGisEnabled() {
        return configuration.isEnabled();
    }

    @Override
    public boolean isGeoserverEnabled() {
        return configuration.isGeoServerEnabled();
    }

    @ConfigListener(GisConfiguration.class)
    public void checkGisConfiguration() {
        if (isGisEnabled()) {
            logger.debug("checkGisSchema");
            try {
                gisValueRepository.checkGisSchemaAndCreateIfMissing();
            } catch (Exception ex) {
                logger.error(marker(), "error checking gis schema", ex);
            }
        }
    }

    @Override
    @Transactional
    public GisAttribute createGisAttribute(GisAttribute gisAttribute) {
        checkGisEnabled();
        if (gisAttribute.isPostgis()) {
            gisValueRepository.createGisTable(gisAttribute);
        }
        return gisAttributeRepository.create(gisAttribute);
    }

    @Override
    public GisAttribute updateGisAttribute(GisAttribute layer) {
        checkGisEnabled();
        return gisAttributeRepository.update(layer);
    }

    @Override
    @Transactional
    public void deleteGisAttribute(String classId, String attributeName) {
        checkGisEnabled();
        GisAttribute gisAttribute = gisAttributeRepository.get(classId, attributeName);
        if (gisAttribute.isPostgis()) {
            gisValueRepository.deleteGisTable(classId, attributeName);
        }
        gisAttributeRepository.delete(classId, attributeName);
    }

    @Override
    public List<GisValue> getGisValues(String classId, long cardId) {
        checkGisEnabled();
        Classe classe = dao.getClasse(classId);
        return getGisAttributesByOwnerClassIncludeInherited(classe.getName()).stream().filter(GisAttribute::isPostgis).map((l) -> gisValueRepository.getGisValueOrNull(l, cardId)).filter(notNull()).collect(toList());//TODO avoid n*m query
    }

    @Override
    public List<GisValue> getGisValues(Collection<Long> layers, String bbox, CmdbFilter filter) {
        checkGisEnabled();
        List<GisValue> values = gisValueRepository.getGisValues(layers, bbox);
        values = filterGisValues(values, filter);
        return values;
    }

    @Override
    public GisValuesAndNavTree getGisValuesAndNavTree(Collection<Long> attrs, String bbox, CmdbFilter filter) {
        checkGisEnabled();
        NavTreeNode navTreeDomains = getGisNavTree();
        GisValuesAndNavTree res = gisValueRepository.getGeoValuesAndNavTree(attrs, bbox, navTreeDomains);
        return new GisValuesAndNavTreeImpl(filterGisValues(res.getGisValues(), filter), filterNavTree(res.getNavTree(), filter));
    }

    @Override
    @Nullable
    public Area getAreaForValues(Collection<Long> attrs, CmdbFilter filter) {
        checkGisEnabled();
        checkArgument(filter.isNoop(), "filter not supported yet");
        return gisValueRepository.getAreaForValues(attrs);
    }

    @Override
    public GisValue setGisValue(GisValue value) {
        GisAttribute attribute = getGisAttributeIncludeInherited(value.getOwnerClassId(), value.getLayerName());
        checkIsPostgis(attribute);
        String rawGeometryValue = cmGeometryToPostgisSql(value.getGeometry());
        gisValueRepository.setGisValue(attribute, rawGeometryValue, value.getOwnerCardId());
        return getGisValue(value.getOwnerClassId(), value.getOwnerCardId(), value.getLayerName());
    }

    @Override
    public void deleteGisValue(String classId, long cardId, String attrId) {
        GisAttribute attribute = getGisAttributeIncludeInherited(classId, attrId);
        checkIsPostgis(attribute);
        gisValueRepository.deleteGisValue(attribute, cardId);
    }

    @Override
    @Transactional
    public void updateGeoAttributesVisibilityForClass(String classId, Collection<Long> newVis) {
        Classe classe = dao.getClasse(classId);
        newVis = set(checkNotNull(newVis));
        Set<Long> currentVis = getGisAttributesVisibleFromClass(classId).stream().map(GisAttribute::getId).collect(toSet());
        Set<Long> toAdd = set(newVis).without(currentVis),
                toRemove = set(currentVis).without(newVis);
        toAdd.forEach((id) -> {
            GisAttribute attr = gisAttributeRepository.getLayer(id);
            attr = GisAttributeImpl.copyOf(attr).withVisibility(set(attr.getVisibility()).with(classe.getName())).build();
            gisAttributeRepository.update(attr);
        });
        toRemove.forEach((id) -> {
            GisAttribute attr = gisAttributeRepository.getLayer(id);
            attr = GisAttributeImpl.copyOf(attr).withVisibility(set(attr.getVisibility()).without(classe.getName())).build();
            gisAttributeRepository.update(attr);
        });
    }

    @Override
    public List<GisAttribute> updateGisAttributesOrder(List<Long> attrIdsInOrder) {
        checkArgument(set(attrIdsInOrder).size() == attrIdsInOrder.size(), "invalid attr id list: list contains duplicates");
        AtomicInteger index = new AtomicInteger(0);
        return attrIdsInOrder.stream().map(gisAttributeRepository::getLayer).map(l -> GisAttributeImpl.copyOf(l).withIndex(index.getAndIncrement()).build()).map(gisAttributeRepository::update).collect(toList());
    }

    @Override
    @Transactional //TODO fix this !!
    public GeoserverLayer setGeoserverLayer(String classId, String attrName, long cardId, DataHandler file) {
        checkGisEnabled();
        checkGeoServerIsEnabled();
        GeoserverLayer geoserverLayer = geoserverLayerRepository.getByCodeOrNull(classId, attrName, cardId);
        if (geoserverLayer == null) {
            String storeName = format("%s_%s_%s", classId, attrName, cardId).toLowerCase();
            geoserverLayer = geoserverLayerRepository.create(GisGeoserverLayerImpl.builder()//TODO rollback create if there is an error in geoserver upload
                    .withAttribute(getGisAttributeIncludeInherited(classId, attrName))
                    .withOwnerClass(classId)
                    .withOwnerCard(cardId)
                    .withGeoserverStore(storeName)
                    .withGeoserverLayer(storeName)
                    .build());
        }
        geoserverLayer = geoserverService.set(geoserverLayer, toBigByteArray(file));
        return geoserverLayerRepository.update(geoserverLayer);
    }

    @Override
    public GeoserverLayer getGeoserverLayerByCodeOrNull(String classId, String layerCode, long cardId) {
        return geoserverLayerRepository.getByCodeOrNull(classId, layerCode, cardId);//TODO check on geoserver for layer
    }

    @Override
    public GeoserverLayer getGeoserverLayerByIdOrNull(String classId, Long layerId, long cardId) {
        return geoserverLayerRepository.getByIdOrNull(classId, layerId, cardId);//TODO check on geoserver for layer
    }

    @Override
    @Transactional
    public void deleteGeoServerLayer(long id) {
        checkGisEnabled();
        checkGeoServerIsEnabled();
        GeoserverLayer layer = geoserverLayerRepository.get(id);
        geoserverService.delete(layer);
        geoserverLayerRepository.delete(id);
    }

    @Override
    @Transactional
    public List<GeoserverLayer> getGeoServerLayers() {
        checkGisEnabled();
        return geoserverLayerRepository.getAll();
    }

    @Override
    public List<GeoserverLayer> getGeoServerLayersForCard(String classId, Long cardId) {
        checkGisEnabled();
        return geoserverLayerRepository.getForCard(dao.getClasse(classId), cardId);
    }

    @Override
    public List<GisAttribute> getGisAttributes() {
        checkGisEnabled();
        return gisAttributeRepository.getAllLayers();
    }

    @Override
    public GisAttribute getGisAttributeIncludeInherited(String classId, String attributeId) {
        checkGisEnabled();
        return getGisAttributesByOwnerClassIncludeInherited(classId).stream()
                .filter(a -> equal(a.getLayerName(), attributeId))
                .collect(onlyElement("gis attr not found for owner =< %s > name =< %s >", classId, attributeId));
    }

    @Override
    public GisAttribute getGisAttribute(long attributeId) {
        checkGisEnabled();
        return gisAttributeRepository.getLayer(attributeId);
    }

    @Override
    public List<GisAttribute> getGisAttributesByOwnerClassIncludeInherited(String classId) {
        checkGisEnabled();
        Classe classe = dao.getClasse(classId);
        return classe.getAncestorsAndSelf().stream().flatMap(c -> gisAttributeRepository.getLayersByOwnerClass(c).stream()).distinct().collect(toImmutableList());
    }

    @Override
    public List<GisAttribute> getGisAttributesVisibleFromClass(String classId) {
        checkGisEnabled();
        return gisAttributeRepository.getVisibleLayersForClass(classId);
    }

    @Override
    public NavTreeNode getGisNavTree() {
        return domainTreeStore.getTree(DOMAIN_TREE_TYPE).getData();
    }

    private List<GisValue> filterGisValues(List<GisValue> values, CmdbFilter filter) {
        if (filter.isNoop()) {
            return values;
        } else {
            return index(values, GisValue::getOwnerClassId).asMap().entrySet().stream().flatMap(e -> {
                Set<Long> cards = dao.select(ATTR_ID).from(e.getKey()).where(ATTR_ID, IN, list(e.getValue()).map(GisValue::getOwnerCardId)).where(filter).getCards().stream().map(Card::getId).collect(toImmutableSet());
                return e.getValue().stream().filter(v -> cards.contains(v.getOwnerCardId()));
            }).collect(toImmutableList());//TODO improve this, make single query with join
        }
    }

    private List<GisNavTreeNode> filterNavTree(List<GisNavTreeNode> values, CmdbFilter filter) {//TODO check this
        if (filter.isNoop()) {
            return values;
        } else {
            return index(values, GisNavTreeNode::getClassId).asMap().entrySet().stream().flatMap(e -> {
                Set<Long> cards = dao.select(ATTR_ID).from(e.getKey()).where(ATTR_ID, IN, list(e.getValue()).map(GisNavTreeNode::getCardId)).where(filter).getCards().stream().map(Card::getId).collect(toImmutableSet());
                return e.getValue().stream().filter(v -> cards.contains(v.getCardId()));
            }).collect(toImmutableList());//TODO improve this, make single query with join
        }
    }

    private void checkGisEnabled() {
        if (!isGisEnabled()) {
            throw new GisException("GIS Module is non enabled");
        }
    }

    private void checkGeoServerIsEnabled() {
        if (!configuration.isGeoServerEnabled()) {
            throw new GisException("GEOServer is non enabled");
        }
    }

    private void checkIsPostgis(GisAttribute attribute) {
        checkArgument(attribute.isPostgis(), "not a postgis attribute = %s", attribute);
    }
}
