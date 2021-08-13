
Ext.define('CMDBuildUI.view.joinviews.configuration.layout.Container',{
    extend: 'Ext.form.Panel',

    requires: [
        'CMDBuildUI.view.joinviews.configuration.layout.ContainerController',
        'CMDBuildUI.view.joinviews.configuration.layout.ContainerModel'
    ],
    alias: 'widget.joinviews-configuration-layout-container',
    controller: 'joinviews-configuration-layout-container',
    viewModel: {
        type: 'joinviews-configuration-layout-container'
    },

    items: []
});
