Ext.define('CMDBuildUI.view.map.ContainerModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.map-container',

    data: {
        theObjectTypeCalculation: null,
        'map-container': {
            objectId: undefined
        }
    },

    formulas: {

        theObjectTypeCalculation: {
            bind: {
                objectType: '{map-container.objectType}',
                objectTypeName: '{map-container.objectTypeName}'
            },
            get: function (data) {
                if (data.objectType && data.objectTypeName) {
                    switch (data.objectType) {
                        case CMDBuildUI.util.helper.ModelHelper.objecttypes.klass:
                            return CMDBuildUI.util.helper.ModelHelper.getClassFromName(data.objectTypeName);
                    }
                }
            }
        },

        updateObjectId: {
            bind: {
                objectId: '{map-container.objectId}'
            },
            get: function (data) {
                this.getView().setObjectId(data.objectId);
            }
        },

        updateZoom: {
            bind: {
                zoom: '{map-container.zoom}'
            },
            get: function (data) {
                this.getView().setZoom(data.zoom);
            }
        },

        updateCenter: {
            bind: {
                center: '{map-container.center}'
            },
            get: function (data) {
                this.getView().setCenter(data.center);
            }
        },

        updateTheThematism: {
            bind: {
                objectType: '{map-container.objectType}',
                objectTypeName: '{map-container.objectTypeName}',
                themathismId: '{map-container.thematismId}'
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

        'update-highlightselected': {
            bind: {
                highlightselected: '{map-container.highlightselected}'
            },
            get: function (data) {
                if (Ext.isBoolean(data.highlightselected)) {
                    this.getView().setHighlightselected(data.highlightselected);
                }
            }
        },

        'updateDrawmode': {
            bind: {
                drawmode: '{map-container.drawmode}'
            },
            get: function (data) {
                if (Ext.isBoolean(data.drawmode)) {
                    this.getView().setDrawmode(data.drawmode);
                }
            }
        }
    }
});
