Ext.define('CMDBuildUI.view.classes.cards.grid.ContainerModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.classes-cards-grid-container',

    data: {
        objectType: CMDBuildUI.util.helper.ModelHelper.objecttypes.klass,
        objectTypeName: null,
        addbtn: {},
        defaultfilter: null,
        storeinfo: {
            autoload: false,
            advancedfilter: null
        },
        search: {
            value: null
        }
    },

    formulas: {
        updateData: {
            bind: {
                objectTypeName: '{objectTypeName}'
            },
            get: function (data) {
                if (data.objectTypeName) {
                    // class description
                    var desc = CMDBuildUI.util.helper.ModelHelper.getClassDescription(data.objectTypeName);
                    var me = this;
                    this.set("objectTypeDescription", desc);
                    this.set("title", Ext.String.format("{0} {1}", CMDBuildUI.locales.Locales.classes.cards.label, desc));
                    // model name
                    var modelName = CMDBuildUI.util.helper.ModelHelper.getModelName(
                        CMDBuildUI.util.helper.ModelHelper.objecttypes.klass,
                        data.objectTypeName
                    );
                    this.set("storeinfo.modelname", modelName);

                    var model = Ext.ClassManager.get(modelName);
                    this.set("storeinfo.proxytype", model.getProxy().type);
                    this.set("storeinfo.url", model.getProxy().getUrl());
                    var filter = this.getView().getFilter();

                    CMDBuildUI.util.helper.FiltersHelper.applyFilter(filter, me).then(function (objectfilter) {

                        if (!this.destroyed) {
                            if (filter) {
                                me.set("storeinfo.advancedfilter", {
                                    baseFilter: objectfilter
                                });
                            }

                            var klass = CMDBuildUI.util.helper.ModelHelper.getClassFromName(data.objectTypeName);
                            var preferences = CMDBuildUI.util.helper.UserPreferences.getGridPreferences(
                                CMDBuildUI.util.helper.ModelHelper.objecttypes.klass,
                                data.objectTypeName
                            );
                            // sorters
                            var sorters = [];
                            if (preferences && !Ext.isEmpty(preferences.defaultOrder)) {
                                preferences.defaultOrder.forEach(function (o) {
                                    sorters.push({
                                        property: o.attribute,
                                        direction: o.direction === "descending" ? "DESC" : 'ASC'
                                    });
                                });
                            } else if (klass && klass.defaultOrder().getCount()) {
                                klass.defaultOrder().getRange().forEach(function (o) {
                                    sorters.push({
                                        property: o.get("attribute"),
                                        direction: o.get("direction") === "descending" ? "DESC" : 'ASC'
                                    });
                                });
                            } else if (!klass.isSimpleClass()) {
                                sorters.push({
                                    property: 'Description'
                                });
                            }

                            var autoload = true;
                            // default filter
                            if (klass && klass.getCurrentFilter && klass.getCurrentFilter()) {
                                me.set("defaultfilter", klass.getCurrentFilter());
                                autoload = false;
                            }

                            me.set("storeinfo.sorters", sorters);

                            // auto load
                            me.set("storeinfo.autoload", autoload);
                            // enable or disable print button
                            var canPrint = !Ext.isEmpty(klass.get("_can_print")) ? klass.get("_can_print") : true;
                            me.set('btnCanPrintDisabled', !canPrint);
                            // add button
                            me.set("addbtn.text", CMDBuildUI.locales.Locales.classes.cards.addcard + ' ' + desc);
                        }
                    }, Ext.emptyFn, Ext.emptyFn, this);

                }
            }
        },
        btnMapHidden: function () {
            var configuration = CMDBuildUI.util.helper.Configurations.get(CMDBuildUI.model.Configuration.gis.enabled);
            var gis_access = CMDBuildUI.util.helper.SessionHelper.getCurrentSession().get("rolePrivileges").gis_access;
            return !(configuration && gis_access);
        },
        btnMapText: {
            bind: '{activeView}',
            get: function (activeView) {
                if (activeView === "map") {
                    return CMDBuildUI.locales.Locales.gis.list;
                } else {
                    return CMDBuildUI.locales.Locales.gis.map;
                }
            }
        },

        btnIconCls: {
            bind: '{activeView}',
            get: function (activeView) {
                if (activeView === "map") {
                    return 'x-fa fa-list';
                } else {
                    return 'x-fa fa-globe';
                }
            }
        },

        btnHide: {
            bind: '{activeView}',
            get: function (activeView) {
                if (activeView === "map") {
                    return true;
                } else {
                    return false;
                }
            }
        },

        canFilter: {
            bind: {
                activeView: '{activeView}'
            },
            get: function (data) {
                var activeView = data.activeView;
                if (activeView === "map") {
                    return false;
                } else {
                    return true;
                }
            }
        }
    },

    stores: {
        cards: {
            type: 'classes-cards',
            storeId: 'cards',
            model: '{storeinfo.modelname}',
            sorters: '{storeinfo.sorters}',
            proxy: {
                type: '{storeinfo.proxytype}',
                url: '{storeinfo.url}'
            },
            advancedFilter: '{storeinfo.advancedfilter}',
            autoLoad: '{storeinfo.autoload}',
            autoDestroy: true
        }
    }

});