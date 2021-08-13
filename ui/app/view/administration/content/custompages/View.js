Ext.define('CMDBuildUI.view.administration.content.custompages.View', {
    extend: 'Ext.form.Panel',

    requires: [
        'CMDBuildUI.view.administration.content.custompages.ViewController',
        'CMDBuildUI.view.administration.content.custompages.ViewModel'
    ],
    alias: 'widget.administration-content-custompages-view',
    controller: 'administration-content-custompages-view',
    layout: 'border',
    viewModel: {
        type: 'administration-content-custompages-view'
    },
    ui: 'administration-tabandtools',
    bind: {
        userCls: '{formModeCls}' // this is used for hide label localzation icon in `view` mode
    },
    fieldDefaults: CMDBuildUI.util.administration.helper.FormHelper.fieldDefaults,
    items: [{
        xtype: 'container',
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
            localized: {
                title: 'CMDBuildUI.locales.Locales.administration.common.strings.generalproperties'
            },
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
                                value: '{theCustompage.componentId}',
                                disabled: '{actions.edit}'
                            }
                        }
                    })]
            }, {
                items: [CMDBuildUI.util.administration.helper.FieldsHelper.getDescriptionInput({
                    description: {
                        name: 'description',
                        bind: {
                            value: '{theCustompage.description}'
                        },
                        allowBlank: false,
                        fieldcontainer: {
                            // userCls: 'with-tool',
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
                            value: '{theCustompage.device}',
                            store: '{targetDevicesStore}'
                        }
                    }
                }, true)]
            }, {
                items: [
                    CMDBuildUI.util.administration.helper.FieldsHelper.getActiveInput({
                        active: {
                            bind: {
                                value: '{theCustompage.active}'
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
            title: CMDBuildUI.locales.Locales.administration.custompages.titles.file, // File
            localized: {
                fieldLabel: 'CMDBuildUI.locales.Locales.administration.custompages.titles.file'
            },
            items: [{
                layout: 'column',
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
                        name: 'fileCustompage',
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
        padding: '5 10 5 10',
        borderBottom: 0,
        itemId: 'toolbarscontainer',
        style: 'border-bottom-width:0!important',
        items: CMDBuildUI.util.administration.helper.FormHelper.getTools({},
            'custompage',
            'theCustompage',
            [{
                xtype: 'button',
                text: CMDBuildUI.locales.Locales.administration.custompages.texts.addcustompage, // Add custompage
                localized: {
                    text: 'CMDBuildUI.locales.Locales.administration.custompages.texts.addcustompage'
                },
                ui: 'administration-action-small',
                reference: 'addCustompage',
                itemId: 'addBtn',
                iconCls: 'x-fa fa-plus',
                autoEl: {
                    'data-testid': 'administration-custompage-addCustompageBtn'
                },
                bind: {
                    disabled: '{!toolAction._canAdd}'
                }
            }, {
                xtype: 'textfield',
                name: 'search',
                width: 250,
                emptyText: CMDBuildUI.locales.Locales.administration.custompages.emptytexts.searchcustompages, // Search custompage...
                localized: {
                    emptyText: 'CMDBuildUI.locales.Locales.administration.custompages.emptytexts.searchcustompages'
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
                            'data-testid': 'administration-custompage-form-search-trigger'
                        }
                    },
                    clear: {
                        cls: Ext.baseCSSPrefix + 'form-clear-trigger',
                        handler: 'onSearchClear',
                        autoEl: {
                            'data-testid': 'administration-custompage-form-clear-trigger'
                        }
                    }
                },
                autoEl: {
                    'data-testid': 'administration-custompage-search-form'
                }
            }, {
                xtype: 'tbfill'
            }],
            null,
            [{
                xtype: 'tbtext',

                bind: {
                    hidden: '{!theCustompage.description}',
                    html: '{custompageLabel}: <b data-testid="administration-lookuptypes-toolbar-className">{theCustompage.description}</b>'
                }
            }])
    }, {
        dock: 'top',
        xtype: 'container',
        items: [{
            xtype: 'components-administration-toolbars-formtoolbar',
            items: CMDBuildUI.util.administration.helper.FormHelper.getTools({
                edit: true,
                download: true,
                'delete': true,
                activeToggle: true
            }, 'custompage', 'theCustompage'),
            bind: {
                hidden: '{formtoolbarHidden}'
            }
        }]
    }, {
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