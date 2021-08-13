Ext.define('CMDBuildUI.view.fields.password.Password', {
    extend: 'Ext.form.field.Text',

    statics: {
        newPassword: 'new-password',
        currentPassword: 'current-password',
        username: 'username'
    },
    alias: 'widget.passwordfield',

    config: {
        /**
         * @cfg {Boolean} autocomplete
         * autocomplete allowed or not
         */
        autocomplete: 'new-password'
    },
    inputType: 'password',
    triggers: {
        showPassword: {
            cls: 'x-fa fa-eye',
            hideTrigger: true,
            scope: this,
            handler: function (field, button, e) {
                field.inputEl.el.set({
                    type: 'text'
                });
                field.getTrigger('showPassword').setVisible(false);
                field.getTrigger('hidePassword').setVisible(true);
            }
        },
        hidePassword: {
            cls: 'x-fa fa-eye-slash',
            hidden: true,
            scope: this,
            handler: function (field, button, e) {
                field.inputEl.el.set({
                    type: 'password'
                });
                field.getTrigger('showPassword').setVisible(true);
                field.getTrigger('hidePassword').setVisible(false);
            }
        }
    },
    listeners: {
        afterrender: function (cmp) {
            if (cmp.getAutocomplete()) {
                cmp.inputEl.set({
                    autocomplete: this.getAutocomplete()
                });
            }
        },
        change: function (input, newValue, oldValue) {
            if (input.inputEl.el.dom.type === 'password') {
                var condition = newValue.search("•") > -1;
                input.getTrigger('showPassword').setVisible(!condition);
            }
        }
    }
});