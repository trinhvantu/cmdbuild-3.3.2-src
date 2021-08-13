(function() {
    Ext.define('CMDBuildUI.locales.nl.Locales', {
        "requires": ["CMDBuildUI.locales.nl.LocalesAdministration"],
        "override": "CMDBuildUI.locales.Locales",
        "singleton": true,
        "localization": "nl",
        "administration": CMDBuildUI.locales.nl.LocalesAdministration.administration,
        "attachments": {
            "add": "Bijlage toevoegen",
            "attachmenthistory": "Bijlage geschiedenis",
            "author": "Schrijver",
            "browse": "Bladeren &hellip;",
            "category": "Categorie",
            "code": "Code",
            "creationdate": "Aanmaak datum",
            "deleteattachment": "Verwijder bijlage",
            "deleteattachment_confirmation": "Weet  u zeker dat u deze bijlage wilt verwijderen?",
            "description": "Omschrijving",
            "download": "Ophalen",
            "dropfiles": "Zet bestanden hier neer",
            "editattachment": "Modificeer bijlage",
            "file": "Bestand",
            "filealreadyinlist": "Het bestand {0} bestaat al.",
            "filename": "Bestandsnaam",
            "fileview": "<em>View attachment</em>",
            "invalidfiles": "Verwijder ongeldige bestanden",
            "majorversion": "Hoofd versie",
            "modificationdate": "Modificatie datum",
            "new": "Nieuwe bijlage",
            "nocategory": "ongecategoriseerd",
            "preview": "Voorbeeld",
            "removefile": "Verwijder bestand",
            "statuses": {
                "empty": "Leeg bestand",
                "error": "Fout",
                "extensionNotAllowed": "Bestandsextensie niet toegestaan",
                "loaded": "Geladen",
                "ready": "Klaar"
            },
            "successupload": "{0} bijlagen geupload",
            "uploadfile": "Ophalen bestand…",
            "version": "Versie",
            "viewhistory": "Toon bijlage geschiedenis",
            "warningmessages": {
                "atleast": "Waarschuwing: geladen {0} bijlagen van type \"{1}\". Deze categorie verwacht minimaal {2} bijlagen ",
                "exactlynumber": "Waarschuwing: geladen {0} bijlagen van type \"{1}\". Deze categorie verwacht {2} bijlagen ",
                "maxnumber": "Waarschuwing: geladen {0} bijlagen van type \"{1}\". Deze categorie verwacht maximaal {2} bijlagen "
            },
            "wrongfileextension": "{0} bestandsextensie is niet toegestaan"
        },
        "bim": {
            "bimViewer": "Bim afbeeldingsweergave",
            "card": {
                "label": "Kaart"
            },
            "layers": {
                "label": "Lagen",
                "menu": {
                    "hideAll": "Verberg alles",
                    "showAll": "Toon alles"
                },
                "name": "Naam",
                "qt": "Qt",
                "visibility": "Zichtbaarheid"
            },
            "menu": {
                "camera": "Camera",
                "frontView": "Vooraanzicht",
                "mod": "mod (afbeeldingsweergave instellingen)",
                "orthographic": "Orthografische camera",
                "pan": "Schuiven",
                "perspective": "Perspectief camera",
                "resetView": "Reset weergave",
                "rotate": "Draaien",
                "sideView": "Zijaanzicht",
                "topView": "Bovenaanzicht"
            },
            "showBimCard": "Open 3D afbeeldingsweergave",
            "tree": {
                "arrowTooltip": "Selecteer element",
                "columnLabel": "Boom",
                "label": "Boom",
                "open_card": "Open gerelateerde kaart",
                "root": "Ifc Root"
            }
        },
        "bulkactions": {
            "abort": "Afbreken geselecteerde items",
            "cancelselection": "Afbreken selectie",
            "confirmabort": "U stopt {0} processinstanties. Wilt u dat echt?",
            "confirmdelete": "U verwijdert {0} kaarten. Wilt u dat echt?",
            "confirmdeleteattachements": "U verwijdert {0} bijlagen. Wilt u dat echt?",
            "confirmedit": "U wijzigt {0} van {1} kaarten. Wilt u dat echt?",
            "delete": "Verwijder geselecteerde items",
            "download": "Download geselecteerde bijlagen",
            "edit": "Wijzig geselecteerde items",
            "selectall": "Selecteer alle items"
        },
        "calendar": {
            "active_expired": "Actief/Verlopen",
            "add": "Toevoegen schema",
            "advancenotification": "Aantal dagen vooraf notificatie",
            "allcategories": "Alle categorieën\r",
            "alldates": "Alle data",
            "calculated": "Berekend",
            "calendar": "Kalender",
            "cancel": "Markeer als afgebroken",
            "category": "Categorie",
            "cm_confirmcancel": "Weet u zeker dat u het geselecteerde schema als afgebroken wilt markeren?",
            "cm_confirmcomplete": "Weet u zeker dat u het geselecteerde schema als voltooid wilt markeren?",
            "cm_markcancelled": "Markeer geselecteerd schema als afgebroken",
            "cm_markcomplete": "Markeer geselecteerd schema als voltooid",
            "complete": "Markeer als gedaan",
            "completed": "Voltooid",
            "date": "Datum",
            "days": "Dagen",
            "delaybeforedeadline": "Uitstel voor deadline",
            "delaybeforedeadlinevalue": "Uitstel voor deadline waarde",
            "description": "Omschrijving",
            "editevent": "Wijzig schema",
            "enddate": "Einddatum",
            "endtype": "Eindtype",
            "event": "Schema",
            "executiondate": "Uitvoeringsdatum",
            "frequency": "Frequentie",
            "frequencymultiplier": "Frequentievermenigvuldiger",
            "grid": "Rooster",
            "leftdays": "Dagen te gaan",
            "londdescription": "Uitgebreide omschrijving",
            "manual": "Handmatig",
            "maxactiveevents": "Max actieve schemas",
            "messagebodydelete": "Wilt u de schemaregel verwijderen?",
            "messagebodyplural": "Er zijn {0} schemaregels",
            "messagebodyrecalculate": "Wilt u de schemaregel herberekenen met de nieuwe datum?",
            "messagebodysingular": "Er is {0} schemaregel",
            "messagetitle": "Schema herberekening",
            "missingdays": "Ontbrekende dagen",
            "next30days": "Volgende 30 dagen",
            "next7days": "Volgende 7 dagen",
            "notificationtemplate": "Sjabloon voor notificatie",
            "notificationtext": "Notificatietekst",
            "occurencies": "Aantal gebeurtenissen",
            "operation": "Operatie",
            "partecipantgroup": "Participant groep",
            "partecipantuser": "Participant gebruiker",
            "priority": "Prioriteit",
            "recalculate": "Herbereken",
            "referent": "Referent",
            "scheduler": "Planner",
            "sequencepaneltitle": "Genereer schema",
            "startdate": "Startdatum",
            "status": "Status",
            "today": "Vandaag",
            "type": "Type",
            "viewevent": "Toon schema",
            "widgetcriterion": "Berekeningscriterium",
            "widgetemails": "Emails",
            "widgetsourcecard": "Bronkaart"
        },
        "classes": {
            "cards": {
                "addcard": "Kaart toevoegen",
                "clone": "Dupliceer",
                "clonewithrelations": "Dupliceer kaart en relaties",
                "deletebeaware": "Let op dat:",
                "deleteblocked": "Het is niet mogelijk verder te gaan met de verwijdering omdat er relaties zijn met {0}.",
                "deletecard": "Verwijder kaart",
                "deleteconfirmation": "Weet u zeker dat u deze kaart wilt verwijderen?",
                "deleterelatedcards": "ook {0} gerelateerde kaarten zullen verwijderd worden",
                "deleterelations": "relaties met {0} kaarten zullen verwijderd worden",
                "label": "Kaarten",
                "modifycard": "Kaart aanpassen",
                "opencard": "Kaart openen",
                "print": "Kaart afdrukken"
            },
            "simple": "Eenvoudig",
            "standard": "Standaard"
        },
        "common": {
            "actions": {
                "add": "Toevoegen",
                "apply": "Toepassen",
                "cancel": "Annuleren",
                "close": "Sluiten",
                "delete": "Verwijderen",
                "edit": "Modificeer",
                "execute": "Uitvoeren",
                "help": "Help",
                "load": "Laad",
                "open": "Open",
                "refresh": "Ververs gegevens",
                "remove": "Verwijderen",
                "save": "Opslaan",
                "saveandapply": "Opslaan en toepassen",
                "saveandclose": "Opslaan en sluiten",
                "search": "Zoeken",
                "searchtext": "Zoeken…"
            },
            "attributes": {
                "nogroup": "Basis gegevens"
            },
            "dates": {
                "date": "d/m/j",
                "datetime": "d/m/j h:m:s",
                "time": "h:m:s"
            },
            "editor": {
                "clearhtml": "Verwijder HTML",
                "expand": "Expandeer editor",
                "reduce": "Verklein editor",
                "unlink": "<em>Unlink</em>",
                "unlinkmessage": "<em>Transform the selected hyperlink into text.</em>"
            },
            "grid": {
                "disablemultiselection": "Blokkeer meerdere selecties",
                "enamblemultiselection": "Toestaan meerdere selecties",
                "export": "Exporteer gegevens",
                "filterremoved": "Het huidige filter is verwijderd",
                "import": "Importeer gegevens",
                "itemnotfound": "Item niet gevonden",
                "list": "Lijst",
                "opencontextualmenu": "Open context menu",
                "print": "Afdrukken",
                "printcsv": "Afdrukken als CSV",
                "printodt": "Afdrukken als ODT",
                "printpdf": "Afdrukken als PDF",
                "row": "Onderdeel",
                "rows": "Onderdelen",
                "subtype": "Onderliggend Type"
            },
            "tabs": {
                "activity": "Activiteit",
                "attachment": "Bijlage",
                "attachments": "Bijlagen",
                "card": "Kaart",
                "clonerelationmode": "Kloon Relaties Mode",
                "details": "Details",
                "emails": "Emails",
                "history": "Geschiedenis",
                "notes": "Notities",
                "relations": "Relaties",
                "schedules": "Planningen"
            }
        },
        "dashboards": {
            "tools": {
                "gridhide": "Verberg data grid",
                "gridshow": "Toon data grid",
                "parametershide": "Verberg data parameters",
                "parametersshow": "Toon data parameters",
                "reload": "Herladen"
            }
        },
        "emails": {
            "addattachmentsfromdocumentarchive": "Voeg een bijlage toe uit het documentarchief",
            "alredyexistfile": "Er bestaat al een bestand met deze naam",
            "archivingdate": "Archiverings datum",
            "attachfile": "Bestand toevoegen",
            "bcc": "Bcc",
            "cc": "Cc",
            "composeemail": "Samenstellen email",
            "composefromtemplate": "Samenstellen vanaf sjabloon",
            "delay": "Vertraging",
            "delays": {
                "day1": "In 1 dag",
                "days2": "In 2 dagen",
                "days4": "In 4 dagen",
                "hour1": "1 uur",
                "hours2": "2 uren",
                "hours4": "4 uren",
                "month1": "In 1 maand",
                "negativeday1": "1 dag eerder",
                "negativedays2": "2 dagen eerder",
                "negativedays4": "4 dagen eerder",
                "negativehour1": "1 uur eerder",
                "negativehours2": "2 uur eerder",
                "negativehours4": "4 uur eerder",
                "negativemonth1": "1 maand eerder",
                "negativeweek1": "1 week eerder",
                "negativeweeks2": "2 weken eerder",
                "none": "Geen",
                "week1": "In 1 week",
                "weeks2": "In 2 weken"
            },
            "dmspaneltitle": "Kies bijlages uit database",
            "edit": "Modificeer",
            "from": "Van",
            "gridrefresh": "Raster verversen",
            "keepsynchronization": "Behoud synchronisatie",
            "message": "Message",
            "regenerateallemails": "Regenereer alle e-mails",
            "regenerateemail": "Regenereer e-mails",
            "remove": "Verwijderen",
            "remove_confirmation": "Weet u zeker dat u deze email wilt verwijderen?",
            "reply": "Reaktie",
            "replyprefix": "On {0}, {1} schreef:",
            "selectaclass": "Selecteer een klasse",
            "sendemail": "Zend e-mail",
            "statuses": {
                "draft": "Klad",
                "error": "Fout",
                "outgoing": "Uitgaand",
                "received": "Ontvangen",
                "sent": "verstuurd"
            },
            "subject": "Onderwerp",
            "to": "Aan",
            "view": "Zicht"
        },
        "errors": {
            "autherror": "Verkeerde gebruikersnaam of wachtwoord",
            "classnotfound": "Klas {0} niet gevonden",
            "fieldrequired": "Dit veld is vereist",
            "invalidfilter": "Ongeldig filter",
            "notfound": "Item niet gevonden"
        },
        "filters": {
            "actions": "Acties",
            "addfilter": "Filter toevoegen",
            "any": "Alle",
            "attachments": "<em>Attachments</em>",
            "attachmentssearchtext": "<em>Attachments search text</em>",
            "attribute": "Kies een attribuut",
            "attributes": "Attributen",
            "clearfilter": "Leegmaken filter",
            "clone": "Dupliceer",
            "copyof": "Kopie van",
            "currentgroup": "Huidige groep",
            "currentuser": "Huidige gebruiker",
            "defaultset": "Instellen als standaard",
            "defaultunset": "De-selecteren als standaard",
            "description": "Omschrijving",
            "domain": "Domein",
            "filterdata": "Filter gegevens",
            "fromfilter": "<em>From filter</em>",
            "fromselection": "Van Selectie",
            "group": "Groep",
            "ignore": "Negeer",
            "migrate": "Migreren",
            "name": "Naam",
            "newfilter": "Nieuw filter",
            "noone": "Geen enkele",
            "operator": "Bewerking",
            "operators": {
                "beginswith": "Begin met",
                "between": "Tussen",
                "contained": "Bevat",
                "containedorequal": "Bevat of is gelijk aan",
                "contains": "Bevat",
                "containsorequal": "Bevat of is gelijk aan",
                "descriptionbegin": "<em>Description begins with</em>",
                "descriptioncontains": "Omschrijving bevat",
                "descriptionends": "<em>Description ends with</em>",
                "descriptionnotbegin": "<em>Description does not begins with</em>",
                "descriptionnotcontain": "<em>Description does not contain</em>",
                "descriptionnotends": "<em>Description does not ends with</em>",
                "different": "Verschillend",
                "doesnotbeginwith": "Begint niet met",
                "doesnotcontain": "Bevat geen",
                "doesnotendwith": "Eindigd niet op",
                "endswith": "Eindigd op",
                "equals": "Gelijk",
                "greaterthan": "Grooter dan",
                "isnotnull": "Is niet leeg",
                "isnull": "Null",
                "lessthan": "Kleiner dan"
            },
            "relations": "Relaties",
            "type": "Soort",
            "typeinput": "Input Parameter",
            "user": "Gebruiker",
            "value": "Waarde"
        },
        "gis": {
            "card": "Kaart",
            "cardsMenu": "Kaartenmenu",
            "code": "Code",
            "description": "Omschrijving",
            "extension": {
                "errorCall": "Fout",
                "noResults": "Geen resultaat"
            },
            "externalServices": "Externe Services",
            "geographicalAttributes": "Geografische attributen",
            "geoserverLayers": "Geoserver lagen",
            "layers": "Lagen",
            "list": "Lijst",
            "longpresstitle": "Geo-elementen in het gebied",
            "map": "Kaart",
            "mapServices": "Kaart services",
            "position": "Positie",
            "root": "Begin",
            "tree": "Navigatie boomstructuur",
            "type": "Type",
            "view": "Zicht",
            "zoom": "Zoom"
        },
        "history": {
            "activityname": "Activiteit naam",
            "activityperformer": "Activiteit uitvoerder",
            "begindate": "Begin datum",
            "enddate": "Eind datum",
            "processstatus": "Status",
            "user": "Gebruiker"
        },
        "importexport": {
            "database": {
                "uri": "Database URI",
                "user": "Database gebruiker"
            },
            "downloadreport": "Download rapport",
            "emailfailure": "Fout opgetreden tijdens verzenden email",
            "emailmessage": "Bijgevoegd importrapport van bestand \"{0}\" op datum {1}",
            "emailsubject": "Importeer data rapport",
            "emailsuccess": "De email is met succes verzonden!",
            "export": "Exporteer",
            "exportalldata": "Alle gegevens",
            "exportfiltereddata": "Alleen gegevens die matchen met het grid filter",
            "gis": {
                "shapeimportdisabled": "Het importeren van shapes is niet ingesteld voor dit sjabloon",
                "shapeimportenabled": "Shapes importconfiguratie"
            },
            "ifc": {
                "card": "<em>Card</em>",
                "project": "Project",
                "sourcetype": "Import van"
            },
            "import": "Importeer",
            "importresponse": "Importeer response",
            "response": {
                "created": "Gemaakte items",
                "deleted": "Verwijderde items",
                "errors": "Fouten",
                "linenumber": "Regelnummer",
                "message": "Melding",
                "modified": "Gewijzigde items",
                "processed": "Verwerkte rijen",
                "recordnumber": "Recordnummer",
                "unmodified": "Ongewijzigde items"
            },
            "sendreport": "Verzend rapport",
            "template": "Sjabloon",
            "templatedefinition": "Sjabloondefinitie"
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
                "login": "Login",
                "logout": "Modificeer gebruiker"
            },
            "fields": {
                "group": "Groep",
                "language": "Taal",
                "password": "Wachtwoord",
                "tenants": "Leden",
                "username": "Gebruikersnaam"
            },
            "loggedin": "Aangemeld",
            "title": "Login",
            "welcome": "Welkom terug {0}."
        },
        "main": {
            "administrationmodule": "Administratie module",
            "baseconfiguration": "Basis configuratie",
            "cardlock": {
                "lockedmessage": "U kunt deze kaart niet aanpassen omdat {0} deze aan het aanpassen is",
                "someone": "iemand"
            },
            "changegroup": "Wijzig groep",
            "changetenant": "Wijzig {0}",
            "confirmchangegroup": "Weet u zeker dat de groep gewijzigd moet worden",
            "confirmchangetenants": "Weet u zeker dat de active leden gewijzigd moeten worden",
            "confirmdisabletenant": "Weet u zeker dat de “negeer leden” vlag uitgezet moet worden",
            "confirmenabletenant": "Weet u zeker dat de “negeer leden” vlag aangezet moet worden",
            "ignoretenants": "Negeer {0}",
            "info": "Info",
            "logo": {
                "cmdbuild": "CMDBuild logo",
                "cmdbuildready2use": "CMDBuild READY2USE logo",
                "companylogo": "Bedrijfslogo",
                "openmaint": "openMAINT logo"
            },
            "logout": "Uitloggen",
            "managementmodule": "Gegevens beheer module",
            "multigroup": "Meervoudige groep",
            "multitenant": "Multi {0}",
            "navigation": "Navigatie",
            "pagenotfound": "Pagina niet gevonden",
            "password": {
                "change": "Wachtwoord veranderen",
                "confirm": "Bevestig wachtwoord",
                "email": "Email adres",
                "err_confirm": "Wachtwoord komt niet overeen.",
                "err_diffprevious": "Het wachtwoord kan niet overeenkomen met het vorige.",
                "err_diffusername": "Het wachtwoord kan niet gelijk zijn aan de gebruikersnaam.",
                "err_length": "Het wachtwoord moet minimaal {0} karakters lang zijn.",
                "err_reqdigit": "Het wachtwoord dient minimaal een cijfer te bevatten",
                "err_reqlowercase": "Het wachtwoord dient minimaal een kleine letter te bevatten.",
                "err_requppercase": "Het wachtwoord dient minimaal een hoofdletter te bevatten.",
                "expired": "Uw wachtwoord is verlopen. U moet het nu wijzigen.",
                "forgotten": "Ik ben mijn wachtwoord vergeten",
                "new": "Nieuw wachtwoord",
                "old": "Oud wachtwoord",
                "recoverysuccess": "We hebben u een email gestuurd met instructies voor het instellen van uw wachtwoord.",
                "reset": "Reset wachtwoord",
                "saved": "Wachtwoord correct opgeslagen!"
            },
            "pleasecorrecterrors": "Wijzig aub de aangegeven fouten!",
            "preferences": {
                "comma": "Komma",
                "decimalserror": "Decimaal veld moet aanwezig zijn",
                "decimalstousandserror": "Decimaal en Duizendtal scheidingsteken moeten verschillen",
                "default": "Standaard",
                "defaultvalue": "Standaard waarde",
                "firstdayofweek": "<em>First day of week</em>",
                "gridpreferencesclear": "Wis rastervoorkeuren",
                "gridpreferencescleared": "Rastervoorkeuren gewist!",
                "gridpreferencessave": "Opslaan rastervoorkeuren",
                "gridpreferencessaved": "Rastervoorkeuren opgeslagen",
                "gridpreferencesupdate": "Wijzig rastervoorkeuren",
                "labelcsvseparator": "CSV scheidingsteken",
                "labeldateformat": "Datum formaat",
                "labeldecimalsseparator": "Decimaal scheidingsteken",
                "labellanguage": "Taal",
                "labelthousandsseparator": "Duizendtal scheidingsteken",
                "labeltimeformat": "Tijd formaat",
                "msoffice": "Microsoft Office",
                "period": "Punt",
                "preferredfilecharset": "CSV codering",
                "preferredofficesuite": "Voorkeurs Office-suite",
                "space": "Spatie",
                "thousandserror": "Duizendtal veld moet aanwezig zijn",
                "timezone": "Tijdzone",
                "twelvehourformat": "12-uurs formaat",
                "twentyfourhourformat": "24-uurs formaat"
            },
            "searchinallitems": "Zoek in alle onderdelen",
            "treenavcontenttitle": "{0} van {1}",
            "userpreferences": "Voorkeuren"
        },
        "menu": {
            "allitems": "Alle onderdelen",
            "classes": "Klassen",
            "custompages": "Gebruikers bladzijden",
            "dashboards": "Instrumenten paneel",
            "processes": "Processen",
            "reports": "Rapporten",
            "views": "Vensters"
        },
        "notes": {
            "edit": "Notitie aanpassen"
        },
        "notifier": {
            "attention": "Attentie",
            "error": "Fout",
            "genericerror": "Algemene fout",
            "genericinfo": "Algemene informatie",
            "genericwarning": "Algemene waarschuwing",
            "info": "Info",
            "success": "Succes",
            "warning": "Waarschuwing"
        },
        "patches": {
            "apply": "Patches toepassen",
            "category": "Categorie",
            "description": "Omschrijving",
            "name": "Naam",
            "patches": "Patches"
        },
        "processes": {
            "abortconfirmation": "Weet je zeker dat je dit proces wilt afbreken?",
            "abortprocess": "Proces afbreken",
            "action": {
                "advance": "Doorschuiven",
                "label": "Aktie"
            },
            "activeprocesses": "Actieve processen",
            "allstatuses": "Alles",
            "editactivity": "Activiteit aanpassen",
            "openactivity": "Activiteit openen",
            "startworkflow": "Start",
            "workflow": "Procesgang"
        },
        "relationGraph": {
            "activity": "activiteit",
            "allLabelsOnGraph": "alle labels op grafiek",
            "card": "Kaart",
            "cardList": "Kaart lijst",
            "cardRelations": "Relatie",
            "choosenaviagationtree": "Kies navigatie boom",
            "class": "Klas",
            "classList": "Klassen lijst",
            "compoundnode": "Samengesteld knooppunt",
            "disable": "Uitschakelen",
            "edges": "<em>Edges</em>",
            "enable": "Inschakelen",
            "labelsOnGraph": "Tooltip op grafiek",
            "level": "Niveau",
            "nodes": "<em>Nodes</em>",
            "openRelationGraph": "Open relatie grafiek",
            "qt": "Qt",
            "refresh": "Ververs",
            "relation": "Relatie",
            "relationGraph": "Relatie grafiek",
            "reopengraph": "Heropen de grafiek van dit knooppunt"
        },
        "relations": {
            "adddetail": "Detail toevoegen",
            "addrelations": "Relaties toevoegen",
            "attributes": "Attributen",
            "code": "Code",
            "deletedetail": "Detail verwijderen",
            "deleterelation": "Verwijder relatie",
            "deleterelationconfirm": "Weet u zeker dat u deze relatie wilt verwijderen?",
            "description": "Omschrijving",
            "editcard": "Kaart aanpassen",
            "editdetail": "Detail aanpassen",
            "editrelation": "Aanpassen relatie",
            "extendeddata": "Uitgebreide gegevens",
            "mditems": "onderdelen",
            "missingattributes": "Onbrekende verplichtte attributen",
            "opencard": "Open gerelateerde kaart",
            "opendetail": "Toon detail",
            "type": "Soort"
        },
        "reports": {
            "csv": "CSV",
            "download": "Ophalen",
            "format": "Formaat",
            "odt": "ODT",
            "pdf": "PDF",
            "print": "Afdrukken",
            "reload": "Herladen",
            "rtf": "RTF"
        },
        "system": {
            "data": {
                "lookup": {
                    "CalendarCategory": {
                        "default": {
                            "description": "Standaard"
                        }
                    },
                    "CalendarFrequency": {
                        "daily": {
                            "description": "Dagelijks"
                        },
                        "monthly": {
                            "description": "Maandelijks"
                        },
                        "once": {
                            "description": "Eenmalig"
                        },
                        "weekly": {
                            "description": "Wekelijks"
                        },
                        "yearly": {
                            "description": "Jaarlijks"
                        }
                    },
                    "CalendarPriority": {
                        "default": {
                            "description": "Standaard"
                        }
                    }
                }
            }
        },
        "thematism": {
            "addThematism": "Voeg thematisme toe",
            "analysisType": "Analyse-type",
            "attribute": "Attribuut",
            "calculateRules": "Genereerd stijlregels",
            "clearThematism": "Wis thematisme",
            "color": "Kleur",
            "defineLegend": "Legenda definitie",
            "defineThematism": "Thematisme definitie",
            "function": "Functie",
            "generate": "Genereer",
            "geoAttribute": "Geografisch attribuut",
            "graduated": "Geslaagd",
            "highlightSelected": "Markeer het geselecteerde item",
            "intervals": "Intervallen",
            "legend": "Legenda",
            "name": "naam",
            "newThematism": "Nieuw thematisme",
            "punctual": "Puntueel",
            "quantity": "Aantal",
            "segments": "Segmenten",
            "source": "Bron",
            "table": "Tabel",
            "thematism": "Thematismen",
            "value": "Waarde"
        },
        "widgets": {
            "customform": {
                "addrow": "Rij toevoegen",
                "clonerow": "Kloon rij",
                "datanotvalid": "Gegevens niet valide",
                "deleterow": "Rij verwijderen",
                "editrow": "Rij aanpassen",
                "export": "Export",
                "import": "Importeer",
                "importexport": {
                    "expattributes": "Te exporteren gegevens",
                    "file": "Bestand",
                    "filename": "Bestandsnaam",
                    "format": "Format",
                    "importmode": "Importeermode",
                    "keyattributes": "Sleutelattributen",
                    "missingkeyattr": "Kies alstublieft minimaal een sleutelattribuut",
                    "modeadd": "Toevoegen",
                    "modemerge": "Samenvoegen",
                    "modereplace": "Vervangen",
                    "separator": "Scheidingsteken"
                },
                "refresh": "Terug naar standaard"
            },
            "linkcards": {
                "checkedonly": "Alleen aangevinkte",
                "editcard": "Kaart aanpassen",
                "opencard": "Kaart openen",
                "refreshselection": "Standaard selectie toepassen",
                "togglefilterdisabled": "Verwijder raster filter",
                "togglefilterenabled": "Instellen raster filter"
            },
            "required": "Deze widget is verplicht."
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