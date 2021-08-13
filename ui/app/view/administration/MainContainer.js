
Ext.define('CMDBuildUI.view.administration.MainContainer', {
    extend: 'Ext.container.Container',

    requires: [
        'CMDBuildUI.view.administration.MainContainerController',
        'CMDBuildUI.view.administration.MainContainerModel',

        'CMDBuildUI.view.administration.Content'
    ],
    //ui: 'administration',
    xtype: 'administration-maincontainer',
    controller: 'administration-maincontainer',
    viewModel: {
        type: 'administration-maincontainer'
    },
    layout: 'border',

    items: [{
        xtype: 'administration-navigation-container',
        split: true, // enable resizing
        region: 'west',
        collapsible: true // make collapsible
    }, {
        region: 'center', // center region is required, no width/height specified
        xtype: 'administration-content'
    }]

});
