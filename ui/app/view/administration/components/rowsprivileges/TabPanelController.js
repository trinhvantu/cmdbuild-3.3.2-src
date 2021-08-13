Ext.define('CMDBuildUI.view.administration.components.rowsprivileges.TabPanelController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.administration-components-rowsprivileges-tabpanel',
    requires: [
        'CMDBuildUI.util.administration.helper.TabPanelHelper'
    ],

    control: {
        '#': {
            beforerender: "onBeforeRender"
        }
    },

    /**
     * @param {CMDBuildUI.view.administration.content.groupsandpermissions.TabPanel} view
     * @param {Object} eOpts
     */
    onBeforeRender: function (view, eOpts) {
        var vm = this.getViewModel();

        var currentTabIndex = 0;
        var tabPanelHelper = CMDBuildUI.util.administration.helper.TabPanelHelper;
        tabPanelHelper.addTab(view, "attribute", CMDBuildUI.locales.Locales.administration.attributes.attributes, [{
            xtype: 'administration-filters-attributes-panel',
            autoScroll: true
        }], 0, {

        });
        tabPanelHelper.addTab(view, "function", CMDBuildUI.locales.Locales.administration.common.labels.funktion, [{
            xtype: 'administration-components-functionfilters-panel',
            autoScroll: true
        }], 1, {

        });
        vm.set("activeTab", currentTabIndex);
    }
});