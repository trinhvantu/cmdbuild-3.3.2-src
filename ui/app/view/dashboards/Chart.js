Ext.define('CMDBuildUI.view.dashboards.Chart', {
    extend: 'Ext.panel.Panel',

    requires: [
        'CMDBuildUI.view.dashboards.ChartController',
        'CMDBuildUI.view.dashboards.ChartModel'
    ],

    alias: 'widget.dashboards-chart',
    controller: 'dashboards-chart',
    viewModel: {
        type: 'dashboards-chart'
    },

    ui: 'managementdashboard',

    bind: {
        title: '{title}'
    },

    collapsible: true,
    margin: "15 15 0 15",

    tools: [{
        iconCls: 'x-fa fa-pencil-square-o',
        cls: 'active',
        itemId: 'showHideParamsBtn',
        enableToggle: true,
        hidden: true,
        bind: {
            hidden: '{showhideparamsbtn.hidden}',
            disabled: '{toolsdisabled}',
            tooltip: '{paramsToolTip}',
            userCls: '{adminCls}'
        }
    }, {
        iconCls: 'x-fa fa-table',
        itemId: 'showHideTableBtn',
        enableToggle: true,
        hidden: true,
        bind: {
            hidden: '{showhidetablebtn.hidden}',
            disabled: '{toolsdisabled}',
            tooltip: '{tableToolTip}',
            userCls: '{adminCls}'
        }
    }, {
        iconCls: 'x-fa fa-refresh',
        itemId: 'refreshBtn',
        tooltip: CMDBuildUI.locales.Locales.dashboards.tools.reload,
        bind: {
            hidden: '{refreshbtn.hidden}',
            disabled: '{toolsdisabled}',
            userCls: '{adminCls}'
        },
        localized: {
            tooltip: 'CMDBuildUI.locales.Locales.dashboards.tools.reload'
        }
    }]
});