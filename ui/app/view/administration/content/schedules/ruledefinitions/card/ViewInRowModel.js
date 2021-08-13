Ext.define('CMDBuildUI.view.administration.content.schedules.ruledefinitions.card.ViewInRowModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.administration-content-schedules-ruledefinitions-card-viewinrow',
    data: {
        action: CMDBuildUI.util.administration.helper.FormHelper.formActions.view,
        actions: {
            view: true,
            edit: false,
            add: false
        }
    },
    formulas: {
        attributeProxyManager: {
            bind: {
                ownerClass: '{theSchedule.ownerClass}'
            },
            get: function (data) {
                this.set(
                    'attributeProxy.url',
                    CMDBuildUI.util.administration.helper.ApiHelper.server.getAttributeUrl(data.ownerClass)
                );
                this.set('attributeProxy.autoload', true);                
            }
        }
    },
    stores: {
        attributesStore: {
            type: 'attributes',
            proxy: {
                url: '{attributeProxy.url}'
            },
            autoLoad: '{attributeProxy.autoload}'
        }
    }
});
