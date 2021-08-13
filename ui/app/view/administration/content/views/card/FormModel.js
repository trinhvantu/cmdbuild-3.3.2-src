Ext.define('CMDBuildUI.view.administration.content.views.card.FormModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.administration-content-views-card-form',
    data: {
        name: 'CMDBuildUI',
        showForm: false,
        viewType: null,
        actions: {
            view: true,
            edit: false,
            add: false
        },
        filterDisabled: true,
        toolAction: {
            _canAdd: false,
            _canUpdate: false,
            _canDelete: false,
            _canActiveToggle: false
        }
    },
    formulas: {
        toolsManager: {
            bind: {
                canModify: '{theSession.rolePrivileges.admin_views_modify}'
            },
            get: function (data) {
                this.set('toolAction._canAdd', data.canModify === true);
                this.set('toolAction._canUpdate', data.canModify === true);
                this.set('toolAction._canDelete', data.canModify === true);
                this.set('toolAction._canActiveToggle', data.canModify === true);
            }
        },

        
        sourceClassNameManager: {
            bind: {
                theViewFilter: '{theViewFilter}',
                sourceClass: '{theViewFilter.sourceClassName}'               
            },
            get: function (data) {
                if(data.sourceClass){                
                    var description;
                        try {
                            description = Ext.getStore('classes.Classes').findRecord('name', data.sourceClass).get('description');
                        } catch (error) {                            
                            description = Ext.getStore('processes.Processes').findRecord('name', data.sourceClass).get('description');
                        }                 
                        this.set('theViewFilter._sourceClassName_description', description);
                }
                if (data.theViewFilter.get('type') !== CMDBuildUI.model.views.View.types.filter || data.sourceClass) {
                    return this.set('filterDisabled', false);
                }
                return this.set('filterDisabled', true);
            }
        },
        removeFilterDisabled: {
            bind: {
                filter: '{theViewFilter.filter}',
                action: '{action}'
            },
            get: function (data) {
                if (data.action === CMDBuildUI.util.administration.helper.FormHelper.formActions.view ||
                    !data.filter
                ) {
                    return true;
                }
                return false;
            }
        },
        isFormHidden: {
            bind: {
                theViewFilter: '{theViewFilter}',
                showForm: '{showForm}',
                canAdd: '{toolAction._canAdd}',
                isAdd: '{actions.add}'
            },
            get: function (data) {
                if((data.isAdd && !data.canAdd) || (data.theViewFilter && data.theViewFilter.phantom && data.showForm == 'false')){
                    return true;
                }
                return false;
            }
        },
        isFormButtonsBarHidden: {
            bind: {
                isView: '{actions.view}',
                isFormHidden: '{isFormHidden}'
            },
            get: function (data) {
                return data.isFormHidden || data.isView;
            }
        },
        title: {
            bind: {
                description: '{theViewFilter.description}'
            },
            get: function (data) {
                var me = this;
                me.getParent().set('title', Ext.String.format(CMDBuildUI.locales.Locales.administration.views.viewfrom, me.get('theViewFilter.type'), (data.description) ? ' - ' + data.description : ''));
            }
        },
        viewTypeManager: {
            bind: {
                theViewFilter: '{theViewFilter}',
                description: '{theViewFilter.description}'
            },
            get: function (data) {
                if (data.theViewFilter) {
                    var me = this;
                    switch (data.theViewFilter.get('type')) {
                        case CMDBuildUI.model.views.View.types.sql:
                            me.set('isSqlType', true);
                            me.set('isScheduleType', false);
                            me.set('isFilterType', false);
                            me.set('viewType', CMDBuildUI.model.views.View.types.sql);
                            return CMDBuildUI.model.views.View.types.sql;
                        case CMDBuildUI.model.views.View.types.filter:
                            me.set('isSqlType', false);
                            me.set('isScheduleType', false);
                            me.set('isFilterType', true);
                            me.set('viewType', CMDBuildUI.model.views.View.types.filter);
                            return CMDBuildUI.model.views.View.types.filter;
                        case CMDBuildUI.model.views.View.types.calendar:
                            me.set('isSqlType', false);
                            me.set('isScheduleType', true);
                            me.set('isFilterType', false);
                            me.set('viewType', CMDBuildUI.model.views.View.types.calendar);
                            return CMDBuildUI.model.views.View.types.calendar;
                        default:
                            break;
                    }
                }
            }
        },
        action: {
            bind: {
                isView: '{actions.view}',
                isEdit: '{actions.edit}',
                isAdd: '{actions.add}'
            },
            get: function (data) {
                if (data.isView) {
                    this.set('formModeCls', 'formmode-view');
                    return CMDBuildUI.util.administration.helper.FormHelper.formActions.view;
                } else if (data.isEdit) {
                    this.set('formModeCls', 'formmode-edit');
                    return CMDBuildUI.util.administration.helper.FormHelper.formActions.edit;
                } else if (data.isAdd) {
                    this.set('formModeCls', 'formmode-add');
                    return CMDBuildUI.util.administration.helper.FormHelper.formActions.add;
                }
            },
            set: function (value) {
                this.set('actions.view', value === CMDBuildUI.util.administration.helper.FormHelper.formActions.view);
                this.set('actions.edit', value === CMDBuildUI.util.administration.helper.FormHelper.formActions.edit);
                this.set('actions.add', value === CMDBuildUI.util.administration.helper.FormHelper.formActions.add);
            }
        }
    },

    stores: {

        getFunctionsStore: {
            model: 'CMDBuildUI.model.Function',
            sorters: ['description'],
            pageSize: 0, // disable pagination
            autoLoad: true
        },

        calendarDefinitionsStore: {
            model: 'CMDBuildUI.model.calendar.Trigger',
            autoLoad: true,
            autoDestroy: true,
            proxy: {
                url: CMDBuildUI.util.administration.helper.ApiHelper.server.getSchedulesTriggerUrl(),
                type: 'baseproxy',
                reader: {
                    type: 'json'
                },
                extraParams: {
                    detailed: true,
                    active: true
                }
            }
        }
    }

});