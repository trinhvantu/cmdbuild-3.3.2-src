Ext.define('CMDBuildUI.view.bim.tab.cards.CardsController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.bim-tab-cards-cards',
    control: {
        '#': {
            beforerender: 'onBeforeRender'
        }
    },

    onBeforeRender: function (view) {
        var vm = view.getViewModel();
        vm.bind({
            theObject: '{bim-tab-cards-cards.theObject}'
        }, function (data) {
            var view = this.getView();

            if (data.theObject) {
                var objectId = data.theObject.getId();
                var objectTypeName = data.theObject.get('_type');
                var objectType = CMDBuildUI.util.helper.ModelHelper.getObjectTypeByName(objectTypeName);

                switch (objectType) {
                    case CMDBuildUI.util.helper.ModelHelper.objecttypes.klass:
                        view.remove('classes-cards-card-view');
                        view.add(this.getCardObject(objectType, objectTypeName, objectId));
                        break;
                    default:
                        CMDBuildUI.util.Logger.log(
                            Ext.String.format('Object Type not implemented card tab: {0}', objectType),
                            CMDBuildUI.util.Logger.levels.debug);
                        break;
                }

            } else {
                view.remove('classes-cards-card-view');
            }
        }, this);
    },

    getCardObject: function (objectType, objectTypeName, objectId) {
        return {
            xtype: 'classes-cards-card-view',
            itemId: 'classes-cards-card-view',
            hideTools: false,
            hideWidgets: true,
            shownInPopup: true,
            viewModel: {
                data: {
                    objectType: objectType,
                    objectTypeName: objectTypeName,
                    objectId: objectId
                }
            },
            tabpaneltools: [{
                xtype: 'tool',
                itemId: 'opentool',
                iconCls: 'x-fa fa-external-link',
                cls: 'management-tool',
                action: CMDBuildUI.mixins.DetailsTabPanel.actions.view,
                tooltip: CMDBuildUI.locales.Locales.classes.cards.opencard,
                autoEl: {
                    'data-testid': 'cards-card-view-opentool'
                },
                localized: {
                    tooltip: 'CMDBuildUI.locales.Locales.classes.cards.opencard'
                },
                listeners: {
                    click: Ext.Function.bind(this.clickHandler, this, [objectTypeName, objectId], 0)
                }
            }, {
                xtype: 'tool',
                iconCls: 'x-fa fa-ellipsis-v',
                cls: 'management-tool',
                autoEl: {
                    'data-testid': 'cards-card-view-openTabs'
                },
                listeners: {
                    click: {
                        fn: Ext.Function.bind(function (owner, tool, event) {
                            if (owner.__menu) {
                                //                                 owner.__menu.setVisible(true);
                                owner.__menu.show();
                                owner.__menu.setZIndex(99999999);
                            } else {


                                var configAttachments = CMDBuildUI.util.helper.Configurations.get(CMDBuildUI.model.Configuration.dms.enabled);
                                var privileges = CMDBuildUI.util.helper.SessionHelper.getCurrentSession().get("rolePrivileges");
                                var items = [];

                                // edit action
                                items.push({
                                    tooltip: CMDBuildUI.locales.Locales.classes.cards.modifycard,
                                    iconCls: 'x-fa fa-pencil',
                                    cls: 'management-tool',
                                    action: CMDBuildUI.mixins.DetailsTabPanel.actions.edit,
                                    disabled: true,
                                    bind: {
                                        disabled: '{canUpdate}'
                                    }

                                });

                                // details action
                                if (privileges.card_tab_detail_access) {
                                    items.push({
                                        tooltip: CMDBuildUI.locales.Locales.common.tabs.details,
                                        iconCls: 'x-fa fa-th-list',
                                        cls: 'management-tool',
                                        action: CMDBuildUI.mixins.DetailsTabPanel.actions.masterdetail
                                    });
                                }

                                // notes action
                                if (privileges.card_tab_note_access) {
                                    items.push({
                                        tooltip: CMDBuildUI.locales.Locales.common.tabs.notes,
                                        iconCls: 'x-fa fa-sticky-note',
                                        action: CMDBuildUI.mixins.DetailsTabPanel.actions.notes
                                    });
                                }

                                // relations action
                                if (privileges.card_tab_relation_access) {
                                    items.push({
                                        tooltip: CMDBuildUI.locales.Locales.common.tabs.relations,
                                        iconCls: 'x-fa fa-link',
                                        action: CMDBuildUI.mixins.DetailsTabPanel.actions.relations
                                    });
                                }

                                // history action
                                if (privileges.card_tab_history_access) {
                                    items.push({
                                        tooltip: CMDBuildUI.locales.Locales.common.tabs.history,
                                        iconCls: 'x-fa fa-history',
                                        action: CMDBuildUI.mixins.DetailsTabPanel.actions.history
                                    });
                                }

                                // email action
                                if (privileges.card_tab_email_access) {
                                    items.push({
                                        tooltip: CMDBuildUI.locales.Locales.common.tabs.emails,
                                        iconCls: 'x-fa fa-envelope',
                                        action: CMDBuildUI.mixins.DetailsTabPanel.actions.emails
                                    });
                                }

                                // attachments action
                                if (configAttachments && privileges.card_tab_attachment_access) {
                                    items.push({
                                        tooltip: CMDBuildUI.locales.Locales.common.tabs.attachments,
                                        iconCls: 'x-fa fa-paperclip',
                                        action: CMDBuildUI.mixins.DetailsTabPanel.actions.attachments
                                    });
                                }

                                if (items.length) {
                                    var menu = Ext.create('Ext.menu.Menu', {
                                        //                                         autoShow: true,
                                        alwaysOnTop: CMDBuildUI.util.Utilities._popupAlwaysOnTop++,
                                        toFrontOnShow: true,
                                        floating: true,
                                        items: items,
                                        ui: 'actionmenu',
                                        defaults: {
                                            height: 32,
                                            listeners: {
                                                click: Ext.Function.bind(this.clickHandler, this, [objectTypeName, objectId], 0)
                                            }
                                        },
                                        viewModel: {
                                            parent: this.getViewModel()
                                        }
                                    });
                                    menu.setMinWidth(35);
                                    menu.setWidth(35);
                                    menu.show();
                                    menu.alignTo(tool.target.id, 't-b?');
                                    owner.__menu = menu;
                                }
                            }
                        }, this)
                    },
                    destroy: function (owner) {
                        if (owner.__menu) {
                            owner.__menu.destroy();
                        }
                    }
                }
            }]
        }
    },

    /**
         * 
         * @param {*} objectTypeName 
         * @param {*} objectId 
         * @param {*} tool 
         * @param {*} e 
         */
    clickHandler: function (objectTypeName, objectId, tool, e) {
        //simulates button click to switch view
        CMDBuildUI.util.Utilities.closePopup('bimPopup');
        this.redirectTo(Ext.String.format("{0}/{1}", CMDBuildUI.util.Navigation.getClassBaseUrl(objectTypeName, objectId), tool.action));
    }
});
