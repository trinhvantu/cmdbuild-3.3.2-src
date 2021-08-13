Ext.define('CMDBuildUI.view.administration.content.groupsandpermissions.tabitems.permissions.tabitems.processes.ProcessesController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.administration-content-groupsandpermissions-tabitems-permissions-tabitems-processes-processes',
    mixins: [
        'CMDBuildUI.view.administration.content.groupsandpermissions.tabitems.permissions.PermissionsMixin'
    ],
    control: {
        '#': {
            beforerender: 'onBeforeRender'
        }
    },
    /**
     * @param {Ext.panel.Panel} view
     */
    onBeforeRender: function (view) {
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
        this.toggleEnablePermissionsTabs(1);
        this.toggleEnableTabs(1);
        button.up().down('grid').reconfigure();
    },

    /**
     * 
     * @param {Ext.view.Table} view The owning TableView.
     * @param { Number} rowIndex The row index clicked on.
     * @param { Number} colIndex The column index clicked on.
     * @param {Object} item The clicked item (or this Column if multiple cfg-items were not configured).
     * @param {Event} e The click event.
     * @param {Ext.data.Model} record The Record underlying the clicked row.
     */
    onManageConfigClick: function (grid, rowIndex, colIndex, item, e, record) {
        grid.setSelection(record);
        var me = this;
        var formMode = grid.grid.getViewModel().get('actions');
        var fbar;
        var initValues = me.getConfigFieldsInitialValues(record);
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
                        click: function (button, event, eOpts) {
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
                    handler: function (button) {
                        CMDBuildUI.util.Utilities.closePopup('popup-grantconfig-config');
                    }
                }];
                break;
        }
        var content = grid.grid.getActionContent(formMode, record, grid, rowIndex, fbar);
        // create panel
        CMDBuildUI.util.Utilities.openPopup(
            'popup-grantconfig-config',
            CMDBuildUI.locales.Locales.administration.groupandpermissions.texts.configurations,
            content, {
                /**
                 * @param {Ext.panel.Panel} panel
                 * @param {Object} eOpts
                 */
                close: function (panel, eOpts) {                    
                    me.setConfigInitValues(record, initValues);
                    CMDBuildUI.util.Utilities.closePopup('popup-grantconfig-config');
                }
            }, {
                ui: 'administration-actionpanel',
                width: '400px',
                height: '70%',
                reference: 'popup-grantconfig-config'
            }
        );
    }
});