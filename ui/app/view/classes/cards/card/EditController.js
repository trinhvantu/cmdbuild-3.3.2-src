Ext.define('CMDBuildUI.view.classes.cards.card.EditController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.classes-cards-card-edit',

    control: {
        '#': {
            beforerender: 'onBeforeRender',
            beforedestroy: 'onBeforeDestroy'
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
     * @param {CMDBuildUI.view.classes.cards.card.EditController} view
     * @param {Object} eOpts
     */
    onBeforeRender: function (view, eOpts) {
        var vm = this.getViewModel();
        var me = this;

        /**
         * Promise success callback.
         * @param {CMDBuildUI.model.classes.Card} model 
         */
        function success(model) {
            vm.set("objectModel", model);

            // set instance to ViewModel
            vm.linkTo('theObject', {
                type: model.getName(),
                id: view.getObjectId() || vm.get("objectId")
            });
        }

        // if the object is not defined on parent
        if (!(vm.get("theObject") && vm.get("objectModel"))) {
            // get model 
            CMDBuildUI.util.helper.ModelHelper
                .getModel('class', view.getObjectTypeName() || vm.get("objectTypeName"))
                .then(success);
        }

        // bind theObject to add form
        vm.bind({
            bindTo: {
                cardmodel: '{theObject._model}',
                objectmodel: '{objectModel}'
            }
        }, function (data) {
            if (data.cardmodel && data.objectmodel) {
                function redirectToView() {

                    var url = CMDBuildUI.util.Navigation.getClassBaseUrl(
                        view.getObjectTypeName() || vm.get("objectTypeName"),
                        view.getObjectId() || vm.get("objectId"),
                        'view');

                    me.redirectTo(url);
                }
                if (data.cardmodel[CMDBuildUI.model.base.Base.permissions.edit]) {
                    vm.get("theObject").addLock().then(function (success) {
                        if (success) {
                            me._isLocked = true;
                            // add fields
                            view.add(view.getMainPanelForm(view.getDynFormFields()));

                            // add conditional visibility rules
                            view.addConditionalVisibilityRules();

                            // add auto value rules
                            view.addAutoValueRules();

                            // validate form before edit
                            Ext.asap(function () {
                                view.isValid();
                            });
                        } else {
                            redirectToView();
                        }
                    });
                } else {
                    redirectToView();
                }
            }
        });

        this.initBeforeEditFormTriggers();
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
        var form = this.getView();
        this.saveForm().then(function (record) {
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
     * @param {Ext.button.Button} button
     * @param {Event} e
     * @param {Object} eOpts
     */
    onSaveAndCloseBtnClick: function (button, e, eOpts) {
        // disable button
        button.disable();
        // save data
        var me = this;
        var form = this.getView();
        this.saveForm().then(function (record) {
            if (form.getRedirectAfterSave()) {
                // close detail window
                CMDBuildUI.util.Navigation.removeManagementDetailsWindow();

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
     * @param {Ext.button.Button} button
     * @param {Event} e
     * @param {Object} eOpts
     */
    onCancelBtnClick: function (button, e, eOpts) {
        var vm = button.lookupViewModel();
        // discard changes
        vm.get("theObject").reject();
        // close detail window
        CMDBuildUI.util.Navigation.removeManagementDetailsWindow();
    },

    /**
     * Unlock card on management details window close.
     * @param {CMDBuildUI.view.classes.cards.card.Edit} view 
     * @param {Object} eOpts 
     */
    onBeforeDestroy: function (view, eOpts) {
        if (this._isLocked) {
            this.getViewModel().get("theObject").removeLock();
        }
    },

    privates: {
        /**
         * Initialize before create form triggers.
         */
        initBeforeEditFormTriggers: function () {
            this.getView().initBeforeActionFormTriggers(
                CMDBuildUI.util.helper.FormHelper.formtriggeractions.beforeEdit,
                CMDBuildUI.util.api.Client.getApiForFormBeforeEdit()
            );
        },

        /**
         * Execute after create form triggers.
         * 
         * @param {CMDBuildUI.model.classes.Card} record
         * @param {Object} originalData
         */
        executeAfterEditFormTriggers: function (record, originalData) {
            record.oldData = originalData;
            if (this.getView()) {
                this.getView().executeAfterActionFormTriggers(
                    CMDBuildUI.util.helper.FormHelper.formtriggeractions.afterEdit,
                    record,
                    CMDBuildUI.util.api.Client.getApiForFormAfterEdit()
                );
            }
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
                var originalData = vm.get("theObject").getOriginalDataForChangedFields();

                if (!vm.get("classObject.noteInline")) {
                    delete vm.get('theObject').data.Notes; //resolves issue #1982
                }

                function afterSave(record, operation) {
                    // execute after create form triggers
                    me.executeAfterEditFormTriggers(record, originalData);

                    // fire global card update event
                    if (form.getFireGlobalEventsAfterSave()) {
                        Ext.GlobalEvents.fireEventArgs("cardupdated", [record]);
                    }

                    // resolve promise
                    deferred.resolve(record);

                    // execute callback
                    if (Ext.isFunction(callback)) {
                        CMDBuildUI.util.Logger.log("callback on saveForm is deprecated", CMDBuildUI.util.Logger.levels.warn);
                        Ext.callback(callback, me, [record]);
                    }
                }

                vm.get("theObject").save({
                    success: function (record, operation) {
                        var sequences = vm.get('theObject').sequences();
                        sequences.setProxy({
                            type: 'baseproxy',
                            url: '/calendar/sequences',
                            batchOrder:'destroy,create,update'
                        })

                        if (sequences.getModifiedRecords().length || sequences.getRemovedRecords().length) {
                            sequences.sync({
                                callback: afterSave.call(this, record, operation)
                            })
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