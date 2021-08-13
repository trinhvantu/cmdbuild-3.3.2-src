(function() {
    Ext.define('CMDBuildUI.locales.hr.Locales', {
        "requires": ["CMDBuildUI.locales.hr.LocalesAdministration"],
        "override": "CMDBuildUI.locales.Locales",
        "singleton": true,
        "localization": "hr",
        "administration": CMDBuildUI.locales.hr.LocalesAdministration.administration,
        "attachments": {
            "add": "Dodaj privitak",
            "attachmenthistory": "Povijest privitaka",
            "author": "Autor",
            "browse": "Pregled & hellip;",
            "category": "Kategorija",
            "code": "Kod",
            "creationdate": "Datum izrade",
            "deleteattachment": "Ukloni privitak",
            "deleteattachment_confirmation": "Jeste li sigurni da želite izbrisati ovaj privitak?",
            "description": "Opis",
            "download": "Preuzimanje",
            "dropfiles": "Povucite i ispustite datoteke ovdje",
            "editattachment": "Uredi privitak",
            "file": "Datoteka",
            "filealreadyinlist": "Datoteka {0} već je na popisu.",
            "filename": "Naziv datoteke",
            "fileview": "<em>View attachment</em>",
            "invalidfiles": "Ukloni neispravne datoteke",
            "majorversion": "Glavna verzija",
            "modificationdate": "Datum promjene",
            "new": "Novi privitak",
            "nocategory": "Nekategorizirano",
            "preview": "Pregled",
            "removefile": "Ukloni datoteku",
            "statuses": {
                "empty": "Prazna datoteka",
                "error": "Greška",
                "extensionNotAllowed": "Ekstenzija datoteke nije dozvoljena",
                "loaded": "Učitano",
                "ready": "Spremno"
            },
            "successupload": "{0} privitaka preuzeto.",
            "uploadfile": "Učitaj datoteku...",
            "version": "Verzija",
            "viewhistory": "Pogledajte povijest privitaka",
            "warningmessages": {
                "atleast": "Upozorenje: učitano je {0} privitaka tipa \" {1}\". Ova kategorija očekuje najmanje {2} privitaka ",
                "exactlynumber": "Upozorenje: učitano je {0} privitaka tipa \" {1}\". Ova kategorija očekuje {2} privitaka",
                "maxnumber": "Upozorenje: privitak {0} tipa \"{1} \" je učitan. Ova kategorija ne očekuje više od {2} privitaka"
            },
            "wrongfileextension": "{0} ekstenzija datoteke nije dopuštena"
        },
        "bim": {
            "bimViewer": "BIM Pregled",
            "card": {
                "label": "Kartica"
            },
            "layers": {
                "label": "Slojevi",
                "menu": {
                    "hideAll": "Sakrij Sve",
                    "showAll": "Pokaži sve"
                },
                "name": "Ime",
                "qt": "Kol.",
                "visibility": "Vidljivost"
            },
            "menu": {
                "camera": "Kamera",
                "frontView": "Pogled sprijeda",
                "mod": "Kontrole preglednika",
                "orthographic": "Ortografska kamera",
                "pan": "Pomiči",
                "perspective": "Kamera za perspektivu",
                "resetView": "Poništi Prikaz",
                "rotate": "Rotiraj",
                "sideView": "Bočni pogled",
                "topView": "Pogled Odozgo"
            },
            "showBimCard": "Open 3D viewer",
            "tree": {
                "arrowTooltip": "Odaberite element",
                "columnLabel": "Tree",
                "label": "Tree",
                "open_card": "Otvori povezanu karticu",
                "root": "Ifc Root"
            }
        },
        "bulkactions": {
            "abort": "Prekini odabrane stavke",
            "cancelselection": "Poništi odabir",
            "confirmabort": "Prekidate instance procesa {0}. Jeste li sigurni da želite nastaviti?",
            "confirmdelete": "Brišete {0} kartica. Jeste li sigurni da želite nastaviti?",
            "confirmdeleteattachements": "Brišete {0} privitaka. Jeste li sigurni da želite nastaviti?",
            "confirmedit": "Mijenjate {0} za {1} kartica. Jeste li sigurni da želite nastaviti?",
            "delete": "Brisanje odabranih stavaka",
            "download": "Preuzimanje odabranih privitaka",
            "edit": "Uredi odabrane stavke",
            "selectall": "Odaberite sve stavke"
        },
        "calendar": {
            "active_expired": "Aktivno / Isteklo",
            "add": "Dodaj raspored",
            "advancenotification": "Unaprijed obavijest za nekoliko dana",
            "allcategories": "Sve kategorije",
            "alldates": "Svi datumi",
            "calculated": "Izračunato",
            "calendar": "Kalendar",
            "cancel": "Označi kao poništeno",
            "category": "Kategorija",
            "cm_confirmcancel": "Jeste li sigurni da želite označiti kao otkazane odabrane rasporede?",
            "cm_confirmcomplete": "Jeste li sigurni da želite označiti kao završene odabrane rasporede?",
            "cm_markcancelled": "Označi kao otkazane odabrane rasporede",
            "cm_markcomplete": "Označi kao završene odabrane rasporede",
            "complete": "Označi kao završeno",
            "completed": "Dovršeno",
            "date": "Datum",
            "days": "Dana",
            "delaybeforedeadline": "Kašnjenje prije isteka roka",
            "delaybeforedeadlinevalue": "Vrijednost kašnjenja prije isteka roka",
            "description": "Opis",
            "editevent": "Promijeni raspored",
            "enddate": "Datum završetka",
            "endtype": "Vrsta kraja",
            "event": "Raspored",
            "executiondate": "Datum Izvršenja",
            "frequency": "Učestalost",
            "frequencymultiplier": "Množitelj frekvencije",
            "grid": "Rešetka",
            "leftdays": "Preostalo dana",
            "londdescription": "Puni opis",
            "manual": "Priručnik",
            "maxactiveevents": "Maksimalni broj aktivnih rasporeda",
            "messagebodydelete": "Želite li ukloniti pravilo planera?",
            "messagebodyplural": "Postoji {0} pravila rasporeda",
            "messagebodyrecalculate": "Želite li ponovno izračunati pravilo rasporeda s novim datumom?",
            "messagebodysingular": "Postoji {0} pravilo rasporeda",
            "messagetitle": "Ponovni izračun rasporeda",
            "missingdays": "Nedostaje dana",
            "next30days": "Idućih 30 dana",
            "next7days": "Idućih 7 dana",
            "notificationtemplate": "Predložak koji se koristi za obavijest",
            "notificationtext": "Tekst obavijesti",
            "occurencies": "Broj incidenata",
            "operation": "Radnja",
            "partecipantgroup": "Grupa sudionika",
            "partecipantuser": "Korisnik koji sudjeluje",
            "priority": "Prioritet",
            "recalculate": "Ponovno izračunaj",
            "referent": "Referent",
            "scheduler": "Planer",
            "sequencepaneltitle": "Generirajrasporede",
            "startdate": "Datum početka",
            "status": "Status",
            "today": "Danas",
            "type": "Vrsta",
            "viewevent": "Vidi raspored",
            "widgetcriterion": "Kriterij izračuna",
            "widgetemails": "Poruke e-pošte",
            "widgetsourcecard": "Izvorna kartica"
        },
        "classes": {
            "cards": {
                "addcard": "Dodaj karticu",
                "clone": "Kloniraj",
                "clonewithrelations": "Kloniranje kartice i odnosa",
                "deletebeaware": "Imajte na umu da:",
                "deleteblocked": "Nastavak brisanja nije moguć jer postoji veza s {0}.",
                "deletecard": "Ukloni karticu",
                "deleteconfirmation": "Jeste li sigurni da želite izbrisati ovu karticu?",
                "deleterelatedcards": "također {0} povezane kartice bit će uklonjene",
                "deleterelations": "veze s karticama {0} bit će uklonjene",
                "label": "Kartice",
                "modifycard": "Uredi karticu",
                "opencard": "Otvori karticu",
                "print": "Ispis kartice"
            },
            "simple": "Jednostavno",
            "standard": "Standard"
        },
        "common": {
            "actions": {
                "add": "Dodaj",
                "apply": "Primijeni",
                "cancel": "Poništi",
                "close": "Zatvori",
                "delete": "Ukloni",
                "edit": "Uredi",
                "execute": "Izvrši",
                "help": "Pomoć",
                "load": "Učitaj",
                "open": "Otvori",
                "refresh": "Osvježi podatke",
                "remove": "Ukloni",
                "save": "Spremi",
                "saveandapply": "Spremi i primijeni",
                "saveandclose": "Spremi i zatvori",
                "search": "Pretraživanje",
                "searchtext": "Traži..."
            },
            "attributes": {
                "nogroup": "Osnovni podaci"
            },
            "dates": {
                "date": "d / m / y",
                "datetime": "d/m/Y H:i:s",
                "time": "H:i:s"
            },
            "editor": {
                "clearhtml": "Obriši HTML",
                "expand": "Proširite uređivač",
                "reduce": "Smanji uređivač",
                "unlink": "<em>Unlink</em>",
                "unlinkmessage": "<em>Transform the selected hyperlink into text.</em>"
            },
            "grid": {
                "disablemultiselection": "Onemogućite Višestruki odabir",
                "enamblemultiselection": "Omogući Višestruki odabir",
                "export": "Izvoz podataka",
                "filterremoved": "Trenutni filtar je uklonjen",
                "import": "Uvoz podataka",
                "itemnotfound": "Stavka nije pronađena",
                "list": "Popis",
                "opencontextualmenu": "Otvori kontekstni izbornik",
                "print": "Ispis",
                "printcsv": "Ispis u CSV formatu",
                "printodt": "Ispis u ODT formatu",
                "printpdf": "Ispis u PDF formatu",
                "row": "Stavka",
                "rows": "Stavke",
                "subtype": "Podtip"
            },
            "tabs": {
                "activity": "Aktivnost",
                "attachment": "Privitak",
                "attachments": "Privitci",
                "card": "Kartica",
                "clonerelationmode": "Način Kloniranja Odnosa",
                "details": "Detalji",
                "emails": "Poruke e-pošte",
                "history": "Povijest",
                "notes": "Bilješke",
                "relations": "Veze",
                "schedules": "Rasporedi"
            }
        },
        "dashboards": {
            "tools": {
                "gridhide": "Sakrij podatkovnu rešetku",
                "gridshow": "Prikaži tablicu podataka",
                "parametershide": "Sakrij parametre podataka",
                "parametersshow": "Prikaži parametre podataka",
                "reload": "Ponovo učitaj"
            }
        },
        "emails": {
            "addattachmentsfromdocumentarchive": "Dodaj privitke iz arhive dokumenata",
            "alredyexistfile": "Već postoji datoteka s tim imenom",
            "archivingdate": "Datum arhiviranja",
            "attachfile": "Priloži datoteku",
            "bcc": "Bcc",
            "cc": "Cc",
            "composeemail": "Sastavite e-poštu",
            "composefromtemplate": "Izrada iz predloška",
            "delay": "Delay",
            "delays": {
                "day1": "Za 1 dan",
                "days2": "Za 2 dana",
                "days4": "Za 4 dana",
                "hour1": "1 sat",
                "hours2": "2 sata",
                "hours4": "4 sata",
                "month1": "Za 1 mjesec",
                "negativeday1": "1 dan prije",
                "negativedays2": "2 dana prije",
                "negativedays4": "4 dana prije",
                "negativehour1": "1 sat prije",
                "negativehours2": "2 sata ranije",
                "negativehours4": "4 sata ranije",
                "negativemonth1": "1 mjesec prije",
                "negativeweek1": "1 tjedan prije",
                "negativeweeks2": "2 tjedna ranije",
                "none": "Nema",
                "week1": "Za 1 tjedan",
                "weeks2": "Za 2 tjedna"
            },
            "dmspaneltitle": "Odaberite privitke iz baze podataka",
            "edit": "Uredi",
            "from": "Od",
            "gridrefresh": "Ažuriranje rešetke",
            "keepsynchronization": "Zadrži sinkronizaciju",
            "message": "Poruka",
            "regenerateallemails": "Ponovno generiraj sve poruke e-pošte",
            "regenerateemail": "Ponovno generiraj poruku e-pošte",
            "remove": "Ukloni",
            "remove_confirmation": "Jeste li sigurni da želite izbrisati ovu e-poštu?",
            "reply": "odgovori",
            "replyprefix": "Na {0}, {1} napisano:",
            "selectaclass": "Odaberite klasu",
            "sendemail": "Pošalji e-poštu",
            "statuses": {
                "draft": "Skica",
                "error": "Greška",
                "outgoing": "Odlazni",
                "received": "Primljeno",
                "sent": "Poslano"
            },
            "subject": "Predmet",
            "to": "Za",
            "view": "Pogled"
        },
        "errors": {
            "autherror": "Neispravno korisničko ime ili lozinka",
            "classnotfound": "Klasa {0} nije pronađena",
            "fieldrequired": "Ovo polje je obavezno",
            "invalidfilter": "Neispravan filtar",
            "notfound": "Stavka nije pronađena"
        },
        "filters": {
            "actions": "Radnje",
            "addfilter": "Dodaj filtar",
            "any": "Bilo koji",
            "attachments": "<em>Attachments</em>",
            "attachmentssearchtext": "<em>Attachments search text</em>",
            "attribute": "Odaberi atribut",
            "attributes": "Atributi",
            "clearfilter": "Očisti filtar",
            "clone": "Kloniraj",
            "copyof": "Kopija od",
            "currentgroup": "Trenutna grupa",
            "currentuser": "Trenutni korisnik",
            "defaultset": "Postavi kao zadano",
            "defaultunset": "Poništi od zadanog",
            "description": "Opis",
            "domain": "Domena",
            "filterdata": "Filtriranje podataka",
            "fromfilter": "<em>From filter</em>",
            "fromselection": "Od odabira",
            "group": "Grupa",
            "ignore": "Zanemari",
            "migrate": "Migrira",
            "name": "Ime",
            "newfilter": "Novi filtar",
            "noone": "Nitko.",
            "operator": "Operation",
            "operators": {
                "beginswith": "Počinje sa",
                "between": "Između",
                "contained": "Sadržano",
                "containedorequal": "Sadržan ili jednak",
                "contains": "Sadrži",
                "containsorequal": "Sadrži ili jednako",
                "descriptionbegin": "<em>Description begins with</em>",
                "descriptioncontains": "Opis sadrži",
                "descriptionends": "<em>Description ends with</em>",
                "descriptionnotbegin": "<em>Description does not begins with</em>",
                "descriptionnotcontain": "<em>Description does not contain</em>",
                "descriptionnotends": "<em>Description does not ends with</em>",
                "different": "Različiti",
                "doesnotbeginwith": "Ne počinje sa",
                "doesnotcontain": "Ne sadrži",
                "doesnotendwith": "Ne završava sa",
                "endswith": "Završava sa",
                "equals": "Jednako",
                "greaterthan": "Veće od",
                "isnotnull": "Nije nula",
                "isnull": "Nula",
                "lessthan": "Manje od"
            },
            "relations": "Veze",
            "type": "Vrsta",
            "typeinput": "Ulazni parametar",
            "user": "Korisnik",
            "value": "Vrijednost"
        },
        "gis": {
            "card": "Kartica",
            "cardsMenu": "Cards Menu",
            "code": "Kod",
            "description": "Opis",
            "extension": {
                "errorCall": "Greška",
                "noResults": "Nema rezultata"
            },
            "externalServices": "Vanjske usluge",
            "geographicalAttributes": "Geo Atributi",
            "geoserverLayers": "Slojevi geoserver poslužitelja",
            "layers": "Slojevi",
            "list": "Popis",
            "longpresstitle": "Geo-elementi u području",
            "map": "Karta",
            "mapServices": "Kartografski servisi",
            "position": "Položaj",
            "root": "Korijen",
            "tree": "Tree",
            "type": "Vrsta",
            "view": "Pogled",
            "zoom": "Zoom"
        },
        "history": {
            "activityname": "Activity name",
            "activityperformer": "Izvršitelj aktivnosti",
            "begindate": "Datum početka",
            "enddate": "Datum završetka",
            "processstatus": "Status",
            "user": "Korisnik"
        },
        "importexport": {
            "database": {
                "uri": "Uri baze podataka",
                "user": "Korisnik baze podataka"
            },
            "downloadreport": "Preuzmite izvješće",
            "emailfailure": "Došlo je do pogreške prilikom slanja e-pošte!",
            "emailmessage": "Priloženo izvješće o uvozu datoteke \"{0} \" u datumu {1}",
            "emailsubject": "Izvješće o uvozu podataka",
            "emailsuccess": "Poruke e-pošte je uspješno poslana!",
            "export": "Export",
            "exportalldata": "Svi podaci",
            "exportfiltereddata": "Samo podaci koji odgovaraju filtru rešetke",
            "gis": {
                "shapeimportdisabled": "Uvoz oblika za ovaj predložak nije uključen",
                "shapeimportenabled": "Konfiguracija uvoza oblika"
            },
            "ifc": {
                "card": "<em>Card</em>",
                "project": "Projekt",
                "sourcetype": "Uvezi iz"
            },
            "import": "Uvoz",
            "importresponse": "Odgovor na uvoz",
            "response": {
                "created": "Stvorene stavke",
                "deleted": "Izbrisane stavke",
                "errors": "Pogreške",
                "linenumber": "Broj retka",
                "message": "Poruka",
                "modified": "Promijenjene stavke",
                "processed": "Obrađene linije",
                "recordnumber": "Broj zapisa",
                "unmodified": "Nepromjenjeni elementi"
            },
            "sendreport": "Pošalji izvješće",
            "template": "Predložak",
            "templatedefinition": "Definicija predloška"
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
                "login": "Prijava",
                "logout": "Promijeni korisnika"
            },
            "fields": {
                "group": "Grupa",
                "language": "Jezik",
                "password": "Lozinka",
                "tenants": "Zakupac",
                "username": "Korisničko ime"
            },
            "loggedin": "Prijavljen",
            "title": "Prijava",
            "welcome": "Dobrodošli natrag {0}."
        },
        "main": {
            "administrationmodule": "Administracijski modul",
            "baseconfiguration": "Osnovna konfiguracija",
            "cardlock": {
                "lockedmessage": "Ne možete urediti ovu karticu zato što je {0} uređuje.",
                "someone": "netko"
            },
            "changegroup": "Promijeni grupu",
            "changetenant": "Promjena {0}",
            "confirmchangegroup": "Jeste li sigurni da želite promijeniti grupu?",
            "confirmchangetenants": "Jeste li sigurni da želite promijeniti aktivne stanare?",
            "confirmdisabletenant": "Jeste li sigurni da želite onemogućiti oznaku \"Zanemari stanare\"?",
            "confirmenabletenant": "Jeste li sigurni da želite uključiti oznaku \"Zanemari stanare\"?",
            "ignoretenants": "Zanemari {0}",
            "info": "Informacije",
            "logo": {
                "cmdbuild": "CMDBuild Logotip",
                "cmdbuildready2use": "CMDBuild READY2USE logotip",
                "companylogo": "Logotip tvrtke",
                "openmaint": "logotip openMAINT"
            },
            "logout": "Odjava",
            "managementmodule": "Upravljački modul podataka",
            "multigroup": "Multigroup",
            "multitenant": "Više {0}",
            "navigation": "Navigacija",
            "pagenotfound": "Stranica nije pronađena",
            "password": {
                "change": "Promijeni lozinku",
                "confirm": "Potvrdite lozinku",
                "email": "Adrese e-pošte",
                "err_confirm": "Lozinka se ne podudara.",
                "err_diffprevious": "Lozinka ne može biti identična prethodnoj.",
                "err_diffusername": "Lozinka se ne može podudarati s korisničkim imenom.",
                "err_length": "Lozinka mora sadržavati najmanje {0} znakova.",
                "err_reqdigit": "Lozinka mora sadržavati barem jednu znamenku.",
                "err_reqlowercase": "Lozinka mora sadržavati barem jedan mali znak.",
                "err_requppercase": "Lozinka mora sadržavati barem jedan veliki znak.",
                "expired": "Vaša lozinka je istekla. Morate ju odmah promijeniti.",
                "forgotten": "Zaboravio/la sam lozinku.",
                "new": "Nova lozinka",
                "old": "Stara lozinka",
                "recoverysuccess": "Poslali smo vam e-poštu s uputama za oporavak zaporke.",
                "reset": "Poništavanje zaporke",
                "saved": "Lozinka je uspješno spremljena!"
            },
            "pleasecorrecterrors": "Ispravite navedene pogreške!",
            "preferences": {
                "comma": "Zarez",
                "decimalserror": "Polje decimalnih mjesta mora biti prisutno",
                "decimalstousandserror": "Razdjelnici decimala i tisućica moraju biti različiti",
                "default": "Default",
                "defaultvalue": "Zadana vrijednost",
                "firstdayofweek": "<em>First day of week</em>",
                "gridpreferencesclear": "Obriši postavke rešetke",
                "gridpreferencescleared": "Postavke rešetke su izbrisane!",
                "gridpreferencessave": "Spremanje postavki rešetke",
                "gridpreferencessaved": "Postavke rešetke su spremljene!",
                "gridpreferencesupdate": "Ažuriranje postavki rešetke",
                "labelcsvseparator": "CSV separator",
                "labeldateformat": "Format datuma",
                "labeldecimalsseparator": "Decimalni razdjelnik",
                "labellanguage": "Jezik",
                "labelthousandsseparator": "Razdjelnik tisućica",
                "labeltimeformat": "Format vremena",
                "msoffice": "Microsoft Office",
                "period": "Razdoblje",
                "preferredfilecharset": "CSV kodiranje",
                "preferredofficesuite": "Željeni uredski paket",
                "space": "Razmak",
                "thousandserror": "Polje tisućica mora biti prisutno",
                "timezone": "Vremenska zona",
                "twelvehourformat": "12-satni format",
                "twentyfourhourformat": "24-satni format"
            },
            "searchinallitems": "Pretraživanje svih stavki",
            "treenavcontenttitle": "{0} od {1}",
            "userpreferences": "Postavke"
        },
        "menu": {
            "allitems": "Sve stavke",
            "classes": "Klase",
            "custompages": "Prilagodljive stranice",
            "dashboards": "Nadzorna ploče",
            "processes": "Procesi",
            "reports": "Izvještaji",
            "views": "Prikazi"
        },
        "notes": {
            "edit": "Uredi bilješke"
        },
        "notifier": {
            "attention": "Pozor",
            "error": "Greška",
            "genericerror": "Opća pogreška",
            "genericinfo": "Opće informacije",
            "genericwarning": "Opće upozorenje",
            "info": "Informacije",
            "success": "Uspjeh",
            "warning": "Upozorenje"
        },
        "patches": {
            "apply": "Primijeni zakrpe",
            "category": "Kategorija",
            "description": "Opis",
            "name": "Ime",
            "patches": "Zakrpe"
        },
        "processes": {
            "abortconfirmation": "Jeste li sigurni da želite prekinuti taj proces?",
            "abortprocess": "Prekini postupak",
            "action": {
                "advance": "Napredno",
                "label": "Radnja"
            },
            "activeprocesses": "Aktivni procesi",
            "allstatuses": "Sve",
            "editactivity": "Promjena aktivnosti",
            "openactivity": "Otvori događaj",
            "startworkflow": "Započni",
            "workflow": "Tijek rada"
        },
        "relationGraph": {
            "activity": "aktivnost",
            "allLabelsOnGraph": "sve oznake na grafikonu",
            "card": "Kartica",
            "cardList": "Popis Kartica",
            "cardRelations": "Kartične veze",
            "choosenaviagationtree": "Odaberite navigacijsko stablo",
            "class": "Klasa",
            "classList": "Popis klasa",
            "compoundnode": "Čvor Spoja",
            "disable": "Onemogući",
            "edges": "<em>Edges</em>",
            "enable": "Omogući",
            "labelsOnGraph": "pop-up savjet na grafikonu",
            "level": "Razina",
            "nodes": "<em>Nodes</em>",
            "openRelationGraph": "Otvori Grafikon Veza",
            "qt": "Kol.",
            "refresh": "Osvježi",
            "relation": "veza",
            "relationGraph": "Grafikon veza",
            "reopengraph": "Ponovno otvorite grafikon iz ovog čvora"
        },
        "relations": {
            "adddetail": "Dodaj pojedinosti",
            "addrelations": "Dodaj veze",
            "attributes": "Atributi",
            "code": "Kod",
            "deletedetail": "Ukloni detalj",
            "deleterelation": "Ukloni vezu",
            "deleterelationconfirm": "Jeste li sigurni da želite ukloniti ovu vezu?",
            "description": "Opis",
            "editcard": "Uredi karticu",
            "editdetail": "Uredi detalje",
            "editrelation": "Uredi vezu",
            "extendeddata": "Prošireni podaci",
            "mditems": "stavke",
            "missingattributes": "Nema obaveznih atributa",
            "opencard": "Otvori povezanu karticu",
            "opendetail": "Prikaži pojedinosti",
            "type": "Vrsta"
        },
        "reports": {
            "csv": "CSV",
            "download": "Preuzimanje",
            "format": "Format",
            "odt": "ODT",
            "pdf": "PDF",
            "print": "Ispis",
            "reload": "Ponovo učitaj",
            "rtf": "RTF format"
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
                            "description": "Dnevno"
                        },
                        "monthly": {
                            "description": "Mjesečno"
                        },
                        "once": {
                            "description": "Jednom"
                        },
                        "weekly": {
                            "description": "Tjedno"
                        },
                        "yearly": {
                            "description": "Godišnje"
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
            "addThematism": "Dodaj Thematism",
            "analysisType": "Vrsta Analize",
            "attribute": "Atribut",
            "calculateRules": "Generiraj stilska pravila",
            "clearThematism": "Obriši Thematism",
            "color": "Boja",
            "defineLegend": "Definicija legende",
            "defineThematism": "Thematism definicija",
            "function": "Značajka",
            "generate": "Generiraj",
            "geoAttribute": "Geografski Atribut",
            "graduated": "Slojevito",
            "highlightSelected": "Označi odabranu stavku",
            "intervals": "Intervali",
            "legend": "Legenda",
            "name": "ime",
            "newThematism": "Novi Thematism",
            "punctual": "Točan",
            "quantity": "Zbroj",
            "segments": "Segmenti",
            "source": "Izvor",
            "table": "Tablica",
            "thematism": "Thematisms",
            "value": "Vrijednost"
        },
        "widgets": {
            "customform": {
                "addrow": "Dodaj redak",
                "clonerow": "Kloniraj red",
                "datanotvalid": "Podaci nisu valjani",
                "deleterow": "Ukloni redak",
                "editrow": "Uredi redak",
                "export": "Export",
                "import": "Uvoz",
                "importexport": {
                    "expattributes": "Podaci za izvoz",
                    "file": "Datoteka",
                    "filename": "Naziv datoteke",
                    "format": "Format",
                    "importmode": "Način uvoza",
                    "keyattributes": "Ključni atributi",
                    "missingkeyattr": "Odaberite barem jedan ključni atribut",
                    "modeadd": "Dodaj",
                    "modemerge": "Spoji",
                    "modereplace": "Zamijeni",
                    "separator": "Razdjelnik"
                },
                "refresh": "Osvježi na zadane postavke"
            },
            "linkcards": {
                "checkedonly": "Samo označene",
                "editcard": "Uredi karticu",
                "opencard": "Otvori karticu",
                "refreshselection": "Primijeni zadani odabir",
                "togglefilterdisabled": "Onemogući filtar rešetke",
                "togglefilterenabled": "Omogući filtar rešetke"
            },
            "required": "Ovaj widget je potreban."
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