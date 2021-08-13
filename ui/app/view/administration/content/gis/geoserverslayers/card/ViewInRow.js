Ext.define('CMDBuildUI.view.administration.content.gis.geoserverslayers.card.ViewInRow', {
    extend: 'CMDBuildUI.components.tab.FormPanel',

    requires: [
        'CMDBuildUI.view.administration.content.gis.geoserverslayers.card.ViewInRowController',
        'CMDBuildUI.view.administration.content.gis.geoserverslayers.card.ViewInRowModel'
    ],

    alias: 'widget.administration-content-gis-geoserverslayers-card-viewinrow',
    controller: 'administration-content-gis-geoserverslayers-card-viewinrow',
    viewModel: {
        type: 'administration-content-gis-geoserverslayers-card-viewinrow'
    },

    cls: 'administration',
    ui: 'administration-tabandtools',
    items: [{
        title: CMDBuildUI.locales.Locales.administration.common.strings.generalproperties,
        localized: {
            title: 'CMDBuildUI.locales.Locales.administration.common.strings.generalproperties'
        },
        xtype: "fieldset",
        ui: 'administration-formpagination',
        fieldDefaults: CMDBuildUI.util.administration.helper.FormHelper.fieldDefaults,

        layout: 'column',
        defaults: {
            columnWidth: 0.5
        },
        items: [
            // NOT NEEDED ANYMORE FROM 3.2.1-M1
            // {
            //     xtype: 'displayfield',
            //     fieldLabel: CMDBuildUI.locales.Locales.administration.common.labels.name,
            //     localized: {
            //         fieldLabel: 'CMDBuildUI.locales.Locales.administration.common.labels.name'
            //     },
            //     name: 'name',
            //     align: 'left',
            //     bind: {
            //         value: '{theLayer.name}'
            //     }
            // },
            // {
            //     xtype: 'displayfield',
            //     fieldLabel: CMDBuildUI.locales.Locales.administration.common.labels.description,
            //     localized: {
            //         fieldLabel: 'CMDBuildUI.locales.Locales.administration.common.labels.description'
            //     },
            //     name: 'geoerver_name',
            //     align: 'left',
            //     bind: {
            //         value: '{theLayer.description}'
            //     }
            // },
            {
                xtype: 'displayfield',
                fieldLabel: CMDBuildUI.locales.Locales.administration.geoattributes.fieldLabels.type,
                localized: {
                    fieldLabel: 'CMDBuildUI.locales.Locales.administration.geoattributes.fieldLabels.type'
                },
                name: 'type',
                align: 'left',
                bind: {
                    value: '{type}'
                }
            }, {
                xtype: 'displayfield',
                fieldLabel: CMDBuildUI.locales.Locales.administration.gis.associatedclass,
                localized: {
                    fieldLabel: 'CMDBuildUI.locales.Locales.administration.gis.associatedclass'
                },
                name: 'owner_type',
                align: 'left',
                bind: {
                    value: '{_owner_type_description}'
                }
            }, {
                xtype: 'checkbox',
                readOnly: true,
                fieldLabel: CMDBuildUI.locales.Locales.administration.common.labels.active,
                localized: {
                    fieldLabel: 'CMDBuildUI.locales.Locales.administration.common.labels.active'
                },
                name: 'active',
                bind: {
                    value: '{theLayer.active}'
                }
            }
        ]

    }, {
        title: CMDBuildUI.locales.Locales.administration.gis.associatedcard,
        localized: {
            title: 'CMDBuildUI.locales.Locales.administration.gis.associatedcard'
        },
        xtype: "fieldset",
        ui: 'administration-formpagination',
        fieldDefaults: CMDBuildUI.util.administration.helper.FormHelper.fieldDefaults,

        layout: 'column',
        defaults: {
            columnWidth: 0.5
        },
        items: [{
            xtype: 'displayfield',
            fieldLabel: CMDBuildUI.locales.Locales.administration.gis.associatedgeoattribute,
            localized: {
                fieldLabel: 'CMDBuildUI.locales.Locales.administration.gis.associatedgeoattribute'
            },
            name: '_getAttribute_description',
            align: 'left',
            bind: {
                value: '{theLayer.description}'
            }
        }, {
            xtype: 'displayfield',
            fieldLabel: CMDBuildUI.locales.Locales.administration.gis.associatedcard,
            localized: {
                fieldLabel: 'CMDBuildUI.locales.Locales.administration.gis.associatedcard'
            },
            name: 'associatedCard',
            align: 'left',
            bind: {
                value: '{theLayer.owner_id}'
            },
            renderer: function () {
                return this.lookupViewModel().get('cardDescription');
            }
        }]
    }],
    tools: CMDBuildUI.util.administration.helper.FormHelper.getTools({
        edit: true,
        view: true,
        delete: true,
        clone: true,
        activeToggle: true
    }, 'gislayer', 'theLayer')
});