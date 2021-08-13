Ext.define('CMDBuildUI.util.api.Functions', {
    singleton: true,

    /**
     * Get function by name
     * @param {String} functionName
     * @return {String}
     */
    getFunctionByNameUrl: function(functionName) {
        return Ext.String.format(
            "/functions/{0}",
            functionName
        );
    },

    /**
     * Get function outputs url by function name
     * @param {String} functionName
     * @return {String}
     */
    getOutputsUrlByFunctionName: function(functionName) {
        return Ext.String.format(
            "/functions/{0}/outputs",
            functionName
        );
    },

    /**
     * @deprecated
     */
    getFunctionOutputsByNameUrl: function(functionName) {
        CMDBuildUI.util.Logger.log("getFunctionOutputsByNameUrl is deprecated. Please use getOutputsUrlByFunctionName", CMDBuildUI.util.Logger.levels.warn);
        return this.getOutputsUrlByFunctionName(functionName);
    },

    /**
     * Get function parameters url by function name
     * @param {String} functionName
     * @return {String}
     */
    getParametersUrlByFunctionName: function(functionName) {
        return Ext.String.format(
            "/functions/{0}/parameters",
            functionName
        );
    },

    /**
     * Get function attributes url by function name
     * @param {String} functionName
     * @return {String}
     */
    getAttributesUrlByFunctionName: function(functionName) {
        return Ext.String.format(
            "/functions/{0}/attributes",
            functionName
        );
    }

});