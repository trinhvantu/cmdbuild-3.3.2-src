Ext.define('CMDBuildUI.view.emails.DMSAttachments.PanelController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.emails-dmsattachments-panel',
    control: {
        '#': {
            beforeRender: 'onBeforeRender'
        },
        '#comboclass': {
            change: 'onComboClassChange'
        },
        '#saveBtn': {
            click: 'onSaveBtn'
        },
        '#cancelBtn': {
            click: 'onCancelBtnClick'
        }

    },

    /**
     * @param {CMDBuildUI.view.emails.Edit.Panel} view
     * @param {Object} eOpts
     */
    onBeforeRender: function (view, eOpts) {
        this.getViewModel().set('firstload', true);
        this.getViewModel().bind({
            store: '{attributeslist}',
            objectTypeName: '{objectTypeName}'
        }, function (data) {
            if (data.store && data.objectTypeName) {
                var comboclass = this.lookupReference('comboclass');
                comboclass.setValue(data.objectTypeName);
            }
        }, this);
    },

    /**
     * @param {Ext.form.field.ComboBox} combos
     * @param {String} newValue
     * @param {String} oldValue
     * @param {Object} eOpts
     * 
     */
    onComboClassChange: function (combo, newValue, oldValue, eOpts) {
        var me = this;
        var vm = combo.lookupViewModel();
        if (vm.get("comboclass.selection")) {
            var typeSelected = vm.get("comboclass.selection").get('type');
            if (newValue) {
                me.setContainerGrid(typeSelected, newValue);
            }
        }
    },

    /**
     * @param {CMDBuildUI.view.emails.Create} view
     * @param {Object} eOpts
     */
    onSaveBtn: function (view, eOpts) {
        var me = this;
        var attachmentsgrid = this.getView().lookupReference('attachmentgrid');
        var attachmentsSelected = attachmentsgrid.getSelection();

        var cardsgrid = this.getView().lookupReference('cardsgrid');
        var cardSelected = cardsgrid.getSelection();

        var objectTypeName;
        var objectId;
        if (!Ext.isEmpty(cardSelected)) {
            objectTypeName = cardSelected[0].get('_type');
            objectId = cardSelected[0].getId();
        }

        var attachmentStore = this.getView().config.store;

        attachmentsSelected.forEach(function (selatt) {
            if (me.checkAlreadyExists(selatt, attachmentStore)) {
                var w = Ext.create('Ext.window.Toast', {
                    title: CMDBuildUI.locales.Locales.notifier.warning,
                    html: CMDBuildUI.locales.Locales.emails.alredyexistfile,
                    iconCls: 'x-fa fa-exclamation-circle',
                    align: 'br'
                });
                w.show();
            } else {
                selatt.set('objectTypeName', objectTypeName);
                selatt.set('objectId', objectId);
                selatt.set('DMSAttachment', true);
                selatt.set('newAttachment', true);
                attachmentStore.add(selatt.getData());
            }
        });

        var popup = this.getView().up("panel");
        popup.close();
    },

    /**
     * @param {Ext.button.Button} button
     * @param {Event} e
     * @param {Object} eOpts
     */
    onCancelBtnClick: function (button, e, eOpts) {
        var popup = this.getView().up("panel");
        popup.close();
    },
    /**
     * @param {CMDBuildUI.view.classes.cards.Grid} view
     * @param {Numeric|String} newid
     * @param {Numeric|String} oldid
     */

    checkAlreadyExists: function (selatt, store) {
        var presence = false;
        var filename = selatt.get('name');
        var items = store.getRange();
        items.forEach(function (item) {
            if (item.get('name') == filename) {
                presence = true;
                return;
            }
        });
        return presence;
    },


    privates: {
        setContainerGrid: function (typeSelected, newValue) {
            var me = this,
                vm = this.getViewModel();
            var storetype;
            if (CMDBuildUI.util.helper.ModelHelper.objecttypes.klass == typeSelected) {
                storetype = 'classes-cards';
            } else if (CMDBuildUI.util.helper.ModelHelper.objecttypes.process == typeSelected) {
                storetype = 'processes-instances';
            }
            var classContainer = me.lookupReference('classcontainer');
            var attachmentContainer = me.lookupReference('attachmentcontainer');

            // clear containers
            classContainer.removeAll(true);
            attachmentContainer.removeAll(true);

            // get columns for selected type
            CMDBuildUI.util.helper.GridHelper.getColumnsForType(
                typeSelected,
                newValue
            ).then(function (columns) {
                CMDBuildUI.util.helper.ModelHelper.getModel(typeSelected, newValue).then(function (model) {

                    // define grid
                    var grid = classContainer.add({
                        xtype: "grid",
                        reference: 'cardsgrid',
                        scrollable: true,
                        maxHeight: 250,
                        bind: {
                            store: '{cardss}'
                        },
                        viewModel: {
                            stores: {
                                cardss: {
                                    type: storetype,
                                    model: model.getName(),
                                    autoLoad: true,
                                    autoDestroy: true,
                                    proxy: {
                                        type: 'baseproxy',
                                        url: model.getProxy().getUrl()
                                    },
                                    listeners: {
                                        beforeload: function (store, operation, eOpts) {
                                            if (vm.get('objectType') == typeSelected && vm.get('objectTypeName') == newValue) {
                                                var selId = vm.get('objectId');
                                                var extraparams = store.getProxy().getExtraParams();
                                                extraparams.positionOf = selId;
                                                extraparams.positionOf_goToPage = false;
                                            } else {
                                                vm.set('firstload', false);
                                            }
                                            grid.reconfigure(null, columns);
                                        },
                                        load: function (store, record) {
                                            if (vm.get('firstload')) {
                                                vm.set('firstload', false);
                                                var selId = vm.get('objectId');
                                                var metadata = store.getProxy().getReader().metaData;
                                                var posinfo = metadata.positions[selId];
                                                var selected = [];
                                                selected.push(store.getById(selId));
                                                if (!posinfo.pageOffset) {
                                                    grid.setSelection(selected);
                                                } else {
                                                    grid.ensureVisible(posinfo.positionInTable, {
                                                        callback: function () {
                                                            grid.setSelection(selected);
                                                        }
                                                    });
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        listeners: {
                            selectionChange: function (selection, record, eOpts) {
                                attachmentContainer.removeAll(true);
                                var cardId = record[0].getId();
                                var cardType = record[0].get('_type');
                                var proxyurl = CMDBuildUI.util.api.Classes.getAttachments(cardType, cardId);

                                attachmentContainer.add({
                                    xtype: 'attachments-grid',
                                    reference: 'attachmentgrid',
                                    viewModel: {
                                        stores: {
                                            attachments: {
                                                type: 'attachments',
                                                autoLoad: true,
                                                autoDestroy: true,
                                                proxy: {
                                                    url: proxyurl,
                                                    type: 'baseproxy'
                                                }
                                            }
                                        }
                                    }
                                });
                            }
                        }
                    });
                }, Ext.emptyFn, Ext.emptyFn, this);
            }, Ext.emptyFn, Ext.emptyFn, this);
        }
    }
});