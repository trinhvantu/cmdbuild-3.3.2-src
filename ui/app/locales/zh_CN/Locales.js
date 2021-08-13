(function() {
    Ext.define('CMDBuildUI.locales.zh_CN.Locales', {
        "requires": ["CMDBuildUI.locales.zh_CN.LocalesAdministration"],
        "override": "CMDBuildUI.locales.Locales",
        "singleton": true,
        "localization": "zh_CN",
        "administration": CMDBuildUI.locales.zh_CN.LocalesAdministration.administration,
        "attachments": {
            "add": "增加附件",
            "attachmenthistory": "附件历史",
            "author": "作者",
            "browse": "<em>Browse &hellip;</em>",
            "category": "类别",
            "code": "<em>Code</em>",
            "creationdate": "创建日期",
            "deleteattachment": "删除附件",
            "deleteattachment_confirmation": "确定要删除附件？",
            "description": "描述",
            "download": "下载",
            "dropfiles": "<em>Drop files here</em>",
            "editattachment": "修改附件",
            "file": "文件",
            "filealreadyinlist": "<em>The file {0} is already in list.</em>",
            "filename": "文件名称",
            "fileview": "<em>View attachment</em>",
            "invalidfiles": "<em>Remove invalid files</em>",
            "majorversion": "主版本",
            "modificationdate": "变更日期",
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
            "uploadfile": "上传文件",
            "version": "版本",
            "viewhistory": "查看附件历史",
            "warningmessages": {
                "atleast": "<em>Warning: has been loaded {0} attachments of type \"{1}\". This category expects at least {2} attachments </em>",
                "exactlynumber": "<em>Warning: has been loaded {0} attachments of type \"{1}\". This category expects {2} attachments</em>",
                "maxnumber": "<em>Warning: has been loaded {0} attachment of type \"{1}\". This category expects at most {2}  attachments</em>"
            },
            "wrongfileextension": "<em>{0} file extension is not allowed</em>"
        },
        "bim": {
            "bimViewer": "BIM视图",
            "card": {
                "label": "卡片"
            },
            "layers": {
                "label": "层",
                "menu": {
                    "hideAll": "隐藏所有",
                    "showAll": "显示所有"
                },
                "name": "名称",
                "qt": "Ifc 根",
                "visibility": "可见性"
            },
            "menu": {
                "camera": "相机",
                "frontView": "前置视图",
                "mod": "<em>Viewer controls</em>",
                "orthographic": "正交相机",
                "pan": "滚动",
                "perspective": "透视相机",
                "resetView": "重置视图",
                "rotate": "旋转",
                "sideView": "边视图",
                "topView": "顶部视图"
            },
            "showBimCard": "打开3D视图",
            "tree": {
                "arrowTooltip": "选择元素",
                "columnLabel": "树",
                "label": "树",
                "open_card": "打开关系卡片",
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
                "addcard": "增加卡片",
                "clone": "克隆",
                "clonewithrelations": "克隆卡片和关系",
                "deletebeaware": "<em>Be aware that:</em>",
                "deleteblocked": "<em>It is not possible to proceed with the deletion because there are relations with {0}.</em>",
                "deletecard": "删除卡片",
                "deleteconfirmation": "确定要删除该卡片？",
                "deleterelatedcards": "<em>also {0} related cards will be deleted</em>",
                "deleterelations": "<em>relations with {0} cards will be deleted</em>",
                "label": "卡片",
                "modifycard": "修改卡片",
                "opencard": "打开卡片",
                "print": "打印卡片"
            },
            "simple": "简单",
            "standard": "标准"
        },
        "common": {
            "actions": {
                "add": "增加",
                "apply": "应用",
                "cancel": "取消",
                "close": "关闭",
                "delete": "删除",
                "edit": "编辑",
                "execute": "执行",
                "help": "<em>Help</em>",
                "load": "<em>Load</em>",
                "open": "<em>Open</em>",
                "refresh": "刷新数据",
                "remove": "删除",
                "save": "保存",
                "saveandapply": "保存并应用",
                "saveandclose": "保存并关闭",
                "search": "搜索",
                "searchtext": "搜索"
            },
            "attributes": {
                "nogroup": "基本数据"
            },
            "dates": {
                "date": "d/m/Y",
                "datetime": "d/m/Y H:i:s",
                "time": "H:i:s"
            },
            "editor": {
                "clearhtml": "清除HTML",
                "expand": "<em>Expand editor</em>",
                "reduce": "<em>Reduce editor</em>",
                "unlink": "<em>Unlink</em>",
                "unlinkmessage": "<em>Transform the selected hyperlink into text.</em>"
            },
            "grid": {
                "disablemultiselection": "禁止多选",
                "enamblemultiselection": "开启多选",
                "export": "导出数据",
                "filterremoved": "该过滤已经被删除",
                "import": "导入数据",
                "itemnotfound": "未发现项目",
                "list": "列表",
                "opencontextualmenu": "打开上下文菜单",
                "print": "打印",
                "printcsv": "打印为CSV",
                "printodt": "打印为ODT",
                "printpdf": "打印为PDF",
                "row": "条目",
                "rows": "条目",
                "subtype": "子类"
            },
            "tabs": {
                "activity": "活动",
                "attachment": "<em>Attachment</em>",
                "attachments": "附件",
                "card": "卡片",
                "clonerelationmode": "<em>Clone Relations Mode</em>",
                "details": "明细",
                "emails": "邮件",
                "history": "历史",
                "notes": "备注",
                "relations": "关系",
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
            "alredyexistfile": "一个同名文件已经存在",
            "archivingdate": "存档日期",
            "attachfile": "附加文件",
            "bcc": "Bcc",
            "cc": "Cc",
            "composeemail": "编辑 e-mail",
            "composefromtemplate": "Compose from template",
            "delay": "延迟",
            "delays": {
                "day1": "在1天里",
                "days2": "在2天里",
                "days4": "在4天里",
                "hour1": "1个小时",
                "hours2": "2个小时",
                "hours4": "4个小时",
                "month1": "在1个月内",
                "negativeday1": "<em>1 day before</em>",
                "negativedays2": "<em>2 days before</em>",
                "negativedays4": "<em>4 days before</em>",
                "negativehour1": "<em>1 hour before</em>",
                "negativehours2": "<em>2 hours before</em>",
                "negativehours4": "<em>4 hours before</em>",
                "negativemonth1": "<em>1 month before</em>",
                "negativeweek1": "<em>1 week before</em>",
                "negativeweeks2": "<em>2 weeks before</em>",
                "none": "空",
                "week1": "在1周内",
                "weeks2": "在2周内"
            },
            "dmspaneltitle": "在数据库中选择附件",
            "edit": "编辑",
            "from": "从",
            "gridrefresh": "格子更新",
            "keepsynchronization": "保持同步",
            "message": "消息",
            "regenerateallemails": "重新生成所有e-mails",
            "regenerateemail": "重新生成e-mail",
            "remove": "删除",
            "remove_confirmation": "确定要删除该邮件？",
            "reply": "回复",
            "replyprefix": "在{0}上",
            "selectaclass": "选择类",
            "sendemail": "发送邮件",
            "statuses": {
                "draft": "草稿",
                "error": "<em>Error</em>",
                "outgoing": "发件箱",
                "received": "收件箱",
                "sent": "已发送"
            },
            "subject": "主题",
            "to": "到",
            "view": "浏览"
        },
        "errors": {
            "autherror": "错误用户名或密码",
            "classnotfound": "未发现类{0}",
            "fieldrequired": "<em>This field is required</em>",
            "invalidfilter": "<em>Invalid filter</em>",
            "notfound": "未发现项目"
        },
        "filters": {
            "actions": "动作",
            "addfilter": "增加过滤器",
            "any": "任何",
            "attachments": "<em>Attachments</em>",
            "attachmentssearchtext": "<em>Attachments search text</em>",
            "attribute": "选择一个属性",
            "attributes": "属性",
            "clearfilter": "清除过滤器",
            "clone": "克隆",
            "copyof": "拷贝",
            "currentgroup": "<em>Current group</em>",
            "currentuser": "<em>Current user</em>",
            "defaultset": "<em>Set as default</em>",
            "defaultunset": "<em>Unset from default</em>",
            "description": "描述",
            "domain": "域",
            "filterdata": "过滤数据",
            "fromfilter": "<em>From filter</em>",
            "fromselection": "从...选择",
            "group": "<em>Group</em>",
            "ignore": "忽略",
            "migrate": "移植",
            "name": "名称",
            "newfilter": "新建过滤",
            "noone": "无",
            "operator": "操作符",
            "operators": {
                "beginswith": "以　开始",
                "between": "在　之间",
                "contained": "受限的",
                "containedorequal": "受限或相当的",
                "contains": "包涵",
                "containsorequal": "包含或等于",
                "descriptionbegin": "<em>Description begins with</em>",
                "descriptioncontains": "<em>Description contains</em>",
                "descriptionends": "<em>Description ends with</em>",
                "descriptionnotbegin": "<em>Description does not begins with</em>",
                "descriptionnotcontain": "<em>Description does not contain</em>",
                "descriptionnotends": "<em>Description does not ends with</em>",
                "different": "不同",
                "doesnotbeginwith": "不以...开始",
                "doesnotcontain": "为包括",
                "doesnotendwith": "不以...结束",
                "endswith": "以...结束",
                "equals": "相等",
                "greaterthan": "大于",
                "isnotnull": "是非零型",
                "isnull": "是非零型",
                "lessthan": "小于"
            },
            "relations": "关系",
            "type": "类型",
            "typeinput": "输入参数",
            "user": "<em>User</em>",
            "value": "值"
        },
        "gis": {
            "card": "卡片",
            "cardsMenu": "卡片菜单",
            "code": "<em>Code</em>",
            "description": "<em>Description</em>",
            "extension": {
                "errorCall": "<em>Error</em>",
                "noResults": "<em>No Results</em>"
            },
            "externalServices": "外部服务",
            "geographicalAttributes": "地理属性",
            "geoserverLayers": "地理信息服务器层",
            "layers": "层",
            "list": "清单",
            "longpresstitle": "<em>Geoelements in area</em>",
            "map": "地图",
            "mapServices": "地图服务",
            "position": "位置",
            "root": "根",
            "tree": "导航树",
            "type": "<em>Type</em>",
            "view": "浏览",
            "zoom": "缩放"
        },
        "history": {
            "activityname": "活动名称",
            "activityperformer": "活动执行者",
            "begindate": "开始日期",
            "enddate": "结束日期",
            "processstatus": "状态",
            "user": "用户"
        },
        "importexport": {
            "database": {
                "uri": "<em>Database URI</em>",
                "user": "<em>Database user</em>"
            },
            "downloadreport": "下载报表",
            "emailfailure": "发送邮件时发生错误",
            "emailmessage": "<em>Attached import report of file \"{0}\" in date {1}</em>",
            "emailsubject": "导入数据报表",
            "emailsuccess": "邮件已成功发送",
            "export": "导出",
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
            "import": "导入",
            "importresponse": "导入响应",
            "response": {
                "created": "已创建条目",
                "deleted": "已删除条目",
                "errors": "错误",
                "linenumber": "行号",
                "message": "消息",
                "modified": "已修改条目",
                "processed": "已处理行",
                "recordnumber": "记录编号",
                "unmodified": "未修改条目"
            },
            "sendreport": "发送报表",
            "template": "模板",
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
                "login": "登录",
                "logout": "用户"
            },
            "fields": {
                "group": "组",
                "language": "语言",
                "password": "密码",
                "tenants": "租户",
                "username": "用户名"
            },
            "loggedin": "已登录",
            "title": "登录",
            "welcome": "欢迎{0}归来"
        },
        "main": {
            "administrationmodule": "管理模块",
            "baseconfiguration": "基本配置",
            "cardlock": {
                "lockedmessage": "无法进行编辑，因为{0}正在编辑",
                "someone": "某人"
            },
            "changegroup": "变更组",
            "changetenant": "<em>Change {0}</em>",
            "confirmchangegroup": "确定要变更组？",
            "confirmchangetenants": "确定要变更活动租户？",
            "confirmdisabletenant": "确定要禁用“忽略租户”标志？",
            "confirmenabletenant": "确定要开启“忽略租户”标志？",
            "ignoretenants": "<em>Ignore {0}</em>",
            "info": "信息",
            "logo": {
                "cmdbuild": "CMDBuild 图标",
                "cmdbuildready2use": "CMDBuild READY2USE 图标",
                "companylogo": "公司logo",
                "openmaint": "openMAINT 图标"
            },
            "logout": "退出",
            "managementmodule": "数据管理模块",
            "multigroup": "群组",
            "multitenant": "<em>Multi {0}</em>",
            "navigation": "导航",
            "pagenotfound": "页面为找到",
            "password": {
                "change": "更改密码",
                "confirm": "确认密码",
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
                "new": "新的密码",
                "old": "旧的密码",
                "recoverysuccess": "<em>We have sent you an email with instruction to recover your password.</em>",
                "reset": "<em>Reset password</em>",
                "saved": "<em>Password correctly saved!</em>"
            },
            "pleasecorrecterrors": "请修正错误",
            "preferences": {
                "comma": "逗号",
                "decimalserror": "小数位必须存在",
                "decimalstousandserror": "小数位和千数位分隔符必须不同",
                "default": "默认",
                "defaultvalue": "缺省值",
                "firstdayofweek": "<em>First day of week</em>",
                "gridpreferencesclear": "<em>Clear grid preferences</em>",
                "gridpreferencescleared": "<em>Grid preferences cleared!</em>",
                "gridpreferencessave": "<em>Save grid preferences</em>",
                "gridpreferencessaved": "<em>Grid preferences saved!</em>",
                "gridpreferencesupdate": "<em>Update grid preferences</em>",
                "labelcsvseparator": "<em>CSV separator</em>",
                "labeldateformat": "日期格式",
                "labeldecimalsseparator": "小数分割符",
                "labellanguage": "语言",
                "labelthousandsseparator": "千位分隔符",
                "labeltimeformat": "时间格式",
                "msoffice": "Microsoft Office",
                "period": "周期",
                "preferredfilecharset": "<em>CSV encoding</em>",
                "preferredofficesuite": "优先office套件",
                "space": "空格",
                "thousandserror": "千数位必须存在",
                "timezone": "时区",
                "twelvehourformat": "12小时制格式",
                "twentyfourhourformat": "24小时制格式"
            },
            "searchinallitems": "在所有条目中搜索",
            "treenavcontenttitle": "<em>{0} of {1}</em>",
            "userpreferences": "偏好"
        },
        "menu": {
            "allitems": "所有条目",
            "classes": "类",
            "custompages": "定制页面",
            "dashboards": "仪表盘",
            "processes": "流程",
            "reports": "报表",
            "views": "浏览"
        },
        "notes": {
            "edit": "编辑注释"
        },
        "notifier": {
            "attention": "注意",
            "error": "错误",
            "genericerror": "通用错误",
            "genericinfo": "通用信息",
            "genericwarning": "通用警告",
            "info": "信息",
            "success": "成功",
            "warning": "警告"
        },
        "patches": {
            "apply": "应用补丁",
            "category": "类别",
            "description": "描述",
            "name": "名称",
            "patches": "补丁"
        },
        "processes": {
            "abortconfirmation": "你确定要放弃此进程吗?",
            "abortprocess": "放弃进程",
            "action": {
                "advance": "高级",
                "label": "动作"
            },
            "activeprocesses": "激活流程",
            "allstatuses": "所有",
            "editactivity": "编辑活动",
            "openactivity": "打开活动",
            "startworkflow": "开始",
            "workflow": "过程"
        },
        "relationGraph": {
            "activity": "<em>activity</em>",
            "allLabelsOnGraph": "<em>all labels on graph</em>",
            "card": "卡片",
            "cardList": "卡片列表",
            "cardRelations": "关系",
            "choosenaviagationtree": "选择导航树",
            "class": "类",
            "classList": "类列表",
            "compoundnode": "组合节点",
            "disable": "<em>Disable</em>",
            "edges": "<em>Edges</em>",
            "enable": "<em>Enable</em>",
            "labelsOnGraph": "<em>tooltip on graph</em>",
            "level": "级别",
            "nodes": "<em>Nodes</em>",
            "openRelationGraph": "打开关系图表",
            "qt": "Qt",
            "refresh": "刷新",
            "relation": "关系",
            "relationGraph": "关系图",
            "reopengraph": "从这个节点重新打开图"
        },
        "relations": {
            "adddetail": "增加细节",
            "addrelations": "增加关系",
            "attributes": "属性",
            "code": "编码",
            "deletedetail": "删除细节",
            "deleterelation": "删除关系",
            "deleterelationconfirm": "<em>Are you sure you want to delete this relation?</em>",
            "description": "描述",
            "editcard": "修改卡片",
            "editdetail": "编辑细节",
            "editrelation": "编辑关系",
            "extendeddata": "<em>Extended data</em>",
            "mditems": "条目",
            "missingattributes": "<em>Missing mandatory attributes</em>",
            "opencard": "打开关系卡片",
            "opendetail": "显示细节",
            "type": "类型"
        },
        "reports": {
            "csv": "CSV",
            "download": "下载",
            "format": "格式",
            "odt": "ODT",
            "pdf": "PDF",
            "print": "打印",
            "reload": "重新加载",
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
            "analysisType": "分析类型",
            "attribute": "属性",
            "calculateRules": "<em>Generate style rules</em>",
            "clearThematism": "<em>Clear Thematism</em>",
            "color": "验证",
            "defineLegend": "<em>Legend definition</em>",
            "defineThematism": "<em>Thematism definition</em>",
            "function": "函数",
            "generate": "生成",
            "geoAttribute": "<em>Geographic Attribute</em>",
            "graduated": "分级的",
            "highlightSelected": "高亮已选中条目",
            "intervals": "间隔",
            "legend": "图例",
            "name": "<em>name</em>",
            "newThematism": "<em>New Thematism</em>",
            "punctual": "按时的",
            "quantity": "数量",
            "segments": "<em>Segments</em>",
            "source": "源端",
            "table": "表",
            "thematism": "Thematisms",
            "value": "值"
        },
        "widgets": {
            "customform": {
                "addrow": "增加行",
                "clonerow": "克隆行",
                "datanotvalid": "<em>Data not valid</em>",
                "deleterow": "删除行",
                "editrow": "编辑行",
                "export": "导出",
                "import": "导入",
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
                "refresh": "重置为缺省值"
            },
            "linkcards": {
                "checkedonly": "<em>Checked only</em>",
                "editcard": "编辑卡片",
                "opencard": "打开卡片",
                "refreshselection": "应用缺省选择",
                "togglefilterdisabled": "无效的方格过滤器",
                "togglefilterenabled": "使方格过滤器生效"
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