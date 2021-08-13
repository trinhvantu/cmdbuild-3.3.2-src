
Ext.define('CMDBuildUI.view.dms.Grid', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.dms-grid',
    requires: [
        'CMDBuildUI.view.dms.GridController',
        'CMDBuildUI.view.dms.GridModel',

        // plugins
        'Ext.grid.filters.Filters',
        'CMDBuildUI.components.grid.plugin.FormInRowWidget'
    ],
    mixins: ['CMDBuildUI.mixins.grids.Grid'],

    reserveScrollbar: true,
    controller: 'dms-grid',
    viewModel: {
        type: 'dms-grid'
    },
    reference: 'dms-grid',
    publishes: [
        'objectType',
        'objectTypeName',
        'objectId',
        'DMSCategoryTypeName',
        'DMSCategoryType'
    ],

    ui: 'cmdbuildgrouping',

    config: {
        objectType: {
            evented: true,
            $value: ''
        },
        objectTypeName: {
            evented: true,
            $value: ''
        },
        objectId: {
            evented: true,
            $value: null
        },
        DMSCategoryTypeName: {
            evented: true,
            $value: null
        },
        DMSCategoryType: {
            evented: true,
            $value: null
        }
    },

    // store is binded in dms-container
    features: [{
        ftype: 'grouping',
        collapsible: false,
        groupHeaderTpl: [
            '{name:this.formatName} ({children:this.childrenNumber})', {
                formatName: function (name) {
                    if (Ext.isEmpty(name)) {
                        name = CMDBuildUI.locales.Locales.attachments.nocategory;
                    }
                    return name;
                },
                childrenNumber: function (children) {
                    return children.length;
                }
            }
        ],
        depthToIndent: 50,
        enableGroupingMenu: false
    }],

    rowViewModel: {
        type: 'dms-tabpanel'
    },
    plugins: [{
        ptype: 'forminrowwidget',
        expandOnDblClick: false,
        removeWidgetOnCollapse: true,
        widget: CMDBuildUI.util.helper.GridHelper.getFormInRowWidget(
            CMDBuildUI.util.helper.ModelHelper.objecttypes.dmsmodel,
            {
                // bind: {
                // DMSCategoryValue: '{record.category}'  //TODO: can create the bind here with: selected
                // }
            })
    }],

    forceFit: true,

    selModel: {
        selType: 'checkboxmodel',
        mode: 'SINGLE',
        checkOnly: true,
        excludeToggleOnColumn: 5
    },

    columns: [{
        text: CMDBuildUI.locales.Locales.attachments.code,
        dataIndex: 'Code',
        localized: {
            text: 'CMDBuildUI.locales.Locales.attachments.code'
        },
        flex: 1
    }, {
        text: CMDBuildUI.locales.Locales.attachments.description,
        dataIndex: 'Description',
        localized: {
            text: 'CMDBuildUI.locales.Locales.attachments.description'
        },
        flex: 1
    }, {
        text: CMDBuildUI.locales.Locales.attachments.filename,
        dataIndex: 'name',
        localized: {
            text: 'CMDBuildUI.locales.Locales.attachments.filename'
        },
        flex: 1
    }, {
        text: CMDBuildUI.locales.Locales.attachments.version,
        dataIndex: 'version',
        localized: {
            text: 'CMDBuildUI.locales.Locales.attachments.version'
        },
        flex: 0.3
    }, {
        text: CMDBuildUI.locales.Locales.attachments.preview,
        width: 95,
        menuDisabled: true,
        xtype: 'widgetcolumn',
        widget: {
            xtype: 'dms-preview',
            bind: {
                DMSCategoryType: '{dms-grid.DMSCategoryType}',
                DMSCategoryTypeValue: '{record.category}',
                proxyUrl: '{proxyUrl}',
                attachmentId: '{record._id}',
                fileName: '{record.name}',
                fileMimeType: '{record.MimeType}'
            }
        },
        localized: {
            text: 'CMDBuildUI.locales.Locales.attachments.preview'
        }
    }]
});
