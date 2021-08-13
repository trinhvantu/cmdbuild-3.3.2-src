Ext.define('CMDBuildUI.view.emails.email.EmailModel', {
    extend: 'Ext.app.ViewModel',

    alias: 'viewmodel.emails-email',

    data: {
        attachmentsstore: {
            autoload: false
        },
        disabled: {
            templatechoice: true,
            keepsync: true
        }
    },

    formulas: {
        addAttachmentsHidden: {
            get: function () {
                var privileges = CMDBuildUI.util.helper.SessionHelper.getCurrentSession().get("rolePrivileges");

                var enabled = CMDBuildUI.util.helper.Configurations.get(CMDBuildUI.model.Configuration.dms.enabled);
                var access = privileges.flow_tab_attachment_access;

                return !(enabled && access);
            }
        },
        /**
         * Update attachemnts store configuration
         */
        updateAttachmentsStore: {
            bind: {
                email: '{theEmail}',
                isHidden: '{addAttachmentsHidden}'
            },
            get: function (data) {
                var url;
                if (!data.isHidden) {

                    if (!data.email.phantom) {
                        url = data.email.store.getProxy().getUrl() + Ext.String.format("/{0}/attachments", data.email.getId());
                    } else {
                        url = this.get('storeurl');
                    }
                    this.set("attachmentsstore.proxyurl", url);
                    // load attachments only for saved emails
                    this.set("attachmentsstore.autoload", data.email.crudState !== "C");
                }
            }
        },


        /**
         * Update keep syncronization field configuration
         */
        updateKeepSync: {
            bind: {
                template: '{theEmail.template}'
            },
            get: function (data) {
                this.set("disabled.keepsync", Ext.isEmpty(data.template));
            }
        },
        /**
         * 
         * @param {Function} get 
         */
        delaysValues: function (get) {
            return CMDBuildUI.model.emails.Email.getDelays();
        }
    },

    stores: {
        /**
         * Templates list
         */
        templates: {
            model: 'CMDBuildUI.model.emails.Template',
            proxy: {
                type: "baseproxy",
                url: CMDBuildUI.util.api.Emails.getTemplatesUrl()
            },
            autoLoad: true,
            pageSize: 0, // disable pagination
            autoDestroy: true
        },

        /**
         * Delays list
         */
        delays: {
            model: 'CMDBuildUI.model.base.ComboItem',
            proxy: {
                type: "memory"
            },
            autoDestroy: true,
            data: '{delaysValues}'
        },

        /**
         * Attachments list
         */
        attachments: {
            type: 'attachments',
            proxy: {
                type: 'baseproxy',
                url: '{attachmentsstore.proxyurl}'
            },
            autoLoad: '{attachmentsstore.autoload}',
            autoDestroy: true,
            listeners: {
                datachanged: 'onAttachmentsDatachanged'
            }
        }
    }
});