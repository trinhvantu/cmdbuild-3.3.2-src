Ext.define('CMDBuildUI.view.administration.content.importexport.datatemplates.ViewController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.administration-content-importexport-datatemplates-view',

    control: {
        '#': {
            beforerender: 'onBeforeRender'
        }
    },

    onBeforeRender: function(view){
        var vm = this.getViewModel();
        vm.set('title', CMDBuildUI.locales.Locales.administration.importexport.texts.importexportdatatemplates);

        if (vm.get("showInMainPanel")) {
            view.add({ 
                xtype: 'administration-content-importexport-datatemplates-topbar', 
                region: 'north'
            });            
            if(!vm.get('hideForm')){
                CMDBuildUI.util.Stores.loadEmailAccountsStore();
                CMDBuildUI.util.Stores.loadEmailTemplatesStore();
                view.add({
                    xtype: 'tabpanel',
                    cls: 'administration',
                    ui: 'administration-tabandtools',
                    region: 'center', 
                    items: [{
                        xtype: 'panel',
                        layout: 'card',
                        title: CMDBuildUI.locales.Locales.administration.classes.properties.title,
                        scrollable: true,                        
                        viewModel: {
                            links: {
                                theGateTemplate: vm.get("templateId") ? {
                                    type: 'CMDBuildUI.model.importexports.Template',
                                    id: vm.get("templateId")
                                } : {
                                    type: 'CMDBuildUI.model.importexports.Template',
                                    create: true
                                }
                            }
                        },
                        items: [{
                            xtype: 'administration-content-importexport-datatemplates-card',
                            viewModel: {
                                data: {
                                    action: vm.get("action"),
                                    actions: vm.get("actions")
                                }
                            }
                        }]
                    }]
                });
            }
        } else {
            view.add({ 
                xtype: 'administration-content-importexport-datatemplates-grid', 
                region: 'center', 
                bind: {
                    hidden:'{isGridHidden}'
                } 
            });
        }
    }
});
