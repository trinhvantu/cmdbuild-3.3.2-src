Ext.define('CMDBuildUI.view.administration.content.emails.templates.card.FormController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.administration-content-emails-templates-card-form',

    control: {
        '#': {
            beforeRender: 'onBeforeRender'
        },
        '#saveBtn': {
            click: 'onSaveBtnClick'
        },
        '#cancelBtn': {
            click: 'onCancelBtnClick'
        },
        '#openBtn': {
            click: 'onOpenBtnClick'
        },
        '#editBtn': {
            click: 'onEditBtnClick'
        },
        '#cloneBtn': {
            click: 'onCloneBtnClick'
        },
        '#deleteBtn': {
            click: 'onDeleteBtnClick'
        }
    },

    /**
     * @param {CMDBuildUI.view.administration.content.emails.templates.card.Form} view
     * @param {Object} eOpts
     */
    onBeforeRender: function (view, eOpts) {
        var vm = view.lookupViewModel();
        Ext.getStore('emails.Accounts').load();
        vm.bind({
            bindTo: {
                theTemplateDescription: '{theTemplate.description}'
            }
        }, function (data) {
            var title = 'New template';
            var detailWindow = view.up('administration-detailswindow');
            if (data.theTemplateDescription) {
                if (vm.get('theTemplate').phantom) {
                    title = Ext.String.format('New template {0} {1}', (data.theTemplateDescription && data.theTemplateDescription.length) ? ' - ' : '', data.theTemplateDescription);
                } else {
                    title = data.theTemplateDescription;
                }
            }
            if (detailWindow) {
                detailWindow.getViewModel().set('title', title);
            }
        });
        if (!vm.get('theTemplate') && this.getView().getInitialConfig()._rowContext) {
            vm.linkTo('theTemplate', {
                type: 'CMDBuildUI.model.emails.Template',
                id: this.getView().getInitialConfig()._rowContext.record.get('_id')

            });
        }
    },

    /**
     * @param {Ext.button.Button} button
     * @param {Event} e
     * @param {Object} eOpts
     */
    onSaveBtnClick: function (button, e, eOpts) {
        Ext.GlobalEvents.fireEventArgs("showadministrationcontentmask", [true]);
        var vm = this.getViewModel();
        var form = this.getView();
        if (form.isValid()) {
            var theTemplate = vm.get('theTemplate');
            theTemplate.save({
                success: function (record, operation) {
                    Ext.GlobalEvents.fireEventArgs("templateupdated", [record]);
                    form.up().fireEvent("closed");
                },
                callback: function () {
                    Ext.GlobalEvents.fireEventArgs("showadministrationcontentmask", [false]);
                }
            });
        }
    },

    /**
     * @param {Ext.button.Button} button
     * @param {Event} e
     * @param {Object} eOpts
     */
    onCancelBtnClick: function (button, e, eOpts) {
        var vm = this.getViewModel();
        vm.get("theTemplate").reject(); // discard changes
        this.getView().up().fireEvent("closed");
    },

    /**
     * @param {Ext.button.Button} button
     * @param {Event} e
     * @param {Object} eOpts
     */
    onEditValueBtnClick: function () {
        var title = CMDBuildUI.locales.Locales.administration.emails.editvalues;
        var config = {
            xtype: 'administration-components-keyvaluegrid-grid',
            viewModel: {
                data: {
                    theKeyvaluedata: this.getViewModel().get('theTemplate').get('data'),
                    theOwnerObject: this.getViewModel().get('theTemplate'),
                    theOwnerObjectKey: 'data',
                    actions: {
                        view: false,
                        edit: true,
                        add: false
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
    onOpenBtnClick: function (button, e, eOpts) {
        var template = this.getViewModel().get('theTemplate') || this.getView().getInitialConfig()._rowContext.record;
        var container = Ext.getCmp(CMDBuildUI.view.administration.DetailsWindow.elementId) || Ext.create(CMDBuildUI.view.administration.DetailsWindow);
        container.removeAll();
        container.add({
            xtype: 'administration-content-emails-templates-card-form',
            viewModel: {
                links: {
                    theTemplate: {
                        type: 'CMDBuildUI.model.emails.Template',
                        id: template.get('_id')
                    }
                },
                data: {
                    actions: {
                        view: true,
                        add: false,
                        edit: false
                    }
                }
            }
        });
    },

    /**
     * @param {Ext.button.Button} button
     * @param {Event} e
     * @param {Object} eOpts
     */
    onEditBtnClick: function (button, e, eOpts) {
        var template = this.getViewModel().get('theTemplate') || this.getView().getInitialConfig()._rowContext.record;
        var container = Ext.getCmp(CMDBuildUI.view.administration.DetailsWindow.elementId) || Ext.create(CMDBuildUI.view.administration.DetailsWindow);
        container.removeAll();
        container.add({
            xtype: 'administration-content-emails-templates-card-form',
            viewModel: {
                links: {
                    theTemplate: {
                        type: 'CMDBuildUI.model.emails.Template',
                        id: template.get('_id')
                    }
                },
                data: {
                    actions: {
                        view: false,
                        add: false,
                        edit: true
                    }
                }
            }
        });
    },

    /**
     * @param {Ext.button.Button} button
     * @param {Event} e
     * @param {Object} eOpts
     */
    onCloneBtnClick: function (button, e, eOpts) {
        var view = this.getView();
        var vm = view.getViewModel();
        var container = Ext.getCmp(CMDBuildUI.view.administration.DetailsWindow.elementId) || Ext.create(CMDBuildUI.view.administration.DetailsWindow);
        var newTemplate = vm.get('theTemplate').clone();

        container.removeAll();
        container.add({
            xtype: 'administration-content-emails-templates-card-form',

            viewModel: {
                links: {
                    theTemplate: {
                        type: 'CMDBuildUI.model.emails.Template',
                        create: newTemplate.getData()
                    }
                },
                data: {
                    actions: {
                        view: false,
                        add: true,
                        edit: false
                    }
                }
            }
        });
    },
    /**
     * @param {Ext.button.Button} button
     * @param {Event} e
     * @param {Object} eOpts
     */
    onDeleteBtnClick: function (button, e, eOpts) {
        var me = this;

        var callback = function (btnText) {
            if (btnText === "yes") {
                CMDBuildUI.util.Ajax.setActionId('delete-template');
                var grid = Ext.ComponentQuery.query('administration-content-emails-templates-grid')[0];                
                grid.getStore().remove(me.getViewModel().get('theTemplate'));
                grid.getStore().sync();
                CMDBuildUI.util.Navigation.removeAdministrationDetailsWindow();              
            }
        };

        CMDBuildUI.util.administration.helper.ConfirmMessageHelper.showDeleteItemMessage(null, null, callback, this);
    }

});