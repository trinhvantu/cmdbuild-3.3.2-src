Ext.define('CMDBuildUI.view.processes.instances.TabPanelController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.processes-instances-tabpanel',

    control: {
        '#': {
            beforerender: "onBeforeRender",
            tabchange: 'onTabChange'
        },
        '#tab-attachments': {
            beforerender: 'onTabAttachmentsBeforeRender'
        },
        '#opentool': {
            click: 'onOpenToolClick'
        },
        '#editBtn': {
            clicK: 'onEditBtnClick'
        },
        '#deleteBtn': {
            click: 'onDeleteBtnClick'
        },
        '#relgraphBtn': {
            click: 'onRelationGraphBtnClick'
        },
        '#helpBtn': {
            click: 'onHelpBtnClick'
        }

    },

    /**
     * @param {CMDBuildUI.view.processes.instances.TabPanel} view
     * @param {Object} eOpts
     */
    onBeforeRender: function (view, eOpts) {
        // set view model variables
        var me = this,
            vm = view.lookupViewModel(),
            readonly = view.getReadOnlyTabs();

        // set objectTypeName and objectId for inline-view
        if (!vm.get("objectTypeName") && !vm.get("objectId")) {
            var rowContext = view.getInitialConfig()._rowContext;
            if (!Ext.isEmpty(rowContext)) {
                var record = rowContext.record; // get widget record
                if (record && record.getData()) {
                    vm.set("objectTypeName", record.get('_type'));
                    vm.set("objectId", record.get('_id'));
                    vm.set("activityId", record.get("_activity_id"));
                }
            }
        }

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
                CMDBuildUI.util.helper.ModelHelper.objecttypes.process,
                objectTypeName
            ).then(function (model) {
                vm.set("objectModel", model);

                if (objectId) {
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

        // update url on window close
        // if panel is shown in detail window
        if (view.isInDetailWindow()) {
            // update url on window close
            view.mon(
                CMDBuildUI.util.Navigation.getManagementDetailsWindow(),
                'beforeclose',
                this.onManagementDetailsWindowBeforeClose,
                this
            );
        }

        vm.bind({
            bindTo: '{theObject}',
            single: true
        }, function (theObject) {
            me.addTabs(view, theObject, action, readonly);
        });
    },

    onManagementDetailsWindowBeforeClose: function () {
        var me = this;
        CMDBuildUI.util.Navigation.updateCurrentManagementContextAction(undefined);
        CMDBuildUI.util.Navigation.updateCurrentManagementContextActivity(undefined);
        CMDBuildUI.util.Navigation.updateCurrentManagementContextObjectId(undefined);
        CMDBuildUI.util.Utilities.redirectTo(me.getBasePath(false), true);
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
            CMDBuildUI.util.Ajax.setActionId("proc.inst." + newtab.tabAction + ".open");
            this.redirectTo(this.getBasePath(true) + '/' + newtab.tabAction);
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

    onTabAttachmentsBeforeRender: function (view) {
        var vm = view.lookupViewModel();
        var process = CMDBuildUI.util.helper.ModelHelper.getProcessFromName(vm.get('objectTypeName'));

        if (process.get('_can_fc_attachment') == true) {
            vm.set('basepermissions.edit', true);
        }
    },

    /**
     * 
     * @param {Ext.panel.Tool} tool 
     * @param {Ext.event.Event} e 
     * @param {Ext.Component} owner 
     * @param {Object} eOpts 
     */
    onOpenToolClick: function (tool, e, owner, eOpts) {
        this.redirectTo(Ext.String.format("{0}/{1}", this.getBasePath(true), tool.action));
    },

    /**
     * Triggered on edit tool click.
     * 
     * @param {Ext.panel.Tool} tool
     * @param {Ext.Event} event
     * @param {Object} eOpts
     */
    onEditBtnClick: function (tool, event, eOpts) {
        CMDBuildUI.util.Ajax.setActionId("proc.inst.edit");
        this.redirectTo(this.getBasePath(true) + "/edit", true);
    },

    /**
     * Triggered on edit tool click.
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

        CMDBuildUI.util.Msg.confirm(
            CMDBuildUI.locales.Locales.notifier.attention,
            CMDBuildUI.locales.Locales.processes.abortconfirmation,
            function (btnText) {
                if (btnText === "yes") {
                    CMDBuildUI.util.Ajax.setActionId("proc.inst.delete");
                    var executetriggers = view.down("processes-instances-instance-view").executeFormTriggers;
                    // get the object
                    view.getFormObject().erase({
                        success: function (record, operation) {
                            // fire global card deleted event
                            Ext.GlobalEvents.fireEventArgs("processinstanceaborted", [record]);

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
                        }
                    });
                }
            }, this);
    },

    /**
     * triggered on the relation graph btn click
     * 
     * @param {Ext.panel.Tool} tool
     * @param {Ext.Event} event
     * @param {Object} eOpts
     */
    onRelationGraphBtnClick: function (tool, event, eOpts) {
        CMDBuildUI.util.Ajax.setActionId("proc.inst.relgraph.open");
        var me = this;
        var obj = this.getView().getFormObject();
        CMDBuildUI.util.Utilities.openPopup('graphPopup', CMDBuildUI.locales.Locales.relationGraph.relationGraph, {
            xtype: 'graph-graphcontainer',
            _id: obj.get('_id'),
            _type_name: obj.get('_type_name'),
            _type: obj.get('_type')
        });
    },

    /**
     * 
     * @param {Ext.panel.Tool} tool
     * @param {Ext.Event} event
     * @param {Object} eOpts
     */
    onHelpBtnClick: function(tool, event, eOpts) {
        var vm = tool.lookupViewModel();
        var item = CMDBuildUI.util.helper.ModelHelper.getProcessFromName(vm.get("objectTypeName"));
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

    privates: {
        addTabs: function (view, theObject, action, readonly) {
            var objectTypeName = theObject.get("_type"),
                objectId = theObject.get("_id"),
                procItem = CMDBuildUI.util.helper.ModelHelper.getProcessFromName(objectTypeName),
                processDef = theObject.get("_model") || (procItem && procItem.getData() || {}),
                disabletabs = false,
                enabledservices = CMDBuildUI.util.helper.Configurations.getEnabledFeatures(),
                activity, tabactivity, tabnotes, tabrelations, 
                tabhistory, tabemails, tabattachments;

            switch(action) {
                case CMDBuildUI.mixins.DetailsTabPanel.actions.edit:
                    activity = {
                        xtype: 'processes-instances-instance-edit',
                        tabAction: CMDBuildUI.mixins.DetailsTabPanel.actions.edit
                    };
                    break;
                case CMDBuildUI.mixins.DetailsTabPanel.actions.create:
                    disabletabs = true;
                    activity = {
                        xtype: 'processes-instances-instance-create',
                        tabAction: CMDBuildUI.mixins.DetailsTabPanel.actions.create
                    };
                    break;
                default:
                    activity = {
                        xtype: 'processes-instances-instance-view',
                        shownInPopup: true,
                        hideTools: readonly,
                        tabAction: CMDBuildUI.mixins.DetailsTabPanel.actions.view
                    };
            }

            // Activity tab
            tabactivity = view.add({
                xtype: "panel",
                iconCls: 'x-fa fa-file-text',
                items: [Ext.apply(activity, view.getObjectFormBaseConfig())],
                reference: "activity",
                layout: 'fit',
                autoScroll: true,
                padding: 0,
                bodyPadding: 0,
                tabAction: activity.tabAction,
                tabConfig: {
                    tabIndex: 0,
                    title: readonly ? CMDBuildUI.locales.Locales.common.tabs.activity : undefined,
                    tooltip: !readonly ? CMDBuildUI.locales.Locales.common.tabs.activity : undefined
                }
            });

            // Notes tab
            if (processDef._note_access) {
                tabnotes = view.add({
                    xtype: 'notes-panel',
                    iconCls: 'x-fa fa-sticky-note',
                    itemId: 'tab-notes',
                    readOnly: true,
                    tabAction: CMDBuildUI.mixins.DetailsTabPanel.actions.notes,
                    tabConfig: {
                        tabIndex: 1,
                        title: readonly ? CMDBuildUI.locales.Locales.common.tabs.notes : undefined,
                        tooltip: !readonly ? CMDBuildUI.locales.Locales.common.tabs.notes : undefined,
                        bind: {
                            text: readonly ?
                                CMDBuildUI.locales.Locales.common.tabs.notes + ' {tabcounters.notes ? "(" + 1 + ")" : null}':
                                '{tabcounters.notes ? \'<span class="badge">\' + 1 + "</span>" : null}'
                        }
                    },
                    disabled: disabletabs
                });
            }

            // Relations tab
            if (processDef._relation_access) {
                tabrelations = view.add({
                    xtype: 'relations-list-container',
                    iconCls: 'x-fa fa-link',
                    reference: 'relations',
                    readOnly: true,
                    showRelGraphBtn: !readonly,
                    showEditCardBtn: !readonly,
                    tabAction: CMDBuildUI.mixins.DetailsTabPanel.actions.relations,
                    tabConfig: {
                        tabIndex: 2,
                        title: readonly ? CMDBuildUI.locales.Locales.common.tabs.relations : undefined,
                        tooltip: !readonly ? CMDBuildUI.locales.Locales.common.tabs.relations : undefined
                    },
                    autoScroll: true,
                    disabled: disabletabs
                });
            }

            // History tab
            if (processDef._history_access) {
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
                        tabIndex: 3,
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
            if (processDef._email_access) {
                tabemails = view.add({
                    xtype: "emails-container",
                    iconCls: 'x-fa fa-envelope',
                    itemId: 'tab-emails',
                    reference: view._emailReference,
                    bodyPadding: 0,
                    readOnly: true,
                    tabAction: CMDBuildUI.mixins.DetailsTabPanel.actions.emails,
                    tabConfig: {
                        tabIndex: 4,
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
            if (enabledservices.dms && processDef._attachment_access) {
                tabattachments = view.add({
                    xtype: 'dms-container',
                    iconCls: 'x-fa fa-paperclip',
                    itemId: 'tab-attachments',
                    objectType: CMDBuildUI.util.helper.ModelHelper.objecttypes.process,
                    objectTypeName: objectTypeName,
                    objectId: objectId,
                    readOnly: true,
                    tabAction: CMDBuildUI.mixins.DetailsTabPanel.actions.attachments,
                    tabConfig: {
                        tabIndex: 5,
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

            // set view active tab
            var activetab;
            switch (action) {
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
            }
            if (!activetab) {
                activetab = tabactivity;
            }
            Ext.asap(function () {
                view.setActiveTab(activetab);
            });
        },

        /**
         * 
         * @return {Ext.panel.Tool}
         */
        getOpenTool: function () {
            return this.getView().lookupReference("opentool");
        },

        /**
         * Get resource base path for routing.
         * @param {Boolean} includeactivity
         * @return {String}
         */
        getBasePath: function (includeactivity) {
            var vm = this.getViewModel();
            var url = CMDBuildUI.util.Navigation.getProcessBaseUrl(
                vm.get("objectTypeName"),
                vm.get("objectId"),
                (includeactivity && vm.get("activityId")) ? vm.get("activityId") : null
            );
            return url;
        }
    }
});