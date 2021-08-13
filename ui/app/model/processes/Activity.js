Ext.define('CMDBuildUI.model.processes.Activity', {
    extend: 'CMDBuildUI.model.base.Base',

    fields: [{
        name: 'description',
        type: 'string'
    }, {
        name: 'writable',
        type: 'boolean'
    }, {
        name: 'instructions',
        type: 'string'
    }, {
        name: 'attributes',
        type: 'auto'
    }, {
        name: 'formStructure',
        type: 'auto',
        critical: true
    }],

    hasMany: [{
        model: 'CMDBuildUI.model.processes.ActivityAttribute',
        name: 'attributes',
        associationKey: 'attributes'
    }, {
        model: 'CMDBuildUI.model.WidgetDefinition',
        name: 'widgets',
        associationKey: 'widgets'
    }],

    proxy: {
        type: 'baseproxy'
    }
});
