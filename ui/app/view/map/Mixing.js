Ext.define('CMDBuildUI.view.map.Mixin', {
    mixinId: 'map-mixing',

    // /**
    //  * @returns the current zoom of the map
    //  */
    // getZoom: function () {
    //     return this.getOlMap().getView().getZoom();
    // },

    /**
     * @param {} olMap
     * @param {String} ollayername 
     * @returns {ol.layer.Base} the layer with the passed name. undefined if not foud
     */
    getOlLayer: function (olMap, ollayername) {
        var olLayersCollection = olMap.getLayers();

        return Ext.Array.findBy(olLayersCollection.getArray(), function (item, index, array) {
            return item.get('name') == ollayername;
        });
    },

    /**
     * 
     * @param {*} olMap 
     * @param {*} ollayername 
     */
    getOlLayers: function (olMap, ollayername) {
        var olLayersCollection = olMap.getLayers();

        var results = [];
        Ext.Array.forEach(olLayersCollection.getArray(), function (item, index, array) {
            if (item.get('name') == ollayername) {
                results.push(item);
            }
        }, this);

        return results;
    },

    /**
     * 
     * @param {*} olMap 
     * @param {*} ollayername 
     * @param {*} Id 
     */
    getOlGeoFeatureById: function (olMap, ollayername, Id) {
        var olLayersCollection = olMap.getLayers();

        return Ext.Array.findBy(olLayersCollection.getArray(), function (item, index, array) {
            return item.get('id') == Id;
        }, this);
    },

    /**
     * 
     * @param {Function} callback 
     * @param {Object} scope 
     */
    forEachGeometryLayer: function (callback, scope) {
        var map = this.getOlMap();
        map.getLayers().forEach(function (item, index, array) {
            if (item.get('type') == CMDBuildUI.model.gis.GeoAttribute.type.geometry) {
                callback.call(scope, item, index, array);
            }
        });
    },

    /**
     * 
     * @param {*} callback 
     * @param {*} scope 
     */
    forEachShapeLayer: function (callback, scope) {
        var map = this.getOlMap();
        map.getLayers().forEach(function (item, index, array) {
            if (item.get('type') == CMDBuildUI.model.gis.GeoAttribute.type.shape) {
                callback.call(scope, item, index, array);
            }
        });
    },

    /**
     * 
     * @param {*} callback 
     * @param {*} scope 
     */
    forEachGeoTiffLayer: function (callback, scope) {
        var map = this.getOlMap();
        map.getLayers().forEach(function (item, index, array) {
            if (item.get('type') == CMDBuildUI.model.gis.GeoAttribute.type.geotiff) {
                callback.call(scope, item, index, array);
            }
        });
    },

    /**
     * 
     * @param {CMDBuildUI.model.gis.GeoAttribute} geoattribute 
     */
    addOlLayer: function (olMap, geoattribute) {
        var olLayer = this.getOlLayer(olMap, geoattribute.get('ollayername'));

        if (!olLayer) {
            olLayer = geoattribute.createOlLayer();

            if (olLayer.get('owner_type') == olMap.get('objecttypename')) {
                olLayer.on('change:visible', function (Event) {
                    this.ol_interaction_select_refresh(olMap);
                }, this);
            }

            //add the layer
            this.getOlMap().addLayer(olLayer);

            //adds the thematism if selected
            if (this.getTheThematism() && geoattribute.get('ollayername') == this.getTheThematism().get('ollayername')) {
                this.applyThematism(olMap, geoattribute, this.getTheThematism());
            }
        }
    },

    /**
     * 
     * @param {ol.layer.Vector || ol.layer.Tile} olLayer 
     */
    removeOlLayer: function (olMap, ollayername) {
        var olLayers = this.getOlLayers(olMap, ollayername);

        Ext.Array.forEach(olLayers, function (item, index, array) {
            olMap.removeLayer(item);
        }, this);

    },

    /**
     * 
     */
    setVisibleOlLayer: function (olMap, ollayername, visible) {
        var olLayers = this.getOlLayers(olMap, ollayername);

        Ext.Array.forEach(olLayers, function (item, index, array) {
            item.setCheckedLayer(visible);
        }, this);
    },

    /**
     * 
     * @param {*} olMap 
     * @param {String} ollayername 
     * @param {[CMDBuildUI.model.gis.GeoValue]} geovalues 
     * @param {Boolean} replace If true clears the layer before adding the features
     */
    addOlFeatures: function (olMap, ollayername, geovalues, replace) {
        var olFeatures = [];

        geovalues.forEach(function (geovalue, index, array) {
            olFeatures.push(geovalue.getOlFeature());
        });

        var olLayer = this.getOlLayer(olMap, ollayername);
        if (olLayer) {

            if (replace) {
                olLayer.getSource().clear();
            }

            olLayer.getSource().addFeatures(olFeatures);

            if (replace || (olLayer.get('owner_type') == olMap.get('objecttypename'))) {
                this.ol_interaction_select_refresh(olMap);
            }
        }
    },

    /**
     * 
     * @param {*} olMap 
     * @param {*} ollayername 
     * @param {*} geolayers 
     * @param {*} replace 
     */
    addOlGeoFeatures: function (olMap, ollayername, geolayers, replace) {
        Ext.Array.forEach(geolayers, function (geolayer, array, index) {

            var foundOlGeoFeature = Ext.Array.findBy(olMap.getLayers().getArray(), function (olLayers, array, index) {
                return olLayers.get('id') == geolayer.getId();
            }, this);

            if (replace) {
                olMap.removeLayer(foundOlGeoFeature);
                foundOlGeoFeature = null;
            }

            if (!foundOlGeoFeature) {
                var geoFeature = geolayer.getOlGeoFeature();
                olMap.addLayer(geoFeature);
            }
        }, this);
    },

    /**
     * 
     * @param {*} olMap 
     * @param {String} ollayername 
     * @param {String} geovalue 
     * @param {String} type drawmode || checked
     * @param {Boolean} value 
     */
    setVisibleOlFeature: function (olMap, ollayername, geovalue, type, value) {
        var olLayer = this.getOlLayer(olMap, ollayername);

        if (olLayer) {
            var olFeature = olLayer.getSource().getFeatureById(geovalue.getId());

            if (olFeature) {
                switch (type) {
                    case 'checked':
                        olFeature.setChecked(value);
                        break;
                    case 'drawmode':
                        olFeature.setDrawmode(value);
                        break;
                }
                this.ol_interaction_select_refresh(olMap);
            }
        }
    },

    /**
     * 
     * @param {*} olMap 
     * @param {*} ollayername 
     * @param {CMDBuildUI.model.gis.GeoLayer} geovalue 
     * @param {*} type 
     * @param {*} value 
     */
    setVisibleOlGeoFeature: function (olMap, ollayername, geovalue, type, value) {
        var olGeoFeature = this.getOlGeoFeatureById(olMap, ollayername, geovalue.getId());

        if (olGeoFeature) {

            switch (type) {
                case CMDBuildUI.model.gis.GeoLayer.checked:
                    olGeoFeature.setChecked(value);
                    break;
            }
        }
    },

    /**
     * 
     * @param {*} olMap 
     * @param {CMDBuildUI.model.thematisms.Thematism} thematism 
     */
    applyThematism: function (olMap, geoattribute, thematism) { //move in model;
        if (thematism) {
            geoattribute.set('thematism', thematism);
        } else {
            geoattribute.set('thematism', undefined);
        }

        var ollayername = geoattribute.get('ollayername');
        var olLayer = this.getOlLayer(olMap, ollayername);
        if (olLayer) {
            this.ol_interaction_select_refresh(olMap);
            olLayer.changed();
        }
    },

    /**
     * 
     * @param {CMDBuildUI.model.gis.GeoValue} config.record 
     */
    modify: function (config) {
        config = Ext.merge({
            record: null,
            listeners: {
                modifystart: {
                    fn: Ext.emptyFn,
                    scope: this
                },
                modifyend: {
                    fn: Ext.emptyFn,
                    scope: this
                }
            }
        }, config);

        //compose the layer name
        var drawModifyLayerName = Ext.String.format('{0}_{1}_{2}', CMDBuildUI.map.util.Util.DRAWMODIFYLAYERNAME, config.record.get('_attr'), config.record.get('_owner_type'));

        //gets the draw modify layer
        var drawModifyLayer = this.getDrawModifyLayer(drawModifyLayerName);
        if (!drawModifyLayer) {
            drawModifyLayer = this.createDrawModifyLayer(drawModifyLayerName, config.record);
        }

        //hide the feature in the layer
        var olMap = this.getOlMap();
        var ollayername = config.record.get('ollayername');
        this.setVisibleOlFeature(olMap, ollayername, config.record, 'drawmode', true);

        //compose the interaction name
        var modifyInteractionName = Ext.String.format('{0}_{1}_{2}', CMDBuildUI.map.util.Util.MODIFYINTERACTIONNAME, config.record.get('_attr'), config.record.get('_owner_type'));

        var modifyInteraction = this.getModifyInteraction(modifyInteractionName);
        if (!modifyInteraction) {
            modifyInteraction = this.createModifyInteraction(modifyInteractionName, {
                source: drawModifyLayer.getSource()
            });
        }

        //modify start listener
        modifyInteraction.once('modifystart', function () {
            config.listeners.modifystart.fn.call(config.listeners.modifystart.scope);
        });

        //modifyend listener
        modifyInteraction.on('modifyend', function (event) {
            // event.feature, event.mapBrowserEvent, event.target, event.type

            var points = CMDBuildUI.map.util.Util.olCoordinatesToObject(event.features.item(0).getGeometry().getType(), event.features.item(0).getGeometry().getCoordinates());

            config.listeners.modifyend.fn.call(config.listeners.modifyend.scope, points);
        });
    },

    /**
     * 
     * @param {*} config 
     */
    draw: function (config) {
        config = Ext.merge({
            record: null,
            listeners: {
                drawend: {
                    fn: Ext.emptyFn,
                    scope: this
                },
                drawstart: {
                    fn: Ext.emptyFn,
                    scope: this
                }
            }
        }, config);

        //compose the layer name
        var drawModifyLayerName = Ext.String.format('{0}_{1}_{2}', CMDBuildUI.map.util.Util.DRAWMODIFYLAYERNAME, config.record.get('_attr'), config.record.get('_owner_type'));

        //gets the draw modify layer
        var drawModifyLayer = this.getDrawModifyLayer(drawModifyLayerName);
        if (!drawModifyLayer) {
            drawModifyLayer = this.createDrawModifyLayer(drawModifyLayerName, config.record);
        }

        //draw interactoin name
        var drawInteractionName = Ext.String.format('{0}_{1}_{2}', CMDBuildUI.map.util.Util.DRAWINTERACTIONNAME, config.record.get('_attr'), config.record.get('_owner_type'));

        var drawInteraction = this.getDrawInteraction(drawInteractionName);
        if (!drawInteraction) {
            drawInteraction = this.createDrawInteraction(drawInteractionName, {
                source: drawModifyLayer.getSource(),
                type: this.format(config.record.get('_type'))
            });
        }

        drawInteraction.setActive(true);
        //drawstart listener
        drawInteraction.once('drawstar', function (event) {
            config.listeners.drawstart.fn.call(config.listeners.drawstart.scope);
        });

        //drawend listener
        drawInteraction.once('drawend', function (event) {
            drawInteraction.setActive(false);
            var points = CMDBuildUI.map.util.Util.olCoordinatesToObject(event.feature.getGeometry().getType(), event.feature.getGeometry().getCoordinates());

            config.listeners.drawend.fn.call(config.listeners.drawstart.scope, points);
        });
    },

    /**
     * 
     * @param {Object} config 
     */
    clear: function (config) {
        Ext.merge({
            record: null,
            listeners: {
                clear: {
                    fn: Ext.emptyFn,
                    scope: this
                }
            }
        }, config);

        //compose the layer name
        var drawModifyLayerName = Ext.String.format('{0}_{1}_{2}', CMDBuildUI.map.util.Util.DRAWMODIFYLAYERNAME, config.record.get('_attr'), config.record.get('_owner_type'));

        //gets the draw modify layer
        var drawModifyLayer = this.getDrawModifyLayer(drawModifyLayerName);
        if (!drawModifyLayer) {
            drawModifyLayer = this.createDrawModifyLayer(drawModifyLayerName, config.record);
        }

        //hide the feature in the layer
        var olMap = this.getOlMap();
        var ollayername = config.record.get('ollayername');
        this.setVisibleOlFeature(olMap, ollayername, config.record, 'drawmode', true);

        drawModifyLayer.getSource().once('clear', function () {
            config.listeners.clear.fn.call(config.listeners.clear.scope);
        });

        drawModifyLayer.getSource().clear();
    },

    /**
     * 
     */
    clean: function (record) {

        //compose the interaction name
        var modifyInteractionName = Ext.String.format('{0}_{1}_{2}', CMDBuildUI.map.util.Util.MODIFYINTERACTIONNAME, record.get('_attr'), record.get('_owner_type'));

        this.removeModifyinteraction(modifyInteractionName);

        //compose the draw interactoin name
        var drawInteractionName = Ext.String.format('{0}_{1}_{2}', CMDBuildUI.map.util.Util.DRAWINTERACTIONNAME, record.get('_attr'), record.get('_owner_type'));

        this.removeDrawInteraction(drawInteractionName);

        //compose the layer name
        var drawModifyLayerName = Ext.String.format('{0}_{1}_{2}', CMDBuildUI.map.util.Util.DRAWMODIFYLAYERNAME, record.get('_attr'), record.get('_owner_type'));

        this.removeDrawModifyLayer(drawModifyLayerName);

        //hide the feature in the layer
        var olMap = this.getOlMap();
        var ollayername = record.get('ollayername');
        this.setVisibleOlFeature(olMap, ollayername, record, 'drawmode', false);

    },

    /**
     * 
     * @param {ol.Map} olMap 
     * @param {Array} center 
     * @param {Number} zoom
     */
    animatemap: function (olMap, center, zoom) {
        olMap.getView().animate({
            center: center,
            zoom: zoom,
            duration: 500
        });
    },

    /**
     * 
     * @param {String} name the name for the layer
     * @returns {ol.layer.Vector}
     */
    getDrawModifyLayer: function (name) {
        //get the draw layer
        var drawModifyLayer = Ext.Array.findBy(this.getOlMap().getLayers().getArray(), function (layer, index, array) {
            if (layer.get('name') == name) {
                return true;
            }
        });

        return drawModifyLayer;
    },

    /**
     * 
     * @param {String} name the name for the layer
     * @param {CMDBuildUI.model.gis.GeoValue} geoValue
     * @returns {ol.layer.Vector}
     */
    createDrawModifyLayer: function (name, geoValue) {
        var drawSource = new ol.source.Vector();

        if (geoValue.hasValues()) {
            drawSource.addFeature(geoValue.getOlFeature());
        }

        drawModifyLayer = new ol.layer.Vector({
            source: drawSource,
            style: new ol.style.Style({
                image: new ol.style.Circle({
                    fill: new ol.style.Fill({
                        color: 'rgba(255,165,0,1)'//'orange',//[0, 255, 0, 0.5],
                    }),
                    stroke: new ol.style.Stroke({
                        width: 1,
                        color: 'white'
                    }),
                    radius: 10

                }),
                fill: new ol.style.Fill({
                    color: 'rgba(255,165,0,0.5)'//[255, 165, 0, 0.7], //'orange'
                }),
                stroke: new ol.style.Stroke({
                    color: 'white',
                    width: 2
                }),
                zIndex: 5555
            })
        });
        drawModifyLayer.set('name', name);
        this.getOlMap().addLayer(drawModifyLayer);

        return drawModifyLayer;
    },

    /**
     * 
     * @param {String} name 
     */
    removeDrawModifyLayer: function (name) {
        var drawModifyLayer = this.getDrawModifyLayer(name);
        if (drawModifyLayer) {
            this.getOlMap().removeLayer(drawModifyLayer);
        }
    },

    /**
     * 
     * @param {String} name  The name of the draw interaction
     * @returns {ol.interaction.Draw}
     */
    getDrawInteraction: function (name) {
        //get the draw interaction
        var drawInteraction = Ext.Array.findBy(this.getOlMap().getInteractions().getArray(), function (interaction, index, array) {
            if (interaction.get("name") == name) {
                return true;
            }
        });

        return drawInteraction;
    },

    /**
     * @param {String} name
     * @param {Object} config
     * @returns {ol.interaction.Draw}
     */
    createDrawInteraction: function (name, config) {

        //creates the interaction object
        drawInteraction = new ol.interaction.Draw({
            source: config.source,
            type: config.type // style: style //HACK: change drawInteraction style
        });
        drawInteraction.set('name', name);

        //adds the interaction to the map
        this.getOlMap().addInteraction(drawInteraction);

        return drawInteraction;
    },

    /**
     * 
     * @param {String} name 
     */
    removeDrawInteraction: function (name) {
        var drawInteraction = this.getDrawInteraction(name);
        if (drawInteraction) {
            this.getOlMap().removeInteraction(drawInteraction);
        }
    },

    /**
     * 
     * @param {String} name  The name of the modify interaction
     * @returns {ol.interaction.Modify}
     */
    getModifyInteraction: function (name) {

        var modifyInteraction = Ext.Array.findBy(this.getOlMap().getInteractions().getArray(), function (interaction, index, array) {
            if (interaction.get("name") == name) {
                return true;
            }
        });

        return modifyInteraction;
    },

    /**
     * 
     * @param {*} name 
     * @param {*} config 
     * @returns {ol.interaction.Modify}
     */
    createModifyInteraction: function (name, config) {
        //creates the interaction object
        modifyInteraction = new ol.interaction.Modify({
            source: config.source // style: olTmpStyle
        });
        modifyInteraction.set('name', name);

        //adds the interaction to the map
        this.getOlMap().addInteraction(modifyInteraction);

        return modifyInteraction;
    },

    /**
     * 
     * @param {String} name 
     */
    removeModifyinteraction: function (name) {
        var modifyInteraction = this.getModifyInteraction(name);
        if (modifyInteraction) {
            this.getOlMap().removeInteraction(modifyInteraction);
        }
    },

    /*
     * this function modifyes a string mantaining the same words but setting uppercase the first latter and lowercase the remaining
     * @param {String} inp the input string
     * @return {String} the modified string
     */
    format: function (type) {
        type = type.toLowerCase();

        switch (type) {
            case 'point':
                return 'Point';
            case 'linestring':
                return 'LineString';
            case 'polygon':
                return 'Polygon';
        }
    },

    getOl_interaction_select: function (olMap) {
        var collection = olMap.getInteractions();
        for (var i = 0; i < collection.getLength(); i++) {
            var item = collection.item(i);
            if (item instanceof ol.interaction.Select) {
                return item;
            }
        }
    },

    setOl_Interaction_select: function (olMap) {
        var oldInteration = this.getOl_interaction_select(olMap);
        if (oldInteration) {
            olMap.removeInteraction(oldInteration);
        }
        var layerStore = this.getLayerStore();
        var featureStore = this.getFeatureStore();
        var objecttypename = olMap.get('objecttypename');
        var objecttypenameklass = CMDBuildUI.util.helper.ModelHelper.getClassFromName(objecttypename);

        var me = this;
        var interaction = new ol.interaction.Select({
            multi: false,
            condition: function (Event) {
                if (Event.type == ol.MapBrowserEventType.SINGLECLICK) {
                    return me.getDrawmode() == false;
                }
            },
            layers: function (layer) {
                var owner_type = layer.get('owner_type');
                if (owner_type) {
                    var layerklass = CMDBuildUI.util.helper.ModelHelper.getClassFromName(owner_type)
                    var layerhierarchy = layerklass.getHierarchy();

                    if (Ext.Array.contains(layerhierarchy, objecttypename)) {
                        //the layer is defined in the same class or in a subClass of objecttypename
                        return true;
                    } else {
                        /* var objecttypenamehierarchy = objecttypenameklass.getHierarchy();

                        //for now we don't allow clicking on superclass instances
                        if (Ext.Array.contains(objecttypenamehierarchy, owner_type)) {
                            //the layer is defined in a superClass of objecttypename
                            return true;
                        } */
                    }
                }
                return false;
            },
            style: function (olFeature, number) {
                var ollayername = olFeature.get('ollayername');
                var index = layerStore.find('ollayername', ollayername);
                var featurenotfound;

                var featureIndex;
                var feature;
                var featurechek;

                if (index == -1) {
                    //if the layer is filtered
                    featurenotfound = CMDBuildUI.model.gis.GeoAttribute.getOlLayerVectorStyleRemoved();
                    return [featurenotfound];
                } else {
                    var item = layerStore.getAt(index);
                    var basestyle;
                    var selectionstyle;
                    var highlightselected = item.get('thematism') ? this.getHighlightselected() : true;

                    if (item.get('checked') == true) {
                        // if the layer is visible

                        if (me.getAdvancedfilter() || me.getSearchterm()) {
                            //if there is a filter applied
                            featureIndex = featureStore.find('_id', olFeature.getId());

                            if (featureIndex == -1) {
                                //if the feature is filtered
                                featurenotfound = CMDBuildUI.model.gis.GeoAttribute.getOlLayerVectorStyleRemoved();
                                return [featurenotfound];

                            } else {
                                //if the feature is not filtered
                                feature = featureStore.getAt(featureIndex)
                                featurechek = feature.get('checked');

                                if (featurechek == true || Ext.isEmpty(featurechek)) {
                                    //if the feature is visible; set by the navigation tree;
                                    basestyle = item.getOlLayerVectorStyle(olFeature);

                                    if (highlightselected) {
                                        //if thematism is applied and highlightselected 
                                        selectionstyle = item.getOlLayerVectorStyleSelected();
                                        return Ext.Array.merge(basestyle, selectionstyle);
                                    } else {
                                        //if thematism is not applied or the selected item must not be highlited
                                        return basestyle;
                                    }

                                } else {
                                    //if the feature is not visible
                                    featurenotfound = CMDBuildUI.model.gis.GeoAttribute.getOlLayerVectorStyleRemoved();
                                    return [featurenotfound];
                                }
                            }
                        } else {
                            //if there is not a filter applied
                            featureIndex = featureStore.find('_id', olFeature.getId());

                            if (featureIndex != -1) {
                                //if the feature is in the store
                                feature = featureStore.getAt(featureIndex);
                                featurechek = feature.get('checked');

                                if (featurechek == true || Ext.isEmpty(featurechek)) {
                                    //if the feature is visible; set by the navigation tree
                                    basestyle = item.getOlLayerVectorStyle(olFeature);

                                    if (highlightselected) {
                                        //if thematism is applied and highlightselected 
                                        selectionstyle = item.getOlLayerVectorStyleSelected();
                                        return Ext.Array.merge(basestyle, selectionstyle);
                                    } else {
                                        //if thematism is not applied or the selected item must not be highlited
                                        return basestyle;
                                    }

                                } else {
                                    //if the feature is not visible
                                    featurenotfound = CMDBuildUI.model.gis.GeoAttribute.getOlLayerVectorStyleRemoved();
                                    return [featurenotfound];
                                }

                            } else {
                                //if the feature is not in the store
                                basestyle = item.getOlLayerVectorStyle(olFeature);

                                if (highlightselected) {
                                    //if thematism is applied and highlightselected 
                                    selectionstyle = item.getOlLayerVectorStyleSelected();
                                    return Ext.Array.merge(basestyle, selectionstyle);
                                } else {
                                    //if thematism is not applied or the selected item must not be highlited
                                    return basestyle;
                                }
                            }
                        }
                    } else {
                        //if the layer is not visible
                        featurenotfound = CMDBuildUI.model.gis.GeoAttribute.getOlLayerVectorStyleRemoved();
                        return [featurenotfound];
                    }
                }
            }.bind(this)
        });

        interaction.on('select', function (event) {

            //selects only one feature in the map
            interaction.getFeatures().clear();
            var olFeature = null;

            if (event.selected.length != 0) {
                olFeature = event.selected[0];

                if (olFeature.isVisible() === false) {
                    var clone = olFeature.clone();
                    clone.setStyle(undefined);
                    clone.setId(olFeature.getId());
                    interaction.getFeatures().push(clone);
                } else {
                    interaction.getFeatures().push(olFeature);
                }

            }

            if (event.mapBrowserEvent && !event.mapBrowserEvent.silent) {
                this.setObjectId(olFeature ? olFeature.get('_owner_id') : null);
            }
        }, this);

        olMap.addInteraction(interaction);
    },

    /**
     * 
     * @param {*} olMap 
     * @param {CMDBuildUI.model.gis.GeoValue} geovalues 
     */
    ol_interaction_select_select: function (olMap, geovalues, silent) {
        silent = Ext.isEmpty(silent) ? false : silent;

        var interaction = this.getOl_interaction_select(olMap);
        if (interaction) {

            var deselected = interaction.getFeatures().getArray();
            var selected = [];
            var feature;

            Ext.Array.map(geovalues, function (item, index, array) {

                var layer = this.getOlLayer(olMap, item.get('ollayername'));
                if (layer) {
                    feature = layer.getSource().getFeatureById(item.getId());

                    /**
                     * if the feature is not
                     */
                    if (!feature) {
                        this.addOlFeatures(olMap, item.get('ollayername'), [item]);
                        feature = layer.getSource().getFeatureById(item.getId());
                    }
                    selected.push(feature);

                } else {
                    feature = item.getOlFeature();
                    selected.push(feature);
                }
            }, this);

            interaction.dispatchEvent(new ol.interaction.Select.Event('select', selected, deselected, {
                silent: silent
            }));
        }
    },

    /**
     * This function is created to trigger the style calculation. 
     * Used for when changing the 'checked' in layerStore records
     * @param {*} olMap 
     */
    ol_interaction_select_refresh: function (olMap) {
        var interaction = this.getOl_interaction_select(olMap);
        if (interaction) {
            var selected = [];
            var feature = interaction.getFeatures().item(0);

            if (feature) {
                var layer = this.getOlLayer(olMap, feature.get('ollayername'));
                if (layer) {
                    var layerfeature = layer.getSource().getFeatureById(feature.getId());

                    /**
                     * if the feature is not
                     */
                    if (!layerfeature) {
                        selected.push(feature);
                    } else {
                        selected.push(layerfeature);
                    }

                } else {
                    // feature = item.getOlFeature();
                    selected.push(feature);
                }
            }

            interaction.dispatchEvent(new ol.interaction.Select.Event('select', selected, [], {
                silent: true
            }));
        }
    }
});