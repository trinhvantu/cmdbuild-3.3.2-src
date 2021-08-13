(function() {
    Ext.define('CMDBuildUI.locales.sr.Locales', {
        "requires": ["CMDBuildUI.locales.sr.LocalesAdministration"],
        "override": "CMDBuildUI.locales.Locales",
        "singleton": true,
        "localization": "sr",
        "administration": CMDBuildUI.locales.sr.LocalesAdministration.administration,
        "attachments": {
            "add": "Dodaj prilog",
            "attachmenthistory": "Istorija priloga",
            "author": "Autor",
            "browse": "Pretraga i pomoć;",
            "category": "Kategorija",
            "code": "Kod",
            "creationdate": "Datum kreiranja",
            "deleteattachment": "Obriši prilog",
            "deleteattachment_confirmation": "Zaista želite da uklonite prilog?",
            "description": "Opis",
            "download": "Preuzmi",
            "dropfiles": "ovde spustite datoteke",
            "editattachment": "Modifikuj prilog",
            "file": "Datoteka",
            "filealreadyinlist": "Datoteka {0} je već u listi.",
            "filename": "Naziv datoteke",
            "fileview": "<em>View attachment</em>",
            "invalidfiles": "Ukloni nevalidne datoteke",
            "majorversion": "Glavna verzija",
            "modificationdate": "Datum izmene",
            "new": "Novi prilog",
            "nocategory": "Nekategorisan",
            "preview": "Pregled",
            "removefile": "Ukloni datoteku",
            "statuses": {
                "empty": "Prazna datoteka",
                "error": "Greška",
                "extensionNotAllowed": "Ekstenzija nije dozvoljena",
                "loaded": "Učitano",
                "ready": "Spreman"
            },
            "successupload": "{0} priloga je poslano.",
            "uploadfile": "Pošalji datoteku…",
            "version": "Verzija",
            "viewhistory": "Prikaži istoriju priloga",
            "warningmessages": {
                "atleast": "Pažnja: učitano je {0} priloga tipa ”{1}”. Najmanje {2} priloga su neophodna za ovu kategoriju.",
                "exactlynumber": "Pažnja: učitano je {0} priloga tipa ”{1}”. {2} priloga su neophodna za ovu kategoriju.",
                "maxnumber": "Pažnja: učitano je {0} priloga tipa ”{1}”. Najviše {2} priloga su dozvoljena za ovu kategoriju."
            },
            "wrongfileextension": "ekstenzija {0} nije dozvoljena"
        },
        "bim": {
            "bimViewer": "Bim prikaz",
            "card": {
                "label": "Kartica"
            },
            "layers": {
                "label": "Slojevi",
                "menu": {
                    "hideAll": "Sakrij sve",
                    "showAll": "Prikaži sve"
                },
                "name": "Naziv",
                "qt": "Qt",
                "visibility": "Vidljivost"
            },
            "menu": {
                "camera": "Kamera",
                "frontView": "Prikaz spreda",
                "mod": "Kontrole prikaza",
                "orthographic": "Ortografska kamera",
                "pan": "Pomeranje",
                "perspective": "Perspektivna kamera",
                "resetView": "Resetuj prikaz",
                "rotate": "Rotiraj",
                "sideView": "Prikaz sa strane",
                "topView": "Prikaz od gore"
            },
            "showBimCard": "Otvori 3D prikaz",
            "tree": {
                "arrowTooltip": "Izaberi element",
                "columnLabel": "Stablo",
                "label": "Stablo",
                "open_card": "Otvori pripadajuću karticu",
                "root": "Ifc koren"
            }
        },
        "bulkactions": {
            "abort": "Odbaci označene stavke",
            "cancelselection": "Poništi izbor",
            "confirmabort": "Prekidate izvršavanje {0} procesnih instanci. Da li ste sigurni da želite da nastavite?",
            "confirmdelete": "Brišete {0} kartica. Da li ste sigurni da želite da nastavite?",
            "confirmdeleteattachements": "Brišete {0} priloga. Da li ste sigurni da želite da nastavite?",
            "confirmedit": "Vršite izmenu na {0} od {1} kartica. Da li ste sigurni da želite da nastavite?",
            "delete": "Obriši označene stavke",
            "download": "Preuzmi označene priloge",
            "edit": "Izmeni označene stavke",
            "selectall": "Označi sve stavke"
        },
        "calendar": {
            "active_expired": "Aktivno/Isteklo",
            "add": "Dodaj",
            "advancenotification": "Obaveštenje unapred",
            "allcategories": "Sve kategorije",
            "alldates": "Svi datumi",
            "calculated": "Izračunato",
            "calendar": "Kalendar",
            "cancel": "Označi kao otkazano",
            "category": "Kategorija",
            "cm_confirmcancel": "Da li ste sigurni da želite da označite selektovane rasporede kao otkazane?",
            "cm_confirmcomplete": "Da li ste sigurni da želite da označite selektovane rasporede kao završene?",
            "cm_markcancelled": "Označi selektovane rasporede otkazanim",
            "cm_markcomplete": "Označi selektovane rasporede završenim",
            "complete": "Završen",
            "completed": "Završeno",
            "date": "Datum",
            "days": "Dani",
            "delaybeforedeadline": "Odlaganje pre roka",
            "delaybeforedeadlinevalue": "Vrednost odlaganja pre roka",
            "description": "Opis",
            "editevent": "Izmeni događaj",
            "enddate": "Datum završetka",
            "endtype": "Završni tip",
            "event": "Zakaži događaj",
            "executiondate": "Datum izvršavanja",
            "frequency": "Frekvencija",
            "frequencymultiplier": "Množač frekevencije",
            "grid": "Tabela",
            "leftdays": "Preostalo dana",
            "londdescription": "Puni opis",
            "manual": "Ručno",
            "maxactiveevents": "Maksimalan broj aktivnih događaja",
            "messagebodydelete": "Da li želite da uklonite pravilo za planiranje?",
            "messagebodyplural": "Postoji {0} pravila za planiranje",
            "messagebodyrecalculate": "Da li  želite da preračunate pravilo planiranja uzimajući u obzoir novi datum?",
            "messagebodysingular": "Postoji {0} pravila za planiranje",
            "messagetitle": "Prearačunavanje rasporeda",
            "missingdays": "Nedostajući dani",
            "next30days": "Narednih 30 dana",
            "next7days": "Narednih 7 dana",
            "notificationtemplate": "Obrazac korišćen za obaveštenja",
            "notificationtext": "Tekst obaveštenja",
            "occurencies": "Broj ponavljanja",
            "operation": "Operacija",
            "partecipantgroup": "Grupa učesnika",
            "partecipantuser": "Učesnik",
            "priority": "Prioritet",
            "recalculate": "Preračunaj",
            "referent": "Referent",
            "scheduler": "Planer",
            "sequencepaneltitle": "Generiši raspored (plan)",
            "startdate": "Datum početka",
            "status": "Status",
            "today": "Danas",
            "type": "Tip",
            "viewevent": "Prikaži događaj",
            "widgetcriterion": "Kriterijum za kalkulaciju",
            "widgetemails": "Emailovi",
            "widgetsourcecard": "Polazna kartica"
        },
        "classes": {
            "cards": {
                "addcard": "Dodaj karticu",
                "clone": "Kloniraj",
                "clonewithrelations": "Kloniraj karticu i relacije",
                "deletebeaware": "Obratite pažnju na:",
                "deleteblocked": "Brisanje ne može biti nastavljeno jer postoje relacije sa {0}",
                "deletecard": "Ukloni karticu",
                "deleteconfirmation": "Zaista želite da obrišete karticu?",
                "deleterelatedcards": "biće obrisano i {0} povezanih kartica",
                "deleterelations": "relacije sa {0} kartica će biti obrisane",
                "label": "Kartice podataka",
                "modifycard": "Izmeni karticu",
                "opencard": "Otvori karticu",
                "print": "Štampaj karticu"
            },
            "simple": "Jednostavna",
            "standard": "Standardna"
        },
        "common": {
            "actions": {
                "add": "Dodaj",
                "apply": "Primeni",
                "cancel": "Odustani",
                "close": "Zatvori",
                "delete": "Ukloni",
                "edit": "Izmeni",
                "execute": "Izvrši",
                "help": "Pomoć",
                "load": "Učitaj",
                "open": "Otvori",
                "refresh": "Osveži podatke",
                "remove": "Ukloni",
                "save": "Snimi",
                "saveandapply": "Snimi i primeni",
                "saveandclose": "Snimi i zatvori",
                "search": "Pretraga",
                "searchtext": "Pretraga…"
            },
            "attributes": {
                "nogroup": "Osnovni podaci"
            },
            "dates": {
                "date": "d/m/Y",
                "datetime": "d/m/Y H:i:s",
                "time": "H:i:s"
            },
            "editor": {
                "clearhtml": "Čist HTML",
                "expand": "Proširi editor",
                "reduce": "Smanji editor",
                "unlink": "<em>Unlink</em>",
                "unlinkmessage": "<em>Transform the selected hyperlink into text.</em>"
            },
            "grid": {
                "disablemultiselection": "Onemogući višestruko selektovanje",
                "enamblemultiselection": "Omogući višestruko selektovanje",
                "export": "Izvezi podatke",
                "filterremoved": "Trenutni filter je uklonjen",
                "import": "Uvezi podatke",
                "itemnotfound": "Element nije pronađen",
                "list": "Lista",
                "opencontextualmenu": "Otvori kontekstni meni",
                "print": "Štampaj",
                "printcsv": "Štampaj kao CSV",
                "printodt": "Štampaj kao ODT",
                "printpdf": "Štampaj kao PDF",
                "row": "Stavka",
                "rows": "Stavke",
                "subtype": "Podtip"
            },
            "tabs": {
                "activity": "Aktivnost",
                "attachment": "Prilog",
                "attachments": "Prilozi",
                "card": "Kartica",
                "clonerelationmode": "Režim kloniranja relacija",
                "details": "Detalji",
                "emails": "E-mailovi",
                "history": "Istorija",
                "notes": "Napomene",
                "relations": "Relacije",
                "schedules": "Rasporedi"
            }
        },
        "dashboards": {
            "tools": {
                "gridhide": "Sakrij tabelu podataka",
                "gridshow": "Prikaži tabelu podataka",
                "parametershide": "Sakrij parametre podataka",
                "parametersshow": "Prikaži parametre podataka",
                "reload": "Ponovo učitaj"
            }
        },
        "emails": {
            "addattachmentsfromdocumentarchive": "Dodaj prilog iz arhive dokumenata",
            "alredyexistfile": "Datoteka s ovim imenom već postoji",
            "archivingdate": "Datum arhiviranja",
            "attachfile": "Priloži datoteku",
            "bcc": "Bcc",
            "cc": "Cc",
            "composeemail": "Kreiraj e-poštu",
            "composefromtemplate": "Kreiraj iz obrasca",
            "delay": "Odlaganje",
            "delays": {
                "day1": "Za 1 dan",
                "days2": "Za 2 dana",
                "days4": "Za 4 dana",
                "hour1": "1 sat",
                "hours2": "2 sata",
                "hours4": "4 sata",
                "month1": "Za 1 mesec",
                "negativeday1": "1 dan pre",
                "negativedays2": "2 dana pre",
                "negativedays4": "4 dana pre",
                "negativehour1": "1 sat pre",
                "negativehours2": "2 sata pre",
                "negativehours4": "4 sata pre",
                "negativemonth1": "1 mesec pre",
                "negativeweek1": "1 nedelju pre",
                "negativeweeks2": "2 nedelje pre",
                "none": "Bez",
                "week1": "Za 1 nedelju",
                "weeks2": "Za 2 nedelje"
            },
            "dmspaneltitle": "Izaberi prilog iz baze podataka",
            "edit": "Izmeni",
            "from": "Od",
            "gridrefresh": "Osveži mrežu",
            "keepsynchronization": "Održavaj sinhronizovano",
            "message": "Poruka",
            "regenerateallemails": "Generiši sve emailove ponovo",
            "regenerateemail": "Iznova generiši e-poštu",
            "remove": "Ukloni",
            "remove_confirmation": "Zaista želite da uklonite ovaj e-mail?",
            "reply": "Odgovori",
            "replyprefix": "{0}, {1} je napisao",
            "selectaclass": "Izaberi klasu",
            "sendemail": "Pošalji e-poštu",
            "statuses": {
                "draft": "Započete",
                "error": "Greška",
                "outgoing": "Za slanje",
                "received": "Primljene",
                "sent": "Poslane"
            },
            "subject": "Subjekat",
            "to": "Za",
            "view": "Prikaz"
        },
        "errors": {
            "autherror": "Pogrešno korisničko ime i/ili lozinka",
            "classnotfound": "Klasa {0} ne postoji",
            "fieldrequired": "Ovo polje je obavezno",
            "invalidfilter": "Nevalidan filter",
            "notfound": "Element nije pronađen"
        },
        "filters": {
            "actions": "Akcije",
            "addfilter": "Dodaj filter",
            "any": "Bilo koji",
            "attachments": "<em>Attachments</em>",
            "attachmentssearchtext": "<em>Attachments search text</em>",
            "attribute": "Izaberi atribut",
            "attributes": "Atributi",
            "clearfilter": "Očisti filter",
            "clone": "Kloniraj",
            "copyof": "Kopija",
            "currentgroup": "Trenutna grupa",
            "currentuser": "Trenutni korisnik",
            "defaultset": "Postavi kao podrazumevanu",
            "defaultunset": "Ukloni kao podrazumevanuu",
            "description": "Opis",
            "domain": "Relacija",
            "filterdata": "Filtriraj podatke",
            "fromfilter": "<em>From filter</em>",
            "fromselection": "Iz selekcije",
            "group": "Grupa",
            "ignore": "Ignoriši",
            "migrate": "Premešta",
            "name": "Naziv",
            "newfilter": "Novi filter",
            "noone": "Nijedan",
            "operator": "Operator",
            "operators": {
                "beginswith": "Koji počinju sa",
                "between": "Između",
                "contained": "Sadržan",
                "containedorequal": "Sadržan ili jednak",
                "contains": "Sadrži",
                "containsorequal": "Sadrži ili je jednak",
                "descriptionbegin": "<em>Description begins with</em>",
                "descriptioncontains": "Opis sadrži",
                "descriptionends": "<em>Description ends with</em>",
                "descriptionnotbegin": "<em>Description does not begins with</em>",
                "descriptionnotcontain": "<em>Description does not contain</em>",
                "descriptionnotends": "<em>Description does not ends with</em>",
                "different": "Različite od",
                "doesnotbeginwith": "Koji ne počinju sa",
                "doesnotcontain": "Koji ne sadrže",
                "doesnotendwith": "Ne završava sa",
                "endswith": "Završava sa",
                "equals": "Jednake",
                "greaterthan": "Veće",
                "isnotnull": "Ne može biti null",
                "isnull": "Sa null vrednošću",
                "lessthan": "Manje"
            },
            "relations": "Relacije",
            "type": "Tip",
            "typeinput": "Ulazni parametar",
            "user": "Korisnik",
            "value": "Vrednosti"
        },
        "gis": {
            "card": "Kartica",
            "cardsMenu": "Meni kartica",
            "code": "Kod",
            "description": "Opis",
            "extension": {
                "errorCall": "Greška",
                "noResults": "Nema rezultata"
            },
            "externalServices": "Spoljni servisi",
            "geographicalAttributes": "Geografski atributi",
            "geoserverLayers": "Geoserver slojevi",
            "layers": "Slojevi",
            "list": "Lista",
            "longpresstitle": "Geoelementi u zoni",
            "map": "Mapa",
            "mapServices": "Servisi mapa",
            "position": "Pozicija",
            "root": "Koren",
            "tree": "Stablo navigacije",
            "type": "Tip",
            "view": "Prikaz",
            "zoom": "Uvećanje"
        },
        "history": {
            "activityname": "Naziv aktivnosti",
            "activityperformer": "Izvršilac aktivnosti",
            "begindate": "Datum početka",
            "enddate": "Datum završetka",
            "processstatus": "Status",
            "user": "Korisnik"
        },
        "importexport": {
            "database": {
                "uri": "URI baze podataka",
                "user": "Korisničko ime za bazu podataka"
            },
            "downloadreport": "Preuzmi izveštaj",
            "emailfailure": "Greška prilikom slanja e-maila",
            "emailmessage": "Izveštaj o importovanju datotekte {0} priložen uz datum {1}",
            "emailsubject": "Uvezi izveštaj s podacima",
            "emailsuccess": "E-maili je uspešno poslan",
            "export": "Izvezi",
            "exportalldata": "Sve podatke",
            "exportfiltereddata": "Samo podatke koji odgovaraju filteru tabele",
            "gis": {
                "shapeimportdisabled": "Uvoz oblika nije dozvoljen za ovaj obrazac",
                "shapeimportenabled": "Podešavanje uvoza oblika"
            },
            "ifc": {
                "card": "<em>Card</em>",
                "project": "Projekat",
                "sourcetype": "Uvoz iz"
            },
            "import": "Uvezi",
            "importresponse": "Uvezi odgovor",
            "response": {
                "created": "Kreirane stavke",
                "deleted": "Obrisane stavke",
                "errors": "Greške",
                "linenumber": "Broj linije",
                "message": "Poruka",
                "modified": "Izmenjene stavke",
                "processed": "Obrađeni redovi",
                "recordnumber": "Broj zapisa",
                "unmodified": "Neizmenjene stavke"
            },
            "sendreport": "Pošalji izveštaj",
            "template": "Šablon",
            "templatedefinition": "Definicija šablona"
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
                "login": "Prijavi se",
                "logout": "Promeni korisnika"
            },
            "fields": {
                "group": "Grupa",
                "language": "Jezik",
                "password": "Lozinka",
                "tenants": "Klijenti",
                "username": "Korisničko ime"
            },
            "loggedin": "Prijavljen",
            "title": "Prijavi se",
            "welcome": "Dobro došli nazad, {0}"
        },
        "main": {
            "administrationmodule": "Administracioni modul",
            "baseconfiguration": "Osnovna konfiguracija",
            "cardlock": {
                "lockedmessage": "Ne možete menjati ovu karticu jer je trenutno menja {0}",
                "someone": "neko"
            },
            "changegroup": "Promeni grupu",
            "changetenant": "Promeni {0}",
            "confirmchangegroup": "Zaista želite da promenite grupu?",
            "confirmchangetenants": "Zaista želite da promenite aktivnog klijenta?",
            "confirmdisabletenant": "Zaista želite da isključite oznaku „Ignoriši klijente“?",
            "confirmenabletenant": "Zaista želite da uključite oznaku „Ignoriši klijente“?",
            "ignoretenants": "Ignoriši {0}",
            "info": "Informacija",
            "logo": {
                "cmdbuild": "CMDBuild logotip",
                "cmdbuildready2use": "CMDBuild READY2USE logotip",
                "companylogo": "Kompanijski logotip",
                "openmaint": "openMAINT logotip"
            },
            "logout": "Izađi",
            "managementmodule": "Modul za upravljanje podacima",
            "multigroup": "Više grupa",
            "multitenant": "Više {0}",
            "navigation": "Navigacija",
            "pagenotfound": "Stranica nije pronađena",
            "password": {
                "change": "Promeni lozinku",
                "confirm": "Potvrdi lozinku",
                "email": "E-mail dares",
                "err_confirm": "Lozinke se ne poklapaju.",
                "err_diffprevious": "Lozinka ne može biti ista kao prethodna.",
                "err_diffusername": "Lozinka ne može biti ista kao i korisničko ime.",
                "err_length": "Lozinka mora biti duga minimalno {0} karaktera.",
                "err_reqdigit": "Lozinka mora sadržati barem jednu cifru.",
                "err_reqlowercase": "Lozinka mora sadržati baerm jedno malo slovo.",
                "err_requppercase": "Lozinka mora sadržati barem jedno veliko slovo.",
                "expired": "Vaša lozinka je istekla, morate je promeniti.",
                "forgotten": "Zaboravljena lozinka",
                "new": "Nova lozinka",
                "old": "Stara lozinka",
                "recoverysuccess": "Poslali smo vam email sa instrukcijama kako da povratite lozinku.",
                "reset": "Resetuj lozinku",
                "saved": "Loznika je uspešno snimljena!"
            },
            "pleasecorrecterrors": "Molimo korigujte navedene greške!",
            "preferences": {
                "comma": "Zapeta",
                "decimalserror": "Decimalni deo mora postojati",
                "decimalstousandserror": "Decimalni separator i separator hiljada ne smeju biti isti",
                "default": "Podrazumevani",
                "defaultvalue": "Podrazumevana vrednost",
                "firstdayofweek": "<em>First day of week</em>",
                "gridpreferencesclear": "Poništi podešavanja tabele",
                "gridpreferencescleared": "Podešavanje tabele poništeno!",
                "gridpreferencessave": "Snimi podešavanje tabele",
                "gridpreferencessaved": "Podešavanje tabele snimljeno!",
                "gridpreferencesupdate": "Osveži podešavanje tabele",
                "labelcsvseparator": "CSV separator",
                "labeldateformat": "Format datuma",
                "labeldecimalsseparator": "Decimalni separator",
                "labellanguage": "Jezik",
                "labelthousandsseparator": "Separator hiljada",
                "labeltimeformat": "Format vremena",
                "msoffice": "Microsoft Office",
                "period": "Tačka",
                "preferredfilecharset": "kodna strana CSV datoteke",
                "preferredofficesuite": "Preferirani paket kancelarijskih aplikacija",
                "space": "Razmak",
                "thousandserror": "Hiljade moraju biti prisutne",
                "timezone": "Vremenska zona",
                "twelvehourformat": "12-časovni format",
                "twentyfourhourformat": "24-časovni format"
            },
            "searchinallitems": "Pretraga kroz sve stavke",
            "treenavcontenttitle": "{0} od {1}",
            "userpreferences": "Podešavanja"
        },
        "menu": {
            "allitems": "Sve stavke",
            "classes": "Klase",
            "custompages": "Posebne stranice",
            "dashboards": "Kontrolne table",
            "processes": "Kartice procesa",
            "reports": "izveštaji",
            "views": "Prikazi"
        },
        "notes": {
            "edit": "Izmeni napomenu"
        },
        "notifier": {
            "attention": "Pažnja",
            "error": "Greška",
            "genericerror": "Generička greška",
            "genericinfo": "Generička informacija",
            "genericwarning": "Generičko upozorenje",
            "info": "Informacija",
            "success": "Uspeh",
            "warning": "Pažnja"
        },
        "patches": {
            "apply": "Primeni ispravke",
            "category": "Kategorija",
            "description": "Opis",
            "name": "Naziv",
            "patches": "Ispravke"
        },
        "processes": {
            "abortconfirmation": "Da li ste sigurni da želite prekinuti proces?",
            "abortprocess": "Prekini proces",
            "action": {
                "advance": "Dalje",
                "label": "Akcija"
            },
            "activeprocesses": "Aktivni procesi",
            "allstatuses": "Sve",
            "editactivity": "Izmeni aktivnost",
            "openactivity": "Otvori aktivnost",
            "startworkflow": "Start",
            "workflow": "Radni procesi"
        },
        "relationGraph": {
            "activity": "aktivnost",
            "allLabelsOnGraph": "sve oznake na grafikonu",
            "card": "Kartica",
            "cardList": "Lista kartica",
            "cardRelations": "Veza",
            "choosenaviagationtree": "Izaberi stablo navigacije",
            "class": "Klasa",
            "classList": "Lista klasa",
            "compoundnode": "Složeni čvor",
            "disable": "Isključi",
            "edges": "<em>Edges</em>",
            "enable": "Uključi",
            "labelsOnGraph": "opis na grafikonu",
            "level": "Nivo",
            "nodes": "<em>Nodes</em>",
            "openRelationGraph": "Otvori graf relacija",
            "qt": "Qt",
            "refresh": "Osveži",
            "relation": "Veza",
            "relationGraph": "Graf relacija",
            "reopengraph": "Ponovo otvori graf od ovog čvora"
        },
        "relations": {
            "adddetail": "Dodaj detalje",
            "addrelations": "Dodaj relaciju",
            "attributes": "Atributi",
            "code": "Kod",
            "deletedetail": "Ukloni detalj",
            "deleterelation": "Ukloni relaciju",
            "deleterelationconfirm": "Da li ste sigurni da želite da obrišete ovu relaciju?",
            "description": "Opis",
            "editcard": "Izmeni karticu",
            "editdetail": "Izmeni detalje",
            "editrelation": "Izmeni relaciju",
            "extendeddata": "Prošireni podaci",
            "mditems": "stavke",
            "missingattributes": "Nedostaju obavezni atributi",
            "opencard": "Otvori pripadajuću karticu",
            "opendetail": "Prikaži detalje",
            "type": "Tip"
        },
        "reports": {
            "csv": "CSV",
            "download": "Preuzmi",
            "format": "Formatiraj",
            "odt": "ODT",
            "pdf": "PDF",
            "print": "Štampaj",
            "reload": "Ponovo učitaj",
            "rtf": "RTF"
        },
        "system": {
            "data": {
                "lookup": {
                    "CalendarCategory": {
                        "default": {
                            "description": "Podrazumevano"
                        }
                    },
                    "CalendarFrequency": {
                        "daily": {
                            "description": "Dnevno"
                        },
                        "monthly": {
                            "description": "Mesečno"
                        },
                        "once": {
                            "description": "Jednom"
                        },
                        "weekly": {
                            "description": "Sedmično"
                        },
                        "yearly": {
                            "description": "Godišnje"
                        }
                    },
                    "CalendarPriority": {
                        "default": {
                            "description": "Podrazumevano"
                        }
                    }
                }
            }
        },
        "thematism": {
            "addThematism": "Dodaj tematizaciju",
            "analysisType": "Tip analize",
            "attribute": "Atribut",
            "calculateRules": "Generiši pravila stila",
            "clearThematism": "Ukloni tematizaciju",
            "color": "Boja",
            "defineLegend": "Definicija legende",
            "defineThematism": "Definicija tematizacije",
            "function": "Funkcija",
            "generate": "Generiši",
            "geoAttribute": "Geografski atributi",
            "graduated": "Diplomirao",
            "highlightSelected": "Označi selektovanu stavku",
            "intervals": "Intervali",
            "legend": "legenda",
            "name": "naziv",
            "newThematism": "Nova tematizacija",
            "punctual": "Tačan",
            "quantity": "Broj (kvantitet)",
            "segments": "Segmenti",
            "source": "Izvor",
            "table": "Tabela",
            "thematism": "Tematike",
            "value": "Vrednost"
        },
        "widgets": {
            "customform": {
                "addrow": "Dodaj red",
                "clonerow": "Kloniraj red",
                "datanotvalid": "Nevalidni podaci",
                "deleterow": "Obriši red",
                "editrow": "Izmeni red",
                "export": "Izvezi",
                "import": "Uvezi",
                "importexport": {
                    "expattributes": "Podaci za izvoz",
                    "file": "Datotteka",
                    "filename": "Naziv datoteke",
                    "format": "Format",
                    "importmode": "Način uvoza",
                    "keyattributes": "Ključevi",
                    "missingkeyattr": "Molimo - izaberite bar jedan atribut-ključ",
                    "modeadd": "Dodaj",
                    "modemerge": "Spoji",
                    "modereplace": "Zameni",
                    "separator": "Separator"
                },
                "refresh": "Vrati na podrazumevane vrednosti"
            },
            "linkcards": {
                "checkedonly": "Samo označene",
                "editcard": "Izmeni karticu",
                "opencard": "Otvori karticu",
                "refreshselection": "Primeni podrazumevani izbor",
                "togglefilterdisabled": "Isključi filtriranje tabele",
                "togglefilterenabled": "Uključi filtriranje tabele"
            },
            "required": "Ova komponenta je obavezna"
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