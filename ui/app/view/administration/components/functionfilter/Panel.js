Ext.define('CMDBuildUI.view.administration.components.functionfilters.Panel', {
    extend: 'Ext.panel.Panel',
    requires: [
        'CMDBuildUI.view.administration.components.functionfilters.PanelController',
        'CMDBuildUI.view.administration.components.functionfilters.PanelModel'
    ],

    alias: 'widget.administration-components-functionfilters-panel',
    controller: 'administration-components-functionfilters-panel',
    viewModel: {
        type: 'administration-components-functionfilters-panel'
    },
    items: [{
        cls: 'panel-with-gray-background',
        padding: '10 10 10 15',
        xtype: 'panel',
        layout: 'column',
        defaults: CMDBuildUI.util.administration.helper.FormHelper.fieldDefaults,            
        items: [{
            columnWidth: '0.5',
            xtype: 'fieldcontainer',
            fieldLabel: CMDBuildUI.locales.Locales.administration.searchfilters.texts.chooseafunction,
            localized: {
                fieldLabel: 'CMDBuildUI.locales.Locales.administration.searchfilters.texts.chooseafunction'
            },
            items: [{
                width: '100%',
                xtype: 'combo',
                displayField: 'description',
                valueField: 'name',
                itemId: 'filterFunctionCombo',
                bind: {
                    value: '{_function}',
                    store: '{getFunctionsStore}'
                }
            }]
        }],
        bind: {
            hidden: '{actions.view}'
        }
    }, {
        xtype: 'panel',
        padding: '10 10 10 15',
        items: [{
            xtype: 'displayfield',
            labelAlign: 'top',
            fieldLabel: CMDBuildUI.locales.Locales.administration.common.labels.funktion,
            localized: {
                fieldLabel: 'CMDBuildUI.locales.Locales.administration.common.labels.funktion'
            },
            bind: {
                value: '{_function}'
            }
        }],
        bind: {
            hidden: '{!actions.view}'
        },
        renderer: function (value) {
            var func = this.lookupViewModel().getStore('getFunctionsStore').findRecord('value', value);
            if (func) {
                return func.get('description');
            }
            return value;
        }
    }],

    getFunctionData: function () {
        var func = this.getViewModel().get('_function');
        if (func) {
            return [{
                name: func
            }];
        }
        return undefined;
    }

});