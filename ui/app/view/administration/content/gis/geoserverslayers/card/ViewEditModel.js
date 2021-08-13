Ext.define('CMDBuildUI.view.administration.content.gis.geoserverslayers.card.ViewEditModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.administration-content-gis-geoserverslayers-card-viewedit',
    data: {
        name: 'CMDBuildUI',
        treeStoreData: [],
        geoAttributeStoreConfig: {
            filters: [],
            proxy: {
                type: 'memory'
            },
            autoload: false
        },
        toolAction: {
            _canAdd: false,
            _canClone: false,
            _canUpdate: false,
            _canDelete: false,
            _canActiveToggle: false
        }
    },
    formulas: {
        toolsManager: {
            bind: {
                canModify: '{theSession.rolePrivileges.admin_gis_modify}'
            },
            get: function (data) {
                this.set('toolAction._canAdd', data.canModify === true);
                this.set('toolAction._canClone', data.canModify === true);
                this.set('toolAction._canUpdate', data.canModify === true);
                this.set('toolAction._canDelete', data.canModify === true);
                this.set('toolAction._canActiveToggle', data.canModify === true);
            }
        },

        title: {
            bind: {
                theLayer: '{theLayer}'
            },
            get: function (data) {
                var title = this.get('actions.add') ? CMDBuildUI.locales.Locales.administration.gis.newlayer : data.theLayer.get('name');
                this.getParent().set('title', title);
            }
        },
        typeManager: {
            bind: {
                type: '{theLayer.type}',
                ownerType: '{theLayer.owner_type}'
            },
            get: function (data) {
                var type = data.type;
                var filters;
                var store = this.getStore('geoAttributesStore');
                if (store) {
                    store.clearFilter();
                }
                if (type && type.length) {
                    filters = [function (item) {
                        return item.get('type') === type;
                    }];
                    this.set('geoAttributeStoreConfig.filters', filters);
                } else {
                    filters = [function (item) {
                        return false;
                    }];
                    this.set('geoAttributeStoreConfig.filters', filters);
                }
            }
        },
        types: {
            get: function () {
                return CMDBuildUI.util.administration.helper.ModelHelper.getGeoattributeTypes([CMDBuildUI.model.map.GeoLayers.types.shape, CMDBuildUI.model.map.GeoLayers.types.geotiff]);
            }
        },
        getAssociatedCards: {
            bind: '{theLayer.owner_type}',
            get: function (associatedClass) {
                if (associatedClass) {
                    var url = CMDBuildUI.util.api.Classes.getCardsUrl(associatedClass);
                    this.set('storeProxyUrl', url);
                    this.set('storeAutoLoad', true);
                    var initialPage;
                    var object = CMDBuildUI.util.helper.ModelHelper.getObjectFromName(associatedClass);
                    if (object) {
                        initialPage = object.get('description');
                    }
                    return this.set('theLayer._owner_type_description', initialPage);
                }
                return this.set('theLayer._owner_type_description', associatedClass);
            }
        },
        geoAttributesManager: {
            bind: '{theLayer.owner_type}',
            get: function (owner) {
                var me = this;
                
                if (owner && owner.length) {
                    var url = Ext.String.format('/classes/{0}/geoattributes', owner);
                    me.set('geoAttributeStoreConfig.proxytype', 'baseproxy');
                    me.set('geoAttributeStoreConfig.proxyurl', url);
                    me.set('geoAttributeStoreConfig.autoload', true);
                } else {
                    var store = this.getStore('geoAttributesStore');
                    if (store && store.getRange() && store.getRange().length) {
                        // TODO: empty _getAttribute input
                        me.set('geoAttributeStoreConfig.proxytype', 'memory');
                        me.set('geoAttributeStoreConfig.proxyurl', undefined);
                        me.set('geoAttributeStoreConfig.autoload', false);
                    }
                }
            }
        }
    },
    stores: {

        geoAttributesStore: {
            remoteFilter: false,
            filters: '{geoAttributeStoreConfig.filters}',
            proxy: {
                type: '{geoAttributeStoreConfig.proxytype}',
                url: '{geoAttributeStoreConfig.proxyurl}'
            },
            pageSize: 0,
            autoLoad: '{geoAttributeStoreConfig.autoload}',
            autoDestroy: true
        },

        getAllClassesProcessesStore: {
            data: '{getAllClassesProcesses}',
            proxy: {
                type: 'memory'
            },
            autoDestroy: true
        },

        typeStore: {
            proxy: {
                type: 'memory'
            },
            data: '{types}',
            sorters: ['label']
        }
    }

});