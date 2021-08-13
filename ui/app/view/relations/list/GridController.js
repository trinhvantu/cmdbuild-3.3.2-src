Ext.define('CMDBuildUI.view.relations.list.GridController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.relations-list-grid',

    control: {
        '#': {
            beforerender: 'onBeforeRender',
            itemdblclick: 'onItemDblClick'
        },
        'tableview': {
            actionopencard: 'onActionOpenCard',
            actioneditrelation: 'onActionEditRelation',
            actiondeleterelation: 'onActionDeleteRelation',
            actioneditcard: 'onActionEditCard'
        }
    },

    onBeforeRender: function(view) {
        view.lookupViewModel().bind({
            bindTo: '{allRelations}'
        }, function(store) {
            store.load();
        });
    },

    /**
    * @param {CMDBuildUI.view.attachments.Grid} grid
    * @param {Ext.data.Model} record
    * @param {Number} rowIndex
    * @param {Number} colIndex
    * @param {Boolean} openInGrid
    * 
    */
    onActionOpenCard: function (grid, record, rowIndex, colIndex, openInGrid) {
        var path;
        switch (CMDBuildUI.util.helper.ModelHelper.getObjectTypeByName(record.get("_destinationType"))) {
            case CMDBuildUI.util.helper.ModelHelper.objecttypes.klass:
                path = Ext.String.format('classes/{0}/cards/{1}', record.get("_destinationType"), record.get("_destinationId"));
                break;
            case CMDBuildUI.util.helper.ModelHelper.objecttypes.process:
                path = Ext.String.format('processes/{0}/instances/{1}', record.get("_destinationType"), record.get("_destinationId"));
                break;
        }
        if (!openInGrid) {
            path += '/view';
        }
        if (path) {
            this.redirectTo(path);
        }
    },

    /**
    * @param {CMDBuildUI.view.attachments.Grid} grid
    * @param {Ext.data.Model} record
    * @param {Number} rowIndex
    * @param {Number} colIndex
    * 
    */
    onActionEditRelation: function (grid, record, rowIndex, colIndex) {
        var vm = grid.lookupViewModel();
        CMDBuildUI.view.relations.Utils.editRelation(record, {
            proxyurl: vm.get("storedata.proxyurl"),
            objecttypename: vm.get("objectTypeName"),
            objectid: vm.get("objectId")
        }).then(function() {
            grid.getStore().reload();
        });
    },

    /**
    * @param {CMDBuildUI.view.attachments.Grid} grid
    * @param {Ext.data.Model} record
    * @param {Number} rowIndex
    * @param {Number} colIndex
    * 
    */
    onActionDeleteRelation: function (grid, record, rowIndex, colIndex) {
        CMDBuildUI.view.relations.Utils.deleteRelation(record);
    },

    /**
    * @param {CMDBuildUI.view.attachments.Grid} grid
    * @param {Ext.data.Model} record
    * @param {Number} rowIndex
    * @param {Number} colIndex
    * 
    */
    onActionEditCard: function (grid, record, rowIndex, colIndex) {
        var popup;
        var me = this;
        // open popup
        var config = {
            xtype: 'classes-cards-card-edit',
            viewModel: {
                data: {
                    objectTypeName: record.get("_destinationType"),
                    objectId: record.get("_destinationId")
                }
            },

            buttons: [{
                ui: 'management-action',
                reference: 'detailsavebtn',
                itemId: 'detailsavebtn',
                text: CMDBuildUI.locales.Locales.common.actions.save,
                autoEl: {
                    'data-testid': 'relations-list-grid-editcard-save'
                },
                formBind: true,
                localized: {
                    text: 'CMDBuildUI.locales.Locales.common.actions.save'
                },
                handler: function(btn, event) {
                    btn.disable();
                    popup.down("classes-cards-card-edit").getController().saveForm().then(function(record) {
                        grid.getStore().load();
                        popup.destroy();
                    }).otherwise(function() {
                        btn.enable();
                    });
                }
            }, {
                ui: 'secondary-action',
                reference: 'detailclosebtn',
                itemId: 'detailclosebtn',
                text: CMDBuildUI.locales.Locales.common.actions.close,
                autoEl: {
                    'data-testid': 'relations-list-grid-editcard-cancel'
                },
                localized: {
                    text: 'CMDBuildUI.locales.Locales.common.actions.close'
                },
                handler: function(btn, event) {
                    popup.destroy();
                }
            }],

            listeners: {
                itemupdated: function () {
                    popup.close();
                    grid.getStore().load();
                },
                cancelupdating: function () {
                    popup.close();
                }
            }
        };
        popup = CMDBuildUI.util.Utilities.openPopup(null, record.get("_destinationDescription"), config);
    },

    /**
     * @param {CMDBuildUI.view.relations.list.Grid} grid
     * @param {Ext.data.Model} record
     * @param {HTMLElement} item
     * @param {Number} index
     * @param {Ext.event.Event} e
     * @param {Object} eOpts
     */
    onItemDblClick: function (grid, record, item, index, e, eOpts) {
        this.onActionOpenCard(grid, record, null, null, grid.lookupViewModel().get("readonly"));
    }
});
