Ext.define('CMDBuildUI.model.views.JoinView', {
    extend: 'CMDBuildUI.model.views.View',

    fields: [{
        name: 'filter',
        type: 'string',
        persist: true,
        critical: true
    }, {
        name: 'masterClass',
        type: 'string',
        persist: true,
        critical: true
    }, {
        name: 'masterClassAlias',
        type: 'string',
        persist: true,
        critical: true
    }, {
        name: 'active',
        type: 'boolean',
        persist: true,
        critical: true,
        defaultValue: true
    }, {
        name: 'join',
        type: 'auto',
        persist: true,
        critical: true,
        defaultValue: []
    }, {
        name: 'attributes',
        type: 'auto',
        persist: true,
        critical: true,
        defaultValue: []
    }, {
        name: 'attributeGroups',
        type: 'auto',
        persist: true,
        critical: true,
        defaultValue: []
    }, {
        name: 'sorter',
        type: 'auto',
        persist: true,
        critical: true,
        defaultValue: {}
    }, {
        name: 'formStructure',
        type: 'auto',
        persist: true,
        critical: true
    }],

    hasMany: [{
        model: 'CMDBuildUI.model.views.JoinViewJoin',
        name: 'join',
        getterName: 'joinWith'
    }, {
        model: 'CMDBuildUI.model.views.JoinViewAttribute',
        name: 'attributes'
    }, {
        model: 'CMDBuildUI.model.AttributeGrouping',
        name: 'attributeGroups'
    }, {
        model: 'CMDBuildUI.model.AttributeOrder',
        name: 'sorter'
    }, {
        model: 'CMDBuildUI.model.Attribute',
        name: 'viewAttributes'
    }],

    attributesStoreName: 'viewAttributes',
    /**
     * @return {String} domains url 
     */
    getAttributesUrl: function () {
        return CMDBuildUI.util.api.Views.getAttributesUrl(this.get("name"));
    }

});