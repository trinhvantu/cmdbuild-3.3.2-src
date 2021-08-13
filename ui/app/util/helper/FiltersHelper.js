Ext.define('CMDBuildUI.util.helper.FiltersHelper', {
    singleton: true,

        /**
         * 
         * @param {Object[]} runtimeattrs 
         * @param {viewmodel.classes-cards-grid-container} viewmodel
         * @return {Ext.form.Field[]}
         */
        getFormForRuntimeAttributes: function (runtimeattrs, viewmodel) {
            var fields = [];
            var vm = viewmodel;
            var modelName = CMDBuildUI.util.helper.ModelHelper.getModelName(vm.get("objectType"), vm.get("objectTypeName"));
            var model = Ext.ClassManager.get(modelName);
            runtimeattrs.forEach(function (a) {
                var field = model.getField(a.attribute);
                var editor = CMDBuildUI.util.helper.FormHelper.getEditorForField(
                    field
                );

                editor.fieldLabel = Ext.String.format("{0} - {1}", field.attributeconf.description_localized, CMDBuildUI.model.base.Filter.getOperatorDescription(a.operator));
                editor._tempid = a._tempid;

                var container = {
                    xtype: 'fieldcontainer',
                    layout: 'anchor',
                    padding: CMDBuildUI.util.helper.FormHelper.properties.padding,
                    items: [editor]
                };

                if (a.operator === CMDBuildUI.model.base.Filter.operators.between) {
                    container.items.push(Ext.applyIf({
                        fieldLabel: '',
                        _tempid: a._tempid + '-v2'
                    }, editor));
                }
                fields.push(container);
            });
            return fields;
        },

        /**
         * 
         * @param {CMDBuild.model.base.Filter} filter
         * @param {viewmodel.classes-cards-grid-container} viewmodel
         */
        applyFilter: function (filter, viewmodel) {
            var deferred = new Ext.Deferred();
            // check runtime attributes
            var runtimeattrs = [];
            var objfilter = typeof(filter) == 'string' ? JSON.parse(filter) : filter;

            function checkRuntime(v) {
                if (v.parameterType === CMDBuildUI.model.base.Filter.parametersypes.runtime) {
                    v._tempid = Ext.String.format("{0}-{1}", v.attribute, Ext.String.leftPad(Ext.Number.randomInt(0, 9999), 4, '0'));
                    runtimeattrs.push(v);
                }
            }
            
            CMDBuildUI.view.filters.Launcher.analyzeAttributeRecursive(objfilter, checkRuntime);
            if (runtimeattrs.length > 0) {
                var popup;
                var form = {
                    xtype: 'form',
                    fieldDefaults: CMDBuildUI.util.helper.FormHelper.fieldDefaults,
                    scrollable: true,
                    items: this.getFormForRuntimeAttributes(runtimeattrs, viewmodel),
                    listeners: {
                        beforedestroy: function (form) {
                            form.removeAll(true);
                        }
                    },
                    buttons: [{
                        text: CMDBuildUI.locales.Locales.common.actions.apply,
                        ui: 'management-action-small',
                        localized: {
                            text: 'CMDBuildUI.locales.Locales.common.actions.apply'
                        },
                        handler: function (button, e) {
                            var fields = {};
                            var form = button.up("form");
                            form.getForm().getFields().getRange().forEach(function (f) {
                                fields[f._tempid] = f;
                            });

                            function updateRuntimeValues(f) {
                                if (f.parameterType === 'runtime') {
                                    f.value = [];
                                    var v = fields[f._tempid].getValue();
                                    if (v !== undefined) {
                                        f.value.push(v);
                                    }
                                    if (f.operator === CMDBuildUI.model.base.Filter.operators.between && fields[f._tempid + '-v2'].getValue()) {
                                        f.value.push(fields[f._tempid + '-v2'].getValue());
                                    }
                                    delete f._tempid;
                                }
                            }
                            CMDBuildUI.view.filters.Launcher.analyzeAttributeRecursive(objfilter, updateRuntimeValues);
                            deferred.resolve(objfilter, true);                           
                            popup.destroy();
                        }
                    }, {
                        text: CMDBuildUI.locales.Locales.common.actions.cancel,
                        ui: 'secondary-action-small',
                        localized: {
                            text: 'CMDBuildUI.locales.Locales.common.actions.cancel'
                        },
                        handler: function (button, e) {
                            popup.destroy();
                        }
                    }]
                };
                popup = CMDBuildUI.util.Utilities.openPopup(null, '', form, {}, {
                    width: '40%',
                    height: '40%'
                });
            } 
            else {
                deferred.resolve(objfilter, true);
            }

            return deferred.promise;
        }

});