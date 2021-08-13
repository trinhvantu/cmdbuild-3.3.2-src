Ext.define('CMDBuildUI.view.dms.attachment.Mixin', {
    mixinId: 'dms-mixin',

    mixins: ['CMDBuildUI.mixins.forms.FormTriggers'],

    config: {

        objectType: {
            $value: null,
            evented: true
        },
        objectTypeName: {
            $value: null,
            evented: true
        },
        objectId: {
            $value: null,
            evented: true
        },
        attachmentId: {
            $value: null,
            evented: true
        },
        theObject: {
            $value: null,
            evented: true
        },
        DMSCategoryTypeName: {
            $value: null,
            evented: true
        },
        DMSCategoryValue: {
            $value: null,
            evented: true
        },

        //calculated starting from DMSCategoryTypeName && DMSCategoryValue
        DMSModelClassName: {
            $value: null,
            evented: true
        },

        //calculated starting from DMSModelClassName
        DMSModelClass: {
            $value: null,
            evented: true
        },

        //calculated starting from DMSModelClassName
        DMSClass: {
            $value: null,
            evented: true
        },
        ignoreSchedules: false
    },

    /**
     * @property {String} formmode
     * Override this property in each form. 
     * Used in common functions to know form mode.
     */
    formmode: null,

    fieldDefaults: CMDBuildUI.util.helper.FormHelper.fieldDefaults,

    layout: {
        type: 'vbox',
        align: 'stretch' //stretch vertically to parent
    },

    /**
     * Add rules for fields visibility
     */
    addConditionalVisibilityRules: function (formReference) {
        var me = this;
        var fields = [];
        this.lookupReference(formReference).getForm().getFields().getRange().forEach(function (f) {
            if (f.updateFieldVisibility !== undefined) {
                // add field to list
                fields.push(f);
            }
        });

        this.getViewModel().bind({
            bindTo: '{' + me.getReference() + '.theObject}',
            deep: true
        }, function (theObject) {
            fields.forEach(function (f) {
                // apply visibility function
                Ext.callback(f.updateFieldVisibility, f, [theObject]);
            });
        });
    },

    /**
     * Add rules for fields visibility
     */
    addAutoValueRules: function (formReference) {
        var vm = this.lookupViewModel();
        this.lookupReference(formReference).getForm().getFields().getRange().forEach(function (f) {
            if (f.setValueFromAutoValue !== undefined) {
                vm.bind(f.getAutoValueBind(), function (data) {
                    f.setValueFromAutoValue();
                });
            }
        });
    },

    /**
     * Initialize before action form triggers.
     * 
     * @param {String} action 
     * @param {Object} base_api 
     */
    initBeforeActionFormTriggers: function (action, base_api) {
        var me = this;
        var vm = this.getViewModel();
        var model = me.getDMSModelClass();
        var item = CMDBuildUI.util.helper.ModelHelper.getDMSModelFromName(model.objectTypeName);
        if (item) {
            // get form triggers
            var triggers = item.getFormTriggersForAction(action);
            if (triggers && triggers.length) {
                // bind object creation
                vm.bind({
                    bindTo: {
                        theObject: '{' + me.getReference() + '.theObject}'
                    }
                }, function (data) {
                    var api = Ext.apply({
                        record: data.theObject
                    }, base_api);
                    me.executeFormTriggers(triggers, api);
                });
            }
        }
    },

    /**
     * Execute after action form triggers.
     * 
     * @param {String} action 
     * @param {CMDBuildUI.model.classes.Card} record
     * @param {Object} base_api 
     */
    executeAfterActionFormTriggers: function (action, record, base_api) {
        var me = this;
        var model = me.getDMSModelClass();
        var item = CMDBuildUI.util.helper.ModelHelper.getDMSModelFromName(model.objectTypeName);
        if (item) {
            // get form triggers
            var triggers = item.getFormTriggersForAction(action);
            if (triggers && triggers.length) {
                var api = Ext.apply({
                    record: record
                }, base_api);
                me.executeFormTriggers(triggers, api);
            }
        }
    },

    /**
     * 
     * @param {Object} base_api 
     * @return {Object}
     */
    getApiForTrigger: function (base_api) {
        base_api._attachmentOwner = {
            type: this.getObjectType(),
            typeName: this.getObjectTypeName(),
            id: this.getObjectId()
        }
        return base_api;
    },

    privates: {

        /**
         * 
         * @param {Object[]} items
         */
        getFormItems: function (items) {
            var me = this;

            // add notes fieldset
            items.push(me.getInlineNotesConfig());

            return {
                flex: 1,
                layout: {
                    type: 'hbox',
                    align: 'stretch' //stretch vertically to parent
                },
                height: "100%",
                items: [{
                    flex: 1,
                    scrollable: 'y',
                    items: [{
                        items: items
                    }]
                }, {
                    xtype: 'widgets-launchers',
                    formMode: me.formmode,
                    bind: {
                        widgets: '{' + me.getReference() + '.theObject.widgets}'
                    }
                }]
            };
        },

        /**
         * 
         * @param {Boolean} collapsed
         * @return {Object}
         */
        getInlineNotesConfig: function (collapsed) {
            var field;
            var bindvalue = '{' + this.getReference() + '.theObject.Notes}';
            var containerbind = {};
            var viewModel = null;
            var containerhidden = false;
            var collapsed = CMDBuildUI.util.helper.ModelHelper.getDMSModelFromName(this.getDMSModelClass().objectTypeName).get("noteInlineClosed");
            if (this.formmode === CMDBuildUI.util.helper.FormHelper.formmodes.read) {
                field = {
                    xtype: 'displayfield',
                    bind: {
                        value: bindvalue
                    }
                };
                containerbind = {
                    hidden: '{notesHidden}'
                };
                viewModel = {
                    data: {
                        notesHidden: true
                    },
                    formulas: {
                        notesHidden: {
                            bind: bindvalue,
                            get: function (value) {
                                return Ext.isEmpty(value);
                            }
                        }
                    }
                };
                containerhidden = true;
            } else {
                field = CMDBuildUI.util.helper.FieldsHelper.getHTMLEditor({
                    bind: {
                        value: bindvalue
                    }
                });
            }
            return {
                xtype: 'formpaginationfieldset',
                title: CMDBuildUI.locales.Locales.common.tabs.notes,
                padding: CMDBuildUI.util.helper.FormHelper.properties.padding,
                collapsed: collapsed,
                collapsible: true,
                hidden: containerhidden,
                items: [field],
                bind: containerbind,
                viewModel: viewModel ? viewModel : null
            };
        },

        /**
         * 
         * @param {String} DMSCategoryTypeName 
         * @param {Number} DMSCategoryValue 
         * @param {Ext.data.model} DMSModelClass 
         * @returns {[String]} The array of allowed extensions. 
         * @note Empty array means all extension are allowed
         */
        getAllowedExtensions: function (DMSCategoryTypeName, DMSCategoryValue, DMSModelClass) {

            var allowedExtensionsArray = []
            if (DMSCategoryTypeName && DMSCategoryValue && DMSModelClass) {
                var lk = CMDBuildUI.model.dms.DMSCategoryType.getCategoryTypeFromName(DMSCategoryTypeName);

                var lookupValuesStore = lk.values();
                //we suppose that the lookupValues for the lookupType are already loaded.
                //If not make this function asincronous or load lookupValues febore calling this function

                var lookupValue = lookupValuesStore.getById(DMSCategoryValue);
                if (lookupValue) {

                    allowedExtensions = lookupValue.get('allowedExtensions');

                    if (Ext.isEmpty(allowedExtensions)) {
                        var modelName = DMSModelClass.objectTypeName;
                        var DMSClass = CMDBuildUI.util.helper.ModelHelper.getDMSModelFromName(modelName);

                        allowedExtensions = DMSClass.get('allowedExtensions');

                        if (allowedExtensions == '*' || Ext.isEmpty(allowedExtensions)) {
                            return allowedExtensionsArray;
                        } else {
                            allowedExtensionsArray = allowedExtensions.split(',');
                            return allowedExtensionsArray;
                        }

                    } else if (allowedExtensions == '*') {
                        return allowedExtensionsArray;
                    } else {
                        allowedExtensionsArray = allowedExtensions.split(',');
                        return allowedExtensionsArray;
                    }

                } else {
                    CMDBuildUI.util.Notifier.showErrorMessage(Ext.String.format('DMS lookupValue {0} not found for DMS lookupType {1}', DMSCategoryTypeName, DMSCategoryValue));
                }
            }
        }
    }
});