Ext.define('CMDBuildUI.view.administration.content.importexport.gatetemplates.Topbar', {
    extend: 'Ext.form.Panel',

    requires: [
        'CMDBuildUI.view.administration.content.importexport.gatetemplates.TopbarController'
    ],

    alias: 'widget.administration-content-importexport-gatetemplates-topbar',
    controller: 'administration-content-importexport-gatetemplates-topbar',
    viewModel: {},

    config: {
        objectTypeName: null,
        allowFilter: true,
        showAddButton: true
    },

    forceFit: true,
    loadMask: true,

    dockedItems: [{
        xtype: 'toolbar',
        dock: 'top',

        items: [{
            xtype: 'button',           
            ui: 'administration-action-small',
            reference: 'addgate',
            itemId: 'addgate',
            iconCls: 'x-fa fa-plus',
            autoEl: {
                'data-testid': 'administration-user-toolbar-addGisTemplateBtn'
            },
            bind: {
                text: '{addBtnText}',
                hidden: '{!addBtnText}',
                disabled: '{!toolAction._canAdd}'
            }
        }, {
            xtype: 'textfield',
            name: 'search',
            width: 250,
            cls: 'administration-input',
            reference: 'searchtext',
            itemId: 'searchtext',
            bind: {
                emptyText: '{searchAllEmptyText}',
                hidden: '{!canFilter || !searchAllEmptyText}'
            },
            listeners: {
                specialkey: 'onSearchSpecialKey',
                change: 'onSearchSubmit'
            },
            triggers: {
                search: {
                    cls: Ext.baseCSSPrefix + 'form-search-trigger',
                    handler: 'onSearchSubmit',
                    autoEl: {
                        'data-testid': 'administration-user-toolbar-form-search-trigger'
                    }
                },
                clear: {
                    cls: Ext.baseCSSPrefix + 'form-clear-trigger',
                    handler: 'onSearchClear',
                    autoEl: {
                        'data-testid': 'administration-user-toolbar-form-clear-trigger'
                    }
                }
            },
            autoEl: {
                'data-testid': 'administration-gistemplates-toolbar-search-form'
            }
        }]
    }]
});