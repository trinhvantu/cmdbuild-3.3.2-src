Ext.define('CMDBuildUI.view.map.tab.cards.geoattributesGrid.geoattributesGridController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.map-tab-cards-geoattributesgrid-geoattributesgrid',

    //TODO: create a better interface for this events
    onAddGeoValue: function (view, rowIndex, colIndex, item, e, record, row) {
        var vm = this.getViewModel();
        vm.set('buttonsSaveCancel.hidden', false);

        var tabpanel = view.up('map-tab-tabpanel');
        tabpanel.setDrawmode(true);

        tabpanel.fireEventArgs('addgeovalue', [{
            record: record,
            listeners: {
                drawend: {
                    fn: function (points) {
                        switch (record.get('_type')) {
                            case 'point':
                                record.set('x', points.x);
                                record.set('y', points.y);
                                break;
                            case 'linestring':
                            case 'polygon':
                                record.set('points', points);
                                break;
                        }

                        vm.set('buttonsSaveCancel.saveDisabled', false);
                    },
                    scope: this
                },
                drawstart: {
                    fn: function (points) { },
                    scope: this
                }
            },
            operation: 'add'
        }]);
    },

    onEditGeoValue: function (view, rowIndex, colIndex, item, e, geovalue, row) {
        var vm = this.getViewModel();
        vm.set('buttonsSaveCancel.hidden', false);

        var tabpanel = view.up('map-tab-tabpanel');
        tabpanel.setDrawmode(true);

        tabpanel.fireEventArgs('editgeovalue', [{
            record: geovalue,
            listeners: {
                modifystart: {
                    fn: function (points) {
                        vm.set('buttonsSaveCancel.saveDisabled', false);
                    },
                    scope: this
                },
                modifyend: {
                    fn: function (points) {
                        switch (geovalue.get('_type')) {
                            case 'point':
                                geovalue.set('x', points.x);
                                geovalue.set('y', points.y);
                                break;
                            case 'linestring':
                            case 'polygon':
                                geovalue.set('points', points);
                                break;
                        }
                    },
                    scope: this
                }
            },
            operation: 'edit'
        }]);
    },

    onRemoveGeoValue: function (view, rowIndex, colIndex, item, e, geovalue, row) {
        var vm = this.getViewModel();
        vm.set('buttonsSaveCancel.hidden', false);
        vm.set('buttonsSaveCancel.saveDisabled', false);

        var tabpanel = view.up('map-tab-tabpanel');
        tabpanel.setDrawmode(true);

        tabpanel.fireEventArgs('removegeovalue', [{
            record: geovalue,
            listeners: {
                clear: {
                    fn: function () {
                        geovalue.clearValues();
                    },
                    scope: this
                }
            }
        }]);
    },

    onViewGeoValue: function (view, rowIndex, colIndex, item, e, geovalue, row) {
        var tabpanel = view.up('map-tab-tabpanel');
        tabpanel.fireEventArgs('animategeovalue', [{
            geovalue: geovalue
        }]);
    },

    onCancelButtonClick: function () {
        var vm = this.getViewModel();
        var view = this.getView();
        vm.set('buttonsSaveCancel', {
            hidden: true,
            saveDisabled: true
        });

        var store = this.getView().getStore();
        var tabpanel = view.up('map-tab-tabpanel');

        store.getRange().forEach(function (item, index, array) {

            tabpanel.fireEventArgs('cleanmap', [item]);
            item.reject();
        }, this);

        tabpanel.setDrawmode(false);
    },

    onSaveButtonClick: function () {
        var promises = [];
        var view = this.getView();
        var store = view.getStore();

        store.getModifiedRecords().forEach(function (item, index, array) {
            var deferred;

            //the new records
            if (item.phantom) {

                if (item.hasValues()) {
                    deferred = new Ext.Deferred();

                    //creates new geovalues
                    Ext.Ajax.request({
                        url: CMDBuildUI.util.api.Classes.getGeoValuesUrl(
                            item.get('_owner_type'),
                            item.get('_owner_id')) + Ext.String.format('/{0}', item.get('_attr')),
                        method: 'PUT',
                        jsonData: item.getJsonData(),
                        success: function (response, option) {
                            item.commit(); //should change the id with the new one sent from the server
                            deferred.resolve(item);
                        },
                        failure: function (response, option) {
                            var errorMessage = JSON.parse(response.responseText).messages[0].message;
                            deferred.reject(errorMessage);
                        }
                    });

                    promises.push(deferred.promise);
                }
            } else {

                deferred = new Ext.Deferred();

                //modify existings geoValues
                if (item.hasValues()) {
                    Ext.Ajax.request({
                        url: CMDBuildUI.util.api.Classes.getGeoValuesUrl(
                            item.get('_owner_type'),
                            item.get('_owner_id')) + Ext.String.format('/{0}', item.get('_attr')),
                        method: 'PUT',
                        jsonData: item.getJsonData(),
                        success: function (response, option) {
                            item.commit();
                            deferred.resolve(item);
                        },
                        failure: function (response, option) {
                            var errorMessage = JSON.parse(response.responseText).messages[0].message;
                            deferred.reject(errorMessage);
                        }
                    });
                } else {

                    //erases existing geovalues
                    Ext.Ajax.request({
                        url: CMDBuildUI.util.api.Classes.getGeoValuesUrl(
                            item.get('_owner_type'),
                            item.get('_owner_id')) + Ext.String.format('/{0}', item.get('_attr')),
                        method: 'DELETE',
                        success: function (response, option) {
                            item.commit(); //should change the id erasing the old one
                            deferred.resolve(item);
                        },
                        failure: function (response, option) {
                            var errorMessage = JSON.parse(response.responseText).messages[0].message;
                            deferred.reject(errorMessage);
                        }
                    });
                }

                promises.push(deferred.promise);
            }

        }, this);

        Ext.Deferred.all(promises).then(
            //onFulfill
            function (resolved) {
                var vm = this.getViewModel();
                vm.set('buttonsSaveCancel', {
                    hidden: true,
                    saveDisabled: true,
                    cancelDisabled: false
                });
                resolved.forEach(function (item, index, array) {
                    view.up('map-tab-tabpanel').fireEventArgs('cleanmap', [item]);
                }, this);

                var tabpanel = view.up('map-tab-tabpanel');
                tabpanel.setDrawmode(false);
            },

            //onRejected
            function (rejected) {

                CMDBuildUI.util.Logger.log(
                    rejected,
                    CMDBuildUI.util.Logger.levels.error);
            },
            Ext.emptyFn, this);
    }
});
