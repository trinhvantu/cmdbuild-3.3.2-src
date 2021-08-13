
Ext.define('CMDBuildUI.view.map.tab.cards.Card', {
    extend: 'Ext.panel.Panel',

    requires: [
        'CMDBuildUI.view.map.tab.cards.CardController',
        'CMDBuildUI.view.map.tab.cards.CardModel'
    ],
    alias: 'widget.map-tab-cards-card',
    controller: 'map-tab-cards-card',
    viewModel: {
        type: 'map-tab-cards-card'
    },

    autoScroll: true,
    items: [{
        title: CMDBuildUI.locales.Locales.gis.geographicalAttributes,
        xtype: 'fieldset',
        ui: 'formpagination',
        localized: {
            text: 'CMDBuildUI.locales.Locales.gis.geographicalAttributes'
        },
        items: [{
            xtype: 'map-tab-cards-geoattributesgrid-geoattributesgrid',
            bind: {
                theObject: '{map-tab-tabpanel.theObject}'
            }
        }]
    }] //other items are added in the controller
});
