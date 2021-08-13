Ext.define('CMDBuildUI.view.emails.GridModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.emails-grid',

    data: {
        readonly: true
    },

    formulas: {
        updateCounter: {
            bind: '{emails}',
            get: function(emails) {
                if (emails) {
                    var me = this;
                    me.getView().mon(emails, "datachanged", function(store, eOpts) {
                        me.set("tabcounters.emails", store.getCount());
                    });
                }
            }
        },
        updateButtonUsability: {
            get: function () {
                var view = this.getView();
                if (view.isFormWritable()) {
                    this.set('disableButtonOnView', false);
                } else {
                    this.set('disableButtonOnView', true);
                }
                this.set('readonly', this.getView().getReadOnly());
            }
        }
    }
});