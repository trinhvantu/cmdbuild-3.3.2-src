
Ext.define('CMDBuildUI.view.administration.content.dms.models.Topbar', {
    extend: 'Ext.form.Panel',

    requires: [
        'CMDBuildUI.view.administration.content.dms.models.TopbarController'
    ],

    alias: 'widget.administration-content-dms-models-topbar',
    controller: 'administration-content-dms-models-topbar',
   
    config: {
        objectTypeName: null,
        allowFilter: true,
        showAddButton: true
    },

    forceFit: true,
    loadMask: true,

    tbar: [{
        xtype: 'button',
        text: CMDBuildUI.locales.Locales.administration.dmsmodels.adddmsmodel,
        localized: {
            text : 'CMDBuildUI.locales.Locales.administration.dmsmodels.adddmsmodel'
        },
        ui:'administration-action-small',
        reference: 'adddmsmodel',
        itemId: 'adddmsmodel',
        iconCls: 'x-fa fa-plus',
        autoEl: {
            'data-testid': 'administration-dms-models-toolbar-addDMSModelBtn'
        },        
        listeners: {
            render: function(){
                this.setDisabled(!this.lookupViewModel().get('theSession.rolePrivileges.admin_dms_modify'));
            }
        }
    }, {
        xtype: 'textfield',
        name: 'search',
        width: 250,
        emptyText:  CMDBuildUI.locales.Locales.administration.classes.toolbar.searchTextInput.emptyText,
        localized: {
            emptyText:  'CMDBuildUI.locales.Locales.administration.dmsmodels.searchalldmsmodels'
        },
        cls: 'administration-input',
        reference: 'searchtext',
        itemId: 'searchtext',
        bind: {            
            hidden: '{!canFilter}'
        },
        listeners: {
            specialkey: 'onSearchSpecialKey'
        },
        triggers: {
            search: {
                cls: Ext.baseCSSPrefix + 'form-search-trigger',
                handler: 'onSearchSubmit',
                autoEl: {
                    'data-testid': 'administration-dms-model-toolbar-form-search-trigger'
                }
            },
            clear: {
                cls: Ext.baseCSSPrefix + 'form-clear-trigger',
                handler: 'onSearchClear',
                autoEl: {
                    'data-testid': 'administration-dms-model-toolbar-form-clear-trigger'
                }
            }
        },
        autoEl: {
            'data-testid': 'administration-dms-model-toolbar-search-form'
        }
    },{
        xtype: 'tbfill'
    }, {
        xtype: 'tbtext',
        dock: 'right',
        bind: {
            hidden: '{actions.empty}',
            html:  '{dmsmodelLabel}: <b data-testid="administration-class-toolbar-className">{theModel.name}</b>'
        }
    }]
});
