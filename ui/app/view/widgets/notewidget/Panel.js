Ext.define('CMDBuildUI.view.widgets.notewidget.Panel', {
    extend: 'Ext.panel.Panel',

    requires: [
        'CMDBuildUI.view.widgets.notewidget.PanelController'
    ],
    mixins: [
        'CMDBuildUI.view.widgets.Mixin'
    ],

    alias: 'widget.widgets-notewidget-panel',
    controller: 'widgets-notewidget-panel',
    viewModel: {
        data: {
            editmode: false
        }
    },

    layout: 'fit',
    defaults: {
        textAlign: 'left',
        bodyPadding: 10,
        scrollable: true,
        border: false
    },

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
            'data-testid': 'widgets-notewidget-close'
        }
    }]
});