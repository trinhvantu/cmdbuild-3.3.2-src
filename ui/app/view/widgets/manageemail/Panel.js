Ext.define('CMDBuildUI.view.widgets.manageemail.Panel', {
    extend: 'Ext.panel.Panel',

    requires: [
        'CMDBuildUI.view.widgets.manageemail.PanelController'
    ],

    statics: {
        /**
         * Function executed when the form opens
         * 
         * @param {CMDBuildUI.model.classes.Card|CMDBuild.model.processes.Instance} target 
         * @param {CMDBuildUI.model.WidgetDefinition} widget 
         * @param {Object} config
         * @param {String} config.formmode 
         * 
         * @return {Ext.promise.Promise}
         */
        onTargetFormOpen: function(target, widget, config) {
            var deferred = new Ext.Deferred();
            
            // get templates
            var expression = /^Template(\d*?)$/;

            target._templatestoevaluate = [];
            for (var k in widget.getData()) {
                var matched = expression.exec(k);
                if (matched) {
                    target._templatestoevaluate.push({
                        name: widget.get('Template' + matched[1]),
                        condition: widget.get('Condition' + matched[1]),
                        notifywith: widget.get('NotifyWith' + matched[1])
                    });
                }
            }

            // resolve promise
            deferred.resolve();
            return deferred;
        }
    },

    mixins: [
        'CMDBuildUI.view.widgets.Mixin'
    ],

    alias: 'widget.widgets-manageemail-panel',
    controller: 'widgets-manageemail-panel',

    layout: 'fit',

    buttons: [{
        ui: 'secondary-action-small',
        itemId: 'closebtn',
        text: CMDBuildUI.locales.Locales.common.actions.close,
        localized: {
            text: 'CMDBuildUI.locales.Locales.common.actions.close'
        },
        autoEl: {
            'data-testid': 'widgets-manageemail-close'
        }
    }]
});