Ext.define('CMDBuildUI.view.classes.cards.card.ViewController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.classes-cards-card-view',

    control: {
        '#': {
            beforerender: 'onBeforeRender'
        },
        '#openTabsBtn': {
            click: 'onOpenTabsBtnClick'
        }
    },

    /**
     * @param {CMDBuildUI.view.classes.cards.card.View} view
     * @param {Object} eOpts
     */
    onBeforeRender: function (view, eOpts) {
        var vm = this.getViewModel();
        if (!view.getObjectTypeName() && !view.getObjectId()) {
            var config = view.getInitialConfig();
            if (!Ext.isEmpty(config._rowContext)) {
                var record = config._rowContext.record; // get widget record
                if (record && record.getData()) {
                    // view.setObjectTypeName(record.getRecordType());
                    // view.setObjectId(record.getRecordId());
                    vm.set("objectTypeName", record.getRecordType());
                    vm.set("objectId", record.getRecordId());
                }
            }
        }

        // if the object is not defined on parent
        if (!(vm.get("theObject") && vm.get("objectModel"))) {
            // bind object type name and object id
            // to get model and load card data
            vm.bind({
                bindTo: {
                    objectTypeName: '{objectTypeName}',
                    objectId: '{objectId}'
                }
            }, this.onObjectTypeNameAndIdChanged, this);
        }

        // bind card data load to show the form
        vm.bind({
            bindTo: {
                theobjecttype: '{theObject._type}',
                theobjectid: '{theObject._id}',
                objectmodel: '{objectModel}'
            }
        }, this.onObjectLoaded, this);
    },

    /**
     * Triggered on open tabs button click.
     * 
     * @param {Ext.panel.Tool} tool
     * @param {Ext.Event} event
     * @param {Object} eOpts
     */
    onOpenTabsBtnClick: function (tool, event, eOpts) {
        var me = this;
        var configAttachments = CMDBuildUI.util.helper.Configurations.get(CMDBuildUI.model.Configuration.dms.enabled);
        var privileges = CMDBuildUI.util.helper.SessionHelper.getCurrentSession().get("rolePrivileges");
        var items = [];

        // details action
        if (privileges.card_tab_detail_access) {
            items.push({
                tooltip: CMDBuildUI.locales.Locales.common.tabs.details,
                iconCls: 'x-fa fa-th-list',
                cls: 'management-tool',
                height: 32,
                listeners: {
                    click: function (menuitem, eOpts) {
                        CMDBuildUI.util.Ajax.setActionId("class.card.details.open");
                        me.redirectTo(me.getBasePath() + '/details', true);
                    }
                }
            });
        }

        // notes action
        if (privileges.card_tab_note_access) {
            items.push({
                tooltip: CMDBuildUI.locales.Locales.common.tabs.notes,
                iconCls: 'x-fa fa-sticky-note',
                height: 32,
                listeners: {
                    click: function (menuitem, eOpts) {
                        CMDBuildUI.util.Ajax.setActionId("class.card.notes.open");
                        me.redirectTo(me.getBasePath() + '/notes', true);
                    }
                }
            });
        }

        // relations action
        if (privileges.card_tab_relation_access) {
            items.push({
                tooltip: CMDBuildUI.locales.Locales.common.tabs.relations,
                iconCls: 'x-fa fa-link',
                height: 32,
                listeners: {
                    click: function (menuitem, eOpts) {
                        CMDBuildUI.util.Ajax.setActionId("class.card.relations.open");
                        me.redirectTo(me.getBasePath() + '/relations', true);
                    }
                }
            });
        }

        // history action
        if (privileges.card_tab_history_access) {
            items.push({
                tooltip: CMDBuildUI.locales.Locales.common.tabs.history,
                iconCls: 'x-fa fa-history',
                height: 32,
                listeners: {
                    click: function (menuitem, eOpts) {
                        CMDBuildUI.util.Ajax.setActionId("class.card.history.open");
                        me.redirectTo(me.getBasePath() + '/history', true);
                    }
                }
            });
        }

        // email action
        if (privileges.card_tab_email_access) {
            items.push({
                tooltip: CMDBuildUI.locales.Locales.common.tabs.emails,
                iconCls: 'x-fa fa-envelope',
                height: 32,
                listeners: {
                    click: function (menuitem, eOpts) {
                        CMDBuildUI.util.Ajax.setActionId("class.card.emails.open");
                        me.redirectTo(me.getBasePath() + '/emails', true);
                    }
                }
            });
        }

        // attachments action
        if (configAttachments && privileges.card_tab_attachment_access) {
            items.push({
                tooltip: CMDBuildUI.locales.Locales.common.tabs.attachments,
                iconCls: 'x-fa fa-paperclip',
                height: 32,
                hidden: !configAttachments,
                listeners: {
                    click: function (menuitem, eOpts) {
                        CMDBuildUI.util.Ajax.setActionId("class.card.attachments.open");
                        me.redirectTo(me.getBasePath() + '/attachments', true);
                    }
                }
            });
        }

        if (items.length) {
            var menu = Ext.create('Ext.menu.Menu', {
                autoShow: true,
                items: items,
                ui: 'actionmenu',
                listeners: {
                    click: function (menu, item, e, eOpts) {
                        tool.fireEventArgs('menuclick', [tool, menu])
                    }
                }
            });
            menu.setMinWidth(35);
            menu.setWidth(35);
            menu.alignTo(tool.el.id, 't-b?');
        }
    },

    privates: {
        /**
         * Get resource base path for routing.
         * @return {String}
         */
        getBasePath: function () {
            var vm = this.getViewModel();

            var url = CMDBuildUI.util.Navigation.getClassBaseUrl(vm.get("objectTypeName"), vm.get("objectId"));
            return url
        },

        /**
         * 
         * @param {Object} data 
         * @param {String} data.objectTypeName
         * @param {Number|String} data.objectId
         */
        onObjectTypeNameAndIdChanged: function (data) {
            var vm = this.getViewModel();
            var me = this;
            if (data.objectTypeName && data.objectId) {
                CMDBuildUI.util.helper.ModelHelper.getModel(
                    CMDBuildUI.util.helper.ModelHelper.objecttypes.klass,
                    data.objectTypeName
                ).then(function (model) {
                    vm.set("objectModel", model);

                    vm.linkTo("theObject", {
                        type: model.getName(),
                        id: data.objectId
                    });
                });
            }
        },

        /**
         * 
         * @param {Object} data 
         * @param {String} data.theobjecttype
         * @param {CMDBuildUI.model.classes.Card} data.objectmodel
         */
        onObjectLoaded: function (data) {
            var view = this.getView();
            var vm = this.getViewModel();
            if (data.theobjecttype && data.objectmodel) {
                var items = [];
                if (view.getShownInPopup()) {
                    // get form fields as fieldsets
                    items = view.getDynFormFields();
                    items = view.getMainPanelForm(items, view.getHideTools());
                } else {
                    // get form fields as tab panel
                    var klass = CMDBuildUI.util.helper.ModelHelper.getObjectFromName(vm.get("objectTypeName"), vm.get("objectType"));
                    var grouping = klass.attributeGroups().getRange();
                    var layout;
                    if (klass.get("formStructure") && klass.get("formStructure").active) {
                        layout = klass.get("formStructure").form;
                    }
                    var panel = CMDBuildUI.util.helper.FormHelper.renderForm(vm.get("objectModel"), {
                        mode: CMDBuildUI.util.helper.FormHelper.formmodes.read,
                        showAsFieldsets: false,
                        grouping: grouping,
                        layout: layout
                    });

                    if (!view.getHideTools()) {
                        // add toolbar
                        Ext.apply(panel, {
                            tools: view.tabpaneltools
                        });
                    }

                    items.push(panel);
                }
                view.removeAll(true);
                view.add(items);

                // add conditional visibility rules
                view.addConditionalVisibilityRules();
            }
        }
    }

});