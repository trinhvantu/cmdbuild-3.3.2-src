(function() {
    Ext.define('CMDBuildUI.locales.pl.Locales', {
        "requires": ["CMDBuildUI.locales.pl.LocalesAdministration"],
        "override": "CMDBuildUI.locales.Locales",
        "singleton": true,
        "localization": "pl",
        "administration": CMDBuildUI.locales.pl.LocalesAdministration.administration,
        "attachments": {
            "add": "Dodaj załącznik",
            "attachmenthistory": "Historia załącznika",
            "author": "Autor",
            "browse": "Przeglądaj &hellip",
            "category": "Kategoria",
            "code": "Kod",
            "creationdate": "Data utowrzenia",
            "deleteattachment": "Skasuj załącznik",
            "deleteattachment_confirmation": "Czy na pewno chcesz skasować ten załącznik?",
            "description": "Opis",
            "download": "Pobierz",
            "dropfiles": "Wrzuć pliki tutaj",
            "editattachment": "Zmień załącznik",
            "file": "Plik",
            "filealreadyinlist": "Plik {0} znajduje się aktualnie na liście.",
            "filename": "Nazwa pliku",
            "fileview": "<em>View attachment</em>",
            "invalidfiles": "Usuń nieprawidłowe pliki",
            "majorversion": "Wersja główna",
            "modificationdate": "Data modyfikacji",
            "new": "Nowy załącznik",
            "nocategory": "Nieskategoryzowany",
            "preview": "Podgląd",
            "removefile": "Usuń plik",
            "statuses": {
                "empty": "Pusty plik",
                "error": "Błąd",
                "extensionNotAllowed": "Rozszerzenie pliku jest niedozwolone",
                "loaded": "Załadowany",
                "ready": "Gotowe"
            },
            "successupload": "załadowano {0} załączników",
            "uploadfile": "Załaduj plik …",
            "version": "Wersja",
            "viewhistory": "Zobacz historię załącznika",
            "warningmessages": {
                "atleast": "Ostrzeżenie: załądowano {0} załączników typu {1}. Kategoria oczekuje co najmniej {2} załączników.",
                "exactlynumber": "Ostrzeżenie: załądowano {0} załączników typu {1}. Kategoria oczekuje  {2} załączników.",
                "maxnumber": "Ostrzeżenie: załądowano {0} załączników typu {1}. Kategoria oczekuje maksymalnie {2} załączników."
            },
            "wrongfileextension": "pliki typu {0} są niedozwolone"
        },
        "bim": {
            "bimViewer": "Przeglądarka BIM",
            "card": {
                "label": "Karta"
            },
            "layers": {
                "label": "Warstwy",
                "menu": {
                    "hideAll": "Ukryj wszystkie",
                    "showAll": "Pokaż wszystkie"
                },
                "name": "Nazwa",
                "qt": "Qt",
                "visibility": "Widoczność"
            },
            "menu": {
                "camera": "Aparat",
                "frontView": "Widok od frontu",
                "mod": "Kontroli przeglądarki",
                "orthographic": "Aparat orthographic",
                "pan": "Przewiń",
                "perspective": "Aparat z perspektywą",
                "resetView": "Zresetuj widok",
                "rotate": "obróć",
                "sideView": "Widok boczny",
                "topView": "Widok z góry"
            },
            "showBimCard": "Otwórz przeglądarkę 3D",
            "tree": {
                "arrowTooltip": "Wybierz element",
                "columnLabel": "Drzewo",
                "label": "Drzewo",
                "open_card": "Otwórz powiązaną kartę",
                "root": "Początek lfc"
            }
        },
        "bulkactions": {
            "abort": "Anuluj wybrane elementy",
            "cancelselection": "Anuluj wybór",
            "confirmabort": "Anulujesz {0} procesów. Czy chcesz kontynuować?",
            "confirmdelete": "Kasujesz {0} kart. Czy chcesz kontynuować?",
            "confirmdeleteattachements": "Kasujesz {0} załączników. Czy chcesz kontynuować?",
            "confirmedit": "Zmieniasz {0} z {1} kart. Czy chcesz kontynuować?",
            "delete": "Skasuj wybrane elementy",
            "download": "Pobierz wybrane załączniki",
            "edit": "Edytuj wybrane elementy",
            "selectall": "Wybierz wszystkie elementy"
        },
        "calendar": {
            "active_expired": "Aktywny/Wygasły",
            "add": "Dodaj harmonogram",
            "advancenotification": "Dni zaawansowanej notyfikacji",
            "allcategories": "Wszystkie kategorie",
            "alldates": "Wszystkie daty",
            "calculated": "Przeliczony",
            "calendar": "Kalendarz",
            "cancel": "Oznacz jako anulowane",
            "category": "Kategoria",
            "cm_confirmcancel": "Czy na pewno chcesz oznaczyć wybrane harmonogramy jako anulowane?",
            "cm_confirmcomplete": "Czy na pewno chcesz oznaczyć wybrane harmonogramy jako ukończone?",
            "cm_markcancelled": "Oznacz wybrane harmonogramy jako anulowane",
            "cm_markcomplete": "Oznacz wybrane harmonogramy jako zakończone",
            "complete": "Oznacz jako wykonane",
            "completed": "Ukończone",
            "date": "Data",
            "days": "Dni",
            "delaybeforedeadline": "Opóźnienie do terminu",
            "delaybeforedeadlinevalue": "Opóźnienie do wartości terminu",
            "description": "Opis",
            "editevent": "Edytuj harmonogram",
            "enddate": "Data zakończenia",
            "endtype": "Typ zakończenia",
            "event": "Harmonogram",
            "executiondate": "Data wykonania",
            "frequency": "Częstotliwość",
            "frequencymultiplier": "Mnożnik częstotliwości",
            "grid": "Siatka",
            "leftdays": "Pozostało dni",
            "londdescription": "Pełny opis",
            "manual": "Ręcznie",
            "maxactiveevents": "Maksymalna ilość aktywnych harmonogramów",
            "messagebodydelete": "Czy chciałbyś usunąć zasadę harmonogramów?",
            "messagebodyplural": "Istniej {0} zaplanowanych reguł",
            "messagebodyrecalculate": "Czy chciałbyś przeliczyć zasady harmonogramów z nową datą?",
            "messagebodysingular": "Istnieje {0} zaplanowana/e reguła/y",
            "messagetitle": "Przelicz harmonogram",
            "missingdays": "Brakujące dni",
            "next30days": "Następne 30 dni",
            "next7days": "Następne 7 dni",
            "notificationtemplate": "Szablon używany dla powiadomień",
            "notificationtext": "Treść powiadomienia",
            "occurencies": "Ilość wystąpień",
            "operation": "Operacja",
            "partecipantgroup": "Grupa uczestników",
            "partecipantuser": "Uczestnik",
            "priority": "Priorytet",
            "recalculate": "Przelicz",
            "referent": "Odniesienie",
            "scheduler": "Planujący",
            "sequencepaneltitle": "Wygeneruj harmonogramy",
            "startdate": "Data początku",
            "status": "Status",
            "today": "Dzisiaj",
            "type": "Typ",
            "viewevent": "Zobacz harmonogram",
            "widgetcriterion": "Kryteria przeliczenia",
            "widgetemails": "Emaile",
            "widgetsourcecard": "Karta źródła"
        },
        "classes": {
            "cards": {
                "addcard": "Dodaj kartę",
                "clone": "Sklonuj",
                "clonewithrelations": "Sklonuj kartę i powiązania",
                "deletebeaware": "Bądź świadom, że:",
                "deleteblocked": "Nie jest możliwe usunięcie ponieważ istnieją powiązania z {0}",
                "deletecard": "Skasuj kartę",
                "deleteconfirmation": "Czy na pewno chcesz skasować tę kartę?",
                "deleterelatedcards": "zostanie również skasowanych {0} kart powiązanych",
                "deleterelations": "powiązanie z {0} kartami zostaną usunięte",
                "label": "Karty",
                "modifycard": "Zmień kartę",
                "opencard": "Otwórz kartę",
                "print": "Wydrukuj kartę"
            },
            "simple": "Prosty",
            "standard": "Standard"
        },
        "common": {
            "actions": {
                "add": "Dodaj",
                "apply": "Zastosuj",
                "cancel": "Anuluj",
                "close": "Zamknij",
                "delete": "Skasuj",
                "edit": "Edytuj",
                "execute": "Wykonaj",
                "help": "Pomoc",
                "load": "Załaduj",
                "open": "Otwórz",
                "refresh": "Odśwież dane",
                "remove": "Usuń",
                "save": "Zapisz",
                "saveandapply": "Zapisz i zastosuj",
                "saveandclose": "Zapisz i zamknij",
                "search": "Szukaj",
                "searchtext": "Szukaj …"
            },
            "attributes": {
                "nogroup": "Dane podstawowe"
            },
            "dates": {
                "date": "d/m/Y",
                "datetime": "d/m/Y H:i:s",
                "time": "H:i:s"
            },
            "editor": {
                "clearhtml": "Wyczyść HTML",
                "expand": "Powiększ edytor",
                "reduce": "Zmniejsz edytor",
                "unlink": "<em>Unlink</em>",
                "unlinkmessage": "<em>Transform the selected hyperlink into text.</em>"
            },
            "grid": {
                "disablemultiselection": "Wyłącz wybór wielokrotny",
                "enamblemultiselection": "Włącz wybór wielokrotny",
                "export": "Wyeksportuj dane",
                "filterremoved": "Aktualny filtr został usunięty",
                "import": "Zaimportuj dane",
                "itemnotfound": "Element nie znaleziony",
                "list": "Lista",
                "opencontextualmenu": "Otwórz menu kontekstowe",
                "print": "Wydrukuj",
                "printcsv": "Wydrukuj jako CSV",
                "printodt": "Wydrukuj jako ODT",
                "printpdf": "Wydrukuj jako PDF",
                "row": "Element",
                "rows": "Elementy",
                "subtype": "Podtyp"
            },
            "tabs": {
                "activity": "Aktywność",
                "attachment": "Załącznik",
                "attachments": "Załączniki",
                "card": "Karta",
                "clonerelationmode": "Sklonuj tryb powiązań",
                "details": "Szczegóły",
                "emails": "Emaile",
                "history": "Historia",
                "notes": "Notatki",
                "relations": "Powiązania",
                "schedules": "Harmonogramy"
            }
        },
        "dashboards": {
            "tools": {
                "gridhide": "Ukryj siatkę danych",
                "gridshow": "Pokaż siatkę danych",
                "parametershide": "Ukryj parametry danych",
                "parametersshow": "Pokaż parametry siatki",
                "reload": "Załaduj ponownie"
            }
        },
        "emails": {
            "addattachmentsfromdocumentarchive": "Dodaj załączniki z archiwum",
            "alredyexistfile": "Plik o takiej nazwie już istnieje",
            "archivingdate": "Data archiwizacji",
            "attachfile": "Załącz plik",
            "bcc": "Ukryte do wiadomości",
            "cc": "Do wiadomości",
            "composeemail": "Napisz wiadomość",
            "composefromtemplate": "Napisz z szablonu",
            "delay": "Opóźnienie",
            "delays": {
                "day1": "Za 1 dzień",
                "days2": "Za 2 dni",
                "days4": "Za 4 dni",
                "hour1": "1 godzina",
                "hours2": "2 godziny",
                "hours4": "4 godziny",
                "month1": "Za 1 miesiąc",
                "negativeday1": "1 dzień wcześniej",
                "negativedays2": "2 dni wcześniej",
                "negativedays4": "4 dni wcześniej",
                "negativehour1": "1 godzina wcześniej",
                "negativehours2": "2 godziny wcześniej",
                "negativehours4": "4 godziny wcześniej",
                "negativemonth1": "1 miesiąc wcześniej",
                "negativeweek1": "1 tydzień wcześniej",
                "negativeweeks2": "2 tygodnie wcześniej",
                "none": "Żaden",
                "week1": "Za 1 tydzień",
                "weeks2": "Za 2 tygodnie"
            },
            "dmspaneltitle": "Wybierz załącznik z bazy danych",
            "edit": "Edytuj",
            "from": "Od",
            "gridrefresh": "Odśwież siatkę",
            "keepsynchronization": "Utrzymaj synchronizację",
            "message": "Wiadomość",
            "regenerateallemails": "Wygeneruj wszystkie maile ponownie",
            "regenerateemail": "Wygeneruj email ponownie",
            "remove": "Usuń",
            "remove_confirmation": "Czy na pwno chcesz skasować ten email?",
            "reply": "odpowiedz",
            "replyprefix": "W dniu {0} {1} napisał(a)",
            "selectaclass": "Wybierz klasę",
            "sendemail": "Wyślij email",
            "statuses": {
                "draft": "Szkic",
                "error": "Błąd",
                "outgoing": "Wychodzące",
                "received": "Otrzymano",
                "sent": "Wyślij email"
            },
            "subject": "Temat",
            "to": "Do",
            "view": "Widok"
        },
        "errors": {
            "autherror": "Nieprawidłowy użytkownik lub hasło",
            "classnotfound": "Klasy {0) nie odnaleziono",
            "fieldrequired": "Pole wymagane",
            "invalidfilter": "Nieprawidłowy filtr",
            "notfound": "Element nie znaleziony"
        },
        "filters": {
            "actions": "Akcje",
            "addfilter": "Dodaj filtr",
            "any": "Którykolwiek",
            "attachments": "<em>Attachments</em>",
            "attachmentssearchtext": "<em>Attachments search text</em>",
            "attribute": "Wybierz atrybut",
            "attributes": "Atrybuty",
            "clearfilter": "Wyczyść filtry",
            "clone": "Sklonuj",
            "copyof": "Kopia",
            "currentgroup": "Aktualna grupa",
            "currentuser": "Aktualny użytkownik",
            "defaultset": "Ustaw jako domyślne",
            "defaultunset": "Nie ustawiaj z domyślnych",
            "description": "Opis",
            "domain": "Domena",
            "filterdata": "Filtruj dane",
            "fromfilter": "<em>From filter</em>",
            "fromselection": "Od zaznaczenia",
            "group": "Grupa",
            "ignore": "Ignoruj",
            "migrate": "Migruj",
            "name": "Nazwa",
            "newfilter": "Nowy filtr",
            "noone": "Brak",
            "operator": "Operator",
            "operators": {
                "beginswith": "Zaczyna się od",
                "between": "Pomiędzy",
                "contained": "Zawierało",
                "containedorequal": "Zawierało lub równe",
                "contains": "Zawiera",
                "containsorequal": "Zawiera lub równe",
                "descriptionbegin": "<em>Description begins with</em>",
                "descriptioncontains": "Opis zawiera",
                "descriptionends": "<em>Description ends with</em>",
                "descriptionnotbegin": "<em>Description does not begins with</em>",
                "descriptionnotcontain": "<em>Description does not contain</em>",
                "descriptionnotends": "<em>Description does not ends with</em>",
                "different": "Różne",
                "doesnotbeginwith": "Nie zaczyna się od",
                "doesnotcontain": "Nie zawiera",
                "doesnotendwith": "Nie kończy się na",
                "endswith": "Kończy się na",
                "equals": "Równy",
                "greaterthan": "Większy niż",
                "isnotnull": "Nie jest puste",
                "isnull": "Jest puste",
                "lessthan": "Mniej niż"
            },
            "relations": "Powiązania",
            "type": "Typ",
            "typeinput": "Parametr wstawiania",
            "user": "Użytkownik",
            "value": "Wartość"
        },
        "gis": {
            "card": "Karta",
            "cardsMenu": "Menu kart",
            "code": "Kod",
            "description": "Opis",
            "extension": {
                "errorCall": "Błąd",
                "noResults": "Brak wyników"
            },
            "externalServices": "Usługi zewnętrzne",
            "geographicalAttributes": "Parametry geograficzne",
            "geoserverLayers": "Warstwy serwera geograficznego",
            "layers": "Warstwy",
            "list": "Lista",
            "longpresstitle": "Geoelementy w pobliżu",
            "map": "Mapa",
            "mapServices": "Usługi map",
            "position": "Pozycja",
            "root": "Korzeń",
            "tree": "Drzewo",
            "type": "Typ",
            "view": "Widok",
            "zoom": "Powiększ"
        },
        "history": {
            "activityname": "Nazwa aktywności",
            "activityperformer": "Wykonawca aktywności",
            "begindate": "Data rozpoczęcia",
            "enddate": "Data zakończenia",
            "processstatus": "Status",
            "user": "Użytkownik"
        },
        "importexport": {
            "database": {
                "uri": "URI bazy danych",
                "user": "Użytkownik bazy danych"
            },
            "downloadreport": "Pobierz raport",
            "emailfailure": "Podczas wysyłki wiadomości wystąpił błąd!",
            "emailmessage": "Załączono raport importu „{0}” z daty „{1}”",
            "emailsubject": "Zaimportuj raport",
            "emailsuccess": "Email wysłany poprawnie!",
            "export": "Eksportuj",
            "exportalldata": "Wszystkie dane",
            "exportfiltereddata": "Tylko dane pasujące do filtra siatki",
            "gis": {
                "shapeimportdisabled": "Import kształtów nie jest włączony dla tego szablonu.",
                "shapeimportenabled": "konfiguracja importu kształtów"
            },
            "ifc": {
                "card": "<em>Card</em>",
                "project": "Projekt",
                "sourcetype": "Importuj od"
            },
            "import": "Zaimportuj",
            "importresponse": "Odpowiedź importu",
            "response": {
                "created": "Utworzone elementy",
                "deleted": "Skasuj elementy",
                "errors": "Błędy",
                "linenumber": "Numer linii",
                "message": "Wiadomość",
                "modified": "Elementy zmodyfikowane",
                "processed": "Przeanalizowanych wierszy",
                "recordnumber": "Numer rekordu",
                "unmodified": "Elementy niezmienione"
            },
            "sendreport": "Wyślij raport",
            "template": "Szablon",
            "templatedefinition": "Definicja szablonu"
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
                "login": "Zaloguj",
                "logout": "Zmień użytkownika"
            },
            "fields": {
                "group": "Grupa",
                "language": "Język",
                "password": "Hasło",
                "tenants": "Wynajmujący",
                "username": "Nazwa użytkownika"
            },
            "loggedin": "Zalogowany",
            "title": "Login",
            "welcome": "Witaj z powrotem {0}."
        },
        "main": {
            "administrationmodule": "Moduł administracyjny",
            "baseconfiguration": "Konfiguracja podstawowa",
            "cardlock": {
                "lockedmessage": "Nie możesz edytować tej karty ponieważ jest edytowana przez {0}.",
                "someone": "ktoś"
            },
            "changegroup": "Zmień grupę",
            "changetenant": "Zmień {0}",
            "confirmchangegroup": "Jesteś pewny, że chcesz zmienić grupę?",
            "confirmchangetenants": "Jesteś pewny, że chcesz zmienić aktywny najemców?",
            "confirmdisabletenant": "Czy na pewno chcesz wyłączyć „Ignoruj najemców”?",
            "confirmenabletenant": "Czy na pewno chcesz włączyć „Ignoruj najemców”?",
            "ignoretenants": "Ignoruj {0}",
            "info": "Informacja",
            "logo": {
                "cmdbuild": "Logo CMDBuild",
                "cmdbuildready2use": "logo CMDBuild READY2USE",
                "companylogo": "Logo firmy",
                "openmaint": "logo openMaint"
            },
            "logout": "Wyloguj",
            "managementmodule": "Moduł zarządzania danymi",
            "multigroup": "Wiele grup",
            "multitenant": "Wiele {0}",
            "navigation": "Nawigacja",
            "pagenotfound": "Strona nie znaleziona",
            "password": {
                "change": "Zmień hasło",
                "confirm": "Potwierdź hasło",
                "email": "Adres email",
                "err_confirm": "Hasła się różnią.",
                "err_diffprevious": "Hasło musi się różnić od poprzedniego.",
                "err_diffusername": "Hasło nie może być takie samo jak nazwa użytkownika.",
                "err_length": "Hasło musi mieć co najmniej {0} znaków.",
                "err_reqdigit": "Hasło musi zawierać co najmniej jedną cyfrę.",
                "err_reqlowercase": "Hasło musi zawierać co najmniej jedną małą literę.",
                "err_requppercase": "Hasło musi zawierać co najmniej jedną wielką literę.",
                "expired": "Twoje hasło wygasło. Musisz je teraz zmienić.",
                "forgotten": "Zapomniałem hasła",
                "new": "Nowe hasło",
                "old": "Stare hasło",
                "recoverysuccess": "Wysłaliśmy Ci wiadomość email z instrukcją odzyskiwania hasła.",
                "reset": "Zresetuj hasło",
                "saved": "Hasło zapisano poprawnie!"
            },
            "pleasecorrecterrors": "Proszę poprawić wskazane błędy!",
            "preferences": {
                "comma": "Przecinek",
                "decimalserror": "Pole dziesiętne musi być wypełnione",
                "decimalstousandserror": "Separator dziesiętny i tysięcy musi się różnić.",
                "default": "Domyślne",
                "defaultvalue": "Wartość domyślna",
                "firstdayofweek": "<em>First day of week</em>",
                "gridpreferencesclear": "Wyczyść ustawienia siatki",
                "gridpreferencescleared": "Preferencje siatki wyczyszczone!",
                "gridpreferencessave": "Zapisz ustawienia siatki",
                "gridpreferencessaved": "Preferencje siatki zapisane!",
                "gridpreferencesupdate": "Aktualizuj ustawienia siatki",
                "labelcsvseparator": "separator CSV",
                "labeldateformat": "Format daty",
                "labeldecimalsseparator": "Separator dziesiętny",
                "labellanguage": "Język",
                "labelthousandsseparator": "Separator tysięcy",
                "labeltimeformat": "Format czasu",
                "msoffice": "Pakiet Microsoft Office",
                "period": "Okres",
                "preferredfilecharset": "kodowanie CSV",
                "preferredofficesuite": "Preferowany pakiet office",
                "space": "Przestrzeń",
                "thousandserror": "Pole tysiąca musi być obecne",
                "timezone": "Strefa czasowa",
                "twelvehourformat": "format 12-godzinny",
                "twentyfourhourformat": "format 24-godzinny"
            },
            "searchinallitems": "Szukaj we wszystkich elementach",
            "treenavcontenttitle": "{0} z {1}",
            "userpreferences": "Ustawienia"
        },
        "menu": {
            "allitems": "Wszystkie elementy",
            "classes": "Klasy",
            "custompages": "Strony własne",
            "dashboards": "Pulpity",
            "processes": "Procesy",
            "reports": "Raporty",
            "views": "Wyświetleń"
        },
        "notes": {
            "edit": "Zmień notatki"
        },
        "notifier": {
            "attention": "Uwaga",
            "error": "Błąd",
            "genericerror": "Ogólny błąd",
            "genericinfo": "Ogólna informacja",
            "genericwarning": "Ogólne ostrzeżenie",
            "info": "Informacja",
            "success": "Sukces",
            "warning": "Ostrzeżenie"
        },
        "patches": {
            "apply": "Zastosuj poprawki",
            "category": "Kategoria",
            "description": "Opis",
            "name": "Nazwa",
            "patches": "Łatki"
        },
        "processes": {
            "abortconfirmation": "Jesteś pewny, że chcesz anulować?",
            "abortprocess": "Anuluj akcję",
            "action": {
                "advance": "Postęp",
                "label": "Akcja"
            },
            "activeprocesses": "Aktywne procesy",
            "allstatuses": "Wszystkie",
            "editactivity": "Zmień aktywność",
            "openactivity": "Otwórz aktywność",
            "startworkflow": "Początek",
            "workflow": "Workflow"
        },
        "relationGraph": {
            "activity": "aktywność",
            "allLabelsOnGraph": "wszystkie etykiety wykresów",
            "card": "Karta",
            "cardList": "Lista karty",
            "cardRelations": "Powiązania karty",
            "choosenaviagationtree": "Wybierz drzewo nawigacji",
            "class": "Klasa",
            "classList": "Lista klas",
            "compoundnode": "Złożony węzeł",
            "disable": "Wyłącz",
            "edges": "<em>Edges</em>",
            "enable": "Włącz",
            "labelsOnGraph": "Podpowiedź na grafie",
            "level": "Poziom",
            "nodes": "<em>Nodes</em>",
            "openRelationGraph": "Otwórz graf relacji",
            "qt": "Qt",
            "refresh": "Odśwież",
            "relation": "powiązanie",
            "relationGraph": "Graf powiązań",
            "reopengraph": "Otwórz ponownie graf z tego węzła"
        },
        "relations": {
            "adddetail": "Dodaj szczegół",
            "addrelations": "Dodaj powiązania",
            "attributes": "Atrybuty",
            "code": "Kod",
            "deletedetail": "Skasuj szczegół",
            "deleterelation": "Skasuj relację",
            "deleterelationconfirm": "Czy na pewno chcesz skasować to powiązanie?",
            "description": "Opis",
            "editcard": "Edytuj kartę",
            "editdetail": "Edytuj szczegół",
            "editrelation": "Edytuj powiązanie",
            "extendeddata": "Dane rozszerzone",
            "mditems": "Elementy",
            "missingattributes": "Brakujące niezbędne atrybuty",
            "opencard": "Otwórz powiązaną kartę",
            "opendetail": "Pokaż szczegół",
            "type": "Typ"
        },
        "reports": {
            "csv": "CSV",
            "download": "Pobierz",
            "format": "Format",
            "odt": "ODT",
            "pdf": "PDF",
            "print": "Wydrukuj",
            "reload": "Załaduj ponownie",
            "rtf": "RTF"
        },
        "system": {
            "data": {
                "lookup": {
                    "CalendarCategory": {
                        "default": {
                            "description": "Domyślne"
                        }
                    },
                    "CalendarFrequency": {
                        "daily": {
                            "description": "Codziennie"
                        },
                        "monthly": {
                            "description": "miesięcznie"
                        },
                        "once": {
                            "description": "Raz"
                        },
                        "weekly": {
                            "description": "Tygodniowo"
                        },
                        "yearly": {
                            "description": "rocznie"
                        }
                    },
                    "CalendarPriority": {
                        "default": {
                            "description": "Domyślne"
                        }
                    }
                }
            }
        },
        "thematism": {
            "addThematism": "Dodaj Tematyczność",
            "analysisType": "Typ analizy",
            "attribute": "Atrybut",
            "calculateRules": "Wygeneruj zasady stylu",
            "clearThematism": "Wyczyść tematyczność",
            "color": "Kolor",
            "defineLegend": "Definicja legendy",
            "defineThematism": "Definicja tematyczności",
            "function": "Funkcja",
            "generate": "Wygeneruj",
            "geoAttribute": "Atrybut geograficzny",
            "graduated": "ukończony/stopniowany",
            "highlightSelected": "Podświetl wybrany element",
            "intervals": "Rozdziały czasowe",
            "legend": "Legeneda",
            "name": "nazwa",
            "newThematism": "Nowa tematyczność",
            "punctual": "Punktualnie",
            "quantity": "Ilość",
            "segments": "Segmenty",
            "source": "Źródło",
            "table": "Tabela",
            "thematism": "Tematyczości",
            "value": "Wartość"
        },
        "widgets": {
            "customform": {
                "addrow": "Dodaj wiersz",
                "clonerow": "Skopiuj wiersz",
                "datanotvalid": "Dane nieprawidłowe",
                "deleterow": "Skasuj wiersz",
                "editrow": "Edytuj wiersz",
                "export": "Eksportuj",
                "import": "Zaimportuj",
                "importexport": {
                    "expattributes": "Dane do eksportu",
                    "file": "Plik",
                    "filename": "Nazwa pliku",
                    "format": "Format",
                    "importmode": "Sposób importu",
                    "keyattributes": "Główne atrybuty",
                    "missingkeyattr": "Proszę wybrać przynajmniej jeden atrybut",
                    "modeadd": "Dodaj",
                    "modemerge": "Połącz",
                    "modereplace": "Zamień",
                    "separator": "Separator"
                },
                "refresh": "Przywróć domyślne"
            },
            "linkcards": {
                "checkedonly": "Tylko zaznaczone",
                "editcard": "Edytuj kartę",
                "opencard": "Otwórz kartę",
                "refreshselection": "Zastosuj domyślny wybór",
                "togglefilterdisabled": "Wyłącz filtr siatki",
                "togglefilterenabled": "Włącz filtr siatki"
            },
            "required": "Widget jest wymagany"
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