Ext.define('CMDBuildUI.view.administration.content.setup.elements.Workflow', {
    extend: 'Ext.panel.Panel',

    requires: [
        'CMDBuildUI.view.administration.content.setup.elements.WorkflowController',
        'CMDBuildUI.view.administration.content.setup.elements.WorkflowModel'
    ],
    alias: 'widget.administration-content-setup-elements-workflow',
    controller: 'administration-content-setup-elements-workflow',
    viewModel: {
        type: 'administration-content-setup-elements-workflow'
    },

    items: [{
        ui: 'administration-formpagination',
        xtype: "fieldset",
        collapsible: true,
        title: CMDBuildUI.locales.Locales.administration.systemconfig.generals,
        localized: {
            title: 'CMDBuildUI.locales.Locales.administration.systemconfig.generals'
        },
        items: [{
            layout: 'column',
            items: [{
                columnWidth: 0.5,
                items: [{
                    xtype: 'checkbox',
                    fieldLabel: CMDBuildUI.locales.Locales.administration.common.labels.active,
                    localized: {
                        fieldLabel: 'CMDBuildUI.locales.Locales.administration.common.labels.active'
                    },
                    name: 'enabled',
                    bind: {
                        value: '{theSetup.org__DOT__cmdbuild__DOT__workflow__DOT__enabled}',
                        readOnly: '{actions.view}'
                    }
                }]
            }, {
                columnWidth: 0.5,
                style: {
                    paddingLeft: '15px'
                },
                items: []
            }]

        }, {
            layout: 'column',
            items: [{
                columnWidth: 0.5,
                items: [{
                    xtype: 'checkbox',
                    fieldLabel: CMDBuildUI.locales.Locales.administration.systemconfig.enableattachmenttoclosedactivities,
                    localized: {
                        fieldLabel: 'CMDBuildUI.locales.Locales.administration.systemconfig.enableattachmenttoclosedactivities'
                    },
                    name: 'enableAddAttachmentOnClosedActivities',
                    bind: {
                        value: '{theSetup.org__DOT__cmdbuild__DOT__workflow__DOT__enableAddAttachmentOnClosedActivities}',
                        readOnly: '{actions.view}'
                    }
                }]
            }]
        }, {
            layout: 'column',
            items: [{
                columnWidth: 0.5,
                items: [{
                    xtype: 'checkbox',
                    fieldLabel: CMDBuildUI.locales.Locales.administration.systemconfig.usercandisable,
                    localized: {
                        fieldLabel: 'CMDBuildUI.locales.Locales.administration.systemconfig.usercandisable'
                    },
                    name: 'userCanDisable',
                    bind: {
                        value: '{theSetup.org__DOT__cmdbuild__DOT__workflow__DOT__userCanDisable}',
                        readOnly: '{actions.view}'
                    }
                }]
            }, {
                columnWidth: 0.5,
                style: {
                    paddingLeft: '15px'
                },
                items: [{
                    xtype: 'checkbox',
                    fieldLabel: CMDBuildUI.locales.Locales.administration.systemconfig.hidesavebutton,
                    localized: {
                        fieldLabel: 'CMDBuildUI.locales.Locales.administration.systemconfig.hidesavebutton'
                    },
                    name: 'hideSaveButton',
                    bind: {
                        value: '{theSetup.org__DOT__cmdbuild__DOT__workflow__DOT__hideSaveButton}',
                        readOnly: '{actions.view}'
                    }
                }]
            }]
        }, {
            layout: 'column',
            items: [{
                columnWidth: 0.5,
                items: [{
                    xtype: 'displayfield',
                    fieldLabel: CMDBuildUI.locales.Locales.administration.systemconfig.dafaultjobusername,
                    localized: {
                        fieldLabel: 'CMDBuildUI.locales.Locales.administration.systemconfig.dafaultjobusername'
                    },
                    bind: {
                        value: '{theSetup.org__DOT__cmdbuild__DOT__workflow__DOT__jobs__DOT__defaultUser}',
                        hidden: '{!actions.view}'
                    }
                }, {
                    xtype: 'textfield',
                    name: 'serviceUrl',
                    fieldLabel: CMDBuildUI.locales.Locales.administration.systemconfig.dafaultjobusername,
                    localized: {
                        fieldLabel: 'CMDBuildUI.locales.Locales.administration.systemconfig.dafaultjobusername'
                    },
                    bind: {
                        value: '{theSetup.org__DOT__cmdbuild__DOT__workflow__DOT__jobs__DOT__defaultUser}',
                        hidden: '{actions.view}'
                    }
                }]
            }]
        }]
    }, {
        ui: 'administration-formpagination',
        xtype: "fieldset",
        collapsible: true,
        collapsed: false,
        title: CMDBuildUI.locales.Locales.administration.systemconfig.tecnotecariver,
        localized: {
            title: 'CMDBuildUI.locales.Locales.administration.systemconfig.tecnotecariver'
        },
        items: [{
            layout: 'column',
            items: [{
                columnWidth: 0.5,
                items: [{
                    xtype: 'checkbox',
                    fieldLabel: CMDBuildUI.locales.Locales.administration.common.labels.active,
                    localized: {
                        fieldLabel: 'CMDBuildUI.locales.Locales.administration.common.labels.active'
                    },
                    name: 'riverEnabled',
                    bind: {                        
                        value: '{isRiverEnabled}',
                        readOnly: '{actions.view}'
                    }                    
                }]
            }, {
                columnWidth: 0.5,
                items: [{
                    xtype: 'checkbox',
                    style: {
                        paddingLeft: '15px'
                    },
                    fieldLabel: CMDBuildUI.locales.Locales.administration.groupandpermissions.texts.default,
                    localized: {
                        fieldLabel: 'CMDBuildUI.locales.Locales.administration.groupandpermissions.texts.default'
                    },
                    name: 'riverDefault',
                    reference: 'riverDefault',
                    bind: {
                        value: '{isRiverDefault}',
                        readOnly: '{actions.view}',                        
                        disabled: '{!isRiverEnabled}'
                    }
                }]
            }]
        }]
    }, {
        ui: 'administration-formpagination',
        xtype: "fieldset",
        collapsible: true,
        collapsed: true,
        title: CMDBuildUI.locales.Locales.administration.systemconfig.shark,
        localized: {
            title: 'CMDBuildUI.locales.Locales.administration.systemconfig.shark'
        },
        items: [{
            layout: 'column',
            items: [{
                columnWidth: 0.5,
                items: [{
                    xtype: 'displayfield',
                    name: 'username',
                    fieldLabel: CMDBuildUI.locales.Locales.administration.emails.username,
                    localized: {
                        fieldLabel: 'CMDBuildUI.locales.Locales.administration.emails.username'
                    },
                    bind: {
                        value: '{theSetup.org__DOT__cmdbuild__DOT__workflow__DOT__user}',
                        hidden: '{!actions.view}'
                    }
                }, {
                    xtype: 'textfield',
                    name: 'username',
                    listeners: {
                        afterrender: function (cmp) {
                            cmp.inputEl.set({
                                autocomplete: 'new-password'
                            });
                        }
                    },
                    fieldLabel: CMDBuildUI.locales.Locales.administration.emails.username,
                    localized: {
                        fieldLabel: 'CMDBuildUI.locales.Locales.administration.emails.username'
                    },
                    bind: {
                        value: '{theSetup.org__DOT__cmdbuild__DOT__workflow__DOT__user}',
                        hidden: '{actions.view}'
                    }
                }]
            }, {
                columnWidth: 0.5,
                style: {
                    paddingLeft: '15px'
                },
                items: [{
                    xtype: 'displayfield',
                    name: 'password',
                    fieldLabel: CMDBuildUI.locales.Locales.administration.emails.password,
                    localized: {
                        fieldLabel: 'CMDBuildUI.locales.Locales.administration.emails.password'
                    },                    
                    bind: {
                        hidden: '{!actions.view}',
                        value: '{hiddenPassword}'
                    }
                }, {
                    xtype: 'passwordfield',
                    name: 'password',
                    fieldLabel: CMDBuildUI.locales.Locales.administration.emails.password,
                    localized: {
                        fieldLabel: 'CMDBuildUI.locales.Locales.administration.emails.password'
                    },
                    bind: {
                        value: '{theSetup.org__DOT__cmdbuild__DOT__workflow__DOT__password}',
                        hidden: '{actions.view}'
                    }
                }]
            }]
        }, {
            layout: 'column',
            items: [{
                columnWidth: 0.5,
                items: [{
                    xtype: 'displayfield',
                    name: 'serviceUrl',
                    fieldLabel: CMDBuildUI.locales.Locales.administration.systemconfig.serviceurl,
                    localized: {
                        fieldLabel: 'CMDBuildUI.locales.Locales.administration.systemconfig.serviceurl'
                    },
                    bind: {
                        value: '{theSetup.org__DOT__cmdbuild__DOT__workflow__DOT__endpoint}',
                        hidden: '{!actions.view}'
                    }
                }, {
                    xtype: 'textfield',
                    name: 'serviceUrl',
                    fieldLabel: CMDBuildUI.locales.Locales.administration.systemconfig.serviceurl,
                    localized: {
                        fieldLabel: 'CMDBuildUI.locales.Locales.administration.systemconfig.serviceurl'
                    },
                    bind: {
                        value: '{theSetup.org__DOT__cmdbuild__DOT__workflow__DOT__endpoint}',
                        hidden: '{actions.view}'
                    }
                }]
            }, {
                columnWidth: 0.5,
                style: {
                    paddingLeft: '15px'
                },
                items: [{
                    xtype: 'checkbox',
                    fieldLabel: CMDBuildUI.locales.Locales.administration.systemconfig.disablesynconmissingvariables,
                    localized: {
                        fieldLabel: 'CMDBuildUI.locales.Locales.administration.systemconfig.disablesynconmissingvariables'
                    },
                    name: 'disableSynchronizationOfMissingVariables',
                    bind: {
                        value: '{theSetup.org__DOT__cmdbuild__DOT__workflow__DOT__disableSynchronizationOfMissingVariables}',
                        readOnly: '{actions.view}'
                    }
                }]
            }]
        }, {
            layout: 'column',
            items: [{
                columnWidth: 0.5,
                items: [{
                    xtype: 'checkbox',
                    fieldLabel: CMDBuildUI.locales.Locales.administration.common.labels.active,
                    localized: {
                        fieldLabel: 'CMDBuildUI.locales.Locales.administration.common.labels.active'
                    },
                    name: 'sharkEnabled',
                    bind: {                        
                        value: '{isSharkEnabled}',
                        readOnly: '{actions.view}'
                    }
                }]
            }, {
                columnWidth: 0.5,
                items: [{
                    xtype: 'checkbox',
                    style: {
                        paddingLeft: '15px'
                    },
                    fieldLabel: CMDBuildUI.locales.Locales.administration.common.labels.default,
                    localized: {
                        fieldLabel: 'CMDBuildUI.locales.Locales.administration.common.labels.default'
                    },
                    name: 'sharkDefault',
                    reference: 'sharkDefault',
                    bind: {
                        value: '{isSharkDefault}',
                        readOnly: '{actions.view}',
                        disabled: '{!isSharkEnabled}'
                    }                
                }]
            }]
        }]
    }]
});