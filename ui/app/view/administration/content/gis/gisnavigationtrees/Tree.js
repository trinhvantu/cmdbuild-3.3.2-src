Ext.define('CMDBuildUI.view.administration.content.gisnavigationtrees.Tree', {
    extend: 'Ext.tree.Panel',

    requires: [
        'CMDBuildUI.view.administration.content.gisnavigationtrees.TreeController',
        'CMDBuildUI.view.administration.content.gisnavigationtrees.TreeModel'
    ],
    alias: 'widget.administration-content-gisnavigationtrees-tree',
    controller: 'administration-content-gisnavigationtrees-tree',
    itemId: 'domainsClassTree',
    viewModel: 'administration-content-gisnavigationtrees-tree',
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
            function checkParent(_node, _checked) {
                var parent = _node.parentNode;
                if (parent) {
                    parent.set('checked', _checked);
                    if (parent.parentNode) {
                        checkParent(parent, _checked);
                    }
                }
            }

            function uncheckChild(_node, _checked) {
                var childrens = _node.childNodes;
                Ext.Array.forEach(childrens, function (childNode, i) {
                    childNode.set('checked', _checked);
                    childNode.set('showOnlyOne', false);
                    childNode.set('recursionEnabled', false);
                    uncheckChild(childNode, _checked);
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
        xtype: 'checkcolumn',
        text: CMDBuildUI.locales.Locales.administration.bim.multilevel,
        localized: {
            text: 'CMDBuildUI.locales.Locales.administration.bim.multilevel'
        },
        dataIndex: 'showOnlyOne',
        width: 100,
        align: 'center',
        listeners: {
            beforecheckchange: function (check, rowIndex, checked, record, event, eOpts) {
                var isEdit = !this.getView().lookupViewModel().get('actions.view');
                var isRecordChecked = record.get('checked');
                return isEdit && isRecordChecked;
            }
        }
    }, {
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
        align: 'left',
        flex: 1,
        editor: 'textfield'
    }, {
        text: CMDBuildUI.locales.Locales.administration.navigationtrees.fieldlabels.label,
        localized: {          
            text: 'CMDBuildUI.locales.Locales.administration.navigationtrees.fieldlabels.label'
        },
        dataIndex: 'description',
        flex: 1,
        editor: 'textfield',
        align: 'left'
    }, {
        xtype: 'actioncolumn',
        width: 50,
        align: 'center',
        handler: 'onViewModeBtnClick',
        getClass: function (value, metadata, record, rowIndex, colIndex, store, grid) {
            return 'x-fa fa-gear';
        },
        isDisabled: function (view, rowIndex, colIndex, item, record) {
            var targetClass = CMDBuildUI.util.helper.ModelHelper.getObjectFromName(record.get('targetClass'));
            if (!record.get('checked') || !targetClass.get('prototype')) {
                return true;
            }
            return false;
        }


    }]


});
