(function() {
    Ext.define('CMDBuildUI.locales.id.Locales', {
        "requires": ["CMDBuildUI.locales.id.LocalesAdministration"],
        "override": "CMDBuildUI.locales.Locales",
        "singleton": true,
        "localization": "id",
        "administration": CMDBuildUI.locales.id.LocalesAdministration.administration,
        "attachments": {
            "add": "Tambahkan sisipan",
            "attachmenthistory": "Sejarah lampiran",
            "author": "Penulis",
            "browse": "Browse &hellip;",
            "category": "Kategori",
            "code": "Kode",
            "creationdate": "Tanggal pembuatan",
            "deleteattachment": "Hapus lampiran",
            "deleteattachment_confirmation": "Apakah Anda yakin ingin menghapus lampiran ini?",
            "description": "Deskripsi",
            "download": "Download",
            "dropfiles": "Jatuhkan file di sini",
            "editattachment": "Lampiran Modify",
            "file": "Mengajukan",
            "filealreadyinlist": "File {0} sudah di daftar.",
            "filename": "Nama file",
            "fileview": "<em>View attachment</em>",
            "invalidfiles": "Hapus file yang tidak valid",
            "majorversion": "Versi utama",
            "modificationdate": "Tanggal Modifikasi",
            "new": "Lampiran Baru",
            "nocategory": "Tidak ada kategori",
            "preview": "Lihat",
            "removefile": "Hapus file yang tidak valid",
            "statuses": {
                "empty": "file kosong",
                "error": "Kesalahan",
                "extensionNotAllowed": "ekstensi file tidak diperbolehkan",
                "loaded": "Termuat",
                "ready": "Siap"
            },
            "successupload": "{0} lampiran telah terupload.",
            "uploadfile": "Unggah data...",
            "version": "Versi",
            "viewhistory": "Lihat riwayat lampiran",
            "warningmessages": {
                "atleast": "Peringatan: telah dimuat {0} lampiran tipe \"{1}\". Kategori ini mengharapkan setidaknya {2} lampiran",
                "exactlynumber": "Peringatan: telah dimuat {0} lampiran tipe \"{1}\". Kategori ini mengharapkan {2} lampiran",
                "maxnumber": "Peringatan: telah dimuat {0} lampiran tipe \"{1}\". Kategori ini mengharapkan paling {2} lampiran"
            },
            "wrongfileextension": "{0} ekstensi file tidak diizinkan"
        },
        "bim": {
            "bimViewer": "Bim Viewer",
            "card": {
                "label": "Kartu"
            },
            "layers": {
                "label": "Lapisan",
                "menu": {
                    "hideAll": "Sembunyikan semua",
                    "showAll": "Tunjukkan semua"
                },
                "name": "Nama",
                "qt": "Qt",
                "visibility": "Jarak penglihatan"
            },
            "menu": {
                "camera": "Kamera",
                "frontView": "Tampak depan",
                "mod": "kontrol Viewer",
                "orthographic": "Kamera Ortografi",
                "pan": "Scroll",
                "perspective": "Perspektif Kamera",
                "resetView": "Atur ulang tampilan",
                "rotate": "Memutar",
                "sideView": "Tampilan samping",
                "topView": "Pandangan atas"
            },
            "showBimCard": "Penampil terbuka 3D",
            "tree": {
                "arrowTooltip": "Pilih elemen",
                "columnLabel": "Pohon",
                "label": "Pohon",
                "open_card": "kartu terkait terbuka",
                "root": "Ifc Root"
            }
        },
        "bulkactions": {
            "abort": "Batalkan item yang dipilih",
            "cancelselection": "Bembatalkan seleksi",
            "confirmabort": "Anda batal {0} contoh proses. Apakah Anda yakin bahwa Anda ingin melanjutkan?",
            "confirmdelete": "Anda menghapus {0} kartu. Apakah Anda yakin bahwa Anda ingin melanjutkan?",
            "confirmdeleteattachements": "Anda menghapus {0} lampiran. Apakah Anda yakin bahwa Anda ingin melanjutkan?",
            "confirmedit": "Anda memodifikasi {0} untuk {1} kartu. Apakah Anda yakin bahwa Anda ingin melanjutkan?",
            "delete": "Hapus item yang dipilih",
            "download": "Download lampiran terpilih",
            "edit": "Ubah item yang dipilih",
            "selectall": "Pilih semua item"
        },
        "calendar": {
            "active_expired": "Aktif/Kadaluarsa",
            "add": "Tambah jadwal",
            "advancenotification": "Pemberitahuan hari terlebih dahulu",
            "allcategories": "Semua Kategori",
            "alldates": "Semua tanggal",
            "calculated": "dihitung",
            "calendar": "Kalender",
            "cancel": "Tandai sebagai dibatalkan",
            "category": "Kategori",
            "cm_confirmcancel": "Apakah Anda yakin ingin menandai sebagai jadwal yang dipilih dibatalkan?",
            "cm_confirmcomplete": "Apakah Anda yakin ingin menandai sebagai jadwal yang dipilih complited?",
            "cm_markcancelled": "Tandai sebagai jadwal yang dipilih dibatalkan",
            "cm_markcomplete": "Tandai sebagai jadwal yang dipilih selesai",
            "complete": "Mark sebagai selesai",
            "completed": "Lengkap",
            "date": "Tanggal",
            "days": "hari-hari",
            "delaybeforedeadline": "Delay sebelum batas waktu",
            "delaybeforedeadlinevalue": "Penundaan sebelum nilai batas waktu",
            "description": "Deskripsi",
            "editevent": "mengedit jadwal",
            "enddate": "Tanggal akhir",
            "endtype": "Jenis akhir",
            "event": "Susunan acara",
            "executiondate": "Tanggal eksekusi",
            "frequency": "Frekuensi",
            "frequencymultiplier": "frekuensi multiplier",
            "grid": "Grid",
            "leftdays": "Hari untuk pergi",
            "londdescription": "Deskripsi Lengkap",
            "manual": "Panduan",
            "maxactiveevents": "Jadwal aktif Max",
            "messagebodydelete": "Apakah Anda ingin menghapus aturan penjadwal?",
            "messagebodyplural": "Ada {0} aturan jadwal",
            "messagebodyrecalculate": "Apakah Anda ingin menghitung ulang jadwal memerintah dengan tanggal baru?",
            "messagebodysingular": "Ada {0} jadwal aturan",
            "messagetitle": "Jadwal menghitung ulang",
            "missingdays": "Hilang hari",
            "next30days": "Berikutnya 30 hari",
            "next7days": "Berikutnya 7 hari",
            "notificationtemplate": "Template yang digunakan untuk pemberitahuan",
            "notificationtext": "Teks pemberitahuan",
            "occurencies": "Jumlah occurencies",
            "operation": "Operasi",
            "partecipantgroup": "Kelompok Partecipant",
            "partecipantuser": "Pengguna Partecipant",
            "priority": "Prioritas",
            "recalculate": "Hitung Ulang",
            "referent": "rujukan",
            "scheduler": "scheduler",
            "sequencepaneltitle": "menghasilkan jadwal",
            "startdate": "Mulai tanggal",
            "status": "Status",
            "today": "Hari ini",
            "type": "Tipe",
            "viewevent": "Lihat jadwal",
            "widgetcriterion": "kriteria perhitungan",
            "widgetemails": "email",
            "widgetsourcecard": "Kartu sumber"
        },
        "classes": {
            "cards": {
                "addcard": "Tambah kartu",
                "clone": "Klon",
                "clonewithrelations": "Kartu Clone dan hubungan",
                "deletebeaware": "Perhatikan :",
                "deleteblocked": "Tidak dapat melanjutkan  penghapusan karena ada hubungan dengan {0}.",
                "deletecard": "Hapus kartu",
                "deleteconfirmation": "Apakah Anda yakin ingin menghapus kartu ini?",
                "deleterelatedcards": "juga {0} kartu terkait akan dihapus",
                "deleterelations": "hubungan dengan {0} kartu akan dihapus",
                "label": "Kartu-kartu",
                "modifycard": "Kartu Modify",
                "opencard": "Buka kartu",
                "print": "Cetak kartu"
            },
            "simple": "Sederhana",
            "standard": "Standar"
        },
        "common": {
            "actions": {
                "add": "Menambahkan",
                "apply": "Menerapkan",
                "cancel": "Membatalkan",
                "close": "Menutup",
                "delete": "Menghapus",
                "edit": "mengedit",
                "execute": "Menjalankan",
                "help": "Bantuan",
                "load": "Beban",
                "open": "Buka",
                "refresh": "Data penyegaran",
                "remove": "Menghapus",
                "save": "Menyimpan",
                "saveandapply": "Simpan dan menerapkan",
                "saveandclose": "Simpan dan tutup",
                "search": "Cari",
                "searchtext": "Cari..."
            },
            "attributes": {
                "nogroup": "Data dasar"
            },
            "dates": {
                "date": "d / m / Y",
                "datetime": "d / m / Y H: i: s",
                "time": "H:i:s"
            },
            "editor": {
                "clearhtml": "Batal HTML",
                "expand": "Besarkan Editor",
                "reduce": "Kecilkan Editor",
                "unlink": "<em>Unlink</em>",
                "unlinkmessage": "<em>Transform the selected hyperlink into text.</em>"
            },
            "grid": {
                "disablemultiselection": "Nonaktifkan multi-seleksi",
                "enamblemultiselection": "Aktifkan multi-seleksi",
                "export": "Data ekspor",
                "filterremoved": "Filter saat ini telah dihapus",
                "import": "impor data",
                "itemnotfound": "Barang tidak ditemukan",
                "list": "Daftar",
                "opencontextualmenu": "menu kontekstual terbuka",
                "print": "Mencetak",
                "printcsv": "Cetak sebagai CSV",
                "printodt": "Cetak sebagai ODT",
                "printpdf": "Cetak sebagai PDF",
                "row": "Barang",
                "rows": "Item",
                "subtype": "Subtipe"
            },
            "tabs": {
                "activity": "Aktivitas",
                "attachment": "lampiran",
                "attachments": "lampiran",
                "card": "Kartu",
                "clonerelationmode": "Clone Hubungan Modus",
                "details": "Rincian",
                "emails": "email",
                "history": "Sejarah",
                "notes": "Catatan",
                "relations": "Hubungan",
                "schedules": "Jadwal"
            }
        },
        "dashboards": {
            "tools": {
                "gridhide": "Sembunyikan data grid",
                "gridshow": "Tampilkan data grid",
                "parametershide": "Sembunyikan Data Parameter",
                "parametersshow": "Tampilkan Data Parameter",
                "reload": "Muat Ulang"
            }
        },
        "emails": {
            "addattachmentsfromdocumentarchive": "Tambahkan lampiran dari dokumen arsip",
            "alredyexistfile": "Sudah ada file dengan nama ini",
            "archivingdate": "Pengarsipan tanggal",
            "attachfile": "Lampirkan file",
            "bcc": "Bcc",
            "cc": "cc",
            "composeemail": "Menulis email",
            "composefromtemplate": "Compose dari template",
            "delay": "Menunda",
            "delays": {
                "day1": "Dalam 1 hari",
                "days2": "Dalam 2 hari",
                "days4": "Dalam 4 hari",
                "hour1": "1 jam",
                "hours2": "2 jam",
                "hours4": "4 jam",
                "month1": "Dalam 1 bulan",
                "negativeday1": "1 hari sebelum",
                "negativedays2": "2 hari sebelum",
                "negativedays4": "4 hari sebelum",
                "negativehour1": "1 jam sebelum",
                "negativehours2": "2 jam sebelum",
                "negativehours4": "4 jam sebelum",
                "negativemonth1": "1 bulan sebelum",
                "negativeweek1": "1 minggu sebelum",
                "negativeweeks2": "2 minggu sebelum",
                "none": "tak satupun",
                "week1": "Dalam 1 minggu",
                "weeks2": "Dalam 2 minggu"
            },
            "dmspaneltitle": "Pilih lampiran dari Database",
            "edit": "mengedit",
            "from": "Dari",
            "gridrefresh": "Grid penyegaran",
            "keepsynchronization": "Sinkronisasi Terus",
            "message": "Pesan",
            "regenerateallemails": "Regenerasi semua e-mail",
            "regenerateemail": "Regenerate e-mail",
            "remove": "Menghapus",
            "remove_confirmation": "Apakah Anda yakin ingin menghapus email ini?",
            "reply": "Balasan",
            "replyprefix": "Pada {0}, {1} menulis:",
            "selectaclass": "Pilih kelas",
            "sendemail": "Mengirim email",
            "statuses": {
                "draft": "Minuman",
                "error": "Kesalahan",
                "outgoing": "Keluar",
                "received": "Diterima",
                "sent": "mengirim"
            },
            "subject": "Subyek",
            "to": "Untuk",
            "view": "Melihat"
        },
        "errors": {
            "autherror": "Username atau password salah",
            "classnotfound": "Kelas {0} tidak ditemukan",
            "fieldrequired": "Bagian ini diperlukan",
            "invalidfilter": "Filter tidak valid",
            "notfound": "Barang tidak ditemukan"
        },
        "filters": {
            "actions": "tindakan",
            "addfilter": "Tambah Filter",
            "any": "Apapun",
            "attachments": "<em>Attachments</em>",
            "attachmentssearchtext": "<em>Attachments search text</em>",
            "attribute": "Pilih atribut",
            "attributes": "Atribut",
            "clearfilter": "Hapus penyaring",
            "clone": "Klon",
            "copyof": "Salinan dari",
            "currentgroup": "kelompok saat",
            "currentuser": "pengguna saat",
            "defaultset": "Ditetapkan sebagai default",
            "defaultunset": "Unset dari default",
            "description": "Deskripsi",
            "domain": "Domain",
            "filterdata": "Filter Data",
            "fromfilter": "<em>From filter</em>",
            "fromselection": "dari seleksi",
            "group": "Kelompok",
            "ignore": "Mengabaikan",
            "migrate": "Bermigrasi",
            "name": "Nama",
            "newfilter": "Filter Baru",
            "noone": "tak seorangpun",
            "operator": "Operator",
            "operators": {
                "beginswith": "Dimulai dengan",
                "between": "Antara",
                "contained": "Terkandung",
                "containedorequal": "Terkandung atau sama",
                "contains": "Mengandung",
                "containsorequal": "Berisi atau sama",
                "descriptionbegin": "<em>Description begins with</em>",
                "descriptioncontains": "Isi Deskripsi",
                "descriptionends": "<em>Description ends with</em>",
                "descriptionnotbegin": "<em>Description does not begins with</em>",
                "descriptionnotcontain": "<em>Description does not contain</em>",
                "descriptionnotends": "<em>Description does not ends with</em>",
                "different": "Berbeda",
                "doesnotbeginwith": "Tidak dimulai dengan",
                "doesnotcontain": "Tidak mengandung",
                "doesnotendwith": "Tidak berakhir dengan",
                "endswith": "Berakhir dengan",
                "equals": "equals",
                "greaterthan": "Lebih besar dari",
                "isnotnull": "Tidak null",
                "isnull": "Apakah nol",
                "lessthan": "Kurang dari"
            },
            "relations": "Hubungan",
            "type": "Tipe",
            "typeinput": "Parameter masukan",
            "user": "pemakai",
            "value": "Nilai"
        },
        "gis": {
            "card": "Kartu",
            "cardsMenu": "kartu menu",
            "code": "Kode",
            "description": "Deskripsi",
            "extension": {
                "errorCall": "Kesalahan",
                "noResults": "Tidak ada hasil"
            },
            "externalServices": "Pelayanan luar",
            "geographicalAttributes": "Atribut Geo",
            "geoserverLayers": "lapisan geoserver",
            "layers": "Lapisan",
            "list": "Daftar",
            "longpresstitle": "Geoelements di daerah",
            "map": "Peta",
            "mapServices": "Peta Layanan",
            "position": "Posisi",
            "root": "Akar",
            "tree": "Pohon",
            "type": "Tipe",
            "view": "Melihat",
            "zoom": "Perbesar"
        },
        "history": {
            "activityname": "nama aktivitas",
            "activityperformer": "kegiatan pemain",
            "begindate": "tanggal mulai",
            "enddate": "tanggal akhir",
            "processstatus": "Status",
            "user": "pemakai"
        },
        "importexport": {
            "database": {
                "uri": "URI Database",
                "user": "Pengguna Database"
            },
            "downloadreport": "Download laporan",
            "emailfailure": "Kesalahan terjadi saat mengirim email!",
            "emailmessage": "Terlampir laporan impor file \"{0}\" di tanggal {1}",
            "emailsubject": "Laporan Data impor",
            "emailsuccess": "Email telah berhasil dikirim!",
            "export": "Ekspor",
            "exportalldata": "Semua Data",
            "exportfiltereddata": "Hanya data yang sesuai grid filter",
            "gis": {
                "shapeimportdisabled": "Impor dari bentuk tidak diaktifkan untuk template ini",
                "shapeimportenabled": "Konfigurasi bentuk import"
            },
            "ifc": {
                "card": "<em>Card</em>",
                "project": "Proyek",
                "sourcetype": "Di impor dari"
            },
            "import": "Impor",
            "importresponse": "respon impor",
            "response": {
                "created": "item dibuat",
                "deleted": "item yang dihapus",
                "errors": "kesalahan",
                "linenumber": "Nomor baris",
                "message": "Pesan",
                "modified": "Item Dimodifikasi",
                "processed": "baris diproses",
                "recordnumber": "Catatan nomor",
                "unmodified": "item yang tidak dimodifikasi"
            },
            "sendreport": "Kirim Laporan",
            "template": "Template",
            "templatedefinition": "Definisi template"
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
                "login": "Gabung",
                "logout": "Ganti pengguna"
            },
            "fields": {
                "group": "Kelompok",
                "language": "Bahasa",
                "password": "Kata sandi",
                "tenants": "Penyewa",
                "username": "Nama pengguna"
            },
            "loggedin": "Login",
            "title": "Gabung",
            "welcome": "Selamat kembali {0}."
        },
        "main": {
            "administrationmodule": "Modul Administrasi",
            "baseconfiguration": "konfigurasi dasar",
            "cardlock": {
                "lockedmessage": "Anda tidak dapat mengedit kartu ini karena {0} menyuntingnya.",
                "someone": "some one"
            },
            "changegroup": "perubahan kelompok",
            "changetenant": "perubahan {0}",
            "confirmchangegroup": "Apakah Anda yakin ingin mengubah kelompok?",
            "confirmchangetenants": "Apakah Anda yakin Anda ingin mengubah penyewa aktif?",
            "confirmdisabletenant": "Apakah Anda yakin ingin menonaktifkan flag \"Abaikan penyewa\"?",
            "confirmenabletenant": "Apakah Anda yakin Anda ingin mengaktifkan \"Abaikan penyewa\" bendera?",
            "ignoretenants": "Abaikan {0}",
            "info": "Info",
            "logo": {
                "cmdbuild": "logo CMDBuild",
                "cmdbuildready2use": "logo CMDBuild READY2USE",
                "companylogo": "Logo perusahaan",
                "openmaint": "Logo openMAINT"
            },
            "logout": "Keluar",
            "managementmodule": "modul manajemen data",
            "multigroup": "Kelompok multi",
            "multitenant": "multi-{0}",
            "navigation": "Navigasi",
            "pagenotfound": "Halaman tidak ditemukan",
            "password": {
                "change": "Ganti kata sandi",
                "confirm": "Konfirmasi sandi",
                "email": "Alamat email",
                "err_confirm": "Kata sandi tidak cocok.",
                "err_diffprevious": "Kata sandi tidak bisa identik dengan yang sebelumnya.",
                "err_diffusername": "Kata sandi tidak bisa identik dengan nama pengguna.",
                "err_length": "Kanti sandi harus minimal {0} karakter.",
                "err_reqdigit": "Kata sandi harus berisi setidaknya satu digit.",
                "err_reqlowercase": "Kata sandi harus berisi setidaknya satu karakter huruf kecil.",
                "err_requppercase": "Kata sandiharus berisi setidaknya satu karakter huruf besar.",
                "expired": "Kata sandi Anda telah kedaluwarsa. Anda harus mengubahnya sekarang.",
                "forgotten": "Saya lupa kata sandi",
                "new": "Kata sandi baru",
                "old": "Password lama",
                "recoverysuccess": "Kami telah mengirim email dengan instruksi untuk memulihkan sandi Anda.",
                "reset": "Atur ulang kata sandi",
                "saved": "Kata sandi disimpan dengan benar!"
            },
            "pleasecorrecterrors": "Harap perbaiki kesalahan yang ditunjukkan!",
            "preferences": {
                "comma": "Koma",
                "decimalserror": "bidang desimal harus ada",
                "decimalstousandserror": "Desimal dan Ribuan pemisah harus differents",
                "default": "standar",
                "defaultvalue": "nilai standar",
                "firstdayofweek": "<em>First day of week</em>",
                "gridpreferencesclear": "preferensi jaringan yang jelas",
                "gridpreferencescleared": "preferensi Grid dibersihkan!",
                "gridpreferencessave": "Simpan preferensi grid",
                "gridpreferencessaved": "preferensi Grid disimpan!",
                "gridpreferencesupdate": "preferensi pembaruan jaringan",
                "labelcsvseparator": "Pembatas CSV",
                "labeldateformat": "Format tanggal",
                "labeldecimalsseparator": "desimal separator",
                "labellanguage": "Bahasa",
                "labelthousandsseparator": "Ribuan pemisah",
                "labeltimeformat": "Format waktu",
                "msoffice": "Microsoft Office",
                "period": "Titik",
                "preferredfilecharset": "CSV encoding",
                "preferredofficesuite": "Suite Office pilihan",
                "space": "Ruang",
                "thousandserror": "Ribuan lapangan harus hadir",
                "timezone": "Zona waktu",
                "twelvehourformat": "format 12-jam",
                "twentyfourhourformat": "format 24-jam"
            },
            "searchinallitems": "Cari di semua item",
            "treenavcontenttitle": "{0} dar {1}",
            "userpreferences": "preferensi"
        },
        "menu": {
            "allitems": "Semua barang",
            "classes": "kelas-kelas",
            "custompages": "halaman kustom",
            "dashboards": "dashboard",
            "processes": "proses",
            "reports": "Laporan",
            "views": "views"
        },
        "notes": {
            "edit": "Catatan Modify"
        },
        "notifier": {
            "attention": "Perhatian",
            "error": "Kesalahan",
            "genericerror": "kesalahan umum",
            "genericinfo": "Info generik",
            "genericwarning": "peringatan generik",
            "info": "Info",
            "success": "Keberhasilan",
            "warning": "Peringatan"
        },
        "patches": {
            "apply": "Terapkan patch",
            "category": "Kategori",
            "description": "Deskripsi",
            "name": "Nama",
            "patches": "patch"
        },
        "processes": {
            "abortconfirmation": "Apakah Anda yakin Anda ingin membatalkan proses ini?",
            "abortprocess": "proses batalkan",
            "action": {
                "advance": "Muka",
                "label": "Tindakan"
            },
            "activeprocesses": "proses yang aktif",
            "allstatuses": "Semua",
            "editactivity": "Kegiatan Modify",
            "openactivity": "Kegiatan terbuka",
            "startworkflow": "Mulailah",
            "workflow": "Workflow"
        },
        "relationGraph": {
            "activity": "aktivitas",
            "allLabelsOnGraph": "Semua label pada grafik",
            "card": "Kartu",
            "cardList": "Daftar kartu",
            "cardRelations": "Hubungan kartu",
            "choosenaviagationtree": "Pilih pohon navigasi",
            "class": "Kelas",
            "classList": "kelas Daftar",
            "compoundnode": "Node compound",
            "disable": "Nonaktifkan",
            "edges": "<em>Edges</em>",
            "enable": "Memungkinkan",
            "labelsOnGraph": "tooltip pada grafik",
            "level": "Tingkat",
            "nodes": "<em>Nodes</em>",
            "openRelationGraph": "Terbuka Hubungan Grafik",
            "qt": "Qt",
            "refresh": "Menyegarkan",
            "relation": "Hubungan",
            "relationGraph": "Hubungan Grafik",
            "reopengraph": "Membuka kembali grafik dari node ini"
        },
        "relations": {
            "adddetail": "Tambah rinci",
            "addrelations": "Tambah hubungan",
            "attributes": "Atribut",
            "code": "Kode",
            "deletedetail": "Hapus rinci",
            "deleterelation": "Hapus hubungan",
            "deleterelationconfirm": "Apa anda yakin akan menghapus relasi ini?",
            "description": "Deskripsi",
            "editcard": "mengedit kartu",
            "editdetail": "Edit rincian",
            "editrelation": "mengedit hubungan",
            "extendeddata": "Data tambahan",
            "mditems": "Item",
            "missingattributes": "Hilang atribut wajib",
            "opencard": "kartu terkait terbuka",
            "opendetail": "Tampilkan rinci",
            "type": "Tipe"
        },
        "reports": {
            "csv": "CSV",
            "download": "Download",
            "format": "Format",
            "odt": "ODT",
            "pdf": "PDF",
            "print": "Mencetak",
            "reload": "Reload",
            "rtf": "RTF"
        },
        "system": {
            "data": {
                "lookup": {
                    "CalendarCategory": {
                        "default": {
                            "description": "standar"
                        }
                    },
                    "CalendarFrequency": {
                        "daily": {
                            "description": "Harian"
                        },
                        "monthly": {
                            "description": "Bulanan"
                        },
                        "once": {
                            "description": "Sekali"
                        },
                        "weekly": {
                            "description": "Mingguan"
                        },
                        "yearly": {
                            "description": "Tahunan"
                        }
                    },
                    "CalendarPriority": {
                        "default": {
                            "description": "standar"
                        }
                    }
                }
            }
        },
        "thematism": {
            "addThematism": "Menambahkan Thematism",
            "analysisType": "Jenis analisis",
            "attribute": "Atribut",
            "calculateRules": "Menghasilkan aturan gaya",
            "clearThematism": "Jelas Thematism",
            "color": "Warna",
            "defineLegend": "Definisi Legenda",
            "defineThematism": "Definisi Thematism",
            "function": "Fungsi",
            "generate": "Menghasilkan",
            "geoAttribute": "Atribut Geographic",
            "graduated": "lulus",
            "highlightSelected": "Sorot item yang dipilih",
            "intervals": "Interval",
            "legend": "Legenda",
            "name": "nama",
            "newThematism": "baru Thematism",
            "punctual": "Tepat waktu",
            "quantity": "Menghitung",
            "segments": "segmen",
            "source": "Sumber",
            "table": "Meja",
            "thematism": "Thematisms",
            "value": "Nilai"
        },
        "widgets": {
            "customform": {
                "addrow": "Menambahkan baris",
                "clonerow": "Baris Clone",
                "datanotvalid": "Data tidak valid",
                "deleterow": "Hapus baris",
                "editrow": "mengedit baris",
                "export": "Ekspor",
                "import": "Impor",
                "importexport": {
                    "expattributes": "Data ekspor",
                    "file": "File",
                    "filename": "Nama file",
                    "format": "Format",
                    "importmode": "mode impor",
                    "keyattributes": "atribut kunci",
                    "missingkeyattr": "Silakan pilih minimal satu atribut kunci",
                    "modeadd": "Tambah",
                    "modemerge": "Gabung",
                    "modereplace": "Timpa",
                    "separator": "Pemisah"
                },
                "refresh": "Menyegarkan ke default"
            },
            "linkcards": {
                "checkedonly": "Hanya di cek",
                "editcard": "mengedit kartu",
                "opencard": "Buka kartu",
                "refreshselection": "Menerapkan pilihan standar",
                "togglefilterdisabled": "Nonaktifkan Filter jaringan",
                "togglefilterenabled": "Mengaktifkan filter jaringan"
            },
            "required": "Widget ini dibutuhkan"
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