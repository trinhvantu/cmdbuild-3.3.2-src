Ext.define('CMDBuildUI.view.administration.home.widgets.systemstatus.NodeStatusModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.administration-home-widgets-systemstatus-nodestatus',
    data: {
        name: 'CMDBuildUI',
        systemStatusData: []
    },
    
    stores: {
        systemStatus: {
            proxy: 'memory',
            data: '{systemStatusData}'
        }
    }

});