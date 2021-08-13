Ext.define('CMDBuildUI.view.joinviews.items.ViewController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.joinviews-items-view',

    control: {
        '#': {
            beforerender: 'onBeforeRender'
        }
    },

    /**
     * @param {CMDBuildUI.view.views.items.View} view
     * @param {Object} eOpts
     */
    onBeforeRender: function (view, eOpts) {
        var vm = view.lookupViewModel();
        CMDBuildUI.util.helper.FormHelper.renderFormForType(
            CMDBuildUI.util.helper.ModelHelper.objecttypes.view,
            vm.get("objectTypeName"), {
                mode: CMDBuildUI.util.helper.FormHelper.formmodes.read,
                showAsFieldsets: true,
                linkName: 'record'
            }
        ).then(function(items) {
            view.removeAll();
            view.add(items);
        });
    }
    
});
