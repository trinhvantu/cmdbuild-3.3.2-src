Ext.define('CMDBuildUI.view.views.items.GridModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.views-items-grid',

    data: {
        objectType: CMDBuildUI.util.helper.ModelHelper.objecttypes.view,
        objectTypeName: null,
        storeinfo: {
            autoLoad: false
        }
    },

    formulas: {

        updateData: {
            bind: {
                objectTypeName: '{objectTypeName}'
            },
            get: function (data) {
                if (data.objectTypeName) {
                    // view data
                    var viewdata = CMDBuildUI.util.helper.ModelHelper.getViewFromName(data.objectTypeName);
                    this.set("title", viewdata.get("description"));

                    // enable or disable print button
                    var canprint = !Ext.isEmpty(viewdata.get("_can_print")) ? viewdata.get("_can_print") : true;
                    this.set("disabledbuttons.print", !canprint);

                    // model name
                    var modelName = CMDBuildUI.util.helper.ModelHelper.getModelName(
                        CMDBuildUI.util.helper.ModelHelper.objecttypes.view,
                        data.objectTypeName
                    );
                    this.set("storeinfo.modelname", modelName);

                    var model = Ext.ClassManager.get(modelName);
                    this.set("storeinfo.proxytype", model.getProxy().type);
                    this.set("storeinfo.url", model.getProxy().getUrl());

                    // sort
                    var sorters = [];
                    var preferences = CMDBuildUI.util.helper.UserPreferences.getGridPreferences(
                        CMDBuildUI.util.helper.ModelHelper.objecttypes.view,
                        data.objectTypeName
                    );

                    if (preferences && !Ext.isEmpty(preferences.defaultOrder)) {
                        preferences.defaultOrder.forEach(function (o) {
                            sorters.push({
                                property: o.attribute,
                                direction: o.direction === "descending" ? "DESC" : 'ASC'
                            });
                        });
                    }
                    this.set("storeinfo.sorters", sorters);

                    // auto load
                    this.set("storeinfo.autoload", true);
                }
            }
        }
    },

    stores: {
        items: {
            type: 'buffered',
            model: '{storeinfo.modelname}',
            autoLoad: '{storeinfo.autoload}',
            pageSize: 100,
            proxy: {
                type: '{storeinfo.proxytype}',
                url: '{storeinfo.url}'
            },
            sorters: '{storeinfo.sorters}',
            autoDestroy: true
        }
    }

});