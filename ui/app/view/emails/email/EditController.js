Ext.define('CMDBuildUI.view.emails.email.EditController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.emails-edit',

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
        var vm = view.getViewModel();
        var grid = this.lookupReference('attachmentsgrid');
        vm.set('attachmentsTotalCount', grid.getStore().data.length);
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
     * @param {Ext.form.field.Combobox} combo
     * @param {xt.data.Model/Ext.data.Model[]} record
     * @param {Object} eOpts
     */
    onTemplateComboChange: function (combo, record, eOpts) {
        this.getView().updateEmailFromTemplate(record);
    },

    /**
     * @param {Ext.button.Button} btn
     * @param {Object} eOpts
     */
    onSaveBtn: function (btn, eOpts) {
        var me = this;
        var view = this.getView();
        var vm = view.lookupViewModel();
        var attachmentStore = me.getView().getViewModel().getStore('attachments');

        var allItems = attachmentStore ? attachmentStore.getRange() : [];
        var removedItems = attachmentStore ? attachmentStore.removed : [];

        var theEmail = vm.get('theEmail');
        theEmail.set("body", theEmail.get("_content_html"));
        btn.disable();
        theEmail.save({
            callback: function (email, response, success) {
                if (view) {
                    var emailId = email.get('_id');
                    var removedItemslength = removedItems.length;
                    removedItems.forEach(function (item) {
                        item.getProxy().setUrl(attachmentStore.getProxy().getUrl());
                        item.erase({
                            callback: function (record, operation, success) {
                                --removedItemslength;
                                if (removedItemslength == 0) {
                                    afterErase(me, emailId);
                                }
                            }
                        });
                    });

                    btn.enable();
                    if (removedItemslength == 0) {
                        afterErase(me, emailId);
                    }
                }
            }
        });

        /**
         * This function creates/modify the attachments. Is called after the DELETE operation of attachments
         * @param {String} emailId 
         */
        function afterErase(me, emailId) {
            var storeProxyUrl;
            if (attachmentStore) {

                storeProxyUrl = attachmentStore.getProxy().getUrl();
                if (!storeProxyUrl) {
                    storeProxyUrl = Ext.String.format(
                        "{0}/{1}/attachments",
                        theEmail.getProxy().getUrl(),
                        theEmail.getId()
                    );
                }
                allItems.forEach(function (item) {
                    if (item.get('newAttachment')) {
                        if (!item.get('DMSAttachment')) {
                            me.sendAttachment(item, emailId, storeProxyUrl);
                        } else {
                            if (item.get('DMSAttachment')) {
                                me.sendDMSAttachment(item, emailId, storeProxyUrl);
                            }
                        }
                    }
                });
            }
            view.up().close();
        }
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
        sendAttachment: function (attachment, emailId, storeProxyUrl) {
            CMDBuildUI.util.Ajax.setActionId('attachment.upload');
            var input = attachment.get('_file');
            var formData = new FormData();

            // append attachment json data
            var jsonData = Ext.encode({});
            var fieldName = 'attachment';
            try {
                formData.append(fieldName, new Blob([jsonData], {
                    type: "application/json"
                }));
            } catch (err) {
                CMDBuildUI.util.Logger.log(
                    "Unable to create attachment Blob FormData entry with type 'application/json', fallback to 'text/plain': " + err,
                    CMDBuildUI.util.Logger.levels.error
                );
                // metadata as 'text/plain' (format compatible with older webviews)
                formData.append(fieldName, jsonData);
            }

            CMDBuildUI.util.File.upload("POST", formData, input, storeProxyUrl, {
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

        sendDMSAttachment: function (attachment, emailId, storeProxyUrl) {
            Ext.Ajax.request({
                url: storeProxyUrl,
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                params: {
                    copyFrom_class: attachment.get('objectTypeName'),
                    copyFrom_card: attachment.get('objectId'),
                    copyFrom_id: attachment.get('_id')
                }
            });
        },

        onAttachmentsDatachanged: function (store, eOpts) {
            var vm = this.getViewModel();
            vm.set('attachmentsTotalCount', store.data.length);

        }
    }
});