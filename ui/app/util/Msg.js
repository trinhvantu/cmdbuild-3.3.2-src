Ext.define("CMDBuildUI.util.Msg", {
    singleton: true,

    /**
     * 
     * @param {String} title 
     * @param {String} message 
     * @param {Function} [callback] 
     * @param {Object} [scope]
     */
    confirm: function (title, message, callback, scope) {
        Ext.Msg.alwaysOnTop = CMDBuildUI.util.Utilities._popupAlwaysOnTop + 1;
        Ext.Msg.autoEl = {
            'data-testid': 'msg-window'
        };
        Ext.Msg.confirm(
            title,
            message,
            callback,
            scope
        );
    },

    /**
     * 
     * @param {String} title 
     * @param {String} message 
     * @param {Function} [callback] 
     * @param {Object} [scope]
     */
    alert: function (title, message, callback, scope) {
        Ext.Msg.alwaysOnTop = CMDBuildUI.util.Utilities._popupAlwaysOnTop + 1;
        Ext.Msg.autoEl = {
            'data-testid': 'msg-window'
        };
        Ext.Msg.alert(
            title,
            message,
            callback,
            scope
        );
    },

    /**
     * 
     * @param {String} title 
     * @param {String} [message] 
     * @param {Function} [callback] 
     * @param {Object} [scope]
     * @param {Boolean} [multiline]
     * @param {String} [value]
     */
    prompt: function (title, message, callback, scope, multiline, value) {

        Ext.Msg.autoEl = {
            'data-testid': 'prompt-window'
        };
        var _prompt = Ext.Msg.prompt(
            title,
            message,
            callback,
            scope,
            multiline,
            value);

        _prompt.setAlwaysOnTop(Infinity);
    }
});