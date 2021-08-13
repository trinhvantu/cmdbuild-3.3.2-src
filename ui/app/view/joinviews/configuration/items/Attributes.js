Ext.define('CMDBuildUI.view.joinviews.configuration.items.Attributes', {
    extend: 'Ext.form.FieldSet',

    requires: [
        'CMDBuildUI.view.joinviews.configuration.items.AttributesController',
        'CMDBuildUI.view.joinviews.configuration.items.AttributesModel'
    ],
    alias: 'widget.joinviews-configuration-items-attributes',
    controller: 'joinviews-configuration-items-attributes',
    viewModel: {
        type: 'joinviews-configuration-items-attributes'
    },

    title: CMDBuildUI.locales.Locales.joinviews.attributes,
    localized: {
        title: 'CMDBuildUI.locales.Locales.joinviews.attributes'
    },
    fieldDefaults: CMDBuildUI.util.administration.helper.FormHelper.fieldDefaults,
    bind: {
        ui: '{fieldsetUi}'
    },
    layout: {
        type: 'card'
    },
    listeners: {
        classchange: 'onClassChange',
        classaliaschange: 'onClassAliasChange',
        domainchange: 'onDomainChange',
        domaincheckchange: 'onDomainCheckChange',
        attributedescriptionlocalizebtnclick: 'onAttributeDescriptionLocalizeBtnClick',
        attributegruopchanged: 'onAttributeGroupsChanged',
        attributegruopremoved: 'onAttributeGroupsRemoved'
    },
    // scrollable: 'y',
    items: [{
        xtype: 'grid',
        forceFit: true,
        ui: 'cmdbuildgrouping',
        itemId: 'attributegrid',
        listeners: {
            beforedeselect: 'onBeforeDeselect',
            deselect: 'onDeselect',
            beforeselect: 'onBeforeSelect',
            select: 'onSelect'
        },
        height: '100',

        selModel: {
            pruneRemoved: true, // See https://docs.sencha.com/extjs/6.2.0/classic/Ext.selection.Model.html#cfg-pruneRemoved
            selType: 'checkboxmodel',
            checkOnly: true,
            mode: 'MULTI'
        },
        plugins: {
            pluginId: 'cellediting',
            ptype: 'cellediting',
            clicksToEdit: 1,
            listeners: {
                beforeedit: function (editor, context) {
                    var grid = editor.getCmp().ownerGrid;
                    var isSelected = grid.getSelection().findIndex(function (selected) {
                        return (selected.get('expr') === context.record.get('expr'));
                    }) > -1;
                    if (editor.view.lookupViewModel().get('actions.view') || !isSelected) {
                        return false;
                    }
                }
            }
        },
        features: [{
            ftype: 'grouping',
            collapsible: true,
            groupHeaderTpl: [
                '<div>{[this.formatGroupLabel(values)]}</div>',
                {
                    formatGroupLabel: function (data) {
                        return Ext.String.format(CMDBuildUI.locales.Locales.joinviews.attributesof, data.children[0].get('targetAlias'));
                    }
                }
            ]
        }],
        viewConfig: {
            markDirty: false
        },

        bind: {
            selection: '{selectedAttributes}',
            store: '{allAttributesStore}'
        },
        columns: [{
            text: CMDBuildUI.locales.Locales.joinviews.attribute,
            localized: {
                text: 'CMDBuildUI.locales.Locales.joinviews.attribute'
            },
            dataIndex: '_attributeDescription'
        }, {
            text: CMDBuildUI.locales.Locales.joinviews.alias,
            localized: {
                text: 'CMDBuildUI.locales.Locales.joinviews.alias'
            },
            dataIndex: 'name',
            editor: {
                xtype: 'textfield',
                vtype: "nameInputValidation",
                autoEl: {
                    'data-testid': 'joinviews-configuration-items-attributes-name-input'
                }
            }
        }, {
            text: CMDBuildUI.locales.Locales.joinviews.description,
            localized: {
                text: 'CMDBuildUI.locales.Locales.joinviews.description'
            },
            dataIndex: 'description',
            editor: {
                xtype: 'textfield',
                triggers: {
                    localized: {
                        bind: {
                            hidden: '{isAdministrationModule}'
                        },
                        cls: 'fa-flag',
                        handler: function (field, trigger, eOpts) {
                            field.up('joinviews-configuration-items-attributes').fireEventArgs('attributedescriptionlocalizebtnclick', [field, trigger, eOpts]);
                        },
                        autoEl: {
                            'data-testid': 'joinviews-configuration-items-attributes-description-localizeBtn'
                        }
                    }
                },
                listeners: {
                    beforerender: function () {
                        if (!this.lookupViewModel().get('isAdministrationModule')) {
                            this.setHideTrigger(true);
                        }
                    }
                },
                autoEl: {
                    'data-testid': 'joinviews-configuration-items-attributes-description-input'
                }
            }
        }, {
            text: CMDBuildUI.locales.Locales.joinviews.group,
            localized: {
                text: 'CMDBuildUI.locales.Locales.joinviews.group'
            },
            dataIndex: 'group',
            editor: {
                xtype: 'combo',
                displayField: 'description',
                valueField: 'name',
                queryMode: 'local',
                bind: {
                    store: '{theView.attributeGroups}'
                },
                autoEl: {
                    'data-testid': 'joinviews-configuration-items-attributes-groups-input'
                }
            },
            renderer: function (value) {
                var vm = this.lookupViewModel();
                var attributeGroupsStore = vm.get('theView.attributeGroups');

                if (attributeGroupsStore) {
                    var record = attributeGroupsStore.findRecord('name', value);
                    if (record) {
                        return record.get('description');
                    }
                }
                return value;
            }
        }, {
            text: CMDBuildUI.locales.Locales.joinviews.showingrid,
            localized: {
                text: 'CMDBuildUI.locales.Locales.joinviews.showingrid'
            },
            xtype: 'checkcolumn',
            dataIndex: 'showInGrid',
            listeners: {
                beforecheckchange: function (check, rowIndex, checked, record, e, eOpts) {
                    if (this.lookupViewModel().get('actions.view') || Ext.isEmpty(check.up('grid').selModel.getSelected().map[record.get('id')])) {
                        return false;
                    }
                    return true;
                }
            }
        }, {
            xtype: 'checkcolumn',
            text: CMDBuildUI.locales.Locales.joinviews.showshowinreducedgridInGrid,
            localized: {
                text: 'CMDBuildUI.locales.Locales.joinviews.showinreducedgrid'
            },
            dataIndex: 'showInReducedGrid',
            listeners: {
                beforecheckchange: function (check, rowIndex, checked, record, e, eOpts) {
                    if (this.lookupViewModel().get('actions.view') || Ext.isEmpty(check.up('grid').selModel.getSelected().map[record.get('id')])) {
                        return false;
                    }
                    return true;
                }
            }
        }]
    }]
});