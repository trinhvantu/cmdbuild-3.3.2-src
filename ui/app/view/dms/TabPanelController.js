Ext.define('CMDBuildUI.view.dms.TabPanelController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.dms-tabpanel',
    control: {
        '#': {
            beforerender: 'onBeforeRender'
        }
    },
    onBeforeRender: function (view) {
        var height = CMDBuildUI.util.helper.Configurations.get(CMDBuildUI.model.Configuration.ui.inlinecard.height) / 2;
        // view.setHeight((view.up('dms-container').getHeight() * height / 100));
    },

    onEditToolClick: function () {
        var view = this.getView();
        var model = view.getDMSModelClass();

        this.openEditPopup(model);
    },

    /**
     * 
     * @param {*} tool 
     * @param {*} e 
     */
    onDeleteToolClick: function (tool, e) {
        var vm = this.getViewModel();
        CMDBuildUI.util.Msg.confirm(
            CMDBuildUI.locales.Locales.attachments.deleteattachment,
            CMDBuildUI.locales.Locales.attachments.deleteattachment_confirmation,
            function (action) {
                if (action === "yes") {
                    var view = this.getView().lookupReference('dms-attachment-view');
                    var gridContainer = view.up('dms-container');
                    var url = Ext.String.format('{0}{1}/{2}', CMDBuildUI.util.Config.baseUrl, vm.get('proxyUrl'), view.getAttachmentId());

                    Ext.Ajax.request({
                        url: url,
                        method: 'DELETE',
                        success: function (response) {
                            gridContainer.getViewModel().getStore('attachments').load();

                            var theObject = view.getTheObject();
                            if (theObject) {

                                // execute form trigger
                                view.executeAfterActionFormTriggers(
                                    CMDBuildUI.util.helper.FormHelper.formtriggeractions.afterDelete,
                                    view.getTheObject(),
                                    view.getApiForTrigger(CMDBuildUI.util.api.Client.getApiForFormAfterDelete())
                                );
                            }
                        },
                        error: function (response) {
                            console.log('Error on deleting the attachment');
                        }
                    });
                }
            }, this
        );
    },

    /**
     * 
     * @param {*} tool 
     * @param {*} e 
     */
    onDownloadToolClick: function (tool, e) {
        var tabPanel = this.getView();

        var filename = this.getViewModel().get('record.name');
        var url = Ext.String.format('{0}{1}/{2}/{3}',
            CMDBuildUI.util.Config.baseUrl,
            this.getViewModel().get('proxyUrl'), //specificated in CMDBuildUI.view.dms.GridModel
            tabPanel.getAttachmentId(),
            filename
        );

        CMDBuildUI.util.File.download(url, filename);
    },

    openEditPopup: function (model) {
        var view = this.getView();
        var gridContainer = view.up('dms-container');

        var title = CMDBuildUI.locales.Locales.attachments.editattachment;
        panel = CMDBuildUI.util.Utilities.openPopup('popup-edit-attachment-form', title, {

            xtype: 'dms-attachment-edit',
            objectType: gridContainer.getObjectType(),
            objectTypeName: gridContainer.getObjectTypeName(),
            objectId: gridContainer.getObjectId(),
            attachmentId: view.getAttachmentId(),
            DMSCategoryTypeName: gridContainer.getDMSCategoryTypeName(),
            DMSCategoryValue: view.getDMSCategoryValue(),
            ignoreSchedules: gridContainer.getIgnoreSchedules()
        }, {
            popupsave: {
                fn: function () {
                    gridContainer.getViewModel().getStore('attachments').load();
                },
                scope: this
            },
            popupcancel: function () { }
        });
    },

    privates: {
        getEditPopupTitle: function () {

        }
    }

});
