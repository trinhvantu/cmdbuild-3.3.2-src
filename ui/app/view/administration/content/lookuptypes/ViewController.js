Ext.define('CMDBuildUI.view.administration.content.lookuptypes.ViewController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.administration-content-lookuptypes-view',

    control: {
        '#':{
            beforerender: 'onBeforeRender'
        }
    },
    onBeforeRender: function(view){       
        view.up('administration-content').getViewModel().set('title', CMDBuildUI.locales.Locales.administration.navigation.lookuptypes);
    }
});
