Ext.define('CMDBuildUI.view.administration.content.emails.templates.card.FieldsHelper', {

    singleton: true,

    getGeneralPropertyFieldset: function (viewType) {
        return {
            ui: 'administration-formpagination',
            xtype: "fieldset",
            collapsible: true,
            title: CMDBuildUI.locales.Locales.administration.common.strings.generalproperties,
            localized: {
                title: 'CMDBuildUI.locales.Locales.administration.common.strings.generalproperties'
            },

            layout: 'column',
            fieldDefaults: CMDBuildUI.util.administration.helper.FormHelper.fieldDefaults,
            defaults: {
                columnWidth: 0.5
            },
            items: [
                CMDBuildUI.view.administration.content.emails.templates.card.FieldsHelper.getRow([
                    CMDBuildUI.view.administration.content.emails.templates.card.FieldsHelper.getNameInput('theTemplate', 'name'),
                    CMDBuildUI.view.administration.content.emails.templates.card.FieldsHelper.getDescriptionInput('theTemplate', 'description')
                ]),
                CMDBuildUI.view.administration.content.emails.templates.card.FieldsHelper.getRow([
                    CMDBuildUI.view.administration.content.emails.templates.card.FieldsHelper.getKeepSyncInput('theTemplate', 'keepSynchronization'),
                    CMDBuildUI.view.administration.content.emails.templates.card.FieldsHelper.getPromptSyncInput('theTemplate', 'promptSynchronization')
                ]),
                CMDBuildUI.view.administration.content.emails.templates.card.FieldsHelper.getRow([
                    CMDBuildUI.view.administration.content.emails.templates.card.FieldsHelper.getDelayInput('theTemplate', 'delay')
                ])
            ]

        };
    },

    getTemplateFieldset: function (viewType) {
        return {
            ui: 'administration-formpagination',
            xtype: "fieldset",
            collapsible: true,
            layout: 'column',
            defaults: {
                columnWidth: 1
            },
            title: CMDBuildUI.locales.Locales.administration.emails.template,
            localized: {
                title: 'CMDBuildUI.locales.Locales.administration.emails.template'
            },
            fieldDefaults: CMDBuildUI.util.administration.helper.FormHelper.fieldDefaults,
            items: [
                CMDBuildUI.view.administration.content.emails.templates.card.FieldsHelper.getRow([
                    CMDBuildUI.view.administration.content.emails.templates.card.FieldsHelper.getAccountInput('theTemplate', 'account')
                ]),
                CMDBuildUI.view.administration.content.emails.templates.card.FieldsHelper.getRow([
                    CMDBuildUI.view.administration.content.emails.templates.card.FieldsHelper.getContentTypeInput('theTemplate', 'contentType')
                ]),
                CMDBuildUI.view.administration.content.emails.templates.card.FieldsHelper.getRow([
                    CMDBuildUI.view.administration.content.emails.templates.card.FieldsHelper.getFromInput('theTemplate', 'from')
                ]),
                CMDBuildUI.view.administration.content.emails.templates.card.FieldsHelper.getRow([
                    CMDBuildUI.view.administration.content.emails.templates.card.FieldsHelper.getToInput('theTemplate', 'to')
                ]),
                CMDBuildUI.view.administration.content.emails.templates.card.FieldsHelper.getRow([
                    CMDBuildUI.view.administration.content.emails.templates.card.FieldsHelper.getCCInput('theTemplate', 'cc')
                ]),
                CMDBuildUI.view.administration.content.emails.templates.card.FieldsHelper.getRow([
                    CMDBuildUI.view.administration.content.emails.templates.card.FieldsHelper.getBCCInput('theTemplate', 'bcc')
                ]),
                CMDBuildUI.view.administration.content.emails.templates.card.FieldsHelper.getRow([
                    CMDBuildUI.view.administration.content.emails.templates.card.FieldsHelper.getSubjectInput('theTemplate', 'subject')
                ]),
                CMDBuildUI.view.administration.content.emails.templates.card.FieldsHelper.getRow([
                    CMDBuildUI.view.administration.content.emails.templates.card.FieldsHelper.getBodyInput('theTemplate', 'body', viewType)
                ])
            ]
        };
    },
    getNameInput: function (vmKeyObject, property) {
        return CMDBuildUI.util.administration.helper.FieldsHelper.getNameInput({
            name: {
                vtype: 'nameInputValidationWithDash',
                allowBlank: false,
                bind: {
                    value: Ext.String.format('{{0}.{1}}', vmKeyObject, property)
                }
            }
        }, true, '[name="description"]');

    },

    getDescriptionInput: function (vmKeyObject, property) {
        return CMDBuildUI.util.administration.helper.FieldsHelper.getDescriptionInput({
            description: {
                allowBlank: false,
                bind: {
                    value: Ext.String.format('{{0}.{1}}', vmKeyObject, property)
                }
            }
        });
    },

    getKeepSyncInput: function (vmKeyObject, property) {
        var config = {};
        config[property] = {
            fieldcontainer: {
                fieldLabel: CMDBuildUI.locales.Locales.administration.emails.keepsync,
                localized: {
                    fieldLabel: 'CMDBuildUI.locales.Locales.administration.emails.keepsync'
                }
            },
            bind: {
                readOnly: '{actions.view}',
                value: Ext.String.format('{{0}.{1}}', vmKeyObject, property)
            }
        };
        return CMDBuildUI.util.administration.helper.FieldsHelper.getCommonCheckboxInput(property, config);
    },

    getPromptSyncInput: function (vmKeyObject, property) {
        var config = {};
        config[property] = {
            xtype: 'checkbox',
            fieldLabel: CMDBuildUI.locales.Locales.administration.emails.promptsync,
            localized: {
                title: 'CMDBuildUI.locales.Locales.administration.emails.promptsync'
            },
            name: 'promptSynchronization',
            bind: {
                value: Ext.String.format('{{0}.{1}}', vmKeyObject, property)
            }
        };

        return CMDBuildUI.util.administration.helper.FieldsHelper.getCommonCheckboxInput(property, config);
    },

    getDelayInput: function (vmKeyObject, property) {
        var config = {};
        config[property] = {
            fieldcontainer: {
                layout: 'column',
                columnWidth: 0.5,
                fieldLabel: CMDBuildUI.locales.Locales.administration.emails.delay,
                localized: {
                    fieldLabel: 'CMDBuildUI.locales.Locales.administration.emails.delay'
                }
            },
            displayField: 'label',
            valueField: 'value',
            bind: {
                value: Ext.String.format('{{0}.{1}}', vmKeyObject, property),
                store: '{delaylist}'
            }
        };

        return CMDBuildUI.util.administration.helper.FieldsHelper.getCommonComboInput(property, config);
    },

    getAccountInput: function (vmKeyObject, property) {
        var config = {};
        config[property] = {
            fieldcontainer: {
                layout: 'column',
                columnWidth: 1,
                fieldLabel: CMDBuildUI.locales.Locales.administration.emails.defaultaccount,
                localized: {
                    fieldLabel: 'CMDBuildUI.locales.Locales.administration.emails.defaultaccount'
                }
            },
            bind: {
                value: Ext.String.format('{{0}.{1}}', vmKeyObject, property),
                store: '{allEmailAccounts}'
            },
            displayField: 'name',
            valueField: '_id',
            triggers: {
                clear: CMDBuildUI.util.administration.helper.FormHelper.getClearComboTrigger()
            }
        };

        return CMDBuildUI.util.administration.helper.FieldsHelper.getCommonComboInput(property, config);
    },
    getContentTypeInput: function (vmKeyObject, property) {
        var config = {};
        config[property] = {
            fieldcontainer: {
                layout: 'column',
                columnWidth: 1,
                fieldLabel: CMDBuildUI.locales.Locales.administration.emails.contenttype,
                localized: {
                    fieldLabel: 'CMDBuildUI.locales.Locales.administration.emails.contenttype'
                }
            },
            displayField: 'label',
            valueField: 'value',
            store: 'administration.emails.ContentTypes',
            bind: {
                value: Ext.String.format('{{0}.{1}}', vmKeyObject, property)
            }
        };

        return CMDBuildUI.util.administration.helper.FieldsHelper.getCommonComboInput(property, config);
    },


    getFromInput: function (vmKeyObject, property) {
        var config = {};
        config[property] = {
            fieldcontainer: {
                layout: 'column',
                columnWidth: 1,
                fieldLabel: CMDBuildUI.locales.Locales.administration.emails.from,
                localized: {
                    fieldLabel: 'CMDBuildUI.locales.Locales.administration.emails.from'
                },
                labelToolIconCls: 'fa-list',
                labelToolIconQtip: CMDBuildUI.locales.Locales.administration.emails.editvalues,
                labelToolIconClick: 'onEditValueBtnClick'
            },

            bind: {
                value: Ext.String.format('{{0}.{1}}', vmKeyObject, property)
            }
        };

        return CMDBuildUI.util.administration.helper.FieldsHelper.getCommonTextfieldInput(property, config);
    },

    getToInput: function (vmKeyObject, property) {
        var config = {};
        config[property] = {
            fieldcontainer: {
                layout: 'column',
                columnWidth: 1,
                fieldLabel: CMDBuildUI.locales.Locales.administration.emails.to,
                localized: {
                    fieldLabel: 'CMDBuildUI.locales.Locales.administration.emails.to'
                },
                labelToolIconCls: 'fa-list',
                labelToolIconQtip: CMDBuildUI.locales.Locales.administration.emails.editvalues,
                labelToolIconClick: 'onEditValueBtnClick'
            },

            bind: {
                value: Ext.String.format('{{0}.{1}}', vmKeyObject, property)
            }
        };

        return CMDBuildUI.util.administration.helper.FieldsHelper.getCommonTextfieldInput(property, config);
    },
    getCCInput: function (vmKeyObject, property) {
        var config = {};
        config[property] = {
            fieldcontainer: {
                layout: 'column',
                columnWidth: 1,
                fieldLabel: CMDBuildUI.locales.Locales.administration.emails.cc,
                localized: {
                    fieldLabel: 'CMDBuildUI.locales.Locales.administration.emails.cc'
                },
                labelToolIconCls: 'fa-list',
                labelToolIconQtip: CMDBuildUI.locales.Locales.administration.emails.editvalues,
                labelToolIconClick: 'onEditValueBtnClick'
            },

            bind: {
                value: Ext.String.format('{{0}.{1}}', vmKeyObject, property)
            }
        };

        return CMDBuildUI.util.administration.helper.FieldsHelper.getCommonTextfieldInput(property, config);
    },
    getBCCInput: function (vmKeyObject, property) {
        var config = {};
        config[property] = {
            fieldcontainer: {
                layout: 'column',
                columnWidth: 1,
                fieldLabel: CMDBuildUI.locales.Locales.administration.emails.bcc,
                localized: {
                    fieldLabel: 'CMDBuildUI.locales.Locales.administration.emails.bcc'
                },
                labelToolIconCls: 'fa-list',
                labelToolIconQtip: CMDBuildUI.locales.Locales.administration.emails.editvalues,
                labelToolIconClick: 'onEditValueBtnClick'
            },

            bind: {
                value: Ext.String.format('{{0}.{1}}', vmKeyObject, property)
            }
        };

        return CMDBuildUI.util.administration.helper.FieldsHelper.getCommonTextfieldInput(property, config);
    },

    getSubjectInput: function (vmKeyObject, property) {
        var config = {};
        config[property] = {
            fieldcontainer: {
                layout: 'column',
                columnWidth: 1,
                fieldLabel: CMDBuildUI.locales.Locales.administration.emails.subject,
                localized: {
                    fieldLabel: 'CMDBuildUI.locales.Locales.administration.emails.subject'
                },
                labelToolIconCls: 'fa-list',
                labelToolIconQtip: CMDBuildUI.locales.Locales.administration.emails.editvalues,
                labelToolIconClick: 'onEditValueBtnClick'
            },

            bind: {
                value: Ext.String.format('{{0}.{1}}', vmKeyObject, property)
            }
        };

        return CMDBuildUI.util.administration.helper.FieldsHelper.getCommonTextfieldInput(property, config);
    },

    getBodyInput: function (vmKeyObject, property, viewType) {
        var editor;
        if (!viewType) {
            editor = CMDBuildUI.util.helper.FieldsHelper.getHTMLEditor({
                padding: '0 15 0 0',
                minHeight: 500,
                columnWidth: 1,
                bind: {
                    value: Ext.String.format('{{0}.{1}}', vmKeyObject, property),
                    readOnly: '{actions.view}'
                }
            });
        } else {
            editor = {
                // view
                xtype: 'displayfield',
                name: 'defaultexporttemplate',
                hidden: true,
                bind: {
                    value: Ext.String.format('{{0}.{1}}', vmKeyObject, property),
                    hidden: '{!actions.view}'
                }
            }
        }

        return {
            xtype: 'fieldcontainer',
            layout: 'column',
            columnWidth: 1,
            fieldLabel: CMDBuildUI.locales.Locales.administration.emails.body,
            localized: {
                fieldLabel: 'CMDBuildUI.locales.Locales.administration.emails.body'
            },
            labelToolIconCls: 'fa-list',
            labelToolIconQtip: CMDBuildUI.locales.Locales.administration.emails.editvalues,
            labelToolIconClick: 'onEditValueBtnClick',
            items: [editor]
        };
    },
    getRow: function (items, config) {
        var fieldcontainer = Ext.merge({}, {
            xtype: 'container',
            layout: 'column',
            cls: 'row-container',
            columnWidth: 1
        }, config || {});
        if (items && items.length) {
            fieldcontainer.items = items;
        }
        return fieldcontainer;

    }

});