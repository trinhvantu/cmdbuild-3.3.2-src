Ext.define('CMDBuildUI.view.events.event.EditController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.events-event-edit',
    control: {
        '#': {
            beforerender: 'onBeforeRender'
        },
        '#savebtn': {
            click: 'onSaveBtnClick'
        },
        '#saveandclosebtn': {
            click: 'onSaveAndCloseBtnClick'
        },
        '#cancelbtn': {
            click: 'onCancelBtnClick'
        }
    },

    /**
     * 
     * @param {*} view 
     * @param {*} eOpts 
     */
    onBeforeRender: function (view, eOpts) {
        var me = this;
        var vm = me.getViewModel();
        // view.generateForm.call(view);
        vm.bind('{events-event-edit.theEvent}', function (theEvent) {
            if (theEvent) {
                view.generateForm.call(view);
            }
        }, this);

        vm.bind('{events-event-edit.theEvent.date}', function (dateChange) {
            var theEvent = this.getTheEvent()
            theEvent.set('begin', dateChange)
        }, view);

    },

    /**
     * @param {Ext.button.Button} button
     * @param {Event} e
     * @param {Object} eOpts
     */
    onSaveBtnClick: function (button, e, eOpts) {
        this.beforeSave();
        var theEvent = this.getView().getTheEvent();
        theEvent.save({
            callback: function (record, eOpts) {
                CMDBuildUI.util.Utilities.redirectTo(
                    CMDBuildUI.util.Navigation.getScheduleBaseUrl(
                        record.getId(),
                        CMDBuildUI.mixins.DetailsTabPanel.actions.view
                    ));
                Ext.GlobalEvents.fireEventArgs("cardupdated", [record]);
            }
        });
    },

    /**
     * @param {Ext.button.Button} button
     * @param {Event} e
     * @param {Object} eOpts
     */
    onSaveAndCloseBtnClick: function (button, e, eOpts) {
        var theEvent = this.getView().getTheEvent();
        this.beforeSave();
        theEvent.save({
            callback: function (record, eOpts) {
                CMDBuildUI.util.Navigation.removeManagementDetailsWindow();
                CMDBuildUI.util.Utilities.redirectTo(
                    CMDBuildUI.util.Navigation.getScheduleBaseUrl(
                        record.getId()));

                Ext.GlobalEvents.fireEventArgs("cardupdated", [record]);
            }
        });
    },

    /**
     * @param {Ext.button.Button} button
     * @param {Event} e
     * @param {Object} eOpts
     */
    onCancelBtnClick: function (button, e, eOpts) {
        var theEvent = this.getView().getTheEvent();
        theEvent.reject();
        CMDBuildUI.util.Navigation.removeManagementDetailsWindow();
    },

    beforeSave: function () {
        var me = this;
        var view = me.getView();
        var combo = view.lookupReference('operationcombo');
        var value = combo.getValue();

        if (value) {
            var theEvent = view.getTheEvent();
            theEvent.set('status', value);
        }
    }
});
