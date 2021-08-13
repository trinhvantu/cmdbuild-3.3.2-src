Ext.define('CMDBuildUI.view.widgets.manageemail.PanelController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.widgets-manageemail-panel',
    control: {
        '#': {
            beforerender: 'onBeforeRender'
        },
        '#closebtn': {
            click: 'onCloseBtnClick'
        }
    },

    /**
     * @param {CMDBuildUI.view.widgets.manageemail.PanelController} view
     * @param {Object} eOpts
     */
    onBeforeRender: function (view, eOpts) {
        var vm = view.lookupViewModel();

        // update emails from tempaltes
        var obj = vm.get("theTarget");
        if (obj) {
            obj.loadTemplates().then(function(templates) {
                obj.updateEmailsFromTemplates();
            });
        }

        // add emails grid
        vm.set("emails", vm.get("theTarget").emails());
        view.add({
            xtype: 'emails-grid',
            formMode: view.getFormMode()
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