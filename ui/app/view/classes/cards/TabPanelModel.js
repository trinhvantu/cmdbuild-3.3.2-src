Ext.define('CMDBuildUI.view.classes.cards.TabPanelModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.classes-cards-tabpanel',

    data: {
        objectType: CMDBuildUI.util.helper.ModelHelper.objecttypes.klass,
        objectTypeName: null,
        objectId: null,
        objectDescription: null,
        storeinfo: {
            autoload: false
        },
        basepermissions: {
            clone: false,
            delete: false,
            edit: false
        },
        configenabled: {
            bim: false,
            relgraph: false,
            help: false
        },
        disabled: {
            attachments: true,
            card: false,
            email: true,
            history: true,
            masterdetail: true,
            notes: true,
            relations: true,
            schedules: true
        },
        permissions: {
            clone: false,
            delete: false,
            edit: false,
            relgraph: false,
            print: false,
            bim: false
        },
        hiddentools: {
            edit: true,
            delete: true,
            clone: true,
            bim: true,
            relgrap: true,
            print: true,
            open: true,
            help: true
        },
        emailtemplatestoevaluate: [],
        tabcounters: {
            attachments: false,
            emails: false,
            notes: false
        }
    },

    formulas: {
        updateWindowTitle: {
            bind: {
                objecttypename: '{objectTypeName}',
                objectid: '{objectId}'
            },
            get: function (data) {
                // TODO: improve
                var view = this.getView();
                if (view.isInDetailWindow() && data.objecttypename && data.objectid) {
                    var me = this;
                    // set description for parent view model
                    me.getParent().set(
                        "typeDescription",
                        CMDBuildUI.util.helper.ModelHelper.getClassDescription(data.objecttypename)
                    );
                    // set item description in parent view model
                    CMDBuildUI.util.helper.ModelHelper.getModel(CMDBuildUI.util.helper.ModelHelper.objecttypes.klass, data.objecttypename).then(function (model) {
                        model.load(data.objectid, {
                            callback: function (record, operation, success) {
                                if (success) {
                                    me.getParent().set(
                                        "itemDescription",
                                        record.get("Description")
                                    );
                                }
                            }
                        });
                    });
                }
            }
        },

        updateToolsVisibility: {
            bind: {
                action: '{action}',
                activetab: '{activetab}',
                enabledbim: '{configenabled.bim}',
                enabledrelgraph: '{configenabled.relgraph}',
                enabledhelp: '{configenabled.help}'
            },
            get: function (data) {
                if (data.action === CMDBuildUI.mixins.DetailsTabPanel.actions.readonly) {
                    var isview = data.activetab === CMDBuildUI.mixins.DetailsTabPanel.actions.view;
                    this.set("hiddentools.edit", !isview);
                    this.set("hiddentools.delete", !isview);
                    this.set("hiddentools.clone", !isview);
                    this.set("hiddentools.bim", data.enabledbim ? !isview : true);
                    this.set("hiddentools.relgraph", data.enabledrelgraph ? !isview : true);
                    this.set("hiddentools.print", !isview);
                    this.set("hiddentools.help", data.enabledhelp ? !isview : true);
                    this.set("hiddentools.open", false);
                } else {
                    this.set("hiddentools.edit", false);
                    this.set("hiddentools.delete", false);
                    this.set("hiddentools.clone", false);
                    this.set("hiddentools.bim", !data.enabledbim);
                    this.set("hiddentools.relgraph", !data.enabledrelgraph);
                    this.set("hiddentools.print", false);
                    this.set("hiddentools.help", !data.enabledhelp);
                    this.set("hiddentools.open", true);
                }
            }
        },

        updateCounters: {
            bind: {
                attachments: '{theObject._attachment_count}',
                emails: '{theObject._email_count}',
                notes: '{theObject.Notes}'
            },
            get: function (data) {
                this.set('tabcounters', {
                    attachments: data.attachments,
                    emails: data.emails,
                    notes: !!CMDBuildUI.util.Utilities.extractTextFromHTML(data.notes || null)
                });
            }
            
        },

        updatePermissions: {
            bind: {
                clone: '{theObject._model.' + CMDBuildUI.model.base.Base.permissions.clone + '}',
                delete: '{theObject._model.' + CMDBuildUI.model.base.Base.permissions.delete + '}',
                edit: '{theObject._model.' + CMDBuildUI.model.base.Base.permissions.edit + '}'
            },
            get: function (data) {
                // set base permissions
                this.set("basepermissions", {
                    clone: data.clone,
                    delete: data.delete,
                    edit: data.edit
                });

                // set help tool visibility config
                this.set("configenabled.help", !Ext.isEmpty(this.get("theObject._model.metadata.cm_help")));
            }
        }
    }
});