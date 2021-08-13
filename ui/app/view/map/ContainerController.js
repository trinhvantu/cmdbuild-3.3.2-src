Ext.define('CMDBuildUI.view.map.ContainerController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.map-container',
    listen: {
        global: {
            objectidchanged: 'onObjectIdChanged',
            applythematism: 'onApplyThematism'
        },
        component: {
            'map-tab-tabpanel': {
                editgeovalue: 'onEditGeovalue',
                addgeovalue: 'onAddGeoValue',
                removegeovalue: 'onRemoveGeoValue',
                cleanmap: 'onCleanMap',
                loadfeatures: 'onLoadFeatures',
                animategeovalue: 'onAnimateGeovalue'
            }
        }
    },

    control: {
        '#': {
            beforerender: 'onBeforeRender'
        }
    },

    onBeforeRender: function (view) {
        var container = view.up('classes-cards-grid-container');
        if (container) {
            var filterslauncher = container.down('filters-launcher');
            if (filterslauncher) {
                filterslauncher.addListener('applyfilter', function (view, filter) {
                    var currentAdvancedfilter = this.getView().getAdvancedfilter()
                    if (!Ext.isEmpty(currentAdvancedfilter) && currentAdvancedfilter.getId() == filter.getId()) {
                        this.refreshAdvancedfilter();
                    } else {
                        this.getView().setAdvancedfilter(filter)
                    }

                }, this);

                filterslauncher.addListener('clearfilter', function (view) {
                    this.getView().setAdvancedfilter(null)
                }, this);
            }

            var vm = this.getViewModel();
            vm.bind({
                defaultFilter: '{defaultfilter}'
            }, function (data) {
                if (data.defaultFilter) {
                    if (data.defaultFilter.isModel) {
                        this.getView().setAdvancedfilter(data.defaultFilter);
                    } else {

                        var filter = Ext.create('CMDBuildUI.model.base.Filter', {
                            _id: data.defaultFilter
                        });

                        filter.load({
                            callback: function (record) {
                                this.getView().setAdvancedfilter(record);
                            },
                            scope: this
                        });
                    }
                }
            }, this);

            var searchtext = container.lookupReference('searchtext');
            if (searchtext) {
                searchtext.addListener('queryfilterchange', function (view, searchterm) {
                    this.getView().setSearchterm(searchterm);
                }, this);
            }
        }
    },

    onEditGeovalue: function (config) {
        this.getView().lookupReference('map').modify(config);
    },

    onAddGeoValue: function (config) {
        this.getView().lookupReference('map').draw(config);
    },

    onRemoveGeoValue: function (config) {
        this.getView().lookupReference('map').clear(config);
    },

    onCleanMap: function (record) {
        this.getView().lookupReference('map').clean(record);
    },
    onLoadFeatures: function (replace) {
        this.getView().lookupReference('map').getController().delayloadfeatures(replace || true);
    },

    onObjectIdChanged: function (newId) {
        this.getView().setObjectId(Ext.num(newId));
    },

    onApplyThematism: function (id) {
        var currentThematismId = this.getView().getThematismId();
        if (!Ext.isEmpty(currentThematismId) && currentThematismId == id) {
            //if the applied thematism is modifyed by the panel

            this.refreshThematism();
        } else {
            this.getView().setThematismId(id);
        }
    },

    /**
     * 
     * @param {CMDBuildUI.model.gis.GeoValue} config.geovalue
     */
    onAnimateGeovalue: function (config) {
        this.getView().lookupReference('map').getController().animateMap(config.geovalue);
    },

    privates: {

        /**
         * This function removes the current map-container.theThematism and after that sets it again. In this process the thematismId doesn't change
         */
        refreshThematism: function () {
            var view = this.getView();

            var theThematism = view.getTheThematism();
            view.setTheThematism(null);

            view.getViewModel().bind({
                theThematism: '{map-container.theThematism}'
            }, Ext.Function.bind(thematismHandler, this, [theThematism], 0), this, {
                single: true
            });

            function thematismHandler(theThematism, data) {
                if (!data.theThematism) {
                    //sets the configuration in the view
                    theThematism.calculateResults(function () {
                        view.setTheThematism(theThematism)
                    }, this);
                } else {
                    view.getViewModel().bind({
                        theThematism: '{map-container.theThematism}'
                    }, Ext.Function.bind(thematismHandler, this, [theThematism], 0), this, {
                        single: true
                    });
                }
            }
        },

        /**
         * this function removes the current map-container.advancedfilter
         */
        refreshAdvancedfilter: function () {
            var view = this.getView();

            var advancedfilter = view.getAdvancedfilter();
            view.setAdvancedfilter(null);

            view.getViewModel().bind({
                advancedfilter: '{map-container.advancedfilter}'
            }, Ext.Function.bind(advancedfilterHandler, this, [advancedfilter], 0), this, {
                single: true
            });

            function advancedfilterHandler(advancedfilter, data) {
                if (!data.advancedfilter) {
                    //sets the configuration in the view
                    view.setAdvancedfilter(advancedfilter);
                } else {
                    view.getViewModel().bind({
                        advancedfilter: '{map-container.theThematism}'
                    }, Ext.Function.bind(advancedfilterHandler, this, [advancedfilter], 0), this, {
                        single: true
                    });
                }
            }
        }
    }
});
