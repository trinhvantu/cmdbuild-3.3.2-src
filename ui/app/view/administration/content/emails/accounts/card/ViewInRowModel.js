Ext.define('CMDBuildUI.view.administration.content.emails.accounts.card.ViewInRowModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.administration-content-emails-accounts-card-viewinrow',
    data: {
        name: 'CMDBuildUI'
    },

    formulas: {

        updateRemoveAccount: {
            bind: {
                defaultAccount: '{theAccount.default}'
            },
            get: function (data) {
                this.set('isDefault', data.defaultAccount);
            }
        },

        updateDisplayPassword: {
            bind: {
                password: '{theAccount.password}'
            },
            get: function (data) {
                var hiddenPassword = CMDBuildUI.util.administration.helper.RendererHelper.getDisplayPassword(data.password);
                this.set('hiddenPassword', hiddenPassword);
            }
        }
    }
});