Ext.define('CMDBuildUI.view.administration.content.groupsandpermissions.tabitems.permissions.PermissionsController', {

    requires: [
        'CMDBuildUI.util.administration.helper.TabPanelHelper'
    ],

    mixins: [
        'CMDBuildUI.view.administration.content.groupsandpermissions.tabitems.permissions.PermissionsMixin'
    ],

    extend: 'Ext.app.ViewController',
    alias: 'controller.administration-content-groupsandpermissions-tabitems-permissions-permissions',
    control: {
        '#': {
            beforerender: "onBeforeRender",
            tabchange: 'onTabChage'
        },
        '#saveBtn': {
            click: 'onSaveBtnClick'
        },
        '#cancelBtn': {
            click: 'onCancelBtnClick'
        }
    },

    /**
     * @param {CMDBuildUI.view.administration.content.groupsandpermissions.TabPanel} view
     */
    onBeforeRender: function (view) {
        var vm = this.getViewModel();

        var currentSubTabIndex = this.getView().up('administration-content').getViewModel().get('activeTabs.permissions') || 0;
        var tabPanelHelper = CMDBuildUI.util.administration.helper.TabPanelHelper;
        tabPanelHelper.addTab(view, "classes", CMDBuildUI.locales.Locales.administration.navigation.classes, [{
            xtype: 'administration-content-groupsandpermissions-tabitems-permissions-tabitems-classes-classes',
            autoScroll: true
        }], 0, {}, {
            objectType: CMDBuildUI.model.menu.MenuItem.types.klass
        });

        tabPanelHelper.addTab(view, "processes", CMDBuildUI.locales.Locales.administration.navigation.processes, [{
            xtype: 'administration-content-groupsandpermissions-tabitems-permissions-tabitems-processes-processes'
        }], 1, {}, {
            objectType: 'process'
        });

        tabPanelHelper.addTab(view, "views", CMDBuildUI.locales.Locales.administration.navigation.views, [{
            xtype: 'administration-content-groupsandpermissions-tabitems-permissions-tabitems-views-views'
        }], 2, {}, {
            objectType: CMDBuildUI.model.menu.MenuItem.types.view
        });

        tabPanelHelper.addTab(view, "searchFilters", CMDBuildUI.locales.Locales.administration.navigation.searchfilters, [{
            xtype: 'administration-content-groupsandpermissions-tabitems-permissions-tabitems-filters-filters'
        }], 3, {}, {
            objectType: CMDBuildUI.model.menu.MenuItem.types.searchfilter
        });

        tabPanelHelper.addTab(view, "dashboards", CMDBuildUI.locales.Locales.administration.navigation.dashboards, [{
            xtype: 'administration-content-groupsandpermissions-tabitems-permissions-tabitems-dashboards-dashboards'
        }], 4, {}, {
            objectType: CMDBuildUI.model.menu.MenuItem.types.dashboard
        });

        tabPanelHelper.addTab(view, "reports", CMDBuildUI.locales.Locales.administration.navigation.reports, [{
            xtype: 'administration-content-groupsandpermissions-tabitems-permissions-tabitems-reports-reports'
        }], 5, {}, {
            objectType: CMDBuildUI.model.menu.MenuItem.types.report
        });

        tabPanelHelper.addTab(view, "custompages", CMDBuildUI.locales.Locales.administration.navigation.custompages, [{
            xtype: 'administration-content-groupsandpermissions-tabitems-permissions-tabitems-custompages-custompages'
        }], 6, {}, {
            objectType: CMDBuildUI.model.menu.MenuItem.types.custompage
        });

        tabPanelHelper.addTab(view, "etltemplate", CMDBuildUI.locales.Locales.administration.navigation.importexports, [{
            xtype: 'administration-content-groupsandpermissions-tabitems-permissions-tabitems-importexports-importexports'
        }], 7, {}, {
            objectType: CMDBuildUI.model.administration.MenuItem.types.importexport
        });

        tabPanelHelper.addTab(view, "other", CMDBuildUI.locales.Locales.administration.groupandpermissions.texts.otherpermissions, [{
            xtype: 'administration-content-groupsandpermissions-tabitems-permissions-tabitems-other-other'
        }], 8, {}, {
            objectType: CMDBuildUI.model.administration.MenuItem.types.other
        });

        vm.set("activeTab", currentSubTabIndex);
        view.setActiveTab(currentSubTabIndex);

    },

    /**
     * @param {CMDBuildUI.view.administration.content.groupsandpermissions.TabPanel} view
     * @param {Ext.Component} newtab
     * @param {Ext.Component} oldtab
     * @param {Object} eOpts
     */
    onTabChage: function (view, newtab, oldtab, eOpts) {
        var me = this;
        var vm = this.getViewModel();
        vm.set('objectType', newtab.reference);
        CMDBuildUI.util.administration.helper.TabPanelHelper.onTabChage('activeTabs.permissions', this, view, newtab, oldtab, eOpts);


        var grantsStore = Ext.getStore('groups.Grants');
        var proxyUrl = CMDBuildUI.util.administration.helper.ApiHelper.server.getRoleGrantsUrl(vm.get('theGroup._id'));
        if (vm.get('theGroup').crudState === 'C') {
            return false;
        }
        var chainedStore = vm.getStore('grantsChainedStore');
        me.setCopyButton(newtab, chainedStore);

        grantsStore.getProxy().setUrl(proxyUrl);
        grantsStore.load();
        chainedStore.clearFilter();
        chainedStore.addFilter([function (record) {
            if (newtab.config.objectType !== 'etltemplate') {
                return record.get('objectType') === newtab.config.objectType;
            } else {
                if (['etltemplate', 'etlgate'].indexOf(record.get('objectType')) > -1) {
                    var originalRecord = Ext.getStore('importexports.Templates').findRecord('_id', record.get('objectTypeName')) || Ext.getStore('importexports.Gates').findRecord('_id', record.get('objectTypeName'));
                    if (originalRecord) {
                        return true;
                    }
                }
                return false;
            }
        }]);
        chainedStore.config = {
            relatedStore: newtab.config.relatedStore,
            objectType: newtab.config.objectType,
            roleId: vm.get('theGroup._id')
        };
        if (newtab.reference !== 'other') {
            newtab.down('grid').setStore(chainedStore);
        }
        if (oldtab) {
            oldtab.down('#searchtext').setValue(null);
        }

    },
    setCopyButton: function (view, currentGrantsStore) {
        var me = this;
        var copyFromButton = view.down('#copyFrom');
        copyFromButton.menu.removeAll();

        Ext.getStore('groups.Groups').load({
            callback: function (items) {
                Ext.Array.forEach(items, function (element, index) {
                    if (copyFromButton && copyFromButton.menu && element.get('active') && !element.get('_rp_data_all_write')) {
                        copyFromButton.menu.add({
                            text: element.get('description'),
                            iconCls: 'x-fa fa-users',
                            listeners: {
                                click: function () {
                                    me.cloneFrom(element, view, currentGrantsStore);
                                }
                            }
                        });
                    }
                });
            }
        });
    },
    cloneFrom: function (group, view, currentGrantsStore) {

        var grantsStore = Ext.create('Ext.data.Store', {
            extend: 'CMDBuildUI.store.Base',
            requires: [
                'CMDBuildUI.store.Base',
                'CMDBuildUI.model.users.Grant'
            ],
            model: 'CMDBuildUI.model.users.Grant',
            pageSize: 0,
            autoLoad: false,
            autoDestroy: true
        });

        var proxyUrl = CMDBuildUI.util.administration.helper.ApiHelper.server.getRoleGrantsUrl(group.get('_id'));

        grantsStore.getProxy().type = 'baseproxy';
        grantsStore.getModel().getProxy().setUrl(proxyUrl);
        grantsStore.load({
            callback: function (items) {
                var grantsToRemove = currentGrantsStore.getRange().filter(function (item) {
                    return item.get('objectType') === view.config.objectType;
                });

                currentGrantsStore.remove(grantsToRemove);
                currentGrantsStore.add(items.filter(function (item, index) {
                    item.crudState = 'U';
                    return item.get('objectType') === view.config.objectType;
                }));
            }
        });

    },
    /**
     * @param {Ext.button.Button} button
     * @param {Event} e
     * @param {Object} eOpts
     */
    onEditBtnClick: function (button, e, eOpts) {
        var vm = this.getViewModel('administration-content-groupsandpermissions-view');
        vm.set('actions.view', false);
        vm.set('actions.edit', true);
        vm.set('actions.add', false);
    },

    /**
     * @param {Ext.button.Button} button
     * @param {Event} e
     * @param {Object} eOpts
     */
    onSaveBtnClick: function (button, e, eOpts) {
        if (this.getView().getActiveTab().reference === 'other') {
            this.saveOtherTab(button);
        } else {
            this.saveRegularGrant(button);
        }
    },

    /**
     * @param {Ext.button.Button} button
     * @param {Event} e
     * @param {Object} eOpts
     */
    onCancelBtnClick: function (button, e, eOpts) {
        button.setDisabled(true);
        Ext.GlobalEvents.fireEventArgs("showadministrationcontentmask", [true]);
        var me = this;
        var view = me.getView();
        var vm = view.getViewModel();
        vm.setFormMode(CMDBuildUI.util.administration.helper.FormHelper.formActions.view);
        try {
            view.down('grid').getStore().source.load();
        } catch (error) {

            view.getActiveTab().down('grid').getStore().rejectChanges();
        }
        me.toggleEnablePermissionsTabs();
        me.toggleEnableTabs();
        button.setDisabled(false);
        Ext.GlobalEvents.fireEventArgs("showadministrationcontentmask", [false]);
    },
    privates: {
        saveOtherTab: function (button) {
            button.setDisabled(true);
            Ext.GlobalEvents.fireEventArgs("showadministrationcontentmask", [true]);
            var me = this;
            var view = me.getView();
            var vm = view.getViewModel();
            var otherGrid = view.getActiveTab().down('grid');
            var theGroup = vm.get('theGroup');
            otherGrid.getStore().each(function (item) {
                var value = item.get('mode') === CMDBuildUI.model.users.Grant.grantType.read;
                var objectType = item.get('objectType');
                if (objectType === '_rp_calendar_access') {
                    theGroup.set('_rp_calendar_event_create', item.get('modeTypeWriteOther'));
                }
                theGroup.set(objectType, value);
            });
            delete theGroup.data.system;
            Ext.apply(theGroup.data, theGroup.getAssociatedData());
            theGroup.save({
                success: function (record, operation) {
                    me.toggleEnablePermissionsTabs();
                    me.toggleEnableTabs();
                    vm.setFormMode(CMDBuildUI.util.administration.helper.FormHelper.formActions.view);
                },
                callback: function (record, reason) {
                    if (button.el.dom) {
                        button.setDisabled(false);
                    }
                    view.getActiveTab().down('grid').getView().refresh();
                    Ext.GlobalEvents.fireEventArgs("showadministrationcontentmask", [false]);
                }
            });
        },
        saveRegularGrant: function (button) {
            button.setDisabled(true);
            Ext.GlobalEvents.fireEventArgs("showadministrationcontentmask", [true]);
            var me = this;
            var vm = this.getViewModel();
            var store = Ext.getStore('groups.Grants');
            var data = store.getData().items;
            var jsonData = [];
            Ext.Array.forEach(data, function (element) {
                if (element.crudState === 'U') {
                    if (element.get('attributePrivileges') === null) {
                        element.set('attributePrivileges', {});
                    }
                    jsonData.push(element.getData());
                }
            });
            var grid = button.up('administration-content-groupsandpermissions-tabitems-permissions-permissions').down('grid');
            Ext.Ajax.request({
                url: CMDBuildUI.util.administration.helper.ApiHelper.server.getRoleGrantsPostUrl(vm.get('theGroup._id')),
                method: 'POST',
                jsonData: jsonData,
                callback: function () {
                    store.load();
                    me.toggleEnablePermissionsTabs();
                    me.toggleEnableTabs();
                    var columns = grid.getColumnManager().getColumns();
                    Ext.Array.forEach(columns, function (item) {
                        if (item.xtype === 'checkcolumn') {
                            item.setHeaderCheckbox(false);
                            item.sortable = true;
                        }
                    });
                    vm.set('actions.view', true);
                    vm.set('actions.edit', false);
                    vm.set('actions.add', false);
                    button.setDisabled(false);
                    Ext.GlobalEvents.fireEventArgs("showadministrationcontentmask", [false, true]);
                }
            });
        }
    }
});