Ext.define('CMDBuildUI.view.administration.home.Dashboard', {
    extend: 'Ext.panel.Panel',

    requires: [
        'CMDBuildUI.view.administration.home.DashboardController',
        'CMDBuildUI.view.administration.home.DashboardModel'
    ],

    alias: 'widget.administration-home-dashboard',
    controller: 'administration-home-dashboard',
    viewModel: {
        type: 'administration-home-dashboard'
    },

    bodyPadding: 10,

    layout: {
        type: 'vbox',
        align: 'stretch'
    },

    scrollable: true,
    items: [{
        xtype: 'administration-home-widgets-systemstatus-systemstatuses'
    }, {
        xtype: 'administration-home-widgets-modelsstats-modelsstats'
    }, {
        xtype: 'administration-home-widgets-activerecords-activerecords'
    }, {
        xtype: 'container',
        layout: 'hbox',
        items: [{
            flex: 1,
            xtype: 'administration-home-widgets-spaceusage-tablesgrid'
        }, {
            xtype: 'container',
            flex:1,
            margin: 'auto auto auto 10',
            items: [{
                xtype: 'administration-home-widgets-userstats-stats'
            }, {
                xtype: 'administration-home-widgets-taskbytype-taskbytype'
            }]
        }]
    }],

    initComponent: function () {
        var me = this;
        var vm = me.getViewModel();
        vm.getParent().set('title', Ext.String.format('{0} {1}', CMDBuildUI.locales.Locales.administration.home.home));
        me.callParent(arguments);
    }
});