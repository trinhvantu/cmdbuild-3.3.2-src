Ext.define('CMDBuildUI.view.relations.list.add.GridController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.relations-list-add-grid',

    control: {
        '#': {
            beforerender: 'onBeforeRender',
            beforeedit: 'onBeforeEdit',
            edit: 'onEdit',
            selectionchange: 'onSelectionChange'
        },
        '#addcardbtn': {
            beforerender: 'onAddCardBtnBeforeRender'
        },
        '#searchtextinput': {
            specialkey: 'onSearchSpecialKey'
        }, 
        '#refreshBtn' : {
            click: 'onRefreshBtnClick'
        }
    },

    /**
     * @param {CMDBuildUI.view.relations.list.add.Grid} view
     * @param {Object} eOpts
     */
    onBeforeRender: function (view) {
        var vm = this.getViewModel();
        
        if (vm.get("searchvalue")) {
            view.lookupReference("searchtextinput").focus();
        }

        // model name
        var modelname = CMDBuildUI.util.helper.ModelHelper.getModelName(
            vm.get("objectType"),
            vm.get("objectTypeName")
        );
        vm.set("storeinfo.modelname", modelname);

        // set autoload to true
        vm.set("storeinfo.autoload", true);
    },

    /**
     * @param {Ext.button.Button} button
     * @param {Object} eOpts
     */
    onAddCardBtnBeforeRender: function (button, eOpts) {
        var me = this;
        var vm = button.lookupViewModel();
        this.getView().updateAddButton(
            button,
            function(item, event, eOpts) {
                me.onAddCardBtnClick(item, event, eOpts);
            },
            vm.get("objectTypeName"),
            vm.get("objectType")
        );
    },

    /**
     * 
     * @param {Ext.menu.Item} item
     * @param {Ext.event.Event} event
     * @param {Object} eOpts
     */
    onAddCardBtnClick: function (item, event, eOpts) {
        var vm = this.getViewModel(), grid = this.getView();
        var title = Ext.String.format(
            "{0} {1}",
            CMDBuildUI.locales.Locales.classes.cards.addcard,
            vm.get("objectTypeDescription")
        );
        var popup = CMDBuildUI.util.Utilities.openPopup(null, title, {
            xtype: 'classes-cards-card-create',
            fireGlobalEventsAfterSave: false,
            viewModel: {
                data: {
                    objectTypeName: item.objectTypeName
                }
            },
            buttons: [{
                text: CMDBuildUI.locales.Locales.common.actions.save,
                formBind: true, //only enabled once the form is valid
                disabled: true,
                ui: 'management-action-small',
                autoEl: {
                    'data-testid': 'relations-list-add-grid-create-save'
                },
                localized: {
                    text: 'CMDBuildUI.locales.Locales.common.actions.save'
                },
                handler: function (button, e) {
                    var form = button.up("form");
                    if (form.isValid()) {
                        var object = form.getViewModel().get("theObject");
                        object.save({
                            success: function (record, operation) {
                                vm.get("records").getFilters().add({
                                    property: 'positionOf',
                                    value: record.getId()
                                });
                                grid.setSelection(record);
                                popup.destroy(true);
                            }
                        });
                    }
                }
            }, {
                text: CMDBuildUI.locales.Locales.common.actions.cancel,
                ui: 'secondary-action-small',
                autoEl: {
                    'data-testid': 'relations-list-add-grid-create-cancel'
                },
                localized: {
                    text: 'CMDBuildUI.locales.Locales.common.actions.cancel'
                },
                handler: function (button, e) {
                    popup.destroy(true);
                }
            }]
        });
    },

    /**
     * Filter grid items.
     * @param {Ext.form.field.Text} field
     * @param {Ext.form.trigger.Trigger} trigger
     * @param {Object} eOpts
     */
    onSearchSubmit: function (field, trigger, eOpts) {
        var vm = this.getViewModel();
        if (vm.get("searchvalue")) {
            // add filter
            var store = vm.get("records");
            store.getAdvancedFilter().addQueryFilter(vm.get("searchvalue"));
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
        var store = vm.get("records");
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
     * 
     * @param {Ext.button.Button} button 
     * @param {Ext.event.Event} event 
     * @param {Object} e 
     */
    onRefreshBtnClick: function(button, event, e) {
        this.getView().getStore().load();
    },

    /**
     * 
     * @param {Ext.grid.plugin.CellEditing} editor 
     * @param {Object} context 
     * @param {Object} eOpts 
     */
    onBeforeEdit: function (editor, context, eOpts) {
        if (
            context.column.getEditor() && (
                context.column.getEditor().getXType() === "referencecombofield" ||
                context.column.getEditor().getXType() === "lookupfield"
            )
        ) {
            context.column.getEditor()._ownerRecord = context.record;
        }
        // prevent edit if row is not selected
        return Ext.Array.contains(context.grid.getSelection(), context.record);
    },

    /**
     * 
     * @param {Ext.grid.plugin.CellEditing} editor 
     * @param {Object} context 
     */
    onEdit: function(editor, context) {
        var cell = context.view.getCellByPosition({
            view: context.view,
            row: context.row,
            column: context.column
        });
        if (context.column.mandatory && Ext.isEmpty(context.record.get(context.column.dataIndex))) {
            cell.addCls(CMDBuildUI.view.relations.list.add.Grid.errorcls);
        } else {
            cell.removeCls(CMDBuildUI.view.relations.list.add.Grid.errorcls);
        }
        this.validateRelAttribtues();
    },

    /**
     * 
     * @param {CMDBuildUI.view.relations.list.add.Grid} grid 
     * @param {Ext.data.Model[]} selection 
     * @param {Object} eOpts 
     */
    onSelectionChange: function(selmode, selection, eOpts) {
        var view = this.getView(),
            prevsel = Ext.Array.from(this._prevselection),
            added = Ext.Array.difference(selection, prevsel),
            removed = Ext.Array.difference(prevsel, selection);

        view.getRelationAttributes().forEach(function(relattr) {
            if (relattr.mandatory) {
                // get column position
                var column = view.getVisibleColumns().find(function(c) {
                    return c.dataIndex == relattr.name
                });
                var colposition = column.getVisibleIndex();

                // add error class
                added.forEach(function(r) {
                    if (Ext.isEmpty(r.get(relattr.name))) {
                        var position = selmode.view.getPosition(r, colposition);
                        var cell = selmode.view.getCellByPosition(position);
                        cell.addCls(CMDBuildUI.view.relations.list.add.Grid.errorcls);
                    }
                });
                // remove error class
                removed.forEach(function(r) {
                    var position = selmode.view.getPosition(r, colposition);
                    var cell = selmode.view.getCellByPosition(position);
                    cell.removeCls(CMDBuildUI.view.relations.list.add.Grid.errorcls);
                });
            }
        });
        this.validateRelAttribtues();
        this._prevselection = selection;
    },

    privates: {
        validateRelAttribtues: function() {
            var isValid = true,
                view = this.getView();

            view.getRelationAttributes().forEach(function(relattr) {
                // update validation to enable / disable button
                view.getSelection().forEach(function(r) {
                    if (relattr.mandatory && Ext.isEmpty(r.get(relattr.name))) {
                        isValid = false;
                    }
                });
            })

            view.lookupViewModel().set("valid.attrs", isValid);
        }
    }
});
