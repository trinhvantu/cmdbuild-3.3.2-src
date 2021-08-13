Ext.define('CMDBuildUI.view.main.header.PreferencesController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.main-header-preferences',
    control: {
        '#savebtn': {
            click: 'onSaveBtnClick'
        },
        '#cancelbtn': {
            click: 'onCancelBtnClick'
        }
    },

    /**
     * 
     * @param {Ext.button.Button} btn 
     * @param {Event} e 
     * @param {Object} eOpts 
     */
    onSaveBtnClick: function (btn, e, eOpts) {
        var vm = btn.lookupViewModel();
        var oldLanguage = CMDBuildUI.util.helper.UserPreferences.get(CMDBuildUI.model.users.Preference.language);

        CMDBuildUI.util.helper.UserPreferences.updatePreferences(vm.get("values")).then(function () {
            CMDBuildUI.util.helper.UserPreferences.load().then(function () {
                CMDBuildUI.util.helper.UserPreferences.formats = {};
                CMDBuildUI.util.Utilities.closePopup('UserPreferences');

                //HACK: here appends the reload after saving the new language configuration
                var newLanguage = CMDBuildUI.util.helper.UserPreferences.get(CMDBuildUI.model.users.Preference.language);
                if (oldLanguage != newLanguage && newLanguage != CMDBuildUI.util.helper.SessionHelper.getLanguage()) {
                    CMDBuildUI.util.helper.SessionHelper.setLanguage(newLanguage);
                    window.location.reload();
                }
            });
        });
    },

    /**
     * 
     * @param {Ext.button.Button} btn 
     * @param {Event} e 
     * @param {Object} eOpts 
     */
    onCancelBtnClick: function (btn, e, eOpts) {
        CMDBuildUI.util.Utilities.closePopup('UserPreferences');
    }
});