Ext.define('CMDBuildUI.locales.ja.LocalesAdministration', {
    "singleton": true,
    "localization": "ja",
    "administration": {
        "attributes": {
            "attribute": "属性",
            "attributes": "属性",
            "emptytexts": {
                "search": "全属性検索..."
            },
            "fieldlabels": {
                "actionpostvalidation": "入力チェック",
                "attributegroupings": "属性グループ",
                "autovalue": "自動入力",
                "contentsecurity": "コンテントセキュリティ",
                "decimalseparator": "小数点記号",
                "defaultfalse": "規定でfalse",
                "description": "説明",
                "domain": "ドメイン",
                "editortype": "エディタタイプ",
                "filter": "フィルター",
                "format": "フォーマット",
                "group": "グループ",
                "help": "ヘルプ",
                "includeinherited": "継承を含む",
                "iptype": "IPタイプ",
                "lookup": "ルックアップ",
                "mandatory": "必須",
                "maxlength": "最大長",
                "mode": "モード",
                "name": "名称",
                "positioningofum": "単位表示位置",
                "precision": "精度",
                "preselectifunique": "ユニークな値を自動選択",
                "scale": "スケール",
                "separator": "セパレーター",
                "separators": "セパレーター",
                "showif": "表示条件",
                "showingrid": "リスト表示",
                "showinreducedgrid": "省略リスト表示",
                "showseconds": "秒表示",
                "showseparator": "セパレーター表示",
                "thousandsseparator": "桁区切り記号",
                "type": "タイプ",
                "unique": "ユニーク",
                "unitofmeasure": "単位",
                "validationrules": "入力チェック条件",
                "visibledecimals": "小数表示"
            },
            "strings": {
                "addnewgroup": "グループ追加",
                "any": "すべての",
                "createnewgroup": "グループ作成",
                "draganddrop": "ドラッグ・アンド・ドロップ",
                "editable": "編集可能",
                "editorhtml": "html",
                "hidden": "非表示",
                "htmlall": "HTML全て",
                "htmlsafe": "HTMLセーフ",
                "immutable": "イミュータブル",
                "ipv4": "ipv4",
                "ipv6": "ipv6",
                "plaintext": "プレーンテキスト",
                "positioningofumrequired": "単位表示位置は必須です",
                "precisionmustbebiggerthanscale": "精度は桁数より大きくなければなりません",
                "readonly": "読み取り専用",
                "removegridorders": "属性順序変更するためには現在のソーティングを削除する必要があります、進めていいですか？",
                "scalemustbesmallerthanprecision": "桁数は精度より小さくなければなりません",
                "thefieldmandatorycantbechecked": "\"必須\"はチェックできません",
                "thefieldmodeishidden": "\"編集モード\"は表示されません",
                "thefieldshowingridcantbechecked": "\"リスト表示\"はチェックできません",
                "thefieldshowinreducedgridcantbechecked": "\"省略リスト表示\"はチェックできません"
            },
            "texts": {
                "active": "有効",
                "addattribute": "属性追加",
                "attributegroupingclosed": "閉じる",
                "attributegroupingopen": "開く",
                "cancel": "キャンセル",
                "description": "説明",
                "direct": "順方向",
                "displaymode": "表示モード",
                "editingmode": "編集モード",
                "editmetadata": "メタデータ編集",
                "grouping": "グループ",
                "inverse": "逆方向",
                "mandatory": "必須",
                "name": "名称",
                "newattribute": "新規属性",
                "save": "保存",
                "saveandadd": "保存して追加",
                "showingrid": "リスト表示",
                "type": "タイプ",
                "unique": "ユニーク",
                "viewmetadata": "メタデータ表示"
            },
            "titles": {
                "otherproperties": "その他プロパティ",
                "typeproperties": "タイププロパティ"
            },
            "tooltips": {
                "deleteattribute": "削除",
                "disableattribute": "無効",
                "editattribute": "編集",
                "enableattribute": "有効にする",
                "openattribute": "開いています",
                "translate": "翻訳"
            }
        },
        "bim": {
            "addproject": "プロジェクト追加",
            "bimnavigation": "BIMナビゲーション",
            "ifcfile": "IFCファイル",
            "lastcheckin": "最新チェックイン",
            "multilevel": "マルチレベル",
            "newproject": "新プロジェクト",
            "parentproject": "親プロジェクト",
            "projectlabel": "プロジェクト",
            "projects": "プロジェクト"
        },
        "classes": {
            "fieldlabels": {
                "applicability": "適用範囲",
                "attachmentsinline": "添付表示",
                "attachmentsinlineclosed": "添付を閉じて表示",
                "categorytype": "カテゴリータイプ",
                "defaultexporttemplate": "エキスポートデフォルトテンプレート",
                "defaultimporttemplate": "インポートデフォルトテンプレート",
                "descriptionmode": "ディスクリプションモード",
                "guicustom": "GUIカスタマイズ",
                "guicustomparameter": "GUIカスタマイズパラメーター",
                "multitenantmode": "マルチテナントモード",
                "superclass": "スーパークラス",
                "widgetname": "ウィジェット名"
            },
            "properties": {
                "form": {
                    "fieldsets": {
                        "ClassAttachments": "添付",
                        "classParameters": "パラメータ",
                        "contextMenus": {
                            "actions": {
                                "delete": {
                                    "tooltip": "削除"
                                },
                                "edit": {
                                    "tooltip": "編集"
                                },
                                "moveDown": {
                                    "tooltip": "下げる"
                                },
                                "moveUp": {
                                    "tooltip": "上げる"
                                }
                            },
                            "cantbeempty": "必須入力",
                            "inputs": {
                                "applicability": {
                                    "label": "適用性",
                                    "values": {
                                        "all": {
                                            "label": "全て"
                                        },
                                        "many": {
                                            "label": "選択"
                                        },
                                        "one": {
                                            "label": "最新"
                                        }
                                    }
                                },
                                "javascriptScript": {
                                    "label": "Javascript / カスタムGUIパラメータ"
                                },
                                "menuItemName": {
                                    "label": "メニューアイテム名",
                                    "values": {
                                        "separator": {
                                            "label": "[---------]"
                                        }
                                    }
                                },
                                "status": {
                                    "label": "ステータス",
                                    "values": {
                                        "active": {
                                            "label": "有効"
                                        }
                                    }
                                },
                                "typeOrGuiCustom": {
                                    "label": "タイプ / GUIカスタム",
                                    "values": {
                                        "component": {
                                            "label": "カスタムGUI"
                                        },
                                        "custom": {
                                            "label": "Javascript"
                                        },
                                        "separator": {
                                            "label": "[---------]"
                                        }
                                    }
                                }
                            },
                            "mustbeunique": "ユニーク必須",
                            "title": "コンテキストメニュー"
                        },
                        "createnewwidget": "ウィジェット作成",
                        "defaultOrders": "デフォルト順",
                        "formTriggers": {
                            "actions": {
                                "addNewTrigger": {
                                    "tooltip": "トリガー追加"
                                },
                                "deleteTrigger": {
                                    "tooltip": "削除"
                                },
                                "editTrigger": {
                                    "tooltip": "編集"
                                },
                                "moveDown": {
                                    "tooltip": "下げる"
                                },
                                "moveUp": {
                                    "tooltip": "上げる"
                                }
                            },
                            "inputs": {
                                "createNewTrigger": {
                                    "label": "フォームトリガー作成"
                                },
                                "events": {
                                    "label": "イベント",
                                    "values": {
                                        "afterAbort": {
                                            "label": "停止後"
                                        },
                                        "afterClone": {
                                            "label": "クローン後"
                                        },
                                        "afterDelete": {
                                            "label": "削除後"
                                        },
                                        "afterEdit": {
                                            "label": "編集後"
                                        },
                                        "afterEditExecute": {
                                            "label": "編集実行後"
                                        },
                                        "afterEditSave": {
                                            "label": "編集保存後"
                                        },
                                        "afterInsert": {
                                            "label": "挿入後"
                                        },
                                        "afterInsertExecute": {
                                            "label": "挿入実行後"
                                        },
                                        "afterInsertSave": {
                                            "label": "挿入保存後"
                                        },
                                        "beforView": {
                                            "label": "表示前"
                                        },
                                        "beforeClone": {
                                            "label": "クローン前"
                                        },
                                        "beforeEdit": {
                                            "label": "編集前"
                                        },
                                        "beforeInsert": {
                                            "label": "挿入前"
                                        }
                                    }
                                },
                                "javascriptScript": {
                                    "label": "Javascript"
                                },
                                "status": {
                                    "label": "ステータス"
                                }
                            },
                            "title": "フォームトリガー"
                        },
                        "formWidgets": "フォームウィジェット",
                        "generalData": {
                            "inputs": {
                                "active": {
                                    "label": "有効"
                                },
                                "classType": {
                                    "label": "タイプ"
                                },
                                "description": {
                                    "label": "説明"
                                },
                                "name": {
                                    "label": "名称"
                                },
                                "parent": {
                                    "label": "親"
                                },
                                "superclass": {
                                    "label": "スーパークラス"
                                }
                            }
                        },
                        "icon": "アイコン",
                        "validation": {
                            "inputs": {
                                "validationRule": {
                                    "label": "入力チェック条件"
                                }
                            },
                            "title": "入力チェック"
                        }
                    },
                    "inputs": {
                        "events": "イベント",
                        "javascriptScript": "Javascript",
                        "status": "ステータス"
                    },
                    "values": {
                        "active": "有効"
                    }
                },
                "title": "プロパティ",
                "toolbar": {
                    "cancelBtn": "キャンセル",
                    "closeBtn": "閉じる",
                    "deleteBtn": {
                        "tooltip": "削除"
                    },
                    "disableBtn": {
                        "tooltip": "無効"
                    },
                    "editBtn": {
                        "tooltip": "クラス更新"
                    },
                    "enableBtn": {
                        "tooltip": "有効にする"
                    },
                    "printBtn": {
                        "printAsOdt": "OpenOffice ODT",
                        "printAsPdf": "Adobe PDF",
                        "tooltip": "クラス印刷"
                    },
                    "saveBtn": "保存"
                }
            },
            "strings": {
                "classactivated": "正常にクラスが有効化されました",
                "classdisabled": "正常にクラスが無効化されました",
                "createnewcontextaction": "コンテキストアクション作成",
                "datacardsorting": "カード表示順序",
                "deleteclass": "クラス削除",
                "deleteclassquest": "本当にこのクラスを削除しますか?",
                "editcontextmenu": "コンテキストメニュー編集",
                "editformwidget": "フォームウィジェット編集",
                "edittrigger": "トリガー編集",
                "executeon": "実行",
                "geaoattributes": "地理属性",
                "levels": "レイヤー追加"
            },
            "texts": {
                "calendar": "カレンダー",
                "class": "クラス",
                "component": "コンポーネント",
                "createmodifycard": "カード作成・編集",
                "createreport": "レポート作成",
                "custom": "カスタム",
                "direction": "方向",
                "ping": "Ping",
                "separator": "セパレーター",
                "simple": "シンプルクラス",
                "standard": "標準クラス",
                "startworkflow": "ワークフロー開始"
            },
            "title": "クラス",
            "toolbar": {
                "addClassBtn": {
                    "text": "クラス追加"
                },
                "classLabel": "クラス",
                "printSchemaBtn": {
                    "text": "スキーマ印刷"
                },
                "searchTextInput": {
                    "emptyText": "全クラス検索"
                }
            }
        },
        "common": {
            "actions": {
                "activate": "有効化",
                "add": "全て",
                "cancel": "キャンセル",
                "clone": "複製",
                "clonefrom": "複製作成...",
                "close": "閉じる",
                "create": "作成",
                "delete": "削除",
                "disable": "無効",
                "download": "ダウンロード",
                "edit": "編集",
                "enable": "有効にする",
                "movedown": "下げる",
                "moveup": "上げる",
                "next": "次へ",
                "no": "No",
                "ok": "Ok",
                "open": "開く",
                "prev": "戻る",
                "print": "印刷",
                "relationchart": "リレーショングラフ",
                "remove": "削除",
                "save": "保存",
                "saveandadd": "保存して追加",
                "update": "更新",
                "viewallitemproperties": "全プロパティ表示",
                "yes": "はい"
            },
            "labels": {
                "active": "有効",
                "code": "コード",
                "colorpreview": "色プレビュー",
                "default": "デフォルト",
                "defaultfilter": "既定のフィルター",
                "description": "説明",
                "desktop": "デスクトップ",
                "device": "デバイス",
                "funktion": "ファンクション",
                "helptext": "ヘルプ文章",
                "icon": "アイコン",
                "iconcolor": "アイコン色",
                "iconpreview": "アイコンプレビュー",
                "icontype": "アイコンタイプ",
                "mobile": "モバイル",
                "name": "名称",
                "note": "ノート",
                "noteinline": "ノート表示",
                "noteinlineclosed": "ノートを閉じて表示",
                "show": "表示",
                "status": "ステータス",
                "tenant": "テナント",
                "textcolor": "文字色",
                "tree": "ツリー",
                "type": "タイプ"
            },
            "messages": {
                "allcardsunlocked": "全カードのロックが解除されました",
                "applicationreloadquest": "アプリケーションアップデートがあります、リロードしますか?",
                "applicationupdate": "アップデート",
                "areyousuredeleteitem": "本当にこのアイテムを削除しますか?",
                "ascendingordescending": "値が無効です, \"昇順\"か\"降順\"を選択してください",
                "attention": "注意",
                "cacheempities": "サーバーキャッシュが破棄されました",
                "cannotsortitems": "順序変更できません。フィルターや継承されている属性がある場合はそれらを削除してください",
                "cantcontainchar": "クラス名には {0} を使用できません",
                "connectedtoclass": "クラスに接続",
                "connectedtofunction": "ファンクションに接続",
                "correctformerrors": "エラーを修正してください",
                "disabled": "無効化",
                "enabled": "有効化",
                "error": "エラー",
                "greaterthen": "クラス名は {0} 字より大きくできません",
                "itemwascreated": "アイテムが作成されました",
                "loading": "ロード中...",
                "saving": "保存中...",
                "servicessincronized": "サービスが同期されました",
                "success": "成功",
                "thisfieldisrequired": "必須入力",
                "warning": "警告",
                "was": "was",
                "wasdeleted": "削除されました",
                "youarenotabletoadd": "追加する権限がありません",
                "youarenotabletochangeactive": "有効化/無効化する権限がありません",
                "youarenotabletodelete": "削除する権限がありません",
                "youarenotabletoedit": "編集する権限がありません"
            },
            "strings": {
                "always": "常時適用",
                "ascending": "昇順",
                "attribute": "属性",
                "currenticon": "アイコン",
                "default": "デフォルト",
                "definedinemailtemplate": "メールテンプレートで定義",
                "descending": "降順",
                "filtercql": "CQLフィルター",
                "generalproperties": "基本設定",
                "hidden": "非表示",
                "iconimage": "画像アイコン",
                "image": "画像",
                "localization": "翻訳",
                "mixed": "混在適用",
                "never": "不適用",
                "none": "なし",
                "properties": "プロパティ",
                "readonly": "読み込みのみ",
                "recursive": "繰り返し",
                "selectimage": "画像選択",
                "selectpngfile": "PNGファイル選択",
                "string": "文字列",
                "visiblemandatory": "必須入力",
                "visibleoptional": "表示"
            },
            "tooltips": {
                "add": "追加",
                "clone": "複製",
                "edit": "編集",
                "edittrigger": "トリガー編集",
                "localize": "翻訳",
                "open": "開いています"
            }
        },
        "customcomponents": {
            "emptytexts": {
                "searchcustompages": "カスタムコンポーネント検索..",
                "searchingrid": "リスト検索..."
            },
            "fieldlabels": {
                "actions": "アクション",
                "active": "有効",
                "componentid": "コンポーネントID",
                "description": "表示名",
                "name": "名称",
                "zipfile": "ZIPファイル"
            },
            "plural": "カスタムコンポーネント",
            "singular": "カスタムコンポーネント",
            "strings": {
                "addcontextmenu": "コンテキストメニュー追加",
                "addwidget": "ウィジェットから追加",
                "contextmenu": "コンテキストメニュー",
                "searchcontextmenus": "コンテキストメニュー検索…",
                "searchwidgets": "ウィジェット検索…",
                "widget": "ウィジェット"
            },
            "texts": {
                "addcustomcomponent": "カスタムコンポーネント追加",
                "selectfile": "ZIPファイル選択"
            },
            "titles": {
                "file": "ファイル"
            },
            "tooltips": {
                "delete": "カスタムコンポーネント削除",
                "disable": "カスタムコンポーネント無効化",
                "downloadpackage": "カスタムコンポーネントダウンロード",
                "edit": "カスタもコンポーネント編集",
                "enable": "カスタムコンポーネント有効化"
            }
        },
        "custompages": {
            "emptytexts": {
                "searchcustompages": "カスタムページ検索..",
                "searchingrid": "リスト検索..."
            },
            "fieldlabels": {
                "actions": "アクション",
                "active": "有効",
                "componentid": "コンポーネントID",
                "description": "表示名",
                "name": "名称",
                "zipfile": "ZIPファイル"
            },
            "plural": "カスタムページ",
            "singular": "カスタムページ",
            "texts": {
                "addcustompage": "カスタムページ追加",
                "selectfile": "ZIPファイル選択"
            },
            "titles": {
                "file": "ファイル"
            },
            "tooltips": {
                "delete": "カスタムページ削除",
                "disable": "カスタムページ無効化",
                "downloadpackage": "カスタムページパッケージダウンロード",
                "edit": "カスタムページ編集",
                "enable": "カスタムページ有効化"
            }
        },
        "dashboards": {
            "active": "有効",
            "adddashboard": "ダッシュボード追加",
            "autoload": "自動ロード",
            "backgroundcolor": "バックグラウンド色",
            "card": "カード",
            "categoryaxis": "カテゴリー軸",
            "chartnamecharttypeproperties": "{0}グラフ種別プロパティー",
            "chartorientation": "グラフ方向",
            "charttypeproperties": "グラフタイププロパティ",
            "currentgroup": "現在のグループ",
            "currentuser": "現在のユーザー",
            "dashborad": "ダッシュボード",
            "datasourceproperties": "データソースプロパティ",
            "defaultvalue": "初期値",
            "deletechartparametertranslations": "いくつかの翻訳を削除する必要があるかもしれませんが、続行しますか？",
            "fieldtype": "フィールドタイプ",
            "filter": "フィルター",
            "foregroundcolor": "フォアグラウンド色",
            "freestring": "文字列",
            "fromclass": "クラス",
            "height": "高さ(px)",
            "integer": "整数",
            "labeldescription": "ラベル説明",
            "labelfield": "ラベルフィールド",
            "layout": "レイアウト",
            "lookuptype": "ルックアップタイプ",
            "maximum": "最大",
            "minimum": "最小",
            "new": "新規",
            "newdashboard": "新ダッシュボード",
            "parameter": "パラメーター",
            "preselectifunique": "ユニークな値を自動選択",
            "required": "必須",
            "rowlimit": "最大行数",
            "searchdashboards": "ダッシュボード検索",
            "selectfromallclasses": "CMDBuildクラスから選択",
            "selectfromlookup": "ルックアップから選択",
            "showlegend": "凡例表示",
            "steps": "ステップ",
            "string": "文字列",
            "title": "タイトル",
            "unabletoremovenonemptycolumn": "データを持つカラムは削除できません",
            "valueaxis": "値軸",
            "valuefield": "値フィールド",
            "view": "ビュー"
        },
        "dmscategories": {
            "adddmscategory": "DMSカテゴリー追加",
            "allowfiletypesemptyvalue": "許可する拡張子をカンマ区切りで入力、例）pdf,odt,doc　空欄の場合は　DMSモデル設定を使用します",
            "assignedon": "割当先",
            "defaultcategory": "規定のカテゴリー",
            "dmscategory": "DMSカテゴリー",
            "searchalldmscategories": "全DMSカテゴリー検索"
        },
        "dmsmodels": {
            "adddmsmodel": "DMSモデル追加",
            "allowedextensions": "許可する拡張子",
            "allowedfiletypesemptyvalue": "許可する拡張子をカンマ区切りで入力、例）pdf,odt,doc　空欄の場合はシステム設定を使用します",
            "atleastnumber": "最小数",
            "countcheck": "カウント確認",
            "dmsmodel": "DMSモデル",
            "exactlynumber": "正確な番号",
            "maxnumber": "最大数",
            "modelattachments": "添付ファイルプロパティ",
            "modelparameters": "DMSモデルパラメータ",
            "nocheck": "未確認",
            "nocheckemptytext": "DMSモデルの値をデフォルトとして設定",
            "number": "番号",
            "searchalldmsmodels": "全DMSモデル検索"
        },
        "domains": {
            "domain": "ドメイン",
            "fieldlabels": {
                "cardinality": "関係性",
                "closeddestinationinline": "宛先のインラインリレーションを閉じる",
                "closedorigininline": "起点のインラインリレーションを閉じる",
                "destination": "宛先",
                "destinationinline": "宛先のインラインリレーション",
                "directdescription": "順方向の説明",
                "enabled": "有効化",
                "inversedescription": "逆方向の説明",
                "labelmasterdataillong": "詳細タブ",
                "labelmasterdetail": "詳細タブ",
                "link": "リンク",
                "masterdetail": "詳細タブ",
                "masterdetailshort": "詳細タブ",
                "origin": "ターゲット（起点)",
                "origininline": "起点のインラインリレーション",
                "viewconditioncql": "ビュー条件式(CQL)"
            },
            "pluralTitle": "ドメイン",
            "properties": {
                "toolbar": {
                    "cancelBtn": "キャンセル",
                    "deleteBtn": {
                        "tooltip": "削除"
                    },
                    "disableBtn": {
                        "tooltip": "無効化"
                    },
                    "editBtn": {
                        "tooltip": "編集"
                    },
                    "enableBtn": {
                        "tooltip": "有効化"
                    },
                    "saveBtn": "保存"
                }
            },
            "singularTitle": "ドメイン",
            "strings": {
                "classshoulbeoriginordestination": "{0}' クラス、または '{0}' 親クラスは、ターゲット（起点)か宛先に設定が必要です",
                "referencealreadydefined": "{0}' ドメインは既に '{1}'属性に設定済みです"
            },
            "texts": {
                "_delete": "リレーション先カードも削除",
                "adddomain": "ドメイン追加",
                "addlink": "リンク追加",
                "askconfirm": "ユーザーに確認",
                "destinationcarddelete": "宛先カード削除",
                "emptyText": "ドメインを検索",
                "enabledclasses": "有効クラス",
                "newdomain": "新ドメイン",
                "onorigincarddelete": "起点カード削除",
                "properties": "プロパティ",
                "restrict": "リレーションがあれば削除しない",
                "setnull": "リレーション削除",
                "showsummaryfor": "サマリー表示"
            },
            "toolbar": {
                "addBtn": {
                    "text": "ドメイン追加"
                },
                "searchTextInput": {
                    "emptyText": "全ドメインを検索"
                }
            }
        },
        "emails": {
            "accounts": "アカウント",
            "accountsavedcorrectly": "アカウントは保存されました",
            "addaccount": "アカウント追加",
            "address": "アドレス",
            "addrow": "行追加",
            "addtemplate": "テンプレート追加",
            "bcc": "Bcc",
            "body": "本文",
            "cannotchoosebothssltlsmessage": "SSL及びSTARTTLS両方は選択できません",
            "cc": "cc",
            "clonetemplate": "複製",
            "configurationsuccesful": "設定完了",
            "contenttype": "タイプ",
            "date": "日付",
            "defaultaccount": "既定のアカウント",
            "delay": "遅延",
            "delays": {
                "day1": "1日後",
                "days2": "2日後",
                "days4": "4日後",
                "hour1": "1時間後",
                "hours2": "２時間後",
                "hours4": "4時間後",
                "month1": "1カ月後",
                "none": "なし",
                "week1": "1週間後",
                "weeks2": "2週間後"
            },
            "description": "説明",
            "editvalues": "値編集",
            "email": "電子メール",
            "enablessl": "SSLを有効化",
            "enablestarttls": "STARTTLSを有効化",
            "from": "差出人",
            "imapport": "IMAPポート",
            "imapserver": "IMAPサーバー",
            "incoming": "受信",
            "keepsync": "同期を維持",
            "key": "キー",
            "name": "名称",
            "newaccount": "新規アカウント",
            "newtemplate": "新規テンプレート",
            "notnullkey": "いくつかの値が空白(null)キーです</em>",
            "outgoing": "送信",
            "password": "パスワード",
            "promptsync": "手動同期",
            "queue": "キュー",
            "remove": "削除",
            "removeaccount": "アカウント削除",
            "removetemplate": "削除",
            "send": "送信",
            "sent": "送信済",
            "sentfolder": "送信フォルダ",
            "setdefaultaccount": "デフォルトアカウントに設定",
            "smtpport": "SMTPポート",
            "smtpserver": "SMTPサーバー",
            "start": "開始",
            "subject": "件名",
            "template": "テンプレート",
            "templates": "テンプレート",
            "templatesavedcorrectly": "テンプレートは保存されました",
            "testconfiguration": "テスト設定",
            "to": "宛先",
            "username": "ユーザー名",
            "value": "値"
        },
        "forms": {
            "activityform": "レイアウト動作",
            "addcolumn": "列追加",
            "addform": "レイアウト追加",
            "addrow": "行追加",
            "autogenerate": "自動生成",
            "columnssize": "列幅",
            "form": "レイアウト",
            "forms": "レイアウト",
            "newform": "新レイアウト",
            "removecolumn": "列削除",
            "removerow": "行削除"
        },
        "gates": {
            "adddatabasetemplate": "データベーステンプレート追加",
            "addgistemplate": "GISテンプレート追加",
            "addifctemplate": "IFCテンプレート追加",
            "all": "全て",
            "associationmode": "<em>Association mode</em>",
            "associationproperties": "<em>Association properties</em>",
            "attributes": "<em>Attributes</em>",
            "dwgproperty": "DWGプロパティ",
            "enableshapeimport": "シェープインポート有効化",
            "exclude": "除外",
            "geoserverdisabledmessage": "シェーププロパティを設定するには、Geoserverの有効化が必要です",
            "hasparent": "<em>Has parent</em>",
            "ifcproperty": "IFCプロパティ",
            "importcadlayers": "CADレイヤーインポート",
            "importkeyattribute": "インポートキー属性",
            "importkeysource": "インポートキー元",
            "importon": "インポート有効",
            "include": "含む",
            "modestatic": "<em>Static</em>",
            "ofcadtype": "カードタイプ",
            "relativelocation": "相対位置",
            "searchdatabasefield": "全データベーステンプレート検索",
            "searchgisfield": "全GISテンプレート検索",
            "searchifcfield": "全IFCテンプレート検索",
            "shaperproperties": "シェーププロパティ",
            "singlehandler": "<em>Single handler</em>",
            "sourcelayer": "ソースレイヤー",
            "sourcelayertoexclude": "除外ソースレイヤー",
            "sourcelayertoexcludeempty": "インポートから除外するソースCADレイヤー。カンマで区切ってレイヤー名を入力(例：Layer1,Layer2,Layer3)",
            "sourcelayertoinclude": "含むソースレイヤー",
            "sourcelayertoincludeempty": "シェープとしてインポートするソースCADレイヤー。カンマで区切ってレイヤー名を入力(例：Layer1,Layer2,Layer3)",
            "sourcepaths": "<em>Source paths</em>",
            "targetlayer": "<em>Target geo attribute</em>",
            "templates": "マッピング"
        },
        "geoattributes": {
            "fieldLabels": {
                "defzoom": "初期ズーム設定",
                "fillcolor": "着色",
                "fillopacity": "不透明化",
                "geometry": "ジオメトリ",
                "geotiff": "<em>GeoTIFF</em>",
                "icon": "アイコン",
                "maxzoom": "最大ズーム",
                "minzoom": "最小ズーム",
                "pointradius": "半径",
                "referenceclass": "参照クラス",
                "shape": "シェープ",
                "strokecolor": "線の色",
                "strokedashstyle": "線の種類",
                "strokeopacity": "線の不透明度",
                "strokewidth": "線幅",
                "subtype": "サブタイプ",
                "type": "タイプ",
                "visibility": "表示"
            },
            "strings": {
                "specificproperty": "個別プロパティ"
            }
        },
        "gis": {
            "addicon": "アイコン追加",
            "addlayer": "レイヤー追加",
            "adminpassword": "アドミニストレータパスワード",
            "adminuser": "アドミニストレータユーザー",
            "associatedcard": "関係するカード",
            "associatedclass": "関係するクラス",
            "associatedgeoattribute": "関係する地理属性",
            "card": "カード",
            "defaultzoom": "初期ズーム設定",
            "deleteicon": "アイコン削除",
            "deleteicon_confirmation": "本当にこのアイコンを削除しますか?",
            "description": "説明",
            "editicon": "アイコン編集",
            "externalservices": "外部サービス",
            "file": "ファイル",
            "geoattribute": "地理属性",
            "geoserver": "Geoサーバ-",
            "geoserverlayers": "Geoサーバ-レイヤ",
            "gisnavigationenabled": "GISナビゲーション有効",
            "global": "グローバル",
            "googlemaps": "Google Maps",
            "icon": "アイコン",
            "layersorder": "レイヤー順序",
            "manageicons": "アイコン管理",
            "mapservice": "地図サービス",
            "maximumzoom": "最大ズーム",
            "minimumzoom": "最小ズーム",
            "newicon": "新規アイコン",
            "newlayer": "新レイヤー",
            "openstreetmap": "OpenStreetMap",
            "ownerclass": "クラス",
            "owneruser": "ユーザー",
            "searchemptytext": "テーマ検索",
            "servicetype": "サービスタイプ",
            "thematism": "テーマ",
            "thematisms": "テーマ",
            "type": "タイプ",
            "url": "URL",
            "workspace": "ワークスペース",
            "yahoomaps": "Yahoo Maps"
        },
        "groupandpermissions": {
            "emptytexts": {
                "searchgroups": "グループ検索...",
                "searchingrid": "リスト検索...",
                "searchusers": "ユーザー検索..."
            },
            "fieldlabels": {
                "actions": "アクション",
                "active": "有効",
                "attachments": "添付",
                "bulkabort": "一括中止",
                "cardbulkdeletion": "一括削除",
                "cardbulkedit": "一括編集",
                "datasheet": "データシート",
                "defaultpage": "デフォルトページ",
                "description": "説明",
                "detail": "詳細",
                "email": "電子メール",
                "exportcsv": "CSV ファイルエキスポート",
                "filters": "フィルター",
                "history": "履歴",
                "importcsvfile": "CSV ファイルインポート",
                "massiveeditingcards": "一括編集",
                "name": "名称",
                "note": "ノート",
                "onfiltermismatch": "フィルターに一致しない読み込みを許可",
                "relations": "リレーション",
                "schedules": "スケジュール",
                "type": "タイプ",
                "username": "ユーザー名"
            },
            "plural": "グループと権限",
            "singular": "グループと権限",
            "strings": {
                "admin": "アドミニストレータ",
                "displaynousersmessage": "ユーザーはありません",
                "displaytotalrecords": "{2}件",
                "limitedadmin": "制限されたアドミニストレータ",
                "normal": "通常",
                "readonlyadmin": "読取のみアドミニストレータ",
                "usersadmin": "ユーザー管理者"
            },
            "texts": {
                "addgroup": "グループ追加",
                "allow": "許可",
                "basic": "ベーシック",
                "class": "クラス",
                "columnsprivileges": "列の権限",
                "config": "設定",
                "configurations": "設定",
                "contextmenuitem": "コンテキストメニューアイテム",
                "copyfrom": "複製元",
                "default": "デフォルト",
                "defaultfilter": "既定のフィルター",
                "defaultfilters": "既定のフィルター",
                "defaultread": "規定＋読取",
                "description": "説明",
                "disable": "無効化",
                "editfilters": "フィルター{0}: {1}編集",
                "enable": "有効化",
                "filters": "フィルター",
                "group": "グループ",
                "name": "名称",
                "none": "権限なし",
                "otherpermissions": "他の許可",
                "permissions": "許可",
                "read": "読取権限",
                "rowsprivileges": "行の権限",
                "tab": "タブ",
                "tabs": "タブ",
                "uiconfig": "UIの構成",
                "userslist": "ユーザーリスト",
                "viewfilters": "フィルター{0}: {1}表示",
                "widget": "ウィジェット",
                "write": "書込権限"
            },
            "titles": {
                "allusers": "全ユーザー",
                "disabledactions": "無効のアクション",
                "enabledactions": "有効アクション",
                "enabledallitems": "ナビゲーションメニューの全アイテムフォルダーを有効化",
                "generalattributes": "基本設定",
                "managementclasstabs": "カード管理タブ表示",
                "managementprocesstabs": "プロセス管理タブ表示",
                "usersassigned": "許可ユーザー"
            },
            "tooltips": {
                "clearconfigurations": "コンフィグ消去",
                "filters": "フィルター",
                "manageconfigurations": "設定管理",
                "removefilters": "フィルター削除"
            }
        },
        "home": {
            "active": "有効",
            "activesize": "アクティブサイズ",
            "alltypes": "全タイプ",
            "attachments": "添付",
            "cards": "カード",
            "class": "クラス",
            "count": "カウント",
            "datasourceactiveconnections": "有効なデータソース接続",
            "datasourceidleconnections": "アイドルデータソース接続",
            "datasourcemaxactiveconnections": "有効なデータソース接続最大数",
            "datasourcemaxidleconnections": "有効なデータソース接続最大アイドル数",
            "datastatistics": "データの統計",
            "days": "日",
            "dbtimezone": "データベースタイムゾーン",
            "deleted": "削除済",
            "deletedsize": "削除サイズ",
            "diskfree": "ディスク空き容量",
            "disktotal": "ディスク合計",
            "diskused": "ディスク使用量",
            "groups": "グループ",
            "home": "ホーム",
            "host": "ホスト",
            "hours": "時",
            "items": "アイテム",
            "itemsatdate": "<em>{0} {1} at {2}</em>",
            "javamemoryfree": "Java空きメモリー",
            "javamemorytotal": "Javaメモリー合計",
            "javamemoryused": "Java使用メモリー",
            "javapid": "Java pid",
            "map": "リレーション",
            "memoryload": "メモリーロード",
            "minutes": "分",
            "modelstats": "モデル統計",
            "months": "月",
            "other": "他",
            "parameter": "パラメーター",
            "precessinstances": "プロセスインスタンス",
            "relations": "リレーション",
            "searchingrid": "リスト検索...",
            "seconds": "秒",
            "servertime": "サーバー時間",
            "servertimezone": "サーバータイムゾーン",
            "sessions": "アクティブセッション",
            "simpleclass": "シンプルクラス",
            "system": "システム",
            "systeminfo": "システム情報",
            "systemload": "システムロード",
            "systemmemoryfree": "システム空きメモリー",
            "systemmemorytotal": "システム合計メモリー",
            "systemmemoryused": "システム使用メモリー",
            "systemstatus": "システムステータス",
            "table": "テーブル",
            "tables": "データベーステーブルサイズ",
            "taskbytype": "タイプ別タスク",
            "therearenlockeditems": "{0}アイテムがロックされています",
            "total": "合計",
            "totalsize": "サイズ",
            "type": "タイプ",
            "unlockall": "全ロック解除",
            "updated": "更新",
            "updatedsize": "更新サイズ",
            "uptime": "アップタイム",
            "usedspace": "ディスク使用率",
            "usergroupstatistic": "ユーザー・グループ統計",
            "users": "ユーザー",
            "utc": "<em>UTC</em>",
            "value": "値",
            "weeks": "週"
        },
        "importexport": {
            "emptyTexts": {
                "searchfield": "全ファイルテンプレート検索",
                "searchgatetemplatesfield": "マッピング検索…"
            },
            "fieldlabels": {
                "alwayshandlemissingrecords": "<em>Always handle missing records</em>",
                "applyon": "適用",
                "classdomain": "クラス・ドメイン",
                "csvseparator": "CSVセパレーター",
                "datarownumber": "データ開始行番号",
                "exportfilter": "エキスポートフィルター",
                "fileformat": "ファイルフォーマット",
                "firstcolumnnumber": "開始カラム番号",
                "headerrownumber": "ヘッダー行番号",
                "ignorecolumn": "順序無視",
                "importkeattributes": "<em>Import key attributes</em>",
                "missingrecords": "欠落レコード",
                "source": "ソース",
                "type": "タイプ",
                "useheader": "ヘッダー使用",
                "value": "値"
            },
            "texts": {
                "account": "アカウント",
                "add": "追加",
                "adddatatemplate": "ファイルテンプレート追加",
                "addtemplate": "マッピング追加",
                "attributetoedit": "編集する属性",
                "columnname": "カラム名",
                "csv": "CSV",
                "database": "データベース",
                "databaseconfiguration": "データベース設定",
                "dataformat": "データフォーマット",
                "datetimeformat": "<em>Date time format</em>",
                "default": "デフォルト",
                "defaultvalue": "<em>Default value</em>",
                "delete": "削除",
                "emptyattributegridmessage": "属性は必須入力です",
                "erroremailtemplate": "エラー通知メールテンプレート",
                "export": "エキスポート",
                "exportfile": "エキスポートファイル",
                "filepath": "IFCエントリーパス",
                "filterfortemplate": "テンプレートフィルター: {0}",
                "ifc": "IFC",
                "import": "インポート",
                "importcriteria": "インポート条件",
                "importdatabase": "データベースインポート",
                "importexportdatabasegatetemplate": "データベースインポート",
                "importexportdatabasegatetemplates": "データベーステンプレートインポート",
                "importexportdatatemplate": "インポート・エキスポートファイルテンプレート",
                "importexportdatatemplates": "インポート・エキスポートファイルテンプレート",
                "importexportfile": "インポート・エキスポートファイル",
                "importexportgisgatetemplate": "GISインポート",
                "importexportgisgatetemplates": "GISテンプレートインポート",
                "importexportifcgatetemplate": "IFCインポート",
                "importexportifcgatetemplates": "IFCテンプレートインポート",
                "importfile": "インポートファイル",
                "importifc": "IFCファイルインポート",
                "importmode": "インポートモード",
                "merge": "マージ",
                "mode": "モード",
                "modifycard": "カード更新",
                "nodelete": "削除しない",
                "nomerge": "マージしない",
                "notificationemailtemplate": "通知メールテンプレート",
                "notifications": "通知",
                "selectanattribute": "属性選択",
                "selectmode": "選択モード",
                "tablename": "テーブル名",
                "templates": "テンプレート",
                "xls": "XLS",
                "xlsx": "XLSX"
            }
        },
        "localizations": {
            "activeonly": "アクティブのみ",
            "activity": "アクティビティ",
            "all": "全て",
            "attributeclass": "クラス属性",
            "attributedescription": "属性説明",
            "attributedomain": "ドメイン属性",
            "attributegroup": "グループ属性",
            "attributegroupdescription": "属性グループ説明",
            "attributeprocess": "プロセス属性",
            "attributereport": "レポート属性",
            "cancel": "キャンセル",
            "chartdescription": "グラフ説明",
            "chartdescriptionaxislabel": "カテゴリー軸ラベル",
            "chartparametername": "グラフパラメータ名",
            "chartvalueaxislabel": "値軸ラベル",
            "class": "クラス",
            "configuration": "設定",
            "csv": "CSV",
            "csvfile": "CSVファイル",
            "custompage": "カスタムページ",
            "dashboard": "ダッシュボード",
            "defaultlanguage": "既定の言語",
            "defaulttranslation": "デフォルト",
            "domain": "ドメイン",
            "element": "項目",
            "enabledlanguages": "利用可能な言語",
            "export": "エキスポート",
            "file": "ファイル",
            "format": "フォーマット",
            "import": "インポート",
            "languageconfiguration": "言語設定",
            "languages": "言語",
            "localization": "翻訳",
            "loginlanguages": "選択可能言語",
            "lookup": "ルックアップ",
            "menuitem": "メニュー項目",
            "pdf": "PDF",
            "process": "プロセス",
            "report": "レポート",
            "section": "セクション",
            "separator": "セパレーター",
            "showlanguagechoice": "言語選択",
            "treemenu": "メニューツリー",
            "type": "タイプ",
            "view": "ビュー",
            "widget": "ウィジェット"
        },
        "lookuptypes": {
            "strings": {
                "addvalue": "値追加",
                "colorpreview": "色プレビュー",
                "font": "フォント",
                "lookuplist": "ルックアップリスト",
                "parentdescription": "親説明",
                "textcolor": "文字色",
                "values": "値"
            },
            "title": "ルックアップ",
            "toolbar": {
                "addClassBtn": {
                    "text": "ルックアップ追加"
                },
                "classLabel": "リスト",
                "printSchemaBtn": {
                    "text": "ルックアップ印刷"
                },
                "searchTextInput": {
                    "emptyText": "全ルックアップ検索..."
                }
            },
            "type": {
                "form": {
                    "fieldsets": {
                        "generalData": {
                            "inputs": {
                                "active": {
                                    "label": "有効"
                                },
                                "name": {
                                    "label": "名称"
                                },
                                "parent": {
                                    "label": "親"
                                }
                            }
                        }
                    },
                    "values": {
                        "active": "有効"
                    }
                },
                "title": "ルックアップリスト",
                "toolbar": {
                    "cancelBtn": "キャンセル",
                    "closeBtn": "閉じる",
                    "deleteBtn": {
                        "tooltip": "削除"
                    },
                    "editBtn": {
                        "tooltip": "編集"
                    },
                    "saveBtn": "保存"
                }
            }
        },
        "menus": {
            "fieldlabels": {
                "newfolder": "新規フォルダー"
            },
            "plural": "メニュー",
            "singular": "メニュー",
            "strings": {
                "areyousuredeleteitem": "本当にこのメニューを削除しますか?",
                "delete": "メニュー削除",
                "emptyfoldername": "フォルダー名が空です"
            },
            "texts": {
                "add": "メニュー追加"
            },
            "tooltips": {
                "addfolder": "フォルダー追加",
                "remove": "削除"
            }
        },
        "navigation": {
            "bim": "BIM",
            "classes": "クラス",
            "customcomponents": "カスタムコンポーネント",
            "custompages": "カスタムページ",
            "dashboards": "ダッシュボード",
            "databasegatetemplate": "データベーステンプレート",
            "datatemplate": "ファイルテンプレート",
            "dms": "DMS",
            "dmscategories": "DMSカテゴリー",
            "dmsmodels": "DMSモデル",
            "domains": "ドメイン",
            "email": "電子メール",
            "generaloptions": "基本設定",
            "gis": "GIS",
            "gisgatetemplate": "GISテンプレート",
            "gisnavigation": "GISナビゲーション",
            "groupsandpermissions": "グループと権限",
            "ifcgatetemplate": "IFCテンプレート",
            "importexports": "インポート・エキスポート",
            "importgis": "GISインポート",
            "languages": "言語",
            "layers": "レイヤー",
            "lookuptypes": "ルックアップタイプ",
            "menus": "メニュー",
            "multitenant": "マルチテナント",
            "navigationtrees": "ナビゲーションメニュー",
            "passwordpolicy": "パスワードポリシー",
            "processes": "プロセス",
            "relationgraph": "リレーショングラフ",
            "reports": "レポート",
            "schedules": "スケジュール",
            "searchfilters": "検索フィルタ",
            "servermanagement": "サーバ管理",
            "settings": "設定",
            "simples": "シンプルクラス",
            "standard": "標準",
            "systemconfig": "システム設定",
            "taskmanager": "タスクマネージャ",
            "title": "ナビゲーション",
            "users": "ユーザー",
            "views": "ビュー",
            "workflow": "ワークフロー"
        },
        "navigationtrees": {
            "emptytexts": {
                "searchingrid": "リスト検索...",
                "searchnavigationtree": "ナビゲーションツリーを検索..."
            },
            "fieldlabels": {
                "actions": "アクション",
                "active": "有効",
                "allsubclassess": "スーパークラス",
                "description": "表示名",
                "filtersubclasses": "フィルタースーパークラス",
                "label": "ラベル",
                "name": "名称",
                "onlysomesubclassesinsuperclassnode": "サブクラス",
                "showintermediatesubclassnode": "スーパークラスノード追加",
                "source": "ソース",
                "subclasses": "サブクラス",
                "viewmode": "モード表示",
                "visiblesubclasses": "サブクラス表示"
            },
            "plural": "ナビゲーションツリー",
            "singular": "ナビゲーションツリー",
            "strings": {
                "sourceclass": "ソースクラス"
            },
            "texts": {
                "addnavigationtree": "レポート追加"
            },
            "tooltips": {
                "delete": "レポート削除",
                "disable": "レポート無効化",
                "edit": "レポート編集",
                "enable": "レポート有効化"
            }
        },
        "processes": {
            "fieldlabels": {
                "applicability": "適用性",
                "enginetype": "エンジンタイプ"
            },
            "properties": {
                "form": {
                    "fieldsets": {
                        "contextMenus": {
                            "actions": {
                                "delete": {
                                    "tooltip": "削除"
                                },
                                "edit": {
                                    "tooltip": "編集"
                                },
                                "moveDown": {
                                    "tooltip": "下げる"
                                },
                                "moveUp": {
                                    "tooltip": "上げる"
                                }
                            },
                            "inputs": {
                                "applicability": {
                                    "label": "適用性",
                                    "values": {
                                        "all": {
                                            "label": "全て"
                                        },
                                        "many": {
                                            "label": "選択"
                                        },
                                        "one": {
                                            "label": "最新"
                                        }
                                    }
                                },
                                "javascriptScript": {
                                    "label": "Javascript / カスタムGUIパラメータ"
                                },
                                "menuItemName": {
                                    "label": "メニューアイテム名",
                                    "values": {
                                        "separator": {
                                            "label": "[---------]"
                                        }
                                    }
                                },
                                "status": {
                                    "label": "ステータス",
                                    "values": {
                                        "active": {
                                            "label": "有効"
                                        }
                                    }
                                },
                                "typeOrGuiCustom": {
                                    "label": "タイプ / GUIカスタム",
                                    "values": {
                                        "component": {
                                            "label": "カスタムGUI"
                                        },
                                        "custom": {
                                            "label": "Javascript"
                                        },
                                        "separator": {
                                            "label": "[---------]"
                                        }
                                    }
                                }
                            },
                            "title": "コンテキストメニュー"
                        },
                        "defaultOrders": "デフォルト順",
                        "generalData": {
                            "inputs": {
                                "active": {
                                    "label": "有効"
                                },
                                "description": {
                                    "label": "説明"
                                },
                                "enableSaveButton": {
                                    "label": "\"保存\"ボタン非表示"
                                },
                                "name": {
                                    "label": "名称"
                                },
                                "parent": {
                                    "label": "継承元"
                                },
                                "stoppableByUser": {
                                    "label": "ユーザーによる中断可能"
                                },
                                "superclass": {
                                    "label": "スーパークラス"
                                }
                            }
                        },
                        "icon": "アイコン",
                        "processParameter": {
                            "inputs": {
                                "defaultFilter": {
                                    "label": "規定のフィルター"
                                },
                                "flowStatusAttr": {
                                    "label": "ステート属性"
                                },
                                "messageAttr": {
                                    "label": "メッセージ属性"
                                }
                            },
                            "title": "プロセスパラメータ"
                        },
                        "validation": {
                            "inputs": {
                                "validationRule": {
                                    "label": "入力チェック条件"
                                }
                            },
                            "title": "入力チェック"
                        }
                    },
                    "inputs": {
                        "status": "ステータス"
                    },
                    "values": {
                        "active": "有効"
                    }
                },
                "title": "プロパティ",
                "toolbar": {
                    "cancelBtn": "キャンセル",
                    "closeBtn": "閉じる",
                    "deleteBtn": {
                        "tooltip": "削除"
                    },
                    "disableBtn": {
                        "tooltip": "無効"
                    },
                    "editBtn": {
                        "tooltip": "編集"
                    },
                    "enableBtn": {
                        "tooltip": "有効にする"
                    },
                    "saveBtn": "保存",
                    "versionBtn": {
                        "tooltip": "バージョン"
                    }
                }
            },
            "strings": {
                "createnewcontextaction": "コンテキストアクション作成",
                "engine": "ワークフローエンジン",
                "processattachments": "プロセス添付",
                "selectxpdlfile": "XPDLファイル選択",
                "template": "テンプレート",
                "xpdlfile": "XPDLファイル"
            },
            "texts": {
                "activityattributenotfountinprocess": "{0}属性はプロセス属性リストにありません、無視されます",
                "process": "プロセス",
                "processactivated": "正常にプロセスは有効化されました",
                "processdeactivated": "正常にプロセスは無効化されました"
            },
            "title": "プロセス",
            "toolbar": {
                "addProcessBtn": {
                    "text": "プロセス追加"
                },
                "printSchemaBtn": {
                    "text": "スキーマ印刷"
                },
                "processLabel": "ワークフロー",
                "searchTextInput": {
                    "emptyText": "全プロセス検索"
                }
            }
        },
        "reports": {
            "emptytexts": {
                "searchingrid": "リスト検索...",
                "searchreports": "レポートを検索..."
            },
            "fieldlabels": {
                "actions": "アクション",
                "active": "有効",
                "description": "表示名",
                "name": "名称",
                "zipfile": "ZIPファイル"
            },
            "plural": "レポート",
            "singular": "レポート",
            "texts": {
                "addreport": "レポート追加",
                "selectfile": "ZIPファイル選択"
            },
            "titles": {
                "file": "ファイル",
                "reportsql": "レポートSQL"
            },
            "tooltips": {
                "delete": "レポート削除",
                "disable": "レポート無効化",
                "downloadpackage": "レポートパッケージダウンロード",
                "edit": "レポート編集",
                "enable": "レポート有効化",
                "viewsql": "レポートSQL表示"
            }
        },
        "schedules": {
            "actionondelete": "カード削除時実行",
            "active": "有効",
            "addschedule": "スケジュールルール定義追加",
            "apply": "適用",
            "applyonallcards": "このルールは全てのカードに適用されます。進めますか？",
            "applyonmatchingcards": "このルールは一致するカードに適用されます。進めますか？",
            "applyruletoexistingcards": "ルールを既存カードに適用",
            "attribute": "属性",
            "categories": "<em>Categories</em>",
            "category": "カテゴリー",
            "clear": "消去",
            "condition": "条件 (JavaScript)",
            "createalsoviawebservice": "Webサービスからもスケジュール作成",
            "date": "日",
            "days": "日",
            "daysadvancenotification": "期限事前通知日",
            "delayfirstdeadline": "最初の遅延期限",
            "delayfirstdeadlinevalue": "最初の遅延期限値",
            "delayperiod": "遅延期間",
            "delayvalue": "遅延値",
            "deleteschedules": "スケジュール削除",
            "endtype": "終了タイプ",
            "extendeddescription": "詳細説明",
            "frequency": "頻度",
            "frequencymultiplier": "繰り返し回数",
            "group": "グループ",
            "hidden": "非表示",
            "instant": "即時",
            "keepschedules": "スケジュールを維持",
            "klass": "クラス",
            "maxactiveschedules": "最大アクティブスケジュール",
            "months": "月",
            "newschedule": "新スケジュールルール",
            "notificationreport": "通知メール添付レポート",
            "notificationtemplate": "通知メールテンプレート",
            "numberofoccurrences": "実行回数",
            "priorities": "<em>Priorities</em>",
            "priority": "優先度",
            "read": "読み込み",
            "ruledefinitions": "ルール定義",
            "schedule": "スケジュール",
            "scheduleeditmode": "スケジュール編集モード",
            "schedulerule": "スケジュールルール定義追加",
            "scheduleruleeditmode": "スケジュールルール編集モード",
            "scheduletime": "計画時間",
            "searchschedules": "スケジュールルール検索",
            "showschedulepreview": "スケジュールプレビュー",
            "statuses": "<em>Statuses</em>",
            "task": "タスクマネージャ",
            "timezone": "タイムゾーン",
            "user": "ユーザー",
            "write": "書き込み",
            "years": "年"
        },
        "searchfilters": {
            "fieldlabels": {
                "filters": "フィルター",
                "targetclass": "ターゲットクラス"
            },
            "texts": {
                "addfilter": "フィルター追加",
                "chooseafunction": "ファンクション選択",
                "defaultforgroup": "デフォルトグループ",
                "fromfilter": "フィルター",
                "fromjoin": "<em>From join</em>",
                "fromschedule": "スケジュール検索",
                "fromsql": "SQL検索",
                "fulltext": "全文検索",
                "fulltextquery": "全文検索",
                "grantpermissions": "<em>Following groups do not have read permission on this filter:{0} Do you want to grant it?</em>",
                "writefulltextquery": "検索条件作成"
            }
        },
        "systemconfig": {
            "actions": "システムアクション",
            "addcustomconfig": "カスタム設定追加",
            "ajaxtimeout": "AJAXタイムアウト秒",
            "alfresco": "Alfresco",
            "allowonluthisfiletypesemptyvalue": "許可する拡張子をカンマ区切りで入力、例）pdf,odt,doc　空欄の場合は拡張子チェックをしません",
            "allowonlythisfiletypesforcardandemail": "アップロードファイル拡張子チェック",
            "allowonlythisfiletypesofincomingmailattachments": "受信メール添付ファイル拡張子チェック",
            "allowpasswordchange": "パスワード変更許可",
            "attachmentsfilestypes": "添付ファイルタイプ",
            "baselevel": "ベースレベル",
            "bulkactions": "一括アクション",
            "clusteringthreshold": "表示群閾値",
            "cmis": "CMIS",
            "comma": "カンマ",
            "companylogo": "ユーザーロゴ",
            "configurationmode": "設定モード",
            "content": "内容",
            "dafaultjobusername": "ジョブ初期ユーザー名",
            "debug": "デバッグ",
            "default": "デフォルト",
            "defaultchangepasswordfirstlogin": "初回ログイン時パスワード変更強制",
            "defaultforcardsbulkdeletion": "カード一括削除の既定値",
            "defaultforcardsbulkedit": "カード一括編集の既定値",
            "defaultforworkflowbuldabort": "プロセス一括中止の既定値",
            "defaultpage": "デフォルトページ",
            "detailwindowheight": "詳細ウインドウ高(%)",
            "detailwindowwidth": "詳細ウインドウ幅(%)",
            "disabled": "無効",
            "disableinactiveusers": "アクティブでないユーザーを無効化",
            "disablesynconmissingvariables": "同期無効化",
            "downloadallfiles": "全ファイル",
            "downloadlogs": "ログダウンロード",
            "dropcache": "キャッシュ破棄",
            "edgecolor": "辺の色",
            "editlogconfig": "ログ設定",
            "editmultitenantisnotallowed": "マルチテナント設定の編集はできません",
            "enableattachmenttoclosedactivities": "終了プロセスへの添付許可",
            "enabled": "有効化",
            "enablenodetooltip": "ツールチップ有効化",
            "error": "エラー",
            "extensions": "エクステンション",
            "filename": "ファイル名",
            "firstdayofweek": "<em>First day of week</em>",
            "frequency": "周期（秒）",
            "generals": "基本設定",
            "gridautorefresh": "リスト表示自動リフレッシュ",
            "hidesavebutton": "保存ボタン非表示",
            "host": "ホスト",
            "inactiveusers": "アクティブでないユーザー",
            "info": "情報",
            "initiallatitude": "緯度初期設定",
            "initialongitude": "経度初期設定",
            "initialzoom": "ズーム初期設定",
            "inlinecardheight": "インラインカード高(%)",
            "instancename": "インスタンス名",
            "keepfilteronupdatedcard": "カード更新後フィルター有効",
            "lockmanagement": "ロック管理",
            "logcategory": "ログ種類>",
            "logo": "ロゴ",
            "logs": "ログ",
            "maxlocktime": "最大ロック時間秒",
            "maxloginattempts": "最大ログイン試行回数",
            "maxloginattemptswindow": "最大ログイン試行時間（秒）</em>",
            "mimetypes": "MIMEタイプ",
            "monthsofinactivity": "休止月数",
            "multitenantactivationmessage": "データベースが復元されない限り、これらの設定を変更しても元に戻すことはできません。 続行する前にデータベースをバックアップすることをお勧めします。",
            "multitenantapllychangesquest": "本当に変更を保存しますか?",
            "multitenantinfomessage": "{0}からダウンロード可能な管理者マニュアルにあるガイドラインを参照した後にのみこれらの設定を変更することをお勧めします。",
            "multitenantname": "マルチテナントフィールドラベル",
            "nologmessage": "表示できるログはありません",
            "noteinline": "ノート表示",
            "noteinlinedefaultclosed": "インラインノートデフォルト非表示",
            "numberpreviouspasswordcannotreused": "旧パスワード再使用禁止回数",
            "passwordmanagement": "パスワード管理",
            "pause": "停止",
            "pipe": "<em>Pipe</em>",
            "popupheight": "ポップアップ高(%)",
            "popupwidth": "ポップアップ幅(%)",
            "postgres": "Postgres",
            "preferredfilecharset": "CSVエンコーディング",
            "preferredofficesuite": "オフィススイート",
            "pwddifferentprevious": "以前と同じパスワードを禁止",
            "pwddifferentusername": "ユーザー名と同じパスワードを禁止",
            "pwdforewarding": "パスワード有効期限切れ予告通知(何日前)",
            "pwdmaxage": "最大パスワード有効期限",
            "pwdminimumlength": "最小パスワード長",
            "pwdrequiredigit": "最低１つの数字を強制",
            "pwdrequirelowercase": "最低１つの小文字を強制",
            "pwdrequireuppercase": "最低１つの大文字を強制",
            "referencecombolimit": "リファレンス表示数",
            "relationlimit": "リレーション表示数",
            "semicolon": "セミコロン",
            "service": "サービス",
            "services": "サービス",
            "servicestart": "サービス開始",
            "servicestop": "サービス停止",
            "serviceurl": "サービスURL",
            "sessiontimeout": "セッションタイムアウト秒",
            "shark": "Enhydra Shark",
            "showcardlockerusername": "カードブロックユーザー名表示",
            "start": "開始",
            "status": "ステータス",
            "statusdisabled": "停止中",
            "statuserror": "エラー",
            "statusready": "実行中",
            "stepradius": "スプライト次元数",
            "synkservices": "サービス同期",
            "tab": "タブ",
            "tecnotecariver": "Tecnoteca River",
            "trace": "トレース",
            "turnautoscrolloff": "自動スクロールオフ",
            "turnautoscrollon": "自動スクロールオン",
            "unlockallcards": "全カードロック解除",
            "url": "url",
            "usercandisable": "無効化可能",
            "value": "モード",
            "viewlogs": "ログ表示",
            "warn": "警告",
            "webservicepath": "WEBサービスパス"
        },
        "tasks": {
            "account": "アカウント",
            "actionattachmentsmode": "添付動作",
            "address": "アドレス",
            "addtask": "タスク追加",
            "advanced": "詳細",
            "advanceworkflow": "詳細ワークフロー",
            "always": "常時",
            "asdefinedindatabasetemplate": "データベーステンプレート定義",
            "attachfile": "添付ファイル",
            "attachimportreport": "インポートレポート添付",
            "attachreport": "レポート添付",
            "attachtocard": "カードに添付",
            "attachtoemail": "メールに添付",
            "auto": "自動",
            "bodyparsing": "本文解析",
            "category": "カテゴリー",
            "cron": "cron",
            "databasetemplate": "データベーステンプレート",
            "day": "日",
            "dayofweek": "曜日",
            "definedinetltemplate": "インポートエキスポートテンプレートで定義",
            "deletefiles": "ファイル削除",
            "directory": "ディレクトリ",
            "disablefiles": "ファイル無効化",
            "donothing": "何もしない",
            "driverclassname": "ドライバークラス名",
            "emailtemplate": "メールテンプレート",
            "emailvariables": "メール変数",
            "emptytexts": {
                "searchcustompages": "タスクを検索...",
                "searchingrid": "リスト検索..."
            },
            "erroremailtemplate": "メールテンプレートエラー",
            "everyday": "毎日",
            "everyhour": "毎時",
            "everymonth": "毎月",
            "everyyear": "毎年",
            "fieldlabels": {
                "account": "アカウント",
                "actions": "アクション",
                "active": "有効",
                "code": "コード",
                "filter": "フィルター",
                "filtertype": "フィルタータイプ",
                "incomingfolder": "受信箱",
                "processedfolder": "下書",
                "rejectedfolder": "リジェクトフォルダー",
                "sender": "差出人",
                "startonsave": "保存して開始",
                "subject": "件名"
            },
            "filename": "ファイル名",
            "fileonserver": "サーバーのファイル",
            "filepattern": "ファイルパターン",
            "filtertype": "フィルタータイプ",
            "generalproperties": "基本設定",
            "gisgatetemplate": "GISテンプレート",
            "hour": "時",
            "ifctemplate": "IFCテンプレート",
            "importgis": "GISインポート",
            "incomingfolder": "受信箱",
            "isnotreply": "返信以外",
            "isreply": "返信",
            "jdbc": "JDBC",
            "jobusername": "ジョブユーザー名",
            "keyenddelimiter": "キー終了デリミター",
            "keystartdelimiter": "キー開始デリミター",
            "minutes": "分",
            "month": "月",
            "movefiles": "ファイル移動",
            "movereject": "不一致はゴミ箱に移動",
            "mysqlmaria": "MySQL / MariaDB",
            "never": "不適用",
            "notificationemailtemplate": "通知メールテンプレート",
            "notificationmode": "通知モード",
            "notifications": "通知",
            "of": "of",
            "onerrors": "エラー時",
            "oracle": "Oracle",
            "parameter": "パラメーター",
            "parsing": "解析",
            "password": "パスワード",
            "plural": "タスク",
            "postgres": "Postgres",
            "postimportaction": "インポート後アクション",
            "process": "プロセス",
            "processattributes": "プロセス属性",
            "processedfolder": "下書",
            "regex": "正規表現",
            "regexfilters": "正規表現フィルター",
            "rejectedfolder": "ゴミ箱",
            "replyaggressivematching": "詳細返答認識",
            "reportparameters": "レポートパラメーター",
            "saveattachments": "添付ファイル保存",
            "saveattachmentsdms": "添付ファイルをDMSに保存",
            "sendemail": "メール送信",
            "sender": "差出人",
            "sendnotiifcation": "通知メール送信",
            "settings": "設定",
            "sincurrentStepgular": "タスク",
            "source": "ソース",
            "sourcedata": "ソースデータ",
            "sourcetype": "ソースタイプ",
            "sqlserver": "SQL Server",
            "startprocess": "プロセス開始",
            "step": "ステップ",
            "strings": {
                "advanced": "詳細"
            },
            "subject": "件名",
            "taskexecuted": "{0} タスク実行済",
            "template": "テンプレート",
            "templates": "テンプレート",
            "texts": {
                "addtask": "タスク追加",
                "asyncronousevents": "非同期イベント",
                "connector": "コネクター",
                "reademails": "メールを開く",
                "sendemails": "メール送信",
                "startprocesses": "プロセス開始",
                "syncronousevents": "同期イベント"
            },
            "tooltips": {
                "cyclicexecution": "繰り返し実行",
                "delete": "タスク削除",
                "disable": "タスク無効化",
                "edit": "タスク編集",
                "enable": "タスク有効化",
                "execution": "実行",
                "singleexecution": "単独実行",
                "start": "開始",
                "started": "開始しました",
                "stop": "停止",
                "stopped": "停止しました"
            },
            "type": "タイプ",
            "url": "URL",
            "username": "ユーザー名",
            "value": "値",
            "valueenddelimiter": "値終了デリミター",
            "valuestartdelimiter": "値開始デリミター",
            "variable": "変数"
        },
        "tesks": {
            "labels": {
                "activeonsave": "保存して有効化",
                "emailaccount": "メールアカウント",
                "filtertype": "フィルタータイプ",
                "incomingfolder": "受信箱"
            }
        },
        "title": "管理",
        "users": {
            "fieldLabels": {
                "changepasswordfirstlogin": "初回ログイン時パスワード変更強制",
                "confirmpassword": "パスワード確認",
                "defaultgroup": "デフォルトグループ",
                "defaulttenant": "デフォルトテナント",
                "groups": "グループ",
                "initialpage": "初期ページ",
                "language": "言語",
                "multigroup": "マルチグループ",
                "multitenant": "マルチテナント",
                "multitenantactivationprivileges": "マルチテナント許可",
                "nodata": "データがありません",
                "service": "サービス",
                "tenant": "テナント",
                "tenants": "テナント",
                "user": "ユーザー"
            },
            "messages": {
                "passwordnotset": "パスワードは設定されていません。このユーザーはシステムにログインできません。</br>よろしいですか？"
            },
            "properties": {
                "form": {
                    "fieldsets": {
                        "generalData": {
                            "inputs": {
                                "active": {
                                    "label": "有効"
                                },
                                "description": {
                                    "label": "説明"
                                },
                                "name": {
                                    "label": "名称"
                                },
                                "stoppableByUser": {
                                    "label": "ユーザーによる中断可能"
                                }
                            }
                        }
                    }
                }
            },
            "title": "ユーザー",
            "toolbar": {
                "addUserBtn": {
                    "text": "ユーザー追加"
                },
                "searchTextInput": {
                    "emptyText": "全ユーザー検索"
                }
            }
        },
        "viewfilters": {
            "emptytexts": {
                "searchingrid": "検索..."
            },
            "texts": {
                "addfilter": "フィルター追加",
                "filterforgroup": "共有フィルター"
            }
        },
        "views": {
            "addfilter": "フィルター追加",
            "addview": "ビュー追加",
            "filterforview": "ビューフィルター: {0}",
            "ragetclass": "ターゲットクラス",
            "ralations": "リレーション",
            "targetclass": "ターゲットクラス",
            "viewfrom": "{0} {1} ビュー"
        }
    }
});