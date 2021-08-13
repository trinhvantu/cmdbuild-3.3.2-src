Ext.define('CMDBuildUI.mixins.model.Emails', {
    mixinId: 'model-emails-mixin',

    /**
     * @property {Ext.data.Store} _emailsstore
     * Store of `CMDBuildUI.model.emails.Email`.
     */
    _emailsstore: null,

    /**
     * @property {Ext.data.Store} _templatesstore
     * Store of `CMDBuildUI.model.emails.Template`.
     */
    _templatesstore: null,

    /**
     * @property {[]} _templatestoevaluate
     */
    _templatestoevaluate: [],

    /**
     * 
     * @return {Ext.data.Store}
     */
    emails: function () {
        if (!this._emailsstore) {
            this._emailsstore = Ext.create("Ext.data.Store", {
                model: 'CMDBuildUI.model.emails.Email',
                groupField: 'status',
                proxy: {
                    type: 'baseproxy',
                    url: this.getProxy().getUrl() + "/" + this.getId() + "/emails",
                    extraParams: {
                        detailed: true
                    }
                },
                autoLoad: true,
                sorters: ['date'],
                pageSize: 0
            });
        }
        return this._emailsstore;
    },

    /**
     * 
     * @return {Ext.data.Store}
     */
    templates: function () {
        if (!this._templatesstore) {
            this._templatesstore = Ext.create("Ext.data.Store", {
                model: 'CMDBuildUI.model.emails.Template',
                proxy: {
                    type: 'baseproxy',
                    url: CMDBuildUI.util.api.Emails.getTemplatesUrl(),
                    extraParams: {
                        detailed: true,
                        includeBindings: true
                    }
                },
                // advancedFilter: '{templatesstoredata.advancedfilter}',
                autoLoad: false,
                autoDestroy: false,
                pageSize: 0 // disable pagination
            });
        }
        return this._templatesstore;
    },

    /**
     * @param {Boolean} force If true force store load
     * @return {Function} function load
     */
    loadTemplates: function (force) {
        var deferred = new Ext.Deferred();
        var tpls = this._templatestoevaluate;
        var store = this.templates();
        if (Ext.isEmpty(tpls)) {
            // return empty records if there are 
            // no templates to evaluate
            deferred.resolve([]);
        } else if (!store.isLoaded() || force) {
            // add filter
            var tpls_names = [];
            tpls.forEach(function (t) {
                tpls_names.push(t.name);
            })
            store.getAdvancedFilter()
                .addAttributeFilter("name", "in", tpls_names);
            // load templates
            store.load(function (records, operation, success) {
                if (success) {
                    records.forEach(function (record) {
                        // update condition
                        var tpl = Ext.Array.findBy(tpls, function (t) {
                            return record.get("name") === t.name;
                        });
                        if (tpl) {
                            record.set("_condition", tpl.condition);
                            record.set("notifyWith", tpl.notifywith);
                        }
                    });
                    deferred.resolve(records);
                } else {
                    deferred.reject();
                }
            });
        } else {
            // return store data
            deferred.resolve(store.getRange());
        }
        return deferred.promise;
    },

    _lastcheckdata: {},
    /**
     * @param {function} callback
     * @param {function} syncstore
     * @param {Boolean} force
     */
    updateEmailsFromTemplates: function (callback, syncstore, force) {
        var me = this;
        // exit if item does not exists on server 
        if (me.phantom) {
            if (callback) {
                Ext.callback(callback, null, [true]);
            }
            return;
        }
        // get clean data
        var objectdata = me.getCleanData();

        // get changes from last update
        var changed = CMDBuildUI.util.Utilities.getObjectChanges(objectdata, me._lastcheckdata);

        // update last check data
        me._lastcheckdata = objectdata;

        // get drafts emails
        var emails = me.emails();

        function updateEmails() {
            emails.filter({
                property: "status",
                value: CMDBuildUI.model.emails.Email.statuses.draft,
                exactMatch: true
            });
            var drafts = emails.getRange();
            emails.clearFilter();

            var templates = me.templates().getRange();
            var porcessestemplates = 0;

            if (templates.length === 0) {
                Ext.callback(callback, null, [true]);
            }

            function finishEmailUpdating(success) {
                if (success && syncstore) {
                    if (!emails.needsSync && callback) {
                        Ext.callback(callback, null, [success]);
                    } else {
                        if (emails.getModifiedRecords().length || emails.getNewRecords().length || emails.getRemovedRecords().length) {
                            emails.sync({
                                success: function () {
                                    if (callback) {
                                        Ext.callback(callback, null, [true]);
                                    }
                                },
                                failure: function () {
                                    if (callback) {
                                        Ext.callback(callback, null, [false]);
                                    }
                                }
                            });
                        } else {
                            if (callback) {
                                Ext.callback(callback, null, [success]);
                            }
                        }
                    }
                } else {
                    if (callback) {
                        Ext.callback(callback, null, [success]);
                    }
                }
            }

            // get enabled templates
            var wasSuccessful = true;
            templates.forEach(function (template) {
                // get bindings
                var tplbindings = template.get("_bindings") && template.get("_bindings").client || [];
                var bindings = [];
                tplbindings.forEach(function (b) {
                    var sb = b && b.split(".") || "";
                    if (sb && sb.length) {
                        bindings.push(sb[0]);
                    }
                });

                // check bindings changes
                var haschanges = false;
                bindings.forEach(function (b) {
                    if (Ext.Array.contains(Object.keys(changed), b)) {
                        haschanges = true;
                    }
                });

                // get email for this template
                var email = Ext.Array.findBy(drafts, function (draft) {
                    return draft.get("template") == template.getId();
                });

                if (email) {
                    // delete email
                    if ((haschanges && !Ext.isEmpty(email) && email.get("keepSynchronization")) || force) {
                        email.erase();
                    }
                }

                // create email
                if (
                    (Ext.isEmpty(bindings) && Ext.isEmpty(email)) || // no bindings and email not exists
                    (haschanges && Ext.isEmpty(email)) || // has changes on binding fields and email not exists
                    (haschanges && !Ext.isEmpty(email) && email.get("keepSynchronization") || // has changes on binding fields and email and keep synk is active
                        (force == true)) //forces the calculation of the template
                ) {
                    // create temporary email to generate email from template
                    var newemail = Ext.create("CMDBuildUI.model.emails.Email", {
                        template: template.getId(),
                        notifyWith: template.get("notifyWith"),
                        _card: objectdata
                    });
                    if (template.get("_condition")) {
                        var condition = template.get("_condition");
                        if (!/^{\w+:\S+}$/.test(condition)) {
                            condition = Ext.String.format("{js:{0}}", template.get("_condition"));
                        }
                        newemail.set("_expr", condition);
                    }
                    newemail.getProxy().setUrl(emails.getProxy().getUrl());

                    // generate email from template
                    newemail.save({
                        params: {
                            apply_template: true,
                            template_only: true
                        },
                        callback: function (record, operation, success) {
                            porcessestemplates++;
                            if (success) {
                                // create email new email with given data
                                if (!template.get("_condition") || record.get("_expr") === "true" || record.get("_expr") === true) {
                                    emails.add([record.getCleanData()]);
                                }
                            } else {
                                // mark as failure
                                wasSuccessful = false;
                            }
                            if (porcessestemplates === templates.length) {
                                finishEmailUpdating(wasSuccessful);
                            }
                        }
                    });
                } else {
                    porcessestemplates++;
                    if (porcessestemplates === templates.length) {
                        finishEmailUpdating(wasSuccessful);
                    }
                }
            });
        }

        if (emails.isLoaded()) {
            updateEmails();
        } else {
            emails.on({
                load: {
                    fn: function (records) {
                        updateEmails();
                    },
                    single: true
                }
            });
        }
    }
});