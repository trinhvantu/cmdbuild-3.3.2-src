Ext.define('CMDBuildUI.view.administration.home.widgets.systemstatus.NodeStatusController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.administration-home-widgets-systemstatus-nodestatus',
    control: {
        '#': {
            beforerender: 'onBeforeRender'
        }
    },

    onBeforeRender: function (view) {
        var vm = this.getViewModel();
        vm.bind({
            bindTo: '{systemStatus}'
        }, function (systemStatus) {
            if (systemStatus && !view.destroyed) {
                var systemload = {
                    xtype: 'polar',
                    flex: 1,
                    height: 240,
                    width: 300,
                    padding: '10 0 0 10',
                    insetPadding: 30,
                    theme: 'admindashboard',
                    bind: {
                        store: '{systemStatus}'
                    },
                    sprites: {
                        type: 'text',
                        text: CMDBuildUI.locales.Locales.administration.home.systemload,
                        x: 15,
                        y: 15,
                        fontSize: 17
                    },
                    axes: {
                        type: 'numeric',
                        position: 'gauge',
                        maximum: 4
                    },
                    series: {
                        type: 'gauge',
                        angleField: 'system_load',
                        donut: 20,
                        totalAngle: Math.PI
                    }
                };
                var spaceusage = {
                    xtype: 'polar',
                    height: 240,
                    flex: 1,
                    width: 300,
                    padding: '10 0 0 10',
                    insetPadding: 30,
                    theme: 'admindashboard',
                    bind: {
                        store: '{systemStatus}'
                    },
                    sprites: {
                        type: 'text',
                        text: CMDBuildUI.locales.Locales.administration.home.usedspace,
                        x: 15,
                        y: 15,
                        fontSize: 17
                    },
                    axes: {
                        type: 'numeric',
                        position: 'gauge',
                        maximum: systemStatus.first().get('disk_total'),
                        majorTickSteps: 4,
                        renderer: 'onSystemLoadLabelRender'
                    },
                    series: {
                        type: 'gauge',
                        angleField: 'disk_used',
                        donut: 20,
                        totalAngle: Math.PI
                    }
                };
                var memoryusage = {
                    xtype: 'polar',
                    height: 240,
                    flex: 1,
                    width: 300,
                    padding: '10 0 0 10',
                    insetPadding: 30,
                    theme: 'admindashboard',
                    bind: {
                        store: '{systemStatus}'
                    },
                    sprites: {
                        type: 'text',
                        text: CMDBuildUI.locales.Locales.administration.home.memoryload,
                        x: 15,
                        y: 15,
                        fontSize: 17
                    },
                    axes: {
                        type: 'numeric',
                        position: 'gauge',
                        maximum: systemStatus.first().get('system_memory_total'),
                        majorTickSteps: 4,
                        renderer: 'onSystemLoadLabelRender'
                    },
                    series: {
                        type: 'gauge',
                        angleField: 'system_memory_used',
                        donut: 20,
                        totalAngle: Math.PI
                    }
                };
                view.add(systemload);
                view.add(spaceusage);
                view.add(memoryusage);
            }
        });
    },
    /**
     * 
     * @param {*} axis 
     * @param {*} label 
     * @param {*} layoutContext 
     */
    onSystemLoadLabelRender: function (axis, label, layoutContext) {
        return Ext.util.Format.fileSize(label * 1024 * 1024);
    }

});