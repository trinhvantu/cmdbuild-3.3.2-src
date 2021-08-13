Ext.define('CMDBuildUI.view.administration.content.users.card.ViewController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.administration-content-users-card-view',

    control: {

        '#editBtn': {
            click: 'onEditBtnClick'
        },
        '#cloneBtn': {
            click: 'onCloneBtnClick'
        },
        '#enableBtn': {
            click: 'onToggleBtnClick'
        },
        '#disableBtn': {
            click: 'onToggleBtnClick'
        }
    },

    onEditBtnClick: function (button, event) {
        var me = this,
            view = me.getView(),
            vm = view.getViewModel(),
            theUserId = vm.get('theUser._id'),
            grid = vm.get('grid'),
            container = Ext.getCmp(CMDBuildUI.view.administration.DetailsWindow.elementId) || Ext.create(CMDBuildUI.view.administration.DetailsWindow);

        container.removeAll();
        container.add({
            xtype: 'administration-content-users-card-edit',
            viewModel: {
                links: {
                    theUser: {
                        type: 'CMDBuildUI.model.users.User',
                        id: theUserId
                    }
                },
                data: {
                    grid: grid
                }
            }
        });

    },

    onDeleteBtnClick: function (button, event) {
        var me = this,
            view = me.getView();

        Ext.Msg.confirm(
            CMDBuildUI.locales.Locales.administration.common.messages.attention,
            CMDBuildUI.locales.Locales.administration.common.messages.areyousuredeleteitem,
            function (btnText) {
                if (btnText === "yes") {
                    CMDBuildUI.util.Ajax.setActionId('delete-user');
                    view.getViewModel().get('theUser').erase({
                        success: function (record, operation) {
                            Ext.ComponentQuery.query('administration-content-users-grid')[0].fireEventArgs('reload', [record, 'delete']);
                        }
                    });
                }
            }, this);
    },


    /**
     * @param {Ext.button.Button} button
     * @param {Event} e
     * @param {Object} eOpts
     */

    onToggleBtnClick: function (button, e, eOpts) {
        var view = this.getView();
        var vm = view.getViewModel();
        var theUser = vm.get('theUser');
        theUser.set('active', !theUser.get('active'));
        // TODO: is best if use proxy writer
        Ext.Array.forEach(theUser.get('userGroups'), function (element, index) {
            if (theUser.data.userGroups[index] && theUser.data.userGroups[index].isModel) {
                theUser.data.userGroups[index] = theUser.data.userGroups[index].getData();
            }
            delete theUser.data.userGroups[index].id;
        });
        Ext.Array.forEach(theUser.get('userTenants'), function (element, index) {
            if (theUser.data.userGroups[index] && theUser.data.userGroups[index].isModel) {
                theUser.data.userGroups[index] = theUser.data.userGroups[index].getData();
            }
            delete theUser.data.userTenants[index].id;
        });
        theUser.save({
            success: function (record, operation) {
                Ext.GlobalEvents.fireEventArgs("userupdated", [view, record]);
            }
        });
    },

    onCloneBtnClick: function () {
        var view = this.getView();
        var vm = view.getViewModel();
        var container = Ext.getCmp(CMDBuildUI.view.administration.DetailsWindow.elementId) || Ext.create(CMDBuildUI.view.administration.DetailsWindow);
        var newUser = vm.get('theUser').clone();
        container.removeAll();
        container.add({
            xtype: 'administration-content-users-card-create',

            viewModel: {
                data: {
                    theUser: newUser,
                    title: CMDBuildUI.locales.Locales.administration.navigation.users,
                    grid: view.config.viewModel.data.grid
                }
            }
        });
    },
    /**
     * unused but necessary function
     * @param {*} store 
     * @param {*} items 
     * @param {*} operation 
     * @param {*} success 
     */
    onTenantStoreLoad: function (store, items, operation, success) {

    }

});