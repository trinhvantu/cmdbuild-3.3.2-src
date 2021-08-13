Ext.define('CMDBuildUI.view.filters.attachments.PanelController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.filters-attachments-panel',

    /**
     * Clear text
     */
    onSearchTextClearClick: function() {
        this.getViewModel().set("attachments.searchtext", null);
    }
    
});
