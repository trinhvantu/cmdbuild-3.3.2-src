Ext.define("CMDBuildUI.view.widgets.customform.Utilities", {
    singleton: true,

    getModel: function (theWidget) {
        if (theWidget.get("ModelType").toLowerCase() === 'form') {
            return this.createModelFromWidgetDefAttributes(theWidget);
        } else if (theWidget.get("ModelType").toLowerCase() === 'class') {
            return this.createModelFromClassAttributes(theWidget);
        } else if (theWidget.get("ModelType").toLowerCase() === 'function') {
            // TODO: Show error message - not yet implemented
        } else {
            // TODO: Show error message
        }
    },


    /**
     * Load data
     * @param {Boolean} force If `true` data is always readed from the server or from the configuration.
     * Data saved in output variable in target object will be ignored.
     */

    loadData: function (theWidget, theTarget, callback) {
        var me = this;
        function executeCallback(data) {
            var store = Ext.create("Ext.data.Store", {
                model: me.getModelName(theWidget),
                proxy: 'memory',
                data: data
            });
            data = store.getRange();
            store.destroy();
            Ext.callback(callback, null, [data]);
        }
        // get data from configuration or server
        if (theWidget.get("DataType")) {
            if (theWidget.get("DataType").toLowerCase() === 'raw' || theWidget.get("DataType").toLowerCase() === 'raw_json') {
                var rawJson = theWidget.get('RawData');
                this.loadDataFromJson(rawJson, executeCallback);
            } else if (theWidget.get("DataType").toLowerCase() === 'raw_text') {
                var rawData = theWidget.get('RawData');
                var serializationconfig = this.getSerializationConfig(theWidget);
                this.loadDataFromRawText(rawData, serializationconfig, executeCallback);
            } else if (theWidget.get("DataType").toLowerCase() === 'function') {
                this.loadDataFromFunction(theWidget, theTarget, executeCallback);
            } else {
                // TODO: Show error message
            }
        }

    },

    /**
     * 
     * @param {*} theWidget 
     * 
     * @return {Ext.promise.Promise}
     */
    createModelFromWidgetDefAttributes: function (theWidget) {
        var me = this;
        me.resetModelAttributes();
        var str_attributes = theWidget.get("FormModel");
        var attributes_def = Ext.JSON.decode(str_attributes, true);
        if (attributes_def) {
            attributes_def.forEach(function (attribute_def, i) {
                var attr_def = Ext.applyIf(attribute_def, {
                    index: i,
                    showInGrid: attribute_def.showColumn !== undefined ? !(attribute_def.showColumn == 'false' || attribute_def.showColumn == false) : true,
                    writable: true
                });
                if (attribute_def.filter) {
                    attribute_def.filter = attribute_def.filter.expression;
                }
                if (!attribute_def.targetClass && !Ext.isEmpty(attribute_def.target)) {
                    attribute_def.targetClass = attribute_def.target.name;
                    attribute_def.targetType = attribute_def.target.type;
                }
                var modelAttr = Ext.create("CMDBuildUI.model.Attribute", attr_def);
                if (!me.hasModelAttribute(modelAttr)) {
                    me.addModelAttribute(modelAttr);
                }
            }, this);
            return me.createModel(me.getModelName(theWidget));
        }
    },

    /**
     * 
     * @param {*} theWidget 
     * 
     * @return {Ext.promise.Promise}
     */
    createModelFromClassAttributes: function (theWidget) {
        var deferred = new Ext.Deferred();
        var me = this;
        me.resetModelAttributes();
        var targetTypeName = theWidget.get("ClassModel");
        var allowedattributes;
        if (!Ext.isEmpty(theWidget.get("ClassAttributes"))) {
            allowedattributes = theWidget.get("ClassAttributes").split(",");
        }

        var item = CMDBuildUI.util.helper.ModelHelper.getClassFromName(targetTypeName);
        item.getAttributes().then(function (attributes) {
            attributes.getRange().forEach(function (record, i) {
                if ((Ext.isEmpty(allowedattributes) || allowedattributes.indexOf(record.get("name")) !== -1) &&
                    record.get("active") &&
                    !Ext.Array.contains(CMDBuildUI.util.helper.ModelHelper.ignoredFields, record.get("name"))
                ) {
                    if (!me.hasModelAttribute(record)) {
                        me.addModelAttribute(record);
                    }
                }
            }, this);

            me.createModel(me.getModelName(theWidget)).then(function(model) {
                deferred.resolve(model);
            });
        },
            //on reject
            Ext.empty,

            //on Progress
            Ext.emptyFn,

            //scope
            this
        );
        return deferred.promise;
    },

    loadDataFromJson: function (rawJson, callback) {
        var data = [];
        data = Ext.JSON.decode(rawJson);
        Ext.asap(function () {
            Ext.callback(callback, null, [data]);
        });
    },

    loadDataFromRawText: function (rawData, serializationconfig, callback) {
        if (rawData) {
            var attrs = {},
                data = [];
            // attributes types
            this._model_attributes.forEach(function (attr) {
                attrs[attr.get("name")] = attr.get("type");
            });

            // get data
            rawData.split(serializationconfig.rowseparator).forEach(function (srow) {
                var row = {};
                srow.split(serializationconfig.attributeseparator).forEach(function (sattribute) {
                    var splitted_attr = sattribute.split(serializationconfig.keyseparator);
                    var attr_name, attr_value;
                    if (splitted_attr.length === 2) {
                        attr_name = splitted_attr[0];
                        attr_value = splitted_attr[1];
                    } else if (splitted_attr.length === 1) {
                        attr_name = splitted_attr[0];
                        attr_value = null;
                    }
                    if (attr_name && attr_value) {
                        switch (attrs[attr_name]) {
                            case CMDBuildUI.util.helper.ModelHelper.cmdbuildtypes.date:
                                attr_value = attr_value.split(" ")[0];
                                break;
                        }
                        row[attr_name] = attr_value;
                    }
                });
                data.push(row);
            });
            Ext.asap(function () {
                Ext.callback(callback, null, [data]);
            });
        }
    },

    loadDataFromFunction: function (theWidget, theTarget, callback) {
        var me = this;
        var fnName = theWidget.get("FunctionData");
        if (!fnName) {
            // TODO: return error - bad configuration
            return;
        }

        Ext.getStore("Functions").getFunctionByName(fnName).then(function (fn) {

            //This param must be yet setted. The set is made in calculateFunctionVariableObject function
            var functionVariableObject = theWidget.get('_functionVariableObject');
            var fn_parameters = {};

            //calculate the values of the function parameters
            for (var key in functionVariableObject) {
                //get-s the param name
                var parname = functionVariableObject[key]['ecqlAttribute'];

                //resolves the variable
                if (functionVariableObject[key].attribute){
                    fn_parameters[key] = CMDBuildUI.util.ecql.Resolver.resolveServerVariables([parname], theTarget)[parname];
                } else {
                    fn_parameters[key] = functionVariableObject[key].ecqlAttribute;
                }
            }

            // model configuration
            var fn_model = {
                output: []
            };
            me.getModelAttributes().forEach(function (attribute) {
                switch (attribute.get("type").toLowerCase()) {
                    case CMDBuildUI.util.helper.ModelHelper.cmdbuildtypes.lookup.toLowerCase():
                        fn_model.output.push({
                            name: attribute.get("name"),
                            type: 'lookup',
                            lookupType: attribute.get("lookupType")
                        });
                        break;
                    case CMDBuildUI.util.helper.ModelHelper.cmdbuildtypes.reference.toLowerCase():
                        fn_model.output.push({
                            name: attribute.get("name"),
                            type: 'foreignkey',
                            fkTarget: attribute.get("targetClass")
                        });
                        break;
                }
            });

            fn.getOutputs(fn_parameters, fn_model).then(function (data, metadata) {
                Ext.asap(function () {
                    Ext.callback(callback, me, [data]);
                });
            });
        });
    },

    /**
     * Resolve variable.
     * @param {String} variable
     * @return {*} The variable resolved.
     */
    extractVariableFromString: function (variable, theTarget) {
        var s_variable = this.extractEcqlAttributeFromString(variable);
        if (Ext.isArra(s_variable)) {
            var result;
            if (s_variable[0] === "server") {
                result = CMDBuildUI.util.ecql.Resolver.resolveServerVariables([s_variable[1]], theTarget);
                return result[s_variable[1]];
            } else if (s_variable[0] === "client") {
                result = CMDBuildUI.util.ecql.Resolver.resolveClientVariables([s_variable[1]], theTarget);
                return result[s_variable[1]];
            }
        } else {
            return s_variable;
        }
    },

    /**
     * 
     * @param {*} variable 
     */
    extractEcqlAttributeFromString: function (variable) {
        if (Ext.isString(variable) && CMDBuildUI.util.api.Client.testRegExp(/^{(client|server)+:*.+}$/, variable)) {
            variable = variable.replace("{", "").replace("}", "");
            var s_variable = variable.split(":");
            return s_variable;
        }

        return variable;
    },

    /**
     * This function takes the parameters of the theWidget.FunctionData
     * and extracts an useful object
     * {
     *  parameter_name: {  
     *      attribute: '',
     *      ecqlAtribute: ''
     *  }
     * }
     * 
     * parameter_name: the name parameter to pass in the rest function call
     * attribute: the name of the widget attribute from wich the parameter name is calculated
     * ecqlAttribute: contains the attribute information and an extra string used to calculate the parameter_name value
     * @param {*} theWidget 
     * @modifies thewidget setting the _functionVariableObject parameter
     */
    calculateFunctionVariableObject: function (theWidget) {
        var deferred = new Ext.Deferred();
        var me = this;
        var fnName = theWidget.get("FunctionData");
        if (!fnName) {
            // TODO: return error - bad configuration
            return;
        }

        //Finds the funtion in the store
        Ext.getStore("Functions").getFunctionByName(fnName).then(function (fn) {

            // evaluate parameters from widget definition
            var functionVariableObject = {};
            var parameters = fn.parameters().getRange();

            if (parameters.length) {
                parameters.forEach(function (parameter) {

                    //calculates the ecqlAttrbiute from the function parameter
                    var ecqlAttributeArray = me.extractEcqlAttributeFromString(theWidget.get(parameter.get("name")));
                    var ecqlAttribute = Ext.isArray(ecqlAttributeArray) ? ecqlAttributeArray[1] : ecqlAttributeArray
                    var attribute;

                    if (Ext.isString(ecqlAttribute)) {
                        //calculates the attribute of the widget
                        attribute = ecqlAttribute.split('.')[0];
                    }

                    //compose the final object
                    functionVariableObject[parameter.get("name")] = {
                        attribute: attribute,
                        ecqlAttribute: ecqlAttribute
                    }
                });
            }

            deferred.resolve(functionVariableObject);
        }) //add catch error handling

        return deferred.promise;
    },

    privates: {

        _model_attributes: [],

        resetModelAttributes: function () {
            this._model_attributes = [];
        },

        /**
         * @param {CMDBuildUI.model.Attribute} attribute
         */
        addModelAttribute: function (attribute) {
            this._model_attributes.push(attribute);
        },

        /**
         * 
         * @param {*} attribubute 
         */
        hasModelAttribute: function (attribubute) {
            var found;
            if (this._model_attributes && this._model_attributes.length > 0) {

                found = Ext.Array.findBy(this._model_attributes, function (item, index, array) {
                    return item.getId() == attribubute.getId();
                }, this);
            }

            return !Ext.isEmpty(found);
        },

        /**
         * @return {CMDBuildUI.model.Attribute[]}
         */
        getModelAttributes: function () {
            return this._model_attributes;
        },

        /**
         * Create model using given attributes.
         */
        createModel: function (modelname) {
            var deferred = new Ext.Deferred();
            var attributes = this._model_attributes;
            // sort attributes
            attributes.sort(function (a, b) {
                var ai = a.data.index || 0,
                    bi = b.data.index;
                return ai === bi ? 0 : (ai < bi ? -1 : 1);
            });

            // get fields
            var fields = [];
            for (var i = 0; i < attributes.length; i++) {
                var field = CMDBuildUI.util.helper.ModelHelper.getModelFieldFromAttribute(attributes[i]);
                if (field) {
                    fields.push(field);
                }
            }

            if (!Ext.ClassManager.isCreated(modelname)) {
                // create model
                Ext.define(modelname, {
                    extend: 'CMDBuildUI.model.base.Base',
                    fields: fields,
                    proxy: 'memory'
                });
            } else {
                var model = Ext.ClassManager.get(modelname);
                var removefields = [];
                model.getFields().forEach(function(f) {
                    if (!f.identifier) {
                        removefields.push(f.getName());
                    };
                });
                model.removeFields(removefields);
                model.addFields(fields);
            }
            deferred.resolve(model);
            return deferred.promise;
        },

        getModelName: function (theWidget) {
            return 'CMDBuildUI.model.customform.' + theWidget.getId();
        },

        /**
         * Get serialization configs.
         * @return {Object} An object containing `type`, `keyseparator`, `attributeseparator` and `rowseparator`.
         */
        getSerializationConfig: function (configs) {
            return {
                type: configs.get("SerializationType") || 'text',
                keyseparator: configs.get("KeyValueSeparator") || '=',
                attributeseparator: configs.get("AttributesSeparator") || ',',
                rowseparator: configs.get("RowsSeparator") || '\n'
            };
        },

        serialize: function (theWidget, response) {
            response = response || [];
            var serializationconfig = this.getSerializationConfig(theWidget);
            var model = Ext.ClassManager.get(this.getModelName(theWidget));
            var modelAttributes = {};
            var rows = [];
            model.getFields().forEach(function (field) {
                if (field.getName() !== "_id") {
                    modelAttributes[field.getName()] = field.cmdbuildtype.toLowerCase();
                }
            });

            var isValid = true;
            response.forEach(function(record) {
                if (record.isModel && !record.isValid()) {
                    isValid = false;
                }
            });
            if (!isValid) {
                theWidget._ownerButton.addError(CMDBuildUI.locales.Locales.widgets.customform.datanotvalid);
            } else {
                theWidget._ownerButton.removeError(CMDBuildUI.locales.Locales.widgets.customform.datanotvalid);
            }

            if (serializationconfig.type === "json") {
                response.forEach(function (row) {
                    var r = {};
                    // save only model attributes
                    Ext.Object.each(row.getData(), function (k, v) {
                        if (modelAttributes[k]) {
                            switch (modelAttributes[k]) {
                                case CMDBuildUI.util.helper.ModelHelper.cmdbuildtypes.date:
                                case CMDBuildUI.util.helper.ModelHelper.cmdbuildtypes.datetime:
                                    if (Ext.isDate(v)) {
                                        v = Ext.Date.format(v, "c");
                                    } else {
                                        v = Ext.Date.format(new Date(v), "c");
                                    }
                                    break;
                            }
                            r[k] = v;
                        }
                    });
                    rows.push(r);
                });
            } else {
                response.forEach(function (row) {
                    var rdata = row.data ? row.getData() : row;
                    var attributes = [];
                    for (var k in rdata) {
                        // save only model attributes
                        if (modelAttributes[k]) {
                            var v = rdata[k];
                            switch (modelAttributes[k]) {
                                case CMDBuildUI.util.helper.ModelHelper.cmdbuildtypes.date:
                                case CMDBuildUI.util.helper.ModelHelper.cmdbuildtypes.datetime:
                                    if (Ext.isDate(v)) {
                                        v = Ext.Date.format(v, "c");
                                    } else {
                                        v = Ext.Date.format(new Date(v), "c");
                                    }
                                    break;
                            }
                            attributes.push(Ext.String.format("{0}{1}{2}", k, serializationconfig.keyseparator, v));
                        }
                    }
                    rows.push(attributes.join(serializationconfig.attributeseparator));
                });
            }

            return rows.join(serializationconfig.rowseparator);
        }

    }

});