Ext.define('CMDBuildUI.view.administration.content.schedules.ruledefinitions.card.FormHelper', {
    singleton: true,

    /**
     * Get general properties fieldset
     * 
     * @param {String} mode display|edit|both
     * @return {Ext.form.FieldSet} The url for api resourcess
     */
    getGeneralProperties: function (mode) {
        var me = this;
        var fieldset = {
            fieldDefaults: CMDBuildUI.util.administration.helper.FormHelper.fieldDefaults,
            ui: 'administration-formpagination',
            xtype: "fieldset",
            layout: 'column',
            collapsible: true,
            title: CMDBuildUI.locales.Locales.administration.common.strings.generalproperties,
            localized: {
                title: 'CMDBuildUI.locales.Locales.administration.common.strings.generalproperties'
            },

            items: [
                me.getContainer([
                    me.getDescription(mode),
                    me.getContent(mode)
                ]),
                me.getContainer([
                    me.getOwnerClass(mode),
                    me.getOwnerAttribute(mode)
                ]),
                me.getContainer([
                    me.getUser(mode),
                    me.getGroup(mode)
                ]),
                me.getContainer([
                    me.getTimeZone(mode),
                    me.getSequenceParamsEditMode(mode)
                ]),
                me.getContainer([
                    me.getActive(mode),
                    me.getCreateAlsoViaWS(mode)
                ])
            ]
        };

        return fieldset;
    },

    /**
     * Get general properties fieldset
     * 
     * @param {String} mode display|edit|both
     * @return {Ext.form.FieldSet} The url for api resourcess
     */
    getTypeProperties: function (mode) {
        if (!mode) {
            mode = 'both';
        }
        var me = this;
        var fieldset = {
            fieldDefaults: CMDBuildUI.util.administration.helper.FormHelper.fieldDefaults,
            ui: 'administration-formpagination',
            xtype: "fieldset",
            layout: 'column',
            collapsible: true,
            title: CMDBuildUI.locales.Locales.administration.schedules.schedulerule,
            localized: {
                title: 'CMDBuildUI.locales.Locales.administration.schedules.schedulerule'
            },

            items: [
                me.getContainer([
                    me.getCategory(mode),
                    me.getPriority(mode)
                ]),
                me.getContainer([
                    me.getEditable(mode),
                    me.getCascade(mode)
                ]),
                me.getContainer([
                    me.getCondition(mode)
                ], {
                    columnWidth: 2
                }),

                me.getContainer([
                    me.getEventTime(mode)
                ]),
                // NOT NEEDED from F.B. 22/01/2020
                // me.getContainer([
                //     me.getShowGeneratedEventsPreview(mode)
                // ]),

                me.getContainer([
                    me.getFrequency(mode),
                    me.getFrequencyMultiplier(mode)
                ]),

                me.getContainer([
                    me.getEndType(mode),
                    me.getContainer([
                        me.getNumberOfOccurrencies(mode),
                        me.getEndDate(mode)
                    ], {
                        columnWidth: 0.5
                    })
                ]),


                me.getContainer([
                    me.getDelayPeriod(mode),
                    me.getDelay(mode)
                ]),
                me.getContainer([
                    me.getMaxActiveEvents(mode)
                ]),
                me.getContainer([
                    me.getNotificationTemplate(mode)
                ]),
                me.getContainer([
                    me.getDaysAdvanceNotification(mode)
                ]),
                me.getContainer([
                    me.getNotificationReport(mode),
                    me.getNotificationReportFormatInput(mode)
                ]),
                me.getContainer([
                    me.getReportParametersGrid(mode)
                ], {
                    fieldLabel: CMDBuildUI.locales.Locales.administration.tasks.reportparameters,
                    localized: {
                        fieldLabel: 'CMDBuildUI.locales.Locales.administration.tasks.reportparameters'
                    },
                    buttons: undefined,
                    layout: 'fit',
                    hidden: true,
                    bind: {
                        hidden: '{!theSchedule.notifications___0___reports___0___code}'
                    }
                })
            ]
        };
        return fieldset;
    },

    /**
     * @private
     */
    privates: {
        getContainer: function (items, config) {
            var fieldcontainer = Ext.merge({}, {
                xtype: 'fieldcontainer',
                layout: 'column',
                columnWidth: 1,
                items: items
            }, config || {});

            fieldcontainer.items = items;

            return fieldcontainer;            

        },

        // General properties fieldset
        getDescription: function (mode) {
            // description
            var propertyName = 'description';
            var config = {};
            config[propertyName] = {
                fieldcontainer: {
                    allowBlank: false
                },
                allowBlank: false,
                bind: {
                    value: '{theSchedule.description}'
                }
            };
            if (mode !== CMDBuildUI.util.administration.helper.FormHelper.formActions.view) {
                config[propertyName].fieldcontainer.labelToolIconCls = 'fa-flag';
                config[propertyName].fieldcontainer.labelToolIconQtip = CMDBuildUI.locales.Locales.administration.attributes.tooltips.translate;
                config[propertyName].fieldcontainer.labelToolIconClick = 'onTranslateClickDescription';
            }
            return CMDBuildUI.util.administration.helper.FieldsHelper.getDescriptionInput(config, mode);
        },
        getContent: function (mode) {
            // content 
            var propertyName = 'content';
            var config = {};
            config[propertyName] = {
                fieldcontainer: {
                    userCls: 'with-tool',
                    fieldLabel: CMDBuildUI.locales.Locales.administration.schedules.extendeddescription

                },
                bind: {
                    value: '{theSchedule.content}'
                }

            };
            if (mode !== CMDBuildUI.util.administration.helper.FormHelper.formActions.view) {
                config[propertyName].fieldcontainer.labelToolIconCls = 'fa-flag';
                config[propertyName].fieldcontainer.labelToolIconQtip = CMDBuildUI.locales.Locales.administration.attributes.tooltips.translate;
                config[propertyName].fieldcontainer.labelToolIconClick = 'onTranslateClickExtDescription';
            }

            return CMDBuildUI.util.administration.helper.FieldsHelper.getCommonTextareaInput(propertyName, config);
        },
        // 
        getOwnerClass: function (mode) {
            // ownerClass
            var config = {};
            var propertyName = 'ownerClass';
            config[propertyName] = {
                fieldcontainer: {
                    allowBlank: false,
                    fieldLabel: CMDBuildUI.locales.Locales.administration.schedules.klass,
                    localized: {
                        fieldLabel: 'CMDBuildUI.locales.Locales.administration.schedules.klass'
                    }
                },
                displayfield: {
                    bind: {
                        value: '{theSchedule._ownerClass_description}'
                    }
                },
                withClasses: true,
                withProcesses: true,
                withDMSModels: true,
                allowBlank: false,
                disabledCls: '',
                bind: {
                    value: '{theSchedule.ownerClass}'
                }
            };
            return CMDBuildUI.util.administration.helper.FieldsHelper.getAllClassesInput(config, 'ownerClass', false, mode);
        },
        getOwnerAttribute: function (mode) {
            // ownerAttr
            var config = {};
            var propertyName = 'ownerAttr';
            config[propertyName] = {
                fieldcontainer: {
                    allowBlank: false,
                    fieldLabel: CMDBuildUI.locales.Locales.administration.schedules.attribute,
                    localized: {
                        fieldLabel: 'CMDBuildUI.locales.Locales.administration.schedules.attribute'
                    }
                },
                displayfield: {
                    bind: {
                        value: '{theSchedule._ownerAttr_description}'
                    }
                },
                displayField: 'description',
                valueField: '_id',
                allowBlank: false,
                bind: {
                    store: '{attributesStore}',
                    value: '{theSchedule.ownerAttr}'
                }
            };
            return CMDBuildUI.util.administration.helper.FieldsHelper.getCommonComboInput('ownerAttr', config, false, false);
        },
        // 
        getUser: function (mode) {
            var field = {
                xtype: 'bufferedcombo',
                margin: '0 15 0 0',
                labelAlign: 'top',
                fieldLabel: CMDBuildUI.locales.Locales.administration.schedules.user,
                localized: {
                    fieldLabel: 'CMDBuildUI.locales.Locales.administration.schedules.user'
                },
                displayMode: true,
                valueField: '_id',
                displayField: 'username',
                columns: [{
                    dataIndex: 'username',
                    flex: 1
                }],
                name: 'userId',
                storealias: 'users',
                modelname: 'CMDBuildUI.model.users.User',
                recordLinkName: 'theSchedule',
                bind: {
                    value: '{theSchedule.userId}'
                }
            };
            return {
                columnWidth: 0.5,
                xtype: 'fieldcontainer',
                layout: 'hbox',
                items: [field]

            };
        },

        getGroup: function () {
            var field = {
                xtype: 'bufferedcombo',
                margin: '0 15 0 0',
                labelAlign: 'top',
                displayMode: true,
                valueField: '_id',
                displayField: 'description',
                columns: [{
                    dataIndex: 'description',
                    flex: 1
                }],
                name: 'groupId',
                storealias: 'groups',
                modelname: 'CMDBuildUI.model.users.Group',
                recordLinkName: 'theSchedule',
                bind: {
                    value: '{theSchedule.groupId}'
                },
                fieldLabel: CMDBuildUI.locales.Locales.administration.schedules.group,
                localized: {
                    fieldLabel: 'CMDBuildUI.locales.Locales.administration.schedules.group'
                }
            };
            return {
                columnWidth: 0.5,
                xtype: 'fieldcontainer',
                layout: 'hbox',
                items: [field]

            };

        },

        // 
        getDelayPeriod: function () {
            var config = {};
            var propertyName = 'periodDelay';
            config[propertyName] = {
                fieldcontainer: {
                    fieldLabel: CMDBuildUI.locales.Locales.administration.schedules.delayfirstdeadline,
                    localized: {
                        fieldLabel: 'CMDBuildUI.locales.Locales.administration.schedules.delayfirstdeadline'
                    }
                },
                bind: {
                    store: '{delaysStore}',
                    value: '{delayPeriod}'
                }
            };
            return CMDBuildUI.util.administration.helper.FieldsHelper.getCommonComboInput(propertyName, config, false, false);
        },
        getDelay: function () {
            // delay
            var config = {};
            var propertyName = 'delay';
            config[propertyName] = {
                fieldcontainer: {
                    fieldLabel: CMDBuildUI.locales.Locales.administration.schedules.delayfirstdeadlinevalue,
                    localized: {
                        fieldLabel: 'CMDBuildUI.locales.Locales.administration.schedules.delayfirstdeadlinevalue'
                    }
                },
                minValue: 0,
                disabledCls: '',
                bind: {
                    value: '{delay}'
                }
            };
            return CMDBuildUI.util.administration.helper.FieldsHelper.getCommonNumberfieldInput('delay', config, false, false);

        },
        getTimeZone: function () {
            // timeZone
            var config = {};
            var propertyName = 'timezone';
            config[propertyName] = {
                fieldcontainer: {
                    fieldLabel: CMDBuildUI.locales.Locales.administration.schedules.timezone,
                    localized: {
                        fieldLabel: 'CMDBuildUI.locales.Locales.administration.schedules.timezone'
                    }
                },
                displayfield: {
                    bind: {
                        value: '{theSchedule._timeZone_description}'
                    },
                    renderer: function (value) {
                        if (!value) {
                            return CMDBuildUI.locales.Locales.administration.common.labels.default;
                        }
                        return value;
                    }
                },
                emptyText: CMDBuildUI.locales.Locales.administration.common.labels.default,
                localized: {
                    emptyText: 'CMDBuildUI.locales.Locales.administration.common.labels.default'
                },
                valueField: '_id',
                displayField: 'description',
                disabledCls: '',
                bind: {
                    store: '{timeZonesStore}',
                    value: '{theSchedule.timeZone}'
                },
                triggers: {
                    clear: CMDBuildUI.util.administration.helper.FormHelper.getClearComboTrigger()
                }
            };
            return CMDBuildUI.util.administration.helper.FieldsHelper.getCommonComboInput(propertyName, config, false, false);
        },
        // 
        getActive: function (mode) {
            // active
            var config = {};
            var propertyName = 'active';
            config[propertyName] = {
                fieldcontainer: {
                    fieldLabel: CMDBuildUI.locales.Locales.administration.schedules.active,
                    localized: {
                        fieldLabel: 'CMDBuildUI.locales.Locales.administration.schedules.active'
                    }
                },
                disabledCls: '',
                bind: {
                    value: '{theSchedule.active}'
                }
            };
            return CMDBuildUI.util.administration.helper.FieldsHelper.getActiveInput(config, propertyName, false);
        },

        getCreateAlsoViaWS: function (mode) {
            // active
            var config = {};
            var propertyName = 'createAlsoViaWS';
            config[propertyName] = {
                fieldcontainer: {
                    fieldLabel: CMDBuildUI.locales.Locales.administration.schedules.createalsoviawebservice,
                    localized: {
                        fieldLabel: 'CMDBuildUI.locales.Locales.administration.schedules.createalsoviawebservice'
                    }
                },
                disabledCls: '',
                bind: {
                    value: '{theSchedule.createAlsoViaWS}'
                }
            };
            return CMDBuildUI.util.administration.helper.FieldsHelper.getActiveInput(config, propertyName, false);
        },

        getCategory: function (mode) {
            var config = {};
            var propertyName = 'category';
            config[propertyName] = {
                fieldcontainer: {
                    fieldLabel: CMDBuildUI.locales.Locales.administration.schedules.category,
                    localized: {
                        fieldLabel: CMDBuildUI.locales.Locales.administration.schedules.category
                    }
                },
                displayfield: {
                    bind: {
                        value: '{theSchedule._category_description_translation || theSchedule._category_description}'
                    }
                },
                displayField: '_description_translation',
                valueField: 'code',
                bind: {
                    store: '{calendarCategoryStore}',
                    value: '{theSchedule.category}'
                }
            };
            return CMDBuildUI.util.administration.helper.FieldsHelper.getCommonComboInput(propertyName, config, false, false);

        },
        getPriority: function (mode) {
            var config = {};
            var propertyName = 'priority';
            config[propertyName] = {
                fieldcontainer: {
                    fieldLabel: CMDBuildUI.locales.Locales.administration.schedules.priority,
                    localized: {
                        fieldLabel: 'CMDBuildUI.locales.Locales.administration.schedules.priority'
                    }
                },
                displayfield: {
                    bind: {
                        value: '{theSchedule._priority_description_translation || theSchedule._priority_description}'
                    }
                },
                displayField: '_description_translation',
                valueField: 'code',
                bind: {
                    store: '{calendarPriorityStore}',
                    value: '{theSchedule.priority}'
                }
            };
            return CMDBuildUI.util.administration.helper.FieldsHelper.getCommonComboInput(propertyName, config, false, false);
        },
        //
        getEditable: function (mode) {
            var config = {};
            var propertyName = 'eventEditMode';
            config[propertyName] = {
                fieldcontainer: {
                    fieldLabel: CMDBuildUI.locales.Locales.administration.schedules.scheduleeditmode,
                    localized: {
                        fieldLabel: 'CMDBuildUI.locales.Locales.administration.schedules.scheduleeditmode'
                    }
                },
                bind: {
                    store: '{eventEditModeStore}',
                    value: '{theSchedule.eventEditMode}'
                }
            };
            return CMDBuildUI.util.administration.helper.FieldsHelper.getCommonComboInput(propertyName, config, false, false);
        },
        getCascade: function (mode) {

            var config = {};
            var propertyName = 'onCardDeleteAction';
            config[propertyName] = {
                fieldcontainer: {
                    fieldLabel: CMDBuildUI.locales.Locales.administration.schedules.actionondelete,
                    localized: {
                        fieldLabel: 'CMDBuildUI.locales.Locales.administration.schedules.actionondelete'
                    }
                },
                bind: {
                    store: '{cascadeStore}',
                    value: '{theSchedule.onCardDeleteAction}'
                }
            };
            return CMDBuildUI.util.administration.helper.FieldsHelper.getCommonComboInput(propertyName, config, false);
        },
        //
        getCondition: function (mode) {
            // 2 columns 
            // conditionScript
            var _config = {};
            var propertyChange = 'conditionScript';
            _config[propertyChange] = {
                fieldcontainer: {

                },
                fieldLabel: CMDBuildUI.locales.Locales.administration.schedules.condition,
                localized: {
                    fieldLabel: 'CMDBuildUI.locales.Locales.administration.schedules.condition'
                },
                disabledCls: '',
                bind: {
                    value: '{theSchedule.conditionScript}'
                }
            };


            return CMDBuildUI.util.administration.helper.FieldsHelper.getCommonTextareaInput(propertyChange, _config);
        },
        //
        getNotificationTemplate: function (mode) {
            // grid 2 clumns
            // notifications            
            var _config = {};
            var propertyName = 'notifications___0___template';
            _config[propertyName] = {
                fieldLabel: CMDBuildUI.locales.Locales.administration.schedules.notificationtemplate,
                allowBlank: true,
                displayField: 'description',
                valueField: 'name',
                bind: {
                    store: '{allEmailTemplates}',
                    value: '{theSchedule.notifications___0___template}'
                },
                triggers: {
                    clear: CMDBuildUI.util.administration.helper.FormHelper.getClearComboTrigger()
                }
            };
            return CMDBuildUI.util.administration.helper.FieldsHelper.getCommonComboInput(propertyName, _config);

        },
        getNotificationReport: function (mode) {
            // grid 2 clumns
            // notifications
            var _config = {};
            var propertyName = 'notifications___0___reports___0___code';
            _config[propertyName] = {
                fieldcontainer: {
                    allowBlank: true,
                    fieldLabel: CMDBuildUI.locales.Locales.administration.schedules.notificationreport,
                    hidden: true,
                    bind: {
                        hidden: '{!theSchedule.notifications___0___template}'
                    },
                    listeners: {
                        hide: function (component, eOpts) {
                            var input = component.down(Ext.String.format('#{0}_input', propertyName));
                            input.setValue(null);
                        }
                    }
                },
                displayField: 'description',
                valueField: 'code',
                bind: {
                    store: '{allReports}',
                    value: '{theSchedule.notifications___0___reports___0___code}'
                },
                triggers: {
                    clear: CMDBuildUI.util.administration.helper.FormHelper.getClearComboTrigger()
                },
                combofield: {
                    listeners: {
    
                        change: function (input, newValue, oldValue) {
                            var vm = input.lookupViewModel();
                           
                            if (newValue) {
                                var report = this.getStore().findRecord('code', newValue);
                                if (report) {
                                    report.getAttributes().then(function (attributesStore) {
                                        vm.set('reportAttributesStore', attributesStore);
                                    });
                                }
                            }else{
                                vm.get('reportAttributesStore').setData([]);
                            }
                        }
                    }
                }
            };
            return CMDBuildUI.util.administration.helper.FieldsHelper.getCommonComboInput(propertyName, _config);

        },
        getNotificationReportFormatInput: function () {
            var config = {};
            config.notifications___0___reports___0___format = {
                fieldcontainer: {
                    fieldLabel: CMDBuildUI.locales.Locales.administration.localizations.format,
                    localized: {
                        fieldLabel: 'CMDBuildUI.locales.Locales.administration.localizations.format'
                    },
                    hidden: true,
                    bind: {
                        hidden: '{!theSchedule.notifications___0___reports___0___code}'
                    }
                },

                bind: {
                    store: '{reportFormatsStore}',
                    value: '{theSchedule.notifications___0___reports___0___format}'
                }
            };
            return CMDBuildUI.util.administration.helper.FieldsHelper.getCommonComboInput('notifications___0___reports___0___format', config);
        },

        getReportParametersGrid: function (vm, data, theOwnerObject, theOwnerObjectKey) {
            return {
                ui: 'administration-formpagination',
                xtype: "fieldset",
                items: [{
                    xtype: 'grid',
                    headerBorders: false,
                    border: false,
                    bodyBorder: false,
                    rowLines: false,
                    sealedColumns: false,
                    sortableColumns: false,
                    enableColumnHide: false,
                    enableColumnMove: false,
                    enableColumnResize: false,
                    cls: 'administration-reorder-grid',
                    itemId: 'reportParametersGrid',
                    selModel: {
                        pruneRemoved: false // See https://docs.sencha.com/extjs/6.2.0/classic/Ext.selection.Model.html#cfg-pruneRemoved
                    },
                    viewConfig: {
                        markDirty: false
                    },
                    plugins: {
                        ptype: 'actionColumnRowEditing',
                        id: 'actionColumnRowEditing',
                        hiddenColumnsOnEdit: ['actionColumnEdit', 'actionColumnCancel'],
                        clicksToEdit: 10,
                        buttonsUi: 'button-like-tool',
                        errorSummary: false

                    },
                    controller: {
                        control: {
                            '#': {
                                edit: function (editor, context, eOpts) {
                                    context.record.set('value', editor.editor.items.items[1].getValue());
                                },
                                beforeedit: function (editor, context, eOpts) {
                                    if (editor.view.lookupViewModel().get('actions.view')) {
                                        return false;
                                    }
                                    context.record.previousValues = context.record.getData();
                                    return true;
                                },
                                canceledit: function (editor, context) {
                                    if (context && context.record) {
                                        var previousValue = context.record.previousValues && context.record.previousValues.value;
                                        if (previousValue) {
                                            context.record.set('value', previousValue);
                                        }
                                    }
                                }
                            }
                        }
                    },
                    columnWidth: 1,
                    autoEl: {
                        'data-testid': 'administration-content-schedules-ruledefinition-datatemplates-grid'
                    },

                    forceFit: true,
                    loadMask: true,

                    labelWidth: "auto",
                    bind: {
                        store: '{reportParametersStore}'
                    },
                    columns: [{
                        flex: 1,
                        text: CMDBuildUI.locales.Locales.administration.tasks.parameter,
                        localized: {
                            text: 'CMDBuildUI.locales.Locales.administration.tasks.parameter'
                        },
                        dataIndex: 'key',
                        align: 'left',
                        editor: {
                            xtype: 'displayfield',
                            height: 19,
                            minHeight: 19,
                            maxHeight: 19,
                            padding: 0,
                            ui: 'reordergrid-editor-combo'
                        }
                    }, {
                        text: CMDBuildUI.locales.Locales.administration.tasks.value,
                        localized: {
                            text: 'CMDBuildUI.locales.Locales.administration.tasks.value'
                        },
                        flex: 1,
                        dataIndex: 'value',
                        align: 'left',
                        editor: {
                            xtype: 'textfield',
                            height: 19,
                            minHeight: 19,
                            maxHeight: 19,
                            padding: 0,
                            ui: 'reordergrid-editor-combo'
                        }
                    }, {
                        xtype: 'actioncolumn',
                        itemId: 'actionColumnEdit',
                        bind: {
                            hidden: '{actions.view}'
                        },
                        width: 30,
                        minWidth: 30, // width property not works. Use minWidth.
                        maxWidth: 30,
                        align: 'center',
                        items: [{
                            handler: function (grid, rowIndex, colIndex, item, e, record) {
                                grid.editingPlugin.startEdit(record, 1);
                            },
                            getTip: function (value, metadata, record, rowIndex, colIndex, store) {
                                return CMDBuildUI.locales.Locales.administration.common.actions.edit;
                            },
                            getClass: function (value, metadata, record, rowIndex, colIndex, store) {
                                if (record.get('editing')) {
                                    return 'x-fa fa-check';
                                }
                                return 'x-fa fa-pencil';
                            }
                        }]
                    }]
                }]
            };
        },
        // NOT NEEDED from 24-01-2020 F.B.
        getEventTime: function (mode) {
            var config = {};
            var propertyName = 'eventTime';
            config[propertyName] = {
                fieldcontainer: {
                    allowBlank: false,
                    fieldLabel: CMDBuildUI.locales.Locales.administration.schedules.scheduletime,
                    localized: {
                        fieldLabel: 'CMDBuildUI.locales.Locales.administration.schedules.scheduletime'
                    }
                },

                withSeconds: true,

                vtype: 'time',
                allowBlank: true,
                enableKeyEvents: true,
                enforceMaxLength: true,
                maxLength: 8,
                listeners: {
                    change: function (input, value, oldValue) {
                        var nv = [];
                        if (value) {
                            var values = value.split(":");
                            var limit = input.withSeconds ? 3 : 2;
                            if (values.length > limit) {
                                if (limit === 3) {
                                    input.setValue(value.substring(0, 7));
                                } else {
                                    input.setValue(value.substring(0, 5));
                                }
                                return true;
                            }
                            for (var i = 0; i < values.length; i++) {
                                var n = values[i];
                                if (i === 0) {
                                    if (n.length === 1 && parseInt(n) > 2) {
                                        n = "0" + n;
                                    } else if (n.length === 2 && parseInt(n) > 23) {
                                        nv.push(n.substring(0, 1));
                                        nv.push(n.substring(2));
                                        break;
                                    }
                                }
                                if (i > 0) {
                                    if (n.length === 1 && parseInt(n) > 5) {
                                        n = "0" + n;
                                    } else if (n.length === 2 && parseInt(n) > 59) {
                                        nv.push(n.substring(0, 1));
                                        nv.push(n.substring(2));
                                        break;
                                    }

                                }
                                if (i < 2 && n.length > 2) {
                                    nv.push(n.substring(0, 2));
                                    nv.push(n.substring(2));
                                    break;
                                }
                                if (i === 2 && n.length > 2) {
                                    nv.push(n.substring(0, 2));
                                    break;
                                }
                                nv.push(n);
                            }
                        }
                        input.setValue(nv.join(":"));
                        //value = nv.join(":");
                    },
                    blur: function (field, event, eOpts) {
                        // add left pad to numbers                        
                        var v = field.getValue();
                        var nv = [];
                        if (v) {
                            v.split(":").forEach(function (n) {
                                if (!n.length) {
                                    n = "00";
                                }
                                nv.push(n.length === 1 ? "0" + n : n);
                            });
                        }
                        var limit = field.withSeconds ? 3 : 2;
                        for (var i = nv.length; i < limit; i++) {
                            nv.push('00');
                            if (nv.length === 3) {
                                break;
                            }
                        }
                        field.setValue(nv.join(":"));
                    }
                },
                minValue: 0,
                bind: {
                    value: '{theSchedule.eventTime}'
                }
            };

            return CMDBuildUI.util.administration.helper.FieldsHelper.getCommonTextfieldInput(propertyName, config);
        },

        getMaxActiveEvents: function () {
            var config = {};
            var propertyName = 'maxActiveEvents';
            config[propertyName] = {
                fieldcontainer: {
                    columnWidth: 0.5,
                    allowBlank: false,
                    fieldLabel: CMDBuildUI.locales.Locales.administration.schedules.maxactiveschedules,
                    localized: {
                        fieldLabel: 'CMDBuildUI.locales.Locales.administration.schedules.maxactiveschedules'
                    },
                    bind: {
                        hidden: Ext.String.format('{theSchedule.frequency == "{0}"}', CMDBuildUI.model.calendar.Trigger.calendarFrequencies.once)
                    }
                },
                allowBlank: false,
                minValue: 0,
                bind: {
                    value: '{theSchedule.maxActiveEvents}'
                }
            };
            return CMDBuildUI.util.administration.helper.FieldsHelper.getCommonNumberfieldInput(propertyName, config, false, false);
        },
        // 
        getFrequency: function (mode) {
            var config = {};
            var propertyName = 'frequency';
            config[propertyName] = {
                fieldcontainer: {
                    fieldLabel: CMDBuildUI.locales.Locales.administration.schedules.frequency,
                    localized: {
                        fieldLabel: 'CMDBuildUI.locales.Locales.administration.schedules.frequency'
                    }
                },
                displayfield: {
                    bind: {
                        value: '{theSchedule._frequency_description_translation || theSchedule._frequency_description || theSchedule._frequency}'
                    }
                },
                displayField: '_description_translation',
                valueField: 'code',
                bind: {
                    store: '{calendarFrequencyStore}',
                    value: '{theSchedule.frequency}'
                }
            };
            return CMDBuildUI.util.administration.helper.FieldsHelper.getCommonComboInput(propertyName, config, false, false);
        },
        getFrequencyMultiplier: function (mode) {
            var config = {};
            var propertyName = 'frequencyMultiplier';
            config[propertyName] = {
                fieldcontainer: {
                    columnWidth: 0.5,
                    allowBlank: false,
                    fieldLabel: CMDBuildUI.locales.Locales.administration.schedules.frequencymultiplier,
                    localized: {
                        fieldLabel: 'CMDBuildUI.locales.Locales.administration.schedules.frequencymultiplier'
                    },
                    bind: {
                        hidden: Ext.String.format('{theSchedule.frequency == "{0}"}', CMDBuildUI.model.calendar.Trigger.calendarFrequencies.once)
                    }
                },
                allowBlank: false,
                minValue: 1,
                bind: {
                    value: '{theSchedule.frequencyMultiplier}'
                }
            };
            return CMDBuildUI.util.administration.helper.FieldsHelper.getCommonNumberfieldInput(propertyName, config, false, false);
        },
        // 
        getSequenceParamsEditMode: function () {
            var config = {};
            var propertyName = 'sequenceParamsEditMode';
            config[propertyName] = {
                fieldcontainer: {
                    fieldLabel: CMDBuildUI.locales.Locales.administration.schedules.scheduleruleeditmode,
                    localized: {
                        fieldLabel: 'CMDBuildUI.locales.Locales.administration.schedules.scheduleruleeditmode'
                    }
                },
                bind: {
                    store: '{sequenceParamsEditModeStore}',
                    value: '{theSchedule.sequenceParamsEditMode}'
                }
            };
            return CMDBuildUI.util.administration.helper.FieldsHelper.getCommonComboInput(propertyName, config, false, false);
        },
        getShowGeneratedEventsPreview: function () {

            var config = {};
            var propertyName = 'showGeneratedEventsPreview';
            config[propertyName] = {
                fieldcontainer: {
                    fieldLabel: CMDBuildUI.locales.Locales.administration.schedules.showschedulepreview,
                    localized: {
                        fieldLabel: 'CMDBuildUI.locales.Locales.administration.schedules.showschedulepreview'
                    }
                },
                disabledCls: '',
                bind: {
                    value: '{theSchedule.showGeneratedEventsPreview}'
                }
            };
            return CMDBuildUI.util.administration.helper.FieldsHelper.getCommonChekboxInput(config, propertyName, false);
        },
        getEndType: function () {
            var config = {};
            var propertyName = 'endType';
            config[propertyName] = {
                fieldcontainer: {
                    fieldLabel: CMDBuildUI.locales.Locales.administration.schedules.endtype,
                    localized: {
                        fieldLabel: 'CMDBuildUI.locales.Locales.administration.schedules.endtype'
                    },
                    hidden: true,
                    bind: {
                        hidden: '{theSchedule.frequency === "once"}'
                    }
                },
                displayfield: {
                    bind: {
                        value: '{theSchedule._endType_description_translation || theSchedule._endType_description || theSchedule.endType}'
                    }
                },
                displayField: '_description_translation',
                valueField: 'code',
                bind: {
                    store: Ext.String.format('{{0}Store}', propertyName),
                    value: Ext.String.format('{theSchedule.{0}}', propertyName)
                },
                listeners: {
                    change: function () {
                        try {
                            if (this.getValue() === 'date') {
                                this.up('form').down('#defaultEndDate').show();
                            } else {
                                this.up('form').down('#defaultEndDate').hide();
                            }

                        } catch (error) {

                        }
                    }
                }
            };
            return CMDBuildUI.util.administration.helper.FieldsHelper.getCommonComboInput(propertyName, config, false, false);
        },
        getEndDate: function () {
            var fields = [{
                itemId: 'defaultEndDate',
                xtype: 'datefield',
                format: CMDBuildUI.util.helper.UserPreferences.getDateFormat(),
                formatText: '',
                hidden: true,
                bind: {
                    value: '{theSchedule.lastEvent}',
                    hidden: '{action === "VIEW"}'
                },
                listeners: {
                    drop: {
                        element: 'el', //bind to the underlying el property on the panel
                        fn: function () {
                            var view = Ext.getCmp(this.id);
                            view.inputEl.focus();
                        }
                    },
                    change: function (input, newValue, oldValue) {
                        var rendered = CMDBuildUI.util.helper.FieldsHelper.renderDateField(this.getValue());
                        if (rendered && !oldValue) {
                            this.setValue(rendered);
                        }
                    }
                }
            }, {
                xtype: 'displayfield',
                format: CMDBuildUI.util.helper.UserPreferences.getDateFormat(),
                formatText: '',
                hidden: true,
                bind: {
                    value: '{theSchedule.lastEvent}',
                    hidden: '{!actions.view}'
                },
                renderer: function (value) {
                    return CMDBuildUI.util.helper.FieldsHelper.renderDateField(value);
                }
            }];
            return {
                xtype: 'fieldcontainer',
                layout: 'column',
                fieldLabel: CMDBuildUI.locales.Locales.history.enddate,
                localized: {
                    fieldLabel: 'CMDBuildUI.locales.Locales.history.enddate'
                },
                columnWidth: 1,
                bind: {
                    hidden: '{theSchedule.endType !== "date"}'
                },
                items: fields
            };
        },
        getNumberOfOccurrencies: function () {
            var config = {};
            var propertyName = 'eventCount';
            config[propertyName] = {
                fieldcontainer: {
                    columnWidth: 1,
                    fieldLabel: CMDBuildUI.locales.Locales.administration.schedules.numberofoccurrences,
                    allowBlank: false,
                    localized: {
                        fieldLabel: 'CMDBuildUI.locales.Locales.administration.schedules.numberofoccurrences'
                    },
                    bind: {
                        hidden: Ext.String.format('{theSchedule.endType !== "{0}"}', 'number')
                    },
                    listeners: {
                        hide: function (component, eOpts) {
                            var input = component.down(Ext.String.format('#{0}_input', propertyName));
                            input.setMinValue(null);
                            input.setValue(null);
                            CMDBuildUI.util.administration.helper.FieldsHelper.setAllowBlank(input, true, input.up('form'));
                        },
                        show: function (component, eOpts) {
                            var input = component.down(Ext.String.format('#{0}_input', propertyName));
                            input.setMinValue(1);
                            input.setValue(1);
                            CMDBuildUI.util.administration.helper.FieldsHelper.setAllowBlank(input, false, input.up('form'));
                        }
                    }
                },
                minValue: 1,
                allowBlank: false,
                bind: {
                    value: Ext.String.format('{theSchedule.{0}}', propertyName)
                }


            };
            return CMDBuildUI.util.administration.helper.FieldsHelper.getCommonNumberfieldInput(propertyName, config, false, false);
        },

        getDaysAdvanceNotification: function (mode) {
            var config = {};
            var propertyName = '_calculated_notification_delay';
            config[propertyName] = {
                fieldcontainer: {
                    columnWidth: 0.5,
                    fieldLabel: CMDBuildUI.locales.Locales.administration.schedules.daysadvancenotification,
                    allowBlank: false,
                    localized: {
                        fieldLabel: 'CMDBuildUI.locales.Locales.administration.schedules.daysadvancenotification'
                    },
                    hidden: true,
                    bind: {
                        hidden: '{!theSchedule.notifications___0___template}'
                    },
                    listeners: {
                        listeners: {
                            hide: function (component, eOpts) {
                                var input = component.down(Ext.String.format('#{0}_input', propertyName));
                                input.setMinValue(null);
                                input.setValue(null);
                                CMDBuildUI.util.administration.helper.FieldsHelper.setAllowBlank(input, true, input.up('form'));
                            },
                            show: function (component, eOpts) {
                                var input = component.down(Ext.String.format('#{0}_input', propertyName));
                                input.setMinValue(0);
                                input.setValue(1);
                                CMDBuildUI.util.administration.helper.FieldsHelper.setAllowBlank(input, false, input.up('form'));
                            }
                        }
                    }
                },
                minValue: 0,
                allowBlank: false,
                bind: {
                    value: Ext.String.format('{theSchedule.{0}}', propertyName)
                }


            };
            return CMDBuildUI.util.administration.helper.FieldsHelper.getCommonNumberfieldInput(propertyName, config, false, false);
        }
    }
});