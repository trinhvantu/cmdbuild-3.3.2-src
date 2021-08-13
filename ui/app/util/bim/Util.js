Ext.define('CMDBuildUI.util.bim.Util', {
    singleton: true,

    /**
     * @param {String} GlobalId
     * @param {Function} callback The function to execute in success case
     * @param {Object} scope The scope for the function
     */
    getRelatedCard: function (GlobalId, callback, scope) {
        Ext.Ajax.request({
            url: Ext.String.format('{0}/bim/values/{1}?{2}',
                CMDBuildUI.util.Config.baseUrl,
                GlobalId,
                "if_exists=true"
            ),

            method: 'GET',
            success: function (response) {
                var data = JSON.parse(response.responseText).data;

                callback.call(scope || this, data)
            },
            error: function (error) {
                console.log(error);
            }
        })
    },

    /**
     * 
     * @param {*} projectId 
     * @param {*} selectedId 
     */
    openBimPopup: function (projectId, selectedId) {
        CMDBuildUI.util.Ajax.setActionId("class.card.bim.open");
        Ext.Loader.loadScript({
            url: ['resources/js/viewer/bimsurfer.js', 'resources/js/viewer/cmdbuildBimViewer.bundle.js',],
            onLoad: function () {
                CMDBuildUI.util.Utilities.openPopup('bimPopup', CMDBuildUI.locales.Locales.bim.bimViewer, {
                    xtype: 'bim-container',
                    projectId: projectId,
                    selectedId: selectedId
                });
            }
        });
    }
});