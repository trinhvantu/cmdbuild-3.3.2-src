Ext.define('CMDBuildUI.view.administration.components.relationsfilters.Panel', {
    extend: 'CMDBuildUI.view.filters.relations.Panel',

    requires: [
        'CMDBuildUI.view.administration.components.relationsfilters.PanelController',
        'CMDBuildUI.view.administration.components.relationsfilters.PanelModel'
    ],

    alias: 'widget.administration-filters-relations-panel',
    controller: 'administration-filters-relations-panel',
    viewModel: {
        type: 'administration-filters-relations-panel'
    },

    title: CMDBuildUI.locales.Locales.filters.relations,
    layout: 'border',

    items: [{
        xtype: 'panel',
        region: 'center',
        scrollable: true,
        flex: 1,
        items: [{
            xtype: "grid",
            forceFit: true,
            reference: 'domainsgrid',
            itemId: 'domainsgrid',
            sortableColumns: false,
            enableColumnHide: false,
            viewModel: {},
            columns: [{
                text: CMDBuildUI.locales.Locales.filters.description,
                dataIndex: 'description',
                align: 'left',
                localized: {
                    text: 'CMDBuildUI.locales.Locales.filters.description'
                }
            }, {
                text: CMDBuildUI.locales.Locales.filters.type,
                dataIndex: 'destinationDescription',
                align: 'left',
                localized: {
                    text: 'CMDBuildUI.locales.Locales.filters.type'
                }
            }, {
                text: 'CMDBuildUI.locales.Locales.filters.relations',
                localized: {
                    text: 'CMDBuildUI.locales.Locales.filters.relations'
                },
                columns: [{
                    xtype: 'checkcolumn',
                    text: CMDBuildUI.locales.Locales.filters.noone,
                    dataIndex: 'noone',
                    localized: {
                        text: 'CMDBuildUI.locales.Locales.filters.noone'
                    },

                    listeners: {
                        beforecheckchange: function () {
                            return !this.lookupViewModel().get('actions.view');

                        },
                        checkchange: function (column, rowindex, ckecked, record) {
                            var mode;
                            if (ckecked) {
                                mode = CMDBuildUI.model.base.Filter.relationstypes.noone;
                            }
                            record.set("mode", mode);
                        }
                    }
                }, {
                    xtype: 'checkcolumn',
                    text: CMDBuildUI.locales.Locales.filters.any,
                    dataIndex: 'any',
                    localized: {
                        text: 'CMDBuildUI.locales.Locales.filters.any'
                    },
                    listeners: {
                        beforecheckchange: function () {
                            return !this.lookupViewModel().get('actions.view');

                        },
                        checkchange: function (column, rowindex, ckecked, record) {
                            var mode;
                            if (ckecked) {
                                mode = CMDBuildUI.model.base.Filter.relationstypes.any;
                            }
                            record.set("mode", mode);
                        }
                    }
                }, {
                    xtype: 'checkcolumn',
                    text: CMDBuildUI.locales.Locales.filters.fromselection,
                    dataIndex: 'oneof',
                    localized: {
                        text: 'CMDBuildUI.locales.Locales.filters.fromselection'
                    },
                    listeners: {
                        beforecheckchange: function () {
                            return !this.lookupViewModel().get('actions.view');

                        },
                        checkchange: function (column, rowindex, ckecked, record) {
                            var mode;
                            if (ckecked) {
                                mode = CMDBuildUI.model.base.Filter.relationstypes.oneof;
                            }
                            record.set("mode", mode);
                        }
                    }
                }, {
                    xtype: 'checkcolumn',
                    text: CMDBuildUI.locales.Locales.filters.fromfilter,
                    dataIndex: 'fromfilter',
                    localized: {
                        text: 'CMDBuildUI.locales.Locales.filters.fromfilter'
                    },
                    listeners: {
                        beforecheckchange: function () {
                            return !this.lookupViewModel().get('actions.view');

                        },
                        checkchange: function (column, rowindex, ckecked, record) {
                            var mode;
                            if (ckecked) {
                                mode = CMDBuildUI.model.base.Filter.relationstypes.fromfilter;
                            }
                            record.set("mode", mode);
                        }
                    }
                }]
            }],

            bind: {
                store: '{relations}'
            }
        }]
    }, {
        xtype: 'panel',
        layout: 'card',
        hidden: true,
        flex: 1,
        region: 'south',
        reference: 'relselectioncontainer',
        scrollable: true,
        resizable: true
    }],

    localized: {
        title: 'CMDBuildUI.locales.Locales.filters.relations'
    }    
});