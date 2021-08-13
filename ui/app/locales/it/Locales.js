(function() {
    Ext.define('CMDBuildUI.locales.it.Locales', {
        "requires": ["CMDBuildUI.locales.it.LocalesAdministration"],
        "override": "CMDBuildUI.locales.Locales",
        "singleton": true,
        "localization": "it",
        "administration": CMDBuildUI.locales.it.LocalesAdministration.administration,
        "attachments": {
            "add": "Aggiungi allegato",
            "attachmenthistory": "Storia dell'allegato",
            "author": "Autore",
            "browse": "Sfoglia &hellip;",
            "category": "Categoria",
            "code": "Codice",
            "creationdate": "Data di creazione",
            "deleteattachment": "Elimina allegato",
            "deleteattachment_confirmation": "Sei sicuro di voler eliminare questo allegato?",
            "description": "Descrizione",
            "download": "Scarica",
            "dropfiles": "Trascina i file qui",
            "editattachment": "Modifica allegato",
            "file": "File",
            "filealreadyinlist": "Il file {0} è già presente",
            "filename": "Nome del file",
            "fileview": "Vedi allegato",
            "invalidfiles": "Rimuovi i file invalidi",
            "majorversion": "Versione principale",
            "modificationdate": "Data modifica",
            "new": "Nuovo allegato",
            "nocategory": "Non categorizzato",
            "preview": "Anteprima",
            "removefile": "Rimuovi il file",
            "statuses": {
                "empty": "File vuoto",
                "error": "Errore",
                "extensionNotAllowed": "Estensione file non ammessa",
                "loaded": "Caricato",
                "ready": "Pronto"
            },
            "successupload": "{0} allegati caricati.",
            "uploadfile": "Carica file...",
            "version": "Versione",
            "viewhistory": "Vedi la storia dell'allegato",
            "warningmessages": {
                "atleast": "Attenzione: sono stati caricati {0} allegati di tipo \"{1}\". Questa categoria prevede almeno {2} allegati",
                "exactlynumber": "Attenzione: sono stati caricati {0} allegati di tipo \"{1}\". Questa categoria prevede {2} allegati",
                "maxnumber": "Attenzione: sono stati caricati {0} allegati di tipo \"{1}\". Questa categoria prevede al massimo {2} allegati"
            },
            "wrongfileextension": "Non è permesso caricare file con estensione {0}"
        },
        "bim": {
            "bimViewer": "Visualizzatore Bim",
            "card": {
                "label": "Scheda"
            },
            "layers": {
                "label": "Layers",
                "menu": {
                    "hideAll": "Nascondi Tutto",
                    "showAll": "Mostra Tutto"
                },
                "name": "Nome",
                "qt": "Quantità",
                "visibility": "Visibilità"
            },
            "menu": {
                "camera": "Camera",
                "frontView": "Vista frontale",
                "mod": "Modalità di visualizzazione",
                "orthographic": "Vista Ortografica",
                "pan": "Sposta",
                "perspective": "Vista Prospettica",
                "resetView": "Reset della Vista",
                "rotate": "Ruota",
                "sideView": "Vista laterale",
                "topView": "Vista dall'alto"
            },
            "showBimCard": "Mostra scheda Bim",
            "tree": {
                "arrowTooltip": "Seleziona elemento",
                "columnLabel": "Albero Ifc",
                "label": "Albero",
                "open_card": "Apri scheda collegata",
                "root": "Radice Ifc"
            }
        },
        "bulkactions": {
            "abort": "Interrompi i processi selezionati",
            "cancelselection": "Annulla selezione",
            "confirmabort": "Stai interrompendo {0} istanze di processo. Sicuro di voler procedere con le modifiche?",
            "confirmdelete": "Stai eliminando {0} schede. Sicuro di voler procedere con le modifiche?",
            "confirmdeleteattachements": "Stai eliminando {0} allegati. Sicuro di voler procedere con le modifiche?",
            "confirmedit": "Stai modificando {0} per {1} schede. Sicuro di voler procedere con le modifiche?",
            "delete": "Elimina gli elementi selezionati",
            "download": "Scarica gli allegati selezionati",
            "edit": "Modifica gli elementi selezionati",
            "selectall": "Seleziona tutti gli elementi"
        },
        "calendar": {
            "active_expired": "Attive/Scadute",
            "add": "Aggiungi scadenza",
            "advancenotification": "Notifica con giorni di anticipo",
            "allcategories": "Tutte le categorie",
            "alldates": "Tutte le date",
            "calculated": "Calcolato",
            "calendar": "Calendario",
            "cancel": "Segna come annullata",
            "category": "Categoria",
            "cm_confirmcancel": "Sei sicuro di voler segnare le scadenze selezionate come annullate?",
            "cm_confirmcomplete": "Sei sicuro di voler segnare le scadenze selezionate come completate?",
            "cm_markcancelled": "Segna scadenze selezionate come annullate",
            "cm_markcomplete": "Segna scadenze selezionate come completate",
            "complete": "Completa",
            "completed": "Completata",
            "date": "Data",
            "days": "Giorni",
            "delaybeforedeadline": "Anticipo notifica",
            "delaybeforedeadlinevalue": "Valore anticipo notifica",
            "description": "Descrizione",
            "editevent": "Modifica scadenza",
            "enddate": "Data di fine",
            "endtype": "Tipo di fine",
            "event": "Scadenza",
            "executiondate": "Data di esecuzione",
            "frequency": "Frequenza",
            "frequencymultiplier": "Moltiplicatore frequenza",
            "grid": "Griglia",
            "leftdays": "Giorni mancanti",
            "londdescription": "Descrizione estesa",
            "manual": "Manuale",
            "maxactiveevents": "Numero massimo di scadenze attive",
            "messagebodydelete": "Vuoi rimuovere le regole scadenze?",
            "messagebodyplural": "Ci sono {0} regole scadenze",
            "messagebodyrecalculate": "Vuoi ricalcolare le regole scadenze con la nuova data?",
            "messagebodysingular": "C'è {0} regola scadenza",
            "messagetitle": "Ricalcolo scadenze",
            "missingdays": "Giorni mancanti",
            "next30days": "Prossimi 30 giorni",
            "next7days": "Prossimi 7 giorni",
            "notificationtemplate": "Template della notifica",
            "notificationtext": "Testo di notifica",
            "occurencies": "Numero di occorrenze",
            "operation": "Operazione",
            "partecipantgroup": "Gruppo referente",
            "partecipantuser": "Utente referente",
            "priority": "Priorità",
            "recalculate": "Ricalcola",
            "referent": "Referente",
            "scheduler": "Scadenzario",
            "sequencepaneltitle": "Genera scadenze",
            "startdate": "Data di inizio",
            "status": "Stato",
            "today": "Oggi",
            "type": "Tipo",
            "viewevent": "Visualizza scadenza",
            "widgetcriterion": "Criteri di calcolo",
            "widgetemails": "Email",
            "widgetsourcecard": "Scheda di origine"
        },
        "classes": {
            "cards": {
                "addcard": "Aggiungi scheda",
                "clone": "Clona",
                "clonewithrelations": "Clona scheda e relazioni",
                "deletebeaware": "Attenzione che:",
                "deleteblocked": "Poiché sono presenti relazioni con {0} non è possibile procedere con la cancellazione delle schede.",
                "deletecard": "Cancella scheda",
                "deleteconfirmation": "Sei sicuro di voler cancellare questa scheda?",
                "deleterelatedcards": "verranno cancellate le schede {0} relazionate",
                "deleterelations": "verranno cancellate le relazioni con le schede {0}",
                "label": "Schede dati",
                "modifycard": "Modifica scheda",
                "opencard": "Apri scheda",
                "print": "Stampa scheda"
            },
            "simple": "Semplice",
            "standard": "Standard"
        },
        "common": {
            "actions": {
                "add": "Aggiungi",
                "apply": "Applica",
                "cancel": "Annulla",
                "close": "Chiudi",
                "delete": "Cancella",
                "edit": "Modifica",
                "execute": "Esegui",
                "help": "Aiuto",
                "load": "Carica",
                "open": "Apri",
                "refresh": "Ricarica dati",
                "remove": "Rimuovi",
                "save": "Salva",
                "saveandapply": "Salva e applica",
                "saveandclose": "Salva e chiudi",
                "search": "Cerca",
                "searchtext": "Cerca..."
            },
            "attributes": {
                "nogroup": "Dati di base"
            },
            "dates": {
                "date": "d/m/Y",
                "datetime": "d/m/Y H:i:s",
                "time": "H:i:s"
            },
            "editor": {
                "clearhtml": "Pulisci HTML",
                "expand": "Espandi editor",
                "reduce": "Riduci editor",
                "unlink": "Rimuovi link",
                "unlinkmessage": "Trasforma il link selezionato in testo."
            },
            "grid": {
                "disablemultiselection": "Disabilita selezione multipla",
                "enamblemultiselection": "Abilita selezione multipla",
                "export": "Esporta dati",
                "filterremoved": "Il filtro impostato è stato rimosso",
                "import": "Importa dati",
                "itemnotfound": "Elemento non trovato",
                "list": "Lista",
                "opencontextualmenu": "Apri menu contestuale",
                "print": "Stampa",
                "printcsv": "Stampa come CSV",
                "printodt": "Stampa come ODT",
                "printpdf": "Stampa come PDF",
                "row": "Elemento",
                "rows": "Elementi",
                "subtype": "Sottotipo"
            },
            "tabs": {
                "activity": "Attività",
                "attachment": "Allegato",
                "attachments": "Allegati",
                "card": "Scheda",
                "clonerelationmode": "Modalità Clonazione Relazioni",
                "details": "Dettagli",
                "emails": "Email",
                "history": "Storia",
                "notes": "Note",
                "relations": "Relazioni",
                "schedules": "Scadenze"
            }
        },
        "dashboards": {
            "tools": {
                "gridhide": "Nascondi la tabella dei dati",
                "gridshow": "Mostra la tabella dei dati",
                "parametershide": "Nascondi i parametri",
                "parametersshow": "Mostra i parametri",
                "reload": "Ricarica"
            }
        },
        "emails": {
            "addattachmentsfromdocumentarchive": "Carica da archivio documenti",
            "alredyexistfile": "Esiste già un file con lo stesso nome",
            "archivingdate": "Data di archiviazione",
            "attachfile": "Allega file",
            "bcc": "Ccn",
            "cc": "Cc",
            "composeemail": "Componi e-mail",
            "composefromtemplate": "Componi dal template",
            "delay": "Ritardo",
            "delays": {
                "day1": "1 giorno",
                "days2": "2 giorni",
                "days4": "4 giorni",
                "hour1": "1 ora",
                "hours2": "2 ore",
                "hours4": "4 ore",
                "month1": "1 mese",
                "negativeday1": "1 giorno prima",
                "negativedays2": "2 giorni prima",
                "negativedays4": "4 giorni prima",
                "negativehour1": "1 ora prima",
                "negativehours2": "2 ore prima",
                "negativehours4": "4 ore prima",
                "negativemonth1": "1 mese prima",
                "negativeweek1": "1 settimana prima",
                "negativeweeks2": "2 settimane prima",
                "none": "Nessuno",
                "week1": "1 settimana",
                "weeks2": "2 settimane"
            },
            "dmspaneltitle": "Seleziona allegati da Database",
            "edit": "Modifica",
            "from": "Da",
            "gridrefresh": "Refresh griglia",
            "keepsynchronization": "Mantieni sync",
            "message": "Messaggio",
            "regenerateallemails": "Rigenera tutte le e-mail",
            "regenerateemail": "Rigenera e-mail",
            "remove": "Rimuovi",
            "remove_confirmation": "Sei sicuro di voler eliminare questa email?",
            "reply": "Rispondi",
            "replyprefix": "Il {0} {1} ha scritto",
            "selectaclass": "Seleziona una classe",
            "sendemail": "Invio e-mail",
            "statuses": {
                "draft": "Bozze",
                "error": "Errore",
                "outgoing": "In uscita",
                "received": "Ricevute",
                "sent": "Inviate"
            },
            "subject": "Oggetto",
            "to": "A",
            "view": "Vista"
        },
        "errors": {
            "autherror": "Utente o password sbagliati",
            "classnotfound": "Classe {0} non trovata",
            "fieldrequired": "Questo campo è obbligatorio",
            "invalidfilter": "Filtro non valido",
            "notfound": "Elemento non trovato"
        },
        "filters": {
            "actions": "Azioni",
            "addfilter": "Aggiungi filtro",
            "any": "Una qualsiasi",
            "attachments": "Allegati",
            "attachmentssearchtext": "Testo di ricerca allegati",
            "attribute": "Scegli un attributo",
            "attributes": "Attributi",
            "clearfilter": "Cancella Filtro",
            "clone": "Clona",
            "copyof": "Copia di",
            "currentgroup": "Gruppo corrente",
            "currentuser": "Utente corrente",
            "defaultset": "Imposta come predefinito",
            "defaultunset": "Rimuovi da predefinito",
            "description": "Descrizione",
            "domain": "Dominio",
            "filterdata": "Dati filtro",
            "fromfilter": "Da filtro",
            "fromselection": "Dalla selezione",
            "group": "Gruppo",
            "ignore": "Ignora",
            "migrate": "Migra",
            "name": "Nome",
            "newfilter": "Nuovo filtro",
            "noone": "Nessuna",
            "operator": "Operatore",
            "operators": {
                "beginswith": "Inizia con",
                "between": "Compreso",
                "contained": "Contenuto",
                "containedorequal": "Contenuto o uguale",
                "contains": "Contiene",
                "containsorequal": "Contiene o uguale",
                "descriptionbegin": "La descrizione inizia con",
                "descriptioncontains": "La descrizione contiene",
                "descriptionends": "La descrizione finisce con",
                "descriptionnotbegin": "La descrizione non inizia con",
                "descriptionnotcontain": "La descrizione non contiene",
                "descriptionnotends": "La descrizione non finisce con",
                "different": "Diverso",
                "doesnotbeginwith": "Non inizia con",
                "doesnotcontain": "Non contiene",
                "doesnotendwith": "Non finisce con",
                "endswith": "Finisce con",
                "equals": "Uguale",
                "greaterthan": "Maggiore",
                "isnotnull": "Non è nullo",
                "isnull": "È nullo",
                "lessthan": "Minore"
            },
            "relations": "Relazioni",
            "type": "Tipo",
            "typeinput": "Parametro di input",
            "user": "Utente",
            "value": "Valore"
        },
        "gis": {
            "card": "Scheda",
            "cardsMenu": "Menu Mappa",
            "code": "Codice",
            "description": "Descrizione",
            "extension": {
                "errorCall": "Errore",
                "noResults": "Nessun risultato"
            },
            "externalServices": "Servizi esterni",
            "geographicalAttributes": "Attributi geografici",
            "geoserverLayers": "Layers di Geoserver",
            "layers": "Livelli",
            "list": "Lista",
            "longpresstitle": "Elementi geografici nell'area",
            "map": "Mappa",
            "mapServices": "Servizi geografici",
            "position": "Posizione",
            "root": "Root",
            "tree": "Albero di navigazione",
            "type": "Tipo",
            "view": "Vista",
            "zoom": "Zoom"
        },
        "history": {
            "activityname": "Nome attività",
            "activityperformer": "Esecutore attività",
            "begindate": "Data inizio",
            "enddate": "Data fine",
            "processstatus": "Stato",
            "user": "Utente"
        },
        "importexport": {
            "database": {
                "uri": "Database URI",
                "user": "Database user"
            },
            "downloadreport": "Scarica report",
            "emailfailure": "Si sono verificati dei problemi durante l’invio dell’email!",
            "emailmessage": "In allegato il report dell'import del file \"{0}\" in data {1}",
            "emailsubject": "Report import dati",
            "emailsuccess": "L’email è stata inviata correttamente!",
            "export": "Esporta",
            "exportalldata": "Tutti i dati",
            "exportfiltereddata": "Solo i dati corrispondenti al filtro della griglia",
            "gis": {
                "shapeimportdisabled": "L'import dei shape non è abilitato per questo template",
                "shapeimportenabled": "Configurazioni import shape"
            },
            "ifc": {
                "card": "Scheda",
                "project": "Progetto",
                "sourcetype": "Importa da"
            },
            "import": "Importa",
            "importresponse": "Risposta import",
            "response": {
                "created": "Elementi creati",
                "deleted": "Elementi cancellati",
                "errors": "Errori",
                "linenumber": "Numero linea",
                "message": "Messaggio",
                "modified": "Elementi modificati",
                "processed": "Righe processate",
                "recordnumber": "Numero elemento",
                "unmodified": "Elementi non modificati"
            },
            "sendreport": "Invia report",
            "template": "Template",
            "templatedefinition": "Definizione template"
        },
        "joinviews": {
            "active": "Attiva",
            "addview": "Aggiungi vista",
            "alias": "Alias",
            "attribute": "Attributo",
            "attributes": "Attributi",
            "attributesof": "Attributi di: {0}",
            "createview": "Crea vista",
            "datasorting": "Ordinamento dati",
            "delete": "Elimina",
            "deleteview": "Elimina vista",
            "deleteviewconfirm": "Sei sicuro di voler eliminare questa vista?",
            "description": "Descrizione",
            "disable": "Disabilita",
            "domainalias": "Alias dominio",
            "domainsof": "Domini di {0}",
            "edit": "Modifica",
            "editview": "Modifica configurazioni vista",
            "enable": "Abilita",
            "fieldsets": "Fieldset",
            "filters": "Filtri",
            "generalproperties": "Proprità generali",
            "group": "Gruppo",
            "innerjoin": "Inner join",
            "jointype": "Tipo di join",
            "joinview": "Vista da join",
            "klass": "Classe",
            "manageview": "Gestione vista",
            "masterclass": "Classe principale",
            "masterclassalias": "Alias classe principale",
            "name": "Nome",
            "newjoinview": "Nuova vista da join",
            "outerjoin": "Outer join",
            "pleaseseleceavalidmasterclass": "Perfavore seleziona una classe principale valida",
            "refreshafteredit": "Ricaricare la pagina per vedere le modifiche?",
            "selectatleastoneattribute": "Seleziona almeno un attributo da mostrare nella griglia e nella griglia ridotta al passo 4.",
            "showingrid": "Mostra in griglia",
            "showinreducedgrid": "Mostra in griglia ridotta",
            "targetalias": "Alias classe destinazione"
        },
        "login": {
            "buttons": {
                "login": "Accedi",
                "logout": "Cambia utente"
            },
            "fields": {
                "group": "Gruppo",
                "language": "Lingua",
                "password": "Password",
                "tenants": "Tenant",
                "username": "Username"
            },
            "loggedin": "Autenticato",
            "title": "Accedi",
            "welcome": "Bentornato {0}."
        },
        "main": {
            "administrationmodule": "Modulo di Amministrazione",
            "baseconfiguration": "Configurazioni base",
            "cardlock": {
                "lockedmessage": "Non puoi modificare questa scheda perché la sta modificando {0}.",
                "someone": "qualcuno"
            },
            "changegroup": "Cambia gruppo",
            "changetenant": "Cambia {0}",
            "confirmchangegroup": "Vuoi davvero cambiare il gruppo?",
            "confirmchangetenants": "Vuoi davvero cambiare i tenant attivi?",
            "confirmdisabletenant": "Vuoi davvero disablitare il flag \"Ignora tenant\"?",
            "confirmenabletenant": "Vuoi davvero abilitare il flag \"Ignora tenant\"?",
            "ignoretenants": "Ignora {0}",
            "info": "Informazione",
            "logo": {
                "cmdbuild": "Logo CMDBuild",
                "cmdbuildready2use": "Logo CMDBuild READY2USE",
                "companylogo": "Logo dell’azienda",
                "openmaint": "Logo openMAINT"
            },
            "logout": "Esci",
            "managementmodule": "Modulo gestione dati",
            "multigroup": "Multi gruppo",
            "multitenant": "Multi {0}",
            "navigation": "Navigazione",
            "pagenotfound": "Pagina non trovata",
            "password": {
                "change": "Cambia password",
                "confirm": "Conferma password",
                "email": "Indirizzo email",
                "err_confirm": "Le password non corrispondono.",
                "err_diffprevious": "La password non può essere uguale alla precedente.",
                "err_diffusername": "La password non può essere uguale all'username'.",
                "err_length": "La password deve contenere almeno {0} caratteri.</em>",
                "err_reqdigit": "La password deve contenere almeno un numero.",
                "err_reqlowercase": "La password deve contenere almeno un carattere minuscolo.",
                "err_requppercase": "La password deve contenere almeno un carattere maiuscolo.",
                "expired": "La tua password è scaduta. Modificala ora.",
                "forgotten": "Ho dimenticato la password",
                "new": "Nuova password",
                "old": "Vecchia password",
                "recoverysuccess": "Ti abbiamo inviato una email con le istruzioni per il ripristino della password.",
                "reset": "Reimposta password",
                "saved": "Password salvata correttamente!"
            },
            "pleasecorrecterrors": "Correggi gli errori evidenziati!",
            "preferences": {
                "comma": "Virgola",
                "decimalserror": "Il campo separatore decimali è obbligatorio",
                "decimalstousandserror": "I campi separatore migliaia e decimali devono essere diversi",
                "default": "Predefinito",
                "defaultvalue": "Valore di default",
                "firstdayofweek": "Primo giorno della settimana",
                "gridpreferencesclear": "Rimuovi preferenze griglia",
                "gridpreferencescleared": "Preferenze griglia rimosse!",
                "gridpreferencessave": "Salva preferenze griglia",
                "gridpreferencessaved": "Preferenze griglia salvate!",
                "gridpreferencesupdate": "Aggiorna preferenze griglia",
                "labelcsvseparator": "Separatore CSV",
                "labeldateformat": "Formato data",
                "labeldecimalsseparator": "Separatore decimali",
                "labellanguage": "Lingua",
                "labelthousandsseparator": "Separatore migliaia",
                "labeltimeformat": "Formato ora",
                "msoffice": "Microsoft Office",
                "period": "Punto",
                "preferredfilecharset": "Codifica CSV",
                "preferredofficesuite": "Suite Office preferita",
                "space": "Spazio",
                "thousandserror": "Il campo separatore migliaia è obbligatorio",
                "timezone": "Fuso orario",
                "twelvehourformat": "Formato 12 ore",
                "twentyfourhourformat": "Formato 24 ore"
            },
            "searchinallitems": "Cerca in tutti gli elementi",
            "treenavcontenttitle": "{0} di {1}",
            "userpreferences": "Preferenze"
        },
        "menu": {
            "allitems": "Tutti gli elementi",
            "classes": "Classi",
            "custompages": "Pagine custom",
            "dashboards": "Dashboard",
            "processes": "Processi",
            "reports": "Report",
            "views": "Viste"
        },
        "notes": {
            "edit": "Modifica nota"
        },
        "notifier": {
            "attention": "Attenzione",
            "error": "Errore",
            "genericerror": "Errore generico",
            "genericinfo": "Info generico",
            "genericwarning": "Warning generico",
            "info": "Informazione",
            "success": "Successo",
            "warning": "Attenzione"
        },
        "patches": {
            "apply": "Applica patch",
            "category": "Categoria",
            "description": "Descrizione",
            "name": "Nome",
            "patches": "Patch"
        },
        "processes": {
            "abortconfirmation": "Sicuro di voler interrompere questo processo?",
            "abortprocess": "Interrompi processo",
            "action": {
                "advance": "Continua",
                "label": "Azione"
            },
            "activeprocesses": "Processi attivi",
            "allstatuses": "Tutti",
            "editactivity": "Modifica attività",
            "openactivity": "Apri attività",
            "startworkflow": "Avvia",
            "workflow": "Processo"
        },
        "relationGraph": {
            "activity": "Processo",
            "allLabelsOnGraph": "tutte le etichette",
            "card": "Scheda",
            "cardList": "Lista schede",
            "cardRelations": "Relazioni",
            "choosenaviagationtree": "Scegli albero di navigazione",
            "class": "Classe",
            "classList": "Lista classi",
            "compoundnode": "Raggruppamento di nodi",
            "disable": "Nascondi",
            "edges": "Archi",
            "enable": "Mostra",
            "labelsOnGraph": "tooltip",
            "level": "Livello",
            "nodes": "Nodi",
            "openRelationGraph": "Apri grafo delle relazioni",
            "qt": "Quantità",
            "refresh": "Ricarica",
            "relation": "Relazioni",
            "relationGraph": "Grafo delle relazioni",
            "reopengraph": "Riapri il grafo da questo nodo"
        },
        "relations": {
            "adddetail": "Aggiungi Dettaglio",
            "addrelations": "Aggiungi relazioni",
            "attributes": "Attributi",
            "code": "Codice",
            "deletedetail": "Elimina dettaglio",
            "deleterelation": "Cancella relazione",
            "deleterelationconfirm": "Sei sicuro di voler cancellare questa relazione?",
            "description": "Descrizione",
            "editcard": "Modifica scheda",
            "editdetail": "Modifica dettaglio",
            "editrelation": "Modifica relazione",
            "extendeddata": "Dati estesi",
            "mditems": "elementi",
            "missingattributes": "Attributi obbligatori mancanti",
            "opencard": "Apri scheda collegata",
            "opendetail": "Visualizza dettaglio",
            "type": "Tipo"
        },
        "reports": {
            "csv": "CSV",
            "download": "Scarica",
            "format": "Formato",
            "odt": "ODT",
            "pdf": "PDF",
            "print": "Stampa",
            "reload": "Ricarica",
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
                            "description": "Giornaliera"
                        },
                        "monthly": {
                            "description": "Mensile"
                        },
                        "once": {
                            "description": "Singola occorrenza"
                        },
                        "weekly": {
                            "description": "Settimanale"
                        },
                        "yearly": {
                            "description": "Annuale"
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
            "addThematism": "Aggiungi Tematismo",
            "analysisType": "Tipo di Analisi",
            "attribute": "Attributi",
            "calculateRules": "Genera regole di stile",
            "clearThematism": "Cancella Tematismo",
            "color": "Colore",
            "defineLegend": "Definizione Legenda",
            "defineThematism": "Definizione Tematismo",
            "function": "Funzione",
            "generate": "Genera",
            "geoAttribute": "Attributo Geografico",
            "graduated": "Graduato",
            "highlightSelected": "Evidenzia elemento selezionato",
            "intervals": "Intervalli",
            "legend": "Legenda",
            "name": "Nome",
            "newThematism": "Nuovo Tematismo",
            "punctual": "Puntuale",
            "quantity": "Quantità",
            "segments": "Segmenti",
            "source": "Fonte Dati",
            "table": "Tabella",
            "thematism": "Tematismi",
            "value": "Valore"
        },
        "widgets": {
            "customform": {
                "addrow": "Aggiungi riga",
                "clonerow": "Clona riga",
                "datanotvalid": "Dati non validi",
                "deleterow": "Cancella riga",
                "editrow": "Modifica riga",
                "export": "Esporta",
                "import": "Importa",
                "importexport": {
                    "expattributes": "Dati da esportare",
                    "file": "File",
                    "filename": "Nome file",
                    "format": "Formato",
                    "importmode": "Modalità di import",
                    "keyattributes": "Attributi chiave",
                    "missingkeyattr": "Scegli almeno un attributo chiave",
                    "modeadd": "Aggiungi",
                    "modemerge": "Aggiorna",
                    "modereplace": "Sostituisci",
                    "separator": "Separatore"
                },
                "refresh": "Aggiorna ai valori predefiniti"
            },
            "linkcards": {
                "checkedonly": "Solo selezionati",
                "editcard": "Modifica scheda",
                "opencard": "Apri scheda",
                "refreshselection": "Applica selezione di default",
                "togglefilterdisabled": "Disabilita filtro griglia",
                "togglefilterenabled": "Abilita filtro griglia"
            },
            "required": "Questo widget è obbligatorio"
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