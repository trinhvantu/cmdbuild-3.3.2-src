Ext.define('CMDBuildUI.view.administration.content.bimnavigationtrees.ViewModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.administration-content-bimnavigationtrees-view',

    data: {
        actions: {
            view: false,
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
            bind: {
                canModify: '{theSession.rolePrivileges.admin_bim_modify}'
            },
            get: function (data) {
                this.set('toolAction._canAdd', data.canModify === true);
                this.set('toolAction._canUpdate', data.canModify === true);
                this.set('toolAction._canDelete', data.canModify === true);
                this.set('toolAction._canActiveToggle', data.canModify === true);
            }
        },
       
        dataManager: {
            bind: {
                theNavigationtree:'{theNavigationtree}',
                targetClass: '{theNavigationtree.targetClass}'
            },
            get: function (data) {
                if (!data.targetClass && data.theNavigationtree.get('nodes') && data.theNavigationtree.get('nodes').length) {
                    data.theNavigationtree.set('targetClass', data.theNavigationtree.get('nodes')[0].targetClass);
                } else {
                    data.theNavigationtree.set('targetClass', data.targetClass);
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
        }
    },

    /**
     * Change form mode
     * 
     * @param {String} mode
     */
    setFormMode: function (mode) {
        var me = this;
        switch (mode) {
            case CMDBuildUI.util.administration.helper.FormHelper.formActions.view:
                me.set('actions.view', true);
                me.set('actions.edit', false);
                me.set('actions.add', false);
                break;
            case CMDBuildUI.util.administration.helper.FormHelper.formActions.add:
                me.set('actions.view', false);
                me.set('actions.edit', false);
                me.set('actions.add', true);
                break;
            case CMDBuildUI.util.administration.helper.FormHelper.formActions.edit:
                me.set('actions.view', false);
                me.set('actions.edit', true);
                me.set('actions.add', false);
                break;

        }
    }
});