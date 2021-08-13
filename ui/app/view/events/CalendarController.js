Ext.define('CMDBuildUI.view.events.CalendarController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.events-calendar',

    control: {
        '#': {
            beforerender: 'onBeforeRender'
        }
    },

    /**
     * Before rendere handler
     * @param {CMDBuildUI.view.events.Calendar} view 
     * @param {Object} eOpts 
     */
    onBeforeRender: function (view, eOpts) {
        var me = this;
        view.add({
            xtype: 'ux-calendar',
            reference: 'ux-calendar',
            dataSourceType: CMDBuildUI.util.helper.ModelHelper.objecttypes.calendar,
            dataSourceTypeName: CMDBuildUI.util.helper.ModelHelper.objecttypes.event,
            dataSourceFilter: null,
            targetObject: null,
            eventStartDateAttribute: 'date',
            dataSourceUrl: CMDBuildUI.util.Config.baseUrl + CMDBuildUI.util.api.Calendar.getEventsUrl(),
            dataSourceExtraParams: { detailed: true },
            eventTitleAttribute: 'description',
            eventTypeAttribute: 'category',
            eventLookupValueField: 'code',
            eventTypeLookup: 'CalendarCategory',
            eventClickHandler: this.eventClickHandler,
            viewSkeletonRender: function () {
                me.listen({
                    store: {
                        '#scheules': {
                            load: 'onEventsStoreLoad'
                        }
                    }
                });

                var container = me.getView().up('events-container');
                var store = container.getSchedules();
                var advancedFilter = store.getAdvancedFilter();
                var uxCalendar = me.getView().lookupReference('ux-calendar');
                uxCalendar.applyAdvanceFilter(advancedFilter);
            }
        });
    },

    onEventsStoreLoad: function (store, records, success, operation, eOpts) {
        var uxCalendar = this.getView().lookupReference('ux-calendar');

        //clones the main filter
        var advancedFilter = store.getAdvancedFilter().config;
        var newAdvancedFilter = new CMDBuildUI.util.AdvancedFilter(advancedFilter);

        //applies the filter
        uxCalendar.applyAdvanceFilter(newAdvancedFilter);
    },

    privates: {
        /**
         * 
         * @param {Object} eventClickInfo 
         */
        eventClickHandler: function (eventClickInfo) {
            var url = CMDBuildUI.util.Navigation.getScheduleBaseUrl(
                eventClickInfo.event.id,
                CMDBuildUI.mixins.DetailsTabPanel.actions.view);

            CMDBuildUI.util.Utilities.redirectTo(url);
        }
    }
});
