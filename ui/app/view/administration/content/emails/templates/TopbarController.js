Ext.define('CMDBuildUI.view.administration.content.emails.templates.TopbarController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.administration-content-emails-templates-topbar',

    control: {
        '#addtemplate': {
            click: 'onNewTemplateBtnClick'
        }
    },

    /**
     * 
     * @param {Ext.menu.Item} item
     * @param {Ext.event.Event} event
     * @param {Object} eOpts
     */
    onNewTemplateBtnClick: function (item, event, eOpts) {
        var container = Ext.getCmp(CMDBuildUI.view.administration.DetailsWindow.elementId) || Ext.create(CMDBuildUI.view.administration.DetailsWindow);        
        container.removeAll();
        container.add({
            xtype: 'administration-content-emails-templates-card-form',
            viewModel: {
                links: {
                    theTemplate: {
                        type: 'CMDBuildUI.model.emails.Template',
                        create: true
                    }
                },
                data: {                  
                    actions: {
                        view: false,
                        add: true,
                        edit: false
                    }
                }
            }
        });

    }
});