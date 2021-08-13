Ext.define('CMDBuildUI.view.emails.ContainerController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.emails-container',

    control: {
        '#': {
            beforerender: 'onBeforeRender',
            show: 'onShow'
        }
    },

    /**
     * 
     * @param {CMDBuildUI.view.emails.Container} view 
     * @param {Object} eOpts 
     */
    onBeforeRender: function (view, eOpts) {
        var vm = view.lookupViewModel();
        var parentTabPanel = this.getParentTabPanel();
        var object = parentTabPanel.getFormObject();
        if (object) {
            initGrid(object, this.getParentTabPanel().getFormMode());
        } else {
            var fn;
            var objectIdName;
            switch (vm.get("objectType")) {
                case CMDBuildUI.util.helper.ModelHelper.objecttypes.klass:
                    fn = CMDBuildUI.util.api.Client.getRemoteCard;
                    objectIdName = 'objectId'
                    break;
                case CMDBuildUI.util.helper.ModelHelper.objecttypes.process:
                    fn = CMDBuildUI.util.api.Client.getRemoteProcessInstance;
                    objectIdName = 'objectId';
                    break;
                case CMDBuildUI.util.helper.ModelHelper.objecttypes.calendar:
                    objectIdName = 'events-tabpanel.eventId';
                    vm.bind(Ext.String.format('{{0}}', objectIdName), function (eventId) {
                        this.onBeforeRender(view, eOpts);
                    }, this, { single: true });
                    break;
            }
            if (fn) {
                fn(vm.get("objectTypeName"), vm.get(objectIdName)).then(function (record) {
                    initGrid(record, CMDBuildUI.util.helper.FormHelper.formmodes.read);
                });
            }
        }

        /**
         * 
         * @param {Ext.data.Model} target 
         * @param {String} formmode 
         */
        function initGrid(target, formmode) {
            vm.set("theTarget", target);
            vm.set("emails", target.emails());
            view.add({
                xtype: 'emails-grid',
                formMode: formmode,
                readOnly: view.getReadOnly()
            });

        }
    },

    /**
     * 
     * @param {CMDBuildUI.view.emails.Container} view 
     * @param {Object} eOpts 
     */
    onShow: function (view, eOpts) {
        var obj = view.lookupViewModel().get("theTarget");
        if (obj) {
            obj.loadTemplates().then(function (templates) {
                obj.updateEmailsFromTemplates();
            });
        }
    },

    privates: {

        /**
         * @return {Ext.tab.Panel}
         */
        getParentTabPanel: function () {
            return this.getView().up("tabpanel");
        }
    }
});