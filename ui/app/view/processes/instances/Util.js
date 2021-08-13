Ext.define('CMDBuildUI.view.processes.instances.Util', {
    singleton: true,

    getTools: function () {
        return [{
            // open tool
            xtype: 'tool',
            itemId: 'opentool',
            reference: 'opentool',
            iconCls: 'x-fa fa-external-link',
            cls: 'management-tool',
            action: 'view',
            hidden: true,
            tooltip: CMDBuildUI.locales.Locales.processes.openactivity,
            autoEl: {
                'data-testid': 'processes-instance-tool-open'
            },
            bind: {
                hidden: '{hiddentools.open}'
            },
            localized: {
                tooltip: 'CMDBuildUI.locales.Locales.processes.openactivity'
            }
        }, {
            // edit tool
            xtype: 'tool',
            itemId: 'editBtn',
            iconCls: 'x-fa fa-pencil',
            cls: 'management-tool',
            hidden: true,
            disabled: true,
            tooltip: CMDBuildUI.locales.Locales.processes.editactivity,
            autoEl: {
                'data-testid': 'processes-instance-tool-edit'
            },
            bind: {
                hidden: '{hiddentools.edit}',
                disabled: '{!basepermissions.edit}'
            },
            localized: {
                tooltip: 'CMDBuildUI.locales.Locales.processes.editactivity'
            }
        }, {
            // delete tool
            xtype: 'tool',
            itemId: 'deleteBtn',
            iconCls: 'x-fa fa-trash',
            cls: 'management-tool',
            hidden: true,
            disabled: true,
            tooltip: CMDBuildUI.locales.Locales.processes.abortprocess,
            autoEl: {
                'data-testid': 'processes-instance-tool-delete'
            },
            bind: {
                hidden: '{hiddentools.delete}',
                disabled: '{!basepermissions.delete}'
            },
            localized: {
                tooltip: 'CMDBuildUI.locales.Locales.processes.abortprocess'
            }
        }, {
            // relation graph
            xtype: 'tool',
            itemId: 'relgraphBtn',
            iconCls: 'x-fa fa-share-alt',
            cls: 'management-tool',
            hidden: true,
            disabled: true,
            tooltip: CMDBuildUI.locales.Locales.relationGraph.openRelationGraph,
            autoEl: {
                'data-testid': 'processes-instance-tool-relgraph'
            },
            bind: {
                hidden: '{hiddentools.relgraph}',
                disabled: '{!basepermissions.relgraph}'
            },
            localized: {
                tooltip: 'CMDBuildUI.locales.Locales.relationGraph.openRelationGraph'
            }
        }, this.getHelpTool()];
    },

    getHelpTool: function() {
        return {
            // help tool
            xtype: 'tool',
            itemId: 'helpBtn',
            iconCls: 'x-fa fa-question-circle',
            cls: 'management-tool no-action',
            hidden: true,
            tooltip: CMDBuildUI.locales.Locales.common.actions.help,
            autoEl: {
                'data-testid': 'processes-instance-tool-help'
            },
            bind: {
                hidden: '{hiddentools.help}'
            },
            localized: {
                tooltip: 'CMDBuildUI.locales.Locales.common.actions.help'
            }
        };
    }
});