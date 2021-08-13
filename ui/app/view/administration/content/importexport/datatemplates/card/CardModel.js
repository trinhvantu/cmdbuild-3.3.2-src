Ext.define('CMDBuildUI.view.administration.content.importexport.datatemplates.card.CardModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.view-administration-content-importexport-datatemplates-card',
    data: {
        gridAttributeDataNew: CMDBuildUI.model.importexports.Attribute.create(),
        actions: {
            view: true,
            edit: false,
            add: false
        },
        isExport: false,
        isImport: false,
        isModifyCard: false,
        isImportWithSource: false,
        isCsv: false,
        isExcell: false,
        isClass: false,
        isDomain: false,
        isAttributeGridHidden: true,
        isAttributeGridNewHidden: true,
        allClassOrDomainsAtributesData: [],
        fieldsadded: false,
        toolAction: {
            _canAdd: false,
            _canClone: false,
            _canUpdate: false,
            _canDelete: false,
            _canActiveToggle: false
        },
        dataFormatHidden: true,
        dataFormatDecimalHidden: true,
        dataFormatTimeHidden: true,
        dataFormatDateTimeHidden: true,
        dataFormatDateHidden: true,
        typeHidden: false,
        fileFormatHidden: false
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
        templateTypes: {
            get: function () {
                return CMDBuildUI.model.importexports.Template.getTemplateTypes();
            }
        },
        targetTypes: {
            get: function () {
                return CMDBuildUI.model.importexports.Template.getTargetTypes();
            }
        },
        fileTypes: {
            bind: '{theGateTemplate.type}',
            get: function (type) {
                return CMDBuildUI.model.importexports.Template.getFileTypes(type);
            }
        },
        mergeModes: {
            get: function () {
                return CMDBuildUI.model.importexports.Template.getMergeModes();
            }
        },
        csvSeparators: {
            get: function () {
                return CMDBuildUI.model.importexports.Template.getCsvSeparators();
            }
        },
        attributeModes: {
            get: function () {
                return CMDBuildUI.model.importexports.Attribute.getAttributeModes();
            }
        },
        defaultDomainsAttributes: {
            get: function () {
                return CMDBuildUI.model.importexports.Attribute.getDefaultDomainsAttributes();
            }
        },
        importModes: {
            get: function () {
                return CMDBuildUI.util.administration.helper.ModelHelper.getImportModes();
            }
        },
        dateFormatsData: {
            get: function () {
                return CMDBuildUI.util.administration.helper.ModelHelper.dateFormatsData();
            }
        },

        timeFormatsData: {
            get: function () {
                return CMDBuildUI.util.administration.helper.ModelHelper.timeFormatsData();
            }
        },
        dateTimeFormat: {
            bind: {
                dateFormat: '{theGateTemplate.dateFormat}',
                timeFormat: '{theGateTemplate.timeFormat}'
            },
            get: function (data) {
                var timeFormat = Ext.Array.findBy(this.get('timeFormatsData') || [], function (item) {
                    return item.value === data.timeFormat;
                });
                var dateFormat = Ext.Array.findBy(this.get('dateFormatsData') || [], function (item) {
                    return item.value === data.dateFormat;
                });
                if (Ext.isEmpty(dateFormat) && Ext.isEmpty(timeFormat)) {
                    return CMDBuildUI.locales.Locales.main.preferences.defaultvalue;
                } else if (Ext.isEmpty(dateFormat) && !Ext.isEmpty(timeFormat)) {
                    return Ext.String.format('{0} {1}', CMDBuildUI.locales.Locales.main.preferences.defaultvalue, timeFormat.label);
                } else if (!Ext.isEmpty(dateFormat) && Ext.isEmpty(timeFormat)) {
                    return Ext.String.format('{0} {1}', dateFormat.label, CMDBuildUI.locales.Locales.main.preferences.defaultvalue);
                } else {
                    return Ext.String.format('{0} {1}', dateFormat.label, timeFormat.label);
                }
            }
        },
        decimalsSeparatorsData: {
            get: function () {
                return CMDBuildUI.util.administration.helper.ModelHelper.decimalsSeparatorsData();
            }
        },
        mergeModeValue: {
            bind: {
                attribute: '{theGateTemplate.mergeMode_when_missing_update_attr}',
                value: '{theGateTemplate.mergeMode_when_missing_update_value}',
                allAttributes: '{allClassOrDomainsAtributes}'
            },
            get: function (data) {
                var me = this;
                if (data.attribute && data.allAttributes && data.value && data.value.length) {

                    var attribute = data.allAttributes.findRecord('name', data.attribute, false, false, true, true);
                    switch (attribute.get('type')) {
                        case 'date':
                            if (Ext.isDate(new Date(data.value))) {
                                me.set('theGateTemplate.mergeMode_when_missing_update_value', new Date(data.value));
                                me.set('theGateTemplate._mergeMode_when_missing_update_value_description', CMDBuildUI.util.helper.FieldsHelper.renderDateField(data.value));
                            }
                            break;
                        case 'dateTime':
                            if (Ext.isDate(new Date(data.value))) {
                                me.set('theGateTemplate.mergeMode_when_missing_update_value', new Date(data.value));
                                me.set('theGateTemplate._mergeMode_when_missing_update_value_description', CMDBuildUI.util.helper.FieldsHelper.renderTimestampField(data.value));
                            }
                            break;
                        case 'lookup':
                            var lookupType = CMDBuildUI.model.lookups.LookupType.getLookupTypeFromName(attribute.get('lookupType'));
                            lookupType.getLookupValues().then(function (values) {
                                if (!me.destroyed) {
                                    var lookupValue = values.getById(data.value);
                                    if (lookupValue) {
                                        me.set("theGateTemplate._mergeMode_when_missing_update_value_description", lookupValue.get("description"));
                                    }
                                }
                            });
                            break;
                        case 'reference':
                            var cb = function (record) {
                                if (!me.destroyed) {
                                    me.set("theGateTemplate._mergeMode_when_missing_update_value_description", record.get("Description"));
                                }
                            };
                            switch (attribute.get("targetType")) {
                                case CMDBuildUI.util.helper.ModelHelper.objecttypes.klass:
                                    CMDBuildUI.util.api.Client.getRemoteCard(attribute.get("targetClass"), data.value).then(cb);
                                    break;
                                case CMDBuildUI.util.helper.ModelHelper.objecttypes.process:
                                    CMDBuildUI.util.api.Client.getRemoteProcessInstance(attribute.get("targetClass"), data.value).then(cb);
                                    break;
                                default:
                                    break;
                            }
                            break;
                        default:
                            me.set('theGateTemplate._mergeMode_when_missing_update_value_description', data.value);
                            break;
                    }
                }
            }
        },
        mergemodeAttribute: {
            bind: {
                attribute: '{theGateTemplate.mergeMode_when_missing_update_attr}',
                allAttributes: '{allClassOrDomainsAtributes}'
            },
            get: function (data) {
                var vm = this;
                var view = this.getView();
                Ext.asap(function () {
                    if (data.attribute && data.allAttributes) {
                        var container = view.down('#valueContainer');
                        container.removeAll();

                        var attribute = CMDBuildUI.util.helper.ModelHelper.getModelFieldFromAttribute(data.allAttributes.findRecord('name', data.attribute, false, false, true, true));
                        vm.set('_merge_attribute', attribute);
                        var editor = CMDBuildUI.util.helper.FormHelper.getEditorForField(
                            attribute
                        );
                        if (!editor.listeners) {
                            editor.listeners = {};
                        }
                        editor.listeners.beforedestroy = function (input, newValue, oldValue) {
                            var _vm = input.lookupViewModel();
                            var template = _vm.get('theGateTemplate');
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
        isAttributeGridHiddenManager: {
            bind: {
                targetName: '{theGateTemplate.targetName}',
                type: '{theGateTemplate.type}'
            },
            get: function (data) {
                if (data.type && data.targetName) {
                    this.set('isAttributeGridHidden', false);
                    if (!this.get('actions.view')) {
                        this.set('isAttributeGridNewHidden', false);
                    }
                } else {
                    this.set('isAttributeGridHidden', true);
                    if (!this.get('actions.view')) {
                        this.set('isAttributeGridNewHidden', true);
                    }
                }
                if (this.get('actions.view')) {
                    this.set('isAttributeGridNewHidden', true);
                }
            }
        },
        isTargetNameDisabled: {
            bind: '{theGateTemplate.targetName}',
            get: function (targetName) {
                if (this.get('disabledTargetTypeName') || (typeof targetName === 'string' && targetName && !this.get('actions.view'))) {
                    return true;
                }
                return false;
            }
        },
        isTargetTypeDisabled: {
            bind: '{theGateTemplate.targetType}',
            get: function (targetType) {
                if (this.get('disabledTargetTypeName') || (typeof targetType === 'string' && targetType && !this.get('actions.view'))) {
                    return true;
                }
                return false;
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
        allClassOrDomainsAtributesDataManager: {
            bind: {
                targetType: '{theGateTemplate.targetType}',
                targetName: '{theGateTemplate.targetName}',
                type: '{theGateTemplate.type}'
            },
            get: function (data) {
                var me = this;
                if (data.targetType && data.targetName && data.type) {
                    me.set('isClass', data.targetType === CMDBuildUI.model.administration.MenuItem.types.klass);
                    me.set('isDomain', data.targetType === CMDBuildUI.model.administration.MenuItem.types.domain);
                }
            }
        },
        allClassOrDomainsAttributesFilter: {
            bind: {
                attributesGridStore: '{allSelectedAttributesStore}'
            },
            deep: true,
            get: function (data) {
                var me = this;
                var allAttrStore = me.get('theGateTemplate.columns');
                if (allAttrStore) {
                    return [function (item) {
                        try {
                            // some system attributes do not have a description
                            // set the description equal to the name
                            if (!item.get('description')) {
                                item.set('description', item.get('name'));
                            }
                            return item.canAdminShow( /*allowedAttributes*/ ['IdTenant', 'Notes']) && !allAttrStore.findRecord('attribute', item.get('name'), false, false, true, true);
                        } catch (e) {
                            return true;
                        }
                    }];
                } else {
                    return [];
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
        typeManager: {
            bind: {
                type: '{theGateTemplate.type}',
                fileFormat: '{theGateTemplate.fileFormat}'
            },
            get: function (data) {
                switch (data.type) {
                    case CMDBuildUI.model.importexports.Template.types.import:
                        var formatsWithSource = [
                            CMDBuildUI.model.importexports.Template.fileTypes.ifc,
                            CMDBuildUI.model.importexports.Template.fileTypes.database
                        ];
                        this.set('isImportWithSource', formatsWithSource.indexOf(data.fileFormat) > -1);
                        if (data.fileFormat === CMDBuildUI.model.importexports.Template.fileTypes.ifc) {
                            this.set('sourceInputLabel', Ext.String.format('{0} *', CMDBuildUI.locales.Locales.administration.importexport.texts.filepath)); // TODO translate
                        } else if (data.fileFormat === CMDBuildUI.model.importexports.Template.fileTypes.database) {
                            this.set('sourceInputLabel', Ext.String.format('{0} *', CMDBuildUI.locales.Locales.administration.importexport.texts.tablename)); // TODO translate
                        }
                        this.set('isImport', true);
                        this.set('isExport', false);
                        break;
                    case CMDBuildUI.model.importexports.Template.types.export:
                        this.set('isImportWithSource', false);
                        this.set('isImport', false);
                        this.set('isExport', true);
                        break;
                    case CMDBuildUI.model.importexports.Template.types.importexport:
                        this.set('isImportWithSource', false);
                        this.set('isImport', true);
                        this.set('isExport', true);
                        break;

                    default:
                        break;
                }
            }
        },

        fileFormatManager: {
            bind: '{theGateTemplate.fileFormat}',
            get: function (fileFormat) {
                switch (fileFormat) {
                    case 'csv':
                        this.set('isCsv', true);
                        this.set('isExcell', false);
                        break;
                    case 'xls':
                    case 'xlsx':
                        this.set('isCsv', false);
                        this.set('isExcell', true);
                        break;
                    default:
                        this.set('isCsv', false);
                        this.set('isExcell', false);
                        break;
                }
            }
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
                var fileFormat = this.get('theGateTemplate.fileFormat');
                var importTypeTitle = CMDBuildUI.locales.Locales.administration.importexport.texts.importexportdatatemplate;
                if (CMDBuildUI.model.importexports.Template.fileTypes.cad === fileFormat) {
                    importTypeTitle = CMDBuildUI.locales.Locales.administration.gates.addgistemplate;
                } else if (CMDBuildUI.model.importexports.Template.fileTypes.database === fileFormat) {
                    this.set('typeHidden', true);
                    this.set('fileFormatHidden', true);
                    importTypeTitle = CMDBuildUI.locales.Locales.administration.gates.adddatabasetemplate;
                } else if (CMDBuildUI.model.importexports.Template.fileTypes.ifc === fileFormat) {
                    this.set('typeHidden', true);
                    this.set('fileFormatHidden', true);
                    importTypeTitle = CMDBuildUI.locales.Locales.administration.gates.addifctemplate;
                }
                var title = Ext.String.format(
                    '{0} - {1}',
                    importTypeTitle,
                    description
                );
                this.getParent().set('title', title);
            }
        },

        allClassesOrDomainsData: {
            bind: '{theGateTemplate.targetType}',
            get: function (targetType) {
                switch (targetType) {
                    case CMDBuildUI.model.administration.MenuItem.types.klass:
                        return Ext.getStore('classes.Classes').getData().items.filter(function (item) {
                            return !item.get('prototype') && item.get('type') === 'standard';
                        });
                    case CMDBuildUI.model.administration.MenuItem.types.domain:
                        return Ext.getStore('domains.Domains').getData().items;
                    default:
                        return [];
                }
            }
        },
        isAddMode: {
            bind: {
                importMode: '{theGateTemplate._importMode}'
            },
            get: function (data) {
                if (data.importMode === CMDBuildUI.model.importexports.Template.importModes.add) {
                    this.set('theGateTemplate.importKeyAttribute', null);
                    this.set('theGateTemplate.mergeMode', CMDBuildUI.model.importexports.Template.missingRecords.nomerge);
                    return true;
                }
                if (this.get('theGateTemplate.mergeMode') === CMDBuildUI.model.importexports.Template.missingRecords.nomerge) {
                    this.set('theGateTemplate.mergeMode', null);
                }
                return false;
            }
        },
        notificationEmailTemplates: {
            bind: {
                store: '{notificationEmailTemplatesStore}'
            },
            get: function (data) {
                return data.store;
            }
        },
        errorEmailTemplates: {
            bind: {
                store: '{errorEmailTemplatesStore}'
            },
            get: function (data) {
                return data.store;
            }
        },
        allEmailAccounts: {
            bind: {
                store: '{allEmailAccountsStore}'
            },
            get: function (data) {
                return data.store;
            }
        },
        keyAttributesData: {
            bind: {
                importKeyAttribute: '{theGateTemplate._importKeyAttribute}',
                assignedAttributes: '{assignedAttributes}'
            },
            get: function (data) {
                var me = this;
                if (data.assignedAttributes && data.assignedAttributes.length) {
                    var attributes = (typeof data.importKeyAttribute === 'string') ? data.importKeyAttribute.split(',') : data.importKeyAttribute,
                        _attributes = [];

                    if (!Ext.isEmpty(data.importKeyAttribute)) {
                        Ext.Array.forEach(attributes, function (_attribute) {
                            var fullAttribute = Ext.Array.findBy(data.assignedAttributes, function (attribute) {
                                return attribute.get('name') === _attribute;
                            });
                            if (fullAttribute) {
                                _attributes.push({
                                    name: _attribute,
                                    description: fullAttribute.get('description')
                                });
                            }
                        });
                    }
                    var freeKeyAttributes = [];
                    me.set('freeKeyAttributes', null);
                    Ext.Array.forEach(data.assignedAttributes, function (_attribute) {
                        if (attributes.indexOf(_attribute.get('name')) < 0) {
                            freeKeyAttributes.push({
                                name: _attribute.get('name'),
                                description: _attribute.get('description')
                            });
                        }
                    });
                    me.set('freeKeyAttributes', freeKeyAttributes);
                    return _attributes;
                }
                return [];
            }
        },
        classAttributesManager: {
            bind: '{theGateTemplate.targetName}',
            get: function (className) {
                var me = this;
                var klass = CMDBuildUI.util.helper.ModelHelper.getObjectFromName(className);
                me.set('allAttributes', null);
                if (klass) {
                    klass.getAttributes().then(function (attributesStore) {
                        me.set('allAttributes', attributesStore.getRange());
                        me.set('allClassAttributesStore', attributesStore);
                        me.filterFreeAttributes();
                    });
                }
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
            if (!me.get('allSelectedAttributesStore').findRecord('attribute', attribute.get('name'))) {
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
        },

        allClassesOrDomains: {
            fields: ['name', 'description'],
            proxy: {
                type: 'memory'
            },
            data: '{allClassesOrDomainsData}'
        },
        allClassOrDomainsAtributes: {
            data: '{allClassOrDomainAttributes}',
            sorters: 'description'
        },
        allClassOrDomainsAtributesFiltered: {
            source: '{allClassOrDomainsAtributes}',
            sorters: 'description',
            filters: '{allClassOrDomainsAttributesFilter}'
        },
        allSelectedAttributesStore: {
            proxy: {
                type: 'memory'
            },
            model: 'CMDBuildUI.model.importexports.Attribute',
            data: '{gridAttributesData}',
            sorters: 'index',
            listeners: {
                datachanged: 'onAllSelectedAttributesStoreDatachanged'
            }
        },
        newSelectedAttributesStore: {
            proxy: {
                type: 'memory'
            },
            model: 'CMDBuildUI.model.importexports.Attribute',
            data: [CMDBuildUI.model.importexports.Attribute.create()]
        },

        allEmailAccountsStore: {
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
        notificationEmailTemplatesStore: {
            type: 'chained',
            source: 'emails.Templates',
            autoLoad: true,
            autoDestroy: true
        },
        templateTypesStore: {
            model: 'CMDBuildUI.model.base.ComboItem',
            proxy: {
                type: 'memory'
            },
            data: '{templateTypes}'
        },
        targetTypesStore: {
            model: 'CMDBuildUI.model.base.ComboItem',
            proxy: {
                type: 'memory'
            },
            data: '{targetTypes}'
        },
        fileTypesStore: {
            model: 'CMDBuildUI.model.base.ComboItem',
            proxy: {
                type: 'memory'
            },
            data: '{fileTypes}'
        },
        mergeModesStore: {
            model: 'CMDBuildUI.model.base.ComboItem',
            proxy: {
                type: 'memory'
            },
            data: '{mergeModes}'
        },
        csvSeparatorsStore: {
            model: 'CMDBuildUI.model.base.ComboItem',
            proxy: {
                type: 'memory'
            },
            data: '{csvSeparators}'
        },
        defaultDomainsAttributesStore: {
            proxy: 'memory',
            data: '{defaultDomainsAttributes}'
        },
        importModesStore: {
            proxy: 'memory',
            data: '{importModes}'
        },
        csvCharsetStore: {
            fields: ['_id', 'description'],
            proxy: {
                type: 'baseproxy',
                url: '/system/charsets'
            },
            pageSize: 0,
            autoLoad: true,
            autoDestroy: true
        },
        dateFormats: {
            model: 'CMDBuildUI.model.base.ComboItem',
            proxy: 'memory',
            data: '{dateFormatsData}',
            autoDestroy: true
        },
        timeFormats: {
            model: 'CMDBuildUI.model.base.ComboItem',
            proxy: 'memory',
            data: '{timeFormatsData}',
            autoDestroy: true
        },
        decimalsSeparators: {
            model: 'CMDBuildUI.model.base.ComboItem',
            proxy: 'memory',
            data: '{decimalsSeparatorsData}',
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
        keyAttributesStore: {
            proxy: {
                type: 'memory'
            },
            data: '{keyAttributesData}',
            autoDestroy: true
        }
    },

    resetAllAttributesStores: function () {
        var me = this;
        if (me.get('allClassOrDomainsAtributes')) {
            me.get('allClassOrDomainsAtributes').removeAll();
        }
        if (me.get('allClassOrDomainsAtributes')) {
            me.get('allClassOrDomainsAtributesFiltered').removeAll();
        }
        if (me.get('allSelectedAttributesStore')) {
            me.get('allSelectedAttributesStore').removeAll();
        }
        if (me.get('theGateTemplate.columns') && me.get('theGateTemplate.columns').isStore && me.get('actions.add')) {
            me.get('theGateTemplate.columns').removeAll();

        }
    },
    addDefaultDomainAttributes: function (classOrDomain) {
        var me = this;
        if (classOrDomain && classOrDomain.entityName === 'CMDBuildUI.model.domains.Domain') {
            Ext.Array.forEach(me.get('defaultDomainsAttributesStore').getRange(), function (item) {
                switch (item.get('attribute')) {
                    case 'IdObj1':
                        item.set('columnName', classOrDomain.get('source'));
                        break;
                    case 'IdObj2':
                        item.set('columnName', classOrDomain.get('destination'));
                        break;
                    default:
                        break;
                }
                if (me.get('theGateTemplate.columns').findExact('attribute', item.get('attribute')) < 0) {
                    me.get('theGateTemplate.columns').add(item);
                    if (me.get('allSelectedAttributesStore') && me.get('allSelectedAttributesStore').findExact('attribute', item.get('attribute')) < 0) {
                        me.get('allSelectedAttributesStore').add(item);
                    }
                }
            });
        }
    },

    manageDataFormatFieldset: function (item) {
        var me = this;
        var fileTypesToApply = [
            CMDBuildUI.model.importexports.Template.fileTypes.csv,
            CMDBuildUI.model.importexports.Template.fileTypes.xlsx,
            CMDBuildUI.model.importexports.Template.fileTypes.xls
        ];
        var theTemplate = me.get('theGateTemplate');
        if (theTemplate && fileTypesToApply.indexOf(theTemplate.get('fileFormat')) > -1) {
            switch (item.get('type')) {
                case CMDBuildUI.model.Attribute.types.date:
                    me.set('dataFormatHidden', false);
                    me.set('dataFormatDateHidden', false);
                    break;
                case CMDBuildUI.model.Attribute.types.time:
                    me.set('dataFormatHidden', false);
                    me.set('dataFormatTimeHidden', false);
                    break;
                case CMDBuildUI.model.Attribute.types.dateTime:
                    me.set('dataFormatHidden', false);
                    me.set('dataFormatTimeHidden', false);
                    me.set('dataFormatDateHidden', false);
                    me.set('dataFormatDateTimeHidden', false);
                    break;
                case CMDBuildUI.model.Attribute.types.double:
                case CMDBuildUI.model.Attribute.types.decimal:
                    me.set('dataFormatHidden', false);
                    me.set('dataFormatDecimalHidden', false);
                    break;
            }
        }
    }
});