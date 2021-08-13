Ext.define('CMDBuildUI.view.administration.content.setup.elements.DocumentManagementSystem', {
    extend: 'Ext.panel.Panel',

    requires: [
        'CMDBuildUI.view.administration.content.setup.elements.DocumentManagementSystemController',
        'CMDBuildUI.view.administration.content.setup.elements.DocumentManagementSystemModel'
    ],

    alias: 'widget.administration-content-setup-elements-documentmanagementsystem',
    controller: 'administration-content-setup-elements-documentmanagementsystem',
    viewModel: {
        type: 'administration-content-setup-elements-documentmanagementsystem'
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
                    name: 'isEnabled',
                    bind: {
                        value: '{theSetup.org__DOT__cmdbuild__DOT__dms__DOT__enabled}',
                        readOnly: '{actions.view}'
                    }
                }]
            }]
        }, {
            layout: 'column',
            items: [{
                columnWidth: 0.5,
                items: [{
                    xtype: 'fieldcontainer',
                    fieldLabel: CMDBuildUI.locales.Locales.administration.dmscategories.dmscategory,
                    localized: {
                        fieldLabel: 'CMDBuildUI.locales.Locales.administration.dmscategories.dmscategory'
                    },
                    items: [{
                        xtype: 'displayfield',
                        name: 'attachmentTypeLookup',
                        hidden: true,
                        bind: {                                                        
                            value: '{theSetup.org__DOT__cmdbuild__DOT__dms__DOT__category}',
                            hidden: '{!actions.view}'
                        },
                        renderer: function (value) {
                            if (!Ext.isEmpty(value)) {
                                var store = Ext.getStore('dms.DMSCategoryTypes');
                                var record = store.findRecord('code', value);
                                if (record) {
                                    return record.get('description');
                                }
                            }
                            return value;
                        }
                    }, {
                        /********************* Category Lookup **********************/
                        xtype: 'combobox',
                        queryMode: 'local',
                        forceSelection: true,
                        displayField: 'name',
                        valueField: 'name',
                        name: 'attachmentTypeLookup',
                        hidden: true,
                        bind: {
                            store: '{dmsCategoryTypesStore}',                            
                            value: '{theSetup.org__DOT__cmdbuild__DOT__dms__DOT__category}',
                            hidden: '{actions.view}'
                        }
                    }]
                }]
            }]
        }, {
            layout: 'column',
            items: [{
                columnWidth: 0.5,
                items: [{
                    /********************* Service Type **********************/
                    xtype: 'displayfield',
                    fieldLabel: CMDBuildUI.locales.Locales.administration.gis.servicetype,
                    localized: {
                        fieldLabel: 'CMDBuildUI.locales.Locales.administration.gis.servicetype'
                    },
                    name: 'dmsServiceType',
                    hidden: true,
                    bind: {
                        value: '{theSetup.org__DOT__cmdbuild__DOT__dms__DOT__service__DOT__type}',
                        hidden: '{!actions.view}'
                    },
                    renderer: function (value) {
                        switch (value) {
                            case 'cmis':
                                return CMDBuildUI.locales.Locales.administration.systemconfig.cmis;
                            case 'alfresco':
                                return ""; // not supported
                            case 'postgres':
                                return CMDBuildUI.locales.Locales.administration.systemconfig.postgres; // not supported
                            default:
                                return value;
                        }
                    }
                }, {
                    xtype: 'combobox',
                    fieldLabel: CMDBuildUI.locales.Locales.administration.gis.servicetype,
                    localized: {
                        fieldLabel: 'CMDBuildUI.locales.Locales.administration.gis.servicetype'
                    },
                    name: 'dmsServiceType',
                    itemId: 'dmsServiceType',

                    editable: false,
                    store: Ext.create('Ext.data.Store', {
                        fields: ['value', 'label'],
                        data: [
                            // {
                            //     "value": "alfresco",
                            //     "label": "Afresco (v. 3.4 or lower)"
                            // }, 
                            {
                                "value": "cmis",
                                "label": CMDBuildUI.locales.Locales.administration.systemconfig.cmis
                            }, {
                                "value": "postgres",
                                "label": CMDBuildUI.locales.Locales.administration.systemconfig.postgres // sperimental
                            }
                        ]
                    }),
                    queryMode: 'local',
                    displayField: 'label',
                    valueField: 'value',
                    hidden: true,
                    bind: {
                        value: '{theSetup.org__DOT__cmdbuild__DOT__dms__DOT__service__DOT__type}',
                        hidden: '{actions.view}'
                    }
                }]
            }]
        }]
    }, {
        ui: 'administration-formpagination',
        xtype: "fieldset",
        collapsible: true,
        title: "CMIS",
        hidden: true,
        bind: {
            hidden: '{!isCmis}'
        },
        items: [{
            layout: 'column',
            items: [{
                columnWidth: 0.5,
                items: [{
                    xtype: 'displayfield',
                    name: 'cmisHost',
                    fieldLabel: CMDBuildUI.locales.Locales.administration.systemconfig.host,
                    localized: {
                        fieldLabel: 'CMDBuildUI.locales.Locales.administration.systemconfig.host'
                    },
                    bind: {
                        value: '{theSetup.org__DOT__cmdbuild__DOT__dms__DOT__service__DOT__cmis__DOT__url}',
                        hidden: '{!actions.view}'
                    }
                }, {
                    xtype: 'textfield',
                    name: 'cmisHost',
                    fieldLabel: CMDBuildUI.locales.Locales.administration.systemconfig.host,
                    localized: {
                        fieldLabel: 'CMDBuildUI.locales.Locales.administration.systemconfig.host'
                    },
                    bind: {
                        value: '{theSetup.org__DOT__cmdbuild__DOT__dms__DOT__service__DOT__cmis__DOT__url}',
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
                    name: 'webServicePath',
                    fieldLabel: CMDBuildUI.locales.Locales.administration.systemconfig.webservicepath,
                    localized: {
                        fieldLabel: 'CMDBuildUI.locales.Locales.administration.systemconfig.webservicepath'
                    },
                    bind: {
                        value: '{theSetup.org__DOT__cmdbuild__DOT__dms__DOT__service__DOT__cmis__DOT__path}',
                        hidden: '{!actions.view}'
                    }
                }, {
                    xtype: 'textfield',
                    name: 'webServicePath',
                    fieldLabel: CMDBuildUI.locales.Locales.administration.systemconfig.webservicepath,
                    localized: {
                        fieldLabel: 'CMDBuildUI.locales.Locales.administration.systemconfig.webservicepath'
                    },
                    bind: {
                        value: '{theSetup.org__DOT__cmdbuild__DOT__dms__DOT__service__DOT__cmis__DOT__path}',
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
                    name: 'username',
                    fieldLabel: CMDBuildUI.locales.Locales.administration.emails.username,
                    localized: {
                        fieldLabel: 'CMDBuildUI.locales.Locales.administration.emails.username'
                    },
                    bind: {
                        value: '{theSetup.org__DOT__cmdbuild__DOT__dms__DOT__service__DOT__cmis__DOT__user}',
                        hidden: '{!actions.view}'
                    }
                }, {
                    xtype: 'textfield',
                    name: 'username',
                    listeners: {
                        afterrender: function (cmp) {
                            cmp.inputEl.set({
                                autocomplete: 'new-username'
                            });
                        }
                    },
                    fieldLabel: CMDBuildUI.locales.Locales.administration.emails.username,
                    localized: {
                        fieldLabel: 'CMDBuildUI.locales.Locales.administration.emails.username'
                    },
                    bind: {
                        value: '{theSetup.org__DOT__cmdbuild__DOT__dms__DOT__service__DOT__cmis__DOT__user}',
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
                        value: '{theSetup.org__DOT__cmdbuild__DOT__dms__DOT__service__DOT__cmis__DOT__password}',
                        hidden: '{actions.view}'
                    }
                }]
            }]
        }]
    }, {

        ui: 'administration-formpagination',
        xtype: "fieldset",
        collapsible: true,
        title: CMDBuildUI.locales.Locales.administration.systemconfig.attachmentsfilestypes,
        localized: {
            title: 'CMDBuildUI.locales.Locales.administration.systemconfig.attachmentsfilestypes'
        },
        layout: 'column',
        items: [{
                xtype: 'textarea',
                columnWidth: 0.5,
                fieldLabel: CMDBuildUI.locales.Locales.administration.systemconfig.allowonlythisfiletypesforcardandemail,
                emptyText: CMDBuildUI.locales.Locales.administration.systemconfig.allowonluthisfiletypesemptyvalue,
                localized: {
                    emptyText: 'CMDBuildUI.locales.Locales.administration.systemconfig.allowonluthisfiletypesemptyvalue',
                    fieldLabel: 'CMDBuildUI.locales.Locales.administration.systemconfig.allowonlythisfiletypesforcardandemail'
                },

                bind: {
                    value: '{theSetup.org__DOT__cmdbuild__DOT__dms__DOT__regularAttachments__DOT__allowedFileExtensions}',
                    readOnly: '{actions.view}'
                },
                resizable: {
                    handles: "s"
                },
                listeners: {
                    blur: function (textarea, event, eOpts) {
                        var value = textarea.getValue();
                        var extensions = value.split(',');
                        var cleanedExtension = [];
                        Ext.Array.forEach(extensions, function (item) {
                            var value = item.trim();
                            if (value && value.length) {
                                cleanedExtension.push(value);
                            }
                        });
                        textarea.setValue(cleanedExtension.join(','));
                    }
                }
            }, {
                xtype: 'textarea',
                columnWidth: 0.5,
                fieldLabel: CMDBuildUI.locales.Locales.administration.systemconfig.allowonlythisfiletypesofincomingmailattachments,
                emptyText: CMDBuildUI.locales.Locales.administration.systemconfig.allowonluthisfiletypesemptyvalue,
                localized: {
                    emptyText: 'CMDBuildUI.locales.Locales.administration.systemconfig.allowonluthisfiletypesemptyvalue',
                    fieldLabel: 'CMDBuildUI.locales.Locales.administration.systemconfig.allowonlythisfiletypesofincomingmailattachments'
                },

                bind: {
                    value: '{theSetup.org__DOT__cmdbuild__DOT__dms__DOT__incomingEmailAttachments__DOT__allowedFileExtensions}',
                    readOnly: '{actions.view}'
                },
                resizable: {
                    handles: "s"
                },
                listeners: {
                    blur: function (textarea, event, eOpts) {
                        var value = textarea.getValue();
                        var extensions = value.split(',');
                        var cleanedExtension = [];
                        Ext.Array.forEach(extensions, function (item) {
                            var value = item.trim();
                            if (value && value.length) {
                                cleanedExtension.push(value);
                            }
                        });
                        textarea.setValue(cleanedExtension.join(','));
                    }
                }
            }

            // NOT USED FOR NOW
            // ,{
            //     layout: 'column',
            //     items: [{
            //         columnWidth: 0.5,
            //         items: [
            //             CMDBuildUI.util.administration.helper.FieldsHelper.getCommonCheckboxInput('allowedExtensions', {
            //                 allowedExtensions: {

            //                     bind: {
            //                         value: '{theSetup.org__DOT__cmdbuild__DOT__dms__DOT__enabled}', // TODO define this key
            //                         readOnly: '{actions.view}'
            //                     }
            //                 }
            //             })]
            //     }]
            // }, {
            //     xtype: 'administration-content-setup-elements-attachmentsfiletypesgrid',
            //     formMode: CMDBuildUI.util.administration.helper.FormHelper.formActions.view,
            //     bind: {
            //         hidden: '{actions.edit}'
            //     }
            // }, {
            //     itemId: 'attachemntsfiletype',
            //     xtype: 'administration-content-setup-elements-attachmentsfiletypesgrid',
            //     formMode: CMDBuildUI.util.administration.helper.FormHelper.formActions.edit,
            //     bind: {
            //         hidden: '{actions.view}'
            //     }
            // }
        ]

    }]
});