Ext.define('CMDBuildUI.view.map.tab.cards.CardController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.map-tab-cards-card',
    listen: {
        component: {
            '#': {
                'beforerender': 'onBeforeRender'
            }
        }
    },

    /**
      * @param {CMDBuildUI.view.classes.cards.Grid} view
      * @param {Object} eOpts
      */
    onBeforeRender: function (view, eOpts) {
        var vm = this.getViewModel();
        vm.bind({
            theObject: '{map-tab-tabpanel.theObject}'
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

    privates: {
        getCardObject: function (objectType, objectTypeName, objectId) {
            var me = this;
            return {
                xtype: 'classes-cards-card-view',
                itemId: 'classes-cards-card-view',
                shownInPopup: true,
                hideTools: false,
                viewModel: {
                    data: {
                        objectTypeName: objectTypeName,
                        objectId: objectId,
                        objectType: 'class'
                    },
                    formulas: {
                        canUpdate: {
                            bind: {
                                _can_update: '{theObject._model.' + CMDBuildUI.model.base.Base.permissions.edit + '}'
                            }, get: function (data) {
                                return !data._can_update;
                            }
                        }
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
                    callback: Ext.Function.bind(function (owner, tool, event) {
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
                                autoShow: true,
                                items: items,
                                ui: 'actionmenu',
                                defaults: {
                                    height: 32,
                                    listeners: {
                                        click: Ext.Function.bind(this.clickHandler, this, [objectTypeName, objectId], 0)
                                    }
                                },
                                viewModel: {
                                    parent: tool.lookupViewModel()
                                }
                            });
                            menu.setMinWidth(35);
                            menu.setWidth(35);
                            menu.alignTo(tool.el.id, 't-b?');
                        }
                    }, this)
                }],
                hideWidgets: true
            };
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
            var ct = this.getView().up('classes-cards-grid-container');
            if (ct) {
                var button = ct.lookupReference('showMapListButton');
                if (button) {
                    button.click();
                }
            }
            this.redirectTo(Ext.String.format("{0}/{1}", CMDBuildUI.util.Navigation.getClassBaseUrl(objectTypeName, objectId), tool.action));
        }
    }
});
