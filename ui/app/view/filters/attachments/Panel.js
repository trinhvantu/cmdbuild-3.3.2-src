
Ext.define('CMDBuildUI.view.filters.attachments.Panel',{
    extend: 'Ext.form.Panel',

    requires: [
        'CMDBuildUI.view.filters.attachments.PanelController',
        'CMDBuildUI.view.filters.attachments.PanelModel'
    ],

    alias: 'widget.filters-attachments-panel',
    controller: 'filters-attachments-panel',
    viewModel: {
        type: 'filters-attachments-panel'
    },

    title: CMDBuildUI.locales.Locales.filters.attachments,
    localized: {
        title: 'CMDBuildUI.locales.Locales.filters.attachments'
    },

    fieldDefaults: CMDBuildUI.util.helper.FormHelper.fieldDefaults,

    items: [{
        xtype: 'container',
        layout: 'column',
        defaults: {
            xtype: 'fieldcontainer',
            columnWidth: 0.5,
            flex: '0.5',
            padding: CMDBuildUI.util.helper.FormHelper.properties.padding,
            layout: 'anchor',
            minHeight: 1
        },
        items: [{
            items: [{
                xtype: 'textfield',
                fieldLabel: CMDBuildUI.locales.Locales.filters.attachmentssearchtext,
                localized: {
                    fieldLabel: 'CMDBuildUI.locales.Locales.filters.attachmentssearchtext'
                },
                triggers: {
                    clear: {
                        cls: Ext.baseCSSPrefix + 'form-clear-trigger',
                        handler: 'onSearchTextClearClick'
                    }
                },
                bind: {
                    value: '{attachments.searchtext}'
                },
                autoEl: {
                    'data-testid': 'filters-attachments-panel-searchtext'
                }
            }]
        }]
    }],

    /**
     * @return {Object} Attachment data
     */
    getAttachmentsData: function() {
        var value = this.lookupViewModel().get("attachments.searchtext");
        if (!Ext.isEmpty(value)) {
            return {
                query: value
            }
        }
    }
});
