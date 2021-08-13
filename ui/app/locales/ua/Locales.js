(function() {
    Ext.define('CMDBuildUI.locales.ua.Locales', {
        "requires": ["CMDBuildUI.locales.ua.LocalesAdministration"],
        "override": "CMDBuildUI.locales.Locales",
        "singleton": true,
        "localization": "ua",
        "administration": CMDBuildUI.locales.ua.LocalesAdministration.administration,
        "attachments": {
            "add": "Додати вкладення",
            "attachmenthistory": "Історія вкладень",
            "author": "Автор",
            "browse": "<em>Browse &hellip;</em>",
            "category": "Категорія",
            "code": "<em>Code</em>",
            "creationdate": "Дата створення",
            "deleteattachment": "Видалити вкладення",
            "deleteattachment_confirmation": "Ви впевнені, що хочете видалити це вкладення?",
            "description": "Опис",
            "download": "Завантажити",
            "dropfiles": "<em>Drop files here</em>",
            "editattachment": "Змінити вкладення",
            "file": "Файл",
            "filealreadyinlist": "<em>The file {0} is already in list.</em>",
            "filename": "Ім'я файла",
            "fileview": "<em>View attachment</em>",
            "invalidfiles": "<em>Remove invalid files</em>",
            "majorversion": "Основна версія",
            "modificationdate": "Дата зміни",
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
            "uploadfile": "Завантажити файл...",
            "version": "Версія",
            "viewhistory": "Перегляд історії вкладень",
            "warningmessages": {
                "atleast": "<em>Warning: has been loaded {0} attachments of type \"{1}\". This category expects at least {2} attachments </em>",
                "exactlynumber": "<em>Warning: has been loaded {0} attachments of type \"{1}\". This category expects {2} attachments</em>",
                "maxnumber": "<em>Warning: has been loaded {0} attachment of type \"{1}\". This category expects at most {2}  attachments</em>"
            },
            "wrongfileextension": "<em>{0} file extension is not allowed</em>"
        },
        "bim": {
            "bimViewer": "Переглядач Bim",
            "card": {
                "label": "Картка"
            },
            "layers": {
                "label": "Шари",
                "menu": {
                    "hideAll": "Приховати все",
                    "showAll": "Показати все"
                },
                "name": "Назва",
                "qt": "Qt",
                "visibility": "Видимість"
            },
            "menu": {
                "camera": "Камера",
                "frontView": "Вид спереду",
                "mod": "елементи керування перегляду",
                "orthographic": "<em>Orthographic Camera</em>",
                "pan": "панорамування",
                "perspective": "<em>Perspective Camera</em>",
                "resetView": "Відновити вид",
                "rotate": "повернути",
                "sideView": "Вид збоку",
                "topView": "Вид зверху"
            },
            "showBimCard": "Відкрити 3D-переглядач",
            "tree": {
                "arrowTooltip": "Вибрати елемент",
                "columnLabel": "Дерево",
                "label": "Дерево",
                "open_card": "Відкрити пов'язану картку",
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
                "addcard": "Додати картку",
                "clone": "Клонувати",
                "clonewithrelations": "Клонувати картку та зв'язки",
                "deletebeaware": "<em>Be aware that:</em>",
                "deleteblocked": "<em>It is not possible to proceed with the deletion because there are relations with {0}.</em>",
                "deletecard": "Видалити картку",
                "deleteconfirmation": "Ви впевнені, що хочете видалити цю карту?",
                "deleterelatedcards": "<em>also {0} related cards will be deleted</em>",
                "deleterelations": "<em>relations with {0} cards will be deleted</em>",
                "label": "Картки",
                "modifycard": "Змінити картку",
                "opencard": "Відкрити картку",
                "print": "Друкувати картку"
            },
            "simple": "Простий",
            "standard": "Стандартний"
        },
        "common": {
            "actions": {
                "add": "Додати",
                "apply": "Застосувати",
                "cancel": "Скасувати",
                "close": "Закрити",
                "delete": "Видалити",
                "edit": "Редагувати",
                "execute": "Виконати",
                "help": "<em>Help</em>",
                "load": "<em>Load</em>",
                "open": "<em>Open</em>",
                "refresh": "Оновити дані",
                "remove": "Видалити",
                "save": "Зберегти",
                "saveandapply": "Зберегти і застосувати",
                "saveandclose": "Зберегти та закрити",
                "search": "Пошук",
                "searchtext": "Пошук…"
            },
            "attributes": {
                "nogroup": "Вихідні дані"
            },
            "dates": {
                "date": "д/м/р",
                "datetime": "д/м/р г:х:с",
                "time": "г:х:с"
            },
            "editor": {
                "clearhtml": "Очистити HTML",
                "expand": "<em>Expand editor</em>",
                "reduce": "<em>Reduce editor</em>",
                "unlink": "<em>Unlink</em>",
                "unlinkmessage": "<em>Transform the selected hyperlink into text.</em>"
            },
            "grid": {
                "disablemultiselection": "Вимкнути множинний вибір",
                "enamblemultiselection": "Увімкнути множинний вибір",
                "export": "<em>Export data</em>",
                "filterremoved": "Поточний фільтр був видалений",
                "import": "<em>Import data</em>",
                "itemnotfound": "Елемент не знайдено",
                "list": "Список",
                "opencontextualmenu": "Відкрити контекстне меню",
                "print": "Друк",
                "printcsv": "Друкувати як CSV",
                "printodt": "Друкувати як ODT",
                "printpdf": "Друкувати як PDF",
                "row": "Елемент",
                "rows": "Елементи",
                "subtype": "Підтип"
            },
            "tabs": {
                "activity": "Активність",
                "attachment": "<em>Attachment</em>",
                "attachments": "Вкладення",
                "card": "Картка",
                "clonerelationmode": "<em>Clone Relations Mode</em>",
                "details": "Подробиці",
                "emails": "Електронні листи",
                "history": "Історія",
                "notes": "Замітки",
                "relations": "Зв'язки",
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
            "archivingdate": "Дата архівації",
            "attachfile": "Прикріпити файл",
            "bcc": "Прихована копія",
            "cc": "Копія",
            "composeemail": "Створити електронний лист",
            "composefromtemplate": "Створити з шаблону",
            "delay": "Затримка",
            "delays": {
                "day1": "За 1 день",
                "days2": "За 2 дні",
                "days4": "За 4 дні",
                "hour1": "1 година",
                "hours2": "2 години",
                "hours4": "4 години",
                "month1": "За 1 місяць",
                "negativeday1": "<em>1 day before</em>",
                "negativedays2": "<em>2 days before</em>",
                "negativedays4": "<em>4 days before</em>",
                "negativehour1": "<em>1 hour before</em>",
                "negativehours2": "<em>2 hours before</em>",
                "negativehours4": "<em>4 hours before</em>",
                "negativemonth1": "<em>1 month before</em>",
                "negativeweek1": "<em>1 week before</em>",
                "negativeweeks2": "<em>2 weeks before</em>",
                "none": "Ніяка",
                "week1": "За 1 тиждень",
                "weeks2": "За 2 тижні"
            },
            "dmspaneltitle": "Обрати вкладення з бази даних",
            "edit": "Редагувати",
            "from": "Від",
            "gridrefresh": "Оновити таблицю",
            "keepsynchronization": "Постійно синхронізувати",
            "message": "Повідомлення",
            "regenerateallemails": "Відновити всі електронні адреси",
            "regenerateemail": "Відновити електронну адресу",
            "remove": "Видалити",
            "remove_confirmation": "Точно видалити цей електронний лист?",
            "reply": "Відповісти",
            "replyprefix": "{0} {1} писав:",
            "selectaclass": "<em>Select a class</em>",
            "sendemail": "Надіслати електронного листа",
            "statuses": {
                "draft": "Чернетки",
                "error": "<em>Error</em>",
                "outgoing": "Вихідні",
                "received": "Отримані",
                "sent": "Відправлені"
            },
            "subject": "Тема",
            "to": "До",
            "view": "Переглянути"
        },
        "errors": {
            "autherror": "Невірне ім'я користувача чи пароль",
            "classnotfound": "Клас {0} не знайдено",
            "fieldrequired": "<em>This field is required</em>",
            "invalidfilter": "<em>Invalid filter</em>",
            "notfound": "Елемент не знайдено"
        },
        "filters": {
            "actions": "Дії",
            "addfilter": "Додати фільтр",
            "any": "Будь-який",
            "attachments": "<em>Attachments</em>",
            "attachmentssearchtext": "<em>Attachments search text</em>",
            "attribute": "Вибрати атрибут",
            "attributes": "Атрибути",
            "clearfilter": "Очистити фільтр",
            "clone": "Клонувати",
            "copyof": "Копія з",
            "currentgroup": "<em>Current group</em>",
            "currentuser": "<em>Current user</em>",
            "defaultset": "<em>Set as default</em>",
            "defaultunset": "<em>Unset from default</em>",
            "description": "Опис",
            "domain": "Домен",
            "filterdata": "Фільтрувати дані",
            "fromfilter": "<em>From filter</em>",
            "fromselection": "Із виділенного",
            "group": "<em>Group</em>",
            "ignore": "Ігнорувати",
            "migrate": "Мігрує",
            "name": "Ім'я",
            "newfilter": "Новый фильтр",
            "noone": "Жодного",
            "operator": "Оператор",
            "operators": {
                "beginswith": "Починається з",
                "between": "Між",
                "contained": "Міститься",
                "containedorequal": "Міститься або рівний",
                "contains": "Містить",
                "containsorequal": "Містить або рівні",
                "descriptionbegin": "<em>Description begins with</em>",
                "descriptioncontains": "<em>Description contains</em>",
                "descriptionends": "<em>Description ends with</em>",
                "descriptionnotbegin": "<em>Description does not begins with</em>",
                "descriptionnotcontain": "<em>Description does not contain</em>",
                "descriptionnotends": "<em>Description does not ends with</em>",
                "different": "Різний",
                "doesnotbeginwith": "Не починається з",
                "doesnotcontain": "Не містить",
                "doesnotendwith": "Не закінчується на",
                "endswith": "Закінчується на",
                "equals": "Рівний",
                "greaterthan": "Більше ніж",
                "isnotnull": "Не пусте",
                "isnull": "Пусте",
                "lessthan": "Менше ніж"
            },
            "relations": "Зв'язки",
            "type": "Тип",
            "typeinput": "Вхідний параметр",
            "user": "<em>User</em>",
            "value": "Значення"
        },
        "gis": {
            "card": "Картка",
            "cardsMenu": "<em>Cards Menu</em>",
            "code": "<em>Code</em>",
            "description": "<em>Description</em>",
            "extension": {
                "errorCall": "<em>Error</em>",
                "noResults": "<em>No Results</em>"
            },
            "externalServices": "Зовнішні сервіси",
            "geographicalAttributes": "Географічні атрибути",
            "geoserverLayers": "Географічні шари",
            "layers": "Шари",
            "list": "Список",
            "longpresstitle": "<em>Geoelements in area</em>",
            "map": "Карта",
            "mapServices": "Картографічні сервіси",
            "position": "Позиція",
            "root": "Корінь",
            "tree": "Дерево",
            "type": "<em>Type</em>",
            "view": "Вид",
            "zoom": "Масштаб"
        },
        "history": {
            "activityname": "Назва активності",
            "activityperformer": "Виконавець активності",
            "begindate": "Дата початку",
            "enddate": "Дата закінчення",
            "processstatus": "Статус",
            "user": "Користувач"
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
                "login": "Увійти",
                "logout": "Змінити користувача"
            },
            "fields": {
                "group": "Група",
                "language": "Мова",
                "password": "Пароль",
                "tenants": "Орендарі",
                "username": "Ім'я користувача"
            },
            "loggedin": "Авторизовано",
            "title": "Вхід",
            "welcome": "З поверненням, {0}."
        },
        "main": {
            "administrationmodule": "Модуль адміністрування",
            "baseconfiguration": "<em>Base configuration</em>",
            "cardlock": {
                "lockedmessage": "Ви не можете редагувати цю картку, оскільки {0} її редагує.",
                "someone": "хтось"
            },
            "changegroup": "Змінити групу",
            "changetenant": "<em>Change {0}</em>",
            "confirmchangegroup": "Ви точно хочете змінити групу?",
            "confirmchangetenants": "Ви точно хочете змінити активних орендарів?",
            "confirmdisabletenant": "Ви точно хочете вимкнути прапорець \"Ігнорувати орендарів\"?",
            "confirmenabletenant": "Ви точно хочете ввімкнути прапорець \"Ігнорувати орендарів\"?",
            "ignoretenants": "<em>Ignore {0}</em>",
            "info": "Інформація",
            "logo": {
                "cmdbuild": "Логотип CMDBuild",
                "cmdbuildready2use": "Логотип CMDBuild READY2USE",
                "companylogo": "<em>Company logo</em>",
                "openmaint": "Логотип openMAINT"
            },
            "logout": "Вийти",
            "managementmodule": "Модуль керування даними",
            "multigroup": "Множинна група",
            "multitenant": "<em>Multi {0}</em>",
            "navigation": "Навігація",
            "pagenotfound": "<em>Page not found</em>",
            "password": {
                "change": "Змінити пароль",
                "confirm": "Підтвердити пароль",
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
                "new": "Новий пароль",
                "old": "Старий пароль",
                "recoverysuccess": "<em>We have sent you an email with instruction to recover your password.</em>",
                "reset": "<em>Reset password</em>",
                "saved": "<em>Password correctly saved!</em>"
            },
            "pleasecorrecterrors": "<em>Please correct indicated errors!</em>",
            "preferences": {
                "comma": "Кома",
                "decimalserror": "Поле десяткових знаків має бути присутнім",
                "decimalstousandserror": "Роздільники груп розрядів і десяткового дробу мають відрізнятися",
                "default": "<em>Default</em>",
                "defaultvalue": "Значення за замовчанням",
                "firstdayofweek": "<em>First day of week</em>",
                "gridpreferencesclear": "<em>Clear grid preferences</em>",
                "gridpreferencescleared": "<em>Grid preferences cleared!</em>",
                "gridpreferencessave": "<em>Save grid preferences</em>",
                "gridpreferencessaved": "<em>Grid preferences saved!</em>",
                "gridpreferencesupdate": "<em>Update grid preferences</em>",
                "labelcsvseparator": "<em>CSV separator</em>",
                "labeldateformat": "Формат дати",
                "labeldecimalsseparator": "Роздільник десяткового дробу",
                "labellanguage": "Мова",
                "labelthousandsseparator": "Роздільник груп розрядів",
                "labeltimeformat": "Формат часу",
                "msoffice": "<em>Microsoft Office</em>",
                "period": "Крапка",
                "preferredfilecharset": "<em>CSV encoding</em>",
                "preferredofficesuite": "<em>Preferred Office suite</em>",
                "space": "Пробіл",
                "thousandserror": "Поле тисячних знаків має бути присутнім",
                "timezone": "<em>Timezone</em>",
                "twelvehourformat": "12-годинний формат",
                "twentyfourhourformat": "24-годинний формат"
            },
            "searchinallitems": "Пошук в усіх елементах",
            "treenavcontenttitle": "<em>{0} of {1}</em>",
            "userpreferences": "Налаштування"
        },
        "menu": {
            "allitems": "Всі елементи",
            "classes": "Класи",
            "custompages": "Спеціальні сторінки",
            "dashboards": "Інформаційні панелі",
            "processes": "Процеси",
            "reports": "Звіти",
            "views": "Вигляди"
        },
        "notes": {
            "edit": "Змінити замітку"
        },
        "notifier": {
            "attention": "Увага",
            "error": "Помилка",
            "genericerror": "Загальна помилка",
            "genericinfo": "Загальне повідомлення",
            "genericwarning": "Загальне попередження",
            "info": "Повідомлення",
            "success": "Успіх",
            "warning": "Попередження"
        },
        "patches": {
            "apply": "<em>Apply patches</em>",
            "category": "<em>Category</em>",
            "description": "<em>Description</em>",
            "name": "<em>Name</em>",
            "patches": "<em>Patches</em>"
        },
        "processes": {
            "abortconfirmation": "Ви впевнені, що хочете скасувати цей процес?",
            "abortprocess": "Скасувати процес",
            "action": {
                "advance": "Просування",
                "label": "Дія"
            },
            "activeprocesses": "Активні процеси",
            "allstatuses": "Всі",
            "editactivity": "Змінити активність",
            "openactivity": "Відкрити активність",
            "startworkflow": "Запустити",
            "workflow": "Робочий процес"
        },
        "relationGraph": {
            "activity": "<em>activity</em>",
            "allLabelsOnGraph": "<em>all labels on graph</em>",
            "card": "Картка",
            "cardList": "Список карток",
            "cardRelations": "Відношення картки",
            "choosenaviagationtree": "Обрати навігаційне дерево",
            "class": "Клас",
            "classList": "Список класів",
            "compoundnode": "<em>Compound Node</em>",
            "disable": "<em>Disable</em>",
            "edges": "<em>Edges</em>",
            "enable": "<em>Enable</em>",
            "labelsOnGraph": "<em>tooltip on graph</em>",
            "level": "Рівень",
            "nodes": "<em>Nodes</em>",
            "openRelationGraph": "Відкрити граф відношень",
            "qt": "Qt",
            "refresh": "Оновити",
            "relation": "відношення",
            "relationGraph": "Граф відношень",
            "reopengraph": "Перевідкрити графік із цього вузла"
        },
        "relations": {
            "adddetail": "Додати детальне",
            "addrelations": "Додати відношення",
            "attributes": "Атрибути",
            "code": "Код",
            "deletedetail": "Видалити детальне",
            "deleterelation": "Видалити відношення",
            "deleterelationconfirm": "<em>Are you sure you want to delete this relation?</em>",
            "description": "Опис",
            "editcard": "Редагувати картку",
            "editdetail": "Редагувати детальне",
            "editrelation": "Редагувати відношення",
            "extendeddata": "<em>Extended data</em>",
            "mditems": "елементи",
            "missingattributes": "<em>Missing mandatory attributes</em>",
            "opencard": "Відкрити пов'язану картку",
            "opendetail": "Показати детальне",
            "type": "Тип"
        },
        "reports": {
            "csv": "CSV",
            "download": "Завантажити",
            "format": "Формат",
            "odt": "ODT",
            "pdf": "PDF",
            "print": "Друк",
            "reload": "Перезавантажити",
            "rtf": "RTF"
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
                "addrow": "Додати рядок",
                "clonerow": "Клонувати рядок",
                "datanotvalid": "<em>Data not valid</em>",
                "deleterow": "Видалити рядок",
                "editrow": "Редагувати рядок",
                "export": "Експортувати",
                "import": "Імпортувати",
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
                "refresh": "Оновити до налаштувань за замовчанням"
            },
            "linkcards": {
                "checkedonly": "<em>Checked only</em>",
                "editcard": "Змінити картку",
                "opencard": "Відкрити картку",
                "refreshselection": "Застосувати вибір за замовчуванням",
                "togglefilterdisabled": "Вимкнути фільтр в таблиці",
                "togglefilterenabled": "Увімкнути фільтр в таблиці"
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