Ext.define('CMDBuildUI.util.helper.Configurations', {
    singleton: true,

    /**
     * @cfg {CMDBuildUI.model.Configuration} config
     * @private
     */
    _config: null,

    /**
     * @argument {Boolean} force
     * @return {Ext.promise.Promise} 
     */
    loadPublicConfs: function (force) {
        var deferred = new Ext.Deferred();

        if (!this.hasConfig() || force) {
            var me = this;
            Ext.Ajax.request({
                url: CMDBuildUI.util.Config.baseUrl + CMDBuildUI.util.api.Common.getPublicConfigurationUrl(),
                callback: function (opts, success, response) {
                    if (response.responseText) {
                        var data = Ext.JSON.decode(response.responseText);
                        if (!data.data[CMDBuildUI.model.Configuration.common.companylogo]) {
                            data.data[CMDBuildUI.model.Configuration.common.companylogo] = null;
                        }
                        me.updateConfig(data.data);
                    }
                    CMDBuildUI.util.helper.SessionHelper.updateInstanceName(me.get(CMDBuildUI.model.Configuration.common.instancename));
                    CMDBuildUI.util.helper.SessionHelper.updateCompanyLogoId(me.get(CMDBuildUI.model.Configuration.common.companylogo));
                    CMDBuildUI.util.Ajax.updateAjaxTimeout();
                    deferred.resolve();
                }
            });
        } else {
            deferred.resolve();
        }
        return deferred.promise;
    },

    /**
     * @return {Ext.promise.Promise} 
     */
    loadSystemConfs: function () {
        var deferred = new Ext.Deferred();

        var me = this;
        Ext.Ajax.request({
            url: CMDBuildUI.util.Config.baseUrl + CMDBuildUI.util.api.Common.getSystemConfigurationUrl(),
            callback: function (opts, success, response) {
                if (response.responseText) {
                    var data = Ext.JSON.decode(response.responseText);
                    me.updateConfig(data.data);
                    CMDBuildUI.util.helper.SessionHelper.updateCanChangePasswordVisibility(!me.get(CMDBuildUI.model.Configuration.ui.systempasswordchangeenabled));

                    // update enabled features
                    me.updateEnabledFeatures();
                }

                if (me.get(CMDBuildUI.model.Configuration.common.keepalive)) {
                    me.initKeepAliveTask();
                }
                me.setSystemConfsIntoViewPort();
                deferred.resolve();
            }
        });

        return deferred.promise;
    },

    /**
     * Return configuration
     * 
     * @param {String} configuration
     * @return {Object}
     */
    get: function (configuration) {
        return this.getConfigObject().get(configuration);
    },

    /**
     * @return {Object} 
     * An object with following keys:
     * dms, scheduler
     */
    getEnabledFeatures: function () {
        return this._enabledFeatures;
    },


    privates: {
        /**
         * @property {Object} _enabledFeatures
         */
        _enabledFeatures: {},

        /**
         * @return {Boolean}
         */
        hasConfig: function () {
            return this._config !== null;
        },

        /**
         * @return {CMDBuildUI.model.Configuration}
         */
        getConfigObject: function () {
            if (!this.hasConfig()) {
                this._config = Ext.create("CMDBuildUI.model.Configuration");
            }
            return this._config;
        },

        /**
         * @param {Object} newdata
         */
        updateConfig: function (newdata) {
            if (!Ext.Object.isEmpty(newdata)) {
                var conf = this.getConfigObject();
                for (var key in newdata) {
                    conf.set(key, newdata[key]);
                }
            }
        },

        /**
         * 
         */
        initKeepAliveTask: function () {
            var me = this;
            Ext.Ajax.request({
                url: CMDBuildUI.util.Config.baseUrl + CMDBuildUI.util.api.Common.getKeepAliveUrl(),
                method: "POST"
            }).then(function (response) {
                if (response && response.responseText) {
                    var data = Ext.JSON.decode(response.responseText);
                    if (data.data.recommendedKeepaliveIntervalSeconds) {
                        setTimeout(function () {
                            me.initKeepAliveTask();
                        }, 1000 * data.data.recommendedKeepaliveIntervalSeconds);
                    }
                }
            });
        },

        /**
         * Update enabled features
         */
        updateEnabledFeatures: function () {
            var privileges = CMDBuildUI.util.helper.SessionHelper.getCurrentSession().get("rolePrivileges");
            this._enabledFeatures = {
                // dms - check config
                dms: this.get(CMDBuildUI.model.Configuration.dms.enabled),
                // scheduler - check config and privileges
                scheduler: this.get(CMDBuildUI.model.Configuration.scheduler.enabled) &&
                    (privileges.calendar_access || privileges.calendar_event_create)
            }
        },

        /**
         * Get Viewport ViewModel
         * 
         * @return {CMDBuildUI.view.main.MainModel}
         */
        getViewportVM: function () {
            var viewports = Ext.ComponentQuery.query('viewport');
            if (viewports.length) {
                return viewports[0].getViewModel();
            }
        },

        /**
         * 
         */
        setSystemConfsIntoViewPort: function () {
            this.getViewportVM().set("systemConfsLoaded", true);
        }
    }
});