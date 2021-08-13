(function() {
    Ext.define('CMDBuildUI.locales.ms.Locales', {
        "requires": ["CMDBuildUI.locales.ms.LocalesAdministration"],
        "override": "CMDBuildUI.locales.Locales",
        "singleton": true,
        "localization": "ms",
        "administration": CMDBuildUI.locales.ms.LocalesAdministration.administration,
        "attachments": {
            "add": "Tambah lampiran",
            "attachmenthistory": "Sejarah lampiran",
            "author": "Pengarang",
            "browse": "<em>Browse &hellip;</em>",
            "category": "Kategori",
            "code": "<em>Code</em>",
            "creationdate": "Tarikh Dibuat",
            "deleteattachment": "Padam lampiran",
            "deleteattachment_confirmation": "Adakah anda pasti mahu memadamkan lampiran ini?",
            "description": "Keterangan",
            "download": "Muat turun",
            "dropfiles": "<em>Drop files here</em>",
            "editattachment": "Ubat suai lampiran",
            "file": "Fail",
            "filealreadyinlist": "<em>The file {0} is already in list.</em>",
            "filename": "Nama fail",
            "fileview": "<em>View attachment</em>",
            "invalidfiles": "<em>Remove invalid files</em>",
            "majorversion": "Versi utama",
            "modificationdate": "Tarikh ubah suai",
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
            "uploadfile": "Muatnaik fail...",
            "version": "Versi",
            "viewhistory": "Lihat sejarah lampiran",
            "warningmessages": {
                "atleast": "<em>Warning: has been loaded {0} attachments of type \"{1}\". This category expects at least {2} attachments </em>",
                "exactlynumber": "<em>Warning: has been loaded {0} attachments of type \"{1}\". This category expects {2} attachments</em>",
                "maxnumber": "<em>Warning: has been loaded {0} attachment of type \"{1}\". This category expects at most {2}  attachments</em>"
            },
            "wrongfileextension": "<em>{0} file extension is not allowed</em>"
        },
        "bim": {
            "bimViewer": "<em>Bim Viewer</em>",
            "card": {
                "label": "<em>Card</em>"
            },
            "layers": {
                "label": "<em>Layers</em>",
                "menu": {
                    "hideAll": "<em>Hide All</em>",
                    "showAll": "<em>Show All</em>"
                },
                "name": "<em>Name</em>",
                "qt": "<em>Qt</em>",
                "visibility": "<em>Visibility</em>"
            },
            "menu": {
                "camera": "<em>Camera</em>",
                "frontView": "Padangan Depan",
                "mod": "Kawalan pandangan",
                "orthographic": "Kamera Ortografi",
                "pan": "Tatal",
                "perspective": "Kamera Perspektif",
                "resetView": "Tetapan semula pandangan",
                "rotate": "putar",
                "sideView": "Padangan Sisi",
                "topView": "Padangan Atas"
            },
            "showBimCard": "<em>Open 3D viewer</em>",
            "tree": {
                "arrowTooltip": "<em>Select element</em>",
                "columnLabel": "<em>Tree</em>",
                "label": "<em>Tree</em>",
                "open_card": "<em>Open related card</em>",
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
            "add": "Tambah",
            "advancenotification": "Pemberitahuan Awal",
            "allcategories": "Semua kategori",
            "alldates": "Semua Tarikh",
            "calculated": "<em>Calculated</em>",
            "calendar": "Kalendar",
            "cancel": "<em>Mark as cancelled</em>",
            "category": "Kategori",
            "cm_confirmcancel": "<em>Are you sure you want to mark as cancelled selected schedules?</em>",
            "cm_confirmcomplete": "<em>Are you sure you want to mark as complited selected schedules?</em>",
            "cm_markcancelled": "<em>Mark as cancelled selected schedules</em>",
            "cm_markcomplete": "<em>Mark as completed selected schedules</em>",
            "complete": "Lengkap",
            "completed": "<em>Completed</em>",
            "date": "Tarikh",
            "days": "<em>Days</em>",
            "delaybeforedeadline": "<em>Delay before deadline</em>",
            "delaybeforedeadlinevalue": "<em>Delay before deadline value</em>",
            "description": "Keterangan",
            "editevent": "Ubah jadual",
            "enddate": "Tarikh Akhir",
            "endtype": "<em>End type</em>",
            "event": "Jadual",
            "executiondate": "Tarikh Pelaksanaan",
            "frequency": "Kekerapan",
            "frequencymultiplier": "<em>Frequency multiplier</em>",
            "grid": "Grid",
            "leftdays": "Beberapa hari lagi",
            "londdescription": "Keterangan Penuh",
            "manual": "<em>Manual</em>",
            "maxactiveevents": "Acara aktif Maxima",
            "messagebodydelete": "Adakah anda mahu mengalih keluar peraturan penjadual?",
            "messagebodyplural": "Terdapat {0} peraturan jadual",
            "messagebodyrecalculate": "Adakah anda ingin mengira semula peraturan jadual dengan tarikh baru?",
            "messagebodysingular": "Terdapat {0} peraturan jadual",
            "messagetitle": "Jadual semula",
            "missingdays": "<em>Missing days</em>",
            "next30days": "30 hari seterusnya",
            "next7days": "7 hari seterusnya",
            "notificationtemplate": "<em>Template used for notification</em>",
            "notificationtext": "<em>Notification text</em>",
            "occurencies": "Bilangan kejadian",
            "operation": "<em>Operation</em>",
            "partecipantgroup": "<em>Partecipant group</em>",
            "partecipantuser": "<em>Partecipant user</em>",
            "priority": "Keutamaan",
            "recalculate": "Kiraan semula",
            "referent": "Rujukan",
            "scheduler": "Penjadual",
            "sequencepaneltitle": "Menjana jadual",
            "startdate": "Tarikh Mula",
            "status": "Taraf",
            "today": "Hari ini",
            "type": "Jenis",
            "viewevent": "Lihat jadual",
            "widgetcriterion": "<em>Calculation criterion</em>",
            "widgetemails": "<em>Emails</em>",
            "widgetsourcecard": "<em>Source card</em>"
        },
        "classes": {
            "cards": {
                "addcard": "Tambah kad",
                "clone": "Klon",
                "clonewithrelations": "Klon Kad dan hubungan",
                "deletebeaware": "<em>Be aware that:</em>",
                "deleteblocked": "<em>It is not possible to proceed with the deletion because there are relations with {0}.</em>",
                "deletecard": "Padam kad",
                "deleteconfirmation": "Adakah anda pasti mahu padamkan kad ini?",
                "deleterelatedcards": "<em>also {0} related cards will be deleted</em>",
                "deleterelations": "<em>relations with {0} cards will be deleted</em>",
                "label": "Kad",
                "modifycard": "Ubah suai kad",
                "opencard": "Buka kad",
                "print": "Cetak kad"
            },
            "simple": "Mudah",
            "standard": "Piawaian"
        },
        "common": {
            "actions": {
                "add": "Tambah",
                "apply": "Guna",
                "cancel": "Batal",
                "close": "Tutup",
                "delete": "Padam",
                "edit": "Ubah",
                "execute": "Laksana",
                "help": "<em>Help</em>",
                "load": "Muatnaik",
                "open": "Buka",
                "refresh": "Pembaharuan Data",
                "remove": "Buang",
                "save": "Simpan",
                "saveandapply": "Simpan dan guna",
                "saveandclose": "Simpan dan tutup",
                "search": "Cari",
                "searchtext": "Cari..."
            },
            "attributes": {
                "nogroup": "Data Asal"
            },
            "dates": {
                "date": "d/m/Y",
                "datetime": "d/m/Y H:i:s",
                "time": "H:i:s"
            },
            "editor": {
                "clearhtml": "Kosongkan HTML",
                "expand": "<em>Expand editor</em>",
                "reduce": "<em>Reduce editor</em>",
                "unlink": "<em>Unlink</em>",
                "unlinkmessage": "<em>Transform the selected hyperlink into text.</em>"
            },
            "grid": {
                "disablemultiselection": "Matikan pelbagai pilihan",
                "enamblemultiselection": "Hidupkan pelbagai pemilihan",
                "export": "Eksport Data",
                "filterremoved": "Penapis semasa telah dialih keluar",
                "import": "Import data",
                "itemnotfound": "Item tidak dijumpai",
                "list": "Senarai",
                "opencontextualmenu": "Buka menu kontekstual",
                "print": "Cetak",
                "printcsv": "Cetak sebagai CSV",
                "printodt": "Cetak sebagai ODT",
                "printpdf": "Cetak sebagai PDF",
                "row": "Item",
                "rows": "Items",
                "subtype": "Subjenis"
            },
            "tabs": {
                "activity": "Aktiviti",
                "attachment": "<em>Attachment</em>",
                "attachments": "Lampiran",
                "card": "Kad",
                "clonerelationmode": "Mod Hubungan Klon",
                "details": "Perincian",
                "emails": "Emel",
                "history": "Sejarah",
                "notes": "Nota",
                "relations": "Hubungan",
                "schedules": "Jadual"
            }
        },
        "dashboards": {
            "tools": {
                "gridhide": "<em>Hide data grid</em>",
                "gridshow": "<em>Show data grid</em>",
                "parametershide": "<em>Hide data parameters</em>",
                "parametersshow": "<em>Show data parameters</em>",
                "reload": "Tambah semula"
            }
        },
        "emails": {
            "addattachmentsfromdocumentarchive": "<em>Add attachments from the document archive</em>",
            "alredyexistfile": "Sudah ada fail dengan nama ini",
            "archivingdate": "Tarikh pengarkiban",
            "attachfile": "Lampirkan fail",
            "bcc": "Bcc",
            "cc": "Cc",
            "composeemail": "Karang e-mel",
            "composefromtemplate": "Karang daripada templat",
            "delay": "Tangguh",
            "delays": {
                "day1": "Dalam masa 1 hari",
                "days2": "Dalam masa 2 hari",
                "days4": "Dalam masa 4 hari",
                "hour1": "1 jam",
                "hours2": "2 jam",
                "hours4": "4 jam",
                "month1": "Dalam masa 1 bulan",
                "negativeday1": "<em>1 day before</em>",
                "negativedays2": "2 hari sebelum",
                "negativedays4": "4 hari sebelum",
                "negativehour1": "1 jam sebelum",
                "negativehours2": "2 jam sebelum",
                "negativehours4": "4 jam sebelum",
                "negativemonth1": "1 bulan sebelum",
                "negativeweek1": "1 minggu sebelum",
                "negativeweeks2": "2 minggu sebelum",
                "none": "Tiada",
                "week1": "Dalam masa 1 minggu",
                "weeks2": "Dalam masa 2 minggu"
            },
            "dmspaneltitle": "Pilih lampiran dari Pangkalan Data",
            "edit": "Ubah",
            "from": "Dari",
            "gridrefresh": "Memulihkan grid",
            "keepsynchronization": "Simpan penyegerakan",
            "message": "Pesanan",
            "regenerateallemails": "Menjana semula semua e-mel",
            "regenerateemail": "Menjana semula e-mel",
            "remove": "Buang",
            "remove_confirmation": "Adakah anda pasti mahu memadam e-mel ini?",
            "reply": "balas",
            "replyprefix": "On {0}, {1} wrote:",
            "selectaclass": "Pilih kelas",
            "sendemail": "Hantar e-mel",
            "statuses": {
                "draft": "Rangka",
                "error": "<em>Error</em>",
                "outgoing": "Menghantar",
                "received": "Diterima",
                "sent": "Dihantar"
            },
            "subject": "Tajuk",
            "to": "Kepada",
            "view": "Lihat"
        },
        "errors": {
            "autherror": "Nama pengguna atau kata laluan salah",
            "classnotfound": "Kelas {0} tidak dijumpai",
            "fieldrequired": "Ruang ini perlu diisi",
            "invalidfilter": "Penapis tidak sah",
            "notfound": "Item tidak dijumpai"
        },
        "filters": {
            "actions": "Tindakan",
            "addfilter": "tambah penapis",
            "any": "Mana-mana",
            "attachments": "<em>Attachments</em>",
            "attachmentssearchtext": "<em>Attachments search text</em>",
            "attribute": "Pilih sifat",
            "attributes": "Sifat",
            "clearfilter": "Kosongkan penapis",
            "clone": "Klon",
            "copyof": "Salinan dari",
            "currentgroup": "Kumpulan Sedia ada",
            "currentuser": "Pengguna Sedia ada",
            "defaultset": "Tetapkan ke asal",
            "defaultunset": "Ubah dari asal",
            "description": "Keterangan",
            "domain": "Domain",
            "filterdata": "Tapis data",
            "fromfilter": "<em>From filter</em>",
            "fromselection": "Pilih dari",
            "group": "Kumpulan",
            "ignore": "Abai",
            "migrate": "Pindah",
            "name": "Nama",
            "newfilter": "Penapis baru",
            "noone": "Tiada sesiapa",
            "operator": "Pengendali",
            "operators": {
                "beginswith": "Mula dengan",
                "between": "Antara",
                "contained": "Terkawal",
                "containedorequal": "Terkawal atau sama",
                "contains": "Mengandungi",
                "containsorequal": "Mengandungi atau sama",
                "descriptionbegin": "<em>Description begins with</em>",
                "descriptioncontains": "<em>Description contains</em>",
                "descriptionends": "<em>Description ends with</em>",
                "descriptionnotbegin": "<em>Description does not begins with</em>",
                "descriptionnotcontain": "<em>Description does not contain</em>",
                "descriptionnotends": "<em>Description does not ends with</em>",
                "different": "Berbeza",
                "doesnotbeginwith": "Tidak bermula dengan",
                "doesnotcontain": "Tidak mengandungi",
                "doesnotendwith": "Tidak berakhir dengan",
                "endswith": "Berakhir dengan",
                "equals": "Sama",
                "greaterthan": "Lebih besar dari",
                "isnotnull": "Bukan nol",
                "isnull": "Nol",
                "lessthan": "Lebih kecil dari"
            },
            "relations": "Hubungan",
            "type": "Jenis",
            "typeinput": "Masukkan tetapan",
            "user": "Pengguna",
            "value": "Nilai"
        },
        "gis": {
            "card": "Kad",
            "cardsMenu": "Menu Kad",
            "code": "Kod",
            "description": "Keterangan",
            "extension": {
                "errorCall": "Ralat",
                "noResults": "Tiada keputusan"
            },
            "externalServices": "Khidmat luaran",
            "geographicalAttributes": "Sifat Geo",
            "geoserverLayers": "Lapisan Geoserver",
            "layers": "Lapisan",
            "list": "Senarai",
            "longpresstitle": "Geoelements di kawasan",
            "map": "Peta",
            "mapServices": "Khidmat Peta",
            "position": "Kedudukan",
            "root": "Akar",
            "tree": "Cabang",
            "type": "Jenis",
            "view": "Lihat",
            "zoom": "Zum"
        },
        "history": {
            "activityname": "Nama aktiviti",
            "activityperformer": "Pelaku aktiviti",
            "begindate": "Tarikh mula",
            "enddate": "Tarikh akhir",
            "processstatus": "Taraf",
            "user": "Pengguna"
        },
        "importexport": {
            "database": {
                "uri": "<em>Database URI</em>",
                "user": "<em>Database user</em>"
            },
            "downloadreport": "Muat turun laporan",
            "emailfailure": "Ralat berlaku semasa menghantar e-mel!",
            "emailmessage": "Melampirkan laporan import fail \"{0}\" dalam tarikh {1}",
            "emailsubject": "Import laporan data",
            "emailsuccess": "E-mel telah berjaya dihantar!",
            "export": "Eksport",
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
            "import": "Import",
            "importresponse": "Maklum balas import",
            "response": {
                "created": "Item yang dicipta",
                "deleted": "Item yang dipadamkan",
                "errors": "Ralat",
                "linenumber": "nombor baris",
                "message": "Pesanan",
                "modified": "Item diubah suai",
                "processed": "Baris diproses",
                "recordnumber": "nombor rekod",
                "unmodified": "Item tidak diubah suai"
            },
            "sendreport": "Hantar laporan",
            "template": "Templat",
            "templatedefinition": "Definisi templat"
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
                "login": "Log masuk",
                "logout": "Tukar pengguna"
            },
            "fields": {
                "group": "Kumpulan",
                "language": "Bahasa",
                "password": "Kata laluan",
                "tenants": "Penyewa",
                "username": "Nama pengguna"
            },
            "loggedin": "telah log masuk",
            "title": "Log masuk",
            "welcome": "Selamat kembali {0}."
        },
        "main": {
            "administrationmodule": "Modul Pentadbiran",
            "baseconfiguration": "Konfigurasi Asas",
            "cardlock": {
                "lockedmessage": "Anda tidak boleh mengedit kad ini kerana {0} sedang mengeditnya.",
                "someone": "seseorang"
            },
            "changegroup": "Tukar Kumpulan",
            "changetenant": "Tukar {0}",
            "confirmchangegroup": "Adakah anda pasti mahu menukar kumpulan itu?",
            "confirmchangetenants": "Adakah anda pasti mahu menukar aktif?",
            "confirmdisabletenant": "Adakah anda pasti mahu melumpuhkan tanda \"Abaikan penyewa\"?",
            "confirmenabletenant": "Adakah anda pasti mahu mendayakan tanda \"Abaikan penyewa\"?",
            "ignoretenants": "Abaikan {0}",
            "info": "Maklumat",
            "logo": {
                "cmdbuild": "logo CMDBuild",
                "cmdbuildready2use": "logo CMDBuild READY2USE",
                "companylogo": "logo Syarikat",
                "openmaint": "logo openMAINT"
            },
            "logout": "Log keluar",
            "managementmodule": "Modul pengurusan data",
            "multigroup": "Pelbagai kumpulan",
            "multitenant": "Pelbagai {0}",
            "navigation": "Navigasi",
            "pagenotfound": "Laman tidak dijumpai",
            "password": {
                "change": "Tukar kata laluan",
                "confirm": "Sahkan kata laluan",
                "email": "Alamat emel",
                "err_confirm": "Kata laluan tidak sepadan.",
                "err_diffprevious": "Kata laluan tidak boleh sama dengan yang sebelumnya.",
                "err_diffusername": "Kata laluan tidak boleh sama dengan nama pengguna.",
                "err_length": "Kata laluan mestilah sekurang-kurangnya {0}",
                "err_reqdigit": "Kata laluan mesti mengandungi sekurang-kurangnya satu digit.",
                "err_reqlowercase": "Kata laluan mesti mengandungi sekurang-kurangnya satu huruf kecil.",
                "err_requppercase": "Kata laluan mesti mengandungi sekurang-kurangnya satu aksara huruf besar.",
                "expired": "Kata laluan anda telah tamat tempoh. Anda mesti mengubahnya sekarang.",
                "forgotten": "Saya terlupa kata laluan saya",
                "new": "Kata laluan baharu",
                "old": "Kata laluan lama",
                "recoverysuccess": "Kami telah menghantar e-mel kepada anda untuk mendapatkan semula kata laluan anda.",
                "reset": "Menetapkan semula kata laluan",
                "saved": "Kata laluan disimpan dengan betul!"
            },
            "pleasecorrecterrors": "Sila betulkan ralat yang ditunjukkan!",
            "preferences": {
                "comma": "Koma",
                "decimalserror": "Medan perpuluhan mesti ada",
                "decimalstousandserror": "Perpuluhan dan pemisah Ribuan mestilah berbeza",
                "default": "Asal",
                "defaultvalue": "Nilai asal",
                "firstdayofweek": "<em>First day of week</em>",
                "gridpreferencesclear": "Kosongkan grid pilihan",
                "gridpreferencescleared": "Grid Keutamaan dikosongkan!",
                "gridpreferencessave": "Simpan pilihan grid",
                "gridpreferencessaved": "Grid Keutamaan disimpan!",
                "gridpreferencesupdate": "Kemas kini grid pilihan",
                "labelcsvseparator": "<em>CSV separator</em>",
                "labeldateformat": "Format tarikh",
                "labeldecimalsseparator": "Pemisah perpuluhan",
                "labellanguage": "Bahasa",
                "labelthousandsseparator": "Pemisah ribu",
                "labeltimeformat": "Format masa",
                "msoffice": "Microsoft Office",
                "period": "Titik",
                "preferredfilecharset": "<em>CSV encoding</em>",
                "preferredofficesuite": "Pilihan Office suite",
                "space": "Ruang",
                "thousandserror": "Medan seribu mesti ada",
                "timezone": "Zone Masa",
                "twelvehourformat": "format 12-jam",
                "twentyfourhourformat": "format 24-jam"
            },
            "searchinallitems": "Cari dalam semua item",
            "treenavcontenttitle": "<em>{0} of {1}</em>",
            "userpreferences": "Keutamaan"
        },
        "menu": {
            "allitems": "Semua items",
            "classes": "Kelas",
            "custompages": "Laman Boleh ubah",
            "dashboards": "Papan pemuka",
            "processes": "Proses",
            "reports": "Laporan",
            "views": "Lihat"
        },
        "notes": {
            "edit": "Ubah suai nota"
        },
        "notifier": {
            "attention": "Perhatian",
            "error": "Ralat",
            "genericerror": "Ralat generic",
            "genericinfo": "Maklumat generic",
            "genericwarning": "Amaran generic",
            "info": "Maklumat",
            "success": "Berjaya",
            "warning": "Amaran"
        },
        "patches": {
            "apply": "Guna pembaikan",
            "category": "Kategori",
            "description": "Keterangan",
            "name": "Nama",
            "patches": "Pembaikan"
        },
        "processes": {
            "abortconfirmation": "Adakah anda pasti mahu membatalkan proses ini?",
            "abortprocess": "Batalkan proses",
            "action": {
                "advance": "Maju",
                "label": "Tindakan"
            },
            "activeprocesses": "Proses aktif",
            "allstatuses": "Semua",
            "editactivity": "Ubah suai aktiviti",
            "openactivity": "Buka aktiviti",
            "startworkflow": "Mula",
            "workflow": "Aliran Kerja"
        },
        "relationGraph": {
            "activity": "aktiviti",
            "allLabelsOnGraph": "<em>all labels on graph</em>",
            "card": "Kad",
            "cardList": "Senarai Kad",
            "cardRelations": "Kad Hubungan",
            "choosenaviagationtree": "<em>Choose navigation tree</em>",
            "class": "Kelas",
            "classList": "Senarai Kelas",
            "compoundnode": "<em>Compound Node</em>",
            "disable": "<em>Disable</em>",
            "edges": "<em>Edges</em>",
            "enable": "<em>Enable</em>",
            "labelsOnGraph": "<em>tooltip on graph</em>",
            "level": "Tahap",
            "nodes": "<em>Nodes</em>",
            "openRelationGraph": "Buka Graf Perhubungan",
            "qt": "Qt",
            "refresh": "Tetapan semula",
            "relation": "hubungan",
            "relationGraph": "Graf Hubungan",
            "reopengraph": "<em>Reopen the graph from this node</em>"
        },
        "relations": {
            "adddetail": "Tambah perincian",
            "addrelations": "Tambah hubungan",
            "attributes": "Sifat",
            "code": "Kod",
            "deletedetail": "Padam perincian",
            "deleterelation": "Padam hubungan",
            "deleterelationconfirm": "<em>Are you sure you want to delete this relation?</em>",
            "description": "Keterangan",
            "editcard": "Ubah kad",
            "editdetail": "Ubah perincian",
            "editrelation": "Ubah hubungan",
            "extendeddata": "<em>Extended data</em>",
            "mditems": "items",
            "missingattributes": "Hilang sifat wajib",
            "opencard": "Buka kad hubungan",
            "opendetail": "Tunjuk perincian",
            "type": "Jenis"
        },
        "reports": {
            "csv": "CSV",
            "download": "Muat turun",
            "format": "Format",
            "odt": "ODT",
            "pdf": "PDF",
            "print": "Cetak",
            "reload": "Tambah semula",
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
            "addThematism": "Tambah Thematism",
            "analysisType": "Jenis Analisis",
            "attribute": "Sifat",
            "calculateRules": "Jana gaya peraturan",
            "clearThematism": "Kosongkan Thematism",
            "color": "Warna",
            "defineLegend": "Takrifan lejen",
            "defineThematism": "Takrifan Thematism",
            "function": "Fungsi",
            "generate": "Jana",
            "geoAttribute": "Sifat Geographic",
            "graduated": "Lulus",
            "highlightSelected": "Serlahkan item yang dipilih",
            "intervals": "selang masa",
            "legend": "Lejen",
            "name": "nama",
            "newThematism": "Thematism baru",
            "punctual": "Tepat masa",
            "quantity": "Kira",
            "segments": "Bahagian",
            "source": "Sumber",
            "table": "Jadual",
            "thematism": "Thematisms",
            "value": "Nilai"
        },
        "widgets": {
            "customform": {
                "addrow": "Tambah baris",
                "clonerow": "Klon baris",
                "datanotvalid": "<em>Data not valid</em>",
                "deleterow": "Padam baris",
                "editrow": "Ubah baris",
                "export": "Eksport",
                "import": "Import",
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
                "refresh": "Tetapkan ke asal"
            },
            "linkcards": {
                "checkedonly": "<em>Checked only</em>",
                "editcard": "Ubah kad",
                "opencard": "Buka kad",
                "refreshselection": "Guna pilihan asal",
                "togglefilterdisabled": "Matikan penapisan grid",
                "togglefilterenabled": "Hidupkan penapis grid"
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