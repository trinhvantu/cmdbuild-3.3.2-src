Ext.define('CMDBuildUI.view.administration.content.schedules.ruledefinitions.card.CardController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.view-administration-content-schedules-ruledefinitions-card',
    requires: ['CMDBuildUI.util.Msg'],
    control: {
        '#': {
            afterrender: 'onBeforeRender'
        },
        '#editBtn': {
            click: 'onEditBtnClick'
        },
        '#deleteBtn': {
            click: 'onDeleteBtnClick'
        },
        '#enableBtn': {
            click: 'onToggleBtnClick'
        },
        '#disableBtn': {
            click: 'onToggleBtnClick'
        },
        '#saveBtn': {
            click: 'onSaveBtnClick'
        },
        '#cancelBtn': {
            click: 'onCancelBtnClick'
        },
        '#closeBtn': {
            click: 'onCancelBtnClick'
        },
        '#applyRuleBtn': {
            click: 'onApplyRuleBtnClick'
        }
    },

    /**
     * 
     * @param {CMDBuildUI.view.administration.content.schedules.ruledefinitions.card.Card} view 
     */
    onBeforeRender: function (view) {
        CMDBuildUI.util.Stores.load('emails.Templates');
        view.add(CMDBuildUI.view.administration.content.schedules.ruledefinitions.card.FormHelper.getGeneralProperties('both'));
        view.add(CMDBuildUI.view.administration.content.schedules.ruledefinitions.card.FormHelper.getTypeProperties('both'));

    },
    /**
     * @param {Ext.button.Button} button
     * @param {Event} e
     * @param {Object} eOpts
     */
    onSaveBtnClick: function (button, e, eOpts) {
        CMDBuildUI.util.Utilities.showLoader(true);
        var me = this,
            form = me.getView(),
            vm = me.getViewModel(),
            grid = vm.get('grid'),
            theSchedule = vm.get('theSchedule');
        var reportParameters = {};
        var reportParametersStore = form.down('#reportParametersGrid').getStore();
        Ext.Array.forEach(reportParametersStore.getRange(), function (item) {
            reportParameters[item.get('key')] = item.get('value');
        });

        theSchedule.set('_notification__report_params', reportParameters);

        Ext.Array.forEach(Ext.Object.getAllKeys(theSchedule.getData()), function (key) {
            if (Ext.String.startsWith(key, 'notifications___0___reports___0___params_')) {
                theSchedule.set(key, undefined);
            }
        });
        Ext.Array.forEach(Ext.Object.getAllKeys(reportParameters), function (key) {
            theSchedule.set(Ext.String.format('notifications___0___reports___0___params_{0}', key), reportParameters[key]);
        });

        // set partecipants
        theSchedule.save({
            success: function (record, operation) {
                me.saveLocales(vm, record);
                if (grid) {
                    grid.fireEventArgs('itemupdated', [record]);
                }
                form.container.component.fireEvent("closed");
            },
            failure: function () {
                CMDBuildUI.util.Utilities.showLoader(false);
            }
        });
    },

    /**
     * @param {Ext.button.Button} button
     * @param {Event} e
     * @param {Object} eOpts
     */
    onCancelBtnClick: function (button, e, eOpts) {
        var view = this.getView();
        var vm = this.getViewModel();
        vm.get("theSchedule").reject(); // discard changes
        view.container.component.fireEvent("closed");
    },

    /**
     * On description translate button click
     * @param {Ext.button.Button} button
     * @param {Event} event
     * @param {Object} eOpts
     */
    onTranslateClickDescription: function (event, button, eOpts) {
        var vm = this.getViewModel();
        var theSchedule = vm.get('theSchedule');
        var translationCode = CMDBuildUI.util.administration.helper.LocalizationHelper.getLocaleKeyOfScheduleDescription(vm.get('actions.edit') ? theSchedule.get('_id') : '.');
        CMDBuildUI.util.administration.helper.FormHelper.openLocalizationPopup(translationCode, vm.get('action'), 'theDescriptionTranslation', vm.getParent());
    },

    /**
     * On extended description translate button click
     * @param {Event} event
     * @param {Ext.button.Button} button
     * @param {Object} eOpts
     */
    onTranslateClickExtDescription: function (event, button, eOpts) {
        var vm = this.getViewModel();
        var theSchedule = vm.get('theSchedule');
        var translationCode = CMDBuildUI.util.administration.helper.LocalizationHelper.getLocaleKeyOfScheduleExtDescription(vm.get('actions.edit') ? theSchedule.get('_id') : '.');
        CMDBuildUI.util.administration.helper.FormHelper.openLocalizationPopup(translationCode, vm.get('action'), 'theExtDescriptionTranslation', vm.getParent());
    },

    /**
     * @param {Ext.button.Button} button
     * @param {Event} e
     * @param {Object} eOpts
     */
    onEditBtnClick: function (button, e, eOpts) {
        var me = this,
            view = me.getView(),
            vm = view.getViewModel(),
            theSchedule = vm.get('theSchedule'),
            viewModel = {
                data: {
                    grid: vm.get('grid'),
                    action: CMDBuildUI.util.administration.helper.FormHelper.formActions.edit,
                    actions: {
                        view: false,
                        edit: true,
                        add: false
                    }
                },
                links: {
                    theSchedule: {
                        type: 'CMDBuildUI.model.calendar.Trigger',
                        id: theSchedule.get('_id')
                    }
                }
            };

        var container = view.container.component;
        container.removeAll();
        container.add({
            xtype: 'administration-content-schedules-ruledefinitions-card',
            viewModel: viewModel
        });

    },

    /**
     * @param {Ext.button.Button} button
     * @param {Event} e
     * @param {Object} eOpts
     */
    onDeleteBtnClick: function (button, e, eOpts) {
        var me = this,
            view = me.getView(),
            vm = view.getViewModel(),
            grid = vm.get('grid'),
            theSchedule = vm.get('theSchedule');
        Ext.Msg.alwaysOnTop = true;
        Ext.Msg.confirm(
            CMDBuildUI.locales.Locales.administration.common.messages.attention,
            CMDBuildUI.locales.Locales.administration.common.messages.areyousuredeleteitem,
            function (btnText) {
                if (btnText === "yes") {
                    CMDBuildUI.util.Ajax.setActionId('delete-schedule');
                    theSchedule.erase({
                        success: function (record, operation) {
                            if (grid) {
                                grid.fireEventArgs('reload', [record, 'delete']);
                            }
                            if (view.source) {
                                view.source.container.component.remove(view.source);
                            }
                            view.container.component.fireEvent("closed");
                        }
                    });
                }
            }, this);
    },


    /**
     * @param {Ext.button.Button} button
     * @param {Event} e
     * @param {Object} eOpts
     */

    onToggleBtnClick: function (button, e, eOpts) {
        var me = this,
            view = me.getView(),
            vm = view.getViewModel(),
            grid = vm.get('grid'),
            theSchedule = vm.get('theSchedule');
        theSchedule.set('active', !theSchedule.get('active'));

        theSchedule.save({
            success: function (record, operation) {
                if (grid) {
                    grid.fireEventArgs("itemupdated", [view, record]);
                }
            }
        });
    },

    /**
     * @param {Ext.button.Button} button
     * @param {Event} e
     * @param {Object} eOpts
     */
    onApplyRuleBtnClick: function (button, e, eOpts) {

        var me = this;
        var vm = me.getViewModel();
        var record = vm.get('theSchedule');
        var recordFilter = {};
        /**
         * 
         * 
         */
        var getAttributesFilterTab = function (_viewmodel, _record) {
            var filterPanel = {
                xtype: 'administration-filters-attributes-panel',
                title: CMDBuildUI.locales.Locales.administration.attributes.attributes, // Attributes
                allowInputParameter: false,
                allowCurrentUser: true,
                allowCurrentGroup: true,
                viewModel: _viewmodel
            };
            return filterPanel;
        };

        var getRelationsFilterTab = function (_viewmodel, _record) {
            var filterPanel = {
                xtype: 'administration-filters-relations-panel',
                title: CMDBuildUI.locales.Locales.administration.groupandpermissions.fieldlabels.relations, // Relations
                viewModel: _viewmodel
            };
            return filterPanel;
        };

        var popuTitle = CMDBuildUI.locales.Locales.administration.schedules.applyruletoexistingcards;

        var type = CMDBuildUI.util.helper.ModelHelper.getObjectTypeByName(record.get("ownerClass"));


        var filter = Ext.create('CMDBuildUI.model.base.Filter', {
            name: CMDBuildUI.locales.Locales.filters.newfilter,
            description: CMDBuildUI.locales.Locales.filters.newfilter,
            target: record.get("ownerClass"),
            configuration: recordFilter,
            shared: true

        });

        var viewmodel = {
            data: {
                objectType: type,
                objectTypeName: record.get("ownerClass"),

                actions: {
                    edit: true
                }
            }
        };
        var attrbutePanel = getAttributesFilterTab(viewmodel, record);
        var relationsPanel = getRelationsFilterTab(viewmodel, record);
        var listeners = {
            /**
             * Custom event to close popup directly from popup
             * @param {Object} eOpts 
             */
            popupclose: function (eOpts) {
                me.popup.close();
            }
        };
        var dockedItems = [{
            xtype: 'toolbar',
            dock: 'bottom',
            ui: 'footer',
            hidden: false,
            items: CMDBuildUI.util.administration.helper.FormHelper.getOkCloseButtons({
                text: CMDBuildUI.locales.Locales.administration.schedules.apply,
                localized: {
                    text: 'CMDBuildUI.locales.Locales.administration.schedules.apply'
                },
                handler: function (_button) {
                    var value = {
                        attribute: _button.up('tabpanel').down('administration-filters-attributes-panel').getAttributesData(),
                        relation: _button.up('tabpanel').down('administration-filters-relations-panel').getRelationsData()
                    };
                    value = (Ext.Object.isEmpty(value.attribute) && Ext.Object.isEmpty(value.relation)) ? '' : Ext.encode(value);
                    var msg = Ext.isEmpty(value) ? CMDBuildUI.locales.Locales.administration.schedules.applyonallcards : CMDBuildUI.locales.Locales.administration.schedules.applyonmatchingcards;

                    CMDBuildUI.util.Msg.confirm(
                        CMDBuildUI.locales.Locales.administration.common.messages.attention,
                        msg,
                        function (btnText) {
                            if (btnText === "yes") {
                                CMDBuildUI.util.Utilities.showLoader(true);
                                CMDBuildUI.util.Ajax.setActionId('apply-schedulerule');
                                Ext.Ajax.request({
                                    url: Ext.String.format("{0}/calendar/triggers/{1}/create-events", CMDBuildUI.util.Config.baseUrl, record.get('_id')),
                                    method: 'POST',
                                    jsonData: {},
                                    timeout: 0,
                                    params: {
                                        filter: value
                                    },
                                    success: function (response) {
                                        var res = Ext.JSON.decode(response.responseText);
                                        if (res.success) {
                                            me.popup.close();
                                        }
                                    },
                                    callback: function () {
                                        CMDBuildUI.util.Utilities.showLoader(false);
                                    }
                                });
                            }
                        }, this);
                }
            }, {
                handler: function () {
                    me.popup.close();
                }
            })
        }];
        var content = {
            xtype: 'tabpanel',
            cls: 'administration',
            ui: 'administration-tabandtools',
            items: [attrbutePanel, relationsPanel],
            dockedItems: dockedItems,
            listeners: listeners
        };

        me.popup = CMDBuildUI.util.Utilities.openPopup(
            'filterpopup',
            popuTitle,
            content, {}, {
                ui: 'administration-actionpanel',
                listeners: {
                    afterrender: function () {
                        var _vm = this.down('administration-filters-relations-panel').getViewModel();
                        _vm.populateRelationStore({
                            filter: _vm.get('theFilter'),
                            type: _vm.get('objectType'),
                            name: _vm.get('objectTypeName')
                        });
                    }
                },

                viewModel: {
                    data: {
                        theFilter: filter,
                        index: '0',
                        grid: {},
                        record: record,
                        canedit: true
                    }
                }
            }
        );
    },
    /**
     * 
     * @param {CMDBuildUI.view.administration.content.schedules.ruledefinitions.card.CardModel} vm 
     * @param {Ext.data.Model} record 
     */
    saveLocales: function (vm, record) {
        if (vm.get('actions.add')) {
            var translations = [
                'theDescriptionTranslation',
                'theExtDescriptionTranslation'
            ];
            var keyFunction = [
                'getLocaleKeyOfScheduleDescription',
                'getLocaleKeyOfScheduleExtDescription'
            ];
            Ext.Array.forEach(translations, function (item, index) {
                if (vm.get(item)) {
                    var translationCode = CMDBuildUI.util.administration.helper.LocalizationHelper[keyFunction[index]](record.get('_id'));
                    vm.get(item).crudState = 'U';
                    vm.get(item).crudStateWas = 'U';
                    vm.get(item).phantom = false;
                    vm.get(item).set('_id', translationCode);
                    vm.get(item).save({
                        success: function (translations, operation) {
                            CMDBuildUI.util.Logger.log(item + " localization was saved", CMDBuildUI.util.Logger.levels.debug);
                        }
                    });
                }
            });
        }
    }


});