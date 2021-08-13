Ext.define('CMDBuildUI.view.administration.content.tasks.card.CardModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.view-administration-content-tasks-card',
    data: {
        theTask: null,
        currentStep: 0,
        totalStep: 0,
        isPrevDisabled: true,
        isNextDisabled: true,
        actions: {
            view: true,
            edit: false,
            add: false
        },
        isExport: false,
        isImport: false,
        isModifyCard: false,
        isCsv: false,
        isExcell: false,
        isClass: false,
        isDomain: false,
        isAdvancedCron: undefined,
        isFilterFunction: false,
        isFilterRegex: false,
        isMoveReject: false,
        isNeverNotification: true,
        isSourceFile: false,
        isSourceUrl: false,
        isBodyParsing: false,
        isNotificationActive: false,
        isAttachmentActive: false,
        isDmsEnabled: false,
        isWorkflowEnabled: false,
        isGISEnabled: false,
        isGateActive: false,
        isStartProcessActive: false,
        defaultDMSCategoryType: null,
        allClassOrDomainsAtributesData: [],
        workflowClassName: null,
        isTypeFieldHidden: false,
        attributeKeyValueList: [],
        dmsStoredata: {
            url: null,
            autoLoad: false
        },
        processDmsStoredata: {
            url: null,
            autoLoad: false
        },
        allAttributesOfProcessData: [],
        sortActive: false,
        toolAction: {
            _canClone: false,
            _canUpdate: false,
            _canDelete: false,
            _canActiveToggle: false
        },
        gisGatesTemplatesStoreAutoload: false,
        reportParametersData: [],
        precessFieldsDefinitions: [],
        dmsLookupStoreFilter: []
    },

    formulas: {
        toolsManager: {
            bind: {
                canModify: '{theSession.rolePrivileges.admin_menus_modify}'
            },
            get: function (data) {
                this.set('toolAction._canClone', data.canModify === true);
                this.set('toolAction._canUpdate', data.canModify === true);
                this.set('toolAction._canDelete', data.canModify === true);
                this.set('toolAction._canActiveToggle', data.canModify === true);
            }
        },

        setupManager: function (data) {
            var dmsEnabled = CMDBuildUI.util.helper.Configurations.get(CMDBuildUI.model.Configuration.dms.enabled);
            if (dmsEnabled) {
                this.set('isDmsEnabled', dmsEnabled);
                this.set('defaultDMSCategoryType', CMDBuildUI.util.helper.Configurations.get(CMDBuildUI.model.Configuration.dms.category));
                this.set('dmsStoredata.url', CMDBuildUI.util.administration.helper.ApiHelper.server.getAllDmsCategoriesValues());
                this.set('dmsStoredata.autoLoad', true);
            }
            this.set('isWorkflowEnabled', CMDBuildUI.util.helper.Configurations.get(CMDBuildUI.model.Configuration.processes.enabled));
            this.set('isGISEnabled', CMDBuildUI.util.helper.Configurations.get(CMDBuildUI.model.Configuration.gis.enabled));
            this.set('ifcAssociationModesData', CMDBuildUI.util.administration.helper.ModelHelper.ifcAssociationModes());
        },

        taskTypeManager: {
            bind: {
                taskType: '{taskType}'
            },
            get: function (data) {
                var me = this;
                switch (data.taskType) {

                    case CMDBuildUI.model.tasks.Task.types.emailService:
                    case CMDBuildUI.model.tasks.Task.types.importgis:
                        me.set('isTypeFieldHidden', true);
                        break;
                    case CMDBuildUI.model.tasks.Task.types.workflow:
                        me.set('isTypeFieldHidden', true);

                        break;
                    default:
                        break;
                }
                CMDBuildUI.util.Stores.loadImportExportTemplatesStore();
            }
        },
        workflowClassNameManager: {
            bind: {
                workflowClassName: '{theTask.config.action_workflow_class_name}',
                className: '{theTask.config.classname}',
                comeFromClass: '{comeFromClass}'
            },
            get: function (data) {
                if (data.comeFromClass) {
                    this.get('theTask')._config.set('classname', data.comeFromClass);
                } else {
                    this.set('workflowClassName', data.workflowClassName);
                }
            }
        },
        gateActiveManager: {
            bind: {
                actionGateActive: '{theTask.config.action_gate_active}'
            },
            get: function (data) {
                this.set('isGateActive', data.actionGateActive);
                return data.actionGateActive;
            },
            set: function (value) {
                this.set('isGateActive', value);
            }
        },
        allAttributesOfProcesManager: {
            bind: {
                workflowClassName: '{workflowClassName}',
                defaultDMSCategoryType: '{defaultDMSCategoryType}'
            },
            get: function (data) {
                if (data.workflowClassName && data.defaultDMSCategoryType) {
                    var me = this;
                    var process = CMDBuildUI.util.helper.ModelHelper.getProcessFromName(data.workflowClassName);
                    me.set('processAttachmentTypeLookup', process.get('dmsCategory'));
                    process.getAttributes().then(function (attributes) {
                        if (!me.destroyed) {
                            me.set('allAttributesOfProcessData', attributes.getRange());
                        }
                    });
                }
            }
        },
        newProcessAttributesMapStoreData: {
            get: function () {
                return CMDBuildUI.model.base.KeyDescriptionValue.create();
            }
        },
        allAttributesOfProcessDataFilterManager: {
            bind: {
                processAttributesMapStore: '{processAttributesMapStore.data}'
            },
            get: function (data) {
                this.set('allAttributesOfProcessDataFilter', this._allAttributeFilter());
            }
        },

        attributeKeyValueListManager: {
            bind: {
                fieldsMappingsEmailService: '{theTask.config.action_workflow_fields_mapping}',
                fieldsMappingsWorkflow: '{theTask.config.attributes}',
                workflowClassName: '{workflowClassName}'
            },
            get: function (data) {
                if (data.workflowClassName) {
                    var map = typeof data.fieldsMappingsEmailService !== 'undefined' ? data.fieldsMappingsEmailService : data.fieldsMappingsWorkflow;
                    this.setProcessAttributesMapStore(data.workflowClassName, map);
                }
            }
        },
        processAttachmentTypeLookupManager: {
            bind: {
                processAttachmentTypeLookup: '{processAttachmentTypeLookup}',
                workflowClassName: '{workflowClassName}',
                defaultDMSCategoryType: '{defaultDMSCategoryType}'
            },
            get: function (data) {
                if (data.processAttachmentTypeLookup) {
                    this.set('processDmsStoredata.url', CMDBuildUI.util.api.DMS.getCategoryValues(data.processAttachmentTypeLookup));
                    this.set('processDmsStoredata.autoLoad', true);
                } else {
                    this.set('processDmsStoredata.url', this.get('dmsStoredata.url'));
                    this.set('processDmsStoredata.autoLoad', true);
                }
            }
        },


        notificationManager: {
            bind: '{theTask.config.notificationMode}',
            get: function (notificationMode) {
                switch (notificationMode) {
                    case '':
                    case 'never':
                        this.set('isNeverNotification', true);
                        break;
                    default:
                        this.set('isNeverNotification', false);
                        break;
                }
            }
        },

        isMoveRejectManger: {
            bind: {
                moveReject: '{theTask.config.filter_reject}'
            },
            get: function (data) {
                switch (data.moveReject) {
                    case true:
                    case "true":
                        this.set('isMoveReject', true);
                        break;

                    default:
                        this.set('isMoveReject', false);
                        break;
                }

            }
        },

        filterTypeManager: {
            bind: {
                filterType: '{theTask.config.filter_type}'
            },
            get: function (data) {
                // used in emailService
                if (data.filterType) {
                    switch (data.filterType) {
                        case 'function':
                            var functionsStore = this.getStore('allFunctionsStore');
                            if (!functionsStore.source.isLoaded()) {
                                functionsStore.source.load();
                            }
                            this.set('isFilterFunction', true);
                            this.set('isFilterRegex', false);
                            break;
                        case 'regex':
                            this.set('isFilterFunction', false);
                            this.set('isFilterRegex', true);
                            break;
                        case 'isreply':
                        case 'isnotreply':
                            this.set('isFilterFunction', false);
                            this.set('isFilterRegex', false);
                            break;
                        default:
                            this.set('isFilterFunction', false);
                            this.set('isFilterRegex', false);
                            break;
                    }
                }
            }
        },
        postImportActions: function () {
            return CMDBuildUI.model.tasks.TaskImportExport.getPostImportActions();
        },
        cronSettings: function () {
            return CMDBuildUI.model.tasks.Task.getCronSettings();
        },
        filterTypes: function () {
            return CMDBuildUI.model.tasks.TaskReadEmail.getFilterTypes();
        },
        importExportSources: function () {
            return CMDBuildUI.util.administration.helper.ModelHelper.getImportExportSources();
        },
        notificationModes: function () {
            return CMDBuildUI.util.administration.helper.ModelHelper.getTaskNotificationMode();
        },
        cronManager: {
            bind: {
                cronExpression: '{theTask.config.cronExpression}',
                cronSettings: '{cronSettings}'
            },
            get: function (data) {
                if (data.cronExpression === 'advanced' || data.cronExpression === '') {
                    data.cronExpression = '* * * * ?';
                    this.set('isAdvancedCron', true);
                } else {
                    var setting = Ext.Array.findBy(data.cronSettings, function (_setting) {
                        return _setting.value === data.cronExpression;
                    });
                    this.set('isAdvancedCron', setting ? false : !data.cronExpression ? false : true);
                }

                if (data.cronExpression) {
                    this.set('advancedCronMinuteValue', data.cronExpression.split(' ')[0]);
                    this.set('advancedCronHourValue', data.cronExpression.split(' ')[1]);
                    this.set('advancedCronDayValue', data.cronExpression.split(' ')[2]);
                    this.set('advancedCronMonthValue', data.cronExpression.split(' ')[3]);
                    this.set('advancedCronDayofweekValue', data.cronExpression.split(' ')[4]);
                }
            }
        },

        stepManager: {
            bind: {
                currentStep: '{currentStep}',
                totalStep: '{totalStep}'
            },
            get: function (data) {
                this.set('isPrevDisabled', data.currentStep === 0);
                this.set('isNextDisabled', data.currentStep >= this.get('totalStep') - 1);
            }
        },

        importExportSourceManager: {
            bind: {
                action: '{theTask.config.postImportAction}',
                source: '{theTask.config.source}'
            },
            get: function (data) {
                switch (data.source) {
                    case 'file':
                        this.set('isSourceFile', true);
                        this.set('isSourceUrl', false);
                        this.set('isMoveFiles', data.action === 'move_files');
                        break;
                    case 'url':
                        this.set('isSourceFile', false);
                        this.set('isSourceUrl', true);
                        this.set('isMoveFiles', false);
                        break;
                    default:
                        this.set('isSourceFile', false);
                        this.set('isSourceUrl', false);
                        this.set('isMoveFiles', false);
                        break;
                }
            }
        },

        gisTemplateSourceManager: {
            bind: {
                action: '{theTask.config.gateconfig_handlers_0_postImportAction}'
            },
            get: function (data) {
                if (data.action) {
                    this.set('isSourceFile', true);
                    this.set('isSourceUrl', false);
                    this.set('isMoveFiles', data.action === 'move_files');
                }
            }
        },


        typeManager: {
            bind: {
                type: '{theTask.type}',
                notificationModesStore: '{notificationModesStore}'
            },
            get: function (data) {
                if (this.get('notificationModesStore').isFiltered()) {
                    this.get('notificationModesStore').clearFilter();
                }
                if (this.get('allImportExportTemplate') && this.get('allImportExportTemplate').isFiltered()) {
                    this.get('allImportExportTemplate').clearFilter();
                }                
                switch (data.type) {
                    case CMDBuildUI.model.tasks.Task.types.import_file:
                        this.get('notificationModesStore').filterBy(function (item) {
                            return Ext.Array.contains(item.get('group'), 'import');
                        });
                        this.set('allImportExportTemplateFilter', [function (item) {
                            return item.get('type') === 'import' || item.get('type') === CMDBuildUI.model.tasks.Task.types.import_export;
                        }]);
                        this.set('isImport', true);
                        this.set('isExport', false);
                        break;
                    case CMDBuildUI.model.tasks.Task.types.export_file:
                        this.get('notificationModesStore').filterBy(function (item) {
                            return Ext.Array.contains(item.get('group'), 'export');
                        });
                        this.set('isImport', false);
                        this.set('isExport', true);
                        this.set('allImportExportTemplateFilter', [function (item) {
                            return item.get('type') === 'export' || item.get('type') === CMDBuildUI.model.tasks.Task.types.import_export;
                        }]);

                        break;

                    case CMDBuildUI.model.tasks.Task.types.importgis: // etl
                        if (this.get('subType') === 'database') {
                            this.get('notificationModesStore').filterBy(function (item) {                                
                                return Ext.Array.contains(item.get('group'), 'import');                                
                            });
                            this.set('isImport', true);
                            this.set('isExport', false);                        
                        }
                        break;
                    default:
                        this.get('notificationModesStore').filterBy(function (item) {
                            return Ext.Array.contains(item.get('group'), data.type);
                        });

                        this.set('isImport', false);
                        this.set('isExport', false);
                        break;
                }
            }
        },
        taskTypes: function (get) {
            var me = this;
            var type = me.get('theTask.type');
            var types = CMDBuildUI.model.tasks.Task.getTypes();
            if (type) {
                types = Ext.Array.filter(types, function (item) {
                    if (type === CMDBuildUI.model.tasks.Task.types.import_file || type === CMDBuildUI.model.tasks.Task.types.export_file) {
                        type = CMDBuildUI.model.tasks.Task.types.import_export;
                    }
                    if (!me.get('subType')) {
                        return item.value === type || item.group === type;
                    }
                    return item.value === type && item.subType === me.get('subType');
                });
            }
            return types;

        },
        isClone: {
            bind: '{theTask}',
            get: function (theTask) {
                return (theTask && theTask.phantom) || false;
            }
        },

        sourceTypes: function (get) {
            return CMDBuildUI.util.administration.helper.ModelHelper.getSourceTypes();
        },
        jdbcClasses: function (get) {
            return CMDBuildUI.util.administration.helper.ModelHelper.getJdbcDrivers();
        },
        panelTitle: {
            bind: {
                description: '{theTask.description}',
                type: '{theTask.type}',
                taskTypes: '{taskTypes}',
                currentStep: '{currentStep}',
                totalStep: '{totalStep}'
            },
            get: function (data) {
                var me = this;
                if (data) {
                    var types = this.get('taskTypes');
                    var type = Ext.Array.findBy(types, function (item) {
                        return item.value === data.type && item.subType === me.get('subType');
                    });
                    var typeLabel = type && type.label;
                    var title = Ext.String.format(
                        '{0} {1} {2} {3} - {4} {5} {6} {7} {8}',
                        CMDBuildUI.locales.Locales.administration.tasks.step,
                        data.currentStep + 1,
                        CMDBuildUI.locales.Locales.administration.tasks.of,
                        data.totalStep,
                        isNaN(this.get('theTask._id')) ? CMDBuildUI.locales.Locales.administration.dashboards['new'] : '',
                        data.description && typeLabel ? typeLabel : '',
                        CMDBuildUI.locales.Locales.administration.tasks.sincurrentStepgular,
                        data.description ? '-' : '',
                        data.description
                    );
                    this.getParent().set('title', title);
                } else {
                    this.getParent().set('title', CMDBuildUI.locales.Locales.administration.tasks.sincurrentStepgular);
                }
            }
        },

        allClassesOrDomainsData: {
            bind: '{theTask.targetType}',
            get: function (targetType) {
                switch (targetType) {
                    case CMDBuildUI.model.administration.MenuItem.types.klass:
                        return Ext.getStore('classes.Classes').getData().items.filter(function (item) {
                            return !item.get('prototype') && item.get('type') === 'standard';
                        });
                    case CMDBuildUI.model.administration.MenuItem.types.domain:
                        return Ext.getStore('domains.Domains').getData().items;
                    default:
                        return [];
                }
            }
        },
        actionAttachmentsModes: function (get) {
            return CMDBuildUI.model.tasks.ReadEmailConfig.getActionAttachemntsMode();
        },
        types: function () {
            return [{
                label: CMDBuildUI.locales.Locales.administration.localizations['class'],
                value: CMDBuildUI.model.administration.MenuItem.types.klass
            }, {
                label: CMDBuildUI.locales.Locales.administration.localizations.domain,
                value: CMDBuildUI.model.administration.MenuItem.types.domain
            }];
        },

        reportFormats: function () {
            return CMDBuildUI.util.administration.helper.ModelHelper.getReportFormats();
        },

        reportAttributesManager: {
            bind: '{reportAttributesStore}',
            get: function (reportAttributesStore) {
                var currentParams = this.get('theTask.config.attach_report_params');
                var _reportParametersData = [];
                reportAttributesStore.each(function (attribute) {
                    var storeItem = {
                        key: attribute.get('name'),
                        description: attribute.get('description'),
                        value: (currentParams && currentParams[attribute.get('name')]) ? currentParams[attribute.get('name')] : null
                    };
                    _reportParametersData.push(storeItem);
                });
                this.set('reportParametersData', _reportParametersData);
            }
        },

        emailContextVariableData: {
            bind: {
                emailContextVariables: '{theTask.config.email_template_context}'
            },
            get: function (data) {
                var variables = [];
                Ext.Object.each(data.emailContextVariables, function (key, value) {
                    var variable = {
                        key: key,
                        value: value
                    };
                    variables.push(variable);
                });
                return variables;
            }
        },

        ifcSourceTypesData: {
            get: function () {
                var data = [{
                    value: 'filereader',
                    label: CMDBuildUI.locales.Locales.attachments.file
                }];
                if(CMDBuildUI.util.helper.Configurations.get(CMDBuildUI.model.Configuration.bim.enabled)){
                    data.push({
                        value: 'urlreader',
                        label: CMDBuildUI.locales.Locales.importexport.ifc.project
                    });
                }
                return data;
            }
        },
        attachmentModeManager: {
            bind: {
                config: '{theTask.config}'
            },
            get: function (data) {
                if (data.config) {                        
                    return data.config.get && data.config.get('action_attachments_mode');
                }
            },
            set: function (value) {
                var filter;
                this.getStore('dmsLookupStore').getFilters().removeAll();
                if (value === CMDBuildUI.model.tasks.ReadEmailConfig.actionAttachemntsMode.attach_to_email) {
                    filter = [function (item) {
                        return item.get('_type') === CMDBuildUI.util.helper.Configurations.get(CMDBuildUI.model.Configuration.dms.category);
                    }];
                } else {
                    filter = [function (item) {
                        return true;
                    }];
                }
                this.set('dmsLookupStoreFilter', filter);
            }
        },

        ifcGateStoreFilter: {
            get: function () {
                return [function (item) {
                    return item.get('active') && item.get('config').tag === 'ifc';
                }];
            }
        }
    },

    stores: {
        actionAttachmentsModeStore: {
            model: 'CMDBuildUI.model.base.ComboItem',
            proxy: {
                type: 'memory'
            },
            sorters: ['label'],
            data: '{actionAttachmentsModes}',
            autoDestroy: true
        },
        jdbcDriverClassNameStore: {
            model: 'CMDBuildUI.model.base.ComboItem',
            proxy: {
                type: 'memory'
            },
            sorters: ['label'],
            data: '{jdbcClasses}',
            autoDestroy: true
        },
        sourceTypeStore: {
            model: 'CMDBuildUI.model.base.ComboItem',
            proxy: {
                type: 'memory'
            },
            sorters: ['label'],
            data: '{sourceTypes}',
            autoDestroy: true
        },
        notificationModesStore: {
            fields: ['label', 'value', 'group'],
            proxy: {
                type: 'memory'
            },
            sorters: ['label'],
            data: '{notificationModes}',
            autoDestroy: true
        },
        importExportSourcesStore: {
            fields: ['label', 'value', 'group'],
            proxy: {
                type: 'memory'
            },
            sorters: ['label'],
            data: '{importExportSources}',
            autoDestroy: true
        },
        allClassesOrDomains: {
            fields: ['_name', 'description'],
            proxy: {
                type: 'memory'
            },
            data: '{allClassesOrDomainsData}',
            autoDestroy: true
        },

        targetTypes: {
            model: 'CMDBuildUI.model.base.ComboItem',
            proxy: {
                type: 'memory'
            },
            autoLoad: true,
            data: '{types}',
            autoDestroy: true
        },

        allSelectedAttributes: {
            proxy: {
                type: 'memory'
            },
            model: 'CMDBuildUI.model.importexports.Attribute',
            data: '{allSelectedAttributesComboData}',
            autoDestroy: true
        },

        allEmailAccounts: {
            type: 'chained',
            source: 'emails.Accounts',
            autoLoad: true,
            autoDestroy: true
        },

        allEmailTemplates: {
            type: 'chained',
            source: 'emails.Templates',
            autoLoad: true,
            autoDestroy: true
        },

        notificationEmailTemplates: {
            type: 'chained',
            source: 'emails.Templates',
            autoLoad: true,
            autoDestroy: true
        },

        allImportExportTemplate: {
            source: 'importexports.Templates',
            filters: '{allImportExportTemplateFilter}',
            autoLoad: true,
            listeners: {
                datachanged: 'onETLStoreDataChanged'
            }
        },
        selectedImportDatabaseTemplates: {
            model: 'CMDBuildUI.model.importexports.Template',
            proxy: {
                type: 'memory'
            },
            autoDestroy: true
        },
        allFunctionsStore: {
            type: 'chained',
            source: 'Functions',
            autoLoad: true,
            autoDestroy: true
        },

        dmsLookupStore: {
            model: "CMDBuildUI.model.lookups.Lookup",
            proxy: {
                url: '{dmsStoredata.url}',
                type: 'baseproxy'
            },
            extraParams: {
                active: false
            },
            filters: '{dmsLookupStoreFilter}',
            pageSize: 0, // disable pagination
            fields: ['_id', '_type', 'description'],
            autoLoad: '{dmsStoredata.autoLoad}',
            sorters: [
                '_type', 'description'
            ],
            grouper: {
                property: '_type'
            }
        },

        processDmsLookupStore: {
            model: "CMDBuildUI.model.lookups.Lookup",
            proxy: {
                url: '{processDmsStoredata.url}',
                type: 'baseproxy'
            },
            extraParams: {
                active: false
            },
            pageSize: 0, // disable pagination
            fields: ['_id', 'description'],
            autoLoad: '{processDmsStoredata.autoLoad}',
            sorters: [
                'description'
            ]
        },
        processesStore: {
            source: 'processes.Processes'
        },

        processAttributesMapStore: {
            // model: 'CMDBuildUI.model.base.KeyDescriptionValue',
            fields: ['key', 'value', 'description', 'definition'],
            sorters: ['description']
        },

        newProcessAttributesMapStore: {
            // model: 'CMDBuildUI.model.base.KeyDescriptionValue',
            fields: ['key', 'value', 'description', 'definition'],
            data: '{newProcessAttributesMapStoreData}'
        },

        allAttributesOfProcessStore: {
            proxy: {
                type: 'memory'
            },
            data: '{allAttributesOfProcessData}',
            sorters: ['description']
        },

        allAttributesOfProcessStoreFiltered: {
            source: '{allAttributesOfProcessStore}',
            proxy: {
                type: 'memory'
            },
            filters: '{allAttributesOfProcessDataFilter}',
            sorters: ['description']
        },
        taskTypesStore: {
            model: 'CMDBuildUI.model.base.ComboItem',
            proxy: 'memory',
            data: '{taskTypes}'
        },
        cronSettingsStore: {
            model: 'CMDBuildUI.model.base.ComboItem',
            proxy: {
                type: 'memory'
            },
            data: '{cronSettings}'
        },
        postImportActionsStore: {
            model: 'CMDBuildUI.model.base.ComboItem',
            proxy: {
                type: 'memory'
            },
            data: '{postImportActions}'
        },
        filterTypesStore: {
            model: 'CMDBuildUI.model.base.ComboItem',
            proxy: {
                type: 'memory'
            },
            data: '{filterTypes}'
        },

        gisGatesTemplatesStore: {
            source: 'importexports.Gates',
            filters: [function (item) {
                return item.get('active') && item.get('config').tag === 'cad';
            }],
            autoLoad: true,
            autoDestroy: true
        },
        databaseGatesStore: {
            source: 'importexports.Gates',
            filters: [function (item) {
                return item.get('active') && item.get('config').tag === 'database';
            }],
            autoLoad: true,
            autoDestroy: true
        },
        ifcGatesStore: {
            source: 'importexports.Gates',
            filters: '{ifcGateStoreFilter}',
            autoLoad: true,
            autoDestroy: true
        },
        allReportsStore: {
            source: 'reports.Reports',
            filters: [function (item) {
                return item.get('active');
            }],
            autoLoad: true,
            autoDestroy: true
        },
        reportFormatsStore: {
            model: 'CMDBuildUI.model.base.ComboItem',
            proxy: {
                type: 'memory'
            },
            data: '{reportFormats}'
        },
        reportParametersStore: {
            model: 'CMDBuildUI.model.base.KeyDescriptionValue',
            proxy: {
                type: 'memory'
            },
            data: '{reportParametersData}'
        },
        emailContextVariableStore: {
            model: 'CMDBuildUI.model.base.KeyValue',
            proxy: {
                type: 'memory'
            },
            data: '{emailContextVariableData}'
        },
        newEmailContextVariableStore: {
            model: 'CMDBuildUI.model.base.KeyValue',
            proxy: {
                type: 'memory'
            },
            data: [CMDBuildUI.model.base.KeyValue.create()]
        },
        ifcSourceTypes: {
            fields: ['value', 'label'],
            data: "{ifcSourceTypesData}"
        },
        bimProjects: {
            proxy: {
                type: 'baseproxy',
                url: '/bim/projects'
            },
            autoLoad: '{theTask.config.gateconfig_handlers_0_type === "urlreader"}',
            autoDestroy: true
        },
        associationModeTypes: {
            model: 'CMDBuildUI.model.base.ComboItem',
            proxy: {
                type: 'memory'
            },
            data: '{ifcAssociationModesData}'
        }
    },

    resetAllAttributesStores: function (classOrDomain) {
        var me = this;
        if (me.get('allClassOrDomainsAtributes')) {
            me.get('allClassOrDomainsAtributes').removeAll();
        }
        if (me.get('allClassOrDomainsAtributes')) {
            me.get('allClassOrDomainsAtributesFiltered').removeAll();
        }
        if (me.get('theTask.columns') && me.get('theTask.columns').isStore && me.get('actions.add')) {
            me.get('theTask.columns').removeAll();
            if (classOrDomain && classOrDomain.entityName === 'CMDBuildUI.model.domains.Domain') {
                Ext.Array.forEach(CMDBuildUI.model.importexports.Attribute.getRange(), function (item) {
                    switch (item.attribute) {
                        case 'IdObj1':
                            item.columnName = classOrDomain.get('source');
                            break;
                        case 'IdObj2':
                            item.columnName = classOrDomain.get('destination');
                            break;
                        default:
                            break;
                    }
                    me.get('theTask.columns').add(item);
                });
            }
        }
    },

    setAllAttributesStores: function (attributeStore) {
        var me = this;
        var store = Ext.create('Ext.data.Store', {
            data: attributeStore.getRange()
        });

        var filteredStore = Ext.create('Ext.data.Store', {
            data: attributeStore.getRange(),
            filters: [function (item) {
                return !me.getStore('allSelectedAttributes').findRecord('attribute', item.get('name'));
            }]
        });

        store.sort('description', 'ASC');
        filteredStore.sort('description', 'ASC');
        me.set('allClassOrDomainsAtributes', store);
        me.set('allClassOrDomainsAtributesFiltered', filteredStore);
    },

    _allAttributeFilter: function () {
        var me = this;
        return [function (item) {
            return item.canAdminShow() && !me.getStore('processAttributesMapStore').findRecord('key', item.get('name'));
        }];
    },

    serializeAttributesMapStore: function () {
        var attributesMapData = this.get('processAttributesMapStore').getRange();
        var attributes = [];
        Ext.Array.forEach(attributesMapData, function (item) {
            attributes.push(Ext.String.format('{0}={1}', item.get('key'), item.get('value')));
        });
        return attributes.join('&#124;');
    },

    setProcessAttributesMapStore: function (workflowClassName, fieldsMappings) {
        var me = this;

        var map = fieldsMappings.split('&#124;');
        var processAttributesMapStore = this.getStore('processAttributesMapStore');
        processAttributesMapStore.removeAll();
        me.getFieldsAndLoadLookupValues(workflowClassName).then(function (fields) {
            if (!me.destroyed) {
                fields.forEach(function (field) {
                    field.hidden = false;
                    Ext.asap(function (_field, _map, _processAttributesMapStore) {
                        if (!me.destroyed) {
                            if (!Ext.String.startsWith(_field.name, "_")) {
                                Ext.Array.forEach(_map, function (item) {
                                    var keyValue = item.split('=');
                                    if (_field.name === keyValue[0]) {
                                        try {
                                            _processAttributesMapStore.add({
                                                key: keyValue[0],
                                                description: _field.description,
                                                definition: _field,
                                                value: keyValue[1]
                                            });
                                        } catch (e) {
                                            CMDBuildUI.util.Logger.log(Ext.String.format("Process attribute {0} not found", keyValue[0]), CMDBuildUI.util.Logger.levels.warn);
                                        }

                                    }
                                });
                            }
                        }
                    }, me, [field, map, processAttributesMapStore]);
                });
                me.set('precessFieldsDefinitions', fields);
            }
        });
    },

    getFieldsAndLoadLookupValues: function (process) {
        var me = this;
        var deferred = new Ext.Deferred();
        var counter = 0;
        CMDBuildUI.util.helper.ModelHelper.getModel('process', process).then(function (model) {

            model.getFields().forEach(function (field) {
                field.hidden = false;
                if (field.cmdbuildtype === 'lookup') {
                    counter++;
                    me.loadLookupValues(field.attributeconf.lookupType).then(function () {
                        counter--;
                    }, function () {
                        counter--;
                    });
                }
            });
            var sendResponseIfDone = setInterval(function () {
                if (counter === 0) {
                    deferred.resolve(model.getFields());
                    clearInterval(sendResponseIfDone);
                }
            }, 10);
        });
        return deferred.promise;
    },

    loadLookupValues: function (type) {
        var me = this;
        var deferred = new Ext.Deferred();
        var lt = CMDBuildUI.model.lookups.LookupType.getLookupTypeFromName(type);
        if (lt) {
            var values = lt.values();
            values.getProxy().setUrl(CMDBuildUI.util.api.Lookups.getLookupValues(type));
            values.on('load', function () {
                if (!Ext.isEmpty(lt.get("parent"))) {
                    // load values for parent
                    me.loadLookupValues(lt.get("parent")).then(function () {
                        deferred.resolve();
                    });
                } else {
                    deferred.resolve();
                }
            });
            values.load();

        }
        return deferred.promise;
    }
});