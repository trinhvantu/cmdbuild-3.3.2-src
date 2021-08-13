Ext.define('Overrides.selection.Model', {
    override: 'Ext.selection.Model',

    /**
     * Sets the current selectionMode.
     * @param {String} selMode 'SINGLE', 'MULTI' or 'SIMPLE'.
     */
    setSelectionMode: function(selMode) {
        selMode = selMode ? selMode.toUpperCase() : 'SINGLE';
        // set to mode specified unless it doesnt exist, in that case
        // use single.
        this.selectionMode = this.modes[selMode] ? selMode : 'SINGLE';

        // fire event
        this.fireEvent("selectionmodechange", this, this.selectionMode);
    }
});