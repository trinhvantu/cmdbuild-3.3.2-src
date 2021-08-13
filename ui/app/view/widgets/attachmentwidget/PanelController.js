Ext.define('CMDBuildUI.view.widgets.attachmentwidget.PanelController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.widgets-attachmentwidget-panel',
    control: {
        '#': {
            beforerender: 'onBeforeRender'
        },
        '#closebtn': {
            click: 'onCloseBtnClick'
        }
    },

    /**
     * @param {CMDBuildUI.view.widgets.createmodifycard.Panel} view
     * @param {Object} eOpts
     */
    onBeforeRender: function (view, eOpts) {
        var vm = view._widgetOwner.getViewModel();
        view.add({
            xtype: 'dms-container',
            objectType: vm.get('objectType'),
            objectTypeName: vm.get('objectTypeName'),
            objectId: vm.get('objectId'),
            viewModel: {
                data: {
                    basepermissions: {
                        edit: vm.get('basepermissions.edit')
                    }
                }
            },
            readOnly: false
        });
    },

    /**
     * @param {Ext.button.Button} button
     * @param {Event} e
     * @param {Object} eOpts
     */
    onCloseBtnClick: function (button, e, eOpts) {
        this.getView().fireEvent("popupclose");
    }
});