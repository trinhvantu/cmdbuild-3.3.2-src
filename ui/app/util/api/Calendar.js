Ext.define('CMDBuildUI.util.api.Calendar', {
    singleton: true,

    /**
     * Get events url
     * @return {String}
     */
    getEventsUrl: function () {
        return '/calendar/events';
    },

    /** Get card attachments. can specify attachment 
     * 
     * @param {*} cardId 
     * @param {*} attachmentId 
     */
    getAttachmentsUrl: function (cardId) {
        return Ext.String.format(
            '/classes/_CalendarEvent/cards/{0}/attachments',
            cardId
        );
    },

    /**
     * 
     * @param {String} className
     * @param {Number} cardId 
     * @param {String} extension
     */
    getPrintCalendarsUrl: function (extension) {
        return Ext.String.format(
            "{0}/calendar/events/print/calendar.{1}",
            CMDBuildUI.util.Config.baseUrl,
            extension
        );
    }
});