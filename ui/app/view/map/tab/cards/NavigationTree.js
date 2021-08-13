
Ext.define('CMDBuildUI.view.map.tab.cards.NavigationTree', {
    extend: 'Ext.tree.Panel',

    requires: [
        'CMDBuildUI.view.map.tab.cards.NavigationTreeController',
        'CMDBuildUI.view.map.tab.cards.NavigationTreeModel',

        'CMDBuildUI.store.map.Tree'
    ],
    alias: 'widget.map-tab-cards-navigationtree',
    controller: 'map-tab-cards-navigationtree',
    viewModel: {
        type: 'map-tab-cards-navigationtree'
    },
    reference: 'map-tab-cards-navigationtree',

    config: {
        objectId: {
            $value: undefined,
            evented: false
        },
        objectType: {
            $value: undefined,
            evented: false
        },
        objectTypeName: {
            $value: undefined,
            evented: false
        },

        /**
         * hash map used only for saving tree nodes and them by id quickly. 
         * Is populated in view.loadChildren() function
         */
        nodeHashMap: undefined,
        initialized: {
            $value: false
        }
    },

    store: {
        type: 'tree',
        id: 'navigationtreestore',
        model: 'CMDBuildUI.model.gis.GeoValueTree',
        root: {
            checked: true,
            expanded: true
        },
        sorters: [{
            property: 'text'
        }]
    },
    publishes: [
        'store',
        'objectId',
        'objectTypeName',
        'objectType',
        'initialized'
    ],

    twoWayBindable: [
        "objectId"
    ],

    cls: 'noicontree',
    selModel: {
        type: 'treemodel',
        mode: 'MULTI'
    },

    layout: 'fit',
    hideHeaders: true,
    me: this,
    columns: [{
        xtype: 'treecolumn',
        dataIndex: 'text',
        flex: 20
    }, {
        xtype: 'actioncolumn',
        width: '100',
        handler: 'actionColumn',
        iconCls: 'x-fa fa-arrow-circle-right NavigationTree',
        flex: 1
    }],

    initComponent: function () {
        // this.setNodeHashMap(Ext.util.HashMap.create());
        this.setNodeHashMap(new Ext.util.Collection({
            keyFn: function (item) {
                return item.get('_id_composed');
            },
            grouper: {
                groupFn: function (item) {
                    return item.get('_id');
                }
            }
        }));

        // this piece of code is responsable for listening new nodes appended that might be marked as selected in the tree
        this.getViewModel().bind({
            objectTypeName: '{map-tab-cards-navigationtree.objectTypeName}',
            tree: '{map-tab-tabpanel.navigationTree}'
        }, function (data) {
            if (data.objectTypeName && data.tree) {
                var objectTypeKlass = CMDBuildUI.util.helper.ModelHelper.getObjectFromName(data.objectTypeName);
                var objectTypeSubtypes = objectTypeKlass.getChildren();
                objectTypeSubtypes.push(objectTypeKlass.getId());

                var navTreeNodes = data.tree.findAllBy(function (item) {
                    var targetClassName = item.get('targetClass');
                    var targetKlass = CMDBuildUI.util.helper.ModelHelper.getObjectFromName(targetClassName);
                    var targetKlassSubTypes = targetKlass.getChildren();

                    if (data.objectTypeName == targetClassName) {
                        return item;
                    }

                    else if (Ext.Array.contains(targetKlassSubTypes, objectTypeKlass)) {
                        //if the object is subtype of the target
                        return item;
                    }
                });

                function handleAdd(objectId, store, navTreeNodes) {
                    if (store) {
                        var selected = [];
                        var not_found_ids = [];

                        Ext.Array.forEach(navTreeNodes, function (item, index, array) {
                            var _id_composed = Ext.String.format('{0}-{1}', objectId, item.getId());
                            var found = store.getNodeById(_id_composed);
                            if (found) {
                                selected.push(found);
                            } else {
                                not_found_ids.push(_id_composed);
                            }
                        }, this);

                        if (not_found_ids.length) {
                            this.getSelectionModel().select([], false, true);
                            addListener.call(this, objectId, store, navTreeNodes, not_found_ids);
                        }

                        if (selected.length) {
                            Ext.Array.forEach(selected, function (item, index, array) {
                                Ext.asap(function (record) {
                                    this.expandConsecutively(record);
                                }, this, [item]);
                            }, this);
                            this.getSelectionModel().select(selected, false, true);
                        }
                    }
                }

                function _handleAdd(objectId, store, navTreeNodes, not_found_ids, st, node, index, eOpts) {
                    var found = Ext.Array.contains(not_found_ids, node.getId()) ? true : false;
                    if (found) {
                        handleAdd.call(this, objectId, store, navTreeNodes);
                        console.log('selected after load');
                    } else {
                        addListener.call(this, objectId, store, navTreeNodes, not_found_ids);
                    }
                }

                function addListener(objectId, store, navTreeNodes, not_found_ids) {
                    store.addListener('nodeappend', _handleAdd, this, {
                        single: this,
                        args: [objectId, store, navTreeNodes, not_found_ids]
                    });
                }

                ////
                function handleInsertion(objectType, objectTypeName, objectId, store, navTreeNodes) {
                    if (store) {
                        var not_found_node = [];
                        var found_node = [];

                        Ext.Array.forEach(navTreeNodes, function (navTreeNode, index, array) {
                            if (!navTreeNode.isNavRoot()) {

                                var _id_composed = Ext.String.format('{0}-{1}', objectId, navTreeNode.getId());
                                var found = store.getNodeById(_id_composed);
                                if (!found) {
                                    var newnode = Ext.create('CMDBuildUI.model.gis.GeoValueTree', {
                                        _id_composed: _id_composed,
                                        _id: objectId,
                                        // type: navTreeNode.get('targetClass'),
                                        navTreeNodeId: navTreeNode.getId(),
                                        leaf: navTreeNode.isNavLeaf(),
                                        checked: true
                                    });
                                    newnode.setNavTreeNode(navTreeNode);
                                    not_found_node.push(newnode);
                                } else {
                                    found_node.push(found);
                                }
                            }
                        }, this);

                        if (not_found_node.length) {
                            if (found_node.length) {
                                Ext.Array.forEach(not_found_node, function (item, index, array) {
                                    item.set('description', found_node[0].get('description'));
                                    item.set('type', found_node[0].get('type'));
                                    this.recursiveLoadParent(item);
                                }, this);
                            } else {
                                var modelName = CMDBuildUI.util.helper.ModelHelper.getModelName(objectType, objectTypeName);
                                var theObject = Ext.create(modelName, {
                                    _id: objectId
                                });
                                theObject.load({
                                    callback: function (record, operation, success) {
                                        Ext.Array.forEach(not_found_node, function (item, index, array) {
                                            item.set('description', record.get('Description'));
                                            item.set('type', record.get('_type'));

                                            // var navtreenode = item.getNavTreeNode();
                                            // var parenttreenode = navtreenode.getParent();

                                            // var targetKlassName = item.get('type');
                                            // var targetKlass = CMDBuildUI.util.helper.ModelHelper.getObjectFromName(targetKlassName);

                                            // var sourceKlassName = parenttreenode.get('targetClass');
                                            // var sourceKlass = CMDBuildUI.util.helper.ModelHelper.getObjectFromName(sourceKlassName);

                                            // if (targetKlass == sourceKlass) {
                                            //     // if selected card has the same type of the target class defined in the navtree 
                                            //     this.recursiveLoadParent.call(this, item);
                                            // }

                                            // else if (Ext.Array.contains(sourceKlass.getChildren(), targetKlass)) {
                                            //     //if the selected card is subtype of the target class defined in the navtree
                                            //     this.recursiveLoadParent.call(this, item);
                                            // }
                                            this.recursiveLoadParent.call(this, item);
                                        }, this);
                                    },
                                    scope: this
                                });
                            }
                        }
                    }
                }

                if (navTreeNodes) {
                    this.getViewModel().bind({
                        objectId: '{map-tab-cards-navigationtree.objectId}',
                        store: '{map-tab-cards-navigationtree.store}',
                        initialized: '{map-tab-cards-navigationtree.initialized}'
                    }, function (data) {
                        if (data.store) {
                            data.store.removeListener('nodeappend', _handleAdd, this);

                            if (data.objectId && data.initialized) {
                                handleAdd.call(this, data.objectId, data.store, navTreeNodes);
                            } else {
                                this.getSelectionModel().deselectAll();
                            }
                        }
                    }, this);

                    this.getViewModel().bind({
                        objectId: '{map-tab-cards-navigationtree.objectId}',
                        objectTypeName: '{map-tab-cards-navigationtree.objectTypeName}',
                        objectType: '{map-tab-cards-navigationtree.objectType}',
                        store: '{map-tab-cards-navigationtree.store}',
                        initialized: '{map-tab-cards-navigationtree.initialized}'
                    }, function (data) {
                        if (data.store && data.initialized && data.objectId) {
                            handleInsertion.call(this, data.objectType, data.objectTypeName, data.objectId, data.store, navTreeNodes);
                        }
                    }, this);
                }
            }
        }, this);

        this.callParent(arguments);
    },

    loadChildren: function (node, navtreedef, callback, scope) {
        var deferred = new Ext.Deferred();
        node._childrenloaded = deferred;

        // get config
        var targetTypeName = node.get('isIntermediate') ? node.get('type') : navtreedef.get('targetClass');
        var targetType = CMDBuildUI.util.helper.ModelHelper.getObjectTypeByName(targetTypeName);
        if (!targetType) {
            return;
        }
        var path = CMDBuildUI.util.helper.ModelHelper.getListBaseUrl(targetType, targetTypeName);

        // create relation filter
        var filter = {};
        if (navtreedef.get("domain")) {
            filter.relation = [{
                domain: navtreedef.get("domain"),
                source: navtreedef.getParent().get('targetClass'),
                destination: targetTypeName,
                direction: navtreedef.get("direction") == '_1' ? '_1' : '_2',
                type: "oneof",
                cards: [{
                    className: navtreedef.getParent().get('targetClass'),
                    id: node.get("_id")
                }]
            }];
        }

        // add cql filter
        if (navtreedef.get("ecqlFilter")) {
            filter.ecql = {
                id: navtreedef.get("ecqlFilter").id
            };
        }

        // set the filter on parent node
        node.set("_storefilter", filter);

        // create temp store 
        var childrenstore = Ext.create("Ext.data.Store", {
            fields: ['_id', 'Description'],
            proxy: {
                type: 'baseproxy',
                url: path,
                extraParams: {
                    attrs: 'Id,Description,IdClass',
                }
            },
            sorters: [{
                property: 'Description',
                direction: "ASC"
            }],
            remoteSort: true,
            advancedFilter: filter,
            pageSize: 0,
        });
        // load store
        childrenstore.load({
            callback: function (records, operation, success) {
                if (success) {

                    //stores the nodes
                    var nodeHashMap = this.getNodeHashMap();

                    //stores nodes checked value
                    var hashMap = this.getView().up('map-container').getHashMap();
                    hashMap.beginUpdate();

                    var showOnlyOne = navtreedef.get('showOnlyOne');
                    var firstShowOnlyOne = {};

                    // append items to the node
                    records.forEach(function (r) {
                        var _id_composed = Ext.String.format('{0}-{1}', r.get('_id'), navtreedef.getId());

                        if (nodeHashMap.getByKey(_id_composed)) {
                            return;
                        }

                        var fireevent;
                        var hashKey = r.get("_id");
                        var hashValue = nodeHashMap.getGroups().getByKey(hashKey);
                        var checked;

                        if (showOnlyOne) {
                            if (!Ext.isEmpty(hashValue)) {
                                checked = hashValue.getAt(0).get('checked');

                                if (checked == true) {
                                    if (!firstShowOnlyOne[navtreedef.getId()]) {
                                        checked = true;
                                        firstShowOnlyOne[navtreedef.getId()] = true;
                                    } else {
                                        checked = false;
                                        fireevent = true;
                                    }
                                } else {
                                    checked = false;
                                }
                            } else {
                                if (!firstShowOnlyOne[navtreedef.getId()]) {
                                    if (node.get('checked') == true) {
                                        checked = true;
                                        firstShowOnlyOne[navtreedef.getId()] = true;
                                    } else if (node.get('checked') == false) {
                                        checked = false;
                                    }
                                } else {
                                    checked = false;
                                }
                            }
                        } else {
                            if (!Ext.isEmpty(hashValue)) {
                                checked = hashValue.getAt(0).get('checked');

                                if (checked != node.get('checked')) {
                                    fireevent = true;
                                }
                            } else {
                                checked = node.get('checked');
                            }
                        }

                        var c = node.createNode({
                            text: r.get("Description"),
                            // _navtreedef: navtreedef,
                            leaf: navtreedef.isNavLeaf(),
                            checked: checked,

                            isIntermediate: false,
                            _id_composed: _id_composed,
                            _id: r.get('_id'),
                            description: r.get("Description"),
                            navTreeNodeId: navtreedef.getId(),
                            parentid: node.get('_id'),
                            parenttype: node.get('type'),
                            type: r.get('_type')

                        });
                        c.setNavTreeNode(navtreedef);

                        nodeHashMap.add(c);

                        //adds the new check information
                        hashMap.add(r.get("_id"), checked);

                        node.appendChild(c);

                        if (fireevent == true) {
                            this.fireEventArgs('checkchange', [c, checked]);
                        }

                    }, this);

                    node._childrenloaded = true;
                    node.sort();
                    hashMap.endUpdate();
                    deferred.resolve();
                } else {

                    node._childrenloaded = false;
                    deferred.reject();
                }
                // delete item after its usage
                Ext.asap(function () {
                    childrenstore.destroy();
                });
            },
            scope: this
        });

        return deferred.promise;
    },

    recursiveLoadParent: function (node) {
        var deferred = new Ext.Deferred();
        this._recursiveLoadParent(node).then(function () {
            deferred.resolve(node);
        }, Ext.emptyFn, Ext.emptyFn, this);

        return deferred.promise;
    },

    _recursiveLoadParent: function (node) {
        var deferred = new Ext.Deferred();

        this.loadParent.call(this, node).then(function (parent) {
            if (parent) {
                var nodeHashMap = this.getNodeHashMap();
                var treeNode = nodeHashMap.get(parent.getId());
                if (treeNode) {
                    this.insertNodeWithChilds(treeNode, node);
                    deferred.resolve();
                } else {
                    this._recursiveLoadParent.call(this, parent).then(function () {
                        deferred.resolve();
                    }, Ext.emptyFn, Ext.emptyFn, this);
                }
            } else {
                deferred.resolve();
            }
        }, Ext.emptyFn, Ext.emptyFn, this);

        return deferred.promise;
    },

    /**
     * 
     * @param {CMDBuildUI.model.gis.GeoValueTree} node 
     */
    loadParent: function (node) {
        var deferred = new Ext.Deferred();
        var navtreedef = node.getNavTreeNode();

        var sourceTypeName = navtreedef.getParent().get('targetClass');
        var sourceType = CMDBuildUI.util.helper.ModelHelper.getObjectTypeByName(sourceTypeName);
        if (!sourceType) {
            return;
        }
        var path = CMDBuildUI.util.helper.ModelHelper.getListBaseUrl(sourceType, sourceTypeName);

        // create relation filter
        var filter = {};
        if (navtreedef.get("domain")) {
            filter.relation = [{
                domain: navtreedef.get("domain"),
                source: node.get('type'),
                destination: navtreedef.getParent().get('targetClass'),
                direction: (navtreedef.get("direction") == '_1') ? '_2' : '_1',
                type: "oneof",
                cards: [{
                    className: node.get('type'),
                    id: node.get("_id")
                }]
            }];
        }

        // add cql filter
        var hasEcqlFilter = false;
        if (navtreedef.get("ecqlFilter")) {
            hasEcqlFilter = true;
            console.log('the cql filter in not applied in the inverse relation: ', navtreedef.get("ecqlFilter").id);
            /* filter.ecql = {
                id: navtreedef.get("ecqlFilter").id
            }; */
        }

        // create temp store 
        var parentstore = Ext.create("Ext.data.Store", {
            fields: ['_id', 'Description'],
            proxy: {
                type: 'baseproxy',
                url: path,
                extraParams: {
                    attrs: 'Id,Description,IdClass'
                }
            },
            advancedFilter: filter,
            pageSize: 0,
            sorters: ['Description']
        });

        parentstore.load({
            callback: function (records, operation, success) {
                var newnode;
                if (success) {
                    if (hasEcqlFilter) {
                        if (records && records.length == 1) {
                            var record = records[0];
                            var parentNavTree = navtreedef.getParent();
                            newnode = Ext.create('CMDBuildUI.model.gis.GeoValueTree', {
                                _id_composed: Ext.String.format('{0}-{1}', record.get('_id'), parentNavTree.getId()),
                                _id: record.get('_id'),
                                type: record.get('_type'),
                                navTreeNodeId: parentNavTree.getId(),
                                description: record.get('Description')
                            });
                            newnode.setNavTreeNode(parentNavTree);

                            this.hasChildren().then(function (hasChildre) {
                                if (hasChildre) {
                                    deferred.resolve(newnode);
                                } else {
                                    deferred.resolve(null);
                                }
                            }, Ext.emptyFn, Ext.emptyFn, this);
                        } else {
                            deferred.resolve();
                        }
                    } else {

                        if (records && records.length == 1) {
                            var record = records[0];
                            var parentNavTree = navtreedef.getParent();
                            newnode = Ext.create('CMDBuildUI.model.gis.GeoValueTree', {
                                _id_composed: Ext.String.format('{0}-{1}', record.get('_id'), parentNavTree.getId()),
                                _id: record.get('_id'),
                                type: record.get('_type'),
                                navTreeNodeId: parentNavTree.getId(),
                                description: record.get('Description')
                            });
                            newnode.setNavTreeNode(parentNavTree);
                            newnode.appendChild(node);
                            node.set('parentid', record.get('_id'));
                            deferred.resolve(newnode);
                            return;
                        } else {

                        }
                        console.log("doesn't have parent");
                        deferred.reject();
                    }
                } else {
                    console.log("wrong filter call");
                    deferred.reject();
                }
            },
            scope: this
        });

        return deferred.promise;
    },

    hasChildren: function (node) {
        var deferred = new Ext.Deferred();
        deferred.resolve(false);
        return deferred.promise;
    },

    /**
     * 
     * @param {CMDBuildUI.model.gis.GeoValueTree} node 
     * @param {CMDBuildUI.model.gis.GeoValueTree} child 
     */
    insertNode: function (node, child) {
        var nodeHashMap = this.getNodeHashMap();

        //stores nodes checked value
        var hashMap = this.getView().up('map-container').getHashMap();

        var checked = this.checkedValue(node, child);
        child.set('checked', checked);

        if (!Ext.isEmpty(child.childNodes)) {
            console.log('adding node with childs');
        }

        var parentNavTree = node.getNavTreeNode();
        var navTreeNode = child.getNavTreeNode();

        var addIntermediate = navTreeNode.get("subclassViewMode") === "subclasses" && navTreeNode.get("subclassViewShowIntermediateNodes");
        if (addIntermediate || (parentNavTree.childs().getRange().length > 1 && navTreeNode.get("subclassViewMode") === "cards")) {
            var _id_composed = Ext.String.format('{0}-{1}-{2}-intermediate', node.get('_id'), navTreeNode.getId(), node.get('type'));
            var subChildNode = node.findChild('_id_composed', _id_composed);

            if (!subChildNode) {
                subChildNode = node.createNode({
                    description: navTreeNode.get("_description_translation") || CMDBuildUI.util.helper.ModelHelper.getObjectDescription(navTreeNode.get("targetClass")),
                    leaf: true,
                    checked: node.get('checked'),
                    isIntermediate: true,
                    navTreeNodeId: navTreeNode.getId(),
                    _id_composed: _id_composed,
                    _id: node.getId(),
                    type: child.get('type')

                });
                subChildNode.setNavTreeNode(navTreeNode);
                node.appendChild(subChildNode);
            }
            node = subChildNode;
        }

        var nodes = [];
        if (navTreeNode.get("subclassViewMode") === "subclasses") {
            var childKlass = CMDBuildUI.util.helper.ModelHelper.getClassFromName(child.get('type'));

            navTreeNode.get("subclassFilter").split(',').forEach(function (subtype) {
                var subtypeKlass = CMDBuildUI.util.helper.ModelHelper.getClassFromName(subtype);
                var isKlassChild = subtypeKlass === childKlass || Ext.Array.contains(subtypeKlass.getChildren(), childKlass);

                if (isKlassChild) {
                    var _id_composed = Ext.String.format('{0}-{1}-{2}-intermediate', node.get('_id'), navTreeNode.getId(), subtype);
                    var subTypeChildNode = node.findChild('_id_composed', _id_composed);
                    var desc = CMDBuildUI.util.helper.ModelHelper.getObjectDescription(subtype);

                    if (!subTypeChildNode) {
                        subTypeChildNode = node.appendChild({
                            description: desc,
                            // _navtreedef: subChild,
                            leaf: true,
                            checked: node.get('checked'),
                            isIntermediate: true,
                            navTreeNodeId: navTreeNode.getId(),
                            _id_composed: _id_composed,
                            _id: node.get('_id'),
                            type: subtype
                        });
                        subTypeChildNode.setNavTreeNode(navTreeNode);
                    }
                    nodes.push(subTypeChildNode);
                }
            });
        }

        if (navTreeNode.isNavLeaf()) {
            child.set('leaf', true);
        } else {
            if (child._childrenloaded && Ext.isEmpty(child.childNodes)) {
                child.set('leaf', true);
            } else {
                child.set('leaf', false);
            }
        }

        nodeHashMap.add(child);
        if (nodes.length) {
            console.log('found an ambigous subtype');
            Ext.Array.forEach(nodes, function (node) {
                node.appendChild(child);
            }, this);
        } else {
            node.appendChild(child);
        }


        //adds the new check information
        hashMap.add(child.get("_id"), checked);
        //         this.fireEventArgs('checkchange', [child, checked]);
    },

    insertNodeWithChilds: function (node, child) {
        var a = [];
        this.linearizeChilds.call(this, child, a);
        this.getController().onCollectionAdd(a);

    },

    linearizeChilds: function (node, arr) {
        var _tmpchilds = [];
        Ext.Array.forEach(node.childNodes, function (item, index, array) {
            _tmpchilds.push(item);
        }, this);

        arr.push(node);
        Ext.Array.forEach(_tmpchilds, function (item, index, array) {
            item.remove();
            arr.push(item);
            this.linearizeChilds(item, arr);
        }, this);
    },

    checkedValue: function (parent, child) {
        var navtreedef = child.getNavTreeNode();
        var showOnlyOne = navtreedef.get('showOnlyOne');

        var fireevent;
        var hashKey = child.get("_id");
        var hashValue = this.getNodeHashMap().get(hashKey);
        var checked;

        if (showOnlyOne) {
            if (!Ext.isEmpty(hashValue)) {
                checked = hashValue[0].get('checked');

                if (checked == true) {

                    //this for analizes the siblings. Modifies the checked value
                    for (var i = 0; i < parent.childNodes && checked; i++) {
                        var item = childNodes[i];
                        if (item.get('navTreeNodeId') == child.get('navTreeNodeId') && item.get('checked') == true) {
                            checked = false;
                        }
                    }

                    if (checked == true) {
                        //no sibling has a checked value;
                        if (parent.get('checked') == true) {
                            return true;
                        } else {
                            //fireevent
                            return false;
                        }
                    } else {
                        //a sibling has a checked value

                        //fireevent
                        return false;
                    }

                } else {
                    return false;
                }

            } else {

                checked = true;
                for (var i = 0; i < parent.childNodes && checked; i++) {
                    var item = childNodes[i];
                    if (item.get('navTreeNodeId') == child.get('navTreeNodeId') && item.get('checked') == true) {
                        checked = false;
                    }
                }

                if (checked == true) {
                    if (parent.get('checked') == true) {
                        return true;
                    } else {
                        return false;
                    }
                } else {
                    return false;
                }

            }
        } else {
            if (!Ext.isEmpty(hashValue)) {
                checked = hashValue[0].get('checked');

                if (checked != parent.get('checked')) {
                    fireevent = true;
                }
                return checked;

            } else {
                return parent.get('checked');
            }
        }
    },

    expandConsecutively: function (node) {
        var path = [];
        var mask = CMDBuildUI.util.Utilities.addLoadMask(this);
        this._mask = mask;

        while (!node.isRoot()) {
            path.unshift(node);
            node = node.parentNode;
        }

        var i = 0;
        this._expandConsecutively(i, path);
    },

    _expandConsecutively: function (i, path) {
        if (i < path.length) {
            this.getController().expandCMDBuildNode(path[i]).then(function () {
                path[i].expand();
                this._expandConsecutively(++i, path);
            }, Ext.emptyFn, Ext.emptyFn, this);
        } else {
            var tmpn = path[i - 1];
            if (tmpn) {
                CMDBuildUI.util.Utilities.removeLoadMask(this._mask);
                delete this._mask;

                this.ensureVisible(tmpn.getPath(), {
                    animate: true
                });
            }
        }
    }
});
