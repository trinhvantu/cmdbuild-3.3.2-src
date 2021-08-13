Ext.define('CMDBuildUI.mixins.forms.FormTriggers', {
    mixinId: 'forms-formtriggers-mixin',

    /**
     * 
     * @param {String[]} triggers 
     * @param {Object} api 
     */
    executeFormTriggers: function (triggers, api) {
        // execute form triggers
        triggers.forEach(function (triggerfunction) {
            var executeFormTrigger;
            var jsfn = Ext.String.format(
                'executeFormTrigger = function(api) {{0}}',
                triggerfunction
            );
            try {
                eval(jsfn);
            } catch (e) {
                CMDBuildUI.util.Logger.log(
                    "Error on trigger function.",
                    CMDBuildUI.util.Logger.levels.error,
                    null,
                    e
                );
                executeFormTrigger = Ext.emptyFn;
            }
            // use try / catch to manage errors
            try {
                executeFormTrigger(api);
            } catch (e) {
                CMDBuildUI.util.Logger.log(
                    "Error on execution of form trigger.",
                    CMDBuildUI.util.Logger.levels.error,
                    null,
                    {
                        fn: triggerfunction
                    }
                );
            }
        });
    },

    /**
     * Initialize before action form triggers.
     * 
     * @param {String} action 
     * @param {Object} base_api 
     */
    initBeforeActionFormTriggers: Ext.emptyFn,

    /**
     * Execute after action form triggers.
     * 
     * @param {String} action 
     * @param {CMDBuildUI.model.classes.Card} record
     * @param {Object} base_api 
     */
    executeAfterActionFormTriggers: Ext.emptyFn
});