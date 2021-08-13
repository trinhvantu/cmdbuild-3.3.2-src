Ext.define('CMDBuildUI.view.filters.attributes.RowModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.filters-attributes-row',

    data: {
        showLabels: true,
        values: {
            attribute: null,
            operator: null,
            typeinput: null,
            currentGroup: null,
            currentUser: null,
            value1: null,
            value2: null
        },
        hiddenfields: {
            typeinput: true,
            value1: true,
            value2: true,
            currentGroup: true,
            currentUser: true
        },
        labels: {}
    },

    formulas: {
        updateProperties: {
            bind: {},
            get: function () {
                if (this.get('values.value1') === CMDBuildUI.model.users.User.myuser) {
                    this.set('values.currentUser', true);
                    this.set('values.value1', null);
                    this.set('hiddenfields.value1', true);
                }
                if (this.get('values.value1') === CMDBuildUI.model.users.Group.mygroup) {
                    this.set('values.currentGroup', true);
                    this.set('values.value1', null);
                    this.set('hiddenfields.value1', true);
                }

            }
        },

        updateLabels: {
            bind: {
                showLabels: '{showLabels}'
            },
            get: function (data) {
                if (data.showLabels) {
                    this.set("labels.operator", CMDBuildUI.locales.Locales.filters.operator);
                    this.set("labels.typeinput", CMDBuildUI.locales.Locales.filters.typeinput);
                    this.set("labels.value", CMDBuildUI.locales.Locales.filters.value);
                    this.set("labels.currentGroup", CMDBuildUI.locales.Locales.filters.currentgroup);
                    this.set("labels.currentUser", CMDBuildUI.locales.Locales.filters.currentuser);
                    this.set("labels.user", CMDBuildUI.locales.Locales.filters.user);
                    this.set("labels.group", CMDBuildUI.locales.Locales.filters.group);
                    this.set("labels.actions", "&nbsp;"); // insert empty label to align buttons with fields
                } else {
                    this.set("labels.operator", null);
                    this.set("labels.typeinput", null);
                    this.set("labels.value", null);
                    this.set("labels.currentGroup", null);
                    this.set("labels.currentUser", null);
                    this.set("labels.user", null);
                    this.set("labels.group", null);
                    this.set("labels.actions", null);
                }
            }
        },

        operatorsFilter: {
            bind: {
                attribute: '{values.attribute}'
            },
            get: function (data) {
                if (data.attribute) {
                    var attribute = this.get("allfields")[data.attribute];
                    if (attribute) {
                        return [{
                            property: 'availablefor',
                            filterFn: function (item) {
                                return item.get("availablefor").indexOf(attribute.cmdbuildtype) !== -1;
                            }
                        }];
                    }
                }
            }
        }
    },

    stores: {
        operators: {
            source: '{operatorslist}',
            filters: '{operatorsFilter}'
        }
    }
});