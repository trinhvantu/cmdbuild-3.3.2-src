Ext.define('CMDBuildUI.view.administration.content.customcomponents.ViewController', {
    extend: 'Ext.app.ViewController',
    requires: ['CMDBuildUI.util.administration.File'],
    alias: 'controller.administration-content-customcomponents-view',

    control: {
        '#': {
            beforerender: 'onBeforeRender'
        },
        '#searchtext': {
            beforerender: 'onSearchTextBeforeRender'
        },
        '#saveBtn': {
            click: 'onSaveBtnClick'
        },
        '#cancelBtn': {
            click: 'onCancelBtnClick'
        },
        '#editBtn': {
            click: 'onEditBtnClick'
        },
        '#addBtn': {
            beforerender: 'onAddBtnBeforeRender',
            click: 'onAddBtnClick'
        },
        '#downloadBtn': {
            click: 'onDownloadBtnClick'
        },
        '#deleteBtn': {
            click: 'onDeleteBtnClick'
        },
        '#enableBtn': {
            click: 'onToggleActiveBtnClick'
        },
        '#disableBtn': {
            click: 'onToggleActiveBtnClick'
        }
    },

    /**
     * Before render
     * @param {CMDBuildUI.view.administration.content.customcomponents.View} view
     */
    onBeforeRender: function (view) {
        var vm = this.getViewModel();
        var subtitle;
        switch (vm.get('componentType')) {
            case 'contextmenu':
                subtitle = CMDBuildUI.locales.Locales.administration.classes.properties.form.fieldsets.contextMenus.title;
                break;
            case 'widget':
                subtitle = CMDBuildUI.locales.Locales.administration.classes.properties.form.fieldsets.formWidgets;
                break;
            default:
                break;
        }
        vm.bind({
            bindTo: '{theCustomcomponent.device}'
        }, function (device) {
            var title = Ext.String.format('{0} - {1} - {2}', CMDBuildUI.locales.Locales.administration.customcomponents.plural, subtitle, CMDBuildUI.util.administration.helper.RendererHelper.getMenuTargetDevice(device));
            view.up('administration-content').getViewModel().set('title', title);
        });

        this.setFilefieldProperties();
    },
    /**
     * Before render search textfield
     * @param {Ext.form.field.Text} input
     */
    onSearchTextBeforeRender: function (input) {
        var vm = input.lookupViewModel();
        switch (vm.get('componentType')) {
            case 'contextmenu':
                vm.set('componentTypeName', CMDBuildUI.locales.Locales.administration.customcomponents.strings.contextmenu);
                input.setEmptyText(CMDBuildUI.locales.Locales.administration.customcomponents.strings.searchcontextmenus);
                break;
            case 'widget':
                vm.set('componentTypeName', CMDBuildUI.locales.Locales.administration.customcomponents.strings.widget);
                input.setEmptyText(CMDBuildUI.locales.Locales.administration.customcomponents.strings.searchwidgets);
                break;

            default:
                break;
        }
    },
    /**
     * Before render add button
     * @param {Ext.button.Button} button
     */
    onAddBtnBeforeRender: function (button) {
        var vm = button.lookupViewModel();
        switch (vm.get('componentType')) {
            case 'contextmenu':
                button.setText(CMDBuildUI.locales.Locales.administration.customcomponents.strings.addcontextmenu);
                break;
            case 'widget':
                button.setText(CMDBuildUI.locales.Locales.administration.customcomponents.strings.addwidget);
                break;
            default:
                break;
        }
    },
    /**
     * On add customcomponent button click
     * @param {Ext.button.Button} button
     * @param {Event} e
     * @param {Object} eOpts
     */
    onAddBtnClick: function (button, e, eOpts) {
        var vm = button.lookupViewModel();
        this.redirectTo(Ext.String.format('administration/customcomponents_empty/{0}/{1}/true', vm.get('componentType'), vm.get('theCustomcomponent.device')), true);
    },

    /**
     * On delete customcomponent button click
     * @param {Ext.button.Button} button
     * @param {Event} e
     * @param {Object} eOpts
     */
    onDeleteBtnClick: function (button, e, eOpts) {
        var me = this;
        var vm = me.getViewModel();
        Ext.Msg.confirm(
            CMDBuildUI.locales.Locales.administration.common.messages.attention,
            CMDBuildUI.locales.Locales.administration.common.messages.areyousuredeleteitem,
            function (btnText) {
                if (btnText === "yes") {
                    Ext.GlobalEvents.fireEventArgs("showadministrationcontentmask", [true]);

                    CMDBuildUI.util.Ajax.setActionId('delete-customcomponent');
                    me.getViewModel().get('theCustomcomponent').erase({
                        success: function (record, operation) {
                            var nextUrl = CMDBuildUI.util.administration.helper.ApiHelper.client.getCustomComponentUrl(vm.get('componentType'), record.get('device'));
                            CMDBuildUI.util.administration.MenuStoreBuilder.removeRecordBy('href', Ext.util.History.getToken(), nextUrl, me);
                        },
                        callback: function (record, reason) {
                            if (button.el.dom) {
                                button.setDisabled(false);
                            }
                            Ext.GlobalEvents.fireEventArgs("showadministrationcontentmask", [false]);
                        }
                    });
                }
            }, this);
    },

    /**
     * On download customcomponent button click
     * @param {Ext.button.Button} button
     * @param {Event} e
     * @param {Object} eOpts
     */
    onDownloadBtnClick: function (button, e, eOpts) {
        var vm = this.getView().getViewModel();
        var url = Ext.String.format(
            '{0}/components/{1}/{2}/file?extension=zip',
            CMDBuildUI.util.Config.baseUrl,
            vm.get('componentType'),
            vm.get('theCustomcomponent._id')
        );
        CMDBuildUI.util.File.download(url, 'zip');
    },

    /**
     * On edit customcomponent button click
     * @param {Ext.button.Button} button
     * @param {Event} e
     * @param {Object} eOpts
     */
    onEditBtnClick: function (button, e, eOpts) {
        var vm = this.getView().getViewModel();
        vm.set('action', CMDBuildUI.util.administration.helper.FormHelper.formActions.edit);
        this.setFilefieldProperties();
    },

    /**
     * On cancel button click
     * @param {Ext.button.Button} button
     * @param {Event} e
     * @param {Object} eOpts
     */
    onCancelBtnClick: function (button, e, eOpts) {
        var vm = this.getView().getViewModel();
        if (vm.get('actions.add')) {
            var nextUrl = Ext.String.format('administration/customcomponents_empty/{0}/false', vm.get('componentType'));
            this.redirectTo(nextUrl, true);
            var store = Ext.getStore('administration.MenuAdministration');
            var vmNavigation = Ext.getCmp('administrationNavigationTree').getViewModel();
            var currentNode = store.findNode("objecttype", CMDBuildUI.model.administration.MenuItem.types.customcomponent);
            vmNavigation.set('selected', currentNode);
        } else {
            vm.get('theCustomcomponent').reject();
            vm.set('action', CMDBuildUI.util.administration.helper.FormHelper.formActions.view);
        }
    },
    /**
     * @param {Ext.button.Button} button
     * @param {Event} e
     * @param {Object} eOpts
     */
    onToggleActiveBtnClick: function (button, e, eOpts) {
        var view = this.getView();
        var vm = view.getViewModel();
        var theCustomcomponent = vm.get('theCustomcomponent');
        theCustomcomponent.set('active', !theCustomcomponent.get('active'));
        this.save(vm);
    },

    /**
     * On save button click
     * @param {Ext.button.Button} button
     * @param {Event} e
     * @param {Object} eOpts
     */
    onSaveBtnClick: function (button, e, eOpts) {
        button.setDisabled(true);
        Ext.GlobalEvents.fireEventArgs("showadministrationcontentmask", [true]);
        var me = this;
        var form = this.getView().getForm();
        var vm = this.getView().getViewModel();

        if (form.isValid()) {
            var afterSave = function (record) {
                var nextUrl = CMDBuildUI.util.administration.helper.ApiHelper.client.getCustomComponentUrl(vm.get('componentType'), record.get('device'), record.get('_id'));
                if (vm.get('actions.edit')) {
                    var newDescription = record.get('description');
                    CMDBuildUI.util.administration.MenuStoreBuilder.changeRecordBy('href', nextUrl, newDescription, me);
                    CMDBuildUI.util.administration.MenuStoreBuilder.selectAndRedirectToRecordBy('href', nextUrl, me);
                    Ext.GlobalEvents.fireEventArgs("showadministrationcontentmask", [false]);
                } else {
                    CMDBuildUI.util.administration.MenuStoreBuilder.initialize(
                        function () {
                            CMDBuildUI.util.administration.MenuStoreBuilder.selectAndRedirectToRecordBy('href', nextUrl, me);
                            if (button.el && button.el.dom) {
                                button.setDisabled(false);
                            }
                            Ext.GlobalEvents.fireEventArgs("showadministrationcontentmask", [false]);
                        });
                }
            };
            me.save(vm,
                function (res) {
                    var record = res;
                    if (!record.isModel) {
                        record = CMDBuildUI.model.customcomponents.ContextMenu.create(record.data);
                    }

                    if (vm.get('theTranslation')) {
                        var key = CMDBuildUI.util.administration.helper.LocalizationHelper.getLocaleKeyOfCustomComponentDescription(record.get('_id'));
                        vm.get('theTranslation').crudState = 'U';
                        vm.get('theTranslation').crudStateWas = 'U';
                        vm.get('theTranslation').phantom = false;
                        vm.get('theTranslation').set('_id', key);
                        vm.get('theTranslation').save({
                            success: function (translation, operation) {
                                afterSave(record);
                            }
                        });
                    } else {
                        afterSave(record);
                    }

                },
                function (reason) {
                    button.setDisabled(false);
                    Ext.GlobalEvents.fireEventArgs("showadministrationcontentmask", [false]);
                }

            );
        } else {
            button.setDisabled(false);
            Ext.GlobalEvents.fireEventArgs("showadministrationcontentmask", [false]);
        }
    },
    /**
     * On translate button click
     * @param {Event} event
     * @param {Ext.button.Button} button
     * @param {Object} eOpts
     */
    onTranslateClick: function (event, button, eOpts) {
        var me = this;
        var vm = me.getViewModel();
        var translationCode = CMDBuildUI.util.administration.helper.LocalizationHelper.getLocaleKeyOfCustomComponentDescription(!isNaN(vm.get('theCustomcomponent').get('_id')) ? vm.get('theCustomcomponent').get('_id') : '..');
        CMDBuildUI.util.administration.helper.FormHelper.openLocalizationPopup(translationCode, vm.get('action'), 'theTranslation', vm);
    },

    /**
     * privates
     */
    privates: {
        /**
         * @private
         */
        setFilefieldProperties: function () {
            var view = this.getView();
            var vm = this.getViewModel();
            if (vm.get('actions.edit')) {
                CMDBuildUI.util.administration.helper.FieldsHelper.setAllowBlank(view.down('[name="fileCustomcomponent"]'), true, this.getView());
            } else if (vm.get('actions.add')) {
                CMDBuildUI.util.administration.helper.FieldsHelper.setAllowBlank(view.down('[name="fileCustomcomponent"]'), false, this.getView());
            }
        },
        /**
         * @private
         * @param {CMDBuildUI.view.administration.content.customcomponents.ViewModel} vm 
         * @param {Function} successCb 
         * @param {Function} errorCb 
         */
        save: function (vm, successCb, errorCb) {
            CMDBuildUI.util.Ajax.setActionId('customcomponent.upload');
            // define method
            var method = vm.get("actions.add") ? "POST" : "PUT";

            var input = this.getView().down('[name="fileCustomcomponent"]').extractFileInput();

            // init formData
            var formData = new FormData();

            // append attachment json data
            var jsonData = Ext.encode(vm.get("theCustomcomponent").getData());
            var fieldName = 'data';
            try {
                formData.append(fieldName, new Blob([jsonData], {
                    type: "application/json"
                }));
            } catch (err) {
                CMDBuildUI.util.Logger.log("Unable to create attachment Blob FormData entry with type 'application/json', fallback to 'text/plain': " + err, CMDBuildUI.util.Logger.levels.error);
                // metadata as 'text/plain' (format compatible with older webviews)
                formData.append(fieldName, jsonData);
            }

            // get url
            var custompageUrl = Ext.String.format('{0}/components/{1}', CMDBuildUI.util.Config.baseUrl, vm.get('componentType'));
            var url = vm.get('actions.add') ? custompageUrl : Ext.String.format('{0}/{1}', custompageUrl, vm.get('theCustomcomponent._id'));
            // upload 
            if (input.files.length) {
                CMDBuildUI.util.Ajax.initRequestException();
                CMDBuildUI.util.administration.File.upload(method, formData, input, url, {
                    success: function (response) {
                        if (typeof response === 'string') {
                            response = Ext.JSON.decode(response);
                        }
                        if (Ext.isFunction(successCb)) {
                            Ext.callback(successCb, null, [response]);
                        }
                    },
                    failure: function (error) {
                        if (typeof error === 'string') {
                            error = Ext.JSON.decode(error);
                        }
                        if (Ext.isFunction(errorCb)) {
                            Ext.callback(errorCb, null, [error]);
                        }
                    }
                });
            } else {
                // file is empty, use default put 
                vm.get('theCustomcomponent').save({
                    success: function (record, operation) {
                        if (Ext.isFunction(successCb)) {
                            Ext.callback(successCb, null, [record]);
                        }
                    },
                    failure: function (record, reason) {

                        if (Ext.isFunction(errorCb)) {
                            Ext.callback(errorCb, null, [reason]);
                        }

                    }
                });
            }

        }
    }
});