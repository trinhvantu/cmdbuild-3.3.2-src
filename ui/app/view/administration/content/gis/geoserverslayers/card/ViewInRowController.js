Ext.define('CMDBuildUI.view.administration.content.gis.geoserverslayers.card.ViewInRowController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.administration-content-gis-geoserverslayers-card-viewinrow',

    control: {
        '#': {
            beforerender: 'onBeforeRender'
        },
        '#editBtn': {
            click: 'onEditBtnClick'
        },
        '#openBtn': {
            click: 'onOpenBtnClick'
        },
        '#cloneBtn': {
            click: 'onCloneBtnClick'
        },
        '#deleteBtn': {
            click: 'onDeleteBtnClick'
        },
        '#enableBtn': {
            click: 'onToggleActiveBtnClick'
        },
        '#disableBtn': {
            click: 'onToggleActiveBtnClick'
        }
    },

    /**
     * @param {CMDBuildUI.view.administration.content.gis.geoserverslayers.card.ViewInRowController} view
     * @param {Object} eOpts
     */

    onBeforeRender: function (view, eOpts) {
        var vm = this.getViewModel();
        var record = view.getInitialConfig()._rowContext.record;
        vm.set("theLayer", record);
    },

    /**
     * @param {CMDBuildUI.view.administration.content.gis.geoserverslayers.card.ViewInRowController} view
     * @param {Object} eOpts
     */
    onEditBtnClick: function (button, e, eOpts) {
        var vm = this.getViewModel();
        var container = Ext.getCmp(CMDBuildUI.view.administration.DetailsWindow.elementId) || Ext.create(CMDBuildUI.view.administration.DetailsWindow);
        var theLayer = vm.get('theLayer');
        container.removeAll();

        var className = theLayer.get('owner_type');
        var cardId = theLayer.get('owner_id');
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
                        id: theLayer.getId()
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

    /**
     * @param {CMDBuildUI.view.administration.content.gis.geoserverslayers.card.ViewInRowController} view
     * @param {Object} eOpts
     */
    onOpenBtnClick: function (button, e, eOpts) {
        var view = this.getView();
        var vm = view.getViewModel();
        var theLayer = vm.get('theLayer').copy();
        var cardDescription = vm.get('cardDescription');
        theLayer.set('cardDescription', cardDescription);
        var container = Ext.getCmp(CMDBuildUI.view.administration.DetailsWindow.elementId) || Ext.create(CMDBuildUI.view.administration.DetailsWindow);
        container.removeAll();

        container.add({
            xtype: 'administration-content-gis-geoserverslayers-card-viewedit',
            viewModel: {
                data: {
                    theLayer: theLayer,
                    actions: {
                        edit: false,
                        view: true,
                        add: false
                    }
                }
            }
        });
    },

    /**
     * @param {CMDBuildUI.view.administration.content.gis.geoserverslayers.card.ViewInRowController} view
     * @param {Object} eOpts
     */
    onCloneBtnClick: function (button, e, eOpts) {
        var view = this.getView();
        var vm = view.getViewModel();
        var clonedLayer = Ext.copy(vm.get('theLayer').clone());
        var container = Ext.getCmp(CMDBuildUI.view.administration.DetailsWindow.elementId) || Ext.create(CMDBuildUI.view.administration.DetailsWindow);
        container.removeAll();
        container.add({
            xtype: 'administration-content-gis-geoserverslayers-card-viewedit',
            viewModel: {
                data: {
                    theLayer: clonedLayer,
                    actions: {
                        edit: false,
                        view: false,
                        add: true
                    }
                }
            }
        });
    },

    /**
     * @param {CMDBuildUI.view.administration.content.gis.geoserverslayers.card.ViewInRowController} view
     * @param {Object} eOpts
     */
    onDeleteBtnClick: function (button, e, eOpts) {
        var me = this;
        Ext.Msg.confirm(
            CMDBuildUI.locales.Locales.administration.common.messages.attention,
            CMDBuildUI.locales.Locales.administration.common.messages.areyousuredeleteitem,
            function (btnText) {
                if (btnText === "yes") {

                    var theLayer = me.getViewModel().get('theLayer');
                    var className = theLayer.get('owner_type');
                    var cardId = theLayer.get('owner_id');
                    var id = theLayer.get('_id');
                    var store = theLayer.store;
                    var data = {};
                    data.classId = className;
                    data.cardId = cardId;
                    data.layerId = id;

                    var url = Ext.String.format(
                        '{0}/classes/{1}/cards/{2}/geolayers',
                        CMDBuildUI.util.Config.baseUrl,
                        className,
                        cardId
                    );
                    theLayer.getProxy().setUrl(url);
                    theLayer.erase({
                        success: function (record, operation) {
                            Ext.ComponentQuery.query('administration-content-gis-geoserverslayers-grid')[0].fireEventArgs('reload', [record, 'delete']);
                        },
                        failure: function () {
                            theLayer.reject();
                            store.add(theLayer);
                        }
                    });
                }
            });
    },

    /**
     * @param {Ext.button.Button} button
     * @param {Event} e
     * @param {Object} eOpts
     */
    onToggleActiveBtnClick: function (button, e, eOpts) {
        var view = this.getView();
        var vm = view.getViewModel();
        var theLayer = vm.get('theLayer');


        var className = theLayer.get('owner_type');
        var cardId = theLayer.get('owner_id');
        var id = theLayer.get('_id');


        var url = Ext.String.format(
            '{0}/classes/{1}/cards/{2}/geolayers',
            CMDBuildUI.util.Config.baseUrl,
            className,
            cardId
        );
        theLayer.getProxy().setUrl(url);
        theLayer.set('active', !theLayer.get('active'));

        theLayer.save({
            success: function (record, operation) {
                view.up('administration-content-gis-geoserverslayers-grid').getPlugin('administration-forminrowwidget').view.fireEventArgs('itemupdated', [view.up('administration-content-gis-geoserverslayers-grid'), record, this]);
            },
            failure: function (record, reason) {
                record.reject();                
            }
        });

    }

});