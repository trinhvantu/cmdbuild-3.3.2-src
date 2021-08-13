Ext.define('CMDBuildUI.view.administration.home.widgets.systemstatus.SystemStatusesController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.administration-home-widgets-systemstatus-systemstatuses',
    control: {
        '#': {
            afterrender: 'onAfterRender',
            refresh: 'reload'
        },
        '#serverManagementTool': {
            click: 'onServerManagementToolClick'
        },
        '#serverManagementListTool': {
            click: 'onServerManagementListToolClick'
        },
        '#serverManagementRefreshTool': {
            click: 'reload'
        }
    },

    /**
     * 
     * @param {CMDBuildUI.view.administration.home.widgets.systemstatus.SystemStatuses} view 
     */
    onAfterRender: function (view) {
        var vm = this.getViewModel();
        vm.bind({
            bindTo: '{showLoader}'
        }, function (showLoader) {
            CMDBuildUI.util.Utilities.showLoader(showLoader, view);
        });
        this.reload();
        vm.bind({
            bindTo: '{clusterNodes}',
            deep: true
        }, function (clusterNodes) {
            if (clusterNodes && !vm.destroyed) {
                Ext.suspendLayouts();
                var lastChange = new Date().getTime();
                Ext.Array.forEach(clusterNodes, function (node) {
                    var exisist = view.down('#' + node.hostname);
                    if (!exisist) {
                        view.add({
                            xtype: 'administration-home-widgets-systemstatus-nodestatus',
                            itemId: node.hostname,
                            lastChange: lastChange,
                            systemStatusData: [node],
                            title: Ext.String.format('{0} [{1}]', node.hostname, node.hostaddress)
                        });
                    } else {
                        exisist.setSystemStatusData([node]);
                        exisist.setLastChange(lastChange);
                    }
                });
                view.items.each(function (item) {
                    if (item.lastChange !== lastChange) {
                        view.remove(item);
                    }
                });
                Ext.resumeLayouts(true);
            }
        });
    },

    onServerManagementToolClick: function (tool, e, owner, eOpts) {
        this.redirectTo("#administration/setup/servermanagement");
    },

    onServerManagementListToolClick: function () {
        var vm = this.getViewModel();
        var popup = CMDBuildUI.util.Utilities.openPopup(
            null,
            CMDBuildUI.locales.Locales.administration.home.systeminfo, {
                xtype: 'grid',
                itemId: 'admin-systeminfogrid',
                disableSelection: true,
                features: [{
                    ftype: 'grouping',
                    collapsible: true,
                    groupHeaderTpl: [
                        '{name}'
                    ]
                }],

                viewModel: {},
                store: vm.get('systemStatusGridStore'),
                tbar: [{
                    xtype: 'localsearchfield',
                    gridItemId: '#admin-systeminfogrid'
                }, '->', {
                    xtype: 'button',
                    ui: 'administration-action-small',
                    iconCls: 'fa fa-refresh',
                    _owner: this.getView(),
                    handler: function (button) {
                        button._owner.fireEvent("refresh");
                    }
                }],
                columns: [{
                    text: CMDBuildUI.locales.Locales.administration.home.parameter,
                    localized: {
                        text: 'CMDBuildUI.locales.Locales.administration.home.parameter'
                    },
                    dataIndex: 'description',
                    flex: 1
                }, {
                    text: CMDBuildUI.locales.Locales.administration.home.value,
                    localized: {
                        text: 'CMDBuildUI.locales.Locales.administration.home.value'
                    },
                    dataIndex: 'value',
                    flex: 1,
                    renderer: function (value, metaData, record) {
                        switch (record.get('key')) {
                            case 'uptime':
                                var intervalRegex = /(-)?P(?:([.,\d]+)Y)?(?:([.,\d]+)M)?(?:([.,\d]+)W)?(?:([.,\d]+)D)?(?:T(?:([.,\d]+)H)?(?:([.,\d]+)M)?(?:([.,\d]+)S)?)?/;
                                var matches = value.match(intervalRegex);
                                var _value = '';
                                var timeValue = {
                                    Y: matches[2] === undefined ? 0 : matches[2],
                                    M: matches[3] === undefined ? 0 : matches[3],
                                    W: matches[4] === undefined ? 0 : matches[4],
                                    D: matches[5] === undefined ? 0 : matches[5],
                                    H: matches[6] === undefined ? 0 : matches[6],
                                    m: matches[7] === undefined ? 0 : matches[7],
                                    s: matches[8] === undefined ? 0 : matches[8]
                                };
                                if (timeValue.W) {
                                    _value += Ext.String.format(' {0} {1}', timeValue.M, CMDBuildUI.locales.Locales.administration.home.months);
                                }
                                if (timeValue.W) {
                                    _value += Ext.String.format(' {0} {1}', timeValue.W, CMDBuildUI.locales.Locales.administration.home.weeks);
                                }

                                if (timeValue.D) {
                                    _value += Ext.String.format(' {0} {1}', timeValue.D, CMDBuildUI.locales.Locales.administration.home.days);
                                }
                                if (timeValue.H) {
                                    _value += Ext.String.format(' {0} {1}', timeValue.H, CMDBuildUI.locales.Locales.administration.home.hours);
                                }
                                if (timeValue.m) {
                                    _value += Ext.String.format(' {0} {1}', timeValue.m, CMDBuildUI.locales.Locales.administration.home.minutes);
                                }
                                if (timeValue.s) {
                                    _value += Ext.String.format(' {0} {1}', parseInt(timeValue.s, 0), CMDBuildUI.locales.Locales.administration.home.seconds);
                                }
                                return _value;
                            case 'disk_used':
                            case 'disk_free':
                            case 'disk_total':
                            case 'java_memory_used':
                            case 'java_memory_free':
                            case 'java_memory_total':
                            case 'system_memory_used':
                            case 'system_memory_free':
                            case 'system_memory_total':
                                return Ext.util.Format.fileSize(value * 1024 * 1024);
                            case 'server_time':
                                var date = Ext.util.Format.date(
                                    Ext.Date.utcToLocal(new Date(value)),
                                    Ext.String.format('{0} {1}', CMDBuildUI.util.helper.UserPreferences.getDateFormat(), 'H:i:s')
                                );
                                return Ext.String.format('{0} ({1})', date, CMDBuildUI.locales.Locales.administration.home.utc);
                            default:

                                return value;
                        }
                    }
                }],
                closePopup: function () {
                    popup.destroy();
                }
            }, null, {
                ui: 'administration-actionpanel'
            }
        );
    },


    onSystemInfoRefreshBtnClick: function (button) {
        this.reload();
    },

    reload: function () {
        var vm = this.getViewModel();
        vm.set('showLoader', true);
        Ext.Ajax.request({
            url: CMDBuildUI.util.Config.baseUrl + '/system/cluster/nodes/_ALL/invoke',
            method: "POST",
            jsonData: {
                service: 'system',
                method: 'status'
            }
        }).then(function (response, opts) {
            if (!vm.destroyed) {

                var responseJson = Ext.JSON.decode(response.responseText, true);
                var clusterNodes = [];
                var systemStatusGridData = [];
                var keyToUse = [
                    'uptime',
                    'server_time',
                    'server_timezone',
                    'db_timezone',
                    'disk_used',
                    'disk_free',
                    'disk_total',
                    'java_pid',
                    'java_memory_used',
                    'java_memory_free',
                    'java_memory_total',
                    'system_memory_used',
                    'system_memory_free',
                    'system_memory_total',
                    'system_load',
                    'datasource_active_connections',
                    'datasource_idle_connections',
                    'datasource_max_active_connections',
                    'datasource_max_idle_connections'
                ];
                Ext.Array.forEach(responseJson.data, function (node) {
                    Ext.Array.forEach(keyToUse, function (key) {

                        systemStatusGridData.push({
                            key: key,
                            description: CMDBuildUI.locales.Locales.administration.home[key.split('_').join('')],
                            value: node.data[key],
                            hostname: node.data.hostname
                        });
                    });
                    clusterNodes.push(node.data);
                });
                vm.set('systemStatusGridData', systemStatusGridData);
                vm.set('clusterNodes', clusterNodes);
                vm.set('_isReady', true);
                vm.set('showLoader', false);
            }
        }, function () {
            if (!vm.destroyed) {
                vm.set('showLoader', false);
            }
        });

    }

});