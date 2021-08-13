Ext.define('CMDBuildUI.view.administration.content.dashboards.ViewController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.administration-content-dashboards-view',

    control: {
        '#': {
            beforerender: 'onBeforeRender',
            closed: 'onClose'
        },
        '#adddashboard': {
            click: 'onNewBtnClick'
        }
    },
    onClose: function () {
        this.redirectTo(Ext.History.getToken(), true);
    },
    onBeforeRender: function (view) {
        var me = this,
            vm = me.getViewModel();
        if (view.getShowCard()) {


            var config = {
                xtype: 'view-administration-content-dashboards-card',
                viewModel: {
                    data: {
                        hideForm: vm.get('hideForm'),
                        action: vm.get('action'),
                        actions: vm.get('actions')
                    },
                    links: {
                        theDashboard: {
                            type: 'CMDBuildUI.model.dashboards.Dashboard',
                            id: vm.get('dashboardId')
                        }
                    }
                }
            };
            if (!vm.get('dashboardId')) {
                config.viewModel.data.actions.add = true;
                config.viewModel.data.actions.view = false;
                config.viewModel.data.actions.edit = false;
                config.viewModel.links.theDashboard.create = true;
                config.viewModel.links.theDashboard.id = undefined;

            }
            view.add(config);
        } else {
            view.add({
                xtype: 'administration-content-dashboards-grid',
                region: 'center',
                bind: {
                    hidden: '{isGridHidden}'
                }
            });
        }

    },
    /**
      * 
      * @param {Ext.menu.Item} item
      * @param {Ext.event.Event} event
      * @param {Object} eOpts
      */
    onNewBtnClick: function (item, event, eOpts) {
        var view = this.getView();
        view.getViewModel().set('isGridHidden', false);        
        history.pushState(null, null, '#administration/dashboards');
        CMDBuildUI.util.administration.MenuStoreBuilder.selectNode('href', 'administration/dashboards');        
        CMDBuildUI.util.Navigation.addIntoMainAdministrationContent('administration-content-dashboards-view', {
            showCard: true,
            hidden: true,
            viewModel: {
                data: {
                    hideForm: false,
                    action: CMDBuildUI.util.administration.helper.FormHelper.formActions.add,
                    actions: {
                        view: false,
                        edit: false,
                        add: true
                    }
                }
            }
        });
    },

    /**
     * @param {Ext.form.field.Base} field
     * @param {Ext.event.Event} event
     */
    onSearchSpecialKey: function (field, event) {
        if (event.getKey() === event.ENTER) {
            this.onSearchSubmit(field);
        }
    },
    /**
     * Filter grid items.
     * @param {Ext.form.field.Text} field
     * @param {Ext.form.trigger.Trigger} trigger
     * @param {Object} eOpts
     */
    onSearchSubmit: function (field, trigger, eOpts) {
        var vm = this.getViewModel();
        var searchValue = vm.getData().search.value;

        var allDashboardStore = vm.get("allDashboards");
        if (searchValue) {
            var filter = {
                "query": searchValue
            };
            allDashboardStore.getProxy().setExtraParam('filter', Ext.JSON.encode(filter));
            allDashboardStore.load();
        } else {
            this.onSearchClear(field);
        }
    },

    /**
     * @param {Ext.form.field.Text} field
     * @param {Ext.form.trigger.Trigger} trigger
     * @param {Object} eOpts
     */
    onSearchClear: function (field, trigger, eOpts) {
        var vm = this.getViewModel();
        // clear store filter
        var allDashboardStore = vm.get("allDashboards");
        allDashboardStore.getProxy().setExtraParam('filter', Ext.JSON.encode([]));
        allDashboardStore.load();
        // reset input
        field.reset();
    }
});
