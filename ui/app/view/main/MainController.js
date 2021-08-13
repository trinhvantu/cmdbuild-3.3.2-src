/**
 * This class is the controller for the main view for the application. It is specified as
 * the "controller" of the Main view class.
 *
 * TODO - Replace this content of this view to suite the needs of your application.
 */
Ext.define('CMDBuildUI.view.main.MainController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.main',
    mixins: {
        managementroutes: 'CMDBuildUI.mixins.routes.Management',
        adminroutes: 'CMDBuildUI.mixins.routes.Administration'
    },

    control: {
        '#': {
            beforerender: 'onBeforeRender'
        }
    },

    routes: {
        '': {
            action: 'showManagement',
            before: 'onBeforeShowManagement'
        },
        'configuredb': {
            action: 'showConfigureDB'
        },
        'patches': {
            action: 'showPatches'
        },
        'login': {
            action: 'showLogin',
            before: 'onBeforeShowLogin'
        },
        'logout': {
            action: 'doLogout'
        },
        'gotomamagement': {
            action: 'goToManagement'
        },
        'management': {
            action: 'showManagement',
            before: 'onBeforeShowManagement'
        },
        'gotoadministration': {
            action: 'goToAdministration',
            before: 'adminAccess'
        },
        'administration': {
            action: 'showAdministration',
            before: 'onBeforeShowAdministration'
        },
        'administration/home': {
            action: 'showAdministrationHome'
            // before: 'onBeforeShowAdministration'
        },
        'administration/classes': {
            action: 'showClassAdministrationAdd',
            before: 'adminClassAdd'
        },
        'administration/classes_empty': {
            action: 'showClassAdministration_empty',
            before: 'adminClassAccess'
        },
        'administration/classes/:className': {
            action: 'showClassAdministrationView',
            before: 'adminClassAccess'
        },
        'administration/classes/:className/attribute/:attributeName': {
            action: 'showClassAttributeAdministrationView',
            before: 'adminClassAccess'
        },
        'administration/classes/:className/attribute/:attributeName/edit': {
            action: 'showClassAttributeAdministrationEdit',
            before: 'adminClassAccess'
        },
        'administration/lookup_types': {
            action: 'showLookupTypeAdministrationAdd',
            before: 'adminLookupAdd'
        },
        'administration/lookup_types_empty': {
            action: 'showLookupTypeAdministration_empty',
            before: 'adminLookupTypeAccess'
        },
        'administration/lookup_types/:lookupName': {
            action: 'showLookupTypeAdministrationView',
            before: 'adminLookupTypeAccess'
        },
        // TODO permission
        'administration/dms': {
            action: 'showDMSAdministrationView',
            before: 'adminAccess'
        },
        'administration/dmsmodels_empty': {
            action: 'showDMSModelsAdministrationView_empty',
            before: 'adminDMSAccess'
        },
        'administration/dmsmodels': {
            action: 'showDMSModelsAdministrationView',
            before: 'adminDMSAdd'
        },
        'administration/dmsmodels/:modelName': {
            action: 'showDMSModelsAdministrationView',
            before: 'adminDMSAccess'
        },
        'administration/dmscategories_empty': {
            action: 'showDMSCategoriesAdministrationView_empty',
            before: 'adminDMSAccess'
        },
        'administration/dmscategories': {
            action: 'showDMSCategoriesAdministrationView',
            before: 'adminDMSAdd'
        },
        'administration/dmscategories/:categoryTypeHash': {
            action: 'showDMSCategoriesAdministrationView',
            before: 'adminDMSAccess'
        },
        'administration/domains': {
            action: 'showDomainAdministrationCreate',
            before: 'adminDomainAdd'
        },
        'administration/domains_empty': {
            action: 'showDomainAdministration_empty',
            before: 'adminDomainAccess'
        },
        'administration/domains/:domain': {
            action: 'showDomainAdministrationView',
            before: 'adminDomainAccess'
        },
        'administration/menus/:device/:menu': {
            action: 'showMenuAdministrationView',
            before: 'adminMenuAccess',
            conditions: {
                ':device': Ext.String.format('({0}|{1})', CMDBuildUI.model.menu.Menu.device.mobile, CMDBuildUI.model.menu.Menu.device['default'])
            }
        },
        'administration/menus/:device': {
            action: 'showMenuAdministrationAdd',
            before: 'adminMenuAccess',
            conditions: {
                ':device': Ext.String.format('({0}|{1})', CMDBuildUI.model.menu.Menu.device.mobile, CMDBuildUI.model.menu.Menu.device['default'])
            }
        },
        'administration/menus_empty': {
            action: 'showMenuAdministration_empty',
            before: 'adminMenuAccess'
        },
        'administration/menus_empty/:device': {
            action: 'showMenuAdministration_empty',
            before: 'adminMenuAccess',
            conditions: {
                ':device': Ext.String.format('({0}|{1})', CMDBuildUI.model.menu.Menu.device.mobile, CMDBuildUI.model.menu.Menu.device['default'])
            }
        },
        'administration/menunavigationtrees_empty/:showForm': {
            action: 'showMenuNavigationtreeAdministrationView_empty',
            before: 'adminMenuAccess'
        },
        'administration/menunavigationtrees/:navigationtreeId': {
            action: 'showMenuNavigationtreeAdministrationView',
            before: 'adminMenuAccess'
        },
        'administration/processes': {
            action: 'showProcessesAdministrationAdd',
            before: 'adminProcessAdd'
        },
        'administration/processes_empty': {
            action: 'showProcessAdministration_empty',
            before: 'adminProcessAccess'
        },
        'administration/processes/:process': {
            action: 'showProcessAdministrationView',
            before: 'adminProcessAccess'
        },
        'administration/reports_empty/:showForm': {
            action: 'showReportAdministration_empty',
            before: 'adminReportAccess'
        },
        'administration/reports_empty': {
            action: 'showReportAdministration_empty',
            before: 'adminReportAccess'
        },
        'administration/reports/:reportId': {
            action: 'showReportAdministrationView',
            before: 'adminReportAccess'
        },
        'administration/custompages_empty/:showForm': {
            action: 'showCustompageAdministrationGeneric_empty',
            before: 'adminUiComponentAccess',
            conditions: {
                ':showForm': '(true|false)'
            }
        },
        'administration/custompages_empty/:device/:showForm': {
            action: 'showCustompageAdministration_empty',
            before: 'adminUiComponentAccess',
            conditions: {
                ':device': Ext.String.format('({0}|{1})', CMDBuildUI.model.custompages.CustomPage.device.mobile, CMDBuildUI.model.custompages.CustomPage.device['default']),
                ':showForm': '(true|false)'
            }
        },
        'administration/custompages/:device/:custompageId': {
            action: 'showCustompageAdministrationView',
            before: 'adminUiComponentAccess',
            conditions: {
                ':device': Ext.String.format('({0}|{1})', CMDBuildUI.model.custompages.CustomPage.device.mobile, CMDBuildUI.model.custompages.CustomPage.device['default']),
                ':custompageId': '([0-9]+)'
            }
        },
        'administration/customcomponents_empty': {
            action: 'showCustomcomponentAdministration_empty',
            before: 'adminUiComponentAccess'
        },
        'administration/customcomponents_empty/:componentType': {
            action: 'showCustomcomponentAdministrationView_empty',
            before: 'adminUiComponentAccess'
        },
        'administration/customcomponents/:componentType/:customcomponentId': {
            action: 'showCustomcomponentAdministrationView',
            before: 'adminUiComponentAccess',
            conditions: {
                ':componentType': '(contextmenu|widget)',                
                ':customcomponentId': '([0-9]+)'
            }
        },
        'administration/customcomponents_empty/:componentType/:deviceType/:showForm': {
            action: 'showCustomcomponentAdministrationView_empty',
            before: 'adminUiComponentAccess',
            conditions: {
                ':componentType': '(contextmenu|widget)',
                ':deviceType': Ext.String.format('({0}|{1})', CMDBuildUI.model.custompages.CustomPage.device.mobile, CMDBuildUI.model.custompages.CustomPage.device['default']),
                ':showForm': '(true|false)'
            }
        },
        'administration/groupsandpermissions_empty/:showForm': {
            action: 'showGroupsandpermissionsAdministration_empty',
            before: 'adminRoleAccess'
        },
        'administration/groupsandpermissions_empty': {
            action: 'showGroupsandpermissionsAdministration_empty',
            before: 'adminRoleAccess'
        },
        'administration/groupsandpermissions/:roleId': {
            action: 'showGroupsandpermissionsAdministrationView',
            before: 'adminRoleAccess'
        },
        'administration/users': {
            action: 'showUsersAdministrationView',
            before: 'adminUserAccess'
        },
        'administration/users_empty': {
            action: 'showUsersAdministrationView_empty',
            before: 'adminUserAccess'
        },
        'administration/setup_empty': {
            action: 'showSetupAdministrationView_empty',
            before: 'adminSetupAccess'
        },
        'administration/setup/:setupPage': {
            action: 'showSetupAdministrationView',
            before: 'adminSetupAccess'
        },
        'administration/email_empty': {
            action: 'showEmailAdministrationView_empty',
            before: 'adminEmailAccess'
        },
        'administration/email/templates': {
            action: 'showEmailTemplatesAdministrationView',
            before: 'adminEmailAccess'
        },
        'administration/email/accounts': {
            action: 'showEmailAccountsAdministrationView',
            before: 'adminEmailAccess'
        },
        'administration/email/queue': {
            action: 'showEmailQueueAdministrationView',
            before: 'adminEmailAccess'
        },
        'administration/localizations/localization': {
            action: 'showLocalizationsLocalizationAdministrationView',
            before: 'adminLocalizationAccess'
        },
        'administration/localization_empty': {
            action: 'showLocalizationAdministrationView_empty',
            before: 'adminLocalizationAccess'
        },
        'administration/localizations/configuration': {
            action: 'showLocalizationsConfigurationAdministrationView',
            before: 'adminLocalizationAccess'
        },
        'administration/navigationtrees/:navigationtreeId': {
            action: 'showNavigationtreeAdministrationView',
            before: 'adminNavTreeAccess'
        },
        'administration/navigationtrees_empty/:showForm': {
            action: 'showNavigationtreeAdministrationView_empty',
            before: 'adminNavTreeAccess'
        },
        'administration/tasks': {
            action: 'showTaskImportExportAdministrationView',
            before: 'adminTaskAccess'
        },
        'administration/tasks/:type': {
            action: 'showTaskImportExportAdministrationView',
            before: 'adminTaskAccess'
        },
        
        'administration/tasks/:type/:subtype': {
            action: 'showTaskImportExportAdministrationView',
            before: 'adminTaskAccess',
            conditions: {
                ':type': '(etl)',
                ':subtype': '(cad|database|ifc)'
            }
        },

        'administration/searchfilters/:searchfilter': {
            action: 'showSearchFilterAdministrationView',
            before: 'adminSearchFilterAccess'
        },
        'administration/searchfilters_empty/:showForm': {
            action: 'showSearchFilterAdministrationView_empty',
            before: 'adminSearchFilterAccess'
        },
        'administration/dashboards/:dashboardId': {
            action: 'showDashboardAdministrationView',
            before: 'adminDashboardAccess',
            conditions: {
                ':dashboardId': '([0-9]+)'
            }
        },
        'administration/dashboards_empty/:showForm': {
            action: 'showDashboardAdministrationView',
            before: 'adminDashboardAccess',
            conditions: {
                ':showForm': '(true|false)'
            }
        },
        'administration/dashboards': {
            action: 'showDashboardAdministrationView',
            before: 'adminDashboardAccess'
        },

        'administration/views/:viewName': {
            action: 'showViewAdministrationView',
            before: 'adminViewAccess'
        },
        'administration/views_empty/:showForm': {
            action: 'showViewAdministrationView_empty',
            before: 'adminViewAccess'
        },
        'administration/joinviews_empty/:showForm': {
            action: 'showJoinViewAdministrationView_empty',
            before: 'adminViewAccess'
        },
        'administration/joinviews/:viewId': {
            action: 'showJoinViewAdministrationView',
            before: 'adminViewAccess'
        },    
        'administration/views_empty/:showForm/:viewType': {
            action: 'showViewAdministrationView_empty',
            before: 'adminViewAccess'
        },
        'administration/schedules/ruledefinitions': {
            action: 'showSchedulesAdministrationView',
            before: 'adminScheduleAccess'
        },
        'administration/schedules/settings': {
            action: 'showSchedulesSettingsAdministrationView',
            before: 'adminSetupAccess'
        },
        'administration/schedules_empty': {
            action: 'showSchedulesAdministrationView_empty',
            before: 'adminScheduleAccess'
        },
        'administration/gis_empty': {
            action: 'showGisAdministrationView_empty',
            before: 'adminAccess'
        },
        'administration/gis/manageicons': {
            action: 'showGisManageIconsAdministrationView',
            before: 'adminGisAccess'
        },
        'administration/gis/externalservices': {
            action: 'showGisExternalServicesAdministrationView',
            before: 'adminGisExternalServicesAccess'
        },
        'administration/gis/layersorder': {
            action: 'showGisLayersOrderAdministrationView',
            before: 'adminGisAccess'
        },
        'administration/gis/geoserverslayers': {
            action: 'showGisGeoserversLayersAdministrationView',
            before: 'adminGisAccess'
        },
        'administration/gis/gisnavigation': {
            action: 'showGisGisNavigationAdministrationView',
            before: 'adminGisAccess'
        },
        'administration/gis/thematism': {
            action: 'showGisThematismAdministrationView',
            before: 'adminGisAccess'
        },
        'administration/bim_empty': {
            action: 'showBimAdministrationView_empty',
            before: 'adminAccess'
        },
        'administration/bim/projects': {
            action: 'showBimProjectsAdministrationView',
            before: 'adminBimAccess'
        },
        'administration/bim/layers': {
            action: 'showBimNavigationAdministrationView',
            before: 'adminBimAccess'
        },
        'administration/importexport_empty': {
            action: 'showImportExportAdministrationView_empty',
            before: 'adminImportExportAccess'
        },
        'administration/importexport/datatemplates_empty/:hideForm': {
            action: 'showDataETLAdministrationView_empty',
            before: 'adminImportExportAccess'
        },
        'administration/importexport/datatemplates': {
            action: 'showDataETLAdministrationView',
            before: 'adminImportExportAccess'
        },
        'administration/importexport/datatemplates/clone/:templateId': {
            action: 'showCloneDataETLAdministrationView',
            before: 'adminImportExportAccess'
        },
        'administration/importexport/datatemplates/:templateId': {
            action: 'showDataETLAdministrationView',
            before: 'adminImportExportAccess'
        },
        'administration/importexport/gatetemplates_empty/:gateType/:showForm?': {
            action: 'showGISETLAdministrationView_empty',
            before: 'adminImportExportAccess'
        },
        'administration/importexport/gatetemplates/:gateType': {
            action: 'showGISETLAdministrationView',
            before: 'adminImportExportAccess'
        },
        'administration/importexport/gatetemplates/:gateType/:gateCode': {
            action: 'showGISETLAdministrationView',
            before: 'adminImportExportAccess'
        },
        /* END ADMINISTRATION ROUTES */

        // CLASSES
        'classes/:className/cards': {
            action: 'showCardsGrid',
            before: 'onBeforeShowCardsGrid'
        },
        'classes/:className/cards/:idCard': {
            action: 'showCard',
            before: 'onBeforeShowCard',
            conditions: {
                ':idCard': '([0-9]+)'
            }
        },
        'classes/:className/cards/new': {
            action: 'showCardCreate',
            before: 'onBeforeShowCardWindow'
        },
        'classes/:className/cards/:idCard/view': {
            action: 'showCardView',
            before: 'onBeforeShowCardWindow'
        },
        'classes/:className/cards/:idCard/clone': {
            action: 'showCardClone',
            before: 'onBeforeShowCardWindow'
        },
        'classes/:className/cards/:idCard/clonecardandrelations': {
            action: 'showCardCloneandRelations',
            before: 'onBeforeShowCardWindow'
        },
        'classes/:className/cards/:idCard/edit': {
            action: 'showCardEdit',
            before: 'onBeforeShowCardWindow'
        },
        'classes/:className/cards/:idCard/details': {
            action: 'showCardDetails',
            before: 'onBeforeShowCardWindow'
        },
        'classes/:className/cards/:idCard/notes': {
            action: 'showCardNotes',
            before: 'onBeforeShowCardWindow'
        },
        'classes/:className/cards/:idCard/relations': {
            action: 'showCardRelations',
            before: 'onBeforeShowCardWindow'
        },
        'classes/:className/cards/:idCard/history': {
            action: 'showCardHistory',
            before: 'onBeforeShowCardWindow'
        },
        'classes/:className/cards/:idCard/emails': {
            action: 'showCardEmails',
            before: 'onBeforeShowCardWindow'
        },
        'classes/:className/cards/:idCard/attachments': {
            action: 'showCardAttachments',
            before: 'onBeforeShowCardWindow'
        },
        'classes/:className/cards/:idCard/schedules': {
            action: 'showCardSchedules',
            before: 'onBeforeShowCardWindow'
        },
        // PROCESSES
        'processes/:processName/instances': {
            action: 'showProcessInstancesGrid',
            before: 'onBeforeShowProcessInstancesGrid'
        },
        'processes/:processName/instances/new': {
            action: 'showProcessInstanceCreate',
            before: 'onBeforeShowProcessInstanceWindow'
        },
        'processes/:processName/instances/:idInstance': {
            action: 'showProcessInstance',
            before: 'onBeforeShowProcessInstance',
            conditions: {
                ':idInstance': '([0-9]+)'
            }
        },
        'processes/:processName/instances/:idInstance/view': {
            action: 'openProcessInstanceView'
        },
        'processes/:processName/instances/:idInstance/edit': {
            action: 'openProcessInstanceEdit'
        },
        'processes/:processName/instances/:idInstance/activities/:activityId/view': {
            action: 'showProcessInstanceView',
            before: 'onBeforeShowProcessInstanceWindow'
        },
        'processes/:processName/instances/:idInstance/activities/:activityId/edit': {
            action: 'showProcessInstanceEdit',
            before: 'onBeforeShowProcessInstanceWindow'
        },
        'processes/:processName/instances/:idInstance/activities/:activityId/notes': {
            action: 'showProcessInstanceNotes',
            before: 'onBeforeShowProcessInstanceWindow'
        },
        'processes/:processName/instances/:idInstance/activities/:activityId/relations': {
            action: 'showProcessInstanceRelations',
            before: 'onBeforeShowProcessInstanceWindow'
        },
        'processes/:processName/instances/:idInstance/activities/:activityId/history': {
            action: 'showProcessInstanceHistory',
            before: 'onBeforeShowProcessInstanceWindow'
        },
        'processes/:processName/instances/:idInstance/activities/:activityId/emails': {
            action: 'showProcessInstanceEmails',
            before: 'onBeforeShowProcessInstanceWindow'
        },
        'processes/:processName/instances/:idInstance/activities/:activityId/attachments': {
            action: 'showProcessInstanceAttachments',
            before: 'onBeforeShowProcessInstanceWindow'
        },
        // CUSTOM PAGES
        'custompages/:pageName': {
            action: 'showCustomPage',
            before: 'onBeforeShowCustomPage'
        },
        'custompages/:pageName/:processes/:typename/instances': {
            action: 'showCustomPage',
            before: 'onBeforeShowCustomPage',
            conditions: {
                ':processes': '(processes)'
            }
        },
        'custompages/:pageName/:classes/:typename/cards': {
            action: 'showCustomPage',
            before: 'onBeforeShowCustomPage',
            conditions: {
                ':classes': '(classes)'
            }
        },
        'custompages/:pageName/:classes/:className/cards/:cardId': {
            action: 'showCustomPage',
            before: 'onBeforeShowCpCard',
            conditions: {
                ':cardId': '([0-9]+)',
                ':classes': '(classes)'
            }
        },
        'custompages/:pageName/:processes/:processName/instances/:idInstance': {
            action: 'showCustomPage',
            before: 'onBeforeShowCpProcessInstance',
            conditions: {
                ':idInstance': '([0-9]+)',
                ':processes': '(processes)'
            }
        },
        'custompages/:pageName/classes/:className/cards/:new': {
            action: 'showCpCardAction',
            before: 'onBeforeShowCpCardWindow',
            conditions: {
                ':new': '(new)'
            }
        },
        'custompages/:pageName/classes/:className/cards/:cardId/:action': {
            action: 'showCpCardAction',
            before: 'onBeforeShowCpCardWindow',
            conditions: {
                ':cardId': '([0-9]+)'
            }
        },
        'custompages/:pageName/processes/:processName/instances/:new': {
            action: 'showCpProcessInstanceAction',
            before: 'onBeforeShowCpProcessInstanceWindow',
            conditions: {
                ':new': '(new)'
            }
        },
        'custompages/:pageName/processes/:processName/instances/:idInstance/activities/:activityId/:action': {
            action: 'showCpProcessInstanceAction',
            before: 'onBeforeShowCpProcessInstanceWindow'
        },
        // REPORTS
        'reports/:reportName': {
            action: 'showReport',
            before: 'onBeforeShowReport'
        },
        'reports/:reportName/:extension': {
            action: 'showReportExtension',
            before: 'onBeforeShowReportExtension'
        },
        // VIEWS
        'views/:viewName/:items': {
            action: 'showView',
            before: 'onBeforeShowView',
            conditions: {
                ':items': '(items)'
            }
        },
        'views/:viewName/:events': {
            action: 'showView',
            before: 'onBeforeShowView',
            conditions: {
                ':events': '(events)'
            }
        },
        'views/:viewName/:classes/:className/cards': {
            action: 'showView',
            before: 'onBeforeShowView',
            conditions: {
                ':classes': '(classes)'
            }
        },
        'views/:viewName/:processes/:processName/instances': {
            action: 'showView',
            before: 'onBeforeShowView',
            conditions: {
                ':processes': '(processes)'
            }
        },
        'views/:viewName/:classes/:className/cards/:cardId': {
            action: 'showView',
            before: 'onBeforeShowVwCard',
            conditions: {
                ':classes': '(classes)',
                ':cardId': '([0-9]+)'
            }
        },
        'views/:viewName/:events/:eventId': {
            action: 'showView',
            before: 'onBeforeShowVwEvent',
            conditions: {
                ':events': '(events)',
                ':eventId': '([0-9]+)'
            }
        },
        'views/:viewName/:processes/:processName/instances/:idInstance': {
            action: 'showView',
            before: 'onBeforeShowVwProcess',
            conditions: {
                ':processes': '(processes)',
                ':idInstance': '([0-9]+)'
            }
        },

        //events action
        'views/:viewName/:events/:eventId/:action': {
            action: 'showVwEventAction',
            before: 'onBeforeShowVwEventWindow',
            conditions: {
                ':events': '(events)'
            }
        },
        'views/:viewName/:events/:new': {
            action: 'showVwEventAction',
            before: 'onBeforeShowVwEventWindow',
            conditions: {
                ':events': '(events)',
                ':new': '(new)'
            }
        },

        //class action
        'views/:viewName/:classes/:className/cards/:cardId/:action': {
            action: 'showVwClassAction',
            before: 'onBeforeShowVwClassWindow',
            conditions: {
                ':classes': '(classes)'
            }
        },
        'views/:viewName/:classes/:className/cards/:new': {
            action: 'showVwClassAction',
            before: 'onBeforeShowVwClassWindow',
            conditions: {
                ':classes': '(classes)',
                ':new': '(new)'
            }
        },

        //process action
        'views/:viewName/:processes/:processName/instances/:idInstance/activities/:activityId/:action': {
            action: 'showVwProcessInstanceAction',
            before: 'onBeforeShowVwProcessInstanceWindow',
            conditions: {
                ':processes': '(processes)'
            }
        },
        'views/:viewName/:processes/:processName/instances/:new': {
            action: 'showVwProcessInstanceAction',
            before: 'onBeforeShowCpProcessInstanceWindow',
            conditions: {
                ':processes': '(processes)',
                ':new': '(new)'
            }
        },

        // DASHBOARDS
        'dashboards/:dashboardName': {
            action: 'showDashboard',
            before: 'onBeforeShowDashboard'
        },
        // EVENTS
        'events': {
            action: 'showEvents',
            before: 'beforeShowEvents'
        },
        'events/:idEvent': {
            action: 'showEvent',
            before: 'beforeShowEvent',
            conditions: {
                ':idEvent': '([0-9]+)'
            }
        },
        'events/:idEvent/view': {
            action: 'showEventView',
            before: 'onBeforeShowEventWindow'
        },
        'events/:idEvent/edit': {
            action: 'showEventEdit',
            before: 'onBeforeShowEventWindow'
        },
        'events/new': {
            action: 'showEventCreate',
            before: 'onBeforeShowEventWindow'
        },
        'events/:idEvent/notes': {
            action: 'showEventNotes',
            before: 'onBeforeShowEventWindow'
        },
        'events/:idEvent/history': {
            action: 'showEventHistory',
            before: 'onBeforeShowEventWindow'
        },
        'events/:idEvent/emails': {
            action: 'showEventEmails',
            before: 'onBeforeShowEventWindow'
        },
        'events/:idEvent/attachments': {
            action: 'showEventAttachments',
            before: 'onBeforeShowEventWindow'
        },

        // NAVIGATION TREE
        'navigation/:navTreeName': {
            action: 'showNavigationTreeContent'
        },

        'navigation/:navTreeName/classes/:className/cards': {
            action: 'navigationCards'
        },

        'navigation/:navTreeName/classes/:className/cards/:cardId': {
            action: 'navigationCardsId',
            conditions: {
                'cardId': '([0-9]+)'
            }
        },

        'navigation/:navTreeName/classes/:className/cards/:cardId/:action': {
            action: 'navigationCardsIdAction',
            conditions: {
                'cardId': '([0-9]+)',
                'action': '([view|edit|details|notes|relations|history|emails|attachments|schedules])'
            }
        },
        'navigation/:navTreeName/classes/:className/cards/:action': {
            action: 'navigationCardsCreate',
            conditions: {
                'cardId': '([0-9]+)',
                'action': '(new)'
            }
        }
    },

    init: function () {
        this.callParent(arguments);
        var routes = CMDBuildUI.util.Navigation._customroutes;
        if (routes) {
            CMDBuildUI.util.api.Client.addRoutes(routes, this);
            delete CMDBuildUI.util.Navigation._customroutes;
        }
    },

    onBeforeRender: function () {
        var me = this;
        var currentUrl = Ext.History.getToken();
        CMDBuildUI.util.helper.SessionHelper.updateStartingUrlWithCurrentUrl();
        if (currentUrl === 'gotoadministration') {
            me.redirectTo('administration', true);
        } else if (currentUrl !== 'login') {
            me.redirectTo('login');
        }
    }
});