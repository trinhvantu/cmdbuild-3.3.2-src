Ext.define('CMDBuildUI.view.relations.list.ContainerController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.relations-list-container',

    control: {
        '#': {
            beforerender: 'onBeforeRender',
            activate: 'onActivate'
        },
        '#addrelationbtn': {
            beforerender: 'onAddRelationBtnBeforeRender'
        },
        '#openrelgraphbtn': {
            click: 'onOpenRelgrapBtnClick'
        },
        '#showextendedfield': {
            beforerender: 'onShowExtendedFieldBeforeRender',
            change: 'onShowExtendedFieldChange'
        }
    },

    /**
     * Refresh data on tab activate event
     * 
     * @param {CMDBuildUI.view.relations.list.Container} view 
     * @param {Object} eOpts 
     */
    onActivate: function (view, eOpts) {
        var vm = view.lookupViewModel();
        if (vm.get("allRelations") && !vm.get("allRelations").isLoading() && vm.get("allRelations").isLoaded()) {
            vm.get("allRelations").load();
        }
    },

    /**
     * @param {CMDBuildUI.view.relations.list.Container} view
     * @param {Object} eOpts
     */
    onBeforeRender: function (view, eOpts) {
        var me = this;
        view.lookupViewModel().bind({
            bindTo: '{domains}'
        }, function (data) {
            if (CMDBuildUI.util.Navigation.getCurrentContext().extendedrels) {
                me.addFieldsets();
            } else {
                me.addRelationsGrid();
            }
        });
    },

    /**
     * @param {Ext.button.Button} button Add relation button
     * @param {Object} eOpts
     */
    onAddRelationBtnBeforeRender: function (button) {
        var vm = this.getViewModel();

        var object = CMDBuildUI.util.helper.ModelHelper.getObjectFromName(vm.get("objectTypeName"), vm.get("objectType"));
        var objectHierarchy = object.getHierarchy();

        /**
         * 
         * @param {String} description Relation description
         * @param {String} type The name of the target type
         * @param {Object} domain Domain definition
         * @param {String} direction forward|backward
         */
        function createMenuItem(description, type, domain, direction) {
            var item = CMDBuildUI.util.helper.ModelHelper.getClassFromName(type);
            if (item) {
                return {
                    text: Ext.String.format('{0} ({1})', description, item.getTranslatedDescription()),
                    iconCls: 'x-fa fa-file-text-o',
                    listeners: {
                        click: 'onAddRelationMenuItemClick'
                    },
                    type: type,
                    domain: domain,
                    disabled: !item.get(CMDBuildUI.model.base.Base.permissions.edit),
                    direction: direction
                };
            }
        }

        object.getDomains().then(function (domains) {
            var menu = [];

            vm.bind({
                bindTo: {
                    canedit: '{basepermissions.edit}'
                }
            }, function (data) {
                // disable add relation button
                if (data.canedit && domains.getTotalCount() > 0) {
                    vm.set("addbtn.disabled", false);
                }
            });

            vm.setStores({
                domains: domains
            });

            domains.each(function (domain) {

                if (
                    Ext.Array.contains(objectHierarchy, domain.get("source")) &&
                    !Ext.Array.contains(domain.get('disabledSourceDescendants'), vm.get("objectTypeName")) &&
                    !domain.get("destinationProcess")
                ) {


                    menu.push(createMenuItem(domain.getTranslatedDescriptionDirect(), domain.get("destination"), domain, 'direct'));
                }

                if (
                    Ext.Array.contains(objectHierarchy, domain.get("destination")) &&
                    !Ext.Array.contains(domain.get('disabledDestinationDescendants'), vm.get("objectTypeName")) &&
                    !domain.get("sourceProcess")
                ) {

                    menu.push(createMenuItem(domain.getTranslatedDescriptionInverse(), domain.get("source"), domain, 'inverse'));
                }
            });
            button.setMenu(menu);
        });
    },

    /**
     * @param {Ext.menu.Item} item
     * @param {Ext.event.Event} e
     * @param {Object} eOpts
     */
    onAddRelationMenuItemClick: function (item, e, eOpts) {
        var vm = this.getViewModel(),
            me = this;
        var view = this.getView();
        var multiselect = item.domain.get("cardinality") === CMDBuildUI.model.domains.Domain.cardinalities.manytomany || (item.direction == 'inverse' && item.domain.get("cardinality") == CMDBuildUI.model.domains.Domain.cardinalities.manytoone) || (item.direction == 'direct' && item.domain.get("cardinality") == CMDBuildUI.model.domains.Domain.cardinalities.onetomany);
        CMDBuildUI.util.helper.ModelHelper.getModel('class', item.type).then(function (model) {
            var popup;
            var title = item.text;
            var config = {
                xtype: 'relations-list-add-container',
                originTypeName: vm.get("objectTypeName"),
                originId: vm.get("objectId"),
                multiSelect: multiselect,
                viewModel: {
                    data: {
                        objectTypeName: item.type,
                        relationDirection: item.direction,
                        theDomain: item.domain
                    }
                },
                listeners: {
                    popupclose: function () {
                        popup.removeAll(true);
                        popup.close();
                    }
                },
                onSaveSuccess: function () {
                    view.down('relations-list-grid').getStore().reload();
                    me.reloadFieldsetsGrids();
                }
            };

            popup = CMDBuildUI.util.Utilities.openPopup('popup-add-relation', title, config, null);

        });
    },

    /**
     * 
     * @param {Ext.button.Button} button 
     * @param {Ext.event.Event} event 
     * @param {Object} e 
     */
    onOpenRelgrapBtnClick: function (button, event, e) {
        var vm = button.lookupViewModel();
        CMDBuildUI.util.Ajax.setActionId("class.card.relgraph.open");
        CMDBuildUI.util.Utilities.openPopup('graphPopup', CMDBuildUI.locales.Locales.relationGraph.relationGraph, {
            xtype: 'graph-graphcontainer',
            _id: vm.get("objectId"),
            _type: vm.get("objectTypeName")
        });
    },

    /**
     * 
     * @param {Ext.form.field.CheckBox} field 
     * @param {*} eOpts 
     */
    onShowExtendedFieldBeforeRender: function(field, eOpts) {
        field.setValue(CMDBuildUI.util.Navigation.getCurrentContext().extendedrels);
    },
    /**
     * 
     * @param {Ext.form.field.CheckBox} field 
     * @param {Boolean} value 
     * @param {Object} eOpts 
     */
    onShowExtendedFieldChange: function (field, value, eOpts) {
        if (value) {
            this.addFieldsets();
        } else {
            this.addRelationsGrid();
        }
        CMDBuildUI.util.Navigation.getCurrentContext().extendedrels = value;
    },

    privates: {
        addRelationsGrid: function () {
            var view = this.getView(),
                panelref = 'relallrelsgrid',
                panel = view.lookupReference(panelref);
            if (!panel) {
                panel = view.add({
                    xtype: 'container',
                    reference: panelref
                })
                panel.add({
                    xtype: 'relations-list-grid'
                });
            }
            view.setActiveItem(panel);
        },

        addFieldsets: function () {
            var view = this.getView(),
                vm = view.lookupViewModel(),
                panelref = 'relfieldsetscontainer',
                panel = view.lookupReference(panelref);
            if (!panel) {
                var vm = view.lookupViewModel();
                var object = CMDBuildUI.util.helper.ModelHelper.getObjectFromName(vm.get("objectTypeName"), vm.get("objectType")),
                    objectHierarchy = object.getHierarchy();

                panel = view.add({
                    xtype: 'container',
                    reference: panelref
                });
                var loader;
                Ext.asap(function() {
                    loader = CMDBuildUI.util.Utilities.addLoadMask(panel);
                });
                object.getDomains().then(function (domains) {
                    vm.set("counters.domains", domains.getTotalCount());
                    domains.getRange().forEach(function (domain) {
                        function addfieldset(direction) {
                            panel.add(Ext.applyIf({
                                xtype: 'relations-list-expanded-fieldset',
                                viewModel: {
                                    data: {
                                        domain: domain,
                                        direction: direction
                                    }
                                }
                            }));
                        }
                        if (Ext.Array.contains(objectHierarchy, domain.get("source"))) {
                            addfieldset("_2");
                        }
                        if (Ext.Array.contains(objectHierarchy, domain.get("destination"))) {
                            addfieldset("_1");
                        }
                    });
                });

                var bind = vm.bind({
                    bindTo: {
                        domainscount: '{counters.domains}',
                        storescounter: '{counters.stores}'
                    }
                }, function(data) {
                    if (data.storescounter >= data.domainscount) {
                        CMDBuildUI.util.Utilities.removeLoadMask(loader);
                        bind.destroy();
                    }
                });
            }
            view.setActiveItem(panel);
        },

        /**
         * Reload relation grids on fieldsets
         * 
         */
        reloadFieldsetsGrids: function() {
            var view = this.getView(),
                panel = view.lookupReference('relfieldsetscontainer');
            if (panel) {
                panel.items.items.forEach(function(fieldset) {
                    fieldset.lookupViewModel().get("records").load();
                });
            }
        }
    }

});