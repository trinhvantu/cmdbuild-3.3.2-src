Ext.define('CMDBuildUI.view.widgets.attachmentwidget.Panel', {
    extend: 'Ext.panel.Panel',

    requires: [
        'CMDBuildUI.view.widgets.attachmentwidget.PanelController'
    ],

    mixins: [
        'CMDBuildUI.view.widgets.Mixin'
    ],

    alias: 'widget.widgets-attachmentwidget-panel',
    controller: 'widgets-attachmentwidget-panel',
    viewModel: {
        data: {
            editmode: false
        }
    },
    layout: 'fit',
    buttons: [{
        ui: 'secondary-action-small',
        itemId: 'closebtn',
        hidden: true,
        text: CMDBuildUI.locales.Locales.common.actions.close,
        bind: {
            hidden: '{editmode}'
        },
        localized: {
            text: 'CMDBuildUI.locales.Locales.common.actions.close'
        },
        autoEl: {
            'data-testid': 'widgets-attachmentwidget-close'
        }
    }]
});