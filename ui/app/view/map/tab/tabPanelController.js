//TODO: move privates in separte file
Ext.define('CMDBuildUI.view.map.tab.tabPanelController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.map-tab-tabpanel',

    control: {
        '#': {
            // afterrender: 'onAfterRender',
            // tabchange: 'onTabChange',
            // beforerender: 'onBeforeRender'
        },

        '#map-legend': {
            disable: 'onLegendDisable',
            enable: 'onLegendEnable'
        }
    },
    // listen: {
    //     global: {
    //         // objectidchanged: 'objectIdChanged',
    //         //     geovaluesload: 'onGeovaluesLoad'
    //         // objectcustompageidchanged: 'objectIdChanged'
    //     }
    // },

    /**
     * fired by it's view Model
     * @event selectedchangeevent
     * @param {Object} selected 
     * {
     *  type: { String }
     *  id: { String }
     *  conf: {
     *      center: true || false,
     *      zoom: true || false
     *  
     *      }
     *  }
     * @param {Ext.data.Model} records CMDBuildUI.model.map.GeoElement the records rapresenting the geovalues of the selected card
     */
    onSelectedChange: function (selected, records) {
        CMDBuildUI.util.Logger.log(
            'Handle the selectionChangeEvent from the tabPabel',
            CMDBuildUI.util.Logger.levels.debug);
        var view = this.getView();

        // var cancelButtonView = view.down('#cancelButton');
        // if (cancelButtonView) {
        //     this.onCancelButtonClick(cancelButtonView);
        // }

        this.getViewModel().set('objectTypeName', selected.type);
        this.getViewModel().set('objectId', selected.id);
    },

    /**
     * @param tabPanel, 
     * @param newCard, 
     * @param oldCard, 
     * @param eOpts
     */
    onTabChange: function (tabPanel, newCard, oldCard, eOpts) {
        var n = tabPanel.items.findIndex('id', newCard.id);
        this.getViewModel().getParent().getParent().getParent().set('activeMapTabPanel', n);
    },

    /**
     * 
     * @param {Ext.Componend} legendTab 
     * @param {eOpts} eOpts 
     */
    onLegendDisable: function (legendTab, eOpts) {
        var view = this.getView();
        var vm = view.getViewModel();

        //if the active tab get's disabled change the active one
        if (view.getActiveTab().getId() == legendTab.getId()) {
            view.setActiveTab(0);
        }

        vm.set('checkchange.check', true);
        legendTab.tab.hide();
    },

    /**
     * 
     * @param {Ext.Component} legendTab 
     * @param {eOpts} eOpts 
     */
    onLegendEnable: function (legendTab, eOpts) {
        legendTab.tab.show();
        this.getView().setActiveTab(legendTab);
    }
});