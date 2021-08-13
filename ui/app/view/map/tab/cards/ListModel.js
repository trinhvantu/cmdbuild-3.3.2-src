Ext.define('CMDBuildUI.view.map.tab.cards.ListModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.map-tab-cards-list',
    formulas: {
        updateStore: {
            bind: '{cards}',
            get: function (store) {
                this.getView().setStore(store);
                this.set('map-tab-cards-list.store', store);
            }
        }
    }
});
