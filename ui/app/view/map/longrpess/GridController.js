Ext.define('CMDBuildUI.view.map.longrpess.GridController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.map-longrpess-grid',

    /**
     * 
     * @param {*} view 
     * @param {*} rowIndex 
     * @param {*} colIndex 
     * @param {*} item 
     * @param {*} e 
     * @param {*} record 
     * @param {*} row 
     */
    onActionColumnClick: function (view, rowIndex, colIndex, item, e, record, row) {
        var className = record.get('_type');
        var cardId = record.getId();

        CMDBuildUI.util.Utilities.redirectTo(
            Ext.String.format(
                "classes/{0}/cards/{1}",
                className,
                cardId
            )
        );

        // CMDBuildUI.map.util.Util.setSelection(cardId, className);

        CMDBuildUI.util.Utilities.closePopup(CMDBuildUI.view.map.longrpess.Grid.longpressPopupId);
    }
});
