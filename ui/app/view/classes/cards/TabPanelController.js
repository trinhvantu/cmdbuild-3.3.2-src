Ext.define('CMDBuildUI.view.classes.cards.TabPanelController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.classes-cards-tabpanel',

    control: {
        '#': {
            beforerender: 'onBeforeRender',
            tabchange: 'onTabChange'
        },
        '#opentool': {
            click: 'onOpenToolClick'
        },
        '#editBtn': {
            click: 'onEditBtnClick'
        },
        '#deleteBtn': {
            click: 'onDeleteBtnClick'
        },
        '#cloneMenuBtn': {
            click: 'onCloneMenuBtnClick'
        },
        '#printBtn': {
            click: 'onPrintBtnClick'
        },
        '#relgraphBtn': {
            click: 'onRelationGraphBtnClick'
        },
        '#bimBtn': {
            click: 'onBimButtonClick'
        },
        '#helpBtn': {
            click: 'onHelpBtnClick'
        }
    },

    /**
     * @param {CMDBuildUI.view.classes.cards.TabPanel} view
     * @param {Object} eOpts
     */
    onBeforeRender: function (view, eOpts) {
        // set view model variables
        var me = this,
            vm = view.lookupViewModel(),
            readonly = view.getReadOnlyTabs();

        // set objectTypeName and objectId for inline-view
        if (!vm.get("objectTypeName") && !vm.get("objectId")) {
            var config = view.getInitialConfig();
            if (!Ext.isEmpty(config._rowContext)) {
                var record = config._rowContext.record; // get widget record
                if (record && record.getData()) {
                    vm.set("objectTypeName", record.getRecordType());
                    vm.set("objectId", record.getRecordId());
                }
            }
        }

        // define action
        var action;
        if (readonly) {
            vm.set("action", CMDBuildUI.mixins.DetailsTabPanel.actions.readonly);
            action = CMDBuildUI.util.Navigation.getCurrentRowTab();
        } else {
            action = vm.get("action");
        }

        // load the object
        var objectTypeName = vm.get("objectTypeName"),
            objectId = vm.get("objectId");
        if (objectTypeName) {
            CMDBuildUI.util.helper.ModelHelper.getModel(
                CMDBuildUI.util.helper.ModelHelper.objecttypes.klass,
                objectTypeName
            ).then(function (model) {
                vm.set("objectModel", model);

                if (
                    objectId && 
                    action !== CMDBuildUI.mixins.DetailsTabPanel.actions.clone &&
                    action !== CMDBuildUI.mixins.DetailsTabPanel.actions.clonecardandrelations
                ) {
                    vm.linkTo("theObject", {
                        type: model.getName(),
                        id: objectId
                    });
                } else {
                    vm.linkTo("theObject", {
                        type: model.getName(),
                        create: {
                            _type: objectTypeName
                        }
                    });
                }
            });
        }

        // if panel is shown in detail window
        if (view.isInDetailWindow()) {
            // update url on window close
            view.mon(
                CMDBuildUI.util.Navigation.getManagementDetailsWindow(),
                'beforeclose',
                this.onManagementDetailsWindowBeforeClose,
                this
            );
        } else {
            var height = CMDBuildUI.util.helper.Configurations.get(CMDBuildUI.model.Configuration.ui.inlinecard.height);
            view.setHeight(view.up().getHeight() * height / 100);
        }

        vm.bind({
            bindTo: '{theObject}',
            single: true
        }, function (theObject) {
            me.addTabs(view, theObject, action, readonly);
        });

    },

    /**
     * @param {CMDBuildUI.view.classes.cards.TabPanel} view
     * @param {Ext.Component} newtab
     * @param {Ext.Component} oldtab
     * @param {Object} eOpts
     */
    onTabChange: function (view, newtab, oldtab, eOpts) {
        if (newtab && newtab.tabAction) {
            view.lookupViewModel().set("activetab", newtab.tabAction)
        }

        if (view.isInDetailWindow()) {
            CMDBuildUI.util.Navigation.updateCurrentManagementContextAction(newtab.tabAction);
            this.getViewModel().getParent().set("actionDescription", newtab.tabConfig.tooltip);
            CMDBuildUI.util.Ajax.setActionId("class.card." + newtab.tabAction + ".open");
            this.redirectTo(this.getBasePath() + '/' + newtab.tabAction);
        } else if (this.getOpenTool()) {
            var tool = this.getOpenTool();

            // update action
            tool.action = newtab.tabAction;
            CMDBuildUI.util.Navigation.updateCurrentRowTab(newtab.tabAction);

            // update tooltip
            var toolel = tool.getEl();
            if (toolel) {
                var tooltip = Ext.String.format(
                    "{0} {1}",
                    CMDBuildUI.locales.Locales.common.actions.open,
                    newtab.tabConfig.title
                );
                toolel.set({
                    "data-qtip": tooltip,
                    "aria-label": tooltip
                });
            }
        }
    },

    /**
     * On management details windows close
     */
    onManagementDetailsWindowBeforeClose: function () {
        CMDBuildUI.util.Navigation.updateCurrentManagementContextAction(undefined);
        CMDBuildUI.util.Utilities.redirectTo(this.getBasePath());
    },

    /**
     * On close tool click
     */
    onClooseToolClick: function () {
        CMDBuildUI.util.Utilities.redirectTo(this.getBasePath());
    },

    /**
     * 
     * @param {Ext.panel.Tool} tool 
     * @param {Ext.event.Event} e 
     * @param {Ext.Component} owner 
     * @param {Object} eOpts 
     */
    onOpenToolClick: function (tool, e, owner, eOpts) {
        this.redirectTo(Ext.String.format("{0}/{1}", this.getBasePath(), tool.action));
    },

    /**
     * Triggered on edit tool click.
     * 
     * @param {Ext.panel.Tool} tool
     * @param {Ext.Event} event
     * @param {Object} eOpts
     */
    onEditBtnClick: function (tool, event, eOpts) {
        CMDBuildUI.util.Ajax.setActionId("class.card.edit");
        this.redirectTo(this.getBasePath() + '/edit', true);
    },

    /**
     * Triggered on delete tool click.
     * 
     * @param {Ext.panel.Tool} tool
     * @param {Ext.Event} event
     * @param {Object} eOpts
     */
    onDeleteBtnClick: function (tool, event, eOpts) {
        var view = this.getView();
        var vm = view.lookupViewModel();
        var objectTypeName = vm.get("objectTypeName");
        var objectType = vm.get("objectType");

        var executetriggers = view.down("classes-cards-card-view").executeFormTriggers;
        CMDBuildUI.view.classes.cards.Util.deleteCard(view.getFormObject()).then(function (record) {
            // fire global card deleted event
            Ext.GlobalEvents.fireEventArgs("carddeleted", [record]);

            // execute after delete form triggers
            var item = CMDBuildUI.util.helper.ModelHelper.getObjectFromName(objectTypeName, objectType);
            if (item) {
                // get form triggers
                var triggers = item.getFormTriggersForAction(CMDBuildUI.util.helper.FormHelper.formtriggeractions.afterDelete);
                if (triggers && triggers.length) {
                    var api = Ext.apply({
                        record: record
                    }, CMDBuildUI.util.api.Client.getApiForFormAfterDelete());
                    executetriggers(triggers, api);
                }
            }

            // close detail window
            if (view.isInDetailWindow()) {
                vm.set("objectId", null);
                CMDBuildUI.util.Navigation.removeManagementDetailsWindow();
            }
        });
    },

    /**
     * 
     * @param {Ext.panel.Tool} tool
     * @param {Ext.Event} event
     * @param {Object} eOpts
     */
    onCloneMenuBtnClick: function (tool, event, eOpts) {
        var me = this;
        var vm = me.getViewModel();
        var isSimpleClass = CMDBuildUI.util.helper.ModelHelper.getClassFromName(vm.get("objectTypeName")).isSimpleClass();

        function onCloneMenuItemClick() {
            CMDBuildUI.util.Ajax.setActionId("class.card.clone");
            me.redirectTo(me.getBasePath() + '/clone', true);
        }

        function onCloneWithRelationsMenuItemClick() {
            CMDBuildUI.util.Ajax.setActionId("class.card.clonewithrelations");
            me.redirectTo(me.getBasePath() + '/clonecardandrelations', true);
        }

        if (isSimpleClass) {
            onCloneMenuItemClick();
        } else {
            var menu = Ext.create('Ext.menu.Menu', {
                autoShow: true,
                ui: 'actionmenu',
                items: [{
                    tooltip: CMDBuildUI.locales.Locales.classes.cards.clone,
                    iconCls: 'x-fa fa-file-o',
                    height: 32,
                    autoEl: {
                        'data-testid': 'cards-card-view-cloneCardBtn'
                    },
                    handler: onCloneMenuItemClick
                }, {
                    tooltip: CMDBuildUI.locales.Locales.classes.cards.clonewithrelations,
                    iconCls: 'x-fa fa-file-text-o',
                    height: 32,
                    autoEl: {
                        'data-testid': 'cards-card-view-cloneRelationsBtn'
                    },
                    handler: onCloneWithRelationsMenuItemClick
                }]
            });
            menu.setMinWidth(35);
            menu.setWidth(35);
            menu.alignTo(tool.el.id, 't-b?');
        }
    },

    /**
     * 
     * @param {Ext.panel.Tool} tool
     * @param {Ext.Event} event
     * @param {Object} eOpts
     */
    onPrintBtnClick: function (tool, event, eOpts) {
        function printCard(format) {
            var vm = tool.lookupViewModel();

            // url and format
            var url = CMDBuildUI.util.api.Classes.getPrintCardUrl(
                vm.get("objectTypeName"),
                vm.get("objectId"),
                format
            );
            url += "?extension=" + format;

            // open file in popup
            CMDBuildUI.util.Utilities.openPrintPopup(url, format);
        }

        var menu = Ext.create('Ext.menu.Menu', {
            autoShow: true,
            ui: 'actionmenu',
            items: [{
                iconCls: 'x-fa fa-file-pdf-o',
                itemId: 'printPdfBtn',
                tooltip: CMDBuildUI.locales.Locales.common.grid.printpdf,
                text: CMDBuildUI.locales.Locales.common.grid.printpdf,
                printformat: 'pdf',
                localized: {
                    tooltip: 'CMDBuildUI.locales.Locales.common.grid.printpdf',
                    text: 'CMDBuildUI.locales.Locales.common.grid.printpdf'
                },
                handler: function () {
                    printCard("pdf");
                }
            }, {
                iconCls: 'x-fa fa-file-word-o',
                itemId: 'printOdtBtn',
                tooltip: CMDBuildUI.locales.Locales.common.grid.printodt,
                text: CMDBuildUI.locales.Locales.common.grid.printodt,
                printformat: 'odt',
                localized: {
                    tooltip: 'CMDBuildUI.locales.Locales.common.grid.printodt',
                    text: 'CMDBuildUI.locales.Locales.common.grid.printodt'
                },
                handler: function () {
                    printCard("odt");
                }
            }]
        });
        menu.setMinWidth(35);
        menu.setWidth(35);
        menu.alignTo(tool.el.id, 't-b?');
    },

    /**
     * triggered on the relation graph btn click
     * 
     * @param {Ext.panel.Tool} tool
     * @param {Ext.Event} event
     * @param {Object} eOpts
     */
    onRelationGraphBtnClick: function (tool, event, eOpts) {
        CMDBuildUI.util.Ajax.setActionId("class.card.relgraph.open");
        var obj = this.getView().getFormObject();
        CMDBuildUI.util.Utilities.openPopup('graphPopup', CMDBuildUI.locales.Locales.relationGraph.relationGraph, {
            xtype: 'graph-graphcontainer',
            _id: obj.get('_id'),
            _type: obj.get('_type'),
            _code: obj.get('Code'),
            _description: obj.get('Description')
        });
    },

    /**
     * 
     * @param {Ext.panel.Tool} tool
     * @param {Ext.Event} event
     * @param {Object} eOpts
     */
    onBimButtonClick: function (tool, event, eOpts) {
        var vm = this.getViewModel();
        CMDBuildUI.util.bim.Util.openBimPopup(
            vm.get('bim.projectid'),
            vm.get('bim.selectedid')
        );
    },

    /**
     * 
     * @param {Ext.panel.Tool} tool
     * @param {Ext.Event} event
     * @param {Object} eOpts
     */
    onHelpBtnClick: function (tool, event, eOpts) {
        var vm = tool.lookupViewModel();
        var item = CMDBuildUI.util.helper.ModelHelper.getClassFromName(vm.get("objectTypeName"));
        CMDBuildUI.util.Utilities.openPopup(
            null,
            CMDBuildUI.locales.Locales.common.actions.help, {
                xtype: 'panel',
                html: item.get("help"),
                layout: 'fit',
                padding: CMDBuildUI.util.helper.FormHelper.properties.padding,
                cls: 'x-selectable',
                scrollable: true
            }
        );
    },

    onActivate: function (view, prevtabpanel, action) {
        var grids = Ext.ComponentQuery.query('relations-fieldset-grid');
        if (grids.length) {
            grids.forEach(function (grid) {
                grid.getStore().load();
            });
        }
    },

    privates: {
        addTabs: function (view, theObject, action, readonly) {
            var objectTypeName = theObject.get("_type"),
                objectId = theObject.get("_id"),
                classItem = CMDBuildUI.util.helper.ModelHelper.getClassFromName(objectTypeName),
                classDef = theObject.get("_model") || (classItem && classItem.getData() || {}),
                isSimpleClass = classDef.type === CMDBuildUI.model.classes.Class.classtypes.simple,
                disabletabs = false,
                enabledservices = CMDBuildUI.util.helper.Configurations.getEnabledFeatures(),
                card, tabcard, tabmasterdetail, tabnotes, tabrelations, 
                tabhistory, tabemails, tabattachments, tabschedules;

            // define card tab content
            switch (action) {
                case CMDBuildUI.mixins.DetailsTabPanel.actions.edit:
                    card = {
                        xtype: 'classes-cards-card-edit',
                        tab: CMDBuildUI.mixins.DetailsTabPanel.actions.edit,
                        tabAction: CMDBuildUI.mixins.DetailsTabPanel.actions.edit,
                        hideInlineElements: false
                    };
                    break;
                case CMDBuildUI.mixins.DetailsTabPanel.actions.create:
                    disabletabs = true;
                    card = {
                        xtype: 'classes-cards-card-create',
                        tab: CMDBuildUI.mixins.DetailsTabPanel.actions.create,
                        tabAction: CMDBuildUI.mixins.DetailsTabPanel.actions.create,
                        hideInlineElements: {
                            inlineNotes: false
                        }
                    };
                    break;
                case CMDBuildUI.mixins.DetailsTabPanel.actions.clone:
                    disabletabs = true;
                    card = {
                        xtype: 'classes-cards-card-create',
                        cloneObject: true,
                        tab: CMDBuildUI.mixins.DetailsTabPanel.actions.clone,
                        tabAction: CMDBuildUI.mixins.DetailsTabPanel.actions.clone,
                        hideInlineElements: {
                            inlineNotes: false
                        }
                    };
                    break;
                case CMDBuildUI.mixins.DetailsTabPanel.actions.clonecardandrelations:
                    disabletabs = true;
                    card = {
                        xtype: 'classes-cards-clonerelations-container',
                        cloneObject: true,
                        tab: CMDBuildUI.mixins.DetailsTabPanel.actions.clonecardandrelations,
                        tabAction: CMDBuildUI.mixins.DetailsTabPanel.actions.clonecardandrelations,
                        hideInlineElements: {
                            inlineNotes: false
                        }
                    };
                    break;
                default:
                    card = {
                        xtype: 'classes-cards-card-view',
                        objectTypeName: objectTypeName,
                        objectId: objectId,
                        shownInPopup: true,
                        autoScroll: true,
                        tab: 'view',
                        tabAction: CMDBuildUI.mixins.DetailsTabPanel.actions.view,
                        hideTools: readonly,
                        hideInlineElements: false
                    };
            }

            // Card tab
            tabcard = view.add({
                xtype: "panel",
                iconCls: 'x-fa fa-file-text',
                items: [Ext.apply(card, view.getObjectFormBaseConfig())],
                reference: card.tab,
                bodyPadding: 0,
                layout: 'fit',
                autoScroll: true,
                padding: 0,
                tabAction: card.tabAction,
                tabConfig: {
                    tabIndex: 0,
                    title: readonly ? CMDBuildUI.locales.Locales.common.tabs.card : undefined,
                    tooltip: !readonly ? CMDBuildUI.locales.Locales.common.tabs.card : undefined
                },
                listeners: {
                    activate: 'onActivate'
                }
            });

            // Master/Detail tab
            if (!isSimpleClass && classDef._detail_access) {
                tabmasterdetail = view.add({
                    xtype: 'relations-masterdetail-tabpanel',
                    iconCls: 'x-fa fa-th-list',
                    reference: "details",
                    readOnly: readonly,
                    tabAction: CMDBuildUI.mixins.DetailsTabPanel.actions.masterdetail,
                    disabled: disabletabs,
                    tabConfig: {
                        tabIndex: 1,
                        title: readonly ? CMDBuildUI.locales.Locales.common.tabs.details : undefined,
                        tooltip: !readonly ? CMDBuildUI.locales.Locales.common.tabs.details : undefined
                    }
                });
            }

            // Notes tab
            if (!isSimpleClass && classDef._note_access) {
                tabnotes = view.add({
                    xtype: 'notes-panel',
                    iconCls: 'x-fa fa-sticky-note',
                    reference: "notes",
                    readOnly: readonly,
                    tabAction: CMDBuildUI.mixins.DetailsTabPanel.actions.notes,
                    tabConfig: {
                        tabIndex: 2,
                        title: readonly ? CMDBuildUI.locales.Locales.common.tabs.notes : undefined,
                        tooltip: !readonly ? CMDBuildUI.locales.Locales.common.tabs.notes : undefined,
                        bind: {
                            text: readonly ?
                                CMDBuildUI.locales.Locales.common.tabs.notes + ' {tabcounters.notes ? "(" + 1 + ")" : null}' : '{tabcounters.notes ? \'<span class="badge">\' + 1 + "</span>" : null}'
                        }
                    },
                    disabled: disabletabs
                });
            }

            // Relations tab
            if (!isSimpleClass && classDef._relation_access) {
                tabrelations = view.add({
                    xtype: 'relations-list-container',
                    iconCls: 'x-fa fa-link',
                    reference: 'relations',
                    readOnly: readonly,
                    tabAction: CMDBuildUI.mixins.DetailsTabPanel.actions.relations,
                    tabConfig: {
                        tabIndex: 3,
                        title: readonly ? CMDBuildUI.locales.Locales.common.tabs.relations : undefined,
                        tooltip: !readonly ? CMDBuildUI.locales.Locales.common.tabs.relations : undefined
                    },
                    disabled: disabletabs
                });
            }


            // History tab
            if (!isSimpleClass && classDef._history_access) {
                tabhistory = view.add({
                    xtype: "panel",
                    iconCls: 'x-fa fa-history',
                    items: [{
                        xtype: 'history-grid',
                        autoScroll: true
                    }],
                    reference: 'history',
                    tabAction: CMDBuildUI.mixins.DetailsTabPanel.actions.history,
                    tabConfig: {
                        tabIndex: 4,
                        title: readonly ? CMDBuildUI.locales.Locales.common.tabs.history : undefined,
                        tooltip: !readonly ? CMDBuildUI.locales.Locales.common.tabs.history : undefined
                    },
                    layout: 'fit',
                    autoScroll: true,
                    padding: 0,
                    disabled: disabletabs
                });
            }

            // Email tab
            if (!isSimpleClass && classDef._email_access) {
                tabemails = view.add({
                    xtype: "emails-container",
                    iconCls: 'x-fa fa-envelope',
                    reference: view._emailReference,
                    autoScroll: true,
                    tabAction: CMDBuildUI.mixins.DetailsTabPanel.actions.emails,
                    bodyPadding: 0,
                    readOnly: readonly,
                    tabConfig: {
                        tabIndex: 5,
                        title: readonly ? CMDBuildUI.locales.Locales.common.tabs.emails : undefined,
                        tooltip: !readonly ? CMDBuildUI.locales.Locales.common.tabs.emails : undefined,
                        bind: {
                            text: readonly ?
                                CMDBuildUI.locales.Locales.common.tabs.emails + ' {tabcounters.emails ? "(" + tabcounters.emails + ")" : null}' : 
                                '{tabcounters.emails ? \'<span class="badge">\' + tabcounters.emails + "</span>" : null}'
                        }
                    },
                    disabled: disabletabs
                });
            }

            // Attachments tab
            if (!isSimpleClass && enabledservices.dms && classDef._attachment_access) {
                tabattachments = view.add({
                    xtype: 'dms-container',
                    tabAction: CMDBuildUI.mixins.DetailsTabPanel.actions.attachments,
                    iconCls: 'x-fa fa-paperclip',
                    objectType: CMDBuildUI.util.helper.ModelHelper.objecttypes.klass,
                    objectTypeName: objectTypeName,
                    objectId: objectId,
                    readOnly: readonly,
                    tabConfig: {
                        tabIndex: 6,
                        title: readonly ? CMDBuildUI.locales.Locales.common.tabs.attachments : undefined,
                        tooltip: !readonly ? CMDBuildUI.locales.Locales.common.tabs.attachments : undefined,
                        bind: {
                            text: readonly ?
                                CMDBuildUI.locales.Locales.common.tabs.attachments + ' {tabcounters.attachments ? "(" + tabcounters.attachments + ")" : null}' : 
                                '{tabcounters.attachments ? \'<span class="badge">\' + tabcounters.attachments + "</span>" : null}'
                        }
                    },
                    disabled: disabletabs
                });
            }

            //Schedules
            if (!isSimpleClass && enabledservices.scheduler && classDef._schedule_access) {
                var haschedules;
                if (classDef.attributes) {
                    haschedules = Ext.Array.filter(classDef.attributes, function (item) {
                        return item.calendarTriggers && item.calendarTriggers.length;
                    });
                    haschedules = haschedules.length > 0;
                } else {
                    haschedules = classDef._hasTriggers; // if is create
                }
                if (haschedules) {
                    tabschedules = view.add({
                        xtype: "panel",
                        itemId: CMDBuildUI.mixins.DetailsTabPanel.actions.schedules, //used by {activeItem} 
                        iconCls: 'x-fa fa-calendar',
                        items: [{
                            xtype: 'events-grid',
                            eventsStore: {
                                model: 'CMDBuildUI.model.calendar.Event',
                                pageSize: 100,
                                proxy: {
                                    type: 'baseproxy',
                                    url: '/calendar/events',
                                    extraParams: {
                                        detailed: true
                                    }
                                },
                                advancedFilter: {
                                    attributes:{
                                        card: [{operator: CMDBuildUI.model.base.Filter.operators.equal, value: [objectId]}]
                                    }
                                },
                                sorters: [{
                                    property: 'date',
                                    direction: "ASC"
                                }],
                                autoLoad: !disabletabs, // load only when page is view or edit
                                autoDestroy: true
                            },
                            hideTools: true
                        }],
                        tabAction: CMDBuildUI.mixins.DetailsTabPanel.actions.schedules,
                        tabConfig: {
                            tabIndex: 7,
                            title: readonly ? CMDBuildUI.locales.Locales.common.tabs.schedules : undefined,
                            tooltip: !readonly ? CMDBuildUI.locales.Locales.common.tabs.schedules : undefined,
                            autoEl: {
                                'data-testid': 'schedules-tab'
                            }
                        },
                        disabled: disabletabs,
                        layout: 'fit',
                        autoScroll: true,
                        padding: 0
                    });
                }
            }

            // set view active tab
            var activetab;
            switch (action) {
                case CMDBuildUI.mixins.DetailsTabPanel.actions.masterdetail:
                    activetab = tabmasterdetail;
                    break;
                case CMDBuildUI.mixins.DetailsTabPanel.actions.notes:
                    activetab = tabnotes;
                    break;
                case CMDBuildUI.mixins.DetailsTabPanel.actions.relations:
                    activetab = tabrelations;
                    break;
                case CMDBuildUI.mixins.DetailsTabPanel.actions.history:
                    activetab = tabhistory;
                    break;
                case CMDBuildUI.mixins.DetailsTabPanel.actions.emails:
                    activetab = tabemails;
                    break;
                case CMDBuildUI.mixins.DetailsTabPanel.actions.attachments:
                    activetab = tabattachments;
                    break;
                case CMDBuildUI.mixins.DetailsTabPanel.actions.schedules:
                    activetab = tabschedules;
                    break;
            }
            if (!activetab) {
                activetab = tabcard;
            }
            Ext.asap(function () {
                if (!view.destroyed) {
                    view.setActiveTab(activetab);
                }
            });
        },

        /**
         * Get resource base path for routing.
         * @return {String}
         */
        getBasePath: function () {
            var vm = this.getViewModel();
            var typeName = vm.get("objectTypeName");
            var objectId = vm.get("objectId");

            var url = CMDBuildUI.util.Navigation.getClassBaseUrl(typeName, objectId);
            return url;
        },

        /**
         * 
         * @return {Ext.panel.Tool}
         */
        getOpenTool: function () {
            return this.getView().lookupReference("opentool");
        }
    }
});