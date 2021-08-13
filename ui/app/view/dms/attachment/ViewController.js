Ext.define('CMDBuildUI.view.dms.attachment.ViewController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.dms-attachment-view',
    control: {
        '#': {
            beforerender: 'onBeforeRender'
        }
    },

    onBeforeRender: function (view) {
        var vm = this.getViewModel();

        vm.bind({
            DMSClass: '{dms-attachment-view.DMSClass}',
            DMSModelClass: '{dms-attachment-view.DMSModelClass}'
        }, this.itemsUpdate, this);
    },

    itemsUpdate: function (data) {
        if (data.DMSModelClass && data.DMSClass) {
            var items = CMDBuildUI.util.helper.FormHelper.renderForm(data.DMSModelClass, {
                mode: CMDBuildUI.util.helper.FormHelper.formmodes.read,
                linkName: 'dms-attachment-view.theObject',
                showAsFieldsets: true,
                readonly: true,
                layout: data.DMSClass.get("formStructure") && data.DMSClass.get("formStructure").active ?  data.DMSClass.get("formStructure").form : undefined
            });

            var view = this.getView();
            var formView = view.lookupReference('formpanel');

            formView.removeAll(true);
            formView.add(view.getFormItems(items));

            // add conditional visibility rules
            view.addConditionalVisibilityRules('formpanel');
        }
    }
});
