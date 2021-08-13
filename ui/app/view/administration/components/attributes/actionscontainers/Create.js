Ext.define('CMDBuildUI.view.administration.components.attributes.actionscontainers.Create', {
    extend: 'Ext.form.Panel',
    alias: 'widget.administration-components-attributes-actionscontainers-create',
    requires: [
        'CMDBuildUI.view.administration.components.attributes.actionscontainers.CardController',
        'CMDBuildUI.view.administration.components.attributes.actionscontainers.CardModel'
    ],
    controller: 'administration-components-attributes-actionscontainers-card',
    viewModel: {
        type: 'administration-components-attributes-actionscontainers-card'
    },
    config: {
        objectType: null,
        objectTypeName: null,
        /**
         * @cfg {Object[]}
         * 
         * Can set default values for any of the attributes. An object can be:
         * `{attribute: 'attribute name', value: 'default value', editable: true|false}` 
         * used for all attributes or
         * `{domain: 'domain name', value: 'default value', editable: true|false}` 
         * used to set default values for references fields.
         */
        defaultValues: null
    },

    modelValidation: true,
    autoScroll: true,
    fieldDefaults: CMDBuildUI.util.administration.helper.FormHelper.fieldDefaults,
    bubbleEvents: [
        'itemcreated',
        'cancelcreation'
    ],
    items: [{
        ui: 'administration-formpagination',
        xtype: "fieldset",
        collapsible: true,
        title: CMDBuildUI.locales.Locales.administration.common.strings.generalproperties,
        localized: {
            title: 'CMDBuildUI.locales.Locales.administration.common.strings.generalproperties'
        },
        items: [{
            layout: 'column',
            items: [{
                columnWidth: 0.5,
                xtype: 'textfield',
                // vtype: 'alphanum',
                allowBlank: false,
                vtype: 'attributeNameValidation',
                maxLength: 20,
                fieldLabel: CMDBuildUI.locales.Locales.administration.attributes.fieldlabels.name,
                localized: {
                    fieldLabel: 'CMDBuildUI.locales.Locales.administration.attributes.fieldlabels.name'
                },
                name: 'name',
                bind: {
                    value: '{theAttribute.name}'
                },
                listeners: {
                    change: function (input, newVal, oldVal) {
                        CMDBuildUI.util.administration.helper.FieldsHelper.copyTo(input, newVal, oldVal, '[name="description"]');
                    }
                }
            }, {
                columnWidth: 0.5,
                xtype: 'textfield',
                name: 'description',
                allowBlank: false,
                bind: {
                    value: '{theAttribute.description}'
                },
                fieldLabel: CMDBuildUI.locales.Locales.administration.attributes.fieldlabels.description,
                localized: {
                    fieldLabel: 'CMDBuildUI.locales.Locales.administration.attributes.fieldlabels.description'
                },
                labelToolIconCls: 'fa-flag',
                labelToolIconQtip: CMDBuildUI.locales.Locales.administration.attributes.tooltips.translate,
                labelToolIconClick: 'onTranslateClick'

            }]
        }, {
            layout: 'column',
            items: [{
                columnWidth: 0.5,
                xtype: 'combo',
                itemId: 'groupfield',
                fieldLabel: CMDBuildUI.locales.Locales.administration.attributes.fieldlabels.group,
                localized: {
                    fieldLabel: 'CMDBuildUI.locales.Locales.administration.attributes.fieldlabels.group'
                },
                name: 'group',
                editable: false,
                forceSelect: true,
                allowBlank: true,
                displayField: 'description',
                valueField: 'name',
                hidden: true,
                bind: {
                    value: '{theAttribute.group}',
                    store: '{attributeGroupStore}',
                    hidden: '{isGroupHidden}'
                }
            }, {
                columnWidth: 0.5,
                xtype: 'combo',
                itemId: 'attributeMode',
                fieldLabel: CMDBuildUI.locales.Locales.administration.attributes.fieldlabels.mode,
                localized: {
                    fieldLabel: 'CMDBuildUI.locales.Locales.administration.attributes.fieldlabels.mode'
                },
                name: 'mode',
                clearFilterOnBlur: false,
                anyMatch: true,
                autoSelect: true,
                forceSelection: true,
                allowBlank: false,
                displayField: 'label',
                valueField: 'value',
                bind: {
                    value: '{theAttribute.mode}',
                    store: '{attributeModeStore}'
                },

                renderer: CMDBuildUI.util.administration.helper.RendererHelper.getAttributeMode,
                /**
                 * Returns whether or not the widget value is currently valid by {@link #getErrors validating} the
                 * {@link #processRawValue processed raw value} of the widget. **Note**: {@link #disabled} buttons are
                 * always treated as valid.
                 *
                 * @return {Boolean} True if the value is valid, else false
                 */
                isValid: function () {
                    return this.activeErrors && this.activeErrors.length ? false : true;
                }
            }]
        }, {
            layout: 'column',
            hidden: true,
            bind: {
                hidden: Ext.String.format('{objectType == "{0}"}', CMDBuildUI.util.helper.ModelHelper.objecttypes.dmsmodel)
            },
            items: [{
                columnWidth: 0.5,
                itemId: 'attributeShowInGrid',
                xtype: 'checkbox',
                fieldLabel: CMDBuildUI.locales.Locales.administration.attributes.fieldlabels.showingrid,
                localized: {
                    fieldLabel: 'CMDBuildUI.locales.Locales.administration.attributes.fieldlabels.showingrid'
                },
                name: 'showInGrid',
                bind: {
                    value: '{theAttribute.showInGrid}'
                }
            }, {
                columnWidth: 0.5,
                xtype: 'checkbox',
                itemId: 'attributeShowInReducedGrid',
                fieldLabel: CMDBuildUI.locales.Locales.administration.attributes.fieldlabels.showinreducedgrid,
                localized: {
                    fieldLabel: 'CMDBuildUI.locales.Locales.administration.attributes.fieldlabels.showinreducedgrid'
                },
                name: 'unique',
                bind: {
                    value: '{theAttribute.showInReducedGrid}'
                }
            }]
        }, {
            layout: 'column',
            items: [{
                columnWidth: 0.5,
                xtype: 'checkbox',
                fieldLabel: CMDBuildUI.locales.Locales.administration.attributes.fieldlabels.unique,
                localized: {
                    fieldLabel: 'CMDBuildUI.locales.Locales.administration.attributes.fieldlabels.unique'
                },
                name: 'unique',
                bind: {
                    value: '{theAttribute.unique}'
                }
            }, {
                columnWidth: 0.5,
                xtype: 'checkbox',
                itemId: 'attributeMandatory',
                fieldLabel: CMDBuildUI.locales.Locales.administration.attributes.fieldlabels.mandatory,
                localized: {
                    fieldLabel: 'CMDBuildUI.locales.Locales.administration.attributes.fieldlabels.mandatory'
                },
                name: 'mandatory',
                bind: {
                    value: '{theAttribute.mandatory}',
                    hidden: '{isMandatoryHidden}'
                },
                hidden: true
            }]
        }, {
            layout: 'column',
            items: [{
                columnWidth: 0.5,
                xtype: 'checkbox',
                fieldLabel: CMDBuildUI.locales.Locales.administration.attributes.texts.active,
                localized: {
                    fieldLabel: 'CMDBuildUI.locales.Locales.administration.attributes.texts.active'
                },
                name: 'active',
                bind: {
                    value: '{theAttribute.active}'
                }
            }]
        }]
    }, {
        ui: 'administration-formpagination',
        xtype: "fieldset",
        collapsible: true,
        title: CMDBuildUI.locales.Locales.administration.attributes.titles.typeproperties,
        localized: {
            title: 'CMDBuildUI.locales.Locales.administration.attributes.titles.typeproperties'
        },
        items: [{
            layout: 'column',
            items: [{
                columnWidth: 0.5,
                xtype: 'combo',
                fieldLabel: CMDBuildUI.locales.Locales.administration.attributes.fieldlabels.type,
                localized: {
                    fieldLabel: 'CMDBuildUI.locales.Locales.administration.attributes.fieldlabels.type'
                },
                name: 'type',
                allowBlank: false,
                queryMode: "local",
                displayField: 'label',
                valueField: 'value',
                bind: {
                    value: '{theAttribute.type}',
                    store: '{attributetypesStore}'
                },
                listeners: {
                    change: function (combo, newValue, oldValue) {
                        if (oldValue) {
                            var vm = combo.lookupViewModel();
                            switch (newValue) {
                                case CMDBuildUI.model.Attribute.types.text:
                                    if (vm.get('theAttribute.editorType') === 'HTML') {
                                        vm.set('theAttribute.textContentSecurity', CMDBuildUI.model.Attribute.textContentSecurity.html_safe);
                                    } else {
                                        vm.set('theAttribute.textContentSecurity', CMDBuildUI.model.Attribute.textContentSecurity.plaintext);
                                    }
                                    break;
                                case CMDBuildUI.model.Attribute.types.string:
                                    vm.set('theAttribute.textContentSecurity', CMDBuildUI.model.Attribute.textContentSecurity.plaintext);
                                    break;
                                default:
                                    break;
                            }
                            if (newValue !== CMDBuildUI.model.Attribute.types.reference) {
                                combo.up('form').down('#attributedomain').clearInvalid();
                                combo.up('form').down('#attributedomain').isValid();
                            } else {
                                combo.up('form').down('#attributedomain').isValid();
                            }

                            combo.up('form').form.checkValidity();
                        }                
                    }
                }
            }]
        }, {
            // If type is boolean
            bind: {
                hidden: '{!types.isBoolean}'
            },
            hidden: true,
            xtype: 'administration-attribute-booleanfields'
        }, {
            // If type is date
            bind: {
                hidden: '{!types.isDate}'
            },
            hidden: true,
            xtype: 'administration-attribute-datefields'
        }, {
            // If type is datetime
            bind: {
                hidden: '{!types.isDatetime}'
            },
            hidden: true,
            xtype: 'administration-attribute-datetimefields'
        }, {
            // If type is decimal
            bind: {
                hidden: '{!types.isDecimal}'
            },
            hidden: true,
            xtype: 'administration-attribute-decimalfields'
        }, {
            // If type is double
            bind: {
                hidden: '{!types.isDouble}'
            },
            hidden: true,
            xtype: 'administration-attribute-doublefields'
        }, {
            // If type is foreignKey
            bind: {
                hidden: '{!types.isForeignkey}'
            },
            hidden: true,
            xtype: 'administration-attribute-foreignkeyfields'
        }, {
            // If type is integer
            bind: {
                hidden: '{!types.isInteger}'
            },
            hidden: true,
            xtype: 'administration-attribute-integerfields'
        }, {
            // If type is ip address
            bind: {
                hidden: '{!types.isIpAddress}'
            },
            hidden: true,
            xtype: 'administration-attribute-ipaddressfields'
        }, {
            // If type is lookup
            bind: {
                hidden: '{!types.isLookup}'
            },
            hidden: true,
            xtype: 'administration-attribute-lookupfields'
        }, {
            // If type is reference
            bind: {
                hidden: '{!types.isReference}'
            },
            hidden: true,
            xtype: 'administration-attribute-referencefields'
        }, {
            // If type is string
            bind: {
                hidden: '{!types.isString}',
                theAttribute: '{theAttribute}'
            },
            hidden: true,
            xtype: 'administration-attribute-stringfields'
        }, {
            // If type is text
            bind: {
                hidden: '{!types.isText}'
            },
            hidden: true,
            xtype: 'administration-attribute-textfields'
        }, {
            // If type is time
            bind: {
                hidden: '{!types.isTime}'
            },
            hidden: true,
            xtype: 'administration-attribute-timefields'
        }, {
            // If type is timestamp
            bind: {
                hidden: '{!types.isTimestamp}'
            },
            hidden: true,
            xtype: 'administration-attribute-timestampfields'
        }]
    }, {
        ui: 'administration-formpagination',
        xtype: "fieldset",
        collapsible: true,
        //title: 'Other properties',
        title: CMDBuildUI.locales.Locales.administration.attributes.titles.otherproperties,
        localized: {
            title: 'CMDBuildUI.locales.Locales.administration.attributes.titles.otherproperties'
        },
        bind: {
            hidden: '{isOtherPropertiesHidden}'
        },
        items: [{
            hidden: true,
            bind: {
                hidden: '{!theAttribute}'
            },
            items: [{
                layout: 'column',
                items: [{
                    columnWidth: 0.5,
                    xtype: 'textarea',
                    fieldLabel: CMDBuildUI.locales.Locales.administration.attributes.fieldlabels.help,
                    localized: {
                        fieldLabel: 'CMDBuildUI.locales.Locales.administration.attributes.fieldlabels.help'
                    },
                    name: 'help',
                    bind: {
                        value: '{theAttribute.help}'
                    },
                    resizable: {
                        handles: "s"
                    }
                }, {
                    columnWidth: 0.5,
                    xtype: 'textarea',
                    fieldLabel: CMDBuildUI.locales.Locales.administration.attributes.fieldlabels.showif,
                    localized: {
                        fieldLabel: 'CMDBuildUI.locales.Locales.administration.attributes.fieldlabels.showif'
                    },
                    name: 'showIf',
                    bind: {
                        value: '{theAttribute.showIf}'
                    },
                    resizable: {
                        handles: "s"
                    }
                }]
            }]
        }, {

            hidden: true,
            bind: {
                hidden: '{!theAttribute}'
            },
            items: [{
                layout: 'column',
                items: [{
                    columnWidth: 0.5,
                    xtype: 'textarea',
                    fieldLabel: CMDBuildUI.locales.Locales.administration.attributes.fieldlabels.validationrules,
                    localized: {
                        fieldLabel: 'CMDBuildUI.locales.Locales.administration.attributes.fieldlabels.validationrules'
                    },
                    name: 'validadationRules',
                    bind: {
                        value: '{theAttribute.validationRules}'
                    },
                    resizable: {
                        handles: "s"
                    }
                }, {
                    columnWidth: 0.5,
                    xtype: 'textarea',
                    fieldLabel: CMDBuildUI.locales.Locales.administration.attributes.fieldlabels.autovalue,
                    localized: {
                        fieldLabel: 'CMDBuildUI.locales.Locales.administration.attributes.fieldlabels.autovalue'
                    },
                    name: 'autoValue',
                    bind: {
                        value: '{theAttribute.autoValue}'
                    },
                    resizable: {
                        handles: "s"
                    }
                }]
            }]
        }]
    }],

    buttons: CMDBuildUI.util.administration.helper.FormHelper.getSaveAndAddCancelButtons()
});