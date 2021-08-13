
(function () {
    var elementId = 'CMDBuildAdministrationContentDashboardsView';
    Ext.define('CMDBuildUI.view.administration.content.dashboards.View', {
        extend: 'Ext.panel.Panel',

        alias: 'widget.administration-content-dashboards-view',

        requires: [
            'CMDBuildUI.view.administration.content.dashboards.ViewController',
            'CMDBuildUI.view.administration.content.dashboards.ViewModel'
        ],

        controller: 'administration-content-dashboards-view',
        viewModel: {
            type: 'administration-content-dashboards-view'
        },
        id: elementId,
        statics: {
            elementId: elementId
        },
        loadMask: true,
        defaults: {
            textAlign: 'left',
            scrollable: true
        },
        config: {
            showCard: false
        },
        layout: 'card',
        items: [],
        dockedItems: [{
            xtype: 'toolbar',
            dock: 'top',

            items: [{
                xtype: 'button',
                text: CMDBuildUI.locales.Locales.administration.dashboards.adddashboard,
                localized: {
                    text: 'CMDBuildUI.locales.Locales.administration.dashboards.adddashboard'
                },
                ui: 'administration-action-small',
                reference: 'adddashboard',
                itemId: 'adddashboard',
                iconCls: 'x-fa fa-plus',
                autoEl: {
                    'data-testid': 'administration-dashboard-toolbar-addDashboardBtn'
                },
                bind: {
                    disabled: '{!toolAction._canAdd}'
                }
            }, {
                xtype: 'textfield',
                name: 'search',
                width: 250,
                emptyText: CMDBuildUI.locales.Locales.administration.dashboards.searchdashboards,
                localized: {
                    emptyText: 'CMDBuildUI.locales.Locales.administration.dashboards.searchdashboards'
                },
                cls: 'administration-input',
                reference: 'searchtext',
                itemId: 'searchtext',
                bind: {
                    value: '{search.value}',
                    hidden: '{!canFilter}'
                },
                listeners: {
                    specialkey: 'onSearchSpecialKey'
                },
                triggers: {
                    search: {
                        cls: Ext.baseCSSPrefix + 'form-search-trigger',
                        handler: 'onSearchSubmit',
                        autoEl: {
                            'data-testid': 'administration-dashboard-toolbar-form-search-trigger'
                        }
                    },
                    clear: {
                        cls: Ext.baseCSSPrefix + 'form-clear-trigger',
                        handler: 'onSearchClear',
                        autoEl: {
                            'data-testid': 'administration-dashboard-toolbar-form-clear-trigger'
                        }
                    }
                },
                autoEl: {
                    'data-testid': 'administration-dashboard-toolbar-search-form'
                }
            }, {
                xtype: 'tbfill'
            }, {
                xtype: 'tbtext',
                dock: 'right',
                itemId: 'dashboardGridCounter'
            }]
        }],
        listeners: {
            afterlayout: function (panel) {
                Ext.GlobalEvents.fireEventArgs("showadministrationcontentmask", [false]);
            }
        },

        initComponent: function () {
            var vm = this.getViewModel();
            vm.getParent().set('title', CMDBuildUI.locales.Locales.administration.navigation.dashboards);
            this.callParent(arguments);
        }
    });
})();