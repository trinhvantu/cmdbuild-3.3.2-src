Ext.define('CMDBuildUI.view.main.header.HeaderModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.main-header-header',

    data: {
        companylogoinfo: {
            hidden: true,
            url: null
        }
    },

    formulas: {
        isAdministrator: {
            bind: {
                privileges: '{theSession.rolePrivileges}',
                isAdministrationModule: '{isAdministrationModule}'
            },
            get: function (data) {
                return data.privileges && data.privileges.admin_access && !data.isAdministrationModule;
            }
        },

        calendarbtnhidden: {
            bind: {
                privileges: '{theSession.rolePrivileges}',
                systemConfsLoaded: '{systemConfsLoaded}'
            },
            get: function (data) {
                if (data.systemConfsLoaded && CMDBuildUI.util.helper.Configurations.get(CMDBuildUI.model.Configuration.scheduler.enabled) && data.privileges && (data.privileges.calendar_access || data.privileges.calendar_event_create)) {
                    return false;
                }
                return true;
            }
        }
    }

});
