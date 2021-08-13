

Ext.define('CMDBuildUI.model.calendar.Event', {
    extend: 'CMDBuildUI.model.base.Base',
    requires: ['CMDBuildUI.locales.Locales'],
    mixins: [
        'CMDBuildUI.mixins.model.Emails'
    ],

    statics: {
        calendar: 'calendar',

        eventEditMode: {
            read: 'read',
            write: 'write'
        },
        status: {
            active: 'active',
            completed: 'completed',
            expired: 'expired',
            canceled: 'canceled'
        }
    },

    fields: [{
        name: 'date',
        type: 'date',
        dateWriteFormat: 'Y-m-d',
        critical: true,
        attributeconf: {
            showInGrid: true,
            showInReducedGrid: true,
            group: '',
            calendarTriggers: []
        },
        mandatory: true,
        description: CMDBuildUI.locales.Locales.calendar.date,
        localized: {
            description: 'CMDBuildUI.locales.Locales.calendar.date'
        },
        hidden: false,
        writable: true,
        cmdbuildtype: 'date',
        validators: ['presence']
    }, {
        name: 'begin',
        type: 'date',
        dateWriteFormat: 'C',
        critical: true,
        attributeconf: {
            showInGrid: false,
            group: '',
            calendarTriggers: []
        },
        hidden: true,
        writable: true,
        cmdbuildtype: 'date'
    }, {
        name: 'missingDays',
        type: 'string',
        critical: true,
        attributeconf: {
            showInGrid: false,
            group: ''
        },
        description: CMDBuildUI.locales.Locales.calendar.missingdays,
        localized: {
            description: 'CMDBuildUI.locales.Locales.calendar.missingdays'
        },
        persist: false,
        hidden: false,
        writable: false,
        cmdbuildtype: 'string',
        calculate: function (record) {
            if ((record.status == 'expired' || record.status == 'active') && record.date) {
                var now = new Date();
                return (Ext.Date.diff(now, record.date, 'd') + 1) + '';
            } else {
                return '';
            }
        }
    }, {
        name: 'category',
        type: 'string',
        critical: true,
        attributeconf: {
            showInGrid: true,
            showInReducedGrid: true,
            group: '',
            lookupType: 'CalendarCategory',
            lookupIdField: 'code'
        },
        mandatory: true,
        description: CMDBuildUI.locales.Locales.calendar.category,
        localized: {
            description: 'CMDBuildUI.locales.Locales.calendar.category'
        },
        hidden: false,
        writable: true,
        cmdbuildtype: 'lookup'
    }, {
        name: 'description',
        type: 'string',
        critical: true,
        attributeconf: {
            showInGrid: true,
            showInReducedGrid: true,
            group: ''
        },
        description: CMDBuildUI.locales.Locales.calendar.description,
        localized: {
            description: 'CMDBuildUI.locales.Locales.calendar.description'
        },
        mandatory: true,
        hidden: false,
        writable: true,
        cmdbuildtype: 'string'
    }, {
        name: 'content',
        type: 'string',
        critical: true,
        attributeconf: {
            showInGrid: false,
            group: ''
        },
        description: CMDBuildUI.locales.Locales.calendar.londdescription,
        localized: {
            description: 'CMDBuildUI.locales.Locales.calendar.londdescription'
        },
        hidden: false,
        writable: true,
        cmdbuildtype: 'text'

    }, {
        name: 'participants',
        type: 'auto',
        persistent: false,
        attributeconf: {
            showInGrid: true,
            showInReducedGrid: true,
            group: ''
        },
        description: 'partecipants',
        hidden: true,
        cmdbuildtype: 'auto'
    }, {
        name: 'priority',
        type: 'string',
        critical: true,
        attributeconf: {
            showInGrid: true,
            showInReducedGrid: false,
            group: '',
            lookupType: 'CalendarPriority',
            lookupIdField: 'code'
        },
        mandatory: true,
        description: CMDBuildUI.locales.Locales.calendar.priority,
        localized: {
            description: 'CMDBuildUI.locales.Locales.calendar.priority'
        },
        hidden: false,
        writable: true,
        cmdbuildtype: 'lookup'
    }, {
        name: '_notification_delay',
        critical: true,
        type: 'number',
        attributeconf: {
            group: ''
        },
        cmdbuildtype: 'integer'
    }, {
        name: '_notification_content',
        type: 'string',
        critical: true,
        attributeconf: {
            showInGrid: false,
            group: ''
        },
        description: CMDBuildUI.locales.Locales.calendar.notificationtext,
        localized: {
            description: 'CMDBuildUI.locales.Locales.calendar.notificationtext'
        },
        hidden: false,
        writable: true,
        cmdbuildtype: 'text'
    }, {
        name: '_notification_template',
        type: 'string',
        critical: true,
        attributeconf: {
            showInGrid: false,
            group: ''
        },
        hidden: true,
        cmdbuildtype: 'string'
    }, {
        name: 'completion',
        type: 'date',
        dateWriteFormat: 'C',
        critical: true,
        attributeconf: {
            showInGrid: false,
            group: '',
            name: 'completion',
            calendarTriggers: [],
            showIf: 'if (api.record && api.record.get("status") == "completed") { return "disabled"} else {return (api.record && api.record.data._operation == "completed");}',
            autoValue: 'api.bind = ["_operation"] ; if (Ext.isEmpty(api.getValue("completion")) && api.getValue("_operation") == "completed") { api.setValue(new Date())} else if (api.getValue("_operation") == "canceled") { api.setValue(null)}'
        },
        description: CMDBuildUI.locales.Locales.calendar.executiondate,
        localized: {
            description: 'CMDBuildUI.locales.Locales.calendar.executiondate'
        },
        persist: false,
        hidden: false,
        writable: true,
        cmdbuildtype: 'date'
    }, {
        name: 'status', // one of active,completed,expired,canceled
        type: 'string',
        critical: true,
        attributeconf: {
            showInGrid: true,
            showInReducedGrid: true,
            group: '',
            lookupType: 'CalendarEventStatus',
            lookupIdField: 'code',
            showIf: 'if (api.mode === "read" ){return true} else if (api.mode === "update" && api.record.get("status") == "completed" || api.record.get("status") == "canceled") {return "disabled";}; '
        },
        description: CMDBuildUI.locales.Locales.calendar.status,
        localized: {
            description: 'CMDBuildUI.locales.Locales.calendar.status'
        },
        hidden: false,
        writable: false,
        cmdbuildtype: 'lookup'
    }, {
        name: 'Type',
        type: 'string',
        critical: true,
        attributeconf: {
            showInGrid: true,
            showInReducedGrid: false,
            group: ''
        },
        description: CMDBuildUI.locales.Locales.calendar.type,
        localized: {
            description: 'CMDBuildUI.locales.Locales.calendar.type'
        },
        persist: false,
        hidden: false,
        writable: false,
        cmdbuildtype: 'string',
        // defaultValue: 'default value',
        convert: function (v, record) {
            if (record.data.sequence != null) {
                return CMDBuildUI.locales.Locales.calendar.calculated
            } else {
                return CMDBuildUI.locales.Locales.calendar.manual
            }
        },
        depends: ['sequence']
    }, {
        name: 'owner',
        type: 'string',
        critical: true,
        attributeconf: {
            showInGrid: false,
            group: ''
        },
        description: 'owner',
        hidden: true,
        cmdbuildtype: 'string'
    }, {
        name: 'type', // one of instant, date  //FIXME:
        type: 'string',
        critical: true,
        attributeconf: {
            showInGrid: false,
            group: ''
        },
        description: 'type',
        hidden: true,
        cmdbuildtype: 'string'
    }, {
        name: 'source', // one of system,user; trigger stuff has always system
        type: 'string',
        critical: true,
        attributeconf: {
            showInGrid: false,
            group: ''
        },
        description: 'source',
        hidden: true,
        cmdbuildtype: 'string'
    }, {
        name: 'end',
        type: 'date',
        dateWriteFormat: 'C',
        critical: true,
        attributeconf: {
            showInGrid: false,
            group: '',
            calendarTriggers: []
        },
        description: 'end',
        hidden: true,
        cmdbuildtype: 'date'
    }, {
        name: 'timeZone',
        type: 'string',
        critical: true,
        attributeconf: {
            showInGrid: false,
            group: '',
            calendarTriggers: []
        },
        description: 'timeZone',
        hidden: true,
        cmdbuildtype: 'date'
    }, {
        name: 'card',
        type: 'number',
        critical: true,
        attributeconf: {
            showInGrid: false,
            group: ''
        },
        description: 'begin',
        hidden: true,
        cmdbuildtype: 'integer'
    }, {
        name: 'eventEditMode',
        type: 'string', //write
        critical: true,
        attributeconf: {
            showInGrid: false,
            group: ''
        },
        description: 'begin',
        hidden: true,
        cmdbuildtype: 'string'
    }, {
        name: 'job',
        type: 'auto', //TODO:
        critical: true,
        attributeconf: {
            showInGrid: false,
            group: ''
        },
        description: 'job',
        hidden: true,
        cmdbuildtype: 'string'
    }, {
        name: 'notifications',
        type: 'auto', //TODO: make hasMany
        critical: false,
        attributeconf: {
            showInGrid: false,
            group: ''
        },
        description: 'notifications',
        hidden: true,
        persist: false,
        cmdbuildtype: 'string'
    }, {
        name: 'onCardDeleteAction',
        type: 'string',
        critical: true,
        attributeconf: {
            showInGrid: false,
            group: ''
        },
        description: 'onCardDeleteAction',
        hidden: true,
        cmdbuildtype: 'string'
    }, {
        name: 'sequence',
        type: 'auto',
        critical: true,
        attributeconf: {
            showInGrid: false,
            group: ''
        },
        description: 'sequence',
        hidden: true,
        cmdbuildtype: 'string' //could be a reference?
    }],

    hasMany: [{
        model: 'CMDBuildUI.model.WidgetDefinition',
        name: 'widgets',
        associationKey: 'widgets'
    }],

    proxy: {
        type: 'baseproxy'
    },

    daysToSeconds: function (days) {
        return days * 60 * 60 * 24;
    },
    onLoad: function () {
        this._widgets = Ext.create("Ext.data.Store", {
            model: 'CMDBuildUI.model.WidgetDefinition',
            proxy: {
                type: 'memory'
            },
            data: [{
                _id: "createmodifycardorigin",
                _label: "Source card",
                _type: "createModifyCard",
                _active: this.get("card") ? true : false,
                _required: false,
                _alwaysenabled: true,
                _output: null,
                _label_translation: CMDBuildUI.locales.Locales.calendar.widgetsourcecard,
                ReadOnly: 1,
                ClassName: this.get("_card_type"),
                ObjId: this.get("card")
            }, {
                _id: "sequenceviewsequence",
                _label: "Calculation criterion",
                _type: "sequenceView",
                _active: this.get("sequence") ? true : false,
                _required: false,
                _alwaysenabled: true,
                _output: null,
                _label_translation: CMDBuildUI.locales.Locales.calendar.widgetcriterion,
                SequenceId: this.get("sequence")
            }, {
                _id: "manageemail",
                _label: "Emails",
                _type: "manageEmail",
                _active: true,
                _required: false,
                _alwaysenabled: true,
                _output: null,
                _label_translation: CMDBuildUI.locales.Locales.calendar.widgetemails
            }]
        });
    },

    /**
     * Override load method to add "includeModel" parameter in request.
     *
     * @param {Object} [options] Options to pass to the proxy.
     *
     * @return {Ext.data.operation.Read} The read operation.
     */
    load: function (options) {
        options = Ext.apply(options || {}, {
            params: {
                includeStats: true
            }
        });
        this.callParent([options]);
    }
});