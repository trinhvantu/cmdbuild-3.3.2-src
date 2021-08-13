Ext.define('CMDBuildUI.view.administration.content.gis.geoserverslayers.card.CardMixin', {


    mixinId: 'administration-geoserverlayer-cardmixin',
    privates: {
        getGrid: function () {
            return Ext.ComponentQuery.query('administration-content-gis-geoserverslayers-grid')[0];
        },
        getGridStore: function () {
            return this.getGrid().getStore();
        },
        getRecordFromGrid: function (theLayer) {
            var grid = this.getGrid();
            var store = grid.getStore();
            var record = store.findRecord('_id', theLayer.getId());
            return record;
        },
        getProxyUrl: function (theLayer) {
            var className = theLayer.get('owner_type');
            var cardId = theLayer.get('owner_id');
            var url = Ext.String.format(
                '{0}/classes/{1}/cards/{2}/geolayers',
                CMDBuildUI.util.Config.baseUrl,
                className,
                cardId
            );
            return url;
        }
    }

});