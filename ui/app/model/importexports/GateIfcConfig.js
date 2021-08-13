Ext.define('CMDBuildUI.model.importexports.GateIfcConfig', {
    extend: 'CMDBuildUI.model.importexports.GateConfig',

    statics: {

    },
    fields: [{
        name: 'tag',
        type: 'string',
        persist: true,
        critical: true,
        calculate: function () {
            return 'ifc';
        }
    }, {
        name: 'bimserver_project_master_card_mode',
        type: 'string',
        persist: true,
        critical: true
    }, {
        name: 'bimserver_project_master_card_target_class',
        type: 'string',
        persist: true,
        critical: true,
        validators: ['presence']
    }, {
        name: 'bimserver_project_master_card_key_source',
        type: 'string',
        persist: true,
        critical: true
    },  {
        name: 'bimserver_project_master_card_key_attr',
        type: 'string',
        persist: true,
        critical: true
    },  {
        name: 'bimserver_project_has_parent',
        type: 'boolean',
        persist: true,
        critical: true
    }]
});