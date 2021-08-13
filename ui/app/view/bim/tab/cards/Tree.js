
Ext.define('CMDBuildUI.view.bim.tab.cards.Tree', {
    extend: 'Ext.tree.Panel',

    requires: [
        'CMDBuildUI.view.bim.tab.cards.TreeController',
        'CMDBuildUI.view.bim.tab.cards.TreeModel'
    ],

    alias: 'widget.bim-tab-cards-tree',

    controller: 'bim-tab-cards-tree',

    viewModel: {
        type: 'bim-tab-cards-tree'
    },

    //the store is binded by it's parent
    root: {
        text: CMDBuildUI.locales.Locales.bim.tree.root,
        children: []
    },

    rootVisible: false,
    layout: 'fit',
    config: {
        selectedId: {
            $value: undefined,
            evented: true
        },
        hiddenNodes: {
            $value: null,
            evented: true
        }
    },

    reference: 'bim-tab-cards-tree',

    columns: [{
        xtype: 'treecolumn',
        text: CMDBuildUI.locales.Locales.bim.tree.columnLabel,
        localized: {
            text: 'CMDBuildUI.locales.Locales.bim.tree.columnLabel'
        },
        dataIndex: 'text',
        flex: 1
    }, {
        xtype: 'actioncolumn',
        arrowTree: 'arrowTree',
        align: 'center',
        tooltip: CMDBuildUI.locales.Locales.bim.tree.arrowTooltip,
        localized: {
            tooltip: 'CMDBuildUI.locales.Locales.bim.tree.arrowTooltip'
        },
        menuDisabled: true,
        width: 30,
        getClass: function (v, meta, row, rowIndex, colIndex, store) {
            var leaf = row.get('leaf');

            if (leaf || row.get('ifcName') == 'IfcSpace') {
                return 'x-fa fa-arrow-right arrowTree';
            }
            return null;
        },
        handler: function (v, rowIndex, colIndex, item, e, record, row) {
            var object = record.get('object');
            CMDBuildUI.util.bim.Viewer.select(object);
        }

    }]

    /**
     * NOTE:
     * The tree is popolated in the controller. The function wich popolates the tree
     * is called after a global event is fired
     */
});
