Ext.define('CMDBuildUI.view.emails.email.CreateController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.emails-create',

    control: {
        '#': {
            beforerender: 'onBeforeRender'
        },
        '#saveBtn': {
            click: 'onSaveBtn'
        },
        '#cancelBtn': {
            click: 'onCancelBtnClick'
        },
        '#addfileattachment filebutton': {
            click: 'onAddFileAttachmentClick'
        },
        '#addfileattachment': {
            change: 'onAddFileAttachmentChange'
        },
        '#addattachmentsfromdocumentarchive': {
            click: 'onAddAttachmentsFromDocumentArchive'
        },
        '#templatecombo': {
            select: 'onTemplateComboChange'
        }
    },

    /**
     * @param {CMDBuildUI.view.emails.email.Create} view
     * @param {Object} eOpts
     */
    onBeforeRender: function (view, eOpts) {
        this.getViewModel().set('disabled.templatechoice', false);
        var vm = view.getViewModel();
        var grid = this.lookupReference('attachmentsgrid');
        vm.set('attachmentsTotalCount', grid.getStore().data.length);
    },

    /**
     * @param {Ext.form.field.Combobox} combo
     * @param {xt.data.Model/Ext.data.Model[]} record
     * @param {Object} eOpts
     */
    onTemplateComboChange: function (combo, record, eOpts) {
        this.getView().updateEmailFromTemplate(record);
    },

    /**
     * @param {Ext.form.field.FileButton} button 
     * @param {Object} eOpts 
     */
    onAddFileAttachmentClick: function(button, eOpts) {
        // allow multi upload
        button.fileInputEl.dom.setAttribute('multiple', '');
    },

    /**
     * @param {Ext.form.field.File} filefield
     * @param {Object} value
     * @param {Object} eOpts
     */
    onAddFileAttachmentChange: function (filefield, value, eOpts) {
        this.getView().addFileAttachment(filefield);
    },

    /**
     * @param {Ext.button.Button} button
     * @param {Event} e
     * @param {Object} eOpts
     */
    onAddAttachmentsFromDocumentArchive: function (button, e, eOpts) {
        this.getView().addDmsAttachment();
    },

    /**
     * @param {Ext.data.Button} btn
     * @param {Object} eOpts
     */
    onSaveBtn: function (btn, eOpts) {
        var me = this,
            view = this.getView(),
            vm = view.lookupViewModel();

        var attachmentStore = vm.getStore('attachments');
        var allItems = attachmentStore ? attachmentStore.getRange() : [];

        var theEmail = vm.get('theEmail');
        theEmail.set("body", theEmail.get("_content_html"));
        theEmail.set('status', CMDBuildUI.model.emails.Email.statuses.draft);
        btn.disable();
        theEmail.save({
            callback: function (email, response, success) {
                if (view) {
                    var emailId = email.get('_id');
                    var emailProxyUrl = email.getProxy().getUrl();
                    allItems.forEach(function (item) {
                        if (item.get('DMSAttachment')) {
                            me.sendDMSAttachment(item, emailId, emailProxyUrl);
                        } else {
                            me.sendAttachment(item, emailId, emailProxyUrl);
                        }
                    });
                    btn.enable();
                }
                view.fireEvent('itemcreated');
                view.up().close();
            }

        });
    },

    /**
     * @param {Ext.button.Button} button
     * @param {Event} e
     * @param {Object} eOpts
     */
    onCancelBtnClick: function (button, e, eOpts) {
        var popup = this.getView().up("panel");
        popup.close();
    },

    privates: {
        /**
         * 
         * @param {*} attachment 
         * @param {*} emailId 
         * @param {*} emailProxyUrl 
         */
        sendAttachment: function (attachment, emailId, emailProxyUrl) {
            var view = this.getView(),
                vm = view.lookupViewModel();
            CMDBuildUI.util.Ajax.setActionId('attachment.upload');
            var input = attachment.get('_file');
            var formData = new FormData();
            var jsonData = Ext.encode({});
            var fieldName = 'attachment';
            try {
                var blob = new Blob([jsonData], {
                    type: "application/json"
                });
                formData.append(fieldName, blob, input.name);
            } catch (err) {
                CMDBuildUI.util.Logger.log(
                    "Unable to create attachment Blob FormData entry with type 'application/json', fallback to 'text/plain': " + err,
                    CMDBuildUI.util.Logger.levels.error
                );
                // metadata as 'text/plain' (format compatible with older webviews)
                formData.append(fieldName, jsonData);
            }

            var url = Ext.String.format(
                '{0}/{1}/attachments',
                emailProxyUrl,
                emailId
            );

            CMDBuildUI.util.File.upload("POST", formData, input, url, {
                failure: function (error) {
                    var response = {
                        responseText: error
                    };
                    CMDBuildUI.util.Ajax.showMessages(response, {
                        hideErrorNotification: false
                    });
                }
            });
        },

        /**
         * 
         * @param {*} attachment 
         * @param {*} emailId 
         * @param {*} emailProxyUrl 
         */
        sendDMSAttachment: function (attachment, emailId, emailProxyUrl) {
            var url = Ext.String.format(
                '{0}/{1}/attachments',
                emailProxyUrl,
                emailId
            );
            Ext.Ajax.request({
                url: url,
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                params: {
                    copyFrom_class: attachment.get('objectTypeName'),
                    copyFrom_card: attachment.get('objectId'),
                    copyFrom_id: attachment.get('_id')
                }
            });
        }
    },

    onAttachmentsDatachanged: function (store, eOpts) {
        var vm = this.getViewModel();
        vm.set('attachmentsTotalCount', store.data.length);
    }

});