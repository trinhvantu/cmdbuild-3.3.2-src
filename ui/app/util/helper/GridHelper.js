Ext.define('CMDBuildUI.util.helper.GridHelper', {
    singleton: true,

    /**
     * @param {String} objectType The model type.
     * @param {String} objectTypeName The target name.
     * @param {Object} config The config object to use in CMDBuildUI.util.helper.GridHelper.getColumns
     * @return {Ext.promise.Promise} Resolve method has as argument an 
     *      instance of {Ext.data.Model}. Reject method has as argument 
     *      a {String} containing error message.
     */
    getColumnsForType: function (objectType, objectTypeName, config) {
        var deferred = new Ext.Deferred();
        var item = CMDBuildUI.util.helper.ModelHelper.getObjectFromName(objectTypeName, objectType);
        if (item) {
            config = Ext.applyIf(config || {}, {
                preferences: CMDBuildUI.util.helper.UserPreferences.getGridPreferences(objectType, objectTypeName),
                addTypeColumn: item.get("prototype")
            });
    
            CMDBuildUI.util.helper.ModelHelper.getModel(objectType, objectTypeName).then(function (model) {
                var columns = CMDBuildUI.util.helper.GridHelper.getColumns(model.getFields(), config);
                deferred.resolve(columns);
            });
        } else {
            deferred.reject();
        }
        return deferred.promise;
    },

    /**
     * Returns columns definition for grids.
     * 
     * @param {Ext.data.field.Field[]} fields
     * @param {Object} config
     * @param {String[]|Boolean} config.allowFilter An array of columns on which enable filters or true to enable filter for each column.
     * @param {Boolean} config.addTypeColumn If `true` a new column is added as first item with object type.
     * @param {Boolean} config.reducedGrid if true shows the reducedGrid columns
     * @param {Object} config.preferences
     * @param {String[]} config.aggregate The columns that must show sum
     * @return {Object[]} An array of Ext.grid.column.Column definitions.
     */
    getColumns: function (fields, config) {
        var columns = [];
        var me = this;

        config = Ext.applyIf(config || {}, {
            allowFilter: false,
            addTypeColumn: false,
            reducedGrid: false,
            aggregate: []
        });

        var haspreferences = config.preferences && !Ext.isEmpty(config.preferences.columns);

        if (CMDBuildUI.util.helper.Configurations.get(CMDBuildUI.model.Configuration.multitenant.enabled)) {
            var type = fields[0].owner.objectType;
            var name = fields[0].owner.objectTypeName;
            var objectdefinition = CMDBuildUI.util.helper.ModelHelper.getObjectFromName(name, type);
            var multitenantMode = objectdefinition ? objectdefinition.get("multitenantMode") : null;
            if (
                multitenantMode === CMDBuildUI.model.users.Tenant.tenantmodes.always ||
                multitenantMode === CMDBuildUI.model.users.Tenant.tenantmodes.mixed
            ) {
                // get hidden and flex properties from preferences
                var hidden = true, flex = 0.8, filter;
                if (haspreferences) {
                    var tenantcolumn = Ext.Array.findBy(config.preferences.columns, function (item) {
                        return item.attribute === '_tenant';
                    });
                    hidden = tenantcolumn ? false : true;
                    flex = tenantcolumn ? tenantcolumn.width : 0;
                }

                // add filter
                if (config && config.allowFilter !== undefined && (
                    (Ext.isBoolean(config.allowFilter) && config.allowFilter === true) ||
                    (Ext.isArray(config.allowFilter) && config.allowFilter.indexOf(field.name) !== -1)
                )) {
                    filter = {
                        type: 'list',
                        store: {
                            proxy: 'memory',
                            data: CMDBuildUI.util.helper.SessionHelper.getActiveTenants()
                        },
                        idField: 'code',
                        labelField: 'description'
                    }
                }

                // add column
                columns.push({
                    text: CMDBuildUI.util.Utilities.getTenantLabel(),
                    dataIndex: "_tenant",
                    attributename: '_tenant',
                    hidden: hidden,
                    flex: flex,
                    filter: filter,
                    renderer: function (value, metaData, record, rowIndex, colIndex, store, view) {
                        var tenants = CMDBuildUI.util.helper.SessionHelper.getActiveTenants();
                        var t = Ext.Array.findBy(tenants, function (i) {
                            return i.code == value;
                        });
                        return t && t.description;
                    }
                });

            }
        }

        if (config.addTypeColumn && !haspreferences) {
            columns.push({
                text: CMDBuildUI.locales.Locales.common.grid.subtype,
                dataIndex: "_type",
                attributename: '_type',
                hidden: false,
                flex: 0.8,
                renderer: function (value, metaData, record, rowIndex, colIndex, store, view) {
                    return CMDBuildUI.util.helper.ModelHelper.getObjectDescription(value);
                }
            });
        } else if (config.addTypeColumn) {
            var typecolumn = Ext.Array.findBy(config.preferences.columns, function (item) {
                return item.attribute === '_type';
            });

            columns.push({
                text: CMDBuildUI.locales.Locales.common.grid.subtype,
                dataIndex: "_type",
                attributename: '_type',
                hidden: typecolumn ? false : true,
                flex: typecolumn ? typecolumn.width : 0,
                renderer: function (value, metaData, record, rowIndex, colIndex, store, view) {
                    return CMDBuildUI.util.helper.ModelHelper.getObjectDescription(value);
                }
            });
        }

        var hasvisiblefields = false;
        Ext.Array.each(fields, function (field, index) {
            var column = me.getColumn(field, config);
            if (column) {
                // override column based on preferences
                if (haspreferences) {
                    var colpref = Ext.Array.findBy(config.preferences.columns, function (item) {
                        return item.attribute === column.attributename;
                    });
                    if (colpref) {
                        column.hidden = false;
                        column.flex = colpref.width;
                    } else {
                        column.hidden = true;
                    }
                }
                // add column
                columns.push(column);
                hasvisiblefields = !column.hidden ? true : hasvisiblefields;
            }
        });

        if (!hasvisiblefields) {
            var desccol = Ext.Array.findBy(columns, function (c) {
                return c.dataIndex === "Description" || c.dataIndex === "Name" || c.dataIndex === "Code";
            });
            if (desccol) {
                desccol.hidden = false;
            }
            var namecol = Ext.Array.findBy(columns, function (c) {
                return c.dataIndex === "Name";
            });
            if (namecol) {
                namecol.hidden = false;
            }
        }
        return columns;
    },

    /**
     * Returns column definition.
     * 
     * @param {Ext.data.field.Field} field
     * @param {Object} config
     * @param {String[]|Boolean} config.allowFilter An array of columns on which enable filters or true to enable filter for each column.
     * @param {Boolean} config.reducedGrid if true shows the reducedGrid columns
     * @return {Object} An `Ext.grid.column.Column` definition.
     */
    getColumn: function (field, config) {
        var column;
        var me = this;
        config = config || {};
        if (!Ext.String.startsWith(field.name, "_") && !field.hidden) {
            column = {
                text: field.isInstance ? field.getDescription() : field.attributeconf._description_translation || field.description || field.name,
                dataIndex: field.name,
                attributename: field.attributename,
                hidden: config.reducedGrid ? !field.attributeconf.showInReducedGrid : !field.attributeconf.showInGrid
            };

            if (field.attributename && field.name !== field.attributename) {
                column.sorter = {
                    property: field.attributename
                };
            }

            switch (field.cmdbuildtype.toLowerCase()) {
                case CMDBuildUI.util.helper.ModelHelper.cmdbuildtypes.boolean.toLowerCase():
                    column.flex = 0.3;
                    column.renderer = function (value, metaData, record, rowIndex, colIndex, store, view) {
                        return CMDBuildUI.util.helper.FieldsHelper.renderThreeStateBooleanField(value);
                    };
                    break;
                /**
                 * Date fields
                 */
                case CMDBuildUI.util.helper.ModelHelper.cmdbuildtypes.date.toLowerCase():
                    column.flex = 0.5;
                    column.renderer = function (value, metaData, record, rowIndex, colIndex, store, view) {
                        return CMDBuildUI.util.helper.FieldsHelper.renderDateField(value);
                    };
                    break;
                case CMDBuildUI.util.helper.ModelHelper.cmdbuildtypes.time.toLowerCase():
                    column.flex = 0.5;
                    column.renderer = function (value, metaData, record, rowIndex, colIndex, store, view) {
                        return CMDBuildUI.util.helper.FieldsHelper.renderTimeField(value, {
                            hideSeconds: !field.attributeconf.showSeconds
                        });
                    };
                    break;
                case CMDBuildUI.util.helper.ModelHelper.cmdbuildtypes.datetime.toLowerCase():
                    column.flex = 0.8;
                    column.renderer = function (value, metaData, record, rowIndex, colIndex, store, view) {
                        return CMDBuildUI.util.helper.FieldsHelper.renderTimestampField(value, {
                            hideSeconds: !field.attributeconf.showSeconds
                        });
                    };
                    break;
                /**
                 * Numeric fields
                 */
                case CMDBuildUI.util.helper.ModelHelper.cmdbuildtypes.decimal.toLowerCase():
                    column.flex = 0.5;
                    column.tdCls = Ext.baseCSSPrefix + "numericcell";
                    column.renderer = function (value, metaData, record, rowIndex, colIndex, store, view) {
                        if (!Ext.isEmpty(value)) {
                            return Ext.String.format(
                                "<div class=\"{0}cell-content\">{1}</div>",
                                Ext.baseCSSPrefix,
                                CMDBuildUI.util.helper.FieldsHelper.renderDecimalField(value, {
                                    scale: field.attributeconf.scale,
                                    showThousandsSeparator: field.attributeconf.showThousandsSeparator,
                                    unitOfMeasure: field.attributeconf.unitOfMeasure,
                                    unitOfMeasureLocation: field.attributeconf.unitOfMeasureLocation
                                })
                            );
                        }
                    };
                    break;
                case CMDBuildUI.util.helper.ModelHelper.cmdbuildtypes.double.toLowerCase():
                    column.flex = 0.5;
                    column.tdCls = Ext.baseCSSPrefix + "numericcell";
                    column.renderer = function (value, metaData, record, rowIndex, colIndex, store, view) {
                        if (!Ext.isEmpty(value)) {
                            return Ext.String.format(
                                "<div class=\"{0}cell-content\">{1}</div>",
                                Ext.baseCSSPrefix,
                                CMDBuildUI.util.helper.FieldsHelper.renderDoubleField(value, {
                                    visibleDecimals: field.attributeconf.visibleDecimals,
                                    showThousandsSeparator: field.attributeconf.showThousandsSeparator,
                                    unitOfMeasure: field.attributeconf.unitOfMeasure,
                                    unitOfMeasureLocation: field.attributeconf.unitOfMeasureLocation
                                })
                            );
                        }
                    };
                    break;
                case CMDBuildUI.util.helper.ModelHelper.cmdbuildtypes.integer.toLowerCase():
                    column.flex = 0.5;
                    column.tdCls = Ext.baseCSSPrefix + "numericcell";
                    column.renderer = function (value, metaData, record, rowIndex, colIndex, store, view) {
                        if (!Ext.isEmpty(value)) {
                            return Ext.String.format(
                                "<div class=\"{0}cell-content\">{1}</div>",
                                Ext.baseCSSPrefix,
                                CMDBuildUI.util.helper.FieldsHelper.renderIntegerField(value, {
                                    showThousandsSeparator: field.attributeconf.showThousandsSeparator,
                                    unitOfMeasure: field.attributeconf.unitOfMeasure,
                                    unitOfMeasureLocation: field.attributeconf.unitOfMeasureLocation
                                })
                            );
                        }
                    };
                    break;
                /**
                 * Relation fields
                 */
                case CMDBuildUI.util.helper.ModelHelper.cmdbuildtypes.lookup.toLowerCase():
                    column.flex = 0.8;
                    CMDBuildUI.model.lookups.LookupType.loadLookupValues(field.attributeconf.lookupType);
                    column.renderer = function (value, metaData, record, rowIndex, colIndex, store, view) {
                        return CMDBuildUI.util.helper.FieldsHelper.renderLookupField(value, {
                            lookupIdField: field.attributeconf.lookupIdField,
                            lookupType: field.attributeconf.lookupType,
                            fieldName: field.name,
                            record: record
                        });
                    };
                    break;

                case CMDBuildUI.util.helper.ModelHelper.cmdbuildtypes.foreignkey.toLowerCase():
                case CMDBuildUI.util.helper.ModelHelper.cmdbuildtypes.reference.toLowerCase():
                    column.flex = 1;
                    column.renderer = function (value, metaData, record, rowIndex, colIndex, store, view) {
                        return CMDBuildUI.util.helper.FieldsHelper.renderReferenceField(value, {
                            fieldName: field.name,
                            isHtml: field.attributeconf._html,
                            targetType: field.attributeconf.targetType,
                            targetTypeName: field.attributeconf.targetClass,
                            stripTags: true,
                            record: record
                        });
                    };
                    break;
                /**
                 * IP Address
                 */
                case CMDBuildUI.util.helper.ModelHelper.cmdbuildtypes.ipaddress.toLowerCase():
                    column.flex = 0.8;
                    if (field.attributeconf.ipType === "ipv4") {
                        column.flex = 0.5;
                    }
                    break;
                /**
                 * Text fields
                 */
                case CMDBuildUI.util.helper.ModelHelper.cmdbuildtypes.char.toLowerCase():
                    column.flex = 0.3;
                    break;
                case CMDBuildUI.util.helper.ModelHelper.cmdbuildtypes.string.toLowerCase():
                    column.flex = 1;
                    if (field.attributeconf.maxLength < 100 && field.attributeconf.maxLength >= 50) {
                        column.flex = 0.8;
                    } else if (field.attributeconf.maxLength < 50) {
                        column.flex = 0.5;
                    }
                    column.renderer = function (value, metaData, record, rowIndex, colIndex, store, view) {
                        return me.renderTextColumn(value, field.attributeconf._html);
                    };
                    break;
                case CMDBuildUI.util.helper.ModelHelper.cmdbuildtypes.text.toLowerCase():
                    column.flex = 1;
                    column.renderer = function (value, metaData, record, rowIndex, colIndex, store, view) {
                        return me.renderTextColumn(value, field.attributeconf._html);
                    };
                    break;

            }

            // add column filter
            if (config && config.allowFilter !== undefined && (
                (Ext.isBoolean(config.allowFilter) && config.allowFilter === true) ||
                (Ext.isArray(config.allowFilter) && config.allowFilter.indexOf(field.name) !== -1)
            )) {
                switch (field.cmdbuildtype.toLowerCase()) {
                    case CMDBuildUI.util.helper.ModelHelper.cmdbuildtypes.boolean.toLowerCase():
                        column.filter = {
                            type: 'boolean',
                            serializer: function (value) {
                                return !!value;
                            }
                        };
                        break;
                    case CMDBuildUI.util.helper.ModelHelper.cmdbuildtypes.char.toLowerCase():
                        column.filter = {
                            type: 'string',
                            itemDefaults: {
                                maxLength: 1
                            }
                        };
                        break;
                    case CMDBuildUI.util.helper.ModelHelper.cmdbuildtypes.date.toLowerCase():
                    case CMDBuildUI.util.helper.ModelHelper.cmdbuildtypes.time.toLowerCase():
                    case CMDBuildUI.util.helper.ModelHelper.cmdbuildtypes.datetime.toLowerCase():
                        column.filter = {
                            type: 'date'
                        };
                        break;
                    case CMDBuildUI.util.helper.ModelHelper.cmdbuildtypes.decimal.toLowerCase():
                        column.filter = {
                            type: 'numeric',
                            itemDefaults: {
                                decimalPrecision: field.attributeconf.scale
                            }
                        };
                        break;
                    case CMDBuildUI.util.helper.ModelHelper.cmdbuildtypes.double.toLowerCase():
                        column.filter = {
                            type: 'numeric'
                        };
                        break;
                    case CMDBuildUI.util.helper.ModelHelper.cmdbuildtypes.integer.toLowerCase():
                        column.filter = {
                            type: 'numeric',
                            itemDefaults: {
                                decimalPrecision: 0
                            }
                        };
                        break;
                    case CMDBuildUI.util.helper.ModelHelper.cmdbuildtypes.ipaddress.toLowerCase():
                        column.filter = {
                            type: 'string'
                        };
                        break;
                    case CMDBuildUI.util.helper.ModelHelper.cmdbuildtypes.lookup.toLowerCase():
                        var lstore = CMDBuildUI.util.helper.FormHelper.getLookupStore(field.attributeconf.lookupType);
                        lstore.autoLoad = false;
                        column.filter = {
                            type: 'list',
                            cmdbuildtype: CMDBuildUI.util.helper.ModelHelper.cmdbuildtypes.lookup,
                            store: lstore,
                            idField: '_id',
                            labelField: 'text'
                        };
                        break;
                    case CMDBuildUI.util.helper.ModelHelper.cmdbuildtypes.reference.toLowerCase():
                        column.filter = {
                            type: 'reference'
                        };
                        break;
                    case CMDBuildUI.util.helper.ModelHelper.cmdbuildtypes.string.toLowerCase():
                        column.filter = {
                            type: 'string'
                        };
                        break;
                    case CMDBuildUI.util.helper.ModelHelper.cmdbuildtypes.text.toLowerCase():
                        column.filter = {
                            type: 'string'
                        };
                        break;
                }
                // use original attribute name for filter
                if (column.filter) {
                    column.filter.dataIndex = field.attributeconf.name;
                }
            }
            // add column sum
            if (config.aggregate && config.aggregate.indexOf(field.name) !== -1) {
                column.summaryType = 'sum';
                column.summaryRenderer = function (value) {
                    return column.renderer.call({}, value);
                };
            }

        }
        return column;
    },

    /**
     * Returns column editor definition for field.
     * 
     * @param {Ext.data.field.Field} field
     * @param {Object} config
     * @param {String[]|Boolean} config.allowFilter An array of columns on which enable filters or true to enable filter for each column.
     * @param {Boolean} config.reducedGrid if true shows the reducedGrid columns
     * @return {Object} An `Ext.grid.column.Column` definition.
     */
    getEditorForField: function (field, config) {
        var editor = CMDBuildUI.util.helper.FormHelper.getEditorForField(field, config);

        switch (field.cmdbuildtype.toLowerCase()) {
            case CMDBuildUI.util.helper.ModelHelper.cmdbuildtypes.reference.toLowerCase():
                editor.xtype = "referencecombofield";
                break;
            case CMDBuildUI.util.helper.ModelHelper.cmdbuildtypes.boolean.toLowerCase():
                editor.padding = "auto auto auto 10px";
                break;
        }
        return editor;
    },

    /**
     * Return configuration for print button.
     * @param {Object} config 
     */
    getPrintButtonConfig: function (config) {
        config = config || {};
        var buttonCongif = {
            xtype: 'button',
            ui: 'management-action',
            iconCls: 'x-fa fa-print',
            tooltip: CMDBuildUI.locales.Locales.common.grid.print,
            arrowVisible: false,
            autoEl: {
                'data-testid': 'grid-printbtn'
            },
            localized: {
                tooltip: 'CMDBuildUI.locales.Locales.common.grid.print'
            },
            menu: [{
                iconCls: 'x-fa fa-file-pdf-o',
                itemId: 'printPdfBtn',
                text: CMDBuildUI.locales.Locales.common.grid.printpdf,
                printformat: 'pdf',
                localized: {
                    text: 'CMDBuildUI.locales.Locales.common.grid.printpdf'
                }
            }, {
                iconCls: 'x-fa fa-file-excel-o',
                itemId: 'printCsvBtn',
                text: CMDBuildUI.locales.Locales.common.grid.printcsv,
                printformat: 'csv',
                localized: {
                    text: 'CMDBuildUI.locales.Locales.common.grid.printcsv'
                }
            }]
        };

        return Ext.applyIf(config, buttonCongif);
    },

    /**
     * Return configuration for buffered grid counter.
     * @param {String} storeName
     */
    getBufferedGridCounterConfig: function (storeName, config) {
        if (storeName) {
            var config = config || {}

            var bind = Ext.applyIf({
                store: '{' + storeName + '}'
            }, config.bind);

            return Ext.applyIf({
                xtype: 'bufferedgridcounter',
                padding: '0 20 0 0',
                bind: bind
            }, config);
        }
    },

    /**
     * Get process flow status column
     * @return {Object}
     */
    getProcessFlowStatusColumn: function () {
        return {
            dataIndex: "status",
            enableColumnHide: false,
            hideable: false,
            draggable: false,
            sortable: false,
            menuDisabled: true,
            width: "38px",
            maxWidth: "38px",
            minWidth: "38px",
            renderer: function (value, metaData, record, rowIndex, colIndex, store, view) {
                var output = "";
                // get formatted description
                if (value) {
                    var lookupvalue = CMDBuildUI.model.lookups.Lookup.getLookupValueById(CMDBuildUI.model.processes.Process.flowstatus.lookuptype, value);
                    if (lookupvalue) {
                        var icon = lookupvalue.get("icon_font") || "x-fa fa-square";
                        var icon_color = lookupvalue.get("icon_color") || "inherit";
                        var txt = lookupvalue.get("_description_translation") || lookupvalue.get("description");

                        output = Ext.String.format(
                            "<span class=\"{0}\" style=\"color: {1}; cursor: help;\" data-qtip=\"{2}\"></span>",
                            icon,
                            icon_color,
                            txt
                        );
                    }
                }
                return output;
            }
        };
    },

    /**
     * Get save grid preferences tool
     * @return {Ext.panel.Tool}
     */
    getSaveGridPreferencesTool: function () {
        return {
            xtype: 'tool',
            cls: Ext.baseCSSPrefix + 'tool-gray',
            iconCls: 'x-fa fa-save',
            itemId: 'savePreferencesBtn',
            tooltip: CMDBuildUI.locales.Locales.main.preferences.gridpreferencessave,
            localized: {
                tooltip: 'CMDBuildUI.locales.Locales.main.preferences.gridpreferencessave'
            }
        };
    },

    /**
     * Save grid preferences
     * @param {Ext.grid.Panel} grid 
     * @param {Ext.panel.Tool} tool
     * @param {String} objectType 
     * @param {String} objectTypeName 
     */
    saveGridPreferences: function (grid, tool, objectType, objectTypeName) {
        function savePreferences() {
            var config = {
                columns: [],
                defaultOrder: []
            };
            // columns
            var columns = grid.getVisibleColumns();
            columns.forEach(function (column) {
                if (column.attributename) {
                    config.columns.push({
                        attribute: column.attributename,
                        width: Math.round(column.getWidth() / grid.getWidth() * 100) / 100
                    });
                }
            });
            // sorters
            grid.getStore().getSorters().getRange().forEach(function (sorter) {
                config.defaultOrder.push({
                    attribute: sorter.getProperty(),
                    direction: sorter.getDirection() === 'ASC' ? 'ascending' : 'descending'
                });
            });

            // update preferences
            CMDBuildUI.util.helper.UserPreferences.updateGridPreferences(objectType, objectTypeName, config).then(function () {
                CMDBuildUI.util.Notifier.showSuccessMessage(CMDBuildUI.locales.Locales.main.preferences.gridpreferencessaved);
            });
        }

        function clearPreferences() {
            // clear preferences
            CMDBuildUI.util.helper.UserPreferences.updateGridPreferences(objectType, objectTypeName, {
                columns: undefined,
                defaultOrder: undefined
            }).then(function () {
                CMDBuildUI.util.Notifier.showSuccessMessage(CMDBuildUI.locales.Locales.main.preferences.gridpreferencescleared);
            });
        }

        if (tool.menu) {
            // show existing menu
            tool.menu.show();
        } else if (Ext.Object.isEmpty(CMDBuildUI.util.helper.UserPreferences.getGridPreferences(objectType, objectTypeName))) {
            // save preferences if not saved yet
            savePreferences();
        } else {
            // show menu to chose action update or clear
            tool.menu = Ext.create('Ext.menu.Menu', {
                autoShow: true,
                items: [{
                    text: CMDBuildUI.locales.Locales.main.preferences.gridpreferencesupdate,
                    iconCls: 'x-fa fa-save',
                    handler: function () {
                        savePreferences();
                    }
                }, {
                    text: CMDBuildUI.locales.Locales.main.preferences.gridpreferencesclear,
                    iconCls: 'x-fa fa-remove',
                    handler: function () {
                        clearPreferences();
                    }
                }]
            });
            tool.menu.alignTo(tool.el.id, 't-b?');
        }
    },

    /**
     * 
     * @param {String} type Object type
     * @param {Object} config Ovverride configuration
     * @return {Object}
     */
    getFormInRowWidget: function (type, config) {
        var xtype;
        config = config || {};

        switch (type) {
            case CMDBuildUI.util.helper.ModelHelper.objecttypes.klass:
                xtype = 'classes-cards-tabpanel';
                break;
            case CMDBuildUI.util.helper.ModelHelper.objecttypes.process:
                xtype = 'processes-instances-tabpanel';
                break;
            case CMDBuildUI.util.helper.ModelHelper.objecttypes.calendar:
                xtype = 'events-tabpanel';
                break;
            case CMDBuildUI.util.helper.ModelHelper.objecttypes.dmsmodel:
                xtype = 'dms-tabpanel';
                break;
        }

        var baseconf = {
            xtype: xtype,
            ui: 'managementlighttabpanel',
            cls: 'tabbarwithtools',
            padding: '0 0 8 0',
            tabPosition: 'top',
            readOnlyTabs: true,
            bind: {}
        };
        return Ext.apply(baseconf, config);
    },

    privates: {
        /**
         * Remove tags if is html or convert tags to string if is plain.
         * 
         * @param {String} value 
         * @param {Boolean} html 
         */
        renderTextColumn: function (value, html) {
            if (!html) {
                value = CMDBuildUI.util.helper.FieldsHelper.renderTextField(value);
            }
            return Ext.util.Format.stripTags(value);
        }
    }
});
