Ext.define('CMDBuildUI.view.filters.attributes.RowController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.filters-attributes-row',

    control: {
        '#': {
            beforerender: 'onBeforeRender'
        },
        '#operatorcombo': {
            change: 'onOperatorComboChange'
        },
        '#typecheck': {
            change: 'onTypeCkeckChange'
        },
        '#currentUser': {
            change: 'onCurrentUserCheckChange'
        },
        '#currentGroup': {
            change: 'onCurrentGroupCheckChange'
        },
        '#removebutton': {
            beforerender: 'onRemoveButtonBeforeRender'
            // click event is managed on parent panel
        }
    },

    onBeforeRender: function (view, eOpts) {
        // add values fields
        this.addValuesFields(view.lookupViewModel().get("values.attribute"));
    },

    /**
     * Executed when changes the value of Operator combobox.
     * 
     * @param {Ext.form.field.ComboBox} combo 
     * @param {String} newValue 
     * @param {String} oldValue 
     * @param {Object} eOpts 
     */
    onOperatorComboChange: function (combo, newValue, oldValue, eOpts) {
        this.updateTypeFieldVisibility();
        this.updateCurrentUserVisibility();
        this.updateCurrentGroupVisibility();
        this.updateValue1FieldVisibility();
        this.updateValue2FieldVisibility();
    },

    /**
     * Executed when changes the value of Operator combobox.
     * 
     * @param {Ext.form.field.Checkbox} check 
     * @param {Boolean} newValue 
     * @param {Boolean} oldValue 
     * @param {Object} eOpts 
     */
    onTypeCkeckChange: function (check, newValue, oldValue, eOpts) {
        this.updateCurrentUserVisibility();
        this.updateCurrentGroupVisibility();
        this.updateValue1FieldVisibility();
        this.updateValue2FieldVisibility();
    },

    /**
     * Executed when changes the value current user checkbox.
     * 
     * @param {Ext.form.field.Checkbox} check 
     * @param {Boolean} newValue 
     * @param {Boolean} oldValue 
     * @param {Object} eOpts 
     */
    onCurrentUserCheckChange: function (check, newValue, oldValue, eOpts) {
        var vm = this.getViewModel();
        vm.set("values.value1", null);
        this.updateValue1FieldVisibility();
        this.updateValue2FieldVisibility();
    },

    /**
     * Executed when changes the value current group checkbox.
     * 
     * @param {Ext.form.field.Checkbox} check 
     * @param {Boolean} newValue 
     * @param {Boolean} oldValue 
     * @param {Object} eOpts 
     */
    onCurrentGroupCheckChange: function (check, newValue, oldValue, eOpts) {
        var vm = this.getViewModel();
        vm.set("values.value1", null);
        this.updateValue1FieldVisibility();
        this.updateValue2FieldVisibility();
    },

    /**
     * @param {Ext.button.Button} button 
     * @param {Object} eOpts 
     */
    onRemoveButtonBeforeRender: function (button, eOpts) {
        this.applyUiIfAdmin(button);
    },

    privates: {
        /**
         * Add a container with value fields.
         * @param {String} attributename 
         */
        addValuesFields: function (attributename) {
            var container = this.lookupReference('valuescontainer');
            var vm = this.getViewModel();
            // empty container
            container.removeAll(true);
            var allattributes = vm.get("allfields");
            if (attributename && allattributes[attributename]) {
                var attribute = allattributes[attributename];
                vm.set("attributetype", attribute.cmdbuildtype);

                if (attribute.type == 'date' && vm.get('values.value1')) {
                    vm.set('values.value1', new Date(vm.get('values.value1')));
                    if (vm.get('values.value2')) {
                        vm.set('values.value2', new Date(vm.get('values.value2')));
                    }
                }
                var editor;                
                switch (attribute.cmdbuildtype) {
                    case CMDBuildUI.util.helper.ModelHelper.cmdbuildtypes.reference:
                        if (this.getView().getAllowCurrentUser() && 'User' === attribute.attributeconf.targetClass) {

                            editor = {
                                xtype: 'bufferedcombo',
                                labelAlign: 'top',
                                valueField: '_id',
                                displayField: 'username',
                                columns: [{
                                    dataIndex: 'username',
                                    flex: 1
                                }],
                                name: 'userId',
                                storealias: 'users',
                                modelname: 'CMDBuildUI.model.users.User',
                                recordLinkName: 'values',
                                bind: {
                                    fieldLabel: '{labels.value}',
                                    hidden: '{hiddenfields.value1}',
                                    value: '{values.value1}',
                                    disabled: '{displayOnly}'
                                }
                            };
                        }
                        // show current user or current group
                        else if (this.getView().getAllowCurrentGroup() && 'Group' === attribute.attributeconf.targetClass) {
                            editor = {
                                xtype: 'bufferedcombo',
                                labelAlign: 'top',
                                valueField: '_id',
                                displayField: 'description',
                                columns: [{
                                    dataIndex: 'description',
                                    flex: 1
                                }],
                                name: 'groupId',
                                storealias: 'groups',
                                modelname: 'CMDBuildUI.model.users.Group',
                                recordLinkName: 'values',
                                bind: {
                                    fieldLabel: '{labels.value}',
                                    hidden: '{hiddenfields.value1}',
                                    value: '{values.value1}',
                                    disabled: '{displayOnly}'
                                }
                            };
                        }

                        if (editor) {
                            container.add(
                                editor
                            );
                        }

                        container.add({
                            xtype: 'textfield',
                            hidden: true,
                            bind: {
                                fieldLabel: '{labels.value}',
                                value: '{values.referencetext}',
                                hidden: '{hiddenfields.referencetext}',
                                disabled: '{displayOnly}'
                            }
                        });
                        break;
                        case CMDBuildUI.util.helper.ModelHelper.cmdbuildtypes.lookup:
                            container.add({
                                xtype: 'textfield',
                                hidden: true,
                                bind: {
                                    fieldLabel: '{labels.value}',
                                    value: '{values.referencetext}',
                                    hidden: '{hiddenfields.referencetext}',
                                    disabled: '{displayOnly}'
                                }
                            });
                            break;
                    case CMDBuildUI.util.helper.ModelHelper.cmdbuildtypes.tenant:
                        editor = CMDBuildUI.util.helper.FormHelper.getTenantField(CMDBuildUI.util.helper.FormHelper.formmodes.update);
                        container.add(
                            Ext.applyIf({
                                hidden: true,
                                bind: {
                                    fieldLabel: '{labels.value}',
                                    value: '{values.value1}',
                                    hidden: '{hiddenfields.value1}',
                                    disabled: '{displayOnly}'
                                }
                            }, editor)
                        );
                        break;
                }

                if (!editor) {
                    editor = CMDBuildUI.util.helper.FormHelper.getEditorForField(
                        attribute, {
                            ignoreUpdateVisibilityToField: true,
                            ignoreCustomValidator: true,
                            ignoreAutovalue: true
                        }
                    );

                    if (editor.xtype === "threestatecheckboxfield") {
                        editor.xtype = "checkboxfield";
                    }

                    editor.ignoreCqlFilter = true;
                    container.add([
                        Ext.apply({
                            hidden: true,
                            bind: {
                                fieldLabel: '{labels.value}',
                                value: '{values.value1}',
                                hidden: '{hiddenfields.value1}',
                                disabled: '{displayOnly}'
                            }
                        }, editor),
                        Ext.apply({
                            hidden: true,
                            bind: {
                                value: '{values.value2}',
                                hidden: '{hiddenfields.value2}',
                                disabled: '{displayOnly}'
                            }
                        }, editor)
                    ]);
                }
            }
        },

        /**
         * @param {Ext.button.Button} button 
         */
        applyUiIfAdmin: function (button) {
            var vm = button.lookupViewModel();
            if (vm && vm.get('isAdministrationModule')) {
                button.ui = 'administration-action';
            }
        },

        updateTypeFieldVisibility: function () {
            var vm = this.getViewModel();
            var isHidden = true;
            var allowInputParameter = this.getView().getAllowInputParameter();
            var operator = vm.get("values.operator");
            if (
                allowInputParameter &&
                operator &&
                operator !== CMDBuildUI.model.base.Filter.operators.null &&
                operator !== CMDBuildUI.model.base.Filter.operators.notnull
            ) {
                isHidden = false;
            }
            vm.set("hiddenfields.typeinput", isHidden);
        },

        updateCurrentUserVisibility: function () {
            var vm = this.getViewModel();
            var isHidden = true;
            var allowCurrentUser = this.getView().getAllowCurrentUser();
            var operator = vm.get("values.operator");
            var attribute = vm.get("values.attribute");
            var typeinput = vm.get("values.typeinput");
            if (
                attribute &&
                allowCurrentUser &&
                (operator === CMDBuildUI.model.base.Filter.operators.equal ||
                    operator === CMDBuildUI.model.base.Filter.operators.notequal) &&
                'User' === vm.get('allfields')[attribute].attributeconf.targetClass &&
                !typeinput
            ) {
                isHidden = false;
            }
            if (isHidden) {
                vm.set('values.currentUser', false);
            }
            vm.set("hiddenfields.currentUser", isHidden);
        },

        updateCurrentGroupVisibility: function () {
            var vm = this.getViewModel();
            var isHidden = true;
            var allowCurrentGroup = this.getView().getAllowCurrentGroup();
            var operator = vm.get("values.operator");
            var attribute = vm.get("values.attribute");
            var typeinput = vm.get("values.typeinput");
            if (
                attribute &&
                allowCurrentGroup &&
                (operator === CMDBuildUI.model.base.Filter.operators.equal ||
                    operator === CMDBuildUI.model.base.Filter.operators.notequal) &&
                'Role' === vm.get('allfields')[attribute].attributeconf.targetClass &&
                !typeinput
            ) {
                isHidden = false;
            }
            if (isHidden) {
                vm.set('values.currentGroup', false);
            }
            vm.set("hiddenfields.currentGroup", isHidden);
        },

        updateValue1FieldVisibility: function () {
            var vm = this.getViewModel();
            var isHidden = true,
                refTextFiledHidden = true;
            var operator = vm.get("values.operator");
            var typeinput = vm.get("values.typeinput");
            var currentGroup = vm.get("values.currentGroup");
            var currentUser = vm.get("values.currentUser");
            if (
                operator &&
                operator !== CMDBuildUI.model.base.Filter.operators.null &&
                operator !== CMDBuildUI.model.base.Filter.operators.notnull &&
                !typeinput && (!currentGroup && !currentUser)
            ) {
                isHidden = false;
            }

            if (
                [CMDBuildUI.util.helper.ModelHelper.cmdbuildtypes.reference, CMDBuildUI.util.helper.ModelHelper.cmdbuildtypes.lookup].indexOf(vm.get("attributetype")) > -1 &&
                CMDBuildUI.model.base.Filter.isOperatorForRefernceOrLookupDescription(operator)
            ) {
                refTextFiledHidden = isHidden;
                isHidden = true;
            }
            vm.set("hiddenfields.value1", isHidden);
            vm.set("hiddenfields.referencetext", refTextFiledHidden);
        },

        updateValue2FieldVisibility: function () {
            var vm = this.getViewModel();
            var isHidden = true;
            var operator = vm.get("values.operator");
            var typeinput = vm.get("values.typeinput");
            var currentGroup = vm.get("values.currentGroup");
            var currentUser = vm.get("values.currentUser");
            if (
                operator &&
                operator === CMDBuildUI.model.base.Filter.operators.between &&
                !typeinput && (!currentGroup && !currentUser)
            ) {
                isHidden = false;
            }
            vm.set("hiddenfields.value2", isHidden);
        }
    }
});