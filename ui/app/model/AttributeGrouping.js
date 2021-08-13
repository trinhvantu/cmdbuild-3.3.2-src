Ext.define('CMDBuildUI.model.AttributeGrouping', {
    extend: 'Ext.data.Model',
    statics: {
        nogroup: '_nogroup',
        displayMode: {
            open: 'open',
            closed: 'closed'
        }
    },
    fields: [{
        name: 'name',
        type: 'string',
        defaultValue: ''
    },{
        name: 'description',
        type: 'string',
        defaultValue: ''
    }, {
        name: 'index',
        type: 'number',
        defaultValue: null
    }, {
        name: 'defaultDisplayMode',
        type: 'string',
        defaultValue: 'open'
    }],
    proxy: {
        type: 'memory'
    }
});
