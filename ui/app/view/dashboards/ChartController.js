Ext.define('CMDBuildUI.view.dashboards.ChartController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.dashboards-chart',

    control: {
        '#': {
            afterrender: 'onBeforeRender',
            collapse: 'onCollapse',
            expand: 'onExpand'
        },
        '#showHideParamsBtn': {
            click: 'onShowHideParamsBtnClick'
        },
        '#showHideTableBtn': {
            click: 'onShowHideTableBtnClick'
        },
        '#refreshBtn': {
            click: 'onRefreshBtnClick'
        }
    },

    /**
     * 
     * @param {CMDBuildUI.view.dashboards.Chart} view 
     * @param {Object} eOpts 
     */
    onBeforeRender: function (view, eOpts) {
        var me = this,
            vm = view.lookupViewModel();
        var conf,
            chart = vm.get("chart");
        var isText = chart.get("type") === CMDBuildUI.model.dashboards.Chart.charttypes.text,
            isGrid = chart.get("type") === CMDBuildUI.model.dashboards.Chart.charttypes.table;
        var isSourceFn = chart.get("dataSourceType") === CMDBuildUI.model.dashboards.Chart.dataSourceTypes.funktion;

        if (isSourceFn) {
            // add parameters
            var parameters = chart.dataSourceParameters();
            if (parameters.count()) {
                view.add(me.getParametersForm(parameters));
                vm.set("showhideparamsbtn.hidden", false);
            }
        }

        // add chart 
        switch (chart.get("type")) {
            case CMDBuildUI.model.dashboards.Chart.charttypes.bar:
                conf = me.getBarConfig(chart);
                break;
            case CMDBuildUI.model.dashboards.Chart.charttypes.gauge:
                conf = me.getGaugeConfig(chart);
                break;
            case CMDBuildUI.model.dashboards.Chart.charttypes.line:
                conf = me.getLineConfig(chart);
                break;
            case CMDBuildUI.model.dashboards.Chart.charttypes.pie:
                conf = me.getPieConfig(chart);
                break;
            case CMDBuildUI.model.dashboards.Chart.charttypes.table:
                break;
            case CMDBuildUI.model.dashboards.Chart.charttypes.text:
                conf = me.getTextConfig(chart);
                break;
        }
        if (conf) {
            view.add(conf);
        }

        if (!isText) {
            // add grid
            this.addGrid(chart, view, isGrid);
            vm.set("showhidetablebtn.hidden", isGrid);
            vm.set("refreshbtn.hidden", false);
        }
        if (isGrid) {
            vm.set("grid.hidden", false);
        }
    },

    /**
     * 
     * @param {CMDBuildUI.view.dashboards.Chart} view 
     * @param {Object} eOpts 
     */
    onCollapse: function (view, eOpts) {
        view.lookupViewModel().set("toolsdisabled", true);
    },

    /**
     * 
     * @param {CMDBuildUI.view.dashboards.Chart} view 
     * @param {Object} eOpts 
     */
    onExpand: function (view, eOpts) {
        view.lookupViewModel().set("toolsdisabled", false);
    },

    /**
     * 
     * @param {Ext.button.Button} button 
     * @param {Ext.event.Event} e 
     */
    onLoadBtnClick: function (button, e) {
        var vm = button.lookupViewModel();
        vm.get("records").load();
    },

    /**
     * 
     * @param {Ext.button.Button} btn 
     * @param {Boolean} pressed 
     * @param {Object} eOpts 
     */
    onShowHideParamsBtnClick: function (btn, pressed, eOpts) {
        var vm = btn.lookupViewModel();
        var hidden = !vm.get("form.hidden");
        vm.set("form.hidden", hidden);
        hidden ? btn.removeCls('active') : btn.addCls('active');
    },

    /**
     * 
     * @param {Ext.button.Button} btn 
     * @param {Boolean} pressed 
     * @param {Object} eOpts 
     */
    onShowHideTableBtnClick: function (btn, pressed, eOpts) {
        var vm = btn.lookupViewModel();
        var hidden = !vm.get("grid.hidden");
        vm.set("grid.hidden", hidden);
        hidden ? btn.removeCls('active') : btn.addCls('active');
    },

    /**
     * 
     * @param {Ext.button.Button} btn 
     * @param {Object} eOpts 
     */
    onRefreshBtnClick: function (btn, eOpts) {
        btn.lookupViewModel().get("records").load();
    },

    /**
     * 
     * @param {Ext.data.Store} store 
     * @param {Ext.data.operation.Read} operation 
     * @param {Object} eOpts 
     */
    onStoreBeforeLoad: function (store, operation, eOpts) {
        var view = this.getView();
        view._loader = CMDBuildUI.util.Utilities.addLoadMask(view, {
            useTargetEl: true
        });
    },

    /**
     * 
     * @param {Ext.data.Store} store 
     * @param {Ext.data.Model[]} records 
     * @param {Boolean} successful 
     * @param {Ext.data.operation.Read} operation 
     * @param {Object} eOpts 
     */
    onStoreLoad: function (store, records, successful, operation, eOpts) {
        var view = this.getView();
        CMDBuildUI.util.Utilities.removeLoadMask(view._loader);
    },

    privates: {
        /**
         * 
         * @property {Numeric} chartHeight 
         */
        chartHeight: 250,

        /**
         * 
         * @property {Numeric} gridMaxHeight 
         */
        gridMaxHeight: 200,

        /**
         * Serie tooltip format
         * @property {Numeric} chartHeight 
         */
        tooltipFormat: '<strong>{0}:</strong> {1}',

        /**
         * 
         * @param {CMDBuild.model.dashboards.Chart} chart 
         * @return {Ext.form.Panel}
         */
        getParametersForm: function (parameters) {
            var me = this,
                vm = this.getViewModel(),
                values = {},
                paramsnames = {};
            var form = {
                xtype: 'form',
                bodyPadding: '0 10',
                fieldDefaults: CMDBuildUI.util.helper.FormHelper.fieldDefaults,
                items: [],
                bind: {
                    hidden: '{form.hidden}'
                },
                dockedItems: [{
                    xtype: 'toolbar',
                    dock: 'right',
                    defaults: {
                        minWidth: 100
                    },
                    items: [{
                        xtype: 'tbfill'
                    }, {
                        xtype: 'button',
                        formBind: true,
                        ui: 'management-action-small',
                        text: CMDBuildUI.locales.Locales.common.actions.load,
                        handler: me.onLoadBtnClick
                    }]
                }]
            };
            parameters.getRange().forEach(function (parameter, index) {
                var field = me.getEditorForParameter(parameter, index);
                form.items.push(field);
                values[field.name] = parameter.get('defaultValue');
                paramsnames[field.name] = field.metadata.attributename;
            });
            vm.set("parameters", Ext.create("Ext.data.Model", values));
            vm.set("paramsnames", paramsnames);
            return form;
        },

        /**
         * 
         * @param {Object} parameter 
         * @param {Integer} index 
         * @return {Ext.form.Field}
         */
        getEditorForParameter: function (parameter) {
            var editor,
                type = parameter.get("type").toLowerCase();

            // base editor config
            var field = {
                name: CMDBuildUI.util.Utilities.stringRemoveSpecialCharacters(parameter.get("name")),
                cmdbuildtype: parameter.get("type"),
                attributeconf: {
                    attributename: parameter.get("name")
                },
                mandatory: parameter.get("required"),
                writable: true,
                description: parameter.get("_name_translation") || parameter.get("description"),
                getDescription: function () {
                    return this.description;
                }
            };
            var editorconfig = {
                linkName: "parameters",
                mode: CMDBuildUI.util.helper.FormHelper.formmodes.update
            };

            if (parameter.get("defaultValue")) {
                editorconfig.defaultValue = {
                    value: parameter.get("defaultValue")
                };
            }

            // customize for string and integer types
            if (
                type === CMDBuildUI.util.helper.ModelHelper.cmdbuildtypes.integer ||
                type === CMDBuildUI.util.helper.ModelHelper.cmdbuildtypes.bigint
            ) {
                switch (parameter.get("fieldType").toLowerCase()) {
                    case "card":
                        var target = parameter.get("classToUseForReferenceWidget");
                        field.cmdbuildtype = CMDBuildUI.util.helper.ModelHelper.cmdbuildtypes.foreignkey;
                        field.attributeconf.preselectIfUnique = true;
                        field.attributeconf.targetType = CMDBuildUI.util.helper.ModelHelper.getObjectTypeByName(target);
                        field.attributeconf.targetClass = target;
                        break;
                    case "lookup":
                        field.attributeconf.preselectIfUnique = parameter.get("preselectIfUnique");
                        field.cmdbuildtype = CMDBuildUI.util.helper.ModelHelper.cmdbuildtypes.lookup;
                        field.attributeconf.lookupType = parameter.get("lookupType");
                        break;
                }
                if (!Ext.isEmpty(parameter.get("ecqlFilter"))) {
                    field.attributeconf.ecqlFilter = parameter.get("ecqlFilter");
                }
            } else if (type === CMDBuildUI.util.helper.ModelHelper.cmdbuildtypes.string) {
                switch (parameter.get("fieldType").toLowerCase()) {
                    case "classes":
                        editor = CMDBuildUI.util.helper.FormHelper.getFormField(field, editorconfig);
                        Ext.merge(editor, {
                            xtype: 'combobox',
                            valueField: 'name',
                            displayField: '_description_translation',
                            autoLoadOnValue: false,
                            queryMode: 'local',
                            bind: {
                                store: '{classes}'
                            }
                        });
                        break;
                }
            }
            if (!editor) {
                editor = CMDBuildUI.util.helper.FormHelper.getFormField(field, editorconfig);
            }
            return editor;
        },

        /**
         * 
         * @param {CMDBuild.model.dashboards.Chart} chart 
         * @return {Ext.chart.CartesianChart} 
         */
        getBarConfig: function (chart) {
            var me = this,
                series = [];
            var xfield = chart.get("categoryAxisField"),
                xlabel = chart.get("_categoryAxisLabel_translation") || chart.get("categoryAxisLabel"),
                yfields = chart.get("valueAxisFields") || [],
                ylabel = chart.get("_valueAxisLabel_translation") || chart.get("valueAxisLabel"),
                flipxy = chart.get("chartOrientation") === "horizontal";

            // generate series
            series = [{
                type: 'bar',
                xField: xfield,
                yField: yfields,
                title: yfields,
                stacked: true,
                style: {
                    opacity: 0.80,
                    minGapWidth: 5
                },
                highlightCfg: {
                    opacity: 1
                },
                tooltip: {
                    trackMouse: true,
                    renderer: function (tooltip, record, item) {
                        var html;
                        if (yfields.length > 1) {
                            html = Ext.String.format(
                                '<strong>{0} - {1}:</strong> {2}',
                                record.get(xfield),
                                item.field,
                                record.get(item.field)
                            );
                        } else {
                            html = Ext.String.format(
                                me.tooltipFormat,
                                record.get(xfield),
                                record.get(item.field)
                            )
                        }
                        tooltip.setHtml(html);
                    }
                }
            }];

            // return cartesian configuration
            return {
                xtype: 'cartesian',
                legend: chart.get("legend"),
                height: parseInt(chart.get("height")) || this.chartHeight,
                flipXY: flipxy,
                theme: cmdbuildConfig.manifest,
                animation: {
                    easing: 'easeOut',
                    duration: 400
                },
                bind: {
                    store: '{records}'
                },
                axes: [{
                    type: 'numeric',
                    position: flipxy ? 'bottom' : 'left',
                    fields: yfields,
                    title: ylabel,
                    grid: true,
                    minimum: 0
                }, {
                    type: 'category',
                    position: flipxy ? 'left' : 'bottom',
                    fields: xfield,
                    title: xlabel,
                    grid: true
                }],
                series: series
            };
        },

        /**
         * 
         * @param {CMDBuild.model.dashboards.Chart} chart 
         * @return {Ext.chart.PolarChart} 
         */
        getPieConfig: function (chart) {
            var me = this,
                legend = false,
                labelfield = chart.get("labelField"),
                valuefield = chart.get("singleSeriesField");

            // check for legend
            if (chart.get("legend")) {
                legend = {
                    docked: 'bottom'
                };
            }
            // return polar configuration
            return {
                xtype: 'polar',
                theme: cmdbuildConfig.manifest, //'default-gradients',
                height: parseInt(chart.get("height")) || this.chartHeight,
                bind: {
                    store: '{records}'
                },
                legend: legend,
                interactions: ['rotate'],
                insetPadding: 5,
                innerPadding: 5,
                series: [{
                    type: 'pie',
                    angleField: valuefield,
                    label: {
                        field: labelfield,
                        display: 'none'
                    },
                    highlight: true,
                    tooltip: {
                        trackMouse: true,
                        renderer: function (tooltip, record, item) {
                            if (Ext.isEmpty(record.get("percentage"))) {
                                var sum = 0;
                                this.getStore().getRange().forEach(function (i) {
                                    sum += i.get(valuefield);
                                });
                                record.set("percentage", Ext.Number.toFixed(100 / sum * record.get(valuefield), 2));
                            }
                            tooltip.setHtml(Ext.String.format(
                                me.tooltipFormat,
                                record.get(labelfield),
                                Ext.String.format('{0} - {1}%', record.get(valuefield), record.get("percentage"))
                            ));
                        }
                    }
                }]
            };
        },

        /**
         * 
         * @param {CMDBuild.model.dashboards.Chart} chart 
         * @return {Ext.chart.CartesianChart} 
         */
        getLineConfig: function (chart) {
            var me = this,
                series = [];
            var xfield = chart.get("categoryAxisField"),
                xlabel = chart.get("_categoryAxisLabel_translation") || chart.get("categoryAxisLabel"),
                yfields = chart.get("valueAxisFields") || [],
                ylabel = chart.get("_valueAxisLabel_translation") || chart.get("valueAxisLabel");

            // generate series
            yfields.forEach(function (yfield) {
                series.push({
                    type: 'line',
                    xField: xfield,
                    yField: yfield,
                    title: yfield,
                    style: {
                        lineWidth: 1,
                        opacity: 0.8
                    },
                    marker: {
                        radius: 4,
                        lineWidth: 1,
                        opacity: 0.7
                    },
                    highlight: {
                        radius: 7,
                        fillStyle: 'black',
                        strokeStyle: 'white'
                    },
                    tooltip: {
                        trackMouse: true,
                        renderer: function (tooltip, record, item) {
                            tooltip.setHtml(Ext.String.format(
                                me.tooltipFormat,
                                record.get(xfield),
                                record.get(item.field)
                            ));
                        }
                    }
                });
            });
            // return chart configuration
            return {
                xtype: 'cartesian',
                reference: 'chart',
                height: parseInt(chart.get("height")) || this.chartHeight,
                theme: cmdbuildConfig.manifest,
                legend: chart.get("legend"),
                animation: {
                    duration: 200
                },
                bind: {
                    store: '{records}'
                },
                series: series,
                axes: [{
                    type: 'numeric',
                    position: 'left',
                    grid: true,
                    minimum: 0,
                    title: ylabel
                }, {
                    type: 'category',
                    position: 'bottom',
                    grid: true,
                    title: xlabel
                }]
            };
        },

        /**
         * 
         * @param {CMDBuild.model.dashboards.Chart} chart 
         * @return {Ext.chart.PolarChart} 
         */
        getGaugeConfig: function (chart) {
            var fgcolor = chart.get("fgcolor"),
                bgcolor = chart.get("bgcolor");
            if (Ext.isEmpty(fgcolor) || Ext.isEmpty(bgcolor)) {
                var theme = Ext.Factory.chartTheme(cmdbuildConfig.manifest);
                var theme_colors = theme.getColors();
                fgcolor = fgcolor || theme_colors[0];
                bgcolor = bgcolor || theme_colors[1];
            }

            return {
                xtype: 'polar',
                theme: cmdbuildConfig.manifest,
                height: parseInt(chart.get("height")) || this.chartHeight,
                legend: chart.get("legend"),

                insetPadding: 30,

                bind: {
                    store: '{records}'
                },
                axes: {
                    type: 'numeric',
                    position: 'gauge',
                    majorTickSteps: chart.get("steps"),
                    minimum: chart.get("minimum"),
                    maximum: chart.get("maximum")
                },
                series: {
                    type: 'gauge',
                    donut: 50,
                    angleField: chart.get("singleSeriesField"),
                    totalAngle: Math.PI,
                    needleLength: 100,
                    colors: [
                        fgcolor,
                        bgcolor
                    ]
                }
            };
        },

        /**
         * 
         * @param {CMDBuild.model.dashboards.Chart} chart 
         * @return {Ext.panel.Panel} 
         */
        getTextConfig: function (chart) {
            var conf = {
                bodyPadding: CMDBuildUI.util.helper.FormHelper.properties.padding,
                html: chart.get("text"),
                height: parseInt(chart.get("height")) || this.chartHeight,
                scrollable: true
            };
            if (chart.get("height")) {
                conf.maxHeight = chart.get("height");
            }
            return conf;
        },

        /**
         * 
         * @param {CMDBuildUI.model.Dashboards.Chart} chart
         * @param {CMDBuildUI.view.dashboards.Chart} view
         * @param {Boolean} isGrid
         */
        addGrid: function (chart, view, isGrid) {
            var me = this;
            chart.getSourceAttributes().then(function (attributes) {
                var columns = [];
                if(!me.destroyed){
                    
                    attributes.getRange().forEach(function (attribute) {
                        if (attribute.get('name') === chart.get('categoryAxisField')) {
                            attribute.set('_description_translation', chart.get('_categoryAxisLabel_translation') || chart.get('categoryAxisLabel') || attribute.get('description') || attribute.get('name'));
                        }
                        if (chart.get('valueAxisFields').indexOf(attribute.get('name')) > -1) {
                            attribute.set('_description_translation', chart.get('_valueAxisLabel_translation') || chart.get('valueAxisLabel') || attribute.get('description') || attribute.get('name'));
    
                        }
                        var field = CMDBuildUI.util.helper.ModelHelper.getModelField(attribute.getData());
                        var column = field ? CMDBuildUI.util.helper.GridHelper.getColumn(field) : null;
                        if (column) {
                            if (attribute.get('name') === chart.get('labelField')) {
                                column.text = chart.get('_labelField_translation') || chart.get('labelField') || column.text;
                            }
                            column.dataIndex = column.attributename;
                            columns.push(column);
                        }
                    });
                    var config = {
                        xtype: 'grid',
                        columns: columns,
                        maxHeight: me.gridMaxHeight,
                        hidden: true,
                        viewConfig: {
                            enableTextSelection: true
                        },
                        bind: {
                            store: '{records}',
                            hidden: '{grid.hidden}'
                        }
                    };
                    if (isGrid) {
                        config.maxHeight = parseInt(chart.get("height")) || me.chartHeight;
                        config.hidden = false;
                        var sourcetype = chart.get("dataSourceType");
                        if (sourcetype !== CMDBuildUI.model.dashboards.Chart.dataSourceTypes.funktion) {
                            config.columns.push({
                                xtype: 'actioncolumn',
                                minWidth: 30,
                                maxWidth: 30,
                                hideable: false,
                                align: 'center',
                                iconCls: 'x-fa fa-external-link',
                                tooltip: CMDBuildUI.locales.Locales.common.actions.open,
                                handler: function (grid, rowIndex, colIndex, item, event, record) {
                                    var path;
                                    switch (sourcetype) {
                                        case CMDBuildUI.model.dashboards.Chart.dataSourceTypes.klass:
                                            path = "classes/{0}/cards/{1}";
                                            break;
                                        case CMDBuildUI.model.dashboards.Chart.dataSourceTypes.process:
                                            path = "processes/{0}/instances/{1}";
                                            break;
                                        case CMDBuildUI.model.dashboards.Chart.dataSourceTypes.view:
                                            path = "views/{0}/items/{1}";
                                            break;
                                    }
                                    path = Ext.String.format(path, chart.get("dataSourceName"), record.get("_id"));
                                    me.redirectTo(path);
                                }
                            });
                        }
                    }
                    view.add(config);
                }
            });
        }
    }
});