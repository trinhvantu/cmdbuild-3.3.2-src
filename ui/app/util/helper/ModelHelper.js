Ext.define('CMDBuildUI.util.helper.ModelHelper', {
    singleton: true,

    requires: [
        'CMDBuildUI.proxy.AttributesProxy' //TODO: Remove when attributes are fixed in CMDBuild
    ],

    objecttypes: {
        custompage: 'custompage',
        domain: 'domain',
        klass: 'class',
        process: 'process',
        report: 'report',
        view: 'view',
        calendar: 'calendar',
        event: 'event',
        dashboard: 'dashboard',
        dmsmodel: 'dmsmodel',
        navtreecontent: 'navtreecontent'
    },

    // All CMDBuild attributes types managed by the application
    cmdbuildtypes: {
        bigint: 'long',
        boolean: 'boolean',
        char: 'char',
        date: 'date',
        datetime: 'dateTime',
        decimal: 'decimal',
        double: 'double',
        foreignkey: 'foreignKey',
        integer: 'integer',
        ipaddress: 'ipAddress',
        lookup: 'lookup',
        reference: 'reference',
        string: 'string',
        text: 'text',
        time: 'time',
        tenant: 'tenant'
    },

    ignoredFields: [
        'Id',
        'Notes',
        'IdTenant',
        'FlowStatus',
        'IdClass'
    ],

    /**
     * @param {String} type The model type.
     * @param {String} name The target name.
     * 
     * @return  {String} The name of the model
     */
    getModelName: function (type, name) {
        if (type === CMDBuildUI.util.helper.ModelHelper.objecttypes.calendar) {
            switch (name) {
                case CMDBuildUI.util.helper.ModelHelper.objecttypes.event:
                    return 'CMDBuildUI.model.calendar.Event';
            }
        }
        return 'CMDBuildUI.model.' + type + '.' + name;
    },

    /**
     * @param {String} modelName The model name.
     * @return  {String} The model object
     */
    getModelFromName: function (modelName) {
        return Ext.ClassManager.get(modelName);
    },

    /**
     * @param {String} type The model type.
     * @param {String} name The target name.
     * @return {Ext.promise.Promise} Resolve method has as argument an 
     *      instance of {Ext.data.Model}. Reject method has as argument 
     *      a {String} containing error message.
     */
    getModel: function (type, name) {
        var deferred = new Ext.Deferred();
        var me = this;

        // get model name
        var modelName = this.getModelName(type, name);

        // returns model if already exists
        if (Ext.ClassManager.isCreated(modelName)) {
            var model = CMDBuildUI.util.helper.ModelHelper.getModelFromName(modelName);
            deferred.resolve(model);
            return deferred.promise;
        }

        // get url
        var baseUrl = this.getBaseUrl(type, name);

        /**
         * Define load callback
         * 
         * @param {Ext.data.Store} store
         * @param {CMDBuildUI.model.Attribute[]} records
         * @param {Boolean} successful
         * @param {Ext.data.operation.Read} operation
         * @param {Object} eOpts
         */
        function onStoreLoaded(store, records, successful, operation, eOpts) {
            if (successful) {
                var fields = [];
                store.sort([{
                    property: 'index',
                    direction: 'ASC'
                }]);
                Ext.Array.each(store.getData().getRange(), function (attribute, index) {
                    if (
                        attribute.get("active") &&
                        !Ext.Array.contains(CMDBuildUI.util.helper.ModelHelper.ignoredFields, attribute.get("name"))
                    ) {
                        // override mandatory property when create process instance model
                        // because mandatory fields are defined by activities
                        if (type === CMDBuildUI.util.helper.ModelHelper.objecttypes.process) {
                            attribute.set("mandatory", false);
                        }
                        // create field definition
                        var field = me.getModelFieldFromAttribute(attribute);
                        if (field) {
                            // add field
                            fields.push(field);
                        }
                    }
                });

                // define new model
                if (!Ext.ClassManager.isCreated(modelName)) {
                    Ext.define(modelName, Ext.applyIf(
                        me.getModelDefinition(type, baseUrl, fields), {
                        statics: {
                            objectType: type,
                            objectTypeName: name
                        }
                    }));
                    CMDBuildUI.util.Logger.log('Create new model: ' + modelName, CMDBuildUI.util.Logger.levels.debug);
                }

                var model = Ext.ClassManager.get(modelName);
                deferred.resolve(model);
            } else {
                // execute failure callback
                deferred.reject("Base url not defined.");
            }
        }

        var item = this.getObjectFromName(name, type);
        // check if the model exists
        if (!baseUrl || Ext.String.endsWith(baseUrl, 'null')) { // TODO: verificare correttezza del baseUrl.endsWith('null')
            deferred.reject("Base url not defined.");
        } else if (item && item.getAttributes) {
            item.getAttributes().then(function (attributes) {
                onStoreLoaded(attributes, attributes.getRange(), true);
            });
        } else {
            CMDBuildUI.util.Logger.log(Ext.String.format(
                'Get attributes method not implemented for type: {0}',
                type), CMDBuildUI.util.Logger.levels.warn);
            // create new store
            var attributesStore = Ext.create('Ext.data.Store', {
                model: 'CMDBuildUI.model.Attribute',

                proxy: {
                    url: baseUrl + '/attributes',
                    type: 'baseproxy'
                },
                pageSize: 0, // disable pagination
                autoDestroy: true,

                sorters: [
                    'index'
                ],

                listeners: {
                    load: onStoreLoaded
                }
            });
            attributesStore.load();
        }

        return deferred.promise;
    },

    /**
     * @param {String} type
     * @param {String} name
     * @return {String} The url to retrieve the attributes for the model definition.
     */
    getBaseUrl: function (type, name) {
        var url;
        switch (type) {
            case CMDBuildUI.util.helper.ModelHelper.objecttypes.klass:
                url = '/classes/' + name;
                break;
            case CMDBuildUI.util.helper.ModelHelper.objecttypes.dmsmodel:
                url = '/dms/models/' + name;
                break;
            case CMDBuildUI.util.helper.ModelHelper.objecttypes.process:
                url = '/processes/' + name;
                break;
            case CMDBuildUI.util.helper.ModelHelper.objecttypes.view:
                url = '/views/' + name;
                break;
            case CMDBuildUI.util.helper.ModelHelper.objecttypes.report:
                url = '/reports/' + name;
                break;
            case CMDBuildUI.util.helper.ModelHelper.objecttypes.calendar:
                url = '/events';
                break;
            case CMDBuildUI.util.helper.ModelHelper.objecttypes.dmsmodel:
                url = '/classes/' + name; //TODO: chenge when the new /dms/models/attachments will work
                break;
            default:
                CMDBuildUI.util.Msg.alert('Warning!', 'Type ' + type + ' non reconized in createModel function!');
        }
        return url;
    },

    /**
     * Returns the model definition
     * 
     * @param {String} type
     * @param {String} baseUrl
     * @param {Ext.field.Field[]} fields
     * @return {Object} Model definition
     */
    getModelDefinition: function (type, baseUrl, fields) {
        var modelname, endpint, proxytype, extraparams, hasmany;
        switch (type) {
            case CMDBuildUI.util.helper.ModelHelper.objecttypes.klass:
                modelname = 'CMDBuildUI.model.classes.Card';
                endpint = 'cards';
                proxytype = 'baseproxy';
                hasmany = [{
                    type: 'CMDBuildUI.model.WidgetDefinition',
                    name: 'widgets',
                    associationKey: '_widgets'
                }, {
                    type: 'CMDBuildUI.model.calendar.Sequence',
                    name: 'sequences',
                    associationKey: '_sequences'
                }, {
                    type: 'CMDBuildUI.model.gis.GeoValue',
                    name: 'geovalues',
                    associationKey: '_geovalues'
                },{
                    type: 'CMDBuildUI.model.gis.GeoLayer',
                    name: 'geolayers',
                    associationKey: '_geolayers'
                }];
                break;
            case CMDBuildUI.util.helper.ModelHelper.objecttypes.process:
                modelname = 'CMDBuildUI.model.processes.Instance';
                endpint = 'instances';
                proxytype = 'baseproxy';
                extraparams = {
                    include_tasklist: true
                };
                break;
            case CMDBuildUI.util.helper.ModelHelper.objecttypes.view:
                modelname = 'CMDBuildUI.model.views.ViewItem';
                endpint = 'cards';
                proxytype = 'baseproxy';
                break;
            case CMDBuildUI.util.helper.ModelHelper.objecttypes.report:
                modelname = 'CMDBuildUI.model.reports.ReportItem';
                endpint = '';
                proxytype = 'baseproxy';
                break;
            case CMDBuildUI.util.helper.ModelHelper.objecttypes.dmsmodel:
                modelname = 'CMDBuildUI.model.dms.DMSAttachment';
                proxytype = 'baseproxy';
                hasmany = [{
                    type: 'CMDBuildUI.model.WidgetDefinition',
                    name: 'widgets',
                    associationKey: '_widgets'
                }, {
                    type: 'CMDBuildUI.model.calendar.Sequence',
                    name: 'sequences',
                    associationKey: '_sequences'
                }];
                break;
            default:
                CMDBuildUI.util.Msg.alert('Warning!', 'Type ' + type + ' non reconized in createModel function!');
        }
        var proxy = {
            url: Ext.String.format("{0}/{1}", baseUrl, endpint),
            type: proxytype,
            writer: {
                writeAllFields: true
            }
        };
        if (extraparams) {
            proxy.extraParams = extraparams;
        }
        return {
            extend: modelname,
            fields: fields,
            proxy: proxy,
            hasMany: hasmany
        };
    },

    /**
     * @param {String} type
     * @param {String} name
     * @return {String} The url to retrieve the list for specified type.
     */
    getListBaseUrl: function (type, name) {
        var url = CMDBuildUI.util.helper.ModelHelper.getBaseUrl(type, name);
        switch (type) {
            case CMDBuildUI.util.helper.ModelHelper.objecttypes.klass:
                url += '/cards/';
                break;
            case CMDBuildUI.util.helper.ModelHelper.objecttypes.process:
                url += '/instances/';
                break;
            case CMDBuildUI.util.helper.ModelHelper.objecttypes.view:
                url += '/cards/';
                break;
            default:
                CMDBuildUI.util.Msg.alert('Warning!', 'Type ' + type + ' non reconized in createModel function!');
        }
        return url;
    },

    /**
     * @param {String} type The model type.
     * @param {String} name The target name.
     * 
     * @return  {String} The name of notes model
     */
    getNotesModelName: function (type, name) {
        return 'CMDBuildUI.model.notes.' + type + '.' + name;
    },

    /**
     * @param {String} type The model type.
     * @param {String} name The target name.
     * @return {Ext.data.Model}
     */
    getNotesModel: function (type, name, callback) {
        // get model name
        var modelName = this.getNotesModelName(type, name);

        // check if the model exists
        if (!Ext.ClassManager.isCreated(modelName)) {
            // get url
            var baseUrl = this.getBaseUrl(type, name);
            if (!baseUrl) {
                return null;
            }
            var field = this.getModelField({
                cmdbuildtype: "text",
                defaultValue: null,
                description: "Notes",
                hidden: false,
                mandatory: false,
                name: "Notes",
                type: "text",
                writable: true,
                metadata: {
                    editorType: "HTML"
                }
            });

            var fields = [field];

            if (type == 'process') {
                fields.push({
                    name: '_activity',
                    critical: true
                });
            }

            // define new model
            Ext.define(modelName, {
                extend: 'CMDBuildUI.model.base.Base',
                statics: {
                    objectType: type,
                    objectTypeName: name
                },
                fields: fields,
                proxy: {
                    url: this.getListBaseUrl(type, name),
                    type: 'baseproxy'
                }
            });
            CMDBuildUI.util.Logger.log('Create new model: ' + modelName, CMDBuildUI.util.Logger.levels.debug);
        }

        var model = Ext.ClassManager.get(modelName);
        return model;
    },

    /**
     * @param {String} type The model type.
     * @param {String} name The target name.
     * @return  {String} The name of the model
     */
    getHistoryModelName: function (type, name) {
        return 'CMDBuildUI.model.history.' + type + '.' + name;
    },

    /**
     * @param {String} type The model type.
     * @param {String} name The target name.
     * @return {Ext.data.Model} History model
     */
    getHistoryModel: function (type, name) {
        var modelName = CMDBuildUI.util.helper.ModelHelper.getHistoryModelName(type, name);
        // check if the model exists
        if (!Ext.ClassManager.isCreated(modelName)) {
            var parentModelName = CMDBuildUI.util.helper.ModelHelper.getModelName(type, name);
            // define new model
            Ext.define(modelName, {
                extend: parentModelName,
                statics: {
                    objectType: type,
                    objectTypeName: name
                },
                fields: CMDBuildUI.model.History.fields,
                proxy: {} // override proxy
            });
            CMDBuildUI.util.Logger.log('Create new model: ' + modelName, CMDBuildUI.util.Logger.levels.debug);
        }

        // return model
        return Ext.ClassManager.get(modelName);
    },

    /**
     * @param {CMDBuildUI.model.Attribute} attribute
     * @return {Object} Model field definition
     */
    getModelFieldFromAttribute: function (attribute) {
        var fielddef = this.getModelField(attribute.getData());
        if (fielddef) {
            // get translated description
            fielddef.attributeconf.description_localized = attribute.getTranslatedDescription();
        }
        return fielddef;
    },

    /**
     * @param {Object} attribute
     * @return {Object} Model field definition
     */
    getModelField: function (attribute) {
        var fieldname = CMDBuildUI.util.Utilities.stringRemoveSpecialCharacters(attribute.name);
        var field = {
            name: fieldname,
            cmdbuildtype: attribute.type,
            attributename: attribute.name,
            description: attribute.description || attribute.name,
            mandatory: attribute.mandatory,
            defaultValue: attribute.defaultValue || null,
            // writable: attribute.writable,
            mode: attribute.mode,
            hidden: attribute.hidden,
            writable: attribute.writable,
            attributeconf: attribute,
            allowNull: true,
            validators: []
        };

        if (fieldname !== attribute.name) {
            field.mapping = function (data) {
                return data[attribute.name];
            };
        }

        // get field type
        switch (attribute.type.toLowerCase()) {
            /**
             * Boolean field
             */
            case CMDBuildUI.util.helper.ModelHelper.cmdbuildtypes.boolean.toLowerCase():
                field.type = 'boolean';
                break;
            /**
             * Date fields
             */
            case CMDBuildUI.util.helper.ModelHelper.cmdbuildtypes.date.toLowerCase():
                field.type = 'date';
                field.dateWriteFormat = 'c';
                field.dateReadFormat = 'c';
                // field.convert = function(value) {
                //     if (!Ext.isEmpty(value) && Ext.isString(value)) {
                //         return Ext.Date.parse(value, "c");
                //     }
                //     return value;
                // }
                break;
            case CMDBuildUI.util.helper.ModelHelper.cmdbuildtypes.datetime.toLowerCase():
                field.type = 'date';
                field.dateWriteFormat = 'c';
                field.dateReadFormat = 'c';
                break;
            case CMDBuildUI.util.helper.ModelHelper.cmdbuildtypes.time.toLowerCase():
                field.type = 'string';
                break;
            /**
             * IP field
             */
            case CMDBuildUI.util.helper.ModelHelper.cmdbuildtypes.ipaddress.toLowerCase():
                field.type = 'string';
                break;
            /**
             * Numeric fields
             */
            case CMDBuildUI.util.helper.ModelHelper.cmdbuildtypes.decimal.toLowerCase():
                field.type = 'number';
                break;
            case CMDBuildUI.util.helper.ModelHelper.cmdbuildtypes.double.toLowerCase():
                field.type = 'number';
                break;
            case CMDBuildUI.util.helper.ModelHelper.cmdbuildtypes.integer.toLowerCase():
                field.type = 'integer';
                break;
            /**
             * Relation fields
             */
            case CMDBuildUI.util.helper.ModelHelper.cmdbuildtypes.lookup.toLowerCase():
                field.type = 'integer';
                CMDBuildUI.model.lookups.LookupType.loadLookupValues(field.attributeconf.lookupType);
                break;
            case CMDBuildUI.util.helper.ModelHelper.cmdbuildtypes.reference.toLowerCase():
                field.type = 'integer';
                if (!field.attributeconf.targetType) {
                    field.attributeconf.targetType = CMDBuildUI.util.helper.ModelHelper.getObjectTypeByName(field.attributeconf.targetClass);
                }
                break;
            case CMDBuildUI.util.helper.ModelHelper.cmdbuildtypes.foreignkey.toLowerCase():
                field.type = 'integer';
                if (!field.attributeconf.targetType) {
                    field.attributeconf.targetType = CMDBuildUI.util.helper.ModelHelper.getObjectTypeByName(field.attributeconf.targetClass);
                }
                break;
            /**
             * Text fields
             */
            case CMDBuildUI.util.helper.ModelHelper.cmdbuildtypes.char.toLowerCase():
                field.type = 'string';
                break;
            case CMDBuildUI.util.helper.ModelHelper.cmdbuildtypes.string.toLowerCase():
                field.type = 'string';
                break;
            case CMDBuildUI.util.helper.ModelHelper.cmdbuildtypes.text.toLowerCase():
                field.type = 'string';
                break;
            default:
                CMDBuildUI.util.Logger.log('No type specified for CMDBuild type ' + attribute.type, CMDBuildUI.util.Logger.levels.warn);
                return;
        }

        if (attribute.mandatory) {
            field.validators.push('presence');
        }

        return field;
    },

    /**
     * Returns the object type for given objectTypeName.
     * 
     * @param {String} objectTypeName
     * @return {String} One of the values of CMDBuildUI.util.helper.ModelHelper.objecttypes
     */
    getObjectTypeByName: function (objectTypeName) {
        // return class if objectTypeName is a class
        if (this.getClassFromName(objectTypeName)) {
            return CMDBuildUI.util.helper.ModelHelper.objecttypes.klass;
        }
        // return process if objectTypeName is a process
        if (this.getProcessFromName(objectTypeName)) {
            return CMDBuildUI.util.helper.ModelHelper.objecttypes.process;
        }
        // return class if objectTypeName is a DMSModel
        if (this.getDMSModelFromName(objectTypeName)) {
            return CMDBuildUI.util.helper.ModelHelper.objecttypes.dmsmodel;
        }
        // return domain if objectTypeName is a domain
        if (this.getDomainFromName(objectTypeName)) {
            return CMDBuildUI.util.helper.ModelHelper.objecttypes.domain;
        }
        // return report if objectTypeName is a report
        if (this.getReportFromName(objectTypeName)) {
            return CMDBuildUI.util.helper.ModelHelper.objecttypes.report;
        }
        // return calendar if objectTypeName is event
        if (objectTypeName === CMDBuildUI.util.helper.ModelHelper.objecttypes.event) {
            return CMDBuildUI.util.helper.ModelHelper.objecttypes.calendar;
        }
    },

    /**
     * Returns class object from className
     * 
     * @param {String} className
     * @return {CMDBuildUI.model.classes.Class}
     */
    getClassFromName: function (className) {
        return Ext.getStore("classes.Classes").getById(className);
    },

    /**
     * Returns domain object from domainName
     * 
     * @param {String} domainName
     * @return {CMDBuildUI.model.domains.Domain}
     */
    getDomainFromName: function (domainName) {
        return Ext.getStore("domains.Domains").getById(domainName);
    },

    /**
     * Returns process object from processName
     * 
     * @param {String} processName
     * @return {CMDBuildUI.model.processes.Process}
     */
    getProcessFromName: function (processName) {
        return Ext.getStore("processes.Processes").getById(processName);
    },

    /**
     * Returns DMSModel object from modelName
     * 
     * @param {String} modelName
     * @return {CMDBuildUI.model.dms.DMSModel}
     */
    getDMSModelFromName: function (modelName) {
        return Ext.getStore("dms.DMSModels").getById(modelName);
    },

    /**
     * Returns view object from viewName
     * 
     * @param {String} viewName
     * @return {CMDBuildUI.model.views.View}
     */
    getViewFromName: function (viewName) {
        return Ext.getStore("views.Views").getById(viewName);
    },

    /**
     * Returns report object from reportName
     * 
     * @param {String} reportName
     * @return {CMDBuildUI.model.reports.Report}
     */
    getReportFromName: function (reportName) {
        return Ext.getStore("reports.Reports").findRecord("code", reportName);
    },

    /**
     * Returns dashbaord object from dashboardName
     * 
     * @param {String} dashboardName
     * @return {CMDBuildUI.model.dashboards.Dashboard}
     */
    getDashboardFromName: function (dashboardName) {
        return Ext.getStore("dashboards.Dashboards").findRecord("name", dashboardName);
    },

    /**
     * Returns custom page object from custompageName
     * 
     * @param {String} customPageName
     * @return {CMDBuildUI.model.custompages.CustomPage}
     */
    getCustomPageFromName: function (customPageName) {
        return Ext.getStore("custompages.CustomPages").findRecord("name", customPageName);
    },

    /**
     * Returns view object from functionName
     * 
     * @param {String} functionName
     * @return {CMDBuildUI.model.Function}
     */
    getFunctionFromName: function (functionName) {
        return Ext.getStore("Functions").findRecord("name", functionName);
    },

    /*
     * Returns calendar object
     * 
     * @return {CMDBuildUI.model.calendar.Calendar}
     */
    getCalendar: function () {
        if (!CMDBuildUI.util.helper.ModelHelper._calendarinstance) {
            CMDBuildUI.util.helper.ModelHelper._calendarinstance = Ext.create("CMDBuildUI.model.calendar.Calendar");
        }
        return CMDBuildUI.util.helper.ModelHelper._calendarinstance;
    },

    /**
     * Returns class or process object from type name
     * 
     * @param {String} typeName Class, Process or View name
     * @param {String} type One of `class`, `process` or `view`. If null it will be calculated.
     * @return {CMDBuildUI.model.processes.Process}
     */
    getObjectFromName: function (typeName, type) {
        type = type || CMDBuildUI.util.helper.ModelHelper.getObjectTypeByName(typeName);

        switch (type) {
            case CMDBuildUI.util.helper.ModelHelper.objecttypes.klass:
                return CMDBuildUI.util.helper.ModelHelper.getClassFromName(typeName);
            case CMDBuildUI.util.helper.ModelHelper.objecttypes.process:
                return CMDBuildUI.util.helper.ModelHelper.getProcessFromName(typeName);
            case CMDBuildUI.util.helper.ModelHelper.objecttypes.dmsmodel:
                return CMDBuildUI.util.helper.ModelHelper.getDMSModelFromName(typeName);
            case CMDBuildUI.util.helper.ModelHelper.objecttypes.view:
                return CMDBuildUI.util.helper.ModelHelper.getViewFromName(typeName);
            case CMDBuildUI.util.helper.ModelHelper.objecttypes.report:
                return CMDBuildUI.util.helper.ModelHelper.getReportFromName(typeName);
            case CMDBuildUI.util.helper.ModelHelper.objecttypes.domain:
                return CMDBuildUI.util.helper.ModelHelper.getDomainFromName(typeName);
            case CMDBuildUI.util.helper.ModelHelper.objecttypes.custompage:
                return CMDBuildUI.util.helper.ModelHelper.getCustomPageFromName(typeName);
            case CMDBuildUI.util.helper.ModelHelper.objecttypes.dashboard:
                return CMDBuildUI.util.helper.ModelHelper.getDashboardFromName(typeName);
            case CMDBuildUI.util.helper.ModelHelper.objecttypes.calendar:
                return CMDBuildUI.util.helper.ModelHelper.getCalendar();
        }
    },

    /**
     * Returns class description.
     * 
     * @param {String} className
     * @return {String} Class description
     */
    getClassDescription: function (className) {
        var klass = CMDBuildUI.util.helper.ModelHelper.getClassFromName(className);
        return klass ? klass.getTranslatedDescription() : null;
    },

    /**
     * Returns process description.
     * 
     * @param {String} processName
     * @return {String} Process description
     */
    getProcessDescription: function (processName) {
        var processes = CMDBuildUI.util.helper.ModelHelper.getProcessFromName(processName);
        return processes ? processes.getTranslatedDescription() : null;
    },

    /**
     * Returns class description.
     * 
     * @param {String} modelName
     * @return {String} DMSModel description
     */
    getDMSModelDescription: function (modelName) {
        var model = CMDBuildUI.util.helper.ModelHelper.getDMSModelFromName(modelName);
        return model ? model.getTranslatedDescription() : null;
    },

    /**
     * Returns view description.
     * 
     * @param {String} viewName
     * @return {String} View description
     */
    getViewDescription: function (viewName) {
        var view = CMDBuildUI.util.helper.ModelHelper.getViewFromName(viewName);
        return view ? view.getTranslatedDescription() : null;
    },

    /**
     * Returns report description.
     * 
     * @param {String} reportName
     * @return {String} Report description
     */
    getReportDescription: function (reportName) {
        var report = CMDBuildUI.util.helper.ModelHelper.getReportFromName(reportName);
        return report ? report.getTranslatedDescription() : null;
    },

    /**
     * Returns dashboard description.
     * 
     * @param {String} dashboarName
     * @return {String} Dashboard description
     */
    getDashboardDescription: function (dashboarName) {
        var dashboard = CMDBuildUI.util.helper.ModelHelper.getDashboardFromName(dashboarName);
        return dashboard ? dashboard.getTranslatedDescription() : null;
    },

    /**
     * Returns object description.
     * 
     * @param {String} objectName
     * @return {String} Object description
     */
    getObjectDescription: function (objectName) {
        var type = CMDBuildUI.util.helper.ModelHelper.getObjectTypeByName(objectName);
        switch (type) {
            case CMDBuildUI.util.helper.ModelHelper.objecttypes.klass:
                return CMDBuildUI.util.helper.ModelHelper.getClassDescription(objectName);
            case CMDBuildUI.util.helper.ModelHelper.objecttypes.process:
                return CMDBuildUI.util.helper.ModelHelper.getProcessDescription(objectName);
            case CMDBuildUI.util.helper.ModelHelper.objecttypes.dmsmodel:
                return CMDBuildUI.util.helper.ModelHelper.getDMSModelDescription(objectName);
            case CMDBuildUI.util.helper.ModelHelper.objecttypes.view:
                return CMDBuildUI.util.helper.ModelHelper.getViewDescription(objectName);
            case CMDBuildUI.util.helper.ModelHelper.objecttypes.report:
                return CMDBuildUI.util.helper.ModelHelper.getReportDescription(objectName);
        }
    },

    bulkComboSettingsData: function () {
        return [{
            value: true,
            label: CMDBuildUI.locales.Locales.administration.systemconfig.enabled
        }, {
            value: false,
            label: CMDBuildUI.locales.Locales.administration.systemconfig.disabled
        }];
    },

    bulkComboPermissionsData: function () {
        return [{
            value: 'null',
            label: CMDBuildUI.locales.Locales.administration.common.labels.default
        }, {
            value: 'true',
            label: CMDBuildUI.locales.Locales.administration.systemconfig.enabled
        }, {
            value: 'false',
            label: CMDBuildUI.locales.Locales.administration.systemconfig.disabled
        }];
    }
});