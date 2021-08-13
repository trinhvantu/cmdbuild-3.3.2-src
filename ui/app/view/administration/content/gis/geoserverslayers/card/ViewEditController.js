Ext.define('CMDBuildUI.view.administration.content.gis.geoserverslayers.card.ViewEditController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.administration-content-gis-geoserverslayers-card-viewedit',
    mixins: ['CMDBuildUI.view.administration.content.gis.geoserverslayers.card.CardMixin'],
    control: {
        '#': {
            afterrender: 'onBeforeRender'
        },
        '#saveBtn': {
            click: 'onSaveBtnClick'
        },
        '#cancelBtn': {
            click: 'onCancelBtnClick'
        },
        '#editBtn': {
            click: 'onEditBtnClick'
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
     * @param {CMDBuildUI.view.administration-content-gis-geoserverslayers-card-viewedit} view
     * @param {Object} eOpts
     */
    onBeforeRender: function (view, e, eOpts) {
        var vm = view.getViewModel();
        if (vm.get('actions.edit')) {
            CMDBuildUI.util.administration.helper.FieldsHelper.setAllowBlank(view.down('[name="file"]'), true, view);
            try {    
                view.down('[name="name"]').vtype = undefined;
            } catch (error) {
                
            }
        }
    },


    /**
     * @param {Ext.button.Button} button
     * @param {Event} e
     * @param {Object} eOpts
     */
    onSaveBtnClick: function (button, event, eOpts) {
        button.setDisabled(true);
        button.up('administration-content-gis-geoserverslayers-card-viewedit').mask(CMDBuildUI.locales.Locales.administration.common.messages.saving);
        var vm = button.lookupViewModel();
        CMDBuildUI.util.Ajax.setActionId('geoserverlayers.upload');
        // define method
        var method =  "PUT";
        var input = this.getView().down('[name="file"]').extractFileInput();

        // init formData
        var formData = new FormData();

        // append attachment json data
        var theLayer = vm.get('theLayer');
        theLayer.set('geoserver_name', theLayer.get('name'));
        var jsonData = Ext.encode(theLayer.getData());
        var fieldName = 'data';
        try {
            formData.append(fieldName, new Blob([jsonData], {
                type: "application/json"
            }));
        } catch (err) {
            CMDBuildUI.util.Logger.log("Unable to create attachment Blob FormData entry with type 'application/json', fallback to 'text/plain': " + err, CMDBuildUI.util.Logger.levels.error);
            // metadata as 'text/plain' (format compatible with older webviews)
            formData.append(fieldName, jsonData);
        }
        // get url

        var className = theLayer.get('owner_type');
        var cardId = theLayer.get('owner_id');        
        theLayer.getProxy().setUrl();        
        var url = Ext.String.format(
            '{0}/classes/{1}/cards/{2}/geolayers/{3}',
            CMDBuildUI.util.Config.baseUrl,
            className,
            cardId,
            theLayer.get('name')
        );

        var viewports = Ext.ComponentQuery.query('viewport');
        var grid = viewports[0].down('administration-content-gis-geoserverslayers-grid');

        CMDBuildUI.util.Ajax.initRequestException();
        CMDBuildUI.util.administration.File.upload(method, formData, input, url, {
            success: function (response) {
                if (typeof response === 'string'){
                    response = Ext.JSON.decode(response);
                }
                var plugin = grid.getPlugin('administration-forminrowwidget');
                var record = vm.get('actions.add') ? CMDBuildUI.model.map.GeoLayers.create(response.data) : theLayer;
                var eventtocall = vm.get('actions.add') ? 'itemcreated' : 'itemupdated';
                if (plugin) {
                    plugin.view.fireEventArgs(eventtocall, [grid, record, this]);
                }
                button.up('form').isValid();
                button.up('administration-detailswindow').close();
            },
            failure: function (error) {
                if (typeof error === 'string'){
                    error = Ext.JSON.decode(error);
                }
                button.up('form').isValid();
                button.up('administration-content-gis-geoserverslayers-card-viewedit').unmask();
            }
        });
    },
    /**
     * @param {Ext.button.Button} button
     * @param {Event} e
     * @param {Object} eOpts
     */
    onCancelBtnClick: function (button, e, eOpts) {
        this.getView().up('panel').close();
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
        container.add({
            xtype: 'administration-content-gis-geoserverslayers-card-viewedit',
            viewModel: {
                data: {
                    theLayer: theLayer,
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
                    button.up('administration-content-gis-geoserverslayers-card-viewedit').mask('deleting');
                    var theLayer = me.getViewModel().get('theLayer');
                    var record = me.getRecordFromGrid(theLayer);
                    record.getProxy().setUrl(me.getProxyUrl(theLayer));
                    record.erase({
                        success: function (_record, operation) {
                            me.getGrid().fireEventArgs('reload', [_record, 'delete']);
                            button.up('administration-detailswindow').close();
                        },
                        failure: function () {
                            record.reject();
                            me.getGridStore().add(record);
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
        var me = this;
        var view = me.getView();
        var vm = view.getViewModel();
        var record = me.getRecordFromGrid(vm.get('theLayer'));
        record.getProxy().setUrl(me.getProxyUrl(record));
        record.set('active', !record.get('active'));
        record.save({
            success: function (record, operation) {
                vm.set('theLayer.active', !vm.get('theLayer.active'));                
                me.getGrid().view.fireEventArgs('itemupdated', [me.getGrid(), record, me]);
            },
            failure: function (record, reason) {
                record.reject();
                me.getGrid().getPlugin('administration-forminrowwidget').view.fireEventArgs('togglerow', [null, record, vm.get('recordIndex')]);
                me.getGrid().getPlugin('administration-forminrowwidget').view.fireEventArgs('togglerow', [null, record, vm.get('recordIndex')]);
            }
        });
    },
    onTreeStoreDataChanged: function (store) {
        var treepanel = this.getView().down('treepanel');
        treepanel.setStore(store);
    }
    

});