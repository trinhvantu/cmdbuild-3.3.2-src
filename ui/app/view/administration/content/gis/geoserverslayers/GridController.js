Ext.define('CMDBuildUI.view.administration.content.gis.geoserverslayers.GridController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.administration-content-gis-geoserverslayers-grid',
    control: {
        '#': {           
            rowdblclick: 'onRowDblclick'
        },
        tableview: {
            beforedrop: 'onBeforeDrop'
        }
    },

    onRowDblclick: function (row, record, element, rowIndex, e, eOpts) {

        var container = Ext.getCmp(CMDBuildUI.view.administration.DetailsWindow.elementId) || Ext.create(CMDBuildUI.view.administration.DetailsWindow);
        var vm = row.grid.getViewModel();
        var formInRow = row.ownerGrid.getPlugin('administration-forminrowwidget');
        formInRow.removeAllExpanded(record);
        row.setSelection(record);

        var className = record.get('owner_type');
        var cardId = record.get('owner_id');
        var url = Ext.String.format(
            '{0}/classes/{1}/cards/{2}/geolayers',
            CMDBuildUI.util.Config.baseUrl,
            className,
            cardId
        );
        CMDBuildUI.model.map.GeoLayers.getProxy().setUrl(url);
        container.add({
            xtype: 'administration-content-gis-geoserverslayers-card-viewedit',
            viewModel: {
                links: {
                    theLayer: {
                        type: 'CMDBuildUI.model.map.GeoLayers',
                        id: record.getId()
                    }
                },
                data: {
                    actions: {
                        edit: true,
                        view: false,
                        add: false
                    }
                }
            }
        });
    },
    onBeforeDrop: function (node, data, overModel, dropPosition, dropHandlers) {
        var vm = this.getViewModel();
        var view = this.getView();
        var moved = data.records[0].getId();
        var reference = overModel.getId();
        var layers = vm.get('layersStore').getData().getIndices();
        var sortableLayers = [];
        for (var key in layers) {
            if (layers.hasOwnProperty(key)) {
                sortableLayers.push([key, layers[key]]); // each item is an array in format [key, value]
            }
        }

        // sort items by value
        sortableLayers.sort(function (a, b) {
            return a[1] - b[1]; // compare numbers
        });

        var jsonData = [];

        Ext.Array.forEach(sortableLayers, function (val, key) {
            if (moved !== val[0]) {
                if (dropPosition === 'before' && reference === val[0]) {
                    jsonData.push(moved);
                }
                jsonData.push(val[0]);
                if (dropPosition === 'after' && reference === val[0]) {
                    jsonData.push(moved);
                }
            }
        });

        Ext.Ajax.request({
            url: Ext.String.format(
                '{0}/classes/_ANY/cards/_ANY/geolayers/order',
                CMDBuildUI.util.Config.baseUrl
            ),
            method: 'POST',
            jsonData: jsonData,
            success: function (response) {
                var res = JSON.parse(response.responseText);
                if (res.success) {
                    view.getView().grid.getStore().load();
                    dropHandlers.processDrop();
                }
            },
            failure: function (response) {
                dropHandlers.cancelDrop();
                view.getView().grid.getStore().load();
            }
        });
    }

});