Ext.define('CMDBuildUI.view.administration.content.gis.geoserverslayers.card.ViewInRowModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.administration-content-gis-geoserverslayers-card-viewinrow',

    formulas: {
        updateCardDescription: {
            bind: '{theLayer.owner_id}',
            get: function (card) {
                var vm = this;
                var theLayer = vm.get('theLayer');
                var id = card;
                var type = CMDBuildUI.util.helper.ModelHelper.objecttypes.klass;
                CMDBuildUI.util.helper.ModelHelper.getModel(type, theLayer.get('owner_type')).then(
                    function (c) {
                        c.load(id, {
                            success: function (record) {
                                if (vm && !vm.destroyed) {
                                    vm.set('cardDescription', record.get('Description'));
                                }
                            }
                        });
                    }
                );
            }
        },
        getAssociatedCards: {
            bind: '{theLayer.owner_type}',
            get: function (associatedClass) {
                if (associatedClass) {
                    var initialPage;
                    var object = CMDBuildUI.util.helper.ModelHelper.getObjectFromName(associatedClass);
                    if (object) {
                        initialPage = object.get('description');
                    }
                    return this.set('_owner_type_description', initialPage);
                }
                return this.set('_owner_type_description', associatedClass);
            }
        },

        type: {
            bind: '{theLayer.type}',
            get: function (type) {
                var values = [{
                    label: CMDBuildUI.locales.Locales.administration.geoattributes.fieldLabels.shape,
                    value: CMDBuildUI.model.map.GeoLayers.types.shape
                }, {
                    label: CMDBuildUI.locales.Locales.administration.geoattributes.fieldLabels.geotiff,
                    value: CMDBuildUI.model.map.GeoLayers.types.geotiff
                }];
                return Ext.Array.findBy(values, function (item) {                    
                    return item.value === type;
                }).label;
            }
        }
    }
});