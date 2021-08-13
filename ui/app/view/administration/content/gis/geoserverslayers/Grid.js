Ext.define('CMDBuildUI.view.administration.content.gis.geoserverslayers.Grid', {
    extend: 'Ext.grid.Panel',

    requires: [
        'CMDBuildUI.view.administration.content.gis.geoserverslayers.GridController'
    ],

    alias: 'widget.administration-content-gis-geoserverslayers-grid',
    controller: 'administration-content-gis-geoserverslayers-grid',
    viewModel: {},

    forceFit: true,
    loadMask: true,
    bind: {
        store: '{layersStore}'
    },
    itemId: 'geoLayersGrid',
    viewConfig: {
        markDirty: false,
        plugins: [{
            ptype: 'gridviewdragdrop',
            dragText: CMDBuildUI.locales.Locales.administration.attributes.strings.draganddrop,
            localized: {
                dragText: 'CMDBuildUI.locales.Locales.administration.attributes.strings.draganddrop'
            },
            containerScroll: true,
            pluginId: 'gridviewdragdrop'
        }]
    },

    plugins: [{
        ptype: 'administration-forminrowwidget',
        pluginId: 'administration-forminrowwidget',
        expandOnDblClick: true,
        removeWidgetOnCollapse: true,
        widget: {
            xtype: 'administration-content-gis-geoserverslayers-card-viewinrow',
            autoHeight: true,
            ui: 'administration-tabandtools',
            bind: {},
            viewModel: {}
        }
    }],

    columns: [{
        text: CMDBuildUI.locales.Locales.administration.gis.ownerclass,
        localized: {
            text: 'CMDBuildUI.locales.Locales.administration.gis.ownerclass'
        },
        dataIndex: 'owner_type',
        renderer: function (value, metaData, record, rowIndex, colIndex, store, view) {
            return CMDBuildUI.util.helper.ModelHelper.getObjectDescription(value);
        },
        align: 'left'
    }, {
        text: CMDBuildUI.locales.Locales.administration.gis.geoattribute,
        localized: {
            text: 'CMDBuildUI.locales.Locales.administration.gis.geoattribute'
        },
        dataIndex: 'description',
        align: 'left'
    }, {
        text: CMDBuildUI.locales.Locales.administration.gis.card,
        localized: {
            text: 'CMDBuildUI.locales.Locales.administration.gis.card'
        },
        dataIndex: 'owner_id',
        align: 'left',
        renderer: function (value, metaData, record, rowIndex, colIndex, store, view) {           
            return CMDBuildUI.util.helper.FieldsHelper.renderReferenceField(value, {
                fieldName: 'description',
                isHtml: false,
                targetType: 'class',
                targetTypeName: record.get('owner_type'),
                stripTags: true,
                record: record
            });
        }
    }, {
        text: CMDBuildUI.locales.Locales.administration.geoattributes.fieldLabels.type,
        localized: {
            text: 'CMDBuildUI.locales.Locales.administration.geoattributes.fieldLabels.type'
        },
        dataIndex: 'type',
        align: 'left',
        renderer: function (value, metaData, record, rowIndex, colIndex, store, view) {
            return CMDBuildUI.util.administration.helper.RendererHelper.getGeoatributeType(record);
        }
    }, {
        text: CMDBuildUI.locales.Locales.administration.common.labels.active,
        localized: {
            text: 'CMDBuildUI.locales.Locales.administration.common.labels.active'
        },
        disabled: true,
        xtype: 'checkcolumn',
        dataIndex: 'active'
    }],

    initComponent: function () {
        var vm = this.getViewModel();
        vm.getParent().set('title', CMDBuildUI.locales.Locales.administration.gis.layersorder);
        this.callParent(arguments);
    }
});