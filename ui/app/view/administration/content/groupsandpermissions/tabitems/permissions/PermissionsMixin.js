Ext.define('CMDBuildUI.view.administration.content.groupsandpermissions.tabitems.permissions.PermissionsMixin', {
    mixinId: 'administration-permissions-tab-mixin',

    /**
     * Filter grid items.
     * @param {Ext.form.field.Text} field
     * @param {Ext.form.trigger.Trigger} trigger
     * @param {Object} eOpts
     */
    onSearchChange: function (field, trigger, eOpts) {
        // get value
        var searchTerm = field.value;
        var filterCollection = this.getView().down('grid').getStore().getFilters();
        if (searchTerm) {
            filterCollection.add([{
                id: 'objectTypeNameFilter',
                property: '_object_description',
                operator: 'like',
                value: searchTerm
            }]);
        } else {
            this.onSearchClear(field);
        }
    },

    /**
     * Reset search field
     * @param {Ext.form.field.Text} field
     * @param {Ext.form.trigger.Trigger} trigger
     * @param {Object} eOpts
     */
    onSearchClear: function (field, trigger, eOpts) {
        // clear store filter
        var filterCollection = this.getView().down('grid').getStore().getFilters();
        filterCollection.removeByKey('objectTypeNameFilter');

        // reset input
        field.reset();
    },

    /**
     * Function for enable/disable sub tabs of "Permission" permission tab panel
     * @param {Number} index 
     */
    toggleEnablePermissionsTabs: function (index) {
        var vm = Ext.getCmp('CMDBuildAdministrationPermissions').getViewModel();
        vm.toggleEnableTabs(index);
    },

    /**
     * Function for enable/disable tabs of 
     * "CMDBuildUI.view.administration.content.groupsandpermissions.View" tab 
     * panel
     * @param {Number} index 
     */
    toggleEnableTabs: function (index) {
        var vm = Ext.getCmp('CMDBuildAdministrationContentGroupView').getViewModel();
        vm.toggleEnableTabs(index);
    },

    /**
     * 
     *  The filter to edit.
     *       
     * 
     * @param {Ext.view.Table} view The owning TableView.
     * @param {Number} rowIndex The row index clicked on.
     * @param {Number} colIndex The column index clicked on.
     * @param {Object} item The clicked item (or this Column if multiple cfg-items were not configured).
     * @param {Event} e The click event.
     * @param {CMDBuildUI.model.users.Grant} record The Record underlying the clicked row.
     */
    onActionFiltersClick: function (grid, rowIndex, colIndex, button, event, record) {
        var me = this;
        var popup;

        var actions = me.getViewModel().get('actions');
        var recordFilter = record.get('filter').length ? JSON.parse(record.get('filter')) : {};
        var popuTitle = actions.view ?
            CMDBuildUI.locales.Locales.administration.groupandpermissions.texts.viewfilters :
            CMDBuildUI.locales.Locales.administration.groupandpermissions.texts.editfilters;

        var type = record.get("objectType");

        popuTitle = Ext.String.format(
            popuTitle,
            type,
            record.get('_object_description'));

        var filter = Ext.create('CMDBuildUI.model.base.Filter', {
            name: CMDBuildUI.locales.Locales.filters.newfilter,
            description: CMDBuildUI.locales.Locales.filters.newfilter,
            target: record.get("objectTypeName"),
            configuration: recordFilter

        });

        var viewmodel = {
            data: {
                objectType: record.get("objectType"),
                objectTypeName: record.get("objectTypeName"),
                theFilter: filter,
                attributesPrivileges: record.get("attributePrivileges"),
                actions: Ext.copy(actions)
            }
        };

        var listeners = {
            /**
             * 
             * @param {CMDBuildUI.view.filters.Panel} panel 
             * @param {CMDBuildUI.model.base.Filter} filter 
             * @param {Object} eOpts 
             */
            applyfilter: function (panel, filter, eOpts) {
                me.onApplyFilter(filter);
                popup.close();
            },
            /**
             * 
             * @param {CMDBuildUI.view.filters.Panel} panel 
             * @param {CMDBuildUI.model.base.Filter} filter 
             * @param {Object} eOpts 
             */
            saveandapplyfilter: function (panel, filter, eOpts) {
                me.onSaveAndApplyFilter(filter);
                popup.close();
            },
            /**
             * Custom event to close popup directly from popup
             * @param {Object} eOpts 
             */
            popupclose: function (eOpts) {
                popup.close();
            }
        };

        var dockedItems = [{
            xtype: 'toolbar',
            dock: 'bottom',
            ui: 'footer',
            hidden: me.getViewModel().get('actions.view'),
            items: CMDBuildUI.util.administration.helper.FormHelper.getOkCloseButtons({
                handler: function (button) {
                    var attributespanel = popup.down('administration-filters-attributes-panel');
                    var functionspanel = popup.down('administration-components-functionfilters-panel');
                    var columnprivilegespanel = popup.down('administration-components-columnsprivileges-panel');
                    // set filter
                    var value = Ext.JSON.encode({
                        attribute: attributespanel.getAttributesData(),
                        functions: functionspanel.getFunctionData()
                    });

                    if (Ext.Object.isEmpty(Ext.JSON.decode(value, true))) {
                        value = null;
                    }
                    record.set('filter', value);
                    // set row privileges
                    var attributePrivileges = record.get('attributePrivileges');
                    var attributes = columnprivilegespanel.lookupViewModel().get("attributes");
                    if (attributes && attributes.getRange().length) {
                        attributePrivileges = {};
                        attributes.getRange().forEach(function (row) {
                            attributePrivileges[row.get("name")] = row.get("mode");
                        });
                    }
                    record.set('attributePrivileges', attributePrivileges);
                    popup.close();
                }
            }, {
                handler: function () {
                    popup.close();
                }
            })
        }];

        var tabpanel = {
            xtype: 'tabpanel',
            layout: 'fit',
            ui: 'administration-tabandtools',
            viewModel: viewmodel,
            dockedItems: dockedItems,
            items: [],
            listeners: {
                beforerender: function (view) {
                    var tabPanelHelper = CMDBuildUI.util.administration.helper.TabPanelHelper;
                    tabPanelHelper.addTab(view, "rowsprivileges", CMDBuildUI.locales.Locales.administration.groupandpermissions.texts.rowsprivileges, [{
                        xtype: 'administration-components-rowsprivileges-tabpanel',
                        autoScroll: true,
                        dockedItems: [{
                            xtype: 'toolbar',
                            dock: 'bottom',
                            ui: 'footer',
                            hidden: me.getViewModel().get('actions.view'),
                            bind: {
                                hidden: '{!record.modeTypeWrite}'
                            },
                            padding: 10,
                            items: [
                                '->', {
                                    xtype: 'checkbox',
                                    fieldLabel: CMDBuildUI.locales.Locales.administration.groupandpermissions.fieldlabels.onfiltermismatch,
                                    localized: {
                                        fieldLabel: 'CMDBuildUI.locales.Locales.administration.groupandpermissions.fieldlabels.onfiltermismatch'
                                    },
                                    labelWidth: 'auto',
                                    bind: {
                                        readOnly: '{actions.view}',
                                        value: '{record._on_filter_mismatch_calculated}'
                                    },
                                    listeners: {
                                        change: function (checkbox, newValue, oldValue) {
                                            checkbox.lookupViewModel().set('record._on_filter_mismatch', newValue ? 'read' : 'none');
                                        }
                                    }
                                }
                            ]
                        }]
                    }], 0, {});
                    tabPanelHelper.addTab(view, "columnsprivileges", CMDBuildUI.locales.Locales.administration.groupandpermissions.texts.columnsprivileges, [{
                        xtype: 'administration-components-columnsprivileges-panel',
                        autoScroll: true
                    }], 1, {});
                    view.setActiveTab(0);
                }
            }
        };


        popup = CMDBuildUI.util.Utilities.openPopup(
            null,
            popuTitle,
            tabpanel,
            listeners, {
                ui: 'administration-actionpanel',
                viewModel: {
                    data: {
                        index: rowIndex,
                        grid: grid,
                        record: record,
                        canedit: false
                    }
                }
            }
        );

        if (me.getViewModel().get('actions.view')) {
            popup.down('administration-filters-attributes-panel').down('panel').hide();
        }
    },

    /**
     * 
     * @param {Ext.view.Table} view The owning TableView.
     * @param {Number} rowIndex The row index clicked on.
     * @param {Number} colIndex The column index clicked on.
     * @param {Object} item The clicked item (or this Column if multiple cfg-items were not configured).
     * @param {Event} e The click event.
     * @param {CMDBuildUI.model.users.Grant} record The Record underlying the clicked row.
     */
    onRemoveFilterActionClick: function (grid, rowIndex, colIndex, button, event, record) {
        if (record.previousValues && (record.previousValues.filter || record.previousValues.attributePrivileges)) {
            delete record.previousValues.filter;
            delete record.previousValues.attributePrivileges;
            if (record.modified) {
                delete record.modified.filter;
                delete record.modified.attributePrivileges;
            }
        }
        record.set('filter', '');
        record.set('attributePrivileges', {});
        record.crudState = record.crudStateWas = Ext.Object.getSize(record.modified) ? 'U' : 'R';
    },

    /**
     * 
     * @param {CMDBuildUI.model.users.Grant} record 
     * 
     * @return {Boolean}
     */
    getGrantConfigsAreDefault: function (record) {

        var fields = this.getConfigFieldsByObjectType(record);
        var defaultValues = this.getConfigFieldsDefaultValues(record);
        var isDefault = true;
        Ext.Array.forEach(fields || [], function (field) {
            if (isDefault) {
                isDefault = defaultValues[field] === record.get(field);
            }
        });
        return isDefault;
    },

    /**
     * 
     * @param {CMDBuildUI.model.users.Grant} record 
     * 
     * @return {Object}
     */
    getConfigFieldsDefaultValues: function (record) {
        var fields = {};
        fields[CMDBuildUI.util.helper.ModelHelper.objecttypes.klass] = {
            '_attachment_access': '',
            '_can_clone': true,
            '_can_create': true,
            '_can_delete': true,
            '_can_print': true,
            '_can_update': true,
            '_detail_access': '',
            '_email_access': '',
            '_history_access': '',
            '_note_access': '',
            '_relation_access': '',
            '_schedule_access': '',
            '_relgraph_access': true,
            '_can_bulk_update': null,
            '_can_bulk_delete': null
        };
        fields[CMDBuildUI.util.helper.ModelHelper.objecttypes.process] = {
            '_attachment_access': '',            
            '_email_access': '',
            '_history_access': '',
            '_note_access': '',
            '_relation_access': '',
            '_can_fc_attachment': null,
            '_can_bulk_abort': null
        };
        fields[CMDBuildUI.util.helper.ModelHelper.objecttypes.view] = {
            '_can_print': true
        };
        
        Ext.Array.forEach(Ext.Object.getKeys(record.data), function (key) {
            if (Ext.String.startsWith(key, '_widget_') || Ext.String.startsWith(key, '_contextmenu_')) {
                
                fields[record.get('objectType')][key] = true;
            }
        });
        return fields[record.get('objectType')];
    },
    /**
     * 
     * @param {CMDBuildUI.model.users.Grant} record 
     * 
     * @return {Array}
     */
    getConfigFieldsByObjectType: function (record) {
        return Ext.Object.getKeys(this.getConfigFieldsDefaultValues(record));
    },

    /**
     * 
     * @param {CMDBuildUI.model.users.Grant} record 
     * 
     * @return {Object}
     */
    getConfigFieldsInitialValues: function (record) {
        var initValues = {};
        Ext.Array.forEach(this.getConfigFieldsByObjectType(record), function (element) {
            initValues[element] = record.get(element);
        });
        return initValues;
    },

    /**
     * 
     * @param {Ext.view.Table} view The owning TableView.
     * @param {Number} rowIndex The row index clicked on.
     * @param {Number} colIndex The column index clicked on.
     * @param {Object} item The clicked item (or this Column if multiple cfg-items were not configured).
     * @param {Event} e The click event.
     * @param {CMDBuildUI.model.users.Grant} record The Record underlying the clicked row.
     */
    onClearConfigClick: function (grid, rowIndex, colIndex, button, event, record) {
        var fields = this.getConfigFieldsByObjectType(record);
        var defaultValues = this.getConfigFieldsDefaultValues(record);
        Ext.Array.forEach(fields, function (field) {
            record.set(field, defaultValues[field]);
        });
        record.crudState = record.crudStateWas = Ext.Object.getSize(record.modified) ? 'U' : 'R';
    },

    /**
     * 
     * @param {CMDBuildUI.model.users.Grant} record 
     * @param {Object} initValues 
     */
    setConfigInitValues: function (record, initValues) {
        Ext.Array.forEach(Ext.Object.getKeys(initValues), function (element) {
            record.set(element, initValues[element]);
            if (record.previousValues && record.modified) {
                delete record.previousValues[element];
                delete record.modified[element];
            }
        });
    }
});