Ext.define('CMDBuildUI.view.filters.attributes.Row', {
    extend: 'Ext.form.FieldContainer',

    requires: [
        'CMDBuildUI.view.filters.attributes.RowController',
        'CMDBuildUI.view.filters.attributes.RowModel'
    ],

    alias: 'widget.filters-attributes-row',
    controller: 'filters-attributes-row',
    viewModel: {
        type: 'filters-attributes-row'
    },

    config: {
        /**
         * @cfg {Boolean} showLabels
         * When set to `false`, attribute field labels will be hide.
         */
        showLabels: true,

        /**
         * @cfg {Boolean} allowInputParameter
         */
        allowInputParameter: true,

        /**
         * @cfg {Boolean} allowCurrentUser
         */
        allowCurrentUser: false,

        /**
         * @cfg {Boolean} allowCurrentGroup
         */
        allowCurrentGroup: false

    },

    publishes: [
        'showLabels'
    ],

    twoWayBindable: [
        'showLabels'
    ],

    bind: {
        showLabels: '{showLabels}'
    },

    layout: 'hbox',
    padding: CMDBuildUI.util.helper.FormHelper.properties.padding,

    fieldDefaults: CMDBuildUI.util.helper.FormHelper.fieldDefaults,

    defaults: {
        margin: 'auto 10 auto auto',
        layout: 'anchor'
    },

    items: [{
        xtype: 'fieldcontainer',
        flex: 0.3,
        items: [{
            xtype: 'combobox',
            valueField: 'value',
            displayField: 'label',
            queryMode: 'local',
            forceSelection: true,
            reference: 'operatorcombo',
            itemId: 'operatorcombo',
            autoEl: {
                'data-testid': 'filters-attributes-row-operatorcombo'
            },
            bind: {
                fieldLabel: '{labels.operator}',
                store: '{operators}',
                value: '{values.operator}',
                disabled: '{displayOnly}'
            }
        }]
    }, {
        xtype: 'fieldcontainer',
        flex: 0.2,
        items: [{
            xtype: 'checkboxfield',
            hidden: true,
            reference: 'typecheck',
            itemId: 'typecheck',
            fieldLabel: CMDBuildUI.locales.Locales.filters.typeinput,
            autoEl: {
                'data-testid': 'filters-attributes-row-typecheck'
            },
            bind: {
                fieldLabel: '{labels.typeinput}',
                value: '{values.typeinput}',
                hidden: '{hiddenfields.typeinput}',                
                readOnly: '{displayOnly}'
            }
        }]
    }, {
        xtype: 'fieldcontainer',
        flex: 0.5,
        layout: {
            type: 'hbox',
            align: 'stretch'
        },
        items: [{
            xtype: 'checkboxfield',
            hidden: true,
            reference: 'currentUser',
            itemId: 'currentUser',
            margin: 'auto 10px auto auto',
            fieldLabel: CMDBuildUI.locales.Locales.filters.currentuser,
            autoEl: {
                'data-testid': 'filters-attributes-row-currentuser'
            },
            bind: {
                fieldLabel: '{labels.currentUser}',
                value: '{values.currentUser}',
                hidden: '{hiddenfields.currentUser}',
                readOnly: '{displayOnly}'
            }
        }, {
            xtype: 'checkboxfield',
            hidden: true,
            reference: 'currentGroup',
            itemId: 'currentGroup',
            margin: 'auto 10px auto auto',
            fieldLabel: CMDBuildUI.locales.Locales.filters.currentgroup,
            autoEl: {
                'data-testid': 'filters-attributes-row-currentgroup'
            },
            bind: {
                fieldLabel: '{labels.currentGroup}',
                value: '{values.currentGroup}',
                hidden: '{hiddenfields.currentGroup}',
                readOnly: '{displayOnly}'
            }
        }, {
            xtype: 'fieldcontainer',
            layout: 'anchor',
            reference: 'valuescontainer',
            itemId: 'valuescontainer',
            flex: 1,
            autoEl: {
                'data-testid': 'filters-attributes-row-values'
            }
        }]
    }, {
        xtype: 'fieldcontainer',
        reference: 'actionscontainer',
        itemId: 'actionscontainer',
        width: '100px',
        bind: {
            fieldLabel: '{labels.actions}'
        },
        items: [{
            xtype: 'button',
            iconCls: 'x-fa fa-trash-o',
            ui: 'management-action',
            reference: 'removebutton',
            itemId: 'removebutton',
            tooltip: CMDBuildUI.locales.Locales.common.actions.remove,
            autoEl: {
                'data-testid': 'filters-attributes-row-removebutton'
            },
            localized: {
                tooltip: 'CMDBuildUI.locales.Locales.common.actions.remove'
            },
            bind: {
                hidden: '{displayOnly}'
            }
        }]
    }],

    /**
     * @return {Object} An object with filter data.
     */
    getRowData: function () {
        var vm = this.getViewModel();
        var data = {
            attribute: vm.get("values.attribute"),
            operator: vm.get("values.operator"),
            parameterType: vm.get("values.typeinput") ? CMDBuildUI.model.base.Filter.parametersypes.runtime : CMDBuildUI.model.base.Filter.parametersypes.fixed,
            value: []
        };
        if (
            data.parameterType === CMDBuildUI.model.base.Filter.parametersypes.fixed &&
            data.operator !== CMDBuildUI.model.base.Filter.operators.null &&
            data.operator !== CMDBuildUI.model.base.Filter.operators.notnull
        ) {
            var type = vm.get('allfields')[data.attribute].cmdbuildtype;
            if (vm.get('values.currentGroup')) {
                data.value.push(CMDBuildUI.model.users.Group.mygroup);
            } else if (vm.get('values.currentUser')) {
                data.value.push(CMDBuildUI.model.users.User.myuser);
            } else if (CMDBuildUI.model.base.Filter.isOperatorForRefernceOrLookupDescription(data.operator)) {
                data.value.push(vm.get("values.referencetext"));
            } else if (vm.get('values.value1') == null && type == CMDBuildUI.util.helper.ModelHelper.cmdbuildtypes.boolean) {
                data.value.push(false);
            } else if (!Ext.isEmpty(vm.get('values.value1')) && type == CMDBuildUI.util.helper.ModelHelper.cmdbuildtypes.date) {
                data.value.push(Ext.Date.format(vm.get('values.value1'), "Y-m-d"));
            } else {
                data.value.push(vm.get("values.value1"));
            }
            // add value2 when operator is `between`
            if (data.operator === CMDBuildUI.model.base.Filter.operators.between) {
                data.value.push(vm.get("values.value2"));
            }
        }
        return data;
    }
});