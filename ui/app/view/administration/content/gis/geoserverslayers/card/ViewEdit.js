Ext.define('CMDBuildUI.view.administration.content.gis.geoserverslayers.card.ViewEdit', {
    extend: 'Ext.form.Panel',

    requires: [
        'CMDBuildUI.view.administration.content.gis.geoserverslayers.card.ViewEditController',
        'CMDBuildUI.view.administration.content.gis.geoserverslayers.card.ViewEditModel'
    ],

    alias: 'widget.administration-content-gis-geoserverslayers-card-viewedit',
    controller: 'administration-content-gis-geoserverslayers-card-viewedit',
    viewModel: {
        type: 'administration-content-gis-geoserverslayers-card-viewedit'
    },
    scrollable: 'y',
    fieldDefaults: CMDBuildUI.util.helper.FormHelper.fieldDefaults,
    cls: 'administration tab-hidden',
    ui: 'administration-tabandtools',

    items: [{
            xtype: 'components-administration-toolbars-formtoolbar',
            region: 'north',
            items: CMDBuildUI.util.administration.helper.FormHelper.getTools({
                edit: true,
                delete: true,
                clone: true,
                activeToggle: true
            }, 'gislayer', 'theLayer'),
            hidden: true,
            bind: {
                hidden: '{!actions.view}'
            }
        },
        {
            ui: 'administration-formpagination',
            xtype: 'container',
            fieldDefaults: CMDBuildUI.util.administration.helper.FormHelper.fieldDefaults,
            items: [{
                ui: 'administration-formpagination',
                xtype: "fieldset",
                layout: 'column',
                collapsible: true,
                title: CMDBuildUI.locales.Locales.administration.common.strings.generalproperties,
                localized: {
                    title: 'CMDBuildUI.locales.Locales.administration.common.strings.generalproperties'
                },
                items: [{
                    xtype: 'fieldcontainer',
                    layout: 'column',
                    columnWidth: 1,
                    items: [
                        CMDBuildUI.util.administration.helper.FieldsHelper.getTypeInput({
                            type: {
                                fieldcontainer: {
                                    columnWidth: 0.5,
                                    allowBlank: false
                                },
                                forceSelection: true,
                                allowBlank: false,
                                bind: {
                                    value: '{theLayer.type}',
                                    store: '{typeStore}'
                                }
                            }
                        })
                    ]
                }, {
                    xtype: 'fieldcontainer',
                    layout: 'column',
                    columnWidth: 1,
                    items: [CMDBuildUI.util.administration.helper.FieldsHelper.getAllClassesInput({
                        associatedClass: {

                            fieldcontainer: {

                                fieldLabel: CMDBuildUI.locales.Locales.administration.gis.associatedclass,
                                localized: {
                                    fieldLabel: 'CMDBuildUI.locales.Locales.administration.gis.associatedclass'
                                },
                                columnWidth: 0.5,
                                allowBlank: false
                            },
                            allowBlank: false,
                            withClasses: true,
                            withProcesses: true,
                            displayfield: {
                                bind: {
                                    value: '{theLayer._owner_type_description}'
                                }
                            },
                            combofield: {
                                bind: {
                                    value: '{theLayer.owner_type}'
                                },
                                listeners: {
                                    change: function (input, newValue, oldValue) {
                                        var form = input.up('form');                                        
                                        if (!newValue && oldValue && form) {
                                            var geoattribute = form.down('#geoattribute_input');
                                            if (geoattribute) {
                                                geoattribute.setValue(null);
                                            }
                                        }
                                        var deafultValueContainer = form.down('#ownerTypeCardContainer');
                                        deafultValueContainer.removeAll();
                                        if (newValue) {
                                            
                                            deafultValueContainer.add({
                                                columnWidth: 1,
                                                allowBlank: false,
                                                xtype: 'referencecombofield',
                                                displayField: 'Description',
                                                itemId: 'defaultValue_input',
                                                valueField: '_id',
                                                disabled: !newValue,
                                                style: 'padding-right: 15px',
                                                metadata: {
                                                    targetType: CMDBuildUI.util.helper.ModelHelper.getObjectTypeByName(newValue),
                                                    targetClass: newValue
                                                },
                                                hidden: true,
                                                bind: {
                                                    hidden: '{actions.view}',
                                                    value: '{theLayer.owner_id}'
                                                }
                                            });
                                        } else {
                                            deafultValueContainer.add({
                                                columnWidth: 1,
                                                hidden: true,
                                                allowBlank: false,
                                                xtype: 'combo',
                                                store: {
                                                    proxy: {
                                                        type: 'memory'
                                                    }
                                                },
                                                bind: {
                                                    hidden: '{actions.view}'
                                                }
                                            });
                                        }
                                    }
                                }
                            }
                            
                        }

                    }, 'associatedClass'), {
                        xtype: 'fieldcontainer',
                        layout: 'column',
                        columnWidth: 0.5,
                        fieldLabel: CMDBuildUI.locales.Locales.administration.gis.file,
                        localized: {
                            fieldLabel: 'CMDBuildUI.locales.Locales.administration.gis.file'
                        },
                        hidden: true,
                        bind: {
                            hidden: '{actions.view}'
                        },
                        allowBlank: false,
                        items: [{
                            allowBlank: false,
                            xtype: 'filefield',
                            columnWidth: 1,
                            name: 'file',
                            buttonConfig: {
                                ui: 'administration-secondary-action-small'
                            }
                        }]
                    }]
                }, {
                    xtype: 'fieldcontainer',
                    layout: 'column',
                    columnWidth: 1,
                    items: [
                        CMDBuildUI.util.administration.helper.FieldsHelper.getActiveInput({
                            active: {
                                bind: {
                                    value: '{theLayer.active}'
                                }
                            }
                        })
                    ]

                }]
            }, {
                ui: 'administration-formpagination',
                xtype: "fieldset",
                layout: 'column',
                collapsible: true,
                title: CMDBuildUI.locales.Locales.administration.gis.associatedcard,
                localized: {
                    title: 'CMDBuildUI.locales.Locales.administration.gis.associatedcard'
                },
                items: [


                    CMDBuildUI.util.administration.helper.FieldsHelper.getCommonComboInput('geoattribute', {
                        geoattribute: {
                            fieldcontainer: {
                                // config for fieldcontainer
                                allowBlank: false,
                                fieldLabel: CMDBuildUI.locales.Locales.administration.gis.associatedgeoattribute, // the localized object for label of field
                                localized: {
                                    fieldLabel: 'CMDBuildUI.locales.Locales.administration.gis.associatedgeoattribute'
                                }
                            },
                            displayfield: {
                                bind: {
                                    value: '{theLayer.description}'
                                }
                            },
                            forceSelection: true,
                            allowBlank: false,
                            displayField: 'description',
                            valueField: 'name',
                            bind: {
                                store: '{geoAttributesStore}',
                                value: '{theLayer.name}'
                            }
                        }
                    }),

                    {
                        xtype: 'fieldcontainer',
                        layout: 'column',
                        columnWidth: 0.5,
                        fieldLabel: CMDBuildUI.locales.Locales.administration.gis.associatedcard,
                        localized: {
                            fieldLabel: 'CMDBuildUI.locales.Locales.administration.gis.associatedcard'
                        },
                        hidden: true,
                        bind: {
                            hidden: '{!theLayer.owner_type}'
                        },
                        allowBlank: false,
                        items: [{
                            columnWidth: 1,
                            hidden: true,
                            xtype: 'displayfield',
                            bind: {
                                hidden: '{!actions.view}',
                                value: '{theLayer.cardDescription}'
                            }
                        }, {
                            columnWidth: 1,
                            xtype: 'fieldcontainer',
                            layout: 'column',
                            itemId: 'ownerTypeCardContainer',
                            items: []

                        }]
                    }
                ]
            }]
        }
    ],
    dockedItems: [{
        xtype: 'toolbar',
        dock: 'bottom',
        ui: 'footer',
        hidden: true,
        bind: {
            hidden: '{actions.view}'
        },
        items: CMDBuildUI.util.administration.helper.FormHelper.getSaveCancelButtons()
    }]
});