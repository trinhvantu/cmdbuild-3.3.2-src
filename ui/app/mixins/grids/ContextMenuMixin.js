Ext.define('CMDBuildUI.mixins.grids.ContextMenuMixin', {
    mixinId: 'grids-context-mixin',

    /**
     * Returns the grid on which apply context menu actions.
     * 
     * @return {Ext.gid.Panel}
     */
    getContextMenuGrid: Ext.emptyFn,

    /**
     * Initialize context menu.
     * 
     * @param {Ext.button.Button} button
     * @param {Boolean} multiselectionEnabled
     */
    initContextMenu: function (button, multiselectionEnabled) {
        var vm = this.lookupViewModel();
        var me = this;

        if (multiselectionEnabled) {
            vm.set("contextmenu.multiselection.enabled", true);
            vm.set("contextmenu.multiselection.text", CMDBuildUI.locales.Locales.common.grid.disablemultiselection);
            vm.set("contextmenu.multiselection.icon", 'x-fa fa-check-square-o');
        } else {
            vm.set("contextmenu.multiselection.text", CMDBuildUI.locales.Locales.common.grid.enamblemultiselection);
            vm.set("contextmenu.multiselection.enabled", false);
            vm.set("contextmenu.multiselection.icon", 'x-fa fa-square-o');
        }
        // get model object
        var objectType = vm.get("objectType"),
            objectTypeName;
        if (this.getObjectTypeName && this.getObjectTypeName()) {
            objectTypeName = this.getObjectTypeName();
        } else {
            objectTypeName = vm.get("objectTypeName");
        }
        var modelItem = CMDBuildUI.util.helper.ModelHelper.getObjectFromName(
            objectTypeName,
            objectType
        );

        // get items
        var menu = [];
        var menuitems = modelItem.contextMenuItems().getRange();
        menuitems.forEach(function (item) {
            if (item.get("active")) {
                var bind;
                switch (item.get("visibility")) {
                    case CMDBuildUI.model.ContextMenuItem.visibilities.one:
                        bind = {
                            disabled: '{contextmenu.disabledvone}'
                        };
                        break;
                    case CMDBuildUI.model.ContextMenuItem.visibilities.many:
                        bind = {
                            disabled: '{contextmenu.disabledvmany}'
                        };
                        break;
                }

                var executeContextMenuScript;
                if (item.get("type") === CMDBuildUI.model.ContextMenuItem.types.custom) {
                    /* jshint ignore:start */
                    var jsfn = Ext.String.format(
                        'executeContextMenuScript = function(records, api) {{0}}',
                        item.get("script")
                    );
                    try {
                        eval(jsfn);
                    } catch (e) {
                        CMDBuildUI.util.Logger.log(
                            "Error on context menu function.",
                            CMDBuildUI.util.Logger.levels.error,
                            null,
                            e
                        );
                        executeContextMenuScript = Ext.emptyFn;
                    }
                    /* jshint ignore:end */
                }

                function handler() {
                    var grid = me.getContextMenuGrid();
                    var selection = grid.getSelection();
                    var api = Ext.apply({
                        _grid: grid
                    }, CMDBuildUI.util.api.Client.getApiForContextMenu());
                    switch (item.get("type")) {
                        case CMDBuildUI.model.ContextMenuItem.types.custom:
                            try {
                                executeContextMenuScript(selection, api);
                            } catch (e) {
                                CMDBuildUI.util.Logger.log(
                                    "Error on context menu script.",
                                    CMDBuildUI.util.Logger.levels.error,
                                    null,
                                    e
                                );
                            }
                            break;
                        case CMDBuildUI.model.ContextMenuItem.types.component:
                            me.openCustomComponent(item, selection, grid);
                            break;
                    }

                }
                switch (item.get("type")) {
                    case CMDBuildUI.model.ContextMenuItem.types.separator:
                        menu.push({
                            xtype: 'menuseparator'
                        });
                        break;
                    case CMDBuildUI.model.ContextMenuItem.types.custom:
                    case CMDBuildUI.model.ContextMenuItem.types.component:
                        menu.push({
                            iconCls: 'x-fa fa-angle-double-right',
                            text: item.get("_label_translation") || item.get("label"),
                            handler: handler,
                            bind: bind
                        });
                        break;
                }
            }
        });

        // add separator if menu is not empty
        if (menu.length) {
            menu.push({
                xtype: 'menuseparator'
            });
        }

        // add views submenu
        var viewsStore = Ext.getStore('views.Views'),
            results = viewsStore.query("sourceClassName", objectTypeName, false, true, true),
            addviewitem = {
                iconCls: 'x-fa fa-table',
                text: CMDBuildUI.locales.Locales.joinviews.createview,
                handler: function() {
                    me.onCreateViewClick(objectTypeName);
                }
            };

        if (results.length) {
            var m = {
                iconCls: 'x-fa fa-table',
                text: CMDBuildUI.locales.Locales.menu.views,
                menu: []
            };
            results.getRange().forEach(function(v) {
                m.menu.push({
                    iconCls: 'x-fa fa-table',
                    text: v.get("_description_translation"),
                    handler: function() {
                        CMDBuildUI.util.Utilities.redirectTo(Ext.String.format(
                            "views/{0}/items",
                            v.getId()
                        ));
                    }
                });
            });
            m.menu.push({
                xtype: 'menuseparator'
            }, addviewitem);
            menu.push(m);
        } else { // TODO: add check on permissions
            menu.push(addviewitem);
        }


        // add bulk update menu item
        if (modelItem.get('_can_bulk_update')) {
            menu.push({
                iconCls: 'x-fa fa-pencil',
                text: CMDBuildUI.locales.Locales.bulkactions.edit,
                handler: function (menuitem, event) {
                    // open popup
                    var popup = CMDBuildUI.util.Utilities.openPopup(
                        null,
                        CMDBuildUI.locales.Locales.bulkactions.edit, {
                            xtype: 'bulkactions-edit-panel',
                            objectType: objectType,
                            objectTypeName: objectTypeName,
                            ownerGrid: me.getContextMenuGrid(),

                            closePopup: function () {
                                popup.destroy();
                            }
                        }
                    );
                },
                bind: bind = {
                    disabled: '{contextmenu.disabledbulkactions}'
                }
            });
        }
        // add bulk delete menu item
        if (modelItem.get('_can_bulk_delete')) {
            menu.push({
                iconCls: 'x-fa fa-trash',
                text: CMDBuildUI.locales.Locales.bulkactions.delete,
                handler: function () {
                    CMDBuildUI.view.bulkactions.Util.delete(me.getContextMenuGrid());
                },
                bind: bind = {
                    disabled: '{contextmenu.disabledbulkactions}'
                }
            });

        }
        // add bulk abort menu item
        if (modelItem.get('_can_bulk_abort')) {
            menu.push({
                iconCls: 'x-fa fa-trash',
                text: CMDBuildUI.locales.Locales.bulkactions.abort,
                handler: function () {
                    CMDBuildUI.view.bulkactions.Util.abort(me.getContextMenuGrid());
                },
                bind: bind = {
                    disabled: '{contextmenu.disabledbulkactions}'
                }
            });

        }

        // add separator if menu is not empty
        if (menu.length) {
            menu.push({
                xtype: 'menuseparator'
            });
        }

        // add enable/disable multi-selection
        menu.push({
            iconCls: 'x-fa fa-square-o',
            text: CMDBuildUI.locales.Locales.common.grid.enamblemultiselection,
            handler: function (menuitem, eOpts) {
                me.onMultiselectionChange(menuitem, eOpts);
            },
            bind: {
                text: '{contextmenu.multiselection.text}',
                iconCls: '{contextmenu.multiselection.icon}'
            }
        });

        // add import/export actions
        if (modelItem.getImportExportTemplates) {
            modelItem.getAllTemplatesForImportExport().then(function (templates) {
                var btnmenu = button.getMenu();
                if (templates.import.length || templates.export.length) {
                    btnmenu.add({
                        xtype: 'menuseparator'
                    });
                }
                if (templates.import.length) {
                    btnmenu.add({
                        iconCls: 'x-fa fa-upload',
                        text: CMDBuildUI.locales.Locales.common.grid.import,
                        handler: function (menuitem, eOpts) {
                            me.openImportPopup(modelItem, templates.import);
                        }
                    });
                }
                if (templates.export.length) {
                    btnmenu.add({
                        iconCls: 'x-fa fa-download',
                        text: CMDBuildUI.locales.Locales.common.grid.export,
                        handler: function (menuitem, eOpts) {
                            me.openExportPopup(modelItem, templates.export);
                        }
                    });
                }
            });
        }

        // create menu
        button.setMenu({
            xtype: 'menu',
            items: menu,
            listeners: {
                show: function () {
                    me.onContextMenuShow();
                }
            }
        });
    },

    onContextMenuShow: function () {
        var grid = this.getContextMenuGrid();

        // break context menu init if grid is empty
        if (!grid) {
            CMDBuildUI.util.Logger.log(
                Ext.String.format("getContextMenuGrid not implemented for {0}.", this.getId()),
                CMDBuildUI.util.Logger.levels.warn
            );
            return;
        }

        var vm = this.getViewModel();
        var selected = grid.getSelection().length;

        if (selected) {
            vm.set("contextmenu.disabledvone", selected > 1);
            vm.set("contextmenu.disabledvmany", false);
            vm.set("contextmenu.disabledbulkactions", selected < 2 && !grid.isSelectAllPressed);
        } else {
            vm.set("contextmenu.disabledvone", true);
            vm.set("contextmenu.disabledvmany", true);
            vm.set("contextmenu.disabledbulkactions", !grid.isSelectAllPressed);
        }
    },

    /**
     * 
     * @param {Ext.menu.Item} menuitem 
     * @param {Object} eOpts 
     */
    onMultiselectionChange: function (menuitem, eOpts) {
        var me = this;
        var vm = menuitem.lookupViewModel();
        var grid = this.getContextMenuGrid();
        grid.setSelection(null);

        if (grid.isMultiSelectionEnabled()) {
            // set action variables
            vm.set("contextmenu.multiselection.enabled", false);
            vm.set("contextmenu.multiselection.text", CMDBuildUI.locales.Locales.common.grid.enamblemultiselection);
            vm.set("contextmenu.multiselection.icon", 'x-fa fa-square-o');

            grid.getSelectionModel().setSelectionMode("SINGLE");
            grid.getSelectionModel().excludeToggleOnColumn = null;
            grid.selModel.column.hide();
        } else {
            // set action variables
            vm.set("contextmenu.multiselection.enabled", true);
            vm.set("contextmenu.multiselection.text", CMDBuildUI.locales.Locales.common.grid.disablemultiselection);
            vm.set("contextmenu.multiselection.icon", 'x-fa fa-check-square-o');

            grid.getSelectionModel().setSelectionMode("MULTI");
            grid.getSelectionModel().excludeToggleOnColumn = 1;
            grid.selModel.column.show();
        }
    },

    /**
     * 
     * @param {CMDBuildUI.model.classes.Class} item 
     * @param {CMDBuildUI.model.importexports.Template[]} templates 
     */
    openImportPopup: function (item, templates) {
        var grid = this.getContextMenuGrid();
        var popup = CMDBuildUI.util.Utilities.openPopup(
            null,
            CMDBuildUI.locales.Locales.common.grid.import, {
                xtype: "importexport-import",
                templates: templates,
                object: item,
                closePopup: function () {
                    popup.close();
                },
                refreshGrid: function () {
                    grid.getStore().load();
                }
            }
        );
    },

    /**
     * 
     * @param {CMDBuildUI.model.classes.Class} item 
     * @param {CMDBuildUI.model.importexports.Template[]} templates 
     */
    openExportPopup: function (item, templates) {
        var popup = CMDBuildUI.util.Utilities.openPopup(
            null,
            CMDBuildUI.locales.Locales.common.grid.export, {
                xtype: "importexport-export",
                templates: templates,
                object: item,
                filter: this.getContextMenuGrid().getStore().getAdvancedFilter().encode(),
                closePopup: function () {
                    popup.close();
                }
            }
        );
    },

    privates: {
        /**
         * 
         * @param {CMDBuildUI.model.ContextMenuItem} item 
         * @param {CMDBuildUI.model.classes.Card[]|CMDBuildUI.model.processes.Instance[]} selection 
         */
        openCustomComponent: function (item, selection, grid) {
            if (item) {
                Ext.require(item.get("jscomponent"), function () {
                    var popup;
                    // create widget configuration
                    var config = {
                        xtype: item.get("alias").replace("widget.", ""),
                        selection: selection,
                        ownerGrid: grid,
                        listeners: {
                            /**
                             * Custom event to close popup directly from widget
                             */
                            popupclose: function (eOpts) {
                                popup.close();
                            }
                        }
                    };

                    // custom panel listeners
                    var listeners = {
                        /**
                         * @param {Ext.panel.Panel} panel
                         * @param {Object} eOpts
                         */
                        beforeclose: function (panel, eOpts) {
                            panel.removeAll(true);
                        }
                    };
                    // open popup
                    popup = CMDBuildUI.util.Utilities.openPopup(
                        null,
                        item.get("_label_translation") || item.get("label"),
                        config,
                        listeners
                    );
                });
            }
        },

        /**
         * Create view click
         * 
         * @param {String} objectTypeName
         */
        onCreateViewClick: function(objectTypeName) {
            var theView = Ext.create("CMDBuildUI.model.views.JoinView", {
                masterClass: objectTypeName,
                masterClassAlias: objectTypeName,
                type: CMDBuildUI.model.views.View.types.join,
                shared: false
            });
            var popup = CMDBuildUI.util.Utilities.openPopup(
                null,
                CMDBuildUI.locales.Locales.filters.createviewfromclass, {
                    xtype: 'joinviews-configuration-main',
                    viewModel: {
                        data: {
                            uiContext: 'management',
                            theView: theView
                        }
                    },
                    listeners: {
                        saved: function(mode, record, operation, eOpts) {
                            // add item on views store
                            var viewsStore = Ext.getStore('views.Views'),
                                storerecord = viewsStore.add(record.getData());

                            // add item on navigation menu
                            var nav = CMDBuildUI.util.Navigation.getManagementNavigation();
                            if (nav) {
                                var store = nav.getStore();
                                var allitems = store.findNode('allitemsfolder', 'root');
                                if (!allitems) {
                                    allitems = store.getRootNode().appendChild(CMDBuildUI.util.MenuStoreBuilder.getAllItemsNodeDef());
                                }
                                var allviews = allitems.findChild('allitemsfolder', CMDBuildUI.model.menu.MenuItem.types.view);
                                if (!allviews) {
                                    allviews = allitems.appendChild(CMDBuildUI.util.MenuStoreBuilder.getAllViewsNodeDef());
                                }
                                allviews.appendChild(CMDBuildUI.util.MenuStoreBuilder.getRecordsAsList(
                                    storerecord,
                                    CMDBuildUI.model.menu.MenuItem.types.view
                                ));
                            }

                            // redirect to the new view
                            CMDBuildUI.util.Utilities.redirectTo(Ext.String.format(
                                "views/{0}/items",
                                record.getId()
                            ));

                            // close popup
                            popup.close();
                        },
                        cancel: function() {
                            popup.close();
                        }
                    }
                }
            );
        }
    }
});