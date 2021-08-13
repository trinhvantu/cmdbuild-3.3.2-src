Ext.define('CMDBuildUI.view.map.longrpess.GridModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.map-longrpess-grid',

    formulas: {
        ready: {
            bind: {
                store: '{gridStore}',
                ids: '{longprpess.ids}'
            }, get: function (data) {

                //sets the filter
                var advancedFilter = data.store.getAdvancedFilter();
                advancedFilter.addAttributeFilter(
                    '_id',
                    // CMDBuildUI.model.base.Filter.contain,
                    'in',
                    data.ids
                )

                //loads the store
                data.store.load();
            }
        }
    },
    stores: {
        gridStore: {
            model: 'CMDBuildUI.model.classes.Card',
            proxy: {
                type: 'baseproxy',
                url: '/classes/Class/cards'
            }
        }
    }

});
