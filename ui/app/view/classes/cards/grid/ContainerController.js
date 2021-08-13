Ext.define('CMDBuildUI.view.classes.cards.grid.ContainerController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.classes-cards-grid-container',

    control: {
        "#": {
            beforerender: "onBeforeRender"
        },
        '#addcard': {
            beforerender: 'onAddCardButtonBeforeRender'
        },
        '#contextMenuBtn': {
            beforerender: 'onContextMenuBtnBeforeRender'
        },
        '#refreshBtn': {
            click: 'onRefreshBtnClick'
        },
        '#printPdfBtn': {
            click: 'onPrintBtnClick'
        },
        '#printCsvBtn': {
            click: 'onPrintBtnClick'
        },
        '#savePreferencesBtn': {
            click: 'onSavePreferencesBtnClick'
        }
    },

    /**
     * @param {CMDBuildUI.view.classes.cards.grid.Container} view
     * @param {Object} eOpts
     */
    onBeforeRender: function (view, eOpts) {
        var me = this;
        var vm = this.getViewModel();
        CMDBuildUI.util.helper.ModelHelper.getModel("class", view.getObjectTypeName()).then(function (model) {
            if (!view.destroyed) {
                vm.set("objectTypeName", view.getObjectTypeName());

                //items array
                var items = [];

                //insert grid congiguration
                items.push(me.getGridObject());

                //check configuration to add map component
                var configuration = CMDBuildUI.util.helper.Configurations.get(CMDBuildUI.model.Configuration.gis.enabled);
                var gis_access = CMDBuildUI.util.helper.SessionHelper.getCurrentSession().get("rolePrivileges").gis_access;
                if (configuration && gis_access && vm.getParent().get('activeView') == 'map') {

                    //insert map configuration
                    items.push(me.getMapObject());

                }

                //add items to the view
                view.add(items);

                //TODO: use the bind property for the activeView without setting it in the controller
                if (vm.getParent().get('activeView') == 'grid-list') {
                    //Reset position variables related with the olMap
                    view.up('management-content').getViewModel().set('actualZoom', CMDBuildUI.util.helper.Configurations.get(CMDBuildUI.model.Configuration.gis.initialZoom));
                    view.up('management-content').getViewModel().set('mapCenter',
                        ol.proj.fromLonLat([
                            CMDBuildUI.util.helper.Configurations.get(CMDBuildUI.model.Configuration.gis.initialLon),
                            CMDBuildUI.util.helper.Configurations.get(CMDBuildUI.model.Configuration.gis.initialLat)],
                            'EPSG:3857')
                    );

                    //set the grid as active view
                    view.setActiveItem(view.referenceGridId);

                } else if (vm.getParent().get('activeView') == 'map') {

                    //set the map as active view
                    view.setActiveItem(view.referenceMapId);
                }
            }
        });

    },

    /**
     * 
     * @param {*} view 
     */
    getMapObject: function (view) {
        var view = this.getView();
        return {
            itemId: view.referenceMapId,
            reference: view.referenceMapId,
            layersStoreUrl: CMDBuildUI.util.api.Classes.getGeoAttributes(view.getObjectTypeName()),
            xtype: 'map-container',
            objectType: CMDBuildUI.util.helper.ModelHelper.objecttypes.klass,
            objectId: this.getViewModel().get('selectedId'),
            bind: {
                objectTypeName: '{objectTypeName}',
                zoom: '{actualZoom}',
                center: '{mapCenter}'
            }
        }
    },

    /**
     * 
     * @param {*} view 
     */
    getGridObject: function () {
        var view = this.getView();
        return {
            itemId: view.referenceGridId,
            reference: view.referenceGridId,
            xtype: 'classes-cards-grid-grid',
            maingrid: view.isMainGrid(),
            selModel: {
                pruneRemoved: false, // See https://docs.sencha.com/extjs/6.2.0/classic/Ext.selection.Model.html#cfg-pruneRemoved
                selType: 'checkboxmodel',
                checkOnly: true,
                mode: 'SINGLE'
            }
        }
    },

    /**
    * Filter grid items.
    * @param {Ext.form.field.Text} field
    * @param {Ext.form.trigger.Trigger} trigger
    * @param {Object} eOpts
    */
    onSearchSubmit: function (field, trigger, eOpts) {
        var vm = this.getViewModel();
        // get value
        var searchTerm = field.getValue();
        if (searchTerm) {
            // add filter
            var store = vm.get("cards");
            field.fireEventArgs('queryfilterchange', [field, searchTerm]);
            store.getAdvancedFilter().addQueryFilter(searchTerm);
            store.load();
        } else {
            this.onSearchClear(field);
        }
    },

    /**
     * @param {Ext.form.field.Text} field
     * @param {Ext.form.trigger.Trigger} trigger
     * @param {Object} eOpts
     */
    onSearchClear: function (field, trigger, eOpts) {
        var vm = this.getViewModel();
        // clear store filter
        var store = vm.get("cards");
        field.fireEventArgs('queryfilterchange', [field, null]);
        store.getAdvancedFilter().clearQueryFilter();
        store.load();
        // reset input
        field.reset();
    },

    /**
    * @param {Ext.form.field.Base} field
    * @param {Ext.event.Event} event
    */
    onSearchSpecialKey: function (field, event) {
        if (event.getKey() == event.ENTER) {
            this.onSearchSubmit(field);
        }
    },

    /**
     * 
     * @param {*} event 
     * @param {*} eOpts 
     */
    onShowMapListButtonClick: function (event, eOpts) {
        var vm = this.getViewModel();
        var view = this.getView();
        var activeView = vm.get('activeView');

        if (activeView == 'grid-list') {
            var map  = view.lookupReference(view.referenceMapId);
            if (!map) {
                map = view.add(this.getMapObject());
            }
            view.setActiveItem(view.referenceMapId)
            vm.getParent().set('activeView', 'map');

        } else if (activeView == 'map') {
            view.setActiveItem(view.referenceGridId)
            vm.getParent().set('activeView', 'grid-list');
        }
    },

    /**
     * @param {Ext.button.Button} button
     * @param {Object} eOpts
     */
    onAddCardButtonBeforeRender: function (button, eOpts) {
        var me = this;
        var vm = button.lookupViewModel();
        var view = this.getView();
        view.updateAddButton(
            button,
            function (item, event, eOpts) {
                me.onNewBtnClick(item, event, eOpts);
            },
            view.getObjectTypeName(),
            vm.get("objectType")
        );
    },

    /**
     * 
     * @param {Ext.menu.Item} item
     * @param {Ext.event.Event} event
     * @param {Object} eOpts
     */
    onNewBtnClick: function (item, event, eOpts) {
        if (this.getView().isMainGrid()) {
            CMDBuildUI.util.helper.SessionHelper.setItem('activeCardIndex', 0);
            var url = CMDBuildUI.util.Navigation.getClassBaseUrl(item.objectTypeName, null, 'new');
            this.redirectTo(url, true);
        } else {
            this.showAddCardFormPopup(item.objectTypeName, item.text);
        }
    },

    /**
     * 
     * @param {String} objectTypeName The name of the Class
     * @param {String} targetTypeDescription The description of the class
     */
    showAddCardFormPopup: function (objectTypeName, targetTypeDescription) {
        var me = this;
        CMDBuildUI.util.helper.ModelHelper.getModel('class', objectTypeName).then(function (model) {
            var panel;
            var title = Ext.String.format("New {0}", targetTypeDescription);
            var config = {
                xtype: 'classes-cards-card-create',
                viewModel: {
                    data: {
                        objectTypeName: objectTypeName
                    }
                },
                defaultValues: [{
                    value: objectTypeName,
                    editable: false
                }]
            };
            panel = CMDBuildUI.util.Utilities.openPopup('popup-add-class-form', title, config, null);
        }, function () {
            CMDBuildUI.util.Msg.alert('Error', 'Class non found!');
        });
    },

    /**
     * @param {Ext.button.Button} button
     * @param {Object} eOpts
     */
    onContextMenuBtnBeforeRender: function (button, eOpts) {
        this.getView().initContextMenu(button);
    },

    /**
     * 
     * @param {Ext.button.Button} button 
     * @param {Event} event 
     * @param {Object} eOpts 
     */
    onRefreshBtnClick: function (button, event, eOpts) {
        button.lookupViewModel().get("cards").load();
    },

    /**
     * 
     * @param {Ext.menu.Item} menuitem 
     * @param {Ext.event.Event} event 
     * @param {Object} eOpts 
     */
    onPrintBtnClick: function (menuitem, event, eOpts) {
        var format = menuitem.printformat;
        var view = this.getView();
        var store = this.getViewModel().get("cards");
        var queryparams = {};

        // url and format
        var url = CMDBuildUI.util.api.Classes.getPrintCardsUrl(this.getViewModel().get("objectTypeName"), format);
        queryparams.extension = format;

        // visibile columns
        var columns = view.lookupReference(view.referenceGridId).getVisibleColumns();
        var attributes = [];
        columns.forEach(function (c) {
            if (c.dataIndex) {
                attributes.push(c.dataIndex);
            }
        });
        queryparams.attributes = Ext.JSON.encode(attributes);

        // apply sorters
        var sorters = store.getSorters().getRange();
        if (sorters.length) {
            queryparams.sort = store.getProxy().encodeSorters(sorters);
        }

        // filters
        var filter = store.getAdvancedFilter();
        if (!(filter.isEmpty() && filter.isBaseFilterEmpty())) {
            queryparams.filter = filter.encode();
        }

        // open file in popup
        CMDBuildUI.util.Utilities.openPrintPopup(url + "?" + Ext.Object.toQueryString(queryparams), format);
    },

    /**
     * 
     * @param {Ext.panel.Tool} tool 
     * @param {Event} event 
     */
    onSavePreferencesBtnClick: function (tool, event) {
        var view = this.getView();
        var vm = view.lookupViewModel();
        var grid = view.lookupReference(view.referenceGridId);
        CMDBuildUI.util.helper.GridHelper.saveGridPreferences(grid, tool, vm.get("objectType"), vm.get("objectTypeName"));
    }
});
