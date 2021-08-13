Ext.define('CMDBuildUI.view.processes.instances.RowContainerController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.processes-instances-rowcontainer',

    control: {
        '#': {
            beforerender: 'onBeforeRender'
        },
        '#activityList': {
            rowdblclick: 'onRowDblClick',
            afterrender: 'onGridAfterRender'
        }
    },

    /**
     * 
     * @param {CMDBuildUI.view.processes.instances.RowContainer} view 
     * @param {Object} eOpts 
     */
    onBeforeRender: function (view, eOpts) {
        var me = this;
        var config = view.getInitialConfig();
        if (!Ext.isEmpty(config._rowContext)) {
            // get widget record
            var record = config._rowContext.record;
            if (record && record.getData()) {
                // tasks
                var tasks = record.get("_tasklist");
                if (tasks.length === 1) {
                    var conf = CMDBuildUI.util.helper.GridHelper.getFormInRowWidget(
                        CMDBuildUI.util.helper.ModelHelper.objecttypes.process, {
                        height: me.getRowWidgetHeight(),
                        viewModel: {
                            data: {
                                objectId: record.getId(),
                                objectTypeName: record.get("_type"),
                                activityId: tasks[0]._id
                            }
                        }
                    }
                    );
                    if (view.tabpaneltools) {
                        conf.tabpaneltools = view.tabpaneltools;
                    }
                    view.add(conf);
                } else if (tasks.length > 1) {
                    view.add(me.getSubGridConfig(record, tasks));
                }
            }
        }
    },

    onGridAfterRender: function (grid) {
        var column = grid.getColumns()[1];
        Ext.asap(function () {
            column.autoSize();
        });
    },

    privates: {
        /**
         * 
         * @param {CMDBuildUI.model.processes.Instance} record
         * @param {Object[]} tasks 
         * @return {Object} grid config
         */
        getSubGridConfig: function (record, tasks) {
            var me = this;
            var data = [];
            tasks.forEach(function (t) {
                data.push({
                    _id: record.getId(),
                    _type: record.get("_type"),
                    _activity_id: t._id,
                    description: t._description_translation,
                    description_addition: t.description_addition
                });
            });
            var widget = CMDBuildUI.util.helper.GridHelper.getFormInRowWidget(
                CMDBuildUI.util.helper.ModelHelper.objecttypes.process, {
                height: me.getRowWidgetHeight(),
                viewModel: {}
            }
            );
            if (this.getView().tabpaneltools) {
                widget.tabpaneltools = this.getView().tabpaneltools;
            }
            return {
                xtype: 'grid',
                itemId: 'activityList',
                forceFit: true,
                columns: [{
                    dataIndex: "description",
                    align: 'left'
                }, {
                    dataIndex: "description_addition",
                    align: 'left'
                }],
                store: {
                    proxy: 'memory',
                    data: data,
                    sorters: [{
                        property: 'description'
                    }]
                },
                plugins: [{
                    pluginId: 'forminrowwidget',
                    ptype: 'forminrowwidget',
                    expandOnDblClick: true,
                    removeWidgetOnCollapse: true,
                    widget: widget
                }]
            };
        },

        /**
         * @param {Ext.selection.RowModel} element
         * @param {Ext.data.Model} record
         * @param {HTMLElement} rowIndex
         * @param {Event} e
         * @param {Object} eOpts
         */
        onRowDblClick: function (element, record, rowIndex, e, eOpts) {
            var url = CMDBuildUI.util.Navigation.getProcessBaseUrl(
                record.get("_type"),
                record.get("_id"),
                record.get("_activity_id"),
                'edit'
            );

            CMDBuildUI.util.Utilities.redirectTo(url, true);
            return false;
        },

        /**
         * @return {Number} height
         */
        getRowWidgetHeight: function () {
            var view = this.getView();
            var height = CMDBuildUI.util.helper.Configurations.get(CMDBuildUI.model.Configuration.ui.inlinecard.height);
            return view.up().getHeight() * height / 100;
        }
    }
});