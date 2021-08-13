Ext.define('CMDBuildUI.view.administration.components.viewfilters.card.FormModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.administration-components-viewfilters-card-form',
    data: {
        actions: {
            view: true,
            edit: false,
            add: false
        },
        hideForm: false,
        toolAction: {
            _canAdd: false,
            _canUpdate: false,
            _canDelete: false,
            _canActiveToggle: false
        }
    },

    formulas: {
        toolsManager: {
            bind: '{theSession.rolePrivileges.admin_searchfilters_modify}',
            get: function (canModify) {
                this.set('toolAction._canAdd', canModify === true);
                this.set('toolAction._canUpdate', canModify === true);
                this.set('toolAction._canDelete', canModify === true);
                this.set('toolAction._canActiveToggle', canModify === true);
            }
        },
        action: {
            bind: {
                isView: '{actions.view}',
                isEdit: '{actions.edit}',
                isAdd: '{actions.add}'
            },
            get: function (data) {
                if (data.isView) {
                    this.set('formModeCls', 'formmode-view');
                    return CMDBuildUI.util.administration.helper.FormHelper.formActions.view;
                } else if (data.isEdit) {
                    this.set('formModeCls', 'formmode-edit');
                    return CMDBuildUI.util.administration.helper.FormHelper.formActions.edit;
                } else if (data.isAdd) {
                    this.set('formModeCls', 'formmode-add');
                    return CMDBuildUI.util.administration.helper.FormHelper.formActions.add;
                }
            },
            set: function (value) {
                this.set('actions.view', value === CMDBuildUI.util.administration.helper.FormHelper.formActions.view);
                this.set('actions.edit', value === CMDBuildUI.util.administration.helper.FormHelper.formActions.edit);
                this.set('actions.add', value === CMDBuildUI.util.administration.helper.FormHelper.formActions.add);
            }
        },
        removeFilterBtnDisabled: {
            bind: {
                isView: '{actions.view}',
                theViewFilter: '{theViewFilter}'
            },
            get: function (data) {
                if (data.isView || !data.theViewFilter.get('configuration')) {
                    return true;
                }
            }
        },

        formtoolbarHidden: {
            bind: {
                isView: '{actions.view}',
                isHiddenForm: '{hideForm}'
            },
            get: function (data) {
                if (data.isView && !data.isHiddenForm) {
                    return false;
                }
                return true;
            }
        },

        getRolesData: {
            bind: {
                store: '{allGroupsStore}',
                theViewFilter: '{theViewFilter}'
            },
            get: function (data) {
                var me = this;

                function makeGridData(defaultGroups) {
                    if (data.store && data.theViewFilter) {
                        data.store.source.load({
                            scope: this,
                            callback: function (records, operation, success) {
                                if (!me.destroyed) {
                                    me.setRolesData(data.store, data.theViewFilter, defaultGroups);
                                }
                            }
                        });
                    }
                }
                if (data.theViewFilter.get('name')) {
                    Ext.Ajax.request({
                        url: Ext.String.format(
                            '{0}/classes/_ANY/filters/{1}/defaultFor',
                            CMDBuildUI.util.Config.baseUrl,
                            data.theViewFilter.getId()
                        ),
                        method: 'GET',
                        success: function (response) {
                            if (!me.destroyed) {
                                var defaultGroups = Ext.JSON.decode(response.responseText).data;
                                makeGridData(defaultGroups);
                            }
                        }
                    });
                } else {
                    makeGridData([]);
                }



            }
        }
    },

    stores: {
        allGroupsStore: {
            type: 'chained',
            source: 'groups.Groups'
        },
        rolesStore: {
            data: '{rolesData}',
            autoDestroy: true
        }
    },

    setRolesData: function (store, theViewFilter, defaultGroups) {
        var me = this;
        var items = store.getData().items,
            roles = [];

        items.forEach(function (role) {
            var exist = Ext.Array.findBy(defaultGroups, function (userGroup) {
                return userGroup._id === role.get('_id');
            });
            roles.push(CMDBuildUI.model.users.UserGroup.create({
                description: role.get('description'),
                _id: role.get('_id'),
                name: role.get('name'),
                active: (exist) ? true : false
            }));
        });

        me.set('rolesData', roles);
        me.set('theViewFilter.groupsLength', roles.length);
    }

});