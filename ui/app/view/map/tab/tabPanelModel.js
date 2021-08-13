Ext.define('CMDBuildUI.view.map.tab.tabPanelModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.map-tab-tabpanel',
    data: {
        'map-tab-tabpanel': {
            objectId: undefined
        },

        activeItemCalculation: undefined
    },

    formulas: {
        layerStoreCalculation: {
            bind: {
                objectType: '{map-tab-tabpanel.objectType}',
                objectTypeName: '{map-tab-tabpanel.objectTypeName}'
            },
            get: function (data) {
                if (data.objectType && data.objectTypeName) {

                    switch (data.objectType) {
                        case CMDBuildUI.util.helper.ModelHelper.objecttypes.klass:
                            var theKlass = CMDBuildUI.util.helper.ModelHelper.getClassFromName(data.objectTypeName);

                            if (theKlass) {
                                theKlass.getGeoAttributes().then(function (layerStore) {
                                    if (this.getView() && !this.getView().destroyed) {
                                        this.getView().setLayerStore(
                                            Ext.create('Ext.data.ChainedStore', {
                                                id: 'layerStore',
                                                source: layerStore
                                            })
                                        );
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

        theObjectCalulation: {
            bind: {
                objectType: '{map-tab-tabpanel.objectType}',
                objectTypeName: '{map-tab-tabpanel.objectTypeName}',
                objectId: '{map-tab-tabpanel.objectId}'
            },
            get: function (data) {
                if (data.objectType && data.objectTypeName) {
                    if (data.objectId) {
                        switch (data.objectType) {
                            case CMDBuildUI.util.helper.ModelHelper.objecttypes.klass:
                                var modelName = CMDBuildUI.util.helper.ModelHelper.getModelName(CMDBuildUI.util.helper.ModelHelper.objecttypes.klass, data.objectTypeName);

                                // CMDBuildUI.util.helper.ModelHelper.getModel(data.objectType, data.objectTypeName).then(function (model) {
                                var theObject = Ext.create(modelName, {
                                    _id: data.objectId
                                });

                                if (!Ext.isEmpty(this._last_load)) {
                                    this._last_load.abort();
                                }

                                this._last_load = theObject.load({
                                    callback: function (record, operation, success) {
                                        if (success) {
                                            if (this.getView() && !this.getView().destroyed) {
                                                this.getView().setTheObject(theObject);
                                            }
                                            this._last_load = null;
                                        }
                                    },
                                    scope: this
                                });
                                // }, Ext.emptyFn, Ext.emptyFn, this);
                                break;

                            default:
                                CMDBuildUI.util.Logger.log(Ext.String.format('Object Type not implemented: {0}', data.objectType), CMDBuildUI.util.Logger.levels.debug);
                                break;
                        }

                    } else {
                        this.getView().setTheObject(null);
                    }
                }
            }
        },

        'activeItemCalculation': {
            bind: {
                navigationtree: '{map-tab-tabpanel.navigationTree}'
            },
            get: function (data) {
                if (data.navigationtree) {
                    return CMDBuildUI.view.map.tab.tabPanel.tabIndex['map-tab-cards-navigationtree'];
                }
                return CMDBuildUI.view.map.tab.tabPanel.tabIndex['map-tab-cards-list'];
            }
        },

        //navigation tree
        'disableMap-map-tab-cards-navigationtree': {
            bind: {
                drawmode: '{map-tab-tabpanel.drawmode}'
            },
            get: function (data) {
                if (Ext.isBoolean(data.drawmode)) {
                    return data.drawmode;
                }
            }
        },
        'hiddenMap-tab-cards-navigationtree': {
            bind: {
                navigationtree: '{map-tab-tabpanel.navigationTree}'
            },
            get: function (data) {
                return !data.navigationtree;
            }
        },

        //list
        'disableMap-map-tab-cards-list': {
            bind: {
                drawmode: '{map-tab-tabpanel.drawmode}'
            },
            get: function (data) {
                if (Ext.isBoolean(data.drawmode)) {
                    return data.drawmode;
                }
            }
        },

        // card
        'disableMap-tab-cards-card': {
            bind: {
                objectId: '{map-tab-tabpanel.objectId}'
            },
            get: function (data) {
                return !Ext.isNumeric(data.objectId);
            }
        },

        //layers
        'disableMap-map-tab-cards-layers': {
            bind: {
                drawmode: '{map-tab-tabpanel.drawmode}'
            },
            get: function (data) {
                if (Ext.isBoolean(data.drawmode)) {
                    return data.drawmode;
                }
            }
        },

        //legend
        'disableMap-map-tab-cards-legend': {
            bind: {
                drawmode: '{map-tab-tabpanel.drawmode}'
            },
            get: function (data) {
                if (Ext.isBoolean(data.drawmode)) {
                    return data.drawmode;
                }
            }
        },
        'hidden-map-tab-cards-legend': {
            bind: {
                thematismId: '{map-container.thematismId}'
            },
            get: function (data) {
                return Ext.isEmpty(data.thematismId);
            }
        },

        'updateObjectId': {
            bind: {
                objectId: '{map-tab-tabpanel.objectId}'
            },
            get: function (data) {
                this.getView().setObjectId(data.objectId);
            }
        },

        'updateDrawMode': {
            bind: {
                drawmode: '{map-tab-tabpanel.drawmode}'
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
