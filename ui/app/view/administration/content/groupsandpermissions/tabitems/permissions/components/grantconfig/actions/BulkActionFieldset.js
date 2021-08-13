Ext.define('CMDBuildUI.view.administration.content.groupsandpermissions.tabitems.permissions.components.grantconfig.actions.BulkActionFieldset', {
    extend: 'Ext.form.FieldSet',

    requires: [
        'CMDBuildUI.view.administration.content.groupsandpermissions.tabitems.permissions.components.grantconfig.actions.BulkActionFieldsetController',
        'CMDBuildUI.view.administration.content.groupsandpermissions.tabitems.permissions.components.grantconfig.actions.BulkActionFieldsetModel'
    ],
    alias: 'widget.administration-content-groupsandpermissions-tabitems-permissions-components-grantconfig-actions-bulkactionfieldset',
    controller: 'administration-content-groupsandpermissions-tabitems-permissions-components-grantconfig-actions-bulkactionfieldset',
    viewModel: {
        type: 'administration-content-groupsandpermissions-tabitems-permissions-components-grantconfig-actions-bulkactionfieldset'
    },
    ui: 'administration-formpagination',
    bind: {
        title: '{bulkActionsOrActionsTitle}'
    },   
    items: [{
        xtype: 'fieldcontainer',
        fieldLabel: CMDBuildUI.locales.Locales.administration.groupandpermissions.fieldlabels.cardbulkedit,
        localized: {
            fieldLabel: 'CMDBuildUI.locales.Locales.administration.groupandpermissions.fieldlabels.cardbulkedit'
        },
        hidden: true,
        bind: {
            hidden: '{isProcess}'
        },
        items: [{
            itemId: '_can_bulk_update_value',
            xtype: 'combobox',
            displayField: 'label',
            valueField: 'value',
            bind: {
                value: '{_can_bulk_update_value}',
                store: '{canBulkUpdateStore}',
                disabled: '{!actions.edit}'
            }
        }]
    }, {
        xtype: 'fieldcontainer',
        fieldLabel: CMDBuildUI.locales.Locales.administration.groupandpermissions.fieldlabels.cardbulkdeletion,
        localized: {
            fieldLabel: 'CMDBuildUI.locales.Locales.administration.groupandpermissions.fieldlabels.cardbulkdeletion'
        },
        hidden: true,
        bind: {
            hidden: '{isProcess}'
        },
        items: [{
            itemId: '_can_bulk_delete_value',
            xtype: 'combobox',
            displayField: 'label',
            valueField: 'value',
            bind: {
                value: '{_can_bulk_delete_value}',
                store: '{canBulkDeleteStore}',
                disabled: '{!actions.edit}'
            }
        }]
    }, {
        xtype: 'fieldcontainer',
        hidden: true,
        fieldLabel: CMDBuildUI.locales.Locales.administration.systemconfig.enableattachmenttoclosedactivities,
        localized: {
            fieldLabel: 'CMDBuildUI.locales.Locales.administration.systemconfig.enableattachmenttoclosedactivities'
        },
        bind: {
            hidden: '{isClass}'
        },
        items: [{
            xtype: 'combobox',
            name: 'chk_group',
            reference: 'chk_group',
            displayField: 'label',
            valueField: 'value',
            bind: {
                value: '{_can_fc_attachment_value}',
                store: '{canAttachmentStore}',
                disabled: '{!actions.edit}'
            }
        }]
    }, {
        xtype: 'fieldcontainer',
        hidden: true,
        fieldLabel: CMDBuildUI.locales.Locales.administration.groupandpermissions.fieldlabels.bulkabort,
        localized: {
            fieldLabel: 'CMDBuildUI.locales.Locales.administration.groupandpermissions.fieldlabels.bulkabort'
        },
        bind: {
            hidden: '{isClass}'
        },
        items: [{
            xtype: 'combobox',
            displayField: 'label',
            valueField: 'value',
            bind: {
                value: '{_can_bulk_abort_value}',
                store: '{canBulkAbortStore}',
                disabled: '{!actions.edit}'
            }
        }]
    }]

});