Ext.define('CMDBuildUI.view.administration.content.importexport.gatetemplates.card.tabitems.templates.card.CardModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.view-administration-content-importexport-gatetemplates-tabitems-templates-card',
    data: {
        actions: {
            view: true,
            edit: false,
            add: false
        },

        toolAction: {
            _canAdd: false,
            _canClone: false,
            _canUpdate: false,
            _canDelete: false,
            _canActiveToggle: false
        },
        classAttributes: null,
        freeAttributesFilters: []
    },
    formulas: {
        toolsManager: {
            bind: {
                canModify: '{theSession.rolePrivileges.admin_etl_modify}'
            },
            get: function (data) {
                this.set('toolAction._canAdd', data.canModify === true);
                this.set('toolAction._canClone', data.canModify === true);
                this.set('toolAction._canUpdate', data.canModify === true);
                this.set('toolAction._canDelete', data.canModify === true);
                this.set('toolAction._canActiveToggle', data.canModify === true);
            }
        },

        gateTypes: function () {
            CMDBuildUI.util.administration.helper.ModelHelper.getGateTypes();
        },

        isClone: {
            bind: '{theGateTemplate}',
            get: function (theGateTemplate) {
                return (theGateTemplate && theGateTemplate.phantom) || false;
            }
        },

        panelTitle: {
            bind: '{theGateTemplate.description}',
            get: function (description) {
                var title = Ext.String.format(
                    '{0} - {1}',
                    CMDBuildUI.locales.Locales.administration.importexport.texts.importexportgatetemplate,
                    description
                );
                this.getParent().set('title', title);
            }
        },

        allClassesOrDomainsData: {
            bind: '{theGateTemplate.targetType}',
            get: function (targetType) {
                return Ext.getStore('classes.Classes').getData().items.filter(function (item) {
                    return !item.get('prototype') && item.get('type') === 'standard';
                });
            }
        },
        classAttributesManager: {
            bind: '{theGateTemplate.targetName}',
            get: function (className) {
                var me = this;
                var klass = CMDBuildUI.util.helper.ModelHelper.getObjectFromName(className);
                var allAttributes = [];
                me.set('allAttributes', null);
                if (klass) {
                    me.set('geoAttributesUrl', CMDBuildUI.util.api.Classes.getGeoAttributes(klass.get('name')));
                    klass.getAttributes().then(function (attributesStore) {
                        if (!me.destroyed) {
                            me.set('allClassAttributesStore', attributesStore);
                            // GET geoattribute and merge the data
                            me.get('geoAttributesStore').load(function (geoAttributes) {
                                var geoAttributesStore = this;
                                attributesStore.each(function (attribute) {
                                    // ['_type', '_typeLabel', '_subtype', 'name', 'description', 'targetClass']
                                    if (attribute.canAdminShow()) {
                                        allAttributes.push({
                                            _type: 'attribute',
                                            _typeLabel: CMDBuildUI.locales.Locales.administration.attributes.attributes,
                                            _subtype: attribute.get('type'),
                                            name: attribute.get('name'),
                                            description: attribute.get('description'),
                                            targetClass: attribute.get('targetClass')
                                        });
                                    }
    
                                });
                                geoAttributesStore.each(function (geoAttribute) {
                                    // ['type', '_typeLabel', 'subtype', 'name', 'description', 'targetClass']
    
                                    if (geoAttribute.get('type') === 'geometry') {
                                        allAttributes.push({
                                            _type: 'geoattribute',
                                            _typeLabel: CMDBuildUI.locales.Locales.administration.classes.strings.geaoattributes,
                                            _subtype: geoAttribute.get('subtype'),
                                            name: geoAttribute.get('name'),
                                            description: geoAttribute.get('description'),
                                            targetClass: geoAttribute.get('targetClass')
                                        });
                                    }
    
    
                                });
                                me.set('allAttributes', allAttributes);
                                me.filterFreeAttributes();
                            });
                        }
                    });
                }
            }
        },
        mergeModeManager: {
            bind: '{theGateTemplate.mergeMode}',
            get: function (mergeMode) {
                if (mergeMode === CMDBuildUI.model.importexports.Template.missingRecords.modifycard) {
                    this.set('isModifyCard', true);
                } else {
                    this.set('isModifyCard', false);
                }
            }
        },
        gridAttributesData: {
            bind: '{theGateTemplate.columns}',
            get: function (columns) {
                if (columns) {
                    Ext.Array.forEach(columns.getRange(), function (item, index) {
                        item.set('index', index);
                    });
                    return columns.getRange();
                }
                return [];
            }
        },

        mergeModes: {
            get: function () {
                return CMDBuildUI.model.importexports.Template.getMergeModes();
            }
        },

        attributeModes: {
            get: function () {
                return Ext.Array.merge([], CMDBuildUI.model.importexports.Attribute.getAttributeModes(), [{
                    value: CMDBuildUI.model.importexports.GateAttribute.relativelocation,
                    label: CMDBuildUI.locales.Locales.administration.gates.relativelocation
                }]);
            }
        },
        gateManager: {
            bind: {
                gateId: '{theGate._id}',
                theGateTemplate: '{theGateTemplate}'
            },
            get: function (data) {
                if (data.gateId && data.theGateTemplate) {
                    data.theGateTemplate.columns().each(function (col, index) {
                        col.set('index', index);
                    });
                    this.set('theGateTemplate.gateId', data.gateId);
                }
            }
        },
        mergemodeAttribute: {
            bind: {
                attribute: '{theGateTemplate.mergeMode_when_missing_update_attr}',
                allAttributes: '{allClassAttributesStore}'
            },
            get: function (data) {
                var vm = this;
                var view = this.getView();
                Ext.asap(function () {
                    if (data.attribute && data.allAttributes) {
                        var container = view.down('#valueContainer');
                        container.removeAll();
                        var attribute = CMDBuildUI.util.helper.ModelHelper.getModelFieldFromAttribute(data.allAttributes.findRecord('name', data.attribute));
                        vm.set('_merge_attribute', attribute);
                        var editor = CMDBuildUI.util.helper.FormHelper.getEditorForField(
                            attribute
                        );
                        if (!editor.listeners) {
                            editor.listeners = {};
                        }
                        editor.listeners.beforedestroy = function (input, newValue, oldValue) {
                            var template = input.lookupViewModel().get('theGateTemplate');
                            if (template) {
                                template.set('mergeMode_when_missing_update_value', '');
                            }
                        };
                        var display = CMDBuildUI.util.helper.FormHelper.getReadOnlyField(
                            attribute, editor.recordLinkName
                        );

                        var field = {
                            itemId: 'mergeMode_when_missing_update_value_display',
                            bind: {
                                value: '{theGateTemplate._mergeMode_when_missing_update_value_description}',
                                hidden: '{!actions.view}'
                            }
                        };

                        field.renderer = function (value) {
                            return value;
                        };

                        container.add([
                            Ext.merge({}, editor, {
                                allowBlank: false,
                                itemId: 'mergeMode_when_missing_update_value_input',
                                bind: {
                                    value: '{theGateTemplate.mergeMode_when_missing_update_value}',
                                    hidden: '{actions.view}'
                                }
                            }),
                            Ext.merge({}, display, field)

                        ]);
                    }
                });
            }
        },
        keyAttributesData: {
            bind: {
                importKeyAttribute: '{theGateTemplate._importKeyAttribute}',
                allAttributes: '{assignedAttributes}'
            },
            get: function (data) {
                var me = this;
                if (data.allAttributes && data.allAttributes.length) {
                    var attributes = (typeof data.importKeyAttribute === 'string') ? data.importKeyAttribute.split(',') : data.importKeyAttribute,
                        _attributes = [];

                    if (!Ext.isEmpty(data.importKeyAttribute)) {
                        Ext.Array.forEach(attributes, function (_attribute) {
                            var fullAttribute = Ext.Array.findBy(data.allAttributes, function (attribute) {
                                return attribute.name === _attribute;
                            });
                            if (fullAttribute) {
                                _attributes.push({
                                    name: _attribute,
                                    description: fullAttribute.description
                                });
                            }
                        });
                    }
                    var freeKeyAttributes = [];
                    me.set('freeKeyAttributes', null);
                    Ext.Array.forEach(data.allAttributes, function (_attribute) {
                        if (attributes.indexOf(_attribute.name) < 0) {
                            freeKeyAttributes.push({
                                name: _attribute.name,
                                description: _attribute.description
                            });
                        }
                    });
                    me.set('freeKeyAttributes', freeKeyAttributes);
                    return _attributes;
                }
                return [];
            }
        }
    },
    filterFreeAttributes: function () {
        var me = this;
        me.set('freeAttributes', []);
        var allAttributes = me.get('allAttributes'),
            freeAttributes = [],
            assignedAttributes = [];
        Ext.Array.forEach(allAttributes, function (attribute) {
            if (!me.get('theGateTemplate.columns').findRecord('attribute', attribute.name)) {
                freeAttributes.push(attribute);
            } else {
                assignedAttributes.push(attribute);
            }
        });
        me.set('assignedAttributes', assignedAttributes);
        me.set('freeAttributes', freeAttributes);
    },
    stores: {
        attributeModesReferenceStore: {
            model: 'CMDBuildUI.model.base.ComboItem',
            proxy: {
                type: 'memory'
            },
            data: '{attributeModes}'
            // autoDestroy: true
        },
        attributeModesLookupStore: {
            model: 'CMDBuildUI.model.base.ComboItem',
            filters: [function (item) {
                return item.get('value') !== CMDBuildUI.model.importexports.GateAttribute.relativelocation;
            }],
            data: '{attributeModes}'
            // autoDestroy: true
        },
        allEmailAccounts: {
            type: 'chained',
            source: 'emails.Accounts',
            autoLoad: true,
            autoDestroy: true
        },

        errorEmailTemplatesStore: {
            type: 'chained',
            source: 'emails.Templates',
            autoLoad: true,
            autoDestroy: true
        },
        notificationEmailTemplates: {
            type: 'chained',
            source: 'emails.Templates',
            autoLoad: true,
            autoDestroy: true
        },
        gateTypesTore: {
            model: 'CMDBuildUI.model.base.ComboItem',
            data: '{gateTypes}',
            autoDestroy: true
        },

        classAtributesStore: {
            fields: ['code', 'description'],
            data: '{classAttributes}',
            autoDestroy: true
        },
        geoAttributesStore: {
            model: 'CMDBuildUI.model.map.GeoAttribute',
            proxy: {
                type: 'baseproxy',
                url: '{geoAttributesUrl}'
            },
            autoDestroy: true,
            autoLoad: false
        },
        allAttributesStore: {
            fields: ['_type', '_typeLabel', '_subType', 'name', 'description', 'targetClass'],
            data: '{allAttributes}',
            proxy: {
                type: 'memory'
            },
            autoDestroy: true
        },

        freeAttributesStore: {
            fields: ['_type', '_typeLabel', '_subType', 'name', 'description', 'targetClass'],
            data: '{freeAttributes}',
            proxy: {
                type: 'memory'
            },
            grouper: {
                property: '_typeLabel'
            },
            autoDestroy: true
        },
        attributeToEdit: {
            source: '{theGateTemplate.columns}',
            autoDestroy: true
        },
        allSelectedAttributesStore: {
            proxy: {
                type: 'memory'
            },
            model: 'CMDBuildUI.model.importexports.GateAttribute',
            data: '{gridAttributesData}',
            sorters: 'index',
            autoDestroy: true
        },

        newSelectedAttributesStore: {
            proxy: {
                type: 'memory'
            },
            model: 'CMDBuildUI.model.importexports.GateAttribute',
            data: [CMDBuildUI.model.importexports.GateAttribute.create()],
            autoDestroy: true
        },
        newKeyAttributesStore: {
            fields: ['attribute'],
            proxy: {
                type: 'memory'
            },
            data: [{
                attribute: ''
            }],
            autoDestroy: true
        },
        freeKeyAttributesStore: {
            proxy: {
                type: 'memory'
            },
            data: '{freeKeyAttributes}',
            autoDestroy: true
        },
        mergeModesStore: {
            model: 'CMDBuildUI.model.base.ComboItem',
            proxy: {
                type: 'memory'
            },
            data: '{mergeModes}',
            autoDestroy: true
        },
        keyAttributesStore: {
            proxy: {
                type: 'memory'
            },
            data: '{keyAttributesData}',
            autoDestroy: true
        }
    }
});