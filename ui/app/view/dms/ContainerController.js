Ext.define('CMDBuildUI.view.dms.ContainerController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.dms-container',
    control: {
        '#': {
            beforerender: 'onBeforeRender'
        },
        '#dmssearchtext': {
            searchsubmit: 'onSearchSubmit',
            clearsearch: 'onClearSearch',
            specialkey: 'onSearchSpecialKey'
        },
        '#dmsrefreshbtn': {
            click: 'onRefreshBtnClick'
        },
        '> grid': {
            selectionchange: 'onSelectionChange'
        },
        '#dmscontextmenumultiselection': {
            click: 'onDMSContextMenuMultiSelectionClick'
        },
        '#dmscontextmenudelete': {
            click: 'onDMSContextMenuDeleteClick'
        },
        '#dmscontextmenudownload': {
            click: 'onDMSContextMenuDownloadClick'
        }
    },

    /**
     * This function populates the button menu
     * @param {*} view 
     */
    onBeforeRender: function (view) {
        var vm = this.getViewModel();

        vm.bind({
            DMSCategoryType: '{dms-container.DMSCategoryType}',
            hidden: '{attachmentsButton.hidden}'
        }, function (data) {
            if (data.DMSCategoryType && !data.hidden) {

                var categoryValues = data.DMSCategoryType.values();
                var button = this.getView().lookupReference('attachmentsButton');
                var values = categoryValues.getRange();
                var l = values.length;

                switch (l) {
                    case 1:
                        var item = values[0];
                        button.DMSModelName = item.get('modelClass') || data.DMSCategoryType.get('modelClass');
                        button.DMSCategoryValue = item.getId();
                        break;
                    default:
                        var menu = {
                            items: []
                        };
                        values.forEach(function (item, index, array) {
                            menu.items.push({
                                text: item.get('text'),
                                iconCls: CMDBuildUI.model.menu.MenuItem.icons.klass,
                                handler: 'onAttachmentsButtonMenitemClick',
                                DMSModelName: item.get('modelClass') || data.DMSCategoryType.get('modelClass'),
                                DMSCategoryValue: item.getId()
                            });
                        }, this);

                        button.setMenu(menu);
                        break;
                }
            }
        }, this);
    },
    /**
     * 
     * @param {*} attachments 
     * @param {*} records 
     * @param {*} successful 
     * @param {*} operation 
     * @param {*} eOpts 
     */
    onAttachmentsLoad: function (attachments, records, successful, operation, eOpts) {
        var view = this.getView();
        var DMSCategoryType = view.getDMSCategoryType();

        if (successful) {
            view.lookupViewModel().set("tabcounters.attachments", records.length);
        }

        if (DMSCategoryType) {
            var groupKey = attachments.getGroupField();
            var groups = attachments.getGroups();

            var newItems = [];

            DMSCategoryType.values().getRange().forEach(function (item, index, array) {
                var checkCount = item.get('checkCount');
                var checkCountNumber = item.get('checkCountNumber');

                if (Ext.isEmpty(checkCount) || Ext.isEmpty(checkCountNumber)) {
                    var dmsModelName = item.get('modelClass');
                    var dmsClass = CMDBuildUI.util.helper.ModelHelper.getDMSModelFromName(dmsModelName);

                    if (Ext.isEmpty(checkCount)) {
                        checkCount = dmsClass.get('checkCount');
                    }

                    if (Ext.isEmpty(checkCountNumber)) {
                        checkCountNumber = dmsClass.get('checkCountNumber');
                    }
                }

                if (checkCount == CMDBuildUI.model.dms.DMSModel.checkCount.no_check) {
                    return;
                }

                var groupValue = item.get(groupKey); //CMDBuildUI.model.dms.DMSCategory must have a field with this name
                var group = groups.findBy(function (item, key) {
                    return item.getGroupKey() == groupValue;
                }, this, 0);

                var groupLength = group ? group.length : 0;
                switch (checkCount) {
                    case CMDBuildUI.model.dms.DMSModel.checkCount.at_least_number:
                        if (groupLength < checkCountNumber) {
                            newItems.push({
                                html: Ext.String.format(CMDBuildUI.locales.Locales.attachments.warningmessages.atleast, groupLength, groupValue, checkCountNumber)
                            });
                        }
                        break;
                    case CMDBuildUI.model.dms.DMSModel.checkCount.exactly_number:
                        if (groupLength != checkCountNumber) {
                            newItems.push({
                                html: Ext.String.format(CMDBuildUI.locales.Locales.attachments.warningmessages.exactlynumber, groupLength, groupValue, checkCountNumber)
                            });
                        }
                        break;
                    case CMDBuildUI.model.dms.DMSModel.checkCount.max_number:
                        if (groupLength > checkCountNumber) {
                            newItems.push({
                                html: Ext.String.format(CMDBuildUI.locales.Locales.attachments.warningmessages.maxnumber, groupLength, groupValue, checkCountNumber)
                            });
                        }
                        break;
                }
            }, this);

            var messageContainer = view.lookupReference('message-container');
            messageContainer.removeAll();
            messageContainer.add(newItems);
        }
    },

    /**
     * 
     * @param {*} button 
     * @param {*} e 
     */
    onAttachmentsButtonClick: function (button, e) {
        if (!button.getMenu()) {
            this.openCreatePopup(button.DMSModelName, button.DMSCategoryValue);
        }
    },

    /**
     * 
     * @param {*} item 
     * @param {*} e 
     */
    onAttachmentsButtonMenitemClick: function (item, e) {
        this.openCreatePopup(item.DMSModelName, item.DMSCategoryValue);
    },

    /**
     * 
     * @param {Ext.form.field.Text} field 
     * @param {String} value 
     * @param {Object} eOpts 
     */
    onSearchSubmit: function (field, value, eOpts) {
        if (value) {
            var vm = field.lookupViewModel(),
                store = vm.get("attachments");
            store.getAdvancedFilter().addQueryFilter(value);
            store.load();
        } else {
            this.onClearSearch(field, eOpts);
        }
    },

    /**
     * 
     * @param {Ext.form.field.Text} field 
     * @param {Object} eOpts 
     */
    onClearSearch: function (field, eOpts) {
        var vm = field.lookupViewModel(),
            store = vm.get("attachments");
        store.getAdvancedFilter().clearQueryFilter();
        store.load();
        field.setValue(null);
    },

    /**
     * @param {Ext.form.field.Base} field
     * @param {Ext.event.Event} event
     */
    onSearchSpecialKey: function (field, event) {
        if (event.getKey() == event.ENTER) {
            this.onSearchSubmit(field, field.getValue(), event);
        }
    },

    /**
     * 
     * @param {Ext.button.Button} btn 
     * @param {Object} eOpts 
     */
    onRefreshBtnClick: function (btn, eOpts) {
        var vm = this.getView().lookupViewModel(),
            store = vm.get("attachments");
        store.load();
    },

    openCreatePopup: function (modelName, DMSCategoryValue) {
        CMDBuildUI.util.helper.ModelHelper.getModel(
            CMDBuildUI.util.helper.ModelHelper.objecttypes.dmsmodel,
            modelName
        ).then(function (model) {

            var view = this.getView();

            var title = CMDBuildUI.locales.Locales.attachments.new;
            panel = CMDBuildUI.util.Utilities.openPopup('popup-add-attachment-form', title, {

                xtype: 'dms-attachment-create',
                objectType: view.getObjectType(),
                objectTypeName: view.getObjectTypeName(),
                objectId: view.getObjectId(),
                attachmentId: null,
                DMSCategoryTypeName: view.getDMSCategoryTypeName(),
                DMSCategoryValue: DMSCategoryValue,
                ignoreSchedules: view.getIgnoreSchedules()

            }, {
                popupsave: {
                    fn: function () {
                        this.getViewModel().getStore('attachments').load();
                    },
                    scope: this
                },
                popupcancel: function () { }
            });

        }, Ext.emptyFn, Ext.emptyFn, this);
    },

    /**
     * 
     * @param {Ext.grid.Panel} grid 
     * @param {Ext.data.Model[]} selected 
     * @param {Object} eOpts 
     */
    onSelectionChange: function (grid, selected, eOpts) {
        var vm = this.getViewModel();
        if (selected.length > 1) {
            vm.set("disabledbulkactions", false);
        } else {
            vm.set("disabledbulkactions", true);
        }
    },

    /**
     * 
     * @param {Ext.menu.Item} menuitem 
     * @param {Object} eOpts 
     */
    onDMSContextMenuMultiSelectionClick: function (menuitem, eOpts) {
        var grid = this.lookupReference('dms-grid'),
            selectionmode,
            excludeToggleOnColumn = [];
        if (menuitem.multiselection) {
            menuitem.setText(CMDBuildUI.locales.Locales.common.grid.enamblemultiselection);
            menuitem.setIconCls('x-fa fa-square-o');
            selectionmode = 'SINGLE';
            grid.selModel.column.hide();
        } else {
            menuitem.setText(CMDBuildUI.locales.Locales.common.grid.disablemultiselection);
            menuitem.setIconCls('x-fa fa-check-square-o');
            selectionmode = 'MULTI';
            grid.selModel.column.show();
            excludeToggleOnColumn = [1];
        }
        // find position of preview column and add into excludeToggleOnColumn variable
        var columns = grid.getVisibleColumns();
        var previewColumn = Ext.Array.findBy(columns, function (item) {
            return item.text === CMDBuildUI.locales.Locales.attachments.preview;
        });
        if (previewColumn) {
            var columnindex = previewColumn ? Ext.Array.indexOf(columns, previewColumn) : null;
            excludeToggleOnColumn.push(columnindex);
        }

        // update seleciton mode
        grid.getSelectionModel().setSelectionMode(selectionmode);
        // update exclude toggle columns
        grid.getSelectionModel().excludeToggleOnColumn = excludeToggleOnColumn;
        // update multiselection variable
        menuitem.multiselection = !menuitem.multiselection;
    },

    /**
     * 
     * @param {Ext.menu.Item} menuitem 
     * @param {Object} eOpts 
     */
    onDMSContextMenuDeleteClick: function (menuitem, eOpts) {
        var grid = this.lookupReference('dms-grid'),
            selection = grid.getSelection();

        // create confirm message
        var message = Ext.String.format(
            CMDBuildUI.locales.Locales.bulkactions.confirmdeleteattachements,
            selection.length
        );
        CMDBuildUI.util.Msg.confirm(
            CMDBuildUI.locales.Locales.notifier.attention,
            message,
            function (btn) {
                if (btn === "yes") {
                    var loadmask = CMDBuildUI.util.Utilities.addLoadMask(grid);
                    var store = grid.getStore();
                    store.remove(selection);
                    store.sync({
                        success: function (batch, options) {
                            CMDBuildUI.util.Utilities.removeLoadMask(loadmask);
                            this.onRefreshBtnClick();
                        },
                        scope: this
                    });
                }
            },
            this
        );
    },

    /**
     * 
     * @param {Ext.menu.Item} menuitem 
     * @param {Object} eOpts 
     */
    onDMSContextMenuDownloadClick: function (menuitem, eOpts) {
        var vm = menuitem.lookupViewModel(),
            grid = this.lookupReference('dms-grid'),
            selection = grid.getSelection(),
            desc = vm.get("itemDescription") || '';

        // remove special characters
        desc = desc.replace(/[^a-zA-Z0-9]/g, '');
        desc = desc ? desc.substring(0, 30) : 'attachments';
        // define filename
        var filename = desc + '.zip';

        // get attachments ids
        var attachmentsIds = [];
        selection.forEach(function (att) {
            attachmentsIds.push(att.getId());
        });

        // define url
        var url = Ext.String.format('{0}{1}/_MANY/{2}?attachmentId={3}',
            CMDBuildUI.util.Config.baseUrl,
            this.getViewModel().get('proxyUrl'), //specificated in CMDBuildUI.view.dms.GridModel
            filename,
            attachmentsIds.join(',')
        );

        // download file
        CMDBuildUI.util.File.download(url, filename);
    }
});
