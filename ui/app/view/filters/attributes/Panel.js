
Ext.define('CMDBuildUI.view.filters.attributes.Panel', {
    extend: 'Ext.panel.Panel',

    requires: [
        'CMDBuildUI.view.filters.attributes.PanelController',
        'CMDBuildUI.view.filters.attributes.PanelModel'
    ],

    alias: 'widget.filters-attributes-panel',
    controller: 'filters-attributes-panel',
    viewModel: {
        type: 'filters-attributes-panel'
    },

    title: CMDBuildUI.locales.Locales.filters.attributes,

    localized: {
        title: 'CMDBuildUI.locales.Locales.filters.attributes'
    },

    layout: 'border',

    config: {
        /**
         * @cfg {Boolean} allowInputParameter
         */
        allowInputParameter: true,

         /**
         * @cfg {Boolean} allowCurrentUser
         */
        allowCurrentUser: false,

        /**
         * @cfg {Boolean} allowCurrentGroup
         */
        allowCurrentGroup: false
    },

    items: [{
        region: 'center',
        xtype: 'container',
        scrollable: true,
        reference: 'attributescontainer',
        itemId: 'attributescontainer'
    }, {
        xtype: 'panel',
        region: 'north',
        reference: 'addattrfiltercontainer',
        cls: 'panel-with-gray-background',
        bodyPadding: CMDBuildUI.util.helper.FormHelper.properties.padding,
        layout: {
            type: 'hbox',
            align: 'stretch'
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
    }],

    /**
     * @return {Object}
     */
    getAttributesData: function () {
        var me = this;
        var attributes = [];
        this._fieldsetsreferences.forEach(function (fieldsetid) {
            var rows = me.lookup(fieldsetid).items;
            var attr;
            if (rows.length === 1) {
                attr = {
                    simple: rows.items[0].getRowData()
                };
            } else if (rows.length > 1) {
                attr = {
                    or: []
                };
                rows.items.forEach(function (row) {
                    attr.or.push({
                        simple: row.getRowData()
                    });
                });
            }
            if (attr) {
                attributes.push(attr);
            }
        });
        if (attributes.length === 1) {
            return attributes[0];
        } else if (attributes.length > 1) {
            return {
                and: attributes
            };
        }
    },

    privates: {
        _fieldsetsreferences: []
    }
});
