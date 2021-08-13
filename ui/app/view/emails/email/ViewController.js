Ext.define('CMDBuildUI.view.emails.email.ViewController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.emails-view',

    onAttachmentsDatachanged: function (store, eOpts) {
        var vm = this.getViewModel();
        vm.set('attachmentsTotalCount', store.data.length);
    }

});