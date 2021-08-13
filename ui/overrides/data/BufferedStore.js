Ext.define('Override.data.BufferedStore', {
    override: 'Ext.data.BufferedStore',

    afterChange: function (item, modified, type) {
        var me = this;
        me.fireEvent('update', me, item, type, modified, {});
    },

    afterEdit: function (record, modifiedFieldNames) {
        this.needsSync = this.needsSync || record.dirty;
        this.afterChange(record, modifiedFieldNames, Ext.data.Model.EDIT);
    }
});