Ext.define('CMDBuildUI.view.management.navigation.TreeController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.management-navigation-tree',

    listen: {
        global: {
            objecttypechanged: 'onObjectTypeNameChanged'
        }
    },

    control: {
        '#': {
            selectionchange: "onSelectionChange",
            itemexpand: 'onItemExpand'
        }
    },

    /**
     * Item click listener.
     * 
     * @param {Ext.event.Event} event    The Ext.event.Event encapsulating the DOM event.
     * @param {HTMLElement} element      The target of the event.
     * @param {Object} eOpts             The options object passed to Ext.util.Observable.addListener.
     */
    onItemClick: function (event, element, eOpts) {
        var view = Ext.get(element).component;
        if (view) {
            var node = view.getNode();
            var url;
            var menutype = node.get("menutype");
            if (menutype !== CMDBuildUI.model.menu.MenuItem.types.folder) {
                switch (menutype) {
                    case CMDBuildUI.model.menu.MenuItem.types.klass:
                        url = 'classes/' + node.get("objecttypename") + '/cards';
                        break;
                    case CMDBuildUI.model.menu.MenuItem.types.process:
                        url = 'processes/' + node.get("objecttypename") + '/instances';
                        break;
                    case CMDBuildUI.model.menu.MenuItem.types.custompage:
                        url = 'custompages/' + node.get("objecttypename");
                        break;
                    case CMDBuildUI.model.menu.MenuItem.types.report:
                        url = 'reports/' + node.get("objecttypename");
                        break;
                    case CMDBuildUI.model.menu.MenuItem.types.reportpdf:
                        url = 'reports/' + node.get("objecttypename") + '/pdf';
                        break;
                    case CMDBuildUI.model.menu.MenuItem.types.reportcsv:
                        url = 'reports/' + node.get("objecttypename") + '/csv';
                        break;
                    case CMDBuildUI.model.menu.MenuItem.types.view:
                        url = 'views/' + node.get("objecttypename") + '/items';
                        break;
                    case CMDBuildUI.model.menu.MenuItem.types.dashboard:
                        url = 'dashboards/' + node.get("objecttypename");
                        break;
                    case CMDBuildUI.model.menu.MenuItem.types.calendar:
                        url = 'events';
                        break;
                    case CMDBuildUI.model.menu.MenuItem.types.navtree:
                    case CMDBuildUI.model.menu.MenuItem.types.navtreeitem:
                        url = 'navigation/' + node.get("objecttypename");
                        break;
                    default:
                        CMDBuildUI.util.Msg.alert('Warning', 'Menu type not implemented!');
                }
            }

            if (url !== undefined) {
                CMDBuildUI.util.Navigation.clearCurrentContext();
                CMDBuildUI.util.Navigation.updateCurrentRowTab();
                this.redirectTo(url);
            }
        }
    },

    /**
     * Item double click listener.
     * 
     * @param {Ext.event.Event} event    The Ext.event.Event encapsulating the DOM event.
     * @param {HTMLElement} element      The target of the event.
     * @param {Object} eOpts             The options object passed to Ext.util.Observable.addListener.
     */
    onItemDblClick: function (event, element, eOpts) {
        var view = Ext.get(element).component;
        if (!(view && view.getExpandable())) {
            event.stopEvent();
            return false;
        }
        if (!view.isExpanded()) {
            view.expand();
        } else {
            view.collapse();
        }
    },

    /**
     * Update navigation selection
     * @param {String} newobjecttypename
     */
    onObjectTypeNameChanged: function (newobjecttypename) {
        var vm = this.getViewModel();
        var selected = vm.get("selected");
        var objecttype = CMDBuildUI.util.Navigation.getCurrentContext().objectType;
        if (!selected || selected.get("objecttypename") !== newobjecttypename || CMDBuildUI.model.menu.MenuItem.objecttypes[selected.get('menutype')] != objecttype) {
            vm.bind({
                bindTo: '{menuItems}'
            }, function (store) {
                function recursive(node, fn, scope) {
                    var rn = fn.call(scope, node);
                    if (rn) {
                        return rn;
                    }

                    for (var i = 0; i < node.childNodes.length && !rn; i++) {
                        rn = recursive(node.childNodes[i], fn, scope);
                    }
                    return rn;
                }

                var context = CMDBuildUI.util.Navigation.getCurrentContext();
                var newselected = recursive(store.getRoot(), function (record) {
                    if (record.get('objecttypename') == context.objectTypeName && CMDBuildUI.model.menu.MenuItem.objecttypes[record.get('menutype')] == context.objectType) {
                        return record;
                    }
                }, this);

                // compares the actual selection with the new found
                var selection = this.getView().getSelection()
                if (selection && newselected && selection.get('menutype') == newselected.get('menutype') && selection.get('objecttypename') == newselected.get('objecttypename')) {
                    return;
                }

                newselected ? newselected : null;
                vm.set("selected", newselected);
            });
        }
    },

    /**
     * @param {Ext.list.Tree} view
     * @param {Ext.data.TreeModel} record
     * @param {Object} eOpts
     */
    onSelectionChange: function (view, record, eOpts) {
        // expand nodes
        var node = view.getItem(record);

        if (
            (record.get("menutype") === CMDBuildUI.model.menu.MenuItem.types.navtree ||
                record.get("menutype") === CMDBuildUI.model.menu.MenuItem.types.navtreeitem) &&
            record.get("_targettypename") &&
            record.getId() !== view._currentNode
        ) {
            view._currentNode = node.getId();
            Ext.asap(function () {
                Ext.GlobalEvents.fireEventArgs("menunavtreeitemchanged", [record]);
            });
        }

        if (node) { // workaround for #622
            this.expandNodeHierarchy(node);
        }
    },

    onItemExpand: function (view, item) {
        var menutype = item.getNode().get("menutype");
        if (
            menutype === CMDBuildUI.model.menu.MenuItem.types.navtree ||
            menutype === CMDBuildUI.model.menu.MenuItem.types.navtreeitem
        ) {
            var node = item.getNode();
            // node.childNodes.forEach(function (childNode) {
            var childNode = node;
            if (!childNode._childrenloaded) {

                var menudef = childNode.get("_navtreedef");
                childNode._childrenloaded = true;
                menudef.childNodes.forEach(function (subChild) {
                    var subChildNode;
                    var addintermediate =
                        subChild.get("subclassViewMode") === "subclasses" &&
                        subChild.get("subclassViewShowIntermediateNodes");

                    // get label
                    var label = subChild.get("_description_translation");
                    if (!label) {
                        label = CMDBuildUI.util.helper.ModelHelper.getObjectDescription(subChild.get("targetClass"));
                    }
                    if (
                        addintermediate ||
                        (menudef.childNodes.length > 1 && subChild.get("subclassViewMode") === "cards")
                    ) {
                        // create type node
                        subChildNode = childNode.appendChild({
                            menutype: CMDBuildUI.model.menu.MenuItem.types.navtreeitem,
                            objectdescription: label,
                            objecttypename: childNode.get("objecttypename"),
                            _objectid: childNode.get("_objectid"),
                            _objecttype: childNode.get("_objecttype"),
                            _objectdescription: childNode.get("_objectdescription"),
                            _navtreedef: subChild,
                            _targettypename: subChild.get('targetClass'),
                            leaf: true
                        });
                    } else {
                        subChildNode = childNode;
                    }

                    if (subChild.get("subclassViewMode") === "subclasses") {
                        subChildNode._childrenloaded = true;
                        subChild.get("subclassFilter").split(',').forEach(function (subtype) {
                            // create sub-type node
                            var desc = subChild.get("_subclass_" + subtype + "_description_translation");
                            if (!desc) {
                                desc = CMDBuildUI.util.helper.ModelHelper.getObjectDescription(subtype);
                            }
                            subTypeChildNode = subChildNode.appendChild({
                                menutype: CMDBuildUI.model.menu.MenuItem.types.navtreeitem,
                                objectdescription: desc,
                                objecttypename: subChildNode.get("objecttypename"),
                                _objectid: subChildNode.get("_objectid"),
                                _objecttype: subChildNode.get("_objecttype"),
                                _objectdescription: subChildNode.get("_objectdescription"),
                                _navtreedef: subChild,
                                _targettypename: subtype,
                                leaf: true
                            });
                            // load children
                            CMDBuildUI.view.management.navigation.Utils.loadChildren(
                                subTypeChildNode,
                                subChild, {
                                overrideTargetTypeName: subtype,
                                label: desc
                            });
                        });
                    } else {
                        // load children
                        CMDBuildUI.view.management.navigation.Utils.loadChildren(
                            subChildNode,
                            subChild, {
                            label: label
                        });
                    }
                });
            }
            // });
        }
    },

    privates: {
        expandNodeHierarchy: function (node) {
            node.expand();
            if (node.getParentItem()) {
                this.expandNodeHierarchy(node.getParentItem());
            }
        }
    }

});