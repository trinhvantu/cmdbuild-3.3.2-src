Ext.define('CMDBuildUI.view.administration.home.widgets.systemstatus.SystemStatuses', {
    extend: 'Ext.panel.Panel',
    requires: [
        'CMDBuildUI.view.administration.home.widgets.systemstatus.SystemStatusesController',
        'CMDBuildUI.view.administration.home.widgets.systemstatus.SystemStatusesModel'
    ],

    controller: 'administration-home-widgets-systemstatus-systemstatuses',
    viewModel: {
        type: 'administration-home-widgets-systemstatus-systemstatuses'
    },

    alias: 'widget.administration-home-widgets-systemstatus-systemstatuses',
    defaults: {
        layout: 'hbox',
        style: {
            marginBottom: "15px"
        }
    },
    title: CMDBuildUI.locales.Locales.administration.home.systemstatus,
    localized: {
        title: 'CMDBuildUI.locales.Locales.administration.home.systemstatus'
    },

    layout: {
        type: 'vbox',
        align: 'stretch'
    },
    minHeight: '200',
    ui: 'admindashboard',
    tools: [{
        iconCls: 'x-fa fa-refresh',
        itemId: 'serverManagementRefreshTool'
    }, {
        iconCls: 'x-fa fa-list-ul',
        itemId: 'serverManagementListTool'
    }, {
        iconCls: 'x-fa fa-wrench',
        itemId: 'serverManagementTool'
    }],
    items: []
});