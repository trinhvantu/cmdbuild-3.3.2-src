(function() {
    Ext.define('CMDBuildUI.locales.ar.Locales', {
        "requires": ["CMDBuildUI.locales.ar.LocalesAdministration"],
        "override": "CMDBuildUI.locales.Locales",
        "singleton": true,
        "localization": "ar",
        "administration": CMDBuildUI.locales.ar.LocalesAdministration.administration,
        "attachments": {
            "add": "أضف مرفق",
            "attachmenthistory": "تاريخ المرفق",
            "author": "المؤلف",
            "browse": "<em>Browse &hellip;</em>",
            "category": "الفئة",
            "code": "<em>Code</em>",
            "creationdate": "تاريخ الإنشاء",
            "deleteattachment": "حذف المرفق",
            "deleteattachment_confirmation": "هل أنت متأكد من حذف المرفق؟",
            "description": "الوصف",
            "download": "تنزيل",
            "dropfiles": "<em>Drop files here</em>",
            "editattachment": "تعديل المرفق",
            "file": "ملف",
            "filealreadyinlist": "<em>The file {0} is already in list.</em>",
            "filename": "اسم الملف",
            "fileview": "<em>View attachment</em>",
            "invalidfiles": "<em>Remove invalid files</em>",
            "majorversion": "الإصدار الرئيسي",
            "modificationdate": "تاريخ التعديل",
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
            "uploadfile": "رفع ملف...",
            "version": "الإصدار",
            "viewhistory": "عرض تاريخ المرفق",
            "warningmessages": {
                "atleast": "<em>Warning: has been loaded {0} attachments of type \"{1}\". This category expects at least {2} attachments </em>",
                "exactlynumber": "<em>Warning: has been loaded {0} attachments of type \"{1}\". This category expects {2} attachments</em>",
                "maxnumber": "<em>Warning: has been loaded {0} attachment of type \"{1}\". This category expects at most {2}  attachments</em>"
            },
            "wrongfileextension": "<em>{0} file extension is not allowed</em>"
        },
        "bim": {
            "bimViewer": "عارض نمذجة معلومات البناء",
            "card": {
                "label": "البطاقة"
            },
            "layers": {
                "label": "الطبقات",
                "menu": {
                    "hideAll": "إخفاء الكل",
                    "showAll": "عرض الكل"
                },
                "name": "الاسم",
                "qt": "الكم",
                "visibility": "المرئية"
            },
            "menu": {
                "camera": "الكاميرا",
                "frontView": "عرض أمامي",
                "mod": "متحكمات العارض",
                "orthographic": "الكاميرا التصويرية",
                "pan": "تمرير",
                "perspective": "الكاميرا المنظورية",
                "resetView": "عرض طبيعي",
                "rotate": "تدوير",
                "sideView": "عرض جانبي",
                "topView": "عرض علوي"
            },
            "showBimCard": "فتح العارض الثلاثي الأبعاد",
            "tree": {
                "arrowTooltip": "ما يجب عمله",
                "columnLabel": "الشجرة",
                "label": "الشجرة",
                "open_card": "فتح البطاقة ذات الصلة",
                "root": "جذر IFC"
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
            "add": "أضف",
            "advancenotification": "الاشعارات المتقدمة",
            "allcategories": "كل الفئات",
            "alldates": "كل التواريخ",
            "calculated": "<em>calculated</em>",
            "calendar": "التقويم",
            "cancel": "<em>Mark as cancelled</em>",
            "category": "الفئة",
            "cm_confirmcancel": "<em>Are you sure you want to mark as cancelled selected schedules?</em>",
            "cm_confirmcomplete": "<em>Are you sure you want to mark as complited selected schedules?</em>",
            "cm_markcancelled": "<em>Mark as cancelled selected schedules</em>",
            "cm_markcomplete": "<em>Mark as completed selected schedules</em>",
            "complete": "المكتمل",
            "completed": "<em>Completed</em>",
            "date": "التاريح",
            "days": "<em>Days</em>",
            "delaybeforedeadline": "<em>Delay before deadline</em>",
            "delaybeforedeadlinevalue": "<em>Delay before deadline value</em>",
            "description": "الوصف",
            "editevent": "تحرير الجدول",
            "enddate": "تاريخ الانتهاء",
            "endtype": "<em>End type</em>",
            "event": "الجدول",
            "executiondate": "تاريخ التنفيذ",
            "frequency": "الوتيرة",
            "frequencymultiplier": "<em>Frequency multiplier</em>",
            "grid": "الشبكة",
            "leftdays": "باقي الأيام",
            "londdescription": "كامل الوصف",
            "manual": "<em>Manual</em>",
            "maxactiveevents": "أقصى عدد للفعاليات النشطة",
            "messagebodydelete": "هل تود إزالة قاعدة الجداول؟",
            "messagebodyplural": "هناك عدد {0} قاعدة للجدول",
            "messagebodyrecalculate": "هل تود إعادة حساب قاعدة الجداول بالتاريخ الجديد؟",
            "messagebodysingular": "هناك قاعدة {0} للجدول",
            "messagetitle": "إعادة حساب الجدول",
            "missingdays": "<em>Missing days</em>",
            "next30days": "الأيام الثلاثين التالية",
            "next7days": "الأيام السبعة التالية",
            "notificationtemplate": "<em>Template used for notification</em>",
            "notificationtext": "<em>Notification text</em>",
            "occurencies": "عدد التكرار",
            "operation": "<em>Operation</em>",
            "partecipantgroup": "<em>Partecipant group</em>",
            "partecipantuser": "<em>Partecipant user</em>",
            "priority": "الأولوية",
            "recalculate": "إعادة الحساب",
            "referent": "المرجع",
            "scheduler": "المجدول",
            "sequencepaneltitle": "توليد الجداول",
            "startdate": "تاريخ البدء",
            "status": "الحالة",
            "today": "اليوم",
            "type": "النوع",
            "viewevent": "عرض الجدول",
            "widgetcriterion": "<em>Calculation criterion</em>",
            "widgetemails": "<em>Emails</em>",
            "widgetsourcecard": "<em>Source card</em>"
        },
        "classes": {
            "cards": {
                "addcard": "أضف بطاقة",
                "clone": "نسخ",
                "clonewithrelations": "نسخ البطاقة والعلاقات",
                "deletebeaware": "<em>Be aware that:</em>",
                "deleteblocked": "<em>It is not possible to proceed with the deletion because there are relations with {0}.</em>",
                "deletecard": "حذف بطاقة",
                "deleteconfirmation": "هل أنت متأكد من حذف هذه البطاقة؟",
                "deleterelatedcards": "<em>also {0} related cards will be deleted</em>",
                "deleterelations": "<em>relations with {0} cards will be deleted</em>",
                "label": "البطاقات",
                "modifycard": "تعديل البطاقة",
                "opencard": "فتح البطاقة",
                "print": "طباعة البطاقة"
            },
            "simple": "بسيط",
            "standard": "قياسي"
        },
        "common": {
            "actions": {
                "add": "أضف",
                "apply": "تطبيق",
                "cancel": "إلغاء",
                "close": "غلق",
                "delete": "حذف",
                "edit": "تحرير",
                "execute": "تنفيذ",
                "help": "<em>Help</em>",
                "load": "رفع",
                "open": "فتح",
                "refresh": "تحديث البيانات",
                "remove": "حذف",
                "save": "حفظ",
                "saveandapply": "حفظ وإعمال",
                "saveandclose": "حفظ وغلق",
                "search": "بحث",
                "searchtext": "بحث..."
            },
            "attributes": {
                "nogroup": "البيانات الأساسية"
            },
            "dates": {
                "date": "d/m/Y",
                "datetime": "d/m/Y H:i:s",
                "time": "H:i:s"
            },
            "editor": {
                "clearhtml": "تصفية الـ HTML",
                "expand": "<em>Expand editor</em>",
                "reduce": "<em>Reduce editor</em>",
                "unlink": "<em>Unlink</em>",
                "unlinkmessage": "<em>Transform the selected hyperlink into text.</em>"
            },
            "grid": {
                "disablemultiselection": "تعطيل التحديد المتعدد",
                "enamblemultiselection": "تفعيل التحديد المتعدد",
                "export": "تصدير البيانات",
                "filterremoved": "تم حذف الفرز الحالي",
                "import": "استيراد البيانات",
                "itemnotfound": "العنصر غير موجود",
                "list": "القائمة",
                "opencontextualmenu": "فتح قائمة السياق",
                "print": "طباعة",
                "printcsv": "طباعة كـ CSV",
                "printodt": "طباعة كـ ODT",
                "printpdf": "طباعة كـ PDF",
                "row": "عنصر",
                "rows": "عناصر",
                "subtype": "نوع فرعي"
            },
            "tabs": {
                "activity": "النشاط",
                "attachment": "<em>Attachment</em>",
                "attachments": "المرفقات",
                "card": "البطاقة",
                "clonerelationmode": "استنسخ وضع العلاقات",
                "details": "التفاصيل",
                "emails": "الرسائل",
                "history": "التاريخ",
                "notes": "الملاحظات",
                "relations": "العلاقات",
                "schedules": "الجداول"
            }
        },
        "dashboards": {
            "tools": {
                "gridhide": "<em>Hide data grid</em>",
                "gridshow": "<em>Show data grid</em>",
                "parametershide": "<em>Hide data parameters</em>",
                "parametersshow": "<em>Show data parameters</em>",
                "reload": "إعادة الرفع"
            }
        },
        "emails": {
            "addattachmentsfromdocumentarchive": "<em>Add attachments from the document archive</em>",
            "alredyexistfile": "هناك ملف موجود يحمل نفس الاسم",
            "archivingdate": "تاريخ الأرشفة",
            "attachfile": "أرفق ملف",
            "bcc": "نسخة كبرونية عمياء",
            "cc": "نسخة كربونية",
            "composeemail": "أنشئ بريد إلكتروني",
            "composefromtemplate": "أنشئ من قالب",
            "delay": "التأخير",
            "delays": {
                "day1": "في يوم واحد",
                "days2": "في يومين",
                "days4": "في أربعة أيام",
                "hour1": "ساعة واحدة",
                "hours2": "ساعتان",
                "hours4": "أربع ساعات",
                "month1": "في شهر واحد",
                "negativeday1": "قبل يوم",
                "negativedays2": "قبل يومين",
                "negativedays4": "قبل أربعة أيام",
                "negativehour1": "قبل ساعة",
                "negativehours2": "قبل ساعتين",
                "negativehours4": "قبل أربعة ساعات",
                "negativemonth1": "قبل شهر",
                "negativeweek1": "قبل اسبوع",
                "negativeweeks2": "قبل اسبوعين",
                "none": "بلا",
                "week1": "في اسبوع",
                "weeks2": "في اسبوعان"
            },
            "dmspaneltitle": "اختر مرفقات من قاعدة البيانات",
            "edit": "تحرير",
            "from": "من",
            "gridrefresh": "إعادة تحميل لائحة البطافات",
            "keepsynchronization": "أبقي متزامن",
            "message": "الرسالة",
            "regenerateallemails": "إعادة تجديد كل الرسائل الإلكترونية",
            "regenerateemail": "إعادة تجديد الرسالة الإلكترونية",
            "remove": "حذف",
            "remove_confirmation": "هل أنت متأكد من حذف هذه الرسائل؟",
            "reply": "الرد",
            "replyprefix": "على {0}, {1} كتب:",
            "selectaclass": "اختر صنف",
            "sendemail": "أرسل رسالة",
            "statuses": {
                "draft": "مسودة",
                "error": "<em>Error</em>",
                "outgoing": "صادر",
                "received": "مستلم",
                "sent": "مرسل"
            },
            "subject": "العنوان",
            "to": "إلى",
            "view": "عرض"
        },
        "errors": {
            "autherror": "اسم مستخدم وكلمة سر غير صحيحة",
            "classnotfound": "الصنف {0} لا يوجد",
            "fieldrequired": "هذا الحقل مطلوب",
            "invalidfilter": "تصفية غير صحيحة",
            "notfound": "العنصر غير موجود"
        },
        "filters": {
            "actions": "الأفعال",
            "addfilter": "أضف فرز",
            "any": "أي",
            "attachments": "<em>Attachments</em>",
            "attachmentssearchtext": "<em>Attachments search text</em>",
            "attribute": "اختر سمة",
            "attributes": "السمات",
            "clearfilter": "مسح الفرز",
            "clone": "نسخ",
            "copyof": "نسخة من",
            "currentgroup": "المجموعة الحالية",
            "currentuser": "المستخدم الحالي",
            "defaultset": "تعيين كافتراضي",
            "defaultunset": "ألغ تعيينه كافتراضي",
            "description": "الوصف",
            "domain": "العلاقة",
            "filterdata": "بيانات الفرز",
            "fromfilter": "<em>From filter</em>",
            "fromselection": "من المُختار",
            "group": "المجموعة",
            "ignore": "إهمال",
            "migrate": "ترحيل",
            "name": "اسم",
            "newfilter": "فرز جديد",
            "noone": "لا أحد",
            "operator": "العملية",
            "operators": {
                "beginswith": "يبدأ بـ",
                "between": "بين",
                "contained": "تتضمن",
                "containedorequal": "تتضمن أو تساوي",
                "contains": "تحتوي",
                "containsorequal": "تحتوي أو تساوي",
                "descriptionbegin": "<em>Description begins with</em>",
                "descriptioncontains": "<em>Description contains</em>",
                "descriptionends": "<em>Description ends with</em>",
                "descriptionnotbegin": "<em>Description does not begins with</em>",
                "descriptionnotcontain": "<em>Description does not contain</em>",
                "descriptionnotends": "<em>Description does not ends with</em>",
                "different": "مختلف",
                "doesnotbeginwith": "لا يبدأ بـ ",
                "doesnotcontain": "لا يحتوي على",
                "doesnotendwith": "لا ينتهي بـ",
                "endswith": "ينتهي بـ",
                "equals": "يساوي",
                "greaterthan": "أكبر من",
                "isnotnull": "ليس بفارغ",
                "isnull": "فارغ",
                "lessthan": "أصغر من"
            },
            "relations": "العلاقات",
            "type": "النوع",
            "typeinput": "المعامل المدخل",
            "user": "المستخدم",
            "value": "القيمة"
        },
        "gis": {
            "card": "البطاقة",
            "cardsMenu": "قائمة البطاقات",
            "code": "الرمز",
            "description": "الوصف",
            "extension": {
                "errorCall": "خطأ",
                "noResults": "لا نتائج"
            },
            "externalServices": "الخدمات الخارجية",
            "geographicalAttributes": "السمات الجغرافية",
            "geoserverLayers": "طبقات الـ Geoserver",
            "layers": "الطبقات",
            "list": "اللائحة",
            "longpresstitle": "عناصر الجيو في المساحة",
            "map": "الخريطة",
            "mapServices": "خدمات الخريطة",
            "position": "الموضع",
            "root": "الجذر",
            "tree": "شجرة الملاحة",
            "type": "النوغ",
            "view": "عرض",
            "zoom": "تكبير"
        },
        "history": {
            "activityname": "اسم النشاط",
            "activityperformer": "منجز النشاط",
            "begindate": "تاريخ البداية",
            "enddate": "تاريخ النهاية",
            "processstatus": "الحالة",
            "user": "المستخدم"
        },
        "importexport": {
            "database": {
                "uri": "<em>Database URI</em>",
                "user": "<em>Database user</em>"
            },
            "downloadreport": "تنزيل التقرير",
            "emailfailure": "حدث خطأ أثناء إرسال البريد!",
            "emailmessage": "المرفق تقرير الاستيراد من ملف \"{0}\" في تاريخ {1}",
            "emailsubject": "استيراد تقرير البيانات",
            "emailsuccess": "تم إرسال البريد بنجاح!",
            "export": "تصدير",
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
            "import": "استيراد",
            "importresponse": "استيراد الرد",
            "response": {
                "created": "العناصر المنشئة",
                "deleted": "العناصر المحذوفة",
                "errors": "الأخطاء",
                "linenumber": "رقم السطر",
                "message": "الرسالة",
                "modified": "العناصر المعدلة",
                "processed": "الصفوف المعالجة",
                "recordnumber": "رقم السجل",
                "unmodified": "العناصر غير المعدلة"
            },
            "sendreport": "إرسال التقرير",
            "template": "قالب",
            "templatedefinition": "تعريف القالب"
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
                "login": "الدخول",
                "logout": "تغيير المستخدم"
            },
            "fields": {
                "group": "المجموعة",
                "language": "اللغة",
                "password": "كلمة السر",
                "tenants": "المستأجرين",
                "username": "اسم المستخدم"
            },
            "loggedin": "مسجل الدخول",
            "title": "الدخول",
            "welcome": "مرحبا {0}."
        },
        "main": {
            "administrationmodule": "لوحة الإدارة",
            "baseconfiguration": "الإعدادات الأساسية",
            "cardlock": {
                "lockedmessage": "لا يمكنك تحرير هذه البطاقة لأن {0} قاعد يحررها.",
                "someone": "شخص ما"
            },
            "changegroup": "تغيير المجموعة",
            "changetenant": "<em>Change {0}</em>",
            "confirmchangegroup": "هل أنت متأكد من أنك تريد تغيير هذه المجموعة؟",
            "confirmchangetenants": "هل أنت متأكد من تغيير المستأجرين النشطين؟",
            "confirmdisabletenant": "هل أنت متأكد من تعطيل خيار \"تجاهل المستأجرين\"?",
            "confirmenabletenant": "هل أنت متأكد من أنك تريد تنشيط خيار \"تجاهل المستأجرين\"?",
            "ignoretenants": "<em>Ignore {0}</em>",
            "info": "معلومات",
            "logo": {
                "cmdbuild": "CMDBuild شعار",
                "cmdbuildready2use": "CMDBuild READY2USE شعار",
                "companylogo": "شعار الشركة",
                "openmaint": "openMAINT شعار"
            },
            "logout": "خروج",
            "managementmodule": "وحدة إدارة البيانات",
            "multigroup": "متعدد المجموعة",
            "multitenant": "<em>Multi {0}</em>",
            "navigation": "الملاحة",
            "pagenotfound": "الصفحة غير موجودة",
            "password": {
                "change": "تغيير كلمة السر",
                "confirm": "تأكيد كلمة السر",
                "email": "عنوان البريد الإلكتروني",
                "err_confirm": "كلمتا السر ليستا متطابقتان",
                "err_diffprevious": "لا يمكن استعمال كلمات سر سابقة",
                "err_diffusername": "لا يمكن أن تكون كلمة السر نفس اسم المستخدم",
                "err_length": "يجب أن لا يقل طول كلمة السر عن {0} حرفًا",
                "err_reqdigit": "يجب أن تحتوي كلمة السر على رقما واحدًا على الأقل.",
                "err_reqlowercase": "يجب أن تحتوي كلمة السر على حرفًا صغيرًا واحدًا على الأقل.",
                "err_requppercase": "يجب أن تحتوي كلمة السر على حرفًا كبيرًا واحدًا على الأقل.",
                "expired": "لقد انتهت صلاحية كلمة سرك. لابد من تغييرها الآن.",
                "forgotten": "أنا لا أذكر كلمة السر",
                "new": "كلمة السر الجديدة",
                "old": "كلمة السر القديمة",
                "recoverysuccess": "لقد بعثنا لك بريدًا إلكترونيًا في تعليمات عن كيفية إرجاع كلمة سرك.",
                "reset": "إعادة تعيين كلمة السر",
                "saved": "تم حفظ كلمة السر بنجاح!"
            },
            "pleasecorrecterrors": "رجاءً، صحح الأخطاء المشار إليها!",
            "preferences": {
                "comma": "فاصلة",
                "decimalserror": "حقل عشري يجب أن يكون حاضر",
                "decimalstousandserror": "يجب أن تكونا الفاصلة العشرية والألفية مختلفتان",
                "default": "الافتراضي",
                "defaultvalue": "القيمة الأساسية",
                "firstdayofweek": "<em>First day of week</em>",
                "gridpreferencesclear": "محو شبكة التفضيلات",
                "gridpreferencescleared": "تم محو شبكة التفضيلات",
                "gridpreferencessave": "حفظ شبكة التفضيلات",
                "gridpreferencessaved": "تم حفظ شبكة التفضيلات",
                "gridpreferencesupdate": "تحديث شبكة التفضيلات",
                "labelcsvseparator": "<em>CSV separator</em>",
                "labeldateformat": "نسق التاريخ",
                "labeldecimalsseparator": "الفاصلة العشرية",
                "labellanguage": "اللغة",
                "labelthousandsseparator": "الفاصلة الألفية",
                "labeltimeformat": "نسق الوقت",
                "msoffice": "مايكروسوفت أوفيس",
                "period": "الفترة",
                "preferredfilecharset": "<em>CSV encoding</em>",
                "preferredofficesuite": "حزمة الأوفيس المفضلة",
                "space": "مسافة",
                "thousandserror": "حقل ألفي يجب أن يكون حاضر",
                "timezone": "المنطقة الزمنية",
                "twelvehourformat": "نظام الـ 12 ساعة",
                "twentyfourhourformat": "نظام الـ 24 ساعة"
            },
            "searchinallitems": "بحث في كل العناصر",
            "treenavcontenttitle": "<em>{0} of {1}</em>",
            "userpreferences": "التفضيلات"
        },
        "menu": {
            "allitems": "كل العناصر",
            "classes": "الأصناف",
            "custompages": "الصفحات الخيارية",
            "dashboards": "لوح المعلومات",
            "processes": "الآليات",
            "reports": "التقارير",
            "views": "الاشتقاقات"
        },
        "notes": {
            "edit": "تعديل الملاحظة"
        },
        "notifier": {
            "attention": "انتباه",
            "error": "خطأ",
            "genericerror": "خطأ عام",
            "genericinfo": "معلومة عامة",
            "genericwarning": "تنبيه عام",
            "info": "معلومات",
            "success": "نجاح",
            "warning": "تنبيه"
        },
        "patches": {
            "apply": "تطبيق التغييرات",
            "category": "الفئة",
            "description": "الوصف",
            "name": "الاسم",
            "patches": "التغييرات"
        },
        "processes": {
            "abortconfirmation": "هل أنت متأكد من أنك تريد أن تجهض هذه الآلية؟",
            "abortprocess": "إجهاض الآلية",
            "action": {
                "advance": "تقدم",
                "label": "فعل"
            },
            "activeprocesses": "العمليات النشطة",
            "allstatuses": "الكل",
            "editactivity": "تحرير النشاط",
            "openactivity": "فتح نشاط",
            "startworkflow": "بدء",
            "workflow": "الآلية"
        },
        "relationGraph": {
            "activity": "النشاط",
            "allLabelsOnGraph": "<em>all labels on graph</em>",
            "card": "البطاقة",
            "cardList": "قائمة البطاقة",
            "cardRelations": "العلاقة",
            "choosenaviagationtree": "اختر شجرة التنقل",
            "class": "الصنف",
            "classList": "قائمة الصنف",
            "compoundnode": "العقدة المركبة",
            "disable": "<em>Disable</em>",
            "edges": "<em>Edges</em>",
            "enable": "<em>Enable</em>",
            "labelsOnGraph": "<em>tooltip on graph</em>",
            "level": "المستوى",
            "nodes": "<em>Nodes</em>",
            "openRelationGraph": "فتح مخطوطة العلاقات",
            "qt": "كم",
            "refresh": "تحديث",
            "relation": "العلاقة",
            "relationGraph": "رسمة العلاقات",
            "reopengraph": "فتح الرسمة من هذه العقدة"
        },
        "relations": {
            "adddetail": "أضف تفصيل",
            "addrelations": "أضف علاقات",
            "attributes": "السمات",
            "code": "الرمز",
            "deletedetail": "حذف تفصيل",
            "deleterelation": "حذف علاقة",
            "deleterelationconfirm": "<em>Are you sure you want to delete this relation?</em>",
            "description": "الوصف",
            "editcard": "تعديل البطاقة",
            "editdetail": "تحرير تفصيل",
            "editrelation": "تحرير العلاقة",
            "extendeddata": "<em>Extended data</em>",
            "mditems": "العناصر",
            "missingattributes": "سمات إجبارية مفقودة",
            "opencard": "فتح البطاقة ذات الصلة",
            "opendetail": "أظهر التفصيل",
            "type": "النوع"
        },
        "reports": {
            "csv": "CSV",
            "download": "تنزيل",
            "format": "تنسيق",
            "odt": "ODT",
            "pdf": "PDF",
            "print": "طباعة",
            "reload": "إعادة تحميل",
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
            "addThematism": "إضافة موضوع",
            "analysisType": "نوع التحليل",
            "attribute": "سمة",
            "calculateRules": "توليد قواعد النمط",
            "clearThematism": "محو الموضوع",
            "color": "لون",
            "defineLegend": "تعريف المفاتيح",
            "defineThematism": "تعريف الموضوع",
            "function": "وظيفة",
            "generate": "توليد",
            "geoAttribute": "السمات الجغرافية",
            "graduated": "متدرج",
            "highlightSelected": "حدد العناصر المختارة",
            "intervals": "المراحل",
            "legend": "المفاتيح",
            "name": "الاسم",
            "newThematism": "موضوع جديد",
            "punctual": "دقيق",
            "quantity": "كمية",
            "segments": "القطاعات",
            "source": "المصدر",
            "table": "جدول",
            "thematism": "المواضيع",
            "value": "قيمة"
        },
        "widgets": {
            "customform": {
                "addrow": "أضف صف",
                "clonerow": "انسخ صف",
                "datanotvalid": "<em>Data not valid</em>",
                "deleterow": "حذف صف",
                "editrow": "تحرير صف",
                "export": "تصدير",
                "import": "استيراد",
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
                "refresh": "ارجع القيم الافتراضية"
            },
            "linkcards": {
                "checkedonly": "<em>Checked only</em>",
                "editcard": "تحرير البطاقة",
                "opencard": "فتح البطاقة",
                "refreshselection": "إعمال الخيارات الأساسية",
                "togglefilterdisabled": "تعطيل الفرز على لائحة البطاقات",
                "togglefilterenabled": "تمكين الفرز على لائحة البطاقات"
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