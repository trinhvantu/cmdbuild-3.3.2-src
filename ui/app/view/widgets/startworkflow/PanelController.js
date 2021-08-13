Ext.define('CMDBuildUI.view.widgets.startworkflow.PanelController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.widgets-startworkflow-panel',
    control: {
        "#": {
            beforerender: "onBeforeRender"
        },
        '#startworkflowcancelBtn': {
            click: 'onstartworkflowcancelBtnClick'
        },
        '#startworkflowexecuteBtn': {
            click: 'onstartworkflowexecuteBtnClick'
        },
        '#startworkflowsaveBtn': {
            click: 'onstartworkflowsaveBtnClick'
        }
    },

    /**
     * @param {CMDBuildUI.view.widgets.startworkflow.PanelController} view
     * @param {Object} eOpts
     */

    onBeforeRender: function (view, eOpts) {
        var me = this;
        var vm = view.getViewModel();
        var theWidget = vm.get('theWidget');
        var theTarget = vm.get('theTarget');

        var objectTypeName = theWidget.get('workflowName') || theWidget.get('WorkflowCode');
        vm.set('objectTypeName', objectTypeName);
        var panel = view.add({
            xtype: 'processes-instances-instance-create',
            buttons: [{
                reference: 'startworkflowsaveBtn',
                itemId: 'startworkflowsaveBtn',
                text: CMDBuildUI.locales.Locales.common.actions.save,
                ui: 'management-action-small',
                bind: {
                    hidden: '{hideSaveButton}'
                },
                autoEl: {
                    'data-testid': 'processinstance-save'
                },
                localized: {
                    text: 'CMDBuildUI.locales.Locales.common.actions.save'
                }
            }, {
                reference: 'startworkflowexecuteBtn',
                itemId: 'startworkflowexecuteBtn',
                text: CMDBuildUI.locales.Locales.common.actions.execute,
                ui: 'management-action-small',
                formBind: true, //only enabled once the form is valid
                disabled: true,
                autoEl: {
                    'data-testid': 'processinstance-execute'
                },
                localized: {
                    text: 'CMDBuildUI.locales.Locales.common.actions.execute'
                }
            }, {
                reference: 'startworkflowcancelBtn',
                itemId: 'startworkflowcancelBtn',
                ui: 'secondary-action-small',
                text: CMDBuildUI.locales.Locales.common.actions.cancel,
                autoEl: {
                    'data-testid': 'processinstance-cancel'
                },
                localized: {
                    text: 'CMDBuildUI.locales.Locales.common.actions.cancel'
                }
            }]
        });
        panel.getViewModel().bind({
            bindTo: '{theObject}'
        }, function (object) {
            var presets = theWidget.get("preset");
            var jsonparsed,
                objpresets;
            if (presets) {
                try {
                    jsonparsed = JSON.parse(presets);
                    objpresets = jsonparsed;
                } catch (e) {
                    objpresets = me.toValidJSON(presets);
                }
            }
            if (objpresets) {
                for (var key in objpresets) {
                    var presetvar = me.extractVariableFromString(objpresets[key], theTarget);
                    object.set(key, presetvar);
                }
            }
        });
    },

    /**
     * @param {Ext.button.Button} button
     * @param {Event} e
     * @param {Object} eOpts
     */
    onstartworkflowcancelBtnClick: function (button, e, eOpts) {
        this.getView().fireEvent("popupclose");
    },

    /**
     * @param {Ext.button.Button} button
     * @param {Event} e
     * @param {Object} eOpts
     */
    onstartworkflowexecuteBtnClick: function (button, e, eOpts) {
         // disable button
         button.disable();
         // execute process
        var view = this.getView();
        var panel = view.down('processes-instances-instance-create');
        var theWidget = panel.getViewModel().get('theWidget');
        var theTarget = panel.getViewModel().get('theTarget');
        panel.executeProcess({
            success: function (record, operation) {
                if (theWidget.get('_output')) {
                    theTarget.set(theWidget.get('_output'), record.get('_id'));
                }
                view.fireEvent("popupclose");
            },
            failure: function() {
                button.enable();
            },
            callback: function (record, operation, success) {
                if (panel && panel.loadMask) {
                    CMDBuildUI.util.Utilities.removeLoadMask(panel.loadMask);
                }
            }
        });
    },

    /**
     * @param {Ext.button.Button} button
     * @param {Event} e
     * @param {Object} eOpts
     */
    onstartworkflowsaveBtnClick: function (button, e, eOpts) {
         // disable button
         button.disable();
         // execute process
        var view = this.getView();
        var panel = view.down('processes-instances-instance-create');
        var theObject = panel.getViewModel().get('theObject');
        var theWidget = panel.getViewModel().get('theWidget');
        panel.saveProcess({
            success: function (record, operation) {
                if (theWidget.get('_output')) {
                    theObject.set(theWidget.get('_output'), record.get('_id'));
                }
                view.fireEvent("popupclose");
            },
            failure: function() {
                button.enable();
            },
            callback: function (record, operation, success) {
                if (panel && panel.loadMask) {
                    CMDBuildUI.util.Utilities.removeLoadMask(panel.loadMask);
                }
            }
        });
    },

    /**
     * Resolve variable.
     * @param {String} variable
     * @param {CMDBuildUI.model.base.Base} theTarget 
     * @return {*} The variable resolved.
     */
    extractVariableFromString: function (variable, theTarget) {
        if (CMDBuildUI.util.api.Client.testRegExp(/^{(client|server)+:*.+}$/, variable)) {
            variable = variable.replace("{", "").replace("}", "");
            var s_variable = variable.split(":");
            var resolvedVariable = null;
            if (s_variable[0] === "server") {
                resolvedVariable = CMDBuildUI.util.ecql.Resolver.resolveServerVariables([s_variable[1]], theTarget);
                return Object.values(resolvedVariable)[0];
            } else if (s_variable[0] === "client") {
                resolvedVariable = CMDBuildUI.util.ecql.Resolver.resolveClientVariables([s_variable[1]], theTarget);
                return Object.values(resolvedVariable)[0];
            } else if (s_variable.length === 1 && theTarget.getField(s_variable[0])) {
                return theTarget.get(s_variable[0]);
            }
            return variable;
        } else {
            return variable;
        }
    },

    toValidJSON: function (presets) {
        presets = presets.replace(/\s+/g, '');
        var items = presets.substr(1, presets.length - 2);
        items = items.split(',');
        var jsonString = '{';
        for (var i = 0; i < items.length; i++) {
            var current = items[i].split('=');
            jsonString += '"' + current[0] + '":"' + current[1] + '",';
        }
        jsonString = jsonString.substr(0, jsonString.length - 1);
        jsonString += '}';
        var obj = JSON.parse(jsonString);
        return obj;
    }
});