//the same as geoValue but for shape values
Ext.define('CMDBuildUI.model.gis.GeoLayer', {
    extend: 'CMDBuildUI.model.base.Base',
    statics: {
        checked: 'checked',
        checkedLayer: 'checkedLayer'
    },

    fields: [{
        name: 'active',
        type: 'string'
    }, {
        name: 'type',
        type: 'string'
    }, {
        name: 'name',
        type: 'string'
    }, {
        name: 'description',
        type: 'string'
    }, {
        name: 'geoserver_layer',
        type: 'string'
    }, {
        name: 'geoserver_name',
        type: 'string'
    }, {
        name: 'geoserver_store',
        type: 'string'
    }, {
        name: 'owner_id',
        type: 'string'
    }, {
        name: 'owner_type',
        type: 'string'
    }, {
        name: 'ollayername',
        type: 'string',
        calculate: function (data) {
            return Ext.String.format('{0}_{1}_{2}',
                CMDBuildUI.model.gis.GeoAttribute.GEOATTRIBUTE,
                data.name,
                data.owner_type);
        },
        persist: false
    }, {
        name: 'checked',
        type: 'boolean',
        defaultValue: true,
        persist: false
    }, {
        name: 'checkedLayer',
        type: 'boolean',
        defaultValue: true,
        persist: false
    }],

    proxy: {
        type: 'baseproxy'
    },

    getOlGeoFeature: function () {
        var olLayer = new ol.layer.Tile({
            // extent: el.get('extent')/* (el.get('extent')) ? (ol.proj.transformExtent(el.get('extent'),'EPSG:4326','EPSG:3857')) : undefined */,
            source: new ol.source.TileWMS({
                url: Ext.String.format('{0}/wms/', CMDBuildUI.util.Config.geoserverBaseUrl),
                params: {
                    'LAYERS': this.get('geoserver_name'),
                    'TILED': true
                },
                serverType: 'geoserver'
            })
        });

        /// only for debug
        if (this.get('checked') == false) {
            console.log('geofeature is invisible but layer is created visible');
        }
        /// only for debug
        olLayer.set('visibility', {
            checked: undefined,
            checkedLayer: undefined
        });

        olLayer.setChecked = function (checked) {
            // this.setVisible(checked);
            this.get('visibility').checked = checked;
            this.updatVisibility();
        }.bind(olLayer);

        olLayer.setCheckedLayer = function (checked) {
            // this.setVisible(checked);
            this.get('visibility').checkedLayer = checked;
            this.updatVisibility();
        }.bind(olLayer);

        olLayer.updatVisibility = function () {
            if (this.isVisible()) {
                this.setVisible(true);
            } else {
                this.setVisible(false);
            }
        }.bind(olLayer);

        olLayer.isVisible = function () {
            var visibility = this.get('visibility');
            if (visibility.checked == true &&
                visibility.checkedLayer == true
            ) {
                return true;
            } else {
                return false;
            }
        }.bind(olLayer);

        olLayer.setChecked(this.get('checked'));
        olLayer.setCheckedLayer(this.get('checkedLayer'));

        olLayer.set('id', this.getId());
        olLayer.set('name', this.get('ollayername'));
        olLayer.set('type', this.get('type'));

        return olLayer;
    }
});