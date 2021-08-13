Ext.define('CMDBuildUI.view.administration.content.emails.templates.GridModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.administration-content-emails-templates-grid',
    data: {
        actions: {
            add: false,
            edit: false,
            view: true
        }
    },
    
    stores: {
        templates: {
            model: 'CMDBuildUI.model.emails.Template',
            autoLoad: true,
            autoDestroy: true,
            proxy: {
                url: CMDBuildUI.util.api.Emails.getTemplatesUrl(),
                type: 'baseproxy',
                extraParams: {
                    detailed: true
                }
            },
            pageSize: 0
        }
    }
});