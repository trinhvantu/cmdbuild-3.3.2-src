
Ext.define('CMDBuildUI.view.dashboards.Container', {
    extend: 'Ext.panel.Panel',

    requires: [
        'CMDBuildUI.view.dashboards.ContainerController',
        'CMDBuildUI.view.dashboards.ContainerModel'
    ],

    alias: 'widget.dashboards-container',
    controller: 'dashboards-container',
    viewModel: {
        type: 'dashboards-container'
    },

    bind: {
        title: '{title}'
    },

    layout: {
        type: 'vbox',
        align: 'stretch'
    },

    bodyPadding: '0 0 15 0',

    scrollable: true
});
