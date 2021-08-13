Ext.define('CMDBuildUI.view.dms.GridController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.dms-grid',

    control: {
        '#': {
            afterrender: 'onBeforeRender',
            rowdblclick: 'onRowDblClick'
        }
    },

    /**
     * 
     * @param {CMDBuildUI.view.dms.Grid} view 
     * @param {Object} eOpts 
     */
    onBeforeRender: function (view, eOpts) {
        // hide selection column
        view.selModel.column.hide();
    },

    /**
     * @param {Ext.selection.RowModel} element
     * @param {CMDBuildUI.model.classes.Card} record
     * @param {HTMLElement} rowIndex
     * @param {Event} e
     * @param {Object} eOpts
     */
    onRowDblClick: function (element, record, rowIndex, e, eOpts) {
        var gridContainer = this.getView().ownerCt;

        var title = CMDBuildUI.locales.Locales.attachments.editattachment;
        var panel = CMDBuildUI.util.Utilities.openPopup('popup-edit-attachment-form', title, {
            xtype: 'dms-attachment-edit',
            // DMSModelClass: model,
            objectType: gridContainer.getObjectType(),
            objectTypeName: gridContainer.getObjectTypeName(),
            objectId: gridContainer.getObjectId(),
            attachmentId: record.getId(),
            DMSCategoryTypeName: gridContainer.getDMSCategoryTypeName(),
            DMSCategoryValue: record.get('category'),
            ignoreSchedules: gridContainer.getIgnoreSchedules()
        }, {
            popupsave: {
                fn: function () {
                    gridContainer.getViewModel().getStore('attachments').load();
                },
                scope: this
            },
            popupcancel: function () { }
        });
    }
});