Ext.define('CMDBuildUI.view.administration.content.gisnavigationtrees.ViewModeFormHelper', {

    singleton: true,

    getViewModeFieldset: function () {
        return {
            ui: 'administration-formpagination',
            xtype: "fieldset",
            collapsible: true,
            title: CMDBuildUI.locales.Locales.administration.common.strings.generalproperties,
            localized: {
                title: 'CMDBuildUI.locales.Locales.administration.common.strings.generalproperties'
            },

            layout: 'column',
            fieldDefaults: CMDBuildUI.util.administration.helper.FormHelper.fieldDefaults,
            defaults: {
                columnWidth: 0.5
            },
            items: [
                CMDBuildUI.util.administration.helper.FieldsHelper.getCommonComboInput('subclassViewMode', {
                    subclassViewMode: {
                        fieldcontainer: {
                            fieldLabel: CMDBuildUI.locales.Locales.administration.navigationtrees.fieldlabels.viewmode,
                            localized: {
                                fieldLabel: 'CMDBuildUI.locales.Locales.administration.navigationtrees.fieldlabels.viewmode'
                            }
                        },
                        bind: {
                            value: '{record.subclassViewMode}',
                            store: '{subclassViewModeStore}'
                        }
                    }
                }),
                CMDBuildUI.util.administration.helper.FieldsHelper.getCommonChekboxInput({
                    subclassViewShowIntermediateNodes: {
                        fieldcontainer: {
                            fieldLabel: CMDBuildUI.locales.Locales.administration.navigationtrees.fieldlabels.showintermediatesubclassnode,
                            localized: {
                                fieldLabel: 'CMDBuildUI.locales.Locales.administration.navigationtrees.fieldlabels.showintermediatesubclassnode'
                            },
                            hidden: true,
                            bind: {
                                hidden: '{showIntemediatesHidden}'
                            }
                        },
                        bind: {
                            value: '{record.subclassViewShowIntermediateNodes}'
                        }
                    }
                }, 'subclassViewShowIntermediateNodes')
            ]
        };
    },

    getSubclassesTreeFieldset: function () {
        return {
            ui: 'administration-formpagination',
            xtype: "fieldset",
            collapsible: true,
            // title: CMDBuildUI.locales.Locales.administration.navigationtrees.fieldlabels.subclasses,
            // localized: {
            //     title: 'CMDBuildUI.locales.Locales.administration.navigationtrees.fieldlabels.subclasses'
            // },
            enableColumnHide: false,
            bind: {
                title: '{treeFiledsetTitle}'
            },
            layout: 'column',
            fieldDefaults: CMDBuildUI.util.administration.helper.FormHelper.fieldDefaults,
            defaults: {
                columnWidth: 1
            },

            items: [{
                xtype: 'treepanel',
                viewConfig: {
                    markDirty: false
                },
                ui: 'administration-navigation-tree',
                plugins: CMDBuildUI.util.administration.helper.NavTreeHelper.getViewPlugins(),
                listeners: {
                    beforeitemdblclick: function () {
                        return false;
                    },
                    beforecheckchange: function () {
                        return !this.getView().lookupViewModel().get('actions.view');
                    },
                    checkchange: function (node, checked) {
                        // TODO: empty node.description (label) ???
                    }
                },
                bind: {
                    store: '{subclassesStore}'
                },
                columns: [{
                    xtype: 'treecolumn',
                    text: CMDBuildUI.locales.Locales.administration.classes.toolbar.classLabel,
                    localized: {
                        text: 'CMDBuildUI.locales.Locales.administration.classes.toolbar.classLabel'
                    },
                    dataIndex: 'text',
                    align: 'left',
                    flex: 1
                }, {
                    text: CMDBuildUI.locales.Locales.administration.navigationtrees.fieldlabels.label,
                    localized: {
                        text: 'CMDBuildUI.locales.Locales.administration.navigationtrees.fieldlabels.label'
                    },
                    bind: {
                        hidden: '{record.subclassViewMode === "cards"}'
                    },
                    dataIndex: 'description',
                    flex: 1,
                    editor: 'textfield',
                    align: 'left'
                }]
            }]
        };
    }
});