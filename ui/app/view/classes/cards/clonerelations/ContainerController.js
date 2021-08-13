Ext.define('CMDBuildUI.view.classes.cards.clonerelations.ContainerController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.classes-cards-clonerelations-container',
    control: {
        '#cancelbtn': {
            click: 'onCancelBtnClick'
        },
        '#saveandclosebtn': {
            click: 'onSaveAndCloseBtnClick'
        },
        '#savebtn': {
            click: 'onSaveBtnClick'
        },
        'form': {
            validitychange: 'onValidityChange'
        }
    },

    listen: {
        store: {
            '#relations-clone': {
                update: 'onStoreUpdate'
            }
        }
    },

    /**
     * Cancel button
     * @param {Ext.button.Button} button 
     * @param {Event} event
     * @param {Object} eOpts
     */
    onCancelBtnClick: function (button, event, eOpts) {
        this.getView().up("#CMDBuildManagementDetailsWindow").close();
    },

    /**
     * Save and Close button
     * @param {Ext.button.Button} button 
     * @param {Event} event
     * @param {Object} eOpts
     */
    onSaveAndCloseBtnClick: function (button, event, eOpts) {
        this.saveAction(button);
    },

    /**
     * Save button
     * @param {Ext.button.Button} button 
     * @param {Event} event
     * @param {Object} eOpts
     */
    onSaveBtnClick: function (button, event, eOpts) {
        this.saveAction(button);
    },

    saveAction: function (button) {
        button.disable();

        var me = this;
        var domains = this.getViewModel().get('relations').getRange();
        var objectId = this.getViewModel().get('objectId');
        var BreakException = {};
        try {
            domains.forEach(function (domain) {
                var mode = domain.get('mode');
                if (!mode) {
                    CMDBuildUI.util.Notifier.showWarningMessage(
                        "Cannot save data, please make sure you selected an action for every domain"
                    );
                    BreakException[0] = 'error';
                    throw BreakException;
                }
            });
        } catch (e) {
            if (e !== BreakException) throw e;
        }

        if (!BreakException[0]) {
            var formcontroller = this.getView().down('classes-cards-card-create').getController();
            formcontroller.saveForm().then(function (record) {
                var clonedDomains = me.domainsFilter(domains, 'clone');
                var migratesDomains = me.domainsFilter(domains, 'migrates');
                var urlClone = Ext.String.format(CMDBuildUI.util.Config.baseUrl + '/domains/_ANY/relations/_ANY/copy');
                var urlMigrate = Ext.String.format(CMDBuildUI.util.Config.baseUrl + '/domains/_ANY/relations/_ANY/move');
                var destination = record.getId();

                Ext.Promise.all([
                    me.saveDomains(objectId, destination, clonedDomains, urlClone),
                    me.saveDomains(objectId, destination, migratesDomains, urlMigrate)
                ]).then(function (response) {
                    if (button.getReference()) {
                        var url;
                        switch (button.getReference()) {
                            case 'savebtn':
                                url = CMDBuildUI.util.Navigation.getClassBaseUrl(record.get("_type"), record.getId(), 'view');
                                me.redirectTo(url);
                                break;
                            case 'saveandclosebtn':
                                // close details window
                                CMDBuildUI.util.Navigation.removeManagementDetailsWindow();
                                // redirect to the card

                                url = CMDBuildUI.util.Navigation.getClassBaseUrl(record.get("_type"), record.getId());
                                me.redirectTo(url);
                                break;
                        }
                    }
                });
            }).otherwise(function () {
                button.enable();
            });
        }
    },

    /**
     * Filter domain array with given key
     * @param {Array} domain 
     * @param {String} filter
     * 
     * @returns {filtered Array} 
     */
    domainsFilter: function (domains, filter) {
        var result = [];
        domains.forEach(function (domain) {
            var mode = domain.get('mode');
            if (mode == filter) {
                var element = {
                    _id: domain.get('domain'),
                    direction: domain.get('direction')
                };
                result.push(element);
            }
        });
        return result;
    },

    /**
     * Async save call for domains
     * @param {String} source
     * @param {String} destination
     * @param {Array} domains
     * @param {String} url
     * 
     * @returns {Ext.Ajax.request} 
     */
    saveDomains: function (source, destination, domains, url) {
        if (Ext.isEmpty(domains)) {
            var deferred = new Ext.Deferred();
            deferred.resolve();
            return deferred;
        }
        return Ext.Ajax.request({
            url: url,
            method: "POST",
            jsonData: {
                source: source,
                destination: destination,
                domains: domains
            }
        });
    },

    onValidityChange: function (form, valid, eOpts) {
        var store = this.lookupReference('classes-cards-clonerelations-panel').getStore();
        this.aux(form, store);
    },

    onStoreUpdate: function (store, record, operation, modifiedFieldNames, details, eOpts) {
        var form = this.getView().lookupReference('classes-cards-card-create');
        this.aux(form, store);
    },

    aux: function (form, store) {
        var formValid = !form.hasInvalidField();
        var storeValid = this._isStoreValid(store);

        this.getViewModel().set('saveButtonDisabled', !(formValid && storeValid));
    },

    _isStoreValid: function (store) {
        var records = store.getRange();
        for (var i = 0; i < records.length; i++) {
            var record = records[i];

            if (!record.hasChecks()) {
                return false;
            }
        }

        return true;
    }
});