Ext.define('CMDBuildUI.view.administration.content.processes.tabitems.properties.fieldsets.GroupingsOrdersFieldsetController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.administration-content-processes-tabitems-properties-fieldsets-groupingsordersfieldset',
    mixins: ['CMDBuildUI.view.administration.content.classes.tabitems.properties.fieldsets.SorterGridsMixin'],

    /**
     * On translate button click
     * @param {Event} event
     * @param {Ext.button.Button} button
     * @param {Object} eOpts
     */
    onAddGroupClick: function (grid, rowIndex, colIndex, button, event, record, rowEl) {
        var view = grid.up('administration-content-processes-view');
        var vm = view.getViewModel();
        var newStore = vm.getStore('attributeGroupsStoreNew');
        var store = vm.getStore('attributeGroupsStore');
        if(!record.get('name')){
            record.set('name', grid.lookupViewModel().get('objectTypeName') + ' ' + record.get('description'));
        }
        record.set('index', record.get('index') || store.data.max('index') + 1);
        newStore.remove(record);
        store.add(record);
        vm.set('attributeGroupingCount', store.data.length);
        newStore.add({});
        view.down('#groupingsAttributesGrid').view.grid.getView().refresh();
    }
});