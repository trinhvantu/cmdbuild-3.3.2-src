Ext.define("CMDBuildUI.util.Navigation", {
    singleton: true,

    contexts: {
        administration: 'administration',
        management: 'management'
    },

    /**
     * Return main container.
     * 
     * @param {Boolean} create Create the container if not exists.
     * @return {CMDBuildUI.view.main.content.Container}
     */
    getMainContainer: function (create) {
        var container = Ext.getCmp(CMDBuildUI.view.main.content.Container.elementId);
        if (!container && create) {
            container = Ext.create(CMDBuildUI.view.main.content.Container);
        }
        return container;
    },

    /**
     * Clear main container.
     * 
     * @param {Boolean} create Create the container if not exists.
     * @return {CMDBuildUI.view.main.content.Container}
     */
    clearMainContainer: function (create) {
        var container = this.getMainContainer(create);
        if (container) {
            container.removeAll(true);
        }
        var administrationContent = this.getMainAdministrationContainer();
        if (administrationContent) {
            administrationContent.destroy();
        }
        return container;
    },

    /**
     * Add a component into main content.
     * 
     * @param {String} xtype The component xtype
     * @param {Object} parameters
     * @return {CMDBuildUI.view.main.content.Container}
     */
    addIntoMainContainer: function (xtype, parameters) {
        var config = Ext.applyIf({
            xtype: xtype
        }, parameters);

        // get and clear container
        var container = this.clearMainContainer(true);
        // add component
        container.add(config);
        return container;
    },

    /**
     * Returns the management navigation tree
     * @return {CMDBuildUI.view.management.navigation.Tree}
     */
    getManagementNavigation: function() {
        var main = CMDBuildUI.util.Navigation.getMainContainer();
        var nav = main.query('management-navigation-tree');
        if (nav.length) {
            return nav[0];
        }
    },

    /**
     * Return management container.
     * 
     * @param {Boolean} create Create the container if not exists.
     * @return {CMDBuildUI.view.management.Content}
     */
    getManagementContainer: function (create) {
        var container = Ext.getCmp(CMDBuildUI.view.management.Content.elementId);
        if (!container && create) {
            container = Ext.create(CMDBuildUI.view.management.Content);
        }
        return container;
    },

    /**
     * Clear main container.
     * 
     * @param {Boolean} create Create the container if not exists.
     * @return {CMDBuildUI.view.management.Content}
     */
    clearManagementContainer: function (create) {
        var container = this.getManagementContainer(create);
        if (container) {
            container.removeAll(true);
        }
        return container;
    },

    /**
     * Add a component into management container.
     * 
     * @param {String} xtype
     * @param {Object} parameters
     * @return {CMDBuildUI.view.management.Content}
     */
    addIntoManagemenetContainer: function (xtype, parameters) {
        var config = Ext.applyIf({
            xtype: xtype
        }, parameters);

        // get and clear container
        var container = this.clearManagementContainer(true);
        // add component
        container.add(config);
        return container;
    },


    /**
     * Return details window container.
     * 
     * @param {Boolean} create Create the container if not exists.
     * @return {CMDBuildUI.view.management.DetailsWindow}
     */
    getManagementDetailsWindow: function (create) {
        var container = Ext.getCmp(CMDBuildUI.view.management.DetailsWindow.elementId);
        if (!container && create) {
            container = Ext.create(CMDBuildUI.view.management.DetailsWindow);
        }
        return container;
    },

    /**
     * Clear details window container.
     * 
     * @param {Boolean} create Create the container if not exists.
     * @return {CMDBuildUI.view.management.DetailsWindow}
     */
    clearManagementDetailsWindow: function (create) {
        var container = this.getManagementDetailsWindow(create);
        if (container) {
            container.removeAll(true);
        }
        return container;
    },

    /**
     * Removes detail window container.
     * @param {Boolead} suspendEvents
     */
    removeManagementDetailsWindow: function (suspendEvents) {
        var container = this.getManagementDetailsWindow(false);
        if (container) {
            if (suspendEvents) {
                container.suspendEvents();
            }
            container.close();
        }
    },

    /**
     * Add a component into management container.
     * 
     * @param {String} xtype
     * @param {Object} parameters
     * @return {CMDBuildUI.view.management.DetailsWindow}
     */
    addIntoManagementDetailsWindow: function (xtype, parameters) {
        var config = Ext.applyIf({
            xtype: xtype
        }, parameters);

        // get and clear container
        var container = this.clearManagementDetailsWindow(true);
        // add component
        container.add(config);
        return container;
    },

    /**
     * Removes detail window container.
     * 
     * @param {String} newtitle
     */
    updateTitleOfManagementDetailsWindow: function (newtitle) {
        var container = this.getManagementDetailsWindow(false);
        if (container) {
            container.setTitle(newtitle);
        }
    },


    /**
     * Return administration container.
     * 
     * @param {Boolean} create Create the container if not exists.
     * @return {CMDBuildUI.view.administration.Content}
     */
    getMainAdministrationContainer: function (create) {
        // var container = Ext.getBody().down('administration-content');
        var container = Ext.getCmp(CMDBuildUI.view.administration.Content.elementId);
        if (!container && create) {

            container = Ext.create(CMDBuildUI.view.administration.Content);
        }
        return container;
    },

    /**
     * Clear administration container.
     * 
     * @param {Boolean} create Create the container if not exists.
     * @return {CMDBuildUI.view.administration.Content}
     */
    clearMainAdministrationContainer: function (create) {
        var container = this.getMainAdministrationContainer(create);
        if (container) {
            container.removeAll(true);
        }
        return container;
    },

    /**
     * Add a component into administration container.
     * 
     * @param {String} xtype
     * @param {Object} parameters
     * @return {CMDBuildUI.view.administration.Content}
    */
    addIntoMainAdministrationContent: function (xtype, parameters) {
        var config = Ext.applyIf({
            xtype: xtype
        }, parameters);

        // get and clear container
        var container = this.clearMainAdministrationContainer(true);
        // add component
        container.add(config);
        return container;
    },


    /**
     * Return administration details window container.
     * 
     * @param {Boolean} create Create the container if not exists.
     * @return {CMDBuildUI.view.administration.DetailsWindow}
     */
    getAdministrationDetailsWindow: function (create) {
        var container = Ext.getCmp(CMDBuildUI.view.administration.DetailsWindow.elementId);
        if (!container && create) {
            container = Ext.create(CMDBuildUI.view.administration.DetailsWindow.elementId);
        }
        return container;
    },

    /**
     * Clear administration container.
     * 
     * @param {Boolean} create Create the container if not exists.
     * @return {CMDBuildUI.view.administration.DetailsWindow}
     */
    clearAdministrationDetailsWindow: function (create) {
        var container = this.getAdministrationDetailsWindow(create);
        if (container) {
            container.removeAll(true);
        }
        return container;
    },

    /**
     * Removes administration detail window container.
     */
    removeAdministrationDetailsWindow: function () {
        var panel = this.clearAdministrationDetailsWindow(false);
        if (panel) {
            panel.destroy();
        }
    },

    /**
     * Add a component into administration details window container.
     * 
     * @param {String} xtype
     * @param {Object} parameters
     * @return {CMDBuildUI.view.administration.DetailsWindow}
     */
    addIntoAdministrationDetailsWindow: function (xtype, parameters) {
        var config = Ext.applyIf({
            xtype: xtype
        }, parameters);

        // get and clear container
        var container = this.clearAdministrationDetailsWindow(true);
        // add component
        container.add(config);
        return container;
    },


    /**
     * Return current main context
     * 
     * @return {Object} Current main context info.
     */
    getCurrentContext: function () {
        return this._currentcontext;
    },

    /**
     * Update current main context.
     * 
     * @param {String} context One of `administration` or `management`.
     * @param {String} objectType 
     * @param {String} objectTypeName
     * @param {String} objectId
     * @param {Object} other
     * @return {Object} Current main context info.
     */
    updateCurrentContext: function (context, objectType, objectTypeName, objectId, other) {
        this._currentcontext = Ext.applyIf({
            context: context,
            objectType: objectType,
            objectTypeName: objectTypeName,
            objectId: objectId
        }, other);
        return this.getCurrentContext();
    },

    /**
     * Clear current main context.
     */
    clearCurrentContext: function () {
        this._currentcontext = {};
        return this.getCurrentContext();
    },

    /**
     * Update current management main context.
     * 
     * @param {String} objectType 
     * @param {String} objectTypeName
     * @param {String} objectId
     * @param {Object} other
     * @return {Object} Current main context info.
     */
    updateCurrentManagementContext: function (objectType, objectTypeName, objectId, other) {
        return this.updateCurrentContext(
            this.contexts.management,
            objectType,
            objectTypeName,
            objectId,
            other
        );
    },

    /**
     * @param {String} action
     */
    updateCurrentManagementContextAction: function (action) {
        this._currentcontext.currentaction = action;
    },

    /**
     * @param {String} activity
     */
    updateCurrentManagementContextActivity: function (activity) {
        this._currentcontext.currentactivity = activity;
    },

    udateCurrentManagementContextCustomPageObjectType: function (cpObjectType) {
        this._currentcontext.cpObjectType = cpObjectType;
    },

    udateCurrentManagementContextViewObjectType: function (vwObjectType) {
        this._currentcontext.vwObjectType = vwObjectType;
    },

    updateCurrentManagementContextCustomPageObjectTypeName: function (cpObjectTypeName) {
        this._currentcontext.cpObjectTypeName = cpObjectTypeName;
    },

    updateCurrentManagementContextViewObjectTypeName: function (vwObjectTypeName) {
        this._currentcontext.vwObjectTypeName = vwObjectTypeName;
    },
    updateCurrentManagementContextCustomPageObjectId: function (cpObjectId) {
        this._currentcontext.cpObjectId = cpObjectId;
    },

    /**
     * 
     * @param {String} objectId 
     */
    updateCurrentManagementContextObjectId: function (objectId) {
        this._currentcontext.objectId = objectId;
    },
    updateCurrentManagementContextViewObjectId: function (vwObjectId) {
        this._currentcontext.vwObjectId = vwObjectId;
    },

    /**
     * Update current administration main context.
     * 
     * @param {String} objectType 
     * @param {String} objectTypeName
     * @param {String} objectId
     * @param {Object} other
     * @return {Object} Current main context info.
     */
    updateCurrentAdministrationContext: function (objectType, objectTypeName, objectId, other) {
        return this.updateCurrentContext(
            this.contexts.administration,
            objectType,
            objectTypeName,
            objectId,
            other
        );
    },

    /**
     * Check the consistency of the current context.
     * 
     * @param {String} objectType
     * @param {String} objectTypeName
     * @return {Boolean} Return true if main content is consistent
     * with selection.
     */
    checkCurrentContext: function (objectType, objectTypeName, checkHierarchy) {
        var result = false;

        var context = this.getCurrentContext();
        if (!context) {
            result = false;
        } else {
            if (context.objectType === objectType && context.objectTypeName === objectTypeName) {
                result = true;
            } else if (!checkHierarchy) {
                result = false;
            } else {
                // check hierarchy
                var item;
                switch (objectType) {
                    case CMDBuildUI.util.helper.ModelHelper.objecttypes.klass:
                        item = CMDBuildUI.util.helper.ModelHelper.getClassFromName(objectTypeName);
                        break;
                    case CMDBuildUI.util.helper.ModelHelper.objecttypes.process:
                        item = CMDBuildUI.util.helper.ModelHelper.getProcessFromName(objectTypeName);
                        break;
                }
                if (item) {
                    result = Ext.Array.contains(item.getHierarchy(), context.objectTypeName);
                }
            }
        }

        if (!result) {
            this.clearCurrentRowTab();
        }

        return result;
    },

    /**
     * 
     * @param {*} className 
     * @param {*} classId 
     * @param {*} action 
     * @param {Boolean} skipContext if true skips the context check, default to false
     */
    getClassBaseUrl: function (className, classId, action, skipContext) {
        skipContext = skipContext == null ? false : true;
        var url = 'classes';

        if (className) {

            url = Ext.String.format("{0}/{1}/cards", url, className);

            if (action == CMDBuildUI.mixins.DetailsTabPanel.actions.create) {

                url = Ext.String.format('{0}/{1}', url, action);

            } else if (classId) {

                url = Ext.String.format("{0}/{1}", url, classId);

                if (action) {

                    url = Ext.String.format("{0}/{1}", url, action);
                }
            }
        }


        if (!skipContext) {
            switch (CMDBuildUI.util.Navigation._currentcontext.objectType) {
                case CMDBuildUI.util.helper.ModelHelper.objecttypes.custompage:
                    url = Ext.String.format(
                        "{0}/{1}/{2}",
                        'custompages',
                        CMDBuildUI.util.Navigation._currentcontext.objectTypeName,
                        url);
                    break;
                case CMDBuildUI.util.helper.ModelHelper.objecttypes.view:
                    url = Ext.String.format(
                        '{0}/{1}/{2}',
                        'views',
                        CMDBuildUI.util.Navigation._currentcontext.objectTypeName,
                        url
                    );
                    break;
                case CMDBuildUI.util.helper.ModelHelper.objecttypes.navtreecontent:
                    url = Ext.String.format(
                        '{0}/{1}/{2}',
                        'navigation',
                        CMDBuildUI.util.Navigation._currentcontext.objectTypeName,
                        url
                    );
                    break;
            }
        }

        return url;
    },

    /**
     * 
     * @param {*} processName 
     * @param {*} instanceId 
     * @param {*} activityId 
     * @param {*} action 
     * @param {Boolean} skipAction if true skips the context check, default to false
     */
    getProcessBaseUrl: function (processName, instanceId, activityId, action, skipContext) {
        skipContext = skipContext == null ? false : true;

        var url = '';

        if (processName) {
            url = Ext.String.format('processes/{0}/instances', processName);

            if (action == CMDBuildUI.mixins.DetailsTabPanel.actions.create) {
                url = Ext.String.format('{0}/{1}', url, action);

            }
            else if (instanceId) {
                url = Ext.String.format('{0}/{1}', url, instanceId);

                if (activityId) {
                    url = Ext.String.format('{0}/activities/{1}', url, activityId);

                    if (action) {
                        url = Ext.String.format('{0}/{1}', url, action);
                    }
                }
            }
        }

        if (!skipContext) {
            switch (CMDBuildUI.util.Navigation._currentcontext.objectType) {
                case CMDBuildUI.util.helper.ModelHelper.objecttypes.custompage:
                    url = Ext.String.format(
                        "{0}/{1}/{2}",
                        'custompages',
                        CMDBuildUI.util.Navigation._currentcontext.objectTypeName,
                        url);
                    break;
                case CMDBuildUI.util.helper.ModelHelper.objecttypes.view:
                    url = Ext.String.format(
                        '{0}/{1}/{2}',
                        'views',
                        CMDBuildUI.util.Navigation._currentcontext.objectTypeName,
                        url
                    );
                    break;
                case CMDBuildUI.util.helper.ModelHelper.objecttypes.navtreecontent:
                    url = Ext.String.format(
                        '{0}/{1}/{2}',
                        'navigation',
                        CMDBuildUI.util.Navigation._currentcontext.objectTypeName,
                        url
                    );
                    break;
            }
        }

        return url;
    },

    getScheduleBaseUrl: function (scheduleId, action, skipContext) {
        skipContext = skipContext == null ? false : true;

        var url = 'events';


        if (action == CMDBuildUI.mixins.DetailsTabPanel.actions.create) {

            url = Ext.String.format('{0}/{1}', url, action);
        } else {

            if (scheduleId) {
                url = Ext.String.format('{0}/{1}', url, scheduleId);

                if (action) {
                    url = Ext.String.format('{0}/{1}', url, action);
                }

            }
        }

        if (!skipContext) {
            switch (CMDBuildUI.util.Navigation._currentcontext.objectType) {
                case CMDBuildUI.util.helper.ModelHelper.objecttypes.custompage:
                    url = Ext.String.format(
                        "{0}/{1}/{2}",
                        'custompages',
                        CMDBuildUI.util.Navigation._currentcontext.objectTypeName,
                        url);
                    break;
                case CMDBuildUI.util.helper.ModelHelper.objecttypes.view:
                    url = Ext.String.format(
                        '{0}/{1}/{2}',
                        'views',
                        CMDBuildUI.util.Navigation._currentcontext.objectTypeName,
                        url
                    );
                    break;
            }
        }

        return url;
    },

    /**
     * 
     * @param {Number} objectId  The object id to check
     */
    checkCurrentManagementContextObjectId: function (objectId) {
        return this._currentcontext.objectId == objectId;
    },

    /**
     * @param {String} action
     * @return {Boolean}
     */
    checkCurrentManagementContextAction: function (action) {
        return this._currentcontext.currentaction === action;
    },

    /**
     * @param {String} activity
     * @return {Boolean}
     */
    checkCurrentManagementContextActivity: function (activity) {
        return this._currentcontext.currentactivity === activity;
    },

    checkCurrentManagementContextCustomPageObjectType: function (cpObjectType) {
        return this._currentcontext.cpObjectType === cpObjectType;
    },

    checkCurrentManagementContextViewObjectType: function (vwObjectType) {
        return this._currentcontext.vwObjectType === vwObjectType;
    },

    checkCurrentManagementContextCustomPageObjectTypeName: function (cpObjectTypeName) {
        return this._currentcontext.cpObjectTypeName === cpObjectTypeName;
    },

    checkCurrentManagementContextViewObjectTypeName: function (vwObjectTypeName) {
        return this._currentcontext.vwObjectTypeName === vwObjectTypeName;
    },

    checkCurrentManagementContextCustomPageObjectId: function (cpObjectId) {
        return this._currentcontext.cpObjectId === cpObjectId;
    },

    checkCurrentManagementContextViewObjectId: function (vwObjectId) {
        return this._currentcontext.vwObjectId === vwObjectId;
    },

    /**
     * 
     * @return {String} Current row tab.
     */
    getCurrentRowTab: function () {
        return this._currentrowtab;
    },

    /**
     * 
     * @param {String} tab selected tab in row
     */
    updateCurrentRowTab: function (tab) {
        this._currentrowtab = tab;
    },

    /**
     * 
     * @param {String} tab selected tab in row
     */
    clearCurrentRowTab: function () {
        if (
            this._currentrowtab !== CMDBuildUI.mixins.DetailsTabPanel.actions.view &&
            this._currentrowtab !== CMDBuildUI.mixins.DetailsTabPanel.actions.relations
        ) {
            this.updateCurrentRowTab();
        }
    },

    privates: {
        /**
         * @property {Object} _currentcontext
         * Current application context.
         */
        _currentcontext: {},

        /**
         * @property {String} _currentrowtab
         * Current row tab.
         */
        _currentrowtab: null
    }
});