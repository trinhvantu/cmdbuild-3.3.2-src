Ext.define('CMDBuildUI.util.administration.helper.LocalizationHelper', {
    singleton: true,


    getLocaleKeyOfClassDescription: function (theObjectTypeName) {
        return Ext.String.format('{0}.{1}.description', 'class', theObjectTypeName);
    },
    getLocaleKeyOfDashboardDescription: function (dashboardId) {
        return Ext.String.format('{0}.{1}.description', 'dashboard', dashboardId);
    },
    getLocaleKeyOfDashboardChartDescription: function (dashboardId, chartId) {
        return Ext.String.format('{0}.{1}.charts.{2}.description', 'dashboard', dashboardId, chartId);
    },
    getLocaleKeyOfDashboardChartCategoryAxis: function (dashboardId, chartId) {
        return Ext.String.format('{0}.{1}.charts.{2}.categoryAxisLabel', 'dashboard', dashboardId, chartId);
    },
    getLocaleKeyOfDashboardChartLabelField: function (dashboardId, chartId) {
        return Ext.String.format('{0}.{1}.charts.{2}.labelField', 'dashboard', dashboardId, chartId);
    },
    getLocaleKeyOfDashboardChartValueAxis: function (dashboardId, chartId) {
        return Ext.String.format('{0}.{1}.charts.{2}.valueAxisLabel', 'dashboard', dashboardId, chartId);
    },
    getLocaleKeyOfDashboardChartParameterName: function (dashboardName, chartId, index) {
        return Ext.String.format('{0}.{1}.charts.{2}.dsp.{3}.name', 'dashboard', dashboardName, chartId, index);
    },

    getLocaleKeyOfClassAttributeDescription: function (theObjectTypeName, theAttributeName) {
        return Ext.String.format('{0}.{1}.{2}.description', 'attributeclass', theObjectTypeName, theAttributeName);
    },
    getLocaleKeyOfAttributeFkMasterDetail: function (theObjectTypeName, theAttributeName) {
        return Ext.String.format('{0}.{1}.{2}.masterdetaillabel', 'attributeclass', theObjectTypeName, theAttributeName);
    },
    getLocaleKeyOfClassGroupDescription: function (className, groupName) {
        return Ext.String.format('{0}.{1}.{2}.description', 'attributegroupclass', className, groupName);
    },
    getLocaleKeyOfClassContextMenuItem: function (className, contextMenuName) {
        return Ext.String.format('{0}.{1}.{2}.description', 'contextmenu', className, contextMenuName);
    },
    getLocaleKeyOfProcessDescription: function (theProcessName) {
        return this.getLocaleKeyOfClassDescription(theProcessName);
    },

    getLocalKeyOfProcessActivityDescription: function (theProcessName, theActivityName) {
        return Ext.String.format('{0}.{1}.{2}.description', 'activity', theProcessName, theActivityName);
    },

    getLocalkeyOfProcessWidgetDescription: function (theProcessName, theActivityName, theWidgetName) {
        return Ext.String.format('{0}.{1}.{2}.{3}.description', 'widget', theProcessName, theActivityName, theWidgetName);
    },

    getLocaleKeyOfProcessAttributeDescription: function (theObjectTypeName, theAttributeName) {
        return Ext.String.format('{0}.{1}.{2}.description', 'class', theObjectTypeName, theAttributeName);
    },

    getLocaleKeyOfDomainDescription: function (domainName) {
        return Ext.String.format('{0}.{1}.description', 'domain', domainName);
    },

    getLocaleKeyOfDomainDirectDescription: function (domainName) {
        return Ext.String.format('{0}.{1}.directdescription', 'domain', domainName);
    },

    getLocaleKeyOfDomainInverseDescription: function (domainName) {
        return Ext.String.format('{0}.{1}.inversedescription', 'domain', domainName);
    },

    getLocaleKeyOfDomainMasterDetail: function (domainName) {
        return Ext.String.format('{0}.{1}.masterdetaillabel', 'domain', domainName);
    },

    getLocaleKeyOfDomainAttributeDescription: function (domainName, attributeName) {
        return Ext.String.format('{0}.{1}.{2}.description', 'attributedomain', domainName, attributeName);
    },

    getLocaleKeyOfViewDescription: function (viewName) {
        return Ext.String.format('{0}.{1}.description', 'view', viewName);
    },

    getLocaleKeyOfSearchFiltreDescription: function (className, filterName) {
        return Ext.String.format('{0}.{1}.{2}.description', 'filter', className, filterName);
    },

    getLocaleKeyOfLookupValueDescription: function (lookupTypeName, lookupValueCode) {
        return Ext.String.format('{0}.{1}.{2}.description', 'lookup', lookupTypeName, lookupValueCode);
    },

    getLocaleKeyOfReportDescription: function (reportName) {
        return Ext.String.format('{0}.{1}.description', 'report', reportName);
    },
    getLocaleKeyOfReportAttributeDescription: function (reportName, attributeName) {
        return Ext.String.format('{0}.{1}.{2}.description', 'class', reportName, attributeName);
    },

    getLocaleKeyOfMenuItemDescription: function (itemId) {
        return Ext.String.format('menuitem.{0}.description', itemId);
    },

    getLocaleKeyOfCustomPageDescription: function (custompageName) {
        return Ext.String.format('custompage.{0}.description', custompageName);
    },

    getLocaleKeyOfCustomComponentDescription: function (itemId) {
        return Ext.String.format('customcomponent.{0}.description', itemId);
    },

    getLocaleKeyOfScheduleDescription: function (scheduleId) {
        return Ext.String.format('schedule.{0}.description', scheduleId);
    },

    getLocaleKeyOfScheduleExtDescription: function (scheduleId) {
        return Ext.String.format('schedule.{0}.content', scheduleId);
    },

    getLocaleKeyOfNavigationTreeDescription: function (navigationTreeName) {
        return Ext.String.format('navtree.{0}.description', navigationTreeName);
    },
    getLocaleKeyOfGroupDescription: function (groupId) {
        return Ext.String.format('role.{0}.description', groupId);
    }


});