Ext.define('CMDBuildUI.view.administration.components.attributes.fieldscontainers.typeproperties.Boolean', {
    extend: 'Ext.form.Panel',
    alias: 'widget.administration-attribute-booleanfields',

    items: [{
        xtype: 'fieldcontainer',
        items: [{
            xtype: 'checkbox',
            fieldLabel: CMDBuildUI.locales.Locales.administration.attributes.fieldlabels.defaultfalse,
            localized: {
                fieldLabel: 'CMDBuildUI.locales.Locales.administration.attributes.fieldlabels.defaultfalse'
            },
            bind: {                
                disabled: '{actions.view}'
            },
            listeners: {
                beforerender: function (checkbox) {
                    var vm = checkbox.lookupViewModel();
                    vm.bind({
                        bindTo: '{theAttribute.defaultValue}',
                        single: true
                    }, function (defaultValue) {
                        checkbox.setValue(defaultValue === 'false' ? true : false);
                    });
                },
                change: function (checkbox, newValue, oldValue) {
                    var vm = checkbox.lookupViewModel();
                    vm.set('theAttribute.defaultValue', newValue ? 'false' : null);
                }
            }
        }]
    }]
});