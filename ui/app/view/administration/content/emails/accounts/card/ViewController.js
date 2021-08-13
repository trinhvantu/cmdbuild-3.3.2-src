Ext.define('CMDBuildUI.view.administration.content.emails.accounts.card.ViewController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.administration-content-emails-accounts-card-view',
    control: {
        '#': {
            beforeRender: 'onBeforeRender'
        },
        '#editBtn': {
            click: 'onEditBtnClick'
        }
    },

    /**
     * @param {CMDBuildUI.view.administration.content.emails.templates.card.CreateController} view
     * @param {Object} eOpts
     */
    onBeforeRender: function (view, eOpts) {
        var title = view.getViewModel().get('theAccount').get('name');
        view.up('administration-detailswindow').getViewModel().set('title', title);
    },

    /**
     * @param {Ext.button.Button} button
     * @param {Event} e
     * @param {Object} eOpts
     */
    onEditBtnClick: function (button, e, eOpts) {
        var account = this.getViewModel().get('theAccount');
        var container = Ext.getCmp(CMDBuildUI.view.administration.DetailsWindow.elementId) || Ext.create(CMDBuildUI.view.administration.DetailsWindow);
        container.removeAll();
        container.add({
            xtype: 'administration-content-emails-accounts-card-edit',
            viewModel: {
                data: {
                    theAccount: account
                }
            }
        });
    }
});