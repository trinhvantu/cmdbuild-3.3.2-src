Ext.define('CMDBuildUI.view.administration.content.menunavigationtree.TreeController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.administration-content-menunavigationtree-tree',

    control: {
        '#': {
            itemexpand: 'onItemExpand',
            beforeitemdblclick: function () {
                return false;
            }
        }
    },

    onItemExpand: function (node) {

        Ext.suspendLayouts();

        var me = this;
        var vm = me.view.getViewModel();
        var theNavigationTreeNodes = vm.get('theNavigationtree.nodes');
        var targetClass = node.get('targetClass') || vm.get('theNavigationtree.targetClass');
        if (targetClass) {
            var targetType = node.get("targetIsProcess") ? CMDBuildUI.util.helper.ModelHelper.objecttypes.process : CMDBuildUI.util.helper.ModelHelper.objecttypes.klass;
            var targetObject = CMDBuildUI.util.helper.ModelHelper.getObjectFromName(targetClass, targetType);
            var targetHierarchy = targetObject.getHierarchy();
            targetObject.getDomains().then(function (domains) {
                domains.getRange().forEach(function (d) {
                    if (d.get("active")) {

                        var isCheckedNode = false; // found && found.domain === d.get('name');
                        if (Ext.Array.contains(targetHierarchy, d.get("source")) && !d.get("destinationProcess")) {                            
                            var destinationType = CMDBuildUI.util.helper.ModelHelper.objecttypes.klass;
                            var destinationObject = CMDBuildUI.util.helper.ModelHelper.getObjectFromName(d.get("destination"), destinationType);

                            node.appendChild({
                                _id: new Date().getTime(),
                                text: d.get("description") + ' [' + d.getTranslatedDescriptionDirect() + ' ' + destinationObject.get("description") + ']',
                                targetClass: d.get("destination"),
                                targetIsProcess: d.get("destinationProcess"),
                                domain: d.get("name"),
                                checked: false,
                                direction: '_2',
                                filter: '',
                                parent: node.get('_id'),
                                showOnlyOne: false,
                                recursionEnabled: false,
                                expanded: false,
                                leaf: false,
                                subclassViewMode: CMDBuildUI.model.navigationTrees.TreeNode.subclassViewMode.cards,
                                subclassViewShowIntermediateNodes: true,
                                subclassFilter: null

                            });
                        }
                        if (Ext.Array.contains(targetHierarchy, d.get("destination")) && !d.get("sourceProcess")) {                            
                            var sourceType = CMDBuildUI.util.helper.ModelHelper.objecttypes.klass;
                            var sourceObject = CMDBuildUI.util.helper.ModelHelper.getObjectFromName(d.get("source"), sourceType);
                            if (!node.findChild('domain', d.get('name'))) {
                                node.appendChild({
                                    _id: new Date().getTime(),
                                    text: d.get("description") + ' [' + d.getTranslatedDescriptionInverse() + ' ' + sourceObject.get("description") + ']',
                                    targetClass: d.get("source"),
                                    targetIsProcess: d.get("sourceProcess"),
                                    domain: d.get("name"),
                                    checked: false,
                                    filter: '',
                                    direction: '_1',
                                    parent: node.get('_id'),
                                    showOnlyOne: false,
                                    recursionEnabled: false,
                                    expanded: false,
                                    leaf: false,
                                    subclassViewMode: CMDBuildUI.model.navigationTrees.TreeNode.subclassViewMode.cards,
                                    subclassViewShowIntermediateNodes: true,
                                    subclassFilter: null
                                });
                            }
                        }
                    }
                });
                me.findCheckedNodes(node, theNavigationTreeNodes[0].nodes);
            });
        }


        Ext.resumeLayouts();
    },

    onViewModeBtnClick: function (view, rowIndex, colIndex, column, event, record) {
        // open the popip and show the form for set:
        // subclassViewMode
        // subclassViewShowIntermediateNodes
        // subclassFilter
        // subclassViewMode        ;
        var vm = view.lookupViewModel();
        var popupId = 'menunavtree-viewmode-popup';        
        var content = {
            xtype: 'administration-content-menunavigationtrees-viewmodeform',
            scrollable: 'y',
            viewModel: {
                data: {
                    record: Ext.data.Model.create(record.getData()),
                    actions: vm.get('actions')
                }
            }
        };
        // custom panel listeners
        var listeners = {
            /**
             * @param {Ext.panel.Panel} panel
             * @param {Object} eOpts
             */
            close: function (panel, eOpts) {
                CMDBuildUI.util.Utilities.closePopup(popupId);
            },
            save: function(_record){                
                record.data = _record.data;
                CMDBuildUI.util.Utilities.closePopup(popupId);
            }
        };
        // create and open panel
        var popup = CMDBuildUI.util.Utilities.openPopup(
            popupId,
            CMDBuildUI.locales.Locales.administration.navigationtrees.fieldlabels.viewmode,
            content,
            listeners, {
                ui: 'administration-actionpanel',
                draggable: true
            }
        );

        return popup;

    },
    privates: {
        /**
         * @private
         * 
         */
        recursiveParentCheck: function (node, checked) {
            var me = this;
            if (checked) {
                node.set('checked', true);
                if (node.parentNode) {
                    // up direction
                    me.recursiveParentCheck(node.parentNode, checked);
                }
            } else {
                // down direction
                node.set('checked', false);
                if (node.childNodes && node.childNodes.length) {
                    Ext.Array.forEach(node.childNodes, function (item) {
                        me.recursiveParentCheck(item, checked);
                    });
                }
            }
        },

        findCheckedNodes: function (nodeClient, nodesServer) {

            var me = this;
            Ext.Array.forEach(nodesServer, function (itemServer) {
                if (nodeClient.get('_id') === itemServer.parent) {
                    Ext.Array.forEach(nodeClient.childNodes, function (itemClient) {
                        if (itemServer.domain === itemClient.get('domain')) {
                            itemClient.set('_id', itemServer._id);
                            itemClient.set('parent', nodeClient.get('_id'));
                            itemClient.set('description', itemServer.description);
                            itemClient.set('subclassViewMode', itemServer.subclassViewMode);
                            itemClient.set('subclassViewShowIntermediateNodes', itemServer.subclassViewShowIntermediateNodes);
                            itemClient.set('subclassFilter', itemServer.subclassFilter);
                            // subclass_<NomeClasse>_description
                            if (itemClient.get('subclassFilter') && itemClient.get('subclassFilter').length) {
                                var subclasses = itemClient.get('subclassFilter').split(',');
                                Ext.Array.forEach(subclasses, function (subclass) {
                                    itemClient.set(Ext.String.format('subclass_{0}_description', subclass), itemServer[Ext.String.format('subclass_{0}_description', subclass)]);
                                });

                                //TODO: set locale key
                                //navtree.<codice>.item.<codice item>.subclass.<NomeClasse>.description;

                            }
                            itemClient.set('checked', true);
                            itemClient.set('recursionEnabled', itemServer.recursionEnabled);
                            itemClient.set('showOnlyOne', itemServer.showOnlyOne);
                            itemClient.set('filter', (typeof itemServer.filter === 'string') ? itemServer.filter : '');
                            itemClient.expand();
                        }
                    });

                } else {
                    me.findCheckedNodes(nodeClient, itemServer.nodes);
                }
            });
        }
    }

});
