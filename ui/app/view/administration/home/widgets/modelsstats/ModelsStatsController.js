Ext.define('CMDBuildUI.view.administration.home.widgets.modelsstats.ModelsStatsController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.administration-home-widgets-modelsstats-modelsstats',
    control: {
        '#': {
            afterrender: 'onAfterRender'
        },
        '#addModelTool': {
            click: 'onAddModelToolClick'
        }
    },

    onAfterRender: function (view) {
        var vm = this.getViewModel();
        vm.bind({
            bindTo: '{showLoader}'
        }, function (showLoader) {
            CMDBuildUI.util.Utilities.showLoader(showLoader, view);
        });
    },

    onAddModelToolClick: function (tool, e, owner) {
        var me = this;
        var menu = Ext.create('Ext.menu.Menu', {
            autoShow: true,
            items: [{
                text: CMDBuildUI.locales.Locales.administration.classes.toolbar.addClassBtn.text,
                localized: {
                    text: 'CMDBuildUI.locales.Locales.administration.classes.toolbar.addClassBtn.text'
                },
                iconCls: 'x-fa fa-file-text-o',
                height: 32,
                listeners: {
                    click: function (menuitem, eOpts) {
                        me.redirectTo('administration/classes');
                    }
                }
            }, {
                text: CMDBuildUI.locales.Locales.administration.processes.toolbar.addProcessBtn.text,
                localized: {
                    text: 'CMDBuildUI.locales.Locales.administration.processes.toolbar.addProcessBtn.text'
                },
                iconCls: 'x-fa fa-cog',
                height: 32,
                listeners: {
                    click: function (menuitem, eOpts) {
                        me.redirectTo('administration/processes');
                    }
                }
            }, {
                text: CMDBuildUI.locales.Locales.administration.domains.texts.adddomain,
                localized: {
                    text: 'CMDBuildUI.locales.Locales.administration.domains.texts.adddomain'
                },
                iconCls: 'x-fa fa-table',
                height: 32,
                listeners: {
                    click: function (menuitem, eOpts) {
                        me.redirectTo('#administration/domains');
                    }
                }
            }, {
                text: CMDBuildUI.locales.Locales.administration.reports.texts.addreport,
                localized: {
                    text: 'CMDBuildUI.locales.Locales.administration.reports.texts.addreport'
                },
                iconCls: 'x-fa fa-files-o',
                height: 32,
                listeners: {
                    click: function (menuitem, eOpts) {
                        me.redirectTo('administration/reports_empty/true');
                    }
                }
            }, {                
                text: CMDBuildUI.locales.Locales.administration.dashboards.adddashboard,
                localized: {
                    text: 'CMDBuildUI.locales.Locales.administration.dashboards.adddashboard'
                },
                iconCls: 'x-fa fa-area-chart',
                height: 32,
                listeners: {
                    click: function (menuitem, eOpts) {
                        me.redirectTo('administration/dashboards_empty/true');
                    }
                }
            }, {
                text: CMDBuildUI.locales.Locales.administration.custompages.texts.addcustompage,
                localized: {
                    text: 'CMDBuildUI.locales.Locales.administration.custompages.texts.addcustompage'
                },
                iconCls: 'x-fa fa-code',
                height: 32,
                listeners: {
                    click: function (menuitem, eOpts) {
                        me.redirectTo('administration/custompages_empty/default/true');
                    }
                }
            }]
        });
        menu.alignTo(tool.el.id, 'tr-br?');
    }
});