(function() {
    Ext.define('CMDBuildUI.locales.ru.Locales', {
        "requires": ["CMDBuildUI.locales.ru.LocalesAdministration"],
        "override": "CMDBuildUI.locales.Locales",
        "singleton": true,
        "localization": "ru",
        "administration": CMDBuildUI.locales.ru.LocalesAdministration.administration,
        "attachments": {
            "add": "Вложить файл",
            "attachmenthistory": "История Привязанности",
            "author": "Автор",
            "browse": "Просмотр и ад;",
            "category": "Категория",
            "code": "Код",
            "creationdate": "Дата создания",
            "deleteattachment": "Удаление вложения",
            "deleteattachment_confirmation": "Вы уверены, что хотите удалить это вложение?",
            "description": "Описание",
            "download": "Скачать",
            "dropfiles": "Удаление файлов здесь",
            "editattachment": "Изменить вложение",
            "file": "Файл",
            "filealreadyinlist": "Файл {0} уже в списке.",
            "filename": "Имя файла",
            "fileview": "<em>View attachment</em>",
            "invalidfiles": "Удаление недействительных файлов",
            "majorversion": "Основная версия",
            "modificationdate": "Дата изменения",
            "new": "Новое вложение",
            "nocategory": "Без категории",
            "preview": "Предварительный просмотр",
            "removefile": "Удалить файл",
            "statuses": {
                "empty": "Пустой файл",
                "error": "Ошибка",
                "extensionNotAllowed": "Расширение файла не допускается",
                "loaded": "Загружен",
                "ready": "Готов"
            },
            "successupload": "{0} загруженных вложений.",
            "uploadfile": "Загрузить файл…",
            "version": "Версия",
            "viewhistory": "Просмотр истории вложений",
            "warningmessages": {
                "atleast": "Предупреждение: был загружен {0} вложения типа \"{1}\". Эта категория ожидает, по крайней мере, {2} вложений",
                "exactlynumber": "Предупреждение: был загружен {0} вложения типа \"{1}\". Эта категория ожидает {2} вложений",
                "maxnumber": "Предупреждение: было загружено {0} вложение типа \"{1}\". Эта категория ожидает в большинстве {2} вложений"
            },
            "wrongfileextension": "{0} расширение файла не допускается"
        },
        "bim": {
            "bimViewer": "Бим Зритель",
            "card": {
                "label": "Карта"
            },
            "layers": {
                "label": "Слои",
                "menu": {
                    "hideAll": "Скрыть все",
                    "showAll": "Показать все"
                },
                "name": "Имя",
                "qt": "Qt",
                "visibility": "Видимость"
            },
            "menu": {
                "camera": "Камера",
                "frontView": "Вид спереди",
                "mod": "Элементы управления иссяки",
                "orthographic": "Ортографическая камера",
                "pan": "Переместить",
                "perspective": "Перспективная камера",
                "resetView": "Сбросить Представление",
                "rotate": "Повернуть",
                "sideView": "Вид сбоку",
                "topView": "Вид сверху"
            },
            "showBimCard": "Открытый 3D-зритель",
            "tree": {
                "arrowTooltip": "Выберите элемент",
                "columnLabel": "Дерево",
                "label": "Дерево",
                "open_card": "Открыть соответствующую карту",
                "root": "Корень Ifc"
            }
        },
        "bulkactions": {
            "abort": "Прерывание выбранных элементов",
            "cancelselection": "Отмена выбора",
            "confirmabort": "Вы прерываете {0} экземплярах процесса. Вы уверены, что хотите продолжить?",
            "confirmdelete": "Вы удаляете {0} карты. Вы уверены, что хотите продолжить?",
            "confirmdeleteattachements": "Вы удаляете {0} вложения. Вы уверены, что хотите продолжить?",
            "confirmedit": "Вы изменяете {0} для {1} карт. Вы уверены, что хотите продолжить?",
            "delete": "Удаление выбранных элементов",
            "download": "Скачать выбранные вложения",
            "edit": "Редактировать выбранные элементы",
            "selectall": "Выберите все элементы"
        },
        "calendar": {
            "active_expired": "Активный/Просроченный",
            "add": "Добавить",
            "advancenotification": "Предварительное уведомление",
            "allcategories": "Все категории",
            "alldates": "Все даты",
            "calculated": "Рассчитывается",
            "calendar": "Календарь",
            "cancel": "Отметка как отмененная",
            "category": "Категории",
            "cm_confirmcancel": "Вы уверены, что хотите отметить как отмененные выбранные расписания?",
            "cm_confirmcomplete": "Вы уверены, что хотите отметить как выполненные выбранные графики?",
            "cm_markcancelled": "Отметка как отмененные выбранные расписания",
            "cm_markcomplete": "Отметьте как заполненные выбранные расписания",
            "complete": "Полный",
            "completed": "Завершена",
            "date": "Дата",
            "days": "Дней",
            "delaybeforedeadline": "Задержка до крайнего срока",
            "delaybeforedeadlinevalue": "Задержка до срока значение",
            "description": "Описание",
            "editevent": "Расписание отсвасывай",
            "enddate": "Дата окончания",
            "endtype": "Конечный тип",
            "event": "Расписание",
            "executiondate": "Дата исполнения",
            "frequency": "Частота",
            "frequencymultiplier": "Множитель частоты",
            "grid": "Сетки",
            "leftdays": "Дни, чтобы пойти",
            "londdescription": "Полное описание",
            "manual": "Вручную",
            "maxactiveevents": "Макс активных событий",
            "messagebodydelete": "Хотите удалить правило планировщиков?",
            "messagebodyplural": "Есть правила {0} расписания",
            "messagebodyrecalculate": "Хотите пересчитать правило расписаний с новой датой?",
            "messagebodysingular": "Существует правило {0} расписания",
            "messagetitle": "Перерасчет расписания",
            "missingdays": "Отсутствующие дни",
            "next30days": "Следующие 30 дней",
            "next7days": "Следующие 7 дней",
            "notificationtemplate": "Шаблон, используемый для уведомления",
            "notificationtext": "Текст уведомления",
            "occurencies": "Количество происшествий",
            "operation": "Операции",
            "partecipantgroup": "Группа пареципантов",
            "partecipantuser": "Пользователь-частичное",
            "priority": "Приоритет",
            "recalculate": "Пересчитать",
            "referent": "Референт",
            "scheduler": "Планировщик",
            "sequencepaneltitle": "Создание расписаний",
            "startdate": "Дата начала",
            "status": "Статус",
            "today": "Сегодня",
            "type": "Тип",
            "viewevent": "Расписание просмотра",
            "widgetcriterion": "Критерий расчета",
            "widgetemails": "Электронные письма",
            "widgetsourcecard": "Исходное удостоверение"
        },
        "classes": {
            "cards": {
                "addcard": "Добавить запись",
                "clone": "Дублировать",
                "clonewithrelations": "Карта клонов и отношения",
                "deletebeaware": "Имейте в виду, что:",
                "deleteblocked": "Продолжить удаление невозможно, так как есть отношения с {0}.",
                "deletecard": "Удалить запись",
                "deleteconfirmation": "Вы уверены, что хотите удалить эту карту?",
                "deleterelatedcards": "также {0}, связанные карты будут удалены",
                "deleterelations": "отношения с {0} картами будут удалены",
                "label": "Конфигурационные единицы",
                "modifycard": "Редактировать запись",
                "opencard": "Открыть карты",
                "print": "Печать карты"
            },
            "simple": "Простой",
            "standard": "Стандартный"
        },
        "common": {
            "actions": {
                "add": "Добавить",
                "apply": "Применить",
                "cancel": "Отменить",
                "close": "Закрыть",
                "delete": "Удаление",
                "edit": "Редактировать",
                "execute": "Выполнить",
                "help": "Справка",
                "load": "Нагрузки",
                "open": "Открыть",
                "refresh": "Обновление данных",
                "remove": "Удалить",
                "save": "Сохранить",
                "saveandapply": "Сохранить и применить",
                "saveandclose": "Сохранить и закрыть",
                "search": "Поиск",
                "searchtext": "Поиск..."
            },
            "attributes": {
                "nogroup": "Базовые данные"
            },
            "dates": {
                "date": "д/м/y",
                "datetime": "d/m/Y H:i:s",
                "time": "H:i:s"
            },
            "editor": {
                "clearhtml": "Очистить HTML",
                "expand": "Расширить редактор",
                "reduce": "Уменьшить редактор",
                "unlink": "<em>Unlink</em>",
                "unlinkmessage": "<em>Transform the selected hyperlink into text.</em>"
            },
            "grid": {
                "disablemultiselection": "Отключить многофункциональный выбор",
                "enamblemultiselection": "Включить многофункциональный выбор",
                "export": "Данные по экспорту",
                "filterremoved": "Текущий фильтр удален",
                "import": "Данные по импорту",
                "itemnotfound": "Элемент не найден",
                "list": "Список",
                "opencontextualmenu": "Открытое контекстное меню",
                "print": "Печати",
                "printcsv": "Печать как CSV",
                "printodt": "Печать как ODT",
                "printpdf": "Печать как PDF",
                "row": "Элемента",
                "rows": "Элементы",
                "subtype": "Подтип"
            },
            "tabs": {
                "activity": "Процесс",
                "attachment": "Вложения",
                "attachments": "Вложенные файлы",
                "card": "Данные",
                "clonerelationmode": "Режим отношений клонов",
                "details": "Подробно",
                "emails": "Электронные письма",
                "history": "История",
                "notes": "Комментарии",
                "relations": "Связи",
                "schedules": "Расписание"
            }
        },
        "dashboards": {
            "tools": {
                "gridhide": "Скрытие сетки данных",
                "gridshow": "Показать сетку данных",
                "parametershide": "Скрыть параметры данных",
                "parametersshow": "Показать параметры данных",
                "reload": "Перезагрузить"
            }
        },
        "emails": {
            "addattachmentsfromdocumentarchive": "Добавление вложений из архива документов",
            "alredyexistfile": "Уже существует файл с этим именем",
            "archivingdate": "Дата",
            "attachfile": "Вложить файл",
            "bcc": "Скрытая копия",
            "cc": "Копия",
            "composeemail": "Составление сообщения",
            "composefromtemplate": "Составить из шаблона",
            "delay": "Задержка",
            "delays": {
                "day1": "Через 1 день",
                "days2": "Через 2 дня",
                "days4": "Через 4 дня",
                "hour1": "1 час",
                "hours2": "2 часа",
                "hours4": "4 часа",
                "month1": "Через 1 месяц",
                "negativeday1": "1 день до",
                "negativedays2": "За 2 дня до",
                "negativedays4": "За 4 дня до",
                "negativehour1": "1 час до",
                "negativehours2": "2 часа до",
                "negativehours4": "За 4 часа до",
                "negativemonth1": "1 месяц до",
                "negativeweek1": "За 1 неделю до",
                "negativeweeks2": "2 недели до",
                "none": "нисколько",
                "week1": "Через 1 неделю",
                "weeks2": "Через 2 недели"
            },
            "dmspaneltitle": "Выберите вложение из базы данных",
            "edit": "Редактировать",
            "from": "От",
            "gridrefresh": "Обновление сетки",
            "keepsynchronization": "Сохранять синхронизацию",
            "message": "Сообщение",
            "regenerateallemails": "Восстановить все электронные письма",
            "regenerateemail": "Повторить генерацию почтовых сообщений",
            "remove": "Удалить",
            "remove_confirmation": "Вы уверены, что хотите удалить это письмо?",
            "reply": "Ответить",
            "replyprefix": "На {0}, {1} написал:",
            "selectaclass": "Выберите класс",
            "sendemail": "Отправить электронное письмо",
            "statuses": {
                "draft": "Черновики",
                "error": "Ошибка",
                "outgoing": "Исходящие",
                "received": "Входящие",
                "sent": "Отправленные"
            },
            "subject": "Тема",
            "to": "До",
            "view": "Представление данных"
        },
        "errors": {
            "autherror": "Неверное имя пользователя или пароль",
            "classnotfound": "Класс {0} не найден",
            "fieldrequired": "Это поле требуется",
            "invalidfilter": "Недействительный фильтр",
            "notfound": "Элемент не найден"
        },
        "filters": {
            "actions": "Действия",
            "addfilter": "Создать фильтр",
            "any": "Любой",
            "attachments": "<em>Attachments</em>",
            "attachmentssearchtext": "<em>Attachments search text</em>",
            "attribute": "Выберите атрибут",
            "attributes": "Атрибуты",
            "clearfilter": "Сбросить фильтр",
            "clone": "Дублировать",
            "copyof": "Копия",
            "currentgroup": "Текущая группа",
            "currentuser": "Текущий пользователь",
            "defaultset": "Установить по умолчанию",
            "defaultunset": "Выгрузка из дефолта",
            "description": "Описание",
            "domain": "Связь",
            "filterdata": "Данные о фильтре",
            "fromfilter": "<em>From filter</em>",
            "fromselection": "Из отбора",
            "group": "Группы",
            "ignore": "Игнорировать",
            "migrate": "Переносит",
            "name": "Имя",
            "newfilter": "Новый фильтр",
            "noone": "Ни один из",
            "operator": "Оператор",
            "operators": {
                "beginswith": "Начинается с",
                "between": "Между",
                "contained": "Содержится",
                "containedorequal": "Содержится или равен",
                "contains": "Содержит",
                "containsorequal": "Содержит или равно",
                "descriptionbegin": "<em>Description begins with</em>",
                "descriptioncontains": "Описание содержит",
                "descriptionends": "<em>Description ends with</em>",
                "descriptionnotbegin": "<em>Description does not begins with</em>",
                "descriptionnotcontain": "<em>Description does not contain</em>",
                "descriptionnotends": "<em>Description does not ends with</em>",
                "different": "Различных",
                "doesnotbeginwith": "Не начинается с",
                "doesnotcontain": "Не содержит",
                "doesnotendwith": "Не заканчивается",
                "endswith": "Окончание с",
                "equals": "Равно",
                "greaterthan": "Больше",
                "isnotnull": "Не является недействительным",
                "isnull": "Является недействительным",
                "lessthan": "Менее"
            },
            "relations": "Связи",
            "type": "Тип",
            "typeinput": "Переменный параметр",
            "user": "Пользователя",
            "value": "Значение"
        },
        "gis": {
            "card": "Данные",
            "cardsMenu": "Меню карт",
            "code": "Код",
            "description": "Описание",
            "extension": {
                "errorCall": "Ошибка",
                "noResults": "Нет результатов"
            },
            "externalServices": "Внешние сервисы",
            "geographicalAttributes": "Гео. атрибуты",
            "geoserverLayers": "Слои Geoserver",
            "layers": "Слои",
            "list": "Список",
            "longpresstitle": "Геоэлементы в районе",
            "map": "Карта",
            "mapServices": "Картографические услуги",
            "position": "Положение",
            "root": "Корень",
            "tree": "Навигационное дерево",
            "type": "Тип",
            "view": "Представление данных",
            "zoom": "Масштабировать"
        },
        "history": {
            "activityname": "Действие",
            "activityperformer": "Исполнитель",
            "begindate": "Начальная дата",
            "enddate": "Конечная дата",
            "processstatus": "Состояние",
            "user": "Пользователь"
        },
        "importexport": {
            "database": {
                "uri": "База данных URI",
                "user": "Пользователь базы данных"
            },
            "downloadreport": "Скачать отчет",
            "emailfailure": "Ошибка произошла при отправке электронной почты!",
            "emailmessage": "Приложенный отчет об импорте файла \"{0}\" в {1}",
            "emailsubject": "Отчет об данных об импорте",
            "emailsuccess": "Письмо было отправлено успешно!",
            "export": "Экспорт",
            "exportalldata": "Все данные",
            "exportfiltereddata": "Только данные, соответствующие фильтру сетки",
            "gis": {
                "shapeimportdisabled": "Импорт форм не включен для этого шаблона",
                "shapeimportenabled": "Конфигурация импорта форм"
            },
            "ifc": {
                "card": "<em>Card</em>",
                "project": "Проекта",
                "sourcetype": "Импорт из"
            },
            "import": "Импорт",
            "importresponse": "Реакция на импорт",
            "response": {
                "created": "Созданные элементы",
                "deleted": "Удаленные",
                "errors": "Ошибки",
                "linenumber": "Номер строки",
                "message": "Сообщение",
                "modified": "Модифицированные элементы",
                "processed": "Обработанные строки",
                "recordnumber": "Рекордное число",
                "unmodified": "Неизмененные элементы"
            },
            "sendreport": "Отправить отчет",
            "template": "Шаблон",
            "templatedefinition": "Определение шаблона"
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
                "login": "Вход в систему",
                "logout": "Изменение пользователя"
            },
            "fields": {
                "group": "Группы",
                "language": "Язык",
                "password": "Пароль",
                "tenants": "Арендаторов",
                "username": "Имя пользователя"
            },
            "loggedin": "Зарегистрирован в",
            "title": "Вход в систему",
            "welcome": "С возвращением {0}."
        },
        "main": {
            "administrationmodule": "Администрирование",
            "baseconfiguration": "Базовая конфигурация",
            "cardlock": {
                "lockedmessage": "Вы не можете редактировать эту карту, потому что она редактируется.",
                "someone": "Человека"
            },
            "changegroup": "Группа изменений",
            "changetenant": "Изменить {0}",
            "confirmchangegroup": "Вы уверены, что хотите изменить группу?",
            "confirmchangetenants": "Вы уверены, что хотите сменить активных арендаторов?",
            "confirmdisabletenant": "Вы уверены, что хотите отключить флаг \"Игнорировать жильцов\"?",
            "confirmenabletenant": "Вы уверены, что хотите включить флаг \"Игнорировать арендаторов\"?",
            "ignoretenants": "Игнорировать {0}",
            "info": "Информация",
            "logo": {
                "cmdbuild": "Логотип CMDBuild",
                "cmdbuildready2use": "Логотип CMDBuild READY2USE",
                "companylogo": "Логотип компании",
                "openmaint": "Логотип OpenMAINT"
            },
            "logout": "Выход",
            "managementmodule": "Управление данными",
            "multigroup": "Несколько групп",
            "multitenant": "Мульти {0}",
            "navigation": "Навигация",
            "pagenotfound": "Страница не найдена",
            "password": {
                "change": "Изменить пароль",
                "confirm": "Подтверждение пароля",
                "email": "Адрес электронной почты",
                "err_confirm": "Пароль не совпадает.",
                "err_diffprevious": "Пароль не может быть идентичен предыдущему.",
                "err_diffusername": "Пароль не может быть идентичен имени пользователя.",
                "err_length": "Пароль должен быть не менее {0} символов долго.",
                "err_reqdigit": "Пароль должен содержать по крайней мере одну цифру.",
                "err_reqlowercase": "Пароль должен содержать по крайней мере один символ нижнего регистра.",
                "err_requppercase": "Пароль должен содержать по крайней мере один символ верхнего регистра.",
                "expired": "Срок действия пароля истек. Вы должны изменить его сейчас.",
                "forgotten": "Я забыл свой пароль",
                "new": "Новый пароль",
                "old": "Старый пароль",
                "recoverysuccess": "Мы отправили вам электронное письмо с инструкцией по восстановлению вашего пароля.",
                "reset": "Сбросить пароль",
                "saved": "Пароль правильно сохранен!"
            },
            "pleasecorrecterrors": "Пожалуйста, исправьте указанные ошибки!",
            "preferences": {
                "comma": "Запятой",
                "decimalserror": "Десятичные поля должны присутствовать",
                "decimalstousandserror": "Десятичные и тысячи сепаратор должны быть разными",
                "default": "По умолчанию",
                "defaultvalue": "Значение по умолчанию",
                "firstdayofweek": "<em>First day of week</em>",
                "gridpreferencesclear": "Четкие предпочтения сетки",
                "gridpreferencescleared": "Сетка предпочтения очищены!",
                "gridpreferencessave": "Сохранение предпочтений сетки",
                "gridpreferencessaved": "Сетка предпочтения сохранены!",
                "gridpreferencesupdate": "Обновление предпочтений сетки",
                "labelcsvseparator": "Сепаратор CSV",
                "labeldateformat": "Формат даты",
                "labeldecimalsseparator": "Сепаратор десятичных знаков",
                "labellanguage": "Язык",
                "labelthousandsseparator": "Тысячи сепараторов",
                "labeltimeformat": "Формат времени",
                "msoffice": "Офис Майкрософт",
                "period": "Период",
                "preferredfilecharset": "Кодирование CSV",
                "preferredofficesuite": "Предпочтительный офисный пакет",
                "space": "Пространство",
                "thousandserror": "Тысячи полей должны присутствовать",
                "timezone": "Часовой пояс",
                "twelvehourformat": "12-часовой формат",
                "twentyfourhourformat": "24-часовой формат"
            },
            "searchinallitems": "Поиск по всем элементам",
            "treenavcontenttitle": "{0} от {1}",
            "userpreferences": "Предпочтения"
        },
        "menu": {
            "allitems": "Все предметы",
            "classes": "Классы",
            "custompages": "Пользовательские страницы",
            "dashboards": "Панели мониторинга",
            "processes": "Рабочие процессы",
            "reports": "Отчеты",
            "views": "Представления"
        },
        "notes": {
            "edit": "Редактировать комментарий"
        },
        "notifier": {
            "attention": "Внимание",
            "error": "Ошибка",
            "genericerror": "Общая ошибка",
            "genericinfo": "Общая информация",
            "genericwarning": "Общее предупреждение",
            "info": "Информация",
            "success": "Успешно выполнено",
            "warning": "Предупреждение"
        },
        "patches": {
            "apply": "Применить патчи",
            "category": "Категории",
            "description": "Описание",
            "name": "Имя",
            "patches": "Патчи"
        },
        "processes": {
            "abortconfirmation": "Действительно удалить процесс?",
            "abortprocess": "Прервать процесс",
            "action": {
                "advance": "Продолжить",
                "label": "Действий"
            },
            "activeprocesses": "Активные процессы",
            "allstatuses": "Все",
            "editactivity": "Редактировать процесс",
            "openactivity": "Открытая деятельность",
            "startworkflow": "Начало",
            "workflow": "Процесс"
        },
        "relationGraph": {
            "activity": "Деятельности",
            "allLabelsOnGraph": "все этикетки на графике",
            "card": "Данные",
            "cardList": "Список Карт",
            "cardRelations": "Связь",
            "choosenaviagationtree": "Выберите навигационное дерево",
            "class": "Класса",
            "classList": "Список Классов",
            "compoundnode": "Соединение узла",
            "disable": "Отключить",
            "edges": "<em>Edges</em>",
            "enable": "Включить",
            "labelsOnGraph": "инструмент на графике",
            "level": "Уровень",
            "nodes": "<em>Nodes</em>",
            "openRelationGraph": "Показать диаграмму связей",
            "qt": "Qt",
            "refresh": "Обновить",
            "relation": "Связь",
            "relationGraph": "Отображение связей",
            "reopengraph": "Повторное открытие графика из этого узла"
        },
        "relations": {
            "adddetail": "Добавить элемент",
            "addrelations": "Добавить связь",
            "attributes": "Атрибуты",
            "code": "Код",
            "deletedetail": "Удалить элемент",
            "deleterelation": "Удалить связь",
            "deleterelationconfirm": "Вы уверены, что хотите удалить это отношение?",
            "description": "Описание",
            "editcard": "Редактировать запись",
            "editdetail": "Редактировать элемент",
            "editrelation": "Редактировать связь",
            "extendeddata": "Расширенные данные",
            "mditems": "Элементы",
            "missingattributes": "Отсутствующие обязательные атрибуты",
            "opencard": "Открыть связанную запись",
            "opendetail": "Показать элемент",
            "type": "Тип"
        },
        "reports": {
            "csv": "CSV",
            "download": "Скачать",
            "format": "Формат",
            "odt": "ODT",
            "pdf": "PDF",
            "print": "Распечатать",
            "reload": "Обновить",
            "rtf": "RTF"
        },
        "system": {
            "data": {
                "lookup": {
                    "CalendarCategory": {
                        "default": {
                            "description": "По умолчанию"
                        }
                    },
                    "CalendarFrequency": {
                        "daily": {
                            "description": "Ежедневно"
                        },
                        "monthly": {
                            "description": "Ежемесячно"
                        },
                        "once": {
                            "description": "Раз"
                        },
                        "weekly": {
                            "description": "Еженедельно"
                        },
                        "yearly": {
                            "description": "Годовой"
                        }
                    },
                    "CalendarPriority": {
                        "default": {
                            "description": "По умолчанию"
                        }
                    }
                }
            }
        },
        "thematism": {
            "addThematism": "Добавить тематизм",
            "analysisType": "Тип анализа",
            "attribute": "Атрибут",
            "calculateRules": "Создание правил стиля",
            "clearThematism": "Очистить тематизм",
            "color": "Цвет",
            "defineLegend": "Определение легенды",
            "defineThematism": "Определение фематизма",
            "function": "Функции",
            "generate": "Создать",
            "geoAttribute": "Географический атрибут",
            "graduated": "Окончил",
            "highlightSelected": "Выделение выбранного элемента",
            "intervals": "Интервалы",
            "legend": "Легенда",
            "name": "Имя",
            "newThematism": "Новый тематизм",
            "punctual": "Пунктуальны",
            "quantity": "Рассчитывать",
            "segments": "Сегментов",
            "source": "Источник",
            "table": "Таблице",
            "thematism": "Тематизмы",
            "value": "Значение"
        },
        "widgets": {
            "customform": {
                "addrow": "Добавить строку",
                "clonerow": "Строка клонов",
                "datanotvalid": "Данные недействительны",
                "deleterow": "Удалить строку",
                "editrow": "Редактировать строку",
                "export": "Экспорт",
                "import": "Импортировать",
                "importexport": {
                    "expattributes": "Данные для экспорта",
                    "file": "Файл",
                    "filename": "Имя файла",
                    "format": "Формат",
                    "importmode": "Режим импорта",
                    "keyattributes": "Ключевые атрибуты",
                    "missingkeyattr": "Пожалуйста, выберите по крайней мере один ключевой атрибут",
                    "modeadd": "Добавить",
                    "modemerge": "Объединить",
                    "modereplace": "Заменить",
                    "separator": "Разделитель"
                },
                "refresh": "Обновление по умолчани"
            },
            "linkcards": {
                "checkedonly": "Только проверено",
                "editcard": "Редактировать карту",
                "opencard": "Открыт карту",
                "refreshselection": "Применить выбор по умолчанию",
                "togglefilterdisabled": "Отключить фильтр сетки",
                "togglefilterenabled": "Включить фильтр сетки"
            },
            "required": "Этот виджет не требуется."
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