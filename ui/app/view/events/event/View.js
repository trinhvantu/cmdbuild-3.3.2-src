
Ext.define('CMDBuildUI.view.events.event.View', {
    extend: 'Ext.form.Panel',
    alias: 'widget.events-event-view',
    requires: [
        'CMDBuildUI.view.events.event.ViewController',
        'CMDBuildUI.view.events.event.ViewModel'
    ],

    mixins: [
        'CMDBuildUI.view.events.event.Mixin'
    ],

    controller: 'events-event-view',
    viewModel: {
        type: 'events-event-view'
    },

    config: {
        theEvent: null,
        hideTools: false,

        /**
        * @cfg {Boolean} shownInPopup
        * Set to true get inline form.
        */
        shownInPopup: false
    },
    publishes: 'theEvent',
    reference: 'events-event-view',

    bind: {
        title: '{title}'
    },

    formmode: CMDBuildUI.util.helper.FormHelper.formmodes.read,

    tabpaneltools: CMDBuildUI.view.events.Util.getTools(),

    autoScroll: true,
    fieldDefaults: CMDBuildUI.util.helper.FormHelper.fieldDefaults,

    items: [],

    /**
     * same function in CMDBuildUI.view.fields.schedulerdate.ViewController
     */
    generateForm: function () {
        var view = this;
        var model = Ext.ClassManager.get('CMDBuildUI.model.calendar.Event');
        this.readonly = true;

        var panel = CMDBuildUI.util.helper.FormHelper.renderForm(model, {
            readonly: true,
            linkName: 'events-event-view.theEvent',
            showAsFieldsets: true,
            layout: this.getFormLayout(),
            mode: CMDBuildUI.util.helper.FormHelper.formmodes.read
        });

        var missingDays = panel[0].items[this._missingdays_row_index].items[1].items[0]
        Ext.apply(missingDays, this.getMissingDaysExtraConf());

        //adds the partecipants combobox
        var partecipants = this.getUserGroupParticipantsFields();
        panel[0].items.splice(this._partecipantGroup_row_index, 0, partecipants);

        /**
         * if want to enable/disable notification template field in view, uncomment/comment the code below lined
         */
        // //adds the notification_template combo
        // var notificationtemplate = this.getNotificationTemplateComboField();
        // panel[0].items[this._notification_delay_row_index].items[0].items.push(notificationtemplate);

        // adds the daysAdvanceNotification text
        var daysAdvanceNotification = this.getDaysAdvanceNofificationFieldRead();
        panel[0].items[this._notification_delay_row_index].items[0].items.push(daysAdvanceNotification);

        if (!view.getHideTools()) {
            // add toolbar
            var toolbar = {
                xtype: 'toolbar',
                cls: 'fieldset-toolbar',
                items: Ext.Array.merge([{
                    xtype: 'tbfill'
                }], view.tabpaneltools)
            };
            Ext.Array.insert(panel, 0, [toolbar]);
        }

        view.removeAll();
        var form = this.getMainPanelForm(panel);
        view.add(form);

        // add conditional visibility rules
        view.addConditionalVisibilityRules();
    }
});
