Ext.define('CMDBuildUI.view.navcontent.Container', {
    extend: 'Ext.panel.Panel',

    requires: [
        'CMDBuildUI.view.navcontent.ContainerController'
    ],
    config: {
        navTreeName: undefined
    },
    alias: 'widget.navcontent-container',
    controller: 'navcontent-container',

    layout: 'fit'
});