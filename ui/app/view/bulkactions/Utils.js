Ext.define('CMDBuildUI.view.bulkactions.Util', {
    singleton: true,

    /**
     * 
     * @param {Ext.grid.Panel} grid 
     * @return {Object} Object with `url`, `advancedFitler` and `count`.
     */
    getRequestInfo: function(grid) {
        var store = grid.getStore(),
            selection = grid.getSelection(),
            resp = {
                url: store.getProxy().getUrl(),
                advancedFitler: undefined,
                count: undefined
            };

        // evaluate advanced filter and count
        if (grid.isSelectAllPressed) {
            // if select all advanced fitler becomes store filter 
            // and count becomes store total count
            resp.advancedFitler = store.getAdvancedFilter();
            resp.count = store.getTotalCount();
        } else {
            // if not select all create a filter with ID attribute 
            // and value the list of selected items. Count is the 
            // lenght of the array
            resp.advancedFitler = new CMDBuildUI.util.AdvancedFilter();
            var selectedids = [];
            selection.forEach(function (sel) {
                selectedids.push(sel.getId());
            });
            resp.advancedFitler.addAttributeFilter('Id', 'in', selectedids);
            resp.count = selectedids.length;
        }
        return resp;
    },

    delete: function(grid) {
        // get request info
        var requestinfo = CMDBuildUI.view.bulkactions.Util.getRequestInfo(grid),
            type = grid.lookupViewModel().get("objectTypeName");

        // create confirm message
        var message = Ext.String.format(
            CMDBuildUI.locales.Locales.bulkactions.confirmdelete,
            requestinfo.count
        );

        CMDBuildUI.view.classes.cards.Util.getDeleteMsg(type, requestinfo.advancedFitler.encode(), message).then(function() {
            var loadmask = CMDBuildUI.util.Utilities.addLoadMask(grid);
            // make ajax request
            Ext.Ajax.request({
                url: requestinfo.url,
                method: 'DELETE',
                jsonData: {},
                params: {
                    filter: requestinfo.advancedFitler.encode()
                },
                callback: function (request, success, response) {
                    CMDBuildUI.util.Utilities.removeLoadMask(loadmask);
                    if (success) {
                        grid.setSelection();
                        // reload store
                        grid.getStore().load();
                    }
                }
            });
        });
    },

    abort: function(grid) {
        // get request info
        var requestinfo = CMDBuildUI.view.bulkactions.Util.getRequestInfo(grid);

        // create confirm message
        var message = Ext.String.format(
            CMDBuildUI.locales.Locales.bulkactions.confirmabort,
            requestinfo.count
        );

        CMDBuildUI.util.Msg.confirm(
            CMDBuildUI.locales.Locales.notifier.attention,
            message,
            function (btn) {
                if (btn === "yes") {
                    // make ajax request
                    var loadmask = CMDBuildUI.util.Utilities.addLoadMask(grid);
                    Ext.Ajax.request({
                        url: requestinfo.url,
                        method: 'DELETE',
                        jsonData: {},
                        params: {
                            filter: requestinfo.advancedFitler.encode()
                        },
                        callback: function (request, success, response) {
                            CMDBuildUI.util.Utilities.removeLoadMask(loadmask);
                            if (success) {
                                grid.setSelection();
                                // reload store
                                grid.getStore().load();
                            }
                        }
                    })
                }
            }
        );
    }
});