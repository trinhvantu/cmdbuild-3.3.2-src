Ext.define('CMDBuildUI.view.administration.components.attributes.fieldscontainers.typeproperties.Lookup', {
    extend: 'Ext.form.Panel',
    alias: 'widget.administration-attribute-lookupfields',
    listeners: {
        hide: function (component, eOpts) {
            var input = component.down('#lookupTypeName_input');
            input.setValue('');
            CMDBuildUI.util.administration.helper.FieldsHelper.setAllowBlank(input, true, input.up('form'));
        },
        show: function (component, eOpts) {
            var input = component.down('#lookupTypeName_input');
            CMDBuildUI.util.administration.helper.FieldsHelper.setAllowBlank(input, false, input.up('form'));
        }
    },
    items: [{
        // add - edit
        xtype: 'container',
        hidden: true,
        bind: {
            hidden: '{actions.view}'
        },
       
        items: [{
            layout: 'column',
            items: [{
                columnWidth: 0.5,
                xtype: 'fieldcontainer',
                layout: 'column',
                fieldLabel: CMDBuildUI.locales.Locales.administration.attributes.fieldlabels.lookup,
                localized: {
                    fieldLabel: 'CMDBuildUI.locales.Locales.administration.attributes.fieldlabels.lookup'
                },
                items: [{
                    // ADD / EDIT
                    columnWidth: 1,
                    xtype: 'combo',
                    itemId: 'lookupTypeName_input',
                    name: 'lookup',
                    clearFilterOnBlur: false,
                    anyMatch: true,
                    queryMode: 'local',
                    autoSelect: true,
                    forceSelection: true,
                    displayField: 'name',
                    valueField: '_id',
                    bind: {
                        value: '{theAttribute.lookupType}',
                        store: '{lookupStore}',
                        disabled: '{actions.edit}',
                        hidden: '{actions.view}'
                    }
                }]
            }, {
                columnWidth: 0.5,
                xtype: 'textarea',
                fieldLabel: CMDBuildUI.locales.Locales.administration.attributes.fieldlabels.filter,
                localized: {
                    fieldLabel: 'CMDBuildUI.locales.Locales.administration.attributes.fieldlabels.filter'
                },
                name: 'filter',
                bind: {
                    value: "{theAttribute.filter}"
                },
                resizable: {
                    handles: "s"
                },
                labelToolIconCls: 'fa-list',
                labelToolIconQtip: 'Edit metadata',
                labelToolIconClick: 'onEditMetadataClickBtn'
            }]
        }, {
            layout: 'column',
            items: [{
                columnWidth: 0.5,
                xtype: 'checkbox',
                fieldLabel: CMDBuildUI.locales.Locales.administration.attributes.fieldlabels.preselectifunique,
                localized: {
                    fieldLabel: 'CMDBuildUI.locales.Locales.administration.attributes.fieldlabels.preselectifunique'
                },
                name: 'preselectIfUnique',
                bind: {
                    value: '{theAttribute.preselectIfUnique}'
                }
            }]

        }]
    }, {
        // view
        xtype: 'container',
        bind: {
            hidden: '{!actions.view}'
        },
        items: [{
            layout: 'column',
            items: [{
                columnWidth: 0.5,
                xtype: 'displayfield',
                fieldLabel: CMDBuildUI.locales.Locales.administration.attributes.fieldlabels.lookup,
                localized: {
                    fieldLabel: 'CMDBuildUI.locales.Locales.administration.attributes.fieldlabels.lookup'
                },
                bind: {
                    value: '{theAttribute.lookupType}',
                    hidden: '{!actions.view}'
                }
            }, {
                columnWidth: 0.5,
                xtype: 'textarea',
                itemId: 'attribute-filterField',
                fieldLabel: CMDBuildUI.locales.Locales.administration.attributes.fieldlabels.filter,
                localized: {
                    fieldLabel: 'CMDBuildUI.locales.Locales.administration.attributes.fieldlabels.filter'
                },
                name: 'filter',
                readOnly: true,
                bind: {
                    value: "{theAttribute.filter}"
                },
                resizable: {
                    handles: "s"
                },
                labelToolIconCls: 'fa-list',
                labelToolIconQtip: 'Show metadata',
                labelToolIconClick: 'onViewMetadataClick'
            }]
        }, {
            layout: 'column',
            items: [{
                columnWidth: 0.5,
                xtype: 'checkbox',
                fieldLabel: CMDBuildUI.locales.Locales.administration.attributes.fieldlabels.preselectifunique,
                localized: {
                    fieldLabel: 'CMDBuildUI.locales.Locales.administration.attributes.fieldlabels.preselectifunique'
                },
                name: 'preselectIfUnique',
                bind: {
                    value: '{theAttribute.preselectIfUnique}',
                    readOnly: '{actions.view}'
                }
            }]
        }]
    }]
});