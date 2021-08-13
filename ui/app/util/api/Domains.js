Ext.define('CMDBuildUI.util.api.Domains', {
    singleton: true,

    /**
     * Get Foreign Keys domains
     * 
     * @return {String} The url for api resourcess
     */
    getAllDomainsUrl: function () {
        return Ext.String.format(
            '/domains'
        );
    },

    /**
     * Get domain attributes
     * 
     * @param {String} domainName
     * @return {String} The url for api resourcess
     */
    getAttributes: function (domainName) {
        return Ext.String.format(
            '/domains/{0}/attributes',
            domainName
        );
    },

    /**
     * Get Foreign Keys domains
     * 
     * @return {String} The url for api resourcess
     */
    getFkDomainsUrl: function () {
        return Ext.String.format(
            '/fkdomains'
        );
    }
});