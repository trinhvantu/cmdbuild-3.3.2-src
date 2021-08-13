(function() {
    Ext.define('CMDBuildUI.locales.da.Locales', {
        "requires": ["CMDBuildUI.locales.da.LocalesAdministration"],
        "override": "CMDBuildUI.locales.Locales",
        "singleton": true,
        "localization": "da",
        "administration": CMDBuildUI.locales.da.LocalesAdministration.administration,
        "attachments": {
            "add": "Tilføj vedhæftede filer",
            "attachmenthistory": "Vedhæftningsoversigt",
            "author": "Forfatter",
            "browse": "Gennemse &hellip;",
            "category": "Kategori",
            "code": "Kode",
            "creationdate": "Oprettelsesdato",
            "deleteattachment": "Slet vedhæftet fil",
            "deleteattachment_confirmation": "Er du sikker på, at du vil slette denne vedhæftede fil?",
            "description": "Beskrivelse",
            "download": "Hent",
            "dropfiles": "Slip filer her",
            "editattachment": "Ændr vedhæftet fil",
            "file": "Fil",
            "filealreadyinlist": "Filen {0} er allerede på listen.",
            "filename": "filnavn",
            "fileview": "<em>View attachment</em>",
            "invalidfiles": "Fjern ugyldige filer",
            "majorversion": "Nyeste version",
            "modificationdate": "Ændringsdato",
            "new": "Ny vedhæftet fil",
            "nocategory": "Ikke kategoriseret",
            "preview": "Eksempel",
            "removefile": "Fjern fil",
            "statuses": {
                "empty": "Tom fil",
                "error": "Fejl",
                "extensionNotAllowed": "Filudvidelse er ikke tilladt",
                "loaded": "Load færdig",
                "ready": "Klar"
            },
            "successupload": "{0} vedhæftede filer er uploadet.",
            "uploadfile": "Upload fil...",
            "version": "Version",
            "viewhistory": "Se vedhæftelseshistorik",
            "warningmessages": {
                "atleast": "Advarsel: er blevet indlæst {0} vedhæftede filer af typen \"{1}\". Denne kategori forventer mindst {2} vedhæftede filer",
                "exactlynumber": "Advarsel: er blevet indlæst {0} vedhæftede filer af typen \"{1}\". Denne kategori forventer {2} vedhæftede filer",
                "maxnumber": "Advarsel: er blevet indlæst {0} vedhæftet fil af typen \"{1}\". Denne kategori forventer højst {2} vedhæftede filer"
            },
            "wrongfileextension": "{0} filtypenavn er ikke tilladt"
        },
        "bim": {
            "bimViewer": "Bim Viewer",
            "card": {
                "label": "Kort"
            },
            "layers": {
                "label": "Lag",
                "menu": {
                    "hideAll": "Skjul alle",
                    "showAll": "Vis alle"
                },
                "name": "Navn",
                "qt": "Antal",
                "visibility": "Synlighed"
            },
            "menu": {
                "camera": "Kamera",
                "frontView": "Forfra visning",
                "mod": "Viewer kontroller",
                "orthographic": "Ortografisk kamera",
                "pan": "Rulle op/ned",
                "perspective": "perspektiv kamera",
                "resetView": "Nulstil visning",
                "rotate": "rotere",
                "sideView": "Side visning",
                "topView": "Ovnfra visning"
            },
            "showBimCard": "Åben 3D-viewer",
            "tree": {
                "arrowTooltip": "Vælg element",
                "columnLabel": "Filstruktur",
                "label": "Filstruktur",
                "open_card": "Åben relateret kort",
                "root": "Ifc Root"
            }
        },
        "bulkactions": {
            "abort": "Afbryd valgte elementer",
            "cancelselection": "Annuller valg",
            "confirmabort": "Du afbryder {0} procesforekomster. Er du sikker på, at du vil fortsætte?",
            "confirmdelete": "Du sletter {0} kort. Er du sikker på, at du vil fortsætte?",
            "confirmdeleteattachements": "Du sletter {0} vedhæftede filer. Er du sikker på, at du vil fortsætte?",
            "confirmedit": "Du ændrer {0} for {1} kort. Er du sikker på, at du vil fortsætte?",
            "delete": "Slet valgte emner",
            "download": "Download valgte vedhæftede filer",
            "edit": "Rediger valgte emner",
            "selectall": "Vælg alle emner"
        },
        "calendar": {
            "active_expired": "Aktiv / udløbet",
            "add": "Tilføj",
            "advancenotification": "Forhåndsmeddelelse",
            "allcategories": "Alle kategorier",
            "alldates": "Alle datoer",
            "calculated": "Beregnet",
            "calendar": "Kalender",
            "cancel": "Marker som annulleret",
            "category": "Kategori",
            "cm_confirmcancel": "Er du sikker på, at du vil markere de valgte tidsplaner som annullerede?",
            "cm_confirmcomplete": "Er du sikker på, at du vil markere de udfyldte som valgte tidsplaner?",
            "cm_markcancelled": "Marker som annullerede valgte tidsplaner",
            "cm_markcomplete": "Marker som udfyldte valgte tidsplaner",
            "complete": "Komplet",
            "completed": "Afsluttet",
            "date": "Dato",
            "days": "Dage",
            "delaybeforedeadline": "Forsinkelse inden deadline",
            "delaybeforedeadlinevalue": "Forsinkelse inden fristens værdi",
            "description": "Beskrivelse",
            "editevent": "Rediger tidsplan",
            "enddate": "Slut dato",
            "endtype": "Afslutningstype",
            "event": "Tidsplan",
            "executiondate": "Udførelsesdato",
            "frequency": "Frekvens",
            "frequencymultiplier": "Frekvensmultiplikator",
            "grid": "Gitter",
            "leftdays": "Dage der skal gå",
            "londdescription": "Full Description",
            "manual": "brugervejledning",
            "maxactiveevents": "Maks aktive begivenheder",
            "messagebodydelete": "Ønsker du at fjerne planlægningsreglen?",
            "messagebodyplural": "Der er {0} tidsplanregler",
            "messagebodyrecalculate": "Ønsker du at omberegne tidsplanreglen med den nye dato?",
            "messagebodysingular": "Der er {0} tidsplanregel",
            "messagetitle": "Planlæg omberegning",
            "missingdays": "Manglende dage",
            "next30days": "De næste 30 dage",
            "next7days": "De næste 7 dage",
            "notificationtemplate": "Skabelon, der bruges til underretning",
            "notificationtext": "Meddelelsestekst",
            "occurencies": "Antal forekomster",
            "operation": "Operation",
            "partecipantgroup": "Deltagergruppe",
            "partecipantuser": "Deltagerbruger",
            "priority": "Prioritet",
            "recalculate": "Genberegner",
            "referent": "Referent",
            "scheduler": "planlæggere",
            "sequencepaneltitle": "Generer tidsplaner",
            "startdate": "Start dato",
            "status": "Status",
            "today": "I dag",
            "type": "Type",
            "viewevent": "Se tidsplan",
            "widgetcriterion": "Beregningskriterium",
            "widgetemails": "E-mails",
            "widgetsourcecard": "Kildekort"
        },
        "classes": {
            "cards": {
                "addcard": "Tilføj kort",
                "clone": "Duplikere",
                "clonewithrelations": "Duplikere kort og relationer",
                "deletebeaware": "Vær opmærksom på, at:",
                "deleteblocked": "Det er ikke muligt at fortsætte med sletningen, fordi der er relationer til {0}.",
                "deletecard": "Slet kort",
                "deleteconfirmation": "Er du sikker på, at du vil slette dette kort?",
                "deleterelatedcards": "også {0} relaterede kort slettes",
                "deleterelations": "relationer med {0} kort slettes",
                "label": "Kort",
                "modifycard": "Ændre kort",
                "opencard": "Åben kort",
                "print": "Print kort"
            },
            "simple": "Enkel",
            "standard": "Standard"
        },
        "common": {
            "actions": {
                "add": "Tilføj",
                "apply": "Anvend",
                "cancel": "Annullere",
                "close": "Luk",
                "delete": "Slet",
                "edit": "Redigere",
                "execute": "Udfør",
                "help": "Hjælp",
                "load": "Load",
                "open": "Åben",
                "refresh": "Opdater data",
                "remove": "Fjern",
                "save": "Gem",
                "saveandapply": "Gem og anvend",
                "saveandclose": "Gem og luk",
                "search": "Søg",
                "searchtext": "Søg…"
            },
            "attributes": {
                "nogroup": "Basis data"
            },
            "dates": {
                "date": "dd/mm/åå",
                "datetime": "dd/mm/åå tt:mm:ss",
                "time": "tt;mm:ss"
            },
            "editor": {
                "clearhtml": "Slet HTML",
                "expand": "Udvid editor",
                "reduce": "<em>Reduce editor</em>",
                "unlink": "<em>Unlink</em>",
                "unlinkmessage": "<em>Transform the selected hyperlink into text.</em>"
            },
            "grid": {
                "disablemultiselection": "Deaktiver multi-valg",
                "enamblemultiselection": "Aktivér multi-valg",
                "export": "Eksport data",
                "filterremoved": "Det nuværende filter er blevet fjernet",
                "import": "Import data",
                "itemnotfound": "Emnet blev ikke fundet",
                "list": "List",
                "opencontextualmenu": "Åben kontekstmenu",
                "print": "Print",
                "printcsv": "Print som CSV",
                "printodt": "Print som ODT",
                "printpdf": "Print som PDF",
                "row": "Undertype",
                "rows": "Emne",
                "subtype": "Undertype"
            },
            "tabs": {
                "activity": "Aktivitet",
                "attachment": "Vedhæftet fil",
                "attachments": "Vedhæftede filer",
                "card": "Kort",
                "clonerelationmode": "Duplikere forholdstilstand",
                "details": "Detaljer",
                "emails": "E-mails",
                "history": "Historik",
                "notes": "Noter",
                "relations": "Relationer",
                "schedules": "Tidsplaner"
            }
        },
        "dashboards": {
            "tools": {
                "gridhide": "Skjul datagitter",
                "gridshow": "Vis datagitter",
                "parametershide": "Skjul dataparametre",
                "parametersshow": "Vis dataparametre",
                "reload": "Opdater"
            }
        },
        "emails": {
            "addattachmentsfromdocumentarchive": "Tilføj vedhæftede filer fra dokumentarkivet",
            "alredyexistfile": "Der findes allerede en fil med dette navn",
            "archivingdate": "Arkiveringsdato",
            "attachfile": "Vedhæft fil",
            "bcc": "Bcc",
            "cc": "Cc",
            "composeemail": "Opret e-mail",
            "composefromtemplate": "Opret fra skabelon",
            "delay": "Forsinke",
            "delays": {
                "day1": "In 1 day",
                "days2": "Om 2 dage",
                "days4": "Om 4 dage",
                "hour1": "1 time",
                "hours2": "2 timer",
                "hours4": "4 timer",
                "month1": "om 1 måned",
                "negativeday1": "1 dag før",
                "negativedays2": "2 dage før",
                "negativedays4": "4 dage før",
                "negativehour1": "1 time før",
                "negativehours2": "2 timer før",
                "negativehours4": "4 timer før",
                "negativemonth1": "1 måned før",
                "negativeweek1": "1 uge før",
                "negativeweeks2": "2 uger før",
                "none": "Ingen",
                "week1": "Om 1 uge",
                "weeks2": "Om 2 uger"
            },
            "dmspaneltitle": "Vælg vedhæftede filer fra databasen",
            "edit": "Redigerer",
            "from": "Fra",
            "gridrefresh": "Gitter opdatering",
            "keepsynchronization": "Forsøg synkronisering",
            "message": "Besked",
            "regenerateallemails": "Regenerér alle e-mails",
            "regenerateemail": "Regenerere e-mail",
            "remove": "Fjern",
            "remove_confirmation": "Er du sikker på, at du vil slette denne email?",
            "reply": "svar",
            "replyprefix": "På {0} skrev {1}:",
            "selectaclass": "Vælg en klasse",
            "sendemail": "Send e-mail",
            "statuses": {
                "draft": "Klade",
                "error": "Fejl",
                "outgoing": "Udgående",
                "received": "Modtaget",
                "sent": "Sendt"
            },
            "subject": "Emne",
            "to": "Til",
            "view": "Oversigt"
        },
        "errors": {
            "autherror": "Forkert brugernavn eller adgangskode",
            "classnotfound": "Klasse {0} ikke fundet",
            "fieldrequired": "dette felt er påkrævet",
            "invalidfilter": "Ugyldigt filter",
            "notfound": "Item blev ikke fundet"
        },
        "filters": {
            "actions": "Handlinger",
            "addfilter": "Tilføj filter",
            "any": "Nogen",
            "attachments": "<em>Attachments</em>",
            "attachmentssearchtext": "<em>Attachments search text</em>",
            "attribute": "Vælg en egenskab",
            "attributes": "Egenskaber",
            "clearfilter": "Ryd filter",
            "clone": "Duplikere",
            "copyof": "Kopi af",
            "currentgroup": "Nuværende gruppe",
            "currentuser": "Nuværende bruger",
            "defaultset": "Indstillet som standard",
            "defaultunset": "Frakoblet fra standard",
            "description": "Beskrivelse",
            "domain": "Domæne",
            "filterdata": "Filtrer data",
            "fromfilter": "<em>From filter</em>",
            "fromselection": "Fra markering",
            "group": "Gruppe",
            "ignore": "Ignorere",
            "migrate": "Migrerer",
            "name": "Navn",
            "newfilter": "Ny filter",
            "noone": "Ingen",
            "operator": "Operatør",
            "operators": {
                "beginswith": "Start med",
                "between": "Mellem",
                "contained": "Indeholdt",
                "containedorequal": "Indeholder eller lige",
                "contains": "Indeholder",
                "containsorequal": "Indeholder eller lige",
                "descriptionbegin": "<em>Description begins with</em>",
                "descriptioncontains": "Beskrivelse indeholder",
                "descriptionends": "<em>Description ends with</em>",
                "descriptionnotbegin": "<em>Description does not begins with</em>",
                "descriptionnotcontain": "<em>Description does not contain</em>",
                "descriptionnotends": "<em>Description does not ends with</em>",
                "different": "Forskellige",
                "doesnotbeginwith": "Begynder ikke med",
                "doesnotcontain": "Indeholder ikke",
                "doesnotendwith": "Slutter ikke med",
                "endswith": "Slutter med",
                "equals": "Lige med",
                "greaterthan": "større end",
                "isnotnull": "Er ikke null",
                "isnull": "Er null",
                "lessthan": "Mindre end"
            },
            "relations": "Relationer",
            "type": "Type",
            "typeinput": "Input Parameter",
            "user": "Bruger",
            "value": "Værdi"
        },
        "gis": {
            "card": "Kort",
            "cardsMenu": "Kort Menu",
            "code": "Kode",
            "description": "Beskrivelse",
            "extension": {
                "errorCall": "Fejl",
                "noResults": "Ingen resultater"
            },
            "externalServices": "Eksterne tjenester",
            "geographicalAttributes": "Geografiske egenskab",
            "geoserverLayers": "Geoserver lag",
            "layers": "Lag",
            "list": "List",
            "longpresstitle": "Geo-elementer i området",
            "map": "Kort",
            "mapServices": "Korttjenester",
            "position": "Position",
            "root": "Rod",
            "tree": "Filstruktur",
            "type": "Type",
            "view": "Oversigt",
            "zoom": "Zoom"
        },
        "history": {
            "activityname": "Aktivitets navn",
            "activityperformer": "Aktivitet udfører",
            "begindate": "Start dato",
            "enddate": "Slut dato",
            "processstatus": "Status",
            "user": "Bruger"
        },
        "importexport": {
            "database": {
                "uri": "Database URI",
                "user": "Database bruger"
            },
            "downloadreport": "Hent rapport",
            "emailfailure": "Der opstod en fejl under afsendelse af e-mail!",
            "emailmessage": "Vedhæftet importrapport af filen \"{0}\" i dato {1}",
            "emailsubject": "Import rapport data",
            "emailsuccess": "E-mailen er blevet sendt med succes!",
            "export": "Eksport",
            "exportalldata": "Alle data",
            "exportfiltereddata": "Kun data, der matcher gitterfilteret",
            "gis": {
                "shapeimportdisabled": "Importen af figurer er ikke aktiveret for denne skabelon",
                "shapeimportenabled": "Konfigurationer af import af figurer"
            },
            "ifc": {
                "card": "<em>Card</em>",
                "project": "Projekt",
                "sourcetype": "Import fra"
            },
            "import": "Import",
            "importresponse": "Import svar",
            "response": {
                "created": "Oprettede varer/enhed",
                "deleted": "Slet varer/enhed",
                "errors": "Fejl",
                "linenumber": "Linjenummer",
                "message": "Besked",
                "modified": "Ændrede elementer",
                "processed": "Behandlede rækker",
                "recordnumber": "Rekordnumre",
                "unmodified": "Uændrede elementer"
            },
            "sendreport": "Send rapport",
            "template": "Skabelon",
            "templatedefinition": "Skabelon definition"
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
                "login": "Log på",
                "logout": "Skift bruger"
            },
            "fields": {
                "group": "Gruppe",
                "language": "Sprog",
                "password": "Kodeord",
                "tenants": "Tenants",
                "username": "Brugernavn"
            },
            "loggedin": "Logget ind",
            "title": "Log på",
            "welcome": "Velkommen tilbage {0}."
        },
        "main": {
            "administrationmodule": "Administrationsmodul",
            "baseconfiguration": "Basis konfiguration",
            "cardlock": {
                "lockedmessage": "Du kan ikke redigere dette kort, fordi {0} redigerer i det.",
                "someone": "nogen"
            },
            "changegroup": "Skift gruppe",
            "changetenant": "Skift {0}",
            "confirmchangegroup": "Er du sikker på, at du vil ændre gruppen?",
            "confirmchangetenants": "Er du sikker på, at du vil ændre de aktive tenants?",
            "confirmdisabletenant": "Er du sikker på, at du vil indaktivere \"Ignorere tenants\" flag?",
            "confirmenabletenant": "Er du sikker på, at du vil aktivere \"Ignorere tenants\" flag?",
            "ignoretenants": "Indaktivere {0}",
            "info": "Info",
            "logo": {
                "cmdbuild": "CMDBuild logo",
                "cmdbuildready2use": "CMDBuild READY2USE logo",
                "companylogo": "Virksomheds logo",
                "openmaint": "openMAINT logo"
            },
            "logout": "log ud",
            "managementmodule": "Datastyringsmodul",
            "multigroup": "Multi-gruppe",
            "multitenant": "Multi-{0}",
            "navigation": "Navigation",
            "pagenotfound": "Siden blev ikke fundet",
            "password": {
                "change": "Skift kodeord",
                "confirm": "Godkend kodeord",
                "email": "Email adresse",
                "err_confirm": "Adgangskoden stemmer ikke overens.",
                "err_diffprevious": "Adgangskoden kan ikke være identisk med den forrige.",
                "err_diffusername": "Adgangskoden kan ikke være identisk med brugernavnet.",
                "err_length": "Adgangskoden skal være mindst {0} tegn lang.",
                "err_reqdigit": "Adgangskoden skal indeholde mindst et ciffer.",
                "err_reqlowercase": "Adgangskoden skal indeholde mindst et lille bogstav.",
                "err_requppercase": "Adgangskoden skal indeholde mindst et stort bogstav.",
                "expired": "Din adgangskode er udløbet. Du skal ændre det nu.",
                "forgotten": "jeg har glemt mit kodeord",
                "new": "Ny kodeord",
                "old": "Tidligere kodeord",
                "recoverysuccess": "Vi har sendt dig en e-mail med instruktion om at gendanne din adgangskode.",
                "reset": "Nulstille kodeord",
                "saved": "Adgangskode korrekt gemt!"
            },
            "pleasecorrecterrors": "Ret venligst angivne fejl!",
            "preferences": {
                "comma": "Komma",
                "decimalserror": "Decimalfelt skal være til stede",
                "decimalstousandserror": "Decimal og tusind separator skal være forskellige",
                "default": "Standard",
                "defaultvalue": "Standard værdi",
                "firstdayofweek": "<em>First day of week</em>",
                "gridpreferencesclear": "Ryd gitterpræferencer",
                "gridpreferencescleared": "Gitter-præferencer ryddet!",
                "gridpreferencessave": "Gem gitter-præferencer",
                "gridpreferencessaved": "Gitter-præferencer gemt!",
                "gridpreferencesupdate": "Opdater gitter-præferencer",
                "labelcsvseparator": "CSV-separator",
                "labeldateformat": "Datoformat",
                "labeldecimalsseparator": "Decimal separator",
                "labellanguage": "Sprog",
                "labelthousandsseparator": "Tusind separator",
                "labeltimeformat": "Tidsformat",
                "msoffice": "Microsoft Office",
                "period": "Periode",
                "preferredfilecharset": "CSV-kodning",
                "preferredofficesuite": "Foretrukken Office-pakke",
                "space": "Plads",
                "thousandserror": "Tusindfelt skal være til stede",
                "timezone": "Tidszone",
                "twelvehourformat": "12-timers format",
                "twentyfourhourformat": "24-timers format"
            },
            "searchinallitems": "Søg i alle emner",
            "treenavcontenttitle": "{0} of {1}",
            "userpreferences": "Indstillinger"
        },
        "menu": {
            "allitems": "Alle Emner",
            "classes": "Klasser",
            "custompages": "Brugerdefinerede sider",
            "dashboards": "Dashboards",
            "processes": "Processer",
            "reports": "Rapporter",
            "views": "Oversigt"
        },
        "notes": {
            "edit": "Ændr noter"
        },
        "notifier": {
            "attention": "Bemærk",
            "error": "Fejl",
            "genericerror": "Generisk fejl",
            "genericinfo": "Generisk info",
            "genericwarning": "Generisk advarsel",
            "info": "Info",
            "success": "Succes",
            "warning": "Advarsel"
        },
        "patches": {
            "apply": "Påfør patches",
            "category": "Kategori",
            "description": "Beskrivelse",
            "name": "Navn",
            "patches": "Patches"
        },
        "processes": {
            "abortconfirmation": "Er du sikker på, at du vil afbryde denne proces?",
            "abortprocess": "Afbryd processen",
            "action": {
                "advance": "Fortsæt",
                "label": "Handling"
            },
            "activeprocesses": "Aktivitets processer",
            "allstatuses": "Alle",
            "editactivity": "Ændr aktivitet",
            "openactivity": "Åben aktivitet",
            "startworkflow": "Start",
            "workflow": "Arbejdsgang"
        },
        "relationGraph": {
            "activity": "Aktivitet",
            "allLabelsOnGraph": "alle etiketter på grafen",
            "card": "Kort",
            "cardList": "Kortlist",
            "cardRelations": "Kortrelationer",
            "choosenaviagationtree": "Vælg navigationstræ",
            "class": "Klasse",
            "classList": "Klass-liste",
            "compoundnode": "Forbindelsesnode",
            "disable": "Deaktiver",
            "edges": "<em>Edges</em>",
            "enable": "Aktiver",
            "labelsOnGraph": "værktøjstip på grafen",
            "level": "Niveau",
            "nodes": "<em>Nodes</em>",
            "openRelationGraph": "Åben relationsgrafik",
            "qt": "Antal",
            "refresh": "Opdater",
            "relation": "forhold",
            "relationGraph": "Relation Graph",
            "reopengraph": "Genåbn grafen fra dette punkt"
        },
        "relations": {
            "adddetail": "Tilføj kort",
            "addrelations": "Tilføj detaljer",
            "attributes": "Egenskaber",
            "code": "Kode",
            "deletedetail": "Slet detaljer",
            "deleterelation": "Slet relation",
            "deleterelationconfirm": "Er du sikker på, at du vil slette denne relation?",
            "description": "Beskrivelse",
            "editcard": "Redigere kort",
            "editdetail": "Redigere detaljer",
            "editrelation": "Redigere relation",
            "extendeddata": "Udvidede data",
            "mditems": "Emner",
            "missingattributes": "Manglende obligatoriske attributter",
            "opencard": "Åben relateret kort",
            "opendetail": "Vis detaljer",
            "type": "Type"
        },
        "reports": {
            "csv": "CSV",
            "download": "Hent",
            "format": "Format",
            "odt": "ODT",
            "pdf": "PDF",
            "print": "Print",
            "reload": "Opdater",
            "rtf": "RTF"
        },
        "system": {
            "data": {
                "lookup": {
                    "CalendarCategory": {
                        "default": {
                            "description": "Standard"
                        }
                    },
                    "CalendarFrequency": {
                        "daily": {
                            "description": "Daglig"
                        },
                        "monthly": {
                            "description": "Månedlige"
                        },
                        "once": {
                            "description": "Enkelt gang"
                        },
                        "weekly": {
                            "description": "Ugentlig"
                        },
                        "yearly": {
                            "description": "Årligt"
                        }
                    },
                    "CalendarPriority": {
                        "default": {
                            "description": "Standard"
                        }
                    }
                }
            }
        },
        "thematism": {
            "addThematism": "Tilføj tematisme",
            "analysisType": "Analyse Type",
            "attribute": "Egenskab",
            "calculateRules": "Generer stilregler",
            "clearThematism": "Ryd tematisme",
            "color": "Farve",
            "defineLegend": "Legend definition",
            "defineThematism": "Thematisme definition",
            "function": "funktion",
            "generate": "Generere",
            "geoAttribute": "Geografisk attribut",
            "graduated": "Gradueret",
            "highlightSelected": "Fremhæv markeret element",
            "intervals": "intervaller",
            "legend": "legende",
            "name": "Navn",
            "newThematism": "Ny tematisme",
            "punctual": "Punktlig",
            "quantity": "Quantity",
            "segments": "segmenter",
            "source": "Kilde",
            "table": "Tabel",
            "thematism": "Thematisms",
            "value": "Værdi"
        },
        "widgets": {
            "customform": {
                "addrow": "Tilføj række",
                "clonerow": "Dubliker række",
                "datanotvalid": "Data er ikke gyldige",
                "deleterow": "Slet række",
                "editrow": "Rediger række",
                "export": "Eksport",
                "import": "Import",
                "importexport": {
                    "expattributes": "Data, der skal eksporteres",
                    "file": "Fil",
                    "filename": "filnavn",
                    "format": "Format",
                    "importmode": "Importtilstand",
                    "keyattributes": "Nøgleegenskaber",
                    "missingkeyattr": "Vælg mindst én nøgleattribut",
                    "modeadd": "Tilføj",
                    "modemerge": "flet",
                    "modereplace": "Erstatte",
                    "separator": "Separator"
                },
                "refresh": "Andvend standardindstillinger"
            },
            "linkcards": {
                "checkedonly": "Kun kontrolleret",
                "editcard": "Redigere kort",
                "opencard": "Åben kort",
                "refreshselection": "Anvend standardvalg",
                "togglefilterdisabled": "Aktivér gitterfilter",
                "togglefilterenabled": "Deaktiver gitterfilter"
            },
            "required": "Denne widget er påkrævet."
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