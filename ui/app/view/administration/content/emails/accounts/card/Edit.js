Ext.define('CMDBuildUI.view.administration.content.emails.accounts.card.Edit', {
    extend: 'Ext.form.Panel',

    requires: [
        'CMDBuildUI.view.administration.content.emails.accounts.card.EditController',
        'CMDBuildUI.view.administration.content.emails.accounts.card.EditModel'
    ],

    alias: 'widget.administration-content-emails-accounts-card-edit',
    controller: 'administration-content-emails-accounts-card-edit',
    viewModel: {
        type: 'administration-content-emails-accounts-card-edit'
    },

    modelValidation: true,
    scrollable: true,
    fieldDefaults: CMDBuildUI.util.administration.helper.FormHelper.fieldDefaults,

    items: [{
        ui: 'administration-formpagination',
        xtype: "fieldset",

        collapsible: true,
        title: CMDBuildUI.locales.Locales.administration.common.strings.generalproperties,
        localized: {
            title: 'CMDBuildUI.locales.Locales.administration.common.strings.generalproperties'
        },
        layout: 'column',
        defaults: {
            columnWidth: 0.5
        },
        items: [{
            xtype: 'fieldcontainer',
            columnWidth: 1,
            layout: 'column',
            items: [{
                columnWidth: 0.5,
                xtype: 'textfield',
                allowBlank: false,
                fieldLabel: CMDBuildUI.locales.Locales.administration.common.labels.name,
                localized: {
                    fieldLabel: 'CMDBuildUI.locales.Locales.administration.common.labels.name'
                },
                disabled: true,
                name: 'name',
                bind: {
                    value: '{theAccount.name}'
                }
            }]
        }, {
            xtype: 'textfield',
            fieldLabel: CMDBuildUI.locales.Locales.administration.emails.username,
            localized: {
                fieldLabel: 'CMDBuildUI.locales.Locales.administration.emails.username'
            },
            padding: '0 15 0 0',
            name: 'username',
            listeners: {
                afterrender: function (cmp) {
                    cmp.inputEl.set({
                        autocomplete: 'new-username'
                    });
                }
            },
            bind: {
                value: '{theAccount.username}'
            }
        }, {
            xtype: 'passwordfield',
            itemId: 'password',
            reference: 'password',
            fieldLabel: CMDBuildUI.locales.Locales.administration.emails.password,
            localized: {
                fieldLabel: 'CMDBuildUI.locales.Locales.administration.emails.password'
            },
            name: 'password',
            bind: {
                value: '{theAccount.password}'
            }
        }]

    }, {
        ui: 'administration-formpagination',
        xtype: "fieldset",
        collapsible: true,
        layout: 'column',
        defaults: {
            columnWidth: 0.5
        },
        title: CMDBuildUI.locales.Locales.administration.emails.outgoing,
        localized: {
            title: 'CMDBuildUI.locales.Locales.administration.emails.outgoing'
        },
        items: [{
            xtype: 'textfield',
            allowBlank: false,
            fieldLabel: CMDBuildUI.locales.Locales.administration.emails.address,
            localized: {
                fieldLabel: 'CMDBuildUI.locales.Locales.administration.emails.address'
            },
            name: 'address',
            bind: {
                value: '{theAccount.address}'
            }
        }, {
            xtype: 'textfield',
            fieldLabel: CMDBuildUI.locales.Locales.administration.emails.smtpserver,
            localized: {
                fieldLabel: 'CMDBuildUI.locales.Locales.administration.emails.smtpserver'
            },
            name: 'smtp_server',
            bind: {
                value: '{theAccount.smtp_server}'
            }
        }, {
            xtype: 'textfield',
            fieldLabel: CMDBuildUI.locales.Locales.administration.emails.smtpport,
            localized: {
                fieldLabel: 'CMDBuildUI.locales.Locales.administration.emails.smtpport'
            },
            padding: '0 15 0 0',
            name: 'smtp_port',
            bind: {
                value: '{theAccount.smtp_port}'
            }
        }, {
            xtype: 'textfield',
            fieldLabel: CMDBuildUI.locales.Locales.administration.emails.sentfolder,
            localized: {
                fieldLabel: 'CMDBuildUI.locales.Locales.administration.emails.sentfolder'
            },
            name: 'imap_output_folder',
            bind: {
                value: '{theAccount.imap_output_folder}'
            }
        }, {
            xtype: 'checkbox',
            fieldLabel: CMDBuildUI.locales.Locales.administration.emails.enablessl,
            localized: {
                fieldLabel: 'CMDBuildUI.locales.Locales.administration.emails.enablessl'
            },
            itemId: 'smtp_ssl',
            name: 'smtp_ssl',
            bind: {
                value: '{theAccount.smtp_ssl}'
            },
            listeners: {
                afterrender: function () {
                    this.inputEl.dom.dataset.testid = 'administration-email-accounts-smtp_ssl';
                }
            },
            getErrors: function (value) {
                var me = this;
                var errors = [];
                if (value && me.up('form').down('#smtp_starttls').getValue()) {
                    errors.push(CMDBuildUI.locales.Locales.administration.emails.cannotchoosebothssltlsmessage);
                }
                if (errors.length) {
                    me.displayEl.addCls('x-form-invalid-field');
                } else {
                    me.displayEl.removeCls('x-form-invalid-field');
                }
                return errors;
            }
        }, {
            xtype: 'checkbox',
            fieldLabel: CMDBuildUI.locales.Locales.administration.emails.enablestarttls,
            localized: {
                fieldLabel: 'CMDBuildUI.locales.Locales.administration.emails.enablestarttls'
            },
            itemId: 'smtp_starttls',
            name: 'smtp_starttls',
            bind: {
                value: '{theAccount.smtp_starttls}'
            },
            listeners: {
                afterrender: function () {
                    this.inputEl.dom.dataset.testid = 'administration-email-accounts-smtp_starttls';
                }
            },
            getErrors: function (value) {
                var me = this;
                var errors = [];
                if (value && me.up('form').down('#smtp_ssl').getValue()) {
                    errors.push(CMDBuildUI.locales.Locales.administration.emails.cannotchoosebothssltlsmessage);
                }
                if (errors.length) {
                    me.displayEl.addCls('x-form-invalid-field');
                } else {
                    me.displayEl.removeCls('x-form-invalid-field');
                }
                return errors;
            }
        }]

    }, {
        ui: 'administration-formpagination',
        xtype: "fieldset",
        collapsible: true,
        title: CMDBuildUI.locales.Locales.administration.emails.incoming,
        localized: {
            title: 'CMDBuildUI.locales.Locales.administration.emails.incoming'
        },
        layout: 'column',
        defaults: {
            columnWidth: 0.5
        },
        items: [{
            xtype: 'textfield',
            fieldLabel: CMDBuildUI.locales.Locales.administration.emails.imapserver,
            localized: {
                fieldLabel: 'CMDBuildUI.locales.Locales.administration.emails.imapserver'
            },
            name: 'imap_server',
            bind: {
                value: '{theAccount.imap_server}'
            }
        }, {
            xtype: 'textfield',
            fieldLabel: CMDBuildUI.locales.Locales.administration.emails.imapport,
            localized: {
                fieldLabel: 'CMDBuildUI.locales.Locales.administration.emails.imapport'
            },
            name: 'imap_port',
            bind: {
                value: '{theAccount.imap_port}'
            }
        }, {
            xtype: 'checkbox',
            fieldLabel: CMDBuildUI.locales.Locales.administration.emails.enablessl,
            localized: {
                fieldLabel: 'CMDBuildUI.locales.Locales.administration.emails.enablessl'
            },
            itemId: 'imap_ssl',
            name: 'imap_ssl',
            bind: {
                value: '{theAccount.imap_ssl}'
            },
            listeners: {
                afterrender: function () {
                    this.inputEl.dom.dataset.testid = 'administration-email-accounts-imap_ssl';
                }
            },
            getErrors: function (value) {
                var me = this;
                var errors = [];
                if (value && me.up('form').down('#imap_starttls').getValue()) {
                    errors.push(CMDBuildUI.locales.Locales.administration.emails.cannotchoosebothssltlsmessage);
                }
                if (errors.length) {
                    me.displayEl.addCls('x-form-invalid-field');
                } else {
                    me.displayEl.removeCls('x-form-invalid-field');
                }
                return errors;
            }
        }, {
            xtype: 'checkbox',
            fieldLabel: CMDBuildUI.locales.Locales.administration.emails.enablestarttls,
            localized: {
                fieldLabel: 'CMDBuildUI.locales.Locales.administration.emails.enablestarttls'
            },
            itemId: 'imap_starttls',
            name: 'imap_starttls',
            bind: {
                value: '{theAccount.imap_starttls}'
            },
            listeners: {
                afterrender: function () {
                    this.inputEl.dom.dataset.testid = 'administration-email-accounts-imap_starttls';
                }
            },
            getErrors: function (value) {
                var me = this;
                var errors = [];
                if (value && me.up('form').down('#imap_ssl').getValue()) {
                    errors.push(CMDBuildUI.locales.Locales.administration.emails.cannotchoosebothssltlsmessage);
                }
                if (errors.length) {
                    me.displayEl.addCls('x-form-invalid-field');
                } else {
                    me.displayEl.removeCls('x-form-invalid-field');
                }
                return errors;
            }
        }]
    }],
    buttons: Ext.Array.merge([], ['->', {
        xtype: 'button',
        text: CMDBuildUI.locales.Locales.administration.emails.testconfiguration,
        localized: {
            text: 'CMDBuildUI.locales.Locales.administration.emails.testconfiguration'
        },
        formBind: true,
        autoEl: {
            'data-testid': 'administration-email-testBtn'
        },
        itemId: 'testBtn',
        ui: 'administration-action-small'
    }], Ext.Array.removeAt(CMDBuildUI.util.administration.helper.FormHelper.getSaveCancelButtons(), 0))
});