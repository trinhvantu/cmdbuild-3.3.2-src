Ext.define('CMDBuildUI.view.dms.attachment.EditController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.dms-attachment-edit',
    control: {
        '#': {
            beforerender: 'onBeforeRender',
            beforedestroy: 'onBeforeDestroy'
        }
    },

    onBeforeRender: function (view) {
        var vm = this.getViewModel();

        vm.bind({
            DMSCategoryTypeName: '{dms-attachment-edit.DMSCategoryTypeName}',
            DMSCategoryValue: '{dms-attachment-edit.DMSCategoryValue}',
            DMSModelClass: '{dms-attachment-edit.DMSModelClass}',
            DMSClass: '{dms-attachment-edit.DMSClass}'
        }, this.itemsUpdate, this);
    },

    itemsUpdate: function (data) {
        if (data.DMSModelClass && data.DMSCategoryValue && data.DMSCategoryTypeName && data.DMSClass) {
            var items = CMDBuildUI.util.helper.FormHelper.renderForm(data.DMSModelClass, {
                mode: CMDBuildUI.util.helper.FormHelper.formmodes.update,
                linkName: 'dms-attachment-edit.theObject',
                showAsFieldsets: true, //important
                readonly: true,
                ignoreSchedules: this.getView().getIgnoreSchedules(),
                layout: data.DMSClass.get("formStructure") && data.DMSClass.get("formStructure").active ?  data.DMSClass.get("formStructure").form : undefined
            });

            //adds the upload  field
            items.push({
                title: CMDBuildUI.locales.Locales.attachments.file,
                xtype: "formpaginationfieldset",
                collapsed: false,
                hidden: false,
                items: [{
                    xtype: 'container',
                    layout: 'column',
                    defaults: {
                        xtype: "fieldcontainer",
                        columnWidth: 0.5,
                        flex: 0.5,
                        padding: "0 15 0 15",
                        layout: "anchor",
                        minHeight: 1
                    },
                    items: [{
                        layout: 'fit',
                        items: [{
                            xtype: 'draganddropfilefield',
                            reference: 'file',
                            fieldLabel: CMDBuildUI.locales.Locales.attachments.file,
                            allowBlank: true,
                            allowMultiUpload: false,
                            localized: {
                                fieldLabel: 'CMDBuildUI.locales.Locales.attachments.file'
                            },
                            allowedExtensions: this.getView().getAllowedExtensions(data.DMSCategoryTypeName, data.DMSCategoryValue, data.DMSModelClass)
                        }]
                    }, {
                        layout: 'fit',
                        items: [{
                            xtype: 'checkboxfield',
                            reference: 'majorversion',
                            fieldLabel: CMDBuildUI.locales.Locales.attachments.majorversion,
                            autoEl: {
                                'data-testid': 'attachmentform-majorversion'
                            },
                            bind: {
                                value: '{dms-attachment-edit.theObject.majorVersion}'
                            },
                            localized: {
                                fieldLabel: 'CMDBuildUI.locales.Locales.attachments.majorversion'
                            }
                        }]
                    }]
                }]
            });

            var view = this.getView();
            var formView = view.lookupReference('formpanel');

            formView.removeAll(true);
            formView.add(view.getFormItems(items));

            // add conditional visibility rules
            view.addConditionalVisibilityRules('formpanel');

            // add auto value rules
            view.addAutoValueRules('formpanel');

            // init before edit triggers
            view.initBeforeActionFormTriggers(
                CMDBuildUI.util.helper.FormHelper.formtriggeractions.beforeEdit,
                view.getApiForTrigger(CMDBuildUI.util.api.Client.getApiForFormBeforeEdit())
            );
        }
    },

    onSaveButton: function (button, e) {
        var view = this.getView();

        if (view.isValid()) {
            var url = Ext.String.format('{0}/{1}',
                view.getTheObject().getProxy().getUrl(),
                view.getTheObject().getId()),
                method = 'PUT',
                field = this.lookupReference("file"),
                metadata = view.getTheObject().getData(),
                loadmask = CMDBuildUI.util.Utilities.addLoadMask(view),
                success = 0,
                errors = 0;

            // get sequences data
            var sequences = view.getTheObject().sequences()
            // save files
            var files = field.getValue();
            var file = files[0];

            // finish function
            function finish() {

                view.executeAfterActionFormTriggers(
                    CMDBuildUI.util.helper.FormHelper.formtriggeractions.afterEdit,
                    view.getTheObject(),
                    view.getApiForTrigger(CMDBuildUI.util.api.Client.getApiForFormAfterCreate())
                );

                // if all files are uploaded
                if (success) {

                    view.up("panel").fireEvent('popupsave');
                    view.up("panel").close();

                } else if (errors) {

                    CMDBuildUI.util.Utilities.removeLoadMask(loadmask);
                }
            }

            CMDBuildUI.util.File.uploadFileWithMetadata(
                method,
                url,
                file ? file.get('file') : null,
                metadata
            ).then(function (response) {
                file ? file.set("status", CMDBuildUI.model.dms.File.statuses.loaded) : Ext.emptyFn();

                function afterSave(view) {
                    success++;
                    finish();
                }

                if (sequences.getModifiedRecords().length || sequences.getRemovedRecords().length) {
                    sequences.setProxy({
                        type: 'baseproxy',
                        url: '/calendar/sequences',
                        batchOrder: 'destroy,create,update'
                    });
                    sequences.sync({
                        callback: afterSave
                    });
                } else {
                    afterSave();
                }


            }).otherwise(function (error) {
                file ? file.set("status", CMDBuildUI.model.dms.File.statuses.error) : Ext.emptyFn();

                errors++;

                var response = {
                    responseText: error
                };
                CMDBuildUI.util.Ajax.showMessages(response, {
                    hideErrorNotification: false
                });

                finish();
            });
        }
    },

    onCancelButton: function (button, e) {
        var view = this.getView();
        view.closePanel();
    },

    /**
     * Unlock card on management details window close.
     * @param {CMDBuildUI.view.classes.cards.card.Edit} view 
     * @param {Object} eOpts 
     */
    onBeforeDestroy: function (view, eOpts) {
        var theObject = view.getTheObject();
        if (theObject) {
            theObject.removeLock();
        }
    }
});