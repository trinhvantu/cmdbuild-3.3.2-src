Ext.define('CMDBuildUI.view.administration.content.dms.dmscategorytypes.tabitems.values.card.CardModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.administration-content-dms-dmscategorytypes-tabitems-values-card',

    data: {
        theValue: null,
        actions: {
            view: false,
            add: false,
            edit: false
        },
        valueIconType: {
            isImageOrNone: false,
            isFontOrNone: false,
            isNone: false
        },
        isIconFileRequired: false,
        parentTypeName: null,
        storedata: {
            url: null,
            autoLoad: false
        },
        theTranslation: null
    },

    formulas: {       
        action: {
            bind: {
                theValue: '{theValue}',
                view: '{actions.view}',
                add: '{actions.add}',
                edit: '{actions.edit}'
            },
            get: function (data) {
                if (data.edit) {
                    this.set('formModeCls', 'formmode-edit');
                    return CMDBuildUI.util.administration.helper.FormHelper.formActions.edit;
                } else if (data.add) {
                    this.set('formModeCls', 'formmode-add');
                    return CMDBuildUI.util.administration.helper.FormHelper.formActions.add;
                } else {
                    this.set('formModeCls', 'formmode-view');
                    return CMDBuildUI.util.administration.helper.FormHelper.formActions.view;
                }
            },
            set: function (value) {
                this.set('actions.view', value === CMDBuildUI.util.administration.helper.FormHelper.formActions.view);
                this.set('actions.edit', value === CMDBuildUI.util.administration.helper.FormHelper.formActions.edit);
                this.set('actions.add', value === CMDBuildUI.util.administration.helper.FormHelper.formActions.add);
            }
        },       
        parentDescriptionData: {
            bind: {
                parentId: '{theValue.parent_id}',
                store: '{parentDMSCategoriesStoreCard}'
            },
            get: function (data) {
                var me = this;
                if (data.store.getData().getRange().length) {
                    var parent = data.store.getData().getRange().find(function (element) {
                        return element.get('_id') === data.parentId.toString();
                    });
                    me.set('parentDescription', (parent) ? parent.get('description') : '');
                } else if (!data.store.isLoaded()) {
                    data.store.on('load', function () {
                        var parent = data.store.getData().getRange().find(function (element) {
                            return element.get('_id') === data.parentId.toString();
                        });
                        me.set('parentDescription', (parent) ? parent.get('description') : '');
                    });
                }

            }
        },      

        panelTitle: {
            bind: '{theValue.description}',
            get: function (description) {
                var title;
                if (description) {
                    title = Ext.String.format(
                        '{0} - {1}',
                        CMDBuildUI.util.helper.SessionHelper.getViewportVM().getView().down('administration-content-dms-dmscategorytypes-tabitems-type-properties').lookupViewModel().get('theDMSCategoryType.name'),
                        this.getData().theValue.get('description')
                    );

                } else {
                    title = Ext.String.format(
                        '{0}',
                        CMDBuildUI.util.helper.SessionHelper.getViewportVM().getView().down('administration-content-dms-dmscategorytypes-tabitems-type-properties').lookupViewModel().get('theDMSCategoryType.name')
                    );
                }
                this.getParent().set('title', title);
            }
        },

        toolAction: {
            bind: '{_is_system}',
            get: function(_is_system){                      
                    return {
                        _canDelete: !_is_system,
                        _canActiveToggle: !_is_system
                    };                
            }
        },
        checkCountStoreData: function(){
            return CMDBuildUI.util.administration.helper.ModelHelper.getDMSCountCheckModes('dmsCategory');
        },

        checkCountNumberHidden: {
            bind: '{theValue.checkCount}',
            get: function(checkCount){
                
                if(Ext.isEmpty(checkCount) || checkCount === CMDBuildUI.model.dms.DMSModel.checkCount.no_check){
                    return true;
                }
                return false;
            }
        }
    },
    stores: {               
        DMSModelsStore: {            
            source: 'dms.DMSModels',
            filters: [function(item){                
                return item.get('active') && item.get('name') !== CMDBuildUI.model.dms.DMSModel.masterParentClass && !item.get('prototype');
            }]
        },
        checkCountStore: {
            model: 'CMDBuildUI.model.base.ComboItem',
            proxy: {
                type: 'memory'
            },
            data: '{checkCountStoreData}',
            autoDestroy: true
        }
    }
});