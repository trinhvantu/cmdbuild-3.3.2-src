Ext.define('CMDBuildUI.util.helper.FormHelper', {
    singleton: true,

    formmodes: {
        create: 'create',
        update: 'update',
        read: 'read'
    },

    fieldmodes: {
        hidden: 'hidden',
        immutable: 'immutable',
        read: 'read',
        write: 'write'
    },

    formtriggeractions: {
        afterInsert: 'afterInsert',
        afterInsertExecute: 'afterInsertExecute',
        beforeInsert: 'beforeInsert',
        afterEdit: 'afterEdit',
        afterEditExecute: 'afterEditExecute',
        beforeEdit: 'beforeEdit',
        afterClone: 'afterClone',
        beforeClone: 'beforeClone',
        afterDelete: 'afterDelete'
    },

    properties: {
        padding: '0 15 0 15'
    },
    fieldDefaults: {
        labelAlign: 'top',
        labelPad: 2,
        labelSeparator: '',
        anchor: '100%'
    },

    /**
     * @param {String} fieldname
     * @return {String} The store id
     * @private
     */
    getStoreId: function (fieldname) {
        return fieldname + "Store";
    },

    /**
     * Get form fields
     * @param {Ext.data.Model} model
     * @param {Object} config
     * @param {Boolean} config.mode
     * @param {Object[]} config.defaultValues An array of objects containing default values.
     * @param {String} config.linkName The name of the object linked within the ViewModel.
     * @param {String} config.activityLinkName
     * @param {Boolean} config.ignoreSchedules When true doesn't handle schedules generation for date field with 'schedules rule definition' (triggers) associated
     * @param {Object} config.attributesOverrides An object containing properties to override for attributes
     * @param {Boolean} config.attributesOverrides.attributename.writable Override writable property
     * @param {Boolean} config.attributesOverrides.attributename.mandatory Override mandatory property
     * @param {Boolean} config.attributesOverrides.attributename.hidden Override writable property
     * @param {Numeric} config.attributesOverrides.attributename.index Override index property
     * @return {Object[]} the list of form fields
     */
    getFormFields: function (model, config) {
        var items = [];
        config = config || {};
        var me = this;

        // set default configuration
        Ext.applyIf(config, {
            readonly: false,
            attributesOverrides: {},
            mode: config.readonly ? this.formmodes.read : this.formmodes.update
        });

        Ext.Array.each(model.getFields(), function (modelField, index) {
            var field = Ext.apply({}, modelField);
            if (!Ext.String.startsWith(field.name, "_")) {
                var defaultValue;
                // check and use default values
                if (!Ext.isEmpty(config.defaultValues)) {
                    defaultValue = Ext.Array.findBy(config.defaultValues, function (item, index) {
                        if (item.value) {
                            if (field.cmdbuildtype.toLowerCase() === CMDBuildUI.util.helper.ModelHelper.cmdbuildtypes.reference.toLowerCase()) {
                                return (item.attribute && item.attribute === field.attributename) ||
                                    (item.domain && item.domain === field.attributeconf.domain);
                            } else {
                                return item.attribute && item.attribute === field.attributename;
                            }
                        }
                    });
                }

                var overrides = config.attributesOverrides[field.name];
                if (overrides) {
                    if (!Ext.isEmpty(overrides.index)) {
                        field.attributeconf.index = overrides.index;
                    }
                    if (!Ext.isEmpty(overrides.mandatory)) {
                        field.mandatory = overrides.mandatory;
                    }
                    if (!Ext.isEmpty(overrides.writable)) {
                        field.writable = overrides.writable;
                    }
                    if (!Ext.isEmpty(overrides.hidden)) {
                        field.hidden = overrides.hidden;
                    }
                }

                var formfield = me.getFormField(field, {
                    mode: config.mode,
                    defaultValue: defaultValue,
                    linkName: config.linkName,
                    activityLinkName: config.activityLinkName,
                    filterLinkName: config.filterLinkName,
                    ignoreUpdateVisibilityToField: config.ignoreUpdateVisibilityToField,
                    ignoreCustomValidator: config.ignoreCustomValidator,
                    ignoreAutovalue: config.ignoreAutovalue,
                    ignoreSchedules: config.ignoreSchedules
                });

                items.push(formfield);
            }
        });

        // sort attributes on index property
        return items.sort(function (a, b) {
            return a.metadata.index - b.metadata.index;
        });
    },

    /**
     * Get form fields
     * 
     * @param {Ext.data.field.Field} field
     * @param {String} config.mode One of `read`, `create` or `update`.
     * @param {Object} config.defaultValue An object containing default value.
     * @param {String} config.linkName The name of the object linked within the ViewModel.
     * @param {String} activityLinkName
     * @param {String} config.filterLinkName The name of the object linked within the ViewModel, used for ecql filters.
     * @param {String} config.ignoreUpdateVisibilityToField Configuration used to ignore showifs on grid filters.
     * @param {String} config.ignoreCustomValidator Configuration used to ignore customValidators on grid filters.
     * @param {String} config.ignoreAutovalue Configuration used to ignore autoValues on grid filters.
     * @param {Boolead} config.ignoreSchedules When true doesn't handle schedules generation for date field with 'schedules rule definition' (triggers) associated
     * @return {Object} An `Ext.form.field.Field` definition.
     */
    getFormField: function (field, config) {
        var fieldsettings;

        config = Ext.applyIf(config, {
            linkName: this._default_link_name,
            ignoreUpdateVisibilityToField: this._default_ignoreUpdateVisibilityToField,
            ignoreCustomValidator: this._default_ignoreCustomValidator,
            ignoreAutovalue: this._default_ignoreAutovalue,
            ignoreSchedules: this._default_ignoreSchedules,
            mode: this.formmodes.read
        });

        // append asterisk to label for mandatory fields
        var label = field.isInstance? field.getDescription() : field.attributeconf._description_translation || field.description;;

        var bind = {};
        if (config.linkName) {
            bind = {
                value: Ext.String.format('{{0}.{1}}', config.linkName, field.name)
            };
        }

        // base field information
        var formfield = {
            fieldLabel: label,
            labelPad: CMDBuildUI.util.helper.FormHelper.properties.labelPad,
            labelSeparator: CMDBuildUI.util.helper.FormHelper.properties.labelSeparator,
            name: field.name,
            hidden: field.hidden,
            anchor: '100%',
            metadata: field.attributeconf,
            formmode: config.mode,
            bind: bind
        };

        if (config.defaultValue) {
            // add listener to set value when field is added to form
            // to apdate theObject within viewmodel.
            formfield.listeners = {
                beforerender: function (f) {
                    var vm = f.lookupViewModel(true); // get form view model
                    if (config.linkName) {
                        vm.set(config.linkName + "." + field.name, config.defaultValue.value);
                    } else {
                        f.setValue(config.defaultValue.value);
                    }
                    if (config.defaultValue.valuedescription) {
                        vm.get(config.linkName).set(
                            Ext.String.format("_{0}_description", field.name),
                            config.defaultValue.valuedescription
                        );
                    }
                }
            };
            if (!Ext.isEmpty(config.defaultValue.editable)) {
                field.writable = config.defaultValue.editable;
            }
        }

        // Add help tooltip
        if (config.mode !== this.formmodes.read && field.attributeconf && field.attributeconf.help) {
            var converter = new showdown.Converter();
            var help = converter.makeHtml(field.attributeconf.help);
            formfield.labelToolIconQtip = help;
            formfield.labelToolIconCls = 'fa-question-circle';
        }

        if (
            config.mode !== this.formmodes.read &&
            (field.writable) &&
            (field.mode != this.fieldmodes.immutable || config.mode === this.formmodes.create)
        ) {
            fieldsettings = this.getEditorForField(
                field, {
                linkName: config.linkName,
                activityLinkName: config.activityLinkName,
                filterLinkName: config.filterLinkName,
                formmode: config.mode,
                ignoreSchedules: config.ignoreSchedules
            }
            );
        }

        if (!fieldsettings) {
            fieldsettings = this.getReadOnlyField(field, config.linkName, config.mode, config.activityLinkName);
        }

        // override mandatory behaviour
        if (field.mandatory && !field.hidden) {
            fieldsettings.allowBlank = false;
        }
        Ext.merge(formfield, fieldsettings);

        return formfield;
    },

    /**
     * Returns the editor definition for given field
     * @param {Ext.data.field.Field} field
     * @param {Object} config
     * @param {String} config.linkName
     * @param {String} config.activityLinkName
     * @param {String} config.ignoreUpdateVisibilityToField Configuration used to ignore showifs on grid filters.
     * @param {String} config.ignoreCustomValidator Configuration used to ignore customValidators on grid filters.
     * @param {String} config.ignoreAutovalue Configuration used to ignore autoValues on grid filters.
     * @param {String} config.formmode One of `read`, `create` or `update`.
     * @param {Boolean} config.ignoreSchedules
     * @return {Object}
     */
    getEditorForField: function (field, config) {
        var editor;
        config = config || {};

        config = Ext.applyIf(config, {
            linkName: this._default_link_name,
            ignoreUpdateVisibilityToField: this._default_ignoreUpdateVisibilityToField,
            ignoreCustomValidator: this._default_ignoreCustomValidator,
            ignoreAutovalue: this._default_ignoreAutovalue,
            ignoreSchedules: this._default_ignoreSchedules
        });

        // field configuration
        switch (field.cmdbuildtype.toLowerCase()) {
            /**
             * Boolean field
             */
            case CMDBuildUI.util.helper.ModelHelper.cmdbuildtypes.boolean.toLowerCase():
                editor = {
                    xtype: 'threestatecheckboxfield'
                };
                break;
            /** 
             * Date fields
             */
            case CMDBuildUI.util.helper.ModelHelper.cmdbuildtypes.date.toLowerCase():
                var datextype = 'datefield';
                if (CMDBuildUI.util.helper.Configurations.get(CMDBuildUI.model.Configuration.scheduler.enabled) && field.attributeconf.calendarTriggers && field.attributeconf.calendarTriggers.length && config.ignoreSchedules == false) {
                    datextype = 'schedulerdatefield';
                }
                editor = {
                    xtype: datextype,
                    format: CMDBuildUI.util.helper.UserPreferences.getDateFormat(),
                    formatText: '',
                    altFormats: '',
                    recordLinkName: config.linkName,
                    listeners: {
                        drop: {
                            element: 'el', //bind to the underlying el property on the panel
                            fn: function () {
                                var view = Ext.getCmp(this.id);
                                view.inputEl.focus();
                            }
                        },
                        change: function (field, newvalue, oldvalue) {
                            if (Ext.isDate(newvalue) && field.getBind() && field.getBind().value) {
                                field.getBind().value.setValue(newvalue);
                            }
                        }
                    }
                };
                break;
            case CMDBuildUI.util.helper.ModelHelper.cmdbuildtypes.datetime.toLowerCase():
                var format = field.attributeconf.showSeconds ?
                    CMDBuildUI.util.helper.UserPreferences.getTimestampWithSecondsFormat() :
                    CMDBuildUI.util.helper.UserPreferences.getTimestampWithoutSecondsFormat();
                editor = {
                    xtype: 'datefield',
                    format: format,
                    formatText: '',
                    altFormats: '',
                    listeners: {
                        expand: function (datefield, eOpts) {
                            var todayBtn = datefield.getPicker().todayBtn;
                            todayBtn.on('click', function () {
                                var picker = datefield.getPicker(),
                                    today = new Date(),
                                    selectToday = function () {
                                        datefield.setValue(today);
                                        datefield.focus();
                                        this.hide();
                                    };
                                this.setHandler(selectToday, picker);
                            });
                        },
                        change: function (field, newvalue, oldvalue) {
                            if (Ext.isDate(newvalue) && field.getBind() && field.getBind().value) {
                                field.getBind().value.setValue(newvalue);
                            }
                        }
                    }
                };
                break;
            case CMDBuildUI.util.helper.ModelHelper.cmdbuildtypes.time.toLowerCase():
                editor = {
                    xtype: 'textfield',
                    vtype: 'time',
                    listeners: {
                        blur: function (field, event, eOpts) {
                            // add left pad to numbers
                            var v = field.getValue();
                            if (v) {
                                var nv = [];
                                v.split(":").forEach(function (n) {
                                    nv.push(n.length === 1 ? "0" + n : n);
                                });
                                field.setValue(nv.join(":"));
                            }
                        }
                    }
                };
                break;
            /**
             * IP field
             */
            case CMDBuildUI.util.helper.ModelHelper.cmdbuildtypes.ipaddress.toLowerCase():
                var vtype;
                if (field.attributeconf.ipType === "ipv4") {
                    vtype = "IPv4Address";
                } else if (field.attributeconf.ipType === "ipv6") {
                    vtype = "IPv6Address";
                } else {
                    vtype = "IPAddress";
                }
                editor = {
                    xtype: 'textfield',
                    vtype: vtype
                };
                break;
            /**
             * Numeric fields
             */
            case CMDBuildUI.util.helper.ModelHelper.cmdbuildtypes.decimal.toLowerCase():
                var maxvalue = Math.pow(10, (field.attributeconf.precision - field.attributeconf.scale));
                editor = {
                    xtype: 'numberfield',
                    mouseWheelEnabled: false,
                    hideTrigger: true,
                    keyNavEnabled: false,
                    mouseWhellEnabled: false,
                    decimalPrecision: field.attributeconf.scale,
                    decimalSeparator: CMDBuildUI.util.helper.UserPreferences.getDecimalsSeparator(),
                    validator: function (v) {
                        if (Ext.isEmpty(v)) {
                            return true;
                        }
                        v = parseFloat(v);
                        if (!(v < maxvalue && v > -maxvalue)) {
                            return false;
                        }
                        return true;
                    }
                };

                //if the unitOfMesure is set
                if (field.attributeconf.unitOfMeasure) {
                    Ext.apply(editor, this.getNumberOfMesureConfigs(field.attributeconf.unitOfMeasure))
                }
                break;
            case CMDBuildUI.util.helper.ModelHelper.cmdbuildtypes.double.toLowerCase():
                editor = {
                    xtype: 'numberfield',
                    mouseWheelEnabled: false,
                    hideTrigger: true,
                    keyNavEnabled: false,
                    mouseWhellEnabled: false,
                    decimalPrecision: 20,
                    decimalSeparator: CMDBuildUI.util.helper.UserPreferences.getDecimalsSeparator()
                };

                //if the unitOfMesure is set
                if (field.attributeconf.unitOfMeasure) {
                    Ext.apply(editor, this.getNumberOfMesureConfigs(field.attributeconf.unitOfMeasure))
                }
                break;
            case CMDBuildUI.util.helper.ModelHelper.cmdbuildtypes.integer.toLowerCase():
                editor = {
                    xtype: 'numberfield',
                    mouseWheelEnabled: false,
                    hideTrigger: true,
                    allowDecimals: false,
                    maxValue: 2147483647, // Integer max value
                    minValue: -2147483648 // Integer min value
                };

                //if the unitOfMesure is set
                if (field.attributeconf.unitOfMeasure) {
                    Ext.apply(editor, this.getNumberOfMesureConfigs(field.attributeconf.unitOfMeasure))
                }
                break;
            /**
             * Relation fields
             */
            case CMDBuildUI.util.helper.ModelHelper.cmdbuildtypes.lookup.toLowerCase():
                editor = {
                    xtype: 'lookupfield',
                    recordLinkName: config.linkName,
                    lookupIdField: field.attributeconf.lookupIdField
                };
                break;
            case CMDBuildUI.util.helper.ModelHelper.cmdbuildtypes.reference.toLowerCase():
                if (CMDBuildUI.util.helper.ModelHelper.getObjectFromName(field.attributeconf.targetClass, field.attributeconf.targetType)) {
                    editor = {
                        xtype: 'referencefield',
                        recordLinkName: config.linkName,
                        filterRecordLinkName: config.filterLinkName
                    };
                }
                break;
            case CMDBuildUI.util.helper.ModelHelper.cmdbuildtypes.foreignkey.toLowerCase():
                editor = {
                    xtype: 'referencefield',
                    recordLinkName: config.linkName
                };
                break;
            /**
             * Text fields
             */
            case CMDBuildUI.util.helper.ModelHelper.cmdbuildtypes.char.toLowerCase():
                editor = {
                    xtype: 'textfield',
                    enforceMaxLength: true,
                    maxLength: 1
                };
                break;
            case CMDBuildUI.util.helper.ModelHelper.cmdbuildtypes.string.toLowerCase():
                editor = {
                    xtype: 'textfield',
                    enforceMaxLength: true,
                    maxLength: field.attributeconf.maxLength
                };
                break;
            case CMDBuildUI.util.helper.ModelHelper.cmdbuildtypes.text.toLowerCase():
                if (field.attributeconf.editorType === "HTML") {
                    editor = CMDBuildUI.util.helper.FieldsHelper.getHTMLEditor();
                } else {
                    editor = {
                        xtype: 'textareafield',
                        resizable: {
                            handles: 's'
                        }
                    };
                }
                break;
            default:
                CMDBuildUI.util.Logger.log("Missing field for " + field.name, CMDBuildUI.util.Logger.levels.warn);
                break;
        }

        // append metadata to editor configuration
        if (Ext.isObject(editor) && !Ext.Object.isEmpty(editor)) {
            editor.metadata = field.attributeconf;

            // add updateVisibility function
            if (!config.ignoreUpdateVisibilityToField) {
                this.addUpdateVisibilityToField(editor, field.attributeconf, config.linkname, config.formmode, config.activityLinkName);
            }

            // add custom validator
            if (!config.ignoreCustomValidator) {
                this.addCustomValidator(editor, field.attributeconf, config.linkName, config.formmode, config.activityLinkName);
            }

            // add auto value
            if (!config.ignoreAutoValue) {
                this.addAutoValue(editor, field.attributeconf, config.linkName, config.formmode, config.activityLinkName);
            }
        }

        return editor;
    },

    /**
     * 
     * @param {Ext.data.field.Field} field
     * @param {String} linkName 
     * @param {String} activityLinkName
     * @param {String} formmode One of `read`, `create` or `update`.
     * @return {Object}
     */
    getReadOnlyField: function (field, linkName, formmode, activityLinkName) {
        // setup readonly fields
        var fieldsettings = {
            xtype: 'displayfield'
        };

        switch (field.cmdbuildtype.toLowerCase()) {
            /**
             * Boolean field
             */
            case CMDBuildUI.util.helper.ModelHelper.cmdbuildtypes.boolean.toLowerCase():
                fieldsettings.renderer = function (value, f) {
                    return CMDBuildUI.util.helper.FieldsHelper.renderThreeStateBooleanField(value);
                };
                break;
            /**
             * Date fields
             */
            case CMDBuildUI.util.helper.ModelHelper.cmdbuildtypes.date.toLowerCase():
                fieldsettings.renderer = function (value, f) {
                    return CMDBuildUI.util.helper.FieldsHelper.renderDateField(value);
                };
                break;
            case CMDBuildUI.util.helper.ModelHelper.cmdbuildtypes.datetime.toLowerCase():
                fieldsettings.renderer = function (value, f) {
                    return CMDBuildUI.util.helper.FieldsHelper.renderTimestampField(value, {
                        hideSeconds: !f.metadata.showSeconds
                    });
                };
                break;
            case CMDBuildUI.util.helper.ModelHelper.cmdbuildtypes.time.toLowerCase():
                fieldsettings.renderer = function (value, f) {
                    return CMDBuildUI.util.helper.FieldsHelper.renderTimeField(value, {
                        hideSeconds: !f.metadata.showSeconds
                    });
                };
                break;
            /**
             * Numeric fields
             */
            case CMDBuildUI.util.helper.ModelHelper.cmdbuildtypes.decimal.toLowerCase():
                fieldsettings.renderer = function (value, f) {
                    return CMDBuildUI.util.helper.FieldsHelper.renderDecimalField(value, {
                        scale: f.metadata.scale,
                        showThousandsSeparator: f.metadata.showThousandsSeparator,
                        unitOfMeasure: f.metadata.unitOfMeasure,
                        unitOfMeasureLocation: f.metadata.unitOfMeasureLocation
                    });
                };
                break;
            case CMDBuildUI.util.helper.ModelHelper.cmdbuildtypes.double.toLowerCase():
                fieldsettings.renderer = function (value, f) {
                    return CMDBuildUI.util.helper.FieldsHelper.renderDoubleField(value, {
                        visibleDecimals: f.metadata.visibleDecimals,
                        showThousandsSeparator: f.metadata.showThousandsSeparator,
                        unitOfMeasure: f.metadata.unitOfMeasure,
                        unitOfMeasureLocation: f.metadata.unitOfMeasureLocation
                    });
                };
                break;
            case CMDBuildUI.util.helper.ModelHelper.cmdbuildtypes.integer.toLowerCase():
                fieldsettings.renderer = function (value, f) {
                    return CMDBuildUI.util.helper.FieldsHelper.renderIntegerField(value, {
                        showThousandsSeparator: f.metadata.showThousandsSeparator,
                        unitOfMeasure: f.metadata.unitOfMeasure,
                        unitOfMeasureLocation: f.metadata.unitOfMeasureLocation
                    });
                };
                break;
            /**
             * Relation fields
             */
            case CMDBuildUI.util.helper.ModelHelper.cmdbuildtypes.lookup.toLowerCase():
                CMDBuildUI.model.lookups.LookupType.loadLookupValues(field.attributeconf.lookupType);
                fieldsettings.renderer = function (value, f) {
                    var record;
                    if (linkName) {
                        var vm = f.lookupViewModel();
                        record = vm.get(linkName);
                    }
                    return CMDBuildUI.util.helper.FieldsHelper.renderLookupField(value, {
                        lookupIdField: field.attributeconf.lookupIdField,
                        lookupType: field.attributeconf.lookupType,
                        fieldName: field.name,
                        record: record
                    });
                };
                break;
            case CMDBuildUI.util.helper.ModelHelper.cmdbuildtypes.reference.toLowerCase():
            case CMDBuildUI.util.helper.ModelHelper.cmdbuildtypes.foreignkey.toLowerCase():
                if (linkName) {
                    fieldsettings.bind = {
                        value: Ext.String.format('{{0}._{1}_description}', linkName, field.name)
                    };
                }
                fieldsettings.renderer = function (value, f) {
                    var record;
                    if (linkName) {
                        record = f.lookupViewModel().get(linkName);
                    }
                    return CMDBuildUI.util.helper.FieldsHelper.renderReferenceField(value, {
                        fieldName: field.name,
                        isHtml: field.attributeconf._html,
                        targetType: field.attributeconf.targetType,
                        targetTypeName: field.attributeconf.targetClass,
                        record: record
                    });
                };
                break;
        }

        switch (field.cmdbuildtype.toLowerCase()) {
            case CMDBuildUI.util.helper.ModelHelper.cmdbuildtypes.reference.toLowerCase():
            case CMDBuildUI.util.helper.ModelHelper.cmdbuildtypes.foreignkey.toLowerCase():
            case CMDBuildUI.util.helper.ModelHelper.cmdbuildtypes.text.toLowerCase():
            case CMDBuildUI.util.helper.ModelHelper.cmdbuildtypes.string.toLowerCase():
                var isHtml = field.attributeconf._html;
                fieldsettings.renderer = function (value, field) {
                    var record = field.lookupViewModel().get(linkName);
                    return CMDBuildUI.util.helper.FieldsHelper.renderTextField(value, {
                        html: isHtml,
                        record: record,
                        fieldname: field.name
                    });
                };
                // add new rules for HTML
                if (isHtml) {
                    // add listener to open links in new tab
                    fieldsettings.listeners = {
                        afterRender: function (field) {
                            field.getEl().on('click', function (me) {
                                if (me.getTarget()) {
                                    var linkTarget = me.getTarget().tagName.toLowerCase();
                                    var linkOrigin = me.getTarget().origin;
                                    if (linkTarget == 'a' && linkOrigin !== window.location.origin) {
                                        me.getTarget().setAttribute("target", '_blank');
                                    }
                                    return false;
                                }
                            });
                        }
                    };
                }
        }

        // add updateVisibility function
        this.addUpdateVisibilityToField(fieldsettings, field.attributeconf, linkName, formmode, activityLinkName);

        // add auto value
        this.addAutoValue(fieldsettings, field.attributeconf, linkName, formmode, activityLinkName);

        return fieldsettings;
    },

    /**
     * Returns store definition for LookUp store.
     * @param {String} type
     * @return {Object} Ext.data.Store definition
     */
    getLookupStore: function (type) {
        return {
            model: 'CMDBuildUI.model.lookups.Lookup',
            proxy: {
                url: CMDBuildUI.util.api.Lookups.getLookupValues(type),
                type: 'baseproxy'
            },
            autoLoad: true
        };
    },

    /**
     * Returns store definition for Reference store.
     * @param {String} type Target type.
     * @param {String} name Target name.
     * @return {Object} Ext.data.Store definition
     */
    getReferenceStore: function (type, name) {
        if (type === 'class') {
            return {
                model: 'CMDBuildUI.model.domains.Reference',
                proxy: {
                    url: '/classes/' + name + '/cards/',
                    type: 'baseproxy'
                },
                autoLoad: true
            };
        }
    },

    /**
     * Return the base form for given model
     * @param {Ext.Model} model
     * @param {Object} config
     * @param {Boolean} config.mode Default value is true.
     * @param {Object[]} config.defaultValues An array of objects containing default values.
     * @param {String} config.linkName The name of the object linked within the ViewModel.
     * @param {String} config.activityLinkName the name of the object linked within viewModel for the activity
     * @param {String} config.ignoreUpdateVisibilityToField Configuration used to ignore showifs on grid filters.
     * @param {String} config.ignoreCustomValidator Configuration used to ignore customValidators on grid filters.
     * @param {String} config.ignoreAutovalue Configuration used to ignore autoValues on grid filters.
     * @param {Boolean} config.showNotes Show notes as new tab.
     * @param {Boolean} config.showAsFieldsets Set to true for display fieldsets instead of tabs.
     * @param {Object} config.attributesOverrides An object containing properties to override for attributes
     * @param {Boolean} config.attributesOverrides.attributename.writable Override writable property
     * @param {Boolean} config.attributesOverrides.attributename.mandatory Override mandatory property
     * @param {Numeric} config.attributesOverrides.attributename.index
     * @param {String[]} config.visibleAttributes An array containing the names of visible attributes
     * @param {Object} config.layout Layout for form
     * @param {Boolean} config.ignoreSchedules When true doesn't handle schedules generation for date field with 'schedules rule definition' (triggers) associated
     * @param {CMDBuildUI.model.AttributeGrouping[]} config.grouping An array which define the attributes grouping
     * @return {CMDBuildUI.components.tab.FormPanel|CMDBuildUI.components.tab.FieldSet[]}
     */
    renderForm: function (model, config) {
        // set default configuration
        Ext.applyIf(config || {}, {
            readonly: true,
            defaultValues: [],
            linkName: this._default_link_name,
            ignoreUpdateVisibilityToField: this._default_ignoreUpdateVisibilityToField,
            ignoreCustomValidator: this._default_ignoreCustomValidator,
            ignoreAutovalue: this._default_ignoreAutovalue,
            ignoreSchedules: this._default_ignoreSchedules,
            showNotes: false,
            showAsFieldsets: false,
            attributesOverrides: {},
            visibleAttributes: undefined,
            mode: config.readonly == undefined || config.readonly ? this.formmodes.read : this.formmodes.update,
            grouping: [],
            layout: {}
        });

        // empty group
        var emptyGroup = Ext.create("CMDBuildUI.model.AttributeGrouping", {
            _id: "",
            description: CMDBuildUI.locales.Locales.common.attributes.nogroup,
            name: CMDBuildUI.model.AttributeGrouping.nogroup,
            index: config.grouping.length + 1
        });
        config.grouping.push(emptyGroup);

        // sort groups
        config.grouping.sort(function (a, b) {
            return a.index - b.index;
        });

        // get form fields
        var fields = CMDBuildUI.util.helper.FormHelper.getFormFields(model, {
            readonly: config.readonly,
            defaultValues: config.defaultValues,
            linkName: config.linkName,
            activityLinkName: config.activityLinkName,
            filterLinkName: config.filterLinkName,
            ignoreUpdateVisibilityToField: config.ignoreUpdateVisibilityToField,
            ignoreCustomValidator: config.ignoreCustomValidator,
            ignoreAutovalue: config.ignoreAutovalue,
            attributesOverrides: config.attributesOverrides,
            ignoreSchedules: config.ignoreSchedules,
            mode: config.mode
        });

        // collapse fieldset config
        var collapsefieldsets = false;
        if (model.objectType && model.objectTypeName) {
            var obj = CMDBuildUI.util.helper.ModelHelper.getObjectFromName(model.objectTypeName, model.objectType);
            collapsefieldsets = obj ? obj.get("_closefieldsets_" + config.mode) : collapsefieldsets;
        }

        // create json view
        var items = [];
        var hiddengroups = [];
        var rowdefconf = {
            xtype: 'container',
            layout: 'column',
            // layout: 'vbox',
            defaults: {
                xtype: 'fieldcontainer',
                columnWidth: 0.5,
                flex: '0.5',
                padding: CMDBuildUI.util.helper.FormHelper.properties.padding,
                layout: 'anchor',
                minHeight: 1
            },
            items: []
        };
        var defaultcols = 2;
        config.grouping.forEach(function (g, gindex) {
            var hidden = true;
            // get group fields
            var groupfields = Ext.Array.filter(fields, function (f) {
                return g.get("_id") === f.metadata.group;
            });

            var group = {
                title: g.get("_description_translation") || g.get("description"),
                items: [],
                collapsed: config.showAsFieldsets && g.get('defaultDisplayMode') != CMDBuildUI.model.AttributeGrouping.displayMode.open
            };

            // get layout configuration for group
            var grouplayout = config.layout[g.get("name")];

            // add field specified in layout
            if (!Ext.isEmpty(grouplayout)) {
                grouplayout.rows.forEach(function (rdef) {
                    var row = Ext.Object.merge({}, rowdefconf, {
                        defaults: {
                            columnWidth: 1 / rdef.columns.length,
                            flex: 1 / rdef.columns.length
                        },
                        items: []
                    });
                    group.items.push(row);

                    rdef.columns.forEach(function (cdef) {
                        var col = {
                            layout: 'fit',
                            items: []
                        };
                        if (!Ext.isEmpty(cdef.width)) {
                            col.columnWidth = cdef.width;
                            col.flex = cdef.width;
                        }
                        row.items.push(col);
                        var fields = cdef.fields || [];
                        fields.forEach(function (fdef) {
                            // search for specified field
                            var field = Ext.Array.findBy(groupfields, function (f) {
                                return fdef.attribute === f.name;
                            });
                            if (field && (config.visibleAttributes === undefined || Ext.Array.indexOf(config.visibleAttributes, field.name) !== -1)) {
                                // add field in column and remove from groupfields array
                                col.items.push(field);
                                Ext.Array.remove(groupfields, field);
                                hidden = !hidden ? hidden : field.hidden;
                            }
                        });
                    });
                });
            }

            // add fields without layout
            if (!Ext.isEmpty(groupfields)) {
                // create columns layout
                var row;
                var index = 0;
                var hiddenfields = Ext.Object.merge({}, rowdefconf, {
                    items: []
                });
                groupfields.forEach(function (f) {
                    if (config.visibleAttributes === undefined || Ext.Array.indexOf(config.visibleAttributes, f.name) !== -1) {
                        if (!f.hidden) {
                            if (index % defaultcols === 0) {
                                // create row
                                row = Ext.Object.merge({}, rowdefconf, {
                                    defaults: {
                                        columnWidth: 1 / defaultcols,
                                        flex: 1 / defaultcols
                                    },
                                    items: []
                                });
                                group.items.push(row);
                            }
                            // push column
                            row.items.push({
                                layout: 'fit',
                                items: f
                            });
                            index++;
                        } else {
                            // add field in fake row
                            hiddenfields.items.push(f);
                        }
                        hidden = !hidden ? hidden : f.hidden;
                    }
                });
                if (hiddenfields.items.length) {
                    group.items.push(hiddenfields);
                }
            }
            group.hidden = hidden || group.items.length === 0;

            // add group in items
            if (group.hidden) {
                hiddengroups.push(group);
            } else {
                items.push(group);
            }
        });

        // get tenant field config
        if (CMDBuildUI.util.helper.Configurations.get(CMDBuildUI.model.Configuration.multitenant.enabled)) {
            var objectdefinition = CMDBuildUI.util.helper.ModelHelper.getObjectFromName(model.objectTypeName, model.objectType);
            var multitenantMode = objectdefinition ? objectdefinition.get("multitenantMode") : null;
            if (
                multitenantMode === CMDBuildUI.model.users.Tenant.tenantmodes.always ||
                multitenantMode === CMDBuildUI.model.users.Tenant.tenantmodes.mixed
            ) {
                var tenantfield = this.getTenantField(config.mode, multitenantMode, config.linkName);
                var group = items.length ? items[0] : {
                    title: CMDBuildUI.locales.Locales.common.attributes.nogroup,
                    items: []
                };

                var trow = Ext.Object.merge({}, rowdefconf, {
                    defaults: {
                        columnWidth: 0.5,
                        flex: 0.5
                    },
                    items: [{
                        items: tenantfield
                    }]
                });
                Ext.Array.insert(group.items, 0, [trow]);
            }
        }

        // add notes in a new page
        if (config && config.showNotes) {
            items.push({
                title: CMDBuildUI.locales.Locales.common.tabs.notes,
                reference: "_notes",
                items: [{
                    xtype: 'displayfield',
                    name: 'Notes',
                    anchor: '100%',
                    padding: CMDBuildUI.util.helper.FormHelper.properties.padding,
                    bind: {
                        value: Ext.String.format("{{0}.Notes}", config.linkName)
                    }
                }]
            });
        }

        // add hidden groups
        hiddengroups.forEach(function (g) {
            items.push(g);
        });

        // return as fieldsets
        if (config.showAsFieldsets) {
            // set fieldset configurations
            items.forEach(function (item, index) {
                Ext.apply(item, {
                    xtype: 'formpaginationfieldset',
                    collapsible: items.length > 1
                });
            });
            return items;
        }

        // hide tab in tabbar if there is only one tab
        if (items.length === 1) {
            items[0].tabConfig = {
                cls: 'hidden-tab'
            };
        }
        // return tab panel
        return {
            xtype: 'formtabpanel',
            items: items
        };
    },

    /**
     * 
     * @param {*} objectType 
     * @param {*} objectTypeName 
     * @param {Object} config The config object to use in CMDBuildUI.util.helper.FormHelper.renderForm
     * @return {Ext.promise.Promise} Resolve method has as argument 
     * the items to add to the form. Reject method has as argument 
     * a {String} containing error message.
     */
    renderFormForType: function (objectType, objectTypeName, config) {
        var deferred = new Ext.Deferred();

        // define model
        CMDBuildUI.util.helper.ModelHelper.getModel(
            objectType,
            objectTypeName
        ).then(function (model) {
            var obj = CMDBuildUI.util.helper.ModelHelper.getObjectFromName(objectTypeName, objectType);
            config = Ext.applyIf(config || {}, {
                grouping: obj.attributeGroups ? obj.attributeGroups().getRange() : undefined,
                layout: obj.get("formStructure") && obj.get("formStructure").active ? obj.get("formStructure").form : undefined
            });
            deferred.resolve(CMDBuildUI.util.helper.FormHelper.renderForm(model, config))
        }).otherwise(function() {
            deferred.reject("nomodel");
        });

        return deferred.promise;
    },

    privates: {
        _default_link_name: 'theObject',
        _default_ignoreUpdateVisibilityToField: false,
        _default_ignoreCustomValidator: false,
        _default_ignoreAutovalue: false,
        _default_ignoreSchedules: false,

        /**
         * @param {String} formmode
         * @param {String} multitenantmode
         * @return {Object}
         */
        getTenantField: function (formmode, multitenantmode, linkName) {
            linkName = linkName || this._default_link_name;
            var tenants = CMDBuildUI.util.helper.SessionHelper.getActiveTenants();
            var writable = formmode === this.formmodes.update || formmode === this.formmodes.create;
            if (writable) {
                // add combobox
                return {
                    xtype: 'combobox',
                    viewModel: {
                        formulas: {
                            hidetenantcombo: {
                                bind: {
                                    theobject: '{' + linkName + '}'
                                },
                                get: function (data) {

                                    if (multitenantmode === CMDBuildUI.model.users.Tenant.tenantmodes.always && tenants.length === 1) {
                                        data.theobject.set("_tenant", tenants[0].code);
                                        return true;
                                    }
                                    return false;
                                }
                            }
                        }
                    },
                    labelSeparator: CMDBuildUI.util.helper.FormHelper.properties.labelSeparator,
                    fieldLabel: CMDBuildUI.util.Utilities.getTenantLabel(),
                    displayField: 'description',
                    valueField: 'code',
                    queryMode: 'local',
                    anchor: '100%',
                    forceSelection: true,
                    allowBlank: multitenantmode !== CMDBuildUI.model.users.Tenant.tenantmodes.always,
                    bind: {
                        value: '{' + linkName + '._tenant}',
                        hidden: '{hidetenantcombo}'
                    },
                    store: {
                        data: tenants
                    },
                    triggers: {
                        clear: {
                            cls: 'x-form-clear-trigger',
                            handler: function (combo, trigger, eOpts) {
                                combo.clearValue();
                                combo.lastSelectedRecords = [];
                                if (combo.hasBindingValue) {
                                    combo.getBind().value.setValue(null);
                                }
                            }
                        }
                    }
                };
            } else {
                if (tenants.length > 1) {
                    return {
                        xtype: 'displayfield',
                        fieldLabel: CMDBuildUI.util.Utilities.getTenantLabel(),
                        labelSeparator: CMDBuildUI.util.helper.FormHelper.properties.labelSeparator,
                        bind: {
                            value: '{theObject._tenant}'
                        },
                        renderer: function (value, field) {
                            var t = Ext.Array.findBy(tenants, function (i) {
                                return i.code == value;
                            });
                            if (t) {
                                return t.description;
                            }
                            return "";
                        }
                    };
                }
            }
            return;
        },

        /**
         * Add update visibility function to field
         * @param {Object} config Ext.form.Field configuration
         * @param {Object} fieldMeta Field metadata
         * @param {Object} fieldMeta.showIf Show if code
         * @param {String} linkname
         * @param {String} formmode One of `read`, `create` or `update`.
         * @param {String} activityLinkName
         */
        addUpdateVisibilityToField: function (config, fieldMeta, linkname, formmode, activityLinkName) {
            linkname = linkname || this._default_link_name;
            formmode = formmode || this.formmodes.read;
            // Add show if control
            if (config && fieldMeta && !Ext.isEmpty(fieldMeta.showIf) && !fieldMeta.hidden) {
                /* jshint ignore:start */
                var jsfn = Ext.String.format(
                    'function executeShowIf(api) {{0}}',
                    fieldMeta.showIf
                );
                eval(jsfn);
                /* jshint ignore:end */
                config.updateFieldVisibility = function (record) {
                    if (!record) {
                        var form = this.up("form");
                        record = form && form.getViewModel() ? form.getViewModel().get(linkname) : null;
                    }

                    var activity;
                    if (activityLinkName) {
                        var form = this.up("form");
                        activity = form && form.getViewModel() ? form.getViewModel().get(activityLinkName) : null;
                    }

                    var api = Ext.apply({
                        record: record,
                        mode: formmode,
                        activity: activity
                    }, CMDBuildUI.util.api.Client.getApiForFieldVisibility());

                    // use try / catch to manage errors
                    try {
                        var visibility = executeShowIf(api);
                        if (visibility === true || visibility === "true" || visibility === "enabled") {
                            this.setHidden(false);
                            this.setDisabled(false);
                        } else if (visibility === "disabled") {
                            this.setHidden(false);
                            this.setDisabled(true);
                        } else {
                            this.setHidden(true);
                            this.setDisabled(true);
                        }
                    } catch (e) {
                        CMDBuildUI.util.Logger.log(
                            "Error on showIf configuration for field " + this.getFieldLabel(),
                            CMDBuildUI.util.Logger.levels.error,
                            null,
                            e
                        );
                    }
                };
            }
        },

        /**
         * Add update visibility function to field
         * @param {Object} config Ext.form.Field configuration
         * @param {Object} fieldMeta Field metadata
         * @param {Object} fieldMeta.validationRules Validation rules code
         * @param {String} linkname
         * @param {String} formmode One of `read`, `create` or `update`.
         */
        addCustomValidator: function (config, fieldMeta, linkname, formmode, activityLinkName) {
            var me = this;
            linkname = linkname || this._default_link_name;
            formmode = formmode || this.formmodes.read;
            if (config && fieldMeta && !Ext.isEmpty(fieldMeta.validationRules)) {
                var bind = me.extractBindFromExpression(fieldMeta.validationRules, linkname);

                /* jshint ignore:start */
                var jsfn = Ext.String.format(
                    'function executeValidationRules(value, api) {{0}}',
                    fieldMeta.validationRules
                );
                eval(jsfn);
                /* jshint ignore:end */

                // update binds
                if (!bind.deep) {
                    bind = bind.bindTo;
                    bind[fieldMeta.name] = Ext.String.format("{{0}.{1}}", linkname, fieldMeta.name);
                }

                // bind validator
                config.bind = Ext.applyIf(config.bind || {}, {
                    validation: '{customFieldValidation}'
                });
                // add formula on view model
                config.viewModel = Ext.applyIf(config.viewModel || {}, {
                    formulas: {
                        customFieldValidation: {
                            bind: bind,
                            get: function (data) {
                                var api = Ext.apply({
                                    record: this.get(linkname),
                                    activity: this.get(activityLinkName),
                                    mode: formmode
                                }, CMDBuildUI.util.api.Client.getApiForFieldCustomValidator());

                                try {
                                    var isvalid = executeValidationRules(api.record.get(fieldMeta.name), api);
                                    if (isvalid === false) {
                                        isvalid = CMDBuildUI.locales.Locales.notifier.error;
                                    }
                                    return isvalid;
                                } catch (e) {
                                    CMDBuildUI.util.Logger.log(
                                        "Error on validationRules configuration for field " + fieldMeta.name,
                                        CMDBuildUI.util.Logger.levels.error,
                                        null,
                                        e
                                    );
                                    return false;
                                }
                            }
                        }
                    }
                });
            }
        },

        /**
         * Add auto value script to field
         * @param {Object} config Ext.form.Field configuration
         * @param {Object} fieldMeta Field metadata
         * @param {Object} fieldMeta.validationRules Validation rules code
         * @param {String} linkname
         * @param {String} formmode One of `read`, `create` or `update`.
         */
        addAutoValue: function (config, fieldMeta, linkname, formmode, activityLinkName) {
            linkname = linkname || this._default_link_name;
            formmode = formmode || this.formmodes.read;
            if (config && fieldMeta && !Ext.isEmpty(fieldMeta.autoValue)) {
                fieldMeta.autoValue.trim();
                var api = {};
                // extract bind property
                var expr = /^api\.bind(\s?)=(\s?)\[.*\](\s?);/;
                var bind = expr.exec(fieldMeta.autoValue);
                try {
                    if (bind && Ext.isArray(bind) && bind.length) {
                        eval(bind[0]);
                    }
                } catch (err) {
                    CMDBuildUI.util.Logger.log("Error evaluating autoValue binds", CMDBuildUI.util.Logger.levels.error, "", err);
                }

                // evaluate script
                var script = fieldMeta.autoValue.replace(expr, "");
                /* jshint ignore:start */
                try {
                    var jsfn = Ext.String.format(
                        'function executeAutoValue(api) {{0}}',
                        script
                    );
                    eval(jsfn);
                } catch (err) {
                    CMDBuildUI.util.Logger.log("Error evaluating autoValue script", CMDBuildUI.util.Logger.levels.error, "", err);
                    var executeAutoValue = Ext.emptyFn;
                }
                /* jshint ignore:end */

                // get auto value binds
                config.getAutoValueBind = function () {
                    if (api.bind) {
                        var b = {};
                        api.bind.forEach(function (k) {
                            b[k] = Ext.String.format("{{0}.{1}}", linkname, k);
                        });
                        return {
                            bindTo: b
                        };
                    }
                    // bind every object change
                    return {
                        bindTo: '{' + linkname + '}',
                        deep: true
                    };
                };

                // set value from autoValue script
                config.setValueFromAutoValue = function () {
                    var record = this.lookupViewModel().get(linkname);
                    var activity;
                    if (activityLinkName) {
                        activity = this.lookupViewModel().get(activityLinkName);
                    }

                    var api = Ext.apply({
                        record: record,
                        activity: activity,
                        mode: formmode,
                        setValue: function (value) {
                            record.set(fieldMeta.name, value);
                        }
                    }, CMDBuildUI.util.api.Client.getApiForFieldAutoValue());

                    // execute script
                    try {
                        executeAutoValue(api);
                    } catch (err) {
                        CMDBuildUI.util.Logger.log("Error executing autoValue script", CMDBuildUI.util.Logger.levels.error, "", err);
                    }
                };
            }
        },

        /**
         * 
         * @param {String} expression Javascript expression as string
         * @param {String} linkname 
         */
        extractBindFromExpression: function (expression, linkname) {
            var api = {};
            var expr = /^api\.bind(\s?)=(\s?)\[.*\](\s?);/;
            var bind = expr.exec(expression);
            try {
                if (bind && Ext.isArray(bind) && bind.length) {
                    eval(bind[0]);
                }
            } catch (err) {
                CMDBuildUI.util.Logger.log("Error evaluating binds", CMDBuildUI.util.Logger.levels.error, "", err);
            }

            if (api.bind) {
                var b = {};
                api.bind.forEach(function (k) {
                    b[k] = Ext.String.format("{{0}.{1}}", linkname, k);
                });
                return {
                    bindTo: b
                };
            }
            // bind every object change
            return {
                bindTo: '{' + linkname + '}',
                deep: true
            };
        },

        /**
         * This function returns some configuration to render the unitOfMesure in the numberfields
         * @param {String} unitOfMeasure 
         */
        getNumberOfMesureConfigs: function (unitOfMeasure) {
            return {
                hideTrigger: false,
                triggers: {
                    unitOfMesureTrigger: {
                        cls: 'unitOfMesure',
                        hidden: false,
                        hideOnReadOnly: false,
                        readOnly: false,
                        defaultPass: true,
                        handler: function () {
                            return
                        }
                    },
                    spinner: {
                        hidden: true,
                        hideOnReadOnly: true,
                        readOnly: true
                    }
                },
                listeners: {
                    afterRender: function (view, eOpts) {
                        var trigger = view.getTrigger('unitOfMesureTrigger');
                        if (trigger) {
                            var triggerEl = trigger.getEl().dom;
                            triggerEl.setAttribute('unitOfMesure', unitOfMeasure);
                        }

                        var trigger = view.getTrigger('spinner');
                        if (trigger) {
                            trigger.hide()
                        }
                    }
                }
            }
        }
    }

});