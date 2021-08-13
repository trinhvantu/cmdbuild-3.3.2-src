Ext.define('CMDBuildUI.view.relations.masterdetail.TabPanelController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.relations-masterdetail-tabpanel',

    control: {
        '#': {
            added: 'onAdded',
            beforerender: 'onBeforeRender',
            activate: 'onActivate'
        }
    },

    /**
     * Refresh data on tab activate event
     * 
     * @param {CMDBuildUI.view.relations.masterdetail.TabPanelContainer} view 
     * @param {Object} eOpts 
     */
    onActivate: function (view, eOpts) {
        view.items.items.forEach(function (tab) {
            var store = tab.getViewModel().get('records');
            if (store && !store.isLoading() && store.isLoaded()) {
                store.load();
            }
        });
    },

    /**
     * 
     * @param {CMDBuildUI.view.relations.masterdetail.TabPanel} view 
     * @param {Ext.container.Container} container 
     * @param {Number} position 
     * @param {Object} eOpts 
     */
    onAdded: function (view, container, position, eOpts) {
        var vm = view.lookupViewModel();
        var item = CMDBuildUI.util.helper.ModelHelper.getObjectFromName(
            vm.get("objectTypeName"),
            vm.get("objectType")
        );
        var mddomains = [];

        // load domains and fk domains
        Ext.Promise.all([
            item.getDomains(),
            item.getFkDomains()
        ]).then(function (results) {
            var domains = results[0];
            var fkdomains = results[1];

            // add domains
            domains.getRange().forEach(function (d) {
                if (d.get("isMasterDetail")) {
                    if (d.get("cardinality") === CMDBuildUI.model.domains.Domain.cardinalities.onetomany && Ext.Array.contains(item.getHierarchy(), d.get("source"))) {
                        // d.set("index", d.get("indexDirect"));
                        mddomains.push(d);
                    } else if (d.get("cardinality") === CMDBuildUI.model.domains.Domain.cardinalities.manytoone && Ext.Array.contains(item.getHierarchy(), d.get("destination"))) {
                        // d.set("index", d.get("indexInverse"));
                        mddomains.push(d);
                    }
                }
            });

            // add fk domains
            fkdomains.getRange().forEach(function (fd) {
                if (fd.get("isMasterDetail")) {
                    fd.set("index", mddomains.length);
                    mddomains.push(fd);
                }
            });

            // sort domains
            Ext.Array.sort(mddomains, function (a, b) {
                if (a.get("index") < b.get("index")) {
                    return -1;
                } else if (a.get("index") > b.get("index")) {
                    return 1;
                }
                return 0;
            });

            if (!vm.destroyed) {
                // set in view model
                vm.set("mddomains", mddomains);
                if (!mddomains.length) {
                    view.disable();
                }
            }
        });
    },

    /**
     * @param {CMDBuildUI.view.relations.masterdetail.TabPanel} view
     * @param {Object} eOpts
     */
    onBeforeRender: function (view, eOpts) {
        var vm = this.getViewModel();
        vm.bind({
            bindTo: '{mddomains.length}'
        }, function (length) {
            var tabs = [];
            vm.get("mddomains").forEach(function (d) {
                var targetTypeName, targetType, isProcess, index;
                if (d.get("cardinality") === CMDBuildUI.model.domains.Domain.cardinalities.onetomany) {
                    targetTypeName = d.get("destination");
                    isProcess = d.get("destinationProcess");
                } else if (d.get("cardinality") === CMDBuildUI.model.domains.Domain.cardinalities.manytoone) {
                    targetTypeName = d.get("source");
                    isProcess = d.get("sourceProcess");
                }
                targetType = isProcess ? CMDBuildUI.util.helper.ModelHelper.objecttypes.process : CMDBuildUI.util.helper.ModelHelper.objecttypes.klass;
                var item = CMDBuildUI.util.helper.ModelHelper.getObjectFromName(targetTypeName, targetType);
                if (item) {
                    // add tab panel
                    tabs.push({
                        xtype: 'relations-masterdetail-tab',
                        index: d.get("index"),
                        readOnly: view.getReadOnly(),
                        viewModel: {
                            type: 'relations-masterdetail-tab',
                            data: {
                                domain: d,
                                targetType: isProcess ? CMDBuildUI.util.helper.ModelHelper.objecttypes.process : CMDBuildUI.util.helper.ModelHelper.objecttypes.klass,
                                targetTypeName: targetTypeName
                            }
                        }
                    });
                } else {
                    CMDBuildUI.util.Logger.log(
                        "Cannot add MD tab for domain " + d.get("name"),
                        CMDBuildUI.util.Logger.levels.warn
                    );
                }
            });
            tabs.sort(function (a, b) {
                return a.index === b.index ? 0 : (a.index < b.index ? -1 : 1);
            });
            view.add(tabs);
            view.setActiveTab(0);
        });
    }

});