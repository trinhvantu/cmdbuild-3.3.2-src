Ext.define('CMDBuildUI.view.joinviews.configuration.items.FiltersContainer', {
    extend: 'Ext.form.FieldSet',
    requires: [
        'CMDBuildUI.view.joinviews.configuration.items.FiltersController'
    ],
    alias: 'widget.joinviews-configuration-items-filterscontainer',
    title: CMDBuildUI.locales.Locales.joinviews.filters,
    localized: {
        title: 'CMDBuildUI.locales.Locales.joinviews.filters'
    },
    viewModel: {},
    fieldDefaults: CMDBuildUI.util.administration.helper.FormHelper.fieldDefaults,
    bind: {
        ui: '{fieldsetUi}'
    },
    layout: {
        type: 'card'
    },
    items: [{
        xtype: 'filters-attributes-panel',
        layout: {
            type: 'border'
        },
        itemId: 'attributesfilterpanel',
        reference: 'attributesfilterpanel',
        allowCurrentGroup: true,
        allowCurrentUser: true,
        title: null,
        localized: {
            title: null
        },
        controller: 'joinviews-configuration-items-filters',
        viewModel: {
            type: 'joinviews-configuration-items-filters'
        },

        items: [{
            region: 'north',
            xtype: 'panel',
            reference: 'addattrfiltercontainer',
            cls: 'panel-with-gray-background',
            bodyPadding: CMDBuildUI.util.helper.FormHelper.properties.padding,
            layout: {
                type: 'hbox',
                align: 'stretch'
            },
            hidden: true,
            bind: {
                hidden: '{actions.view}'
            },
            items: [{
                fieldDefaults: CMDBuildUI.util.helper.FormHelper.fieldDefaults,
                layout: 'anchor',
                xtype: 'fieldcontainer',
                flex: 0.3,
                items: [{
                    xtype: 'groupedcombo',
                    valueField: 'value',
                    displayField: 'label',
                    queryMode: 'local',
                    forceSelection: true,
                    margin: 'auto 10px auto auto',
                    reference: 'attributecombo',
                    itemId: 'attributecombo',
                    fieldLabel: CMDBuildUI.locales.Locales.filters.attribute,
                    localized: {
                        fieldLabel: 'CMDBuildUI.locales.Locales.filters.attribute'
                    },
                    autoEl: {
                        'data-testid': 'filters-attributes-row-attributecombo'
                    },
                    bind: {
                        store: '{attributeslist}'
                    }
                }]
            }, {
                xtype: 'component', // fulfill value space
                flex: 0.7
            }, {
                xtype: 'component', // fulfill button space 
                width: 45
            }]
        }, {
            region: 'center',
            xtype: 'container',
            scrollable: true,
            reference: 'attributescontainer',
            itemId: 'attributescontainer'
        }]
    }],

    goingNextStep: function () {
        var vm = this.lookupViewModel(),
            attributePanel = this.down('filters-attributes-panel');

            // refresh theView.filter
            var filter = {
                attribute: attributePanel.getAttributesData()
            };
            filter = (Ext.Object.isEmpty(filter.attribute)) ? '' : Ext.encode(filter);
            vm.get('theView').set('filter', filter);        
        return true;
    },
    goingPreviousStep: function () {
        var vm = this.lookupViewModel(),
            attributePanel = this.down('filters-attributes-panel');
            // refresh theView.filter
            var filter = {
                attribute: attributePanel.getAttributesData()
            };
            filter = (Ext.Object.isEmpty(filter.attribute)) ? '' : Ext.encode(filter);
            vm.get('theView').set('filter', filter);        
        return true;
    }
});