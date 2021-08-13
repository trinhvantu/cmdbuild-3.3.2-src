Ext.define('CMDBuildUI.view.administration.content.setup.elements.WorkflowModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.administration-content-setup-elements-workflow',

    formulas: {
        updateDisplayPassword: {
            bind: {
                password: '{theSetup.org__DOT__cmdbuild__DOT__workflow__DOT__password}'
            },
            get: function (data) {
                var hiddenPassword = CMDBuildUI.util.administration.helper.RendererHelper.getDisplayPassword(data.password);
                this.set('hiddenPassword', hiddenPassword);
            }
        },
        isSharkDefault: {
            bind: {
                providers: '{theSetup.org__DOT__cmdbuild__DOT__workflow__DOT__providers}'
            },
            get: function (data) {
                if (data.providers) {
                    var providers = this.getProvidersArray();
                    return providers[0] === 'shark';
                }
            },
            set: function (value) {
                var providers = this.getProvidersArray();
                if (value) {
                    providers.unshift('shark');
                }
                this.set('theSetup.org__DOT__cmdbuild__DOT__workflow__DOT__providers', Ext.Array.unique(providers).join(','));                
            }
        },
        isSharkEnabled: {
            bind: {
                providers: '{theSetup.org__DOT__cmdbuild__DOT__workflow__DOT__providers}'
            },
            get: function (data) {
                if (data.providers) {
                    return Ext.Array.contains(this.getProvidersArray(), 'shark');
                }
            },
            set: function (value) {
                var providers = this.getProvidersArray();
                if (value) {
                    providers.push('shark');
                } else {
                    Ext.Array.remove(providers, 'shark');
                }
                this.set('theSetup.org__DOT__cmdbuild__DOT__workflow__DOT__providers', Ext.Array.unique(providers).join(','));                
            }
        },
        isRiverDefault: {
            bind: {
                providers: '{theSetup.org__DOT__cmdbuild__DOT__workflow__DOT__providers}'
            },
            get: function (data) {
                if (data.providers) {
                    var providers = this.getProvidersArray();
                    return providers[0] === 'river';
                }
            },
            set: function (value) {
                var providers = this.getProvidersArray();
                if (value) {
                    providers.unshift('river');
                }
                this.set('theSetup.org__DOT__cmdbuild__DOT__workflow__DOT__providers', Ext.Array.unique(providers).join(','));                
            }
        },
        isRiverEnabled: {
            bind: {
                providers: '{theSetup.org__DOT__cmdbuild__DOT__workflow__DOT__providers}'
            },
            get: function (data) {
                if (data.providers) {
                    return Ext.Array.contains(this.getProvidersArray(), 'river');
                }
            },
            set: function (value) {                
                var providers = this.getProvidersArray();
                if (value) {
                    providers.push('river');
                } else {
                    Ext.Array.remove(providers, 'river');
                }
                this.set('theSetup.org__DOT__cmdbuild__DOT__workflow__DOT__providers', Ext.Array.unique(providers).join(','));
            }
        }
    },
    privates: {
        getProvidersArray: function () {
            var providers = this.get('theSetup.org__DOT__cmdbuild__DOT__workflow__DOT__providers');
            if (providers.length) {
                return providers.split(',');
            }
            return [];
        }
    }
});