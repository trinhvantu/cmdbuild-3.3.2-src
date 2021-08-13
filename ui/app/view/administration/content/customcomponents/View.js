Ext.define('CMDBuildUI.view.administration.content.customcomponents.View', {
    extend: 'Ext.form.Panel',

    requires: [
        'CMDBuildUI.view.administration.content.customcomponents.ViewController',
        'CMDBuildUI.view.administration.content.customcomponents.ViewModel'
    ],
    alias: 'widget.administration-content-customcomponents-view',
    controller: 'administration-content-customcomponents-view',
    layout: 'border',
    viewModel: {
        type: 'administration-content-customcomponents-view'
    },
    ui: 'administration-tabandtools',
    fieldDefaults: CMDBuildUI.util.administration.helper.FormHelper.fieldDefaults,
    bind: {
        userCls: '{formModeCls}' // this is used for hide label localzation icon in `view` mode
    },
    items: [{
        xtype: 'panel',
        region: 'center',
        scrollable: 'y',
        hidden: true,
        bind: {
            hidden: '{hideForm}'
        },
        items: [{
            ui: 'administration-formpagination',
            xtype: "fieldset",
            collapsible: true,
            title: CMDBuildUI.locales.Locales.administration.common.strings.generalproperties,
            defaults: {
                columnWidth: 0.5,
                layout: 'column',
                xtype: 'container'
            },
            items: [{
                items: [
                    CMDBuildUI.util.administration.helper.FieldsHelper.getCommonTextfieldInput('componentId', {
                        componentId: {
                            fieldcontainer: {
                                fieldLabel: CMDBuildUI.locales.Locales.administration.custompages.fieldlabels.componentid, // Component
                                localized: {
                                    fieldLabel: 'CMDBuildUI.locales.Locales.administration.custompages.fieldlabels.componentid'
                                },
                                hidden: true,
                                bind: {
                                    hidden: '{actions.add}'
                                }
                            },
                            disabled: true,
                            bind: {
                                value: '{theCustomcomponent.componentId}',
                                disabled: '{actions.edit}'
                            }
                        }
                    })]
            }, {
                items: [CMDBuildUI.util.administration.helper.FieldsHelper.getDescriptionInput({
                    description: {
                        name: 'description',
                        bind: {
                            value: '{theCustomcomponent.description}'
                        },
                        allowBlank: false,
                        fieldcontainer: {                           
                            labelToolIconCls: 'fa-flag',
                            labelToolIconQtip: CMDBuildUI.locales.Locales.administration.attributes.tooltips.translate,
                            labelToolIconClick: 'onTranslateClick'
                        }
                    }
                })]
            }, {
                items: [CMDBuildUI.util.administration.helper.FieldsHelper.getCommonComboInput('device', {
                    device: {
                        fieldcontainer: {
                            fieldLabel: 'Target device'
                        },
                        valueField: 'value',
                        labelField: 'label',
                        bind: {
                            value: '{theCustomcomponent.device}',
                            store: '{targetDevicesStore}'
                        }
                    }
                }, true)]
            }, {
                items: [
                    CMDBuildUI.util.administration.helper.FieldsHelper.getActiveInput({
                        active: {
                            bind: {
                                value: '{theCustomcomponent.active}'
                            }
                        }
                    }, 'active')
                ]
            }]
        }, {
            ui: 'administration-formpagination',
            xtype: "fieldset",
            bind: {
                hidden: '{actions.view}'
            },
            collapsible: true,
            title: CMDBuildUI.locales.Locales.administration.customcomponents.titles.file, // File
            localized: {
                fieldLabel: 'CMDBuildUI.locales.Locales.administration.customcomponents.titles.file'
            },
            items: [{
                layout: 'column',
                columnWidth: 0.5,
                items: [{
                    columnWidth: 0.5,
                    xtype: 'fieldcontainer',
                    layout: 'column',
                    fieldLabel: CMDBuildUI.locales.Locales.administration.custompages.fieldlabels.zipfile, // Zip file
                    localized: {
                        fieldLabel: 'CMDBuildUI.locales.Locales.administration.custompages.fieldlabels.zipfile'
                    },
                    allowBlank: false,
                    items: [{
                        flex: 1,
                        xtype: 'filefield',
                        name: 'fileCustomcomponent',
                        msgTarget: 'side',
                        emptyText: CMDBuildUI.locales.Locales.administration.custompages.texts.selectfile,
                        localized: {
                            emptyText: 'CMDBuildUI.locales.Locales.administration.custompages.texts.selectfile'
                        },
                        accept: '.zip',
                        buttonConfig: {
                            ui: 'administration-secondary-action-small'
                        },
                        bind: {
                            hidden: '{actions.view}'
                        }
                    }]
                }]
            }]
        }]
    }],

    dockedItems: [{
        xtype: 'components-administration-toolbars-formtoolbar',
        dock: 'top',
        padding: '6 0 6 8',
        borderBottom: 0,
        itemId: 'toolbarscontainer',
        style: 'border-bottom-width:0!important',
        items: CMDBuildUI.util.administration.helper.FormHelper.getTools({},
            'searchfilter',
            'theViewFilter',
            [{
                xtype: 'button',
                text: CMDBuildUI.locales.Locales.administration.customcomponents.texts.addcustomcomponent, // Add customcomponent
                localized: {
                    text: 'CMDBuildUI.locales.Locales.administration.customcomponents.texts.addcustomcomponent'
                },
                ui: 'administration-action-small',
                itemId: 'addBtn',
                iconCls: 'x-fa fa-plus',
                autoEl: {
                    'data-testid': 'administration-class-toolbar-addLookupTypeBtn'
                },
                bind: {
                    disabled: '{!toolAction._canAdd}'
                }  
            }, {
                xtype: 'textfield',
                name: 'search',
                width: 250,
                emptyText: CMDBuildUI.locales.Locales.administration.customcomponents.emptytexts.searchcustompages, // Search customcomponent...
                localized: {
                    emptyText: 'CMDBuildUI.locales.Locales.administration.customcomponents.emptytexts.searchcustompages'
                },
                cls: 'administration-input',
                reference: 'searchtext',
                itemId: 'searchtext',
                bind: {
                    value: '{search.value}',
                    hidden: '{!canFilter}'
                },
                listeners: {
                    specialkey: 'onSearchSpecialKey'
                },
                triggers: {
                    search: {
                        cls: Ext.baseCSSPrefix + 'form-search-trigger',
                        handler: 'onSearchSubmit',
                        autoEl: {
                            'data-testid': 'administration-lookuptypes-toolbar-form-search-trigger'
                        }
                    },
                    clear: {
                        cls: Ext.baseCSSPrefix + 'form-clear-trigger',
                        handler: 'onSearchClear',
                        autoEl: {
                            'data-testid': 'administration-lookuptypes-toolbar-form-clear-trigger'
                        }
                    }
                },
                autoEl: {
                    'data-testid': 'administration-lookuptypes-toolbar-search-form'
                }
            }, {
                xtype: 'tbfill'
            }],
            null,
            [{
                xtype: 'tbtext',
                hidden: true,
                bind: {
                    hidden: '{!theCustomcomponent.description}',
                    html: '{componentTypeName}: <b data-testid="administration-customcomponent-description">{theCustomcomponent.description}</b>'
                }
            }])
    }, {
        xtype: 'components-administration-toolbars-formtoolbar',
        region: 'top',
        borderBottom: 0,
        items: CMDBuildUI.util.administration.helper.FormHelper.getTools({
            edit: true, // #editBtn set true for show the button
            'delete': true, // #deleteBtn set true for show the button
            activeToggle: true, // #enableBtn and #disableBtn set true for show the buttons
            download: true // #downloadBtn set true for show the buttons
        },

            /* testId */
            'customcomponent',

            /* viewModel object needed only for activeTogle */
            'theCustomcomponent',

            /* add custom tools[] on the left of the bar */
            [],

            /* add custom tools[] before #editBtn*/
            [],

            /* add custom tools[] after at the end of the bar*/
            []
        ),
        bind: {
            hidden: '{formtoolbarHidden}'
        }
    }, {
        xtype: 'toolbar',
        dock: 'bottom',
        ui: 'footer',
        hidden: true,

        bind: {
            hidden: '{actions.view}'
        },
        items: CMDBuildUI.util.administration.helper.FormHelper.getSaveCancelButtons(true)
    }]


});