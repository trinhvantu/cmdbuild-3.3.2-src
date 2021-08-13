Ext.define('CMDBuildUI.util.api.Common', {
    singleton: true,

    /**
     * Get boot status url
     * @return {String}
     */
    getBootStatusUrl: function () {
        return '/boot/status';
    },

    /**
     * Get boot status url
     * @return {String}
     */
    getCheckDBConfigUrl: function () {
        return '/boot/database/check';
    },

    /**
     * Get boot status url
     * @return {String}
     */
    getSetDBConfigUrl: function () {
        return '/boot/database/configure';
    },

    /**
     * Get boot status url
     * @return {String}
     */
    getApplyPatchesUrl: function () {
        return '/boot/patches/apply';
    },

    /**
     * Get configuration url
     * @return {String}
     */
    getPublicConfigurationUrl: function () {
        return '/configuration/public';
    },

    /**
     * Get configuration url
     * @return {String}
     */
    getSystemConfigurationUrl: function () {
        return '/configuration/system';
    },

    /**
     * Get current session url
     * @return {String}
     */
    getCurrentSessionUrl: function () {
        return '/sessions/current';
    },

    /**
     * Get session keep alive url
     * @return {String}
     */
    getKeepAliveUrl: function () {
        return '/sessions/current/keepalive';
    },

    /**
     * Get preferences url
     * @return {String}
     */
    getPreferencesUrl: function () {
        return '/sessions/current/preferences';
    },

    /**
     * Get filters url
     * 
     * @param {String} type 
     * @param {String} typename 
     */
    getFiltersUrl: function (type, typename) {
        switch (type) {
            case CMDBuildUI.util.helper.ModelHelper.objecttypes.calendar:
                return Ext.String.format("{0}/classes/_CalendarEvent/filters", CMDBuildUI.util.Config.baseUrl);
                break;
            default:
                var item = CMDBuildUI.util.helper.ModelHelper.getObjectFromName(typename, type);
                return Ext.String.format("{0}{1}/filters", item.getProxy().getUrl(), item.getId());
                break;

        }
    }
});