Ext.define('CMDBuildUI.view.administration.content.importexport.datatemplates.View', {
    extend: 'Ext.panel.Panel',

    alias: 'widget.administration-content-importexport-datatemplates-view',

    requires: [
        'CMDBuildUI.view.administration.content.importexport.datatemplates.ViewController',
        'CMDBuildUI.view.administration.content.importexport.datatemplates.ViewModel'
    ],

    controller: 'administration-content-importexport-datatemplates-view',
    viewModel: {
        type: 'administration-content-importexport-datatemplates-view'
    },
    itemId: 'administration-content-importexport-datatemplates',
    loadMask: true,
    defaults: {
        textAlign: 'left',
        scrollable: true
    },
    layout: 'border',

    listeners: {
        afterlayout: function (panel) {
            Ext.GlobalEvents.fireEventArgs("showadministrationcontentmask", [false]);
        }
    },

    initComponent: function () {
        CMDBuildUI.util.Stores.loadImportExportTemplatesStore();
        CMDBuildUI.util.Stores.loadEmailAccountsStore();
        CMDBuildUI.util.Stores.loadEmailTemplatesStore();
        var vm = this.getViewModel();
        vm.getParent().set('title', CMDBuildUI.locales.Locales.administration.importexport.texts.importexportdatatemplates);
        this.callParent(arguments);
    }
});