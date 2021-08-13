Ext.define('CMDBuildUI.view.administration.content.domains.tabitems.attributes.AttributesModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.administration-content-domains-tabitems-attributes-attributes',
    data: {
        selected: {},
        isOtherPropertiesHidden: true
    },
    stores: {    
        allAttributes: {
            source: '{theDomain.attributes}',
            filters: [
                function (item) {
                    return item.canAdminShow();
                }
            ]      
        }
    }
});