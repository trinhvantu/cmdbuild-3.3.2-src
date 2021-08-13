Ext.define('CMDBuildUI.view.administration.content.groupsandpermissions.tabitems.permissions.tabitems.classes.ClassesController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.administration-content-groupsandpermissions-tabitems-permissions-tabitems-classes-classes',

    mixins: [
        'CMDBuildUI.view.administration.content.groupsandpermissions.tabitems.permissions.PermissionsMixin'
    ],

    control: {
        '#': {
            beforerender: 'onBeforeRender'
        },
        '#administration-classes-permissions': {
            actionfiltersrowclick: 'onActionFiltersClick'
        }
    },

    onBeforeRender: function () {
        var vm = this.getView().up('administration-content-groupsandpermissions-tabitems-permissions-permissions').getViewModel();
        vm.setFormMode(CMDBuildUI.util.administration.helper.FormHelper.formActions.view);
    },

    /**
     * @param {Ext.button.Button} button
     * @param {Event} e
     * @param {Object} eOpts
     */
    onEditBtnClick: function (button, e, eOpts) {
        var vm = this.getView().up('administration-content-groupsandpermissions-tabitems-permissions-permissions').getViewModel();
        vm.setFormMode(CMDBuildUI.util.administration.helper.FormHelper.formActions.edit);
        this.toggleEnablePermissionsTabs(0);
        this.toggleEnableTabs(1);
        button.up().down('grid').reconfigure();
    },


    /**
     * On manage config button click
     * @param {Ext.button.Button} button
     * @param {Event} e
     * @param {Object} eOpts
     */
    onManageConfigClick: function (grid, rowIndex, colIndex, button, event, record) {
        grid.setSelection(record);
        var me = this;
        var formMode = grid.grid.getViewModel().get('actions');
        var fbar;

        var initValues = this.getConfigFieldsInitialValues(record);
        switch (formMode.edit) {
            case true:
                fbar = [{
                    text: CMDBuildUI.locales.Locales.administration.common.actions.ok,
                    localized: {
                        text: CMDBuildUI.locales.Locales.administration.common.actions.ok
                    },
                    reference: 'savebutton',
                    itemId: 'savebutton',
                    viewModel: {},
                    listeners: {
                        click: function (_button, _event, eOpts) {                        
                            CMDBuildUI.util.Utilities.closePopup('popup-grantconfig-config');


                        }
                    },
                    ui: 'administration-action'
                }, {
                    text: CMDBuildUI.locales.Locales.administration.common.actions.cancel,
                    localized: {
                        text: CMDBuildUI.locales.Locales.administration.common.actions.cancel
                    },
                    reference: 'cancelbutton',
                    ui: 'administration-secondary-action',
                    viewModel: {},
                    listeners: {
                        click: function (_button, _event, eOpts) {
                            me.setConfigInitValues(record, initValues);
                            CMDBuildUI.util.Utilities.closePopup('popup-grantconfig-config');
                        }
                    }
                }];
                break;

            case false:
                fbar = [{
                    text: CMDBuildUI.locales.Locales.administration.common.actions.close,
                    localized: {
                        text: CMDBuildUI.locales.Locales.administration.common.actions.close
                    },
                    reference: 'closebutton',
                    ui: 'administration-secondary-action',
                    handler: function (_button) {
                        _button.up('#popup-grantconfig-config').fireEvent('close');
                    }
                }];
                break;
        }
        var content = grid.grid.getActionContent(formMode, record, grid, rowIndex, fbar);

        // custom panel listeners
        var listeners = {
            /**
             * @param {Ext.panel.Panel} panel
             * @param {Object} eOpts
             */
            close: function (panel, eOpts) {
                
                me.setConfigInitValues(record, initValues);
                CMDBuildUI.util.Utilities.closePopup('popup-grantconfig-config');
            }
        };

        // create panel
        CMDBuildUI.util.Utilities.openPopup(
            'popup-grantconfig-config',
            CMDBuildUI.locales.Locales.administration.groupandpermissions.texts.configurations,
            content,
            listeners, {
                ui: 'administration-actionpanel',
                width: '400px',
                height: '70%',
                reference: 'popup-grantconfig-config'
            }
        );
    }
});