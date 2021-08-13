Ext.define('CMDBuildUI.view.bulkactions.edit.PanelController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.bulkactions-edit-panel',

    control: {
        '#': {
            beforerender: 'onBeforeRender'
        },
        '#attribtuescombo': {
            select: 'onAttributesComboSelect'
        },
        '#savebtn': {
            click: 'onSaveBtnClick'
        },
        '#cancelbtn': {
            click: 'onCancelBtnClick'
        }
    },

    /**
     * 
     * @param {CMDBuildUI.view.bulkactions.edit.Panel} view 
     * @param {Object} eOpts 
     */
    onBeforeRender: function (view, eOpts) {
        var me = this;
        me._modifiedattributes = {};
        me._fieldsets = {};

        var vm = view.lookupViewModel();
        var objectitem = CMDBuildUI.util.helper.ModelHelper.getObjectFromName(
            view.getObjectTypeName(),
            view.getObjectType()
        );

        vm.linkTo('theObject', {
            type: CMDBuildUI.util.helper.ModelHelper.getModelName(view.getObjectType(), view.getObjectTypeName()),
            create: true
        })

        // update attributes store
        var attributeslist = [];
        objectitem.getAttributes().then(function (attributes) {
            attributes.getRange().forEach(function (attr) {
                var _attr = attr.copy();
                if (!_attr.get("_group_description_translation")) {
                    _attr.set("_group_description_translation", CMDBuildUI.locales.Locales.common.attributes.nogroup);
                }
                attributeslist.push(_attr);
            });
        });
        vm.set("attributeslist", attributeslist);

        var form = view.lookupReference('bulkeditform');

        // add fieldsets for each group
        objectitem.attributeGroups().getRange().forEach(function (group) {
            me._fieldsets[group.get("name")] = form.add({
                xtype: 'formpaginationfieldset',
                title: group.get("_description_translation"),
                collapsible: true,
                padding: CMDBuildUI.util.helper.FormHelper.properties.padding,
                hidden: true
            });
        });

        // add nogroups fieldset
        me._fieldsets[CMDBuildUI.model.AttributeGrouping.nogroup] = form.add({
            xtype: 'formpaginationfieldset',
            title: CMDBuildUI.locales.Locales.common.attributes.nogroup,
            collapsible: true,
            padding: CMDBuildUI.util.helper.FormHelper.properties.padding,
            hidden: true
        });
    },

    /**
     * 
     * @param {Ext.form.field.ComboBox} combo 
     * @param {CMDBuildUI.model.Attribute} record 
     * @param {Object} eOpts 
     */
    onAttributesComboSelect: function (combo, record, eOpts) {
        if (record) {
            var me = this,
                view = this.getView();
            var model = CMDBuildUI.util.helper.ModelHelper.getModelFromName(
                CMDBuildUI.util.helper.ModelHelper.getModelName(view.getObjectType(), view.getObjectTypeName())
            )
            // get model field
            var field = model.getField(record.get("name"));
            // get fieldset
            var fieldset = field.attributeconf.group ?
                this._fieldsets[field.attributeconf.group] :
                this._fieldsets[CMDBuildUI.model.AttributeGrouping.nogroup];
            // add field to form
            var row = fieldset.add({
                layout: {
                    type: 'hbox',
                    align: 'end'
                },

                items: [Ext.merge(CMDBuildUI.util.helper.FormHelper.getFormField(field, {
                    mode: CMDBuildUI.util.helper.FormHelper.formmodes.update,
                    ignoreUpdateVisibilityToField: true,
                    ignoreCustomValidator: true,
                    ignoreAutovalue: true
                }), {
                    flex: 1
                }), {
                    xtype: 'button',
                    iconCls: 'x-fa fa-trash',
                    margin: "auto auto 1 10",
                    ui: 'management-action',
                    tooltip: CMDBuildUI.locales.Locales.common.actions.remove,
                    handler: function () {
                        record.set("writable", true);
                        delete me._modifiedattributes[record.get("name")];
                        if (row.up().items.length === 1) {
                            row.up().setHidden(true);
                        }
                        row.destroy();
                    }
                }]
            });
            // show fieldset
            fieldset.setHidden(false);
            // remove attribute from combo
            record.set("writable", false);
            this._modifiedattributes[record.get("name")] = record.get("_description_translation");
            // clear combo
            combo.setValue();
        }
    },

    /**
     * 
     * @param {Ext.button.Button} btn 
     * @param {Object} eOpts 
     */
    onSaveBtnClick: function () {
        var view = this.getView(),
            vm = view.lookupViewModel(),
            grid = view.ownerGrid;

        // get request info
        var requestinfo = CMDBuildUI.view.bulkactions.Util.getRequestInfo(grid);

        // get changed data
        var changedData = {},
            changedAttributes = [];
        Ext.Object.each(this._modifiedattributes, function (attrname, attrdesc) {
            changedData[attrname] = vm.get("theObject." + attrname);
            changedAttributes.push(attrdesc);
        });

        // create confirm message
        var message = Ext.String.format(
            CMDBuildUI.locales.Locales.bulkactions.confirmedit,
            '<em>' + changedAttributes.sort().join(", ") + '</em>',
            requestinfo.count
        );
        CMDBuildUI.util.Msg.confirm(
            CMDBuildUI.locales.Locales.notifier.attention,
            message,
            function (btn) {
                if (btn === "yes") {
                    // make ajax request
                    Ext.Ajax.request({
                        url: requestinfo.url,
                        method: 'PUT',
                        jsonData: changedData,
                        params: {
                            filter: requestinfo.advancedFitler.encode()
                        },
                        callback: function (request, success, response) {
                            if (success) {
                                // reload store
                                grid.getStore().load();
                                // close popup
                                view.closePopup();
                            }
                        }
                    })
                }
            }
        );
    },

    /**
     * 
     * @param {Ext.button.Button} btn 
     * @param {Object} eOpts 
     */
    onCancelBtnClick: function (btn, eOpts) {
        this.getView().closePopup();
    },

    privates: {
        /**
         * @property {Object} _fieldsets 
         * Reference to fieldsets added in the form. 
         */
        _fieldsets: {},

        /**
         * @property {Object} _modifiedattributes
         * The list of modified attributes
         */
        _modifiedattributes: {}
    }
});