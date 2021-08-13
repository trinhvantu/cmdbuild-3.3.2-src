Ext.define('CMDBuildUI.view.filters.PanelController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.filters-panel',

    control: {
        '#': {
            beforerender: 'onBeforeRender'
        },
        '#applybutton': {
            click: 'onApplyButtonClick'
        },
        '#savebutton': {
            click: 'onSaveButtonClick'
        },
        '#cancelbutton': {
            click: 'onCancelButtonClick'
        }
    },

    /**
     * @param {CMDBuildUI.view.filters.Panel} view
     * @param {Event} event
     * @param {Object} eOpts
     */
    onBeforeRender: function(view, event, eOpts) {
        // add attributes panel
        if (view.getShowAttributesPanel()) {
            view.add({
                xtype: 'filters-attributes-panel',
                reference: 'attributespanel',
                allowInputParameter: view.getAllowInputParameterForAttributes()
            });
        }

        // add relations panel
        if (view.getShowRelationsPanel()) {
            view.add({
                xtype: 'filters-relations-panel',
                reference: 'relationspanel'
            });
        }

        // add attachments panel
        if (
            view.getShowAttachmentsPanel() &&
            CMDBuildUI.util.helper.Configurations.getEnabledFeatures().dms // dms is enabled
        ) {
            view.add({
                xtype: 'filters-attachments-panel',
                reference: 'attachmentspanel'
            });
        }

        view.setActiveTab(0);
    },

    /**
     * @param {Ext.button.Button} button 
     * @param {Object} eOpts 
     */
    onApplyButtonClick: function (button, eOpts) {
        this.getView().fireEvent('applyfilter', this.getView(), this.getFilter());
    },

    /**
     * @param {Ext.button.Button} button 
     * @param {Object} eOpts 
     */
    onSaveButtonClick: function (button, eOpts) {
        var me = this;
        var filter = this.getFilter();

        // 
        var w = Ext.create('Ext.window.Window', {
            title: filter.get("description"),
            // height: 200,
            width: 400,
            layout: 'fit',
            alwaysOnTop: CMDBuildUI.util.Utilities._popupAlwaysOnTop++,
            modal: true,
            ui: "management",

            viewModel: {
                data: {
                    theFilter: filter
                }
            },

            items: {
                xtype: 'form',
                padding: CMDBuildUI.util.helper.FormHelper.properties.padding,
                fieldDefaults: CMDBuildUI.util.helper.FormHelper.fieldDefaults,
                items: [{
                    xtype: 'textfield',
                    name: 'name',
                    fieldLabel: CMDBuildUI.locales.Locales.filters.name,
                    bind: '{theFilter.name}',
                    allowBlank: false  // requires a non-empty value
                }]
            },

            buttons: [{
                text: CMDBuildUI.locales.Locales.common.actions.save,
                ui: 'management-action-small',
                formBind: true,
                handler: function () {
                    filter.set("description", filter.get("name"));
                    me.getView().fireEvent('saveandapplyfilter', me.getView(), filter);
                    CMDBuildUI.util.Utilities._popupAlwaysOnTop--;
                    w.destroy();
                }
            }, {
                text: CMDBuildUI.locales.Locales.common.actions.cancel,
                ui: 'secondary-action-small',
                handler: function () {
                    CMDBuildUI.util.Utilities._popupAlwaysOnTop--;
                    w.destroy();
                }
            }]
        });

        w.show();
    },

    /**
     * @param {Ext.button.Button} button 
     * @param {Object} eOpts 
     */
    onCancelButtonClick: function (button, eOpts) {
        this.getView().fireEvent('popupclose');
    },

    privates: {
        /**
         * @return {CMDBuildUI.model.base.Filter}
         */
        getFilter: function () {
            var filter = this.getViewModel().get("theFilter");
            var conf = {};
            var attributespanel = this.lookup("attributespanel");
            var relationspanel = this.lookup("relationspanel");
            var attachmentspanel = this.lookup("attachmentspanel");
            var attrdata = attributespanel && attributespanel.getAttributesData() || null;
            var reldata = relationspanel && relationspanel.getRelationsData() || null;
            var attachmentsdata = attachmentspanel && attachmentspanel.getAttachmentsData() || null;

            if (attrdata && !Ext.isEmpty(attrdata) && !Ext.Object.isEmpty(attrdata)) {
                conf.attribute = attrdata;
            }

            if (reldata && !Ext.isEmpty(reldata) && !Ext.Object.isEmpty(reldata)) {
                conf.relation = reldata;
            }

            if (attachmentsdata && !Ext.isEmpty(attachmentsdata) && !Ext.Object.isEmpty(attachmentsdata)) {
                conf.attachment = attachmentsdata;
            }

            filter.set("configuration", conf);

            return filter;
        }
    }
});
