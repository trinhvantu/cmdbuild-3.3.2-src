Ext.define('CMDBuildUI.view.administration.content.groupsandpermissions.tabitems.group.PropertiesController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.administration-content-groupsandpermissions-tabitems-group-properties',

    require: [
        'CMDBuildUI.util.Utilities',
        'CMDBuildUI.util.administration.helper.FormHelper'
    ],

    control: {
        '#': {
            beforerender: 'onBeforeRender'
        },
        '#saveBtn': {
            click: 'onSaveBtnClick'
        },
        '#cancelBtn': {
            click: 'onCancelBtnClick'
        }
    },

    /**
     * 
     * @param {CMDBuildUI.view.administration.content.groupsandpermissions.tabitems.group.Properties} view 
     */
    onBeforeRender: function (view) {

    },

    onEditBtnClick: function (button) {
        var vm = this.getView().up('administration-content-groupsandpermissions-view').getViewModel();
        vm.set('action', CMDBuildUI.util.administration.helper.FormHelper.formActions.edit);
        vm.toggleEnableTabs(0);
    },

    onToggleEnableBtnClick: function (button) {
        button.setDisabled(false);
        var vm = this.getView().up('administration-content-groupsandpermissions-view').getViewModel();
        Ext.GlobalEvents.fireEventArgs("showadministrationcontentmask", [true]);

        var value = !vm.get('theGroup.active');
        vm.set('theGroup.active', value);
        vm.get('theGroup').save({
            success: function (record, operation) {
                var w = Ext.create('Ext.window.Toast', {
                    title: CMDBuildUI.locales.Locales.administration.common.messages.success,
                    localized: {
                        title: 'CMDBuildUI.locales.Locales.administration.common.messages.success'
                    },
                    html: Ext.String.format('Group was {0} correctly.', (value) ? 'activated' : 'deactivated'), // todo: translate
                    iconCls: 'x-fa fa-check-circle',
                    align: 'br'
                });
                vm.configToolbarButtons();
                w.show();
            },
            callback: function (record, reason) {
                if (button.el.dom) {
                    button.setDisabled(false);
                }
                Ext.GlobalEvents.fireEventArgs("showadministrationcontentmask", [false]);
            }
        });
    },

    /**
     * @param {Ext.button.Button} button
     * @param {Event} e
     * @param {Object} eOpts
     */
    onSaveBtnClick: function (button, e, eOpts) {
        var me = this;
        Ext.GlobalEvents.fireEventArgs("showadministrationcontentmask", [true]);
        button.setDisabled(true);
        var vm = this.getViewModel();
        var mainVM = this.getView().up('administration-content-groupsandpermissions-view').getViewModel();
        if (vm.get('theGroup').isValid()) {
            var theGroup = vm.get('theGroup');
            delete theGroup.data.system;
            Ext.apply(theGroup.data, theGroup.getAssociatedData());

            theGroup.save({
                success: function (record, operation) {
                    me.saveLocales(Ext.copy(vm), record);
                    var nextUrl = Ext.String.format('administration/groupsandpermissions/{0}', record.get('_id'));
                    if (vm.get('actions.edit')) {
                        var treestore = Ext.getCmp('administrationNavigationTree').getStore();
                        var selected = treestore.findNode("href", nextUrl);
                        selected.set('text', record.get('description'));
                        vm.set('action', CMDBuildUI.util.administration.helper.FormHelper.formActions.view);
                        mainVM.toggleEnableTabs();
                        mainVM.configToolbarButtons();
                    } else {
                        CMDBuildUI.util.administration.MenuStoreBuilder.initialize(
                            function () {
                                var treeComponent = Ext.getCmp('administrationNavigationTree');
                                var treeComponentStore = treeComponent.getStore();
                                var selected = treeComponentStore.findNode("href", nextUrl);

                                treeComponent.setSelection(selected);
                            });
                        vm.set('action', CMDBuildUI.util.administration.helper.FormHelper.formActions.view);
                        me.redirectTo(nextUrl, true);
                    }
                },
                callback: function (record, reason) {
                    if (button.el.dom) {
                        button.setDisabled(false);
                    }
                    Ext.GlobalEvents.fireEventArgs("showadministrationcontentmask", [false]);
                }
            });
        }
    },

    /**
     * @param {Ext.button.Button} button
     * @param {Event} e
     * @param {Object} eOpts
     */
    onCancelBtnClick: function (button, e, eOpts) {
        var vm = this.getView().up('administration-content-groupsandpermissions-view').getViewModel();
        vm.toggleEnableTabs();
        vm.get('theGroup').reject();
        if (vm.get('actions.add')) {
            vm.set('action', CMDBuildUI.util.administration.helper.FormHelper.formActions.view);
            var nextUrl = CMDBuildUI.util.administration.helper.ApiHelper.client.getPermissionUrl();
            CMDBuildUI.util.administration.MenuStoreBuilder.selectAndRedirectToRecordBy('href', nextUrl, this);
        } else {
            vm.set('action', CMDBuildUI.util.administration.helper.FormHelper.formActions.view);
        }
    },

    /**
     * On translate button click
     * @param {Ext.button.Button} button
     * @param {Event} event
     * @param {Object} eOpts
     */
    onTranslateClickDescription: function (event, button, eOpts) {
        var vm = this.getViewModel();
        var theGroup = vm.get('theGroup');
        var translationCode = CMDBuildUI.util.administration.helper.LocalizationHelper.getLocaleKeyOfGroupDescription(vm.get('actions.edit') ? theGroup.get('name') : '.');
        CMDBuildUI.util.administration.helper.FormHelper.openLocalizationPopup(translationCode, vm.get('action'), 'theGroupDescriptionTranslation', vm.getParent());
    },

    privates: {
        saveLocales: function (vm, record) {
            if (vm.get('actions.add')) {
                if (vm.get('theGroupDescriptionTranslation')) {
                    var translationCode = CMDBuildUI.util.administration.helper.LocalizationHelper.getLocaleKeyOfGroupDescription(record.get('name'));
                    vm.get('theGroupDescriptionTranslation').crudState = 'U';
                    vm.get('theGroupDescriptionTranslation').crudStateWas = 'U';
                    vm.get('theGroupDescriptionTranslation').phantom = false;
                    vm.get('theGroupDescriptionTranslation').set('_id', translationCode);
                    vm.get('theGroupDescriptionTranslation').save({
                        success: function (translations, operation) {
                            CMDBuildUI.util.Logger.log('theGroupDescriptionTranslation' + " localization was saved", CMDBuildUI.util.Logger.levels.debug);
                        }
                    });
                }
            }
        }
    }

});