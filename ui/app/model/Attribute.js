Ext.define('CMDBuildUI.model.Attribute', {
    requires: [
        'Ext.data.validator.Presence'
    ],

    statics: {
        types: {
            boolean: 'boolean',
            char: 'char',
            date: 'date',
            dateTime: 'dateTime', // formaly TIMESTAMP
            decimal: 'decimal',
            double: 'double',
            foreignKey: 'foreignKey',
            integer: 'integer',
            ipAddress: 'ipAddress',
            json: 'json',
            lookup: 'lookup',
            reference: 'reference',
            string: 'string',
            text: 'text',
            time: 'time'
        },
        getTypes: function (objectTypeName) {
 
            var values = [{
                label: 'BOOLEAN',
                value: 'boolean'
            }, {
                label: 'CHAR',
                value: 'char'
            }, {
                label: 'DATE',
                value: 'date'
            }, {
                label: 'DECIMAL',
                value: 'decimal'
            }, {
                label: 'DOUBLE',
                value: 'double'
            }, {
                label: 'INTEGER',
                value: 'integer'
            }, {
                label: 'IP_ADDRESS',
                value: 'ipAddress'
            }, {
                label: 'LOOKUP',
                value: 'lookup'
            }, {
                label: 'STRING',
                value: 'string'
            }, {
                label: 'TEXT',
                value: 'text'
            }, {
                label: 'TIME',
                value: 'time'
            }, {
                label: 'TIMESTAMP',
                value: 'dateTime'
            }];
            var addReference = function () {
                values.push({
                    label: 'REFERENCE',
                    value: 'reference'
                });
            };
            var addForeignKey = function () {
                values.push({
                    label: 'FOREIGNKEY',
                    value: 'foreignKey'
                });
            };
            var addJson = function () {
                values.push({
                    label: 'JSON',
                    value: 'json'
                });
            };
            if (!objectTypeName) {
                addReference();
                addForeignKey();
                addJson();
            } else {
                var object = CMDBuildUI.util.helper.ModelHelper.getObjectFromName(objectTypeName);
                switch (object.$className) {
                    case 'CMDBuildUI.model.classes.Class':
                        var theClassType = object.get('type');
                        switch (theClassType) {
                            case 'standard':
                                addReference();
                                break;
                            case 'simple':
                                addForeignKey();
                                break;

                            default:
                                break;
                        }
                        break;
                    case 'CMDBuildUI.model.processes.Process':
                        addReference();
                        break;
                    case 'CMDBuildUI.model.dms.DMSModel':

                        break;
                    default:
                        break;
                }
            }
            return CMDBuildUI.util.administration.helper.SortHelper.sort(values, 'label');
        },
        unitOfMeasureLocations: {
            after: 'AFTER',
            before: 'BEFORE'
        },
        textContentSecurity: { // for type string and text
            plaintext: 'plaintext', // only for string type
            html_safe: 'html_safe',
            html_all: 'html_all'
        },
        getTextContentSecurities: function (type) {
            var values = [];
            switch (type) {
                case CMDBuildUI.model.Attribute.types.string:
                    values.push({
                        value: CMDBuildUI.model.Attribute.textContentSecurity.plaintext,
                        label: CMDBuildUI.locales.Locales.administration.attributes.strings.plaintext
                    });
                    break;
                default:
                    break;
            }
            values.push({
                value: CMDBuildUI.model.Attribute.textContentSecurity.html_safe,
                label: CMDBuildUI.locales.Locales.administration.attributes.strings.htmlsafe
            });
            values.push({
                value: CMDBuildUI.model.Attribute.textContentSecurity.html_all,
                label: CMDBuildUI.locales.Locales.administration.attributes.strings.htmlall
            });
            return values;
        }

    },

    extend: 'CMDBuildUI.model.base.Base',
    fields: [{
        // 
        name: 'type',
        type: 'string',
        persist: true,
        critical: true,
        validators: ['presence']
    }, {
        name: 'editorType',
        type: 'string',
        persist: true,
        critical: true,
        defaultValue: 'PLAIN'
    }, {
        name: 'name',
        type: 'string',
        persist: true,
        critical: true,
        validators: ['presence']
    }, {
        name: 'metadata',
        type: 'auto',
        persist: true,
        critical: true
    }, {
        name: 'mode',
        type: 'string',
        persist: true,
        critical: true,
        defaultValue: 'write'
    }, {
        name: 'description',
        type: 'string',
        persist: true,
        critical: true,
        validators: ['presence']
    }, {
        name: 'showInGrid',
        type: 'boolean',
        persist: true,
        critical: true,
        defaultValue: false
    }, {
        name: 'showInReducedGrid',
        type: 'boolean',
        persist: true,
        critical: true,
        defaultValue: false
    }, {
        name: 'domain',
        type: 'string',
        persist: true,
        critical: true,
        defaultValue: ''
    }, {
        name: 'help',
        type: 'string',
        persist: true,
        critical: true
    }, {
        name: 'showIf',
        type: 'string',
        persist: true,
        critical: true
    }, {
        name: 'validationRules',
        type: 'string',
        persist: true,
        critical: true
    }, {
        name: 'autoValue',
        type: 'string',
        persist: true,
        critical: true
    }, {
        name: 'actionPostValidation',
        type: 'string',
        persist: true,
        critical: true
    }, {
        name: 'unique',
        type: 'boolean',
        persist: true,
        critical: true
    }, {
        name: 'mandatory',
        type: 'boolean',
        persist: true,
        critical: true
    }, {
        name: 'inherited',
        type: 'boolean',
        defaultValue: null,
        persist: true,
        critical: true
    }, {
        name: 'active',
        type: 'boolean',
        persist: true,
        critical: true,
        defaultValue: true
    }, {
        name: 'index',
        type: 'integer',
        defaultValue: -1, // server change -1 to to maxValue + 1
        persist: true,
        critical: true
    }, {
        name: 'defaultValue',
        type: 'auto',
        persist: true,
        critical: true
    }, {
        name: 'group',
        type: 'string',
        persist: true,
        critical: true
    }, {
        name: 'writable',
        type: 'boolean',
        persist: true,
        critical: true
    }, {
        name: 'hidden',
        type: 'boolean',
        persist: true,
        critical: true
    }, {
        name: 'maxLength',
        type: 'integer',
        defaultValue: 50,
        persist: true,
        critical: true
    }, {
        name: 'precision',
        type: 'integer',
        defaultValue: 10,
        persist: true,
        critical: true
    }, {
        name: 'scale',
        type: 'integer',
        defaultValue: 2,
        persist: true,
        critical: true
    }, {
        name: 'unitOfMeasure',
        type: 'string',
        defaultValue: null,
        persist: true,
        critical: true
    }, {
        name: 'unitOfMeasureLocation',
        type: 'string',
        defaultValue: null, // BEFORE | AFTER
        persist: true,
        critical: true
    }, {
        name: 'showThousandsSeparator',
        type: 'boolean',
        // defaultValue: 'DEFAULT', // DEFAULT | POINT | COMMA
        persist: true,
        critical: true
    }, {
        name: 'visibleDecimals',
        type: 'string',
        persist: true,
        critical: true
    }, {
        name: 'lookupType',
        type: 'string',
        defaultValue: '',
        persist: true,
        critical: true
    }, {
        name: 'targetClass',
        type: 'string',
        defaultValue: '',
        persist: true,
        critical: true
    }, {
        name: 'targetType',
        type: 'string'
    }, {
        name: 'targetClassDescription',
        type: 'string',

        calculate: function (data) {
            if (data.targetClass) {
                var record = CMDBuildUI.util.helper.ModelHelper.getObjectFromName(data.targetClass, data.targetType);
                return record && record.get('description');
            }
            return '';
        }
    }, {
        name: 'filter',
        type: 'string',
        defaultValue: '',
        persist: true,
        critical: true
    }, {
        name: 'preselectIfUnique',
        type: 'boolean',
        defaultValue: false,
        persist: true,
        critical: true
    }, {
        // this property is used only in attribute type REFERENCE
        name: 'direction',
        type: 'string',
        defaultValue: null,
        persist: true,
        critical: true
    }, {
        name: 'showSeconds',
        type: 'bool',
        defaultValue: false,
        persist: true,
        critical: true
    }, {
        name: 'ipType',
        type: 'string',
        persist: true,
        critical: true
    }, {
        name: 'textContentSecurity',
        type: 'string',
        // defaultValue: 'plaintext',
        persist: true,
        critical: true
    }, {
        name: 'isMasterDetail',
        type: 'boolean',
        defaultValue: false,
        persist: true,
        critical: true
    }, {
        name: 'masterDetailDescription',
        type: 'string',
        defaultValue: null,
        persist: true,
        critical: true
    }, {
        name: '_type_description',
        type: 'string',
        calculate: function (data) {
            var types = CMDBuildUI.model.Attribute.getTypes();
            var type = Ext.Array.findBy(types, function (type) {
                return type.value === data.type;
            });
            if (type) {
                return type.label;
            }
            return data.type;

        }
    }],

    proxy: {
        type: 'cmdbuildattributesproxy'
    },

    /**
     * ask if the current attribute can be used in administration
     * @param {Array} allowedAttributes [] pass true if Notes is allowed
     * @return {Boolean}
     */
    canAdminShow: function (allowedAttributes) {
        if (allowedAttributes && allowedAttributes.indexOf(this.get('name')) > -1) {
            this.set('description', this.get('name'));
            return true;
        }
        return CMDBuildUI.util.helper.ModelHelper.ignoredFields.indexOf(this.get('name')) === -1 && this.get('mode') !== 'syshidden';
    },

    /**
     * TODO: validation not work
     * @param {} options 
     */
    validate: function (options) {
        var errors = this.callParent(arguments),
            precision = this.get('precision'),
            scale = this.get('scale'),
            type = this.get('type');

        if (type === 'decimal') {
            if (scale >= precision) {
                errors.add({
                    field: 'scale',
                    message: 'Scale can\'t be greater o equal to precision'
                });
                errors.add({
                    field: 'precision',
                    message: 'Precision can\'t be greater o equal to precision'
                });
            }
        }

        return errors;
    },
    /**
     * Get group info
     * 
     * @return {Object} Returns an object containing group `name` and `label`.
     */
    getGroupInfo: function () {
        var name = this.get("group");
        var label = this.get("_group_description_translation") || this.get("_group_description");
        if (!name) {
            name = "__NOGROUP";
            label = CMDBuildUI.locales.Locales.common.attributes.nogroup;
        }
        return {
            name: name,
            label: label
        };
    },

    /**
     * Return translated description for the attribute.
     * @param {Boolean} [force] default null (if true return always the translation even if exist,
     *  otherwise if viewContext is 'admin' return the original description)
     * @return {String} The translated description if exists. Otherwise the description.
     */
    getTranslatedDescription: function (force) {
        if(!force && CMDBuildUI.util.Ajax.getViewContext() === 'admin'){
            return this.get("description");
        }
        return this.get("_description_translation") || this.get("description");
    },

    /**
     * Return description with the name like: `Last Name [LastName]`
     * 
     * @return {String}
     */
    getDescriptionWithName: function () {
        return Ext.String.format('{0} [{1}]', this.get('description'), this.get('name'));

    },
    /**
     * Return a clean clone of attribute.
     * 
     * @return {CMDBuildUI.model.Attribute} the fresh cloned attribute
     */
    clone: function () {
        var newAttribute = this.copy();
        newAttribute.set('_id', undefined);
        newAttribute.set('name', '');
        newAttribute.set('description', '');
        newAttribute.crudState = "C";
        newAttribute.phantom = true;
        delete newAttribute.crudStateWas;
        delete newAttribute.previousValues;
        delete newAttribute.modified;
        return newAttribute;
    }

});