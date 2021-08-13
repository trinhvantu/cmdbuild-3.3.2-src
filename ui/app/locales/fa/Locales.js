(function() {
    Ext.define('CMDBuildUI.locales.fa.Locales', {
        "requires": ["CMDBuildUI.locales.fa.LocalesAdministration"],
        "override": "CMDBuildUI.locales.Locales",
        "singleton": true,
        "localization": "fa",
        "administration": CMDBuildUI.locales.fa.LocalesAdministration.administration,
        "attachments": {
            "add": "اضافه کردن ضمیمه",
            "attachmenthistory": "تاریخچه پیوست",
            "author": "نویسنده",
            "browse": "<em>Browse &hellip;</em>",
            "category": "دسته بندی",
            "code": "<em>Code</em>",
            "creationdate": "تاریخ ایجاد",
            "deleteattachment": "پیوست را حذف کنید",
            "deleteattachment_confirmation": "آیا مطمئن هستید که می خواهید این پیوست را حذف کنید؟",
            "description": "توضیحات",
            "download": "دانلود",
            "dropfiles": "<em>Drop files here</em>",
            "editattachment": "ویرایش ضمیمه",
            "file": "فایل",
            "filealreadyinlist": "<em>The file {0} is already in list.</em>",
            "filename": "نام فایل",
            "fileview": "<em>View attachment</em>",
            "invalidfiles": "<em>Remove invalid files</em>",
            "majorversion": "نسخه اصلی",
            "modificationdate": "تاریخ تغییر",
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
            "uploadfile": "آپلود فایل...",
            "version": "نسخه",
            "viewhistory": "مشاهده تاریخچه پیوست",
            "warningmessages": {
                "atleast": "<em>Warning: has been loaded {0} attachments of type \"{1}\". This category expects at least {2} attachments </em>",
                "exactlynumber": "<em>Warning: has been loaded {0} attachments of type \"{1}\". This category expects {2} attachments</em>",
                "maxnumber": "<em>Warning: has been loaded {0} attachment of type \"{1}\". This category expects at most {2}  attachments</em>"
            },
            "wrongfileextension": "<em>{0} file extension is not allowed</em>"
        },
        "bim": {
            "bimViewer": "نمایشگر BIM",
            "card": {
                "label": "کارت"
            },
            "layers": {
                "label": "لایه ها",
                "menu": {
                    "hideAll": "همه را پنهان کن",
                    "showAll": "نمایش همه"
                },
                "name": "نام",
                "qt": "عدد",
                "visibility": "دید"
            },
            "menu": {
                "camera": "دوربین",
                "frontView": "نمای جلویی",
                "mod": "کنترل های مشاهده",
                "orthographic": "دوربین ارتوپدی",
                "pan": "طومار",
                "perspective": "دوربین چشم انداز",
                "resetView": "تنظیم مجدد نما",
                "rotate": "چرخش",
                "sideView": "نمای کنار",
                "topView": "نمای بالا"
            },
            "showBimCard": "بیننده 3Dباز کن",
            "tree": {
                "arrowTooltip": "عنصر را انتخاب کنید",
                "columnLabel": "درخت هدایت",
                "label": "درخت هدایت",
                "open_card": "بازکردن کارتهای مرتبط",
                "root": "ریشه ifc"
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
                "addcard": "اضافه کردن کارت",
                "clone": "مشابه گیری",
                "clonewithrelations": "کارت مشابه و روابط",
                "deletebeaware": "<em>Be aware that:</em>",
                "deleteblocked": "<em>It is not possible to proceed with the deletion because there are relations with {0}.</em>",
                "deletecard": "حذف کارت",
                "deleteconfirmation": "آیا مطمئن هستید که می خواهید این کارت را حذف کنید؟",
                "deleterelatedcards": "<em>also {0} related cards will be deleted</em>",
                "deleterelations": "<em>relations with {0} cards will be deleted</em>",
                "label": "کارتها",
                "modifycard": "ویرایش کارت",
                "opencard": "کارت را باز کن",
                "print": "چاپ کارت"
            },
            "simple": "ساده",
            "standard": "استاندارد"
        },
        "common": {
            "actions": {
                "add": "اضافه",
                "apply": "اعمال کردن",
                "cancel": "انصراف",
                "close": "بستن",
                "delete": "حذف",
                "edit": "ویرایش",
                "execute": "اجرا کردن",
                "help": "<em>Help</em>",
                "load": "<em>Load</em>",
                "open": "<em>Open</em>",
                "refresh": "تازه کردن داده ها",
                "remove": "حذف",
                "save": "ذخیره",
                "saveandapply": "ذخیره و اعمال کردن",
                "saveandclose": "ذخیره کن و ببند",
                "search": "جستجو کردن",
                "searchtext": "جستجو کردن..."
            },
            "attributes": {
                "nogroup": "داده های پایه"
            },
            "dates": {
                "date": "<em>d/m/Y</em>",
                "datetime": "<em>d/m/Y H:i:s</em>",
                "time": "<em>H:i:s</em>"
            },
            "editor": {
                "clearhtml": "پاک کردن HTML",
                "expand": "<em>Expand editor</em>",
                "reduce": "<em>Reduce editor</em>",
                "unlink": "<em>Unlink</em>",
                "unlinkmessage": "<em>Transform the selected hyperlink into text.</em>"
            },
            "grid": {
                "disablemultiselection": "چند انتخابی را غیرفعال کنید",
                "enamblemultiselection": "انتخاب چندگانه را فعال کنید",
                "export": "صادرات داده ها",
                "filterremoved": "فیلتر کنونی حذف شده است",
                "import": "وارد کردن داده ها",
                "itemnotfound": "آیتم پیدا نشد",
                "list": "لیست",
                "opencontextualmenu": "منوی متنی را باز کنید",
                "print": "چاپ",
                "printcsv": "چاپ به عنوان CSV",
                "printodt": "چاپ به عنوان ODT",
                "printpdf": "چاپ به عنوان PDF",
                "row": "آیتم",
                "rows": "آیتم ها",
                "subtype": "زیرمجموعه"
            },
            "tabs": {
                "activity": "فعالیت",
                "attachment": "<em>Attachment</em>",
                "attachments": "ضمیمه",
                "card": "کارت",
                "clonerelationmode": "<em>Clone Relations Mode</em>",
                "details": "جزئیات",
                "emails": "ایمیل ها",
                "history": "تاریخچه",
                "notes": "یاداشتها",
                "relations": "روابط",
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
            "alredyexistfile": "در حال حاضر یک فایل با این نام وجود دارد",
            "archivingdate": "تاریخ آرشیو کردن",
            "attachfile": "ضمیمه کردن فایل",
            "bcc": "Bcc",
            "cc": "Cc",
            "composeemail": "نوشتن ایمیل",
            "composefromtemplate": "نوشتن از قالب",
            "delay": "تاخیر انداختن",
            "delays": {
                "day1": "در یک روز",
                "days2": "در دو روز",
                "days4": "در چهار روز",
                "hour1": "یک ساعت",
                "hours2": "دو ساعت",
                "hours4": "چهار ساعت",
                "month1": "در یک ماه",
                "negativeday1": "<em>1 day before</em>",
                "negativedays2": "<em>2 days before</em>",
                "negativedays4": "<em>4 days before</em>",
                "negativehour1": "<em>1 hour before</em>",
                "negativehours2": "<em>2 hours before</em>",
                "negativehours4": "<em>4 hours before</em>",
                "negativemonth1": "<em>1 month before</em>",
                "negativeweek1": "<em>1 week before</em>",
                "negativeweeks2": "<em>2 weeks before</em>",
                "none": "هیچ کدام",
                "week1": "در یک هفته",
                "weeks2": "در دو هفته"
            },
            "dmspaneltitle": "انتخاب ضمیمه از پایگاه داده",
            "edit": "ویرایش",
            "from": "از جانب",
            "gridrefresh": "تازه کردن شبکه",
            "keepsynchronization": "همگام سازی را حفظ کنید",
            "message": "پیام",
            "regenerateallemails": "بازتولید تمام ایمیلها",
            "regenerateemail": "باز تولید ایمیل",
            "remove": "حذف",
            "remove_confirmation": "آیا مطمئن هستید که می خواهید این ایمیل را حذف کنید؟",
            "reply": "پاسخ",
            "replyprefix": "در {0}، {1} نوشت:",
            "selectaclass": "یک کلاس را انتخاب کنید",
            "sendemail": "ارسال ایمیل",
            "statuses": {
                "draft": "پیش نویس",
                "error": "<em>Error</em>",
                "outgoing": "خروجی",
                "received": "رسیده",
                "sent": "ارسالی"
            },
            "subject": "موضوع",
            "to": "به",
            "view": "مشاهده"
        },
        "errors": {
            "autherror": "نام کاربری یا پسورداشتباه است",
            "classnotfound": "کلاس {0} پیدا نشد",
            "fieldrequired": "<em>This field is required</em>",
            "invalidfilter": "<em>Invalid filter</em>",
            "notfound": "آیتم پیدا نشد"
        },
        "filters": {
            "actions": "اقدامات",
            "addfilter": "اضافه کردن فیلتر",
            "any": "هر",
            "attachments": "<em>Attachments</em>",
            "attachmentssearchtext": "<em>Attachments search text</em>",
            "attribute": "یک خاصیت را انتخاب کنید",
            "attributes": "خواص",
            "clearfilter": "پاک کردن فیلتر",
            "clone": "مشابه گیری",
            "copyof": "کپی از",
            "currentgroup": "<em>Current group</em>",
            "currentuser": "<em>Current user</em>",
            "defaultset": "<em>Set as default</em>",
            "defaultunset": "<em>Unset from default</em>",
            "description": "توضیحات",
            "domain": "دامنه",
            "filterdata": "فیلتر کردن داده ها",
            "fromfilter": "<em>From filter</em>",
            "fromselection": "از انتخاب",
            "group": "<em>Group</em>",
            "ignore": "چشم پوشی",
            "migrate": "کوچیدن",
            "name": "نام",
            "newfilter": "فیلتر جدید",
            "noone": "هیچ کدام",
            "operator": "اپراتور",
            "operators": {
                "beginswith": "شروع میشود با",
                "between": "مابین",
                "contained": "شامل است",
                "containedorequal": "شامل یا برابر است",
                "contains": "شامل",
                "containsorequal": "شامل یا برابر",
                "descriptionbegin": "<em>Description begins with</em>",
                "descriptioncontains": "<em>Description contains</em>",
                "descriptionends": "<em>Description ends with</em>",
                "descriptionnotbegin": "<em>Description does not begins with</em>",
                "descriptionnotcontain": "<em>Description does not contain</em>",
                "descriptionnotends": "<em>Description does not ends with</em>",
                "different": "تفاوت",
                "doesnotbeginwith": "شروع نشود با",
                "doesnotcontain": "شامل نباشد",
                "doesnotendwith": "تمام نشود با",
                "endswith": "پایان یابد با",
                "equals": "مساوی باشد با",
                "greaterthan": "بزرگتر از",
                "isnotnull": "تهی نیست",
                "isnull": "تهی است",
                "lessthan": "کمتر از"
            },
            "relations": "روابط",
            "type": "نوع",
            "typeinput": "پارامتر ورودی",
            "user": "<em>User</em>",
            "value": "مقدار"
        },
        "gis": {
            "card": "کارت",
            "cardsMenu": "منو کارت",
            "code": "<em>Code</em>",
            "description": "<em>Description</em>",
            "extension": {
                "errorCall": "<em>Error</em>",
                "noResults": "<em>No Results</em>"
            },
            "externalServices": "سرویسهای خارجی",
            "geographicalAttributes": "خواص جئوگرافیک",
            "geoserverLayers": "لایه های Geoserver",
            "layers": "لایه ها",
            "list": "لیست",
            "longpresstitle": "<em>Geoelements in area</em>",
            "map": "نقشه",
            "mapServices": "نقشه خدمات",
            "position": "محدوده",
            "root": "ریشه",
            "tree": "درخت هدایت",
            "type": "<em>Type</em>",
            "view": "مشاهده",
            "zoom": "زوم"
        },
        "history": {
            "activityname": "نام فعالیت",
            "activityperformer": "انجام دهنده",
            "begindate": "تاریخ شروع",
            "enddate": "تاریخ اتمام",
            "processstatus": "وضعیت",
            "user": "کاربر"
        },
        "importexport": {
            "database": {
                "uri": "<em>Database URI</em>",
                "user": "<em>Database user</em>"
            },
            "downloadreport": "گزارش را دانلود کنید",
            "emailfailure": "هنگام ارسال ایمیل خطایی رخ داد!",
            "emailmessage": "<em>Attached import report of file \"{0}\" in date {1}</em>",
            "emailsubject": "گزارش واردات داده ها",
            "emailsuccess": "ایمیل با موفقیت فرستاده شد!",
            "export": "صادرات",
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
            "import": "وارد كردن",
            "importresponse": "پاسخ واردات",
            "response": {
                "created": "موارد ایجاد شده",
                "deleted": "موارد حذف شده",
                "errors": "خطاها",
                "linenumber": "شماره خط",
                "message": "پیام",
                "modified": "موارد اصلاح شده",
                "processed": "ردیفهای پردازش شده",
                "recordnumber": "شماره ثبت",
                "unmodified": "آیتم های بدون تغییر"
            },
            "sendreport": "ارسال گزارش",
            "template": "قالب",
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
                "login": "ورود",
                "logout": "تغییر کاربر"
            },
            "fields": {
                "group": "گروه",
                "language": "زبان",
                "password": "رمز عبور",
                "tenants": "Tennants",
                "username": "نام کاربری"
            },
            "loggedin": "وارد شده",
            "title": "ورود",
            "welcome": "خوش آمدید {0}."
        },
        "main": {
            "administrationmodule": "ماژول ادمین",
            "baseconfiguration": "پیکربندی پایه",
            "cardlock": {
                "lockedmessage": "شما نمی توانید این کارت را ویرایش کنید زیرا {0} آن را ویرایش می کند.",
                "someone": "کسی"
            },
            "changegroup": "تغییر گروه",
            "changetenant": "<em>Change {0}</em>",
            "confirmchangegroup": "آیا مطمئنید که میخواهید گروه را تغییر دهید؟",
            "confirmchangetenants": "آیا مطمئن هستید که می خواهید «tenants » فعال را تغییر دهید؟",
            "confirmdisabletenant": "آیا مطمئن هستید که میخواهید «tenants flag» را غیرفعال کنید؟",
            "confirmenabletenant": "آیا مطمئن هستید که میخواهید «tenats flag» را فعال کنید؟",
            "ignoretenants": "<em>Ignore {0}</em>",
            "info": "اطلاعات",
            "logo": {
                "cmdbuild": "آرم CMDBuild",
                "cmdbuildready2use": "آرم  CMDBuild READY2USE",
                "companylogo": "آرم شرکت",
                "openmaint": "آرم openMAINT"
            },
            "logout": "خروج",
            "managementmodule": "ماژول مدیریت اطلاعات",
            "multigroup": "چند گروهی",
            "multitenant": "<em>Multi {0}</em>",
            "navigation": "هدایت",
            "pagenotfound": "صفحه یافت نشد",
            "password": {
                "change": "تغییر رمز عبور",
                "confirm": "تایید رمز",
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
                "new": "رمز عبور جدید",
                "old": "رمز عبور قدیمی",
                "recoverysuccess": "<em>We have sent you an email with instruction to recover your password.</em>",
                "reset": "<em>Reset password</em>",
                "saved": "<em>Password correctly saved!</em>"
            },
            "pleasecorrecterrors": "لطفا خطاهای مشخص شده را اصلاح کنید",
            "preferences": {
                "comma": "کاما",
                "decimalserror": "فیلد دهدهی باید حضور داشته باشد",
                "decimalstousandserror": "تفکیک کننده دهها و هزاران باید متفاوت باشد",
                "default": "پیش فرض",
                "defaultvalue": "مقدار پیش فرض",
                "firstdayofweek": "<em>First day of week</em>",
                "gridpreferencesclear": "<em>Clear grid preferences</em>",
                "gridpreferencescleared": "<em>Grid preferences cleared!</em>",
                "gridpreferencessave": "<em>Save grid preferences</em>",
                "gridpreferencessaved": "<em>Grid preferences saved!</em>",
                "gridpreferencesupdate": "<em>Update grid preferences</em>",
                "labelcsvseparator": "<em>CSV separator</em>",
                "labeldateformat": "فرمت تاریخ",
                "labeldecimalsseparator": "تفکیک کننده دهم",
                "labellanguage": "زبان",
                "labelthousandsseparator": "هزاران جداساز",
                "labeltimeformat": "فرمت زمان",
                "msoffice": "مایکروسافت آفیس",
                "period": "دوره زمانی",
                "preferredfilecharset": "<em>CSV encoding</em>",
                "preferredofficesuite": "مجموعه اداری ترجیح داده شده",
                "space": "فضا",
                "thousandserror": "عدد هزاران باید حضور داشته باشند",
                "timezone": "منطقه زمانی",
                "twelvehourformat": "فرمت 12 ساعته",
                "twentyfourhourformat": "فرمت 24 ساعته"
            },
            "searchinallitems": "جستجو در همه آیتم ها",
            "treenavcontenttitle": "<em>{0} of {1}</em>",
            "userpreferences": "اولویت ها"
        },
        "menu": {
            "allitems": "همه موارد",
            "classes": "کلاسها",
            "custompages": "صفحات سفارشی",
            "dashboards": "داشبورد",
            "processes": "فرآیندها",
            "reports": "گزارش ها",
            "views": "نمایش"
        },
        "notes": {
            "edit": "ویرایش یاداشت"
        },
        "notifier": {
            "attention": "توجه",
            "error": "خطا",
            "genericerror": "خطای عمومی",
            "genericinfo": "اطلاعات عمومی",
            "genericwarning": "هشدار عمومی",
            "info": "اطلاعات",
            "success": "موفقیت",
            "warning": "هشدار"
        },
        "patches": {
            "apply": "پچ ها را اعمال کنید",
            "category": "دسته بندی",
            "description": "توضیحات",
            "name": "نام",
            "patches": "پچ ها"
        },
        "processes": {
            "abortconfirmation": "آیا مطمئنید که میخواهید این پروسه را نگه دارید؟",
            "abortprocess": "روند را لغو کنید",
            "action": {
                "advance": "جلو",
                "label": "عمل"
            },
            "activeprocesses": "فرآیندهای فعال",
            "allstatuses": "همه",
            "editactivity": "ویرایش فعالیت",
            "openactivity": "فعالیت را باز کنید",
            "startworkflow": "شروع",
            "workflow": "گردش کار"
        },
        "relationGraph": {
            "activity": "<em>activity</em>",
            "allLabelsOnGraph": "<em>all labels on graph</em>",
            "card": "کارت",
            "cardList": "لیست کارت",
            "cardRelations": "رابطه",
            "choosenaviagationtree": "شاخه ناوبری را انتخاب کنید",
            "class": "کلاس",
            "classList": "لیست کلاس",
            "compoundnode": "گره مرکب",
            "disable": "<em>Disable</em>",
            "edges": "<em>Edges</em>",
            "enable": "<em>Enable</em>",
            "labelsOnGraph": "<em>tooltip on graph</em>",
            "level": "سطح",
            "nodes": "<em>Nodes</em>",
            "openRelationGraph": "باز کردن گراف رابطه",
            "qt": "عدد",
            "refresh": "تازه کردن",
            "relation": "رابطه",
            "relationGraph": "رابطه گراف",
            "reopengraph": "باز کردن نمودار از این گره"
        },
        "relations": {
            "adddetail": "اضافه کردن جزئیات",
            "addrelations": "اضافه کردن رابطه",
            "attributes": "خواص",
            "code": "کد",
            "deletedetail": "حذف جزئیات",
            "deleterelation": "حذف رابطه",
            "deleterelationconfirm": "<em>Are you sure you want to delete this relation?</em>",
            "description": "توضیحات",
            "editcard": "ویرایش کارت",
            "editdetail": "ویرایش جزئیات",
            "editrelation": "ویرایش رابطه",
            "extendeddata": "<em>Extended data</em>",
            "mditems": "آیتم ها",
            "missingattributes": "<em>Missing mandatory attributes</em>",
            "opencard": "بازکردن کارتهای مرتبط",
            "opendetail": "نمایش جزئیات",
            "type": "نوع"
        },
        "reports": {
            "csv": "CSV",
            "download": "دانلود",
            "format": "فرمت",
            "odt": "ODT",
            "pdf": "PDF",
            "print": "چاپ",
            "reload": "بارگیری مجدد",
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
            "analysisType": "نوع تجزیه و تحلیل",
            "attribute": "صفت",
            "calculateRules": "<em>Generate style rules</em>",
            "clearThematism": "<em>Clear Thematism</em>",
            "color": "رنگ",
            "defineLegend": "<em>Legend definition</em>",
            "defineThematism": "<em>Thematism definition</em>",
            "function": "تابع",
            "generate": "تولید می کنند",
            "geoAttribute": "<em>Geographic Attribute</em>",
            "graduated": "پله پله",
            "highlightSelected": "برجسته مورد انتخاب شده",
            "intervals": "خلال",
            "legend": "افسانه",
            "name": "<em>name</em>",
            "newThematism": "<em>New Thematism</em>",
            "punctual": "صحیح",
            "quantity": "تعداد",
            "segments": "<em>Segments</em>",
            "source": "منبع",
            "table": "جدول",
            "thematism": "تاملات",
            "value": "مقدار"
        },
        "widgets": {
            "customform": {
                "addrow": "اضافه کردن سطر",
                "clonerow": "شبیه سازی سطر",
                "datanotvalid": "<em>Data not valid</em>",
                "deleterow": "حذف سطر",
                "editrow": "ویرایش سطر",
                "export": "صادرات",
                "import": "وارد كردن",
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
                "refresh": "تازه کردن به پیش فرضها"
            },
            "linkcards": {
                "checkedonly": "<em>Checked only</em>",
                "editcard": "ویرایش کارت",
                "opencard": "کارت را باز کن",
                "refreshselection": "انتخابهای پیشفرض را انجام بده",
                "togglefilterdisabled": "فیلتر شبکه را فعال کنید",
                "togglefilterenabled": "فیلتر شبکه را غیرفعال کنید"
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