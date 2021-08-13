Ext.define('CMDBuildUI.view.administration.content.importexport.gatetemplates.TabPanelModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.administration-content-importexport-gatetemplates-tabpanel',
    data: {
        activeTab: 0,
        disabledTabs: {
            properties: false,
            templates: false,
            importon: false
        },
        enabledTab: null
    },

    formulas: {
        enabledTab: {            
            get: function (data) {                
                if (data.enabledTab) {
                    this.set('disabledTabs.properties', data.enabledTab !== 'properties');
                    this.set('disabledTabs.templates', data.enabledTab !== 'templates');
                    this.set('disabledTabs.importon', data.enabledTab !== 'importon');
                } else {
                    this.set('disabledTabs.properties', false);
                    this.set('disabledTabs.templates', false);
                    this.set('disabledTabs.importon', false);
                }
            },
            set: function (value) {
                if (value) {
                    this.set('disabledTabs.properties', value !== 'properties');
                    this.set('disabledTabs.templates', value !== 'templates');
                    this.set('disabledTabs.importon', value !== 'importon');
                } else {
                    this.set('disabledTabs.properties', false);
                    this.set('disabledTabs.templates', false);
                    this.set('disabledTabs.importon', false);
                }
            }
        },
        action: {
            bind: {
                isView: '{actions.view}',
                isEdit: '{actions.edit}',
                isAdd: '{actions.add}'
            },
            get: function (data) {
                this.set('activeTab', this.getView().up('administration-content').getViewModel().get('activeTabs.gatetemplate') || 0);
                if (data.isView) {
                    this.set('formModeCls', 'formmode-view');
                    this.set('enabledTab', null);
                    return CMDBuildUI.util.administration.helper.FormHelper.formActions.view;
                } else if (data.isEdit) {
                    this.set('formModeCls', 'formmode-edit');
                    return CMDBuildUI.util.administration.helper.FormHelper.formActions.edit;
                } else if (data.isAdd) {
                    this.set('formModeCls', 'formmode-add');
                    this.set('enabledTab', 'properties');
                    return CMDBuildUI.util.administration.helper.FormHelper.formActions.add;
                }
            },
            set: function (value) {                
                this.getParent().set('actions.view', value === CMDBuildUI.util.administration.helper.FormHelper.formActions.view);
                this.getParent().set('actions.edit', value === CMDBuildUI.util.administration.helper.FormHelper.formActions.edit);
                this.getParent().set('actions.add', value === CMDBuildUI.util.administration.helper.FormHelper.formActions.add);
            }
        }
    }

});