Ext.define('CMDBuildUI.view.map.tab.cards.ListController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.map-tab-cards-list',

    listen: {
        component: {
            '#': {
                beforerender: 'onBeforeRender',
                afterrender: 'onAfterRender',
                selectionchange: 'onSelectionChange'
            }
        }
    },

    /**
      * @param {CMDBuildUI.view.classes.cards.Grid} view
      * @param {Object} eOpts
      */
    onBeforeRender: function (view, eOpts) {
        var vm = this.getViewModel();

        //configure columns
        vm.bind({
            objectType: '{map-tab-tabpanel.objectType}',
            objectTypeName: '{map-tab-tabpanel.objectTypeName}'
        }, function (data) {
            if (data.objectType && data.objectTypeName) {
                CMDBuildUI.util.helper.ModelHelper.getModel(data.objectType, data.objectTypeName).then(function (model) {
                    if (!view.destroyed) {
                        view.reconfigure(null, CMDBuildUI.util.helper.GridHelper.getColumns(model.getFields(), {
                            allowFilter: view.getAllowFilter(),
                            reducedGrid: true
                        }));
                    }
                });
            }
        });
    },

    /**
      * @param {CMDBuildUI.view.classes.cards.Grid} view
      * @param {Object} eOpts
      */
    onAfterRender: function (view, eOpts) {
        var vm = this.getViewModel();

        //selects element
        vm.bind({
            store: '{cards}',
            objectId: '{map-tab-cards-list.objectId}'
        }, function (data) {
            if (data.store) {
                this.findAndSelectRowInGrid(data.objectId);
            }
        }, this);
    },

    /**
     * 
     * @param {Ext.selection.Model} selectionModel 
     * @param {Ext.data.Model[]} selected 
     * @param {Object} eOpts 
     */
    onSelectionChange: function (selectionModel, selected, eOpts) {
        this.getView().setObjectId(selected && selected[0] ? Ext.num(selected[0].getId()) : null);
    },

    /**
     * 
     * @param {String} objectId 
     */
    findAndSelectRowInGrid: function (objectId) {
        var view = this.getView();

        var selection = view.getSelectionModel().getSelection();
        if (!objectId) { //Deselect all the rows
            view.getSelectionModel().deselectAll();

        } else { // Selects the row

            if (selection && selection[0] && selection[0].getId() == objectId) { // if the selection is already set return
                return;

            } else { //find the correct record and set it as selected
                var store = view.getStore();

                function selectRecord() {
                    var i = store.find('_id', objectId);
                    var record = store.getAt(i);

                    if (record) {
                        Ext.asap(function (view, record) {
                            if (view && !view.destroyed) {
                                view.getView().refresh(); //https://stackoverflow.com/questions/43898410/rendered-block-refreshed-at-16-rows-while-bufferedrenderer-view-size-is-46/#50376960
                                view.getSelectionModel().select([record], false, true); //HACK: avoid propagation 
                                view.ensureVisible(record);
                            }
                        }, this, [view, record]);

                        return true;
                    }
                    return false;
                }

                if (!selectRecord()) {
                    var extraparams = store.getProxy().getExtraParams();
                    extraparams.positionOf = objectId;
                    extraparams.positionOf_goToPage = false;
                    store.load({
                        callback: function () {
                            var metadata = store.getProxy().getReader().metaData;
                            var posinfo = (metadata && metadata.positions) && metadata.positions[objectId] || { positionInPage: 0 };
                            if (!posinfo.pageOffset) {
                                Ext.asap(function () {
                                    selectRecord();
                                });
                            } else {
                                view.ensureVisible(posinfo.positionInTable, {
                                    callback: function () {
                                        selectRecord();
                                    }
                                });
                            }
                        }
                    });
                }
            }
        }
    }
});
