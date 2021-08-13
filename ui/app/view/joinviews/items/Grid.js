
Ext.define('CMDBuildUI.view.joinviews.items.Grid',{
    extend: 'Ext.grid.Panel',

    requires: [
        'CMDBuildUI.view.joinviews.items.GridController',
        'CMDBuildUI.view.joinviews.items.GridModel'
    ],

    alias: 'widget.joinviews-items-grid',
    controller: 'joinviews-items-grid',
    viewModel: {
        type: 'joinviews-items-grid'
    },    

    bind: {
        title: '{title}',
        store: '{items}'
    },

    forceFit: true,
    loadMask: true,

    selModel: {
        pruneRemoved: false // See https://docs.sencha.com/extjs/6.2.0/classic/Ext.selection.Model.html#cfg-pruneRemoved
    },

    tbar: [{
        xtype: 'textfield',
        name: 'search',
        width: 250,
        emptyText: CMDBuildUI.locales.Locales.common.actions.searchtext,
        itemId: 'searchtext',
        cls: 'management-input',
        autoEl: {
            'data-testid': 'joinviews-items-grid-searchtext'
        },
        bind: {
            hidden: '{!canFilter}',
            value: '{searchtext}'
        },
        localized: {
            emptyText: 'CMDBuildUI.locales.Locales.common.actions.searchtext'
        },
        triggers: {
            search: {
                cls: Ext.baseCSSPrefix + 'form-search-trigger',
                handler: 'onSearchSubmit'
            },
            clear: {
                cls: Ext.baseCSSPrefix + 'form-clear-trigger',
                handler: 'onSearchClear'
            }
        }
    }, {
        xtype: 'filters-launcher',
        storeName: 'items',
        showRelationsPanel: false,
        showAttachmentsPanel: false,
        bind: {
            selected: '{defaultfilter}'
        }
    }, {
        xtype: 'button',
        itemId: 'refreshBtn',
        reference: 'refreshBtn',
        iconCls: 'x-fa fa-refresh',
        ui: 'management-action',
        tooltip: CMDBuildUI.locales.Locales.common.actions.refresh,
        autoEl: {
            'data-testid': 'joinviews-items-grid-refreshbtn'
        },
        localized: {
            tooltip: 'CMDBuildUI.locales.Locales.common.actions.refresh'
        }
    },
    CMDBuildUI.util.helper.GridHelper.getPrintButtonConfig({
        disabled: true,
        bind: {
            disabled: '{disabledbuttons.print}'
        }
    }), {
        xtype: 'tbfill'
    },
        CMDBuildUI.util.helper.GridHelper.getBufferedGridCounterConfig("items"),
        CMDBuildUI.util.helper.GridHelper.getSaveGridPreferencesTool(), 
    {
        xtype: 'tool',
        cls: 'management-tool',
        iconCls: 'x-fa fa-ellipsis-v',
        itemId: 'manageViewBtn',
        hidden: true,
        tooltip: CMDBuildUI.locales.Locales.joinviews.manageview,
        localized: {
            tooltip: 'CMDBuildUI.locales.Locales.joinviews.manageview'
        },
        bind: {
            hidden: '{!isUserView}'
        }
    }],

    plugins: [
        'gridfilters', {
            pluginId: 'forminrowwidget',
            ptype: 'forminrowwidget',
            id: 'forminrowwidget',
            removeWidgetOnCollapse: true,
            widget: {
                xtype: 'joinviews-items-view',
                bind: {} // do not remove otherwise the view will break
            }
        }
    ],
    autoEl: {
        'data-testid': 'joinviews-items-grid'
    }
});
