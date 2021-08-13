Ext.define('CMDBuildUI.view.widgets.customform.PanelController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.widgets-customform-panel',

    control: {
        '#': {
            beforerender: 'onBeforeRender',
            beforedestroy: 'onBeforeDestroy'
        },
        tableview: {
            actionclonerowclick: 'onActionCloneRowClick',
            actioneditrowclick: 'onActionEditRowClick',
            actionremoverowclick: 'onActionRemoveRowClick'
        },
        '#closebtn': {
            click: 'onCloseBtnClick'
        }
    },

    /**
     * @param {CMDBuildUI.view.widgets.customform.Panel} view
     * @param {Object} eOpts
     */
    onBeforeRender: function (view, eOpts) {
        if (!Ext.ClassManager.isCreated(view.getModelName())) {
            this.setModelAttributes([]);
            // generate model
            CMDBuildUI.view.widgets.customform.Utilities.getModel(this.getViewModel().get("theWidget")).then(function(model) {
                // render widget
                this.renderWidget();
            });
        } else {
            // render widget
            this.renderWidget();
        }
    },

    /**
     * On popup close handler.
     */
    onBeforeDestroy: function () {
        // update output variable in target object
        var view = this.getView();
        var store = this.getViewModel().get("dataStore");
        var rows = [];
        var row = view.lookupViewModel().get('theRow');
        var theWidget = this.getViewModel().get("theWidget");
        var storedata;
        if (store) {
            storedata = store.getRange();
        } else {
            storedata = [row];
        }
        rows = CMDBuildUI.view.widgets.customform.Utilities.serialize(theWidget, storedata);
        view.getTarget().set(view.getOutput(), rows);
    },

    /**
     * Render widget content
     */
    renderWidget: function () {
        var conf;
        var vm = this.getViewModel();
        var theWidget = vm.get("theWidget");
        var modelname = this.getView().getModelName();

        if (theWidget.get("Layout").toLowerCase() === 'form') {
            conf = this.getFormConfig();
            var theRow = Ext.create(modelname);
            this.getViewModel().set('theRow', theRow);
        } else if (theWidget.get("Layout").toLowerCase() === 'grid') {
            conf = this.getGridConfig();
            this.getViewModel().setStores({
                dataStore: {
                    model: modelname,
                    proxy: 'memory'
                }
            });
        } else {
            // TODO: Show error message
        }
        this.getView().removeAll(true);
        this.getView().add(conf);
        //CMDBuildUI.view.widgets.customform.Panel.loadData(theWidget, theTarget, dataStore, outputdata, serializationconfig);
        this.loadData();
    },

    /**
     * Load data
     * @param {Boolean} force If `true` data is always readed from the server or from the configuration.
     * Data saved in output variable in target object will be ignored.
     */
    loadData: function (force) {
        var vm = this.getViewModel(),
            theWidget = vm.get("theWidget"),
            isForm = theWidget.get("Layout").toLowerCase() === 'form';

        function callbackFn(response) {
            if (isForm) {
                if (response.length) {
                    vm.get("theRow").updateDataFromObject(response[0].getData());
                }
            } else {
                vm.get("dataStore").add(response);
            }
        }

        // clear store data
        if (vm.get('dataStore')) {
            vm.get("dataStore").removeAll();
        }

        // check refresh behaviour
        if (theWidget.get("RefreshBehaviour") && theWidget.get("RefreshBehaviour").toLowerCase() === 'everytime') {
            force = true;
        }

        // get data from output
        var outputdata = vm.get("theTarget").get(this.getView().getOutput());
        var serializationconfig = CMDBuildUI.view.widgets.customform.Utilities.getSerializationConfig(theWidget);
        if (!force && outputdata !== undefined) {
            if (serializationconfig.type === "json") {
                CMDBuildUI.view.widgets.customform.Utilities.loadDataFromJson(outputdata, callbackFn);
            } else {
                CMDBuildUI.view.widgets.customform.Utilities.loadDataFromRawText(outputdata, serializationconfig, callbackFn);
            }
            return;
        }

        // set empty value for data type if not specified
        if (!theWidget.get("DataType")) {
            theWidget.set("DataType", "");
        }

        var theTarget = vm.get('theTarget');
        CMDBuildUI.view.widgets.customform.Utilities.loadData(theWidget, theTarget, callbackFn);
    },



    /**
     * @param {Ext.view.Table} tableview
     * @param {CMDBuildUI.model.base.Base} record
     * @param {Integer} rowIndex
     * @param {Integer} colIndex
     */
    onActionRemoveRowClick: function (tableview, record, rowIndex, colIndex) {
        // erase record
        record.erase();
    },

    /**
     * @param {Ext.view.Table} tableview
     * @param {CMDBuildUI.model.base.Base} record
     * @param {Integer} rowIndex
     * @param {Integer} colIndex
     */
    onActionEditRowClick: function (tableview, record, rowIndex, colIndex) {
        var config = this.getFormConfig();
        var popup;
        var theRow = record.clone();
        var theTarget = this.getViewModel().get('theTarget');

        Ext.apply(config, {
            viewModel: {
                data: {
                    theRow: theRow,
                    theTarget: theTarget
                }
            },
            buttons: [{
                reference: 'saveBtn',
                itemId: 'saveBtn',
                formBind: true,
                ui: 'management-action-small',
                text: CMDBuildUI.locales.Locales.common.actions.save,
                autoEl: {
                    'data-testid': 'widgets-customform-form-save'
                },
                handler: function () {
                    var changes = theRow.getChanges();
                    for (var c in changes) {
                        record.set(c, theRow.get(c));
                    }
                    popup.close();
                }
            }, {
                reference: 'cancelBtn',
                itemId: 'cancelBtn',
                ui: 'secondary-action-small',
                text: CMDBuildUI.locales.Locales.common.actions.cancel,
                autoEl: {
                    'data-testid': 'widgets-customform-form-cancel'
                },
                handler: function () {
                    popup.close();
                }
            }]
        });

        popup = CMDBuildUI.util.Utilities.openPopup(
            null,
            Ext.String.format(
                "{0} - {1}",
                this.getViewModel().get("theWidget").get("_label"),
                CMDBuildUI.locales.Locales.widgets.customform.editrow
            ),
            config, {
                /**
                 * @param {Ext.panel.Panel} panel
                 * @param {Object} eOpts
                 */
                beforeclose: function (panel, eOpts) {
                    panel.removeAll(true);
                }
            }
        );
    },

    /**
     * @param {Ext.view.Table} tableview
     * @param {CMDBuildUI.model.base.Base} record
     * @param {Integer} rowIndex
     * @param {Integer} colIndex
     */
    onActionCloneRowClick: function (tableview, record, rowIndex, colIndex) {
        var recordData = record.getData();
        delete recordData._id;
        this.getViewModel().get("dataStore").add([recordData]);
    },

    /**
     * @param {Ext.button.Button} button
     * @param {Event} e
     * @param {Object} eOpts
     */
    onCloseBtnClick: function (button, e, eOpts) {
        this.getView().fireEvent("popupclose");
    },

    /**
     * @param {Ext.button.Button} button
     * @param {Ext.event.Event} e
     */
    onRefreshBtnClick: function (button, e) {
        // update ajax action id
        CMDBuildUI.util.Ajax.setActionId('widget.customform.refreshdata');
        // load data
        this.loadData(true);
        //CMDBuildUI.view.widgets.customform.Panel.loadData(theWidget, theTarget, dataStore, outputdata, serializationconfig, true);
    },

    /**
     * @param {Ext.button.Button} button
     * @param {Ext.event.Event} e
     */
    onAddRowBtnClick: function (button, e) {
        var config = this.getFormConfig();
        var popup;
        var theRow = Ext.create(this.getView().getModelName());
        var theTarget = this.getViewModel().get('theTarget');
        var vm = this.getViewModel();

        Ext.apply(config, {
            viewModel: {
                data: {
                    theRow: theRow,
                    theTarget: theTarget
                }
            },
            buttons: [{
                reference: 'saveBtn',
                itemId: 'saveBtn',
                formBind: true,
                ui: 'management-action-small',
                text: CMDBuildUI.locales.Locales.common.actions.save,
                autoEl: {
                    'data-testid': 'widgets-customform-form-save'
                },
                handler: function () {
                    vm.get("dataStore").add(theRow);
                    popup.close();
                }
            }, {
                reference: 'cancelBtn',
                itemId: 'cancelBtn',
                ui: 'secondary-action-small',
                text: CMDBuildUI.locales.Locales.common.actions.cancel,
                autoEl: {
                    'data-testid': 'widgets-customform-form-cancel'
                },
                handler: function () {
                    popup.close();
                }
            }]
        });

        popup = CMDBuildUI.util.Utilities.openPopup(
            null,
            Ext.String.format(
                "{0} - {1}",
                this.getViewModel().get("theWidget").get("_label"),
                CMDBuildUI.locales.Locales.widgets.customform.addrow
            ),
            config, {
                /**
                 * @param {Ext.panel.Panel} panel
                 * @param {Object} eOpts
                 */
                beforeclose: function (panel, eOpts) {
                    panel.removeAll(true);
                }
            }
        );
    },


    onImportBtnClick: function (btn, eOpts) {
        var popup = CMDBuildUI.util.Utilities.openPopup(null, CMDBuildUI.locales.Locales.widgets.customform.export, {
            xtype: 'widgets-customform-import',
            attributes: CMDBuildUI.view.widgets.customform.Utilities.getModelAttributes(),
            gridStore: btn.lookupViewModel().get("dataStore"),

            closePopup: function () {
                popup.close();
            }
        }, null, {
            width: 600,
            height: 500
        });
    },

    /**
     * 
     * @param {Ext.button.Button} btn 
     * @param {Object} eOpts 
     */
    onExportBtnClick: function (btn, eOpts) {
        var popup = CMDBuildUI.util.Utilities.openPopup(null, CMDBuildUI.locales.Locales.widgets.customform.export, {
            xtype: 'widgets-customform-export',
            attributes: CMDBuildUI.view.widgets.customform.Utilities.getModelAttributes(),
            gridStore: btn.lookupViewModel().get("dataStore"),

            closePopup: function () {
                popup.close();
            }
        }, null, {
            width: 600,
            height: 500
        });
    },

    privates: {
        _model_attributes: [],

        /**
         * @param {CMDBuildUI.model.Attribute[]} attributes
         */
        setModelAttributes: function (attributes) {
            this._model_attributes = attributes;
        },

        /**
         * Get grid configuration
         * 
         * @return {Object} grid configuration
         */
        getGridConfig: function () {
            var model = Ext.ClassManager.get(this.getView().getModelName());
            var columns = [];
            var vm = this.getViewModel();
            var fields = model.getFields();

            // define columns 
            for (var i = 0; i < fields.length; i++) {
                var field = fields[i];
                var column = CMDBuildUI.util.helper.GridHelper.getColumn(field, {
                    allowFilter: false
                });
                if (column) {
                    if (field.writable) {
                        column.editor = CMDBuildUI.util.helper.FormHelper.getEditorForField(field);
                        column.editor.allowBlank = !field.mandatory;
                        if (column.editor) {

                            if (field.cmdbuildtype.toLowerCase() === CMDBuildUI.util.helper.ModelHelper.cmdbuildtypes.lookup.toLowerCase() ||
                                field.cmdbuildtype.toLowerCase() === CMDBuildUI.util.helper.ModelHelper.cmdbuildtypes.reference.toLowerCase()) {
                                // override editor listeners to update field description
                                column.editor.listeners = {
                                    change: function (field, newvalue, oldvalue, eOpts) {
                                        var object = field.getRefOwner().context.record;
                                        if (object) {
                                            object.set(Ext.String.format("_{0}_description", field.name), field.getDisplayValue());
                                        }
                                    }
                                };
                            }

                            //change xtype of editor when colunm is reference (only in grid view) 
                            if (field.cmdbuildtype.toLowerCase() === CMDBuildUI.util.helper.ModelHelper.cmdbuildtypes.reference.toLowerCase()) {
                                column.editor.xtype = 'referencecombofield';
                                column.editor.filterRecordLinkName = 'theTarget';
                                column.editor.customFormTargetObj = vm.get('theTarget');
                            }
                        }

                        if (field.mandatory) {
                            column.text += " *";
                        }
                    }
                    columns.push(column);
                } else {
                    CMDBuildUI.util.Logger.log("Configuration error for column " + field.getName(), CMDBuildUI.util.Logger.levels.error);
                }
            }


            // add view row action columns
            columns.push({
                xtype: 'actioncolumn',
                minWidth: 30,
                maxWidth: 30,
                hideable: false,
                align: 'center',
                bind: {
                    disabled: '{!permissions.clone}'
                },
                iconCls: 'x-fa fa-copy',
                tooltip: CMDBuildUI.locales.Locales.widgets.customform.clonerow,
                handler: function (grid, rowIndex, colIndex) {
                    var record = grid.getStore().getAt(rowIndex);
                    grid.fireEvent("actionclonerowclick", grid, record, rowIndex, colIndex);
                },
                autoEl: {
                    'data-testid': 'widgets-customform-grid-row-clone'
                }
            });
            // add edit row action columns
            columns.push({
                xtype: 'actioncolumn',
                minWidth: 30,
                maxWidth: 30,
                hideable: false,
                align: 'center',
                bind: {
                    disabled: '{!permissions.modify}'
                },
                iconCls: 'x-fa fa-pencil',
                tooltip: CMDBuildUI.locales.Locales.widgets.customform.editrow,
                handler: function (grid, rowIndex, colIndex) {
                    var record = grid.getStore().getAt(rowIndex);
                    grid.fireEvent("actioneditrowclick", grid, record, rowIndex, colIndex);
                },
                autoEl: {
                    'data-testid': 'widgets-customform-grid-row-modify'
                }
            });
            // add delete row action columns
            columns.push({
                xtype: 'actioncolumn',
                minWidth: 30,
                maxWidth: 30,
                hideable: false,
                align: 'center',
                bind: {
                    disabled: '{!permissions.delete}'
                },
                iconCls: 'x-fa fa-remove',
                tooltip: CMDBuildUI.locales.Locales.widgets.customform.deleterow,
                handler: function (grid, rowIndex, colIndex) {
                    var record = grid.getStore().getAt(rowIndex);
                    grid.fireEvent("actionremoverowclick", grid, record, rowIndex, colIndex);
                },
                autoEl: {
                    'data-testid': 'widgets-customform-grid-row-delete'
                }
            });

            return {
                xtype: 'grid',
                forceFit: true,
                loadMask: true,
                columns: columns,
                bind: {
                    store: '{dataStore}'
                },

                plugins: {
                    ptype: 'cellediting',
                    clicksToEdit: 1
                },
                listeners: {
                    beforeedit: function (editor, context, eOpts) {
                        vm = this.lookupViewModel();
                        if (context.column.getEditor()) {
                            context.column.getEditor()._ownerRecord = context.record;
                        }
                        if (vm && !vm.get('permissions.modify')) {
                            return false;
                        }
                    },
                    validateEdit: function (editor, context, eOpts) {
                        if (!context.column.getEditor().isValid()) {
                            return false;
                        }
                    }
                },
                tbar: [{
                    xtype: 'button',
                    text: CMDBuildUI.locales.Locales.widgets.customform.addrow,
                    iconCls: 'x-fa fa-plus',
                    ui: 'management-action',
                    reference: 'addrowbtn',
                    itemid: 'addrowbtn',
                    handler: 'onAddRowBtnClick',
                    bind: {
                        disabled: '{!permissions.add}'
                    },
                    autoEl: {
                        'data-testid': 'widgets-customform-grid-refresh'
                    }
                }, {
                    xtype: 'button',
                    text: CMDBuildUI.locales.Locales.widgets.customform.import,
                    iconCls: 'x-fa fa-upload',
                    ui: 'management-action',
                    reference: 'importbtn',
                    itemid: 'importbtn',
                    handler: 'onImportBtnClick',
                    bind: {
                        disabled: '{!permissions.import}'
                    },
                    autoEl: {
                        'data-testid': 'widgets-customform-grid-refresh'
                    }
                }, {
                    xtype: 'button',
                    text: CMDBuildUI.locales.Locales.widgets.customform.export,
                    iconCls: 'x-fa fa-download',
                    ui: 'management-action',
                    reference: 'exportbtn',
                    itemid: 'exportbtn',
                    handler: 'onExportBtnClick',
                    bind: {
                        disabled: '{!permissions.export}'
                    },
                    autoEl: {
                        'data-testid': 'widgets-customform-grid-refresh'
                    }
                }, {
                    xtype: 'button',
                    text: CMDBuildUI.locales.Locales.widgets.customform.refresh,
                    iconCls: 'x-fa fa-refresh',
                    ui: 'management-action',
                    reference: 'refreshbtn',
                    itemid: 'refreshbtn',
                    handler: 'onRefreshBtnClick',
                    autoEl: {
                        'data-testid': 'widgets-customform-grid-refresh'
                    }
                }]
            };
        },

        /**
         * Get form configuration
         * 
         * @return {Object} form configuration
         */
        getFormConfig: function () {
            var view = this.getView(),
                vm = view.lookupViewModel(),
                theWidget = vm.get("theWidget");
            var model = Ext.ClassManager.get(view.getModelName());

            var grouping;
            if (theWidget.get("ModelType").toLowerCase() === 'class') {
                var item = CMDBuildUI.util.helper.ModelHelper.getClassFromName(theWidget.get("ClassModel"));
                grouping = item && item.attributeGroups().getRange() || [];
            }
            // get form fields
            var items = CMDBuildUI.util.helper.FormHelper.renderForm(model, {
                mode: CMDBuildUI.util.helper.FormHelper.formmodes.update,
                showAsFieldsets: true,
                linkName: 'theRow',
                filterLinkName: 'theTarget',
                grouping: grouping
            });


            return {
                xtype: "form",
                modelValidation: true,
                autoScroll: true,

                fieldDefaults: {
                    labelAlign: 'top'
                },

                items: items
            };
        },

        /**
         * Resolve variable.
         * @param {String} variable
         * @return {*} The variable resolved.
         */
        extractVariableFromString: function (variable, theTarget) {
            if (Ext.isString(variable) && CMDBuildUI.util.api.Client.testRegExp(/^{(client|server)+:*.+}$/, variable)) {
                variable = variable.replace("{", "").replace("}", "");
                var s_variable = variable.split(":");
                var result;
                if (s_variable[0] === "server") {
                    result = CMDBuildUI.util.ecql.Resolver.resolveServerVariables([s_variable[1]], theTarget);
                    return result[s_variable[1]];
                } else if (s_variable[0] === "client") {
                    result = CMDBuildUI.util.ecql.Resolver.resolveClientVariables([s_variable[1]], theTarget);
                    return result[s_variable[1]];
                }
            } else {
                return variable;
            }
        }
    }
});