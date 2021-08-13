Ext.define('CMDBuildUI.util.api.DMS', {
    singleton: true,

    /**
     * Get lookup values for give type
     * @param {String} type
     */
    getCategoryValues: function(type) {
        return Ext.String.format(
            "/dms/categories/{0}/values/",
            CMDBuildUI.util.Utilities.stringToHex(type)
        );
    },
    getCategoryTypes: function(){
        return "/dms/categories/";
    },

    /**
     * 
     * @param {String} modelName 
     */
    getModelAttributes: function(modelName) {
        return Ext.String.format(
            "/dms/models/{0}/attributes",
            modelName
        );
    }

});