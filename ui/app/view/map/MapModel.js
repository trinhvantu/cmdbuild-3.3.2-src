Ext.define('CMDBuildUI.view.map.MapModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.map-map',

    data: {

    },
    formulas: {
        toAddLayer: {
            bind: '{toAdd}',
            get: function (list) {
                if (list == null) return;
                else if (list.length > 0) {
                    this.getView().fireEvent('toaddlayer', list);
                } else {
                    var map = this.getView().getOlMap();
                    var extent = map.getView().calculateExtent(map.getSize());
                    this.getView().up('management-content').getViewModel().set('bbox', [extent[0], extent[1], extent[2], extent[3]]);
                }

            }
        },
        toRemoveLayer: {
            bind: '{toRemove}',
            get: function (list) {
                if (list.length > 0) {
                    this.getView().fireEvent('toremovelayer', list);
                }
            }
        },

        layerStoreCalculation: {
            bind: {
                objectType: '{map.objectType}',
                objectTypeName: '{map.objectTypeName}'
            },
            get: function (data) {
                if (data.objectType && data.objectTypeName) {

                    switch (data.objectType) {
                        case CMDBuildUI.util.helper.ModelHelper.objecttypes.klass:
                            var theKlass = CMDBuildUI.util.helper.ModelHelper.getClassFromName(data.objectTypeName);

                            if (theKlass) {
                                theKlass.getGeoAttributes().then(function (layerStore) {

                                    if (this.getView() && !this.getView().destroyed) {
                                        //Here the data is set into the store
                                        this.getView().setLayerStore(
                                            Ext.create('Ext.data.ChainedStore', {
                                                id: 'layerStore',
                                                source: layerStore,
                                                filters: []
                                            }));
                                    }
                                }, Ext.emptyFn, Ext.emptyFn, this);
                            }
                        default:
                            CMDBuildUI.util.Logger.log(
                                Ext.String.format('Object Type not implemented: {0}', data.objectType),
                                CMDBuildUI.util.Logger.levels.debug);
                            break;
                    }
                }
            }
        },

        updateFilter: {
            bind: {
                layerStore: '{map.layerStore}',
                zoom: '{map.zoom}',
                objectTypeName: '{map.objectTypeName}',
                drawmode: '{map.drawmode}'
            }, get: function (data) {
                if (data.layerStore && data.zoom && data.objectTypeName && data.drawmode === false) {
                    data.layerStore.setFilters([{
                        id: this.getView()._filterZoomMaxId,
                        property: 'zoomMax',
                        operator: '>=',
                        value: data.zoom
                    }, {
                        id: this.getView()._filterZoomMinId,
                        property: 'zoomMin',
                        operator: '<=',
                        value: data.zoom
                    }, {
                        id: this.getView()._filterVisibility,
                        filterFn: function (item) {
                            return Ext.Array.contains(item.get('visibility'), data.objectTypeName);
                        },
                        scope: this
                    }]);
                }
            }
        },

        theObjectCalulation: {
            bind: {
                objectType: '{map.objectType}',
                objectTypeName: '{map.objectTypeName}',
                objectId: '{map.objectId}'
            },
            get: function (data) {
                if (data.objectType && data.objectTypeName) {
                    if (data.objectId) {
                        switch (data.objectType) {
                            case CMDBuildUI.util.helper.ModelHelper.objecttypes.klass:
                                var modelName = CMDBuildUI.util.helper.ModelHelper.getModelName(CMDBuildUI.util.helper.ModelHelper.objecttypes.klass, data.objectTypeName);

                                //CMDBuildUI.util.helper.ModelHelper.getModel(data.objectType, data.objectTypeName).then(function (model) {

                                var theObject = Ext.create(modelName, {
                                    _id: data.objectId
                                });

                                if (!Ext.isEmpty(this._last_load)) {
                                    this._last_load.abort();
                                }

                                this._last_load = theObject.load({
                                    params: {
                                        includeModel: true,
                                        includeWidgets: false,
                                        includeStats: false
                                    },
                                    callback: function (record, operation, success) {
                                        if (success) {
                                            if (this.getView() && !this.getView().destroyed) {
                                                this.getView().setTheObject(theObject);
                                            }
                                            this._last_load = null;
                                        }

                                    }, scope: this
                                });

                                break;
                            default:
                                CMDBuildUI.util.Logger.log(
                                    Ext.String.format('Object Type not implemented: {0}', data.objectType),
                                    CMDBuildUI.util.Logger.levels.debug);
                                break;
                        }

                    } else {
                        this.getView().setTheObject(null);
                    }
                }
            }
        },

        updateOlSelectInteractionSelected: {
            bind: {
                olMap: '{map.olMap}',
                theObject: '{map.theObject}',
                layerStore: '{map.layerStore}',
                drawmode: '{map.drawmode}'
            }, get: function (data) {
                if (data.theObject && data.olMap && data.layerStore && data.drawmode == false) {
                    data.theObject.getGeoValues(true).then(function (geovalues) {
                        if (!this.getView().destroyed) {

                            var geovalue = Ext.Array.findBy(geovalues.getRange(), function (geovalue, index) {

                                var geovalueklassname = geovalue.get('_owner_type');
                                var geovalueklass = CMDBuildUI.util.helper.ModelHelper.getObjectFromName(geovalueklassname);
                                var geovaluehierarchy = geovalueklass.getHierarchy();

                                if (geovalueklassname == this.getView().getObjectTypeName()) {
                                    //the geovalue is on a geoattribute defined in the same card class
                                    return true;
                                }
                                else if (Ext.Array.contains(geovaluehierarchy, this.getView().getObjectTypeName())) {
                                    //the  geovalue is on a geoattribute defined in a subClass of the card
                                    return true;

                                } else {
                                    var objecttypenameklass = CMDBuildUI.util.helper.ModelHelper.getObjectFromName(this.getView().getObjectTypeName())
                                    var objecttypenamehierarchy = objecttypenameklass.getHierarchy();

                                    if (Ext.Array.contains(objecttypenamehierarchy, geovalueklassname)) {
                                        //the  geovalue is on a geoattribute defined in a superClass of the card
                                        return false; //NOTE: we don't want to select superclass geovalues
                                    }
                                }
                            }, this);

                            this.getView().ol_interaction_select_select(data.olMap, geovalue ? [geovalue] : [], true);
                            if (geovalue) {
                                this.getView().getController().animateMap(geovalue);
                            }
                        }
                    }, Ext.emptyFn, Ext.emptyFn, this);
                } else {
                    this.getView().ol_interaction_select_select(data.olMap, [], true);
                }
            }
        },

        updateTheThematism: {
            bind: {
                objectType: '{map.objectType}',
                objectTypeName: '{map.objectTypeName}',
                themathismId: '{map.thematismId}'
            },
            get: function (data) {
                if (data.objectType && data.objectTypeName) {
                    if (Ext.isEmpty(data.themathismId)) {
                        this.getView().setTheThematism(null);
                    } else {

                        //get the class instance
                        var theKlass = CMDBuildUI.util.helper.ModelHelper.getClassFromName(data.objectTypeName);

                        //load the thematisms
                        theKlass.getThematisms().then(function (thematisms) {
                            if (this.getView() && !this.getView().destroyed) {

                                //find the target thematism
                                var theThematism = thematisms.getById(data.themathismId);

                                //sets the configuration in the view
                                theThematism.calculateResults(function () {
                                    this.getView().setTheThematism(theThematism)
                                }, this);
                            }
                        }, Ext.emptyFn, Ext.emptyFn, this);
                    }
                }
            }
        },

        updateDrawMode: {
            bind: {
                drawmode: '{map.drawmode}'
            },
            get: function (data) {
                if (Ext.isBoolean(data.drawmode)) {
                    this.getView().setDrawmode(data.drawmode);
                }
            }
        }
    },

    _last_load: null
});