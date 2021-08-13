Ext.define('CMDBuildUI.view.administration.home.widgets.systemstatus.NodeStatus', {
    extend: 'Ext.form.FieldSet',

    requires: [
        'CMDBuildUI.view.administration.home.widgets.systemstatus.NodeStatusController',
        'CMDBuildUI.view.administration.home.widgets.systemstatus.NodeStatusModel'
    ],
    alias: 'widget.administration-home-widgets-systemstatus-nodestatus',
    controller: 'administration-home-widgets-systemstatus-nodestatus',
    viewModel: {
        type: 'administration-home-widgets-systemstatus-nodestatus'
    },

    ui: 'administration-formpagination',
    config: {
        systemStatusData: null,
        lastChange: null
    },
    collapsible: true,
    layout: 'fit',
    items: [],
    updateSystemStatusData: function(value) {
        this.getViewModel().set('systemStatusData', value);
    }

});