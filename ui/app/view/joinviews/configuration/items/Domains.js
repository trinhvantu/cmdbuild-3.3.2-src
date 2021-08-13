Ext.define('CMDBuildUI.view.joinviews.configuration.items.Domains', {
    extend: 'Ext.form.FieldSet',

    requires: [
        'CMDBuildUI.view.joinviews.configuration.items.DomainsController',
        'CMDBuildUI.view.joinviews.configuration.items.DomainsModel'
    ],
    alias: 'widget.joinviews-configuration-items-domains',
    controller: 'joinviews-configuration-items-domains',
    viewModel: {
        type: 'joinviews-configuration-items-domains'
    },
    autoScroll: true,
    fieldDefaults: CMDBuildUI.util.administration.helper.FormHelper.fieldDefaults,
    config: {
        fieldsetUi: null
    },
    bind: {
        title: '{fieldsetTitle}',
        ui: '{fieldsetUi}'
    },
    layout: {
        type: 'vbox',
        align: 'stretch',
        vertical: true
    },

    items: [{
        xtype: 'treepanel',
        rootVisible: false,

        folderSort: true,
        itemId: 'domainstree',
        viewConfig: {
            markDirty: false,
            animate: false
        },
        bind: {
            store: '{treeStore}'
        },
        ui: 'administration-navigation-tree',
        plugins: {
            pluginId: 'cellediting',
            ptype: 'cellediting',
            clicksToEdit: 1,
            listeners: {
                beforeedit: function (editor, context) {
                    if (editor.view.lookupViewModel().get('actions.view') || !context.record.get('checked')) {
                        return false;
                    }
                }
            }
        },

        columns: [{
            xtype: 'treecolumn',
            text: CMDBuildUI.locales.Locales.administration.domains.domain,
            localized: {
                text: 'CMDBuildUI.locales.Locales.administration.domains.domain'
            },
            dataIndex: 'text',
            flex: 0.4
        }, {
            text: CMDBuildUI.locales.Locales.joinviews.domainalias,
            localized: {
                text: 'CMDBuildUI.locales.Locales.joinviews.domainalias'
            },
            dataIndex: 'domainAlias',
            flex: 0.15,
            editor: {
                xtype: 'textfield',
                vtype: "nameInputValidation"
            },
            align: 'left'
        }, {
            text: CMDBuildUI.locales.Locales.joinviews.klass,
            localized: {
                text: 'CMDBuildUI.locales.Locales.joinviews.klass'
            },
            dataIndex: 'targetType',
            align: 'left',
            flex: 0.15,
            editor: {
                xtype: 'combo',
                valueField: 'value',
                displayField: 'label',
                queryMode: 'local',
                store: {
                    model: 'CMDBuildUI.model.base.ComboItem',
                    data: [],
                    proxy: 'memory',
                    sorter: ['label'],
                    autoDestroy: true
                }
            },
            renderer: function (value) {
                if (value) {
                    var record = CMDBuildUI.util.helper.ModelHelper.getObjectFromName(value);
                    return record.getTranslatedDescription();
                }
                return value;
            }
        }, {
            text: CMDBuildUI.locales.Locales.joinviews.targetalias,
            localized: {
                text: 'CMDBuildUI.locales.Locales.joinviews.targetalias'
            },
            dataIndex: 'targetAlias',
            flex: 0.15,
            editor: {
                xtype: 'textfield',
                vtype: "nameInputValidation"
            },
            align: 'left'
        }, {
            text: CMDBuildUI.locales.Locales.joinviews.jointype,
            localized: {
                text: 'CMDBuildUI.locales.Locales.joinviews.jointype'
            },
            dataIndex: 'joinType',
            flex: 0.15,
            editor: {
                xtype: 'combo',
                valueField: 'value',
                displayField: 'label',
                bind: {
                    store: '{joinTypesStore}'
                }
            },
            renderer: function (value) {
                if (value) {
                    var vm = this.lookupViewModel();
                    var store = vm.get('joinTypesStore');
                    var record = store.findRecord('value', value);
                    return record.get('label');
                }
                return value;
            },
            align: 'left'
        }]

    }]
});