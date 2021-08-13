//TODO: Handle the loading of new records in the main store
Ext.define('CMDBuildUI.view.map.tab.cards.NavigationTreeController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.map-tab-cards-navigationtree',
    listen: {
        component: {
            '#': {
                beforerender: 'onBeforeRender',
                beforeselect: 'onBeforeSelect',
                selectionchange: 'onSelectionChange',
                itemexpand: 'onItemExpand',
                checkchange: 'onCheckChange',
                beforecellclick: 'onBeforeCellClick'
            }
        }
    },

    onBeforeRender: function (view) {

        this.getViewModel().bind({
            navigationtree: '{map-tab-tabpanel.navigationTree}',
            store: '{map-tab-cards-navigationtree.store}'
        }, function (data) {
            if (data.navigationtree && data.store) {
                var view = this.getView();
                var mask = CMDBuildUI.util.Utilities.addLoadMask(view);
                view.loadChildren(data.store.getRoot(), data.navigationtree.getRoot()).then(function () {
                    if (this.getView()) {
                        this.expandCMDBuildNode(data.store.getRoot()).then(function () {
                            this.onCheckChange(data.store.getRoot(), true);
                            this.getView().setInitialized(true);
                            CMDBuildUI.util.Utilities.removeLoadMask(mask);
                        }, Ext.emptyFn, Ext.emptyFn, this);
                    }
                }, Ext.emptyFn, Ext.emptyFn, this);
            }
        }, this);

        this.getViewModel().bind({
            attach_nav_tree_collection: '{map-tab-tabpanel.attach_nav_tree_collection}',
            initialized: '{map-tab-cards-navigationtree.initialized}'
        }, function (data) {
            if (data.attach_nav_tree_collection && data.initialized) {
                data.attach_nav_tree_collection.addListener('add', this.onCollectionAddHandler, this);
            }
        }, this);
    },

    onBeforeCellClick: function (view, td, cellIndex, record, tr, rowIndex, e, eOpts) {
        if (e.target.className.includes('checkbox')) {
            var checked = !record.get('checked');
            record.set('checked', checked)
            view.fireEventArgs('checkchange', [record, checked, e, eOpts])
            return false;
        }
    },
    /**
     * 
     * @param {Ext.selection.RowModel} view 
     * @param {*} record 
     * @param {*} index 
     * @param {*} eOpts 
     */
    onBeforeSelect: function (selectionmodel, record, index, eOpts) {
        var view = this.getView();
        var objectTypeName = view.getObjectTypeName();

        if (record.get('isIntermediate')) {
            return false;
        }

        return objectTypeName == record.get('type');
    },

    /**
     * 
     * @param {Ext.selection.Model} selectionmodel 
     * @param {[Ext.data.Model]} selected 
     * @param {*} index 
     */
    onSelectionChange: function (view, selected, eOpts) {
        var objectId = null;
        if (selected.length > 0) {
            objectId = Ext.num(selected[0].get('_id'));
        }

        this.getView().setObjectId(objectId);
    },

    /**
     * 
     * @param {*} collection 
     * @param {*} details 
     * @param {*} eOpts 
     */
    onCollectionAddHandler: function (collection, details, eOpts) {
        //stores nodes checked value
        var hashMap = this.getView().up('map-container').getHashMap();
        hashMap.beginUpdate();
        this.onCollectionAdd.call(this, details.items);
        hashMap.endUpdate();

    },

    /**
     * This function elaborates the new GeoValueTree elements wich must be added in the tree.
     * The function verifies if the records are yet in the tree, if they are the inserting is skipped otherwise they are inserted in the tree.
     * 
     * The function is called recursively until all items are added in the tree. 
     * NOTE: The item not added are stored and added late. The late insertion can be caused because the child we want to insert doesn't have the proper parent in the tree yet.
     * this is caused because the onCollectionAddHandler.details.items are sorted by the key and is not mantained the order given by the server.
     * @param {} items 
     */
    onCollectionAdd: function (items) {
        var itemsNotAdded = [];
        var nodeHashMap = this.getView().getNodeHashMap();

        Ext.Array.forEach(items, function (item, index, array) {

            var _id_composed = item.getId();

            if (nodeHashMap.get(_id_composed)) {
                return;
            } else {
                var navtreedef = item.getNavTreeNode();
                var _id_composed_parent = Ext.String.format('{0}-{1}', item.get('parentid'), navtreedef.getParent().getId());

                var pareentNode = nodeHashMap.get(_id_composed_parent);

                if (pareentNode) {
                    this.getView().insertNode(pareentNode, item);
                } else {
                    itemsNotAdded.push(item);
                }
                return;
            }
        }, this);

        if (items.length == itemsNotAdded.length) {
            console.log("attention, can't' add those elements: ", items);
            return;
        }

        if (itemsNotAdded.length) {
            this.onCollectionAdd.call(this, itemsNotAdded);
        }
    },

    /**
     * 
     * @param {*} node 
     * @param {*} menuDef 
     */
    expandCMDBuildNode: function (node) {
        var deferred = new Ext.Deferred();
        if (node.isIntermediate) {
            deferred.resolve();
            return deferred;
        }

        var promises = [];
        var childNode = node;
        // node.childNodes.forEach(function (childNode) {
        if (childNode._childrenloaded == undefined || childNode._childrenloaded == false) {

            var menudef = childNode.getNavTreeNode();
            // childNode._childrenloaded = true;
            menudef.childs().getRange().forEach(function (subChild) {
                var subChildNode;
                var addintermediate = subChild.get("subclassViewMode") === "subclasses" && subChild.get("subclassViewShowIntermediateNodes");
                if (addintermediate || (menudef.childs().getRange().length > 1 && subChild.get("subclassViewMode") === "cards")) {
                    var _id_composed = Ext.String.format('{0}-{1}-{2}-intermediate', childNode.get('_id'), subChild.getId(), childNode.get('type'));
                    subChildNode = childNode.findChild('_id_composed', _id_composed);

                    if (!subChildNode) {
                        subChildNode = childNode.appendChild({
                            description: subChild.get("_description_translation") || CMDBuildUI.util.helper.ModelHelper.getObjectDescription(subChild.get("targetClass")),
                            // _navtreedef: subChild,
                            leaf: true,
                            checked: childNode.get('checked'),
                            isIntermediate: true,
                            _id_composed: _id_composed,
                            _id: childNode.get('_id'),
                            type: subChild.get('targetClass')
                        });
                        subChildNode.setNavTreeNode(subChild);
                    }
                } else {
                    subChildNode = childNode;
                }


                if (subChild.get("subclassViewMode") === "subclasses") {
                    subChild.get("subclassFilter").split(',').forEach(function (subtype) {
                        var _id_composed = Ext.String.format('{0}-{1}-{2}-intermediate', subChildNode.get('_id'), subChild.getId(), subtype);
                        var subTypeChildNode = subChildNode.findChild('_id_composed', _id_composed);

                        if (!subTypeChildNode) {
                            var desc = subChild.get("_subclass_" + subtype + "_description_translation");
                            if (!desc) {
                                desc = CMDBuildUI.util.helper.ModelHelper.getObjectDescription(subtype);
                            }
                            subTypeChildNode = subChildNode.appendChild({
                                description: desc,
                                // _navtreedef: subChild,
                                leaf: true,
                                checked: subChildNode.get('checked'),
                                isIntermediate: true,
                                _id_composed: _id_composed,
                                _id: subChildNode.get('_id'),
                                type: subtype
                            });
                            subTypeChildNode.setNavTreeNode(subChild);
                        }
                        if (subTypeChildNode._childrenloaded == undefined || subTypeChildNode._childrenloaded == false) {
                            promises.push(this.getView().loadChildren(subTypeChildNode, subChild));
                        } else if (subTypeChildNode._childrenloade instanceof Ext.Deferred) {
                            promises.push(subTypeChildNode._childrenloaded);
                        }

                    }, this);
                } else {
                    if (subChildNode._childrenloaded == undefined || subChildNode._childrenloaded == false) {
                        promises.push(this.getView().loadChildren(subChildNode, subChild));
                    } else if (subChildNode._childrenloade instanceof Ext.Deferred) {
                        promises.push(subChildNode._childrenloaded);
                    }

                }
            }, this);
        } else if (childNode._childrenloaded instanceof Ext.Deferred) {
            promises.push(childNode._childrenloaded);
        }
        // }, this);

        if (promises.length != 0) {
            Ext.Promise.all(promises).then(function () {
                if (!node._childrenloaded) {
                    node._childrenLoaded = true;
                }
                deferred.resolve();
            }, Ext.emptyFn, Ext.emptyFn, this);
        } else {
            deferred.resolve();
        }
        return deferred.promise;
    },
    /**
     * Fired by user expanding the node
     * @param {*} node 
     * @param {*} eOpts 
     */
    onItemExpand: function (node, eOpts) {
        this.expandCMDBuildNode(node).then(function () { });

    },

    actionColumn: function (view, rowIndex, colIndex, item, e, record, row) {
        var objectType = CMDBuildUI.util.helper.ModelHelper.objecttypes.klass;
        var objectTypeName = record.get('type');
        var objectId = Ext.num(record.get('_id'));

        switch (objectType) {
            case CMDBuildUI.util.helper.ModelHelper.objecttypes.klass:
                if (this.getView().getObjectTypeName() == objectTypeName) {

                    if (!record.get('isIntermediate')) {
                        this.getView().setObjectId(objectId);
                    } else {
                        this.getView().setObjectId(null);
                    }

                } else {

                    var url;
                    if (!record.get('isIntermediate')) {
                        url = CMDBuildUI.util.Navigation.getClassBaseUrl(objectTypeName, objectId);
                    } else {
                        url = CMDBuildUI.util.Navigation.getClassBaseUrl(objectTypeName);
                    }

                    CMDBuildUI.util.Utilities.redirectTo(url);
                }
                break;
            default:
                CMDBuildUI.util.Logger.log(
                    Ext.String.format('Redirect from tree not implemented for type: {0}', data.objectType),
                    CMDBuildUI.util.Logger.levels.debug);
                break;
        }
    },

    onStoreUpdate: function (store, record, operation, modifiedFieldNames, details, eOpts) {

        //when record is added or checked field is modified
        if (!record.isRoot() && (!modifiedFieldNames || Ext.Array.contains(modifiedFieldNames, 'checked'))) {
            var navtreedef = record.item.getNavTreeNode();
            if (navtreedef.get('showOnlyOne') == true) {

                Ext.Array.forEach(record.parentNode.childNodes, function (item, array, index) {
                    var checked = record.get('checked');
                    if (item != record && item.getNavTreeNode() == navtreedef && checked == true) {
                        this.onCheckChange(item, false);
                    }
                }, this);
            }
        }
    },

    /**
     * 
     * @param {Ext.data.TreeModel} node 
     * @param {Boolean} checked 
     * @param {Ext.event.Event} e 
     * @param {Object} eOpts 
     */
    onCheckChange: function (node, checked, e, eOpts) {
        node.set('checked', !checked); //restores node check to not interupt this.downCheckChange first check
        var hashMap = this.getView().up('map-container').getHashMap();
        hashMap.beginUpdate();

        if (!node.isRoot() && !node.get('isIntermediate')) {
            //finds double occurencies for the node in the tree
            var nodeHashMap = this.getView().getNodeHashMap();
            var group = nodeHashMap.getGroups().get(node.get('_id'));

            Ext.Array.forEach(group.getRange(), function (node) {
                this.downCheckChange(node, checked, hashMap);
                this.upCheckChange(node, checked, hashMap);
            }, this);

        } else {
            this.downCheckChange(node, checked, hashMap);
            this.upCheckChange(node, checked, hashMap);
        }

        hashMap.endUpdate();
    },

    downCheckChange: function (node, checked, hashMap) {
        if (node.get('checked') == checked) {
            return;
        }

        node.set('checked', checked);
        var nodeHashMap = this.getView().getNodeHashMap();
        /**
         * sets the sigling to unchecked if needed
         */
        if (checked == true) {
            var navtreedef = node.getNavTreeNode();
            if (navtreedef && navtreedef.get('showOnlyOne') == true) {
                Ext.Array.forEach(node.parentNode.childNodes, function (item, array, index) {

                    if (item != node && item.getNavTreeNode() == navtreedef) {
                        var group = nodeHashMap.getGroups().get(item.get('_id'));
                        Ext.Array.forEach(group.getRange(), function (item) {
                            this.downCheckChange(item, false, hashMap);
                        }, this);
                    }
                }, this);
            }
        }

        if (!node.get('isIntermediate')) {
            hashMap.add(node.get('_id'), checked);
        }

        var firstShowOnlyOne = {};
        node.eachChild(function (child) {
            if (!child.get('isIntermediate')) {

                //finds double occurencies for the child in the tree

                var group = nodeHashMap.getGroups().get(child.get('_id'));
                if (group) {

                    var childs = group.getRange();

                    Ext.Array.forEach(childs, function (child) {
                        var navtreedef = child.getNavTreeNode();
                        if (navtreedef.get('showOnlyOne') == true) {
                            if (!firstShowOnlyOne[navtreedef.getId()]) {
                                if (checked == true) {
                                    firstShowOnlyOne[navtreedef.getId()] = true;
                                    this.downCheckChange(child, true, hashMap);
                                    this.upCheckChange(child, true, hashMap);

                                } else {
                                    this.downCheckChange(child, false, hashMap);
                                    this.upCheckChange(child, false, hashMap);
                                }

                            } else {
                                if (checked == true) {
                                    this.downCheckChange(child, false, hashMap);
                                    this.upCheckChange(child, false, hashMap);
                                } else {
                                    this.downCheckChange(child, false, hashMap);
                                    this.upCheckChange(child, false, hashMap);
                                }
                            }
                        } else {
                            this.downCheckChange(child, checked, hashMap);
                            this.upCheckChange(child, checked, hashMap);
                        }

                    }, this);
                } else {
                    console.log('group not found');
                }

            } else {
                this.downCheckChange(child, checked, hashMap);
                this.upCheckChange(child, checked, hashMap);
            }
        }, this);
    },

    upCheckChange: function (node, checked, hashMap) {
        if (checked == true) {
            node.set('checked', checked);
            if (!node.get('isIntermediate')) {
                hashMap.add(node.get('_id'), checked);
            }
            var parent = node.parentNode;

            var navtreedef = node.getNavTreeNode();
            if (navtreedef && navtreedef.get('showOnlyOne') == true) {
                var nodeHashMap = this.getView().getNodeHashMap();

                Ext.Array.forEach(parent.childNodes, function (item) {
                    if (item != node && item.getNavTreeNode() == navtreedef && item.get('checked') == true) {

                        var group = nodeHashMap.getGroups().get(item.get('_id'));
                        Ext.Array.forEach(group.getRange(), function (item) {
                            this.downCheckChange(item, false, hashMap);
                        }, this);
                    }
                }, this);
            }

            if (parent) {
                this.upCheckChange(parent, checked, hashMap);
            }
        }
    }
});
