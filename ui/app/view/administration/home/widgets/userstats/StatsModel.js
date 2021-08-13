Ext.define('CMDBuildUI.view.administration.home.widgets.userstats.StatsModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.administration-home-widgets-userstats-stats',
    data: {
        data: []
    },
    formulas: {
        initData: function (get) {
            var me = this;
            me.set('showLoader', true);
            Ext.Ajax.request({
                url: CMDBuildUI.util.Config.baseUrl + '/functions/_cm3_dashboard_user_group_session/outputs',
                method: "GET",
                timeout: 0
            }).then(function (response, opts) {
                if (!me.destroyed) {

                    var responseJson = Ext.JSON.decode(response.responseText, true);
                    var _data = [];
                    Ext.Array.forEach(responseJson.data, function (item) {
                        var description;
                        switch (item.type) {
                            case 'user':
                                description = CMDBuildUI.locales.Locales.administration.home.users;
                                break;
                            case 'group':
                                description = CMDBuildUI.locales.Locales.administration.home.groups;
                                break;
                            case 'session':
                                description = CMDBuildUI.locales.Locales.administration.home.sessions;
                                break;
                            default:
                                break;
                        }
                        _data.push({
                            label: description,
                            count: item.count
                        });
                    });
                    me.set('data', _data);
                    me.set('showLoader', false);
                }
            }, function () {
                if (!me.destroyed) {
                    me.set('showLoader', false);
                }
            });
        }
    },
    stores: {
        userStats: {
            proxy: 'memory',
            fields: [{
                type: 'string',
                name: 'label'
            }, {
                type: 'integer',
                name: 'count'
            }],
            data: '{data}'
        }
    }

});