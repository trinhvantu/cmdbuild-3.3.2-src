Ext.define('CMDBuildUI.model.users.Group', {
    extend: 'CMDBuildUI.model.base.Base',

    requires: [
        'Ext.data.validator.Presence'
    ],

    statics: {
        mygroup: '@MY_GROUP',
        getTypes: function () {
            return [{
                label: CMDBuildUI.locales.Locales.administration.groupandpermissions.strings.normal,
                value: 'default'
            }, {
                label: CMDBuildUI.locales.Locales.administration.groupandpermissions.strings.readonlyadmin,
                value: 'admin_readonly'
            }, {
                label: CMDBuildUI.locales.Locales.administration.groupandpermissions.strings.limitedadmin,
                value: 'admin_limited'
            }, {
                label: CMDBuildUI.locales.Locales.administration.groupandpermissions.strings.usersadmin,
                value: 'admin_users'
            }, {
                label: CMDBuildUI.locales.Locales.administration.groupandpermissions.strings.admin,
                value: 'admin'
            }];
        }
    },
    fields: [{
        name: '_id',
        type: 'number',
        persist: false
    }, {
        name: 'description',
        description: CMDBuildUI.locales.Locales.administration.common.labels.description,
        localized: {
            description: 'CMDBuildUI.locales.Locales.administration.common.labels.description'
        },
        type: 'string',
        critical: true,
        validators: ['presence'],
        showInGrid: true
    }, {
        name: 'name',
        description: CMDBuildUI.locales.Locales.administration.common.labels.name,
        localized: {
            description: 'CMDBuildUI.locales.Locales.administration.common.labels.name'
        },
        type: 'string',
        critical: true,
        validators: ['presence'],
        showInGrid: true
    }, {
        name: 'email',
        description: CMDBuildUI.locales.Locales.administration.emails.email,
        localized: {
            description: 'CMDBuildUI.locales.Locales.administration.emails.email'
        },
        type: 'string',
        critical: true,
        showInGrid: true
    }, {
        name: 'type',
        type: 'string',
        critical: true,
        defaultValue: 'default'
    }, {
        name: 'processWidgetAlwaysEnabled',
        type: 'boolean',
        critical: true
    }, {
        name: 'disabledCardTabs',
        type: 'auto',
        critical: true
    }, {
        name: 'disabledModules',
        type: 'auto',
        critical: true
    }, {
        name: 'disabledProcessTabs',
        type: 'auto',
        critical: true
    }, {
        name: 'active',
        type: 'boolean',
        critical: true,
        defaultValue: true
    }, {
        name: 'startingClass',
        type: 'string',
        critical: true
    }, {
        // used only for exclude role from clone permissions button if value == true
        name: '_rp_data_all_write',
        type: 'boolean'
    }, {
        name: '_rp_class_access',
        type: 'boolean',
        critical: true,
        defaultValue: false
    }, {
        name: '_rp_process_access',
        type: 'boolean',
        critical: true,
        defaultValue: false
    }, {
        name: '_rp_dataview_access',
        type: 'boolean',
        critical: true,
        defaultValue: false
    }, {
        name: '_rp_dashboard_access',
        type: 'boolean',
        critical: true,
        defaultValue: false
    }, {
        name: '_rp_report_access',
        type: 'boolean',
        defaultValue: false,
        critical: true
    }, {
        name: '_rp_custompages_access',
        type: 'boolean',
        critical: true,
        defaultValue: false
    }, {
        name: '_rp_card_tab_detail_access',
        type: 'boolean',
        critical: true,
        defaultValue: true
    }, {
        name: '_rp_card_tab_note_access',
        type: 'boolean',
        critical: true,
        defaultValue: true
    }, {
        name: '_rp_card_tab_relation_access',
        type: 'boolean',
        critical: true,
        defaultValue: true
    }, {
        name: '_rp_card_tab_history_access',
        type: 'boolean',
        critical: true,
        defaultValue: true
    }, {
        name: '_rp_card_tab_email_access',
        type: 'boolean',
        critical: true,
        defaultValue: true
    }, {
        name: '_rp_card_tab_attachment_access',
        type: 'boolean',
        critical: true,
        defaultValue: true
    }, {
        name: '_rp_card_tab_schedule_access',
        type: 'boolean',
        critical: true,
        defaultValue: true
    }, {
        name: '_rp_flow_tab_detail_access',
        type: 'boolean',
        critical: true,
        defaultValue: true
    }, {
        name: '_rp_flow_tab_note_access',
        type: 'boolean',
        critical: true,
        defaultValue: true
    }, {
        name: '_rp_flow_tab_relation_access',
        type: 'boolean',
        critical: true,
        defaultValue: true
    }, {
        name: '_rp_flow_tab_history_access',
        type: 'boolean',
        critical: true,
        defaultValue: true
    }, {
        name: '_rp_flow_tab_email_access',
        type: 'boolean',
        critical: true,
        defaultValue: true
    }, {
        name: '_rp_flow_tab_attachment_access',
        type: 'boolean',
        critical: true,
        defaultValue: true
    }, {
        name: '_rp_bulkupdate_access',
        type: 'boolean',
        critical: true,
        defaultValue: true
    }, {
        name: '_rp_calendar_event_create',
        type: 'boolean',
        critical: true,
        defaultValue: true
    }, {
        name: '_rp_calendar_access',
        type: 'boolean',
        critical: true,
        defaultValue: true
    }, {
        name: '_rp_gis_access',
        type: 'boolean',
        critical: true,
        defaultValue: true
    }, {
        name: '_rp_bim_access',
        type: 'boolean',
        critical: true,
        defaultValue: true
    }
    // , {
    //     name: '_rp_relgraph_access',
    //     type: 'boolean',
    //     critical: true,
    //     defaultValue: true
    // }
],

    proxy: {
        url: '/roles/',
        type: 'baseproxy',
        extraParams: {
            detailed: true
        }
    }
});