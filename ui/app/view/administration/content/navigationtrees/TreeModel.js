Ext.define('CMDBuildUI.view.administration.content.navigationtrees.TreeModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.administration-content-navigationtrees-tree',

    formulas: {
        treeRoot: {
            bind: {
                targetClass: '{theNavigationtree.targetClass}',
                theNavigationtree: '{theNavigationtree}'
            },
            get: function (data) {
                var root = data.theNavigationtree.get('nodes').length ? data.theNavigationtree.get('nodes')[0] : [];
                var target = CMDBuildUI.util.helper.ModelHelper.getObjectFromName(data.targetClass);
                var targetDescription = target && target.get('description') ? target.get('description') : data.targetClass;

                var tree = {};
                tree._id = root._id;
                tree.text = targetDescription;
                tree.targetClass = data.targetClass;
                tree.targetIsProcess = false;
                tree.children = [];
                tree.expanded = false;
                tree.multilevel = false;
                tree.checked = true;
                tree.filter = '';
                tree.domain = root.domain;
                tree.filter = (typeof root.filter === 'string')? root.filter: '';
                tree.recursionEnabled = root.recursionEnabled;
                tree.showOnlyOne = root.showOnlyOne;
                
                return tree;
            }
        }
    },

    stores: {
        treeStore: {
            type: 'tree',
            proxy: {
                type: 'memory'
            },
            root: '{treeRoot}',
            listeners: {
                nodecollapse: function (node) {
                    if (node.childNodes.length) {
                        node.removeAll();
                    }
                },
                rootchange : function(newRoot, oldRoot, eOpts){
                   Ext.asap(function(newRoot){
                       if(newRoot.get('text')){
                           newRoot.expand();
                       }
                   }, this, [newRoot]);
                }
            }
        }
    }
});