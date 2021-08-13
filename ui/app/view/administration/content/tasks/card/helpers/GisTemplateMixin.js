Ext.define('CMDBuildUI.view.administration.content.tasks.card.helpers.GisTemplateMixin', {
    mixinId: 'administration-task-importdatabasemixin',
    mixins: [
        'CMDBuildUI.view.administration.content.tasks.card.helpers.AllInputsMixin'
    ],
    requires: [
        'CMDBuildUI.util.administration.helper.FormHelper'
    ],
    gistemplate: {
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
            var items = [
                ctx.getRowFieldContainer(
                    [
                        ctx.getRowFieldContainer(
                            [
                                ctx.getETLGateTemplateInput(theVmObject, 'config.gateconfig_handlers_1_gate', {
                                    allowBlank: false
                                })
                            ]
                        ),
                        ctx.getRowFieldContainer(
                            [
                                ctx.getDirectoryInput(theVmObject, 'config.gateconfig_handlers_0_directory'),
                                ctx.getFilepatternInput(theVmObject, 'config.gateconfig_handlers_0_filePattern')
                            ]
                        ),
                        ctx.getRowFieldContainer(
                            [
                                ctx.getPostImportActionInput(theVmObject, 'config.gateconfig_handlers_0_postImportAction'),
                                ctx.getTargetDirectoryInput(theVmObject, 'config.gateconfig_handlers_0_targetDirectory', {
                                    allowBlank: true,
                                    fieldcontainer: {
                                        bind: {
                                            hidden: '{!isMoveFiles}'
                                        },
                                        hidden: true,
                                        listeners: {
                                            hide: function (component, eOpts) {
                                                var input = component.down('#gateconfig_handlers_0_targetDirectory_input');
                                                input.setValue('');
                                                CMDBuildUI.util.administration.helper.FieldsHelper.setAllowBlank(input, true, input.up('form'));
                                            },
                                            show: function (component, eOpts) {
                                                var input = component.down('#gateconfig_handlers_0_targetDirectory_input');
                                                CMDBuildUI.util.administration.helper.FieldsHelper.setAllowBlank(input, false, input.up('form'));
                                            }
                                        }
                                    }
                                })
                            ]
                        )
                    ]
                )
            ];

            return items;
        },

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