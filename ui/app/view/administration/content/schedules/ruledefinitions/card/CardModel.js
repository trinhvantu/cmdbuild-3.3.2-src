Ext.define('CMDBuildUI.view.administration.content.schedules.ruledefinitions.card.CardModel', {
    // extend: 'Ext.app.ViewModel',
    extend: 'CMDBuildUI.view.administration.content.schedules.ruledefinitions.ViewModel',
    alias: 'viewmodel.view-administration-content-schedules-ruledefinitions-card',
    data: {
        theSchedule: null,
        actions: {
            view: true,
            edit: false,
            add: false
        },
        attributeProxy: {
            url: null,
            autoload: false
        },
        classAttributes: [],
        delay: null,
        delayPeriod: null
    },

    formulas: {
        participantsManager: {
            bind: {
                participants: '{theSchedule.participants}'
            },
            get: function (data) {
                var me = this;
                if (data.participants && data.participants.length) {
                    Ext.Array.forEach(data.participants, function (partecipant) {
                        var partecipantArr = partecipant.split('.');
                        if (partecipantArr) {
                            var obj = Ext.String.format('{0}Id', partecipantArr[0]);
                            me.get('theSchedule').set(obj, partecipantArr[1]);
                        }
                    });
                }
            }
        },
        userAndGroupManager: {
            bind: {
                userId: '{theSchedule.userId}',
                groupId: '{theSchedule.groupId}'
            },
            get: function (data) {
                var participants = this.get('theSchedule.participants');
                Ext.Array.remove(participants,
                    Ext.Array.findBy(participants, function (item) {
                        return item.split('.')[0] === 'user';
                    })
                );
                if (data.userId) {
                    participants.push(Ext.String.format('user.{0}', data.userId));
                }
                Ext.Array.remove(participants,
                    Ext.Array.findBy(participants, function (item) {
                        return item.split('.')[0] === 'group';
                    })
                );
                if (data.groupId) {
                    participants.push(Ext.String.format('group.{0}', data.groupId));
                }
                this.set('theSchedule.participants', participants);
            }
        },

        jobManager: {
            bind: {
                job: '{theSchedule.job}'
            },
            get: function (data) {
                var me = this;
                if (data.job) {
                    var store = Ext.create('Ext.data.ChainedStore', {
                        source: 'tasks',
                        autoDestroy: true
                    });

                    me.loadObjectDescription(data.job, store, 'job', 'description');
                }
            }
        },
        frequencyManager: {
            bind: {
                frequency: '{theSchedule.frequency}'
            },
            get: function (data) {
                if (data.frequency && data.frequency === CMDBuildUI.model.calendar.Trigger.calendarFrequencies.once) {
                    this.set('theSchedule.endType', CMDBuildUI.model.calendar.Trigger.calendarEndTypes.never);
                }
            }
        },

        delayManager: {
            bind: {
                theSchedule: '{theSchedule}',
                theScheduleDelay: '{theSchedule.delay}'
            },
            get: function (data) {
                if (data.theSchedule && data.theScheduleDelay) {

                    var interval = data.theSchedule.parseIsoInterval();
                    for (var period in interval) {
                        if (interval[period] > 0) {
                            this.set('delayPeriod', period);
                            this.set('delay', interval[period]);
                        }
                    }

                    if (!this.get('delayPeriod')) {
                        // set default value
                        this.set('delayPeriod', CMDBuildUI.model.calendar.Trigger.delays.D);
                        this.set('delay', 0);
                    }
                }
            },
            set: function (value) {
                var delay = (value < 0) ? '-P' + Math.abs(value) : value;

                this.set('theSchedule.delay', delay);
            }
        },
        delayIso: {
            bind: {
                delayPeriod: '{delayPeriod}',
                delay: '{delay}'
            },
            get: function (data) {
                if (!Ext.isEmpty(data.delayPeriod) && !Ext.isEmpty(data.delay)) {
                    var delayIso = Ext.String.format('P{0}{1}', data.delay, data.delayPeriod);
                    CMDBuildUI.util.Logger.log(delayIso, CMDBuildUI.util.Logger.levels.debug);
                    this.set('theSchedule.delay', delayIso);
                    return delayIso;
                }
            }
        },
        attributeProxyManager: {
            bind: {
                ownerClass: '{theSchedule.ownerClass}'
            },
            get: function (data) {
                var me = this;
                me.set('attributeProxy.autoload', false);
                var store = this.getStore('attributesStore');

                if (data.ownerClass) {
                    me.set(
                        'attributeProxy.url',
                        CMDBuildUI.util.administration.helper.ApiHelper.server.getAttributeUrl(data.ownerClass)
                    );
                    if (store) {
                        store.load({
                            callback: function (data) {
                                var ownerAttr = me.get('theSchedule.ownerAttr');
                                if (ownerAttr && !this.findRecord('name', ownerAttr)) {
                                    me.set('theSchedule.ownerAttr', null);
                                }
                            }
                        });
                    } else {
                        me.set('attributeProxy.autoload', true);
                    }
                }
            }
        },
        actionManager: {
            bind: '{action}',
            get: function (action) {
                switch (action) {
                    case CMDBuildUI.util.administration.helper.FormHelper.formActions.view:
                        this.set('formModeCls', 'formmode-view');
                        return CMDBuildUI.util.administration.helper.FormHelper.formActions.view;
                    case CMDBuildUI.util.administration.helper.FormHelper.formActions.edit:
                        this.set('formModeCls', 'formmode-edit');
                        return CMDBuildUI.util.administration.helper.FormHelper.formActions.edit;
                    case CMDBuildUI.util.administration.helper.FormHelper.formActions.edit:
                        this.set('formModeCls', 'formmode-add');
                        return CMDBuildUI.util.administration.helper.FormHelper.formActions.add;
                    default:
                        break;
                }
            },
            set: function (value) {
                this.set('actions.view', value === CMDBuildUI.util.administration.helper.FormHelper.formActions.view);
                this.set('actions.edit', value === CMDBuildUI.util.administration.helper.FormHelper.formActions.edit);
                this.set('actions.add', value === CMDBuildUI.util.administration.helper.FormHelper.formActions.add);
            }
        },

        panelTitle: {
            bind: {
                theSchedule: '{theSchedule}',
                description: '{theSchedule.description}'
            },
            get: function (data) {
                var title = Ext.String.format(
                    '{0} {1} {2}',
                    data.theSchedule.phantom ? CMDBuildUI.locales.Locales.administration.schedules.newschedule : CMDBuildUI.locales.Locales.administration.schedules.schedule,
                    data.description ? ' - ' : '',
                    data.description
                );
                this.getParent().set('title', title);
            }
        },
        sequenceParamsEditModes: function () {
            return CMDBuildUI.model.calendar.Trigger.getSequenceParamsEditModes();
        },
        cascades: function () {
            return CMDBuildUI.model.calendar.Trigger.getOnCardDeleteActions();
        },
        eventEditModes: function () {
            return CMDBuildUI.model.calendar.Trigger.getEventEditModes();
        },
        delays: function () {
            return CMDBuildUI.model.calendar.Trigger.getDelays();
        },
        timeZoneManager: {
            bind: {
                timeZone: '{theSchedule.timeZone}',
                store: '{timeZonesStore}',
                storeComplete: '{timeZonesStore.complete}'
            },
            get: function (data) {
                if (data.store && data.timeZone && data.storeComplete) {
                    var _timeZone = data.store.findRecord('_id', data.timeZone);
                    if (_timeZone) {
                        this.set('theSchedule._timeZone_description', _timeZone.get('description'));
                    }
                }
            }
        },
        reportFormats: function () {
            return CMDBuildUI.util.administration.helper.ModelHelper.getReportFormats();
        },
        reportAttributesManager: {
            bind: '{reportAttributesStore}',
            get: function (reportAttributesStore) {                                
                var _reportParametersData = [];
                reportAttributesStore.each(function (attribute) {
                    var currentParam = this.get('theSchedule._notification__report_params');
                    var storeItem = {
                        key: attribute.get('name'),
                        description: attribute.get('description'),
                        value: (currentParam && currentParam[attribute.get('name')]) ? currentParam[attribute.get('name')] : null
                    };
                    _reportParametersData.push(storeItem);
                });
                this.set('reportParametersData', _reportParametersData);
            }
        }
    },

    stores: {
        attributesStore: {
            model: 'CMDBuildUI.model.Attribute',
            proxy: {
                url: '{attributeProxy.url}',
                type: 'baseproxy'
            },
            autoLoad: '{attributeProxy.autoload}',
            sorters: ['description'],
            filters: [function (attribute) {
                return attribute.canAdminShow() && attribute.get('type') === CMDBuildUI.util.helper.ModelHelper.cmdbuildtypes.date.toLowerCase();
            }],
            autoDestroy: true,
            pageSize: 0
        },

        usersStore: {
            type: 'users',
            autoLoad: true,
            autoDestroy: true
        },
        taskStore: {
            model: 'CMDBuildUI.model.tasks.Task',
            filters: [function (item) {
                return item.get('type') !== CMDBuildUI.model.tasks.Task.types.emailService;
            }],
            remoteFilter: false,
            pageSize: 0,
            autoLoad: true,
            autoDestroy: true
        },
        groupsStore: {
            type: 'groups',
            autoLoad: true,
            autoDestroy: true
        },
        calendarCategoryStore: {
            model: 'CMDBuildUI.model.lookups.Lookup',
            proxy: {
                url: '/lookup_types/CalendarCategory/values',
                type: 'baseproxy'
            },
            autoLoad: true,
            autoDestroy: true
        },
        calendarPriorityStore: {
            model: 'CMDBuildUI.model.lookups.Lookup',
            proxy: {
                url: CMDBuildUI.util.administration.helper.ApiHelper.server.getLookupValuesUrl('CalendarPriority'),
                type: 'baseproxy'
            },
            autoLoad: true,
            autoDestroy: true
        },
        calendarFrequencyStore: {
            model: 'CMDBuildUI.model.lookups.Lookup',
            proxy: {
                url: CMDBuildUI.util.administration.helper.ApiHelper.server.getLookupValuesUrl('CalendarFrequency'),
                type: 'baseproxy'
            },
            autoLoad: true,
            autoDestroy: true
        },
        endTypeStore: {
            model: 'CMDBuildUI.model.lookups.Lookup',
            proxy: {
                url: CMDBuildUI.util.administration.helper.ApiHelper.server.getLookupValuesUrl('CalendarEndType'),
                type: 'baseproxy'
            },
            filters: [function (item) {

                return item.get('code') !== CMDBuildUI.model.calendar.Trigger.calendarEndTypes.other;
            }],
            remoteFilter: false,
            autoLoad: true,
            autoDestroy: true
        },
        sequenceParamsEditModeStore: {
            model: 'CMDBuildUI.model.base.ComboItem',
            proxy: {
                type: 'memory'
            },
            data: '{sequenceParamsEditModes}',
            autoLoad: true,
            autoDestroy: true
        },
        cascadeStore: {
            model: 'CMDBuildUI.model.base.ComboItem',
            proxy: {
                type: 'memory'
            },
            data: '{cascades}',
            autoLoad: true,
            autoDestroy: true
        },
        eventEditModeStore: {
            model: 'CMDBuildUI.model.base.ComboItem',
            proxy: {
                type: 'memory'
            },
            data: '{eventEditModes}',
            autoLoad: true,
            autoDestroy: true
        },

        delaysStore: {
            model: 'CMDBuildUI.model.base.ComboItem',
            proxy: {
                type: 'memory'
            },
            data: '{delays}',
            autoLoad: true,
            autoDestroy: true
        },

        allEmailTemplates: {
            type: 'chained',
            source: 'emails.Templates',
            autoLoad: true,
            autoDestroy: true
        },

        allReports: {
            type: 'chained',
            source: 'reports.Reports',
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
        }
    },
    loadObjectDescription: function (_id, store, recordDescriptionField, descriptionField) {
        var me = this;

        if (store.source) {
            store = store.source;
        }

        var extraparams = store.getProxy().getExtraParams();
        extraparams.positionOf = _id;
        extraparams.positionOf_goToPage = true;
        // add event listener. Use event listener instaed of callback
        // otherwise the load listener used within afterLoadWithPosition
        // is called at first load.
        store.on({
            load: {
                fn: function (store, records) {
                    var record = store.findRecord('_id', _id);
                    if (record) {
                        var description = record.get(descriptionField) || record.getId();
                        me.set(Ext.String.format('theSchedule._{0}_description', recordDescriptionField), description);
                    }
                },
                scope: this,
                single: true
            }
        });
        // load store
        store.load();
    }
});