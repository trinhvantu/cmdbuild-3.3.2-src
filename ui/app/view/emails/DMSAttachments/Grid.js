Ext.define('CMDBuildUI.view.emails.DMSAttachments.Grid', {
    extend: 'Ext.grid.Panel',

    requires: [
        'CMDBuildUI.view.emails.DMSAttachments.GridController',
        'CMDBuildUI.view.emails.DMSAttachments.GridModel'
    ],

    alias: 'widget.attachments-grid',
    controller: 'attachments-grid',
    viewModel: {
        type: 'attachments-grid'
    },

    ui: 'cmdbuildgrouping',

    forceFit: true,
    loadMask: true,

    columns: [{
        text: CMDBuildUI.locales.Locales.attachments.filename,
        dataIndex: 'name',
        align: 'left',
        hidden: false,
        localized: {
            text: 'CMDBuildUI.locales.Locales.attachments.filename'
        }
    }, {
        text: CMDBuildUI.locales.Locales.attachments.description,
        dataIndex: 'description',
        align: 'left',
        hidden: false,
        localized: {
            text: 'CMDBuildUI.locales.Locales.attachments.description'
        }
    }],
    scrollable: true,
    selModel: {
        type: 'checkboxmodel'
    },

    features: [{
        ftype: 'grouping',
        groupHeaderTpl: '{name}',
        depthToIndent: 50
    }],

    bind: {
        store: '{attachments}'
    }
});