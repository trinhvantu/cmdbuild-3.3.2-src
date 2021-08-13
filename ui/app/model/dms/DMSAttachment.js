Ext.define('CMDBuildUI.model.dms.DMSAttachment', {
    extend: 'CMDBuildUI.model.base.Base',
    statics: {

    },
    fields: [{
        name: '_category_name',
        type: 'string',
        calculate: function (data) {
            return data._category_description_translation || data._category_description;
        }
    }, {
        name: '_category_description',
        type: 'string'
    }, {
        name: '_category_description_translation',
        type: 'string'
    }],

    proxy: {
        type: 'baseproxy'
    },

    /**
     * Couldn't use mixin lock because the attachments doesn't use the same logics
     */

    /**
     * Override load method to add "includeModel" parameter in request.
     *
     * @param {Object} [options] Options to pass to the proxy.
     *
     * @return {Ext.data.operation.Read} The read operation.
     */
    load: function (options) {
        options = Ext.apply(options || {}, {
            params: {
                includeWidgets: true
            }
        });
        this.callParent([options]);
    },

    /**
    * Check lock on item.
    * 
    * @return {Ext.Deferred}
    */
    isLocked: function (objectType) {
        var deferred = new Ext.Deferred();
        if (CMDBuildUI.util.helper.Configurations.get(CMDBuildUI.model.Configuration.cardlock.enabled)) {
            var me = this;
            Ext.Ajax.request({
                url: Ext.String.format("{0}/classes/{1}/cards/{2}/lock", CMDBuildUI.util.Config.baseUrl, CMDBuildUI.model.dms.DMSModel.masterParentClass, me.get('_card')),
                method: 'GET',
                success: function (response) {
                    var res = JSON.parse(response.responseText);
                    deferred.resolve(res);
                },
                error: function (response) {
                    deferred.resolve(false);
                }
            });
        } else {
            deferred.resolve(false);
        }
        return deferred.promise;
    },

    /**
     * Check lock on item.
     * 
     * @return {Ext.Deferred}
     */
    addLock: function () {
        var deferred = new Ext.Deferred();
        if (CMDBuildUI.util.helper.Configurations.get(CMDBuildUI.model.Configuration.cardlock.enabled)) {
            var me = this;
            Ext.Ajax.request({
                url: Ext.String.format("{0}/classes/{1}/cards/{2}/lock", CMDBuildUI.util.Config.baseUrl, CMDBuildUI.model.dms.DMSModel.masterParentClass, me.get('_card')),
                method: 'POST',
                success: function (response) {
                    var res = JSON.parse(response.responseText);
                    if (res.success) {
                        CMDBuildUI.util.Logger.log(
                            Ext.String.format("Card {0}-{1} locked.", me.get('_type'), me.getId()),
                            CMDBuildUI.util.Logger.levels.debug,
                            null,
                            res.data
                        );
                        deferred.resolve(res.success);
                    } else {
                        this.showLockMessage(res.user);
                        deferred.resolve(res.success);
                    }
                },
                error: function (response) {
                    deferred.resolve(true);
                }
            });
        } else {
            deferred.resolve(true);
        }
        return deferred.promise;
    },

    /**
     * Remove lock from item.
     * 
     * @return {Ext.Deferred}
     */
    removeLock: function () {
        var deferred = new Ext.Deferred();
        if (CMDBuildUI.util.helper.Configurations.get(CMDBuildUI.model.Configuration.cardlock.enabled)) {
            var me = this;
            Ext.Ajax.request({
                url: Ext.String.format("{0}/classes/{1}/cards/{2}/lock", CMDBuildUI.util.Config.baseUrl, CMDBuildUI.model.dms.DMSModel.masterParentClass, me.get('_card')),
                method: 'DELETE',
                success: function (response) {
                    var res = JSON.parse(response.responseText);
                    CMDBuildUI.util.Logger.log(
                        Ext.String.format("Card {0}-{1} unlocked.", me.get("_type"), me.getId()),
                        CMDBuildUI.util.Logger.levels.debug,
                        null,
                        res.data
                    );
                    deferred.resolve(res.success);
                }
            });
        } else {
            deferred.resolve(true);
        }
        return deferred.promise;
    },

    showLockMessage: function (userValue) {
        var user = CMDBuildUI.locales.Locales.main.cardlock.someone;
        if (CMDBuildUI.util.helper.Configurations.get(CMDBuildUI.model.Configuration.cardlock.showuser) && userValue) {
            user = userValue;
        }
        CMDBuildUI.util.Notifier.showWarningMessage(
            Ext.String.format(CMDBuildUI.locales.Locales.main.cardlock.lockedmessage, user)
        );
    }
});