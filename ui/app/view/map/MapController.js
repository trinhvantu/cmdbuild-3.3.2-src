Ext.define('CMDBuildUI.view.map.MapController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.map-map',
    control: {
        '#': {
            beforerender: 'onBeforeRender'
        }
    },

    /**
     * 
     * @param {*} view 
     * @param {*} eOpts 
     */
    onBeforeRender: function (view, eOpts) {
        var vm = this.getViewModel();
        vm.bind({
            olMap: '{map.olMap}'
        }, function (data) {
            if (data.olMap) {
                this.getView().addListener('mapcenterchange', this.mapCenterChange, this);

                view.getLayerStore().addListener('filterchange', this.onFilterChange, this);
                view.getLayerStore().addListener('update', this.onLayerStoreUpdate, this);

                this.getView().addListener('resize', this.onResize, this);
                this.getView().addListener('drawmodechange', this.onDrawmodeChange, this);
                this.getView().addListener('advancedfilterchange', this.onAdvancedfilterChange, this);
                this.getView().addListener('searchtermchange', this.onSearchtermChange, this);

            }
        }, this);

        vm.bind({
            objectType: '{map.objectType}',
            objectTypeName: '{map.objectTypeName}',
            layerStore: '{map.layerStore}',
            featuresStore: '{map.featureStore}'
        }, function (data) {
            if (data.objectTypeName && data.objectType && data.layerStore && data.featuresStore) {
                this.createOlMap();
                this.onFilterChange(data.layerStore);
            }
        }, this);

        vm.bind({
            olMap: '{map.olMap}',
            theThematism: '{map.theThematism}',
            objectTypeName: '{map.objectTypeName}',
            layerStore: '{map.layerStore}'
        }, function (data) {
            if (data.objectTypeName && data.layerStore && data.olMap) {
                var layer;
                var index;

                if (data.theThematism) {

                    index = data.layerStore.getSource().find('ollayername', data.theThematism.get('ollayername'));
                    layer = data.layerStore.getSource().getAt(index);

                    this.getView().applyThematism(data.olMap, layer, data.theThematism);
                } else {

                    index = data.layerStore.getSource().find('owner_type', data.objectTypeName, 0);
                    while (index != -1) {
                        layer = data.layerStore.getSource().getAt(index);

                        if (layer.get('thematism')) {
                            this.getView().applyThematism(data.olMap, layer, null);
                        }

                        index = data.layerStore.getSource().find('owner_type', data.objectTypeName, ++index);
                    }
                }
            }
        }, this);

        vm.bind({
            olMap: '{map.olMap}',
            layerStore: '{map.layerStore}',
            objectTypeName: '{map.objectTypeName}'
        }, function (data) {
            if (data.olMap && data.layerStore && data.objectTypeName) {

                var vm = this.getViewModel();
                var geoattributeindex = data.layerStore.getSource().findBy(function (geoattribute) {
                    return (geoattribute.get('owner_type') == data.objectTypeName && geoattribute.get('type') == CMDBuildUI.model.gis.GeoAttribute.type.geometry);
                });

                if (geoattributeindex == -1) {
                    geoattributeindex = data.layerStore.getSource().findBy(function (geoattribute) {
                        return geoattribute.get('type') == CMDBuildUI.model.gis.GeoAttribute.type.geometry;
                    }, this);
                }

                var geoattribute = data.layerStore.getSource().getAt(geoattributeindex);
                if (geoattribute) {

                    vm.bind({
                        objectId: '{map.objectId}'
                    }, function (data) {
                        if (Ext.isEmpty(data.objectId)) {

                            Ext.Ajax.request({
                                url: Ext.String.format('{0}/classes/_ANY/cards/_ANY/geovalues/center', CMDBuildUI.util.Config.baseUrl),
                                method: 'GET',
                                params: {
                                    attribute: geoattribute.getId()
                                },
                                scope: this
                            }).then(function (response) {
                                if (this.getView()) {
                                    var responseText = JSON.parse(response.responseText);
                                    if (responseText && responseText.found) {
                                        var data = responseText.data;
                                        this.getView().setMapCenter([data.x, data.y]);
                                        this.getView().setZoom(geoattribute.get("zoomDef"));
                                    }
                                }
                            }, Ext.emptyFn, Ext.emptyFn, this);
                        }
                    }, this, {
                        single: true
                    });
                }
            }
        }, this);
    },

    /**
     * This function loads the features on the map
     */
    mapCenterChange: function (view, newValue, oldValue) {
        this.delayloadfeatures();
    },

    onDrawmodeChange: function (view, newValue, oldValue) {
        if (newValue == false) {
            this.delayloadfeatures(true);
        }
    },

    onAdvancedfilterChange: function (view, newValue, oldValue) {
        this.delayloadfeatures(true);
    },

    onSearchtermChange: function (value, newValue, oldValue) {
        this.delayloadfeatures(true);
    },

    /**
     * 
     * @param {*} geovalue 
     */
    animateMap: function (geovalue) {
        var view = this.getView();
        var ollayername = geovalue.get('ollayername');
        var zoom;
        var center;

        //gets't the zoom
        var layer = view.getLayerStore().find('ollayername', ollayername);
        if (layer == -1) {
            //if layer is filtered --> the olLayer is not visible

            var layerrecord = view.getLayerStore().getSource().findRecord('ollayername', ollayername);
            if (layerrecord) {
                zoom = layerrecord.get('zoomDef');
            } else {
                console.log(Ext.String.format('the geoattribute `{0}` is not set as visible for the class `{1}`', ollayername, this.getView().getObjectTypeName()));
            }
        } else {
            //if layer is not filtered --> the layer is visible

            zoom = view.getZoom();
        }

        center = geovalue.getCenter();

        view.animatemap(
            view.getOlMap(),
            center,
            zoom
        );
    },

    /** 
     * This function loads the features on the map
     */
    delayloadfeatures: function (replace) {
        if (this.getView().getDrawmode() == false) {
            var t = this.getDelayedTask();
            var args;

            if (Ext.isEmpty(t.id)) {
                //there are not yet pending tasks
                args = [replace];
            } else {
                //there was a task before
                args = replace == true ? [replace] : undefined;
            }

            t.delay(this._delayvalue, this.loadfeatures, this, args);
        }
    },

    /** 
     * This function loads the features on the map
     */
    loadfeatures: function (replace) {
        var view = this.getView();
        // replace = true;
        if (view) {
            var extent = view.getOlMap().getView().calculateExtent();
            var geometryVisibleattributesId = [];
            var geometryOwningattributesId = [];

            var shapeattributesNames = [];

            var objecttypenameklass = CMDBuildUI.util.helper.ModelHelper.getObjectFromName(view.getObjectTypeName());
            var objecttypenamehierarchy = objecttypenameklass.getHierarchy();

            //gets the geoattributes ids
            view.getLayerStore().getRange().forEach(function (geoattribute, index, array) {
                if (geoattribute.get('type') == CMDBuildUI.model.gis.GeoAttribute.type.geometry) {

                    var geoattributeklassname = geoattribute.get('owner_type');
                    var geoattributeklass = CMDBuildUI.util.helper.ModelHelper.getObjectFromName(geoattributeklassname);
                    var geoattributehierarchy = geoattributeklass.getHierarchy();

                    if (Ext.Array.contains(geoattributehierarchy, view.getObjectTypeName())) {
                        //the geoatttribute is defined in the same class or in a subClass of objecttypename
                        geometryOwningattributesId.push(geoattribute.getId());

                    } /* 
                        commenting this block avoids appying the advanced filter on geoattributes defined in superClasses
                    else if (Ext.Array.contains(objecttypenamehierarchy, geoattributeklassname)) {
                        //the geoattribute is defined in a superClass of the objecttypename
                        geometryOwningattributesId.push(geoattribute.getId());

                    } */ else {

                        //attributes visible by the current objectTypeName
                        geometryVisibleattributesId.push(geoattribute.getId());
                    }
                } else if (geoattribute.get('type') == CMDBuildUI.model.gis.GeoAttribute.type.shape) {
                    shapeattributesNames.push(geoattribute.getId());
                }
            }, this);

            var promises = [];
            //makes the appropriate calls for getting the geovalues
            if (!Ext.isEmpty(geometryVisibleattributesId) || !Ext.isEmpty(geometryOwningattributesId)) {

                //adds load mask
                var mask = CMDBuildUI.util.Utilities.addLoadMask(view);

                //get advanced filter and query filter
                var advancedfilter = view.getAdvancedfilter();
                var searchterm = view.getSearchterm();

                if (advancedfilter || searchterm) {

                    //get geovalues appying the filter. Only for geoattributes wich are owned by the class on wich is applied the filter
                    if (!Ext.isEmpty(geometryOwningattributesId)) {
                        promises.push(this.loadFeaturesStore({
                            url: CMDBuildUI.util.api.Classes.getGeoValuesUrl('_ANY', '_ANY'),
                            params: {
                                attribute: geometryOwningattributesId,
                                area: extent.toString(),
                                limit: 0,
                                attach_nav_tree: view.getNavigationTree() ? true : false
                            }
                        }, advancedfilter, searchterm));
                    }

                    //Doesn't need to apply the filter on those class
                    if (!Ext.isEmpty(geometryVisibleattributesId)) {
                        promises.push(this.loadFeaturesStore({
                            url: CMDBuildUI.util.api.Classes.getGeoValuesUrl('_ANY', '_ANY'),
                            params: {
                                attribute: geometryVisibleattributesId,
                                area: extent.toString(),
                                limit: 0,
                                attach_nav_tree: view.getNavigationTree() ? true : false
                            }
                        }));
                    }

                } else {
                    promises.push(this.loadFeaturesStore({
                        url: CMDBuildUI.util.api.Classes.getGeoValuesUrl('_ANY', '_ANY'),
                        params: {
                            attribute: Ext.Array.merge(geometryOwningattributesId, geometryVisibleattributesId),
                            area: extent.toString(),
                            limit: 0,
                            attach_nav_tree: view.getNavigationTree() ? true : false
                        }
                    }));
                }
            }

            var shapepromises = [];
            //makes the appropriate calls for getting the geolayers values
            if (!Ext.isEmpty(shapeattributesNames)) {
                shapepromises.push(this.loadShapeFeatureStore({
                    url: CMDBuildUI.util.api.Classes.getGeoLayersUrl('_ANY', '_ANY')
                }, new CMDBuildUI.util.AdvancedFilter({
                    attributes: {
                        'attribute_id': {
                            attribute: 'attribute_id',
                            operator: 'IN',
                            value: Ext.Array.map(shapeattributesNames, function (item, index, array) {
                                return item;
                            }, this)
                        }
                    }
                })));
            }

            if (!Ext.isEmpty(promises)) {
                /**
                 * Manipulates the geovalues setting the right values for visibility, and bim Values.
                 */
                Ext.Deferred.all(promises).then(function (results) {
                    results = Ext.Array.merge.apply(this, results);
                    if (this.getView()) {
                        this.getView().geovaluesVisibility(results);
                        this.getView().geovaluesBim(results);

                        //adds the record in view memory store
                        this.getView().getFeatureStore().loadRecords(results, {
                            addRecords: !replace
                        });

                        //adds the geovalues on the map
                        this.onFeaturesLoad.call(this, replace);

                        //removes load mask
                        CMDBuildUI.util.Utilities.removeLoadMask(mask);
                    }
                    CMDBuildUI.util.Utilities.removeLoadMask(mask);
                }, Ext.emptyFn, Ext.emptyFn, this);
            }

            if (!Ext.isEmpty(shapepromises)) {
                /**
                 * 
                 */
                Ext.Deferred.all(shapepromises).then(function (results) {
                    results = Ext.Array.merge.apply(this, results);
                    if (this.getView()) {

                        this.getView().geolayerVisibility(results);
                        this.getView().getlayerLayerVisibility(results);

                        //adds the record in view memory store
                        this.getView().getShapeFeatureStore().loadRecords(results, {
                            addRecords: !replace
                        });

                        //adds 
                        this.onShapeFeaturesLoad.call(this, replace);
                    }
                }, Ext.emptyFn, Ext.emptyFn, this);
            }
        }
    },

    /** 
     * Callback after loading the features
     */
    onFeaturesLoad: function (replace) {
        var view = this.getView();
        var olMap = view.getOlMap();

        if (!view.getFeatureStore()) {
            console.log('Feature Store should be present here');
        } else {
            if (!replace) {
                view.getFeatureStore().getGroups().getRange().forEach(function (group, index, array) {
                    var ollayername = group.getGroupKey();
                    view.addOlFeatures(olMap, ollayername, group.getRange(), replace);
                });
            } else {
                Ext.Array.forEach(view.getLayerStore().getRange(), function (item, index, array) {
                    if (item.get('type') == CMDBuildUI.model.gis.GeoAttribute.type.geometry) {
                        var ollayername = item.get('ollayername');
                        var groups = view.getFeatureStore().getGroups();
                        if (groups) {
                            var group = groups.findBy(function (item, index, array) {
                                return item.getGroupKey() == ollayername;
                            }, this, 0);

                            var groupRange;
                            if (group) {
                                groupRange = group.getRange()
                            } else {
                                groupRange = [];
                            }
                            view.addOlFeatures(olMap, ollayername, groupRange, replace);
                        } else {
                            view.addOlFeatures(olMap, ollayername, [], replace);
                        }
                    }
                }, this);
            }
        }
    },

    onShapeFeaturesLoad: function (replace) {
        var view = this.getView();
        var shapefeatures = view.getShapeFeatureStore();

        if (!shapefeatures) {
            console.log('ShapeFeature Store should be present here');
        } else {
            view.addOlGeoFeatures(view.getOlMap(), '_', shapefeatures.getRange(), replace);
        }
    },

    /**
     * This function is responsable for adding and removing olLayers
     * @param {*} geoattributes 
     * @param {*} filter 
     * @param {*} eOpts 
     */
    onFilterChange: function (layerStore, filters, eOpts) {
        var view = this.getView();

        //not filtered records
        var dataSource = layerStore.getDataSource();

        //filtered records
        var data = layerStore.getData();
        var olMap = view.getOlMap();
        var hasRemoved = false;

        dataSource.getRange().forEach(function (item, index, array) {

            if (data.isItemFiltered(item)) {
                //must remove olLayer. If already removed doesn't break
                view.removeOlLayer(olMap, item.get('ollayername'));
                hasRemoved = true;
            } else {
                if (item.get('type') == CMDBuildUI.model.gis.GeoAttribute.type.geometry) {
                    //add olLayer, doesn't add if already exist
                    view.addOlLayer(olMap, item);
                }
            }
        }, this);

        this.delayloadfeatures.call(this, hasRemoved);
    },

    /**
     * 
     * @param {Ext.data.ChainedStore} store 
     * @param {Ext.data.Model} record 
     * @param {String} operation 
     * @param {[String]} modifiedFieldNames 
     * @param {object} details 
     * @param {object} eOpts 
     */
    onLayerStoreUpdate: function (store, record, operation, modifiedFieldNames, details, eOpts) {
        /**
         * handles the visibility of the 
         */
        if (Ext.Array.contains(modifiedFieldNames, 'checked')) {
            var view = this.getView();
            var olMap = view.getOlMap();

            view.setVisibleOlLayer(olMap, record.get('ollayername'), record.get('checked'));
        }
    },

    onResize: function (extCmp, width, height) {
        var view = this.getView();
        var map = view.getOlMap();
        map.setSize([width, height]);
        this.delayloadfeatures();
    },
    _delayvalue: 100,
    getDelayedTask: function () {
        if (!this._delayedTask) {
            this._delayedTask = new Ext.util.DelayedTask();
        }

        return this._delayedTask;
    },

    /**
     * @param view
     * @param eOpts
     */
    createOlMap: function () {
        var view = this.getView();
        // sets and generates the html div id
        view.setHtml(
            Ext.String.format(
                '<div id="{0}" style="height: 100%;"></div>',
                view.getDivMapId()
            )
        );
        var zoom = view.getZoom() || this.getViewModel().get('actualZoom');
        var center = view.getMapCenter();

        var viewConfig = {
            projection: 'EPSG:3857',
            zoom: zoom,
            center: center,
            maxZoom: 25 > CMDBuildUI.util.helper.Configurations.get(CMDBuildUI.model.Configuration.gis.maxZoom) ? CMDBuildUI.util.helper.Configurations.get(CMDBuildUI.model.Configuration.gis.maxZoom) : 25,
            minZoom: 2 < CMDBuildUI.util.helper.Configurations.get(CMDBuildUI.model.Configuration.gis.minZoom) ? CMDBuildUI.util.helper.Configurations.get(CMDBuildUI.model.Configuration.gis.minZoom) : 2
        };

        // Configure map components
        var olView = new ol.View(viewConfig);
        olView.on('change:resolution', function (olEvent) {
            var newZoom = this.getZoom();
            view.setZoom(newZoom);
        });

        olView.on('change:center', function (olEvent) {
            var newCenter = this.getCenter();
            view.setMapCenter(newCenter);
        });

        var baseLayer = new ol.layer.Tile({
            source: new ol.source.OSM()
        });
        baseLayer.set('name', CMDBuildUI.model.gis.GeoAttribute.BASETILE);
        var controls = this.createMapControls();
        // add map to container
        // TODO: Resolve the probleme on the opening of map, if i resize the window (of chrome) all works otherwise is wrong 
        var olMap = new ol.Map({
            controls: controls,
            target: view.getDivMapId(),
            view: olView,
            layers: [
                baseLayer
            ]
        });
        olMap.set('objecttype', view.getObjectType());
        olMap.set('objecttypename', view.getObjectTypeName());

        view.setOl_Interaction_select(olMap);

        view.setOlMap(olMap);
        this.addBimInteraction();
        this.addLongPressEvent();
    },

    /**
     * @returns {[ol.control.Control]}
     */
    createMapControls: function () {
        var me = this;
        return [
            new ol.control.Zoom(),
            new ol.control.ScaleLine(),
            new ol.control.MousePosition({
                projection: 'EPSG:4326',
                coordinateFormat: function (coord) { //Template for the mousePostiton controller
                    var view = me.getView();
                    if (view) {

                        var olMap = view.getOlMap();
                        var olView = olMap.getView();
                        olView.set('coord', coord);

                        var template = Ext.String.format('{0}: {1} {2}: {3}',
                            CMDBuildUI.locales.Locales.gis.zoom,
                            view.getZoom(),
                            CMDBuildUI.locales.Locales.gis.position,
                            '{x} {y}'
                        );
                        return ol.coordinate.format(coord, template, 2);
                    }
                }
            }),
            new searchControl()

        ];
    },

    /**
     * This function sets hover and styling for the features with bim
     * Add's an event handler for the map pointer move
     */
    addBimInteraction: function () {
        // var bimEnabled = CMDBuildUI.util.helper.Configurations.get(CMDBuildUI.model.Configuration.bim.enabled);
        // if (!bimEnabled) {
        //     return;
        // }

        this.addBimPopup();
        this.pointermoveMapAssign();

    },

    /**
     * Binds a function to pointermove event
     */
    pointermoveMapAssign: function () {
        var map = this.getView().getOlMap();
        map.on('pointermove', this.pointerMoveFunction, this);
    },

    // /**
    //  * 
    //  */
    // pointermoveMapUnassign: function () {
    //     var map = this.getView().getOlMap();
    //     map.un('pointermove', this.pointerMoveFunction, this);
    // },
    /**
     * This is the function fired on 'pointermove' ol event
     * Is used to kwno when open the popup for the bim elements
     * @param event
     */
    pointerMoveFunction: function (event) {
        var me = this;
        var map = this.getView().getOlMap();
        var features = map.getFeaturesAtPixel(event.pixel);

        if (features) {
            var feature = features[0];
            var featureId = feature.getId();

            if (feature.get('hasBim') == true) { //HACK: enable popup only for point type

                if (featureId != this._popupBim.lastFeatureId && !me._popupBimEvents.popupHover) {
                    this._popupBim.lastFeatureId = featureId;
                    this._popupBim.lastProjectId = feature.get('projectId');
                    this._popupBimEvents.featureHover = true;

                    var position = feature.getGeometry().getCoordinates();
                    this._popupBim.overlay.setPosition(position);
                }
            }
        }
        else {
            this._popupBimEvents.featureHover = false;
        }

        if (this._popupBimEvents.featureHover == false && this._popupBimEvents.popupHover == false) {
            this._popupBim.overlay.setPosition(undefined);
            this._popupBim.lastFeatureId = null;
        }
    },

    /**
     * creates the DOM element,the ol.Overlay element and adds it to the map
     */
    addBimPopup: function () {
        var me = this;
        /**
         * Creates the DOM element
         */

        var extEl = new Ext.button.Button({
            text: CMDBuildUI.locales.Locales.bim.showBimCard,
            localized: {
                text: 'CMDBuildUI.locales.Locales.bim.showBimCard'
            },
            renderTo: Ext.getBody(),
            handler: function () {
                CMDBuildUI.util.bim.Util.openBimPopup(
                    me._popupBim.lastProjectId,
                    null
                );
            }
        });

        var element = extEl.getEl().dom;

        /**
         * Add controls to the dom elemnt
         */

        element.onmouseenter = function (mouseEvt) {
            me._popupBimEvents.popupHover = true;
        };

        element.onmouseleave = function (mouseEvt) {
            me._popupBimEvents.popupHover = false;

            if (me._popupBimEvents.featureHover == false && me._popupBimEvents.popupHover == false) {
                me._popupBim.overlay.setPosition(undefined);
                me._popupBim.lastFeatureId = null;
            }
        };


        /**
         * creates ol.Overlay
         */
        this._popupBim = {
            overlay: new ol.Overlay({
                element: element,
                id: 'bimMapPopup',
                offset: [0, -25],
                stopEvent: false
            }),
            element: element
        };
        this._popupBim.overlay.setPosition(undefined);

        var map = this.getView().getOlMap(); // this can be passed as argument of the function avoiding calling the view
        map.addOverlay(this._popupBim.overlay);
    },


    /**
     * @param  {ol.Feature} feature the interested feature 
     * @param  {Ext.data.Store} bimProjectStore the bim.Projects store. NOTE: is passed as argument to avoid calling Ext.getStore('bim.Projects') for each function call
     */
    setBimProperty: function (feature, bimProjectStore) {
        var me = this;
        var bimEnabled = CMDBuildUI.util.helper.Configurations.get(CMDBuildUI.model.Configuration.bim.enabled);

        if (!bimEnabled) {
            return;
        }

        /**
         * this function sets some values in the feature if ther is a match in the bim.Projects store 
         * @param _feature the feature being analized
         */
        setFeatureBim = function (_feature) {
            var _owner_id = _feature.get('data')._owner_id;
            var _owner_class = _feature.get('data')._owner_type;
            //vedere nei range dello store se trovo una corrispondenza tra owner id e owner type. se si assegno has bim alla feature
            var range = bimProjectStore.getRange();
            var bool = false;
            var i;

            for (i = 0; i < range.length && !bool; i++) {
                if (range[i].get('ownerClass') == _owner_class && range[i].get('ownerCard') == _owner_id) {
                    bool = true;
                }
            }


            if (bool) { //HACK: chose here the extra bim values to add to the feature 
                i--; //must do, set the i to the correct value. Because the for loop increases import {  } from "module";

                var data = _feature.get('data');
                data.hasBim = true;
                data.bimActive = range[i].get('active');
                data.projectId = range[i].get('projectId');

                //me.setBimStyle(_feature);
            }

        };

        if (bimProjectStore.isLoaded()) { //handles the case in wich the store is already loaded
            setFeatureBim(feature);
        } else {    //handle the case in wich the store is not yet loaded and used the callback function
            bimProjectStore.load({
                callback: setFeatureBim(feature),
                scope: this
            });
        }
    },

    addLongPressEvent: function () {
        var me = this;
        var view = this.getView();
        var olMap = view.getOlMap();

        var targetElement = Ext.get(olMap.getTargetElement());
        this.mon(targetElement, 'longpress', function (event, node, options, eOpts) {
            // var coord = olMap.getView().get('coord');
            // olMap.getFeaturesAtPixel(olMap.getPixelFromCoordinate(ol.proj.transform(coord, 'EPSG:4326','EPSG:900913')))
            var ids = [];

            //https://openlayers.org/en/v4.6.5/apidoc/ol.Map.html#forEachFeatureAtPixel
            olMap.forEachFeatureAtPixel([event.parentEvent.event.layerX, event.parentEvent.event.layerY],
                function (feature, layer) {
                    ids.push(feature.get('_owner_id'));
                }, {
                // layerFilter
                hitTollerance: 0
            });

            var popup = CMDBuildUI.util.Utilities.openPopup(
                CMDBuildUI.view.map.longrpess.Grid.longpressPopupId, //popop id
                CMDBuildUI.locales.Locales.gis.longpresstitle, //popup title
                {   //popup items
                    xtype: 'map-longrpess-grid',
                    ids: ids
                },
                {}, //popup listener
                { // popup config
                    width: '45%',
                    height: '45%'
                });
        });
    },
    privates: {

        /**
         * {object} object containing the ol.Overlay and the htmlElement used fo it
         */
        _popupBim: {
            /**
             * saves the information about the last feature wich opened the popup 
             */
            lastFeatureId: null,
            /**
             * Contains the html element used as popup
             */
            element: null,
            /**
             * contains the ol.Overlay object
             */
            overlay: null,
            /**
             * The id of the last project clicked
             */
            lastProjectId: null
        },

        _popupBimEvents: {
            popupHover: null,
            featureHover: null
        },

        loadFeaturesStore: function (config, advancedfilter, searchterm) {
            var deferred = new Ext.Deferred();

            // create temp store 
            var childrenstore = Ext.create("Ext.data.Store", {
                proxy: {
                    type: 'baseproxy',
                    model: 'CMDBuildUI.model.gis.GeoValue'
                    // url: config.url,
                    // extraParams: config.params,
                },
                pageSize: 0
            });

            if (advancedfilter) {
                childrenstore.setAdvancedFilter(advancedfilter.get('configuration'));
            }

            if (searchterm) {
                childrenstore.getAdvancedFilter().addQueryFilter(searchterm);
            }

            var attach_nav_tree_collection = this.getView().getAttach_nav_tree_collection();
            var navigationTree = this.getView().getNavigationTree();

            childrenstore.load(Ext.applyIf(config, {
                callback: function (records, operation, success) {
                    if (success) {
                        if (operation.getParams()[CMDBuildUI.model.gis.GeoValueTree.attach_nav_tree]) {
                            var attach_nav_items = operation.getResultSet().metadata[CMDBuildUI.model.gis.GeoValueTree.nav_tree_items];
                            var newItems = [];
                            if (attach_nav_items.length) {
                                Ext.Array.forEach(attach_nav_items, function (attach_nav_item, index, array) {
                                    var composedId = Ext.String.format('{0}-{1}', attach_nav_item._id, attach_nav_item.navTreeNodeId);

                                    if (!attach_nav_tree_collection.getByKey(composedId)) {
                                        attach_nav_item._id_composed = composedId;
                                        var newItem = Ext.create('CMDBuildUI.model.gis.GeoValueTree',
                                            Ext.applyIf(attach_nav_item, {
                                                text: attach_nav_item.description,
                                                _objectid: attach_nav_item._id,
                                                _objecttypename: attach_nav_item.type,
                                                // _navtreedef: navtreedef,
                                                leaf: true,
                                                checked: true,
                                            })
                                        );

                                        newItem.setNavTreeNode(navigationTree.getNodeRecursive(attach_nav_item.navTreeNodeId));
                                        newItems.push(newItem);
                                    }
                                }, this);

                                attach_nav_tree_collection.add(newItems);
                            }
                        }
                        deferred.resolve(records);
                    } else {
                        deferred.reject();
                    }

                    Ext.asap(function () {
                        childrenstore.destroy();
                    });
                }
            }));
            return deferred.promise;
        },

        loadShapeFeatureStore: function (config, advancedfilter) {
            var deferred = new Ext.Deferred();

            // create temp store 
            var childrenstore = Ext.create("Ext.data.Store", {
                proxy: {
                    type: 'baseproxy',
                    model: 'CMDBuildUI.model.gis.GeoLayer'
                    // url: config.url,
                    // extraParams: config.params,
                },
                pageSize: 0
            });

            if (advancedfilter) {
                childrenstore.setAdvancedFilter(advancedfilter);
            }

            childrenstore.load(Ext.applyIf(config, {
                callback: function (records, operation, success) {
                    if (success) {
                        deferred.resolve(records);
                    }
                }
            }));
            return deferred.promise;
        }
    }
});
