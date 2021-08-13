Ext.define('CMDBuildUI.view.joinviews.configuration.MainController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.joinviews-configuration-main',

    control: {
        '#': {
            validitychange: 'onValidityChange'
        },
        '#editBtn': {
            click: 'onEditBtnClick'
        },
        '#deleteBtn': {
            click: 'onDeleteBtnClick'
        },
        '#prevBtn': {
            click: 'onPrevBtnClick'
        },
        '#nextBtn': {
            click: 'onNextBtnClick'
        },
        '#saveBtn': {
            click: 'onSaveBtnClick'
        },
        '#cancelBtn': {
            click: 'onCancelBtnClick'
        }
    },

    onEditBtnClick: function (button) {
        var vm = button.lookupViewModel();
        vm.set('action', CMDBuildUI.util.administration.helper.FormHelper.formActions.edit);        
    },
    onDeleteBtnClick: function (button) {
        this.getView().fireEventArgs('deletejoinview', [button]);
    },

    onValidityChange: function(form, valid, eOpts){        
        form.owner.lookupViewModel().set('stepNavigationLocked', !valid);
    },
    /**
     * 
     * @param {Ext.button.Button} button 
     */
    onPrevBtnClick: function (button) {
        var view = this.getView();
        var vm = button.lookupViewModel();
        var activeView = view.items.getAt(vm.get('currentStep'));
        if (!activeView.goingPreviousStep || (activeView.goingPreviousStep && activeView.goingPreviousStep())) {
            vm.set('currentStepWas', vm.get('currentStep'));
            vm.set('currentStep', vm.get('currentStep') - 1);
        } else {
            // TODO show message or something
        }
    },

    /**
     * 
     * @param {Ext.button.Button} button 
     */
    onNextBtnClick: function (button) {
        var view = this.getView();
        var vm = button.lookupViewModel();
        var activeView = view.items.getAt(vm.get('currentStep'));

        if (!activeView.goingNextStep || (activeView.goingNextStep && activeView.goingNextStep())) {
            vm.set('currentStepWas', vm.get('currentStep'));
            vm.set('currentStep', vm.get('currentStep') + 1);
        } else {
            // TODO show message or something
        }
    },

    /**
     * 
     * @param {Ext.button.Button} button 
     */
    onSaveBtnClick: function (button) {
        button.setDisabled(true);
        CMDBuildUI.util.Utilities.showLoader(true);
        var me = this,
            view = me.getView(),
            vm = view.lookupViewModel(),
            theView = vm.get('theView'),
            joinData = view.getJoinData(),
            attributes = view.getAttributesData(),
            attributeGroups = view.getAttributesGroups(),
            sorter = view.getSorter(),
            filter = view.getFilterData();

        var showInGridAttributes = Ext.Array.findBy(attributes, function (attribute) {
            return attribute.showInGrid;
        });

        var showInReducedGrid = Ext.Array.findBy(attributes, function (attribute) {
            return attribute.showInReducedGrid;
        });

        if (!showInGridAttributes || !showInReducedGrid) {
            CMDBuildUI.util.Notifier.showWarningMessage(CMDBuildUI.locales.Locales.joinviews.selectatleastoneattribute, null, vm.get('isAdministrationModule') ? 'administration' : undefined);
            vm.set('currentStep', 3);
            button.setDisabled(false);
            CMDBuildUI.util.Utilities.showLoader(false);
            return false;
        }
        theView.set('join', joinData);
        theView.set('attributes', attributes);
        theView.set('attributeGroups', attributeGroups);
        theView.set('sorter', sorter);
        theView.set('filter', filter);
        CMDBuildUI.util.Ajax.setActionId(Ext.String.format('save-{0}-joinview', vm.get('action')));
        theView.save({
            success: function (record, operation) {
                view.fireEventArgs('saved', [vm.get('action'), record, operation]);
                CMDBuildUI.util.Utilities.showLoader(false);
            },
            failure: function (operation) {
                if (button && !button.destroyed) {
                    button.setDisabled(false);
                    CMDBuildUI.util.Utilities.showLoader(false);
                }
            }
        });


    },

    /**
     * @event
     * @param {Ext.button.Button} button 
     */
    onCancelBtnClick: function (button) {
        var me = this,
            view = me.getView(),
            vm = view.lookupViewModel(),
            theView = vm.get('theView');
        view.fireEventArgs('cancel', [vm.get('action'), theView]);
    },

    onClassChange: function (input, newClassName, oldClassName) {
        var vm = input.lookupViewModel();
        var mainView = input.up('joinviews-configuration-main');
        var allAttributesStore = vm.get('allAttributesStore');
        var klass = CMDBuildUI.util.helper.ModelHelper.getObjectFromName(newClassName);

        if (oldClassName) {
            vm.get('theView').attributes().removeAll();
            vm.get('allAttributesStore').removeAll();
        }
        if (input.lookupViewModel().get('actions.add')) {
            if (!oldClassName || !vm.get('theView.masterClassAlias')) {
                // // set the masterClassAlias
                vm.set('theView.masterClassAlias', newClassName);
            }
        }
        if (klass) {
            klass.getAttributes().then(function (classAttributesStore) {
                classAttributesStore.each(function (attribute) {
                    var expr = Ext.String.format('{0}.{1}', vm.get('theView.masterClassAlias'), attribute.get('name'));
                    var storeAlreadyContain = allAttributesStore.findRecord('expr', expr);
                    if (attribute.canAdminShow() && !storeAlreadyContain) {
                        allAttributesStore.addSorted(CMDBuildUI.model.views.JoinViewAttribute.create({
                            _deepIndex: String.fromCharCode(36),
                            targetAlias: vm.get('theView.masterClassAlias'),
                            targetType: vm.get('theView.masterClass'),
                            expr: expr,
                            name: '',
                            description: '',
                            group: '',
                            showInGrid: false,
                            showInReducedGrid: false,
                            _attributeDescription: attribute.getTranslatedDescription(),
                            attributeconf: attribute.getData(),
                            cmdbuildtype: attribute.get('type')
                        }));
                    } else if (storeAlreadyContain) {
                        storeAlreadyContain.set('_deepIndex', String.fromCharCode(36));
                        storeAlreadyContain.set('_attributeDescription', attribute.getTranslatedDescription());
                        storeAlreadyContain.set('attributeconf', attribute.getData());
                        storeAlreadyContain.set('cmdbuildtype', attribute.get('type'));
                    }
                });
            });
        }
    },

    onClassAliasChange: function (input, newValue, oldValue) {
        this.fireEventToAllItems('classaliaschange', [input, newValue, oldValue]);
    },

    onDomainChange: function (node, context) {
        this.fireEventToAllItems('domainchange', [node, context]);
    },

    onDomainCheckChange: function (node, context) {
        this.fireEventToAllItems('domaincheckchange', [node, context]);
    },

    onAttributeGroupsChanged: function (attributeGroup) {
        this.fireEventToAllItems('attributegruopchanged', [attributeGroup]);
    },

    onAttributeGroupsRemoved: function (attributeGroup) {
        this.fireEventToAllItems('attributegruopremoved', [attributeGroup]);
    },

    privates: {
        /**
         * 
         * @param {String} event 
         * @param {Array} parameters 
         */
        fireEventToAllItems: function (event, parameters) {
            var me = this;
            me.getView().items.each(function (item) {
                item.fireEventArgs(event, parameters);
            });
        }

    }
});