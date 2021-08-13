Ext.define('CMDBuildUI.view.joinviews.configuration.items.DomainsController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.joinviews-configuration-items-domains',

    control: {
        '#domainstree': {
            beforeitemdblclick: 'onBeforeItemDblClick',
            itemexpand: 'onItemExpand',
            beforeedit: 'onBeforeEdit',
            edit: 'onEdit',
            beforecheckchange: 'onBeforeCheckChange',
            checkchange: 'onCheckChange'
        }
    },

    /**
     * @event #joinTreeStore.rootchange (defined in viewmodel)
     * 
     * @param {Ext.data.TreeModel} newRoot 
     */
    onTreeStoreRootChange: function (newRoot) {
        var me = this;
        Ext.asap(function (_newRoot) {
            if (_newRoot.get('text')) {
                _newRoot.expand();
                me.onItemExpand(_newRoot);
            }
        }, this, [newRoot]);
    },

    /**
     * @event #joinTreeStore.nodecollapse (defined in viewmodel)
     * 
     * @param {Ext.data.TreeModel} node 
     */
    onNodeCollapse: function (node) {
        if (node.childNodes.length) {
            node.removeAll();
        }
    },

    /**
     * @event #domainstree.beforeitemdblclick
     */
    onBeforeItemDblClick: function () {
        return false;
    },

    /**
     * @event #domainstree.itemexpand
     * 
     * @param {Ext.data.TreeModel} node 
     */
    onItemExpand: function (node) {
        Ext.suspendLayouts();
        var me = this,
            vm = me.view.getViewModel();
        var targetClass = node.get('targetClass') || vm.get('theView.masterClass');
        if (targetClass) {
            var targetObject = CMDBuildUI.util.helper.ModelHelper.getObjectFromName(targetClass);
            var targetHierarchy = targetObject.getHierarchy();
            targetObject.getDomains().then(function (domains) {
                domains.getRange().forEach(function (domain) {
                    me.addNodeIfNotExist(node, targetHierarchy, domain);
                });
            });
        }
        Ext.resumeLayouts();
    },

    /**
     * @event #domainstree.beforeedit
     * 
     * @param {*} editor 
     * @param {*} context 
     * @param {*} eOpts 
     */
    onBeforeEdit: function (editor, context, eOpts) {
        if (context.field === 'targetType') {
            var record = context.record,
                store = context.column.getEditor().getStore(),
                childrensClasses = [];
            var targetClass = CMDBuildUI.util.helper.ModelHelper.getObjectFromName(record.get('targetClass'));
            childrensClasses.push({
                label: targetClass.getTranslatedDescription(),
                value: targetClass.get('name')
            });
            Ext.Array.forEach(targetClass.getChildren(), function (childClass) {
                childrensClasses.push({
                    label: childClass.getTranslatedDescription(),
                    value: childClass.get('name')
                });
            });
            store.beginUpdate();
            store.setData(childrensClasses);
            store.endUpdate();
        }
    },
    /**
     * @event #domainstree.edit
     * 
     * @param {*} editor 
     * @param {*} context 
     * @param {*} eOpts 
     */
    onEdit: function (editor, context, eOpts) {
        var me = this,
            mainView = me.getView().up('joinviews-configuration-main'),
            record = context.record;
        if (context.originalValue !== context.value) {
            switch (context.field) {
                case 'domainAlias':
                case 'targetAlias':
                    mainView.clearAliasIndex(context.originalValue);
                    var lastAliasIndex = mainView.getNewAliasIndex(record.get(context.field));
                    record.set(context.field, Ext.String.format('{0}{1}', context.value, lastAliasIndex ? Ext.String.format('_{0}', lastAliasIndex) : ''));
                    break;
                case 'targetType':
                    mainView.clearAliasIndex(record.get('tragetAlias'));
                    var lastTargetClassAliasIndex = mainView.getNewAliasIndex(record.get(context.field));
                    record.set('targetAlias', Ext.String.format('{0}{1}', record.get('targetType'), lastTargetClassAliasIndex ? Ext.String.format('_{0}', lastTargetClassAliasIndex) : ''));
                    if (record.get(context.field) !== record.get('targetClass')) {
                        if (record.nextSibling.get('text') !== record.get('text')) {
                            var text = record.get('text'),
                                targetClass = record.get('targetClass'),
                                domain = record.get('domain'),
                                direction = record.get('direction'),
                                parentNode = record.parentNode,
                                cleanNode = me.getCleanNode(text, targetClass, domain, direction, parentNode);

                            record.parentNode.insertBefore(cleanNode, record.nextSibling);
                        }
                    }
                    break;
                default:
                    // do nothing
                    break;
            }
            mainView.fireEventArgs('domainchange', [record, context]);
        }
    },

    /**
     * @event #domainstree.beforecheckchange
     */
    onBeforeCheckChange: function () {
        return !this.getView().lookupViewModel().get('actions.view');
    },

    /**
     * @event #domainstree.checkchange
     * 
     * @param {Ext.data.TreeModel} node 
     * @param {Boolean} checked 
     */
    onCheckChange: function (node, checked) {
        var me = this;
        if (checked) {
            me.setPropertiesForCheckedNode(node);
        } else {
            me.setPropertiesForUncheckedNode(node);
        }
    },
    privates: {

        /**
         * @private
         * 
         * @param {CMDBuildUI.model.views.JoinViewJoin[]} join 
         * @param {Ext.data.TreeModel} node 
         * @param {CMDBuildUI.model.domains.Domain} domain 
         */
        isCheckedItem: function (join, node, domain) {
            var checkedItem;
            join.findBy(function (item) {
                var sameSource;
                if (node.isModel) {
                    sameSource = item.get('source') === node.get('targetAlias');
                }
                if (item.get('domain') === domain.get('name') && sameSource) {
                    checkedItem = item;
                    return true;
                }
                return false;
            });
            return checkedItem;
        },

        /**
         * @private
         * 
         * @param {Ext.data.TreeModel} node 
         * @param {CMDBuildUI.model.domains.Domain} domain 
         * @param {CMDBuildUI.model.classes.Class|CMDBuildUI.model.processes.Process} linkedObject 
         * @param {Boolean} isDirect 
         * @param {CMDBuildUI.model.views.JoinViewJoin} checkedItem 
         */
        addNode: function (node, domain, linkedObject, isDirect, checkedItem) {
            var me = this,
                mainView = me.getView().up('joinviews-configuration-main'),
                targetClassAlias, domainAlias;
            if (checkedItem) {
                var lastTargetClassAliasIndex = mainView.getNewAliasIndex(checkedItem.get('targetAlias'));
                targetClassAlias = Ext.String.format('{0}{1}', checkedItem.get('targetAlias'), lastTargetClassAliasIndex ? Ext.String.format('_{0}', lastTargetClassAliasIndex) : '');

                var lastDomainIndex = mainView.getNewAliasIndex(checkedItem.get('domainAlias'));
                domainAlias = Ext.String.format('{0}{1}', checkedItem.get('domainAlias'), lastDomainIndex ? Ext.String.format('_{0}', lastDomainIndex) : '');
            }

            var newNode = {
                _id: CMDBuildUI.util.Utilities.generateUUID(),
                text: Ext.String.format('{0} [{1}]', isDirect ? domain.getTranslatedDescriptionDirect() : domain.getTranslatedDescriptionInverse(), linkedObject.getTranslatedDescription()),
                targetClass: isDirect ? domain.get("destination") : domain.get('source'),
                targetAlias: targetClassAlias || '',
                targetType: !Ext.isEmpty(checkedItem) ? checkedItem.get('targetType') : '', // default value is domain target class
                joinType: !Ext.isEmpty(checkedItem) ? checkedItem.get('joinType') : '',
                domain: domain.get("name"),
                domainAlias: !Ext.isEmpty(checkedItem) ? checkedItem.get('domainAlias') : '',
                checked: !Ext.isEmpty(checkedItem) ? true : false,
                direction: isDirect ? 'direct' : 'inverse',
                parent: node.get('_id'),
                expanded: !Ext.isEmpty(checkedItem) ? true : false,
                leaf: false
            };
            node.appendChild(newNode);            
            if (newNode.checked) {
                mainView.fireEventArgs('domaincheckchange', [node.findChild('_id', newNode._id)]);
            }
            if (newNode.targetType !== '' && newNode.targetClass !== newNode.targetType) {
                var text = Ext.String.format('{0} [{1}]', isDirect ? domain.getTranslatedDescriptionDirect() : domain.getTranslatedDescriptionInverse(), linkedObject.getTranslatedDescription()),
                    targetClass = isDirect ? domain.get("destination") : domain.get('source'),
                    domainName = domain.get("name"),
                    direction = isDirect ? 'direct' : 'inverse',
                    parentNode = node,
                    cleanNode = me.getCleanNode(text, targetClass, domainName, direction, parentNode);

                node.appendChild(cleanNode);
            }            
            node.sort();
            me.nodeAppended();
        },

        /**
         * @private
         * 
         * disable step navigation buttons until all nodes are inserted on tree panel
         */
        nodeAppended: function () {
            var me = this,
                mainView = me.getView().up('joinviews-configuration-main'),
                vm = mainView.lookupViewModel();
            if (this.lastAppendedNodeTimeout) {
                this.lastAppendedNodeTimeout.cancel();
            }
            this.lastAppendedNodeTimeout = new Ext.util.DelayedTask(function () {
                if(vm && !vm.destroyed) {
                    // me.getViewModel().get('treeStore').getRoot().sort();
                    vm.set('stepNavigationLocked', false);
                }
            }).delay(500);
        },
        /**
         * @private
         * 
         * @param {Ext.data.TreeModel} node 
         * @param {String[]} targetHierarchy 
         * @param {CMDBuildUI.model.domains.Domain} domain 
         */
        addNodeIfNotExist: function (node, targetHierarchy, domain) {
            var me = this,
                vm = me.view.getViewModel(),
                join = vm.get('theView').joinWith(),
                checkedItem = me.isCheckedItem(join, node, domain);

            if (domain.get("active")) {
                var isDirect = Ext.Array.contains(targetHierarchy, domain.get("source"));

                if (!node.findChild('domain', domain.get('name')) /*&& !node.findChild('targetClass', isDirect ? domain.get("destination") : domain.get('source')) */ ) {
                    var linkedObject = CMDBuildUI.util.helper.ModelHelper.getObjectFromName(isDirect ? domain.get("destination") : domain.get('source'));
                    me.addNode(node, domain, linkedObject, isDirect, checkedItem);
                }
            }
        },

        /**
         * @private
         * 
         * @param {Ext.data.TreeModel} node 
         */
        checkParent: function (node) {
            var me = this,
                mainView = me.getView().up('joinviews-configuration-main'),
                parent = node.parentNode;

            if (parent && !parent.isRoot()) {
                parent.set('checked', true);
                parent.set('targetType', parent.get('targetType'));

                if (Ext.isEmpty(parent.get('domainAlias'))) {
                    var domain = CMDBuildUI.util.helper.ModelHelper.getObjectFromName(parent.get('domain'));
                    var lastDomainAliasIndex = mainView.getNewAliasIndex(domain.get('name'));
                    parent.set('domainAlias', Ext.String.format('{0}{1}', domain.get('name'), lastDomainAliasIndex ? Ext.String.format('_{0}', lastDomainAliasIndex) : ''));
                }

                // join type
                if (Ext.isEmpty(parent.get('joinType'))) {
                    parent.set('joinType', CMDBuildUI.model.views.JoinViewJoin.jointypes.outer_join);
                }

                // target type
                if (Ext.isEmpty(parent.get('targetType'))) {
                    parent.set('targetType', parent.get('targetClass'));
                }

                // target alias
                if (Ext.isEmpty(parent.get('targetAlias'))) {
                    var klass = CMDBuildUI.util.helper.ModelHelper.getObjectFromName(parent.get('targetClass'));
                    var lastClassAliasIndex = mainView.getNewAliasIndex(klass.get('name'));
                    parent.set('targetAlias', Ext.String.format('{0}{1}', klass.get('name'), lastClassAliasIndex ? Ext.String.format('_{0}', lastClassAliasIndex) : ''));
                }
                me.getView().up('form').fireEventArgs('domaincheckchange', [node]);
                if (parent.parentNode && !parent.parentNode.root) {
                    me.checkParent(parent);
                }
            }
        },

        /**
         * @private
         * 
         * @param {Ext.data.TreeModel} node 
         */
        uncheckChild: function (node) {
            var me = this,
                view = me.getView(),
                childrens = node.childNodes;

            // notify event for node checkchange to other components
            view.up('form').fireEventArgs('domaincheckchange', [node]);

            Ext.Array.forEach(childrens, function (childNode) {
                me.setPropertiesForUncheckedNode(childNode);
            });
        },

        /**
         * @private
         * 
         * @param {Ext.data.TreeModel} node 
         */
        setPropertiesForCheckedNode: function (node) {
            var me = this,
                view = me.getView(),
                mainView = view.up('joinviews-configuration-main'),
                domain = CMDBuildUI.util.helper.ModelHelper.getObjectFromName(node.get('domain')),
                klass = CMDBuildUI.util.helper.ModelHelper.getObjectFromName(node.get('targetClass'));

            // target type
            node.set('targetType', node.get('targetClass'));

            // join type
            node.set('joinType', CMDBuildUI.model.views.JoinViewJoin.jointypes.outer_join);

            // domain alias
            var lastDomainAliasIndex = mainView.getNewAliasIndex(domain.get('name'));
            node.set('domainAlias', Ext.String.format('{0}{1}', domain.get('name'), lastDomainAliasIndex ? Ext.String.format('_{0}', lastDomainAliasIndex) : ''));

            // target alias
            var lastClassAliasIndex = mainView.getNewAliasIndex(klass.get('name'));
            node.set('targetAlias', Ext.String.format('{0}{1}', klass.get('name'), lastClassAliasIndex ? Ext.String.format('_{0}', lastClassAliasIndex) : ''));

            view.up('form').fireEventArgs('domaincheckchange', [node]);
            if (node.parentNode && !node.parentNode.isRoot()) {
                me.checkParent(node);
            }
        },

        /**
         * @private
         * 
         * @param {Ext.data.TreeModel} node 
         */
        setPropertiesForUncheckedNode: function (node) {
            var me = this,
                view = me.getView(),
                mainView = view.up('joinviews-configuration-main');

            // remove used alias from stored object
            mainView.clearAliasIndex(node.get('domainAlias'));
            mainView.clearAliasIndex(node.get('targetAlias'));

            // reset all properties
            node.set('checked', false);
            node.set('source', '');
            node.set('targetType', '');
            node.set('domainAlias', '');
            node.set('targetAlias', '');
            node.set('joinType', '');
            node.set('recursionEnabled', false);

            // notify event for node checkchange to other components
            me.getView().up('form').fireEventArgs('domaincheckchange', [node]);
            // uncheck child if exists
            me.uncheckChild(node, false);
        },

        /**
         * @private
         * 
         * @param {String} text 
         * @param {String} targetClass 
         * @param {String} domain 
         * @param {String} direction 
         * @param {String} parentNode 
         */
        getCleanNode: function (text, targetClass, domain, direction, parentNode, source) {
            return {
                _id: CMDBuildUI.util.Utilities.generateUUID(),
                text: text,
                targetClass: targetClass,
                domain: domain,
                targetType: '', // defined on record
                dimainAlias: '', // defined on record
                joinType: '', // defined on record
                targetAlias: '', // defined on record 
                checked: false,
                filter: '{}', // 
                direction: direction,
                parent: parentNode.get('_id'),
                expanded: false,
                leaf: false
            };
        }
    }
});