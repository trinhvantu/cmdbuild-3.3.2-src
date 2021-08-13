Ext.define('CMDBuildUI.view.administration.content.gis.geoserverslayers.TopbarController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.administration-content-gis-geoserverslayers-topbar',

    control: {
        '#addlayer': {
            click: 'onNewLayerBtnClick'
        }
    },

    onNewLayerBtnClick: function () {
        var container = Ext.getCmp(CMDBuildUI.view.administration.DetailsWindow.elementId) || Ext.create(CMDBuildUI.view.administration.DetailsWindow);
        container.removeAll();
        container.add({
            xtype: 'administration-content-gis-geoserverslayers-card-viewedit',
            viewModel: {
                links: {
                    theLayer: {
                        type: 'CMDBuildUI.model.map.GeoLayers',
                        create: true
                    }
                },
                data: {
                    actions: {
                        edit: false,
                        view: false,
                        add: true
                    }
                }
            }
        });
    }

});