Ext.define('CMDBuildUI.view.dms.Container', {
    extend: 'Ext.panel.Panel',

    requires: [
        'CMDBuildUI.view.dms.ContainerController',
        'CMDBuildUI.view.dms.ContainerModel'
    ],
    alias: 'widget.dms-container',
    controller: 'dms-container',
    viewModel: {
        type: 'dms-container'
    },
    reference: 'dms-container',
    config: {

        //Needed configuration at initialization
        objectType: {
            evented: true,
            $value: ''
        },

        //Needed configuration at initialization
        objectTypeName: {
            evented: true,
            $value: ''
        },

        //Needed configuration at initialization
        objectId: {
            evented: true,
            $value: null
        },

        //calculated starting from objectType & objectTypeName
        DMSCategoryTypeName: {
            evented: true,
            $value: null
        },

        //calculated starting from DMSCategoryTypeName. Has the '.values()' store already loaded
        DMSCategoryType: {
            evented: true,
            $value: null
        },
        readOnly: undefined,
        ignoreSchedules: false
    },
    publishes: [
        'objectType',
        'objectTypeName',
        'objectId',
        'DMSCategoryTypeName',
        'DMSCategoryType',
        'readOnly',
        'ignoreSchedules'
    ],

    layout: {
        type: 'vbox',
        align: 'stretch' //stretch vertically to parent
    },

    items: [{
        layout: {
            type: 'vbox',
            align: 'stretch' //stretch vertically to parent
        },
        xtype: 'panel',
        reference: 'message-container',
        defaults: {
            ui: 'messagewarning',
            xtype: 'container'
        }
    }, {
        xtype: 'dms-grid',
        flex: 1,
        bind: {
            objectType: '{dms-container.objectType}',
            objectTypeName: '{dms-container.objectTypeName}',
            objectId: '{dms-container.objectId}',
            DMSCategoryTypeName: '{dms-container.DMSCategoryTypeName}',
            DMSCategoryType: '{dms-container.DMSCategoryType}',
            store: '{attachments}'
        }
    }],

    tbar: [{
        xtype: 'button',
        text: CMDBuildUI.locales.Locales.attachments.add,
        localized: {
            text: 'CMDBuildUI.locales.Locales.attachments.add'
        },
        iconCls: 'x-fa fa-plus',
        ui: 'management-action-small',
        DMSModelName: undefined,
        reference: 'attachmentsButton',
        publishes: [
            'hidden'
        ],
        menu: undefined,
        hidden: true,
        disabled: true,
        bind: {
            hidden: '{dms-container.readOnly}',
            disabled: '{!basepermissions.edit}'
        },
        handler: 'onAttachmentsButtonClick',
        listeners: {
            show: function (button) {
                button.publishState();
            },
            hide: function (button) {
                button.publishState();
            }
        },
        autoEl: {
            'data-testid': 'dms-container-addbtn'
        }
    }, {
        xtype: 'textfield',
        name: 'search',
        width: 250,
        emptyText: CMDBuildUI.locales.Locales.common.actions.searchtext,
        itemId: 'dmssearchtext',
        cls: 'management-input',
        autoEl: {
            'data-testid': 'dms-container-searchtext'
        },
        triggers: {
            search: {
                cls: Ext.baseCSSPrefix + 'form-search-trigger',
                handler: function (field, trigger, eOpts) {
                    field.fireEvent('searchsubmit', field, field.getValue(), eOpts);
                }
            },
            clear: {
                cls: Ext.baseCSSPrefix + 'form-clear-trigger',
                handler: function (field, trigger, eOpts) {
                    field.fireEvent('clearsearch', field, eOpts);
                }
            }
        },
        localized: {
            emptyText: "CMDBuildUI.locales.Locales.common.actions.searchtext"
        }
    }, {
        xtype: 'button',
        itemId: 'dmsrefreshbtn',
        iconCls: 'x-fa fa-refresh',
        ui: 'management-action',
        tooltip: CMDBuildUI.locales.Locales.common.actions.refresh,
        autoEl: {
            'data-testid': 'dms-container-refreshbtn'
        },
        localized: {
            tooltip: 'CMDBuildUI.locales.Locales.common.actions.refresh'
        }
    }, {
        xtype: 'button',
        itemId: 'dmscontextmenubtn',
        iconCls: 'x-fa fa-bars',
        ui: 'management-action',
        tooltip: CMDBuildUI.locales.Locales.common.grid.opencontextualmenu,
        arrowVisible: false,
        autoEl: {
            'data-testid': 'dms-container-contextmenubtn'
        },
        localized: {
            tooltip: 'CMDBuildUI.locales.Locales.common.grid.opencontextualmenu'
        },
        hidden: true,
        bind: {
            hidden: '{dms-container.readOnly}'
        },
        menu: [{
            iconCls: 'x-fa fa-square-o',
            itemId: 'dmscontextmenumultiselection',
            text: CMDBuildUI.locales.Locales.common.grid.enamblemultiselection,
            localized: {
                text: 'CMDBuildUI.locales.Locales.common.grid.enamblemultiselection'
            }
        }, {
            xtype: 'menuseparator'
        }, {
            iconCls: 'x-fa fa-trash',
            itemId: 'dmscontextmenudelete',
            text: CMDBuildUI.locales.Locales.bulkactions.delete,
            bind: {
                disabled: '{disabledbulkactions}'
            },
            localized: {
                text: 'CMDBuildUI.locales.Locales.bulkactions.delete'
            }
        }, {
            iconCls: 'x-fa fa-download',
            itemId: 'dmscontextmenudownload',
            text: CMDBuildUI.locales.Locales.bulkactions.download,
            bind:  {
                disabled: '{disabledbulkactions}'
            },
            localized: {
                text: 'CMDBuildUI.locales.Locales.bulkactions.download'
            }
        }]
    }]
});