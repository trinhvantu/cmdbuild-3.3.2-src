Ext.define('CMDBuildUI.view.administration.components.attributesfilters.PanelController', {
    extend: 'CMDBuildUI.view.filters.attributes.PanelController',
    alias: 'controller.administration-filters-attributes-panel',
    control: {
        '#': {
            beforerender: 'onBeforeRender'
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
        this.callParent(arguments);
        var vm = this.getViewModel();
        view.setTitle(null);
        if (vm.get('actions.view')) {
            this.lookupReference('addattrfiltercontainer').hide();
        }
    },

    privates: {
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
            var view = this.getView();
            var vm = this.getViewModel();
            var isEditMode = !vm.get('actions.view');
            
            var isAdministrationModule = vm.get('isAdministrationModule');
            var fieldsetid = "attributecontainer-" + values.attribute;
            var fieldset = this.lookup(fieldsetid);
            var fieldsetui = isAdministrationModule ? 'administration-formpagination' : 'formpagination';
            var showLabels = false; //  isAdministrationModule ? true : false;
            if (!fieldset) {
                var attr = this.getViewModel().get("allfields")[values.attribute];
                fieldset = Ext.create("Ext.form.FieldSet", {
                    reference: fieldsetid,
                    title: attr.attributeconf.description_localized || attr.description,
                    ui: fieldsetui,
                    collapsible: false,
                    viewModel: {
                        data: {
                            fielsetid: fieldsetid
                        }
                    }
                });
                this.lookup('attributescontainer').add(fieldset);
                showLabels = true;

                view._fieldsetsreferences.push(fieldsetid);
            }

            // add the row to fieldset
            fieldset.add({
                xtype: 'administration-filters-attributes-row',
                allowInputParameter: view.getAllowInputParameter(),
                allowCurrentUser: view.getAllowCurrentUser(),
                allowCurrentGroup: view.getAllowCurrentGroup(),
                viewModel: {
                    data: {
                        showLabels: showLabels,
                        values: Ext.clone(values),
                        displayOnly: !isEditMode
                    }
                }
            });

        }
    }

});