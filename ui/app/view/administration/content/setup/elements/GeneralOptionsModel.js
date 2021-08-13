Ext.define('CMDBuildUI.view.administration.content.setup.elements.GeneralOptionsModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.administration-content-setup-elements-generaloptions',
    data: {
        values: {
            language: null,
            dateFormat: null,
            timeFormat: null,
            decimalsSeparator: null,
            thousandsSeparator: null
        },
        validations: {
            decimalsSeparator: true,
            thousandsSeparator: true
        }
    },

    formulas: {

        inactiveusers_value: {
            bind: {
                value: '{theSetup.org__DOT__cmdbuild__DOT__auth__DOT__users__DOT__expireInactiveAfterPeriod}'
            },
            get: function (data) {
                if (data.value === "") {
                    return "";
                } else if (Ext.isString(data.value)) {
                    return data.value.replace('M', "");
                } else {
                    return null;
                }
            },
            set: function (value) {
                if (value) {
                    this.set('theSetup.org__DOT__cmdbuild__DOT__auth__DOT__users__DOT__expireInactiveAfterPeriod', value + "M");
                } else {
                    this.set('theSetup.org__DOT__cmdbuild__DOT__auth__DOT__users__DOT__expireInactiveAfterPeriod', null);
                }
            }
        },

        /**
         * se il valore bindato e' null --> la checkbox rimane visibile
         * se il valore e' "" (string vuota) --> la checkbox deve essere vuota
         * 
         * Per la validazione
         * null --> valore non valido
         * "" --> valore valido
         * E' stata fatta questa distinzione per gestire il caso in cui si rimuove il contenuto monthsofinactivity ma si vuole mantenere la checbox attiva. Per via dei bind se non si fosse fatto cosi, 
         * una volta rimosso il contenuto la checkebox sarebbe diventata hidden
         */
        inactiveusers_checkbox_value: {
            bind: {
                value: '{inactiveusers_value}'
            },
            single: true,
            get: function (data) {
                if (data.value === "") {
                    return true;
                } else if (data.value === null) {
                    return false;
                }
                return true;
            }
        },

        inactiveusers_displayfield_hidden: {
            bind: {
                view: '{actions.view}',
                checkvalue: "{inactiveusers_checkbox_value}"
            },
            get: function (data) {
                return !data.view || !data.checkvalue;
            }
        },
        inactiveusers_numberfield_hidden: {
            bind: {
                view: '{actions.view}',
                checkvalue: '{inactiveusers_checkbox_value}'
            },
            get: function (data) {
                return data.view || !data.checkvalue;
            }
        },

        startingClassDescription: {
            bind: {
                startingClass: '{theSetup.org__DOT__cmdbuild__DOT__core__DOT__startingclass}'
            },
            get: function (data) {
                if (data.startingClass) {
                    var initialPage = data.startingClass,
                        initialPageSplip = initialPage.split(':');

                    if (initialPageSplip.length > 1) {
                        var object = CMDBuildUI.util.helper.ModelHelper.getObjectFromName(initialPageSplip[1], initialPageSplip[0]);
                        if (object) {
                            initialPage = object.get('description');
                        }
                        return this.set('_startingClass_description', initialPage);
                    }
                    return this.set('_startingClass_description', initialPage);
                }
            }
        },
        updateData: {
            get: function () {
                this.set("values.decimalsSeparator", CMDBuildUI.util.helper.UserPreferences.get(CMDBuildUI.model.users.Preference.decimalsSeparator));
                this.set("values.thousandsSeparator", CMDBuildUI.util.helper.UserPreferences.get(CMDBuildUI.model.users.Preference.thousandsSeparator));
                this.set("values.dateFormat", CMDBuildUI.util.helper.UserPreferences.get(CMDBuildUI.model.users.Preference.dateFormat));
                this.set("values.timeFormat", CMDBuildUI.util.helper.UserPreferences.get(CMDBuildUI.model.users.Preference.timeFormat));
                this.set("values.language", CMDBuildUI.util.helper.UserPreferences.get(CMDBuildUI.model.users.Preference.language));
                this.set("values.timezone", CMDBuildUI.util.helper.UserPreferences.get(CMDBuildUI.model.users.Preference.timezone));
                this.set("values.preferredOfficeSuite", CMDBuildUI.util.helper.UserPreferences.get(CMDBuildUI.model.users.Preference.preferredOfficeSuite));
            }
        },

        /**
         * Update separators validations
         */
        updateSeparatorsValidations: {
            bind: {
                decimals: '{values.decimalsSeparator}',
                thousands: '{values.thousandsSeparator}'
            },
            get: function (data) {
                var decimals = true,
                    thousands = true;
                if (data.decimals && data.thousands && data.decimals === data.thousands) {
                    thousands = decimals = CMDBuildUI.locales.Locales.main.preferences.decimalstousandserror;
                } else if (data.decimals && !data.thousands) {
                    thousands = CMDBuildUI.locales.Locales.main.preferences.thousandserror;
                } else if (!data.decimals && data.thousands) {
                    decimals = CMDBuildUI.locales.Locales.main.preferences.decimalserror;
                }
                this.set("validations.decimalsSeparator", decimals);
                this.set("validations.thousandsSeparator", thousands);
            }
        },

        dateFormatsData: function () {
            return CMDBuildUI.util.administration.helper.ModelHelper.dateFormatsData();
        },

        timeFormatsData: function () {
            return CMDBuildUI.util.administration.helper.ModelHelper.timeFormatsData();
        },

        decimalsSeparatorsData: function () {
            return CMDBuildUI.util.administration.helper.ModelHelper.decimalsSeparatorsData();
        },

        thousandsSeparatorsData: function () {
            return [{
                value: ',',
                label: CMDBuildUI.locales.Locales.main.preferences.comma
            }, {
                value: '.',
                label: CMDBuildUI.locales.Locales.main.preferences.period
            }, {
                value: ' ',
                label: CMDBuildUI.locales.Locales.main.preferences.space
            }];
        },

        preferredOfficeSuiteData: function () {
            return [{
                value: 'default',
                label: CMDBuildUI.locales.Locales.main.preferences.default
            }, {
                value: 'msoffice',
                label: CMDBuildUI.locales.Locales.main.preferences.msoffice
            }];
        },

        bulkComboData: function () {
            return CMDBuildUI.util.helper.ModelHelper.bulkComboSettingsData();
        },

        updateTimezones: {
            get: function (data) {
                this.set(
                    "storeProxyUrl",
                    Ext.String.format(
                        '{0}/timezones',
                        CMDBuildUI.util.Config.baseUrl
                    )
                );
                this.set("storeAutoLoad", true);
            }
        }
    },

    stores: {
        languages: {
            model: 'CMDBuildUI.model.Language',
            sorters: 'description',
            autoLoad: true,
            autoDestroy: true
        },
        dateFormats: {
            model: 'CMDBuildUI.model.base.ComboItem',
            proxy: 'memory',
            data: '{dateFormatsData}',
            autoLoad: true,
            autoDestroy: true
        },
        timeFormats: {
            model: 'CMDBuildUI.model.base.ComboItem',
            proxy: 'memory',
            data: '{timeFormatsData}',
            autoLoad: true,
            autoDestroy: true
        },
        decimalsSeparators: {
            model: 'CMDBuildUI.model.base.ComboItem',
            proxy: 'memory',
            data: '{decimalsSeparatorsData}',
            autoLoad: true,
            autoDestroy: true
        },
        thousandsSeparators: {
            model: 'CMDBuildUI.model.base.ComboItem',
            proxy: 'memory',
            data: '{thousandsSeparatorsData}',
            autoLoad: true,
            autoDestroy: true
        },
        timezones: {
            autoDestroy: true,
            proxy: {
                type: 'baseproxy',
                url: '{storeProxyUrl}'
            },
            pageSize: 0,
            autoLoad: '{storeAutoLoad}'

        },
        preferredOfficeSuite: {
            model: 'CMDBuildUI.model.base.ComboItem',
            proxy: 'memory',
            data: '{preferredOfficeSuiteData}',
            autoDestroy: true
        },
        defaultForCardEditStore: {
            model: 'CMDBuildUI.model.base.ComboItem',
            proxy: 'memory',
            data: '{bulkComboData}',
            autoDestroy: true
        },
        defaultForCardDeletionStore: {
            model: 'CMDBuildUI.model.base.ComboItem',
            proxy: 'memory',
            data: '{bulkComboData}',
            autoDestroy: true
        },
        defaultForBulkAbortStore: {
            model: 'CMDBuildUI.model.base.ComboItem',
            proxy: 'memory',
            data: '{bulkComboData}',
            autoDestroy: true
        }
    }

});