Ext.define('CMDBuildUI.view.administration.content.localizations.localization.tabitems.TranslationsGridController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.administration-content-localizations-localization-tabitems-translationsgrid',
    control: {
        '#': {
            beforerender: 'onBeforeRender'
        },
        '#saveBtn': {
            click: 'onSaveBtnClick'
        }
    },

    onBeforeRender: function (view, eOpts) {
        var me = this;
        var hasDetails = ['classes.Classes', 'processes.Processes', 'lookups.LookupTypes', 'groups.Groups'];
        var hasExtended = ['domains.Domains', 'dashboards.Dashboards'];
        var storeId = me.getViewModel().config.storeList[0];
        var translationsStore = view.getViewModel().get('translations');
        Ext.GlobalEvents.fireEventArgs("showadministrationcontentmask", [true]);
        var store = Ext.getStore(storeId);
        if (Ext.Array.contains(hasDetails,storeId)) {
            store.getProxy().setExtraParams({
                detailed: true
            });
        }
        if (Ext.Array.contains(hasExtended,storeId)) {
            store.getProxy().setExtraParams({
                ext: true,
                detailed: true
            });
        }
        store.load({
            callback: function (records, options, success) {
                if (success === true) {
                    translationsStore.load({
                        callback: function () {
                            me.generateList(view, store, translationsStore);
                        }
                    });
                }
            }
        });

    },

    onCancelBtnClick: function (button, e, eOpts) {
        var vm = this.getViewModel();
        vm.set('actions.view', true);
        this.getView().getColumns().forEach(function (column) {
            if (!column.locked) {
                column.setEditor(false);
            }
        });
        vm.set('actions.view', true);
        vm.set('actions.edit', false);
        vm.getParent().toggleEnableTabs();
    },

    privates: {

        generateList: function (view, store, translationsStore) {
            var me = this;
            var tabname = view.getViewModel().tabName;
            var allRows = view.getViewModel().get('allRows');
            var items = store.getRange();
            var languages = me.createLanguagesArray(view);
            switch (tabname) {
                case 'class':
                    me.buildClass(items, allRows, languages, me, translationsStore, view);
                    break;
                case 'process':
                    me.buildProcess(items, allRows, languages, me, translationsStore, view);
                    break;
                case 'domain':
                    me.buildDomain(items, allRows, languages, me, translationsStore, view);
                    break;
                case CMDBuildUI.util.administration.helper.FormHelper.formActions.view:
                    me.buildView(items, allRows, languages, me, translationsStore, view);
                    break;
                case 'searchfilters':
                    me.buildSearchfilters(items, allRows, languages, me, translationsStore, view);
                    break;
                case 'lookup':
                    me.buildLookup(items, allRows, languages, me, translationsStore, view);
                    break;
                case 'report':
                    me.buildReport(items, allRows, languages, me, translationsStore, view);
                    break;
                case 'dashboard':
                    me.buildDashboard(items, allRows, languages, me, translationsStore, view);
                    break;
                case 'group':
                    me.buildGroup(items, allRows, languages, me, translationsStore, view);
                    break;
            }

        },

        createLanguagesArray: function (view) {
            var languagesStore = view.getViewModel().get('languages');
            var languages = [];
            languagesStore.getRange().forEach(function (language) {
                languages.push(language.get('code'));
            });
            return languages;
        },

        buildTranslationsRow: function (translationsQuery, row, languages) {
            var items = translationsQuery.getRange();
            items.forEach(function (item) {
                var lang = item.get('lang');
                if (Ext.Array.contains(languages, lang)) {
                    row[lang] = item.get('value');
                }
            });
        },

        buildClass: function (items, allRows, languages, me, translationsStore, view) {
            items.forEach(function (item) {
                var row = {};
                row.element = item.get('name');
                row.type = CMDBuildUI.locales.Locales.administration.localizations.class;
                row.defaulttranslation = item.get('description');
                var key = CMDBuildUI.util.administration.helper.LocalizationHelper.getLocaleKeyOfClassDescription(row.element);
                row.key = key;
                var translationsQuery = translationsStore.query('code', key, false, false, true);
                if (translationsQuery.length) {
                    me.buildTranslationsRow(translationsQuery, row, languages);
                }
                allRows.push(row);
                item.getAttributes().then(function (itemattributes) { //async call done at the end
                    var groups = [];
                    itemattributes.getRange().forEach(function (itemattribute) {
                        var rowAttribute = {};
                        if (itemattribute.canAdminShow()) {
                            rowAttribute.element = row.element;
                            rowAttribute.type = CMDBuildUI.locales.Locales.administration.localizations.attributeclass;
                            rowAttribute.defaulttranslation = itemattribute.get('description');
                            var attributekey = CMDBuildUI.util.administration.helper.LocalizationHelper.getLocaleKeyOfClassAttributeDescription(rowAttribute.element, itemattribute.get('name'));
                            rowAttribute.key = attributekey;
                            var translationsQueryAttribute = translationsStore.query('code', attributekey, false, false, true);
                            if (translationsQueryAttribute.length) {
                                me.buildTranslationsRow(translationsQueryAttribute, rowAttribute, languages);
                            }
                            allRows.push(rowAttribute);
                        }
                        if (itemattribute.get('_id') !== 'IdTenant' && itemattribute.get('group') !== '') {
                            groups.push(itemattribute.get('group'));
                        }
                    });
                    groups = Ext.Array.unique(groups);
                    groups.forEach(function (group) {
                        var rowGroup = {};
                        rowGroup.element = row.element;
                        rowGroup.type = CMDBuildUI.locales.Locales.administration.localizations.attributegroup;
                        rowGroup.defaulttranslation = group;
                        var groupkey = CMDBuildUI.util.administration.helper.LocalizationHelper.getLocaleKeyOfClassGroupDescription(rowGroup.element, group);
                        rowGroup.key = groupkey;
                        // var groupkey = Ext.String.format('{0}.{1}.description', rowGroup.type, rowGroup.defaulttranslation);
                        var translationsQueryGroup = translationsStore.query('code', groupkey, false, false, true);
                        if (translationsQueryGroup.length) {
                            me.buildTranslationsRow(translationsQueryGroup, rowGroup, languages);
                        }
                        allRows.push(rowGroup);
                    });

                    var store = view.getViewModel().get('completeTranslationsStore');
                    store.setData(allRows);
                    Ext.GlobalEvents.fireEventArgs("showadministrationcontentmask", [false, true]);
                });
            });
        },

        buildProcess: function (items, allRows, languages, me, translationsStore, view) {
            items.forEach(function (item) {
                var row = {
                    element: item.get('name'),
                    type: CMDBuildUI.locales.Locales.administration.localizations.process,
                    defaulttranslation: item.get('description'),
                    key: CMDBuildUI.util.administration.helper.LocalizationHelper.getLocaleKeyOfProcessDescription(item.get('name'))
                };
                var translationsQuery = translationsStore.query('code', row.key, false, false, true);
                if (translationsQuery.length) {
                    me.buildTranslationsRow(translationsQuery, row, languages);
                }

                Ext.Promise.all([
                    item.getAttributes(),
                    item.getActivities()
                ]).then(function (stores) {
                    // add process row
                    allRows.push(row);

                    var itemattributes = stores[0];
                    var itemacitivities = stores[1];

                    // add attributes
                    itemattributes.getRange().forEach(function (itemattribute) {
                        if (itemattribute.canAdminShow()) {
                            // add attribute row
                            var rowAttribute = {
                                element: row.element,
                                type: CMDBuildUI.locales.Locales.administration.localizations.attributeprocess,
                                defaulttranslation: itemattribute.get('description'),
                                key: CMDBuildUI.util.administration.helper.LocalizationHelper.getLocaleKeyOfClassAttributeDescription(row.element, itemattribute.get('name'))
                            };
                            var translationsQueryAttribute = translationsStore.query('code', rowAttribute.key, false, false, true);
                            if (translationsQueryAttribute.length) {
                                me.buildTranslationsRow(translationsQueryAttribute, rowAttribute, languages);
                            }
                            allRows.push(rowAttribute);
                        }
                    }, this);

                    // add activities
                    itemacitivities.getRange().forEach(function (itemacitivity) {
                        // add activity row
                        var rowActivity = {
                            element: row.element,
                            type: CMDBuildUI.locales.Locales.administration.localizations.activity,
                            defaulttranslation: itemacitivity.get('description'),
                            key: CMDBuildUI.util.administration.helper.LocalizationHelper.getLocalKeyOfProcessActivityDescription(row.element, itemacitivity.getId())
                        };
                        var translationsQueryAttribute = translationsStore.query('code', rowActivity.key, false, false, true);
                        if (translationsQueryAttribute.length) {
                            me.buildTranslationsRow(translationsQueryAttribute, rowActivity, languages);
                        }
                        allRows.push(rowActivity);

                        // get activity widgets
                        var itemwidgets = itemacitivity.widgets();
                        itemwidgets.getRange().forEach(function (itemwidget) {
                            // add widget row
                            var rowWidget = {
                                element: row.element,
                                type: CMDBuildUI.locales.Locales.administration.localizations.widget,
                                defaulttranslation: itemwidget.get("_label"),
                                key: CMDBuildUI.util.administration.helper.LocalizationHelper.getLocalkeyOfProcessWidgetDescription(row.element, itemacitivity.getId(), itemwidget.getId())
                            };
                            var translationsQueryAttribute = translationsStore.query('code', rowWidget.key, false, false, true);
                            if (translationsQueryAttribute.length) {
                                me.buildTranslationsRow(translationsQueryAttribute, rowWidget, languages);
                            }
                            allRows.push(rowWidget);
                        }, this);
                    }, this);
                    view.getViewModel().get('completeTranslationsStore').setData(allRows);
                    Ext.GlobalEvents.fireEventArgs("showadministrationcontentmask", [false, true]);
                });
            });
        },

        buildDomain: function (items, allRows, languages, me, translationsStore, view) {
            items.forEach(function (item) {
                var row = {};
                row.element = item.get('name');
                row.type = CMDBuildUI.locales.Locales.administration.localizations.domain;
                row.defaulttranslation = item.get('description');

                var rowdirect = {};
                rowdirect.element = item.get('name');
                rowdirect.type = CMDBuildUI.locales.Locales.administration.localizations.domain;
                rowdirect.defaulttranslation = item.get('descriptionDirect');

                var rowinverse = {};
                rowinverse.element = item.get('name');
                rowinverse.type = CMDBuildUI.locales.Locales.administration.localizations.domain;
                rowinverse.defaulttranslation = item.get('descriptionInverse');

                var rowmasterdetail = {};
                rowmasterdetail.element = item.get('name');
                rowmasterdetail.type = CMDBuildUI.locales.Locales.administration.localizations.domain;
                rowmasterdetail.defaulttranslation = item.get('descriptionMasterDetail');

                var key = CMDBuildUI.util.administration.helper.LocalizationHelper.getLocaleKeyOfDomainDescription(row.element);
                var keydirect = CMDBuildUI.util.administration.helper.LocalizationHelper.getLocaleKeyOfDomainDirectDescription(rowdirect.element);
                var keyinverse = CMDBuildUI.util.administration.helper.LocalizationHelper.getLocaleKeyOfDomainInverseDescription(rowinverse.element);
                var keymasterdetail = CMDBuildUI.util.administration.helper.LocalizationHelper.getLocaleKeyOfDomainMasterDetail(rowmasterdetail.element);

                row.key = key;
                rowdirect.key = keydirect;
                rowinverse.key = keyinverse;
                rowmasterdetail.key = keymasterdetail;

                var translationsQuery = translationsStore.query('code', key, false, false, true);
                var translationsQuerydirect = translationsStore.query('code', keydirect, false, false, true);
                var translationsQueryinverse = translationsStore.query('code', keyinverse, false, false, true);
                var translationsQuerymasterdetail = translationsStore.query('code', keymasterdetail, false, false, true);

                if (translationsQuery.length) {
                    me.buildTranslationsRow(translationsQuery, row, languages);
                }
                if (translationsQuerydirect.length) {
                    me.buildTranslationsRow(translationsQuerydirect, rowdirect, languages);
                }
                if (translationsQueryinverse.length) {
                    me.buildTranslationsRow(translationsQueryinverse, rowinverse, languages);
                }
                if (translationsQuerymasterdetail.length) {
                    me.buildTranslationsRow(translationsQuerymasterdetail, rowmasterdetail, languages);
                }

                allRows.push(row);
                allRows.push(rowdirect);
                allRows.push(rowinverse);
                allRows.push(rowmasterdetail);

                item.getAttributes().then(function (itemattributes) { //async call done at the end
                    itemattributes.getRange().forEach(function (itemattribute) {
                        var rowAttribute = {};

                        if (itemattribute.canAdminShow()) {
                            rowAttribute.element = row.element;
                            rowAttribute.type = CMDBuildUI.locales.Locales.administration.localizations.attributedomain;
                            rowAttribute.defaulttranslation = itemattribute.get('description');
                            var key = CMDBuildUI.util.administration.helper.LocalizationHelper.getLocaleKeyOfDomainAttributeDescription(rowAttribute.element, itemattribute.get('name'));
                            var translationsQueryAttribute = translationsStore.query('code', key, false, false, true);
                            if (translationsQueryAttribute.length) {
                                me.buildTranslationsRow(translationsQueryAttribute, rowAttribute, languages);
                            }
                            allRows.push(rowAttribute);
                        }
                    });
                    view.getViewModel().get('completeTranslationsStore').setData(allRows);
                    Ext.GlobalEvents.fireEventArgs("showadministrationcontentmask", [false, true]);
                });
            });
        },

        buildView: function (items, allRows, languages, me, translationsStore, view) {
            items.forEach(function (item) {
                var row = {};
                row.element = item.get('name');
                row.type = CMDBuildUI.locales.Locales.administration.localizations.view;
                row.defaulttranslation = item.get('description');
                var key = CMDBuildUI.util.administration.helper.LocalizationHelper.getLocaleKeyOfViewDescription(row.element);
                row.key = key;
                var translationsQuery = translationsStore.query('code', key, false, false, true);
                if (translationsQuery.length) {
                    me.buildTranslationsRow(translationsQuery, row, languages);
                }
                allRows.push(row);
                view.getViewModel().get('completeTranslationsStore').setData(allRows);
                Ext.GlobalEvents.fireEventArgs("showadministrationcontentmask", [false, true]);
            });
        },

        buildLookup: function (items, allRows, languages, me, translationsStore, view) {
            items.forEach(function (item) {
                item.getLookupValues().then(function (lookupValues) {
                    lookupValues.getRange().forEach(function (itemLookupValue) {
                        var row = {};
                        row.element = item.get('name');
                        row.type = CMDBuildUI.locales.Locales.administration.localizations.lookup;
                        row.defaulttranslation = itemLookupValue.get('description');
                        var key = CMDBuildUI.util.administration.helper.LocalizationHelper.getLocaleKeyOfLookupValueDescription(row.element, itemLookupValue.get('code'));
                        row.key = key;
                        var translationsQuery = translationsStore.query('code', key, false, false, true);
                        if (translationsQuery.length) {
                            me.buildTranslationsRow(translationsQuery, row, languages);
                        }
                        allRows.push(row);
                    });
                    view.getViewModel().get('completeTranslationsStore').setData(allRows);
                    Ext.GlobalEvents.fireEventArgs("showadministrationcontentmask", [false, true]);
                });
            });

        },

        buildReport: function (items, allRows, languages, me, translationsStore, view) {
            items.forEach(function (item) {
                var row = {};
                row.element = item.get('code');
                row.type = CMDBuildUI.locales.Locales.administration.localizations.report;
                row.defaulttranslation = item.get('description');
                var key = CMDBuildUI.util.administration.helper.LocalizationHelper.getLocaleKeyOfReportDescription(row.element);
                row.key = key;
                var translationsQuery = translationsStore.query('code', key, false, false, true);
                if (translationsQuery.length) {
                    me.buildTranslationsRow(translationsQuery, row, languages);
                }
                allRows.push(row);
                view.getViewModel().get('completeTranslationsStore').setData(allRows);
                Ext.GlobalEvents.fireEventArgs("showadministrationcontentmask", [false, true]);
                item.getAttributes().then(function (itemattributes) {
                    itemattributes.getRange().forEach(function (itemattribute) {
                        var rowAttribute = {};
                        if (itemattribute.canAdminShow()) {
                            rowAttribute.element = row.element;
                            rowAttribute.type = CMDBuildUI.locales.Locales.administration.localizations.attributereport;
                            rowAttribute.defaulttranslation = itemattribute.get('description');
                            var key = CMDBuildUI.util.administration.helper.LocalizationHelper.getLocaleKeyOfReportAttributeDescription(rowAttribute.element, itemattribute.get('code'));
                            rowAttribute.key = key;
                            var translationsQueryAttribute = translationsStore.query('code', key, false, false, true);
                            if (translationsQueryAttribute.length) {
                                me.buildTranslationsRow(translationsQueryAttribute, rowAttribute, languages);
                            }
                            allRows.push(rowAttribute);
                        }
                    });
                    view.getViewModel().get('completeTranslationsStore').setData(allRows);
                    Ext.GlobalEvents.fireEventArgs("showadministrationcontentmask", [false, true]);
                });
            });
        },

        buildDashboard: function (items, allRows, languages, me, translationsStore, view) {

            items.forEach(function (dashboard) {
                var row = {};
                row.element = dashboard.get('name');
                row.type = CMDBuildUI.locales.Locales.administration.localizations.dashboard;
                row.defaulttranslation = dashboard.get('description');
                var key = CMDBuildUI.util.administration.helper.LocalizationHelper.getLocaleKeyOfDashboardDescription(dashboard.get('name'));
                row.key = key;
                var translationsQuery = translationsStore.query('code', key, false, false, true);
                if (translationsQuery.length) {
                    me.buildTranslationsRow(translationsQuery, row, languages);
                }
                allRows.push(row);
                view.getViewModel().get('completeTranslationsStore').setData(allRows);
                // Ext.GlobalEvents.fireEventArgs("showadministrationcontentmask", [false, true]);
                dashboard.charts().each(function (chart) {
                    var rowChartDescription = {};
                    rowChartDescription.element = dashboard.get('name');
                    rowChartDescription.type = CMDBuildUI.locales.Locales.administration.localizations.chartdescription;
                    rowChartDescription.defaulttranslation = chart.get('description');
                    var key = CMDBuildUI.util.administration.helper.LocalizationHelper.getLocaleKeyOfDashboardChartDescription(dashboard.get('name'), chart.get('_id'));
                    rowChartDescription.key = key;
                    var translationsQueryAttribute = translationsStore.query('code', key, false, false, true);
                    if (translationsQueryAttribute.length) {
                        me.buildTranslationsRow(translationsQueryAttribute, rowChartDescription, languages);
                    }
                    allRows.push(rowChartDescription);
                    switch (chart.get('type')) {
                        case CMDBuildUI.model.dashboards.Chart.charttypes.bar:
                        case CMDBuildUI.model.dashboards.Chart.charttypes.line:
                            // add value axis label                               
                            var rowChartValueAxisLabel = {};
                            rowChartValueAxisLabel.element = dashboard.get('name');
                            rowChartValueAxisLabel.type = CMDBuildUI.locales.Locales.administration.localizations.chartvalueaxislabel;
                            rowChartValueAxisLabel.defaulttranslation = chart.get('valueAxisLabel');
                            var rowChartValueAxisLabelKey = CMDBuildUI.util.administration.helper.LocalizationHelper.getLocaleKeyOfDashboardChartValueAxis(dashboard.get('name'), chart.get('_id'));
                            rowChartValueAxisLabel.key = rowChartValueAxisLabelKey;
                            var translationsQueryChartValueAxisLabel = translationsStore.query('code', rowChartValueAxisLabel.key, false, false, true);
                            if (translationsQueryChartValueAxisLabel.length) {
                                me.buildTranslationsRow(translationsQueryChartValueAxisLabel, rowChartValueAxisLabel, languages);
                            }

                            allRows.push(rowChartValueAxisLabel);

                            // add category axis label
                            var rowChartCategoryAxisLabel = {};
                            rowChartCategoryAxisLabel.element = dashboard.get('name');
                            rowChartCategoryAxisLabel.type = CMDBuildUI.locales.Locales.administration.localizations.chartdescriptionaxislabel;
                            rowChartCategoryAxisLabel.defaulttranslation = chart.get('categoryAxisLabel');
                            var rowChartCategoryAxisLabelKey = CMDBuildUI.util.administration.helper.LocalizationHelper.getLocaleKeyOfDashboardChartCategoryAxis(dashboard.get('name'), chart.get('_id'));
                            rowChartCategoryAxisLabel.key = rowChartCategoryAxisLabelKey;
                            var translationsQueryChartCategoryAxisLabel = translationsStore.query('code', rowChartCategoryAxisLabel.key, false, false, true);
                            if (translationsQueryChartCategoryAxisLabel.length) {
                                me.buildTranslationsRow(translationsQueryChartCategoryAxisLabel, rowChartCategoryAxisLabel, languages);
                            }

                            allRows.push(rowChartCategoryAxisLabel);
                            break;

                        default:
                            break;
                    }
                    chart.dataSourceParameters().each(function (parameter, index) {
                        // add parameter name
                        var rowChartParameterName = {};
                        rowChartParameterName.element = dashboard.get('name');
                        rowChartParameterName.type = CMDBuildUI.locales.Locales.administration.localizations.chartparametername;
                        rowChartParameterName.defaulttranslation = parameter.get('name');
                        var rowChartParameterNameKey = CMDBuildUI.util.administration.helper.LocalizationHelper.getLocaleKeyOfDashboardChartParameterName(dashboard.get('name'), chart.get('_id'), index);
                        rowChartParameterName.key = rowChartParameterNameKey;
                        var translationsQueryChartParameterName = translationsStore.query('code', rowChartParameterName.key, false, false, true);
                        if (translationsQueryChartParameterName.length) {
                            me.buildTranslationsRow(translationsQueryChartParameterName, rowChartDescription, languages);
                        }
                        allRows.push(rowChartParameterName);
                    });
                });
            });
            var store = view.getViewModel().get('completeTranslationsStore');
            store.setSorters(['key']);
            store.setData(allRows);
            Ext.GlobalEvents.fireEventArgs("showadministrationcontentmask", [false, true]);
        },
        buildGroup: function (items, allRows, languages, me, translationsStore, view) {
            items.forEach(function (item) {
                var row = {};
                row.element = item.get('name');
                row.type = CMDBuildUI.locales.Locales.administration.groupandpermissions.texts.group;
                row.defaulttranslation = item.get('description');
                var key = CMDBuildUI.util.administration.helper.LocalizationHelper.getLocaleKeyOfGroupDescription(row.element);
                row.key = key;
                var translationsQuery = translationsStore.query('name', key, false, false, true);
                if (translationsQuery.length) {
                    me.buildTranslationsRow(translationsQuery, row, languages);
                }
                allRows.push(row);
                view.getViewModel().get('completeTranslationsStore').setData(allRows);
                Ext.GlobalEvents.fireEventArgs("showadministrationcontentmask", [false, true]);                
            });
        },
        buildSearchfilters: function (items, allRows, languages, me, translationsStore, view) {
            Ext.GlobalEvents.fireEventArgs("showadministrationcontentmask", [false, true]);
        }
    },

    editedCell: function (editor, context, eOpts) {
        var me = this;
        var field = context.field;
        var modvalue = context.value;
        var store = me.getViewModel().get('translations');
        var key = context.record.get('key');

        var res = store.queryBy(function (record, id) {
            if (record.get('code') == key && record.get('lang') == field) {
                return true;
            }
        });

        if (res.length) {
            res.getRange()[0].set('value', modvalue);
        } else {
            var newTranslation = Ext.create('CMDBuildUI.model.localizations.Localization');
            newTranslation.set('code', key);
            newTranslation.set('lang', field);
            newTranslation.set('value', modvalue);
            store.add([newTranslation]);
        }
    },

    onSaveBtnClick: function (button, e, eOpts) {
        var vm = this.getViewModel();
        vm.set('actions.view', true);
        vm.set('actions.edit', false);
        vm.getParent().toggleEnableTabs();
        this.getView().getColumns().forEach(function (column) {
            if (!column.locked) {
                column.setEditor(false);
            }
        });

        var modifiedRecords = vm.get('translations').getModifiedRecords();
        modifiedRecords.forEach(function (record) {
            var data = {};
            var lang = record.get('lang');
            var value = record.get('value');
            var code = record.get('code');
            data[lang] = value;
            Ext.Ajax.request({
                url: Ext.String.format('{0}/translations/{1}', CMDBuildUI.util.Config.baseUrl, code),
                method: 'PUT',
                jsonData: data
            });
        });
    }

});