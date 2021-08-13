Ext.define('CMDBuildUI.view.joinviews.configuration.ConfigurationModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.joinviews-configuration-configuration',
    data: {
        activeTab: null,
        theView: null
    },

    formulas: {

        theViewManager: {
            bind: '{theView}',
            get: function (theView) {                
                if(this.get('showForm') === 'false'){
                    this.set('panelTitle', CMDBuildUI.locales.Locales.joinviews.joinview);
                }
                Ext.asap(function () {
                    this.set('activeTab', this.get('activeTabs.joinView') || 0);
                }, this);
            }
        },
        panelTitleManager: {
            bind: {
                panelTitle: '{panelTitle}'
            },
            get: function (data) {                
                var me = this;                
                me.getParent().set('title', data.panelTitle);
            }
        }
    }

});