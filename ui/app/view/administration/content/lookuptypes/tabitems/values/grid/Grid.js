Ext.define('CMDBuildUI.view.administration.content.lookuptypes.tabitems.values.grid.Grid', {
    extend: 'Ext.grid.Panel',

    requires: [
        'CMDBuildUI.view.administration.content.lookuptypes.tabitems.values.grid.GridController',
        'CMDBuildUI.view.administration.content.lookuptypes.tabitems.values.grid.GridModel',

        // plugins
        'Ext.grid.filters.Filters',
        'CMDBuildUI.components.grid.plugin.FormInRowWidget'
    ],

    alias: 'widget.administration-content-lookuptypes-tabitems-values-grid-grid',
    controller: 'administration-content-lookuptypes-tabitems-values-grid-grid',
    viewModel: {
        type: 'administration-content-lookuptypes-tabitems-values-grid-grid'
    },
    bind: {
        store: '{allValues}',
        selection: '{selected}'
    },
    reference: 'lookupValuesGrid',
    itemId: 'lookupValuesGrid',
    listeners: {
        rowdblclick: function (row, record, element, rowIndex, e, eOpts) {
            var container = Ext.getCmp(CMDBuildUI.view.administration.DetailsWindow.elementId) || Ext.create(CMDBuildUI.view.administration.DetailsWindow);
            container.removeAll();
            var proxy = CMDBuildUI.model.lookups.Lookup.getProxy();            
            proxy.setUrl(Ext.String.format("/lookup_types/{0}/values", CMDBuildUI.util.Utilities.stringToHex(record.get('_type'))));
            var lookupTypeView = this.up('administration-content-lookuptypes-view');
            var parentLookupValues = lookupTypeView && lookupTypeView.getViewModel().getStore('parentLookupsStore').getData();
            container.add({
                xtype: 'administration-content-lookuptypes-tabitems-values-card',
                viewModel: {
                    links: {
                        theValue: {
                            type: 'CMDBuildUI.model.lookups.Lookup',
                            id: record.getId()
                        }
                    },
                    data: {
                        actions: {
                            edit: true,
                            add: false,
                            view: false
                        },
                        parentLookupValues: parentLookupValues,
                        lookupTypeName: record.get('_type'),
                        valueId: record.getId(),
                        values: row.grid.getStore().getRange(),
                        title: Ext.String.format('{0} - {1} - {2}',
                            record.get('_type'),
                            CMDBuildUI.locales.Locales.administration.lookuptypes.strings.values,
                            record.get('name')
                        ),
                        grid: row.grid
                    }
                }
            });
        }
    },
    columns: [{
        text: CMDBuildUI.locales.Locales.administration.common.labels.code,
        localized: {
            text: 'CMDBuildUI.locales.Locales.administration.common.labels.code'
        },
        dataIndex: 'code',
        align: 'left'
    }, {
        text: CMDBuildUI.locales.Locales.administration.common.labels.description,
        localized: {
            text: 'CMDBuildUI.locales.Locales.administration.common.labels.description'
        },
        dataIndex: 'description',
        align: 'left'
    }, {
        text: CMDBuildUI.locales.Locales.administration.common.labels.textcolor,
        localized: {
            text: 'CMDBuildUI.locales.Locales.administration.common.labels.textcolor'
        },
        dataIndex: 'text_color',
        cls: 'actioncolumn-with-border',
        xtype: 'actioncolumn',
        align: 'center',
        items: [{
            iconCls: 'actioncolumn-with-border x-fa fa-square',
            getTip: function (value, metadata, record, row, col, store) {
                if (!value.length) {
                    value = '#30373D'; // TODO: set global var??
                } else {
                    if (!Ext.String.startsWith(value, '#')) {
                        value = '#' + value;
                    }
                }
                metadata.style = Ext.String.format('color:{0}', value);
                return value;
            }
        }]
    }, {
        text: CMDBuildUI.locales.Locales.administration.common.labels.active,
        localized: {
            text: 'CMDBuildUI.locales.Locales.administration.common.labels.active'
        },
        dataIndex: 'active',
        align: 'center',
        xtype: 'checkcolumn',
        disabled: true
    }, {
        text: CMDBuildUI.locales.Locales.administration.lookuptypes.strings.parentdescription,
        localized: {
            text: 'CMDBuildUI.locales.Locales.administration.lookuptypes.strings.parentdescription'
        },
        dataIndex: 'parent_id',
        align: 'left',
        renderer: function (value, cell, record, rowIndex, colIndex, store, grid) {
            if (value) {
                var parentStore = grid.lookupViewModel().get('parentLookupsStore');
                return parentStore.findRecord('_id', value).get('description');
            }
            return '';
        }
    }],


    viewConfig: {
        plugins: [{
            ptype: 'gridviewdragdrop',
            dragText: CMDBuildUI.locales.Locales.administration.attributes.strings.draganddrop,
            localized: {
                dragText: 'CMDBuildUI.locales.Locales.administration.attributes.strings.draganddrop'
            },
            containerScroll: true,
            pluginId: 'gridviewdragdrop'
        }]
    },

    plugins: [{
        ptype: 'administration-forminrowwidget',
        pluginId: 'administration-forminrowwidget',
        removeWidgetOnCollapse: true,
        widget: {
            xtype: 'administration-content-lookuptypes-tabitems-values-card-viewinrow',
            ui: 'administration-tabandtools',
            autoHeight: true,
            bind: {
                theValue: '{selected}'
            },
            viewModel: {}
        }
    }],

    autoEl: {
        'data-testid': 'administration-content-lookuptypes-tabitems-values-grid'
    },

    config: {
        objectTypeName: null,
        allowFilter: true,
        showAddButton: true,
        selected: null
    },

    forceFit: true,
    loadMask: true,

    selModel: {
        pruneRemoved: false // See https://docs.sencha.com/extjs/6.2.0/classic/Ext.selection.Model.html#cfg-pruneRemoved
    },
    labelWidth: "auto",
    tbar: [{
        xtype: 'button',
        text: CMDBuildUI.locales.Locales.administration.lookuptypes.strings.addvalue,
        localized: {
            text: 'CMDBuildUI.locales.Locales.administration.lookuptypes.strings.addvalue'
        },
        reference: 'addlookupvalue',
        itemId: 'addlookupvalue',
        iconCls: 'x-fa fa-plus',
        ui: 'administration-action',

        bind: {
            disabled: '{!toolAction._canAdd}',
            hidden: '{newButtonHidden}'
        }
    }, {
        xtype: 'localsearchfield',
        gridItemId: '#lookupValuesGrid'
    }, {
        xtype: 'tbfill'
    }]
});