Ext.define('CMDBuildUI.view.administration.content.dms.models.tabitems.properties.fieldsets.ContextMenusFieldsetController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.administration-content-dms-models-tabitems-properties-fieldsets-contextmenusfieldset',

    mixins: ['CMDBuildUI.view.administration.content.classes.tabitems.properties.fieldsets.SorterGridsMixin'],
    /**
     * 
     * @param {*} view 
     * @param {*} rowIndex 
     * @param {*} colIndex 
     */
    onAddNewContextMenuBtn: function (view, rowIndex, colIndex) {

        var vm = this.getViewModel();
        var contexstMenus = vm.get('theModel.contextMenuItems');
        var newContextMenuStore = vm.get('contextMenuItemsStoreNew');
        var newContextMenu = newContextMenuStore.getData().first();
        // label can't be blank
        if (!newContextMenu.get('label')) {
            view.down('#contextMenuLabel').markInvalid(CMDBuildUI.locales.Locales.administration.classes.properties.form.fieldsets.contextMenus.cantbeempty);
            return false;
        }
        // label should be unique
        if(contexstMenus && contexstMenus.findRecord('label', newContextMenu.get('label'))){
            view.down('#contextMenuLabel').markInvalid(CMDBuildUI.locales.Locales.administration.classes.properties.form.fieldsets.contextMenus.mustbeunique);
            return false;
        }

        Ext.suspendLayouts();
        contexstMenus.add(newContextMenu);
        vm.getParent().set('contextMenuCount', contexstMenus.data.length);
        newContextMenuStore.removeAt(rowIndex);
        var cleanRecord = CMDBuildUI.util.administration.helper.ModelHelper.setReadState(Ext.create('CMDBuildUI.model.ContextMenuItem', {
            script: ''
        }));
        newContextMenuStore.add(cleanRecord);
        
        view.refresh();
        this.lookupReference('contextMenuGrid').view.grid.getView().refresh();
        window.newContextMenuScriptField.getSession().setValue('');
        Ext.resumeLayouts();

    },
    onEditBtn: function (view, rowIndex, colIndex) {
        var vm = this.getViewModel();
        var grid = this.lookupReference('contextMenuGrid');
        var theContext = CMDBuildUI.util.administration.helper.ModelHelper.setReadState(grid.getStore().getAt(rowIndex));
        vm.set('theContext', theContext);

        var formFields = [{
            xtype: 'container',
            //flex: 2,
            padding: '0 10 0 10',
            viewModel: {
                data: {
                    contextMenuItemTypeStore: Ext.copy(vm.get('contextMenuItemTypeStore'))
                }
            },

            items: [{
                xtype: 'combobox',
                inputField: 'type',
                // width: '100%',
                style: "padding-top:0px",
                fieldLabel: CMDBuildUI.locales.Locales.administration.processes.properties.form.fieldsets.contextMenus.inputs.typeOrGuiCustom.label,
                localized: {
                    fieldLabel: 'text: CMDBuildUI.locales.Locales.administration.processes.properties.form.fieldsets.contextMenus.inputs.typeOrGuiCustom.label'
                },
                editable: false,
                labelAlign: 'top',
                forceSelection: true,
                allowBlank: false,
                displayField: 'label',
                valueField: 'value',
                // store: vm.get('contextMenuItemTypeStore'),
                bind: {
                    store: '{contextMenuItemTypeStore}',
                    value: '{theContext.type}'
                },
                listeners: {
                    select: function (ele, rec, idx) {
                        var isComponent = ele.getValue() === 'component';
                        this.lookupViewModel().set('theContext._isComponent', isComponent);
                    }
                }

            }, {
                xtype: 'combobox',
                inputField: 'componentId',
                labelAlign: 'top',
                fieldLabel: CMDBuildUI.locales.Locales.administration.processes.properties.form.fieldsets.contextMenus.inputs.typeOrGuiCustom.values.component.label,
                localized: {
                    fieldLabel: 'CMDBuildUI.locales.Locales.administration.processes.properties.form.fieldsets.contextMenus.inputs.typeOrGuiCustom.values.component.label'
                },
                editable: false,
                queryMode: 'local',
                forceSelection: true,
                allowBlank: false,
                displayField: 'description',
                valueField: 'name',
                hidden: true,
                store: vm.get('contextMenuComponentStore'),
                bind: {
                    value: '{theContext.componentId}',
                    hidden: '{!theContext._isComponent}'
                }
            }, {
                xtype: 'combobox',
                inputField: 'visibility',
                // width: '100%',
                labelAlign: 'top',
                editable: false,
                forceSelection: true,
                allowBlank: false,
                fieldLabel: CMDBuildUI.locales.Locales.administration.processes.fieldlabels.applicability, // Applicability
                localized: {
                    fieldLabel: 'CMDBuildUI.locales.Locales.administration.processes.fieldlabels.applicability'
                },
                displayField: 'label',
                valueField: 'value',
                value: view.grid.getStore().getAt(rowIndex).get('applicability'),
                store: vm.get('contextMenuApplicabilityStore'),
                bind: {
                    value: '{theContext.visibility}'
                }
            }, {
                /********************* Active **********************/
                xtype: 'checkbox',
                labelAlign: 'top',
                bind: '{theContext.active}',
                value: view.grid.getStore().getAt(rowIndex).get('active'),
                boxLabel: CMDBuildUI.locales.Locales.administration.common.labels.active, // Active
                localized: {
                    boxLabel: 'CMDBuildUI.locales.Locales.administration.common.labels.active'
                }
            }]
        }];

        var popup = CMDBuildUI.util.administration.helper.AcePopupHelper.getPopup('theContext', theContext, 'script', formFields, 'popup-edit-contextmenu', CMDBuildUI.locales.Locales.administration.classes.strings.editcontextmenu);
    }

});