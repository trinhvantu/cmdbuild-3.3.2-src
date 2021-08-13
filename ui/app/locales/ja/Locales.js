(function() {
    Ext.define('CMDBuildUI.locales.ja.Locales', {
        "requires": ["CMDBuildUI.locales.ja.LocalesAdministration"],
        "override": "CMDBuildUI.locales.Locales",
        "singleton": true,
        "localization": "ja",
        "administration": CMDBuildUI.locales.ja.LocalesAdministration.administration,
        "attachments": {
            "add": "添付追加",
            "attachmenthistory": "添付履歴",
            "author": "作成者",
            "browse": "<em>Browse &hellip;</em>",
            "category": "カテゴリー",
            "code": "コード",
            "creationdate": "作成日",
            "deleteattachment": "添付削除",
            "deleteattachment_confirmation": "本当にこの添付を削除しますか?",
            "description": "説明",
            "download": "ダウンロード",
            "dropfiles": "ファイルをここにドロップ",
            "editattachment": "添付変更",
            "file": "ファイル",
            "filealreadyinlist": "{0}は既にリストにあります",
            "filename": "ファイル名",
            "fileview": "<em>View attachment</em>",
            "invalidfiles": "無効なファイル削除",
            "majorversion": "メジャーバージョン",
            "modificationdate": "更新日",
            "new": "新規添付",
            "nocategory": "未分類",
            "preview": "プレビュー",
            "removefile": "ファイル削除",
            "statuses": {
                "empty": "ファイルが空です",
                "error": "エラー",
                "extensionNotAllowed": "ファイル拡張子は許可されません",
                "loaded": "ロード完了",
                "ready": "準備完了"
            },
            "successupload": "{0}をアップロードしました",
            "uploadfile": "アップロード中...",
            "version": "バージョン",
            "viewhistory": "添付履歴表示",
            "warningmessages": {
                "atleast": "警告:\"{1}\"タイプの{0}の添付ファイルがロードされました。このカテゴリは少なくとも {2} の添付ファイルを期待しています ",
                "exactlynumber": "警告:\"{1}\"タイプの{0}の添付ファイルがロードされました。このカテゴリは {2} の添付ファイルを期待しています",
                "maxnumber": "警告:\"{1}\" タイプの {0} 添付ファイルがロードされました。このカテゴリは、最大でも {2} の添付ファイルを期待しています。"
            },
            "wrongfileextension": "{0}ファイル拡張子は許可されません"
        },
        "bim": {
            "bimViewer": "BIMビューワー",
            "card": {
                "label": "カード"
            },
            "layers": {
                "label": "レイヤー",
                "menu": {
                    "hideAll": "全て隠す",
                    "showAll": "全て表示"
                },
                "name": "名称",
                "qt": "数",
                "visibility": "表示"
            },
            "menu": {
                "camera": "カメラ",
                "frontView": "フロントビュー",
                "mod": "ビューワーコントロール",
                "orthographic": "正射",
                "pan": "スクロール",
                "perspective": "投射",
                "resetView": "リセットビュー",
                "rotate": "回転",
                "sideView": "サイドビュー",
                "topView": "トップビュー"
            },
            "showBimCard": "BIM 3D表示",
            "tree": {
                "arrowTooltip": "選択",
                "columnLabel": "ツリー",
                "label": "ツリー",
                "open_card": "関連するカードを開く",
                "root": "IFCルート"
            }
        },
        "bulkactions": {
            "abort": "選択したアイテムを中止",
            "cancelselection": "選択キャンセル",
            "confirmabort": "本当に{0}プロセスインスタンスを中止してよろしいですか？",
            "confirmdelete": "本当に{0}カードを削除してよろしいですか？",
            "confirmdeleteattachements": "本当に{0}添付ファイルを削除してよろしいですか？",
            "confirmedit": "本当に{0}を{1}のカードに変更してよろしいですか？",
            "delete": "選択したアイテムを削除",
            "download": "選択した添付ファイルをダウンロード",
            "edit": "選択したアイテムを編集",
            "selectall": "全アイテムを選択"
        },
        "calendar": {
            "active_expired": "有効/失効",
            "add": "カレンダー追加",
            "advancenotification": "事前通知日数",
            "allcategories": "全カテゴリー",
            "alldates": "全日付",
            "calculated": "計算済>",
            "calendar": "カレンダー表示",
            "cancel": "キャンセル済",
            "category": "カテゴリー",
            "cm_confirmcancel": "本当にこのスケジュールをキャンセル済にしますか?",
            "cm_confirmcomplete": "本当にこのスケジュールを完了済にしますか?",
            "cm_markcancelled": "スケジュールをキャンセル済にします",
            "cm_markcomplete": "スケジュールを完了済にします",
            "complete": "完了",
            "completed": "完了済",
            "date": "日",
            "days": "日",
            "delaybeforedeadline": "期限前計算",
            "delaybeforedeadlinevalue": "期限前計算値",
            "description": "説明",
            "editevent": "スケジュール編集",
            "enddate": "終了日",
            "endtype": "終了タイプ",
            "event": "スケジュール",
            "executiondate": "実行日",
            "frequency": "頻度",
            "frequencymultiplier": "回数",
            "grid": "一覧表示",
            "leftdays": "予定日",
            "londdescription": "詳細説明",
            "manual": "マニュアル",
            "maxactiveevents": "最大有効イベント",
            "messagebodydelete": "本当にこのスケジュールを削除しますか？",
            "messagebodyplural": "{0} スケジュールがあります",
            "messagebodyrecalculate": "スケジュール再計算しますか？",
            "messagebodysingular": "{0} スケジュールがあります",
            "messagetitle": "スケジュール再計算しますか？",
            "missingdays": "残日数",
            "next30days": "30日間",
            "next7days": "7日間",
            "notificationtemplate": "通知メールテンプレート",
            "notificationtext": "通知内容",
            "occurencies": "実行回数",
            "operation": "ステータス",
            "partecipantgroup": "表示グループ",
            "partecipantuser": "表示ユーザー",
            "priority": "優先度",
            "recalculate": "再計算",
            "referent": "対象",
            "scheduler": "スケジューラー",
            "sequencepaneltitle": "スケジュール作成",
            "startdate": "開始日",
            "status": "ステータス",
            "today": "本日",
            "type": "タイプ",
            "viewevent": "スケジュール表示",
            "widgetcriterion": "ルール",
            "widgetemails": "メール",
            "widgetsourcecard": "対象カード"
        },
        "classes": {
            "cards": {
                "addcard": "カード追加",
                "clone": "複製",
                "clonewithrelations": "カードとリレーションを複製",
                "deletebeaware": "注意：",
                "deleteblocked": "{0}とのリレーションがあるので削除できません",
                "deletecard": "カード削除",
                "deleteconfirmation": "本当にこのカードを削除しますか?",
                "deleterelatedcards": "関連する{0}カードも削除されます",
                "deleterelations": "{0}カードとリレーションが削除されます",
                "label": "カード",
                "modifycard": "カード更新",
                "opencard": "カード表示",
                "print": "カード印刷"
            },
            "simple": "シンプルクラス",
            "standard": "標準クラス"
        },
        "common": {
            "actions": {
                "add": "追加",
                "apply": "適用",
                "cancel": "キャンセル",
                "close": "閉じる",
                "delete": "削除",
                "edit": "編集",
                "execute": "実行",
                "help": "ヘルプ",
                "load": "ロード",
                "open": "開く",
                "refresh": "リフレッシュ",
                "remove": "削除",
                "save": "保存",
                "saveandapply": "保存",
                "saveandclose": "保存して閉じる",
                "search": "検索",
                "searchtext": "検索中..."
            },
            "attributes": {
                "nogroup": "基本データ"
            },
            "dates": {
                "date": "Y/m/d",
                "datetime": "Y/m/d H:i:s",
                "time": "H:i:s"
            },
            "editor": {
                "clearhtml": "HTMLクリア",
                "expand": "エディターを広げる",
                "reduce": "エディターを狭める",
                "unlink": "<em>Unlink</em>",
                "unlinkmessage": "<em>Transform the selected hyperlink into text.</em>"
            },
            "grid": {
                "disablemultiselection": "複数選択無効",
                "enamblemultiselection": "複数選択有効",
                "export": "エキスポート",
                "filterremoved": "フィルターは削除されました",
                "import": "インポート",
                "itemnotfound": "アイテムが見つかりません",
                "list": "リスト",
                "opencontextualmenu": "コンテキストメニュー",
                "print": "印刷",
                "printcsv": "CSV出力",
                "printodt": "ODT出力",
                "printpdf": "PDF出力",
                "row": "アイテム",
                "rows": "アイテム",
                "subtype": "サブタイプ"
            },
            "tabs": {
                "activity": "アクティビティ",
                "attachment": "添付",
                "attachments": "添付",
                "card": "カード",
                "clonerelationmode": "リレーションクローンモード",
                "details": "詳細",
                "emails": "Eメール",
                "history": "履歴",
                "notes": "ノート",
                "relations": "リレーション",
                "schedules": "スケジュール"
            }
        },
        "dashboards": {
            "tools": {
                "gridhide": "データ一覧を閉じる",
                "gridshow": "データ一覧表示",
                "parametershide": "データパラメータを閉じる",
                "parametersshow": "データパラメータ表示",
                "reload": "再ロード"
            }
        },
        "emails": {
            "addattachmentsfromdocumentarchive": "ドキュメントから添付追加",
            "alredyexistfile": "この名前のファイルは既に存在します",
            "archivingdate": "アーカイブ日",
            "attachfile": "ファイルを添付",
            "bcc": "Bcc",
            "cc": "cc",
            "composeemail": "メール作成",
            "composefromtemplate": "テンプレートから作成",
            "delay": "後で送信",
            "delays": {
                "day1": "1日後",
                "days2": "2日後",
                "days4": "4日後",
                "hour1": "1時間後",
                "hours2": "２時間後",
                "hours4": "4時間後",
                "month1": "1カ月後",
                "negativeday1": "1日前",
                "negativedays2": "2日前",
                "negativedays4": "4日前",
                "negativehour1": "1時間前",
                "negativehours2": "2時間前",
                "negativehours4": "4時間前",
                "negativemonth1": "1ヶ月前",
                "negativeweek1": "1週間前",
                "negativeweeks2": "2週間前",
                "none": "なし",
                "week1": "1週間後",
                "weeks2": "2週間後"
            },
            "dmspaneltitle": "データベースから添付選択",
            "edit": "編集",
            "from": "差出人",
            "gridrefresh": "リフレッシュ",
            "keepsynchronization": "同期を維持",
            "message": "本文",
            "regenerateallemails": "全メールを再作成",
            "regenerateemail": "メール再作成",
            "remove": "削除",
            "remove_confirmation": "本当にこのメールを削除しますか?",
            "reply": "返信",
            "replyprefix": "{0}, {1}が書きました:",
            "selectaclass": "クラス選択",
            "sendemail": "メール送信",
            "statuses": {
                "draft": "下書き",
                "error": "エラー",
                "outgoing": "送信中",
                "received": "受信",
                "sent": "送信"
            },
            "subject": "件名",
            "to": "宛先",
            "view": "ビュー"
        },
        "errors": {
            "autherror": "ユーザー名またはパスワードに誤りがあります",
            "classnotfound": "クラス{0} は見つかりません",
            "fieldrequired": "必須入力",
            "invalidfilter": "無効なフィルター",
            "notfound": "アイテムが見つかりません"
        },
        "filters": {
            "actions": "アクション",
            "addfilter": "フィルター追加",
            "any": "すべての",
            "attachments": "<em>Attachments</em>",
            "attachmentssearchtext": "<em>Attachments search text</em>",
            "attribute": "属性選択",
            "attributes": "属性",
            "clearfilter": "フィルタークリア",
            "clone": "複製",
            "copyof": "コピー",
            "currentgroup": "現在グループ",
            "currentuser": "現在ユーザー",
            "defaultset": "デフォルトに設定",
            "defaultunset": "デフォルト設定から削除",
            "description": "説明",
            "domain": "ドメイン",
            "filterdata": "フィルター",
            "fromfilter": "<em>From filter</em>",
            "fromselection": "選択から",
            "group": "グループ",
            "ignore": "除外",
            "migrate": "移行",
            "name": "名称",
            "newfilter": "新規フィルター",
            "noone": "何もない",
            "operator": "演算子",
            "operators": {
                "beginswith": "開始する",
                "between": "間",
                "contained": "含む",
                "containedorequal": "含むまたは同じ",
                "contains": "含む",
                "containsorequal": "含むまたは同じ",
                "descriptionbegin": "<em>Description begins with</em>",
                "descriptioncontains": "説明に含まれる",
                "descriptionends": "<em>Description ends with</em>",
                "descriptionnotbegin": "<em>Description does not begins with</em>",
                "descriptionnotcontain": "<em>Description does not contain</em>",
                "descriptionnotends": "<em>Description does not ends with</em>",
                "different": "異なる",
                "doesnotbeginwith": "開始しない",
                "doesnotcontain": "含まない",
                "doesnotendwith": "終了しない",
                "endswith": "終了する",
                "equals": "同じ",
                "greaterthan": "大きい",
                "isnotnull": "null値でない",
                "isnull": "null値",
                "lessthan": "小さい"
            },
            "relations": "リレーション",
            "type": "タイプ",
            "typeinput": "入力パラメータ",
            "user": "ユーザー",
            "value": "値"
        },
        "gis": {
            "card": "カード",
            "cardsMenu": "メニュー",
            "code": "コード",
            "description": "説明",
            "extension": {
                "errorCall": "エラー",
                "noResults": "結果がありません"
            },
            "externalServices": "外部サービス",
            "geographicalAttributes": "地理属性",
            "geoserverLayers": "Geoサーバレイヤー",
            "layers": "レイヤー",
            "list": "リスト",
            "longpresstitle": "エリア内ジオエレメント",
            "map": "マップ",
            "mapServices": "地図サービス",
            "position": "位置",
            "root": "ルート",
            "tree": "ナビゲーションツリー",
            "type": "タイプ",
            "view": "ビュー",
            "zoom": "ズーム"
        },
        "history": {
            "activityname": "アクティビティ名",
            "activityperformer": "アクティビティの実施者",
            "begindate": "開始日",
            "enddate": "終了日",
            "processstatus": "ステータス",
            "user": "ユーザー"
        },
        "importexport": {
            "database": {
                "uri": "データベースURI",
                "user": "データベースユーザー"
            },
            "downloadreport": "ダウンロードレポート",
            "emailfailure": "送信エラー",
            "emailmessage": "{1}のインポートレポート\"{0}\" ファイル添付",
            "emailsubject": "インポートレポート",
            "emailsuccess": "送信されました",
            "export": "エキスポート",
            "exportalldata": "全データ",
            "exportfiltereddata": "フィルターに一致のみ",
            "gis": {
                "shapeimportdisabled": "このテンプレートはシェープインポートできません",
                "shapeimportenabled": "シェープインポート設定"
            },
            "ifc": {
                "card": "<em>Card</em>",
                "project": "プロジェクト",
                "sourcetype": "インポート元"
            },
            "import": "インポート",
            "importresponse": "インポート応答",
            "response": {
                "created": "作成レコード",
                "deleted": "削除レコード",
                "errors": "エラー",
                "linenumber": "行番号",
                "message": "メッセージ",
                "modified": "更新レコード",
                "processed": "処理行数",
                "recordnumber": "レコード数",
                "unmodified": "未更新レコード"
            },
            "sendreport": "レポート送信",
            "template": "テンプレート",
            "templatedefinition": "テンプレート定義"
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
                "login": "ログイン",
                "logout": "ユーザー変更"
            },
            "fields": {
                "group": "グループ",
                "language": "言語",
                "password": "パスワード",
                "tenants": "テナント",
                "username": "ユーザー名"
            },
            "loggedin": "ログイン",
            "title": "ログイン",
            "welcome": "おかえりなさい {0}"
        },
        "main": {
            "administrationmodule": "管理モジュール",
            "baseconfiguration": "基本設定",
            "cardlock": {
                "lockedmessage": "このカードは{0}が編集しているため、編集できません。",
                "someone": "誰か"
            },
            "changegroup": "グループ変更",
            "changetenant": "{0}に変更",
            "confirmchangegroup": "本当にこのグループを変更しますか?",
            "confirmchangetenants": "本当に有効なテナントを変更しますか?",
            "confirmdisabletenant": "本当に\"テナント無視\"フラグを無効にしますか?",
            "confirmenabletenant": "本当に\"テナント無視\"フラグを有効にしますか??</em>",
            "ignoretenants": "{0}を除外",
            "info": "情報",
            "logo": {
                "cmdbuild": "CMDBuild ロゴ",
                "cmdbuildready2use": "CMDBuild READY2USE ロゴ",
                "companylogo": "ユーザーロゴ",
                "openmaint": "openMAINT ロゴ"
            },
            "logout": "ログアウト",
            "managementmodule": "データモジュール",
            "multigroup": "マルチグループ",
            "multitenant": "マルチ{0}",
            "navigation": "ナビゲーション",
            "pagenotfound": "ページがありません",
            "password": {
                "change": "パスワード変更",
                "confirm": "パスワード確認",
                "email": "メールアドレス",
                "err_confirm": "パスワードに誤りがあります",
                "err_diffprevious": "以前のパスワードと同じものは使えません",
                "err_diffusername": "ユーザー名と同じパスワードは使えません",
                "err_length": "{0}字以上のパスワードが必要です",
                "err_reqdigit": "パスワードには少なくとも1桁の数字が含まれている必要があります",
                "err_reqlowercase": "パスワードには少なくとも1字の小文字が含まれている必要があります",
                "err_requppercase": "パスワードには少なくとも1字の大文字が含まれている必要があります",
                "expired": "パスワードの有効期限が切れました、変更してください",
                "forgotten": "パスワードを忘れました",
                "new": "新パスワード",
                "old": "旧パスワード",
                "recoverysuccess": "パスワードリセット案内メールを送信しました",
                "reset": "パスワードリセット案内メールを送信しました",
                "saved": "パスワードが保存されました"
            },
            "pleasecorrecterrors": "エラーを修正してください",
            "preferences": {
                "comma": "カンマ",
                "decimalserror": "小数点の項目が必要です",
                "decimalstousandserror": "小数点と桁区切りは異なる必要があります",
                "default": "デフォルト",
                "defaultvalue": "デフォルト",
                "firstdayofweek": "<em>First day of week</em>",
                "gridpreferencesclear": "グリッド設定クリア",
                "gridpreferencescleared": "グリッド設定クリアされました",
                "gridpreferencessave": "グリッド設定保存",
                "gridpreferencessaved": "グリッド設定保存されました",
                "gridpreferencesupdate": "グリッド設定更新",
                "labelcsvseparator": "CSVセパレータ",
                "labeldateformat": "日付表示",
                "labeldecimalsseparator": "小数点記号",
                "labellanguage": "言語",
                "labelthousandsseparator": "桁区切り記号",
                "labeltimeformat": "時刻表示",
                "msoffice": "Microsoft Office",
                "period": "ピリオド",
                "preferredfilecharset": "CSVエンコーディング",
                "preferredofficesuite": "使用Officeプログラム",
                "space": "スペース",
                "thousandserror": "整数の項目が必要です",
                "timezone": "タイムゾーン",
                "twelvehourformat": "12時間表示",
                "twentyfourhourformat": "24時間表示"
            },
            "searchinallitems": "全アイテム検索",
            "treenavcontenttitle": "<em>{0} of {1}</em>",
            "userpreferences": "表示設定"
        },
        "menu": {
            "allitems": "全アイテム",
            "classes": "クラス",
            "custompages": "カスタムページ",
            "dashboards": "ダッシュボード",
            "processes": "プロセス",
            "reports": "レポート",
            "views": "ビュー"
        },
        "notes": {
            "edit": "ノート編集"
        },
        "notifier": {
            "attention": "注意",
            "error": "エラー",
            "genericerror": "エラー",
            "genericinfo": "一般的情報",
            "genericwarning": "一般的警告",
            "info": "情報",
            "success": "成功",
            "warning": "警告"
        },
        "patches": {
            "apply": "パッチ適用",
            "category": "カテゴリー",
            "description": "説明",
            "name": "名称",
            "patches": "パッチ"
        },
        "processes": {
            "abortconfirmation": "本当にこのプロセスを中止しますか?",
            "abortprocess": "プロセスを中止",
            "action": {
                "advance": "次へ",
                "label": "アクション"
            },
            "activeprocesses": "有効プロセス",
            "allstatuses": "全て",
            "editactivity": "アクティビティ変更",
            "openactivity": "アクティビティ表示",
            "startworkflow": "開始",
            "workflow": "ワークフロー"
        },
        "relationGraph": {
            "activity": "アクティビティ",
            "allLabelsOnGraph": "全ラベル",
            "card": "カード",
            "cardList": "カード一覧",
            "cardRelations": "リレーション",
            "choosenaviagationtree": "ナビゲーション選択",
            "class": "クラス",
            "classList": "クラス一覧",
            "compoundnode": "複合ノード",
            "disable": "無効化",
            "edges": "<em>Edges</em>",
            "enable": "有効化",
            "labelsOnGraph": "ツールチップ",
            "level": "レベル",
            "nodes": "<em>Nodes</em>",
            "openRelationGraph": "リレーショングラフを開く",
            "qt": "数",
            "refresh": "リフレッシュ",
            "relation": "リレーション",
            "relationGraph": "リレーショングラフ",
            "reopengraph": "このノードから再表示"
        },
        "relations": {
            "adddetail": "詳細追加",
            "addrelations": "リレーション追加",
            "attributes": "属性",
            "code": "コード",
            "deletedetail": "詳細削除",
            "deleterelation": "リレーション削除",
            "deleterelationconfirm": "本当にこのリレーションを削除しますか?",
            "description": "説明",
            "editcard": "カード編集",
            "editdetail": "詳細編集",
            "editrelation": "リレーション編集",
            "extendeddata": "拡張データ",
            "mditems": "アイテム",
            "missingattributes": "必須属性がありません",
            "opencard": "関連するカードを開く",
            "opendetail": "詳細表示",
            "type": "タイプ"
        },
        "reports": {
            "csv": "CSV",
            "download": "ダウンロード",
            "format": "フォーマット",
            "odt": "ODT",
            "pdf": "PDF",
            "print": "印刷",
            "reload": "再ロード",
            "rtf": "RTF"
        },
        "system": {
            "data": {
                "lookup": {
                    "CalendarCategory": {
                        "default": {
                            "description": "デフォルト"
                        }
                    },
                    "CalendarFrequency": {
                        "daily": {
                            "description": "毎日"
                        },
                        "monthly": {
                            "description": "毎月"
                        },
                        "once": {
                            "description": "一回"
                        },
                        "weekly": {
                            "description": "毎週"
                        },
                        "yearly": {
                            "description": "毎年"
                        }
                    },
                    "CalendarPriority": {
                        "default": {
                            "description": "デフォルト"
                        }
                    }
                }
            }
        },
        "thematism": {
            "addThematism": "テーマ作成",
            "analysisType": "表示タイプ",
            "attribute": "属性",
            "calculateRules": "スタイルルール作成",
            "clearThematism": "テーマ消去",
            "color": "色",
            "defineLegend": "凡例定義",
            "defineThematism": "テーマ定義",
            "function": "ファンクション",
            "generate": "作成",
            "geoAttribute": "地理属性",
            "graduated": "段階",
            "highlightSelected": "ハイライト",
            "intervals": "間隔",
            "legend": "凡例",
            "name": "名前",
            "newThematism": "新テーマ",
            "punctual": "点",
            "quantity": "数",
            "segments": "セグメント",
            "source": "ソース",
            "table": "テーブル",
            "thematism": "テーマ",
            "value": "値"
        },
        "widgets": {
            "customform": {
                "addrow": "行追加",
                "clonerow": "行を複製",
                "datanotvalid": "無効なデータ",
                "deleterow": "行削除",
                "editrow": "行編集",
                "export": "エキスポート",
                "import": "インポート",
                "importexport": {
                    "expattributes": "エキスポートデータ",
                    "file": "ファイル",
                    "filename": "ファイル名",
                    "format": "フォーマット",
                    "importmode": "インポートモード",
                    "keyattributes": "キー属性",
                    "missingkeyattr": "一つ以上のキー属性を選択してください",
                    "modeadd": "追加",
                    "modemerge": "マージ",
                    "modereplace": "置き換え",
                    "separator": "セパレータ"
                },
                "refresh": "初期設定に戻す"
            },
            "linkcards": {
                "checkedonly": "確認のみ",
                "editcard": "カード編集",
                "opencard": "カード表示",
                "refreshselection": "デフォルトを適用",
                "togglefilterdisabled": "フィルター無効化",
                "togglefilterenabled": "フィルター有効化"
            },
            "required": "このウィジェットは必要です"
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