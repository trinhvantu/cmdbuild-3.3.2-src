Ext.define('CMDBuildUI.view.login.ContainerController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.login-container',

    control: {
        '#changepasswordform': {
            passwordchange: 'onPasswordChange'
        }
    },

    /**
     * 
     * @param {CMDBuildUI.view.login.changepassword.Form} view 
     */
    onPasswordChange: function(view) {
        this.getViewModel().set("showChangePassword", false);

        view.previousSibling().lookupViewModel().set("password", null);
        // window.location.reload();
    }
});
