Ext.define('CMDBuildUI.view.administration.content.users.ViewController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.administration-content-users-view',

    control: {        
        // '#adduser':{
        //     click: 'onNewBtnClick'
        // }
    },

   /**
     * 
     * @param {Ext.menu.Item} item
     * @param {Ext.event.Event} event
     * @param {Object} eOpts
     */
    // onNewBtnClick: function (item, event, eOpts) {
    //     var view = this.getView();
    //     view.getViewModel().set('isGridHidden', false);
    //     var container = Ext.getCmp(CMDBuildUI.view.administration.DetailsWindow.elementId) || Ext.create(CMDBuildUI.view.administration.DetailsWindow);
    //     container.removeAll();
    //     container.add({
    //         xtype: 'administration-content-users-card-create',
    //     //     viewModel: {
    //     //         data: {
    //     //             // grid: item.up('administration-maincontainer').down('administration-content-users-grid')
    //     //         },
    //     //         // links: {
    //     //         //     theUser: {
    //     //         //         type: 'CMDBuildUI.model.users.User',
    //     //         //         create: true
    //     //         //     }
    //     //         // }
    //     //     }
    //     });
    // },
    onAllUsersStoreDatachanged: function (store, records) {     
        var counter = this.getView().down('#userGridCounter');
        counter.setHtml(Ext.String.format(CMDBuildUI.locales.Locales.administration.groupandpermissions.strings.displaytotalrecords, null, null, store.totalCount));        
    }

    
});
