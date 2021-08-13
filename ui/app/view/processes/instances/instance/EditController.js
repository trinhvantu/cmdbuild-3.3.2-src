Ext.define('CMDBuildUI.view.processes.instances.instance.EditController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.processes-instances-instance-edit',

    control: {
        '#': {
            beforerender: 'onBeforeRender',
            beforedestroy: 'onBeforeDestroy'
        },
        '#saveBtn': {
            click: 'onSaveBtnClick'
        },
        '#saveAndCloseBtn': {
            click: 'onSaveBtnClick'
        },
        '#executeBtn': {
            click: 'onExecuteBtnClick'
        },
        '#cancelBtn': {
            click: 'onCancelBtnClick'
        }
    },

    /**
     * @param {CMDBuildUI.view.classes.cards.card.View} view
     * @param {Object} eOpts
     */
    onBeforeRender: function (view, eOpts) {
        var vm = this.getViewModel();
        vm.set("basepermissions.edit", true);
        
        if (!(vm.get("theObject") && vm.get("objectModel"))) {
            // get instance model
            CMDBuildUI.util.helper.ModelHelper.getModel(
                CMDBuildUI.util.helper.ModelHelper.objecttypes.process,
                vm.get("objectTypeName")
            ).then(function (model) {
                vm.set("objectModel", model);
    
                // load process instance
                vm.linkTo("theObject", {
                    type: model.getName(),
                    id: vm.get("objectId")
                });
    
                // load activity
                view.loadActivity();
            }, function () {
                CMDBuildUI.util.Msg.alert('Error', 'Process non found!');
            });
        } else {
            // load activity
            view.loadActivity();
        }

        this.initBeforeEditFormTriggers();
    },

    /**
     * Unlock card on management details window close.
     * @param {CMDBuildUI.view.processes.instances.instance.Edit} view 
     * @param {Object} eOpts 
     */
    onBeforeDestroy: function (view, eOpts) {
        if (view._isLocked) {
            view.lookupViewModel().get("theObject").removeLock();
        }
    },

    /**
     * @param {Ext.button.Button} button
     * @param {Event} e
     * @param {Object} eOpts
     */
    onExecuteBtnClick: function (button, e, eOpts) {
        // disable button
        button.disable();
        // execute process
        var me = this;
        this.getView().executeProcess({
            success: function (record, operation) {
                if (me.getView().getForm().isValid()) {
                    button.enable();
                }

                var vm = button.lookupViewModel();
                // execute post action trigger
                me.executeAfterEditExecuteFormTriggers(record, vm.get("theActivity"));

                var forcereload = false;
                // get available tasks
                var tasks = record.get("_tasklist");
                var isRunning = record.get("status") == me.getView().getOpenRunningStatusId();
                // redirect to next task
                if (tasks && tasks.length === 1 && isRunning) {
                    var activity = tasks[0];
                    if (vm.get("theActivity._id") === activity._id && activity.writable) {
                        // change action in context menu to force redirect
                        // otherwise the page will be not update
                        // if activity and action are the same
                        CMDBuildUI.util.Navigation.updateCurrentManagementContextAction('view');
                    }
                    var url = CMDBuildUI.util.Navigation.getProcessBaseUrl(
                        record.get("_type"),
                        record.getId(),
                        activity._id,
                        activity.writable ? 'edit' : 'view'
                    );
                    me.redirectTo(url, true);

                } else {
                    forcereload = isRunning;
                    me.closeWindow();
                }

                if (!isRunning) {
                    var url = CMDBuildUI.util.Navigation.getProcessBaseUrl(
                        record.get("_type")
                    );
                    me.redirectTo(url);
                    record = null;
                }


                // fire global event process instance updated
                Ext.GlobalEvents.fireEventArgs("processinstanceupdated", [record, forcereload]);
            },
            failure: function () {
                button.enable();
            },
            callback: function (record, operation, success) {
                if (me.getView() && me.getView().loadMask) {
                    CMDBuildUI.util.Utilities.removeLoadMask(me.getView().loadMask);
                }
            }
        });
    },

    /**
     * @param {Ext.button.Button} button
     * @param {Event} e
     * @param {Object} eOpts
     */
    onSaveBtnClick: function (button, e, eOpts) {
        // disable button
        button.disable();
        // execute process
        var me = this;
        this.getView().saveProcess({
            success: function (record, operation) {
                var vm = button.lookupViewModel();
                // execute post action trigger
                me.executeAfterEditFormTriggers(record, vm.get("theActivity"));

                // fire global event process instance updated
                Ext.GlobalEvents.fireEventArgs("processinstanceupdated", [record]);
                var url;
                if (button.reference == 'saveAndCloseBtn') {
                    url = CMDBuildUI.util.Navigation.getProcessBaseUrl(
                        record.get("_type"),
                        record.getId()
                    );
                } else if (button.reference == 'saveBtn') {
                    url = CMDBuildUI.util.Navigation.getProcessBaseUrl(
                        record.get("_type"),
                        record.getId(),
                        record.get('_activity'),
                        'view'
                    );
                }
                me.redirectTo(url);
            },
            failure: function () {
                button.enable();
            },
            callback: function (record, operation, success) {
                if (me.getView() && me.getView().loadMask) {
                    CMDBuildUI.util.Utilities.removeLoadMask(me.getView().loadMask);
                }
            }
        });
    },

    /**
     * @param {Ext.button.Button} button
     * @param {Event} e
     * @param {Object} eOpts
     */
    onCancelBtnClick: function (button, e, eOpts) {
        this.closeWindow();
    },

    privates: {
        /**
         * Close window
         */
        closeWindow: function () {
            this.getView().closeDetailWindow();
        },

        /**
         * Initialize before edit form triggers.
         */
        initBeforeEditFormTriggers: function () {
            this.getView().initBeforeActionFormTriggers(
                CMDBuildUI.util.helper.FormHelper.formtriggeractions.beforeEdit,
                CMDBuildUI.util.api.Client.getApiForFormBeforeEdit()
            );
        },

        /**
         * Execute after edit form triggers.
         * 
         * @param {CMDBuildUI.model.processes.Instance} record
         */
        executeAfterEditFormTriggers: function (record, activity) {
            this.getView().executeAfterActionFormTriggers(
                CMDBuildUI.util.helper.FormHelper.formtriggeractions.afterEdit,
                record,
                activity,
                CMDBuildUI.util.api.Client.getApiForFormAfterEdit()
            );
        },

        /**
         * Execute after edit execute form triggers.
         * 
         * @param {CMDBuildUI.model.processes.Instance} record
         */
        executeAfterEditExecuteFormTriggers: function (record, activity) {
            this.getView().executeAfterActionFormTriggers(
                CMDBuildUI.util.helper.FormHelper.formtriggeractions.afterEditExecute,
                record,
                activity,
                CMDBuildUI.util.api.Client.getApiForFormAfterEdit()
            );
        }
    }

});