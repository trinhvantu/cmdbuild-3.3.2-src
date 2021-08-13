
Ext.define('CMDBuildUI.view.map.tab.cards.Layers', {
    extend: 'Ext.tree.Panel',

    requires: [
        'CMDBuildUI.view.map.tab.cards.LayersController',
        'CMDBuildUI.view.map.tab.cards.LayersModel'
    ],
    alias: 'widget.map-tab-cards-layers',
    controller: 'map-tab-cards-layers',
    viewModel: {
        type: 'map-tab-cards-layers'
    },

    config: {
        layerStore: {
            $value: undefined
        }
    },
    publishes: [
        'layerStore'
    ],
    bind: {
        store: '{map-tab-cards-layers.layerStore}'
    },
    reference: 'map-tab-cards-layers',

    rootVisible: false,
    checkPropagation: 'both',

    _filterZoomMaxId: 'zoomMax',
    _filterZoomMinId: 'zoomMin',

    initComponent: function () {
        this.callParent(arguments);
        this.getViewModel().bind({
            treeLayerstore: '{map-tab-cards-layers.layerStore}',
            layerStore: '{map-tab-tabpanel.layerStore}'
        }, function (data) {
            if (data.treeLayerstore && data.layerStore) {
                data.treeLayerstore.addListener('update', 'onTreeStoreUpdate', this, {
                    args: [data.layerStore]
                });
            }
        }, this);
    },

    onTreeStoreUpdate: function (layerStore, treeLayerstore, record, operation, modifiedFieldNames, details, eOpts) {
        if (!record.get('skipnode') && modifiedFieldNames && Ext.Array.contains(modifiedFieldNames, 'checked')) {
            var geoattributeindex = layerStore.find('ollayername', record.get('ollayername'));
            if (geoattributeindex != -1) {
                var geoattribute = layerStore.getAt(geoattributeindex);
                geoattribute.set('checked', record.get('checked'));
            }
        }
    }
});
