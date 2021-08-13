(function() {
    Ext.define('CMDBuildUI.locales.fr.Locales', {
        "requires": ["CMDBuildUI.locales.fr.LocalesAdministration"],
        "override": "CMDBuildUI.locales.Locales",
        "singleton": true,
        "localization": "fr",
        "administration": CMDBuildUI.locales.fr.LocalesAdministration.administration,
        "attachments": {
            "add": "Ajouter des pièces jointes",
            "attachmenthistory": "Historique des pièces jointes",
            "author": "Auteur",
            "browse": "Feuilleter &hellip;",
            "category": "Catégorie",
            "code": "Code",
            "creationdate": "Date de création",
            "deleteattachment": "Supprimer la pièce jointe",
            "deleteattachment_confirmation": "Êtes-vous sûr de vouloir supprimer cette pièce jointe?",
            "description": "Description",
            "download": "Télécharger",
            "dropfiles": "Déposez les fichiers ici",
            "editattachment": "Modifier la pièce jointe",
            "file": "Fichier",
            "filealreadyinlist": "Le fichier {0} existe déjà",
            "filename": "Nom de fichier",
            "fileview": "<em>View attachment</em>",
            "invalidfiles": "Supprimer les fichiers invalides",
            "majorversion": "Version majeure",
            "modificationdate": "Date de modification",
            "new": "Nouvelle pièce jointe",
            "nocategory": "Non classé",
            "preview": "Aperçu",
            "removefile": "Supprimer le fichier",
            "statuses": {
                "empty": "Fichier vide",
                "error": "Erreur",
                "extensionNotAllowed": "Extension de fichier non autorisée",
                "loaded": "Chargé",
                "ready": "Pret"
            },
            "successupload": "{0} pièces jointes importées",
            "uploadfile": "Charger un fichier...",
            "version": "Version",
            "viewhistory": "Afficher l'historique des pièces jointes",
            "warningmessages": {
                "atleast": "Avertissement: {0} pièces jointes de type \"{1}\" ont été téléchargées. Cette catégorie comporte au moins {2} pièces jointes",
                "exactlynumber": "Avertissement: {0} pièces jointes de type \"{1}\" ont été téléchargées. Cette catégorie comporte {2} pièces jointes",
                "maxnumber": "Avertissement: {0} pièces jointes de type \"{1}\" ont été téléchargées. Cette catégorie comporte un maximum de {2} pièces jointes"
            },
            "wrongfileextension": "L'extension de fichier {0} n'est pas autorisée"
        },
        "bim": {
            "bimViewer": "Bim Viewer",
            "card": {
                "label": "Fiche"
            },
            "layers": {
                "label": "Couches",
                "menu": {
                    "hideAll": "Tout cacher",
                    "showAll": "Montrer tout"
                },
                "name": "Nom",
                "qt": "Qt",
                "visibility": "Visibilité"
            },
            "menu": {
                "camera": "Caméra",
                "frontView": "Vue de face",
                "mod": "Commandes de la visionneuse",
                "orthographic": "Caméra orthographique",
                "pan": "Panoramique",
                "perspective": "Caméra perspective",
                "resetView": "Réinitialiser la vue",
                "rotate": "Pivoter",
                "sideView": "Vue de côté",
                "topView": "Vue de dessus"
            },
            "showBimCard": "Ouvrir la visionneuse 3D",
            "tree": {
                "arrowTooltip": "Sélectionner un élément",
                "columnLabel": "Arbre",
                "label": "Arbre",
                "open_card": "Ouvrir la fiche associée",
                "root": "Ifc Root"
            }
        },
        "bulkactions": {
            "abort": "Arrêter les processus sélectionnés",
            "cancelselection": "Annuler la sélection",
            "confirmabort": "Vous supprimez {0} instances de processus. Êtes-vous sûr de vouloir procéder aux modifications?",
            "confirmdelete": "Vous supprimez {0} cartes. Êtes-vous sûr de vouloir procéder aux modifications?",
            "confirmdeleteattachements": "Vous supprimez {0} pièces jointes. Êtes-vous sûr de vouloir procéder aux modifications?",
            "confirmedit": "Vous modifiez {0} pour {1} cartes. Êtes-vous sûr de vouloir procéder aux modifications?",
            "delete": "Supprimer les éléments sélectionnés",
            "download": "Téléchargez les pièces jointes sélectionnées",
            "edit": "Modifier les éléments sélectionnés",
            "selectall": "Sélectionnez tous les articles"
        },
        "calendar": {
            "active_expired": "Actif / expiré",
            "add": "ajouter",
            "advancenotification": "Notification à l'avance",
            "allcategories": "Toutes catégories",
            "alldates": "Toutes les dates",
            "calculated": "Calculé",
            "calendar": "calendrier",
            "cancel": "Marquer comme annulé",
            "category": "catégorie",
            "cm_confirmcancel": "Voulez-vous vraiment marquer les dates limites sélectionnées comme annulées?",
            "cm_confirmcomplete": "Voulez-vous vraiment marquer les délais sélectionnés comme terminés?",
            "cm_markcancelled": "Marquer les dates limites sélectionnées comme annulées",
            "cm_markcomplete": "Marquer les délais sélectionnés comme terminés",
            "complete": "Complète",
            "completed": "Terminé",
            "date": "date",
            "days": "Journées",
            "delaybeforedeadline": "Délai avant la date limite",
            "delaybeforedeadlinevalue": "Délai avant la date limite",
            "description": "Description",
            "editevent": "Modifier la date limite",
            "enddate": "Date de fin",
            "endtype": "Date de fin",
            "event": "date limite",
            "executiondate": "Date d'exécution",
            "frequency": "Fréquence",
            "frequencymultiplier": "Multiplicateur de fréquence",
            "grid": "grille",
            "leftdays": "Jours manquants",
            "londdescription": "description détaillée",
            "manual": "Manuel",
            "maxactiveevents": "Nombre maximum de délais actifs",
            "messagebodydelete": "Voulez-vous supprimer les règles de délai?",
            "messagebodyplural": "Il y a {0} règles de délai",
            "messagebodyrecalculate": "Souhaitez-vous recalculer la règle des plannings avec la nouvelle date?",
            "messagebodysingular": "Il y a {0} règle de délai",
            "messagetitle": "Recalcul du délai",
            "missingdays": "Jours manquants",
            "next30days": "30 prochains jours",
            "next7days": "7 prochains jours",
            "notificationtemplate": "Modèle de notification",
            "notificationtext": "Texte de notification",
            "occurencies": "Nombre d'occurrences",
            "operation": "Opération",
            "partecipantgroup": "Groupe de référence",
            "partecipantuser": "Utilisateur référent",
            "priority": "priorité",
            "recalculate": "Recalculer",
            "referent": "contact",
            "scheduler": "Dates limites",
            "sequencepaneltitle": "Générer des délais",
            "startdate": "Date de début",
            "status": "Etat",
            "today": "aujourd'hui",
            "type": "genre",
            "viewevent": "Voir la date limite",
            "widgetcriterion": "Critère de calcul",
            "widgetemails": "Emails",
            "widgetsourcecard": "Carte source"
        },
        "classes": {
            "cards": {
                "addcard": "Ajouter une fiche",
                "clone": "Copier",
                "clonewithrelations": "Carte de clonage et relations",
                "deletebeaware": "Veuillez noter que:",
                "deleteblocked": "Puisqu'il existe des relations avec {0}, il n'est pas possible de procéder à la suppression des cartes.",
                "deletecard": "Supprimer la fiche",
                "deleteconfirmation": "Êtes-vous sûr de vouloir supprimer cette carte?",
                "deleterelatedcards": "les cartes associées {0} seront supprimées",
                "deleterelations": "les relations avec les cartes {0} seront supprimées",
                "label": "Fiches",
                "modifycard": "Modifier la fiche",
                "opencard": "Carte ouverte",
                "print": "Carte d'impression"
            },
            "simple": "Simple",
            "standard": "Standard"
        },
        "common": {
            "actions": {
                "add": "Ajouter",
                "apply": "Appliquer",
                "cancel": "Abandonner",
                "close": "Fermer",
                "delete": "Supprimer",
                "edit": "Modifier",
                "execute": "Exécuter",
                "help": "Aide",
                "load": "Charger",
                "open": "Ouvrez",
                "refresh": "Actualiser les données",
                "remove": "Supprimer",
                "save": "Enregistrer",
                "saveandapply": "Enregistrer et appliquer",
                "saveandclose": "Sauver et fermer",
                "search": "Chercher",
                "searchtext": "Chercher..."
            },
            "attributes": {
                "nogroup": "Données de base"
            },
            "dates": {
                "date": "j / m / a",
                "datetime": "d / m / Y H: i: s",
                "time": "H:i:s"
            },
            "editor": {
                "clearhtml": "Nettoyer HTML",
                "expand": "Développez l'éditeur",
                "reduce": "Réduire l'éditeur",
                "unlink": "<em>Unlink</em>",
                "unlinkmessage": "<em>Transform the selected hyperlink into text.</em>"
            },
            "grid": {
                "disablemultiselection": "Désactiver la sélection multiple",
                "enamblemultiselection": "Activer la sélection multiple",
                "export": "Exporter des données",
                "filterremoved": "Le filtre actuel a été supprimé",
                "import": "Importer des données",
                "itemnotfound": "Objet non trouvé",
                "list": "liste",
                "opencontextualmenu": "Ouvrir le menu contextuel",
                "print": "Imprimer",
                "printcsv": "Imprimer en format CSV",
                "printodt": "Imprimer en ODT",
                "printpdf": "Imprimer en PDF",
                "row": "Article",
                "rows": "Articles",
                "subtype": "Sous-type"
            },
            "tabs": {
                "activity": "Activité",
                "attachment": "pièces jointes",
                "attachments": "Pièces jointes",
                "card": "Fiche",
                "clonerelationmode": "Mode de clonage de relation",
                "details": "Détails",
                "emails": "Emails",
                "history": "Historique",
                "notes": "Notes",
                "relations": "Relations",
                "schedules": "Les dates limites"
            }
        },
        "dashboards": {
            "tools": {
                "gridhide": "Masquer le tableau de données",
                "gridshow": "Afficher le tableau de données",
                "parametershide": "Masquer les paramètres",
                "parametersshow": "Afficher les paramètres",
                "reload": "Recharger"
            }
        },
        "emails": {
            "addattachmentsfromdocumentarchive": "Télécharger à partir des archives de documents",
            "alredyexistfile": "Existe déjà un fichier avec ce nom",
            "archivingdate": "Date d'archivage",
            "attachfile": "Joindre un fichier",
            "bcc": "Cci",
            "cc": "Cc",
            "composeemail": "Nouveau message",
            "composefromtemplate": "Créer à partir d'un modèle",
            "delay": "Temps d'attente",
            "delays": {
                "day1": "Dans 1 jour",
                "days2": "Dans 2 jours",
                "days4": "Dans 4 jours",
                "hour1": "1 heure",
                "hours2": "2 heures",
                "hours4": "4 heures",
                "month1": "Dans 1 mois",
                "negativeday1": "1 jour avant",
                "negativedays2": "2 jours avant",
                "negativedays4": "4 jours avant",
                "negativehour1": "1 heure plus tôt",
                "negativehours2": "2 heures avant",
                "negativehours4": "4 heures avant",
                "negativemonth1": "1 mois avant",
                "negativeweek1": "1 semaine avant",
                "negativeweeks2": "2 semaines avant",
                "none": "Aucun",
                "week1": "Dans 1 semaine",
                "weeks2": "Dans 2 semaines"
            },
            "dmspaneltitle": "Choisir des pièces jointes depuis la base de données",
            "edit": "Modifier",
            "from": "De",
            "gridrefresh": "Rafraîchir le tableau des valeurs",
            "keepsynchronization": "Rester synchronisé",
            "message": "Message",
            "regenerateallemails": "Regénérer tous les emails",
            "regenerateemail": "Regénérer les emails",
            "remove": "Supprimer",
            "remove_confirmation": "Êtes-vous sûr de vouloir supprimer cet email?",
            "reply": "Répondre",
            "replyprefix": "Sur {0}, {1} a écrit:",
            "selectaclass": "Sélectionnez une classe",
            "sendemail": "Envoyer un message électronique",
            "statuses": {
                "draft": "Brouillon",
                "error": "Erreur",
                "outgoing": "Sortant",
                "received": "Reçu",
                "sent": "Envoyé"
            },
            "subject": "Sujet",
            "to": "À",
            "view": "Vue"
        },
        "errors": {
            "autherror": "Mauvais utilisateur ou mot de passe",
            "classnotfound": "Classe {0} non touvée",
            "fieldrequired": "Ce champ est obligatoire",
            "invalidfilter": "Filtre non valide",
            "notfound": "Non trouvé"
        },
        "filters": {
            "actions": "actes",
            "addfilter": "Ajouter un filtre",
            "any": "Tous",
            "attachments": "<em>Attachments</em>",
            "attachmentssearchtext": "<em>Attachments search text</em>",
            "attribute": "Choisir un attribut",
            "attributes": "Attributs",
            "clearfilter": "Supprimer les filtres",
            "clone": "Copier",
            "copyof": "Copie de",
            "currentgroup": "Groupe actuel",
            "currentuser": "Utilisateur actuel",
            "defaultset": "Définir par défaut",
            "defaultunset": "Supprimer de la valeur par défaut",
            "description": "Description",
            "domain": "Lien",
            "filterdata": "Filtrer les données",
            "fromfilter": "<em>From filter</em>",
            "fromselection": "À partir de la sélection",
            "group": "groupe",
            "ignore": "Ignorer",
            "migrate": "Migrer",
            "name": "Nom",
            "newfilter": "Nouveau filtre",
            "noone": "Personne",
            "operator": "Opérateur",
            "operators": {
                "beginswith": "Commence par",
                "between": "Entre",
                "contained": "Contenu",
                "containedorequal": "Contenu ou égal",
                "contains": "Contient",
                "containsorequal": "Contient ou est égal",
                "descriptionbegin": "<em>Description begins with</em>",
                "descriptioncontains": "La description contient",
                "descriptionends": "<em>Description ends with</em>",
                "descriptionnotbegin": "<em>Description does not begins with</em>",
                "descriptionnotcontain": "<em>Description does not contain</em>",
                "descriptionnotends": "<em>Description does not ends with</em>",
                "different": "Différent",
                "doesnotbeginwith": "Ne commence pas par",
                "doesnotcontain": "Ne contient pas",
                "doesnotendwith": "Ne se termine pas par",
                "endswith": "Se termine par",
                "equals": "Égale",
                "greaterthan": "Majeur",
                "isnotnull": "N'est pas nul",
                "isnull": "Est nul",
                "lessthan": "Mineur"
            },
            "relations": "Relations",
            "type": "Type du serveur de fichiers",
            "typeinput": "Paramètre d'entrée",
            "user": "utilisateur",
            "value": "Valeur"
        },
        "gis": {
            "card": "Fiche",
            "cardsMenu": "Menu de cartes",
            "code": "Code",
            "description": "Description",
            "extension": {
                "errorCall": "Erreur",
                "noResults": "Aucun résultat"
            },
            "externalServices": "Services externes",
            "geographicalAttributes": "Attributs géographiques",
            "geoserverLayers": "Niveaux du Geoserver",
            "layers": "Niveaux",
            "list": "Liste",
            "longpresstitle": "Éléments géographiques de la zone",
            "map": "Carte",
            "mapServices": "Services de carte",
            "position": "Position",
            "root": "Racine",
            "tree": "Arbre de navigation",
            "type": "Type",
            "view": "Vue",
            "zoom": "Zoom"
        },
        "history": {
            "activityname": "Nom d'activité",
            "activityperformer": "Performance d'activité",
            "begindate": "Date de début",
            "enddate": "Date de fin",
            "processstatus": "Statut",
            "user": "Utilisateur"
        },
        "importexport": {
            "database": {
                "uri": "Base de données URI",
                "user": "Utilisateur de la base de données"
            },
            "downloadreport": "Télécharger le rapport",
            "emailfailure": "Une erreur est survenue lors de l'envoi du courrier électronique!",
            "emailmessage": "Vous trouverez ci-joint le rapport d'importation du fichier \"{0}\" le {1}",
            "emailsubject": "Rapport de données d'importation",
            "emailsuccess": "L'email a été envoyé avec succès!",
            "export": "Exportation",
            "exportalldata": "Toutes les données",
            "exportfiltereddata": "Seules les données correspondant au filtre de grille",
            "gis": {
                "shapeimportdisabled": "L'importation de forme n'est pas activée pour ce modèle",
                "shapeimportenabled": "Importer des configurations de forme"
            },
            "ifc": {
                "card": "<em>Card</em>",
                "project": "Projet",
                "sourcetype": "Importer de"
            },
            "import": "Importation",
            "importresponse": "Réponse d'importation",
            "response": {
                "created": "Articles créés",
                "deleted": "Eléments supprimés",
                "errors": "Erreurs",
                "linenumber": "Numéro de ligne",
                "message": "Message",
                "modified": "Articles modifiés",
                "processed": "Lignes traitées",
                "recordnumber": "Numéro d'enregistrement",
                "unmodified": "Articles non modifiés"
            },
            "sendreport": "Envoyer un rapport",
            "template": "Modèle",
            "templatedefinition": "Modèle de définition"
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
                "login": "Se connecter",
                "logout": "Changer d'utilisateur"
            },
            "fields": {
                "group": "Groupe",
                "language": "Langue",
                "password": "Mot de passe",
                "tenants": "Les locataires",
                "username": "Nom d'utilisateur"
            },
            "loggedin": "Connecté",
            "title": "Se connecter",
            "welcome": "Bienvenue à nouveau {0}."
        },
        "main": {
            "administrationmodule": "Module d'administration",
            "baseconfiguration": "Configuration de base",
            "cardlock": {
                "lockedmessage": "Vous ne pouvez pas modifier cette carte car {0} la modifie.",
                "someone": "Quelqu'un"
            },
            "changegroup": "Changer de groupe",
            "changetenant": "Changer de {0}",
            "confirmchangegroup": "Êtes-vous sûr de vouloir changer de groupe?",
            "confirmchangetenants": "Êtes-vous sûr de vouloir changer de locataire actif?",
            "confirmdisabletenant": "Êtes-vous sûr de vouloir désactiver l'indicateur \"Ignorer les locataires\"?",
            "confirmenabletenant": "Êtes-vous sûr de vouloir activer le drapeau \"Ignorer les locataires\"?",
            "ignoretenants": "Ignorer de {0}",
            "info": "Info",
            "logo": {
                "cmdbuild": "Logo CMDBuild",
                "cmdbuildready2use": "CMDBuild READY2USE logo",
                "companylogo": "Logo d'entreprise",
                "openmaint": "logo openMAINT"
            },
            "logout": "Déconnexion",
            "managementmodule": "Module de gestion des données",
            "multigroup": "Multi-groupes",
            "multitenant": "Multi-{0}",
            "navigation": "Navigation",
            "pagenotfound": "Page non trouvée",
            "password": {
                "change": "Changer le mot de passe",
                "confirm": "Confirmer le mot de passe",
                "email": "Adresse e-mail",
                "err_confirm": "Les mots de passe ne correspondent pas.",
                "err_diffprevious": "Le mot de passe ne peut pas être le même que le précédent.",
                "err_diffusername": "Le mot de passe ne peut pas être le même que le nom d'utilisateur '.",
                "err_length": "Votre mot de passe doit comporter au moins {0} caractères. </em>",
                "err_reqdigit": "Le mot de passe doit contenir au moins un chiffre.",
                "err_reqlowercase": "Le mot de passe doit contenir au moins un caractère minuscule.",
                "err_requppercase": "Le mot de passe doit contenir au moins un caractère majuscule.",
                "expired": "Votre mot de passe a expiré. Changez-le maintenant.",
                "forgotten": "J'ai oublié mon mot de passe",
                "new": "Nouveau mot de passe",
                "old": "Ancien mot de passe",
                "recoverysuccess": "Nous vous avons envoyé un e-mail avec des instructions pour réinitialiser votre mot de passe.",
                "reset": "Réinitialiser le mot de passe",
                "saved": "Mot de passe enregistré correctement!"
            },
            "pleasecorrecterrors": "Veuillez corriger les erreurs indiquées!",
            "preferences": {
                "comma": "Virgule",
                "decimalserror": "Le champ décimal doit être présent",
                "decimalstousandserror": "Les  séparateurs décimales et des milliers doivent être différents",
                "default": "Défaut",
                "defaultvalue": "Valeur par défaut",
                "firstdayofweek": "<em>First day of week</em>",
                "gridpreferencesclear": "Supprimer les préférences de grille",
                "gridpreferencescleared": "Préférences de grille supprimées!",
                "gridpreferencessave": "Enregistrer les préférences de grille",
                "gridpreferencessaved": "Préférences de grille enregistrées!",
                "gridpreferencesupdate": "Mettre à jour les préférences de grille",
                "labelcsvseparator": "Séparateur CSV",
                "labeldateformat": "Format de date",
                "labeldecimalsseparator": "Séparateur décimal",
                "labellanguage": "langue",
                "labelthousandsseparator": "Séparateur de milliers",
                "labeltimeformat": "Format de l'heure",
                "msoffice": "Microsoft Office",
                "period": "Période",
                "preferredfilecharset": "Codage CSV",
                "preferredofficesuite": "Suite Office préférée",
                "space": "Espace",
                "thousandserror": "Le champ milliers doivent être présents",
                "timezone": "Fuseau horaire",
                "twelvehourformat": "Format de 12 heures",
                "twentyfourhourformat": "Format 24 heures"
            },
            "searchinallitems": "Rechercher dans tous les articles",
            "treenavcontenttitle": "{0} sur {1}",
            "userpreferences": "Préférences"
        },
        "menu": {
            "allitems": "Tous les articles",
            "classes": "Classe",
            "custompages": "Pages personnalisées",
            "dashboards": "Tableaux de bord",
            "processes": "Processus",
            "reports": "Rapports",
            "views": "Vues"
        },
        "notes": {
            "edit": "Modifier la note"
        },
        "notifier": {
            "attention": "Attention",
            "error": "Erreur",
            "genericerror": "Erreur générique",
            "genericinfo": "Informations génériques",
            "genericwarning": "Avertissement générique",
            "info": "Info",
            "success": "Succès",
            "warning": "Attention"
        },
        "patches": {
            "apply": "Appliquer des patchs",
            "category": "Catégorie",
            "description": "Description",
            "name": "Prénom",
            "patches": "Patchs"
        },
        "processes": {
            "abortconfirmation": "Êtes-vous sûr de vouloir abandonner le processus ?",
            "abortprocess": "Abandonner le processus",
            "action": {
                "advance": "Avancer",
                "label": "Action"
            },
            "activeprocesses": "Processus actifs",
            "allstatuses": "Tous",
            "editactivity": "Modifier l'action",
            "openactivity": "Activité ouverte",
            "startworkflow": "Démarrer",
            "workflow": "Processus"
        },
        "relationGraph": {
            "activity": "Activité",
            "allLabelsOnGraph": "Toutes les étiquettes",
            "card": "Fiche",
            "cardList": "Liste des fiches",
            "cardRelations": "Relation des fiches",
            "choosenaviagationtree": "Choisir l'arbre de navigation",
            "class": "Classe",
            "classList": "Liste de classe",
            "compoundnode": "Nœud composé",
            "disable": "Cacher",
            "edges": "<em>Edges</em>",
            "enable": "Montrer",
            "labelsOnGraph": "tolltip",
            "level": "Niveau",
            "nodes": "<em>Nodes</em>",
            "openRelationGraph": "Ouvrir le graphe des relations",
            "qt": "Qt",
            "refresh": "Refresh",
            "relation": "relation",
            "relationGraph": "Graphe des relations",
            "reopengraph": "Rouvrir le graphe de ce noeud"
        },
        "relations": {
            "adddetail": "Ajouter un détail",
            "addrelations": "Ajouter des relations",
            "attributes": "Attributs",
            "code": "Code",
            "deletedetail": "Supprimer le détail",
            "deleterelation": "Supprimer la relation",
            "deleterelationconfirm": "Êtes-vous sûr de vouloir supprimer cette relation?",
            "description": "Description",
            "editcard": "Modifier la fiche",
            "editdetail": "Modifier le détail",
            "editrelation": "Modifier la relation",
            "extendeddata": "Données étendues",
            "mditems": "Objets",
            "missingattributes": "Attributs requis manquants",
            "opencard": "Ouvrir la fiche associée",
            "opendetail": "Voir le détail",
            "type": "Type du serveur de fichiers"
        },
        "reports": {
            "csv": "CSV",
            "download": "Télécharger",
            "format": "Format",
            "odt": "ODT",
            "pdf": "PDF",
            "print": "Imprimer",
            "reload": "Recharger",
            "rtf": "RTF"
        },
        "system": {
            "data": {
                "lookup": {
                    "CalendarCategory": {
                        "default": {
                            "description": "Défaut"
                        }
                    },
                    "CalendarFrequency": {
                        "daily": {
                            "description": "Journellement"
                        },
                        "monthly": {
                            "description": "mensuel"
                        },
                        "once": {
                            "description": "Une fois"
                        },
                        "weekly": {
                            "description": "hebdomadaire"
                        },
                        "yearly": {
                            "description": "annuel"
                        }
                    },
                    "CalendarPriority": {
                        "default": {
                            "description": "Défaut"
                        }
                    }
                }
            }
        },
        "thematism": {
            "addThematism": "Ajouter un thématisme",
            "analysisType": "Type d'analyse",
            "attribute": "Attribut",
            "calculateRules": "Générer des règles de style",
            "clearThematism": "Effacer le thématisme",
            "color": "Couleur",
            "defineLegend": "Définition de la légende",
            "defineThematism": "Thématisme",
            "function": "Fonction",
            "generate": "Produire",
            "geoAttribute": "geoAttribute",
            "graduated": "Diplômé",
            "highlightSelected": "Mettre en surbrillance l'élément sélectionné",
            "intervals": "Intervalles",
            "legend": "Légende",
            "name": "prénom",
            "newThematism": "Nouveau thématisme",
            "punctual": "Ponctuel",
            "quantity": "Quantité",
            "segments": "segments",
            "source": "Source",
            "table": "Table",
            "thematism": "Thématismes",
            "value": "Valeur"
        },
        "widgets": {
            "customform": {
                "addrow": "Ajouter une ligne",
                "clonerow": "Cloner la ligne",
                "datanotvalid": "Données invalides",
                "deleterow": "Supprimer la ligne",
                "editrow": "Modifier la ligne",
                "export": "Exporter",
                "import": "Importer",
                "importexport": {
                    "expattributes": "Données à exporter",
                    "file": "Fichier",
                    "filename": "Nom de fichier",
                    "format": "Format",
                    "importmode": "Mode d'importation",
                    "keyattributes": "Attributs clés",
                    "missingkeyattr": "Choisissez au moins un attribut clé",
                    "modeadd": "Ajouter",
                    "modemerge": "Rafraîchir",
                    "modereplace": "Remplacer",
                    "separator": "Séparateur"
                },
                "refresh": "Actualiser aux valeurs par défaut"
            },
            "linkcards": {
                "checkedonly": "Seulement sélectionné",
                "editcard": "Modifier la carte",
                "opencard": "Carte ouverte",
                "refreshselection": "Appliquer la sélection par défaut",
                "togglefilterdisabled": "Désactiver le filtre de la table",
                "togglefilterenabled": "Activer le filtre de table"
            },
            "required": "Ce widget est obligatoire"
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