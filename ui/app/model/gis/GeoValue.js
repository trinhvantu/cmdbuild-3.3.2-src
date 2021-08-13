Ext.define('CMDBuildUI.model.gis.GeoValue', {
    extend: 'CMDBuildUI.model.base.Base',

    fields: [{
        name: '_type', //POINT, LINESTRING, POLYGON
        type: 'string'
    }, {
        name: '_attr',
        type: 'string'
    }, {
        name: '_owner_type',
        type: 'string'
    }, {
        name: '_owner_id',
        type: 'number'
    }, {
        name: 'points', //if type is POINT or POLYGON
        type: 'auto'
    }, {
        name: 'x', //If type is POINT
        type: 'auto'
    }, {
        name: 'y', //If type is POINT
        type: 'auto'
    }, {
        name: 'checked',
        type: 'boolean',
        defaultValue: true,
        persist: false
    }, {
        name: 'ollayername',
        type: 'string',
        calculate: function (data) {
            return Ext.String.format('{0}_{1}_{2}',
                CMDBuildUI.model.gis.GeoAttribute.GEOATTRIBUTE,
                data._attr,
                data._owner_type);
        },
        persist: false
    }, {
        name: 'text',
        type: 'string',
        persist: false,
        calculate: function (data) {
            return Ext.String.format('{0} ({1})', data._attr, data._owner_type);
        }
    }, {
        name: 'hasBim',
        type: 'boolean',
        defaultValue: false,
        persist: false
    }, {
        name: 'projectId',
        type: 'auto',
        defaultValue: null,
        persist: false
    }],

    proxy: {
        type: 'baseproxy'
    },

    hasValues: function () {

        switch (this.get('_type')) {
            case 'point':
                if (Ext.isEmpty(this.get('x')) || Ext.isEmpty(this.get('y'))) {
                    return false;
                }
                break;
            case 'linestring':
            case 'polygon':
                if (!Ext.isArray(this.get('points'))) {
                    return false;
                }
                break;
        }
        return true;
    },

    clearValues: function () {
        switch (this.get('_type')) {
            case 'point':
                this.set('x', undefined);
                this.set('y', undefined);
                break;
            case 'linestring':
            case 'polygon':
                this.set('points', undefined);
                break;
        }
    },

    getJsonData: function () {
        switch (this.get('_type')) {
            case 'point':
                return {
                    _type: 'point',
                    x: this.get('x'),
                    y: this.get('y')
                };
                break;
            case 'linestring':
                return {
                    _type: 'linestring',
                    points: this.get('points')
                };
            case 'polygon':
                return {
                    _type: 'polygon',
                    points: this.get('points')
                };
                break;
        }
    },
    getOlFeature: function () {
        var geometry;
        switch (this.get('_type')) {
            case 'point':
                geometry = new ol.geom.Point([
                    this.get('x'),
                    this.get('y')
                ]);
                break;
            case 'linestring':
                var points = [];
                this.get('points').forEach(function (point) {
                    points.push([
                        point.x,
                        point.y
                    ]);
                });
                geometry = new ol.geom.LineString(points);
                break;
            case 'polygon':
                var points = [];
                this.get('points').forEach(function (point) {
                    points.push([
                        point.x,
                        point.y
                    ]);
                });
                geometry = new ol.geom.Polygon([points]);
                break;
        }

        var feature = new ol.Feature({
            geometry: geometry
        });
        feature.setId(this.getId());
        feature.set('_owner_id', this.get('_owner_id'));
        feature.set('ollayername', this.get('ollayername'));
        feature.set('visibility', {
            drawmode: false,
            checked: true
        });

        feature.set('hasBim', this.get('hasBim'));
        feature.set('projectId', this.get('projectId'));

        feature.setDrawmode = function (drawmode) {
            this.get('visibility').drawmode = drawmode;
            this.updatVisibility();
        }.bind(feature);

        feature.setChecked = function (checked) {
            this.get('visibility').checked = checked;
            this.updatVisibility();
        }.bind(feature);

        feature.updatVisibility = function () {
            if (this.isVisible()) {
                this.setStyle(undefined);
            } else {
                feature.setStyle(new ol.style.Style());
            }
        }.bind(feature);

        feature.isVisible = function () {
            var visibility = this.get('visibility');
            if (visibility.checked == true &&
                visibility.drawmode == false
            ) {
                return true;
            } else {
                return false;
            }

        }.bind(feature);

        feature.setDrawmode(false);
        feature.setChecked(this.get('checked'));
        return feature;
    },

    getCenter: function () {
        switch (this.get('_type')) {
            case 'point':
                return [
                    this.get('x'),
                    this.get('y')
                ];
                break;
            case 'linestring':
            case 'polygon':
                return [
                    this.get('points')[0].x,
                    this.get('points')[0].y
                ];
                break;
        }
    }
});