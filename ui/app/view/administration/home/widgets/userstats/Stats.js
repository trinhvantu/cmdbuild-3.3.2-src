Ext.define('CMDBuildUI.view.administration.home.widgets.userstats.Stats', {
    extend: 'Ext.grid.Panel',

    requires: [
        'CMDBuildUI.view.administration.home.widgets.userstats.StatsController',
        'CMDBuildUI.view.administration.home.widgets.userstats.StatsModel'
    ],
    alias: 'widget.administration-home-widgets-userstats-stats',
    controller: 'administration-home-widgets-userstats-stats',
    viewModel: {
        type: 'administration-home-widgets-userstats-stats'
    },    
    title: CMDBuildUI.locales.Locales.administration.home.usergroupstatistic,
    localized: {
        title: 'CMDBuildUI.locales.Locales.administration.home.usergroupstatistic'
    },
    minHeight: '70',
    style: {
        marginBottom: "30px"
    },
    tools: [{
        iconCls: 'x-fa fa-plus',
        itemId: 'addUsersTool'
    }],
    disableSelection: true,
    ui: 'admindashboard',
    forceFit: true,
    bind: {
        store: '{userStats}'
    },
    columns: [{
        dataIndex: 'label'
    }, {
        dataIndex: 'count',
        align: 'right'
    }]
});