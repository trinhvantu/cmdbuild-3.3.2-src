
Ext.define('CMDBuildUI.view.administration.content.dms.dmscategorytypes.Topbar', {
    extend: 'Ext.form.Panel',

    requires: [
        'CMDBuildUI.view.administration.content.dms.dmscategorytypes.TopbarController',
        'CMDBuildUI.view.administration.content.dms.dmscategorytypes.TopbarModel'
    ],

    alias: 'widget.administration-content-dms-dmscategorytypes-topbar',
    controller: 'administration-content-dms-dmscategorytypes-topbar',
    viewModel: {
        type: 'administration-content-dms-dmscategorytypes-topbar'
    },
    config: {
        objectTypeName: null,
        allowFilter: true,
        showAddButton: true
    },

    forceFit: true,
    loadMask: true,

    tbar: [{
        xtype: 'button',
        text: CMDBuildUI.locales.Locales.administration.dmscategories.adddmscategory,
        localized: {
            text: 'CMDBuildUI.locales.Locales.administration.dmscategories.adddmscategory'
        },
        ui:'administration-action-small',
        reference: 'addDMSCategory',
        itemId: 'addDMSCategory',
        iconCls: 'x-fa fa-plus',
        autoEl: {
            'data-testid': 'administration-class-toolbar-addDMSCtegoryTypeBtn'
        },        
        bind: {
            disabled: '{!toolAction._canAdd}'
        } 
    }, {
        xtype: 'textfield',
        name: 'search',
        width: 250,
        emptyText:  CMDBuildUI.locales.Locales.administration.lookuptypes.toolbar.searchTextInput.emptyText,
        localized: {
            emptyText:  'CMDBuildUI.locales.Locales.administration.dmscategories.searchalldmscategories'
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
                    'data-testid': 'administration-DMSCategories-toolbar-form-search-trigger'
                }
            },
            clear: {
                cls: Ext.baseCSSPrefix + 'form-clear-trigger',
                handler: 'onSearchClear',
                autoEl: {
                    'data-testid': 'administration-DMSCategories-toolbar-form-clear-trigger'
                }
            }
        },
        autoEl: {
            'data-testid': 'administration-DMSCategories-toolbar-search-form'
        }
    },{
        xtype: 'tbfill'
    }, {
        xtype: 'tbtext',
        dock: 'right',
        bind: {
            html: '{DMSCategoryLabel}: <b data-testid="administration-DMSCategories-toolbar-className">{theDMSCategoryType.name}</b>'
        }
    }],

    initComponent: function () {        
        var vm = this.lookupViewModel();                
        vm.getParent().set('title', CMDBuildUI.locales.Locales.administration.navigation.lookuptypes);
        this.callParent(arguments);
    }
});
