Ext.define('CMDBuildUI.view.relations.fieldset.FieldsetController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.relations-fieldset',

    control: {
        '#': {
            beforerender: 'onBeforeRender'
        },
        '#addrelationbtn': {
            click: 'onAddRelationBtnClick'
        }
    },

    /**
     * 
     * @param {CMDBuildUI.view.relations.fieldset.Fieldset} view 
     * @param {Object} eOpts 
     */
    onBeforeRender: function (view, eOpts) {
        var vm = view.lookupViewModel();
        var me = this;
        vm.bind("{targetmodel}", function (targetmodel) {
            if (targetmodel) {
                // details xtype
                var detailxtype, btnHidden;
                if (vm.get("targettype") === CMDBuildUI.util.helper.ModelHelper.objecttypes.process) {
                    detailxtype = 'processes-instances-rowcontainer';
                    btnHidden = true;
                } else {
                    detailxtype = 'classes-cards-card-view';
                    btnHidden = false;
                }

                btnHidden = view.formmode === CMDBuildUI.util.helper.FormHelper.formmodes.read ? true : btnHidden;

                vm.set("addrelationbtn.hidden", btnHidden);
                // get columns
                CMDBuildUI.util.helper.GridHelper.getColumnsForType(
                    vm.get("targettype"),
                    vm.get("targettypename")
                ).then(function (cols) {
                    vm.get("domain").getAttributes().then(function (attrs) {
                        // get column defs for relation attributes
                        attrs.getRange().forEach(function (attr) {
                            var field = CMDBuildUI.util.helper.ModelHelper.getModelFieldFromAttribute(attr);
                            var col = CMDBuildUI.util.helper.GridHelper.getColumn(field);
                            col.hidden = false;
                            cols.push(col);
                        });
                        if (!view.destroyed) {
                            // add grid
                            view.add({
                                xtype: 'relations-fieldset-grid',
                                columns: cols,
                                reference: 'relgrid',

                                plugins: [{
                                    ptype: 'forminrowwidget',
                                    expandOnDblClick: true,
                                    removeWidgetOnCollapse: true,
                                    widget: {
                                        xtype: detailxtype,
                                        viewModel: {
                                            data: {
                                                basepermissions: view.lookupViewModel().get("basepermissions")
                                            }
                                        }, // do not remove otherwise the viewmodel will not be initialized
                                        tabpaneltools: [{
                                            xtype: 'tool',
                                            itemId: 'viewcardaction',
                                            iconCls: 'x-fa fa-external-link',
                                            cls: 'management-tool',
                                            tooltip: CMDBuildUI.locales.Locales.relations.opencard,
                                            callback: function (panel, tool, event) {
                                                me.onItemViewCardActionClick(panel.up());
                                            },
                                            autoEl: {
                                                'data-testid': 'relations-fieldset-viewcardaction'
                                            }
                                        },
                                        {
                                            xtype: 'tool',
                                            itemId: 'editcardaction',
                                            iconCls: 'x-fa fa-pencil-square-o',
                                            cls: 'management-tool',
                                            disabled: true,
                                            hidden: btnHidden,
                                            tooltip: CMDBuildUI.locales.Locales.relations.editcard,
                                            callback: function (panel, tool, event) {
                                                me.onItemEditCardActionClick(panel.up());
                                            },
                                            autoEl: {
                                                'data-testid': 'relations-fieldset-editcardaction'
                                            },
                                            bind: {
                                                disabled: '{!basepermissions.edit && !permissions.edit}'
                                            }
                                        }
                                        ]
                                    }
                                }],
                                listeners: {
                                    rowdblclick: function (grid, record, element, rowIndex, e, eOpts) {
                                        me.redirectToItem(vm.get("targettype"), record.get("_type"), record.get("_id"));
                                    }
                                }
                            });
                        }
                    });
                });
            }
        });

        vm.bind("{records}", function (records) {
            records.addListener("load", function () {
                vm.set("recordscount", records.getTotalCount());
            });
        });
    },

    /**
     * 
     * @param {Ext.button.Button} button 
     * @param {Object} eOpts 
     */
    onAddRelationBtnClick: function (button, eOpts) {
        var vm = this.getViewModel();
        var view = this.getView();
        var domain = vm.get("domain");
        var direction = vm.get("direction") === "_1" ? 'inverse' : 'direct';

        var popup;
        var title = vm.get("basetitle");
        var config = {
            xtype: 'relations-list-add-container',
            originTypeName: vm.get("objectTypeName"),
            originId: vm.get("objectId"),
            multiSelect: true,
            viewModel: {
                data: {
                    objectTypeName: vm.get("targettypename"),
                    relationDirection: direction,
                    theDomain: domain
                }
            },
            listeners: {
                popupclose: function () {
                    popup.removeAll(true);
                    popup.close();
                }
            },
            onSaveSuccess: function () {
                view.down("grid").getStore().load();
            }
        };

        popup = CMDBuildUI.util.Utilities.openPopup('popup-add-relation', title, config, null);

    },

    privates: {
        /**
         * 
         * @param {Ext.form.Panel} view 
         */
        onItemViewCardActionClick: function (view) {
            var vm = view.lookupViewModel();
            this.redirectToItem(vm.get("targettype"), vm.get("targettypename"), vm.get("objectId"));
        },

        /**
         * 
         * @param {Ext.form.Panel} view 
         */
        onItemEditCardActionClick: function (view) {
            var popup;
            var vm = view.lookupViewModel();
            // open popup
            var config = {
                xtype: 'classes-cards-card-edit',
                viewModel: {
                    data: {
                        objectTypeName: vm.get("objectTypeName"),
                        objectId: vm.get("objectId")
                    }
                },
                buttons: [{
                    ui: 'management-action',
                    reference: 'detailsavebtn',
                    itemId: 'detailsavebtn',
                    text: CMDBuildUI.locales.Locales.common.actions.save,
                    autoEl: {
                        'data-testid': 'relations-fieldset-editcard-save'
                    },
                    formBind: true,
                    handler: function (btn, event) {
                        btn.disable();
                        popup.down("classes-cards-card-edit").getController().saveForm().then(function (record) {
                            view.up("grid").updateRowWithExpader(record);
                            popup.destroy();
                        }).otherwise(function () {
                            btn.enable();
                        });
                    }
                }, {
                    ui: 'secondary-action',
                    reference: 'detailclosebtn',
                    itemId: 'detailclosebtn',
                    text: CMDBuildUI.locales.Locales.common.actions.close,
                    autoEl: {
                        'data-testid': 'relations-fieldset-editcard-cancel'
                    },
                    handler: function (btn, event) {
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
            popup = CMDBuildUI.util.Utilities.openPopup(null, CMDBuildUI.locales.Locales.relations.editcard, config);
        },

        /**
         * 
         * @param {String} targettype 
         * @param {String} targettypename 
         * @param {Number} objectid 
         */
        redirectToItem: function (targettype, targettypename, objectid) {
            var path;
            switch (targettype) {
                case CMDBuildUI.util.helper.ModelHelper.objecttypes.klass:
                    path = Ext.String.format('classes/{0}/cards/{1}/view', targettypename, objectid);
                    break;
                case CMDBuildUI.util.helper.ModelHelper.objecttypes.process:
                    path = Ext.String.format('processes/{0}/instances/{1}', targettypename, objectid);
                    break;
            }
            this.redirectTo(path);
        }
    }
});