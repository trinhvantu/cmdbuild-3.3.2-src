Ext.define('CMDBuildUI.view.map.tab.cards.geoattributesGrid.geoattributesGridModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.map-tab-cards-geoattributesgrid-geoattributesgrid',
    data: {
        buttonsSaveCancel: {
            hidden: true,
            saveDisabled: true
        }
    },

    formulas: {
        storeCalculation: {
            bind: {
                theObject: '{map-geoattributes-grid.theObject}'
            },
            get: function (data) {
                if (data.theObject) {

                    var objectTypeName = data.theObject.get('_type');
                    var objectId = data.theObject.getId();
                    var objectTypeInstance = CMDBuildUI.util.helper.ModelHelper.getObjectFromName(objectTypeName);
                    var promises = [
                        objectTypeInstance.getGeoAttributes(),
                        data.theObject.getGeoValues(true),
                        data.theObject.getGeoLayers(true)
                    ];

                    Ext.Deferred.all(promises).then(function (resolved) {
                        if (this.getView() && !this.getView().destroyed) {
                            var geoattributes = resolved[0];
                            var geovalues = resolved[1];
                            var geolayers = resolved[2];

                            geoattributes = Ext.create('Ext.data.ChainedStore', {
                                source: geoattributes,
                                filters: [{
                                    property: 'owner_type',
                                    operator: 'in',
                                    value: objectTypeInstance.getHierarchy()
                                }]
                            });

                            var d = Ext.Array.map(geoattributes.getRange(), function (geoattribute, index, array) {
                                var i = geovalues.find('ollayername', geoattribute.get('ollayername'));

                                if (i != -1) {
                                    //the geovalue exists for the given geoAttribute
                                    return geovalues.getAt(i);
                                } else {
                                    //the geovalue doesn't exists for the given geoAttribute

                                    return geoattribute.createEmptyGeoValue(data.theObject.getId());
                                }
                            }, this);

                            var store = Ext.create('Ext.data.Store', {
                                model: 'CMDBuildUI.model.gis.GeoValue',
                                data: d
                            });
                            this.getView().setStore(store);
                        }

                    }, Ext.emptyFn, Ext.emptyFn, this);
                }
            }
        }
    }
});
