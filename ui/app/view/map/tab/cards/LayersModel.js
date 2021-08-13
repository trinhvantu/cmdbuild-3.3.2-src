Ext.define('CMDBuildUI.view.map.tab.cards.LayersModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.map-tab-cards-layers',
    formulas: {
        storeCalculation: {
            bind: {
                children: '{childrenCalculation}'
            },
            get: function (data) {
                if (data.children) {
                    this.getView().setLayerStore(
                        Ext.create('Ext.data.TreeStore', {
                            root: {
                                id: 'root',
                                skipnode: true,
                                text: CMDBuildUI.locales.Locales.gis.root,
                                expanded: true,
                                checked: true,
                                leaf: false,
                                zoomMax: Ext.Number.MAX_SAFE_INTEGER,
                                zoomMin: Ext.Number.MIN_SAFE_INTEGER,
                                children: [{
                                    skipnode: true,
                                    text: CMDBuildUI.locales.Locales.gis.geographicalAttributes,
                                    expanded: true,
                                    checked: true,
                                    leaf: false,
                                    zoomMax: Ext.Number.MAX_SAFE_INTEGER,
                                    zoomMin: Ext.Number.MIN_SAFE_INTEGER,
                                    children: data.children
                                }]
                            },
                            filters: []
                        })
                    );
                }
            }
        },

        childrenCalculation: {
            bind: {
                layerStore: '{map-tab-tabpanel.layerStore}'
            },
            get: function (data) {
                if (data.layerStore) {
                    var children = [];
                    Ext.Array.forEach(data.layerStore.getRange(), function (geoattribute, index, array) {
                        children.push({
                            text: geoattribute.get('text'),
                            zoomMax: geoattribute.get('zoomMax'),
                            zoomMin: geoattribute.get('zoomMin'),
                            checked: geoattribute.get('checked'),
                            ollayername: geoattribute.get('ollayername'),
                            leaf: true
                        });
                    }, this);

                    return children;
                }
            }
        },

        filterUpdate: {
            bind: {
                zoom: '{map-container.zoom}',
                layerStore: '{map-tab-cards-layers.layerStore}'
            }, get: function (data) {
                if (data.zoom && data.layerStore) {
                    data.layerStore.addFilter([{
                        id: this.getView()._filterZoomMaxId,
                        property: 'zoomMax',
                        operator: '>=',
                        value: data.zoom
                    }, {
                        id: this.getView()._filterZoomMinId,
                        property: 'zoomMin',
                        operator: '<=',
                        value: data.zoom
                    }]);
                }
            }
        }
    }
});
