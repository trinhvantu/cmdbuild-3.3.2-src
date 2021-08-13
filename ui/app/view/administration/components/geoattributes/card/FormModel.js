Ext.define('CMDBuildUI.view.administration.components.geoattributes.card.FormModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.administration-components-geoattributes-card-form',
    data: {        
        actions: {
            view: true,
            edit: false,
            add: false
        },
        type: {
            isLine: false,
            isPoint: false,
            isPolygon: false
        },
        treeStoreData: []
    },

    formulas: {
        subtypeManager: {
            bind: {
                subtype: '{theGeoAttribute.subtype}'
            },
            get: function (data) {
                this.set('type.isLine', data.subtype === 'linestring');
                this.set('type.isPoint', data.subtype === 'point');
                this.set('type.isPolygon', data.subtype === 'polygon');
            }
        },
        treeStoreDataManager: {
            bind: {
                theGeoAttribute: '{theGeoAttribute}'
            },
            get: function (data) {

                if (data.theGeoAttribute) {
                    var me = this;
                    var childrens = [];
                    var wfEnabled = CMDBuildUI.util.helper.Configurations.get(CMDBuildUI.model.Configuration.processes.enabled);
                    var promises = [CMDBuildUI.util.administration.helper.TreeClassesHelper.appendClasses(true, data.theGeoAttribute.get('visibility'), true, true, [data.theGeoAttribute.get('owner_type')]).then(function (classes) {
                        childrens[0] = classes;
                    }, function () {
                        Ext.Msg.alert('Error', 'Classes store NOT LOADED!');
                    })];

                    if (wfEnabled) {
                        promises.push(CMDBuildUI.util.administration.helper.TreeClassesHelper.appendProcesses(true, data.theGeoAttribute.get('visibility'), true, true, [data.theGeoAttribute.get('owner_type')]).then(function (processes) {
                            childrens[1] = processes;
                        }, function () {
                            Ext.Msg.alert('Error', 'Processes store NOT LOADED!');
                        }));
                    }
                    Ext.Promise.all(promises).then(function () {
                        if (!me.destroyed) {
                            var tree = {
                                text: 'Root',
                                expanded: true,
                                children: '{treeStoreData}'
                            };
                            tree.children = childrens;
                            me.set('treeStoreData', tree);
                            return tree;
                        }
                    });
                }
            }
        },

        types: function () {
            return CMDBuildUI.util.administration.helper.ModelHelper.getGeoattributeTypes();
        },

        subtypes: function () {
            return CMDBuildUI.util.administration.helper.ModelHelper.getGeoattributeSubtypes();
        },

        strokeStyles: function () {
            return CMDBuildUI.util.administration.helper.ModelHelper.getGeoattributesStrokeStyles();
        }
    },

    stores: {
        typesStore: {
            model: 'CMDBuildUI.model.base.ComboItem',
            data: '{types}',
            proxy: {
                type: 'memory'
            },
            sorters: ['label'],
            autoDestroy: true
        },

        subtypesStore: {
            type: 'store',
            model: 'CMDBuildUI.model.base.ComboItem',
            data: '{subtypes}',
            proxy: {
                type: 'memory'
            },
            sorters: ['label'],
            autoDestroy: true
        },

        strokeDashStyleStore: {
            type: 'store',
            model: 'CMDBuildUI.model.base.ComboItem',
            data: '{strokeStyles}',
            proxy: {
                type: 'memory'
            },
            sorters: ['label'],
            autoDestroy: true
        },

        gridStore: {
            type: 'tree',
            proxy: {
                type: 'memory'
            },
            root: '{treeStoreData}',
            listeners: {
                datachanged: 'onTreeStoreDataChanged'
            }
            // root:'{storeData}'
        },
        icons: {
            model: 'CMDBuildUI.model.icons.Icon',
            autoLoad: true,
            autoDestroy: true,
            proxy: {
                url: Ext.String.format(
                    '{0}/uploads/?path=images/gis',
                    CMDBuildUI.util.Config.baseUrl
                ),
                type: 'baseproxy'
            },
            pagination: 0
        }
    }

});