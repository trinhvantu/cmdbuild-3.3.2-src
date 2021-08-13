Ext.define('CMDBuildUI.model.users.Grant', {
    extend: 'CMDBuildUI.model.base.Base',

    statics: {
        grantType: {
            read: 'read',
            write: 'write',
            none: 'none'
        },
        grantTypeWorkflow: {
            default: 'wf_default',
            plus: 'wf_plus',
            basic: 'wf_basic'
        }
    },
    fields: [{
        name: 'role',
        type: 'number',
        critical: true
    }, {
        name: 'mode',
        type: 'string',
        critical: true,
        defaultValue: 'none'
    }, {
        name: '_on_filter_mismatch',
        type: 'string',
        critical: true
    }, {
        name: '_on_filter_mismatch_calculated',
        calculate: function (data) {
            switch (data._on_filter_mismatch) {
                case 'read':
                    return true;
                default:
                    return false;
            }
        }
    }, {
        name: 'modeTypeNone',
        type: 'boolean',
        critical: true,
        convert: function (value, rec) {
            return (rec.get('mode') === CMDBuildUI.model.users.Grant.grantType.none /*'-'*/ ) ? true : false;
        },
        depends: ['mode']
    }, {
        name: 'modeTypeAllow',
        type: 'boolean',
        critical: true,
        convert: function (value, rec) {
            return (rec.get('mode') === CMDBuildUI.model.users.Grant.grantType.read /*'r'*/ ) ? true : false;
        },
        depends: ['mode']
    }, {
        name: 'modeTypeRead',
        type: 'boolean',
        critical: true,
        convert: function (value, rec) {
            return (rec.get('mode') === CMDBuildUI.model.users.Grant.grantType.read /*'r'*/ ) ? true : false;
        },
        depends: ['mode']
    }, {
        name: 'modeTypeWrite',
        type: 'boolean',
        critical: true,
        convert: function (value, rec) {
            return (rec.get('mode') === CMDBuildUI.model.users.Grant.grantType.write /*'w'*/ ) ? true : false;
        },
        depends: ['mode']
    }, {
        name: 'modeTypeWFBasic',
        type: 'boolean',
        critical: true,
        convert: function (value, rec) {
            return (rec.get('mode') === CMDBuildUI.model.users.Grant.grantTypeWorkflow.basic /*'new alue for workflow'*/ ) ? true : false;
        },
        depends: ['mode']
    }, {
        name: 'modeTypeWFPlus',
        type: 'boolean',
        critical: true,
        convert: function (value, rec) {
            return (rec.get('mode') === CMDBuildUI.model.users.Grant.grantTypeWorkflow.plus /*'w'*/ ) ? true : false;
        },
        depends: ['mode']
    }, {
        name: 'modeTypeWFDefault',
        type: 'boolean',
        critical: true,
        convert: function (value, rec) {
            return (rec.get('mode') === CMDBuildUI.model.users.Grant.grantTypeWorkflow.default /*'r'*/ ) ? true : false;
        },
        depends: ['mode']
    }, {
        name: 'objectType',
        type: 'string',
        critical: true
    }, {
        name: 'objectTypeName',
        type: 'string',
        critical: true
    }, {
        name: '_object_description',
        type: 'string',
        critical: false
    }, {
        name: 'filter',
        type: 'string',
        critical: true,
        defaultValue: ''
    }, {
        name: 'attributePrivileges',
        type: 'auto',
        critical: true,
        defaultValue: {}
    }, {
        name: '_can_clone',
        type: 'boolean',
        critical: true,
        defaultValue: false
    }, {
        name: '_can_create',
        type: 'boolean',
        critical: true,
        defaultValue: false
    }, {
        name: '_can_delete',
        type: 'boolean',
        critical: true,
        defaultValue: false
    }, {
        name: '_can_update',
        type: 'boolean',
        critical: true,
        defaultValue: false
    }, {
        name: '_relationgraph_access',
        type: 'boolean',
        critical: true,
        defaultValue: false
    }, {
        name: '_can_print',
        type: 'boolean',
        critical: true,
        defaultValue: false
    }, {
        name: '_can_fc_attachment',
        type: 'auto',
        critical: true,
        defaultValue: null
    }, {
        name: '_can_bulk_update',
        type: 'auto',
        critical: true,
        defaultValue: null
    }, {
        name: '_can_bulk_delete',
        type: 'auto',
        critical: true,
        defaultValue: null
    }, {
        name: '_can_bulk_abort',
        type: 'auto',
        critical: true,
        defaultValue: null
    }, {
        name: 'modeTypeNoneOther',
        type: 'boolean',
        critical: true,
        convert: function (value, rec) {
            return (rec.get('mode') === CMDBuildUI.model.users.Grant.grantType.none /*'-'*/ ) ? true : false;
        },
        depends: ['mode']
    }, {
        name: 'modeTypeWriteAllow',
        type: 'boolean'
    }, {
        name: 'modeTypeWriteOther',
        type: 'boolean',
        critical: true,
        convert: function (value, rec) {
            return (rec.get('mode') === CMDBuildUI.model.users.Grant.grantType.write /*'w'*/ ) ? true : false;
        },
        depends: ['mode']
    }, {
        name: 'modeTypeReadOther',
        type: 'boolean',
        critical: true,
        convert: function (value, rec) {
            return (rec.get('mode') === CMDBuildUI.model.users.Grant.grantType.read /*'r'*/ ) ? true : false;
        },
        depends: ['mode']
    }, {
        name: '_attachment_access', // true/false/default
        type: 'string',
        critical: true
    }, {
        name: '_detail_access', // true/false/default
        type: 'string',
        critical: true
    }, {
        name: '_email_access', // true/false/default
        type: 'string',
        critical: true
    }, {
        name: '_note_access', // true/false/default
        type: 'string',
        critical: true
    }, {
        name: '_relation_access', // true/false/default
        type: 'string',
        critical: true
    }, {
        name: '_history_access', // true/false/default
        type: 'string',
        critical: true
    }, {
        name: '_schedule_access', // true/false/default
        type: 'string',
        critical: true
    }],

    convertOnSet: true,

    changeMode: function (mode) {
        this.set('mode', mode);
    },

    proxy: {
        url: '/roles/',
        type: 'baseproxy',
        extraParams: {
            includeObjectDescription: true,
            includeRecordsWithoutGrant: true,
            ext: true
        },
        writer: {
            type: 'json',
            writeAllFields: true
        }
    }
});