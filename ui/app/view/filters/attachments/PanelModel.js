Ext.define('CMDBuildUI.view.filters.attachments.PanelModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.filters-attachments-panel',

    data: {
        attachments: {
            searchtext: null
        }
    },

    formulas: {
        updateFromDefault: {
            bind: {
                filter: '{theFilter}'
            },
            get: function(data) {
                var config = data.filter.get("configuration");
                if (config.attachment && !Ext.isEmpty(config.attachment.query)) {
                    this.set("attachments.searchtext", config.attachment.query)
                }
            }
        }
    }

});
