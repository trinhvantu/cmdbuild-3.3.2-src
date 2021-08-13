Ext.define('CMDBuildUI.view.administration.content.groupsandpermissions.tabitems.permissions.components.grantconfig.tabsconfiggrid.TabsConfig', {
    extend: 'Ext.form.FieldSet',

    requires: [
        'CMDBuildUI.view.administration.content.groupsandpermissions.tabitems.permissions.components.grantconfig.tabsconfiggrid.TabsConfigController',
        'CMDBuildUI.view.administration.content.groupsandpermissions.tabitems.permissions.components.grantconfig.tabsconfiggrid.TabsConfigModel'
    ],
    alias: 'widget.administration-content-groupsandpermissions-tabitems-permissions-components-grantconfig-tabsconfiggrid-tabsconfig',
    controller: 'administration-content-groupsandpermissions-tabitems-permissions-components-grantconfig-tabsconfiggrid-tabsconfig',
    viewModel: {
        type: 'administration-content-groupsandpermissions-tabitems-permissions-components-grantconfig-tabsconfiggrid-tabsconfig'
    },
    ui: 'administration-formpagination',
    title: CMDBuildUI.locales.Locales.administration.groupandpermissions.texts.tabs,
    localized: {
        title: 'CMDBuildUI.locales.Locales.administration.groupandpermissions.texts.tabs'
    },
    bind: {
        hidden: '{isPrototype}'
    },
    items: [{
        xtype: 'grid',
        bind: {
            store: '{gridDataStore}'
        },
        viewConfig: {
            markDirty: false
        },
        sealedColumns: false,
        sortableColumns: true,
        enableColumnHide: false,
        enableColumnMove: false,
        enableColumnResize: false,
        menuDisabled: true,
        columns: [{
            flex: 1,
            text: CMDBuildUI.locales.Locales.administration.groupandpermissions.texts.tab,
            localized: {
                text: 'CMDBuildUI.locales.Locales.administration.groupandpermissions.texts.tab'
            },
            dataIndex: 'description',
            align: 'left'
        }, {
            width: '75px',
            text: CMDBuildUI.locales.Locales.administration.groupandpermissions.texts['default'],
            localized: {
                text: ' CMDBuildUI.locales.Locales.administration.groupandpermissions.texts.default'
            },
            dataIndex: 'default',
            align: 'center',
            xtype: 'checkcolumn',
            injectCheckbox: false,
            disabled: true,
            hideable: false,
            headerCheckbox: false,
            sortable: true,
            menuDisabled: true,
            bind: {
                disabled: '{!actions.edit}'
            },
            listeners: {
                beforecheckchange: 'onBeforeCheckChange',
                checkchange: 'onCheckChange'
            }
        }, {
            width: '75px',
            text: CMDBuildUI.locales.Locales.administration.groupandpermissions.texts.disable,
            localized: {
                text: ' CMDBuildUI.locales.Locales.administration.groupandpermissions.texts.disable'
            },
            dataIndex: 'disable',
            align: 'center',
            xtype: 'checkcolumn',
            injectCheckbox: false,
            disabled: true,
            hideable: false,
            headerCheckbox: false,
            sortable: true,
            menuDisabled: true,
            bind: {
                disabled: '{!actions.edit}'
            },
            listeners: {
                beforecheckchange: 'onBeforeCheckChange',
                checkchange: 'onCheckChange'
            }
        }, {
            width: '75px',
            text: CMDBuildUI.locales.Locales.administration.groupandpermissions.texts.enable,
            localized: {
                text: ' CMDBuildUI.locales.Locales.administration.groupandpermissions.texts.enable'
            },
            dataIndex: 'enable',
            align: 'center',
            xtype: 'checkcolumn',
            injectCheckbox: false,
            disabled: true,
            hideable: false,
            headerCheckbox: false,
            sortable: true,
            menuDisabled: true,
            bind: {
                disabled: '{!actions.edit}'
            },
            listeners: {
                beforecheckchange: 'onBeforeCheckChange',
                checkchange: 'onCheckChange'
            }
        }]
    }]
});