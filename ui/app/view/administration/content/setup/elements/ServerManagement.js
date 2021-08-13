Ext.define('CMDBuildUI.view.administration.content.setup.elements.ServerManagement', {
    extend: 'Ext.panel.Panel',

    requires: [
        'CMDBuildUI.view.administration.content.setup.elements.ServerManagementController',
        'CMDBuildUI.view.administration.content.setup.elements.ServerManagementModel'
    ],

    alias: 'widget.administration-content-setup-elements-servermanagement',
    controller: 'administration-content-setup-elements-servermanagement',
    viewModel: {
        type: 'administration-content-setup-elements-servermanagement'
    },

    margin: 10,
    items: [{
        xtype: "fieldset",
        ui: 'administration-formpagination',
        title: CMDBuildUI.locales.Locales.administration.systemconfig.actions,
        localized: {
            title: "CMDBuildUI.locales.Locales.administration.systemconfig.actions"
        },
        scrollable: true,
        forceFit: true,
        defaults: {
            xtype: 'button',
            margin: 'auto 15 auto auto',
            ui: 'administration-action-small'
        },
        items: [{
            text: CMDBuildUI.locales.Locales.administration.systemconfig.dropcache,
            localized: {
                text: 'CMDBuildUI.locales.Locales.administration.systemconfig.dropcache'
            },
            iconCls: 'x-fa fa-trash',
            handler: 'onDropCacheBtnClick'
        }, {
            text: CMDBuildUI.locales.Locales.administration.systemconfig.unlockallcards,
            localized: {
                text: 'CMDBuildUI.locales.Locales.administration.systemconfig.unlockallcards'
            },
            iconCls: 'x-fa fa-unlock',
            handler: 'onUnlockAllCardsBtnClick'
        }]
    }, {
        xtype: "fieldset",
        ui: 'administration-formpagination',
        title: CMDBuildUI.locales.Locales.administration.systemconfig.logs,
        localized: {
            title: "CMDBuildUI.locales.Locales.administration.systemconfig.logs"
        },
        scrollable: true,
        forceFit: true,
        defaults: {
            xtype: 'button',
            margin: 'auto 15 auto auto',
            ui: 'administration-action-small'
        },
        items: [{
            text: CMDBuildUI.locales.Locales.administration.systemconfig.editlogconfig,
            localized: {
                text: 'CMDBuildUI.locales.Locales.administration.systemconfig.editlogconfig'
            },
            iconCls: 'x-fa fa-pencil',
            handler: 'onEditLogConfigurationBtnClick'
        }, {
            text: CMDBuildUI.locales.Locales.administration.systemconfig.viewlogs,
            localized: {
                text: 'CMDBuildUI.locales.Locales.administration.systemconfig.viewlogs'
            },
            iconCls: 'x-fa fa-th-list',
            handler: 'onViewLogsBtnClick'
        }, {
            text: CMDBuildUI.locales.Locales.administration.systemconfig.downloadlogs,
            localized: {
                text: 'CMDBuildUI.locales.Locales.administration.systemconfig.downloadlogs'
            },
            iconCls: 'x-fa fa-download',
            handler: 'onDownloadLogsBtnClick'
        }]
    }, {
        // services grid
        xtype: "fieldset",
        ui: 'administration-formpagination',
        title: CMDBuildUI.locales.Locales.administration.systemconfig.services,
        localized: {
            title: "CMDBuildUI.locales.Locales.administration.systemconfig.services"
        },
        scrollable: true,
        forceFit: true,
        items: [{
            xtype: 'administration-content-setup-elements-statusgrid'
        }]
    }]
});