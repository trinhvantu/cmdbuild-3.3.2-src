Ext.define('CMDBuildUI.view.emails.email.Mixin', {
    mixinId: 'email-mixin',

    config: {
        modelValidation: true,
        
        /**
         * @cfg {String} storeurl
         */
        storeurl: null,

        // create/edit form
        items: [{
            xtype: 'fieldcontainer',
            padding: CMDBuildUI.util.helper.FormHelper.properties.padding,
            forceFit: true,
            layout: 'fit',
            fieldDefaults: CMDBuildUI.util.helper.FormHelper.fieldDefaults,
            items: [{
                layout: 'column',
                items: [{
                    xtype: 'combobox',
                    itemId: 'templatecombo',
                    fieldLabel: CMDBuildUI.locales.Locales.emails.composefromtemplate,
                    localized: {
                        fieldLabel: 'CMDBuildUI.locales.Locales.emails.composefromtemplate'
                    },
                    queryMode: 'local',
                    forceSelection: true,
                    displayField: 'description',
                    valueField: '_id',
                    bind: {
                        store: '{templates}',
                        value: '{theEmail.template}',
                        disabled: '{disabled.templatechoice}'
                    },
                    columnWidth: 0.4
                }, {
                    xtype: 'checkboxfield',
                    fieldLabel: CMDBuildUI.locales.Locales.emails.keepsynchronization,
                    localized: {
                        fieldLabel: 'CMDBuildUI.locales.Locales.emails.keepsynchronization'
                    },
                    bind: {
                        value: '{theEmail.keepSynchronization}',
                        disabled: '{disabled.keepsync}'
                    },
                    columnWidth: 0.2
                }, {
                    xtype: 'combobox',
                    reference: 'delay',
                    fieldLabel: CMDBuildUI.locales.Locales.emails.delay,
                    localized: {
                        fieldLabel: 'CMDBuildUI.locales.Locales.emails.delay'
                    },
                    displayField: 'label',
                    valueField: 'value',
                    bind: {
                        store: '{delays}',
                        value: '{theEmail.delay}'
                    },
                    columnWidth: 0.4
                }]
            }, {
                xtype: 'displayfield',
                fieldLabel: CMDBuildUI.locales.Locales.emails.from,
                localized: {
                    fieldLabel: 'CMDBuildUI.locales.Locales.emails.from'
                },
                bind: {
                    value: '{theEmail.from}'
                }
            }, {
                xtype: 'textfield',
                fieldLabel: CMDBuildUI.locales.Locales.emails.to,
                localized: {
                    fieldLabel: 'CMDBuildUI.locales.Locales.emails.to'
                },
                bind: {
                    value: '{theEmail.to}'
                }
            }, {
                xtype: 'textfield',
                fieldLabel: CMDBuildUI.locales.Locales.emails.cc,
                localized: {
                    fieldLabel: 'CMDBuildUI.locales.Locales.emails.cc'
                },
                bind: {
                    value: '{theEmail.cc}'
                }
            }, {
                xtype: 'textfield',
                fieldLabel: CMDBuildUI.locales.Locales.emails.bcc,
                localized: {
                    fieldLabel: 'CMDBuildUI.locales.Locales.emails.bcc'
                },
                bind: {
                    value: '{theEmail.bcc}'
                }
            }, {
                xtype: 'textfield',
                allowBlank: false,
                fieldLabel: CMDBuildUI.locales.Locales.emails.subject,
                localized: {
                    fieldLabel: 'CMDBuildUI.locales.Locales.emails.subject'
                },
                bind: {
                    value: '{theEmail.subject}'
                }
            }, CMDBuildUI.util.helper.FieldsHelper.getHTMLEditor({
                reference: 'body',
                allowBlank: false,
                fieldLabel: CMDBuildUI.locales.Locales.emails.message,
                localized: {
                    fieldLabel: 'CMDBuildUI.locales.Locales.emails.message'
                },
                bind: {
                    value: '{theEmail._content_html}'
                }
            }), {
                padding: '15 0 15 0',
                layout: 'column',
                hidden: true,
                bind: {
                    hidden: '{addAttachmentsHidden}'
                },
                items: [{
                    xtype: 'filefield',
                    buttonOnly: true,
                    itemId: 'addfileattachment',
                    buttonText: CMDBuildUI.locales.Locales.emails.attachfile,
                    ui: 'secondary-action',
                    localized: {
                        buttonText: 'CMDBuildUI.locales.Locales.emails.attachfile'
                    }
                }, {
                    xtype: 'button',
                    margin: '0 0 0 15',
                    itemId: 'addattachmentsfromdocumentarchive',
                    reference: 'addattachmentsfromdocumentarchive',
                    text: CMDBuildUI.locales.Locales.emails.addattachmentsfromdocumentarchive,
                    ui: 'secondary-action',
                    localized: {
                        text: 'CMDBuildUI.locales.Locales.emails.addattachmentsfromdocumentarchive'
                    }
                }]
            }]
        }, {
            xtype: 'grid',
            reference: 'attachmentsgrid',
            itemId: 'attachmentsgrid',
            forceFit: true,
            hidden: true,
            columns: [{
                text: CMDBuildUI.locales.Locales.attachments.filename,
                dataIndex: 'name',
                align: 'left',
                localized: {
                    text: 'CMDBuildUI.locales.Locales.attachments.filename'
                },
                width: '45%'
            }, {
                text: CMDBuildUI.locales.Locales.attachments.description,
                dataIndex: 'description',
                align: 'left',
                localized: {
                    text: 'CMDBuildUI.locales.Locales.attachments.description'
                },
                width: '45%'
            }, {
                xtype: 'actioncolumn',
                minWidth: '10%', // width property not works. Use minWidth.
                align: 'right',
                items: [{
                    iconCls: 'attachments-grid-action x-fa fa-download',
                    getTip: function () {
                        return CMDBuildUI.locales.Locales.attachments.download;
                    },
                    handler: function (grid, rowIndex, colIndex) {
                        var record = grid.getStore().getAt(rowIndex);
                        var attachmentStore = grid.getStore();
                        var url = Ext.String.format(
                            "{0}/{1}/{2}",
                            attachmentStore.getProxy().getUrl(), // base url 
                            record.getId(), // attachment id
                            record.get("name") // file name
                        );
                        CMDBuildUI.util.File.download(url, record.get("name"));
                    },
                    isDisabled: function (view, rowIndex, colIndex, item, record) {
                        return record.get('newAttachment');
                    }
                },
                {
                    iconCls: 'attachments-grid-action x-fa fa-trash',
                    getTip: function () {
                        return CMDBuildUI.locales.Locales.attachments.deleteattachment;
                    },
                    handler: function (grid, rowIndex, colIndex, item, event, record) {
                        var attachmentStore = grid.getStore();
                        attachmentStore.remove(record);
                    }
                }
                ]
            }],
            bind: {
                store: '{attachments}',
                hidden: '{!attachmentsTotalCount}'
            }
        }],

        buttons: [{
            text: CMDBuildUI.locales.Locales.common.actions.save,
            reference: 'saveBtn',
            itemId: 'saveBtn',
            formBind: true,
            disabled: true,
            ui: 'management-action',
            localized: {
                text: 'CMDBuildUI.locales.Locales.common.actions.save'
            }
        }, {
            text: CMDBuildUI.locales.Locales.common.actions.cancel,
            reference: 'cancelBtn',
            itemId: 'cancelBtn',
            ui: 'secondary-action',
            localized: {
                text: 'CMDBuildUI.locales.Locales.common.actions.cancel'
            }
        }]
    },

    /**
     * Add attachment from file
     * 
     * @param {Ext.form.field.File} filefield 
     */
    addFileAttachment: function (filefield) {
        var vm = this.lookupViewModel();
        
        var store = vm.getStore('attachments');
        if (filefield.fileInputEl.dom.files.length) {
            Ext.Array.from(filefield.fileInputEl.dom.files).forEach(function(file) {
                if (store.findRecord('name', file.name)) {
                    var w = Ext.create('Ext.window.Toast', {
                        title: CMDBuildUI.locales.Locales.notifier.warning,
                        html: CMDBuildUI.locales.Locales.emails.alredyexistfile,
                        iconCls: 'x-fa fa-exclamation-circle',
                        align: 'br',
                        alwaysOnTop: 2
                    });
                    w.show();
                } else {
                    store.add([{
                        name: file.name,
                        _modified: file.lastModifiedDate,
                        _file: file,
                        DMSAttachment: false,
                        newAttachment: true
                    }]);
                }
            });


            filefield.suspendEvent('change');
            filefield.reset();
            filefield.resumeEvent('change');
        }
    },

    /**
     * Add attacmhent from database
     */
    addDmsAttachment: function () {
        var vm = this.lookupViewModel();
        var title = CMDBuildUI.locales.Locales.emails.dmspaneltitle;
        var config = {
            xtype: 'emails-dmsattachments-panel',
            store: vm.getStore('attachments'),
            viewModel: {
                data: {
                    objectType: CMDBuildUI.util.helper.ModelHelper.getObjectTypeByName(vm.get("objectdata._type")),
                    objectTypeName: vm.get("objectdata._type"),
                    objectId: vm.get("objectdata._id")
                }
            }
        };
        CMDBuildUI.util.Utilities.openPopup('popup-add-attachmentfromdms-panel', title, config, null, {
            alwaysOnTop: 100
        });
    },

    /**
     * 
     * @param {CMDBuildUI.model.base.ComboItem} template 
     */
    updateEmailFromTemplate: function (template) {
        var vm = this.lookupViewModel();
        if (template) {
            var theEmail = vm.get("theEmail");

            // update card data
            theEmail.set("_card", vm.get("objectdata"));

            // update and save email from template
            theEmail.save({
                params: {
                    apply_template: true,
                    template_only: true
                },
                success: function(record) {
                    record.phantom = true;
                }
            });
        }
    },

    checkAlreadyExists: function (filename, store) {
        var presence = false;
        var items = store.getRange();
        items.forEach(function (item) {
            if (item.get('name') == filename.name) {
                presence = true;
                return;
            }
        });
        return presence;
    }

});