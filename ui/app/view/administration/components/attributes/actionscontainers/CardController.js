Ext.define('CMDBuildUI.view.administration.components.attributes.actionscontainers.CardController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.administration-components-attributes-actionscontainers-card',

    control: {
        '#': {
            beforerender: 'onBeforeRender',
            afterrender: 'onAfterRender'
        },
        '#saveBtn': {
            click: 'onSaveBtnClick'
        },
        '#saveAndAddBtn': {
            click: 'onSaveAndAddBtnClick'
        },
        '#cancelBtn': {
            click: 'onCancelBtnClick'
        },
        '#attributedomain': {
            change: 'onAttributeDomainChange'
        },
        '#editBtn': {
            click: 'onEditBtnClick'
        },
        '#openBtn': {
            click: 'onOpenBtnClick'
        },
        '#cloneBtn': {
            click: 'onCloneBtnClick'
        },
        '#deleteBtn': {
            click: 'onDeleteBtnClick'
        },
        '#enableBtn': {
            click: 'onToggleActiveBtnClick'
        },
        '#disableBtn': {
            click: 'onToggleActiveBtnClick'
        },
        '#attributeMode': {
            change: 'attributeModeValidation'
        },
        '#attributeShowInGrid': {
            change: 'attributeModeValidation'
        },
        '#attributeShowInReducedGrid': {
            change: 'attributeModeValidation'
        },
        '#attributeMandatory': {
            change: 'attributeModeValidation'
        }
    },

    /**
     * @param {CMDBuildUI.view.administration.content.processes.tabitems.attributes.card.Card} view
     * @param {Object} eOpts
     */
    onBeforeRender: function (view, eOpts) {
        Ext.getStore('domains.Domains').load();
        var vm = view.getViewModel();
        if (vm.get('objectType') !== 'Domain') {
            vm.set('isGroupHidden', false);
            vm.set('isOtherPropertiesHidden', false);
        } else {
            view.down('#groupfield').destroy();
        }
        this.linkAttribute(view, vm);
    },
    /**
     * @param {CMDBuildUI.view.administration.content.processes.tabitems.attributes.card.Card} view
     * @param {Object} eOpts
     */
    onAfterRender: function (view) {
        var vm = view.getViewModel();
        var currentObject = this.currentObject = CMDBuildUI.util.helper.ModelHelper.getObjectFromName(vm.get('objectTypeName'));
        if (view.form && currentObject && currentObject.get('_can_modify') === false) {
            view.form.getFields().each(function (field) {
                field.setDisabled(true);
            });
        }
    },
    /**
     * @param {Ext.button.Button} button
     * @param {Event} e
     * @param {Object} eOpts
     */
    onSaveBtnClick: function (button, e, eOpts) {
        var me = this,
            form = me.getView(),
            vm = form.getViewModel();
        var successCb = function (record) {
            me.disableSaveButtons(form, false);
            me.saveLocales(vm, record);
        };

        var errorCb = function () {
            me.disableSaveButtons(form, false);
        };

        this.save(form, successCb, errorCb);
    },
    onEditMetadataClickBtn: function (event, buttonEl, eOpts) {
        var title = CMDBuildUI.locales.Locales.administration.emails.editvalues;
        var metadata = this.getViewModel().get('theAttribute').get('metadata');
        var _metadata = {};

        for (var key in metadata) {
            if (!Ext.String.startsWith(key, 'cm_')) {
                _metadata[key] = metadata[key];
            }
        }
        var config = {
            xtype: 'administration-components-keyvaluegrid-grid',
            viewModel: {
                data: {
                    theKeyvaluedata: _metadata,
                    theOwnerObject: this.getViewModel().get('theAttribute'),
                    theOwnerObjectKey: 'metadata',
                    actions: {
                        view: this.getViewModel().get('actions.view')
                    }
                }
            }

        };

        CMDBuildUI.util.Utilities.openPopup('popup-add-attachmentfromdms-panel', title, config, null, {
            ui: 'administration-actionpanel'
        });
    },
    /**
     * @param {Ext.button.Button} button
     * @param {Event} e
     * @param {Object} eOpts
     */
    onSaveAndAddBtnClick: function (button, e, eOpts) {

        var me = this,
            vm = button.lookupViewModel(),
            eventToCall = vm.get('actions.edit') ? 'attributeupdated' : 'attributecreated';
        var objectTypeName = vm.get('objectTypeName'),
            objectType = vm.get('objectType'),
            grid = vm.get('grid'),
            attributes = vm.get('attributes');
        var successCb = function (record) {
            Ext.GlobalEvents.fireEventArgs(eventToCall, [me.getView(), record]);
            me.saveLocales(vm, record, true);
            var container = Ext.getCmp(CMDBuildUI.view.administration.DetailsWindow.elementId) || Ext.create(CMDBuildUI.view.administration.DetailsWindow);

            var viewModel = {
                data: {
                    objectTypeName: objectTypeName,
                    objectType: objectType,
                    attributes: attributes,
                    grid: grid,
                    action: CMDBuildUI.util.administration.helper.FormHelper.formActions.add
                }
            };

            container.removeAll();
            container.add({
                xtype: 'administration-components-attributes-actionscontainers-create',
                viewModel: viewModel
            });
        };

        var errorCb = function () {
            me.disableSaveButtons(button.up('form'), false);
        };
        me.save(button.up('form'), successCb, errorCb);
    },

    /**
     * @param {Ext.button.Button} button
     * @param {Event} e
     * @param {Object} eOpts
     */
    onCancelBtnClick: function (button, e, eOpts) {
        this.getViewModel().get("theAttribute").reject();
        this.getView().up().fireEvent("closed");
    },

    /**
     * On translate button click
     * @param {Event} e
     * @param {Ext.button.Button} button
     * @param {Object} eOpts
     */
    onTranslateClick: function (e, button, eOpts) {
        var vm = this.getViewModel();
        var localeObjectTypeName;
        switch (vm.get('objectType').toLowerCase()) {
            case CMDBuildUI.util.helper.ModelHelper.objecttypes.klass:
            case CMDBuildUI.util.helper.ModelHelper.objecttypes.process:
            case CMDBuildUI.util.helper.ModelHelper.objecttypes.dmsmodel:
                localeObjectTypeName = 'attributeclass';
                break;
            case CMDBuildUI.util.helper.ModelHelper.objecttypes.domain:
                localeObjectTypeName = 'attributedomain';
                break;
        }
        var translationCode = Ext.String.format('{0}.{1}.{2}.description', localeObjectTypeName, vm.get('objectTypeName'), vm.get('actions.edit') ? vm.get('attributeName') : '.');
        CMDBuildUI.util.administration.helper.FormHelper.openLocalizationPopup(translationCode, vm.get('action'), 'theTranslation', vm);
    },

    /**
     * On translate masterdetail button click
     * @param {Ext.button.Button} button
     * @param {Event} event
     * @param {Object} eOpts
     */
    onTranslateClickMasterDetail: function (event, button, eOpts) {
        var vm = this.getViewModel();
        var translationCode = CMDBuildUI.util.administration.helper.LocalizationHelper.getLocaleKeyOfAttributeFkMasterDetail(vm.get('objectTypeName'), vm.get('actions.edit') ? vm.get('attributeName') : '.');
        CMDBuildUI.util.administration.helper.FormHelper.openLocalizationPopup(translationCode, vm.get('action'), 'theMasterDetailTranslation', vm);
    },
    // toolbar actions

    onOpenBtnClick: function () {
        var view = this.getView();
        var vm = view.getViewModel();
        var container = Ext.getCmp(CMDBuildUI.view.administration.DetailsWindow.elementId) || Ext.create(CMDBuildUI.view.administration.DetailsWindow);
        container.removeAll();
        container.add({
            xtype: 'administration-components-attributes-actionscontainers-view',
            viewModel: {
                data: {
                    theAttribute: vm.get('theAttribute'),
                    objectTypeName: vm.get('objectTypeName'),
                    objectType: vm.get('objectType'),
                    attributeName: vm.get('theAttribute').get('name'),
                    attributes: vm.get('allAttributes').getRange(),
                    grid: vm.get('grid'),
                    action: CMDBuildUI.util.administration.helper.FormHelper.formActions.view
                }
            }
        });
    },


    onEditBtnClick: function () {
        var view = this.getView();
        var vm = view.getViewModel();
        var viewConfig = {
            xtype: 'administration-components-attributes-actionscontainers-edit',
            viewModel: {
                data: {
                    objectTypeName: vm.get('objectTypeName'),
                    attributeName: vm.get('attributeName'),
                    attributes: vm.get('attributes'),
                    title: vm.get('title'),
                    grid: vm.get('grid'),
                    theAttribute: vm.get('theAttribute'),
                    objectType: vm.get('objectType'),
                    action: CMDBuildUI.util.administration.helper.FormHelper.formActions.edit
                }
            }
        };
        var container = Ext.getCmp(CMDBuildUI.view.administration.DetailsWindow.elementId) || Ext.create(CMDBuildUI.view.administration.DetailsWindow);
        container.removeAll();

        container.add(viewConfig);
    },

    onDeleteBtnClick: function () {
        var me = this;
        var vm = me.getViewModel();

        Ext.Msg.confirm(
            CMDBuildUI.locales.Locales.administration.common.messages.attention,
            CMDBuildUI.locales.Locales.administration.common.messages.areyousuredeleteitem,
            function (btnText) {
                if (btnText.toLowerCase() === 'yes') {
                    CMDBuildUI.util.Ajax.setActionId('delete-attribute');
                    CMDBuildUI.util.Utilities.showLoader(true);
                    vm.get('theAttribute').getProxy().type = 'baseproxy';
                    if (vm.get('pluralObjectType') === 'dmsmodels') {
                        vm.get('theAttribute').getProxy().setUrl(
                            Ext.String.format(
                                '/dms/models/{0}/attributes',
                                vm.get('objectTypeName')
                            )
                        );
                    } else {
                        vm.get('theAttribute').getProxy().setUrl(
                            Ext.String.format(
                                '/{0}/{1}/attributes',
                                vm.get('pluralObjectType'),
                                vm.get('objectTypeName')
                            )
                        );
                    }

                    vm.get('theAttribute').erase({
                        success: function (record, operation) {
                            CMDBuildUI.util.Utilities.showLoader(false);
                            CMDBuildUI.util.Navigation.removeAdministrationDetailsWindow();
                        },
                        failure: function () {
                            CMDBuildUI.util.Utilities.showLoader(false);
                            vm.get('theAttribute').reject();
                            Ext.GlobalEvents.fireEventArgs("attributeupdated", [me.getView(), vm.get('theAttribute')]);
                        }
                    });
                }
            }, this);
    },

    onCloneBtnClick: function (button, event, eOpts) {
        var vm = button.lookupViewModel();
        var theAttribute = Ext.copy(vm.get('theAttribute').clone());
        var container = Ext.getCmp(CMDBuildUI.view.administration.DetailsWindow.elementId) || Ext.create(CMDBuildUI.view.administration.DetailsWindow);

        var viewModel = {
            data: {
                theAttribute: theAttribute,
                objectTypeName: vm.get('objectTypeName'),
                objectType: vm.get('objectType'),
                attributeName: vm.get('theAttribute').get('name'),
                attributes: vm.get('attributes'),
                grid: vm.get('grid'),
                action: CMDBuildUI.util.administration.helper.FormHelper.formActions.add
            }
        };

        container.removeAll();
        container.add({
            xtype: 'administration-components-attributes-actionscontainers-create',
            viewModel: viewModel
        });
    },
    /**
     * @param {Ext.button.Button} button
     * @param {Event} e
     * @param {Object} eOpts
     */
    onToggleActiveBtnClick: function (button, e, eOpts) {
        var view = this.getView();
        var vm = view.getViewModel();
        var theAttribute = vm.get('theAttribute');
        Ext.apply(theAttribute.data, theAttribute.getAssociatedData());
        var value = !theAttribute.get('active');
        CMDBuildUI.util.Ajax.setActionId('toggle-active-attribute');
        theAttribute.set('active', value);
        theAttribute.model = Ext.ClassManager.get('CMDBuildUI.model.Attribute');
        var url;
        if (vm.get('pluralObjectType') === 'dmsmodels') {
            url = Ext.String.format(
                '/dms/models/{0}/attributes',
                vm.get('objectTypeName')
            );
        } else {
            url = Ext.String.format(
                '/{0}/{1}/attributes',
                vm.get('pluralObjectType'),
                vm.get('objectTypeName')
            );

        }

        theAttribute.model.setProxy({
            type: 'baseproxy',
            url: url
        });

        theAttribute.save({
            success: function (record, operation) {
                var valueString = record.get('active') ? CMDBuildUI.locales.Locales.administration.common.messages.enabled : CMDBuildUI.locales.Locales.administration.common.messages.disabled;
                CMDBuildUI.util.Notifier.showSuccessMessage(Ext.String.format('{0} {1} {2}.',
                    record.get('name'),
                    CMDBuildUI.locales.Locales.administration.common.messages.was,
                    valueString), null, 'administration');
                Ext.GlobalEvents.fireEventArgs("attributeupdated", [view, record]);
            }
        });
    },

    attributeModeValidation: function (input, newValue, oldValue) {
        var form = input.up('form');
        var attributeMode = form.down('#attributeMode');
        var attributeShowInGrid = form.down('#attributeShowInGrid');
        var attributeShowInReducedGrid = form.down('#attributeShowInReducedGrid');
        var attributeMandatory = form.down('#attributeMandatory');
        var wasInvalid = attributeMode.activeErrors && attributeMode.activeErrors.length;
        var errors = [];

        if (input === attributeMode) {
            attributeMode = input;
        }
        attributeMode.clearInvalid();
        if (attributeMode.getValue() === 'hidden' || (input === attributeMode && newValue === 'hidden')) {
            if (form.getViewModel().get('objectType') !== 'dmsmodel') {
                if (attributeShowInGrid.getValue()) {
                    errors.push(CMDBuildUI.locales.Locales.administration.attributes.strings.thefieldshowingridcantbechecked);
                }
                if (attributeShowInReducedGrid.getValue()) {
                    errors.push(CMDBuildUI.locales.Locales.administration.attributes.strings.thefieldshowinreducedgridcantbechecked);
                }
            }
            if (attributeMandatory.getValue()) {
                errors.push(CMDBuildUI.locales.Locales.administration.attributes.strings.thefieldmandatorycantbechecked);
            }
        }
        if (errors.length) {
            attributeMode.markInvalid(errors);

        } else {
            attributeMode.clearInvalid();
        }
        if (wasInvalid || errors.length) {
            form.isValid();
        }

    },

    onScheduleTriggerMenuClick: function (menuItem, e, eOpts) {
        var triggerId = menuItem.value;
        var config = {
            xtype: 'administration-content-schedules-ruledefinitions-card',
            viewModel: {
                data: {
                    action: menuItem.action,
                    actions: {
                        add: menuItem.action === CMDBuildUI.util.administration.helper.FormHelper.formActions.add,
                        edit: menuItem.action === CMDBuildUI.util.administration.helper.FormHelper.formActions.edit,
                        view: menuItem.action === CMDBuildUI.util.administration.helper.FormHelper.formActions.view
                    },
                    showInPopup: true
                },
                links: {
                    theSchedule: {
                        type: 'CMDBuildUI.model.calendar.Trigger',
                        id: triggerId
                    }
                }
            },
            ui: 'administration',
            source: menuItem,
            shownInPopup: true,
            tabpaneltools: []
        };

        CMDBuildUI.util.Utilities.openPopup(null, 'Schedule', config, {}, {
            ui: 'administration'
        });


    },
    privates: {
        currenObject: null,
        disableSaveButtons: function (form, value) {
            if (form.down('#saveAndAddBtn')) {
                form.down('#saveAndAddBtn').setDisabled(value);
            }
            if (form.down('#saveBtn')) {
                form.down('#saveBtn').setDisabled(value);
            }
        },
        linkAttribute: function (view, vm) {

            var pluralObjectType;
            switch (vm.get('objectType')) {
                case 'Class':
                    pluralObjectType = 'classes';
                    break;
                case 'Process':
                    pluralObjectType = 'processes';
                    break;
                case 'Domain':
                    pluralObjectType = 'domains';
                    break;
                case 'dmsmodel':
                    pluralObjectType = 'dms/models';
                    break;
            }

            Ext.ClassManager.get('CMDBuildUI.model.Attribute').setProxy({
                type: 'baseproxy',
                url: Ext.String.format('/{0}/{1}/attributes/', pluralObjectType, vm.get('objectTypeName'))
            });

            if (!vm.get('theAttribute') || !vm.get('theAttribute').phantom) {
                if (vm.get('theAttribute')) {
                    vm.linkTo("theAttribute", {
                        type: 'CMDBuildUI.model.Attribute',
                        id: vm.get('theAttribute.name')
                    });
                } else {
                    vm.linkTo("theAttribute", {
                        type: 'CMDBuildUI.model.Attribute',
                        create: true
                    });
                }
            }
        },
        save: function (form, successCb, errorCb) {
            var me = this;
            var vm = form.getViewModel();

            me.disableSaveButtons(form, true);
            CMDBuildUI.util.Utilities.showLoader(true);
            var theAttribute = vm.getData().theAttribute;
            if (vm.get('pluralObjectType') !== 'domains' && !this.currentObject.get('_can_modify')) {
                successCb(theAttribute);
                return;
            }
            if (form.isValid()) {
                if (vm.get('pluralObjectType') === 'dmsmodels') {
                    theAttribute.getProxy().setUrl(
                        Ext.String.format(
                            '/dms/models/{0}/attributes',
                            vm.get('objectTypeName')
                        )
                    );
                } else {
                    theAttribute.getProxy().setUrl(
                        Ext.String.format(
                            '/{0}/{1}/attributes',
                            vm.get('pluralObjectType'),
                            vm.get('objectTypeName')
                        )
                    );
                }
                delete theAttribute.data.inherited;
                delete theAttribute.data.writable;
                delete theAttribute.data.hidden;

                theAttribute.save({
                    success: function (record, operation) {
                        successCb(record);
                        CMDBuildUI.util.Utilities.showLoader(false);
                    },
                    failure: function (reason) {
                        errorCb();
                        CMDBuildUI.util.Utilities.showLoader(false);
                    }
                });
            } else {
                errorCb();
                CMDBuildUI.util.Utilities.showLoader(false);
            }
        },
        saveLocales: function (vm, record, noCloseDetailWindow) {
            var me = this;
            var eventToCall = vm.get('actions.edit') ? 'attributeupdated' : 'attributecreated';
            if (vm.get('actions.add')) {
                var translations = [
                    'theTranslation',
                    'theMasterDetailTranslation'
                ];
                if (!vm.get(translations[0]) && !vm.get(translations[1])) {
                    Ext.GlobalEvents.fireEventArgs(eventToCall, [me.getView(), record]);
                    CMDBuildUI.util.Navigation.removeAdministrationDetailsWindow();
                    return;
                }
                var successes = 0,
                    translationCont = 0;
                Ext.Array.forEach(translations, function (item, index) {
                    if (vm.get(item)) {
                        translationCont++;
                        var translationCode;
                        if (item === 'theTranslation') {
                            var localeObjectTypeName;                            
                            switch (vm.get('objectType')) {
                                case 'Class':
                                case 'Process':
                                case 'dmsmodel':
                                    localeObjectTypeName = 'attributeclass';
                                    break;
                                case 'Domain':
                                    localeObjectTypeName = 'attributedomain';
                                    break;
                            }
                            translationCode = Ext.String.format('{0}.{1}.{2}.description', localeObjectTypeName, vm.get('objectTypeName'), record.get('name'));
                        } else {
                            translationCode = CMDBuildUI.util.administration.helper.LocalizationHelper.getLocaleKeyOfAttributeFkMasterDetail(vm.get('objectTypeName'), record.get('name'));
                        }

                        vm.get(item).crudState = 'U';
                        vm.get(item).crudStateWas = 'U';
                        vm.get(item).phantom = false;
                        vm.get(item).set('_id', translationCode);
                        vm.get(item).save({
                            success: function (translation, operation) {
                                successes++;
                                if (successes <= translationCont) {
                                    Ext.GlobalEvents.fireEventArgs(eventToCall, [me.getView(), record]);
                                    if (!noCloseDetailWindow) {
                                        CMDBuildUI.util.Navigation.removeAdministrationDetailsWindow();
                                    }
                                }
                                CMDBuildUI.util.Logger.log(item + " localization was saved", CMDBuildUI.util.Logger.levels.debug);
                            }
                        });
                    }
                });
            } else {
                Ext.GlobalEvents.fireEventArgs(eventToCall, [me.getView(), record]);
                CMDBuildUI.util.Navigation.removeAdministrationDetailsWindow();
            }
        }
    },

    onAttributeDomainChange: function (combobox, newValue, oldValue) {
        var vm = this.getViewModel();
        var store = vm.getStore('domainsStore');
        if (store && newValue) {
            var record = store.getById(newValue);
            if (record) {
                var directionCombo = combobox.up('form').down('#domaindirection');

                switch (record.get('cardinality')) {
                    case '1:N':
                        directionCombo.setHidden(true);
                        record.set('direction', 'inverse');
                        directionCombo.setValue('inverse');
                        break;
                    case 'N:1':
                        directionCombo.setHidden(true);
                        record.set('direction', 'direct');
                        directionCombo.setValue('direct');
                        break;
                    case '1:1':
                        directionCombo.setHidden(false);
                        break;
                    case 'N:N':
                        // TODO: currently not supported
                        break;
                    default:
                        break;
                }
            }
        }
    }
});