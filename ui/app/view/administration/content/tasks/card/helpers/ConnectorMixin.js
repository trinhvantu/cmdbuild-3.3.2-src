Ext.define('CMDBuildUI.view.administration.content.tasks.card.helpers.ConnectorMixin', {
    mixinId: 'administration-task-importdatabasemixin',
    mixins: [
        'CMDBuildUI.view.administration.content.tasks.card.helpers.AllInputsMixin'
    ],
    requires: [
        'CMDBuildUI.view.administration.content.tasks.card.helpers.AllInputsMixin',
        'CMDBuildUI.util.administration.helper.FormHelper'
    ],
    connector: {
        getGeneralPropertyPanel: function (theVmObject, step, data, ctx) {
            var items = [
                ctx.getRowFieldContainer(
                    [
                        ctx.getNameInput(theVmObject, 'code'),
                        ctx.getDescriptionInput(theVmObject, 'description')
                    ]
                )
            ];

            return items;

        },


        getCronPanel: function (theVmObject, step, data, ctx) {
            var items = [
                /**
                 * Cron: combo con valori: Every hour, Every day, Every month, Every year, Custom.
                 * Se Cron è Custom allora compariranno i campi per impostare il cron, come per i task asincroni in CMDBuild 2.5.
                 */
                ctx.getRowFieldContainer(
                    [
                        ctx.getBasicCronInput(theVmObject, 'config.cronExpression')
                    ]
                ),
                ctx.getRowFieldContainer(
                    [
                        ctx.getAdvancedCronInput(theVmObject, 'config.cronExpression')
                    ]
                )
            ];

            return items;
        },

        getSettingsPanel: function (theVmObject, step, data, ctx) {
            var items = [ctx.getRowFieldContainer(
                    [
                        ctx.getDatabaseGatesInput(theVmObject, 'config.gateconfig_handlers_0_gate')                       
                    ]
                ),                
                ctx.getRowFieldContainer(
                    [
                        ctx.getJdbcUrlInput(theVmObject, 'config.gateconfig_handlers_0_config_jdbcUrl')
                    ]
                ),
                ctx.getRowFieldContainer(
                    [
                        ctx.getJdbcUsernameInput(theVmObject, 'config.gateconfig_handlers_0_config_jdbcUsername'),
                        ctx.getJdbcPasswordInput(theVmObject, 'config.gateconfig_handlers_0_config_jdbcPassword')
                    ]
                )
                //,
                // ctx.getRowFieldContainer(
                //     this.getEtlGridDataPanel(theVmObject, step, data, ctx)
                // )
            ];
            return items;
        },
        // getEtlGridDataPanel: function (theVmObject, step, data, ctx) {
        //     var items = [
        //         {
        //             xtype: 'fieldset',
        //             title: CMDBuildUI.locales.Locales.administration.tasks.templates,
        //             ui: 'administration-formpagination',
        //             columnWidth: 1,
        //             items: [
        //                 ctx.getRowFieldContainer([{
        //                     xtype: 'button',
        //                     itemId: 'addTemplateBtn',
        //                     text: 'Add template',
        //                     localized: {
        //                         text: 'Add template'
        //                     },
        //                     ui: 'administration-action-small',
        //                     iconCls: 'x-fa fa-plus',
        //                     autoEl: {
        //                         'data-testid': 'administration-task-connector-toolbar-addLayoutBtn'
        //                     },
        //                     bind: {
        //                         hidden: '{actions.view}'
        //                     },
        //                     menu: {
        //                         items: []
        //                     },
        //                     viewModel: {
        //                     },
        //                     setMenuItems: function () {
        //                         var addFormBtn = this;
        //                         addFormBtn.getMenu().removeAll();
        //                         var vm = this.up('panel').getViewModel();
        //                         var grid = this.up('panel').down('#importDatabaseGrid');
        //                         var assignedTemplates = vm.get('theTask')._config.get('etlTemplates').split(',');
        //                         var allTemplatesStore = vm.getStore('allImportExportTemplate');
        //                         allTemplatesStore.each(function (item) {
        //                             if (assignedTemplates.indexOf(item.getId()) === -1) {
        //                                 addFormBtn.getMenu().add({
        //                                     text: item.get('description') || '&#129300;',
        //                                     templateId: item.get('_id'),
        //                                     listeners: {
        //                                         click: function (menuitem) {
        //                                             var template = vm.getStore('allImportExportTemplate').findRecord('_id', menuitem.templateId);
        //                                             vm.getStore('selectedImportDatabaseTemplates').add(template);
        //                                             var selected = vm.get('theTask')._config.get('etlTemplates').length ? vm.get('theTask')._config.get('etlTemplates').split(',') : [];
        //                                             if (selected.indexOf(menuitem.getId()) === -1) {
        //                                                 selected.push(template.get('_id'));
        //                                                 vm.get('theTask')._config.set('etlTemplates', selected.join(','));
        //                                             }
        //                                             addFormBtn.setMenuItems();
        //                                             grid.getView().refresh();
        //                                         }
        //                                     }
        //                                 });
        //                             }
        //                         });
        //                     }
        //                 }], {
        //                     allowBlank: false,

        //                     viewModel: {

        //                     }
        //                 }),

        //                 ctx.getRowFieldContainer([
        //                     ctx.getETLGrid(), {
        //                         xtype: 'textfield',
        //                         hidden: true,
        //                         allowBlank: false,
        //                         name: 'templates',
        //                         bind: {
        //                             value: '{theTask.config.etlTemplates}'
        //                         }
        //                     }
        //                 ])
        //             ]
        //         }
        //     ];
        //     return items;
        // },

        getNotificationPanel: function (theVmObject, step, data, ctx) {
            var items = [

                ctx.getRowFieldContainer([
                    ctx.getNotificationInput(theVmObject, 'config.notificationMode')
                ]),
                ctx.getRowFieldContainer([
                    /*
                     * Error email template: combo con elenco dei template delle email. Placeholder: Use the one defined in template.
                     * Account: combo con elenco degli account. Placeholder: Use the one defined in template.
                     */
                    ctx.getRowFieldContainer(
                        [
                            ctx.getErrorEmailTemplateInput(theVmObject, 'config.errorEmailTemplate'),
                            ctx.getErrorEmailAccountInput(theVmObject, 'config.errorEmailAccount')
                        ], {
                            bind: {
                                // hidden: '{!isImport}'
                            }
                        }),
                    /**
                     * email template: combo con elenco dei template delle email. Placeholder: Use the one defined in template.
                     * Account: combo con elenco degli account. Placeholder: Use the one defined in template.
                     */

                    ctx.getRowFieldContainer(
                        [
                            ctx.getNotificationEmailTemplateInput(theVmObject, 'config.notificationEmailTemplate'),
                            ctx.getAttachImportReport(theVmObject, 'config.attachImportReport')
                        ], {
                            bind: {
                                // hidden: '{!isImport}'
                            }
                        })
                ], {
                    bind: {
                        hidden: '{isNeverNotification}'
                    }
                })


            ];

            return items;
        },

        validateForm: function (form) {

            var _form = form.form,
                invalid = _form.getFields().filterBy(function (field) {
                    return !field.validate();
                });
            if (invalid.length) {
                CMDBuildUI.util.administration.helper.FormHelper.showInvalidFieldsMessage(invalid);
            }

            return invalid;
        },
        setAllowBlank: function (field, value, form) {
            CMDBuildUI.util.administration.helper.FieldsHelper.setAllowBlank(field, value, form);
        }

    }



});