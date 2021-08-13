(function() {
    Ext.define('CMDBuildUI.locales.en.Locales', {
        "requires": ["CMDBuildUI.locales.en.LocalesAdministration"],
        "override": "CMDBuildUI.locales.Locales",
        "singleton": true,
        "localization": "en",
        "administration": CMDBuildUI.locales.en.LocalesAdministration.administration,
        "attachments": {
            "add": "Add attachment",
            "attachmenthistory": "Attachment History",
            "author": "Author",
            "browse": "Browse &hellip;",
            "category": "Category",
            "code": "Code",
            "creationdate": "Creation date",
            "deleteattachment": "Delete attachment",
            "deleteattachment_confirmation": "Are you sure that you want to delete this attachment?",
            "description": "Description",
            "download": "Download",
            "dropfiles": "Drop files here",
            "editattachment": "Modify attachment",
            "file": "File",
            "filealreadyinlist": "The file {0} is already in list.",
            "filename": "File name",
            "fileview": "View attachment",
            "invalidfiles": "Remove invalid files",
            "majorversion": "Major version",
            "modificationdate": "Modification date",
            "new": "New attachment",
            "nocategory": "Uncategorized",
            "preview": "Preview",
            "removefile": "Remove file",
            "statuses": {
                "empty": "Empty file",
                "error": "Error",
                "extensionNotAllowed": "File extension not allowed",
                "loaded": "Loaded",
                "ready": "Ready"
            },
            "successupload": "{0} attachments uploaded.",
            "uploadfile": "Upload file...",
            "version": "Version",
            "viewhistory": "View attachment history",
            "warningmessages": {
                "atleast": "Warning:{0} attachments of type \"{1}\" have been loaded. This category expects at least {2} attachments.",
                "exactlynumber": "Warning:{0} attachments of type \"{1}\" have been loaded. This category expects {2} attachments.",
                "maxnumber": "Warning:{0} attachments of type \"{1}\" have been loaded. This category expects at most {2}  attachments."
            },
            "wrongfileextension": "{0} file extension is not allowed"
        },
        "bim": {
            "bimViewer": "Bim Viewer",
            "card": {
                "label": "Card"
            },
            "layers": {
                "label": "Layers",
                "menu": {
                    "hideAll": "Hide All",
                    "showAll": "Show All"
                },
                "name": "Name",
                "qt": "Qt",
                "visibility": "Visibility"
            },
            "menu": {
                "camera": "Camera",
                "frontView": "Front View",
                "mod": "Viewer controls",
                "orthographic": "Orthographic Camera",
                "pan": "Scroll",
                "perspective": "Perspective Camera",
                "resetView": "Reset View",
                "rotate": "rotate",
                "sideView": "Side View",
                "topView": "Top View"
            },
            "showBimCard": "Open 3D viewer",
            "tree": {
                "arrowTooltip": "Select element",
                "columnLabel": "Tree",
                "label": "Tree",
                "open_card": "Open related card",
                "root": "Ifc Root"
            }
        },
        "bulkactions": {
            "abort": "Abort selected items",
            "cancelselection": "Cancel selection",
            "confirmabort": "You are aborting {0} process instances. Are you sure that you want to proceed?",
            "confirmdelete": "You are deleting {0} cards. Are you sure that you want to proceed?",
            "confirmdeleteattachements": "You are deleting {0} attachments. Are you sure that you want to proceed?",
            "confirmedit": "You are modifying {0} on {1} cards. Are you sure that you want to proceed?",
            "delete": "Delete selected items",
            "download": "Download selected attachments",
            "edit": "Edit selected items",
            "selectall": "Select all items"
        },
        "calendar": {
            "active_expired": "Active/Expired",
            "add": "Add schedule",
            "advancenotification": "Days advance notification",
            "allcategories": "All categories",
            "alldates": "All dates",
            "calculated": "Calculated",
            "calendar": "Calendar",
            "cancel": "Mark as cancelled",
            "category": "Category",
            "cm_confirmcancel": "Are you sure that you want to mark as cancelled selected schedules?",
            "cm_confirmcomplete": "Are you sure that you want to mark as completed selected schedules?",
            "cm_markcancelled": "Mark as cancelled selected schedules",
            "cm_markcomplete": "Mark as completed selected schedules",
            "complete": "Mark as done",
            "completed": "Completed",
            "date": "Date",
            "days": "Days",
            "delaybeforedeadline": "Delay before deadline",
            "delaybeforedeadlinevalue": "Delay before deadline value",
            "description": "Description",
            "editevent": "Edit schedule",
            "enddate": "End Date",
            "endtype": "End type",
            "event": "Schedule",
            "executiondate": "Execution Date",
            "frequency": "Frequency",
            "frequencymultiplier": "Frequency multiplier",
            "grid": "Grid",
            "leftdays": "Days to go",
            "londdescription": "Full Description",
            "manual": "Manual",
            "maxactiveevents": "Max active schedules",
            "messagebodydelete": "Would you like to remove schedulers rule?",
            "messagebodyplural": "There are {0} schedule rules",
            "messagebodyrecalculate": " Would you like to recalculate the schedules rule with the new date?",
            "messagebodysingular": "There is {0} schedule rule",
            "messagetitle": "Schedule recalculating",
            "missingdays": "Missing days",
            "next30days": "Next 30 days",
            "next7days": "Next 7 days",
            "notificationtemplate": "Template used for notification",
            "notificationtext": "Notification text",
            "occurencies": "Number of occurencies",
            "operation": "Operation",
            "partecipantgroup": "Partecipant group",
            "partecipantuser": "Partecipant user",
            "priority": "Priority",
            "recalculate": "Recalculate",
            "referent": "Referent",
            "scheduler": "Scheduler",
            "sequencepaneltitle": "Generate schedules",
            "startdate": "Start Date",
            "status": "Status",
            "today": "Today",
            "type": "Type",
            "viewevent": "View schedule",
            "widgetcriterion": "Calculation criterion",
            "widgetemails": "Emails",
            "widgetsourcecard": "Source card"
        },
        "classes": {
            "cards": {
                "addcard": "Add card",
                "clone": "Clone",
                "clonewithrelations": "Clone card and relations",
                "deletebeaware": "Be aware that:",
                "deleteblocked": "It is not possible to proceed with the deletion because there are relations with {0}.",
                "deletecard": "Delete card",
                "deleteconfirmation": "Are you sure that you want to delete this card?",
                "deleterelatedcards": "also {0} related cards will be deleted",
                "deleterelations": "relations with {0} cards will be deleted",
                "label": "Cards",
                "modifycard": "Modify card",
                "opencard": "Open card",
                "print": "Print card"
            },
            "simple": "Simple",
            "standard": "Standard"
        },
        "common": {
            "actions": {
                "add": "Add",
                "apply": "Apply",
                "cancel": "Cancel",
                "close": "Close",
                "delete": "Delete",
                "edit": "Edit",
                "execute": "Execute",
                "help": "Help",
                "load": "Load",
                "open": "Open",
                "refresh": "Refresh data",
                "remove": "Remove",
                "save": "Save",
                "saveandapply": "Save and apply",
                "saveandclose": "Save and close",
                "search": "Search",
                "searchtext": "Search..."
            },
            "attributes": {
                "nogroup": "Base data"
            },
            "dates": {
                "date": "d/m/Y",
                "datetime": "d/m/Y H:i:s",
                "time": "H:i:s"
            },
            "editor": {
                "clearhtml": "Clear HTML",
                "expand": "Expand editor",
                "reduce": "Reduce editor",
                "unlink": "Unlink",
                "unlinkmessage": "Transform the selected hyperlink into text."
            },
            "grid": {
                "disablemultiselection": "Disable multi selection",
                "enamblemultiselection": "Enable multi selection",
                "export": "Export data",
                "filterremoved": "The current filter has been removed",
                "import": "Import data",
                "itemnotfound": "Item not found",
                "list": "List",
                "opencontextualmenu": "Open contextual menu",
                "print": "Print",
                "printcsv": "Print as CSV",
                "printodt": "Print as ODT",
                "printpdf": "Print as PDF",
                "row": "Item",
                "rows": "Items",
                "subtype": "Subtype"
            },
            "tabs": {
                "activity": "Activity",
                "attachment": "Attachment",
                "attachments": "Attachments",
                "card": "Card",
                "clonerelationmode": "Clone Relations Mode",
                "details": "Details",
                "emails": "Emails",
                "history": "History",
                "notes": "Notes",
                "relations": "Relations",
                "schedules": "Schedules"
            }
        },
        "dashboards": {
            "tools": {
                "gridhide": "Hide data grid",
                "gridshow": "Show data grid",
                "parametershide": "Hide data parameters",
                "parametersshow": "Show data parameters",
                "reload": "Reload"
            }
        },
        "emails": {
            "addattachmentsfromdocumentarchive": "Add attachments from the document archive",
            "alredyexistfile": "Already exists a file with this name",
            "archivingdate": "Archiving date",
            "attachfile": "Attach file",
            "bcc": "Bcc",
            "cc": "Cc",
            "composeemail": "Compose e-mail",
            "composefromtemplate": "Compose from template",
            "delay": "Delay",
            "delays": {
                "day1": "In 1 day",
                "days2": "In 2 days",
                "days4": "In 4 days",
                "hour1": "1 hour",
                "hours2": "2 hours",
                "hours4": "4 hours",
                "month1": "In 1 month",
                "negativeday1": "1 day before",
                "negativedays2": "2 days before",
                "negativedays4": "4 days before",
                "negativehour1": "1 hour before",
                "negativehours2": "2 hours before",
                "negativehours4": "4 hours before",
                "negativemonth1": "1 month before",
                "negativeweek1": "1 week before",
                "negativeweeks2": "2 weeks before",
                "none": "None",
                "week1": "In 1 week",
                "weeks2": "In 2 weeks"
            },
            "dmspaneltitle": "Choose attachments from Database",
            "edit": "Edit",
            "from": "From",
            "gridrefresh": "Grid refresh",
            "keepsynchronization": "Keep synchronization",
            "message": "Message",
            "regenerateallemails": "Regenerate all e-mails",
            "regenerateemail": "Regenerate e-mail",
            "remove": "Remove",
            "remove_confirmation": "Are you sure that you want to delete this email?",
            "reply": "reply",
            "replyprefix": "On {0}, {1} wrote:",
            "selectaclass": "Select a class",
            "sendemail": "Send e-mail",
            "statuses": {
                "draft": "Draft",
                "error": "Error",
                "outgoing": "Outgoing",
                "received": "Received",
                "sent": "Sent"
            },
            "subject": "Subject",
            "to": "To",
            "view": "View"
        },
        "errors": {
            "autherror": "Wrong username or password",
            "classnotfound": "Class {0} not found",
            "fieldrequired": "This field is required",
            "invalidfilter": "Invalid filter",
            "notfound": "Item not found"
        },
        "filters": {
            "actions": "Actions",
            "addfilter": "Add filter",
            "any": "Any",
            "attachments": "Attachments",
            "attachmentssearchtext": "Attachments search text",
            "attribute": "Choose an attribute",
            "attributes": "Attributes",
            "clearfilter": "Clear filter",
            "clone": "Clone",
            "copyof": "Copy of",
            "currentgroup": "Current group",
            "currentuser": "Current user",
            "defaultset": "Set as default",
            "defaultunset": "Unset from default",
            "description": "Description",
            "domain": "Domain",
            "filterdata": "Filter data",
            "fromfilter": "From filter",
            "fromselection": "From selection",
            "group": "Group",
            "ignore": "Ignore",
            "migrate": "Migrates",
            "name": "Name",
            "newfilter": "New filter",
            "noone": "No one",
            "operator": "Operator",
            "operators": {
                "beginswith": "Begins with",
                "between": "Between",
                "contained": "Contained",
                "containedorequal": "Contained or equal",
                "contains": "Contains",
                "containsorequal": "Contains or equal",
                "descriptionbegin": "Description begins with",
                "descriptioncontains": "Description contains",
                "descriptionends": "Description ends with",
                "descriptionnotbegin": "Description does not begins with",
                "descriptionnotcontain": "Description does not contain",
                "descriptionnotends": "Description does not ends with",
                "different": "Different",
                "doesnotbeginwith": "Does not begin with",
                "doesnotcontain": "Does not contain",
                "doesnotendwith": "Does not end with",
                "endswith": "Ends with",
                "equals": "Equals",
                "greaterthan": "Greater than",
                "isnotnull": "Is not null",
                "isnull": "Is null",
                "lessthan": "Less than"
            },
            "relations": "Relations",
            "type": "Type",
            "typeinput": "Input Parameter",
            "user": "User",
            "value": "Value"
        },
        "gis": {
            "card": "Card",
            "cardsMenu": "Cards Menu",
            "code": "Code",
            "description": "Description",
            "extension": {
                "errorCall": "Error",
                "noResults": "No Results"
            },
            "externalServices": "External services",
            "geographicalAttributes": "Geo Attributes",
            "geoserverLayers": "Geoserver layers",
            "layers": "Layers",
            "list": "List",
            "longpresstitle": "Geoelements in area",
            "map": "Map",
            "mapServices": "Map Services",
            "position": "Position",
            "root": "Root",
            "tree": "Tree",
            "type": "Type",
            "view": "View",
            "zoom": "Zoom"
        },
        "history": {
            "activityname": "Activity name",
            "activityperformer": "Activity performer",
            "begindate": "Begin date",
            "enddate": "End date",
            "processstatus": "Status",
            "user": "User"
        },
        "importexport": {
            "database": {
                "uri": "Database URI",
                "user": "Database user"
            },
            "downloadreport": "Download report",
            "emailfailure": "Error occurred while sending email!",
            "emailmessage": "Attached import report of file \"{0}\" on date {1}",
            "emailsubject": "Import data report",
            "emailsuccess": "The email has been sent successfully!",
            "export": "Export",
            "exportalldata": "All data",
            "exportfiltereddata": "Only data matching the grid filter",
            "gis": {
                "shapeimportdisabled": "The import of shapes is not enabled for this template",
                "shapeimportenabled": "Shapes import configuration"
            },
            "ifc": {
                "card": "Card",
                "project": "Project",
                "sourcetype": "Import from"
            },
            "import": "Import",
            "importresponse": "Import response",
            "response": {
                "created": "Created items",
                "deleted": "Deleted items",
                "errors": "Errors",
                "linenumber": "Line number",
                "message": "Message",
                "modified": "Modified items",
                "processed": "Processed rows",
                "recordnumber": "Record number",
                "unmodified": "Unmodified items"
            },
            "sendreport": "Send report",
            "template": "Template",
            "templatedefinition": "Template definition"
        },
        "joinviews": {
            "active": "Active",
            "addview": "Add view",
            "alias": "Alias",
            "attribute": "Attribute",
            "attributes": "Attributes",
            "attributesof": "Attributes of: {0}",
            "createview": "Create view",
            "datasorting": "Data sortings",
            "delete": "Delete",
            "deleteview": "Delete view",
            "deleteviewconfirm": "Are you sure that you want to delete this view?",
            "description": "Description",
            "disable": "Disable",
            "domainalias": "Domain alias",
            "domainsof": "Domains of {0}",
            "edit": "Edit",
            "editview": "Edit view configuration",
            "enable": "Enable",
            "fieldsets": "Fieldsets",
            "filters": "Filters",
            "generalproperties": "General properties",
            "group": "Group",
            "innerjoin": "Inner join",
            "jointype": "Join type",
            "joinview": "view from join",
            "klass": "Class",
            "manageview": "Manage view",
            "masterclass": "Master class",
            "masterclassalias": "Master class alias",
            "name": "Name",
            "newjoinview": "New view from join",
            "outerjoin": "Outer join",
            "pleaseseleceavalidmasterclass": "Please select a valid master class",
            "refreshafteredit": "Do you want to refresh the page to see the changes?",
            "selectatleastoneattribute": "Please select at least one attribute to display in grid and in reduced grid on step 4.",
            "showingrid": "Show in grid",
            "showinreducedgrid": "Show in reduced grid",
            "targetalias": "Target class alias"
        },
        "login": {
            "buttons": {
                "login": "Login",
                "logout": "Change user"
            },
            "fields": {
                "group": "Group",
                "language": "Language",
                "password": "Password",
                "tenants": "Tenants",
                "username": "Username"
            },
            "loggedin": "Logged in",
            "title": "Login",
            "welcome": "Welcome back {0}."
        },
        "main": {
            "administrationmodule": "Administration module",
            "baseconfiguration": "Base configuration",
            "cardlock": {
                "lockedmessage": "You can't edit this card because {0} is editing it.",
                "someone": "someone"
            },
            "changegroup": "Change group",
            "changetenant": "Change {0}",
            "confirmchangegroup": "Are you sure that you want to change the group?",
            "confirmchangetenants": "Are you sure that you want to change active tenants?",
            "confirmdisabletenant": "Are you sure that you want to disable \"Ignore tenants\" flag?",
            "confirmenabletenant": "Are you sure that you want to enable \"Ignore tenants\" flag?",
            "ignoretenants": "Ignore {0}",
            "info": "Info",
            "logo": {
                "cmdbuild": "CMDBuild logo",
                "cmdbuildready2use": "CMDBuild READY2USE logo",
                "companylogo": "Company logo",
                "openmaint": "openMAINT logo"
            },
            "logout": "Logout",
            "managementmodule": "Data management module",
            "multigroup": "Multi group",
            "multitenant": "Multi {0}",
            "navigation": "Navigation",
            "pagenotfound": "Page not found",
            "password": {
                "change": "Change password",
                "confirm": "Confirm password",
                "email": "E-mail address",
                "err_confirm": "Password doesn't match.",
                "err_diffprevious": "The password cannot be identical to the previous one.",
                "err_diffusername": "The password cannot be identical to the username.",
                "err_length": "The password must be at least {0} characters long.",
                "err_reqdigit": "The password must contain at least one digit.",
                "err_reqlowercase": "The password must contain at least one lowercase character.",
                "err_requppercase": "The password must contain at least one uppercase character.",
                "expired": "Your password has expired. You must change it now.",
                "forgotten": "I forgot my password",
                "new": "New password",
                "old": "Old password",
                "recoverysuccess": "We have sent you an email with instruction to recover your password.",
                "reset": "Reset password",
                "saved": "Password correctly saved!"
            },
            "pleasecorrecterrors": "Please correct indicated errors!",
            "preferences": {
                "comma": "Comma",
                "decimalserror": "Decimals field must be present",
                "decimalstousandserror": "Decimals and Thousands separator must be differents",
                "default": "Default",
                "defaultvalue": "Default value",
                "firstdayofweek": "First day of week",
                "gridpreferencesclear": "Clear grid preferences",
                "gridpreferencescleared": "Grid preferences cleared!",
                "gridpreferencessave": "Save grid preferences",
                "gridpreferencessaved": "Grid preferences saved!",
                "gridpreferencesupdate": "Update grid preferences",
                "labelcsvseparator": "CSV separator",
                "labeldateformat": "Date format",
                "labeldecimalsseparator": "Decimals separator",
                "labellanguage": "Language",
                "labelthousandsseparator": "Thousands separator",
                "labeltimeformat": "Time format",
                "msoffice": "Microsoft Office",
                "period": "Period",
                "preferredfilecharset": "CSV encoding",
                "preferredofficesuite": "Preferred Office suite",
                "space": "Space",
                "thousandserror": "Thousands field must be present",
                "timezone": "Timezone",
                "twelvehourformat": "12-hour format",
                "twentyfourhourformat": "24-hour format"
            },
            "searchinallitems": "Search in all items",
            "treenavcontenttitle": "{0} of {1}",
            "userpreferences": "Preferences"
        },
        "menu": {
            "allitems": "All items",
            "classes": "Classes",
            "custompages": "Custom pages",
            "dashboards": "Dashboards",
            "processes": "Processes",
            "reports": "Reports",
            "views": "Views"
        },
        "notes": {
            "edit": "Modify notes"
        },
        "notifier": {
            "attention": "Attention",
            "error": "Error",
            "genericerror": "Generic error",
            "genericinfo": "Generic info",
            "genericwarning": "Generic warning",
            "info": "Info",
            "success": "Success",
            "warning": "Warning"
        },
        "patches": {
            "apply": "Apply patches",
            "category": "Category",
            "description": "Description",
            "name": "Name",
            "patches": "Patches"
        },
        "processes": {
            "abortconfirmation": "Are you sure that you want to abort this process?",
            "abortprocess": "Abort process",
            "action": {
                "advance": "Advance",
                "label": "Action"
            },
            "activeprocesses": "Active processes",
            "allstatuses": "All",
            "editactivity": "Modify activity",
            "openactivity": "Open activity",
            "startworkflow": "Start",
            "workflow": "Workflow"
        },
        "relationGraph": {
            "activity": "activity",
            "allLabelsOnGraph": "all labels on graph",
            "card": "Card",
            "cardList": "Card List",
            "cardRelations": "Card Relations",
            "choosenaviagationtree": "Choose navigation tree",
            "class": "Class",
            "classList": "Class List",
            "compoundnode": "Compound Node",
            "disable": "Disable",
            "edges": "Edges",
            "enable": "Enable",
            "labelsOnGraph": "tooltip on graph",
            "level": "Level",
            "nodes": "Nodes",
            "openRelationGraph": "Open Relation Graph",
            "qt": "Qt",
            "refresh": "Refresh",
            "relation": "relation",
            "relationGraph": "Relation Graph",
            "reopengraph": "Reopen the graph from this node"
        },
        "relations": {
            "adddetail": "Add detail",
            "addrelations": "Add relations",
            "attributes": "Attributes",
            "code": "Code",
            "deletedetail": "Delete detail",
            "deleterelation": "Delete relation",
            "deleterelationconfirm": "Are you sure that you want to delete this relation?",
            "description": "Description",
            "editcard": "Edit card",
            "editdetail": "Edit detail",
            "editrelation": "Edit relation",
            "extendeddata": "Extended data",
            "mditems": "items",
            "missingattributes": "Missing mandatory attributes",
            "opencard": "Open related card",
            "opendetail": "Show detail",
            "type": "Type"
        },
        "reports": {
            "csv": "CSV",
            "download": "Download",
            "format": "Format",
            "odt": "ODT",
            "pdf": "PDF",
            "print": "Print",
            "reload": "Reload",
            "rtf": "RTF"
        },
        "system": {
            "data": {
                "lookup": {
                    "CalendarCategory": {
                        "default": {
                            "description": "Default"
                        }
                    },
                    "CalendarFrequency": {
                        "daily": {
                            "description": "Daily"
                        },
                        "monthly": {
                            "description": "Monthly"
                        },
                        "once": {
                            "description": "Once"
                        },
                        "weekly": {
                            "description": "Weekly"
                        },
                        "yearly": {
                            "description": "Yearly"
                        }
                    },
                    "CalendarPriority": {
                        "default": {
                            "description": "Default"
                        }
                    }
                }
            }
        },
        "thematism": {
            "addThematism": "Add Thematism",
            "analysisType": "Analysis Type",
            "attribute": "Attribute",
            "calculateRules": "Generate style rules",
            "clearThematism": "Clear Thematism",
            "color": "Color",
            "defineLegend": "Legend definition",
            "defineThematism": "Thematism definition",
            "function": "Function",
            "generate": "Generate",
            "geoAttribute": "Geographic Attribute",
            "graduated": "Graduated",
            "highlightSelected": "Highlight selected item",
            "intervals": "Intervals",
            "legend": "Legend",
            "name": "name",
            "newThematism": "New Thematism",
            "punctual": "Punctual",
            "quantity": "Count",
            "segments": "Segments",
            "source": "Source",
            "table": "Table",
            "thematism": "Thematisms",
            "value": "Value"
        },
        "widgets": {
            "customform": {
                "addrow": "Add row",
                "clonerow": "Clone row",
                "datanotvalid": "Data not valid",
                "deleterow": "Delete row",
                "editrow": "Edit row",
                "export": "Export",
                "import": "Import",
                "importexport": {
                    "expattributes": "Data to export",
                    "file": "File",
                    "filename": "File name",
                    "format": "Format",
                    "importmode": "Import mode",
                    "keyattributes": "Key attributes",
                    "missingkeyattr": "Please choose at least one key attribute",
                    "modeadd": "Add",
                    "modemerge": "Merge",
                    "modereplace": "Replace",
                    "separator": "Separator"
                },
                "refresh": "Refresh to defaults"
            },
            "linkcards": {
                "checkedonly": "Checked only",
                "editcard": "Edit card",
                "opencard": "Open card",
                "refreshselection": "Apply default selection",
                "togglefilterdisabled": "Disable grid filter",
                "togglefilterenabled": "Enable grid filter"
            },
            "required": "This widget is required."
        }
    });

    function cleardata(obj) {
        for (var key in obj) {
            if (typeof obj[key] === "string") {
                obj[key] = obj[key].replace(/^<em>(.+)<\/em>$/, "$1");
            } else if (typeof obj[key] === "object") {
                cleardata(obj[key]);
            }
        }
    }
    cleardata(CMDBuildUI.locales.Locales);
})();