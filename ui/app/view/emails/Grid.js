Ext.define('CMDBuildUI.view.emails.Grid', {
    extend: 'Ext.grid.Panel',

    requires: [
        'CMDBuildUI.view.emails.GridController',
        'CMDBuildUI.view.emails.GridModel'
    ],

    alias: 'widget.emails-grid',
    controller: 'emails-grid',
    viewModel: {
        type: 'emails-grid'
    },

    ui: 'cmdbuildgrouping',

    config: {
        /**
         * @cfg {Boolean} readOnly 
         * 
         * Set to `true` to show details tabs in read-only mode
         */
        readOnly: false,

        /**
         * @cfg {String} formMode
         * 
         * Form mode
         */
        formMode: null
    },

    forceFit: true,
    loadMask: true,
    padding: 10,

    bind: {
        store: '{emails}'
    },

    features: [{
        ftype: 'grouping',
        groupHeaderTpl: [
            '{name:this.formatName} ({children:this.getTotalRows})', {
                formatName: function (name) {
                    return CMDBuildUI.locales.Locales.emails.statuses[name];
                },  
                getTotalRows: function (rows) {
                    return rows.length;
                }
            }
        ],
        depthToIndent: 50
    }],

    columns: [{
        text: CMDBuildUI.locales.Locales.emails.archivingdate,
        dataIndex: 'date',
        align: 'left',
        localized: {
            text: 'CMDBuildUI.locales.Locales.emails.archivingdate'
        },
        renderer: function (value, metaData, record, rowIndex, colIndex, store, view) {
            return CMDBuildUI.util.helper.FieldsHelper.renderTimestampField(value);
        }
    }, {
        text: CMDBuildUI.locales.Locales.emails.from,
        dataIndex: 'from',
        align: 'left',
        localized: {
            text: 'CMDBuildUI.locales.Locales.emails.from'
        },
        renderer: function (data) {
            return CMDBuildUI.util.Utilities.transformMajorMinor(data);
        }
    }, {
        text: CMDBuildUI.locales.Locales.emails.to,
        dataIndex: 'to',
        align: 'left',
        localized: {
            text: 'CMDBuildUI.locales.Locales.emails.to'
        },
        renderer: function (data) {
            return CMDBuildUI.util.Utilities.transformMajorMinor(data);
        }
    }, {
        text: CMDBuildUI.locales.Locales.emails.subject,
        dataIndex: 'subject',
        align: 'left',
        localized: {
            text: 'CMDBuildUI.locales.Locales.emails.subject'
        }
    }, {
        xtype: 'actioncolumn',
        minWidth: 200, // width property not works. Use minWidth.
        maxWidth: 200,
        hidden: true,
        bind: {
            hidden: '{readonly}'
        },
        items: [{
            iconCls: 'attachments-grid-action x-fa fa-envelope-o',
            getTip: function () {
                return CMDBuildUI.locales.Locales.emails.regenerateemail;
            },
            handler: function (grid, rowIndex, colIndex) {
                var record = grid.getStore().getAt(rowIndex);
                grid.fireEvent('Actionregenerate', grid, record, rowIndex, colIndex);
            },
            isDisabled: function (view, rowIndex, colIndex, item, record) {
                var statusDraft = record.get('status') == CMDBuildUI.model.emails.Email.statuses.draft ? true : false;
                var fromTemplate = record.get('template') !== '';
                return !(view.ownerCt.isFormWritable() && statusDraft && fromTemplate);
            }
        }, {
            iconCls: 'attachments-grid-action x-fa fa-reply',
            getTip: function () {
                return CMDBuildUI.locales.Locales.emails.reply;
            },
            handler: function (grid, rowIndex, colIndex) {
                var record = grid.getStore().getAt(rowIndex);
                grid.fireEvent('actionreply', grid, record, rowIndex, colIndex);
            },
            isDisabled: function (view, rowIndex, colIndex, item, record) {
                return !(
                    view.ownerCt.isFormWritable() &&
                    (record.get('status') === CMDBuildUI.model.emails.Email.statuses.received ||
                        record.get('status') === CMDBuildUI.model.emails.Email.statuses.sent)
                );
            }
        }, {
            iconCls: 'attachments-grid-action x-fa fa-paper-plane',
            getTip: function () {
                return CMDBuildUI.locales.Locales.emails.sendemail;
            },
            handler: function (grid, rowIndex, colIndex) {
                var record = grid.getStore().getAt(rowIndex);
                grid.fireEvent('actionsend', grid, record, rowIndex, colIndex);
            },
            isDisabled: function (view, rowIndex, colIndex, item, record) {
                var statusDraft = record.get('status') == CMDBuildUI.model.emails.Email.statuses.draft ? true : false;
                return !(view.ownerCt.isFormWritable() && statusDraft);
            }
        }, {
            iconCls: 'attachments-grid-action x-fa fa-pencil',
            getTip: function () {
                return CMDBuildUI.locales.Locales.emails.edit;
            },
            handler: function (grid, rowIndex, colIndex) {
                var record = grid.getStore().getAt(rowIndex);
                grid.fireEvent('actionedit', grid, record, rowIndex, colIndex);
            },
            isDisabled: function (view, rowIndex, colIndex, item, record) {
                var statusDraft = record.get('status') == CMDBuildUI.model.emails.Email.statuses.draft ? true : false;
                return !(view.ownerCt.isFormWritable() && statusDraft);
            }
        }, {
            iconCls: 'attachments-grid-action x-fa fa-external-link',
            getTip: function () {
                return CMDBuildUI.locales.Locales.emails.view;
            },
            handler: function (grid, rowIndex, colIndex) {
                var record = grid.getStore().getAt(rowIndex);
                grid.fireEvent('actionview', grid, record, rowIndex, colIndex);
            }
        }, {
            iconCls: 'attachments-grid-action x-fa fa-trash',
            getTip: function () {
                return CMDBuildUI.locales.Locales.emails.remove;
            },
            handler: function (grid, rowIndex, colIndex) {
                var record = grid.getStore().getAt(rowIndex);
                grid.fireEvent("actiondelete", grid, record, rowIndex, colIndex);
            },
            isDisabled: function (view, rowIndex, colIndex, item, record) {
                var statusDraft = record.get('status') == CMDBuildUI.model.emails.Email.statuses.draft ? true : false;
                return !(view.ownerCt.isFormWritable() && statusDraft);
            }
        }]
    }, {
        xtype: 'actioncolumn',
        minWidth: 30, // width property not works. Use minWidth.
        hidden: true,
        bind: {
            hidden: '{!readonly}'
        },
        items: [{
            iconCls: 'attachments-grid-action x-fa fa-external-link',
            getTip: function () {
                return CMDBuildUI.locales.Locales.emails.view;
            },
            handler: function (grid, rowIndex, colIndex) {
                var record = grid.getStore().getAt(rowIndex);
                grid.fireEvent('actionview', grid, record, rowIndex, colIndex);
            }
        }]}
    ],

    tbar: [{
        xtype: 'button',
        text: CMDBuildUI.locales.Locales.emails.composeemail,
        reference: 'composeemail',
        itemId: 'composeemail',
        iconCls: 'x-fa fa-plus',
        ui: 'management-action-small',
        hidden: true,
        bind: {
            disabled: '{disableButtonOnView}',
            hidden: '{readonly}'
        },
        localized: {
            text: 'CMDBuildUI.locales.Locales.emails.composeemail'
        }
    }, {
        xtype: 'button',
        text: CMDBuildUI.locales.Locales.emails.regenerateallemails,
        reference: 'regenerateallemails',
        itemId: 'regenerateallemails',
        iconCls: 'x-fa fa-envelope',
        ui: 'management-action-small',
        hidden: true,
        bind: {
            disabled: '{disableButtonOnView}',
            hidden: '{readonly}'
        },
        localized: {
            text: 'CMDBuildUI.locales.Locales.emails.regenerateallemails'
        }
    }, {
        xtype: 'button',
        text: CMDBuildUI.locales.Locales.emails.gridrefresh,
        reference: 'gridrefresh',
        itemId: 'gridrefresh',
        iconCls: 'x-fa fa-refresh',
        ui: 'management-action-small',
        hidden: true,
        bind: {
            disabled: '{disableButtonOnView}',
            hidden: '{readonly}'
        },
        localized: {
            text: 'CMDBuildUI.locales.Locales.emails.gridrefresh'
        }
    }],

    /**
     * @return {Boolean}
     */
    isFormWritable: function() {
        return this.getFormMode() === CMDBuildUI.util.helper.FormHelper.formmodes.update ||
            this.getFormMode() === CMDBuildUI.util.helper.FormHelper.formmodes.create;
    }
});