Ext.define('CMDBuildUI.view.login.FormPanelController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.login-formpanel',

    control: {
        '#': {
            beforerender: 'onBeforeRender'
        },
        'textfield': {
            specialkey: 'onSpecialKey'
        },
        '#loginbtn': {
            click: 'onLoginBtnClick'
        },
        '#logoutbtn': {
            click: 'onLogoutBtnClick'
        },
        '#pwdforgottenbtn': {
            click: 'onPwdForgottenBtnClick'
        }
    },

    onBeforeRender: function (view, eOpts) {
        // clear unused cookie
        Ext.util.Cookies.clear("CMDBuild-Authorization");
        // get current session
        var currentsession = CMDBuildUI.util.helper.SessionHelper.getCurrentSession();
        if (currentsession && currentsession.crudState !== "D") {
            var vm = view.lookupViewModel();
            // set session in viewmodel
            vm.set("theSession", currentsession);
            // hide password
            vm.set("hiddenfields.password", true);
            // add binding fo tenants field
            vm.bind({
                bindTo: '{tenantsany}'
            }, function (tenantsany) {
                if (tenantsany) {
                    view.lookupReference('activeTenantsField').setBind({
                        value: '{theSession.activeTenants}'
                    });
                }
            });
            vm.set('loggedIn', true);
            CMDBuildUI.util.helper.SessionHelper.logging = false;
        }
    },

    /**
     * @param {Ext.form.field.Text} textfield
     * @param {Event} e The click event
     */
    onSpecialKey: function (textfield, e) {
        if (e.getKey() == e.ENTER) {
            var me = this;
            setTimeout(function() {
                me.onLoginBtnClick(me.lookupReference('loginbtn'));
            }, 200);
        }
    },
    /**
     * @param {Ext.button.Button} btn
     * @param {Event} e The click event
     */
    onLoginBtnClick: function (btn, e) {
        var me = this;
        var vm = this.getViewModel();
        var form = this.getView();

        if (form.isValid()) {
            btn.mask();
            var theSession = vm.get("theSession");
            theSession.set("password", vm.get("password"));
            // set action id
            CMDBuildUI.util.Ajax.setActionId('login');
            // save session
            if (typeof theSession.get('activeTenants') == 'string') {
                theSession.set('activeTenants', [theSession.get('activeTenants')]);
            }
            theSession.save({
                failure: function (record, operation) {
                    if (!vm.get("loggedIn")) {
                        var error = operation.getError();
                        if (error && error.status == 401) {
                            var response = JSON.parse(operation.getError().response.responseText);
                            var message = CMDBuildUI.locales.Locales.errors.autherror;
                            if (
                                response.messages &&
                                response.messages.length &&
                                response.messages[0].message &&
                                response.messages[0].message !== "access denied"
                            ) {
                                message = response.messages[0].message;
                            }
                            if (response.passwordResetRequired) {
                                message = CMDBuildUI.locales.Locales.main.password.expired;
                                vm.getParent().set("showChangePassword", true);
                                // get change password form
                                var cpviewmodel = form.nextSibling().lookupViewModel();
                                cpviewmodel.set("username", theSession.get("username"));
                                cpviewmodel.set("oldpassword", theSession.get("password"));
                            }
                            CMDBuildUI.util.Notifier.showErrorMessage(message);
                        }
                    }
                },
                success: function (record, operation) {
                    CMDBuildUI.util.helper.SessionHelper.logging = false;
                    CMDBuildUI.util.helper.SessionHelper.initSession(record.getId());

                    // add binding fo tenants field
                    vm.bind({
                        bindTo: '{tenantsany}'
                    }, function (tenantsany) {
                        if (tenantsany) {
                            form.lookupReference('activeTenantsField').setBind({
                                value: '{theSession.activeTenants}'
                            });
                        }
                    });

                    var rolePresence = Ext.Array.indexOf(record.get("availableRoles"), record.get("role"));
                    if (rolePresence == -1 && record.get("role")) {
                        record.set('role', null);
                    }

                    if (record.get("role") && (!record.get('availableTenants') || record.get('activeTenants'))) {
                        // remove previous error messages
                        CMDBuildUI.util.Notifier.closeAll();
                        // show logged in messages
                        CMDBuildUI.util.Notifier.showMessage(
                            Ext.String.format(CMDBuildUI.locales.Locales.login.welcome, record.get('userDescription')), {
                            title: CMDBuildUI.locales.Locales.login.loggedin,
                            icon: 'fa-check-circle'
                        });

                        // redirect to management
                        me.redirectTo('management');
                        return;
                    }

                    vm.set('loggedIn', true);
                },
                callback: function (record, operation, success) {
                    btn.unmask();
                    // hide error message
                    vm.set('showErrorMessage', false);
                }
            });
        } else {
            vm.set('showErrorMessage', true);
        }
    },

    /**
     * @param {Ext.button.Button} btn
     * @param {Event} e The click event
     */
    onLogoutBtnClick: function (btn, e) {
        var vm = this.getViewModel();
        // set action id
        CMDBuildUI.util.Ajax.setActionId('logout');
        // erase session
        vm.getData().theSession.erase({
            success: function (record, operation) {
                // blank session token
                CMDBuildUI.util.Utilities.redirectTo("login", true);
            }
        });
    },

    /**
     * 
     * @param {Ext.button.Button} btn 
     * @param {Event} e 
     */
    onPwdForgottenBtnClick: function (btn, e) {
        var popup = CMDBuildUI.util.Utilities.openPopup(
            null,
            CMDBuildUI.locales.Locales.main.password.forgotten, {
            xtype: 'login-passwordforgotten-panel',
            viewModel: {
                data: {
                    username: btn.lookupViewModel().get("theSession.username")
                }
            },
            listeners: {
                closepopup: function () {
                    popup.close()
                }
            }
        },
            null,
            {
                width: 400,
                height: 250
            }
        )
    }
});