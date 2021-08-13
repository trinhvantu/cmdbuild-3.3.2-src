Ext.define('CMDBuildUI.view.administration.content.setup.elements.BimModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.administration-content-setup-elements-bim',
    formulas: {
        updateDisplayPassword: {
            bind: {
                password: '{theSetup.org__DOT__cmdbuild__DOT__bim__DOT__password}'
            },
            get: function (data) {
                var hiddenPassword = CMDBuildUI.util.administration.helper.RendererHelper.getDisplayPassword(data.password);
                this.set('hiddenPassword', hiddenPassword);
            }
        }
    }
});
