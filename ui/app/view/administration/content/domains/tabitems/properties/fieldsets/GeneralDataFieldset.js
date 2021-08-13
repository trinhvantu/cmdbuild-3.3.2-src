Ext.define('CMDBuildUI.view.administration.content.domains.tabitems.properties.fieldsets.GeneralDataFieldset', {
    extend: 'Ext.panel.Panel',
    requires: [
        'CMDBuildUI.view.administration.content.domains.tabitems.properties.fieldsets.GeneralDataFieldsetController',
        'CMDBuildUI.view.administration.content.domains.tabitems.properties.fieldsets.GeneralDataFieldsetModel'
    ],

    alias: 'widget.administration-content-domains-tabitems-properties-fieldsets-generaldatafieldset',

    controller: 'administration-content-domains-tabitems-properties-fieldsets-generaldatafieldset',
    viewModel: {
        type: 'administration-content-domains-tabitems-properties-fieldsets-generaldatafieldset'
    },
    ui: 'administration-formpagination',

    items: [{
        xtype: 'fieldset',
        title: CMDBuildUI.locales.Locales.administration.groupandpermissions.titles.generalattributes,
        localized: {
            title: 'CMDBuildUI.locales.Locales.administration.groupandpermissions.titles.generalattributes'
        },
        layout: 'anchor',
        itemId: 'domain-generaldatafieldset',
        ui: 'administration-formpagination',
        items: [{
            layout: 'column',

            items: [{
                columnWidth: 0.5,
                /********************* Name **********************/
                items: [{
                    // create / edit
                    xtype: 'textfield',
                    vtype: 'alphanum',
                    reference: 'domainname',
                    fieldLabel: CMDBuildUI.locales.Locales.administration.common.labels.name,
                    localized: {
                        fieldLabel: 'CMDBuildUI.locales.Locales.administration.common.labels.name'
                    },
                    name: 'name',
                    enforceMaxLength: true,
                    hidden: true,
                    allowBlank: false,
                    bind: {
                        value: '{theDomain.name}',
                        hidden: '{!actions.add}'
                    },
                    listeners: {
                        change: function (input, newVal, oldVal) {
                            CMDBuildUI.util.administration.helper.FieldsHelper.copyTo(input, newVal, oldVal, '[name="description"]');
                        }
                    }
                }, {
                    // view
                    xtype: 'displayfield',
                    fieldLabel: CMDBuildUI.locales.Locales.administration.common.labels.name,
                    localized: {
                        fieldLabel: 'CMDBuildUI.locales.Locales.administration.common.labels.name'
                    },
                    name: 'name',
                    hidden: true,
                    bind: {
                        value: '{theDomain.name}',
                        hidden: '{!actions.view}'
                    }
                }, {
                    // edit
                    xtype: 'textfield',
                    fieldLabel: CMDBuildUI.locales.Locales.administration.common.labels.name,
                    localized: {
                        fieldLabel: 'CMDBuildUI.locales.Locales.administration.common.labels.name'
                    },
                    name: 'name',
                    hidden: true,
                    disabled: true,
                    allowBlank: false,
                    bind: {
                        value: '{theDomain.name}',
                        hidden: '{!actions.edit}'
                    }
                }]
            }, {
                columnWidth: 0.5,
                style: {
                    paddingLeft: '15px'
                },
                /********************* description **********************/
                items: [{
                    // edit
                    columnWidth: 0.5,
                    xtype: 'textfield',
                    name: 'description',
                    bind: {
                        value: '{theDomain.description}',
                        hidden: '{!actions.edit}'
                    },
                    allowBlank: false,
                    fieldLabel: CMDBuildUI.locales.Locales.administration.common.labels.description,
                    localized: {
                        fieldLabel: 'CMDBuildUI.locales.Locales.administration.common.labels.description',
                        labelToolIconQtip: 'CMDBuildUI.locales.Locales.administration.attributes.tooltips.translate'
                    },
                    labelToolIconCls: 'fa-flag',
                    labelToolIconQtip: CMDBuildUI.locales.Locales.administration.attributes.tooltips.translate,
                    labelToolIconClick: 'onTranslateClickDescription'
                }, {
                    // view
                    xtype: 'displayfield',
                    name: 'description',
                    fieldLabel: CMDBuildUI.locales.Locales.administration.common.labels.description,
                    localized: {
                        fieldLabel: 'CMDBuildUI.locales.Locales.administration.common.labels.description'
                    },
                    hidden: true,
                    bind: {
                        value: '{theDomain.description}',
                        hidden: '{!actions.view}'
                    }
                }, {
                    // add
                    xtype: 'textfield',
                    name: 'description',
                    fieldLabel: CMDBuildUI.locales.Locales.administration.common.labels.description,
                    localized: {
                        fieldLabel: 'CMDBuildUI.locales.Locales.administration.common.labels.description'
                    },
                    hidden: true,
                    allowBlank: false,
                    bind: {
                        value: '{theDomain.description}',
                        hidden: '{!actions.add}'
                    },
                    labelToolIconCls: 'fa-flag',
                    labelToolIconQtip: CMDBuildUI.locales.Locales.administration.attributes.tooltips.translate,
                    labelToolIconClick: 'onTranslateClickDescription'
                }]
            }]
        }, {
            layout: 'column',
            items: [{
                columnWidth: 0.5,
                /********************* Source **********************/
                items: [{
                    // create
                    xtype: 'combobox',
                    fieldLabel: CMDBuildUI.locales.Locales.administration.domains.fieldlabels.origin,
                    localized: {
                        fieldLabel: 'CMDBuildUI.locales.Locales.administration.domains.fieldlabels.origin'
                    },
                    valueField: '_id',
                    displayField: 'label',
                    queryMode: 'local',
                    forceSelection: true,
                    typeAhead: true,
                    allowBlank: false,
                    name: 'source',
                    hidden: true,
                    bind: {
                        value: '{theDomain.source}',
                        hidden: '{actions.view}',
                        disabled: '{actions.edit}',
                        store: '{sourceClassStore}'
                    },

                    triggers: {
                        clear: CMDBuildUI.util.administration.helper.FormHelper.getClearComboTrigger()
                    },
                    tpl: new Ext.XTemplate(
                        '<tpl for=".">',
                        '<tpl for="group" if="this.shouldShowHeader(group)"><div class="group-header">{[this.showHeader(values.group)]}</div></tpl>',
                        '<div class="x-boundlist-item">{label}</div>',
                        '</tpl>', {
                            shouldShowHeader: function (group) {
                                return this.currentGroup !== group;
                            },
                            showHeader: function (group) {
                                this.currentGroup = group;
                                return group;
                            }
                        }),
                    listeners: {
                        change: 'onSourceChange'
                    }
                }, {
                    // view
                    xtype: 'displayfield',
                    fieldLabel: CMDBuildUI.locales.Locales.administration.domains.fieldlabels.origin,
                    localized: {
                        fieldLabel: 'CMDBuildUI.locales.Locales.administration.domains.fieldlabels.origin'
                    },
                    hidden: true,
                    bind: {
                        value: '{theDomain.source}',
                        hidden: '{!actions.view}'
                    },
                    renderer: function (value, input) {
                        if (value) {
                            var vm = input.lookupViewModel();
                            var storeId = vm.get('theDomain.sourceProcess') ? 'processes.Processes' : 'classes.Classes';
                            var record = Ext.getStore(storeId).getById(vm.get('theDomain.source'));
                            return record && record.get('description');
                        }

                    }
                }]
            }, {
                columnWidth: 0.5,
                style: {
                    paddingLeft: '15px'
                },
                /********************* destination **********************/
                items: [{
                    xtype: 'combobox',
                    valueField: '_id',
                    displayField: 'label',
                    queryMode: 'local',
                    forceSelection: true,
                    fieldLabel: CMDBuildUI.locales.Locales.administration.domains.fieldlabels.destination,
                    localized: {
                        fieldLabel: 'CMDBuildUI.locales.Locales.administration.domains.fieldlabels.destination'
                    },
                    typeAhead: true,
                    allowBlank: false,
                    name: 'destination',
                    hidden: true,
                    bind: {
                        value: '{theDomain.destination}',
                        hidden: '{actions.view}',
                        disabled: '{actions.edit}',
                        store: '{destinationClassStore}'
                    },

                    triggers: {
                        clear: CMDBuildUI.util.administration.helper.FormHelper.getClearComboTrigger()
                    },
                    tpl: new Ext.XTemplate(
                        '<tpl for=".">',
                        '<tpl for="group" if="this.shouldShowHeader(group)"><div class="group-header">{[this.showHeader(values.group)]}</div></tpl>',
                        '<div class="x-boundlist-item">{label}</div>',
                        '</tpl>', {
                            shouldShowHeader: function (group) {
                                return this.currentGroup !== group;
                            },
                            showHeader: function (group) {
                                this.currentGroup = group;
                                return group;
                            }
                        }),
                    listeners: {
                        change: 'onDestinationChange'
                    }
                }, {
                    // view
                    xtype: 'displayfield',
                    fieldLabel: CMDBuildUI.locales.Locales.administration.domains.fieldlabels.destination,
                    localized: {
                        fieldLabel: 'CMDBuildUI.locales.Locales.administration.domains.fieldlabels.destination'
                    },
                    name: 'destination',
                    hidden: true,
                    bind: {
                        value: '{theDomain.destination}',
                        hidden: '{!actions.view}'
                    },
                    renderer: function (value, input) {
                        if (value) {
                            var vm = input.lookupViewModel();
                            var storeId = vm.get('theDomain.destinationProcess') ? 'processes.Processes' : 'classes.Classes';
                            var record = Ext.getStore(storeId).getById(vm.get('theDomain.destination'));
                            return record && record.get('description');
                        }

                    }
                }]
            }]
        }, {
            layout: 'column',
            items: [{
                columnWidth: 0.5,
                /********************* direct description **********************/
                items: [{
                    // create
                    xtype: 'textfield',
                    fieldLabel: CMDBuildUI.locales.Locales.administration.domains.fieldlabels.directdescription,
                    localized: {
                        fieldLabel: 'CMDBuildUI.locales.Locales.administration.domains.fieldlabels.directdescription'
                    },
                    name: 'descriptionDirect',
                    allowBlank: false,
                    hidden: true,
                    bind: {
                        value: '{theDomain.descriptionDirect}',
                        hidden: '{!actions.add}'
                    },
                    labelToolIconCls: 'fa-flag',
                    labelToolIconQtip: CMDBuildUI.locales.Locales.administration.attributes.tooltips.translate,
                    labelToolIconClick: 'onTranslateClickDirect'
                }, {
                    // edit
                    columnWidth: 0.5,
                    xtype: 'textfield',
                    name: 'description',
                    allowBlank: false,
                    bind: {
                        value: '{theDomain.descriptionDirect}',
                        hidden: '{!actions.edit}'
                    },
                    fieldLabel: CMDBuildUI.locales.Locales.administration.domains.fieldlabels.directdescription,
                    localized: {
                        fieldLabel: 'CMDBuildUI.locales.Locales.administration.domains.fieldlabels.directdescription',
                        labelToolIconQtip: 'CMDBuildUI.locales.Locales.administration.attributes.tooltips.translate'
                    },
                    labelToolIconCls: 'fa-flag',
                    labelToolIconQtip: CMDBuildUI.locales.Locales.administration.attributes.tooltips.translate,
                    labelToolIconClick: 'onTranslateClickDirect'
                }, {
                    // view
                    xtype: 'displayfield',
                    fieldLabel: CMDBuildUI.locales.Locales.administration.domains.fieldlabels.directdescription,
                    localized: {
                        fieldLabel: 'CMDBuildUI.locales.Locales.administration.domains.fieldlabels.directdescription'
                    },
                    name: 'descriptionDirect',
                    hidden: true,
                    bind: {
                        value: '{theDomain.descriptionDirect}',
                        hidden: '{!actions.view}'
                    }
                }]
            }, {
                columnWidth: 0.5,
                style: {
                    paddingLeft: '15px'
                },
                /********************* inverse description **********************/
                items: [{
                    // create 
                    xtype: 'textfield',
                    name: 'descriptionInverse',
                    allowBlank: false,
                    fieldLabel: CMDBuildUI.locales.Locales.administration.domains.fieldlabels.inversedescription,
                    localized: {
                        fieldLabel: 'CMDBuildUI.locales.Locales.administration.domains.fieldlabels.inversedescription'
                    },
                    hidden: true,
                    bind: {
                        value: '{theDomain.descriptionInverse}',
                        hidden: '{!actions.add}'
                    },
                    labelToolIconCls: 'fa-flag',
                    labelToolIconQtip: CMDBuildUI.locales.Locales.administration.attributes.tooltips.translate,
                    labelToolIconClick: 'onTranslateClickInverse'
                }, {
                    // edit
                    columnWidth: 0.5,
                    xtype: 'textfield',
                    name: 'descriptionInverse',
                    bind: {
                        value: '{theDomain.descriptionInverse}',
                        hidden: '{!actions.edit}'
                    },
                    allowBlank: false,
                    fieldLabel: CMDBuildUI.locales.Locales.administration.domains.fieldlabels.inversedescription,
                    localized: {
                        fieldLabel: 'CMDBuildUI.locales.Locales.administration.domains.fieldlabels.inversedescription',
                        labelToolIconQtip: 'CMDBuildUI.locales.Locales.administration.attributes.tooltips.translate'
                    },
                    labelToolIconCls: 'fa-flag',
                    labelToolIconQtip: CMDBuildUI.locales.Locales.administration.attributes.tooltips.translate,
                    labelToolIconClick: 'onTranslateClickInverse'
                }, {
                    // view
                    xtype: 'displayfield',
                    name: 'descriptionInverse',
                    fieldLabel: CMDBuildUI.locales.Locales.administration.domains.fieldlabels.inversedescription,
                    localized: {
                        fieldLabel: 'CMDBuildUI.locales.Locales.administration.domains.fieldlabels.inversedescription'
                    },
                    hidden: true,
                    bind: {
                        value: '{theDomain.descriptionInverse}',
                        hidden: '{!actions.view}'
                    }
                }]
            }]
        }, {
            layout: 'column',
            items: [{
                layout: 'column',
                columnWidth: 0.5,
                /********************* direct cascade action **********************/
                items: [{
                    columnWidth: 0.75,
                    layout: 'column',
                    items: [CMDBuildUI.util.administration.helper.FieldsHelper.getCommonComboInput('cascadeActionDirect', {
                        cascadeActionDirect: {
                            columnWidth: 1,
                            fieldcontainer: {
                                fieldLabel: CMDBuildUI.locales.Locales.administration.domains.texts.onorigincarddelete,
                                localized: {
                                    fieldLabel: 'CMDBuildUI.locales.Locales.administration.domains.texts.onorigincarddelete'
                                },
                                disabledCls: 'x-item-disabled-forced',
                                bind: {
                                    disabled: '{!theDomain.source || theDomain.sourceProcess}'
                                }
                            },
                            disabled: true,
                            bind: {
                                disabled: '{!theDomain.source || theDomain.sourceProcess}',
                                store: '{cascadeActionsDirectStore}',
                                value: '{theDomain.cascadeActionDirect}'
                            },

                            combofield: {
                                listeners: {
                                    disable: function (input, eOpts) {
                                        input.setValue(null);
                                        CMDBuildUI.util.administration.helper.FieldsHelper.setAllowBlank(input, true, input.up('form'));
                                    },
                                    enable: function (input, eOpts) {
                                        input.setValue(null);
                                        CMDBuildUI.util.administration.helper.FieldsHelper.setAllowBlank(input, false, input.up('form'));
                                    },
                                    change: function (combo, newValue, oldValue) {
                                        var vm = combo.lookupViewModel();
                                        if (newValue === CMDBuildUI.model.domains.Domain.cascadeAction.restrict) {
                                            vm.set('theDomain.cascadeActionDirect_askConfirm', false);
                                        }
                                    }
                                }
                            },
                            triggers: {
                                clear: CMDBuildUI.util.administration.helper.FormHelper.getClearComboTrigger()
                            }
                        }
                    })]
                }, {
                    columnWidth: 0.25,
                    layout: 'column',
                    items: [CMDBuildUI.util.administration.helper.FieldsHelper.getCommonCheckboxInput('cascadeActionDirect_askConfirm', {
                        cascadeActionDirect_askConfirm: {
                            columnWidth: 1,
                            fieldcontainer: {
                                fieldLabel: CMDBuildUI.locales.Locales.administration.domains.texts.askconfirm,
                                localized: {
                                    fieldLabel: 'CMDBuildUI.locales.Locales.administration.domains.texts.askconfirm'
                                },
                                disabledCls: 'x-item-disabled-forced',
                                bind: {
                                    disabled: '{cascadeActionDirect_askConfirm_disabled}'
                                }
                            },
                            disabledCls: 'x-item-disabled-forced',
                            disabled: true,
                            bind: {
                                value: '{theDomain.cascadeActionDirect_askConfirm}',
                                disabled: '{!theDomain.source || theDomain.sourceProcess || actions.view  ||  cascadeActionDirect_askConfirm_disabled}'
                            },
                            listeners: {
                                disable: function (input, eOpts) {
                                    input.setValue(false);
                                }
                            }
                        }
                    })]
                }]
            }, {
                margin: '0 0 0 15',
                layout: 'column',
                columnWidth: 0.5,
                /********************* direct cascade action **********************/
                items: [{
                    columnWidth: 0.75,
                    layout: 'column',
                    items: [CMDBuildUI.util.administration.helper.FieldsHelper.getCommonComboInput('cascadeActionInverse', {
                        cascadeActionInverse: {
                            columnWidth: 1,
                            fieldcontainer: {
                                fieldLabel: CMDBuildUI.locales.Locales.administration.domains.texts.destinationcarddelete,
                                localized: {
                                    fieldLabel: 'CMDBuildUI.locales.Locales.administration.domains.texts.destinationcarddelete'
                                },
                                disabledCls: 'x-item-disabled-forced',
                                bind: {
                                    disabled: '{!theDomain.destination || theDomain.destinationProcess}'
                                }
                            },
                            disabled: true,
                            bind: {
                                store: '{cascadeActionsInverseStore}',
                                value: '{theDomain.cascadeActionInverse}',
                                disabled: '{!theDomain.destination || theDomain.destinationProcess}'
                            },
                            combofield: {
                                listeners: {
                                    disable: function (input, eOpts) {
                                        var vm = input.lookupViewModel();
                                        vm.set('theDomain.cascadeActionInverse', null);
                                        CMDBuildUI.util.administration.helper.FieldsHelper.setAllowBlank(input, true, input.up('form'));
                                    },
                                    enable: function (input, eOpts) {
                                        CMDBuildUI.util.administration.helper.FieldsHelper.setAllowBlank(input, false, input.up('form'));
                                    },
                                    change: function (combo, newValue, oldValue) {
                                        var vm = combo.lookupViewModel();
                                        if (newValue === CMDBuildUI.model.domains.Domain.cascadeAction.restrict) {
                                            vm.set('theDomain.cascadeActionInverse_askConfirm', false);
                                        }
                                    }
                                }
                            },
                            triggers: {
                                clear: CMDBuildUI.util.administration.helper.FormHelper.getClearComboTrigger()
                            }
                        }
                    })]
                }, {
                    columnWidth: 0.25,
                    layout: 'column',
                    items: [CMDBuildUI.util.administration.helper.FieldsHelper.getCommonCheckboxInput('cascadeActionInverse_askConfirm', {
                        cascadeActionInverse_askConfirm: {
                            columnWidth: 1,
                            fieldcontainer: {
                                fieldLabel: CMDBuildUI.locales.Locales.administration.domains.texts.askconfirm,
                                localized: {
                                    fieldLabel: 'CMDBuildUI.locales.Locales.administration.domains.texts.askconfirm'
                                },
                                disabledCls: 'x-item-disabled-forced',
                                bind: {
                                    disabled: '{cascadeActionInverse_askConfirm_disabled}'
                                }
                            },
                            disabledCls: 'x-item-disabled-forced',
                            disabled: true,
                            bind: {
                                disabled: '{!theDomain.destination || theDomain.destinationProcess || actions.view  || cascadeActionInverse_askConfirm_disabled}',
                                value: '{theDomain.cascadeActionInverse_askConfirm}'
                            },
                            listeners: {
                                disable: function (input, eOpts) {
                                    input.setValue(false);
                                }
                            }
                        }
                    })]
                }]
            }]
        }, {
            layout: 'column',
            items: [{
                columnWidth: 0.5,
                /********************* cardinality **********************/
                items: [{
                    // create
                    xtype: 'combobox',
                    queryMode: 'local',
                    forceSelection: true,
                    displayField: 'label',
                    valueField: 'value',
                    fieldLabel: CMDBuildUI.locales.Locales.administration.domains.fieldlabels.cardinality,
                    localized: {
                        fieldLabel: 'CMDBuildUI.locales.Locales.administration.domains.fieldlabels.cardinality'
                    },
                    name: 'cardinality',
                    allowBlank: false,
                    hidden: true,
                    bind: {
                        store: '{cardinalityStore}',
                        value: '{theDomain.cardinality}',
                        hidden: '{actions.view}',
                        disabled: '{actions.edit}'
                    },
                    listeners: {
                        change: 'resetSummaryGrid'
                    }
                }, {
                    // view
                    xtype: 'displayfield',
                    fieldLabel: CMDBuildUI.locales.Locales.administration.domains.fieldlabels.cardinality,
                    localized: {
                        fieldLabel: 'CMDBuildUI.locales.Locales.administration.domains.fieldlabels.cardinality'
                    },
                    name: 'cardinality',
                    hidden: true,
                    bind: {
                        value: '{theDomain.cardinality}',
                        hidden: '{!actions.view}'
                    }
                }]
            }]
        }, {
            layout: 'column',
            items: [{
                columnWidth: 0.5,
                /********************* Master detail **********************/
                items: [{
                    // create / edit / view
                    xtype: 'checkbox',
                    fieldLabel: CMDBuildUI.locales.Locales.administration.domains.fieldlabels.masterdetail,
                    localized: {
                        fieldLabel: 'CMDBuildUI.locales.Locales.administration.domains.fieldlabels.masterdetail'
                    },
                    name: 'masterDetail',
                    hidden: true,
                    bind: {
                        value: '{theDomain.isMasterDetail}',
                        readOnly: '{actions.view}',
                        hidden: '{!theDomain}',
                        disabled: '{!isN1or1N}'
                    }
                }]
            }, {
                columnWidth: 0.5,
                style: {
                    paddingLeft: '15px'
                },
                /********************* Master detail label **********************/
                items: [{
                    // add / edit
                    xtype: 'textfield',
                    name: 'descriptionMasterDetail',
                    fieldLabel: CMDBuildUI.locales.Locales.administration.domains.fieldlabels.labelmasterdataillong,
                    localized: {
                        fieldLabel: 'CMDBuildUI.locales.Locales.administration.domains.fieldlabels.labelmasterdataillong'
                    },
                    hidden: true,
                    bind: {
                        value: '{theDomain.descriptionMasterDetail}',
                        hidden: '{descriptionMasterDetailInput.hidden}'
                    },
                    labelToolIconCls: 'fa-flag',
                    labelToolIconQtip: CMDBuildUI.locales.Locales.administration.attributes.tooltips.translate,
                    labelToolIconClick: 'onTranslateClickMasterDetail'
                }, {
                    // view
                    xtype: 'displayfield',
                    fieldLabel: CMDBuildUI.locales.Locales.administration.domains.fieldlabels.labelmasterdataillong,
                    localized: {
                        fieldLabel: 'CMDBuildUI.locales.Locales.administration.domains.fieldlabels.labelmasterdataillong'
                    },
                    name: 'descriptionMasterDetail',
                    hidden: true,
                    bind: {
                        value: '{theDomain.descriptionMasterDetail}',
                        hidden: '{descriptionMasterDetailDisplay.hidden}'
                    }
                }]
            }]
        }, {
            xtype: 'fieldcontainer',
            fieldLabel: CMDBuildUI.locales.Locales.administration.domains.texts.showsummaryfor,
            loacalized: {
                fieldLabel: 'CMDBuildUI.locales.Locales.administration.domains.texts.showsummaryfor'
            },
            bind: {
                hidden: '{!theDomain.isMasterDetail}'
            },
            items: [{
                xtype: 'container',
                layout: 'column',
                items: [{
                    xtype: 'grid',
                    headerBorders: false,
                    border: false,
                    bodyBorder: false,
                    rowLines: false,
                    sealedColumns: false,
                    sortableColumns: false,
                    enableColumnHide: false,
                    enableColumnMove: false,
                    enableColumnResize: false,
                    cls: 'administration-reorder-grid',
                    itemId: 'sumattributesGrid',
                    selModel: {
                        pruneRemoved: false // See https://docs.sencha.com/extjs/6.2.0/classic/Ext.selection.Model.html#cfg-pruneRemoved
                    },
                    controller: {

                    },
                    columnWidth: 0.5,
                    autoEl: {
                        'data-testid': 'administration-content-domain-sumattributes-grid'
                    },

                    forceFit: true,
                    loadMask: true,
                    labelWidth: "auto",
                    bind: {
                        store: '{masterDetailAggregateAttrsStore}'
                    },
                    columns: [{
                        flex: 1,
                        text: CMDBuildUI.locales.Locales.administration.attributes.attribute,
                        dataIndex: 'description',
                        align: 'left'
                    }, {
                        xtype: 'actioncolumn',
                        itemId: 'actionColumnCancel',
                        bind: {
                            hidden: '{actions.view}'
                        },
                        width: 30,
                        minWidth: 30, // width property not works. Use minWidth.
                        maxWidth: 30,
                        align: 'center',
                        items: [{
                            iconCls: 'x-fa fa-times',
                            tooltip: CMDBuildUI.locales.Locales.administration.common.actions.remove, // Remove
                            localized: {
                                tooltip: 'CMDBuildUI.locales.Locales.administration.common.actions.remove'
                            },
                            handler: function (grid, rowIndex, colIndex) {
                                var vm = grid.lookupViewModel();
                                var store = vm.get('masterDetailAggregateAttrsStore');
                                var record = store.getAt(rowIndex);
                                store.remove(record);
                                var aggregateAttributes = vm.get('theDomain.masterDetailAggregateAttrs');
                                Ext.Array.remove(aggregateAttributes, record.get('name'));
                                vm.getStore('freeAttributeForAggregateStore').add(record);
                                vm.set('theDomain.masterDetailAggregateAttrs', aggregateAttributes);

                            },
                            getClass: function (value, metadata, record, rowIndex, colIndex, store) {
                                metadata.value = Ext.String.insert(metadata.value, Ext.String.format(' data-testid="administration-importexport-attribute-removeBtn-{0}"', rowIndex), -7);
                                if (record.get('editing')) {
                                    return 'x-fa fa-ellipsis-h';
                                }
                                return 'x-fa  fa-times';
                            }
                        }]
                    }]
                }]
            }, {
                xtype: 'container',
                layout: 'column',
                items: [{
                    margin: '20 0 20 0',
                    xtype: 'grid',
                    headerBorders: false,
                    border: false,
                    bodyBorder: false,
                    rowLines: false,
                    sealedColumns: false,
                    sortableColumns: false,
                    enableColumnHide: false,
                    enableColumnMove: false,
                    enableColumnResize: false,
                    cls: 'administration-reorder-grid',
                    itemId: 'importExportAttributeGridNew',
                    selModel: {
                        pruneRemoved: false // See https://docs.sencha.com/extjs/6.2.0/classic/Ext.selection.Model.html#cfg-pruneRemoved
                    },
                    layout: 'hbox',
                    autoEl: {
                        'data-testid': 'administration-content-importexport-datatemplates-grid-newrecord'
                    },
                    columnWidth: 0.5,
                    forceFit: true,
                    loadMask: true,

                    labelWidth: "auto",
                    bind: {
                        store: '{newSelectedAttributesStore}',
                        hidden: '{actions.view}'
                    },

                    columns: [{
                        xtype: 'widgetcolumn',
                        dataIndex: 'name',
                        align: 'left',
                        flex: 1,
                        widget: {
                            xtype: 'combo',
                            queryMode: 'local',
                            typeAhead: true,
                            editable: true,
                            forceSelection: true,
                            emptyText: CMDBuildUI.locales.Locales.administration.importexport.texts.selectanattribute,
                            itemId: 'selectAttributeForGrid',
                            displayField: 'description',
                            valueField: 'name',
                            bind: {
                                store: '{freeAttributeForAggregateStore}'
                            },
                            autoEl: {
                                'data-testid': 'administration-importexport-attribute-name'
                            },

                            listeners: {
                                focus: function () {
                                    var me = this;
                                    var vm = me.lookupViewModel();
                                    me.getStore().removeAll();
                                    var supportedAttributes = [CMDBuildUI.model.Attribute.types.integer, CMDBuildUI.model.Attribute.types.decimal, CMDBuildUI.model.Attribute.types.double];
                                    vm.get('allDetailAttributesStore').each(function (attribute) {
                                        var record = vm.get('masterDetailAggregateAttrsStore').getById(attribute.getId());
                                        if (!record && attribute.get('showInGrid') && supportedAttributes.indexOf(attribute.get('type')) >= 0) {
                                            me.getStore().add(attribute);
                                        }
                                    });
                                    return true;
                                }
                            },
                            height: 19,
                            minHeight: 19,
                            maxHeight: 19,
                            padding: 0,
                            ui: 'reordergrid-editor-combo'
                        }
                    }, {
                        xtype: 'actioncolumn',
                        itemId: 'actionColumnAddNew',
                        width: 30,
                        minWidth: 30, // width property not works. Use minWidth.
                        maxWidth: 30,
                        align: 'center',
                        items: [{
                            iconCls: 'x-fa fa-plus',
                            tooltip: CMDBuildUI.locales.Locales.administration.common.actions.add, // Add
                            localized: {
                                tooltip: 'CMDBuildUI.locales.Locales.administration.common.actions.add'
                            },
                            autoEl: {
                                'data-testid': 'administration-importexport-attribute-addBtn'
                            },
                            getClass: function (value, metadata, record, rowIndex, colIndex, store) {
                                metadata.value = Ext.String.insert(metadata.value, ' data-testid="administration-importexport-attribute-addBtn"', -7);
                                return 'x-fa fa-plus';
                            },

                            handler: function (button, rowIndex, colIndex) {

                                var attributeName = button.up('panel').down('#selectAttributeForGrid');
                                if (Ext.isEmpty(attributeName.getValue())) {
                                    attributeName.focus();
                                    attributeName.expand();
                                    return false;
                                }
                                var vm = button.lookupViewModel();
                                var attributeStore = vm.getStore('freeAttributeForAggregateStore');
                                var record = vm.get('allDetailAttributesStore').getById(attributeName.getValue());
                                if (record) {
                                    vm.getStore('masterDetailAggregateAttrsStore').add(record);
                                    vm.get('theDomain.masterDetailAggregateAttrs').push(record.get('name'));
                                    attributeStore.remove(record);
                                }
                                var mainGrid = button.up('form').down('#sumattributesGrid');
                                attributeName.reset();
                                mainGrid.getView().refresh();
                            }
                        }]
                    }]
                }]
            }]

        }, {
            layout: 'column',
            columnWidth: 1,
            items: [{
                layout: 'column',
                columnWidth: 0.5,
                minHeight: '1',
                items: [{
                    columnWidth: 0.5,
                    /********************* Inline **********************/
                    items: [CMDBuildUI.util.administration.helper.FieldsHelper.getCommonCheckboxInput('sourceInline', {
                        sourceInline: {
                            columnWidth: 1,
                            fieldcontainer: {
                                fieldLabel: CMDBuildUI.locales.Locales.administration.domains.fieldlabels.origininline,
                                localized: {
                                    fieldLabel: 'CMDBuildUI.locales.Locales.administration.domains.fieldlabels.origininline'
                                },
                                disabledCls: 'x-item-disabled-forced',
                                disabled: true,
                                bind: {
                                    disabled: '{!theDomain.source || theDomain.sourceProcess|| !theDomain.cardinality || theDomain.cardinality === "N:1"}'
                                },
                                listeners: {
                                    disable: function (fieldcontainer, eOpts) {
                                        fieldcontainer.lookupViewModel().set('theDomain.sourceInline', false);
                                    }
                                }
                            },
                            bind: {
                                value: '{theDomain.sourceInline}',
                                readOnly: '{actions.view}'
                            },
                            listeners: {
                                change: function (checkbox, newValue, oldValue) {
                                    if (!newValue) {
                                        checkbox.lookupViewModel().set('theDomain.sourceDefaultClosed', false);
                                    }
                                }
                            }
                        }
                    })]
                }, {
                    columnWidth: 0.5,
                    /********************* Default closed **********************/
                    items: [CMDBuildUI.util.administration.helper.FieldsHelper.getCommonCheckboxInput('sourceDefaultClosed', {
                        sourceDefaultClosed: {
                            columnWidth: 1,
                            fieldcontainer: {
                                fieldLabel: CMDBuildUI.locales.Locales.administration.domains.fieldlabels.closedorigininline,
                                localized: {
                                    fieldLabel: 'CMDBuildUI.locales.Locales.administration.domains.fieldlabels.closedorigininline'
                                },
                                disabledCls: 'x-item-disabled-forced',
                                disabled: true,
                                bind: {
                                    disabled: '{!theDomain.source || theDomain.sourceProcess || !theDomain.cardinality || theDomain.cardinality === "N:1" || !theDomain.sourceInline}'
                                },
                                listeners: {
                                    disable: function (fieldcontainer, eOpts) {                                        
                                        fieldcontainer.lookupViewModel().set('theDomain.sourceDefaultClosed', false);
                                    }
                                }
                            },
                            bind: {
                                value: '{theDomain.sourceDefaultClosed}',
                                readOnly: '{actions.view}'
                            }
                        }
                    })]
                }]
            }, {
                layout: 'column',
                columnWidth: 0.5,

                items: [{
                    layout: 'column',
                    columnWidth: 0.5,
                    style: {
                        paddingLeft: '15px'
                    },
                    /********************* Inline **********************/
                    items: [CMDBuildUI.util.administration.helper.FieldsHelper.getCommonCheckboxInput('destinationInline', {
                        destinationInline: {
                            columnWidth: 1,
                            fieldcontainer: {
                                fieldLabel: CMDBuildUI.locales.Locales.administration.domains.fieldlabels.destinationinline,
                                localized: {
                                    fieldLabel: 'CMDBuildUI.locales.Locales.administration.domains.fieldlabels.destinationinline'
                                },
                                disabledCls: 'x-item-disabled-forced',
                                disabled: true,
                                bind: {
                                    disabled: '{!theDomain.destination || theDomain.destinationProcess || !theDomain.cardinality || theDomain.cardinality === "1:N"}'
                                },
                                listeners: {
                                    disable: function (fieldcontainer, eOpts) {                                        
                                        fieldcontainer.lookupViewModel().set('theDomain.destinationInline', false);
                                    }
                                }
                            },
                            bind: {
                                value: '{theDomain.destinationInline}',
                                readOnly: '{actions.view}'
                            },
                            listeners: {
                                change: function (checkbox, newValue, oldValue) {
                                    if (!newValue) {
                                        checkbox.lookupViewModel().set('theDomain.destinationDefaultClosed', false);
                                    }
                                }
                            }
                        }
                    })]
                }, {
                    columnWidth: 0.5,
                    /********************* Default closed **********************/
                    items: [CMDBuildUI.util.administration.helper.FieldsHelper.getCommonCheckboxInput('destinationDefaultClosed', {
                        destinationDefaultClosed: {
                            columnWidth: 1,
                            fieldcontainer: {
                                fieldLabel: CMDBuildUI.locales.Locales.administration.domains.fieldlabels.closeddestinationinline,
                                localized: {
                                    fieldLabel: 'CMDBuildUI.locales.Locales.administration.domains.fieldlabels.closeddestinationinline'
                                },
                                disabledCls: 'x-item-disabled-forced',
                                disabled: true,
                                bind: {
                                    disabled: '{!theDomain.destination || theDomain.destinationProcess || !theDomain.cardinality || theDomain.cardinality === "1:N" || !theDomain.destinationInline}'
                                },
                                listeners: {
                                    disable: function (fieldcontainer, eOpts) {                                        
                                        fieldcontainer.lookupViewModel().set('theDomain.destinationDefaultClosed', false);
                                    }
                                }
                            },
                            bind: {
                                value: '{theDomain.destinationDefaultClosed}',
                                readOnly: '{actions.view}'
                            }
                        }
                    })]
                }]
            }]
        }, {
            layout: 'column',
            items: [{
                columnWidth: 0.5,
                /********************* View condition CQL **********************/
                items: [{
                    // create / edit
                    xtype: 'textfield',
                    fieldLabel: CMDBuildUI.locales.Locales.administration.domains.fieldlabels.viewconditioncql,
                    localized: {
                        fieldLabel: 'CMDBuildUI.locales.Locales.administration.domains.fieldlabels.viewconditioncql'
                    },
                    name: 'filterMasterDetail',
                    hidden: true,
                    bind: {
                        value: '{theDomain.filterMasterDetail}',
                        hidden: '{actions.view}'
                    }
                }, {
                    // view
                    xtype: 'displayfield',
                    fieldLabel: CMDBuildUI.locales.Locales.administration.domains.fieldlabels.viewconditioncql,
                    localized: {
                        fieldLabel: 'CMDBuildUI.locales.Locales.administration.domains.fieldlabels.viewconditioncql'
                    },
                    name: 'filterMasterDetail',
                    hidden: true,
                    bind: {
                        value: '{theDomain.filterMasterDetail}',
                        hidden: '{!actions.view}'
                    }
                }]
            }]
        }, {
            layout: 'column',
            items: [{
                columnWidth: 0.5,
                /********************* Active **********************/
                items: [{
                    // create / edit / view
                    xtype: 'checkbox',
                    fieldLabel: CMDBuildUI.locales.Locales.administration.common.labels.active,
                    localized: {
                        fieldLabel: 'CMDBuildUI.locales.Locales.administration.common.labels.active'
                    },
                    name: 'active',
                    hidden: true,
                    bind: {
                        value: '{theDomain.active}',
                        readOnly: '{actions.view}',
                        hidden: '{!theDomain}'
                    }
                }]
            }]
        }]
    }]
});