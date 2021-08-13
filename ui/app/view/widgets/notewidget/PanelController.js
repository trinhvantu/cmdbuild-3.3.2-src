Ext.define('CMDBuildUI.view.widgets.notewidget.PanelController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.widgets-notewidget-panel',
    control: {
        '#': {
            beforerender: 'onBeforeRender'
        },
        '#editbtn': {
            click: 'onEditBtnClick'
        },
        '#closebtn': {
            click: 'onCloseBtnClick'
        },
        '#cancelbtn': {
            click: 'onCancelBtnClick'
        }
    },

    /**
     * @param {CMDBuildUI.view.widgets.createmodifycard.Panel} view
     * @param {Object} eOpts
     */
    onBeforeRender: function (view, eOpts) {
        var vm = view._widgetOwner.getViewModel();

        var popupId = Ext.String.format(
            'popup-show-widget-{0}-{1}',
            this.getViewModel().get('theWidget').get("_type"),
            this.getViewModel().get('theWidget').getId()
        );
        var config = {
            activityId: vm.get('activityId'),
            objectType: vm.get('objectType'),
            objectTypeName: vm.get('objectTypeName'),
            objectId: vm.get('objectId'),
            basepermissions: vm.get('basepermissions'),
            theObject: vm.get("theObject"),
            popupId: popupId
        };
        view.add({
            xtype: 'notes-panel',
            layout: 'fit',
            viewModel: {
                data: config
            }
        });
    },

    onEditBtnClick: function (view, eOpts) {
        this.getViewModel().set("editmode", true);
    },

    /**
     * @param {Ext.button.Button} button
     * @param {Event} e
     * @param {Object} eOpts
     */
    onCloseBtnClick: function (button, e, eOpts) {
        this.getView().fireEvent("popupclose");
    },

    /**
     * @param {Ext.button.Button} button Cancel button
     * @param {Event} event
     * @param {Object} eOpts
     */
    onCancelBtnClick: function (button, event, eOpts) {
        this.getViewModel().set("editmode", false);
    }
});