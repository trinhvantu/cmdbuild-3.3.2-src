Ext.define('CMDBuildUI.util.api.Views', {
    singleton: true,

    /**
     * Get view attributes
     * 
     * @param {String} viewName
     * @return {String} The url for api resourcess
     */
    getAttributesUrl: function (viewName) {
        return Ext.String.format(
            "/views/{0}/attributes",
            viewName
        );
    },

    /**
     * 
     * @param {String} viewName
     * @param {String} extension
     */
    getPrintItemsUrl: function (viewName, extension) {
        return Ext.String.format(
            "{0}/views/{1}/print/{1}.{2}",
            CMDBuildUI.util.Config.baseUrl,
            viewName,
            extension
        );
    }
});