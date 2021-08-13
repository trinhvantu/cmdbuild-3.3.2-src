Ext.define('CMDBuildUI.view.widgets.Mixin', {
    mixinId: 'cmdbuildwidgets-mixin',

    mixins: ['Ext.mixin.Bindable'],

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
        // onTargetFormOpen: function(target, widget, config) {
        //     var deferred = new Ext.Deferred();
        //     deferred.resolve();
        //     return deferred;
        // }

        /**
         * Function executed before save/execute action
         * 
         * @param {CMDBuildUI.model.classes.Card|CMDBuild.model.processes.Instance} target 
         * @param {CMDBuildUI.model.WidgetDefinition} widget 
         * @param {Object} config
         * @param {String} config.formmode
         * @param {String} config.action One of `save` and `execute` 
         * 
         * @return {Ext.promise.Promise}
         */
        // beforeTargetSave: function(target, widget, config) {
        //     var deferred = new Ext.Deferred();
        //     deferred.resolve();
        //     return deferred;
        // }

        /**
         * Function executed after save/execute action
         * 
         * @param {CMDBuildUI.model.classes.Card|CMDBuild.model.processes.Instance} target 
         * @param {CMDBuildUI.model.WidgetDefinition} widget 
         * @param {Object} config
         * @param {String} config.formmode 
         * @param {String} config.action One of `save` and `execute`
         * 
         * @return {Ext.promise.Promise}
         */
        // afterTargetSave: function(target, widget, config) {
        //     var deferred = new Ext.Deferred();
        //     deferred.resolve();
        //     return deferred;
        // }

        /**
         * Function executed before cancel action
         * 
         * @param {CMDBuildUI.model.classes.Card|CMDBuild.model.processes.Instance} target 
         * @param {CMDBuildUI.model.WidgetDefinition} widget 
         * @param {Object} config
         * @param {String} config.formmode 
         * 
         * @return {Ext.promise.Promise}
         */
        // onTargetCancel: function(target, widget, config) {
        //     var deferred = new Ext.Deferred();
        //     deferred.resolve();
        //     return deferred;
        // }
    },

    config: {
        /**
         * @cfg {String} [widgetId] The id of the widget.
         */
        widgetId: null,

        /**
         * @cfg {CMDBuildUI.model.classes.Card|CMDBuildUI.model.processes.Instance} [target] 
         * The target object on which the widget is called.
         */
        target: null,

        /**
         * @cfg {String} [output] 
         * The target attribute where output will be saved.
         */
        output: null,

        /**
         * @cfg {String} formMode
         * Form mode.
         */
        formMode: null
    },

    publishes: [
        "target"
    ],

    twoWayBindable: [
        "target"
    ]

    /**
     * @cfg {CMDBuildUI.model.WidgetDefinition} viewModel.theWidget 
     * Widget definition.
     */

    /**
     * @cfg {CMDBuildUI.model.base.Base} viewModel.theTarget 
     * The target object on which the widget is called.
     */

    /**
     * @property {Ext.Component} _widgetOwner
     * The owner component of this widget.
     */

    /**
     * @event popupclose
     * Fired to close popup.
     * 
     * @param {Object} eOpts
     */

});