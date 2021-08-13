Ext.define('CMDBuildUI.view.administration.content.setup.elements.PasswordPolicy', {
    extend: 'Ext.form.Panel',

    alias: 'widget.administration-content-setup-elements-passwordpolicy',
    controller: 'administration-content-setup-elements-passwordpolicy',

    items: [{
        ui: 'administration-formpagination',
        xtype: "fieldset",
        collapsible: true,
        padding: 0,
        title: CMDBuildUI.locales.Locales.administration.systemconfig.generals,
        localized: {
            title: 'CMDBuildUI.locales.Locales.administration.systemconfig.generals'
        },
        defaults: {
            xtype: 'fieldcontainer',
            layout: 'column',
            defaults: {
                columnWidth: 0.5,
                padding: CMDBuildUI.util.helper.FormHelper.properties.padding
            }
        },
        items: [{
            // row 1
            items: [{
                // left column
                items: [{
                    // property: active
                    xtype: 'checkbox',
                    fieldLabel: CMDBuildUI.locales.Locales.administration.common.labels.active,
                    localized: {
                        fieldLabel: 'CMDBuildUI.locales.Locales.administration.common.labels.active'
                    },
                    name: 'enabled',
                    bind: {
                        value: '{theSetup.org__DOT__cmdbuild__DOT__password__DOT__enable-password-change-management}',
                        readOnly: '{actions.view}'
                    }
                }] // end column items
            }] // end row items
        }, {
            // row 2
            items: [{
                // left column

                items: [{
                    // property: different from username
                    xtype: 'checkbox',
                    fieldLabel: CMDBuildUI.locales.Locales.administration.systemconfig.pwddifferentusername,
                    localized: {
                        fieldLabel: 'CMDBuildUI.locales.Locales.administration.systemconfig.pwddifferentusername'
                    },
                    name: 'enabled',
                    bind: {
                        value: '{theSetup.org__DOT__cmdbuild__DOT__password__DOT__differ-from-username}',
                        readOnly: '{actions.view}'
                    }
                }] // end column items
            }] // end row items
        }, {
            // row 2
            items: [{
                // left column
                items: [{
                    // property: different from previous
                    xtype: 'checkbox',
                    fieldLabel: CMDBuildUI.locales.Locales.administration.systemconfig.pwddifferentprevious,
                    localized: {
                        fieldLabel: 'CMDBuildUI.locales.Locales.administration.systemconfig.pwddifferentprevious'
                    },
                    name: 'enabled',
                    bind: {
                        value: '{theSetup.org__DOT__cmdbuild__DOT__password__DOT__differ-from-previous}',
                        readOnly: '{actions.view}'
                    },
                    listeners: {
                        change: function (check, newValue, oldValue) {
                            try {
                                if (newValue) {
                                    this.up('form').down('#numberpreviouspasswordcannotreused').show();
                                } else {
                                    this.up('form').down('#numberpreviouspasswordcannotreused').hide();
                                }
                            } catch (error) {

                            }

                        }
                    }
                }] // end column items
            }, {
                // right column
                items: [{
                    xtype: 'fieldcontainer',
                    itemId: 'numberpreviouspasswordcannotreused',
                    hidden: true,
                    bind: {
                        hidden: '{!theSetup.org__DOT__cmdbuild__DOT__password__DOT__differ-from-previous}'
                    },
                    items: [{
                            xtype: 'numberfield',
                            fieldLabel: CMDBuildUI.locales.Locales.administration.systemconfig.numberpreviouspasswordcannotreused,
                            localized: {
                                fieldLabel: 'CMDBuildUI.locales.Locales.administration.systemconfig.numberpreviouspasswordcannotreused'
                            },
                            minValue: 0,
                            bind: {
                                value: '{theSetup.org__DOT__cmdbuild__DOT__password__DOT__differ-from-previous-count}',
                                hidden: '{actions.view}'
                            }
                        },
                        {
                            xtype: 'displayfield',
                            fieldLabel: CMDBuildUI.locales.Locales.administration.systemconfig.numberpreviouspasswordcannotreused,
                            localized: {
                                fieldLabel: 'CMDBuildUI.locales.Locales.administration.systemconfig.numberpreviouspasswordcannotreused'
                            },
                            minValue: 0,
                            bind: {
                                value: '{theSetup.org__DOT__cmdbuild__DOT__password__DOT__differ-from-previous-count}',
                                hidden: '{!actions.view}'
                            }
                        }
                    ]
                }]

                // end column items
            }] // end row items
        }, {
            // row 3
            items: [{
                // left column
                items: [{
                    xtype: 'displayfield',
                    fieldLabel: CMDBuildUI.locales.Locales.administration.systemconfig.pwdminimumlength,
                    localized: {
                        fieldLabel: 'CMDBuildUI.locales.Locales.administration.systemconfig.pwdminimumlength'
                    },
                    bind: {
                        value: '{theSetup.org__DOT__cmdbuild__DOT__password__DOT__min-length}',
                        hidden: '{!actions.view}'
                    }
                }, {
                    xtype: 'numberfield',
                    fieldLabel: CMDBuildUI.locales.Locales.administration.systemconfig.pwdminimumlength,
                    localized: {
                        fieldLabel: 'CMDBuildUI.locales.Locales.administration.systemconfig.pwdminimumlength'
                    },
                    minValue: 0,
                    maxValue: 20,
                    bind: {
                        value: '{theSetup.org__DOT__cmdbuild__DOT__password__DOT__min-length}',
                        hidden: '{actions.view}'
                    }
                }] // end column items
            }] // end row items
        }, {
            // row 4
            items: [{
                // left column
                items: [{
                    // property: require lowercase
                    xtype: 'checkbox',
                    fieldLabel: CMDBuildUI.locales.Locales.administration.systemconfig.pwdrequirelowercase,
                    localized: {
                        fieldLabel: 'CMDBuildUI.locales.Locales.administration.systemconfig.pwdrequirelowercase'
                    },
                    name: 'enabled',
                    bind: {
                        value: '{theSetup.org__DOT__cmdbuild__DOT__password__DOT__require-lowercase}',
                        readOnly: '{actions.view}'
                    }
                }] // end column items
            }, {
                // right column
                items: [{
                    // property: require uppercase
                    xtype: 'checkbox',
                    fieldLabel: CMDBuildUI.locales.Locales.administration.systemconfig.pwdrequireuppercase,
                    localized: {
                        fieldLabel: 'CMDBuildUI.locales.Locales.administration.systemconfig.pwdrequireuppercase'
                    },
                    name: 'enabled',
                    bind: {
                        value: '{theSetup.org__DOT__cmdbuild__DOT__password__DOT__require-uppercase}',
                        readOnly: '{actions.view}'
                    }
                }] // end column items
            }] // end row items
        }, {
            // row 5
            items: [{
                // left column
                items: [{
                    // property: require digit
                    xtype: 'checkbox',
                    fieldLabel: CMDBuildUI.locales.Locales.administration.systemconfig.pwdrequiredigit,
                    localized: {
                        fieldLabel: 'CMDBuildUI.locales.Locales.administration.systemconfig.pwdrequiredigit'
                    },
                    name: 'enabled',
                    bind: {
                        value: '{theSetup.org__DOT__cmdbuild__DOT__password__DOT__require-digit}',
                        readOnly: '{actions.view}'
                    }
                }] // end column items
            }] // end row items
        }, {
            // row 6
            items: [{
                // left column
                items: [{
                    xtype: 'displayfield',
                    fieldLabel: CMDBuildUI.locales.Locales.administration.systemconfig.pwdmaxage,
                    localized: {
                        fieldLabel: 'CMDBuildUI.locales.Locales.administration.systemconfig.pwdmaxage'
                    },
                    bind: {
                        value: '{theSetup.org__DOT__cmdbuild__DOT__password__DOT__max-password-age-days}',
                        hidden: '{!actions.view}'
                    }
                }, {
                    xtype: 'numberfield',
                    fieldLabel: CMDBuildUI.locales.Locales.administration.systemconfig.pwdmaxage,
                    localized: {
                        fieldLabel: 'CMDBuildUI.locales.Locales.administration.systemconfig.pwdmaxage'
                    },
                    minValue: 0,
                    bind: {
                        value: '{theSetup.org__DOT__cmdbuild__DOT__password__DOT__max-password-age-days}',
                        hidden: '{actions.view}'
                    }
                }] // end column items
            }, {
                // right column
                items: [{
                    xtype: 'displayfield',
                    fieldLabel: CMDBuildUI.locales.Locales.administration.systemconfig.pwdforewarding,
                    localized: {
                        fieldLabel: 'CMDBuildUI.locales.Locales.administration.systemconfig.pwdforewarding'
                    },
                    bind: {
                        value: '{theSetup.org__DOT__cmdbuild__DOT__password__DOT__forewarning-days}',
                        hidden: '{!actions.view}'
                    }
                }, {
                    xtype: 'numberfield',
                    fieldLabel: CMDBuildUI.locales.Locales.administration.systemconfig.pwdforewarding,
                    localized: {
                        fieldLabel: 'CMDBuildUI.locales.Locales.administration.systemconfig.pwdforewarding'
                    },
                    minValue: 0,
                    bind: {
                        value: '{theSetup.org__DOT__cmdbuild__DOT__password__DOT__forewarning-days}',
                        hidden: '{actions.view}'
                    }
                }] // end column items
            }] // end row items
        }, {
            // row 6
            items: [{
                // left column
                items: [{
                    xtype: 'displayfield',
                    fieldLabel: CMDBuildUI.locales.Locales.administration.systemconfig.maxloginattempts, // max login attempts
                    localized: {
                        fieldLabel: 'CMDBuildUI.locales.Locales.administration.systemconfig.maxloginattempts' // max login attempts
                    },
                    bind: {
                        value: '{theSetup.org__DOT__cmdbuild__DOT__auth__DOT__maxLoginAttempts__DOT__count}',
                        hidden: '{!actions.view}'
                    }
                }, {
                    xtype: 'numberfield',
                    fieldLabel: CMDBuildUI.locales.Locales.administration.systemconfig.maxloginattempts, // max login attempts
                    localized: {
                        fieldLabel: 'CMDBuildUI.locales.Locales.administration.systemconfig.maxloginattempts' // max login attempts
                    },
                    minValue: 0,
                    bind: {
                        value: '{theSetup.org__DOT__cmdbuild__DOT__auth__DOT__maxLoginAttempts__DOT__count}',
                        hidden: '{actions.view}'
                    }
                }] // end column items
            }, {
                // right column
                items: [{
                    xtype: 'displayfield',
                    fieldLabel: CMDBuildUI.locales.Locales.administration.systemconfig.maxloginattemptswindow, //  max login attempts window (seconds)                    
                    localized: {
                        fieldLabel: 'CMDBuildUI.locales.Locales.administration.systemconfig.maxloginattemptswindow' //  max login attempts window (seconds)                    
                    },
                    bind: {
                        value: '{theSetup.org__DOT__cmdbuild__DOT__auth__DOT__maxLoginAttempts__DOT__window}',
                        hidden: '{!actions.view}'
                    }
                }, {
                    xtype: 'numberfield',
                    fieldLabel: CMDBuildUI.locales.Locales.administration.systemconfig.maxloginattemptswindow, //  max login attempts window (seconds)                    
                    localized: {
                        fieldLabel: 'CMDBuildUI.locales.Locales.administration.systemconfig.maxloginattemptswindow' //  max login attempts window (seconds)                    
                    },
                    minValue: 0,
                    bind: {
                        value: '{theSetup.org__DOT__cmdbuild__DOT__auth__DOT__maxLoginAttempts__DOT__window}',
                        hidden: '{actions.view}'
                    }
                }] // end column items
            }] // end row items
        }, {
            // row 6
            items: [{
                // left column
                items: [{
                    // property: active
                    xtype: 'checkbox',
                    fieldLabel: CMDBuildUI.locales.Locales.administration.systemconfig.defaultchangepasswordfirstlogin,
                    localized: {
                        fieldLabel: 'CMDBuildUI.locales.Locales.administration.systemconfig.defaultchangepasswordfirstlogin'
                    },
                    name: 'changePasswordRequiredForNewUser',
                    bind: {                        
                        value: '{theSetup.org__DOT__cmdbuild__DOT__core__DOT__user__DOT__changePasswordRequiredForNewUser}',
                        readOnly: '{actions.view}'
                    }
                }] // end column items
            
            }] // end row items
        }] // end fieldset items
    }, {
        ui: 'administration-formpagination',
        xtype: "fieldset",
        collapsible: true,
        padding: 0,
        title: CMDBuildUI.locales.Locales.administration.systemconfig.passwordmanagement,
        localized: {
            title: 'CMDBuildUI.locales.Locales.administration.systemconfig.passwordmanagement'
        },
        defaults: {
            xtype: 'fieldcontainer',
            layout: 'column',
            defaults: {
                columnWidth: 0.5,
                padding: CMDBuildUI.util.helper.FormHelper.properties.padding
            }
        },
        items: [{
            // row 1
            items: [{
                // left column
                items: [{
                    // property: active
                    xtype: 'checkbox',
                    fieldLabel: CMDBuildUI.locales.Locales.administration.systemconfig.allowpasswordchange,
                    localized: {
                        fieldLabel: 'CMDBuildUI.locales.Locales.administration.systemconfig.allowpasswordchange'
                    },
                    name: 'allowpasswordchange',
                    bind: {
                        value: '{theSetup.org__DOT__cmdbuild__DOT__password__DOT__allow_password_change}',
                        readOnly: '{actions.view}'
                    }
                }] // end column items
            }] // end column items] // end row items
        }] // end fieldset items
    }] // end form items
});