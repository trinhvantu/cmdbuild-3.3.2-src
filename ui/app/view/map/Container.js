Ext.define('CMDBuildUI.view.map.Container', {
    extend: 'Ext.panel.Panel',

    requires: [
        'CMDBuildUI.view.map.ContainerController',
        'CMDBuildUI.view.map.ContainerModel'
    ],

    alias: 'widget.map-container',
    controller: 'map-container',
    viewModel: {
        type: 'map-container'
    },

    reference: 'map-container',
    config: {

        /**
         * 
         */
        zoom: 1,

        /**
         * 
         */
        center: [0, 0],

        objectTypeName: null,
        objectType: null,
        theObjectType: undefined,
        objectId: null,

        thematismId: null,
        theThematism: undefined,
        highlightselected: true,

        /**
         * Used in map-tab-cards-navigationtree and in map-map (with binding)
         */
        featureStore: Ext.create('Ext.data.Store', {
            model: 'CMDBuildUI.model.gis.GeoValue',
            proxy: {
                type: 'memory'
            },
            grouper: {
                property: 'ollayername'
            }
        }),

        /**
         * Used to store the geolayers values
         */
        shapeFeatureStore: undefined,

        bimStore: undefined,

        /**
         * key: objectIds
         * value: the visibility of that feature
         */
        hashMap: {
            keyValue: {},
            add: function (key, value) {
                this.keyValue[key] = value;
                if (this._updatecounter == 0) {
                    this.event.fireEventArgs('endupdate', [this, this.keyValue]);
                }
            },
            get: function (key) {
                return this.keyValue[key];
            },

            _updatecounter: 0,
            endUpdate: function () {
                this._updatecounter = this._updatecounter > 0 ? --this._updatecounter : 0;

                if (this._updatecounter == 0) {
                    this.event.fireEventArgs('endupdate', [this, this.keyValue]);
                }
            },
            beginUpdate: function () {
                ++this._updatecounter;
            },
            event: new Ext.util.Observable()
        },

        navigationTree: {
            $value: null,
            evented: true
        },

        attach_nav_tree_collection: {
            value: undefined,
            evented: true
        },

        drawmode: false,

        advancedfilter: {
            $value: null,
            evented: true
        },

        searchterm: {
            $value: null,
            evented: true
        }
    },

    publishes: [
        'objectTypeName',
        'objectType',
        'theObjectType',
        'objectId',
        "zoom",
        "center",

        'thematismId',
        'theThematism',
        'highlightselected',
        'featureStore',
        'shapeFeatureStore',
        'hashMap',
        'navigationTree',
        'drawmode',
        'advancedfilter',
        'searchterm',
        'bimStore',
        'attach_nav_tree_collection'
    ],

    bind: {
        'theObjectType': '{theObjectTypeCalculation}'
    },
    twoWayBindable: [
        'zoom',
        'center'
    ],

    layout: 'border',

    padding: '0',

    items: [{
        xtype: 'map-map',
        region: 'center',
        split: true,
        bind: {
            zoom: '{map-container.zoom}',
            mapCenter: '{map-container.center}',
            theThematism: '{map-container.theThematism}',
            highlightselected: '{map-container.highlightselected}',
            objectType: '{map-container.objectType}',
            objectTypeName: '{map-container.objectTypeName}',
            objectId: '{map-container.objectId}',
            featureStore: '{map-container.featureStore}',
            shapeFeatureStore: '{map-container.shapeFeatureStore}',
            hashMap: '{map-container.hashMap}',
            drawmode: '{map-container.drawmode}',
            advancedfilter: '{map-container.advancedfilter}',
            searchterm: '{map-container.searchterm}',
            bimStore: '{map-container.bimStore}',
            navigationTree: '{map-container.navigationTree}',
            attach_nav_tree_collection: '{map-container.attach_nav_tree_collection}'
        }
    }, {
        xtype: 'map-tab-tabpanel',
        title: CMDBuildUI.locales.Locales.gis.cardsMenu,
        localized: {
            title: 'CMDBuildUI.locales.Locales.gis.cardsMenu'
        },
        region: 'east',
        split: true,
        width: '30%',
        collapsible: true,
        layout: 'container',
        bind: {
            objectType: '{map-container.objectType}',
            objectTypeName: '{map-container.objectTypeName}',
            objectId: '{map-container.objectId}',
            navigationTree: '{map-container.navigationTree}',
            attach_nav_tree_collection: '{map-container.attach_nav_tree_collection}',
            drawmode: '{map-container.drawmode}'
        }
    }],

    listeners: {

        ajaxcall: {
            fn: 'onAjaxCall',
            buffer: 300
        },
        zoomchange: {
            fn: function () {//debugger;
            }
        }
    },

    /**
     * fired by it's view Model
     * @event selectedchangeevent
     * @param {Object} selected 
     * {
     *  type: { String }
     *  id: { String }
     *  conf: {
     *      center: true || false,
     *      zoom: true || false
     *  
     *      }
     *  }
     * @param {Ext.data.Model} records CMDBuildUI.model.map.GeoElement the records rapresenting the geovalues of the selected card
     */

    /**
     * @event navtreeload
     * @param {[Ext.data.model]} navTreeRecords model: CMDBuildUI.model.map.navigation.NavigationTree
     */

    /**
     * @event geoelementsload
     * @param {[Ext.data.model]} geoElemetsRecords model:CMDBuildUI.model.map.GeoElement
     */

    /**
    * @event layerlistchanged
    * this function is fired after all the layers are added on map 
    * @param {Object} layerList the list of the layer on the olMap either visible or not (enabled or disabled by the tab-layer checkBox)
    */

    /**
     * @event bboxchanged
     * This event is fired when the bbox of the map changes
     * @param bbox the map bbox
     */

    /**
    * @event ajaxcall
    * this is an internal event involved in loading or not geovalues.
    * @param view 
    * @param caller Specifyes who fired the event
    * 
    * Fires an extra before ajaxcall with a controller for pausing the function
    */

    initComponent: function () {
        this.callParent(arguments);
        if (CMDBuildUI.util.helper.Configurations.get(CMDBuildUI.model.Configuration.gis.navigationTreeEnabled)) {
            var navigationtree = Ext.create('CMDBuildUI.model.navigationTrees.DomainTree', {
                _id: this._gisNavigationName
            });

            navigationtree.load({
                params: {
                    treeMode: 'tree'
                },
                callback: function (record, operation, success) {
                    if (success) {
                        this.setNavigationTree(record);
                    }
                },
                scope: this
            });
        }

        var shapeFeatureStore = Ext.create('Ext.data.Store', {
            model: 'CMDBuildUI.model.gis.GeoLayer',
            proxy: {
                type: 'memory'
            },
            grouper: {
                property: 'ollayername'
            }
        });
        this.setShapeFeatureStore(shapeFeatureStore);

        var bimStore = Ext.getStore('bim.Projects');
        bimStore.load({
            callback: function (records, operation, success) {
                this.setBimStore(bimStore);
            },
            scope: this
        });

        var attach_nav_tree_collection = Ext.util.Collection.create({
            sutoSort: false
        });
        this.setAttach_nav_tree_collection(attach_nav_tree_collection);
    },

    updateObjectId: function (value, oldValue) {
        var objectTypeName = this.getObjectTypeName();

        if (objectTypeName) {
            var url = CMDBuildUI.util.Navigation.getClassBaseUrl(objectTypeName, value);
            Ext.util.History.add(url);
        }
    },

    onHashMapReplace: Ext.emptyFn,
    onHashMapAdd: Ext.emptyFn,
    _gisNavigationName: 'gisnavigation'
});
