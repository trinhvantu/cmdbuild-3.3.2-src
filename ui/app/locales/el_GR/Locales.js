(function() {
    Ext.define('CMDBuildUI.locales.el_GR.Locales', {
        "requires": ["CMDBuildUI.locales.el_GR.LocalesAdministration"],
        "override": "CMDBuildUI.locales.Locales",
        "singleton": true,
        "localization": "el_GR",
        "administration": CMDBuildUI.locales.el_GR.LocalesAdministration.administration,
        "attachments": {
            "add": "Προσθήκη συνημμένου",
            "attachmenthistory": "Ιστορικό συνημμένων",
            "author": "Συγγραφέας",
            "browse": "Περιήγηση &hellip;",
            "category": "Κατηγορία",
            "code": "Κωδικός",
            "creationdate": "Ημερομηνία δημιουργίας",
            "deleteattachment": "Διαγραφή συνημμένου",
            "deleteattachment_confirmation": "Είστε βέβαιοι ότι θέλετε να διαγράψετε αυτό το συνημμένο;",
            "description": "Περιγραφή",
            "download": "Κατέβασμα",
            "dropfiles": "Απόθεση αρχείων εδώ",
            "editattachment": "Τροποποίηση του συνημμένου",
            "file": "Αρχείο",
            "filealreadyinlist": "Το αρχείο {0} είναι ήδη στη λίστα.",
            "filename": "Όνομα αρχείου",
            "fileview": "<em>View attachment</em>",
            "invalidfiles": "Κατάργηση μη έγκυρων αρχείων",
            "majorversion": "Κύρια έκδοση",
            "modificationdate": "Ημερομηνία τροποποίησης",
            "new": "Νέο συνημμένο",
            "nocategory": "Αταξινόμητες",
            "preview": "Προεπισκόπηση",
            "removefile": "Κατάργηση αρχείου",
            "statuses": {
                "empty": "Κενό αρχείο",
                "error": "Σφάλμα",
                "extensionNotAllowed": "Η επέκταση αρχείου δεν επιτρέπεται",
                "loaded": "Φόρτωσε",
                "ready": "Έτοιμο"
            },
            "successupload": "{0} συνημμένα που έχουν μεταφορτωθεί.",
            "uploadfile": "Ανέβασμα αρχείου...",
            "version": "Έκδοση",
            "viewhistory": "Προβολή ιστορικού συνημμένων",
            "warningmessages": {
                "atleast": "Προειδοποίηση: έχει φορτωθεί {0} συνημμένα τύπου \"{1}\". Η κατηγορία αυτή αναμένει τουλάχιστον {2} συνημμένα",
                "exactlynumber": "Προειδοποίηση: έχει φορτωθεί {0} συνημμένα τύπου \"{1}\". Αυτή η κατηγορία αναμένει {2} συνημμένα",
                "maxnumber": "Προειδοποίηση: έχει φορτωθεί {0} συνημμένο τύπου \"{1}\". Αυτή η κατηγορία αναμένει το πολύ {2} συνημμένα"
            },
            "wrongfileextension": "{0} επέκταση αρχείου δεν επιτρέπεται"
        },
        "bim": {
            "bimViewer": "Bim Viewer",
            "card": {
                "label": "Κάρτα"
            },
            "layers": {
                "label": "Επίπεδα",
                "menu": {
                    "hideAll": "Απόκρυψη όλων",
                    "showAll": "Εμφάνιση όλων"
                },
                "name": "Ονομα",
                "qt": "Qt",
                "visibility": "Ορατότητα"
            },
            "menu": {
                "camera": "Φωτογραφική μηχανή",
                "frontView": "Εμπρόσθια όψη",
                "mod": "Έλεγχοι προβολής",
                "orthographic": "Ορθογραφική κάμερα",
                "pan": "Μετακινηθείτε",
                "perspective": "Προοπτική κάμερα",
                "resetView": "Επαναφορά προβολής",
                "rotate": "περιστροφή",
                "sideView": "Πλευρική όψη",
                "topView": "Κάτοψη"
            },
            "showBimCard": "Ανοίξτε το πρόγραμμα προβολής 3D",
            "tree": {
                "arrowTooltip": "Επιλέξτε στοιχείο",
                "columnLabel": "Δέντρο",
                "label": "Δέντρο",
                "open_card": "Άνοιγμα σχετικής κάρτας",
                "root": "Ifc Root"
            }
        },
        "bulkactions": {
            "abort": "Ματαίωση επιλεγμένων στοιχείων",
            "cancelselection": "Ακύρωση επιλογής",
            "confirmabort": "Ματαιώνετε {0}  διεργασίες. Είστε βέβαιοι ότι θέλετε να συνεχίσετε;",
            "confirmdelete": "Διαγράφετε {0} κάρτες. Είστε βέβαιοι ότι θέλετε να συνεχίσετε;",
            "confirmdeleteattachements": "Διαγράφετε {0} συνημμένα. Είστε βέβαιοι ότι θέλετε να συνεχίσετε;",
            "confirmedit": "Τροποποιείτε {0} για {1} κάρτες. Είστε βέβαιοι ότι θέλετε να συνεχίσετε;",
            "delete": "Διαγραφή επιλεγμένων στοιχείων",
            "download": "Λήψη επιλεγμένων συνημμένων",
            "edit": "Επεξεργασία επιλεγμένων στοιχείων",
            "selectall": "Επιλέξτε όλα τα στοιχεία"
        },
        "calendar": {
            "active_expired": "Ενεργή/Ληγμένη",
            "add": "Προσθήκη χρονοδιαγράμματος",
            "advancenotification": "Γνωστοποίηση ημέρες πριν",
            "allcategories": "Όλες οι κατηγορίες",
            "alldates": "Όλες οι ημερομηνίες",
            "calculated": "Υπολογίστηκε",
            "calendar": "Ημερολόγιο",
            "cancel": "Σήμανση ως ακυρωμένου",
            "category": "Κατηγορία",
            "cm_confirmcancel": "Είστε βέβαιοι ότι θέλετε να επισημάνετε ως ακυρωμένα τα επιλεγμένα χρονοδιαγράμματα;",
            "cm_confirmcomplete": "Είστε βέβαιοι ότι θέλετε να επισημάνετε ως ολοκληρωμένα τα επιλεγμένα χρονοδιαγράμματα;",
            "cm_markcancelled": "Σήμανση ως ακυρωμένων των επιλεγμένων χρονοδιαγραμμάτων",
            "cm_markcomplete": "Σήμανση ως ολοκληρωμένων των επιλεγμένων χρονοδιαγραμμάτων",
            "complete": "Ολοκληρώθηκε",
            "completed": "Ολοκληρωμένο",
            "date": "Ημερομηνία",
            "days": "Ημέρες",
            "delaybeforedeadline": "Καθυστέρηση πριν από την προθεσμία",
            "delaybeforedeadlinevalue": "Καθυστέρηση πριν από την τιμή προθεσμίας",
            "description": "Περιγραφή",
            "editevent": "Επεξεργασία χρονοδιαγράμματος",
            "enddate": "Ημερομηνία λήξης",
            "endtype": "Τύπος τέλους",
            "event": "Χρονοδιάγραμμα",
            "executiondate": "Ημερομηνία εκτέλεσης",
            "frequency": "Συχνότητα",
            "frequencymultiplier": "Πολλαπλασιαστής συχνότητας",
            "grid": "Πλέγμα",
            "leftdays": "Μέρες που απομένουν",
            "londdescription": "Πλήρης περιγραφή",
            "manual": "Εγχειρίδιο",
            "maxactiveevents": "Μέγιστα ανοικτά χρονοδιαγράμματα",
            "messagebodydelete": "Θα θέλατε να διαγράψετε τον κανόνα χρονοδιαγράμματος;",
            "messagebodyplural": "Υπάρχουν {0} κανόνες χρονοδιαγραμμάτων",
            "messagebodyrecalculate": "Θα θέλατε να υπολογίσετε ξανά τον κανόνα χρονοδιαγραμμάτων με τη νέα ημερομηνία;",
            "messagebodysingular": "Υπάρχει {0} κανόνας/ες χρονοδιαγραμμάτων",
            "messagetitle": "Επαναϋπολογισμός χρονοδιαγράμματος",
            "missingdays": "Ημέρες που λείπουν",
            "next30days": "Επόμενες 30 ημέρες",
            "next7days": "Επόμενες 7 ημέρες",
            "notificationtemplate": "Πρότυπο που χρησιμοποιείται για την ειδοποίηση",
            "notificationtext": "Κείμενο ειδοποίησης",
            "occurencies": "Αριθμός εμφανίσεων",
            "operation": "Λειτουργία",
            "partecipantgroup": "Ομάδα συμμετεχόντων",
            "partecipantuser": "Συμμετέχων χρήστης",
            "priority": "Προτεραιότητα",
            "recalculate": "Επαναϋπολογισμός",
            "referent": "Αναφερόμενο",
            "scheduler": "Χρονοδιάγραμμα εργασιών",
            "sequencepaneltitle": "Δημιουργία χρονοδιαγραμμάτων",
            "startdate": "Ημερομηνία έναρξης",
            "status": "Κατάσταση",
            "today": "Σήμερα",
            "type": "Τύπος",
            "viewevent": "Προβολή χρονοδιαγράμματος",
            "widgetcriterion": "Κριτήριο υπολογισμού",
            "widgetemails": "Μηνύματα ηλεκτρονικού ταχυδρομείου",
            "widgetsourcecard": "Κάρτα προέλευσης"
        },
        "classes": {
            "cards": {
                "addcard": "Προσθήκη κάρτας",
                "clone": "Κλώνος",
                "clonewithrelations": "Κλωνοποιήστε την κάρτα και τις σχέσεις",
                "deletebeaware": "Πρέπει να γνωρίζετε ότι:",
                "deleteblocked": "Δεν είναι δυνατόν να προχωρήσουμε με τη διαγραφή, επειδή υπάρχουν συσχετίσεις με {0}.",
                "deletecard": "Διαγραφή κάρτας",
                "deleteconfirmation": "Είστε βέβαιοι ότι θέλετε να διαγράψετε αυτήν την κάρτα;",
                "deleterelatedcards": "επίσης {0} σχετικές κάρτες θα διαγραφούν",
                "deleterelations": "συσχετίσεις με {0} κάρτες θα διαγραφούν",
                "label": "Κάρτες",
                "modifycard": "Τροποποίηση κάρτας",
                "opencard": "Άνοιγμα κάρτας",
                "print": "Εκτύπωση κάρτας"
            },
            "simple": "Απλό",
            "standard": "Standard"
        },
        "common": {
            "actions": {
                "add": "Προσθήκη",
                "apply": "Εφαρμογή",
                "cancel": "Ακύρωση",
                "close": "Κλείσιμο",
                "delete": "Διαγραφή",
                "edit": "Επεξεργασία",
                "execute": "Εκτέλεση",
                "help": "Βοήθεια",
                "load": "Φόρτωση",
                "open": "Ανοικτό",
                "refresh": "Ανανέωση δεδομένων",
                "remove": "Αφαίρεση",
                "save": "Αποθήκευση",
                "saveandapply": "Αποθήκευση και εφαρμογή",
                "saveandclose": "Αποθήκευση και κλείσιμο",
                "search": "Αναζήτηση",
                "searchtext": "Αναζήτηση…"
            },
            "attributes": {
                "nogroup": "Τα βασικά δεδομένα"
            },
            "dates": {
                "date": "d / m / Y",
                "datetime": "d/m/Y H:i:s",
                "time": "H:i:s"
            },
            "editor": {
                "clearhtml": "Διαγραφή HTML",
                "expand": "Ανάπτυξη προγράμματος επεξεργασίας",
                "reduce": "Μείωση προγράμματος επεξεργασίας",
                "unlink": "<em>Unlink</em>",
                "unlinkmessage": "<em>Transform the selected hyperlink into text.</em>"
            },
            "grid": {
                "disablemultiselection": "Απενεργοποιήστε την πολλαπλή επιλογή",
                "enamblemultiselection": "Ενεργοποιήστε την επιλογή πολλαπλών επιλογών",
                "export": "Εξαγωγή δεδομένων",
                "filterremoved": "Το τρέχον φίλτρο έχει αφαιρεθεί",
                "import": "Εισαγωγή δεδομένων",
                "itemnotfound": "Δεν βρέθηκε το αντικείμενο",
                "list": "Λίστα",
                "opencontextualmenu": "Ανοίξτε το μενού πλαισίου",
                "print": "Εκτύπωση",
                "printcsv": "Εκτύπωση ως CSV",
                "printodt": "Εκτύπωση ως ODT",
                "printpdf": "Εκτύπωση ως PDF",
                "row": "Στοιχείο",
                "rows": "Αντικείμενα",
                "subtype": "Υποτύπου"
            },
            "tabs": {
                "activity": "Δραστηριότητα",
                "attachment": "Συνημμένο",
                "attachments": "Συνημμένα αρχεία",
                "card": "Κάρτα",
                "clonerelationmode": "Λειτουργία συσχετίσεων κλώνου",
                "details": "Λεπτομέρειες",
                "emails": "Emails",
                "history": "Ιστορικό",
                "notes": "Σημειώσεις",
                "relations": "Συσχετίσεις",
                "schedules": "Χρονοδιαγράμματα"
            }
        },
        "dashboards": {
            "tools": {
                "gridhide": "Απόκρυψη πλέγματος δεδομένων",
                "gridshow": "Εμφάνιση πλέγματος δεδομένων",
                "parametershide": "Απόκρυψη παραμέτρων δεδομένων",
                "parametersshow": "Εμφάνιση παραμέτρων δεδομένων",
                "reload": "Επαναφόρτωση"
            }
        },
        "emails": {
            "addattachmentsfromdocumentarchive": "Προσθήκη συνημμένων από την αρχειοθήκη εγγράφων",
            "alredyexistfile": "Υπάρχει ήδη ένα αρχείο με αυτό το όνομα",
            "archivingdate": "Ημερομηνία αρχειοθέτησης",
            "attachfile": "Επισύναψη αρχείου",
            "bcc": "Bcc",
            "cc": "Cc",
            "composeemail": "Σύνθεση e-mail",
            "composefromtemplate": "Σύνθεση από το πρότυπο",
            "delay": "Καθυστέρηση",
            "delays": {
                "day1": "Σε 1 ημέρα",
                "days2": "Σε 2 ημέρες",
                "days4": "Σε 4 ημέρες",
                "hour1": "Σε 1 ώρα",
                "hours2": "Σε 2 ώρες",
                "hours4": "Σε 4 ώρες",
                "month1": "Σε 1 μήνα",
                "negativeday1": "Πριν 1 ημέρα",
                "negativedays2": "Πριν 2 ημέρες",
                "negativedays4": "Πριν 4 ημέρες",
                "negativehour1": "Πριν 1 ώρα",
                "negativehours2": "Πριν 2 ώρες",
                "negativehours4": "Πριν 4 ώρες",
                "negativemonth1": "Πριν 1 μήνα",
                "negativeweek1": "Πριν 1 εβδομάδα",
                "negativeweeks2": "Πριν 2 εβδομάδες",
                "none": "Κανένα",
                "week1": "Σε 1 εβδομάδα",
                "weeks2": "Σε 2 εβδομάδες"
            },
            "dmspaneltitle": "Επιλογή των συνημμένων από τη Βάση Δεδομένων",
            "edit": "Επεξεργασία",
            "from": "Από",
            "gridrefresh": "Ανανέωση πλέγματος",
            "keepsynchronization": "Διατήρηση συγχρονισμού",
            "message": "Μήνυμα",
            "regenerateallemails": "Ξαναδημιουργία όλων των e-mail",
            "regenerateemail": "Ξαναδημιουργία e-mail",
            "remove": "Αφαίρεση",
            "remove_confirmation": "Είστε βέβαιοι ότι θέλετε να διαγράψετε αυτό το email;",
            "reply": "Απάντηση",
            "replyprefix": "{1} wrote:",
            "selectaclass": "Επιλέξτε μια κατηγορία",
            "sendemail": "Αποστολή e-mail",
            "statuses": {
                "draft": "Πρόχειρο",
                "error": "Σφάλμα",
                "outgoing": "Εξόδου",
                "received": "Ληφθέντα",
                "sent": "Απεσταλμένα"
            },
            "subject": "Θέμα",
            "to": "Προς",
            "view": "Προβολή"
        },
        "errors": {
            "autherror": "Λάθος όνομα χρήστη ή κωδικός πρόσβασης",
            "classnotfound": "Η κατηγορία {0} δεν βρέθηκε",
            "fieldrequired": "Αυτό το πεδίο απαιτείται",
            "invalidfilter": "Μη έγκυρο φίλτρο",
            "notfound": "Δεν βρέθηκε το αντικείμενο"
        },
        "filters": {
            "actions": "Ενέργειες",
            "addfilter": "Προσθήκη φίλτρου",
            "any": "Οποιοδήποτε",
            "attachments": "<em>Attachments</em>",
            "attachmentssearchtext": "<em>Attachments search text</em>",
            "attribute": "Επιλέξτε χαρακτηριστικό",
            "attributes": "Χαρακτηριστικά",
            "clearfilter": "Καθαρισμός φίλτρου",
            "clone": "Κλώνος",
            "copyof": "Αντίγραφο του",
            "currentgroup": "Τρέχον group",
            "currentuser": "Τρέχον χρήστης",
            "defaultset": "Θέστε ως προεπιλογή",
            "defaultunset": "Ακύρωση από προεπιλογή",
            "description": "Περιγραφή",
            "domain": "Πεδίο ορισμού",
            "filterdata": "Φιλτράρετε δεδομένα",
            "fromfilter": "<em>From filter</em>",
            "fromselection": "Από επιλογή",
            "group": "Ομάδα",
            "ignore": "Αγνοήστε",
            "migrate": "Μεταναστεύει",
            "name": "Όνομα",
            "newfilter": "Νέο φίλτρο",
            "noone": "Κανένα",
            "operator": "Χειριστής",
            "operators": {
                "beginswith": "Ξεκινήστε με",
                "between": "Ανάμεσα",
                "contained": "Περιέχονται",
                "containedorequal": "Περιλαμβανόμενο ή ίσο",
                "contains": "Περιλαμβάνει",
                "containsorequal": "Περιλαμβάνει ή είναι ίσο",
                "descriptionbegin": "<em>Description begins with</em>",
                "descriptioncontains": "Η περιγραφή περιέχει",
                "descriptionends": "<em>Description ends with</em>",
                "descriptionnotbegin": "<em>Description does not begins with</em>",
                "descriptionnotcontain": "<em>Description does not contain</em>",
                "descriptionnotends": "<em>Description does not ends with</em>",
                "different": "Διαφορετικό",
                "doesnotbeginwith": "Δεν ξεκινάει με",
                "doesnotcontain": "Δεν περιέχει",
                "doesnotendwith": "Δεν τελειώνει με",
                "endswith": "Τελειώνει με",
                "equals": "Ισούται",
                "greaterthan": "Μεγαλότερο από",
                "isnotnull": "Δεν είναι κενό",
                "isnull": "Είναι κενό",
                "lessthan": "Λιγότερο από"
            },
            "relations": "Συσχετίσεις",
            "type": "Τύπος",
            "typeinput": "Παράμετρος εισαγωγής",
            "user": "Χρήστης",
            "value": "Τιμή"
        },
        "gis": {
            "card": "Κάρτα",
            "cardsMenu": "Μενού Καρτών",
            "code": "Κωδικός",
            "description": "Περιγραφή",
            "extension": {
                "errorCall": "Σφάλμα",
                "noResults": "Κανένα αποτέλεσμα"
            },
            "externalServices": "Εξωτερικές υπηρεσίες",
            "geographicalAttributes": "Γεωγραφικά χαρακτηριστικά",
            "geoserverLayers": "Επίπεδα Geoserver",
            "layers": "Επίπεδα",
            "list": "Λίστα",
            "longpresstitle": "Γεωστοιχεία στην περιοχή",
            "map": "Χάρτης",
            "mapServices": "Υπηρεσίες Χάρτη",
            "position": "Θέση",
            "root": "Αρχή",
            "tree": "Δέντρο",
            "type": "Τύπος",
            "view": "Προβολή",
            "zoom": "Μεγέθυνση"
        },
        "history": {
            "activityname": "Όνομα δραστηριότητας",
            "activityperformer": "Εκτελεστής δραστηριότητας",
            "begindate": "Ημερομηνία έναρξης",
            "enddate": "Ημερομηνία λήξης",
            "processstatus": "Κατάσταση",
            "user": "Χρήστης"
        },
        "importexport": {
            "database": {
                "uri": "URI βάσης δεδομένων",
                "user": "Χρήστης βάσης δεδομένων"
            },
            "downloadreport": "Λήψη αναφοράς",
            "emailfailure": "Παρουσιάστηκε σφάλμα κατά την αποστολή email",
            "emailmessage": "Επισυνάπτεται αναφορά εισαγωγής του αρχείου \"{0}\" στην ημερομηνία {1}",
            "emailsubject": "Εισαγωγή αναφοράς δεδομένων",
            "emailsuccess": "Το μήνυμα ηλεκτρονικού ταχυδρομείου έχει σταλεί με επιτυχία!",
            "export": "Εξαγωγή",
            "exportalldata": "Όλα τα δεδομένα",
            "exportfiltereddata": "Μόνο δεδομένα που ταιριάζουν με το φίλτρο πλέγματος",
            "gis": {
                "shapeimportdisabled": "Η εισαγωγή σχημάτων δεν είναι ενεργοποιημένη για αυτό το πρότυπο",
                "shapeimportenabled": "Ρύθμιση παραμέτρων εισαγωγής σχημάτων"
            },
            "ifc": {
                "card": "<em>Card</em>",
                "project": "Έργο",
                "sourcetype": "Εισαγωγή από"
            },
            "import": "Εισαγωγή",
            "importresponse": "Απόκριση εισαγωγής",
            "response": {
                "created": "Δημιουργημένα στοιχεία",
                "deleted": "Διεγραμμένα αντικείμενα",
                "errors": "Λάθη",
                "linenumber": "Αριθμός γραμμής",
                "message": "Μήνυμα",
                "modified": "Τροποποιημένα στοιχεία",
                "processed": "Επεξεργασμένες γραμμές",
                "recordnumber": "Αριθμός εγγραφής",
                "unmodified": "Μη τροποποιημένα στοιχεία"
            },
            "sendreport": "Αποστολή αναφοράς",
            "template": "Πρότυπο",
            "templatedefinition": "Ορισμός προτύπου"
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
                "login": "Σύνδεση",
                "logout": "Αλλαγή χρήστη"
            },
            "fields": {
                "group": "Ομάδα",
                "language": "Γλώσσα",
                "password": "Κωδικός πρόσβασης",
                "tenants": "Οι μισθωτές",
                "username": "Όνομα χρήστη"
            },
            "loggedin": "Συνδεδεμένοι",
            "title": "Σύνδεση",
            "welcome": "Καλώς ορίσατε πίσω {0}."
        },
        "main": {
            "administrationmodule": "Ενότητα Διαχείρισης",
            "baseconfiguration": "Διαμόρφωση βάσης",
            "cardlock": {
                "lockedmessage": "Δεν μπορείτε να επεξεργαστείτε αυτήν την κάρτα επειδή ο {0} την επεξεργάζεται.",
                "someone": "Κάποιος"
            },
            "changegroup": "Αλλαγή ομάδας",
            "changetenant": "Αλλαγή {0}",
            "confirmchangegroup": "Είστε βέβαιοι ότι θέλετε να αλλάξετε την ομάδα;",
            "confirmchangetenants": "Είστε βέβαιοι ότι θέλετε να αλλάξετε ενεργούς ενοικιαστές;",
            "confirmdisabletenant": "Είστε βέβαιοι ότι θέλετε να απενεργοποιήσετε τη σημαία \"Αγνόηση ενοικιαστών\";",
            "confirmenabletenant": "Είστε βέβαιοι ότι θέλετε να ενεργοποιήσετε τη σημαία \"Αγνόηση ενοικιαστών\";",
            "ignoretenants": "Παράβλεψη {0}",
            "info": "Πληροφορίες",
            "logo": {
                "cmdbuild": "Λογότυπο CMDBuild",
                "cmdbuildready2use": "Λογότυπο CMDBuild READY2USE",
                "companylogo": "Λογότυπο Εταιρείας",
                "openmaint": "το λογότυπο openMAINT"
            },
            "logout": "Αποσύνδεση",
            "managementmodule": "Ενότητα διαχείρησης δεδομένων",
            "multigroup": "Πολλαπλή ομάδα",
            "multitenant": "Πολλαπλό {0}",
            "navigation": "Πλοήγηση",
            "pagenotfound": "Η σελίδα δεν βρέθηκε",
            "password": {
                "change": "Αλλαγή κωδικού πρόσβασης",
                "confirm": "Επιβεβαίωση κωδικού πρόσβασης",
                "email": "Διεύθυνση email",
                "err_confirm": "Οι κωδικοί πρόσβασης δεν ταιριάζουν.",
                "err_diffprevious": "Ο νέος κωδικός πρόσβασης δεν μπορεί να είναι ίδιος με τον προηγούμενο.",
                "err_diffusername": "Ο κωδικός πρόσβασης δεν μπορεί να είναι ίδιος με το όνομα χρήστη.",
                "err_length": "Ο κωδικός πρόσβασης πρέπει να έχει μήκος τουλάχιστον {0} χαρακτήρων.",
                "err_reqdigit": "Ο κωδικός πρόσβασης πρέπει να περιέχει τουλάχιστον ένα ψηφίο.",
                "err_reqlowercase": "Ο κωδικός πρόσβασης πρέπει να περιέχει τουλάχιστον ένα πεζό γράμμα.",
                "err_requppercase": "Ο κωδικός πρόσβασης πρέπει να περιέχει τουλάχιστον ένα κεφαλαίο γράμμα.",
                "expired": "Ο κωδικός πρόσβασης σας έχει λήξει. Αλλάξτε τον τώρα.",
                "forgotten": "Ξέχασα των κωδικό πρόσβασης μου",
                "new": "Νέος κωδικός πρόσβασης",
                "old": "Παλιός κωδικός πρόσβασης",
                "recoverysuccess": "Σας στείλαμε email με οδηγίες ανάκτησης του κωδικού πρόσβασης",
                "reset": "Επαναφορά κωδικού πρόσβασης",
                "saved": "Ο κωδικός πρόσβασης αποθηκεύτηκε επιτυχώς!"
            },
            "pleasecorrecterrors": "Παρακαλούμε διορθώστε τα υποδεικνυόμενα!",
            "preferences": {
                "comma": "Κόμμα",
                "decimalserror": "Πρέπει να υπάρχει πεδίο δεκαδικών",
                "decimalstousandserror": "Τα δεκαδικά ψηφία και οι διαχωριστές χιλιάδων πρέπει να είναι διαφορετικά",
                "default": "Προκαθορισμένο",
                "defaultvalue": "Προεπιλεγμένη τιμή",
                "firstdayofweek": "<em>First day of week</em>",
                "gridpreferencesclear": "Καθαρισμός προτιμήσεων πλέγματος",
                "gridpreferencescleared": "Σβήστηκαν οι προτιμήσεις πλέγματος!",
                "gridpreferencessave": "Αποθήκευση προτιμήσεων πλέγματος",
                "gridpreferencessaved": "Αποθηκεύτηκαν οι προτιμήσεις πλέγματος!",
                "gridpreferencesupdate": "Ενημέρωση προτιμήσεων πλέγματος",
                "labelcsvseparator": "Διαχωριστικό CSV",
                "labeldateformat": "Μορφή ημερομηνίας",
                "labeldecimalsseparator": "Διαχωριστής δεκαδικών",
                "labellanguage": "Γλώσσα",
                "labelthousandsseparator": "Διαχωριστικό Χιλιάδων",
                "labeltimeformat": "Μορφή ώρας",
                "msoffice": "Microsoft Office",
                "period": "Περίοδος",
                "preferredfilecharset": "Κωδικοποίηση CSV",
                "preferredofficesuite": "Προτιμώμενη σουίτα του Office",
                "space": "Χώρος",
                "thousandserror": "Το πεδίο χιλιάδων πρέπει να είναι υπάρχει",
                "timezone": "Ζώνη ώρας",
                "twelvehourformat": "Μορφή 12 ωρών",
                "twentyfourhourformat": "Μορφή 24 ωρών"
            },
            "searchinallitems": "Αναζήτηση σε όλα τα στοιχεία",
            "treenavcontenttitle": "{0} από {1}",
            "userpreferences": "Προτιμήσεις"
        },
        "menu": {
            "allitems": "Ολα τα αντικείμενα",
            "classes": "Κατηγορίες",
            "custompages": "Προσαρμοσμένες σελίδες",
            "dashboards": "Dashboards",
            "processes": "Διαδικασίες",
            "reports": "Αναφορές",
            "views": "Προβολές"
        },
        "notes": {
            "edit": "Τροποποίηση σημειώσεων"
        },
        "notifier": {
            "attention": "Προσοχή",
            "error": "Σφάλμα",
            "genericerror": "Γενικό σφάλμα",
            "genericinfo": "Γενικές πληροφορίες",
            "genericwarning": "Γενική προειδοποίηση",
            "info": "Πληροφορίες",
            "success": "Επιτυχία",
            "warning": "Προειδοποίηση"
        },
        "patches": {
            "apply": "Εφαρμογή επιδιορθώσεων",
            "category": "Κατηγορία",
            "description": "Περιγραφή",
            "name": "Ονομα",
            "patches": "Επιδιορθώσεις λογισμικού"
        },
        "processes": {
            "abortconfirmation": "Είστε σίγουροι ότι θέλετε να εγκαταλείψετε αυτή τη διαδικασία;",
            "abortprocess": "Ακύρωση διαδικασίας",
            "action": {
                "advance": "Προκαταβολή",
                "label": "Ενέργεια"
            },
            "activeprocesses": "Ενεργές διαδικασίες",
            "allstatuses": "Όλα",
            "editactivity": "Τροποποίηση δραστηριότητας",
            "openactivity": "Ανοικτή δραστηριότητα",
            "startworkflow": "Έναρξη",
            "workflow": "Διαδικασία"
        },
        "relationGraph": {
            "activity": "Δραστηριότητα",
            "allLabelsOnGraph": "όλες οι ετικέτες στο γράφημα",
            "card": "Κάρτα",
            "cardList": "Λίστα κάρτας",
            "cardRelations": "Συσχετίσεις καρτών",
            "choosenaviagationtree": "Επιλέξτε ένα δέντρο πλοήγησης",
            "class": "Κατηγορία",
            "classList": "Λίστα κατηγορίας",
            "compoundnode": "Σύνθετος κόμβος",
            "disable": "Απενεργοποίηση",
            "edges": "<em>Edges</em>",
            "enable": "Ενεργοποίηση",
            "labelsOnGraph": "tooltip σε γράφημα",
            "level": "Επίπεδο",
            "nodes": "<em>Nodes</em>",
            "openRelationGraph": "Άνοιγμα γραφήματος συσχετισης",
            "qt": "Qt",
            "refresh": "Ανανέωση",
            "relation": "συσχετισμός",
            "relationGraph": "Γράφημα συσχετισης",
            "reopengraph": "Ανοίξτε ξανά το γράφημα από αυτόν τον κόμβο"
        },
        "relations": {
            "adddetail": "Προσθήκη λεπτομέρειας",
            "addrelations": "Προσθήκη συσχετίσεων",
            "attributes": "Χαρακτηριστικά",
            "code": "Κωδικός",
            "deletedetail": "Διαγραφή λεπτομέρειας",
            "deleterelation": "Διαγραφή συσχετισμού",
            "deleterelationconfirm": "Είστε βέβαιοι ότι θέλετε να διαγράψετε αυτήν τη σχέση;",
            "description": "Περιγραφή",
            "editcard": "Επεξεργασία κάρτας",
            "editdetail": "Επεξεργασία λεπτομέρειας",
            "editrelation": "Επεξεργασία συσχετισμού",
            "extendeddata": "Εκτεταμένα δεδομένα",
            "mditems": "Αντικείμενα",
            "missingattributes": "Ελλειπή υποχρεωτικά χαρακτηριστικά",
            "opencard": "Άνοιγμα σχετικής κάρτας",
            "opendetail": "Εμφάνιση λεπτομερειών",
            "type": "Τύπος"
        },
        "reports": {
            "csv": "CSV",
            "download": "Κατέβασμα",
            "format": "Μορφή",
            "odt": "ODT",
            "pdf": "PDF",
            "print": "Εκτύπωση",
            "reload": "Επαναφόρτωση",
            "rtf": "RTF"
        },
        "system": {
            "data": {
                "lookup": {
                    "CalendarCategory": {
                        "default": {
                            "description": "Προεπιλογή"
                        }
                    },
                    "CalendarFrequency": {
                        "daily": {
                            "description": "Καθημερινά"
                        },
                        "monthly": {
                            "description": "Μηνιαία"
                        },
                        "once": {
                            "description": "Μόλις"
                        },
                        "weekly": {
                            "description": "Εβδομαδιαία"
                        },
                        "yearly": {
                            "description": "Ετήσια"
                        }
                    },
                    "CalendarPriority": {
                        "default": {
                            "description": "Προεπιλογή"
                        }
                    }
                }
            }
        },
        "thematism": {
            "addThematism": "Προσθήκη θεματικής",
            "analysisType": "Τύπος ανάλυσης",
            "attribute": "Χαρακτηριστικό",
            "calculateRules": "Δημιουργία κανόνων στυλ",
            "clearThematism": "Καθαρισμός θεματικής",
            "color": "Χρώμα",
            "defineLegend": "Ορισμός λεζάντας",
            "defineThematism": "Ορισμός θεματικής",
            "function": "Λειτουργία",
            "generate": "Δημιουργήστε",
            "geoAttribute": "Γεωγραφική ιδιότητα",
            "graduated": "Αποφοίτησε",
            "highlightSelected": "Επισημάνετε το επιλεγμένο στοιχείο",
            "intervals": "Διαστήματα",
            "legend": "Μύθος",
            "name": "Όνομα",
            "newThematism": "Νέα θεματική",
            "punctual": "Ακριβής",
            "quantity": "Ποσότητα",
            "segments": "Τμήματα",
            "source": "Πηγή",
            "table": "Πίνακας",
            "thematism": "Θεματισμοί",
            "value": "Τιμή"
        },
        "widgets": {
            "customform": {
                "addrow": "Προσθήκη γραμμής",
                "clonerow": "Κλωνοποίηση γραμμής",
                "datanotvalid": "Τα δεδομένα δεν είναι έγκυρα",
                "deleterow": "Διαγραφή γραμμής",
                "editrow": "Επεξεργασία γραμμής",
                "export": "Εξαγωγή",
                "import": "Εισαγωγή",
                "importexport": {
                    "expattributes": "Δεδομένα προς εξαγωγή",
                    "file": "Αρχείο",
                    "filename": "Όνομα αρχείου",
                    "format": "Μορφή",
                    "importmode": "Λειτουργία εισαγωγής",
                    "keyattributes": "Βασικά Χαρακτηριστικά",
                    "missingkeyattr": "Επιλέξτε τουλάχιστον ένα βασικό χαρακτηριστικό",
                    "modeadd": "Προσθήκη",
                    "modemerge": "Συγχώνευση",
                    "modereplace": "Αντικατάσταση",
                    "separator": "Διαχωριστικό"
                },
                "refresh": "Ανανέωση στις προεπιλογές"
            },
            "linkcards": {
                "checkedonly": "Ελέγχθηκε μόνο",
                "editcard": "Επεξεργασία κάρτας",
                "opencard": "Άνοιγμα κάρτας",
                "refreshselection": "Εφαρμογή προεπιλογής",
                "togglefilterdisabled": "Απενεργοποίηση φίλτρου πλέγματος",
                "togglefilterenabled": "Ενεργοποίηση φίλτρου πλέγματος"
            },
            "required": "Αυτό το widget είναι απαραίτητο."
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