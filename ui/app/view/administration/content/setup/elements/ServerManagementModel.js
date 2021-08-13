Ext.define('CMDBuildUI.view.administration.content.setup.elements.ServerManagementModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.administration-content-setup-elements-servermanagement',

    stores: {
        services: {
            fields: [{
                name: '_id',
                type: 'string'
            }, {
                name: 'name',
                type: 'string'
            }, {
                name: 'status',
                type: 'string'
            }],
            proxy: {
                type: 'baseproxy',
                url: '/system_services'
            },
            autoLoad: true,
            autoDestroy: true
        }
    }

});
