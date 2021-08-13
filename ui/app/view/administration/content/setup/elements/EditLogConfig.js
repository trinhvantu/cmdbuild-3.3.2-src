Ext.define('CMDBuildUI.view.administration.content.setup.elements.EditLogConfig', {
    extend: 'Ext.grid.Panel',

    requires: [
        'CMDBuildUI.view.administration.content.setup.elements.EditLogConfigController',
        'CMDBuildUI.view.administration.content.setup.elements.EditLogConfigModel'
    ],

    alias: 'widget.administration-content-setup-elements-editlogconfig',
    controller: 'administration-content-setup-elements-editlogconfig',
    viewModel: {
        type: 'administration-content-setup-elements-editlogconfig'
    },
    forceFit: 'true',
    scrollable: true,
    reserveScrollbar: true,
    plugins: {
        pluginId: 'cellediting',
        ptype: 'cellediting',
        clicksToEdit: 1,
        listeners: {
            beforeedit: 'onBeforeCellEdit'
        }
    },
    sortable: false,
    bind: {
        store: '{configKeysStore}'
    },
    columns: [{
        text: CMDBuildUI.locales.Locales.administration.systemconfig.logcategory,
        localized: {
            text: 'CMDBuildUI.locales.Locales.administration.systemconfig.logcategory'
        },
        dataIndex: 'category',
        sortable: false,
        editor: {
            xtype: 'textfield'
        }
    }, {
        text: CMDBuildUI.locales.Locales.administration.systemconfig.content,
        localized: {
            text: 'CMDBuildUI.locales.Locales.administration.systemconfig.content'
        },
        dataIndex: 'description',
        sortable: false,
        editor: {
            xtype: 'textfield'
        }
    }, {
        text: CMDBuildUI.locales.Locales.administration.systemconfig.value,
        localized: {
            text: 'CMDBuildUI.locales.Locales.administration.systemconfig.value'
        },
        dataIndex: 'level',
        sortable: false,
        editor: {
            xtype: 'combo',
            queryMode: 'local',
            displayField: 'label',
            valueField: 'value',
            bind: {
                store: '{logSettingValuesStore}'
            }
        },
        renderer: function (value) {
            var store = this.lookupViewModel().get('logSettingValuesStore');
            var record = store.findRecord('value', value);
            if (record) {
                return record.get('label');
            }
            return value;
        }
    }],

    dockedItems: [{
        xtype: 'toolbar',
        itemId: 'bottomtoolbar',
        dock: 'bottom',
        ui: 'footer',
        items: CMDBuildUI.util.administration.helper.FormHelper.getSaveCancelButtons(false)
    }, {
        xtype: 'toolbar',
        itemId: 'bottomtoolbaraddrow',
        dock: 'bottom',        
        items: [{
            xtype: 'button',
            text: CMDBuildUI.locales.Locales.administration.systemconfig.addcustomconfig,
            localized: {
                text: 'CMDBuildUI.locales.Locales.administration.systemconfig.addcustomconfig'
            },
            itemId: 'addConfigRow',
            ui: 'administration-action-small'
        }]
    }]
});