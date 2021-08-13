(function () {
    var formInRowPlugin = 'forminrowwidget';
    Ext.define('CMDBuildUI.view.administration.content.users.Grid', {
        extend: 'Ext.grid.Panel',

        requires: [
            'CMDBuildUI.view.administration.content.users.GridController',
            'CMDBuildUI.view.administration.content.users.GridModel',

            // plugins
            'Ext.grid.filters.Filters',
            'CMDBuildUI.components.grid.plugin.FormInRowWidget'
        ],

        mixins: [
            'CMDBuildUI.mixins.grids.Grid'
        ],
        viewConfig: {
            markDirty: false
        },
        alias: 'widget.administration-content-users-grid',
        controller: 'administration-content-users-grid',
        viewModel: {
            type: 'administration-content-users-grid'
        },
        bind: {
            store: '{allUsers}',
            selection: '{selected}'
        },
        reserveScrollbar: true,
        columns: [{
            text: CMDBuildUI.locales.Locales.administration.emails.username,
            localized: {
                text: 'CMDBuildUI.locales.Locales.administration.emails.username'
            },
            dataIndex: 'username',
            align: 'left'
        }, {
            text: CMDBuildUI.locales.Locales.administration.common.labels.description,
            localized: {
                text: 'CMDBuildUI.locales.Locales.administration.common.labels.description'
            },
            dataIndex: 'description',
            align: 'left'
        }, {
            text: CMDBuildUI.locales.Locales.administration.groupandpermissions.fieldlabels.email,
            localized: {
                text: 'CMDBuildUI.locales.Locales.administration.groupandpermissions.fieldlabels.email'
            },
            dataIndex: 'email',
            align: 'left'
        }, {
            text: CMDBuildUI.locales.Locales.administration.common.labels.active,
            localized: {
                text: 'CMDBuildUI.locales.Locales.administration.common.labels.active'
            },
            dataIndex: 'active',
            align: 'center',
            xtype: 'checkcolumn',
            disabled: true
        }],

        plugins: ['gridfilters', {
            ptype: formInRowPlugin,
            pluginId: formInRowPlugin,
            scrollIntoViewOnExpand: true,
            removeWidgetOnCollapse: true,
            widget: {
                xtype: 'administration-content-users-card-viewinrow',
                ui: 'administration-tabandtools',
                viewModel: {
                    data: {
                        action: CMDBuildUI.util.administration.helper.FormHelper.formActions.view,
                        actions: {
                            view: true,
                            edit: false,
                            add: false
                        }
                    }
                },
                bind: {
                    theUser: '{selected}'
                }
            }
        }],
        config: {
            objectTypeName: null,
            allowFilter: true,
            showAddButton: true,
            selected: null,
            formInRowPlugin: formInRowPlugin
        },
        autoEl: {
            'data-testid': 'administration-content-users-grid'
        },

        forceFit: true,
        loadMask: true,

        selModel: {
            mode: 'multi',
            pruneRemoved: false // See https://docs.sencha.com/extjs/6.2.0/classic/Ext.selection.Model.html#cfg-pruneRemoved
        },
        labelWidth: "auto",
        dockedItems: [{
            xtype: 'toolbar',
            dock: 'top',
    
            items: [{
                xtype: 'button',
                text: CMDBuildUI.locales.Locales.administration.users.toolbar.addUserBtn.text,
                localized: {
                    text: 'CMDBuildUI.locales.Locales.administration.users.toolbar.addUserBtn.text'
                },
                ui: 'administration-action-small',
                reference: 'adduser',
                itemId: 'adduser',
                iconCls: 'x-fa fa-plus',
                autoEl: {
                    'data-testid': 'administration-user-toolbar-addUserBtn'
                },
                bind: {
                    disabled: '{!toolAction._canAdd}'
                }
            }, {
                xtype: 'textfield',
                name: 'search',
                width: 250,
                emptyText: CMDBuildUI.locales.Locales.administration.users.toolbar.searchTextInput.emptyText,
                localized: {
                    emptyText: 'CMDBuildUI.locales.Locales.administration.users.toolbar.searchTextInput.emptyText'
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
                    'data-testid': 'administration-user-toolbar-search-form'
                }
            }, {
                xtype: 'tbfill'
            }, {
                xtype: 'tbtext',
                dock: 'right',
                itemId: 'userGridCounter'
            }]
        }]
    });
})();
