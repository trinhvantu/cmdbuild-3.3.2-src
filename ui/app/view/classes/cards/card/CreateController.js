Ext.define('CMDBuildUI.view.classes.cards.card.CreateController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.classes-cards-card-create',

    control: {
        '#': {
            beforerender: 'onBeforeRender'
        },
        '#savebtn': {
            click: 'onSaveBtnClick'
        },
        '#saveandclosebtn': {
            click: 'onSaveAndCloseBtnClick'
        },
        '#cancelbtn': {
            click: 'onCancelBtnClick'
        }
    },

    /**
     * @param {CMDBuildUI.view.classes.cards.card.Create} view
     * @param {Object} eOpts
     */
    onBeforeRender: function (view, eOpts) {
        var vm = this.getViewModel();
        var me = this;
        var isCloneAction = view.getCloneObject() && vm.get("objectId") ? true : false;

        if (!(vm.get("theObject") && vm.get("objectModel"))) {
            // get model
            CMDBuildUI.util.helper.ModelHelper
                .getModel('class', vm.get("objectTypeName"))
                .then(function (model) {
                    vm.set("objectModel", model);
    
                    // create new instance
                    vm.linkTo('theObject', {
                        type: model.getName(),
                        create: true
                    });
                });
        }

        vm.bind({
            bindTo: {
                theObject: '{theObject}',
                objectModel: '{objectModel}'
            }
        }, function (params) {
            if (isCloneAction) {
                params.objectModel.load(vm.get("objectId"), {
                    callback: function (record, operation, success) {
                        if (success) {
                            data = record.getData();
                            delete data._id;
                            for (key in data) {
                                params.theObject.set(key, data[key]);
                            }
                        }
                        me.linkObject(view);
                        me.initBeforeCloneFormTriggers();
                    }
                });
            } else {
                me.linkObject(view);
                me.initBeforeCreateFormTriggers();
            }
        });
    },

    /**
     * Save button click
     * 
     * @param {Ext.button.Button} button
     * @param {Event} e
     * @param {Object} eOpts
     */
    onSaveBtnClick: function (button, e, eOpts) {
        // disable button
        button.disable();
        // get form
        var me = this;
        var form = this.getView();

        me.saveForm().then(function (record) {
            if (form.getRedirectAfterSave()) {
                var url = CMDBuildUI.util.Navigation.getClassBaseUrl(
                    record.get("_type"),
                    record.getId(),
                    'view');
                me.redirectTo(url);
            }
        }).otherwise(function () {
            button.enable();
        });
    },

    /**
     * Save and close button click
     * 
     * @param {Ext.button.Button} button
     * @param {Event} e
     * @param {Object} eOpts
     */
    onSaveAndCloseBtnClick: function (button, e, eOpts) {
        // disable button
        button.disable();
        // get form
        var me = this;
        var form = this.getView();
        me.saveForm().then(function (record) {
            if (form.getRedirectAfterSave()) {
                var url = CMDBuildUI.util.Navigation.getClassBaseUrl(
                    record.get("_type"),
                    record.getId());
                me.redirectTo(url);
            }
        }).otherwise(function () {
            button.enable();
        });
    },

    /**
     * Close creation window
     */
    onCancelBtnClick: function () {
        // close detail window
        CMDBuildUI.util.Navigation.removeManagementDetailsWindow();
    },

    privates: {
        linkObject: function (view) {
            // get form fields
            view.add(view.getMainPanelForm(view.getDynFormFields()));

            // add conditional visibility rules
            view.addConditionalVisibilityRules();

            // add auto value rules
            view.addAutoValueRules();

            // validate form before edit
            Ext.asap(function () {
                view.isValid();
            });
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
         * Initialize before create form triggers.
         */
        initBeforeCloneFormTriggers: function () {
            this.getView().initBeforeActionFormTriggers(
                CMDBuildUI.util.helper.FormHelper.formtriggeractions.beforeClone,
                CMDBuildUI.util.api.Client.getApiForFormBeforeClone()
            );
        },

        /**
         * Execute after create form triggers.
         * 
         * @param {CMDBuildUI.model.classes.Card} record
         */
        executeAfterCreateFormTriggers: function (record) {
            this.getView().executeAfterActionFormTriggers(
                CMDBuildUI.util.helper.FormHelper.formtriggeractions.afterInsert,
                record,
                CMDBuildUI.util.api.Client.getApiForFormAfterCreate()
            );
        },

        /**
         * Execute after create form triggers.
         * 
         * @param {CMDBuildUI.model.classes.Card} record
         */
        executeAfterCloneFormTriggers: function (record) {
            this.getView().executeAfterActionFormTriggers(
                CMDBuildUI.util.helper.FormHelper.formtriggeractions.afterClone,
                record,
                CMDBuildUI.util.api.Client.getApiForFormAfterClone()
            );
        },

        /**
         * Save data
         * @param {function} callback 
         * @return {Ext.promise.Promise}
         */
        saveForm: function (callback) {
            var deferred = new Ext.Deferred();

            var me = this;
            var form = this.getView();
            var vm = form.lookupViewModel();

            if (form.isValid()) {
                /**
                 * 
                 * @param {CMDBuildUI.model.classes.Card} record 
                 * @param {Ext.data.operation.Write} operation 
                 */
                function afterSave(record, operation) {
                    if (!record.getRecordType()) {
                        record.set('_type', form.getObjectTypeName());
                    }

                    if (form.getCloneObject()) {
                        me.executeAfterCloneFormTriggers(record);
                    } else {
                        // execute after create form triggers
                        me.executeAfterCreateFormTriggers(record);
                    }

                    // fire global card created event
                    if (form.getFireGlobalEventsAfterSave()) {
                        Ext.GlobalEvents.fireEventArgs("cardcreated", [record]);
                    }

                    // resolve promise
                    deferred.resolve(record);

                    // Deprecated: execute callback
                    if (Ext.isFunction(callback)) {
                        CMDBuildUI.util.Logger.log("callback on saveForm is deprecated", CMDBuildUI.util.Logger.levels.warn);
                        Ext.callback(callback, me, [record]);
                    }
                }

                // save object
                vm.get("theObject").save({
                    success: function (record, operation) {
                        var sequences = record.sequences();
                        sequences.setProxy({
                            type: 'baseproxy',
                            url: '/calendar/sequences'
                        });

                        //sets the 'card' field in the schedules rule
                        sequences.getRange().forEach(function (sequence) {
                            sequence.set('card', record.getId());
                        });

                        if (sequences.getModifiedRecords().length || sequences.getRemovedRecords().length) {
                            sequences.sync({
                                callback: afterSave.call(this, record, operation)
                            });
                        } else {
                            afterSave(record, operation);
                        }
                    },
                    failure: function () {
                        deferred.reject();
                    }
                });
            } else {
                deferred.reject();
            }

            return deferred.promise;
        }
    }
});
