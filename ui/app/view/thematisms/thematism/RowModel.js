Ext.define('CMDBuildUI.view.thematisms.thematism.RowModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.thematisms-thematism-row',
    data: {
        hiddenfields: {
            attributecombo: true,
            functioncombo: true
        },
        values: {
            geoattribute: null,
            attributecombo: null,
            name: null,
            segments: null,
            analisysType: null,
            source: null,
            functioncombo: null
        }
    },

    formulas: {
        updateAttributesData: {
            bind: {
                objecttype: '{objectType}',
                objecttypename: '{objectTypeName}',
                analysisType: '{theThematism.analysistype}'
            },
            get: function (data) {
                if (data.objecttype && data.objecttypename && data.analysisType) {
                    var me = this;
                    CMDBuildUI.util.helper.ModelHelper.getModel(data.objecttype, data.objecttypename).then(function (model) {
                        var d = [];
                        model.getFields().forEach(function (field) {
                            if (!Ext.String.startsWith(field.name, "_")) {
                                switch (data.analysisType) {
                                    case CMDBuildUI.model.thematisms.Thematism.analysistypes.punctual:
                                        d.push({
                                            value: field.name,
                                            label: field.attributeconf.description_localized
                                        });
                                        break;
                                    case CMDBuildUI.model.thematisms.Thematism.analysistypes.intervals:
                                        var cmdbuildtype = field.cmdbuildtype;

                                        if (cmdbuildtype == CMDBuildUI.util.helper.ModelHelper.cmdbuildtypes.integer ||
                                            cmdbuildtype == CMDBuildUI.util.helper.ModelHelper.cmdbuildtypes.decimal ||
                                            cmdbuildtype == CMDBuildUI.util.helper.ModelHelper.cmdbuildtypes.double ||
                                            cmdbuildtype == CMDBuildUI.util.helper.ModelHelper.cmdbuildtypes.date ||
                                            cmdbuildtype == CMDBuildUI.util.helper.ModelHelper.cmdbuildtypes.time ||
                                            cmdbuildtype == CMDBuildUI.util.helper.ModelHelper.cmdbuildtypes.datetime) {

                                            d.push({
                                                value: field.name,
                                                label: field.attributeconf.description_localized
                                            });
                                        }
                                        break;
                                }

                            }
                        });
                        me.set("attributesstoredata", null);
                        me.set("attributesstoredata", d);
                        var attribute = me.get('theThematism.classattribute');

                        /**
                         * This part erases attribute selection if no more valid
                         */
                        if (d.findIndex(function (element) {
                            return element.value == attribute
                        }) == -1) {
                            me.get('theThematism').set('classattribute', null);
                        }
                    });
                }
            }
        },
        updateGeoAttributesData: {
            bind: {
                objectType: '{objectType}',
                objectTypeName: '{objectTypeName}'
            },
            get: function (data) {
                if (data.objectType && data.objectTypeName) {

                    switch (data.objectType) {
                        case CMDBuildUI.util.helper.ModelHelper.objecttypes.klass:
                            var objectTypeNameInstance = CMDBuildUI.util.helper.ModelHelper.getClassFromName(data.objectTypeName);
                            if (objectTypeNameInstance) {

                                objectTypeNameInstance.getGeoAttributes().then(function (geoattributes) {
                                    if (this.getView() && !this.getView().destroyed) {
                                        var d = [];
                                        geoattributes.getRange().forEach(function (item, index, array) {
                                            if (item.get('owner_type') == data.objectTypeName && item.get('type') == CMDBuildUI.model.map.GeoAttribute.type.geometry) {
                                                d.push({
                                                    label: item.get('text'),
                                                    value: item.get('name')
                                                });
                                            }
                                        }, this);
                                        this.set('geoattributestoredata', d);
                                    }

                                }, Ext.emptyFn, Ext.emptyFn, this);
                            }
                            break;
                        default:
                            CMDBuildUI.util.Logger.log(
                                Ext.String.format('Object Type not implemented: {0}', data.objectType),
                                CMDBuildUI.util.Logger.levels.debug);
                    }
                }
            }
        },
        updateFunctionData: {
            bind: {
                objecttype: '{objectType}',
                objecttypename: '{objectTypeName}'
            },
            get: function (data) {
                if (data.objecttype && data.objecttypename) {
                    var me = this;
                    Ext.Ajax.request({
                        url: CMDBuildUI.util.Config.baseUrl + '/functions',
                        method: 'GET',
                        params: {
                            filter: Ext.JSON.encode(this._generateFunctionFilter(data.objecttypename))
                        },
                        success: function (response) {
                            //TODO: handle the case in wich there are not function for this class
                            var datas = JSON.parse(response.responseText).data;
                            var d = [];

                            datas.forEach(function (data) {
                                d.push({
                                    label: data.name,
                                    value: data.name
                                })
                            })
                            me.set('functionstoredata', d);
                        },
                        error: function (response) {
                        }
                    }, this);
                }
            }
        },

        updateSourceDeps: {
            bind: '{theThematism.type}',
            get: function (source) {
                if (source === CMDBuildUI.model.thematisms.Thematism.sources.function) {
                    this.set("hiddenfields.attributecombo", true);
                    this.set("hiddenfields.functioncombo", false);
                } else if (source === CMDBuildUI.model.thematisms.Thematism.sources.table) {
                    this.set("hiddenfields.attributecombo", false);
                    this.set("hiddenfields.functioncombo", true);
                }
            }
        },

        segmentsHidden: {
            bind: {
                bindTo: '{theThematism.analysistype}'
            },
            get: function (analysistypes) {
                return !(analysistypes == CMDBuildUI.model.thematisms.Thematism.analysistypes.intervals)
            }
        },
        buttonsDisabled: {
            bind: {
                name: '{theThematism.name}',
                analisysType: '{theThematism.analysistype}',
                source: '{theThematism.type}',
                geoAttribute: '{theThematism.attribute}',
                attributeCombo: '{theThematism.classattribute}',
                functioncombo: '{theThematism.function}',
                segments: '{theThematism.segments}'
            },
            get: function (data) {
                if (((data.source == CMDBuildUI.model.thematisms.Thematism.sources.table && data.attributeCombo)
                    || (data.source == CMDBuildUI.model.thematisms.Thematism.sources.function && data.functioncombo))
                    && data.analisysType && data.geoAttribute && data.name) {

                    if (data.analisysType == CMDBuildUI.model.thematisms.Thematism.analysistypes.intervals) {
                        if (data.segments != null) {
                            this.getView().lookupViewModel('thematisms-panel').set('buttonsDisabled', false);
                            return;
                        }
                    } else if (data.analisysType == CMDBuildUI.model.thematisms.Thematism.analysistypes.punctual) {
                        this.getView().lookupViewModel('thematisms-panel').set('buttonsDisabled', false);
                        return;
                    }
                }
                this.getView().lookupViewModel('thematisms-panel').set('buttonsDisabled', true);
            }

        }
    },

    stores: {
        analysistypes: {
            model: 'CMDBuildUI.model.base.ComboItem',
            proxy: {
                type: 'memory'
            },
            data: '{analysistypesdata}'
        },

        sources: {
            model: 'CMDBuildUI.model.base.ComboItem',
            proxy: {
                type: 'memory'
            },
            data: '{sourcesdata}'
        },

        attributesstore: {
            model: 'CMDBuildUI.model.base.ComboItem',
            proxy: {
                type: 'memory'
            },
            data: '{attributesstoredata}'
        },

        geoAttributes: {
            model: 'CMDBuildUI.model.base.ComboItem',
            proxy: {
                type: 'memory'
            },
            data: '{geoattributestoredata}'
        },
        functionstore: {
            model: 'CMDBuildUI.model.base.ComboItem',
            proxy: {
                type: 'memory'
            },
            data: '{functionstoredata}'
        }
    },

    _generateFunctionFilter: function (objectType) {
        return {
            "Attribute": {
                "and": [{
                    "simple": {
                        "attribute": "tags",
                        "operator": "CONTAIN",
                        "value": "card2value"
                    }
                }, {
                    "simple": {
                        "attribute": "source",
                        "operator": "CONTAIN",
                        "value": objectType
                    }
                }]
            }
        };

    }
});
