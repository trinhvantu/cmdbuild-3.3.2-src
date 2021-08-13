Ext.define('CMDBuildUI.view.management.navigation.Utils', {
    singleton: true,

    /**
     * 
     * @param {*} nodeRecord Menu node
     */
    navtreeAddFirstLevel: function (nodeRecord, treeitem) {
        var treestore = Ext.create("CMDBuildUI.store.menu.MenuTreeItem", {
            defaultRootId: nodeRecord.get("objecttypename")
        });

        // CMDBuildUI.model.navigationTrees.DomainTree.load(nodeRecord.get("objectTypeName"), {
        treestore.load({
            callback: function (records, operation, success) {
                if (success) {
                    var root = records[0];

                    nodeRecord.set("_navtreedef", root);
                    nodeRecord.set('_targettypename', root.get('targetClass'));
                    CMDBuildUI.view.management.navigation.Utils.loadChildren(
                        nodeRecord,
                        root, {
                        fireNavigationItemChange: treeitem.getSelected()
                    });
                }
            }
        });
    },

    /**
     * 
     * @param {*} node Menu node
     * @param {*} navtreedef Navigation tree definition node
     * @param {Object} config 
     * @param {String} config.overrideTargetTypeName
     * @param {String} config.label
     * @param {Boolean} config.fireNavigationItemChange
     */
    loadChildren: function (node, navtreedef, config) {
        node._childrenloaded = true;

        config = config || {};

        // get config
        var targetTypeName = config.overrideTargetTypeName || navtreedef.get("targetClass");
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
                source: node.get("_objecttype"),
                destination: targetTypeName,
                direction: navtreedef.get("direction"),
                type: "oneof",
                cards: [{
                    className: node.get("_objecttype"),
                    id: node.get("_objectid")
                }]
            }];
        }
        // add cql filter
        if (navtreedef.get("ecqlFilter")) {
            filter.ecql = {
                id: navtreedef.get("ecqlFilter").id
            }
        }
        // filter by sub-types
        if (navtreedef.get("subclassViewMode") === 'cards' && !Ext.isEmpty(navtreedef.get("subclassFilter"))) {
            filter.attributes = {
                IdClass: [{
                    operator: 'in',
                    value: navtreedef.get("subclassFilter").split(",")
                }]
            };
        }

        // set the filter on parent node
        node.set("_storefilter", filter);
        node.set("_targettype", targetType);
        node.set("_targettypename", targetTypeName);
        node.set("_label", config.label);

        // fire event when application open on navtree menu item
        if (config.fireNavigationItemChange) {
            Ext.GlobalEvents.fireEventArgs("menunavtreeitemchanged", [node]);
        }

        // load child data only if it has children
        if (navtreedef.childNodes.length) {
            var sorters = [],
                item = CMDBuildUI.util.helper.ModelHelper.getObjectFromName(targetTypeName, targetType);
            if (item) {
                item.defaultOrder().getRange().forEach(function (o) {
                    sorters.push({
                        property: o.get("attribute"),
                        direction: o.get("direction") === "descending" ? "DESC" : 'ASC'
                    });
                });
            }

            if (Ext.isEmpty(sorters)) {
                sorters = [{
                    property: "Description"
                }];
            }

            // create temp store 
            var childrenstore = Ext.create("Ext.data.Store", {
                fields: ['_id', '_type', 'Description'],
                proxy: {
                    type: 'baseproxy',
                    url: path,
                    extraParams: {
                        attrs: 'Id,Description,IdClass'
                    }
                },
                advancedFilter: filter,
                pageSize: 0,
                remoteSort: true,
                sorters: sorters
            });


            // load store
            childrenstore.load({
                callback: function (records, operation, success) {
                    if (success) {
                        function isFolderType(navtreedef) {
                            var returned = false;
                            navtreedef.childNodes.forEach(function (subChild) {

                                var addintermediate = subChild.get("subclassViewMode") === "subclasses" &&
                                    subChild.get("subclassViewShowIntermediateNodes");

                                if (
                                    addintermediate ||
                                    (navtreedef.childNodes.length > 1 && subChild.get("subclassViewMode") === "cards")
                                ) {
                                    returned = true;
                                }
                            });

                            return returned;

                        }

                        var type = isFolderType(navtreedef);
                        // append items to the node
                        records.forEach(function (r) {
                            node.appendChild({
                                menutype: CMDBuildUI.model.menu.MenuItem.types.navtreeitem,
                                objectdescription: r.get("Description"),
                                objecttypename: node.get("objecttypename"),
                                _objectid: r.get("_id"),
                                _objecttype: r.get("_type"),
                                _objectdescription: r.get("Description"),
                                _navtreedef: navtreedef,
                                _targettypename: type ? null : targetTypeName,
                                leaf: false
                            });
                        });
                    }
                    // delete item after its usage
                    Ext.asap(function () {
                        childrenstore.destroy();
                    });
                },
                scope: this
            });


        }
    }
});