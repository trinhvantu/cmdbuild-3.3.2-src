Ext.define('CMDBuildUI.view.administration.components.attributes.actionscontainers.CardModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.administration-components-attributes-actionscontainers-card',
    data: {
        attributeGroups: [],
        attributes: [],
        theAttribute: null,
        isOtherPropertiesHidden: true,
        isMandatoryHidden: false,
        isGroupHidden: true,
        action: CMDBuildUI.util.administration.helper.FormHelper.formActions.view,
        types: {
            isReference: false,
            isLookup: false,
            isDecimal: false,
            isDouble: false,
            isInteger: false,
            isText: false,
            isString: false,
            isIpAddress: false,
            isDate: false,
            isDatetime: false,
            isForeignkey: false,
            isTime: false,
            isTimestamp: false
        },
        toolAction: {
            _canUpdate: false,
            _canDelete: false,
            _canActiveToggle: false,
            _canClone: false,
            _canOpen: false,
            _canAdd: false
        }
    },

    formulas: {
        attriubuteTypes: {
            bind: '{objectTypeName}',
            get: function (objectTypeName) {
                if (objectTypeName) {
                    return CMDBuildUI.model.Attribute.getTypes(objectTypeName);
                }

            }
        },
        textContentSecurities: {
            bind: '{theAttribute.type}',
            get: function (attributeType) {
                if (attributeType) {
                    if (attributeType === 'string' && !this.get('theAttribute.textContentSecurity').length) {
                        this.set('theAttribute.textContentSecurity', CMDBuildUI.model.Attribute.textContentSecurity.plaintext);
                    }
                    return CMDBuildUI.model.Attribute.getTextContentSecurities(attributeType);
                }
            }
        },
        theAttributeManager: {
            bind: {
                theAttribute: '{theAttribute}',
                objectType: '{objectType}'
            },
            get: function (data) {
                if (data.theAttribute) {
                    this.setToolActionStatuses(data);
                }
                if (data.objectType && data.objectType === 'Process') {
                    this.set('isMandatoryHidden', true);
                }
            }
        },

        actions: {
            bind: '{action}',
            get: function (action) {
                return {
                    add: action === CMDBuildUI.util.administration.helper.FormHelper.formActions.add,
                    edit: action === CMDBuildUI.util.administration.helper.FormHelper.formActions.edit,
                    view: action === CMDBuildUI.util.administration.helper.FormHelper.formActions.view
                };
            }
        },
        isGroupHiddenOrView: {
            bind: {
                isGroupHidden: '{isGroupHidden}'
            },
            get: function (data) {
                if (data.isGroupHidden || this.get('actions.view')) {
                    return true;
                }
                return false;
            }
        },
        isGroupHiddenOrNotView: {
            bind: {
                isGroupHidden: '{isGroupHidden}'
            },
            get: function (data) {
                if (data.isGroupHidden || !this.get('actions.view')) {
                    return true;
                }
                return false;
            }
        },
        pluralObjectType: {
            bind: '{objectType}',
            get: function (objectType) {
                return objectType && Ext.util.Inflector.pluralize(objectType).toLowerCase();
            }
        },

        setCurrentType: {
            bind: '{theAttribute.type}',
            get: function (type) {
                this.set('types.isBoolean', type === CMDBuildUI.model.Attribute.types['boolean']);
                this.set('types.isDate', type === CMDBuildUI.model.Attribute.types.date);
                this.set('types.isDatetime', type === CMDBuildUI.model.Attribute.types.dateTime);
                this.set('types.isDecimal', type === CMDBuildUI.model.Attribute.types.decimal);
                this.set('types.isDouble', type === CMDBuildUI.model.Attribute.types['double']);
                this.set('types.isForeignkey', type === CMDBuildUI.model.Attribute.types.foreignKey);
                this.set('types.isInteger', type === CMDBuildUI.model.Attribute.types.integer);
                this.set('types.isIpAddress', type === CMDBuildUI.model.Attribute.types.ipAddress);
                this.set('types.isLookup', type === CMDBuildUI.model.Attribute.types.lookup);
                this.set('types.isReference', type === CMDBuildUI.model.Attribute.types.reference);
                this.set('types.isString', type === CMDBuildUI.model.Attribute.types.string);
                this.set('types.isText', type === CMDBuildUI.model.Attribute.types.text);
                this.set('types.isTime', type === CMDBuildUI.model.Attribute.types.time);
                this.set('types.isTimestamp', type === CMDBuildUI.model.Attribute.types.dateTime);
            }
        },
        panelTitle: {
            bind: '{theAttribute.description}',
            get: function (attributeName) {                
                if (this.get('theAttribute') && !this.get('theAttribute').phantom) {
                    var title = Ext.String.format(
                        '{0} - {1} - {2}',
                        CMDBuildUI.util.helper.ModelHelper.getObjectFromName(this.get('objectTypeName')).get('description'),
                        CMDBuildUI.locales.Locales.administration.attributes.attributes,
                        attributeName
                    );
                    this.getParent().set('title', title);
                } else {
                    this.getParent().set('title', CMDBuildUI.locales.Locales.administration.attributes.texts.newattribute);
                }
            }
        },
        attributeGroups: {
            bind: '{attributes}',
            get: function (attributes) {
                var attributeGroups = [],
                    data = [];
                var obj = CMDBuildUI.util.helper.ModelHelper.getObjectFromName(this.get('objectTypeName'));
                if (obj && obj.attributeGroups) {
                    attributeGroups = obj.attributeGroups().getRange();
                } else {
                    Ext.Array.each(attributes, function (attribute) {
                        if (attribute.get('group') && attribute.get('group').length > 0) {
                            if (!Ext.Array.contains(data, attribute.get('group'))) {
                                Ext.Array.include(data, attribute.get('group'));
                                Ext.Array.include(attributeGroups, {
                                    description: attribute.get('_group_description'),
                                    name: attribute.get('group')
                                });
                            }
                        }
                    });
                }
                return attributeGroups;
            }
        },

        domainExtraparams: {
            bind: '{objectTypeName}',
            get: function (objectTypeName) {
                var type = CMDBuildUI.util.helper.ModelHelper.getObjectTypeByName(objectTypeName);
                if (type && type !== CMDBuildUI.util.helper.ModelHelper.objecttypes.domain) {
                    var filter = Ext.JSON.encode({
                        "attribute": {
                            "or": [{
                                "and": [{
                                    "simple": {
                                        "attribute": "destination",
                                        "operator": "contain",
                                        "value": objectTypeName
                                    }
                                }, {
                                    "simple": {
                                        "attribute": "cardinality",
                                        "operator": "in",
                                        "value": ["1:N", "1:1"]
                                    }
                                }, {
                                    "simple": {
                                        "attribute": "active",
                                        "operator": "equal",
                                        "value": true
                                    }
                                }]
                            }, {
                                "and": [{
                                    "simple": {
                                        "attribute": "source",
                                        "operator": "contain",
                                        "value": objectTypeName
                                    }
                                }, {
                                    "simple": {
                                        "attribute": "cardinality",
                                        "operator": "in",
                                        "value": ["N:1", "1:1"]
                                    }
                                }, {
                                    "simple": {
                                        "attribute": "active",
                                        "operator": "equal",
                                        "value": true
                                    }
                                }]
                            }]
                        }
                    });
                    return filter;
                }
                return [];

            }
        },
        directions: {
            get: function () {
                return [{
                    value: "direct",
                    label: CMDBuildUI.locales.Locales.administration.attributes.texts.direct
                }, {
                    value: "inverse",
                    label: CMDBuildUI.locales.Locales.administration.attributes.texts.inverse
                }];
            }
        },
        attributeModes: {
            get: function () {
                return [{
                    value: "write",
                    label: CMDBuildUI.locales.Locales.administration.attributes.strings.editable
                }, {
                    value: "read",
                    label: CMDBuildUI.locales.Locales.administration.attributes.strings.readonly
                }, {
                    value: "hidden",
                    label: CMDBuildUI.locales.Locales.administration.attributes.strings.hidden
                }, {
                    value: "immutable",
                    label: CMDBuildUI.locales.Locales.administration.attributes.strings.immutable
                }];
            }
        },
        editorTypes: {
            get: function () {
                return [{
                    value: "PLAIN",
                    label: CMDBuildUI.locales.Locales.administration.attributes.strings.plaintext
                }, {
                    value: "HTML",
                    label: CMDBuildUI.locales.Locales.administration.attributes.strings.editorhtml
                }];
            }
        },
        ipTypes: {
            get: function () {
                return [{
                    value: "ipv4",
                    label: CMDBuildUI.locales.Locales.administration.attributes.strings.ipv4
                }, {
                    value: "ipv6",
                    label: CMDBuildUI.locales.Locales.administration.attributes.strings.ipv6
                }, {
                    value: "any",
                    label: CMDBuildUI.locales.Locales.administration.attributes.strings.any
                }];
            }
        }
    },

    stores: {
        domainsStore: {
            model: "CMDBuildUI.model.domains.Domain",
            proxy: {
                type: 'baseproxy',
                url: '/domains/',
                extraParams: {
                    filter: '{domainExtraparams}',
                    ext: true
                }
            },
            autoLoad: true,
            autoDestroy: true,
            fields: ['_id', 'name'],
            pageSize: 0
        },
        lookupStore: {
            model: "CMDBuildUI.model.lookups.Lookup",
            proxy: {
                type: 'baseproxy',
                url: '/lookup_types/'
            },
            autoLoad: true,
            autoDestroy: true,
            fields: ['_id', 'name'],
            pageSize: 0
        },
        attributeGroupStore: {
            model: "CMDBuildUI.model.Attribute",
            proxy: {
                type: 'memory'
            },
            data: '{attributeGroups}',
            fields: ['label', 'value'],
            autoDestroy: true
        },
        attributeModeStore: {
            data: '{attributeModes}',
            proxy: {
                type: 'memory'
            },
            autoLoad: true,
            autoDestroy: true,
            fields: ['value', 'label']
        },
        editorTypeStore: {
            data: '{editorTypes}',
            proxy: {
                type: 'memory'
            },
            autoLoad: true,
            autoDestroy: true,
            fields: ['value', 'label']
        },
        ipTypeStore: {
            data: '{ipTypes}',
            proxy: {
                type: 'memory'
            },
            autoLoad: true,
            autoDestroy: true,
            fields: ['value', 'label']
        },
        directionStore: {
            data: '{directions}'
        },
        attributetypesStore: {
            model: 'CMDBuildUI.model.base.ComboItem',
            proxy: {
                type: 'memory'
            },
            sorters: ['label'],
            data: '{attriubuteTypes}'
        },
        textContentSecurityStore: {
            model: 'CMDBuildUI.model.base.ComboItem',
            proxy: {
                type: 'memory'
            },
            data: '{textContentSecurities}'
        }
    },

    setToolActionStatuses: function (data) {

        var theAttribute = data.theAttribute;
        var theSession = this.get('theSession');

        var pluralname = Ext.util.Inflector.pluralize(this.get('objectType')).toLowerCase();
        var objectTypePerm = Ext.String.format('admin_{0}_modify', pluralname);
        var canUpdate = theAttribute.get('_can_modify');
        try {
            this.set('toolAction._canAdd', (
                theSession.get('rolePrivileges')[objectTypePerm] ||
                !theSession.get('rolePrivileges').admin_all_readonly
            ));
        } catch (error) {
            CMDBuildUI.util.Logger.log("Unable to set addButton privileges", CMDBuildUI.util.Logger.levels.debug);
        }
        this.set('toolAction._canAdd', !theSession.get('admin_all_readonly'));
        this.set('toolAction._canOpen', true);
        var obj = CMDBuildUI.util.helper.ModelHelper.getObjectFromName(this.get('objectTypeName'));
        var canAdd = obj.get('_can_modify');
        if (obj.objectType === CMDBuildUI.util.helper.ModelHelper.objecttypes.domain) {
            canAdd = true;
        }
        this.set('toolAction._canUpdate', canUpdate);
        this.set('toolAction._canActiveToggle', canUpdate && canAdd);
        this.set('toolAction._canClone', canAdd);

        if (!theAttribute.get('inherited')) {
            this.set('toolAction._canDelete', canUpdate && canAdd);
        }
        if (data.objectType.toLowerCase() !== 'domain' && theAttribute.getId() === 'Description') {
            this.set('toolAction._canActiveToggle', false);
        }
    }
});