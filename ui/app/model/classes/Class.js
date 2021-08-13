Ext.define('CMDBuildUI.model.classes.Class', {
    extend: 'CMDBuildUI.model.base.Base',

    statics: {
        classtypes: {
            simple: 'simple',
            standard: 'standard'
        },
        getClasstypes: function () {
            return [{
                'value': 'standard',
                'label': CMDBuildUI.locales.Locales.administration.classes.texts.standard // Standard
            }, {
                'value': 'simple',
                'label': CMDBuildUI.locales.Locales.administration.classes.texts.simple // Simple'
            }];
        },
        masterParentClass: 'Class'
    },

    requires: [
        'Ext.data.validator.Format',
        'Ext.data.validator.Length',
        'Ext.data.validator.Presence'
    ],

    mixins: [
        'CMDBuildUI.mixins.model.Filter',
        'CMDBuildUI.mixins.model.Domain',
        'CMDBuildUI.mixins.model.Attribute',
        'CMDBuildUI.mixins.model.Hierarchy',
        'CMDBuildUI.mixins.model.FormTrigger'
    ],
    isClass: true,
    fields: [{
        name: 'name',
        type: 'string',
        critical: true
    }, {
        name: 'description',
        type: 'string',
        critical: true
    }, {
        name: 'parent',
        type: 'string',
        critical: true,
        defaultValue: 'Class'
    }, {
        name: 'prototype',
        type: 'boolean',
        critical: true
    }, {
        name: 'type',
        type: 'string',
        defaultValue: 'standard',
        critical: true
    }, {
        name: 'system',
        type: 'boolean'
    }, {
        name: 'dmsCategory',
        critical: true,
        type: 'string'
    }, {
        name: 'active',
        type: 'boolean',
        critical: true,
        defaultValue: true
    }, {
        name: 'defaultFilter',
        type: 'string',
        critical: true,
        persist: true
    }, {
        name: 'defaultImportTemplate',
        type: 'string',
        critical: true,
        persist: true
    }, {
        name: 'defaultExportTemplate',
        type: 'string',
        critical: true,
        persist: true
    }, {
        name: 'defaultOrder',
        type: 'auto',
        critical: true
    }, {
        name: 'formTriggers',
        type: 'auto',
        critical: true
    }, {
        name: 'contextMenuItems',
        type: 'auto',
        critical: true
    }, {
        name: 'widgets',
        type: 'auto',
        critical: true
    }, {
        name: 'attributeGroups',
        type: 'auto',
        critical: true,
        defaultValue: []
    }, {
        name: 'multitenantMode',
        type: 'string',
        critical: true,
        defaultValue: 'never' // values ca be: never, always, mixed
    }, {
        name: '_icon',
        type: 'number',
        critical: true,
        persistent: true
    }, {
        name: '_iconPath',
        type: 'string',
        calculate: function (data) {
            if (data._icon) {
                return Ext.String.format('{0}/uploads/{1}/image.png', CMDBuildUI.util.Config.baseUrl, data._icon);
            } else {
                return null;
            }
        }
    }, {
        name: 'attachmentsInline',
        type: 'boolean',
        defaultValue: false,
        critical: true
    }, {
        name: 'attachmentsInlineClosed',
        type: 'boolean',
        defaultValue: true,
        critical: true
    }, {
        name: 'noteInline',
        type: 'boolean',
        defaultValue: false,
        critical: true
    }, {
        name: 'noteInlineClosed',
        type: 'boolean',
        defaultValue: false,
        critical: true
    }, {
        name: 'domainOrder',
        type: 'auto',
        defaultValue: [],
        critical: true
    }, {
        name: 'formStructure',
        type: 'auto',
        critical: true
    }, {
        name: 'validationRule',
        type: 'string',
        critical: true
    }, {
        name: 'help',
        type: 'string',
        critical: true
    }],

    hasMany: [{
        model: 'CMDBuildUI.model.Attribute',
        name: 'attributes'
    }, {
        model: 'CMDBuildUI.model.domains.ObjectDomain',
        name: 'domains'
    }, {
        model: 'CMDBuildUI.model.domains.FkDomain',
        name: 'fkdomains'
    }, {
        model: 'CMDBuildUI.model.AttributeOrder',
        name: 'defaultOrder',
        associationKey: 'defaultOrder'
    }, {
        model: 'CMDBuildUI.model.FormTrigger',
        name: 'formTriggers',
        associationKey: 'formTriggers'
    }, {
        model: 'CMDBuildUI.model.ContextMenuItem',
        name: 'contextMenuItems',
        associationKey: 'contextMenuItems'
    }, {
        model: 'CMDBuildUI.model.WidgetDefinition',
        name: 'widgets',
        associationKey: 'widgets'
    }, {
        model: 'CMDBuildUI.model.base.Filter',
        name: 'filters'
    }, {
        model: 'CMDBuildUI.model.AttributeGrouping',
        name: 'attributeGroups'
    }, {
        model: 'CMDBuildUI.model.importexports.Template',
        name: 'importExportTemplates'
    }, {
        model: 'CMDBuildUI.model.importexports.Gate',
        name: 'importExportGISTemplates'
    }, {
        model: 'CMDBuildUI.model.thematisms.Thematism',
        name: 'thematisms'
    }, {
        model: 'CMDBuildUI.model.gis.GeoAttribute',
        name: 'geoAttributes' //,
        // associatedName : 'class'
        // inverse: {
        //     role: 'class', //FIXME: check if only role parameter is needed. Find difference between keyed and non keyed relation in hasMany and manyToMany
        //     association: '_class',
        //     getter: function () {
        //         debugger;
        //     },
        //     setter: function () {
        //         debugger;
        //     }
        // }
    }, {
        model: 'CMDBuildUI.model.map.GeoAttribute',
        name: 'geoattributes'
    }, {
        model: 'CMDBuildUI.model.map.GeoLayers',
        name: 'geolayers'
    }],

    validators: {
        name: [
            'presence'
        ],
        description: ['presence']
    },

    proxy: {
        url: '/classes/',
        type: 'baseproxy',
        reader: {
            type: 'json'
        }
    },

    objectType: CMDBuildUI.util.helper.ModelHelper.objecttypes.klass,
    source: 'classes.Classes',

    /**
     * Get translated description
     * @param {Boolean} [force] default null (if true return always the translation even if exist,
     *  otherwise if viewContext is 'admin' return the original description)
     * @return {String} The translated description if exists. Otherwise the description.
     */
    getTranslatedDescription: function (force) {
        if (!force && CMDBuildUI.util.Ajax.getViewContext() === 'admin') {
            return this.get("description");
        }
        return this.get("_description_translation") || this.get("description");
    },

    /**
     * @return {Boolean} 
     */
    isSimpleClass: function () {
        return this.get("type") === CMDBuildUI.model.classes.Class.classtypes.simple;
    },

    /**
     * Get object for menu
     * @return {String}
     */
    getObjectTypeForMenu: function () {
        return this.get('name');
    },

    getObjectParent: function () {
        return Ext.getStore("classes.Classes").getById(this.get('parent'));
    },

    getObjectStore: function () {
        return Ext.getStore("classes.Classes");
    },

    /**
     * @return {String} domains url 
     */
    getAttributesUrl: function () {
        return CMDBuildUI.util.api.Classes.getAttributes(this.get("name"));
    },

    /**
     * @return {String} domains url 
     */
    getDomainsUrl: function () {
        return CMDBuildUI.util.api.Classes.getDomains(this.get("name"));
    },

    /**
     * Load import/export templates
     * @param {Boolean} force If `true` load the store also if it is already loaded.
     * @return {Ext.Deferred} The promise has as paramenters the import/export templates store and a boolean field.
     */
    getImportExportTemplates: function (force) {
        var deferred = new Ext.Deferred();
        var templates = this.importExportTemplates();

        if (!templates.isLoaded() || force) {
            templates.getProxy().setUrl(CMDBuildUI.util.api.Classes.getImportExportTemplatesUrl(this.get("name")));
            // load store
            templates.load({
                params: {
                    include_related_domains: true,
                    filter: Ext.JSON.encode({
                        "attribute": {
                            "simple": {
                                "attribute": "fileFormat",
                                "operator": "in",
                                "value": [
                                    CMDBuildUI.model.importexports.Template.fileTypes.csv,
                                    CMDBuildUI.model.importexports.Template.fileTypes.xlsx,
                                    CMDBuildUI.model.importexports.Template.fileTypes.xls
                                ]
                            }
                        }
                    })
                },
                callback: function (records, operation, success) {
                    if (success) {
                        deferred.resolve(templates, true);
                    }
                }
            });
        } else {
            // return promise
            deferred.resolve(templates, false);
        }
        return deferred.promise;
    },

    /**
     * Load GIS import/export templates
     * @param {Boolean} force If `true` load the store also if it is already loaded.
     * @return {Ext.Deferred} The promise has as paramenters the gis templates store and a boolean field.
     */
    getImportExportGates: function (force) {
        var deferred = new Ext.Deferred();
        var templates = this.importExportGISTemplates();

        if (!templates.isLoaded() || force) {
            templates.getProxy().setUrl(CMDBuildUI.util.api.Classes.getImportExportGatesUrl(this.get("name")));
            // load store
            templates.load({
                params: {
                    _has_single_handler: true,
                    _handler_type: 'cad,database,ifc',
                    include_etl_templates: true
                },
                callback: function (records, operation, success) {
                    if (success) {
                        deferred.resolve(templates, true);
                    }
                }
            });
        } else {
            // return promise
            deferred.resolve(templates, false);
        }
        return deferred.promise;
    },

    /**
     * Load all import/export templates (data and GIS)
     * @return {Ext.Deferred} The promise has as paramenters an object with import and export templates.
     */
    getAllTemplatesForImportExport: function () {
        var me = this,
            deferred = new Ext.Deferred();

        Ext.Promise.all([
            me.getImportExportTemplates(),
            me.getImportExportGates()
        ]).then(function (stores) {
            var tpls = {
                    import: [],
                    export: []
                },
                etl = stores[0],
                gis = stores[1];

            etl.getRange().forEach(function (tpl) {
                if (Ext.Array.contains([
                        CMDBuildUI.model.importexports.Template.fileTypes.csv,
                        CMDBuildUI.model.importexports.Template.fileTypes.xlsx,
                        CMDBuildUI.model.importexports.Template.fileTypes.xls,
                        CMDBuildUI.model.importexports.Template.fileTypes.ifc
                    ], tpl.get("fileFormat"))) {
                    switch (tpl.get("type")) {
                        case CMDBuildUI.model.importexports.Template.types.import:
                            tpls.import.push(tpl);
                            break;
                        case CMDBuildUI.model.importexports.Template.types.export:
                            tpls.export.push(tpl);
                            break;
                        case CMDBuildUI.model.importexports.Template.types.importexport:
                            tpls.import.push(tpl);
                            tpls.export.push(tpl);
                            break;
                    }
                }
            });

            gis.getRange().forEach(function (tpl) {
                tpls.import.push(tpl);
            });

            deferred.resolve(tpls);
        });
        return deferred.promise;
    },

    /**
     * Load geoattributes
     * @param {Boolean} force If `true` load the store also if it is already loaded.
     * @return {Ext.Deferred} The promise has as paramenters the geoattributes store and a boolean field.
     */
    getGeoattributes: function (force) {
        var deferred = new Ext.Deferred();
        var geoattributes = this.geoattributes();

        if (!geoattributes.isLoaded() || force) {
            geoattributes.getProxy().setUrl(Ext.String.format('{0}{1}', CMDBuildUI.util.Config.baseUrl, CMDBuildUI.util.api.Classes.getGeoAttributes(this.get("name"))));
            geoattributes.load({
                callback: function (records, operation, success) {
                    if (success) {
                        deferred.resolve(geoattributes, true);
                    }
                }
            });
        } else {
            deferred.resolve(geoattributes, false);
        }
        return deferred.promise;
    },

    /**
     * Load geolayers
     * @param {Boolean} force If `true` load the store also if it is already loaded.
     * @return {Ext.Deferred} The promise has as paramenters the geolayers store and a boolean field.
     */
    getGeolayers: function (force) {
        var deferred = new Ext.Deferred();
        var geolayers = this.geolayers();

        if (!geolayers.isLoaded() || force) {
            geolayers.getProxy().setUrl(Ext.String.format('{0}{1}', CMDBuildUI.util.Config.baseUrl, CMDBuildUI.util.api.Classes.getExternalGeoAttributes(this.get("name"))));
            geolayers.load({
                callback: function (records, operation, success) {
                    if (success) {
                        deferred.resolve(geolayers, true);
                    }
                }
            });
        } else {
            deferred.resolve(geolayers, false);
        }
        return deferred.promise;
    },

    /**
     * Load thematisms
     * @param {Boolean} force If `true` load the store also if it is already loaded.
     * @return {Ext.Deferred} The promise has as paramenters the thematism store and a boolean field.
     */
    getThematisms: function (force) {
        var deferred = new Ext.Deferred();
        var thematisms = this.thematisms();


        if (!thematisms.isLoaded() || force) {
            thematisms.getProxy().setUrl(CMDBuildUI.util.api.Classes.getThematismsUrl(this.get("name")));
            thematisms.load({
                callback: function (records, operation, success) {
                    if (success) {
                        deferred.resolve(thematisms, true);
                    }
                }
            });
        } else {
            deferred.resolve(thematisms, false);
        }
        return deferred.promise;
    },

    getGeoAttributes: function (force) {
        var deferred = new Ext.Deferred();
        var geoattributes = this.geoAttributes();

        if (!geoattributes.isLoaded() || force) {
            geoattributes.getProxy().setUrl(CMDBuildUI.util.api.Classes.getGeoAttributes(this.get('name')));
            geoattributes.load({
                params: {
                    visible: true
                },
                callback: function (records, operation, success) {
                    if (success) {
                        deferred.resolve(geoattributes, true);
                    }
                }
            });
        } else {
            deferred.resolve(geoattributes, false);
        }
        return deferred.promise;
    }
});