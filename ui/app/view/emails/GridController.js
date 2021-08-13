Ext.define('CMDBuildUI.view.emails.GridController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.emails-grid',

    control: {
        '#composeemail': {
            click: 'onComposeEmail'
        },
        '#regenerateallemails': {
            click: 'onRegenerateAllEmails'
        },
        '#gridrefresh': {
            click: 'onGridRefresh'
        },
        'tableview': {
            actionview: 'onActionView',
            actiondelete: 'onActionDelete',
            actionedit: 'onActionEdit',
            actionsend: 'onActionSend',
            actionreply: 'onActionReply',
            actionregenerate: 'onActionRegenerate'
        }
    },

    /**
     * @param {CMDBuildUI.view..emails.Container.button} view
     * @param {Object} eOpts
     */
    onComposeEmail: function (view, eOpts) {
        var me = this;
        var vm = this.getViewModel();
        var email = Ext.create("CMDBuildUI.model.emails.Email");
        email.getProxy().setUrl(vm.get("emails").getProxy().getUrl());

        var object = vm.get("theTarget");
        var objectdata = object && object.getCleanData() || {};

        var config = {
            xtype: 'emails-create',
            viewModel: {
                data: {
                    objectdata: objectdata,
                    theEmail: email
                }
            },
            listeners: {
                itemcreated: function () {
                    me.getView().getStore().reload();
                }
            }
        };

        CMDBuildUI.util.Utilities.openPopup('popup-compose-email', CMDBuildUI.locales.Locales.emails.composeemail, config, null, {
            alwaysOnTop: 50
        });
    },

    onRegenerateAllEmails: function () {
        // TODO: regenearte all emails
        var theTarget = this.getViewModel().get('theTarget');
        if (theTarget._templatestoevaluate.length != 0) {

            theTarget.loadTemplates(true).then(function (templates) {
                theTarget.updateEmailsFromTemplates(Ext.emptyFn, false, true);
            });
        } else {
            var emails = this.getViewModel().get('emails');
            emails.getRange().forEach(function (item, index, array) {
                if (item.get('status') == CMDBuildUI.model.emails.Email.statuses.draft && !Ext.isEmpty(item.get('template'))) {

                    // update card data
                    item.set("_card", theTarget.getData());
                    item.save({
                        proxy: {
                            url: CMDBuildUI.util.api.Emails.getCardEmailsUrl(
                                theTarget.get('_type'),
                                theTarget.getId()
                            )
                        },
                        url: CMDBuildUI.util.api.Emails.getCardEmailsUrl(
                            theTarget.get('_type'),
                            theTarget.getId()
                        ),
                        params: {
                            apply_template: true
                        },
                        success: function (record) {
                        }
                    });

                }
            }, this);
        }
    },

    /**
     * Refresh grid handler
     * 
     * @param {Ext.button.Button} btn 
     * @param {Object} epts 
     */
    onGridRefresh: function (btn, epts) {
        this.getView().getStore().reload();
    },

    /**
     * @param {CMDBuildUI.view.attachments.Grid} grid
     * @param {Ext.data.Model} record
     * @param {Number} rowIndex
     * @param {Number} colIndex
     * 
     */
    onActionView: function (grid, record, rowIndex, colIndex) {
        var vm = this.getViewModel();
        var listeners = {};
        vm.set("theEmail", record);
        var config = {
            xtype: 'emails-view',
            viewModel: {
                data: {
                    theEmail: vm.get('theEmail')
                }
            }
        };

        CMDBuildUI.util.Utilities.openPopup(
            'popup-view-email',
            CMDBuildUI.locales.Locales.emails.view,
            config,
            listeners, {
                alwaysOnTop: 50
            }
        );
    },

    /**
     * @param {CMDBuildUI.view.attachments.Grid} grid
     * @param {Ext.data.Model} record
     * @param {Number} rowIndex
     * @param {Number} colIndex
     * 
     */
    onActionDelete: function (grid, record, rowIndex, colIndex) {
        var vm = this.getViewModel();
        CMDBuildUI.util.Msg.confirm(
            CMDBuildUI.locales.Locales.emails.remove,
            CMDBuildUI.locales.Locales.emails.remove_confirmation,
            function (action) {
                if (action === "yes") {
                    record.getProxy().setUrl(vm.get("emails").getProxy().getUrl());
                    CMDBuildUI.util.Ajax.setActionId('emails.delete');
                    record.erase();
                }
            }
        );
    },

    /**
     * @param {CMDBuildUI.view.attachments.Grid} grid
     * @param {Ext.data.Model} record
     * @param {Number} rowIndex
     * @param {Number} colIndex
     * 
     */
    onActionEdit: function (grid, record, rowIndex, colIndex) {
        var vm = this.getViewModel();
        var listeners = {};

        var object = vm.get("theTarget");
        var objectdata = object && object.getCleanData() || {};
        record.getProxy().setUrl(vm.get("emails").getProxy().getUrl());

        var config = {
            xtype: 'emails-edit',
            viewModel: {
                data: {
                    objectdata: objectdata,
                    theEmail: record
                }
            }
        };

        CMDBuildUI.util.Utilities.openPopup(
            'popup-edit-email',
            CMDBuildUI.locales.Locales.emails.view,
            config,
            listeners, {
                alwaysOnTop: 50
            }
        );
    },

    /**
     * @param {CMDBuildUI.view.attachments.Grid} grid
     * @param {Ext.data.Model} record
     * @param {Number} rowIndex
     * @param {Number} colIndex
     * 
     */
    onActionSend: function (grid, record, rowIndex, colIndex) {
        var vm = this.getViewModel();
        if (record && record.getData()) {
            var theEmail = record;
            theEmail.set('status', 'outgoing');
            theEmail.getProxy().setUrl(vm.get("emails").getProxy().getUrl());
            theEmail.save();
        }
    },

    /**
     * @param {CMDBuildUI.view.attachments.Grid} grid
     * @param {Ext.data.Model} record
     * @param {Number} rowIndex
     * @param {Number} colIndex
     * 
     */
    onActionReply: function (grid, record, rowIndex, colIndex) {
        var me = this;
        var vm = this.getViewModel();

        // email configuration
        var emailconf = {
            cc: record.get('cc'),
            bcc: record.get('bcc'),
            account: record.get("account")
        };

        // calculate receiver address
        if (record.get("status") === CMDBuildUI.model.emails.Email.statuses.received) {
            emailconf.to = record.get("from");
        } else if (record.get("status") === CMDBuildUI.model.emails.Email.statuses.sent) {
            emailconf.to = record.get("to");
        }

        // calculate prefix
        var subjectprefix = 'Re: ';
        if (Ext.String.startsWith(record.get('subject'), subjectprefix)) {
            emailconf.subject = record.get('subject');
        } else {
            emailconf.subject = subjectprefix + record.get('subject');
        }

        // calculate body
        var bodyprefix = Ext.String.format(
            CMDBuildUI.locales.Locales.emails.replyprefix,
            CMDBuildUI.util.helper.FieldsHelper.renderTimestampField(record.get("date")),
            record.get("from")
        );

        // TODO: workaround - check if correct 
        emailconf.body = emailconf._content_html = Ext.String.format(
            "<p>&nbsp;</p><p>&nbsp;</p><p>{0}</p><blockquote>{1}</blockquote>",
            bodyprefix,
            record.get("_content_html")
        );

        // generate email
        var email = Ext.create("CMDBuildUI.model.emails.Email", emailconf);
        email.getProxy().setUrl(vm.get("emails").getProxy().getUrl());

        var object = vm.get("theTarget");
        var objectdata = object && object.getCleanData() || {};

        var title = CMDBuildUI.locales.Locales.emails.composeemail;
        var config = {
            xtype: 'emails-create',
            viewModel: {
                data: {
                    objectdata: objectdata,
                    theEmail: email
                }
            },
            listeners: {
                itemcreated: function () {
                    me.getView().getStore().reload();
                }
            }
        };

        var popup = CMDBuildUI.util.Utilities.openPopup('popup-compose-email', title, config, null, {
            alwaysOnTop: 50
        });
    },

    /**
     * @param {CMDBuildUI.view.attachments.Grid} grid
     * @param {Ext.data.Model} record
     * @param {Number} rowIndex
     * @param {Number} colIndex
     * 
     */
    onActionRegenerate: function (grid, record, rowIndex, colIndex) {
        var view = this.getView();
        var vm = view.getViewModel();
        var theTarget = vm.get('theTarget');

        if (record.get('status') == CMDBuildUI.model.emails.Email.statuses.draft && !Ext.isEmpty(record.get('template'))) {

            // update card data
            record.set("_card", theTarget.getData());
            record.save({
                proxy: {
                    url: CMDBuildUI.util.api.Emails.getCardEmailsUrl(
                        theTarget.get('_type'),
                        theTarget.getId()
                    )
                },
                params: {
                    apply_template: true
                },
                success: function (record) {
                }
            });

        }
    },

    privates: {
        /**
         * @return {Ext.tab.Panel}
         */
        getParentTabPanel: function () {
            return this.getView().up("tabpanel");
        }
    }

});