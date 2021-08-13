Ext.define('CMDBuildUI.view.administration.components.attributes.grid.GridModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.administration-components-attributes-grid-grid',
    data: {
        selected: null,
        isOtherPropertiesHidden: true
    },

    formulas: {
        pluralObjectType: {
            bind: '{objectType}',
            get: function (objectType) {
                var pluralname = Ext.util.Inflector.pluralize(objectType).toLowerCase();
                var theSession = this.get('theSession');
                var objectTypePerm;
                switch (pluralname) {
                    case 'processes':
                    case 'classes':
                        objectTypePerm = Ext.String.format('admin_{0}_modify', pluralname);
                        try {                            
                            this.set('toolAction._canAdd', (
                                theSession.get('rolePrivileges')[objectTypePerm] &&
                                CMDBuildUI.util.helper.ModelHelper.getObjectFromName(this.get('objectTypeName')).get('_can_modify')
                            ));
                        } catch (error) {
                            CMDBuildUI.util.Logger.log("Unable to set addButton privileges", CMDBuildUI.util.Logger.levels.debug);
                        }
                        break;
                    case 'domains':
                        objectTypePerm = Ext.String.format('admin_{0}_modify', pluralname);
                        try {                            
                            this.set('toolAction._canAdd', theSession.get('rolePrivileges')[objectTypePerm]);
                        } catch (error) {
                            CMDBuildUI.util.Logger.log("Unable to set addButton privileges", CMDBuildUI.util.Logger.levels.debug);
                        }
                        break;
                    case 'dmsmodels':
                        try {
                            this.set('toolAction._canAdd', (
                                CMDBuildUI.util.helper.ModelHelper.getObjectFromName(this.get('objectTypeName')).get('_can_modify') &&
                                theSession.get('rolePrivileges').admin_dms_modify
                            ));
                        } catch (error) {
                            CMDBuildUI.util.Logger.log("Unable to set addButton privileges", CMDBuildUI.util.Logger.levels.debug);
                        }
                        break;

                    default:
                        break;
                }

                return;
            }
        },
        canDelete: {
            bind: {
                isInherited: '{theAttribute.inherited}'
            },
            get: function (data) {
                return (data.isInherited) ? false : true;
            }
        },

        setCurrentType: {
            bind: '{theAttribute.type}',
            get: function (type) {
                this.set('types.isDate', type === 'date');
                this.set('types.isDatetime', type === 'dateTime');
                this.set('types.isDecimal', type === 'decimal');
                this.set('types.isDouble', type === 'double');
                this.set('types.isForeignkey', type === 'foreignKey');
                this.set('types.isInteger', type === 'integer');
                this.set('types.isIpAddress', type === 'ipAddress');
                this.set('types.isLookup', type === 'lookup');
                this.set('types.isReference', type === 'reference');
                this.set('types.isString', type === 'string');
                this.set('types.isText', type === 'text');
                this.set('types.isTime', type === 'time');
                this.set('types.isTimestamp', type === 'timestamp');
            }
        },
        allAtrributesGorups: function (get) {
            var allAttributesStore = get('allAttributesStore');

            var groups = [],
                data = [];

            Ext.Array.each(allAttributesStore, function (attribute) {
                var attributeData = attribute.getData();
                if (attributeData.group && attributeData.group.length > 0) {
                    if (!Ext.Array.contains(groups, attributeData.group)) {
                        Ext.Array.include(groups, attributeData.group);
                        Ext.Array.include(data, {
                            label: attributeData.group,
                            value: attributeData.group
                        });
                    }
                }
            });

            return data;
        },

        isObjectyTypeNameSet: {
            bind: '{theProcess.name}',
            get: function (objectTypeName) {
                if (objectTypeName) {
                    return true;
                }
                return false;
            }
        }
    }

});