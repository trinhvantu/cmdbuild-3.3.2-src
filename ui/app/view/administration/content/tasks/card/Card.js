Ext.define('CMDBuildUI.view.administration.content.tasks.card.Card', {
    extend: 'Ext.form.Panel',
    alias: 'widget.administration-content-tasks-card',

    requires: [
        'CMDBuildUI.view.administration.content.tasks.card.CardController',
        'CMDBuildUI.view.administration.content.tasks.card.CardModel',
        'CMDBuildUI.util.helper.FormHelper'
    ],
    controller: 'view-administration-content-tasks-card',
    viewModel: {
        type: 'view-administration-content-tasks-card'
    },
    bubbleEvents: [
        'itemupdated',
        'cancelupdating'
    ],
    modelValidation: true,
    config: {
        theTask: null
    },
    formBind: true,
    bind: {
        theTask: '{theTask}'
    },
    hidden: true,
    fieldDefaults: CMDBuildUI.util.administration.helper.FormHelper.fieldDefaults,
    scrollable: true,

    ui: 'administration-formpagination',
    items: [

    ],

    initComponent: function () {
        var me = this;
        var vm = this.getViewModel();
        var formButtons;
        Ext.asap(function () {
            try {
                me.up().mask(CMDBuildUI.locales.Locales.administration.common.messages.loading);
            } catch (error) {

            }
        }, me);
        me.callParent(arguments);

        Ext.asap(function () {
            vm.bind({
                bindTo: {
                    theTask: '{theTask}'
                }
            }, function (data) {
                if (data.theTask) {
                    var type = data.theTask.get('type');
                    me.lookupController().generateCardFor(type, data, me);
                    Ext.asap(function () {
                        try {
                            if (data.theTask._config.get('tag') === 'ifc') {
                                vm.bind({
                                    bindTo: {
                                        gate: '{theTask.config.gateconfig_handlers_1_gate}'
                                    }
                                }, function (_data) {
                                    if (!vm.destroyed) {
                                        var container = me.down('#targetCardIdContainer');
                                        if (container) {
                                            container.removeAll();
                                            CMDBuildUI.util.Stores.loadETLGatesStore().then(function (gates) {
                                                if (!vm.destroyed) {
                                                    var store = Ext.getStore('importexports.Gates');
                                                    var record = store.findRecord('code', _data.gate);
                                                    if (record) {
                                                        var className = record.get('config').bimserver_project_master_card_target_class;
                                                        if (className) {
                                                            var referencecombo = {
                                                                fieldLabel: CMDBuildUI.locales.Locales.administration.gis.associatedcard,
                                                                columnWidth: 0.5,
                                                                xtype: 'referencecombofield',
                                                                displayField: 'Description',
                                                                itemId: 'ownerCard',
                                                                valueField: '_id',
                                                                name: 'gateconfig_handlers_1_config_bimserver_project_master_card_id',
                                                                width: '100%',
                                                                style: 'padding-right: 15px',
                                                                metadata: {
                                                                    targetType: 'class',
                                                                    targetClass: className
                                                                },
                                                                hidden: true,
                                                                bind: {
                                                                    disabled: '{!theTask.config.gateconfig_handlers_1_gate}',
                                                                    value: '{theTask.config.gateconfig_handlers_1_config_bimserver_project_master_card_id}',
                                                                    hidden: '{actions.view || theTask.config.gateconfig_handlers_1_config_bimserver_project_master_card_mode !== "static"}'
                                                                },
                                                                listeners: {
                                                                    change: function (input, newValue, oldValue) {
                                                                        var _vm = input.lookupViewModel();

                                                                        if (_vm.get('theTask')._config.get('gateconfig_handlers_1_config_bimserver_project_master_card_id') !== newValue) {
                                                                            _vm.set('gateconfig_handlers_1_config_bimserver_project_master_card_id', newValue);
                                                                            _vm.get('theTask')._config.set('gateconfig_handlers_1_config_bimserver_project_master_card_id', newValue);
                                                                        }
                                                                    }
                                                                }

                                                            };
                                                            container.add(referencecombo);
                                                            container.add({
                                                                xtype: 'displayfield',
                                                                fieldLabel: CMDBuildUI.locales.Locales.administration.gis.associatedcard,
                                                                bind: {
                                                                    hidden: '{!actions.view}',
                                                                    value: '{theTask.config._gateconfig_handlers_1_config_bimserver_project_master_card_id_description}'
                                                                }
                                                            });
                                                        }
                                                    }
                                                }
                                            });
                                        }
                                    }
                                });
                            }
                            me.setHidden(false);
                            me.up().unmask();
                        } catch (error) {
                            CMDBuildUI.util.Logger.log(error, CMDBuildUI.util.Logger.levels.error);
                        }
                    }, this);

                }
            });
            // isView | isEdit
            var modelName = CMDBuildUI.util.administration.helper.ModelHelper.getTaskModelNameByType(vm.get('taskType') || vm.get('grid').getSelection()[0].get('type'), vm.get('subType'));
            if (!vm.get('theTask') || !vm.get('theTask').phantom) {
                vm.linkTo("theTask", {
                    type: modelName,
                    id: vm.get('grid').getSelection()[0].get('_id')
                });
            }
            // isClone
            // if (vm.get('theTask') && vm.get('theTask').phantom) {
            //     var config = vm.get('theTask')._config;
            //     //  config.updateDataFromObject(vm.get('theTask').get('config'));
            // }        

            if (vm.get('actions.view')) {
                var topbar = {
                    xtype: 'components-administration-toolbars-formtoolbar',
                    dock: 'top',
                    hidden: true,
                    bind: {
                        hidden: '{!actions.view}'
                    },
                    items: CMDBuildUI.util.administration.helper.FormHelper.getTools({
                            edit: true, // #editBtn set true for show the button
                            view: false, // #viewBtn set true for show the button
                            clone: true, // #cloneBtn set true for show the button
                            'delete': true, // #deleteBtn set true for show the button
                            activeToggle: false // #enableBtn and #disableBtn set true for show the buttons       
                        },

                        /* testId */
                        'importexporttemplates',

                        /* viewModel object needed only for activeTogle */
                        'theTask',

                        /* add custom tools[] on the left of the bar */
                        [],

                        /* add custom tools[] before #editBtn*/
                        [],

                        /* add custom tools[] after at the end of the bar*/
                        []
                    )
                };
                me.addDocked(topbar);

            }
            formButtons = {
                xtype: 'toolbar',
                dock: 'bottom',
                ui: 'footer',
                items: CMDBuildUI.
                util.
                administration.
                helper.FormHelper.
                getPrevNextSaveCancelButtons(false, /* formBind */ {
                    // prev
                    bind: {
                        disabled: '{isPrevDisabled}'
                    }
                }, {
                    // next
                    bind: {
                        disabled: '{isNextDisabled}'
                    }
                }, {
                    // save
                    bind: {
                        hidden: '{actions.view}',
                        disabled: '{!isNextDisabled}'
                    }
                }, {
                    // cancel
                    bind: {
                        hidden: '{actions.view}'
                    }
                })
            };

            me.addDocked(formButtons);

            if (!CMDBuildUI.util.Stores.loaded.emailaccounts) {
                CMDBuildUI.util.Stores.loadEmailAccountsStore();
            }
            if (!CMDBuildUI.util.Stores.loaded.emailtemplates) {
                CMDBuildUI.util.Stores.loadEmailTemplatesStore();
            }

            CMDBuildUI.util.Stores.loadImportExportTemplatesStore();

        });


    },
    isValid: function () {

        return true;
    },
    addStep: function (name, index, content) {
        var vm = this.getViewModel();

        this.add({
            fieldDefaults: CMDBuildUI.util.administration.helper.FormHelper.fieldDefaults,
            xtype: 'fieldcontainer',
            bind: {
                hidden: '{hidden}'
            },
            layout: {
                type: 'card'
            },
            hidden: true,

            name: name,
            active: false,
            step: index,

            viewModel: {
                data: {
                    hidden: true
                },
                formulas: {
                    hideManager: {
                        bind: {
                            currentStep: '{currentStep}'
                        },
                        get: function (data) {
                            var myStep = this.getView().step;
                            if (myStep === data.currentStep) {
                                this.set('hidden', false);
                            } else {
                                this.set('hidden', true);
                            }
                        }
                    }
                }
            },

            items: content
        });
        vm.set('totalStep', vm.get('totalStep') + 1);
    }
});