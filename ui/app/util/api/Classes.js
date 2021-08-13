Ext.define('CMDBuildUI.util.api.Classes', {
    singleton: true,

    /**
     * Get class attributes
     * 
     * @param {String} className
     * @return {String} The url for api resourcess
     */
    getAttributes: function (className) {
        return Ext.String.format(
            "/classes/{0}/attributes",
            className
        );
    },
    /**
     * Get class geo attributes
     * 
     * @param {String} className
     * @return {String} The url for api resources
     */
    getGeoAttributes: function (className) {
        return Ext.String.format(
            "/classes/{0}/geoattributes",
            className
        );
    },

    getGeoValuesUrl: function (className, cardId) {
        return Ext.String.format(
            "{0}/classes/{1}/cards/{2}/geovalues",
            CMDBuildUI.util.Config.baseUrl,
            className,
            cardId
        );
    },

    getGeoLayersUrl: function (className, cardId) {
        return Ext.String.format(
            "{0}/classes/{1}/cards/{2}/geolayers",
            CMDBuildUI.util.Config.baseUrl,
            className,
            cardId
        );
    },

    /**
     * This function returns the url for the geolayer service
     * @param className the class name
     */
    getExternalGeoAttributes: function (className) {
        return Ext.String.format('/classes/{0}/cards/_ANY/geolayers', className);
    },

    /**
     * Get cards url by className
     * @param {String} className
     * @return {String}
     */
    getCardsUrl: function (className) {
        return Ext.String.format(
            "/classes/{0}/cards",
            className
        );
    },

    /**
     * 
     * @param {String} className 
     * @param {Number} cardId 
     */
    getCardBimUrl: function (className, cardId) {
        return Ext.String.format(
            '{0}/classes/{1}/cards/{2}/bimvalue?if_exists=true',
            CMDBuildUI.util.Config.baseUrl,
            className,
            cardId
        );
    },

    /**
     * 
     * @param {String} className 
     * @param {Number} cardId 
     */
    getCardRelations: function (className, cardId) {
        return Ext.String.format("/classes/{0}/cards/{1}/relations", className, cardId);
    },

    /**
     * 
     * @param {String} className
     * @param {String} extension
     */
    getPrintCardsUrl: function (className, extension) {
        return Ext.String.format(
            "{0}/classes/{1}/print/{1}.{2}",
            CMDBuildUI.util.Config.baseUrl,
            className,
            extension
        );
    },

    /**
     * 
     * @param {String} className
     * @param {Number} cardId 
     * @param {String} extension
     */
    getPrintCardUrl: function (className, cardId, extension) {
        return Ext.String.format(
            "{0}/classes/{1}/cards/{2}/print/{1}-{2}.{3}",
            CMDBuildUI.util.Config.baseUrl,
            className,
            cardId,
            extension
        );
    },

    /**
     * 
     * @param {String} className
     */
    getImportExportTemplatesUrl: function (className) {
        return Ext.String.format(
            "{0}/etl/templates/by-class/{1}",
            CMDBuildUI.util.Config.baseUrl,
            className
        );
    },

    /**
     * 
     * @param {String} className
     */
    getImportExportGatesUrl: function (className) {
        return Ext.String.format(
            "{0}/etl/gates/by-class/{1}",
            CMDBuildUI.util.Config.baseUrl,
            className
        );
    },

    /**
     * 
     * @param {String} className 
     */
    getThematismsUrl: function (className) {
        return Ext.String.format(
            "{0}/classes/{1}/geostylerules",
            CMDBuildUI.util.Config.baseUrl,
            className
        )
    },

    getThematismResultUrl: function (className, thematismId) {
        if (thematismId) {
            return Ext.String.format("{0}/classes/{1}/geostylerules/{2}/result",
                CMDBuildUI.util.Config.baseUrl,
                className,
                thematismId
            );
        } else {
            return Ext.String.format("{0}/classes/{1}/geostylerules/tryRules",
                CMDBuildUI.util.Config.baseUrl,
                className
            );
        }
    },

    /* Get class attributes
    * 
    * @param {String} className
    * @return {String} The url for api resourcess
    */
    getDomains: function (className) {
        return Ext.String.format(
            "/classes/{0}/domains",
            className
        );
    },

    /** Get card attachments. can specify attachment 
     * 
     * @param {*} className 
     * @param {*} cardId 
     * @param {*} attachmentId 
     */
    getAttachments: function (className, cardId) {
        return Ext.String.format(
            '/classes/{0}/cards/{1}/attachments',
            className,
            cardId
        );
    }

});