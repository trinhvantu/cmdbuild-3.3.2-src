/**
 * The main application class. An instance of this class is created by app.js when it
 * calls Ext.application(). This is the ideal place to handle application launch and
 * initialization details.
 */
Ext.define('CMDBuildUI.Application', {
    extend: 'Ext.app.Application',
    requires: [
        // grid features
        'Ext.grid.feature.*',

        // validators
        'Ext.data.validator.*',

        // mixins
        'CMDBuildUI.mixins.*',

        // models
        'CMDBuildUI.model.*',

        // stores
        'CMDBuildUI.store.*',

        // helpers
        'CMDBuildUI.util.*',

        // components
        'CMDBuildUI.components.*',

        // views
        'CMDBuildUI.view.*',

        // locales
        'CMDBuildUI.locales.Locales',

        // charts
        'Ext.chart.*',

        // extra form fields
        'Ext.ux.form.*'
    ],

    name: 'CMDBuildUI',

    stores: [
        'icons.Icons',
        'users.Tenants',
        'groups.Grants',
        'groups.Groups',
        'classes.Classes',
        'calendar.Triggers',
        'attributes.UnifOfMeasureLocations',
        'menu.Menu',
        'menu.NavigationTrees',
        'administration.MenuAdministration',        
        'administration.common.WidgetTypes',
        'administration.common.Applicability',
        'administration.emails.Queue',
        'administration.processes.Engines',
        'administration.emails.ContentTypes',
        'emails.Accounts',
        'emails.Templates',
        'searchfilters.Searchfilters',
        'importexports.Templates',
        'importexports.Gates',
        'importexports.GateTemplates',
        'Functions',
        'tasks.Tasks',
        'processes.Processes',
        'reports.Reports',
        'dashboards.Dashboards',
        'views.Views',
        'custompages.CustomPages',
        'customcomponents.ContextMenus',
        'customcomponents.Widgets',
        'domains.Domains',
        'map.ExternalLayerExtends',
        'lookups.LookupTypes',
        'bim.Projects',
        'navigationtrees.NavigationTrees',
        'localizations.LocalizationsByCode',
        'dms.DMSModels',
        'dms.DMSCategoryTypes'

    ],

    launch: function () {
        // Initialize Ajax
        CMDBuildUI.util.Ajax.init();

        // load localization
        CMDBuildUI.util.helper.SessionHelper.loadLocale();

        if (!String.prototype.includes) {
            String.prototype.includes = function () {
                'use strict';
                return String.prototype.indexOf.apply(this, arguments) !== -1;
            };
        }
    },

    onAppUpdate: function () {
        Ext.MessageBox.show({
            title: CMDBuildUI.locales.Locales.administration.common.messages.applicationupdate,
            message: CMDBuildUI.locales.Locales.administration.common.messages.applicationreloadquest,
            buttons: Ext.Msg.YESNO,
            icon: Ext.Msg.QUESTION,
            buttonText: {
                yes: CMDBuildUI.locales.Locales.administration.common.actions.yes,
                no: CMDBuildUI.locales.Locales.administration.common.actions.no
            },
            fn: function (buttonText) {
                if (buttonText === 'yes') {
                    window.location.reload();
                }
            }
        });
    }
});
