
Ext.define('CMDBuildUI.view.joinviews.items.View',{
    extend: 'Ext.form.Panel',

    requires: [
        'CMDBuildUI.view.joinviews.items.ViewController'
    ],

    alias: 'widget.joinviews-items-view',
    controller: 'joinviews-items-view',

    scrollable: true,

    fieldDefaults: CMDBuildUI.util.helper.FormHelper.fieldDefaults
});
