Ext.define('CMDBuildUI.view.administration.localization.LocalizeContentController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.administration-localization-localizecontent',

    control: {
        '#': {
            beforerender: 'onBeforeRender'
        }
    },
    /**
     * @param {CMDBuildUI.view.administration.localization.LocalizeContent} view
     * @param {Object} eOpts
     */
    onBeforeRender: function (view, eOpts) {

        var vm = view.getViewModel();
        var action = vm.get('action');
        var linkOption = {
            type: 'CMDBuildUI.model.Translation'
        };
        if (!vm.get(view.getTheVmObject())) {
            if (vm.get('translationCode').indexOf('..') !== -1) {
                linkOption.create = true;
            } else {
                linkOption.id = vm.get('translationCode');
            }
            vm.linkTo(view.getTheVmObject(), linkOption);
        }
        var languagesStore = vm.getStore('languagesStore');
        var localizationStore = vm.getStore('localizationStore');
        var languages = [];

        function generateLocaleInput(language, locale) {
            var fieldContainer = {
                xtype: (action !== CMDBuildUI.util.administration.helper.FormHelper.formActions.view) ? 'textfield' : 'displayfield',
                margin: '0 0 10 0',
                fieldLabel: language.get('description'),
                beforeLabelTpl: '<img width="20px" src="resources/images/flags/' + language.get('code') + '.png" alt="' + language.get('code') + ' flag"></img>',
                style: {
                    tableLayout: 'unset',
                    width: '100%'
                },
                bind: {
                    value: '{' + view.getTheVmObject() + '.' + language.get('code') + '}'
                }
            };
            return fieldContainer;
        }
        localizationStore.getProxy().setUrl('/translations/' + vm.get('translationCode'));
        function createInputList(records, localization) {
            for (var i = 0; i < records.length; i++) {
                var lang = records[i];
                var translation;
                if (localization && !localization.get(lang.get('code'))) {
                    localization.set(lang.get('code'), '');
                    vm.set('localization', localization);
                    translation = localization.get(lang.get('code')) || '';
                }
                languages.push(generateLocaleInput(lang, translation || ''));
            }
            view.add({
                margin: '10px',
                items: languages
            });
            if (view.getForm().getFields().items.length) {
                view.getForm().getFields().items[0].focus();
            }
        }
        languagesStore.load(function (records, operation, success) {
            if (success) {
                if (vm.get('translationCode').indexOf('..') !== -1) {
                    createInputList(records);
                } else {
                    localizationStore.load(function (localization, operation, success) {
                        localization = localization[0];
                        createInputList(records, localization);
                    });
                }
            }
        });
    },

    /**
     *             
     */
    onCancelBtnClick: function () {
        this.getView().up().fireEvent('close');

    },

    /**
     * onSaveBtnClick
     */
    onSaveBtnClick: function () {
        var me = this;
        var vm = me.getViewModel();
        if (vm.get(me.getView().getTheVmObject()).crudStateWas == 'U' && !vm.get('denyAutosave')) {
            vm.get(me.getView().getTheVmObject()).save({
                success: function (record, operation) {
                    me.onCancelBtnClick();
                }
            });
        } else {
            me.getView().up().fireEventArgs('setlocalesstore', [vm.get(me.getView().getTheVmObject())]);

        }
    }
});