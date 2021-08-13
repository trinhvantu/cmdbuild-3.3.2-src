Ext.define('CMDBuildUI.view.login.FormPanelModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.login-formpanel',

    data: {
        loggedIn: false,
        password: null,
        showErrorMessage: false,
        hiddenfields: {},
        disabledfields: {},
        lengths: {
            groups: 0,
            tenants: 0
        }
    },
    formulas: {
        language: {
            get: function (get) {
                var lang = CMDBuildUI.util.helper.SessionHelper.getLanguage();
                if (!lang) {
                    lang = CMDBuildUI.util.helper.Configurations.get(CMDBuildUI.model.Configuration.common.defaultlanguage);
                }
                return lang;
            },
            set: function (value) {
                CMDBuildUI.util.helper.SessionHelper.setLanguage(value);
            }
        },
        updateFieldsVisibility: {
            bind: {
                loggedIn: '{loggedIn}',
                multiTenantActivationPrivileges: '{theSession.multiTenantActivationPrivileges}',
                groups: '{lengths.groups}',
                tenants: '{lengths.tenants}',
                activeTenants: '{theSession.activeTenants}'
            },
            get: function (data) {
                if (data.loggedIn) {
                    this.set("disabledfields.username", true);
                    this.set("disabledfields.password", true);
                    this.set("hiddenfields.role", data.groups > 1 ? false : true);
                    this.set("hiddenfields.cancelbtn", false);
                } else {
                    this.set("disabledfields.username", false);
                    this.set("disabledfields.password", false);
                    this.set("hiddenfields.role", true);
                    this.set("hiddenfields.cancelbtn", true);
                }
                this.set("hiddenfields.language", !CMDBuildUI.util.helper.Configurations.get(CMDBuildUI.model.Configuration.common.uselanguageprompt));

            }
        },

        groupsData: {
            bind: {
                groups: '{theSession.availableRolesExtendedData}'
            },
            get: function (data) {
                var groups = [];
                Ext.Array.each(data.groups, function (item, index) {
                    groups.push({
                        value: item.code,
                        label: item.description
                    });
                });
                this.set("lengths.groups", groups.length);
                return groups;
            }
        },

        tenantsData: {
            bind: {
                tenants: '{theSession.availableTenantsExtendedData}'
            },
            get: function (data) {
                var tenants = [];
                Ext.Array.each(data.tenants, function (item, index) {
                    tenants.push({
                        value: item.code,
                        label: item.description
                    });
                });
                this.set("lengths.tenants", tenants.length);
                return tenants;
            }
        },

        tenantsone: {
            bind: {
                store: '{tenants}',
                single: '{theSession.multiTenantActivationPrivileges}'
            },
            get: function (data) {
                if (data.store && data.single == 'one') {
                    return data.store;
                }
            }
        },
        tenantsonehidden: {
            bind: {
                store: '{tenants}',
                single: '{theSession.multiTenantActivationPrivileges}',
                hasAvailableTenants: '{theSession.availableTenants.length}'
            },
            get: function (data) {
                return !(data.hasAvailableTenants && data.store && data.single == 'one');
            }
        },

        tenantsany: {
            bind: {
                store: '{tenants}',
                single: '{theSession.multiTenantActivationPrivileges}'
            },
            get: function (data) {
                if (data.store && data.single == 'any') {
                    return data.store;
                }
            }
        },

        tenantsanyhidden: {
            bind: {
                single: '{theSession.multiTenantActivationPrivileges}',
                store: '{tenantsany}',
                hasAvailableTenants: '{theSession.availableTenants.length}'
            },
            get: function (data) {
                return !(data.hasAvailableTenants && data.store && data.single == 'any');
            }
        },

        tenantLabel: {
            get: function() {
                return CMDBuildUI.util.Utilities.getTenantLabel();
            }
        }
    },

    links: {
        theSession: {
            type: 'CMDBuildUI.model.users.Session',
            create: {
                _id: "current"
            }
        }
    },

    stores: {
        languages: {
            model: 'CMDBuildUI.model.Language',
            sorters: 'description',
            pageSize: 0,
            autoLoad: true,
            autoDestroy: true
        },
        groups: {
            model: 'CMDBuildUI.model.base.ComboItem',
            proxy: {
                type: "memory"
            },
            autoDestroy: true,
            data: '{groupsData}',
            sorters: ['label']
        },
        tenants: {
            model: 'CMDBuildUI.model.base.ComboItem',
            proxy: {
                type: "memory"
            },
            autoDestroy: true,
            data: '{tenantsData}'
        }
    }

});