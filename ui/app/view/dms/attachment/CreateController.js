Ext.define('CMDBuildUI.view.dms.attachment.CreateController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.dms-attachment-create',
    control: {
        '#': {
            beforerender: 'onBeforeRender'
        }
    },

    onBeforeRender: function (view) {
        var vm = this.getViewModel();

        vm.bind({
            DMSCategoryTypeName: '{dms-attachment-create.DMSCategoryTypeName}',
            DMSCategoryValue: '{dms-attachment-create.DMSCategoryValue}',
            DMSModelClass: '{dms-attachment-create.DMSModelClass}',
            DMSClass: '{dms-attachment-create.DMSClass}'
        }, this.itemsUpdate, this);
    },

    itemsUpdate: function (data) {

        if (data.DMSModelClass && data.DMSCategoryValue && data.DMSCategoryTypeName && data.DMSClass) {
            var items = CMDBuildUI.util.helper.FormHelper.renderForm(data.DMSModelClass, {
                mode: CMDBuildUI.util.helper.FormHelper.formmodes.create,
                linkName: 'dms-attachment-create.theObject',
                showAsFieldsets: true, //important
                readonly: true,
                ignoreSchedules: this.getView().getIgnoreSchedules(),
                layout: data.DMSClass.get("formStructure") && data.DMSClass.get("formStructure").active ?  data.DMSClass.get("formStructure").form : undefined
            });

            //enables or disables multi upload whene the DMS Model has some form triggers afterInsert
            var allowMultiUpload = true;
            var DMSClass = CMDBuildUI.util.helper.ModelHelper.getDMSModelFromName(data.DMSModelClass.objectTypeName);
            var triggers = DMSClass.getFormTriggersForAction(CMDBuildUI.util.helper.FormHelper.formtriggeractions.afterInsert);
            if (triggers && triggers.length) {
                allowMultiUpload = false;
            }

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
                            allowBlank: false,
                            allowMultiUpload: allowMultiUpload,
                            localized: {
                                fieldLabel: 'CMDBuildUI.locales.Locales.attachments.file'
                            },
                            allowedExtensions: this.getView().getAllowedExtensions(data.DMSCategoryTypeName, data.DMSCategoryValue, data.DMSModelClass)
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
                CMDBuildUI.util.helper.FormHelper.formtriggeractions.beforeInsert,
                view.getApiForTrigger(CMDBuildUI.util.api.Client.getApiForFormBeforeCreate())
            );
        }
    },

    onSaveButton: function (button, e) {
        var view = this.getView();

        if (view.isValid()) {
            var url = view.getTheObject().getProxy().getUrl(),
                method = 'POST',
                field = this.lookupReference("file"),
                metadata = view.getTheObject().getData(),
                loadmask = CMDBuildUI.util.Utilities.addLoadMask(view),
                success = 0,
                errors = 0;

            // get sequences data
            var sequences = view.getTheObject().sequences().getRange();
            // save files
            var files = field.getValue();

            // finish function
            function finish() {

                // execute after action trigger
                view.executeAfterActionFormTriggers(
                    CMDBuildUI.util.helper.FormHelper.formtriggeractions.afterInsert,
                    view.getTheObject(),
                    view.getApiForTrigger(CMDBuildUI.util.api.Client.getApiForFormAfterCreate())
                );

                // if all files are uploaded
                switch (files.length) {
                    case success:
                        view.up("panel").fireEvent('popupsave');
                        view.up("panel").close();
                        break;
                    case (success + errors):
                        CMDBuildUI.util.Utilities.removeLoadMask(loadmask);
                        view.isValid();
                        break;
                }
            }

            files.forEach(function (file) {
                CMDBuildUI.util.File.uploadFileWithMetadata(
                    method,
                    url,
                    file.get('file'),
                    metadata
                ).then(function (response) {
                    file.set("status", CMDBuildUI.model.dms.File.statuses.loaded);

                    function afterSave(view) {
                        success++;
                        finish();
                    }

                    if (sequences.length) {
                        // create store for sequences
                        var sequencesstore = Ext.create("Ext.data.Store", {
                            model: 'CMDBuildUI.model.calendar.Sequence',
                            proxy: {
                                type: 'baseproxy',
                                url: '/calendar/sequences'
                            }
                        });

                        var dmsModelId = response._card;

                        sequences.forEach(function (sequence) {
                            var sequenceCopy = sequence.copy(null); //setting null will create a new record
                            sequenceCopy.set('card', dmsModelId);
                            sequenceCopy.events().setData(sequence.events().getRange());
                            sequencesstore.add(sequenceCopy);
                        });

                        sequencesstore.sync({
                            callback: afterSave
                        });
                    } else {
                        afterSave();
                    }

                }).otherwise(function (error) {
                    file.set("status", CMDBuildUI.model.dms.File.statuses.error);
                    errors++;

                    var response = {
                        responseText: error
                    };
                    CMDBuildUI.util.Ajax.showMessages(response, {
                        hideErrorNotification: false
                    });

                    finish();
                });
            });
        }
    },

    onCancelButton: function (button, e) {
        var view = this.getView();
        var upPanel = view.up("panel");

        view.up("panel").fireEvent('popupcancel');
        upPanel.close();
    }
});