Ext.define('CMDBuildUI.view.administration.content.tasks.card.CardController', {
    extend: 'Ext.app.ViewController',
    mixins: ['CMDBuildUI.view.administration.content.tasks.card.CardMixin',
        'CMDBuildUI.view.administration.content.classes.tabitems.properties.fieldsets.SorterGridsMixin'
    ],
    alias: 'controller.view-administration-content-tasks-card',

    control: {
        '#': {            
            afterrender: 'onAfterRender'
        },

        '#saveBtn': {
            click: 'onSaveBtnClick'
        },
        '#cancelBtn': {
            click: 'onCancelBtnClick'
        },
        '#prevBtn': {
            click: 'onPrevBtnClick'
        },
        '#nextBtn': {
            click: 'onNextBtnClick'
        },
        '#editBtn': {
            click: 'onEditBtnClick'
        },
        '#cloneBtn': {
            click: 'onCloneBtnClick'
        },
        '#deleteBtn': {
            click: 'onDeleteBtnClick'
        }

    },


    onAfterRender: function (view) {
        var me = this;
        var vm = this.getViewModel();

    },

    /**
     * @param {Ext.button.Button} button
     * @param {Event} e
     * @param {Object} eOpts
     */
    onSaveBtnClick: function (button, e, eOpts) {
        button.setDisabled(true);
        var me = this;
        var form = me.getView();
        var vm = me.getViewModel();
        var theTask = vm.get('theTask');
        if (form && me.validateForm(form)) {
            CMDBuildUI.util.Utilities.showLoader(true);
            var configData = theTask._config.getData();

            if (vm.get('isAdvancedCron')) {
                var cronExpression = Ext.String.format('{0} {1} {2} {3} {4}',
                    vm.get('advancedCronMinuteValue'),
                    vm.get('advancedCronHourValue'),
                    vm.get('advancedCronDayValue'),
                    vm.get('advancedCronMonthValue'),
                    vm.get('advancedCronDayofweekValue')
                );
                // var regex = /^\s*($|#|\w+\s*=|(\?|\*|(?:[0-5]?\d)(?:(?:-|\/|\,)(?:[0-5]?\d))?(?:,(?:[0-5]?\d)(?:(?:-|\/|\,)(?:[0-5]?\d))?)*)\s+(\?|\*|(?:[0-5]?\d)(?:(?:-|\/|\,)(?:[0-5]?\d))?(?:,(?:[0-5]?\d)(?:(?:-|\/|\,)(?:[0-5]?\d))?)*)\s+(\?|\*|(?:[01]?\d|2[0-3])(?:(?:-|\/|\,)(?:[01]?\d|2[0-3]))?(?:,(?:[01]?\d|2[0-3])(?:(?:-|\/|\,)(?:[01]?\d|2[0-3]))?)*)\s+(\?|\*|(?:0?[1-9]|[12]\d|3[01])(?:(?:-|\/|\,)(?:0?[1-9]|[12]\d|3[01]))?(?:,(?:0?[1-9]|[12]\d|3[01])(?:(?:-|\/|\,)(?:0?[1-9]|[12]\d|3[01]))?)*)\s+(\?|\*|(?:[1-9]|1[012])(?:(?:-|\/|\,)(?:[1-9]|1[012]))?(?:L|W)?(?:,(?:[1-9]|1[012])(?:(?:-|\/|\,)(?:[1-9]|1[012]))?(?:L|W)?)*|\?|\*|(?:JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)(?:(?:-)(?:JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC))?(?:,(?:JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)(?:(?:-)(?:JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC))?)*)\s+(\?|\*|(?:[0-6])(?:(?:-|\/|\,|#)(?:[0-6]))?(?:L)?(?:,(?:[0-6])(?:(?:-|\/|\,|#)(?:[0-6]))?(?:L)?)*|\?|\*|(?:MON|TUE|WED|THU|FRI|SAT|SUN)(?:(?:-)(?:MON|TUE|WED|THU|FRI|SAT|SUN))?(?:,(?:MON|TUE|WED|THU|FRI|SAT|SUN)(?:(?:-)(?:MON|TUE|WED|THU|FRI|SAT|SUN))?)*)(|\s)+(\?|\*|(?:|\d{4})(?:(?:-|\/|\,)(?:|\d{4}))?(?:,(?:|\d{4})(?:(?:-|\/|\,)(?:|\d{4}))?)*))$/;
                // var isValid = regex.test('* ' + cronExpression);
                configData.cronExpression = cronExpression;
            }
            switch (theTask.get('type')) {
                case CMDBuildUI.model.tasks.Task.types.workflow:
                    configData.classname = vm.get('workflowClassName');
                    configData.attributes = vm.serializeAttributesMapStore();
                    break;
                case CMDBuildUI.model.tasks.Task.types.emailService:
                    configData.action_workflow_class_name = vm.get('workflowClassName');
                    configData.action_workflow_fields_mapping = vm.serializeAttributesMapStore();
                    break;
                case CMDBuildUI.model.tasks.Task.types.sendemail:
                    var emailContextStore = form.down('#emailContextVariableGrid').getStore();
                    var reportParametersStore = form.down('#reportParametersGrid').getStore();
                    Ext.Array.forEach(emailContextStore.getRange(), function (item) {
                        configData.email_template_context[item.get('key')] = item.get('value');
                    });

                    Ext.Array.forEach(reportParametersStore.getRange(), function (item) {
                        configData.attach_report_params[item.get('key')] = item.get('value');
                    });

                    break;
                default:
                    break;
            }

            delete configData._id;
            theTask.set('config', configData);
            theTask._config.set('cronExpression', configData.cronExpression);
            theTask.save({
                success: function (record, operation) {
                    vm.get('grid').getPlugin('administration-forminrowwidget').view.fireEventArgs('itemupdated', [vm.get('grid'), record, me]);
                    if (!button.destroyed) {
                        button.setDisabled(false);
                    }
                    CMDBuildUI.util.Utilities.showLoader(false);
                    form.up().fireEvent("closed");
                },
                failure: function () {
                    if (!button.destroyed) {
                        button.setDisabled(false);
                    }
                    CMDBuildUI.util.Utilities.showLoader(false);
                }
            });
        }
    },

    /**
     * @param {Ext.button.Button} button
     * @param {Event} e
     * @param {Object} eOpts
     */
    onCancelBtnClick: function (button, e, eOpts) {
        var vm = this.getViewModel();
        vm.get("theTask").reject(); // discard changes
        this.getView().up().fireEvent("closed");
    },

    onETLStoreDataChanged: function (data) {
        var vm = this.getViewModel();
        Ext.Array.forEach([false, true], function (value) {
            vm.set('allImportExportTemplate.isReady', value);
            data.isReady = value;
        });
    },
    privates: {

        validateForm: function (form) {

            var me = this,
                invalid = [];
            var taskType = form.getViewModel().get('taskType');
            switch (taskType) {
                case CMDBuildUI.model.tasks.Task.types.import_export:
                    invalid = me.importexport.validateForm(form);
                    break;
                case CMDBuildUI.model.tasks.Task.types.emailService:
                    invalid = me.emailservice.validateForm(form);
                    break;
                case CMDBuildUI.model.tasks.Task.types.workflow:
                    invalid = me.startworkflow.validateForm(form);
                    break;
                case CMDBuildUI.model.tasks.Task.types.import_database:
                    invalid = me.connector.validateForm(form);
                    break;
                case CMDBuildUI.model.tasks.Task.types.importgis:
                    invalid = me.gistemplate.validateForm(form);
                    break;
                case CMDBuildUI.model.tasks.Task.types.sendemail:
                    invalid = me.sendemail.validateForm(form);
                    break;
                default:
                    break;
            }
            return !invalid.length;

        }
    }
});