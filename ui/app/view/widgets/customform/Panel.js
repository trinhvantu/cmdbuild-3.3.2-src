Ext.define('CMDBuildUI.view.widgets.customform.Panel', {
    extend: 'Ext.panel.Panel',

    requires: [
        'CMDBuildUI.view.widgets.customform.PanelController',
        'CMDBuildUI.view.widgets.customform.PanelModel',
        'CMDBuildUI.view.widgets.customform.Utilities'
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

            CMDBuildUI.view.widgets.customform.Utilities.getModel(widget).then(function () {

                function aux() {
                    if (Ext.isEmpty(target.get(widget.get("_output")))) {
                        CMDBuildUI.view.widgets.customform.Utilities.loadData(widget, target, function (response) {
                            var res = CMDBuildUI.view.widgets.customform.Utilities.serialize(widget, response);
                            target.set(widget.get("_output"), res);
                        });
                    }
                }

                if (widget.get("DataType") && widget.get("DataType").toLowerCase() === 'function') {
                    CMDBuildUI.view.widgets.customform.Utilities.calculateFunctionVariableObject(widget).then(function (functionVariableObject) {

                        //saves the calculated object in the widget due to avoid further calulation
                        widget.set('_functionVariableObject', functionVariableObject);

                        /**
                         * This code creates a bind with theObject. The widget function results are loaded each time theObject attributes changes.
                         * Only theObject.attributes on wich a theWidget.function has it as parameter causes the recalculation of the function
                         */
                        //makes the bindinds
                        var bindObject = {};

                        //creates the bind object
                        for (var key in functionVariableObject) {
                            var attribute = functionVariableObject[key].attribute;
                            bindObject[attribute] = Ext.String.format('{theObject.{0}}', attribute);
                        }

                        //creates the bind
                        widget._ownerButton.lookupViewModel().bind(bindObject, aux)

                        //loads the data
                        // aux();
                    });
                } else {

                    //loads the data
                    aux();
                }

                deferred.resolve();
            });

            return deferred;
        }
    },

    mixins: [
        'CMDBuildUI.view.widgets.Mixin'
    ],

    alias: 'widget.widgets-customform-panel',
    controller: 'widgets-customform-panel',
    viewModel: {
        type: 'widgets-customform-panel'
    },

    layout: "fit",
    /**
     * @cfg {String} theWidget.Layout
     * One of `grid` or `form`.
     */

    /**
     * @cfg {String} theWidget.RefreshBehaviour
     * One of `everyTime` or `firstTime`.
     * If value is `everyTime` the content is refreshed every time the widget is opened 
     * following the modification of a configuration parameter.
     * If value is `firstTime` the content is refreshed only when the widget is opened 
     * the first time.
     * Default value is `everyTime`.
     */

    /**
     * @cfg {String} theWidget.ReadOnly
     * If `true` disable all functionalities and makes the data only readable. 
     * Default value is `false`.
     */

    /**
     * @cfg {String} theWidget.AddDisabled
     * If `true` disable add functionality. 
     * Default value is `false`.
     */

    /**
     * @cfg {String} theWidget.CloneDisabled
     * If `true` disable clone functionality. 
     * Default value is `false`.
     */

    /**
     * @cfg {String} theWidget.DeleteDisabled
     * If `true` disable delete functionality. 
     * Default value is `false`.
     */

    /**
     * @cfg {String} theWidget.ExportDisabled
     * If `true` disable export functionality. 
     * Default value is `false`.
     */

    /**
     * @cfg {String} theWidget.ImportDisabled
     * If `true` disable import functionality. 
     * Default value is `false`.
     */

    /**
     * @cfg {String} theWidget.ModifyDisabled
     * If `true` disable modify functionality. 
     * Default value is `false`.
     */

    /**
     * @cfg {String} theWidget.ModelType
     * One of `form`, `class` or `function`.
     */

    /**
     * @cfg {String} theWidget.ClassModel
     * Name of the class from which take the attributes.
     */

    /**
     * @cfg {String} theWidget.ClassAttributes
     * List of attributes to be considered separated by commas.
     * Empty or `null` indicates all attributes.
     */

    /**
     * @cfg {String} theWidget.FormModel
     * A list of attributes definition.
     */

    /**
     * @cfg {String} theWidget.DataType
     * One of `raw`, `raw_json`, `raw_text` or `function`.
     */

    /**
     * @cfg {String} theWidget.FunctionData
     * The function name from wich get the data.
     */

    /**
     * @cfg {String} theWidget.SerializationType
     * One of `json` or `text`.
     * Default value is `text`.
     */

    /**
     * @cfg {String} theWidget.KeyValueSeparator
     * The string to use to separate key from value.
     * Default value is `=`.
     */

    /**
     * @cfg {String} theWidget.AttributesSeparator
     * The string to use to separate attributes.
     * Default value is `,`.
     */

    /**
     * @cfg {String} theWidget.RowsSeparator
     * The string to use to separate rows.
     * Default value is `\n`.
     */

    fbar: [{
        xtype: 'button',
        ui: 'secondary-action',
        reference: 'closebtn',
        itemId: 'closebtn',
        text: CMDBuildUI.locales.Locales.common.actions.close,
        iconCls: 'x-fa fa-check',
        bind: {
            text: '{translations.close}'
        },
        autoEl: {
            'data-testid': 'widgets-customform-close'
        }
    }],

    /**
     * Return the name of the model used by the widget.
     * @return {String}
     */
    getModelName: function () {
        return 'CMDBuildUI.model.customform.' + this.getWidgetId();
    }

});