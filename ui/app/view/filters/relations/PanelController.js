Ext.define('CMDBuildUI.view.filters.relations.PanelController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.filters-relations-panel',

    control: {
        '#domainsgrid': {
            rowclick: 'onDomainsGridRowClick'
        }
    },


    onDomainsGridRowClick: function (grid, record, element, rowIndex, e, eOpts) {
        var me = this;
        var container = me.lookup("relselectioncontainer");
        switch (record.get("mode")) {
            case CMDBuildUI.model.base.Filter.relationstypes.oneof:
                this.showCardsList(container, record);
                break;
            case CMDBuildUI.model.base.Filter.relationstypes.fromfilter:
                this.showFilterPanel(container, record);
                break;
            default:
                container.hide();
        }
    },

    /**
     * 
     * @param {*} field 
     * @param {*} trigger 
     * @param {*} eOpts 
     */
    onSearchSubmit: function (field, trigger, eOpts) {
        this.handleQueryFilter(field);
    },

    /**
     * 
     * @param {*} field 
     * @param {*} trigger 
     * @param {*} eOpts 
     */
    onSearchClear: function (field, trigger, eOpts) {
        field.reset();
        this.handleQueryFilter(field);
    },

    /**
     * 
     * @param {*} field 
     * @param {*} event 
     * @param {*} dom 
     * @param {*} eOpts 
     */
    onSearchSpecialKey: function (field, event, dom, eOpts) {
        if (event.getKey() == event.ENTER) {
            this.handleQueryFilter(field);
        }
    },

    /**
     * 
     * @param {*} field 
     */
    handleQueryFilter: function (field) {
        var searchTerm = field.getValue();
        var grid = field.getGrid();
        var store = grid.getStore();

        if (searchTerm) {
            // add filter
            store.getAdvancedFilter().addQueryFilter(searchTerm);
        } else {
            //remove filter
            store.getAdvancedFilter().clearQueryFilter();
        }
        store.load();
    },

    privates: {
        /**
         * 
         * @param {CMDBuildUI.model.domains.Filter} record 
         */
        getGridId: function(record) {
            return Ext.String.format("grid{0}{1}", record.get("domain"), record.get("direction"));
        },

        /**
         * 
         * @param {CMDBuildUI.model.domains.Filter} record 
         */
        getFilterPanelId: function(record) {
            return Ext.String.format("filter{0}{1}", record.get("domain"), record.get("direction"));
        },

        /**
         * Show the grid for the 'one of' selection.
         * @param {Ext.panel.Panel} container 
         * @param {CMDBuildUI.model.domains.Filter} record 
         */
        showCardsList: function(container, record) {
            var me = this;
            var gridid = this.getGridId(record);
            var activeitem = me.lookup(gridid);
            if (!activeitem) {
                var objectType = record.get("destinationIsProcess") ? CMDBuildUI.util.helper.ModelHelper.objecttypes.process : CMDBuildUI.util.helper.ModelHelper.objecttypes.klass,
                    objectTypeName = record.get("destination"),
                    isAdministration = me.getViewModel().get('isAdministrationModule');

                CMDBuildUI.util.helper.GridHelper.getColumnsForType(
                    objectType,
                    objectTypeName, {
                        allowFilter: true
                    }
                ).then(function (columns) {
                    var modelName = CMDBuildUI.util.helper.ModelHelper.getModelName(objectType, objectTypeName);
                    var grid = container.add({
                        xtype: 'grid',
                        // Top bar
                        tbar: [{
                            xtype: 'textfield',
                            name: 'search',
                            width: 250,
                            emptyText: CMDBuildUI.locales.Locales.common.actions.searchtext,
                            cls: isAdministration ? 'administration-input' : 'management-input',
                            autoEl: {
                                'data-testid': 'filters-relations-panel-searchtext'
                            },
                            listeners: {
                                specialkey: 'onSearchSpecialKey'
                            },
                            triggers: {
                                search: {
                                    cls: Ext.baseCSSPrefix + 'form-search-trigger',
                                    handler: 'onSearchSubmit'
                                },
                                clear: {
                                    cls: Ext.baseCSSPrefix + 'form-clear-trigger',
                                    handler: 'onSearchClear'
                                }
                            },
                            localized: {
                                emptyText: "CMDBuildUI.locales.Locales.common.actions.searchtext"
                            },
                            gridid: gridid,
                            getGrid: function () {
                                return this.up("#" + this.gridid); // return this.getRefOwner().getRefOwner();
                            }
                        }],
                        columns: columns,
                        forceFit: true,
                        loadMask: true,
                        plugins: [
                            'gridfilters'
                        ],
                        itemId: gridid,
                        reference: gridid,
                        selModel: {
                            selType: 'checkboxmodel',
                            mode: 'SIMPLE'
                        },
                        store: {
                            type: record.get("destinationIsProcess") ? 'processes-instances' : 'classes-cards',
                            model: modelName,
                            autoLoad: true,
                            autoDestroy: true,
                            listeners: {
                                load: function (store, records) {
                                    var selected = [];
                                    if (record.get("cards") && !Ext.isEmpty(record.get("cards"))) {
                                        record.get("cards").forEach(function (s) {
                                            var rec = store.getById(s.id);
                                            if (rec) {
                                                selected.push(rec);
                                            }
                                        });
                                    }
                                    me.lookup(gridid).setSelection(selected);
                                }
                            }
                        },
                        listeners: {
                            selectionchange: function (g, selected, eOpts) {
                                var sel = [];
                                selected.forEach(function (s) {
                                    sel.push({
                                        className: s.get("_type"),
                                        id: s.getId()
                                    });
                                });
                                record.set("cards", sel);
                            }
                        }
                    });
                    grid.getStore().getAdvancedFilter(); // this row fix #3531
                    // set the item as active item in container
                    container.setActiveItem(gridid);
                });
            } else {
                // set the item as active item in container
                container.setActiveItem(gridid);
                container.getLayout().getActiveItem().filters.clearFilters();
            }
            container.show();
        },

        /**
         * Show the filter for the 'from selection' option.
         * @param {Ext.panel.Panel} container 
         * @param {CMDBuildUI.model.domains.Filter} record 
         */
        showFilterPanel: function(container, record) {
            var panelid = this.getFilterPanelId(record);
            var activeitem = this.lookup(panelid);
            if (!activeitem) {
                var objectType = record.get("destinationIsProcess") ? 
                        CMDBuildUI.util.helper.ModelHelper.objecttypes.process : 
                        CMDBuildUI.util.helper.ModelHelper.objecttypes.klass,
                    objectTypeName = record.get("destination");
                container.add({
                    xtype: 'filters-attributes-panel',
                    allowInputParameter: false,
                    itemId: panelid,
                    reference: panelid,
                    header: false,
                    viewModel: {
                        data: {
                            objectType: objectType,
                            objectTypeName: objectTypeName
                        },
                        links: {
                            theFilter: {
                                type: 'CMDBuildUI.model.base.Filter',
                                create: {
                                    configuration: {
                                        attribute: record.get("filter")
                                    }
                                }
                            }
                        }
                    }
                });
            }
            container.setActiveItem(panelid);
            container.show();
        }
    }
});