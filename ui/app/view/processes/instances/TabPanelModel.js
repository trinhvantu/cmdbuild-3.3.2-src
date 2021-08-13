Ext.define('CMDBuildUI.view.processes.instances.TabPanelModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.processes-instances-tabpanel',

    data: {
        objectType: CMDBuildUI.util.helper.ModelHelper.objecttypes.process,
        objectTypeName: null,
        objectId: null,
        activityId: null,
        activeTab: 0,
        storeinfo: {
            autoload: false
        },
        disabled: {
            activity: false,
            attachments: true,
            emails: true,
            history: true,
            notes: true,
            relations: true
        },
        basepermissions: {
            delete: false,
            edit: false
        },
        configenabled: {
            relgraph: false
        },
        permissions: {
            edit: false,
            delete: false,
            relgraph: false
        },
        hiddentools: {
            open: true,
            edit: true,
            delete: true,
            relgraph: true,
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
                objecttypename: '{objectTypeName}'
            },
            get: function(data) {
                if (data.objecttypename) {
                    this.getParent().set(
                        "typeDescription",
                        CMDBuildUI.util.helper.ModelHelper.getProcessDescription(data.objecttypename)
                    );
                }
            }
        },

        updateToolsVisibility: {
            bind: {
                action: '{action}',
                activetab: '{activetab}',
                enabledrelgraph: '{configenabled.relgraph}'
            },
            get: function(data) {
                var proc = CMDBuildUI.util.helper.ModelHelper.getProcessFromName(this.get("objectTypeName"));
                if (data.action === CMDBuildUI.mixins.DetailsTabPanel.actions.readonly) {
                    var isview = data.activetab === CMDBuildUI.mixins.DetailsTabPanel.actions.view;
                    this.set("hiddentools", {
                        edit: !isview,
                        delete: !isview,
                        relgraph: data.enabledrelgraph ? !isview : true,
                        open: false,
                        help: !Ext.isEmpty(proc.get("help")) ? !isview : true
                    });
                } else {
                    this.set("hiddentools", {
                        edit: false,
                        delete: false,
                        relgraph: !data.enabledrelgraph,
                        open: true,
                        help: Ext.isEmpty(proc.get("help"))
                    });
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
        }
    }
});
