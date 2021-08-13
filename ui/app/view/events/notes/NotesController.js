Ext.define('CMDBuildUI.view.events.notes.NotesController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.events-notes-notes',
    control: {
        '#editbtn': {
            click: 'onEditBtnClick'
        },
        '#savebtn': {
            click: 'onSaveBtnClick'
        },
        '#cancelbtn': {
            click: 'onCancelBtnClick'
        }
    },

    /**
     * @param {Ext.button.Button} button Edit button
     * @param {Event} event
     * @param {Object} eOpts
     */
    onEditBtnClick: function (button, event, eOpts) {
        this.getViewModel().set("editmode", true);
    },

    /**
     * @param {Ext.button.Button} button Save button
     * @param {Event} event
     * @param {Object} eOpts
     */
    onSaveBtnClick: function (button, event, eOpts) {
        var vm = this.getViewModel();
        var theEvent = this.getView().getTheEvent();
        var theEventClone = theEvent.clone();

        theEventClone.reject();
        theEventClone.set('notes', theEvent.get('notes'));

        theEventClone.save({
            success: function (record, operation) {
                //delete theEventClone; //FIXME: view if can remove the clone in this way
                theEventClone.destroy();
                vm.set('editmode', false);
            }
        });
    },

    /**
     * @param {Ext.button.Button} button Cancel button
     * @param {Event} event
     * @param {Object} eOpts
     */
    onCancelBtnClick: function (button, event, eOpts) {
        var theEvent = this.getView().getTheEvent();

        //If the record has the notes field modified
        if (!Ext.isEmpty(theEvent.getModified('notes'), true)) {
            //sets the old value;
            theEvent.set('notes', theEvent.getModified('notes'));
        }

        this.getViewModel().set("editmode", false);
    }

});
