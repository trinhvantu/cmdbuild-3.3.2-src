Ext.define('CMDBuildUI.view.widgets.linkcards.PanelController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.widgets-linkcards-panel',

    control: {
        "#": {
            beforerender: "onBeforeRender"
        },
        grid: {
            selectionchange: "onSelectionChange"
        },
        tableview: {
            actionviewobject: "onActionViewObject",
            actioneditobject: "onActionEditObject"
        },
        '#togglefilter': {
            toggle: 'onToggleFilterToggle'
        },
        '#refreshselection': {
            click: 'onRefreshSelectionClick'
        },
        '#closebtn': {
            click: 'onCloseBtnClick'
        },
        '#checkedonly': {
            toggle: 'onCheckedOnlyToggleHandle'
        }
    },
    listen: {
        store: {
            '#gridrows': {
                load: 'onGridrowsLoad'
            }
        }
    },

    /**
     * @param {CMDBuildUI.view.widgets.linkcards.Panel} view
     * @param {Object} eOpts
     */
    onBeforeRender: function (view, eOpts) {
        var me = this,
            vm = this.getViewModel(),
            widget = vm.get("theWidget"),
            target = vm.get("theTarget"),
            typeinfo = CMDBuildUI.view.widgets.linkcards.Panel.getTypeInfo(widget),
            objectTypeName = typeinfo.objectTypeName,
            objectType = typeinfo.objectType;

        // if output var is not declared the grid should be in read mode, without checkbox
        if (Ext.isEmpty(widget.get('_output'))) {
            widget.set('NoSelect', true);
            vm.set("defaultsLoaded", true);
        } else {
            if (Ext.isEmpty(target.get(widget.get("_output"))) && !Ext.isArray(target.get(widget.get("_output")))) {
                CMDBuildUI.view.widgets.linkcards.Panel.loadDefaults(widget, target).then(function(records) {
                    var defaults = [];
                    records.forEach(function (r) {
                        defaults.push({
                            _id: r.getId()
                        });
                    });
                    target.set(widget.get('_output'), defaults);
                    vm.set("defaultsLoaded", true);
                });
            } else {
                vm.set("defaultsLoaded", true);
            }
        }

        if (objectType) {
            vm.set("objectType", objectType);
            vm.set("objectTypeName", objectTypeName);
        } else {
            Ext.asap(function () {
                CMDBuildUI.util.Notifier.showErrorMessage(Ext.String.format(CMDBuildUI.locales.Locales.errors.classnotfound, objectTypeName));
            });
            return;
        }

        // get the model for objtect type name
        CMDBuildUI.util.helper.GridHelper.getColumnsForType(
            objectType,
            objectTypeName, {
            allowFilter: false,
            addTypeColumn: CMDBuildUI.util.helper.ModelHelper.getObjectFromName(objectTypeName, objectType).get("prototype")
        }).then(function (columns) {
            var modelname = CMDBuildUI.util.helper.ModelHelper.getModelName(objectType, objectTypeName);
            var model = CMDBuildUI.util.helper.ModelHelper.getModelFromName(modelname);
            vm.set("model", model);

            // add view object action columns
            columns.push({
                xtype: 'actioncolumn',
                minWidth: 30,
                maxWidth: 30,
                hideable: false,
                disabled: true,
                align: 'center',
                bind: {
                    disabled: '{disableViewAction}'
                },
                iconCls: 'x-fa fa-external-link',
                tooltip: CMDBuildUI.locales.Locales.widgets.linkcards.opencard,
                handler: function (grid, rowIndex, colIndex) {
                    var record = grid.getStore().getAt(rowIndex);
                    grid.fireEvent("actionviewobject", grid, record, rowIndex, colIndex);
                }
            });
            // add edit object action columns
            columns.push({
                xtype: 'actioncolumn',
                minWidth: 30,
                maxWidth: 30,
                hideable: false,
                disabled: true,
                align: 'center',
                bind: {
                    disabled: '{disableEditAction}'
                },
                iconCls: 'x-fa fa-pencil',
                tooltip: CMDBuildUI.locales.Locales.widgets.linkcards.editcard,
                handler: function (grid, rowIndex, colIndex) {
                    var record = grid.getStore().getAt(rowIndex);
                    grid.fireEvent("actioneditobject", grid, record, rowIndex, colIndex);
                }
            });

            // define selection model
            var selModel = {
                selType: 'checkboxmodel',
                showHeaderCheckbox: false,
                checkOnly: true,
                pruneRemoved: false
            };
            if (vm.get("theWidget").get("NoSelect")) {
                selModel = null;
            } else if (vm.get("theWidget").get("SingleSelect")) {
                selModel.mode = "SINGLE";
            }

            // add grid
            view.add({
                xtype: 'grid',
                columns: columns,
                forceFit: true,
                loadMask: true,
                itemId: 'grid',
                reference: 'grid',
                selModel: selModel,
                bind: {
                    store: '{gridrows}',
                    selection: '{selection}'
                },
                bubbleEvents: [
                    'itemupdated'
                ]
            });

        });
    },

    /**
     * 
     * @param {*} store 
     * @param {*} records 
     * @param {*} successful 
     * @param {*} operation 
     * @param {*} eOpts 
     */
    onGridrowsLoad: function (store, records, successful, operation, eOpts) {
        var view = this.getView();
        var vm = this.getViewModel();
        // if (data.rows && data.target && view.getOutput()) {
        var theTarget = vm.get('theTarget');
        if (theTarget) {
            var output = theTarget.get(view.getOutput());
            if (!Ext.isEmpty(output)) {
                var selection = [];
                var notFoundSelected = [];

                output.forEach(function (item) {
                    var r = store.getById(Ext.String.format('{0}', item._id)) || store.getById(item._id);
                    if (r) {
                        selection.push(r);
                    } else {
                        notFoundSelected.push(item);
                    }
                });
                vm.set("selection", selection);
                view.setNotFoundSelected(notFoundSelected);
            }
        }
    },
    /**
     * @param {Ext.grid.Panel} view
     * @param {Ext.data.Model[]} selected
     * @param {Object} eOpts
     */
    onSelectionChange: function (grid, selected, eOpts) {
        CMDBuildUI.util.Logger.log(Ext.String.format('onSelectionChange {0} selected', selected.length), CMDBuildUI.util.Logger.levels.debug);
        var view = this.getView();
        var notFoundSelected = view.getNotFoundSelected();
        if (view.getOutput()) {
            var sel = [];
            Ext.Array.forEach(selected, function (item) {
                sel.push({
                    _id: item.getId()
                });

                var found = Ext.Array.findBy(notFoundSelected, function (jtem, index, array) {
                    return item.getId() == jtem._id;
                }, this);

                if (found) {
                    Ext.Array.remove(notFoundSelected, found);
                }
            });


            view.getTarget().set(view.getOutput(), Ext.Array.merge(sel, notFoundSelected));
        }
    },

    /**
     * @param {Ext.button.Button} button
     * @param {Boolean} selected
     * @param {Object} eOpts
     */
    onToggleFilterToggle: function (button, selected, eOpts) {
        var store = this.getViewModel().get('gridrows');
        var advancedFilter = store.getAdvancedFilter();
        // get the filter if toggle is not selected 
        if (!selected) {
            var vm = this.getViewModel();
            var filter = vm.get("theWidget").get("_Filter_ecql");
            var target = vm.get("theTarget");

            if (filter) {
                // calculate ecql
                var ecql = CMDBuildUI.util.ecql.Resolver.resolve(
                    filter,
                    target
                );
                if (ecql) {
                    advancedFilter.addEcqlFilter(ecql)
                    store.load();
                }
            }
        } else {
            advancedFilter.clearEcqlFitler();
            store.load();
        }
    },

    /**
     * @param {Ext.button.Button} button
     * @param {Event} e
     * @param {Object} eOpts
     */
    onRefreshSelectionClick: function (button, e, eOpts) {
        var me = this,
            vm = button.lookupViewModel(),
            view = me.getView(),
            grid = view.lookupReference("grid"),
            store = grid.getStore(),
            advancedFilter = store.getAdvancedFilter();

        if (e) {
            CMDBuildUI.util.Utilities.showLoader(true, grid);
        }
        if (grid) {
            CMDBuildUI.view.widgets.linkcards.Panel.loadDefaults(vm.get("theWidget"), vm.get("theTarget")).then(function (defaultSelections, widget) {
                CMDBuildUI.util.Utilities.showLoader(false, grid);

                var gridrows = vm.get('gridrows'),
                    selection = [],
                    notFoundSelection = [];

                defaultSelections.forEach(function (item, index, array) {
                    var recordIndex = gridrows.find('_id', item.getId());

                    if (recordIndex != -1) {
                        selection.push(gridrows.getAt(recordIndex));
                    } else {
                        notFoundSelection.push({
                            _id: item.getId()
                        });
                    }
                });
                view.setNotFoundSelected(notFoundSelection);
                vm.set('selection', selection.length ? selection : null);

                if (!advancedFilter.isAttributesFilterEmpty()) {
                    me.onCheckedOnlyToggle.call(me, grid, true, selection);
                }
            });
        }
    },

    /**
     * @param {CMDBuildUI.view.attachments.Grid} grid
     * @param {Ext.data.Model} record
     * @param {Number} rowIndex
     * @param {Number} colIndex
     */
    onActionViewObject: function (grid, record, rowIndex, colIndex) {
        var title, config;
        var vm = this.getViewModel();
        if (vm.get("objectType") === CMDBuildUI.util.helper.ModelHelper.objecttypes.klass || vm.get("objectType") === CMDBuildUI.util.helper.ModelHelper.objecttypes.process) {
            title = CMDBuildUI.util.helper.ModelHelper.getClassDescription(record.get("_type"));

            var xtype = vm.get("objectType") === CMDBuildUI.util.helper.ModelHelper.objecttypes.klass ? 'classes-cards-card-view' : 'processes-instances-instance-view';
            config = {
                xtype: xtype,
                viewModel: {
                    data: {
                        objectTypeName: record.get("_type"),
                        objectId: record.getId()
                    }
                },
                shownInPopup: true,
                hideTools: true
            };
        }
        CMDBuildUI.util.Utilities.openPopup(null, title, config);
    },

    /**
     * @param {CMDBuildUI.view.attachments.Grid} grid
     * @param {Ext.data.Model} record
     * @param {Number} rowIndex
     * @param {Number} colIndex
     */
    onActionEditObject: function (grid, record, rowIndex, colIndex) {
        var title, config, popup;
        var me = this;
        var vm = this.getViewModel();
        if (vm.get("objectType") === CMDBuildUI.util.helper.ModelHelper.objecttypes.klass) {
            title = CMDBuildUI.util.helper.ModelHelper.getClassDescription(record.get("_type"));
            config = {
                xtype: 'classes-cards-card-edit',
                viewModel: {
                    data: {
                        objectTypeName: record.get("_type"),
                        objectId: record.getId()
                    }
                },
                redirectAfterSave: false,
                buttons: [{
                    ui: 'management-action',
                    reference: 'savebtn',
                    itemId: 'savebtn',
                    text: CMDBuildUI.locales.Locales.common.actions.save,
                    autoEl: {
                        'data-testid': 'widgets-linkcards-save'
                    },
                    formBind: true,
                    localized: {
                        text: 'CMDBuildUI.locales.Locales.common.actions.save'
                    },
                    handler: function (btn, event) {
                        // disable button
                        btn.disable();
                        // save 
                        var panel = btn.lookupController();
                        panel.saveForm().then(function (record) {
                            popup.destroy();
                            grid.getStore().load();
                        }).otherwise(function () {
                            btn.enable();
                        });
                    }
                },
                {
                    text: CMDBuildUI.locales.Locales.common.actions.cancel,
                    reference: 'cancelbtn',
                    itemId: 'cancelbtn',
                    ui: 'secondary-action-small',
                    autoEl: {
                        'data-testid': 'widgets-linkcards-cancel'
                    },
                    localized: {
                        text: 'CMDBuildUI.locales.Locales.common.actions.cancel'
                    },
                    handler: function (btn, event) {
                        popup.destroy();

                    }
                }]
            };
        }
        popup = CMDBuildUI.util.Utilities.openPopup(null, title, config);
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
     * Filter grid items.
     * @param {Ext.form.field.Text} field
     * @param {Ext.form.trigger.Trigger} trigger
     * @param {Object} eOpts
     */
    onSearchSubmit: function (field, trigger, eOpts) {
        var vm = this.getViewModel();
        // get value
        var searchTerm = field.getValue();
        if (searchTerm) {
            // add filter
            var store = vm.get("gridrows");
            store.getAdvancedFilter().addQueryFilter(searchTerm);
            store.load();
        } else {
            this.onSearchClear(field);
        }
    },

    /**
     * @param {Ext.form.field.Text} field
     * @param {Ext.form.trigger.Trigger} trigger
     * @param {Object} eOpts
     */
    onSearchClear: function (field, trigger, eOpts) {
        var vm = this.getViewModel();
        // clear store filter
        var store = vm.get("gridrows");
        store.getAdvancedFilter().clearQueryFilter();
        store.load();
        // reset input
        field.reset();
    },

    /**
     * @param {Ext.form.field.Base} field
     * @param {Ext.event.Event} event
     */
    onSearchSpecialKey: function (field, event) {
        if (event.getKey() == event.ENTER) {
            this.onSearchSubmit(field);
        }
    },

    /**
     * @param {Ext.button.Button} button
     * @param {Boolean} pressed
     * @param {Object} eOpts
     */
    onCheckedOnlyToggleHandle: function (button, pressed, eOpts) {
        var view = this.getView();
        var grid = view.down('#grid');

        this.onCheckedOnlyToggle.call(this, grid, pressed);
    },

    onCheckedOnlyToggle: function (grid, pressed, selection) {
        var store = grid.getStore();
        var advancedFilter = store.getAdvancedFilter();
        advancedFilter.removeAttributeFitler('_id');

        selection = selection ? selection : grid.getView().getSelection();

        var notFoundSelected = this.getView().getNotFoundSelected();
        if (pressed) {
            var ids = [];
            Ext.Array.forEach(selection, function (item) {
                ids.push(item.getId());
            });

            Ext.Array.forEach(notFoundSelected, function (item, index, array) {
                ids.push(item._id);
            }, this);

            advancedFilter.addAttributeFilter(
                '_id',
                CMDBuildUI.model.base.Filter.operators.in,
                ids
            );
        }
        store.load();
    },

    privates: {
        _selectionTryCount: 0
    }
});