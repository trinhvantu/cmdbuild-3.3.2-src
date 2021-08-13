(function() {
    Ext.define('CMDBuildUI.locales.hu.Locales', {
        "requires": ["CMDBuildUI.locales.hu.LocalesAdministration"],
        "override": "CMDBuildUI.locales.Locales",
        "singleton": true,
        "localization": "hu",
        "administration": CMDBuildUI.locales.hu.LocalesAdministration.administration,
        "attachments": {
            "add": "Csatolmány hozzáadása",
            "attachmenthistory": "<em>Attachment History</em>",
            "author": "Szerző",
            "browse": "<em>Browse &hellip;</em>",
            "category": "<em>Category</em>",
            "code": "<em>Code</em>",
            "creationdate": "<em>Creation date</em>",
            "deleteattachment": "<em>Delete attachment</em>",
            "deleteattachment_confirmation": "<em>Are you sure you want to delete this attachment?</em>",
            "description": "Leírás",
            "download": "Letöltés",
            "dropfiles": "<em>Drop files here</em>",
            "editattachment": "<em>Modify attachment</em>",
            "file": "Fájl",
            "filealreadyinlist": "<em>The file {0} is already in list.</em>",
            "filename": "Fájl neve",
            "fileview": "<em>View attachment</em>",
            "invalidfiles": "<em>Remove invalid files</em>",
            "majorversion": "<em>Major version</em>",
            "modificationdate": "Módosítás dátuma",
            "new": "<em>New attachment</em>",
            "nocategory": "<em>Uncategorized</em>",
            "preview": "<em>Preview</em>",
            "removefile": "<em>Remove file</em>",
            "statuses": {
                "empty": "<em>Empty file</em>",
                "error": "<em>Error</em>",
                "extensionNotAllowed": "<em>File extension non allowed</em>",
                "loaded": "<em>Loaded</em>",
                "ready": "<em>Ready</em>"
            },
            "successupload": "<em>{0} attachments uploaded.</em>",
            "uploadfile": "<em>Upload file...</em>",
            "version": "Verzija",
            "viewhistory": "<em>View attachment history</em>",
            "warningmessages": {
                "atleast": "<em>Warning: has been loaded {0} attachments of type \"{1}\". This category expects at least {2} attachments </em>",
                "exactlynumber": "<em>Warning: has been loaded {0} attachments of type \"{1}\". This category expects {2} attachments</em>",
                "maxnumber": "<em>Warning: has been loaded {0} attachment of type \"{1}\". This category expects at most {2}  attachments</em>"
            },
            "wrongfileextension": "<em>{0} file extension is not allowed</em>"
        },
        "bim": {
            "bimViewer": "<em>Bim Viewer</em>",
            "card": {
                "label": "<em>Card</em>"
            },
            "layers": {
                "label": "<em>Layers</em>",
                "menu": {
                    "hideAll": "<em>Hide all</em>",
                    "showAll": "<em>Show all</em>"
                },
                "name": "<em>Name</em>",
                "qt": "<em>Qt</em>",
                "visibility": "<em>Visibility</em>"
            },
            "menu": {
                "camera": "Kamera",
                "frontView": "<em>Front View</em>",
                "mod": "<em>Viewer controls</em>",
                "orthographic": "<em>Orthographic Camera</em>",
                "pan": "<em>Scroll</em>",
                "perspective": "<em>Perspective Camera</em>",
                "resetView": "<em>Reset View</em>",
                "rotate": "Forgatás",
                "sideView": "<em>Side View</em>",
                "topView": "<em>Top View</em>"
            },
            "showBimCard": "<em>Open 3D viewer</em>",
            "tree": {
                "arrowTooltip": "<em>Select element</em>",
                "columnLabel": "<em>Tree</em>",
                "label": "<em>Tree</em>",
                "open_card": "Kapcsolt kártya megnyitása",
                "root": "<em>Ifc Root</em>"
            }
        },
        "bulkactions": {
            "abort": "<em>Abort selected items</em>",
            "cancelselection": "<em>Cancel selection</em>",
            "confirmabort": "<em>You are aborting {0} process instances. Are you sure that you want to proceed?</em>",
            "confirmdelete": "<em>You are deleting {0} cards. Are you sure that you want to proceed?</em>",
            "confirmdeleteattachements": "<em>You are deleting {0} attachments. Are you sure that you want to proceed?</em>",
            "confirmedit": "<em>You are modifying {0} for {1} cards. Are you sure that you want to proceed?</em>",
            "delete": "<em>Delete selected items</em>",
            "download": "<em>Download selected attachments</em>",
            "edit": "<em>Edit selected items</em>",
            "selectall": "<em>Select all items</em>"
        },
        "calendar": {
            "active_expired": "<em>Active/Expired</em>",
            "add": "<em>Add</em>",
            "advancenotification": "<em>Advance Notification</em>",
            "allcategories": "<em>All categories</em>",
            "alldates": "<em>All dates</em>",
            "calculated": "<em>calculated</em>",
            "calendar": "<em>Calendar</em>",
            "cancel": "<em>Mark as cancelled</em>",
            "category": "<em>Category</em>",
            "cm_confirmcancel": "<em>Are you sure you want to mark as cancelled selected schedules?</em>",
            "cm_confirmcomplete": "<em>Are you sure you want to mark as complited selected schedules?</em>",
            "cm_markcancelled": "<em>Mark as cancelled selected schedules</em>",
            "cm_markcomplete": "<em>Mark as completed selected schedules</em>",
            "complete": "<em>Complete</em>",
            "completed": "<em>Completed</em>",
            "date": "<em>Date</em>",
            "days": "<em>Days</em>",
            "delaybeforedeadline": "<em>Delay before deadline</em>",
            "delaybeforedeadlinevalue": "<em>Delay before deadline value</em>",
            "description": "<em>Description</em>",
            "editevent": "<em>Edit schedule</em>",
            "enddate": "<em>End Date</em>",
            "endtype": "<em>End type</em>",
            "event": "<em>Event</em>",
            "executiondate": "<em>Execution Date</em>",
            "frequency": "<em>Frequency</em>",
            "frequencymultiplier": "<em>Frequency multiplier</em>",
            "grid": "<em>Grid</em>",
            "leftdays": "<em>Days to go</em>",
            "londdescription": "<em>Full Description</em>",
            "manual": "<em>Manual</em>",
            "maxactiveevents": "<em>Max active events</em>",
            "messagebodydelete": "<em>Would you like to remove schedulers rule?</em>",
            "messagebodyplural": "<em>There are {0} schedule rules</em>",
            "messagebodyrecalculate": "<em> Would you like to recalculate the schedules rule with the new date?</em>",
            "messagebodysingular": "<em>There is {0} schedule rule</em>",
            "messagetitle": "<em>Schedule recalculating</em>",
            "missingdays": "<em>Missing days</em>",
            "next30days": "<em>Next 30 days</em>",
            "next7days": "<em>Next 7 days</em>",
            "notificationtemplate": "<em>Template used for notification</em>",
            "notificationtext": "<em>Notification text</em>",
            "occurencies": "<em>Number of occurencies</em>",
            "operation": "<em>Operation</em>",
            "partecipantgroup": "<em>Partecipant group</em>",
            "partecipantuser": "<em>Partecipant user</em>",
            "priority": "<em>Priority</em>",
            "recalculate": "<em>Recalculate</em>",
            "referent": "<em>Referent</em>",
            "scheduler": "<em>Scheduler</em>",
            "sequencepaneltitle": "<em>Generate events</em>",
            "startdate": "<em>Start Date</em>",
            "status": "<em>Status</em>",
            "today": "<em>Today</em>",
            "type": "<em>Type</em>",
            "viewevent": "<em>View schedule</em>",
            "widgetcriterion": "<em>Calculation criterion</em>",
            "widgetemails": "<em>Emails</em>",
            "widgetsourcecard": "<em>Source card</em>"
        },
        "classes": {
            "cards": {
                "addcard": "Kártya hozzáadása a következőhöz: ",
                "clone": "Másolás",
                "clonewithrelations": "<em>Clone card and relations</em>",
                "deletebeaware": "<em>Be aware that:</em>",
                "deleteblocked": "<em>It is not possible to proceed with the deletion because there are relations with {0}.</em>",
                "deletecard": "Kártya törlése",
                "deleteconfirmation": "<em>Are you sure you want to delete this card?</em>",
                "deleterelatedcards": "<em>also {0} related cards will be deleted</em>",
                "deleterelations": "<em>relations with {0} cards will be deleted</em>",
                "label": "Kártyák",
                "modifycard": "Kártya módosítása",
                "opencard": "<em>Open card</em>",
                "print": "<em>Print card</em>"
            },
            "simple": "Egyszerű",
            "standard": "Általános"
        },
        "common": {
            "actions": {
                "add": "Hozzáadás",
                "apply": "Alkalmaz",
                "cancel": "Mégse",
                "close": "Bezárás",
                "delete": "Törlés",
                "edit": "Szerkesztés",
                "execute": "<em>Execute</em>",
                "help": "<em>Help</em>",
                "load": "<em>Load</em>",
                "open": "<em>Open</em>",
                "refresh": "<em>Refresh data</em>",
                "remove": "Eltávolítás",
                "save": "Mentés",
                "saveandapply": "Mentés és alkalmazás",
                "saveandclose": "<em>Save and close</em>",
                "search": "<em>Search</em>",
                "searchtext": "<em>Search...</em>"
            },
            "attributes": {
                "nogroup": "<em>Base data</em>"
            },
            "dates": {
                "date": "<em>d/m/Y</em>",
                "datetime": "<em>d/m/Y H:i:s</em>",
                "time": "<em>H:i:s</em>"
            },
            "editor": {
                "clearhtml": "<em>Clear HTML</em>",
                "expand": "<em>Expand editor</em>",
                "reduce": "<em>Reduce editor</em>",
                "unlink": "<em>Unlink</em>",
                "unlinkmessage": "<em>Transform the selected hyperlink into text.</em>"
            },
            "grid": {
                "disablemultiselection": "<em>Disable multi selection</em>",
                "enamblemultiselection": "<em>Enable multi selection</em>",
                "export": "<em>Export data</em>",
                "filterremoved": "<em>The current filter has been removed</em>",
                "import": "<em>Import data</em>",
                "itemnotfound": "A tétel nem található",
                "list": "<em>List</em>",
                "opencontextualmenu": "<em>Open contextual menu</em>",
                "print": "Nyomtatás",
                "printcsv": "<em>Print as CSV</em>",
                "printodt": "<em>Print as ODT</em>",
                "printpdf": "<em>Print as PDF</em>",
                "row": "<em>Item</em>",
                "rows": "<em>Items</em>",
                "subtype": "<em>Subtype</em>"
            },
            "tabs": {
                "activity": "Aktivitás",
                "attachment": "<em>Attachment</em>",
                "attachments": "Csatolmányok",
                "card": "Kártya",
                "clonerelationmode": "<em>Clone Relations Mode</em>",
                "details": "<em>Details</em>",
                "emails": "<em>Emails</em>",
                "history": "Történet",
                "notes": "Jegyzetek",
                "relations": "Relációk",
                "schedules": "<em>Schedules</em>"
            }
        },
        "dashboards": {
            "tools": {
                "gridhide": "<em>Hide data grid</em>",
                "gridshow": "<em>Show data grid</em>",
                "parametershide": "<em>Hide data parameters</em>",
                "parametersshow": "<em>Show data parameters</em>",
                "reload": "<em>Reload</em>"
            }
        },
        "emails": {
            "addattachmentsfromdocumentarchive": "<em>Add attachments from the document archive</em>",
            "alredyexistfile": "<em>Already exists a file with this name</em>",
            "archivingdate": "Archiválás dátuma",
            "attachfile": "Fájl csatolása",
            "bcc": "Rejtett másolat",
            "cc": "Másolat",
            "composeemail": "E-mail írása",
            "composefromtemplate": "E-mail írása sablonból",
            "delay": "Késleltetés",
            "delays": {
                "day1": "1 nap alatt",
                "days2": "2 nap alatt",
                "days4": "4 nap alatt",
                "hour1": "1 óra alatt",
                "hours2": "2 óra alatt",
                "hours4": "4 óra alatt",
                "month1": "1 hónap alatt",
                "negativeday1": "<em>1 day before</em>",
                "negativedays2": "<em>2 days before</em>",
                "negativedays4": "<em>4 days before</em>",
                "negativehour1": "<em>1 hour before</em>",
                "negativehours2": "<em>2 hours before</em>",
                "negativehours4": "<em>4 hours before</em>",
                "negativemonth1": "<em>1 month before</em>",
                "negativeweek1": "<em>1 week before</em>",
                "negativeweeks2": "<em>2 weeks before</em>",
                "none": "Nincs",
                "week1": "1 hét alatt",
                "weeks2": "2 hét alatt"
            },
            "dmspaneltitle": "Csatolmány választása adatbázisból",
            "edit": "Szerkesztés",
            "from": "Tőle",
            "gridrefresh": "Rács frissítés",
            "keepsynchronization": "Folyamatos sync",
            "message": "<em>Message</em>",
            "regenerateallemails": "Minden e-mail újragenerálása",
            "regenerateemail": "E-mail újragenerálása",
            "remove": "Eltávolítás",
            "remove_confirmation": "<em>Are you sure you want to delete this email?</em>",
            "reply": "Válasz",
            "replyprefix": "<em>On {0}, {1} wrote:</em>",
            "selectaclass": "<em>Select a class</em>",
            "sendemail": "<em>Send e-mail</em>",
            "statuses": {
                "draft": "Piszkozat",
                "error": "<em>Error</em>",
                "outgoing": "Kimenő",
                "received": "Kapott",
                "sent": "Elküldött"
            },
            "subject": "Tárgy",
            "to": "Címzett",
            "view": "Nézet"
        },
        "errors": {
            "autherror": "Hibás felhasználónév vagy jelszó",
            "classnotfound": "Az {0} osztály nem található",
            "fieldrequired": "<em>This field is required</em>",
            "invalidfilter": "<em>Invalid filter</em>",
            "notfound": "A tétel nem található"
        },
        "filters": {
            "actions": "<em>Actions</em>",
            "addfilter": "Szűrő hozzáadása",
            "any": "Bármely",
            "attachments": "<em>Attachments</em>",
            "attachmentssearchtext": "<em>Attachments search text</em>",
            "attribute": "Válasszon attribútumot",
            "attributes": "Attribútumok",
            "clearfilter": "Szűrő törlése",
            "clone": "Másolás",
            "copyof": "Amelyik másolata",
            "currentgroup": "<em>Current group</em>",
            "currentuser": "<em>Current user</em>",
            "defaultset": "<em>Set as default</em>",
            "defaultunset": "<em>Unset from default</em>",
            "description": "Leírás",
            "domain": "Domain",
            "filterdata": "<em>Filter data</em>",
            "fromfilter": "<em>From filter</em>",
            "fromselection": "Szelektáltakból",
            "group": "<em>Group</em>",
            "ignore": "<em>Ignore</em>",
            "migrate": "<em>Migrate</em>",
            "name": "Név",
            "newfilter": "<em>New filter</em>",
            "noone": "Semmi",
            "operator": "<em>Operator</em>",
            "operators": {
                "beginswith": "Amivel kezdődik",
                "between": "Között",
                "contained": "Tartalmaz",
                "containedorequal": "Tartalmaz vagy egyenlő",
                "contains": "Tartalmazza",
                "containsorequal": "Tartalmaz vagy egyenlő",
                "descriptionbegin": "<em>Description begins with</em>",
                "descriptioncontains": "<em>Description contains</em>",
                "descriptionends": "<em>Description ends with</em>",
                "descriptionnotbegin": "<em>Description does not begins with</em>",
                "descriptionnotcontain": "<em>Description does not contain</em>",
                "descriptionnotends": "<em>Description does not ends with</em>",
                "different": "Különböző",
                "doesnotbeginwith": "Amivel nem kezdődik ",
                "doesnotcontain": "Nem tartalmazza",
                "doesnotendwith": "Amivel nem fejeződik be",
                "endswith": "Amivel befejeződik",
                "equals": "Egyenlő",
                "greaterthan": "Nagyobb mint",
                "isnotnull": "Nem nulla",
                "isnull": "Nulla",
                "lessthan": "Kisebb mint"
            },
            "relations": "Relációk",
            "type": "Típus",
            "typeinput": "Bemeneti paraméter",
            "user": "<em>User</em>",
            "value": "Érték"
        },
        "gis": {
            "card": "Kártya",
            "cardsMenu": "<em>Cards Menu</em>",
            "code": "<em>Code</em>",
            "description": "<em>Description</em>",
            "extension": {
                "errorCall": "<em>Error</em>",
                "noResults": "<em>No Results</em>"
            },
            "externalServices": "Külső szolgáltatás",
            "geographicalAttributes": "Földrajzi attribútumok",
            "geoserverLayers": "Geoserver rétegek",
            "layers": "Rétegek",
            "list": "Lista",
            "longpresstitle": "<em>Geoelements in area</em>",
            "map": "Térkép",
            "mapServices": "<em>Map Services</em>",
            "position": "<em>Position</em>",
            "root": "Root",
            "tree": "Navigációs fa",
            "type": "<em>Type</em>",
            "view": "Nézet",
            "zoom": "Zoom"
        },
        "history": {
            "activityname": "Aktivitás neve",
            "activityperformer": "Aktivitás végzője",
            "begindate": "Kezdő dátum",
            "enddate": "Befejező dátum",
            "processstatus": "Státusz",
            "user": "Felhasználó"
        },
        "importexport": {
            "database": {
                "uri": "<em>Database URI</em>",
                "user": "<em>Database user</em>"
            },
            "downloadreport": "<em>Download report</em>",
            "emailfailure": "<em>Error occurred while sending email!</em>",
            "emailmessage": "<em>Attached import report of file \"{0}\" in date {1}</em>",
            "emailsubject": "<em>Import data report</em>",
            "emailsuccess": "<em>The email has been sent successfully!</em>",
            "export": "<em>Export</em>",
            "exportalldata": "<em>All data</em>",
            "exportfiltereddata": "<em>Only data matching the grid filter</em>",
            "gis": {
                "shapeimportdisabled": "<em>The import of shapes is not enabled for this template</em>",
                "shapeimportenabled": "<em>Shapes import configuration</em>"
            },
            "ifc": {
                "card": "<em>Card</em>",
                "project": "<em>Project</em>",
                "sourcetype": "<em>Import from</em>"
            },
            "import": "<em>Import</em>",
            "importresponse": "<em>Import response</em>",
            "response": {
                "created": "<em>Created items</em>",
                "deleted": "<em>Deleted items</em>",
                "errors": "<em>Errors</em>",
                "linenumber": "<em>Line number</em>",
                "message": "<em>Message</em>",
                "modified": "<em>Modified items</em>",
                "processed": "<em>Processed rows</em>",
                "recordnumber": "<em>Record number</em>",
                "unmodified": "<em>Unmodified items</em>"
            },
            "sendreport": "<em>Send report</em>",
            "template": "<em>Template</em>",
            "templatedefinition": "<em>Template definition</em>"
        },
        "joinviews": {
            "active": "<em>Active</em>",
            "addview": "<em>Add view</em>",
            "alias": "<em>Alias</em>",
            "attribute": "<em>Attribute</em>",
            "attributes": "<em>Attributes</em>",
            "attributesof": "<em>Attributes of: {0}</em>",
            "createview": "<em>Create view</em>",
            "datasorting": "<em>Data sortings</em>",
            "delete": "<em>Delete</em>",
            "deleteview": "<em>Delete view</em>",
            "deleteviewconfirm": "<em>Are you sure that you want to delete this view?</em>",
            "description": "<em>Description</em>",
            "disable": "<em>Disable</em>",
            "domainalias": "<em>Domain alias</em>",
            "domainsof": "<em>Domains of {0}</em>",
            "edit": "<em>Edit</em>",
            "editview": "<em>Edit view configuration</em>",
            "enable": "<em>Enable</em>",
            "fieldsets": "<em>Fieldsets</em>",
            "filters": "<em>Filters</em>",
            "generalproperties": "<em>General properties</em>",
            "group": "<em>Group</em>",
            "innerjoin": "<em>Inner join</em>",
            "jointype": "<em>Join type</em>",
            "joinview": "<em>view from join</em>",
            "klass": "<em>Class</em>",
            "manageview": "<em>Manage view</em>",
            "masterclass": "<em>Master class</em>",
            "masterclassalias": "<em>Master class alias</em>",
            "name": "<em>Name</em>",
            "newjoinview": "<em>New view from join</em>",
            "outerjoin": "<em>Outer join</em>",
            "pleaseseleceavalidmasterclass": "<em>Please select a valid master class</em>",
            "refreshafteredit": "<em>Do you want to refresh the page to see the changes?</em>",
            "selectatleastoneattribute": "<em>Please select at least one attribute to display in grid and in reduced grid on step 4.</em>",
            "showingrid": "<em>Show in grid</em>",
            "showinreducedgrid": "<em>Show in reduced grid</em>",
            "targetalias": "<em>Target class alias</em>"
        },
        "login": {
            "buttons": {
                "login": "Bejelentkezés",
                "logout": "<em>Change user</em>"
            },
            "fields": {
                "group": "<em>Group</em>",
                "language": "Nyelv",
                "password": "Jelszó",
                "tenants": "<em>Tenants</em>",
                "username": "Felhasználónév"
            },
            "loggedin": "<em>Logged in</em>",
            "title": "Bejelentkezés",
            "welcome": "<em>Welcome back {0}.</em>"
        },
        "main": {
            "administrationmodule": "Adminisztrációs modul",
            "baseconfiguration": "<em>Base configuration</em>",
            "cardlock": {
                "lockedmessage": "<em>You can't edit this card because {0} is editing it.</em>",
                "someone": "<em>someone</em>"
            },
            "changegroup": "<em>Change group</em>",
            "changetenant": "<em>Change {0}</em>",
            "confirmchangegroup": "<em>Are you sure you want to change the group?</em>",
            "confirmchangetenants": "<em>Are you sure you want to change active tenants?</em>",
            "confirmdisabletenant": "<em>Are you sure you want to disable \"Ignore tenants\" flag?</em>",
            "confirmenabletenant": "<em>Are you sure you want to enable \"Ignore tenants\" flag?</em>",
            "ignoretenants": "<em>Ignore {0}</em>",
            "info": "Információ",
            "logo": {
                "cmdbuild": "<em>CMDBuild logo</em>",
                "cmdbuildready2use": "<em>CMDBuild READY2USE logo</em>",
                "companylogo": "<em>Company logo</em>",
                "openmaint": "<em>openMAINT logo</em>"
            },
            "logout": "Kijelentkezés",
            "managementmodule": "Adatkezelő modul",
            "multigroup": "Több csoport",
            "multitenant": "<em>Multi {0}</em>",
            "navigation": "Navigation",
            "pagenotfound": "<em>Page not found</em>",
            "password": {
                "change": "Jelszó változtatás",
                "confirm": "Jelszó megerősítése",
                "email": "<em>E-mail address</em>",
                "err_confirm": "<em>Password doesn't match.</em>",
                "err_diffprevious": "<em>The password cannot be identical to the previous one.</em>",
                "err_diffusername": "<em>The password cannot be identical to the username.</em>",
                "err_length": "<em>The password must be at least {0} characters long.</em>",
                "err_reqdigit": "<em>The password must contain at least one digit.</em>",
                "err_reqlowercase": "<em>The password must contain at least one lowercase character.</em>",
                "err_requppercase": "<em>The password must contain at least one uppercase character.</em>",
                "expired": "<em>Your password has expired. You must change it now.</em>",
                "forgotten": "<em>I forgot my password</em>",
                "new": "Új jelszó",
                "old": "Eddigi jelszó",
                "recoverysuccess": "<em>We have sent you an email with instruction to recover your password.</em>",
                "reset": "<em>Reset password</em>",
                "saved": "<em>Password correctly saved!</em>"
            },
            "pleasecorrecterrors": "<em>Please correct indicated errors!</em>",
            "preferences": {
                "comma": "<em>Comma</em>",
                "decimalserror": "<em>Decimals field must be present</em>",
                "decimalstousandserror": "<em>Decimals and Thousands separato must be differents</em>",
                "default": "<em>Default</em>",
                "defaultvalue": "Alapértelmezett érték",
                "firstdayofweek": "<em>First day of week</em>",
                "gridpreferencesclear": "<em>Clear grid preferences</em>",
                "gridpreferencescleared": "<em>Grid preferences cleared!</em>",
                "gridpreferencessave": "<em>Save grid preferences</em>",
                "gridpreferencessaved": "<em>Grid preferences saved!</em>",
                "gridpreferencesupdate": "<em>Update grid preferences</em>",
                "labelcsvseparator": "<em>CSV separator</em>",
                "labeldateformat": "<em>Date format</em>",
                "labeldecimalsseparator": "<em>Decimals separator</em>",
                "labellanguage": "<em>Language</em>",
                "labelthousandsseparator": "<em>Thousands separator</em>",
                "labeltimeformat": "<em>Time format</em>",
                "msoffice": "<em>Microsoft Office</em>",
                "period": "<em>Period</em>",
                "preferredfilecharset": "<em>CSV encoding</em>",
                "preferredofficesuite": "<em>Preferred Office suite</em>",
                "space": "<em>Space</em>",
                "thousandserror": "<em>Thousands field must be present</em>",
                "timezone": "<em>Timezone</em>",
                "twelvehourformat": "<em>12-hour format</em>",
                "twentyfourhourformat": "<em>24-hour format</em>"
            },
            "searchinallitems": "<em>Search in all items</em>",
            "treenavcontenttitle": "<em>{0} of {1}</em>",
            "userpreferences": "<em>Preferences</em>"
        },
        "menu": {
            "allitems": "<em>All items</em>",
            "classes": "Osztályok",
            "custompages": "<em>Custom pages</em>",
            "dashboards": "<em>Dashboards</em>",
            "processes": "Folyamatok",
            "reports": "<em>Reports</em>",
            "views": "Nézetek"
        },
        "notes": {
            "edit": "Jegyzet szerkesztése"
        },
        "notifier": {
            "attention": "Figyelem",
            "error": "Hiba",
            "genericerror": "<em>Generic error</em>",
            "genericinfo": "<em>Generic info</em>",
            "genericwarning": "<em>Generic warning</em>",
            "info": "Információ",
            "success": "<em>Success</em>",
            "warning": "<em>Warning</em>"
        },
        "patches": {
            "apply": "<em>Apply patches</em>",
            "category": "<em>Category</em>",
            "description": "<em>Description</em>",
            "name": "<em>Name</em>",
            "patches": "<em>Patches</em>"
        },
        "processes": {
            "abortconfirmation": "Biztos hogy meg akarja szakítani a folyamatot?",
            "abortprocess": "Folyamat megszakítása",
            "action": {
                "advance": "Tovább",
                "label": "<em>Action</em>"
            },
            "activeprocesses": "<em>Active processes</em>",
            "allstatuses": "<em>All</em>",
            "editactivity": "Aktivitás szerkesztése",
            "openactivity": "<em>Open activity</em>",
            "startworkflow": "Indítás",
            "workflow": "Folyamat"
        },
        "relationGraph": {
            "activity": "<em>activity</em>",
            "allLabelsOnGraph": "<em>all labels on graph</em>",
            "card": "Kártya",
            "cardList": "<em>Card List</em>",
            "cardRelations": "Reláció",
            "choosenaviagationtree": "<em>Choose navigation tree</em>",
            "class": "<em>Class</em>",
            "classList": "<em>Class List</em>",
            "compoundnode": "<em>Compound Node</em>",
            "disable": "<em>Disable</em>",
            "edges": "<em>Edges</em>",
            "enable": "<em>Enable</em>",
            "labelsOnGraph": "<em>tooltip on graph</em>",
            "level": "<em>Level</em>",
            "nodes": "<em>Nodes</em>",
            "openRelationGraph": "Relációs gráf megnyitása",
            "qt": "<em>Qt</em>",
            "refresh": "<em>Refresh</em>",
            "relation": "Reláció",
            "relationGraph": "Relációs gráf",
            "reopengraph": "<em>Reopen the graph from this node</em>"
        },
        "relations": {
            "adddetail": "Részlet hozzáadása",
            "addrelations": "Reláció hozzáadása",
            "attributes": "Attribútumok",
            "code": "<em>Code</em>",
            "deletedetail": "Részlet törlése",
            "deleterelation": "Reláció törlése",
            "deleterelationconfirm": "<em>Are you sure you want to delete this relation?</em>",
            "description": "Leírás",
            "editcard": "Kártya módosítása",
            "editdetail": "Részlet szerkesztése",
            "editrelation": "Reláció szerkesztése",
            "extendeddata": "<em>Extended data</em>",
            "mditems": "<em>items</em>",
            "missingattributes": "<em>Missing mandatory attributes</em>",
            "opencard": "Kapcsolt kártya megnyitása",
            "opendetail": "Részlet megjelenítése",
            "type": "Típus"
        },
        "reports": {
            "csv": "<em>CSV</em>",
            "download": "Letöltés",
            "format": "Formátum",
            "odt": "<em>ODT</em>",
            "pdf": "<em>PDF</em>",
            "print": "Nyomtatás",
            "reload": "Újratöltés",
            "rtf": "<em>RTF</em>"
        },
        "system": {
            "data": {
                "lookup": {
                    "CalendarCategory": {
                        "default": {
                            "description": "<em>Default</em>"
                        }
                    },
                    "CalendarFrequency": {
                        "daily": {
                            "description": "<em>Daily</em>"
                        },
                        "monthly": {
                            "description": "<em>Monthly</em>"
                        },
                        "once": {
                            "description": "<em>Once</em>"
                        },
                        "weekly": {
                            "description": "<em>Weekly</em>"
                        },
                        "yearly": {
                            "description": "<em>Yearly</em>"
                        }
                    },
                    "CalendarPriority": {
                        "default": {
                            "description": "<em>Default</em>"
                        }
                    }
                }
            }
        },
        "thematism": {
            "addThematism": "<em>Add Thematism</em>",
            "analysisType": "<em>Analysis Type</em>",
            "attribute": "<em>Attribute</em>",
            "calculateRules": "<em>Generate style rules</em>",
            "clearThematism": "<em>Clear Thematism</em>",
            "color": "<em>Color</em>",
            "defineLegend": "<em>Legend definition</em>",
            "defineThematism": "<em>Thematism definition</em>",
            "function": "<em>Function</em>",
            "generate": "<em>generate</em>",
            "geoAttribute": "<em>Geographic Attribute</em>",
            "graduated": "<em>Graduated</em>",
            "highlightSelected": "<em>Highlight selected item</em>",
            "intervals": "<em>Intervals</em>",
            "legend": "<em>legend</em>",
            "name": "<em>name</em>",
            "newThematism": "<em>New Thematism</em>",
            "punctual": "<em>Punctual</em>",
            "quantity": "<em>Quantity</em>",
            "segments": "<em>Segments</em>",
            "source": "<em>Source</em>",
            "table": "<em>Table</em>",
            "thematism": "<em>Thematisms</em>",
            "value": "<em>Value</em>"
        },
        "widgets": {
            "customform": {
                "addrow": "Sor hozzáadása",
                "clonerow": "<em>Clone row</em>",
                "datanotvalid": "<em>Data not valid</em>",
                "deleterow": "Sor törlése",
                "editrow": "Sor szerkesztése",
                "export": "Exportálás",
                "import": "<em>Import</em>",
                "importexport": {
                    "expattributes": "<em>Data to export</em>",
                    "file": "<em>File</em>",
                    "filename": "<em>File name</em>",
                    "format": "<em>Format</em>",
                    "importmode": "<em>Import mode</em>",
                    "keyattributes": "<em>Key attributes</em>",
                    "missingkeyattr": "<em>Please choose at least one key attribute</em>",
                    "modeadd": "<em>Add</em>",
                    "modemerge": "<em>Merge</em>",
                    "modereplace": "<em>Replace</em>",
                    "separator": "<em>Separator</em>"
                },
                "refresh": "<em>Refresh to defaults</em>"
            },
            "linkcards": {
                "checkedonly": "<em>Checked only</em>",
                "editcard": "<em>Edit card</em>",
                "opencard": "<em>Open card</em>",
                "refreshselection": "<em>Apply default selection</em>",
                "togglefilterdisabled": "Rács szűrő tiltása",
                "togglefilterenabled": "<em>Rács szűrő engedélyezése</em>"
            },
            "required": "<em>This widget is required.</em>"
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