Ext.define('CMDBuildUI.view.widgets.LaunchersController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.widgets-launchers',

    control: {
        '#': {
            widgetschanged: 'onWidgetsChanged',
            widgetbuttonclick: 'onWidgetButtonClick'
        }
    },

    /**
     * @param {CMDBuildUI.view.widgets.Launchers} view
     * @param {Ext.data.Store} newvalue
     * @param {Ext.data.Store} oldvalue
     */
    onWidgetsChanged: function (view, newvalue, oldvalue) {
        var me = this,
            vm = view.lookupViewModel();
        if (newvalue && newvalue.getData().length) {
            var promises = [];
            Ext.Array.each(newvalue.getRange(), function (widget, index) {
                if (widget.get("_active")) {
                    // add value binding
                    var readmode = view.getFormMode() === CMDBuildUI.util.helper.FormHelper.formmodes.read;

                    var wconf = {
                        xtype: 'widgets-button',
                        reference: 'widgetbutton_' + index,
                        text: widget.get("_label_translation") + (widget.get("_required") ? ' *' : ''),
                        disabled: readmode && !widget.get("_alwaysenabled"),
                        required: widget.get("_required"),
                        handler: function (button, e) {
                            view.fireEvent("widgetbuttonclick", view, button, widget, e);
                        },
                        listeners: {
                            render: function (button) {
                                button.lookupViewModel().bind({
                                    bindTo: '{theObject.' + widget.get("_output") + '}'
                                }, function (_output) {
                                    button.setValue(_output);
                                    button.isValid();
                                });
                            }
                        }
                    };

                    if (widget.get("_type") === 'linkCards') {
                        var theObj = view.lookupViewModel().get("theObject");
                        if (theObj && Ext.isEmpty(theObj.get(widget.get("_output"))) && widget.get("_output")) {
                            // view.lookupViewModel().get("theObject").set(widget.get("_output"), []);
                            // if the _aoutput is not defined, default values should be loaded 
                            if (Ext.isEmpty(theObj.get(widget.get("_output"))) && !Ext.isArray(theObj.get(widget.get("_output")))) {
                                CMDBuildUI.view.widgets.linkcards.Panel.loadDefaults(widget, view.lookupViewModel().get("theObject")).then(function (records, widget) {
                                    if (!Ext.isEmpty(records)) {
                                        var defaults = [];
                                        records.forEach(function (r) {
                                            defaults.push({
                                                _id: r.getId()
                                            });
                                        });
                                        if (view.lookupViewModel().get('theObject')) {
                                            view.lookupViewModel().get("theObject").set(widget.get("_output"), defaults);
                                        }
                                        if (defaults.length) {
                                            var widgetButton = view.lookupReference('widgetbutton_' + index);
                                            if (widgetButton) {
                                                widgetButton.fireEvent('validitychange', widgetButton, true);
                                            }
                                        }
                                    }
                                });
                            }
                        }
                    }

                    var widgettype = widget.get("_type"),
                        xtype = CMDBuildUI.util.Config.widgets[widgettype];
                    
                    if (xtype) {
                        var cls = Ext.ClassManager.getByAlias("widget." + xtype);
                        if (cls && cls.onTargetFormOpen) {
                            promises.push(
                                cls.onTargetFormOpen(vm.get("theObject"), widget, {
                                    formmode: view.getFormMode()
                                })
                            );
                        }
                    }

                    try {
                        // add widget button
                        widget._ownerButton = view.add(wconf);
                    } catch (e) {
                        CMDBuildUI.util.Logger.log(
                            "Malformed widget configuration.",
                            CMDBuildUI.util.Logger.levels.warn,
                            null,
                            wconf
                        );
                    }
                }
            });

            if (!Ext.isEmpty(promises)) {
                Ext.Promise.all(promises).then(function () {
                    // TODO: do something
                });
            }
            // show panel
            vm.set("hideLaunchersPanel", false);

        }
    },

    /**
     * Return the name of the model used by the widget.
     * @return {String}
     */
    getModelName: function (theWidget) {
        return 'CMDBuildUI.model.customform.' + theWidget.getId();
    },

    /**
     * @param {Ext.Component} view
     * @param {Ext.button.Button} button
     * @param {CMDBuildUI.model.WidgetDefinition} widget
     * @param {Event} e
     * @param {Object} eOpts
     */
    onWidgetButtonClick: function (view, button, widget, e, eOpts) {
        function openwidget(widgettype) {
            var popup;
            // create widget configuration
            var config = {
                xtype: widgettype,
                widgetId: widget.getId(),
                output: widget.get("_output"),
                formMode: view.getFormMode(),
                _widgetOwner: view,
                viewModel: {
                    data: {
                        theWidget: widget,
                        theTarget: view.lookupViewModel().get("theObject")
                    }
                },
                bind: {
                    target: '{theTarget}'
                },
                listeners: {
                    /**
                     * Custom event to close popup directly from widget
                     */
                    popupclose: function (eOpts) {
                        popup.close();
                    }
                }
            };

            // custom panel listeners
            var listeners = {
                /**
                 * @param {Ext.panel.Panel} panel
                 * @param {Object} eOpts
                 */
                beforeclose: function (panel, eOpts) {
                    panel.removeAll(true);
                },
                /**
                 * @param {Ext.panel.Panel} panel
                 * @param {Object} eOpts
                 */
                close: function (panel, eOpts) {
                    button.fireEvent('validitychange', button, button.isValid());
                }
            };
            // open popup
            popup = CMDBuildUI.util.Utilities.openPopup(
                null,
                widget.get("_label_translation"),
                config,
                listeners
            );
        }

        // update ajax action id
        CMDBuildUI.util.Ajax.setActionId(Ext.String.format(
            'widget.open.{0}.{1}',
            widget.get("_type"),
            widget.getId()
        ));

        var widgettype = widget.get("_type");
        var xtype = CMDBuildUI.util.Config.widgets[widgettype];
        if (!xtype) {
            var store = Ext.StoreManager.get("customcomponents.Widgets");

            function opencustomwidget() {
                var w = store.findRecord("name", widgettype);
                if (w) {
                    var alias = w.get("alias");
                    alias = alias.replace("widget.", "");
                    Ext.require(w.get("componentId"), function () {
                        openwidget(alias);
                    });
                } else {
                    CMDBuildUI.util.Msg.alert(
                        'Warning',
                        Ext.String.format('Widget <strong>{0}</strong> not implemented!', widgettype) // TODO: translate
                    );
                }
            }

            if (!store.isLoaded()) {
                store.load({
                    callback: opencustomwidget
                });
            } else {
                opencustomwidget();
            }
            return;
        }

        if (widgettype === 'openAttachment' && !CMDBuildUI.util.helper.Configurations.get(CMDBuildUI.model.Configuration.dms.enabled)) {
            CMDBuildUI.util.Msg.alert(
                'Warning',
                Ext.String.format('Attachments disabled!')
            );
            return;
        }

        // open widget
        openwidget(xtype);
    }
});