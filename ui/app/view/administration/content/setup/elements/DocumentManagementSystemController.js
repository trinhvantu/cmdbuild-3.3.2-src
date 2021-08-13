Ext.define('CMDBuildUI.view.administration.content.setup.elements.DocumentManagementSystemController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.administration-content-setup-elements-documentmanagementsystem',

    control: {
        '#': {
            beforerender: 'onBeforeRender'
        },
        '#dmsServiceType': {
            afterrender: 'onDmsServiceTypeAfterRender'
        }
    },

    onBeforeRender: function (view) {
        view.up('administration-content').getViewModel().set('title', Ext.String.format('{0} - {1}', CMDBuildUI.locales.Locales.administration.navigation.dms, CMDBuildUI.locales.Locales.administration.navigation.settings));
        view.up('administration-content-setup-view').getViewModel().setFormMode(CMDBuildUI.util.administration.helper.FormHelper.formActions.view);
    },

    onDmsServiceTypeAfterRender: function (view) {
        var vm = view.up('administration-content-setup-view').getViewModel();
        vm.bind({
            bindTo: {
                dmsServiceType: '{theSetup.org__DOT__cmdbuild__DOT__dms__DOT__service__DOT__type}'
            }
        }, function (data) {
            switch (data.dmsServiceType) {
                case 'postgres':
                    view.enable();
                    break;
                case 'cmis':
                    CMDBuildUI.util.administration.helper.ConfigHelper.getConfig('org__DOT__cmdbuild__DOT__dms__DOT__service__DOT__type').then(function (value) {
                        if (!view.destroyed && value === 'cmis') {
                            view.disable();
                        }
                    });
                    break;
            }

        });

    }


});