Ext.define('CMDBuildUI.view.filters.attributes.PanelController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.filters-attributes-panel',

    control: {
        '#': {
            beforerender: 'onBeforeRender'
        },
        '#attributecombo': {
            change: 'onAttributeComboChange'
        },
        '#removebutton': {
            click: 'onRemoveButtonClick'
        }
    },

    /**
     * 
     * @param {CMDBuildUI.view.filters.attributes.Panel} view 
     * @param {Object} eOpts 
     */
    onBeforeRender: function (view, eOpts) {
        view._fieldsetsreferences = [];
        var me = this;
        var vm = this.getViewModel();
        var fields = {};
        var store = vm.get("attributeslist");

        CMDBuildUI.util.helper.ModelHelper.getModel(vm.get("objectType"), vm.get("objectTypeName")).then(function (model) {
            // multitenant field
            if (CMDBuildUI.util.helper.Configurations.get(CMDBuildUI.model.Configuration.multitenant.enabled)) {
                var objectdefinition = CMDBuildUI.util.helper.ModelHelper.getObjectFromName(model.objectTypeName, model.objectType);
                var multitenantMode = objectdefinition ? objectdefinition.get("multitenantMode") : null;
                if (
                    multitenantMode === CMDBuildUI.model.users.Tenant.tenantmodes.always ||
                    multitenantMode === CMDBuildUI.model.users.Tenant.tenantmodes.mixed
                ) {
                    store.add({
                        value: '_tenant',
                        label: CMDBuildUI.util.Utilities.getTenantLabel(),
                        group: ''
                    });
                    fields['_tenant'] = {
                        attributeconf: {
                            description_localized: CMDBuildUI.util.Utilities.getTenantLabel()
                        },
                        cmdbuildtype: CMDBuildUI.util.helper.ModelHelper.cmdbuildtypes.tenant
                    }
                }
            }

            // get model fields
            model.getFields().forEach(function (field) {
                if (!Ext.String.startsWith(field.name, "_") && !field.hidden) {
                    fields[field.name] = field;
                    store.addSorted(Ext.create("CMDBuildUI.model.base.ComboItem", {
                        value: field.name,
                        label: field.attributeconf.description_localized || field.description,
                        group: field.attributeconf._group_description_translation || field.attributeconf._group_description || CMDBuildUI.locales.Locales.common.attributes.nogroup
                    }));
                }
            });
            vm.set("allfields", fields);

            me._populateWithFilterData();
        });
    },

    /**
     * @param {Ext.button.Button} button 
     * @param {Event} e 
     * @param {Object} eOpts 
     */
    onRemoveButtonClick: function (button, e, eOpts) {
        // get fieldset
        var fielset = button.up("fieldset");
        var fieldsetid = fielset.getReference();
        // destroy row
        var parent = button.up("filters-attributes-row");
        parent.destroy();
        // first child
        var firstrow = fielset.child("filters-attributes-row");
        if (firstrow) {
            firstrow.getViewModel().set("showLabels", true);
        } else {
            fielset.destroy();
            Ext.Array.remove(this.getView()._fieldsetsreferences, fieldsetid);
        }
    },

    /**
     * 
     * @param {Ext.form.field.ComboBox} combo 
     * @param {String} newvalue 
     * @param {String} oldvalue 
     * @param {Object} eOpts 
     */
    onAttributeComboChange: function (combo, newvalue, oldvalue, eOpts) {
        if (!Ext.isEmpty(newvalue)) {
            this._addFilterRow({
                attribute: newvalue
            });
            combo.setValue();
        }
    },

    privates: {
        clearNewFilterRow: function () {
            this.lookup("newfiltercontainer").getViewModel().set("values.attribute", null);
        },

        /**
         * 
         * @param {Object} values
         * @param {String} values.attribute
         * @param {String} values.operator
         * @param {Boolean} values.typeinput
         * @param {*} values.value1
         * @param {*} values.value2
         */
        _addFilterRow: function (values) {
            // get attribute fieldset
            var fieldsetid = "attributecontainer-" + values.attribute;
            var fieldset = this.lookup(fieldsetid);
            var showLabels = false;
            if (!fieldset) {
                var attr = this.getViewModel().get("allfields")[values.attribute];
                fieldset = Ext.create("Ext.form.FieldSet", {
                    reference: fieldsetid,
                    title: attr.attributeconf.description_localized || attr.description,
                    ui: 'formpagination',
                    collapsible: false,
                    viewModel: {
                        data: {
                            fielsetid: fieldsetid
                        }
                    }
                });
                this.lookup('attributescontainer').add(fieldset);
                showLabels = true;

                this.getView()._fieldsetsreferences.push(fieldsetid);
            }
            // add the row to fieldset
            fieldset.add({
                xtype: 'filters-attributes-row',
                allowInputParameter: this.getView().getAllowInputParameter(),
                viewModel: {
                    data: {
                        showLabels: showLabels,
                        values: Ext.clone(values)
                    }
                }
            });
        },

        _populateWithFilterData: function () {
            var me = this;
            var filter = this.getViewModel().get("theFilter");
            var config = filter.get("configuration");

            function addFilterRow(v) {
                var vm = me.getViewModel();
                var _filter = {
                    attribute: v.attribute,
                    operator: v.operator,
                    typeinput: v.parameterType === CMDBuildUI.model.base.Filter.parametersypes.runtime,
                    value1: Ext.isArray(v.value) && v.value[0] || undefined,
                    value2: Ext.isArray(v.value) && v.value[1] || undefined
                };
                // set optional arguments if isReference && isUserOrGroup && areCurrentFieldsAllowed
                var isReference, isLookup, isUserOrGroup, areCurrentFieldsAllowed;
                try {
                    isReference = vm.get('allfields')[v.attribute].attributeconf.type === CMDBuildUI.util.helper.ModelHelper.cmdbuildtypes.reference;
                    isLookup = vm.get('allfields')[v.attribute].attributeconf.type === CMDBuildUI.util.helper.ModelHelper.cmdbuildtypes.lookup;
                    isUserOrGroup = ['Group', 'User'].indexOf(vm.get('allfields')[v.attribute].attributeconf.targetClass) > -1;
                    areCurrentFieldsAllowed = (me.getView().getAllowCurrentGroup() || me.getView().getAllowCurrentUser());
                } catch (error) {

                }

                if (isReference) {
                    if (isUserOrGroup && areCurrentFieldsAllowed) {
                        switch (_filter.value1) {
                            case CMDBuildUI.model.users.User.myuser:
                                _filter.currentUser = true;
                                _filter.value1 = null;
                                break;

                            case CMDBuildUI.model.users.User.mygroup:
                                _filter.currentGroup = true;
                                _filter.value1 = null;
                                break;
                        }
                    } else if (CMDBuildUI.model.base.Filter.isOperatorForRefernceOrLookupDescription(v.operator)) {
                        _filter.value1 = null;
                        _filter.referencetext = Ext.isArray(v.value) && v.value[0] || undefined;
                    }
                } else if (isLookup && CMDBuildUI.model.base.Filter.isOperatorForRefernceOrLookupDescription(v.operator)) {
                    _filter.value1 = null;
                    _filter.referencetext = Ext.isArray(v.value) && v.value[0] || undefined;
                }

                me._addFilterRow(_filter);
            }


            if (config && config.attribute) {
                CMDBuildUI.view.filters.Launcher.analyzeAttributeRecursive(config.attribute, addFilterRow);
            }
        }
    }
});