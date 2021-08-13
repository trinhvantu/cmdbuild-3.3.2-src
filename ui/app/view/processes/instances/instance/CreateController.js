Ext.define('CMDBuildUI.view.processes.instances.instance.CreateController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.processes-instances-instance-create',

    control: {
        '#': {
            beforerender: 'onBeforeRender'
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

        if (!(vm.get("theObject") && vm.get("objectModel"))) {
            // get instance model
            CMDBuildUI.util.helper.ModelHelper.getModel(
                CMDBuildUI.util.helper.ModelHelper.objecttypes.process,
                vm.get("objectTypeName")
            ).then(function (model) {
                vm.set("objectModel", model);
    
                // create process instance
                vm.linkTo("theObject", {
                    type: model.getName(),
                    create: true
                });
    
                // load activity for new process
                view.loadActivity();
            }, function () {
                CMDBuildUI.util.Msg.alert('Error', 'Process non found!');
            });
        } else {
            // load activity for new process
            view.loadActivity();
        }

        this.initBeforeCreateFormTriggers();
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
                var vm = button.lookupViewModel();
                // execute post action trigger
                me.executeAfterCreateExecuteFormTriggers(record, vm.get("theActivity"));

                var forcereload = false;
                // get available tasks
                var tasks = record.get("_tasklist");
                var isRunning = record.get("status") == me.getView().getOpenRunningStatusId();
                // redirect to next task
                if (tasks && tasks.length === 1 && isRunning) {
                    var activity = tasks[0];
                    var url = CMDBuildUI.util.Navigation.getProcessBaseUrl(
                        record.get("_type"),
                        record.getId(),
                        activity._id,
                        activity.writable ? 'edit' : 'view'
                    );
                    me.redirectTo(url);
                } else {
                    forcereload = true;
                    me.closeWindow();
                }

                if (!isRunning) {
                    var url = CMDBuildUI.util.Navigation.getProcessBaseUrl(record.get("_type"));
                    me.redirectTo(url);
                    record = null;
                }

                // fire global event process instance updated
                Ext.GlobalEvents.fireEventArgs("processinstancecreated", [record, forcereload]);
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
        // save data
        var me = this;
        this.getView().saveProcess({
            success: function (record, operation) {
                var vm = button.lookupViewModel();
                // execute post action trigger
                me.executeAfterCreateFormTriggers(record, vm.get("theActivity"));

                // fire global event process instance updated
                Ext.GlobalEvents.fireEventArgs("processinstancecreated", [record]);
                if (button.reference == 'saveAndCloseBtn') {
                    var url = CMDBuildUI.util.Navigation.getProcessBaseUrl(
                        record.get("_type"),
                        record.getId()
                    );
                } else if (button.reference == 'saveBtn') {
                    var url = CMDBuildUI.util.Navigation.getProcessBaseUrl(
                        record.get("_type"),
                        record.getId(),
                        record.get('_tasklist')[0]._id,
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
         * Initialize before create form triggers.
         */
        initBeforeCreateFormTriggers: function () {
            this.getView().initBeforeActionFormTriggers(
                CMDBuildUI.util.helper.FormHelper.formtriggeractions.beforeInsert,
                CMDBuildUI.util.api.Client.getApiForFormBeforeCreate()
            );
        },

        /**
         * Execute after create form triggers.
         * 
         * @param {CMDBuildUI.model.processes.Instance} record
         */
        executeAfterCreateFormTriggers: function (record, activity) {
            this.getView().executeAfterActionFormTriggers(
                CMDBuildUI.util.helper.FormHelper.formtriggeractions.afterInsert,
                record,
                activity,
                CMDBuildUI.util.api.Client.getApiForFormAfterCreate()
            );
        },

        /**
         * Execute after create form triggers.
         * 
         * @param {CMDBuildUI.model.processes.Instance} record
         */
        executeAfterCreateExecuteFormTriggers: function (record, activity) {
            this.getView().executeAfterActionFormTriggers(
                CMDBuildUI.util.helper.FormHelper.formtriggeractions.afterInsertExecute,
                record,
                activity,
                CMDBuildUI.util.api.Client.getApiForFormAfterCreate()
            );
        }
    }

});