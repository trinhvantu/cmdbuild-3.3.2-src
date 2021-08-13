Ext.define('CMDBuildUI.view.bim.tab.cards.CardsModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.bim-tab-cards-cards',
    data: {
        name: 'CMDBuildUI'
    },
    formulas: {
        valueLabel: {
            bind: {
                objectTypeName: '{bim-tab-cards-cards.objectTypeName}'
            },
            get: function (data) {
                if (data.objectTypeName) {
                    return CMDBuildUI.util.helper.ModelHelper.getObjectDescription(data.objectTypeName);
                } else {
                    return '';
                }
            }
        },

        mode: {
            bind: {
                objectTypeName: '{bim-tab-cards-cards.objectTypeName}'
            },
            get: function (data) {
                if (data.objectTypeName) {
                    if (CMDBuildUI.util.helper.ModelHelper.getClassFromName(data.objectTypeName)) { //the type is a class
                        return CMDBuildUI.locales.Locales.relationGraph.class;
                    } else {
                        return '';
                    }
                } else {
                    return '';
                }
            }
        },

        calculateTheObject: {
            bind: {
                objectId: '{bim-tab-cards-cards.objectId}',
                objectTypeName: '{bim-tab-cards-cards.objectTypeName}'
            },
            get: function (data) {

                if (data.objectTypeName) {
                    if (data.objectId) {

                        CMDBuildUI.util.helper.ModelHelper.getModel(CMDBuildUI.util.helper.ModelHelper.objecttypes.klass, data.objectTypeName).then(function (model) {

                            var theObject = Ext.create(model.getName(), {
                                _id: data.objectId
                            });

                            if (!Ext.isEmpty(this._last_load)) {
                                this._last_load.abort();
                            }

                            this._last_load = theObject.load({
                                callback: function (record, operation, success) {
                                    if (success) {
                                        if (this.getView() && !this.getView().destroyed) {
                                            this.getView().setTheObject(theObject);
                                        }
                                        this._last_load = null;
                                    }
                                },
                                scope: this
                            });
                        }, Ext.emptyFn, Ext.emptyFn, this);

                    } else {
                        this.getView().setTheObject(null);
                    }
                }
            }
        },

        canUpdate: {
            bind: {
                _can_update: '{bim-tab-cards-cards.theObject._model.' + CMDBuildUI.model.base.Base.permissions.edit + '}'
            }, get: function (data) {
                return !data._can_update;
            }
        }
    }
});
