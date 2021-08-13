Ext.define('CMDBuildUI.view.events.TabPanelModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.events-tabpanel',
    data: {
        action: undefined,

        basepermissions: {
            clone: false,
            delete: false,
            edit: false
        },
        disabled: {
            attachments: true,
            card: false,
            email: true,
            history: true,
            notes: true
        },
        permissions: {
            delete: false,
            edit: false
        },
        hiddentools: {
            delete: true,
            edit: true,
            open: true
        },
        'events-tabpanel': {
            eventId: undefined
        }
    },

    formulas: {
        createLink: {
            bind: '{events-tabpanel.eventId}',
            get: function (eventId) {
                var parentModel = Ext.ClassManager.get('CMDBuildUI.model.calendar.Event');
                parentModel.setProxy({
                    type: 'baseproxy',
                    url: '/calendar/events'
                });
                if (eventId) {

                    this.setLinks({
                        theLink: {
                            type: 'CMDBuildUI.model.calendar.Event',
                            id: eventId
                        }
                    });
                } else {
                    this.setLinks({
                        theLink: {
                            type: 'CMDBuildUI.model.calendar.Event',
                            create: {
                                _id: null,
                                source: CMDBuildUI.model.calendar.Sequence.source.user,
                                eventEditMode: CMDBuildUI.model.calendar.Event.eventEditMode.write,
                                onCardDeleteAction: CMDBuildUI.model.calendar.Calendar.onCardDeleteAction.clear,
                                type: CMDBuildUI.model.calendar.Trigger.eventtypes.instant,
                                status: CMDBuildUI.model.calendar.Event.status.active
                            }
                            // create: true
                        }
                    })
                }
            }
        },

        updatePermissions: {
            bind: {
                action: '{action}'
                // objectTypeName: '{objectTypeName}'
            },
            get: function (data) {
                if (
                    data.action !== CMDBuildUI.mixins.DetailsTabPanel.actions.create &&
                    data.action !== CMDBuildUI.mixins.DetailsTabPanel.actions.clone
                ) {
                    this.set("disabled.attachments", false);
                    this.set("disabled.email", false);
                    this.set("disabled.history", false);
                    this.set("disabled.notes", false);
                }

                // var item = CMDBuildUI.util.helper.ModelHelper.getClassFromName(data.objectTypeName);
                this.set("basepermissions", {
                    clone: true,//item.get(CMDBuildUI.model.base.Base.permissions.clone),
                    delete: true,//item.get(CMDBuildUI.model.base.Base.permissions.delete),
                    edit: true//item.get(CMDBuildUI.model.base.Base.permissions.edit)
                });
            }
        },

        updateWindowTitle: {
            bind: '{theLink.description}',
            get: function (description) {
                var parentVm = this.getParent();
                parentVm.set('typeDescription', CMDBuildUI.locales.Locales.calendar.event);
                parentVm.set('itemDescription', description);
            }
        },

        updateToolsVisibility: {
            bind: {
                action: '{action}',
                activetab: '{activetab}'
            },
            get: function (data) {
                if (data.action === CMDBuildUI.mixins.DetailsTabPanel.actions.readonly) {
                    var isview = data.activetab === CMDBuildUI.mixins.DetailsTabPanel.actions.view;
                    this.set("hiddentools", {
                        edit: !isview,
                        delete: !isview,
                        open: false
                    });
                } else {
                    this.set("hiddentools", {
                        edit: false,
                        delete: false,
                        open: true
                    });
                }
            }
        }
    }
});
