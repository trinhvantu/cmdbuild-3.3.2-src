Ext.define('CMDBuildUI.view.administration.content.importexport.datatemplates.Topbar', {
    extend: 'Ext.form.Panel',

    requires: [
        'CMDBuildUI.view.administration.content.importexport.datatemplates.TopbarController'
    ],

    alias: 'widget.administration-content-importexport-datatemplates-topbar',
    controller: 'administration-content-importexport-datatemplates-topbar',
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
                text: CMDBuildUI.locales.Locales.administration.importexport.texts.adddatatemplate,
                localized: {
                    text: 'CMDBuildUI.locales.Locales.administration.importexport.texts.adddatatemplate'
                },
                ui: 'administration-action-small',
                reference: 'addtemplate',
                itemId: 'addtemplate',
                iconCls: 'x-fa fa-plus',
                autoEl: {
                    'data-testid': 'administration-toolbar-addImportExportDataTemplateBtn'
                },
                bind: {
                    disabled: '{!toolAction._canAdd}'
                }
            }, {
                xtype: 'textfield',
                name: 'search',
                width: 250,
                cls: 'administration-input',
                reference: 'searchtext',
                itemId: 'searchtext',
                emptyText: CMDBuildUI.locales.Locales.administration.importexport.emptyTexts.searchfield,          
                localized: {
                    emptyText: 'CMDBuildUI.locales.Locales.administration.importexport.emptyTexts.searchfield'
                },
                bind: {
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
            }
        ]
    }]
});