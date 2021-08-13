Ext.define('CMDBuildUI.model.emails.Email', {
    extend: 'CMDBuildUI.model.base.Base',

    statics: {
        statuses: {
            draft: 'draft',
            outgoing: 'outgoing',
            received: 'received',
            sent: 'sent'
        },
        getDelays: function (withNegative) {             
            var positiveDelays = [], negativeDelays = [];

            if (withNegative) {
                negativeDelays = [{
                    value: -3600, // -1 hour in seconds
                    label: CMDBuildUI.locales.Locales.emails.delays.negativehour1
                }, {
                    value: -7200, // 2 hours in seconds
                    label: CMDBuildUI.locales.Locales.emails.delays.negativehours2
                }, {
                    value: -14400, // 4 hours in seconds
                    label: CMDBuildUI.locales.Locales.emails.delays.negativehours4
                }, {
                    value: -86400, // 1 day in seconds
                    label: CMDBuildUI.locales.Locales.emails.delays.negativeday1
                }, {
                    value: -172800, // 2 days in seconds
                    label: CMDBuildUI.locales.Locales.emails.delays.negativedays2
                }, {
                    value: -345600, // 4 days in seconds
                    label: CMDBuildUI.locales.Locales.emails.delays.negativedays4
                }, {
                    value: -604800, // 1 week in seconds
                    label: CMDBuildUI.locales.Locales.emails.delays.negativeweek1
                }, {
                    value: -1209600, // 2 weeks in seconds
                    label: CMDBuildUI.locales.Locales.emails.delays.negativeweeks2
                }, {
                    value: -2629746, // 1 month in seconds
                    label: CMDBuildUI.locales.Locales.emails.delays.negativemonth1
                }];
            }
            positiveDelays = [{
                value: 0,
                label: CMDBuildUI.locales.Locales.emails.delays.none
            }, {
                value: 3600, // 1 hour in seconds
                label: CMDBuildUI.locales.Locales.emails.delays.hour1
            }, {
                value: 7200, // 2 hours in seconds
                label: CMDBuildUI.locales.Locales.emails.delays.hours2
            }, {
                value: 14400, // 4 hours in seconds
                label: CMDBuildUI.locales.Locales.emails.delays.hours4
            }, {
                value: 86400, // 1 day in seconds
                label: CMDBuildUI.locales.Locales.emails.delays.day1
            }, {
                value: 172800, // 2 days in seconds
                label: CMDBuildUI.locales.Locales.emails.delays.days2
            }, {
                value: 345600, // 4 days in seconds
                label: CMDBuildUI.locales.Locales.emails.delays.days4
            }, {
                value: 604800, // 1 week in seconds
                label: CMDBuildUI.locales.Locales.emails.delays.week1
            }, {
                value: 1209600, // 2 weeks in seconds
                label: CMDBuildUI.locales.Locales.emails.delays.weeks2
            }, {
                value: 2629746, // 1 month in seconds
                label: CMDBuildUI.locales.Locales.emails.delays.month1
            }];

            var delays = Ext.Array.merge(positiveDelays, negativeDelays);
            return delays;

        }
    },

    fields: [{
        name: 'keepSynchronization',
        type: 'boolean',
        critical: true
    }, {
        name: 'account',
        type: 'string',
        critical: true
    }, {
        name: 'bcc',
        type: 'string',
        critical: true
    }, {
        name: 'body',
        type: 'string',
        critical: true
    }, {
        name: 'cc',
        type: 'string',
        critical: true
    }, {
        name: 'date',
        type: 'date',
        critical: true
    }, {
        name: 'delay',
        type: 'number',
        critical: true
    }, {
        name: 'from',
        type: 'string',
        critical: true
    }, {
        name: 'noSubjectPrefix',
        type: 'boolean',
        critical: true
    }, {
        name: 'notifyWith',
        type: 'string',
        critical: true
    }, {
        name: 'promptSynchronization',
        type: 'boolean',
        critical: true
    }, {
        name: 'status',
        type: 'string',
        critical: true
    }, {
        name: 'subject',
        type: 'string',
        critical: true,
        validators: ['presence']
    }, {
        name: 'template',
        type: 'string',
        critical: true
    }, {
        name: 'to',
        type: 'string',
        critical: true
    }, {
        name: 'contentType',
        type: 'string',
        defaultValue: 'text/html',
        critical: true
    }, {
        name: '_content_html',
        persist: false,
        validators: ['presence']
    }, {
        name: '_content_plain',
        persist: false
    }],
    proxy: {
        type: 'baseproxy'
    }
});