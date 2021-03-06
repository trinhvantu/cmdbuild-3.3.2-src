Ext.define('CMDBuildUI.view.administration.content.navigationtrees.Tree', {
    extend: 'Ext.tree.Panel',

    requires: [
        'CMDBuildUI.view.administration.content.navigationtrees.TreeController',
        'CMDBuildUI.view.administration.content.navigationtrees.TreeModel'
    ],
    alias: 'widget.administration-content-navigationtrees-tree',
    controller: 'administration-content-navigationtrees-tree',
    viewModel: 'administration-content-navigationtrees-tree',

    viewConfig: {
        markDirty: false,
        animate: false
    },

    bind: {
        store: '{treeStore}'
    },
    ui: 'administration-navigation-tree',

    plugins: CMDBuildUI.util.administration.helper.NavTreeHelper.getViewPlugins(),


    listeners: {
        beforecheckchange: function () {
            return !this.getView().lookupViewModel().get('actions.view');
        },
        checkchange: function (node, checked) {
            function checkParent(node, checked) {
                var parent = node.parentNode;
                if (parent) {
                    parent.set('checked', checked);
                    if (parent.parentNode) {
                        checkParent(parent, checked);
                    }
                }
            }

            function uncheckChild(node, checked) {
                var childrens = node.childNodes;
                Ext.Array.forEach(childrens, function (childNode, i) {
                    childNode.set('checked', checked);
                    childNode.set('showOnlyOne', false);
                    childNode.set('recursionEnabled', false);
                    uncheckChild(childNode, checked);
                });
            }

            if (checked) {
                checkParent(node, checked);
            } else {
                node.set('showOnlyOne', false);
                node.set('recursionEnabled', false);
                uncheckChild(node, checked);
            }
        }
    },

    columns: [{
        xtype: 'treecolumn',
        text: CMDBuildUI.locales.Locales.administration.classes.toolbar.classLabel,
        localized: {
            text: 'CMDBuildUI.locales.Locales.administration.classes.toolbar.classLabel'
        },
        dataIndex: 'text',
        flex: 1
    }, {
        text: CMDBuildUI.locales.Locales.administration.common.strings.filtercql,
        localized: {
            text: 'CMDBuildUI.locales.Locales.administration.common.strings.filtercql'
        },
        dataIndex: 'filter',
        flex: 1,
        editor: 'textfield',
        align: 'left'
    }, {
        xtype: 'checkcolumn',
        text: CMDBuildUI.locales.Locales.administration.common.strings.recursive,
        localized: {
            text: 'CMDBuildUI.locales.Locales.administration.common.strings.recursive'
        },
        dataIndex: 'recursionEnabled',
        width: 100,
        align: 'center',
        renderer: function (value, metaData, record, rowIndex, colIndex, store) {
            if (record.get('domain')) {
                var domain = Ext.getStore('domains.Domains').findRecord('name', record.get('domain'));
                if (domain && domain.get('source') === domain.get('destination')) {
                    return this.defaultRenderer(value, metaData);
                }
            }
            return '';
        },
        listeners: {
            beforecheckchange: function () {
                return !this.getView().lookupViewModel().get('actions.view');
            }
        }


    }]


});