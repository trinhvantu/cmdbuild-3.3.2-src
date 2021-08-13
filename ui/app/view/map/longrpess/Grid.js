
Ext.define('CMDBuildUI.view.map.longrpess.Grid', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.map-longrpess-grid',

    requires: [
        'CMDBuildUI.view.map.longrpess.GridController',
        'CMDBuildUI.view.map.longrpess.GridModel'
    ],
    statics: {
        longpressPopupId: 'longpressPopup'
    },

    controller: 'map-longrpess-grid',
    viewModel: {
        type: 'map-longrpess-grid'
    },

    config: {
        /**
         * @cfg {[Number]} The ids of the card we are interessed in
         */
        ids: []
    },
    publishes: ['ids'],
    reference: 'longprpess',

    bind: {
        store: '{gridStore}'
    },

    // layout: 'fit',
    forceFit: true,
    columns: [{
        text: CMDBuildUI.locales.Locales.gis.type,
        localized: {
            text: 'CMDBuildUI.locales.Locales.gis.type'
        },
        align: 'left',
        dataIndex: '_type',
        flex: 1,
        renderer: function (value, metadata, record, rowIndex, colIndex, store, view) {
            var translationType = CMDBuildUI.util.helper.ModelHelper.getObjectDescription(value);
            return translationType;
        }
    }, {
        text: CMDBuildUI.locales.Locales.gis.code,
        localized: {
            text: 'CMDBuildUI.locales.Locales.gis.code'
        },
        dataIndex: 'Code',
        align: 'left',
        flex: 1
    }, {
        text: CMDBuildUI.locales.Locales.gis.description,
        localized: {
            text: 'CMDBuildUI.locales.Locales.gis.description'
        },
        dataIndex: 'Description',
        align: 'left',
        flex: 1
    }, {
        xtype: 'actioncolumn',
        iconCls: 'x-fa fa-arrow-circle-right',
        width: 50,
        handler: 'onActionColumnClick',
        menuDisabled: true
    }]
});
