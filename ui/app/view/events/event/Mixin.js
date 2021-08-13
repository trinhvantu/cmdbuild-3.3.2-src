Ext.define('CMDBuildUI.view.events.event.Mixin', {
    mixinId: 'view-events-event-mixin',

    config: {
        hideWidgets: false
    },

    addConditionalVisibilityRules: function () {
        var fields = [];
        this.getForm().getFields().getRange().forEach(function (f) {
            if (f.updateFieldVisibility !== undefined) {
                // add field to list
                fields.push(f);
            }
        });

        var reference = this.getReference();
        this.getViewModel().bind({
            bindTo: Ext.String.format('{{0}.theEvent}', reference),
            deep: true
        }, function (theSequence) {
            fields.forEach(function (f) {
                // apply visibility function
                Ext.callback(f.updateFieldVisibility, f, [theSequence]);
            });
        });

    },

    /**
     * 
     * @param {Object[]} items 
     * @return {Object}
     */
    getMainPanelForm: function (items) {
        var me = this;

        // create panel
        var panelitems = [{
            flex: 1,
            scrollable: 'y',
            items: [{
                items: items
            }]
        }];

        if (!this.getHideWidgets()) {
            panelitems.push({
                xtype: 'widgets-launchers',
                formMode: this.formmode,
                bind: {
                    widgets: '{' + this.xtype + '.theEvent.widgets}'
                }
            });
        }
        return {
            flex: 1,
            layout: {
                type: 'hbox',
                align: 'stretch' //stretch vertically to parent
            },
            height: "100%",
            items: panelitems
        };
    },

    /**
     * Add rules for fields visibility
     */
    addAutoValueRules: function () {
        var vm = this.lookupViewModel();
        this.getForm().getFields().getRange().forEach(function (f) {
            if (f.setValueFromAutoValue !== undefined) {
                vm.bind(f.getAutoValueBind(), function (data) {
                    f.setValueFromAutoValue();
                });
            }
        });
    },

    getUserGroupParticipantsFields: function () {
        if ((this.formmode == CMDBuildUI.util.helper.FormHelper.formmodes.read || undefined)
            || (this.formmode == CMDBuildUI.util.helper.FormHelper.formmodes.update && this.readonly == true)) {
            return this.getuserGroupParticipantsFieldsRead();
        } else {
            return this.getUserGroupParticipantsFieldsWrite();
        }
    },

    getuserGroupParticipantsFieldsRead: function () {

        var reference = this.getReference();

        return {
            xtype: 'container',
            layout: 'column',
            defaults: {
                columnWidth: 0.5,
                flex: 0.5,
                layout: "anchor",
                minHeight: 1,
                padding: "0 15 0 15",
                xtype: "fieldcontainer"
            },
            items: [{
                xtype: 'displayfield',
                hidden: false,
                fieldLabel: CMDBuildUI.locales.Locales.calendar.partecipantuser,
                localized: {
                    description: 'CMDBuildUI.locales.Locales.calendar.partecipantuser'
                },
                bind: {
                    value: Ext.String.format('{{0}.theEvent._participant_user_username}', reference)
                }
            }, {
                xtype: 'displayfield',
                hidden: false,
                fieldLabel: CMDBuildUI.locales.Locales.calendar.partecipantgroup,
                localized: {
                    description: 'CMDBuildUI.locales.Locales.calendar.partecipantgroup'
                },
                bind: {
                    value: Ext.String.format('{{0}.theEvent._participant_group_name}', reference)
                },
                reference: 'partecipantgroup',
                valueField: 'value',
                displayField: 'label',
                store: undefined
            }]
        }
    },

    getUserGroupParticipantsFieldsWrite: function () {
        var vm = this.lookupViewModel();
        var reference = this.getReference();

        // SET STORE USERS
        var bindStUser = Ext.String.format('{{0}.theEvent._participant_users}', reference);
        vm.bind(bindStUser, function (partecipantUser) {
            //set the store of the partecipant user;
            var cmp = this.lookupReference('partecipantuser');
            var theSession = CMDBuildUI.util.helper.SessionHelper.getCurrentSession();

            //get the current user
            var newData = [{
                label: theSession.get('userDescription'),
                value: theSession.get('userId')
            }];

            //get the user set by the administration
            if (partecipantUser && partecipantUser.length && partecipantUser[0]._id != theSession.get('userId')) {
                newData.push({
                    label: partecipantUser[0].username,
                    value: partecipantUser[0]._id
                })
            }

            //sets the stroe for the comboox
            cmp.setStore(Ext.create('Ext.data.Store', {
                model: 'CMDBuildUI.model.base.ComboItem',
                proxy: {
                    type: 'memory'
                },
                data: newData
            }));

        }, this);
        //SET STORE GROUP
        var bindStGroup = Ext.String.format('{{0}.theEvent._participant_groups}', reference);
        vm.bind(bindStGroup, function (partecipantGroup) {
            //set the store for groupuser;

            var cmp = this.lookupReference('partecipantgroup');
            var theSession = CMDBuildUI.util.helper.SessionHelper.getCurrentSession();
            var newData = [];

            //get all the available groups
            var availableGroups = theSession.get('availableRolesExtendedData');
            availableGroups.forEach(function (group) {
                newData.push({
                    label: group.description,
                    value: group._id
                });
            }, this);

            //adds the group from the administration module
            if (partecipantGroup && partecipantGroup.length) {
                var found = Ext.Array.findBy(newData, function (element, index) {
                    if (element.value == partecipantGroup[0]._id) return true;
                }, this);

                if (!found) {
                    newData.push({
                        label: partecipantGroup[0].name,
                        value: partecipantGroup[0]._id
                    })
                }
            }

            //sets the store in the combo
            cmp.setStore(Ext.create('Ext.data.Store', {
                model: 'CMDBuildUI.model.base.ComboItem',
                proxy: {
                    type: 'memory'
                },
                data: newData
            }));
        }, this);

        return {
            xtype: 'container',
            layout: 'column',
            defaults: {
                columnWidth: 0.5,
                flex: 0.5,
                layout: "anchor",
                minHeight: 1,
                padding: "0 15 0 15",
                xtype: "fieldcontainer"
            },
            items: [{
                xtype: 'combobox',
                hidden: false,
                fieldLabel: CMDBuildUI.locales.Locales.calendar.partecipantuser,
                localized: {
                    description: 'CMDBuildUI.locales.Locales.calendar.partecipantuser'
                },
                bind: {
                    value: Ext.String.format('{{0}.theEvent._participant_user_id}', reference)
                },
                reference: 'partecipantuser',
                valueField: 'value',
                displayField: 'label',
                store: undefined
            }, {
                xtype: 'combobox',
                hidden: false,
                fieldLabel: CMDBuildUI.locales.Locales.calendar.partecipantgroup,
                localized: {
                    description: 'CMDBuildUI.locales.Locales.calendar.partecipantgroup'
                },
                bind: {
                    value: Ext.String.format('{{0}.theEvent._participant_group_id}', reference)
                },
                reference: 'partecipantgroup',
                valueField: 'value',
                displayField: 'label',
                store: undefined
            }]
        };
    },

    getNotificationTemplateComboField: function () {
        if (this.formmode == CMDBuildUI.util.helper.FormHelper.formmodes.read || undefined
            || (this.formmode == CMDBuildUI.util.helper.FormHelper.formmodes.update && this.readonly == true)) {
            return this.getNotificationTemplateComboFieldRead();
        } else {
            return this.getNotificationTemplateComboFieldWrite();
        }
    },
    getNotificationTemplateComboFieldRead: function () {//FIXME:make a better function
        var reference = this.getReference();
        var baseBind = Ext.String.format('{0}.theEvent', reference);
        var notificationTemplateBind = '{' + baseBind + '._notification_template' + '}';

        var roField = CMDBuildUI.util.helper.FormHelper.getReadOnlyField(
            Ext.merge(
                this._getNotificationTemplateComboField(),
                {
                    cmdbuildtype: 'text',
                    attributeconf: {
                        editorType: null
                    },
                    disabled: true,
                    bind: {
                        hidden: '{hiddenField}'
                    },
                    viewModel: {
                        formulas: {
                            hiddenField: {
                                bind: {
                                    value: notificationTemplateBind
                                },
                                get: function (data) {
                                    return Ext.isEmpty(data.value);
                                }
                            }
                        }
                    }
                }
            ));
        return Ext.merge(
            this._getNotificationTemplateComboField(),
            roField
        );
    },
    getNotificationTemplateComboFieldWrite: function () {
        return this._getNotificationTemplateComboField();
    },
    _getNotificationTemplateComboField: function () {
        var reference = this.getReference();
        return {
            xtype: 'combobox',
            store: Ext.create('Ext.data.Store', {
                autoLoad: true,
                model: 'CMDBuildUI.model.emails.Template',
                proxy: {
                    type: 'baseproxy',
                    url: CMDBuildUI.util.api.Emails.getTemplatesUrl(),
                    extraParams: {
                        limit: 0
                    }

                }
            }),
            fieldLabel: CMDBuildUI.locales.Locales.calendar.notificationtemplate,
            hidden: false,
            displayField: 'description',
            valueField: 'name',
            bind: {
                value: Ext.String.format('{{0}.theEvent._notification_template}', reference)
            }
        };
    },

    /* NOTIFICATION CONTEN */
    getNotificationContentField: function () {
        if (this.formmode == CMDBuildUI.util.helper.FormHelper.formmodes.read || undefined || (this.formmode == CMDBuildUI.util.helper.FormHelper.formmodes.update && this.readonly == true)) {
            return this.getNotificationContentFieldRead();
        } else {
            return this.getNotificationContentFieldWrite();
        }
    },

    getNotificationContentFieldRead: function () {
        var field = this._getNotificationField();
        var roField = CMDBuildUI.util.helper.FormHelper.getReadOnlyField(field);
        return Ext.apply(field, roField);
    },

    getNotificationContentFieldWrite: function () {
        var field = this._getNotificationField();
        var editor = CMDBuildUI.util.helper.FormHelper.getEditorForField(field);
        return Ext.apply(field, editor);
    },

    _getNotificationField: function () {
        var reference = this.getReference();
        var baseBind = Ext.String.format('{0}.theEvent', reference);
        var notificationTemplateBind = '{' + baseBind + '._notification_template' + '}';

        return {
            attributeconf: {
                editorType: null
                // showIf: "return !Ext.isEmpty(api.getValue('_notification_template'))"
            },
            fieldLabel: CMDBuildUI.locales.Locales.calendar.notificationtext,
            localized: {
                description: 'CMDBuildUI.locales.Locales.calendar.notificationtext'
            },
            hidden: true,
            bind: {
                value: Ext.String.format('{{0}.theEvent._notification_content}', reference),
                hidden: '{hiddenField}'
            },
            cmdbuildtype: 'text',
            viewModel: {
                formulas: {
                    hiddenField: {
                        bind: {
                            value: notificationTemplateBind
                        },
                        get: function (data) {
                            return Ext.isEmpty(data.value);
                        }
                    }
                }
            }
        };
    },

    getDaysAdvanceNofificationField: function () {
        if ((this.formmode == CMDBuildUI.util.helper.FormHelper.formmodes.read || undefined ) || (this.formmode == CMDBuildUI.util.helper.FormHelper.formmodes.update && this.readonly == true)) {
            return this.getDaysAdvanceNofificationFieldRead();
        } else {
            return this.getDaysAdvanceNofificationFieldWrite();
        }
    },
    getDaysAdvanceNofificationFieldRead: function () {
        var field = this._getDaysAdvanceNofificationField();
        var roField = CMDBuildUI.util.helper.FormHelper.getReadOnlyField(field);
        var rField = Ext.applyIf(field, roField);
        return rField;
    },
    getDaysAdvanceNofificationFieldWrite: function () {
        var field = this._getDaysAdvanceNofificationField();
        var editor = CMDBuildUI.util.helper.FormHelper.getEditorForField(field);
        editor = Ext.applyIf(editor, {
            listeners: {
                change: {
                    scope: this,
                    fn: function (editor, value, startValue, eOpts) {
                        this.getTheEvent().set('_notification_delay', -value * (60 * 60 * 24));
                    }
                }
            }
        });
        return Ext.applyIf(field, editor);
    },
    _getDaysAdvanceNofificationField: function () {
        var reference = this.getReference();
        var baseBind = Ext.String.format('{0}.theEvent', reference);
        var notificationDelayBind = '{' + baseBind + '._notification_delay' + '}';
        var notificationTemplateBind = '{' + baseBind + '._notification_template' + '}';
        return {
            attributeconf: {
                editorType: null,
                showThousandsSeparator: false,
                unitOfMeasure: CMDBuildUI.locales.Locales.calendar.days
            },
            writable: true,
            fieldLabel: CMDBuildUI.locales.Locales.calendar.advancenotification,
            localized: {
                description: 'CMDBuildUI.locales.Locales.calendar.advancenotification'
            },
            hidden: true,
            bind: {
                value: '{daysAdvanceNotificationsField}'/* Ext.String.format('{{0}.theEvent._notification_delay}', reference) */,
                hidden: '{hiddenField}'
            },
            cmdbuildtype: 'string', //setting cmdbuildType = integer causes an error. That's because is missing unit of mesure
            viewModel: {
                data: {
                    daysAdvanceNotificationsField: null,
                    hiddenField: true
                },
                formulas: {
                    daysAdvanceNotificationsField: {
                        bind: {
                            value: notificationDelayBind
                        },
                        get: function (data) {
                            if (data.value) {
                                return Math.abs(-data.value / (60 * 60 * 24));
                            }
                        }
                    },
                    hiddenField: {
                        bind: {
                            value: notificationTemplateBind
                        },
                        get: function (data) {
                            return Ext.isEmpty(data.value);
                        }
                    }
                }
            }
        };
    },
    /* OPERATION FIELD */
    getOperationField: function () {
        var reference = this.getReference();
        var baseBind = Ext.String.format('{0}.theEvent', reference);
        var notificationStatusBind = '{' + baseBind + '.status' + '}';

        return {
            xtype: 'combobox',
            reference: 'operationcombo',
            fieldLabel: CMDBuildUI.locales.Locales.calendar.operation,
            displayField: 'label',
            valueField: 'value',
            bind: {
                value: Ext.String.format('{{0}.theEvent._operation}', reference),
                hidden: '{hiddenField}'
            },
            store: Ext.create('Ext.data.Store', {
                model: 'CMDBuildUI.model.base.ComboItem',
                proxy: {
                    type: 'memory'
                },
                data: [{
                    label: CMDBuildUI.locales.Locales.calendar.complete, value: 'completed'
                }, {
                    label: CMDBuildUI.locales.Locales.calendar.cancel, value: 'canceled'
                }]
            }),
            viewModel: {
                formulas: {
                    hiddenField: {
                        bind: {
                            value: notificationStatusBind
                        },
                        get: function (data) {
                            return data.value == "completed" || data.value == 'canceled';
                        }
                    }
                }
            }
        };
    },

    /* NOTIFICATION DELAY */
    getNotificationDelayField: function () {
        // var reference = this.getReference();

        if ((this.formmode == CMDBuildUI.util.helper.FormHelper.formmodes.read || undefined) || (this.formmode == CMDBuildUI.util.helper.FormHelper.formmodes.update && this.readonly == true)) {
            return this.getNotificationDelayFieldRead();
        } else {
            return this.getNotificationDelayFieldWrite();
        }
    },

    // /** MISSING DAYS */
    getMissingDaysExtraConf: function () {
        var reference = this.getReference();
        return {
            bind: {
                value: {
                    bindTo: '{dateChange}'
                },
                hidden: {
                    bindTo: '{visibility}'
                }
            },
            renderer: function (value, field) {
                var color = (value < 0) ? 'red' : 'black';
                return '<span style="color:' + color + ';">' + value + '</span>';
            },
            viewModel: {
                formulas: {
                    dateChange: {
                        bind: Ext.String.format('{{0}.theEvent.date}', reference),
                        get: function (date) {
                            if (date) {
                                var now = new Date();
                                return (Ext.Date.diff(now, date, 'd') + 1) + '';
                            } else {
                                return '';
                            }
                        }
                    },
                    visibility: {
                        bind: {
                            status: Ext.String.format('{{0}.theEvent.status}', reference),
                            date: Ext.String.format('{{0}.theEvent.date}', reference)
                        },
                        get: function (data) {
                            if (data.status == 'expired' || data.status == 'active') {
                                return false;
                            } else {
                                return true;
                            }
                        }
                    }
                }
            }
        };

    },

    privates: {
        _missingdays_row_index: 0,
        _partecipantGroup_row_index: 3,
        _notification_delay_row_index: 4,
        _notificationText_row_index: 5,
        _operation_row_index: 6,

        getFormLayout: function () {
            return {
                _nogroup: {
                    rows: [{
                        columns: [{//row 0
                            fields: [{
                                attribute: 'date'
                            }]
                        }, {
                            fields: [{
                                attribute: 'missingDays'
                            }]
                        }]
                    }, {//row 1
                        columns: [{
                            fields: [{
                                attribute: 'category'
                            }]
                        }, {
                            fields: [{
                                attribute: 'priority'
                            }]
                        }]
                    }, {//row 2
                        columns: [{
                            fields: [{
                                attribute: 'description'
                            }]
                        }, {
                            fields: [{
                                attribute: 'content'
                            }]
                        }]
                    },
                    //Row 3 for partecipants;

                    {//Row 4
                        columns: (this.formmode == CMDBuildUI.util.helper.FormHelper.formmodes.read) || (this.formmode == CMDBuildUI.util.helper.FormHelper.formmodes.update && this.readonly == true) ?
                            /**
                             * for read mode
                             */
                            [{
                                width: '0.5',
                                fields: [{
                                    attribute: ''//daysAdvanceNotification
                                }]
                            }]
                            :
                            /**
                             * for create/edit mode
                             */
                            [{
                                width: '0.5',
                                fields: [{
                                    attribute: '' //_notification_template
                                }]
                            }, {
                                width: '0.5',
                                fields: [{
                                    attribute: ''//daysAdvanceNotification
                                }]
                            }]
                    },

                    {//Row 5
                        columns: [{
                            fields: [{
                                attribute: ''//_notification_content
                            }]
                        }]
                    },
                    {//Row 6
                        columns: [{
                            fields: [{
                                attribute: 'status'
                            }]

                        }, {
                            fields: [{
                                attribute: 'completion'
                            }]
                        }]
                    },
                    { //row 7
                        columns: [{
                            fields: [{
                                attribute: 'Type'
                            }]
                        }, {
                            fields: [{
                                attribute: 'status'
                            }]
                        }]
                    }]
                }
            };
        },

        /**
         * 
         * @param {[Object]} panel  the result of the function renderForm
         * @param {String} fieldName the field name to search
         */
        findFieldAfterRender: function (panel, fieldName) {
            return this._recursiveVisit(panel[0], fieldName);
        },

        /**
         * 
         */
        _recursiveVisit: function (node, fieldName) {
            if (node.name == fieldName) {
                return node;
            }

            var v;
            if (node.items) {

                node.items.forEach(function (item, index, array) {
                    v = v || this._recursiveVisit(item, fieldName);
                }, this);
            }
            return v;
        }
    }
});