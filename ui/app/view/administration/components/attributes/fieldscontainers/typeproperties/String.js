Ext.define('CMDBuildUI.view.administration.components.attributes.fieldscontainers.typeproperties.String', {
    extend: 'Ext.form.Panel',
    alias: 'widget.administration-attribute-stringfields',
    config: {
        theAttribute: null,
        actions: {}
    },
    items: [{
        // add
        xtype: 'container',
        bind: {
            hidden: '{!actions.add}'
        },
        items: [{
            layout: 'column',

            items: [{
                columnWidth: 0.5,
                xtype: 'numberfield',
                step: 1,
                minValue: 1,
                fieldLabel: CMDBuildUI.locales.Locales.administration.attributes.fieldlabels.maxlength,
                localized: {
                    fieldLabel: 'CMDBuildUI.locales.Locales.administration.attributes.fieldlabels.maxlength'
                },
                name: 'maxLength',
                bind: {
                    value: '{theAttribute.maxLength}',
                    hidden: '{theAttribute.inherited}'
                }
            }, {
                columnWidth: 0.5,
                xtype: 'combo',
                fieldLabel: CMDBuildUI.locales.Locales.administration.attributes.fieldlabels.contentsecurity,
                localized: {
                    fieldLabel: 'CMDBuildUI.locales.Locales.administration.attributes.fieldlabels.contentsecurity'
                },
                valueField: 'value',
                displayField: 'label',
                name: 'textContentSecurity',
                queryMode: 'local',
                forceSelection: true,
                bind: {
                    value: '{theAttribute.textContentSecurity}',
                    store: '{textContentSecurityStore}'
                }
            }]
        }]
    }, {
        // edit
        xtype: 'container',
        bind: {
            hidden: '{!actions.edit}'
        },
        items: [{
            layout: 'column',

            items: [{
                xtype: 'fieldcontainer',
                layout: 'column',
                columnWidth: 0.5,
                fieldLabel: CMDBuildUI.locales.Locales.administration.attributes.fieldlabels.maxlength,
                localized: {
                    fieldLabel: 'CMDBuildUI.locales.Locales.administration.attributes.fieldlabels.maxlength'
                },
                items: [{
                    columnWidth: 1,
                    xtype: 'numberfield',
                    step: 1,
                    minValue: 1,
                    disabled: true,
                    name: 'maxLength',
                    bind: {
                        value: '{theAttribute.maxLength}',
                        disabled: '{theAttribute.inherited}'
                    }
                }]
            }, {
                columnWidth: 0.5,
                xtype: 'combo',
                fieldLabel: CMDBuildUI.locales.Locales.administration.attributes.fieldlabels.contentsecurity,
                localized: {
                    fieldLabel: 'CMDBuildUI.locales.Locales.administration.attributes.fieldlabels.contentsecurity'
                },
                valueField: 'value',
                displayField: 'label',
                name: 'textContentSecurity',
                forceSelection: true,
                bind: {
                    value: '{theAttribute.textContentSecurity}',
                    store: '{textContentSecurityStore}'
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
                step: 1,
                minValue: 1,
                fieldLabel: CMDBuildUI.locales.Locales.administration.attributes.fieldlabels.maxlength,
                localized: {
                    fieldLabel: 'CMDBuildUI.locales.Locales.administration.attributes.fieldlabels.maxlength'
                },
                name: 'maxLength',
                bind: {
                    value: '{theAttribute.maxLength}'
                }
            }, {
                // textContentSecurity
                columnWidth: 0.5,
                xtype: 'displayfield',
                fieldLabel: CMDBuildUI.locales.Locales.administration.attributes.fieldlabels.contentsecurity,
                localized: {
                    fieldLabel: 'CMDBuildUI.locales.Locales.administration.attributes.fieldlabels.contentsecurity'
                },
                bind: {
                    value: '{theAttribute.textContentSecurity}'
                },
                renderer: function (value) {
                    var vm = this.lookupViewModel();
                    var store = vm.get('textContentSecurityStore');
                    if (store) {
                        var record = store.findRecord('value', value);
                        if (record) {
                            return record.get('label');
                        }
                    }
                    return value;
                }
            }]
        }]
    }]
});