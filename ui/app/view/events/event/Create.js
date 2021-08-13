
Ext.define('CMDBuildUI.view.events.event.Create', {
    extend: 'Ext.form.Panel',
    alias: 'widget.events-event-create',
    requires: [
        'CMDBuildUI.view.events.event.CreateController',
        'CMDBuildUI.view.events.event.CreateModel'
    ],

    mixins: [
        'CMDBuildUI.view.events.event.Mixin'
    ],

    config: {
        theEvent: null
    },
    publishes: 'theEvent',
    reference: 'events-event-create',

    controller: 'events-event-create',
    viewModel: {
        type: 'events-event-create'
    },

    modelValidation: true,
    autoScroll: true,
    fieldDefaults: CMDBuildUI.util.helper.FormHelper.fieldDefaults,

    formmode: CMDBuildUI.util.helper.FormHelper.formmodes.create,

    buttons: [{
        text: CMDBuildUI.locales.Locales.common.actions.save,
        formBind: true, //only enabled once the form is valid
        disabled: true,
        reference: 'savebtn',
        itemId: 'savebtn',
        ui: 'management-action-small',
        autoEl: {
            'data-testid': 'card-create-save'
        },
        localized: {
            text: 'CMDBuildUI.locales.Locales.common.actions.save'
        }
    }, {
        text: CMDBuildUI.locales.Locales.common.actions.saveandclose,
        formBind: true, //only enabled once the form is valid
        disabled: true,
        reference: 'saveandclosebtn',
        ui: 'management-action-small',
        itemId: 'saveandclosebtn',
        autoEl: {
            'data-testid': 'card-create-saveandclose'
        },
        localized: {
            text: 'CMDBuildUI.locales.Locales.common.actions.saveandclose'
        }
    }, {
        text: CMDBuildUI.locales.Locales.common.actions.cancel,
        reference: 'cancelbtn',
        itemId: 'cancelbtn',
        ui: 'secondary-action-small',
        autoEl: {
            'data-testid': 'card-create-cancel'
        },
        localized: {
            text: 'CMDBuildUI.locales.Locales.common.actions.cancel'
        }
    }],

    /**
    * same function in CMDBuildUI.view.fields.schedulerdate.ViewController
    */
    generateForm: function () {
        var view = this;
        var model = Ext.ClassManager.get('CMDBuildUI.model.calendar.Event');
        this.readonly = false;

        var panel = CMDBuildUI.util.helper.FormHelper.renderForm(model, {
            readonly: false,
            linkName: 'events-event-create.theEvent',
            showAsFieldsets: true,
            layout: this.getFormLayout(),
            mode: CMDBuildUI.util.helper.FormHelper.formmodes.create
        });

        var missingDays = panel[0].items[this._missingdays_row_index].items[1].items[0]
        Ext.apply(missingDays, this.getMissingDaysExtraConf());

        //adds the partecipants combobox
        var partecipants = this.getUserGroupParticipantsFields();
        panel[0].items.splice(this._partecipantGroup_row_index, 0, partecipants);

        //adds the notification_template combo
        var notificationtemplate = this.getNotificationTemplateComboField();
        panel[0].items[this._notification_delay_row_index].items[0].items.push(notificationtemplate);

        //adds the notification text textfield
        var notificationtext = this.getNotificationContentField();
        panel[0].items[this._notificationText_row_index].items[0].items.push(notificationtext);

        // adds the daysAdvanceNotification text
        var daysAdvanceNotification = this.getDaysAdvanceNofificationField();
        panel[0].items[this._notification_delay_row_index].items[1].items.push(daysAdvanceNotification);

        view.removeAll();
        var form = this.getMainPanelForm(panel);
        view.add(form);

        // add conditional visibility rules
        view.addConditionalVisibilityRules();
    }
});
