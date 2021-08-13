Ext.define('CMDBuildUI.view.administration.content.classes.ViewController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.administration-content-classes-view',

    control: {
        '#': {
            beforerender: 'onBeforeRender',
            afterlayout: 'onAfterLayout'
        }
    },

    onBeforeRender: function (view) {
        Ext.getStore('importexports.Templates').load();        
    },
    onAfterLayout: function (panel) {
        Ext.GlobalEvents.fireEventArgs("showadministrationcontentmask", [false]);
    }
});
