Ext.define('CMDBuildUI.model.localizations.LocalizationByCode', {
    extend: 'CMDBuildUI.model.base.Base',

    statics: {
        types: {
            class: 'class',
            process: 'class',
            activity: 'activity',
            role: 'role',
            domain: 'domain',
            view: 'view',
            lookup: 'lookup',
            dashboard: 'dashboard',
            filter: 'filter',
            report: 'report',
            menu: 'menuitem',
            attributeclass: 'attributeclass',
            attributegroupclass: 'attributegroupclass',
            attributeprocess: 'attributeclass',
            attributedomain: 'attributedomain',
            attributegroupprocess: 'attributegroupclass'
        },
        attributeTypes: {
            class: 'attributeclass',
            process: 'attributeclass',
            domain: 'attributedomain'
        }
    },

    fields: [{
            name: 'code',
            type: 'string',
            critical: true
        }, {
            name: 'default',
            type: 'string',
            critical: true
        }, {
            name: 'values',
            type: 'auto',
            critical: true
        }, {
            name: 'type',
            type: 'string',
            calculate: function (data) {
                var codeParts = data.code.split('.');
                var type = codeParts[0];

                switch (type) {
                    case CMDBuildUI.model.localizations.LocalizationByCode.types.class:
                    case CMDBuildUI.model.localizations.LocalizationByCode.types.process:
                    case CMDBuildUI.model.localizations.LocalizationByCode.types.view:
                    case CMDBuildUI.model.localizations.LocalizationByCode.types.lookup:
                    case CMDBuildUI.model.localizations.LocalizationByCode.types.report:
                    case CMDBuildUI.model.localizations.LocalizationByCode.types.filter:
                        return CMDBuildUI.locales.Locales.administration.common.labels.description;
                    case CMDBuildUI.model.localizations.LocalizationByCode.types.activity:
                        return CMDBuildUI.locales.Locales.common.tabs.activity;
                    case CMDBuildUI.model.localizations.LocalizationByCode.types.role:
                        return CMDBuildUI.locales.Locales.administration.attributes.fieldlabels.group;
                    case CMDBuildUI.model.localizations.LocalizationByCode.types.domain:

                        var _type;
                        switch (codeParts[2]) {
                            // domain description is not used outside of administration
                            // case 'description':
                            //     _type = 'Domain description';
                            //     break;
                            case 'directdescription':
                                _type = CMDBuildUI.locales.Locales.administration.domains.fieldlabels.directdescription;
                                break;
                            case 'inversedescription':
                                _type = CMDBuildUI.locales.Locales.administration.domains.fieldlabels.inversedescription;
                                break;
                            case 'masterdetaillabel':
                                _type = CMDBuildUI.locales.Locales.administration.domains.fieldlabels.labelmasterdataillong;
                                break;
                        }
                        return _type;

                    case CMDBuildUI.model.localizations.LocalizationByCode.types.dashboard:
                        // TODO get sub elements
                        return CMDBuildUI.locales.Locales.administration.localizations.dashboard;

                    case CMDBuildUI.model.localizations.LocalizationByCode.types.menu:
                        return CMDBuildUI.locales.Locales.administration.localizations.menuitem;

                    case CMDBuildUI.model.localizations.LocalizationByCode.types.attributeprocess:
                    case CMDBuildUI.model.localizations.LocalizationByCode.types.attributeclass:
                    case CMDBuildUI.model.localizations.LocalizationByCode.types.attributedomain:
                        return CMDBuildUI.locales.Locales.administration.localizations.attributedescription;

                    case CMDBuildUI.model.localizations.LocalizationByCode.types.attributegroupclass:
                    case CMDBuildUI.model.localizations.LocalizationByCode.types.attributegroupprocess:
                        return CMDBuildUI.locales.Locales.administration.localizations.attributegroupdescription;

                    default:
                        break;
                }

            }
        },
        {
            name: '_element',
            type: 'string',
            calculate: function (data) {
                var codeParts = data.code.split('.');
                var type = codeParts[0];
                switch (type) {
                    case CMDBuildUI.model.localizations.LocalizationByCode.types.class:
                    case CMDBuildUI.model.localizations.LocalizationByCode.types.process:
                    case CMDBuildUI.model.localizations.LocalizationByCode.types.domain:
                    case CMDBuildUI.model.localizations.LocalizationByCode.types.view:
                    case CMDBuildUI.model.localizations.LocalizationByCode.types.report:
                        return codeParts[1];

                    case CMDBuildUI.model.localizations.LocalizationByCode.types.dashboard:
                        // TODO get sub elements

                        return CMDBuildUI.locales.Locales.administration.localizations.dashboard;

                    case CMDBuildUI.model.localizations.LocalizationByCode.types.menu:
                        return CMDBuildUI.locales.Locales.administration.localizations.menuitem;

                    case CMDBuildUI.model.localizations.LocalizationByCode.types.lookup:
                    case CMDBuildUI.model.localizations.LocalizationByCode.types.attributeclass:
                    case CMDBuildUI.model.localizations.LocalizationByCode.types.attributegroupclass:
                    case CMDBuildUI.model.localizations.LocalizationByCode.types.attributeprocess:
                    case CMDBuildUI.model.localizations.LocalizationByCode.types.attributedomain:
                    case CMDBuildUI.model.localizations.LocalizationByCode.types.filter:
                        return Ext.String.format('{0} -> {1}', codeParts[1], codeParts[2]);

                    default:
                        break;
                }

            }
        }, {
            name: 'element',
            type: 'string',
            calculate: function (data) {
                return data.code.split('.')[1];
            }
        }
    ]
});