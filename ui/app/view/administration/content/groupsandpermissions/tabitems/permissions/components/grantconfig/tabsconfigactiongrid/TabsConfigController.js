Ext.define('CMDBuildUI.view.administration.content.groupsandpermissions.tabitems.permissions.components.grantconfig.tabsconfiggrid.TabsConfigController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.administration-content-groupsandpermissions-tabitems-permissions-components-grantconfig-tabsconfiggrid-tabsconfig',

    onBeforeCheckChange: function (checkbox, rowIndex, checked, record, e, eOpts) {
        return checked;
    },

    onCheckChange: function (check, rowIndex, checked, record, e, eOpts) {
        var vm = check.lookupViewModel();        
        var value = check.dataIndex === 'enable' ? 'true' : check.dataIndex === 'disable' ? 'false' : '';
        vm.set(Ext.String.format('grant.{0}', record.get('name')), value);
        record.set('default', value === '');
        record.set('enable', value === 'true');
        record.set('disable', value === 'false');

    }

});