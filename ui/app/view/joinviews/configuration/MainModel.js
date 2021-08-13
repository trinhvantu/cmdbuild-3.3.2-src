Ext.define('CMDBuildUI.view.joinviews.configuration.MainModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.joinviews-configuration-main',
    data: {
        uiContext: 'administration',
        showForm: 'true',
        currentStep: 0,
        currentStepWas: 0,
        stepNavigationLocked: true,
        totalStep: 6,
        primaryButtonUi: null,
        secondaryButtonUi: null,
        fieldsetUi: null,
        isPrevDisabled: true,
        isNextDisabled: true,
        actions: {
            view: false,
            edit: false,
            add: true,
            empty: false
        },
        toolAction: {
            _canUpdate: false,
            _canDelete: false,
            _canActiveToggle: false
        },
        selectedAttributes: []
    },
    formulas: {
        action: {
            bind: {
                theView: '{theView}',
                isEdit: '{actions.edit}',
                isAdd: '{actions.add}',
                isView: '{actions.view}'
            },
            get: function (data) {
                var configurationView = this.getView().up('joinviews-configuration-configuration');
                if (data.isEdit) {
                    if (configurationView) {
                        configurationView.getViewModel().set('disabledTabs.fieldsmanagement', true);
                    }
                    return CMDBuildUI.util.administration.helper.FormHelper.formActions.edit;
                } else if (data.isAdd) {                    
                    if (configurationView) {
                       configurationView.getViewModel().set('disabledTabs.fieldsmanagement', true);
                    }
                    return CMDBuildUI.util.administration.helper.FormHelper.formActions.add;
                } else {
                    if (configurationView) {
                        configurationView.getViewModel().set('disabledTabs.fieldsmanagement', false);
                    }
                    return CMDBuildUI.util.administration.helper.FormHelper.formActions.view;
                }
            },
            set: function (value) {
                this.set('actions.view', value === CMDBuildUI.util.administration.helper.FormHelper.formActions.view);
                this.set('actions.edit', value === CMDBuildUI.util.administration.helper.FormHelper.formActions.edit);
                this.set('actions.add', value === CMDBuildUI.util.administration.helper.FormHelper.formActions.add);
                this.set('actions.empty', value === CMDBuildUI.util.administration.helper.FormHelper.formActions.empty);
            }
        },
        panelTitleManager: {
            bind: {
                description: '{theView.description}',
                currentStep: '{currentStep}',
                totalStep: '{totalStep}'
            },
            get: function (data) {
                var me = this;
                if (data && !me.get('actions.empty')) {
                    var title = Ext.String.format(
                        '{0} {1} {2} - {3} {4} {5} {6} {7}',                        
                        this.get('theView').phantom ? CMDBuildUI.locales.Locales.joinviews.newjoinview : CMDBuildUI.locales.Locales.joinviews.joinview,
                        data.description ? '-' : '',
                        data.description,
                        CMDBuildUI.locales.Locales.administration.tasks.step,
                        data.currentStep + 1,
                        CMDBuildUI.locales.Locales.administration.tasks.of,
                        data.totalStep
                    );
                    me.getParent().set('panelTitle', title);
                } else {
                    me.getParent().set('panelTitle', Ext.String.capitalize(CMDBuildUI.locales.Locales.joinviews.joinview));
                }
            }
        },

        toolsManager: {
            bind: {
                canModify: '{theSession.rolePrivileges.admin_views_modify}'
            },
            get: function (data) {
                this.set('toolAction._canUpdate', data.canModify === true);
                this.set('toolAction._canDelete', data.canModify === true);
                this.set('toolAction._canActiveToggle', data.canModify === true);
            }
        },
        uiManager: {
            bind: '{uiContext}',
            get: function (uiContext) {
                this.set('primaryButtonUi', uiContext === 'administration' ? 'administration-action-small' : 'management-action-small');
                this.set('secondaryButtonUi', uiContext === 'administration' ? 'administration-secondary-action-small' : 'secondary-action-small');
                this.set('fieldsetUi', uiContext === 'administration' ? 'administration-formpagination' : 'formpagination');
            }
        },
        stepManager: {
            bind: {
                stepNavigationLocked: '{stepNavigationLocked}',
                currentStep: '{currentStep}',
                totalStep: '{totalStep}'
            },
            get: function (data) {
                if (data.stepNavigationLocked) {
                    this.set('isPrevDisabled', true);
                    this.set('isNextDisabled', true);
                } else {
                    this.set('isPrevDisabled', data.currentStep === 0);
                    this.set('isNextDisabled', data.currentStep >= this.get('totalStep') - 1);
                }
            }
        },
        attributesStoreManager: {
            bind: '{theView}',
            get: function (theView) {
                if (theView) {
                    var attributesGroupsStore = theView.attributeGroups();
                    var selectedAttributes = theView.attributes().getRange();
                    var gridStore = this.get('allAttributesStore');
                    this.set('attributeGroupsStore', attributesGroupsStore);
                    Ext.Array.forEach(selectedAttributes, function (item) {
                        if (!gridStore.findRecord('expr', item.get('expr'))) {
                            gridStore.add(item);
                        }
                    });
                    this.set('selectedAttributes', selectedAttributes);
                }

            }
        }
    },

    stores: {
        allAttributesStore: {
            groupField: '_deepIndex',
            sorters: ['_deepIndex', '_attributeDescription']

        },
        attributeGroupsStore: {

        }
    }

});