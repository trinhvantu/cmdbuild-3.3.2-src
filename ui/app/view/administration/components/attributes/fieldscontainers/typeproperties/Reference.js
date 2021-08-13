Ext.define('CMDBuildUI.view.administration.components.attributes.fieldscontainers.typeproperties.Reference', {

    required: ['CMDuildUI.util.administration.helper.FieldsHelper'],
    extend: 'Ext.form.Panel',
    alias: 'widget.administration-attribute-referencefields',
    listeners: {
        hide: function (component, eOpts) {
            var input = component.down('#attributedomain');
            input.setValue('');
            CMDBuildUI.util.administration.helper.FieldsHelper.setAllowBlank(input, true, input.up('form'));
        },
        show: function (component, eOpts) {
            var input = component.down('#attributedomain');
            CMDBuildUI.util.administration.helper.FieldsHelper.setAllowBlank(input, false, input.up('form'));
        }
    },
    items: [{
        // add / edit
        xtype: 'container',
        bind: {
            hidden: '{actions.view}'
        },
        items: [{
            layout: 'column',
            items: [{
                xtype: 'fieldcontainer',
                columnWidth: 0.5,
                layout: 'column',
                fieldLabel: CMDBuildUI.locales.Locales.administration.attributes.fieldlabels.domain,
                localized: {
                    fieldLabel: 'CMDBuildUI.locales.Locales.administration.attributes.fieldlabels.domain'
                },
                items: [{
                    columnWidth: 1,
                    xtype: 'combobox',
                    name: 'domain',
                    itemId: 'attributedomain',
                    clearFilterOnBlur: true,
                    queryMode: 'local',
                    displayField: 'description',
                    valueField: 'name',
                    forceSelection: true,
                    bind: {
                        value: '{theAttribute.domain}',
                        store: '{domainsStore}',
                        disabled: '{actions.edit}'
                    },

                    /**
                     * @override
                     * Uses {@link #getErrors} to build an array of validation errors. If any errors are found, they are passed to
                     * {@link #markInvalid} and false is returned, otherwise true is returned.
                     *
                     * Previously, subclasses were invited to provide an implementation of this to process validations - from 3.2
                     * onwards {@link #getErrors} should be overridden instead.
                     *
                     * @param {Object} value The value to validate
                     * @return {Boolean} True if all validations passed, false if one or more failed
                     */
                    validateValue: function (value) {
                        var me = this,
                            errors = me.getErrors(value),
                            vm = this.lookupViewModel(),
                            isValid;
                        
                        var type = this.up('fieldset').down('[name="type"]').getValue();
                        if (type === CMDBuildUI.util.helper.ModelHelper.cmdbuildtypes.reference) {

                            this.allowBlank = false;
                            var referenceExist = Ext.Array.findBy(vm.get('attributes'), function (attribute, index) {
                                return attribute.getId() !== vm.get('theAttribute').getId() && attribute.get('domain') === value &&
                                    attribute.get('type') === CMDBuildUI.util.helper.ModelHelper.cmdbuildtypes.reference;
                            });
                            if (referenceExist) {
                                var store = this.getStore();
                                var description = value;
                                if (store) {
                                    var record = store.findRecord('name', value);

                                    description = record && record.get('description');
                                }
                                var error = Ext.String.format(CMDBuildUI.locales.Locales.administration.domains.strings.referencealreadydefined,
                                    description,
                                    referenceExist.get('description')
                                );
                                errors.push(error);
                            }
                            isValid = Ext.isEmpty(errors);
                        } else {
                            this.allowBlank = true;
                            isValid = true;
                        }

                        if (!me.preventMark) {
                            if (isValid) {
                                me.clearInvalid();
                            } else {
                                me.markInvalid(errors);
                            }
                        }
                        return isValid;
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
                xtype: 'combobox',
                name: 'domain',
                clearFilterOnBlur: true,
                queryMode: 'local',
                displayField: 'label',
                valueField: 'value',
                itemId: 'domaindirection',
                forceSelection: true,
                hidden: true,
                fieldLabel: CMDBuildUI.locales.Locales.administration.classes.texts.direction,
                localized: {
                    fieldLabel: 'CMDBuildUI.locales.Locales.administration.classes.texts.direction'
                },
                bind: {
                    value: '{theAttribute.direction}',
                    store: '{directionStore}',
                    disabled: '{actions.edit}'
                }
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
                fieldLabel: CMDBuildUI.locales.Locales.administration.attributes.fieldlabels.domain,
                localized: {
                    fieldLabel: 'CMDBuildUI.locales.Locales.administration.attributes.fieldlabels.domain'
                },
                bind: {
                    value: '{theAttribute.domain}'
                },
                renderer: function (value) {
                    var domainStore = Ext.getStore('domains.Domains');
                    if (domainStore) {
                        var domain = domainStore.getById(value);
                        if (domain) {
                            return domain.get('description');
                        }
                        return value;
                    }
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