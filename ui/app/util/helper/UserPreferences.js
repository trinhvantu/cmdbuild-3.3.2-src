Ext.define('CMDBuildUI.util.helper.UserPreferences', {
    singleton: true,

    /**
     * Load user preferences
     * 
     * @return {Ext.promise.Promise} Resolve method has as argument an 
     *      instance of {CMDBuildUI.store.users.Preferences}. 
     *      Reject method has as argument a {String} containing error message.
     */
    load: function () {
        var me = this;
        // create deferred instance
        var deferred = new Ext.Deferred();

        // load preferences
        CMDBuildUI.model.users.Preference.load('preferences', {
            callback: function (record, operation, success) {
                if (success) {
                    me._preferences = record;
                    deferred.resolve(record);
                } else {
                    deferred.reject(operation);
                }
            }
        });

        // returns promise
        return deferred.promise;
    },

    /**
     * @return {CMDBuildUI.store.users.Preferences} Returns null if has not preferences.
     */
    getPreferences: function () {
        return this._preferences;
    },

    /**
     * Get user preference
     * @param {String} property 
     * @return {String|Number|Boolean|Object}
     */
    get: function (property) {
        return this._preferences.get(property);
    },

    /**
     * Get thousands separator character
     * @return {String}
     */
    getThousandsSeparator: function () {
        if (!this.formats.thousandsSeparator) {
            if (!Ext.isEmpty()) {
                this.formats.thousandsSeparator = this.get(CMDBuildUI.model.users.Preference.thousandsSeparator);
            } else {
                this.formats.thousandsSeparator = CMDBuildUI.util.helper.Configurations.get(CMDBuildUI.model.Configuration.ui.fields.thousandsSeparator);
            }
        }
        return this.formats.thousandsSeparator;
    },

    /**
     * Get decimals separator character
     * @return {String}
     */
    getDecimalsSeparator: function () {
        if (!this.formats.decimalsSeparator) {
            if (!Ext.isEmpty(this.get(CMDBuildUI.model.users.Preference.decimalsSeparator))) {
                this.formats.decimalsSeparator = this.get(CMDBuildUI.model.users.Preference.decimalsSeparator)
            } else {
                this.formats.decimalsSeparator = CMDBuildUI.util.helper.Configurations.get(CMDBuildUI.model.Configuration.ui.fields.decimalsSeparator);
            }
        }
        return this.formats.decimalsSeparator;
    },

    /**
     * Get dates format
     * @return {String}
     */
    getDateFormat: function () {
        if (!this.formats.date) {
            if (!Ext.isEmpty(this.get(CMDBuildUI.model.users.Preference.dateFormat))) {
                this.formats.date = this.get(CMDBuildUI.model.users.Preference.dateFormat)
            } else if (!Ext.isEmpty(CMDBuildUI.util.helper.Configurations.get(CMDBuildUI.model.Configuration.ui.fields.dateFormat))){
                this.formats.date = CMDBuildUI.util.helper.Configurations.get(CMDBuildUI.model.Configuration.ui.fields.dateFormat);
            } else {
                this.formats.date = CMDBuildUI.locales.Locales.common.dates.date;
            }
        }
        return this.formats.date;
    },

    /**
     * Get dates format
     * @return {String}
     */
    getTimeWithSecondsFormat: function () {
        if (!this.formats.timeWithSeconds) {
            if (!Ext.isEmpty(this.get(CMDBuildUI.model.users.Preference.timeFormat))) {
                this.formats.timeWithSeconds = this.get(CMDBuildUI.model.users.Preference.timeFormat);
            } else if (!Ext.isEmpty(CMDBuildUI.util.helper.Configurations.get(CMDBuildUI.model.Configuration.ui.fields.timeFormat))){
                this.formats.timeWithSeconds = CMDBuildUI.util.helper.Configurations.get(CMDBuildUI.model.Configuration.ui.fields.timeFormat);
            } else {
                this.formats.timeWithSeconds = CMDBuildUI.locales.Locales.common.dates.time;
            }
        }
        return this.formats.timeWithSeconds;
    },

    /**
     * Get dates format
     * @return {String}
     */
    getTimeWithoutSecondsFormat: function () {
        if (!this.formats.timeWithoutSeconds) {
            this.formats.timeWithoutSeconds = this.getTimeWithSecondsFormat().replace(":s", "");
        }
        return this.formats.timeWithoutSeconds;
    },

    /**
     * Get dates format
     * @return {String}
     */
    getTimestampWithSecondsFormat: function () {
        if (!this.formats.timestampWithSeconds) {
            this.formats.timestampWithSeconds = this.getDateFormat() + " " + this.getTimeWithSecondsFormat();
        }
        return this.formats.timestampWithSeconds;
    },

    /**
     * Get dates format
     * @return {String}
     */
    getTimestampWithoutSecondsFormat: function () {
        if (!this.formats.timestampWithoutSeconds) {
            this.formats.timestampWithoutSeconds = this.getDateFormat() + " " + this.getTimeWithoutSecondsFormat();
        }
        return this.formats.timestampWithoutSeconds;
    },

    /**
     * Return preferences for grid
     * @param {String} objectType 
     * @param {String} objectTypeName 
     */
    getGridPreferences: function (objectType, objectTypeName) {
        var gridsconfig = this.get(CMDBuildUI.model.users.Preference.gridsconfig);

        // convert from string to JSON
        if (Ext.isString(gridsconfig)) {
            gridsconfig = Ext.JSON.decode(gridsconfig);
            this.getPreferences().set(CMDBuildUI.model.users.Preference.gridsconfig, gridsconfig);
        }

        // crete hierarchy if not exists
        if (Ext.isEmpty(gridsconfig[objectType])) {
            gridsconfig[objectType] = {};
        }
        if (Ext.isEmpty(gridsconfig[objectType][objectTypeName])) {
            gridsconfig[objectType][objectTypeName] = {};
        }
        return gridsconfig[objectType][objectTypeName];
    },

    /**
     * Return preferences for grid
     * @param {String} objectType 
     * @param {String} objectTypeName
     * @param {Object} config
     * 
     * @return {Ext.promise.Promise}
     */
    updateGridPreferences: function (objectType, objectTypeName, config) {
        var deferred = new Ext.Deferred();
        // update grid configs
        var gridconf = this.getGridPreferences(objectType, objectTypeName);
        for (var key in config) {
            if (config[key] === undefined) {
                delete gridconf[key];
            } else {
                gridconf[key] = config[key];
            }
        }

        // update preferences
        var gridsconfig = this.get(CMDBuildUI.model.users.Preference.gridsconfig);
        gridsconfig[objectType][objectTypeName] = gridconf;

        // save configs
        var jsondata = {};
        jsondata[CMDBuildUI.model.users.Preference.gridsconfig] = Ext.JSON.encode(gridsconfig);

        return this.updatePreferences(jsondata);
    },

    /**
     * Save user preferences.
     * @param {Object} params 
     * @return {Ext.promise.Promise}
     */
    updatePreferences: function (params) {
        var deferred = new Ext.Deferred();
        Ext.Ajax.request({
            url: CMDBuildUI.util.Config.baseUrl + CMDBuildUI.util.api.Common.getPreferencesUrl(),
            method: "POST",
            jsonData: params,
            success: function () {
                deferred.resolve();
            },
            failure: function () {
                deferred.reject();
            }
        });
        // returns promise
        return deferred.promise;
    },

    privates: {
        /**
         * @property {CMDBuildUI.model.users.Preference} _preferences
         * Object containing user preferences
         */
        _preferences: null,

        /**
         * An object containing all formats.
         */
        formats: {
            thousandsSeparator: null,
            decimalsSeparator: null,
            date: null,
            timeWithSeconds: null,
            timeWithoutSeconds: null,
            timestampWithSeconds: null,
            timestampWithoutSeconds: null
        }
    }
});