Ext.define('CMDBuildUI.view.joinviews.configuration.items.FiltersController', {
    extend: 'CMDBuildUI.view.filters.attributes.PanelController',
    alias: 'controller.joinviews-configuration-items-filters',

    control: {
        '#': {
            beforerender: 'onBeforeRender'
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

        vm.bind({
            bindTo: {
                currentStep: '{currentStep}',
                allAttributesStore: '{allAttributesStore}'
            }
        }, function (data) {
            if (data.currentStep === 4) {
                var filter = Ext.create('CMDBuildUI.model.base.Filter', {
                    name: CMDBuildUI.locales.Locales.filters.newfilter,
                    description: CMDBuildUI.locales.Locales.filters.newfilter,
                    target: vm.get('theView.name'),
                    configuration: vm.get('theView.filter'),
                    shared: true

                });
                fields = {};                
                store.removeAll();
                data.allAttributesStore.each(function (attribute) {
                    if (!fields[attribute.get('expr')]) {
                        fields[attribute.get('expr')] = attribute.getData();

                        store.addSorted(Ext.create("CMDBuildUI.model.base.ComboItem", {
                            value: attribute.get('expr'),
                            label: attribute.get('_attributeDescription'),
                            group: attribute.get('targetAlias'),
                            attributeconf: attribute.get('attributeconf')
                        }));
                    }
                });

                view.down('#attributescontainer').removeAll();
                view._fieldsetsreferences = [];
                vm.set('theFilter', filter);
                vm.set("allfields", fields);
                me._populateWithFilterData();
            }
        });
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
            var fieldsetid = "attributecontainer-" + Ext.String.createVarName(values.attribute);
            var fieldset = this.lookup(fieldsetid);
            var showLabels = false;
            var attr = this.getViewModel().get("allfields")[values.attribute];
            if (!fieldset && attr) {
                fieldset = Ext.create("Ext.form.FieldSet", {
                    reference: fieldsetid,
                    title: attr.expr,
                    ui: 'formpagination',
                    collapsible: false,
                    viewModel: {
                        data: {
                            fieldsetid: fieldsetid
                        }
                    }
                });
                this.lookup('attributescontainer').add(fieldset);
                showLabels = true;

                this.getView()._fieldsetsreferences.push(fieldsetid);
            }
            // add the row to fieldset            
            if (fieldset) {
                fieldset.add({
                    xtype: 'filters-attributes-row',
                    allowInputParameter: false,
                    layout: 'hbox',
                    viewModel: {
                        data: {
                            showLabels: showLabels,
                            values: Ext.clone(values),
                            displayOnly: this.getView().lookupViewModel().get('actions.view')
                        }
                    }
                });
            }
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