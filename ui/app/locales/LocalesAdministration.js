Ext.define('CMDBuildUI.locales.LocalesAdministration', {
    singleton: true,

    localization: 'en',

    administration: {
        home: {
            home: 'Home',
            systemstatus: 'System status',
            systeminfo: 'System info',
            systemload: 'System load',
            usedspace: 'Disk usage',
            memoryload: 'Memory load',
            uptime: 'Application up time',
            servertime: 'Server time',
            servertimezone: 'Server timezone',
            dbtimezone: 'DB timezone',
            diskused: 'Disk used',
            diskfree: 'Disk free',
            disktotal: 'Disk total',
            javapid: 'Java pid',
            javamemoryused: 'Java memory used',
            javamemoryfree: 'Java memory free',
            javamemorytotal: 'Java memory total',
            systemmemoryused: 'System memory used',
            systemmemoryfree: 'System memory free',
            systemmemorytotal: 'System memory total',
            datasourceactiveconnections: 'Datasource active connections',
            datasourceidleconnections: 'Datasource idle connections',
            datasourcemaxactiveconnections: 'Datasource max active connections',
            datasourcemaxidleconnections: 'Datasource max idle connections',
            host: 'Host',
            parameter: 'Parameter',
            value: 'Value',
            months: 'months',
            weeks: 'weeks',
            days: 'days',
            hours: 'hours',
            minutes: 'minutes',
            seconds: 'seconds',
            utc: 'UTC',
            searchingrid: 'Search in grid...',
            modelstats: 'Models statistics',
            sessions: 'Active sessions',
            groups: 'Groups',
            users: 'Users',
            usergroupstatistic: 'Users and groups statistics',
            taskbytype: 'Tasks by type',
            total: 'Total',
            tables: 'Database tables sizes',
            table: 'Table',
            items: 'Items',
            active: 'Active',
            activesize: 'Active size',
            updated: 'Updated',
            updatedsize: 'Updated size',
            deleted: 'Deleted',
            deletedsize: 'Deleted size',
            totalsize: 'Size',
            count: 'Count',
            cards: 'Cards',
            precessinstances: 'Processes instances',
            attachments: 'Attachments',
            relations: 'Relations',
            datastatistics: 'Data statistics',
            therearenlockeditems: 'There are {0} locked items.',
            unlockall: 'Unlock all',
            itemsatdate: '{0} {1} at {2}',
            type: 'Type',
            simpleclass: 'Simple class',
            class: 'Class',
            map: 'Relation',
            other: 'Other',
            system: 'System',
            alltypes: 'All types'
        },
        forms: {
            addform: 'Add layout',
            forms: 'Layouts',
            form: 'Layout',
            newform: 'New layout',
            activityform: 'Activity layout',
            addrow: 'Add row',
            addcolumn: 'Add column',
            removecolumn: 'Remove column',
            removerow: 'Remove Row',
            columnssize: 'Column widths',
            autogenerate: 'Auto generate'
        },
        tasks: {
            sincurrentStepgular: 'Task',
            plural: 'Tasks',
            emptytexts: {
                searchingrid: 'Search in grid...',
                searchcustompages: 'Search tasks...'
            },
            fieldlabels: {
                active: 'Active', // mapped
                actions: 'Actions', // mapped
                code: 'Code',
                startonsave: 'Start on save',
                account: 'Account',
                incomingfolder: 'Incoming folder',
                processedfolder: 'Processed folder',
                rejectedfolder: 'Rejected folder',
                filter: 'Filter',
                filtertype: 'Filter type',
                sender: 'Sender',
                subject: 'Subject'
            },
            strings: {
                advanced: 'Advanced'
            },
            texts: {
                addtask: 'Add task',
                reademails: 'Read emails',
                sendemails: 'Send emails',
                syncronousevents: 'Sync events',
                asyncronousevents: 'Async events',
                startprocesses: 'Start processes',
                connector: 'Connector'
            },
            tooltips: {
                delete: 'Delete task',
                disable: 'Disable task',
                enable: 'Enable task',
                edit: 'Edit task',
                singleexecution: 'Single execution',
                cyclicexecution: 'Cyclic execution',
                stop: 'Stop',
                start: 'Start',
                started: 'Started',
                stopped: 'Stopped',
                execution: 'Execution'
            },
            regex: 'Regex',
            type: 'Type',
            template: 'Template',
            source: 'Source',
            directory: 'Directory',
            filename: 'File name',
            filepattern: 'File pattern',
            url: 'URL',
            cron: 'Cron',
            minutes: 'Minutes',
            hour: 'Hour',
            day: 'Day',
            month: 'Month',
            dayofweek: 'Day of week',
            erroremailtemplate: 'Error email template',
            notificationmode: 'Notification mode',
            account: 'Account',
            emailtemplate: 'Email template',
            postimportaction: 'Post import action',
            filtertype: 'Filter type',
            sender: 'Sender',
            subject: 'Subject',
            movereject: 'Move rejected not matching',
            bodyparsing: 'Body parsing',
            sendnotiifcation: 'Send notification email',
            saveattachmentsdms: 'Save attachemnts to DMS',
            category: 'Category',
            startprocess: 'Start process',
            jobusername: 'Job username',
            advanceworkflow: 'Advance workflow',
            saveattachments: 'Save Attachments',
            processattributes: 'Process attributes',
            value: 'Value',
            incomingfolder: 'Incoming folder',
            processedfolder: 'Processed folder',
            rejectedfolder: 'Rejected folder',
            keystartdelimiter: 'Key start delimiter',
            keyenddelimiter: 'Key end delimiter',
            valuestartdelimiter: 'Value start delimiter',
            valueenddelimiter: 'Value end delimiter',
            settings: 'Settings',
            notifications: 'Notifications',
            parsing: 'Parsing',
            addtask: 'Add task',
            sourcedata: 'Source data',
            address: 'Address',
            password: 'Password',
            username: 'Username',
            driverclassname: 'Driver class name',
            sourcetype: 'Source type',
            templates: 'Templates',
            regexfilters: 'Regex filters',
            generalproperties: 'General properties',
            process: 'Process',
            jdbc: 'JDBC',
            oracle: 'Oracle',
            postgres: 'Postgres',
            mysqlmaria: 'MySQL / MariaDB',
            sqlserver: 'SQL Server',
            actionattachmentsmode: 'Action on attachments',
            auto: 'Automatic',
            attachtoemail: 'Attach to email',
            attachtocard: 'Attach to card',
            step: 'Step',
            of: 'of',
            taskexecuted: 'Task {0} executed.',
            everyhour: 'Every hour',
            everyday: 'Every day',
            everymonth: 'Every month',
            everyyear: 'Every year',
            advanced: 'Advanced',
            donothing: 'Do nothing',
            movefiles: 'Move files',
            disablefiles: 'Disable files',
            deletefiles: 'Delete files',
            isreply: 'Is reply',
            isnotreply: 'Is not reply',
            attachimportreport: 'Attach import report',
            notificationemailtemplate: 'Notification email template',
            definedinetltemplate: 'Defined in import template',
            onerrors: 'On errors',
            always: 'Always',
            attachfile: 'Attach file',
            never: 'Never',
            fileonserver: 'File on server',
            gisgatetemplate: 'GIS template',
            importgis: 'Import GIS',
            replyaggressivematching: 'Advanced reply recognition',
            sendemail: 'Send email',
            attachreport: 'Attach report',
            variable: 'Variable',
            parameter: 'Paramater',
            emailvariables: 'Email variables',
            reportparameters: 'Report parameters',
            asdefinedindatabasetemplate: 'As defined in database template',
            databasetemplate: 'Database template',
            ifctemplate: 'IFC template'

        },
        systemconfig: {
            url: 'Url',
            host: 'Host',
            cmis: 'CMIS',
            postgres: 'Postgres',
            webservicepath: 'Webservice path',
            alfresco: 'Alfresco',
            generals: 'Generals',
            instancename: 'Instance name',
            defaultpage: 'Default page',
            relationlimit: 'Relation Limit',
            referencecombolimit: 'Reference combobox limit',
            detailwindowwidth: 'Detail window width (%)',
            detailwindowheight: 'Detail window height (%)',
            popupwidth: 'Popup width (%)',
            popupheight: 'Popup height (%)',
            inlinecardheight: 'Inline card height (%)',
            keepfilteronupdatedcard: 'Keep Filter On Updated Card',
            sessiontimeout: 'Session timeout',
            ajaxtimeout: 'AJAX timeout',
            noteinline: 'Inline notes',
            noteinlinedefaultclosed: 'Inline notes default closed',
            preferredofficesuite: 'Preferred Office suite',
            showcardlockerusername: 'Shows the name of the user who blocked the card',
            maxlocktime: 'Maximum lock time (seconds)',
            gridautorefresh: 'Grid autorefresh',
            frequency: 'Frequency (seconds)',
            companylogo: 'Company logo',
            logo: 'Logo',
            initiallatitude: 'Initial latitude',
            initialongitude: 'Initial longitude',
            initialzoom: 'Initial zoom',
            configurationmode: 'Configuration mode',
            dropcache: 'Drop cache',
            synkservices: 'Synchronize services',
            unlockallcards: 'Unlock all cards',
            enableattachmenttoclosedactivities: 'Enable "Add attachment" to closed activities',
            usercandisable: 'User can disable',
            hidesavebutton: 'Hide "Save" button',
            dafaultjobusername: 'Default job username',
            serviceurl: 'Service URL',
            disablesynconmissingvariables: 'Disable synchronization missing variables',
            editmultitenantisnotallowed: 'Edit multitenant settings is not allowed',
            tecnotecariver: 'Tecnoteca River',
            shark: 'Enhydra Shark',
            lockmanagement: 'Lock management',
            multitenantinfomessage: 'It is recommended to change these settings only after having consulted the guidelines present in the Administrator Manual, downloadable from {0}',
            multitenantactivationmessage: 'Changing these settings is irreversible, unless the database is restored. It is recommended to backup the database before proceeding.',
            multitenantapllychangesquest: 'Do you want to apply the changes?',
            multitenantname: 'Multitenant field label',
            pwddifferentprevious: 'Different from previous password',
            pwddifferentusername: 'Different from username',
            pwdminimumlength: 'Minimum length',
            pwdrequirelowercase: 'Require at least one lowercase character',
            pwdrequireuppercase: 'Require at least one uppercase character',
            pwdrequiredigit: 'Require at least one digit',
            pwdmaxage: 'Maximum number of days between password change',
            pwdforewarding: 'Days before a user is notified about expiration',
            actions: 'System actions',
            services: 'Services',
            service: 'Service',
            status: 'Status',
            servicestart: 'Start service',
            servicestop: 'Stop service',
            statusready: 'Running',
            statusdisabled: 'Not running',
            statuserror: 'Error',
            numberpreviouspasswordcannotreused: 'Number of previous passwords that cannot be reused',
            viewlogs: 'View logs',
            enablenodetooltip: 'Enable node tooltip',
            edgecolor: 'Edge color',
            clusteringthreshold: 'Clustering threshold',
            baselevel: 'Base level',
            stepradius: 'Sprite dimension',
            pause: 'Pause',
            start: 'Start',
            turnautoscrollon: 'Turn auto scrolling on',
            turnautoscrolloff: 'Turn auto scrolling off',
            nologmessage: 'No log message to show',
            editlogconfig: 'Edit log configuration',
            logcategory: 'Log category',
            content: 'Content',
            value: 'Value',
            trace: 'Trace',
            debug: 'Debug',
            info: 'Info',
            warn: 'Warn',
            error: 'Error',
            default: 'Default',
            addcustomconfig: 'Add custom config',
            logs: 'Logs',
            downloadlogs: 'Download logs',
            downloadallfiles: 'All files',
            filename: 'File name',
            passwordmanagement: 'Password management',
            allowpasswordchange: 'Allow password change',
            attachmentsfilestypes: 'Attachments files types',
            allowonlythisfiletypesforcardandemail: 'Allowed file extensions for attachments uploaded from the user interface',
            allowonluthisfiletypesemptyvalue: 'Enter extensions separated by comma. Eg pdf,odt,doc. Leave this field empty to disable extensions check.',
            allowonlythisfiletypesofincomingmailattachments: 'Allowed file extensions for incoming emails',
            extensions: 'Extensions',
            mimetypes: 'Mime types',
            maxloginattempts: 'Max login attempts',
            maxloginattemptswindow: 'Max login attempts window (seconds)',
            preferredfilecharset: 'CSV encoding',
            defaultchangepasswordfirstlogin: 'Default for Change password at first login',
            bulkactions: 'Bulk actions',
            defaultforcardsbulkedit: 'Default for cards bulk edit',
            defaultforcardsbulkdeletion: 'Default for cards bulk deletion',
            defaultforworkflowbuldabort: 'Default for processes bulk abort',
            enabled: 'Enabled',
            disabled: 'Disabled',
            inactiveusers: 'Inactive users',
            disableinactiveusers: 'Disable inactive users',
            monthsofinactivity: 'Months of inactivity',
            comma: 'Comma',
            semicolon: 'Semicolon',
            pipe: 'Pipe',
            tab: 'Tab',
            firstdayofweek: 'First day of week'
        },
        importexport: {
            texts: {
                addtemplate: 'Add mapping',
                adddatatemplate: 'Add file template',
                import: 'Import',
                importfile: 'Import file',
                export: 'Export',
                exportfile: 'Export file',
                importexportfile: 'Import/Export file',
                importexportdatatemplate: 'Import / Export file template',
                importexportdatatemplates: 'Import / Export file templates',
                importexportgisgatetemplate: 'Import GIS',
                importexportgisgatetemplates: 'Import GIS templates',
                importexportifcgatetemplate: 'Import IFC',
                importexportifcgatetemplates: 'Import IFC templates',
                importexportdatabasegatetemplate: 'Import database',
                importexportdatabasegatetemplates: 'Import database templates',
                attributetoedit: 'Attribute to edit',
                importdatabase: 'Import database',
                importifc: 'Import IFC file',
                nodelete: 'No delete',
                delete: 'Delete',
                modifycard: 'Modify card',
                nomerge: 'No merge',
                templates: 'Templates',
                emptyattributegridmessage: 'Attributes grid can\'t be empty',
                columnname: 'Column name',
                mode: 'Mode',
                selectmode: 'Select mode',
                default: 'Default',
                selectanattribute: 'Select an attribute',
                importmode: 'Import mode',
                importcriteria: 'Import criteria',
                erroremailtemplate: 'Error email template',
                account: 'Account',
                csv: 'CSV',
                xlsx: 'XLSX',
                xls: 'XLS',
                ifc: 'IFC',
                database: 'Database',
                filterfortemplate: 'Filter for Template: {0}',
                filepath: 'IFC entity path',
                tablename: 'Table name',
                notifications: 'Notifications',
                notificationemailtemplate: 'Notification email template',
                add: 'Add',
                merge: 'Merge',
                dataformat: 'Data format',
                datetimeformat: 'Date time format',
                databaseconfiguration: 'Database configuration',
                defaultvalue: 'Default value'
            },
            fieldlabels: {
                useheader: 'Use header',
                ignorecolumn: 'Ignore order',
                applyon: 'Apply on',
                classdomain: 'Class/Domain',
                type: 'Type',
                fileformat: 'File Format',
                csvseparator: 'CSV separator',
                firstcolumnnumber: 'First column number',
                headerrownumber: 'Header row number',
                datarownumber: 'Data row number',
                importkeattributes: 'Import key attributes',
                missingrecords: 'Missing records',
                value: 'Value',
                exportfilter: 'Export filter',
                source: 'Source',
                alwayshandlemissingrecords: 'Always handle missing records'
            },
            emptyTexts: {
                searchfield: 'Search all file templates...',
                searchgatetemplatesfield: 'Search in mappings...'
            }
        },

        gates: {
            addgistemplate: 'Add GIS template',
            addifctemplate: 'Add IFC template',
            adddatabasetemplate: 'Add database template',
            searchgisfield: 'Search all GIS templates...',
            searchifcfield: 'Search all IFC templates...',
            searchdatabasefield: 'Search all database templates...',
            enableshapeimport: 'Enable shape import',
            targetlayer: 'Target geo attribute',
            importkeysource: 'Import key source',
            importkeyattribute: 'Import key attribute',
            templates: 'Mappings',
            importon: 'Import on',
            all: 'All',
            include: 'Include',
            exclude: 'Exclude',
            singlehandler: 'Single handler',
            ofcadtype: 'Of cad type',
            shaperproperties: 'Shape properties',
            importcadlayers: 'Import CAD layers',
            sourcelayertoinclude: 'Source layers to include',
            sourcelayertoincludeempty: 'Source cad layers to import as shape file. Enter the names of the layers separated by comma. (Ex. Layer1,Layer2,Layer3)',
            sourcelayertoexclude: 'Source layers to exclude',
            sourcelayertoexcludeempty: 'Source cad layers to exclude from import. Enter the names of the layers separated by comma. (Ex. Layer1,Layer2,Layer3)',
            dwgproperty: 'DWG property',
            ifcproperty: 'IFC property',
            sourcelayer: 'Source layer',
            relativelocation: 'Relative location',
            geoserverdisabledmessage: 'To configure shape properties it is necessary to enable geoserver.',
            hasparent: 'Has parent',
            associationmode: 'Association mode',
            associationproperties: 'Association properties',
            modestatic: 'Static',
            sourcepaths: 'Source paths',
            attributes: 'Attributes'
        },


        tesks: {
            labels: {
                activeonsave: 'Active on save',
                emailaccount: 'Email account',
                incomingfolder: 'Incoming folder',
                filtertype: 'Filter type'
            }
        },
        views: {
            addview: 'Add view',
            ralations: 'Relations',
            addfilter: 'Add filter',
            ragetclass: 'Target class',
            targetclass: 'Target class',
            filterforview: 'Filter for view: {0}',
            viewfrom: 'View from {0} {1}'
        },
        geoattributes: {
            fieldLabels: {
                referenceclass: 'Reference class', // mapped
                type: 'Type', // mapped
                subtype: 'Sub type',
                minzoom: 'Minimum zoom', // mapped
                maxzoom: 'Maximum zoom', // mapped
                defzoom: 'Default zoom',
                visibility: 'Visibility', // mapped
                fillopacity: 'Fill opacity', // need map
                fillcolor: 'Fill color', // need map
                icon: 'Icon', // need map
                pointradius: 'Point radius', // need map
                strokedashstyle: 'Strike dashstyle', // need map
                strokeopacity: 'Stroke opacity', // need map
                strokecolor: 'Stroke color', // need map
                strokewidth: 'Stroke width', // need map
                geometry: 'Geometry',
                shape: 'Shape',
                geotiff: 'GeoTIFF'
            },
            strings: {
                specificproperty: 'Specific properties'
            }
        },
        localizations: {
            localization: 'Localization',
            configuration: 'Configuration',
            class: 'Class',
            attributeclass: 'Attribute class',
            attributegroup: 'Attribute group',
            custompage: 'Custom page',
            process: 'Process',
            attributeprocess: 'Attribute process',
            domain: 'Domain',
            attributedomain: 'Attribute domain',
            view: 'View',
            lookup: 'Lookup',
            report: 'Report',
            dashboard: 'Dashboard',
            attributereport: 'Attribute report',
            menuitem: 'Menu item',
            languageconfiguration: 'Language Configuration',
            defaultlanguage: 'Default language',
            showlanguagechoice: 'Show language choice',
            enabledlanguages: 'Enabled languages',
            loginlanguages: 'Selectable languages',
            section: 'Section',
            languages: 'Languages',
            format: 'Format',
            separator: 'Separator',
            activeonly: 'Active only',
            export: 'Export',
            cancel: 'Cancel',
            all: 'All',
            file: 'File',
            import: 'Import',
            csv: 'CSV',
            csvfile: 'CSV file',
            pdf: 'PDF',
            treemenu: 'Tree menu',
            defaulttranslation: 'Default Translation',
            element: 'Element',
            type: 'Type',
            activity: 'Activity',
            widget: 'Widget',
            chartdescription: 'Chart description',
            chartvalueaxislabel: 'Value Axis Label',
            chartdescriptionaxislabel: 'Category Axis Label',
            chartparametername: 'Chart parameter name',
            attributedescription: 'Attribute description',
            attributegroupdescription: 'Attribute group description'
        },
        emails: {
            date: 'Date',
            start: 'Start',
            send: 'Send',
            sent: 'Sent',
            queue: 'Queue',
            key: 'Key', // mapped
            value: 'Value', // mapped
            remove: 'Remove', // mapped
            addrow: 'Add row', // mapped
            notnullkey: 'One or more values have a null key',
            name: 'Name', // mapped
            description: 'Description', // mapped
            subject: 'Subject', // mapped
            addtemplate: 'Add template', // mapped
            clonetemplate: 'Clone', // mapped
            email: "Email",
            templates: "Templates", // mapped
            keepsync: 'Keep sync', // mapped
            promptsync: "Prompt sync", // mapped
            delay: "Delay", // mapped
            template: 'Template', // mapped
            defaultaccount: 'Default account', // mapped
            from: 'From', // mapped
            to: 'To', // mapped
            cc: 'Cc', // mapped
            bcc: 'Bcc', // mapped
            body: 'Body', // mapped
            editvalues: 'Edit values', // mapped
            newtemplate: 'New template',
            templatesavedcorrectly: 'Template saved correctly',
            newaccount: 'New account',
            accountsavedcorrectly: 'Account saved correctly',
            delays: { // allmapped
                day1: "In 1 day",
                days2: "In 2 days",
                days4: "In 4 days",
                hour1: "1 hour",
                hours2: "2 hours",
                hours4: "4 hours",
                month1: "In 1 month",
                none: "None",
                week1: "In 1 week",
                weeks2: "In 2 weeks"
            },
            removetemplate: 'Remove', // mapped !!!
            removeaccount: 'Remove account', // mapped
            username: 'Username', // mapped
            password: 'Password', // mapped
            outgoing: 'Outgoing', // mapped
            address: 'Address', // mapped
            smtpserver: 'SMTP server', // mapped
            smtpport: 'SMTP port', // mapped
            enablessl: 'Enable SSL', // mapped
            enablestarttls: 'Enable STARTTLS', // mapped
            sentfolder: 'Sent folder', // mapped
            incoming: 'Incoming', // mapped
            imapserver: 'IMAP server', // mapped
            imapport: 'IMAP port', // mapped
            setdefaultaccount: 'Set default account',
            accounts: 'Accounts',
            contenttype: 'Content type',
            addaccount: 'Add account',
            cannotchoosebothssltlsmessage: 'Cannot choose both SSL and STARTTLS protocols',
            testconfiguration: 'Test configuration',
            configurationsuccesful: 'Configuration successful'
        },
        gis: {
            manageicons: 'Manage icons',
            addicon: 'Add icon',
            addlayer: 'Add layer',
            newlayer: 'New layer',
            icon: 'Icon',
            description: 'Description',
            newicon: 'New icon',
            editicon: 'Edit icon',
            deleteicon: 'Delete icon',
            deleteicon_confirmation: 'Are you sure you want to delete this icon?',
            mapservice: 'Map Service',
            servicetype: "Service type",
            defaultzoom: 'Default zoom',
            minimumzoom: 'Minimum zoom',
            maximumzoom: 'Maximum zoom',
            geoserver: 'Geoserver',
            url: 'URL',
            workspace: 'Workspace',
            adminuser: 'Admin user',
            adminpassword: 'Admin password',
            externalservices: 'External services',
            layersorder: 'Layers order',
            geoserverlayers: 'Geoserver layers',
            file: 'File',
            associatedclass: 'Associated class',
            associatedgeoattribute: 'Associated geo attribute',
            geoattribute: 'Geo attribute',
            associatedcard: 'Associated card',
            card: 'Card',
            type: 'Type',
            searchemptytext: 'Search thematisms',
            thematism: 'Thematism',
            thematisms: 'Thematisms',
            owneruser: 'User',
            ownerclass: 'Class',
            global: 'Global',
            gisnavigationenabled: 'Gis navigation enabled',
            openstreetmap: 'OpenStreetMap',
            googlemaps: 'Google Maps',
            yahoomaps: 'Yahoo Maps'
        },
        bim: {
            ifcfile: 'IFC File',
            lastcheckin: 'Last check-in',
            parentproject: 'Parent project',
            projects: 'Projects', // mapped,
            multilevel: 'Multilevel',
            addproject: 'Add project', // mapped
            newproject: 'New project',
            projectlabel: 'Project',
            bimnavigation: 'Bim navigation'
        },
        attributes: {
            attribute: 'Attribute', // mapped
            attributes: 'Attributes', // mapped
            emptytexts: {
                search: 'Search...' // no map
            },
            fieldlabels: {
                actionpostvalidation: 'Action post validation', // no map
                autovalue: 'Auto value',
                attributegroupings: 'Attribute groupings',
                description: 'Description', // mapped
                domain: 'Domain', // mapped
                editortype: 'Editor type', // mapped
                filter: 'Filter', // mapped
                format: 'Format',
                group: 'Group', // mapped
                help: 'Help', // no map
                includeinherited: 'Include Inherited', // mapped
                iptype: 'IP type', // mapped
                lookup: 'Lookup', // mapped
                mandatory: 'Mandatory', // mapped
                maxlength: 'Max Length', // mapped
                mode: 'Mode', // mapped
                name: 'Name', // mapped
                precision: 'Precision', // mapped
                preselectifunique: 'Preselect if unique', // mapped
                scale: 'Scale', // mapped
                thousandsseparator: 'Thousands separator',
                decimalseparator: 'Decimal separator',
                separators: 'Separators',
                separator: 'Separator',
                showseparator: 'Show separator',
                unitofmeasure: 'Unit of measure',
                positioningofum: 'Positioning of the UM',
                visibledecimals: 'Visible decimals',
                showif: 'View rules', // no map
                showingrid: 'Show in grid', // no map
                showinreducedgrid: 'Show in reduced grid', // no map
                type: 'Type', // mapped
                unique: 'Unique', // mapped
                validationrules: 'Validation rules', // no map
                showseconds: 'Show seconds',
                contentsecurity: 'Content Security',
                defaultfalse: 'Default false'
            },
            strings: {
                any: 'Any', // mapped
                draganddrop: 'Drag and drop to reorganize', // no map
                editable: 'Editable', // mapped
                editorhtml: 'Editor HTML', // mapped
                hidden: 'Hidden', // mapped
                immutable: 'Immutable', // no map
                ipv4: 'IPV4', // mapped
                ipv6: 'IPV6', // mapped
                plaintext: 'Plain text', // mapped
                precisionmustbebiggerthanscale: 'Precision must be bigger than Scale', // no map
                positioningofumrequired: 'The position of the unit of measurement is mandatory', // no map
                readonly: 'Read only', // mapped
                scalemustbesmallerthanprecision: 'Scale must be smaller than Precision', // no map
                thefieldmandatorycantbechecked: 'The field "Mandatory" can\'t be checked', // no map
                thefieldmodeishidden: 'The field "Mode" is hidden', // no map
                thefieldshowingridcantbechecked: 'The field "Show in grid" can\'t be checked', // no map
                thefieldshowinreducedgridcantbechecked: 'The field "Show in reduced grid" can\'t be checked', // no map
                createnewgroup: 'Create new group',
                addnewgroup: 'Add new group',
                htmlsafe: 'HTML safe',
                htmlall: 'HTML all',
                removegridorders: 'In order to reorder the attributes, the current sorting must be removed. Do you want to proceed?'
            },

            texts: {
                active: 'Active', // mapped
                addattribute: 'Add attribute',
                newattribute: 'New attribute',
                cancel: 'Cancel', // mapped
                description: 'Description', // mapped
                editingmode: 'Mode',
                editmetadata: 'Edit metadata', // mapped
                grouping: 'Grouping', // no map
                attributegroupingopen: 'Open',
                attributegroupingclosed: 'Closed',
                displaymode: 'Display mode',
                mandatory: 'Mandatory', // mapped
                name: 'Name', // mapped
                save: 'Save', // mapped
                saveandadd: 'Save and Add',
                showingrid: 'Show in grid',
                type: 'Type', // mapped
                unique: 'Unique', // mapped
                viewmetadata: 'View metadata', // no map
                direct: 'Direct',
                inverse: 'Inverse'
            },
            titles: {
                // generalproperties: 'General properties', // no map
                typeproperties: 'Type properties', // mapped
                otherproperties: 'Other properties' // mapped
            },
            tooltips: {
                deleteattribute: 'Delete', // mapped
                disableattribute: 'Disable', // mapped
                editattribute: 'Edit', // mapped
                enableattribute: 'Enable', // mapped
                openattribute: 'Open', //mapped
                translate: 'Translate' // no map
            }
        },
        classes: {
            fieldlabels: {
                superclass: 'Superclass',
                multitenantmode: 'Multitenant mode',
                categorytype: 'Category type',
                descriptionmode: 'Description mode',
                applicability: 'Applicability',
                widgetname: 'Widget Name',
                guicustom: 'Gui custom',
                guicustomparameter: 'GUI custom parameters',
                defaultimporttemplate: 'Default template for data import',
                defaultexporttemplate: 'Default template for data export',
                attachmentsinline: 'Inline attachments',
                attachmentsinlineclosed: 'Closed inline attachments'
            },
            texts: {
                class: 'class',
                component: 'Component',
                custom: 'Custom',
                separator: 'Separator',
                calendar: 'Calendar',
                createmodifycard: 'Create / Modify Card',
                createreport: 'Create Report',
                ping: 'Ping',
                startworkflow: 'Start workflow',
                standard: 'Standard',
                simple: 'Simple',
                direction: 'Direction'

            },
            strings: {
                geaoattributes: 'Geo attributes', // no map
                levels: 'Layers', // fix key name
                deleteclass: 'Delete class',
                deleteclassquest: "Are you sure you want to delete this class?",
                classactivated: 'Class activated correctly.',
                classdisabled: 'Class disabled correctly.',
                createnewcontextaction: 'Create new context action',
                edittrigger: 'Edit trigger',
                editcontextmenu: 'Edit context menu',
                editformwidget: 'Edit form widget',
                datacardsorting: 'Data cards sorting',
                executeon: 'Execute on'

            },
            properties: {
                form: {
                    fieldsets: {
                        ClassAttachments: 'Class Attachments', // no map
                        classParameters: 'Class Parameters', // no map
                        contextMenus: {
                            actions: {
                                delete: {
                                    tooltip: 'Delete' // mapped
                                },
                                edit: {
                                    tooltip: 'Edit' // mapped
                                },
                                moveDown: {
                                    tooltip: 'Move Down' // no map
                                },
                                moveUp: {
                                    tooltip: 'Move Up' // no map
                                }
                            },
                            inputs: {
                                applicability: {
                                    label: 'Applicability', // no map
                                    values: {
                                        all: {
                                            label: 'All' // mapping
                                        },
                                        many: {
                                            label: 'Current and selected' // no map
                                        },
                                        one: {
                                            label: 'Current' // mapping
                                        }
                                    }
                                },
                                javascriptScript: {
                                    label: 'Javascript script / custom GUI Paramenters' // no map
                                },
                                menuItemName: {
                                    label: 'Menu item name', // no map
                                    values: {
                                        separator: {
                                            label: '[---------]' // no map
                                        }
                                    }
                                },
                                status: {
                                    label: 'Status', // mapped
                                    values: {
                                        active: {
                                            label: 'Active' // mapped
                                        }
                                    }
                                },
                                typeOrGuiCustom: {
                                    label: 'Type / GUI custom', // no map
                                    values: {
                                        component: {
                                            label: 'Custom GUI' // no map
                                        },
                                        custom: {
                                            label: 'Script Javascript' // no map
                                        },
                                        separator: {
                                            label: '[---------]'
                                        }
                                    }
                                }
                            },
                            cantbeempty: 'Can not be empty',
                            mustbeunique: 'Menu item name must be unique',
                            title: 'Context Menus' // no map
                        },
                        defaultOrders: 'Default Orders', // no map
                        formTriggers: {
                            actions: {
                                addNewTrigger: {
                                    tooltip: 'Add new Trigger' // no map
                                },
                                deleteTrigger: {
                                    tooltip: 'Delete' // no map
                                },
                                editTrigger: {
                                    tooltip: 'Edit' // mapped
                                },
                                moveDown: {
                                    tooltip: 'Move Down' // no map
                                },
                                moveUp: {
                                    tooltip: 'Move Up' // no map
                                }
                            },
                            inputs: {
                                createNewTrigger: {
                                    label: 'Create new form trigger' // no map
                                },
                                events: {
                                    label: 'Events', // no map
                                    values: {
                                        afterClone: {
                                            label: 'After clone' // no map
                                        },
                                        afterDelete: {
                                            label: 'After delete' // no map
                                        },
                                        afterAbort: {
                                            label: 'After abort' // no map
                                        },
                                        afterEdit: {
                                            label: 'After edit' // no map
                                        },
                                        afterEditSave: {
                                            label: 'After edit and save' // no map
                                        },
                                        afterEditExecute: {
                                            label: 'After edit and execute' // no map
                                        },
                                        afterInsert: {
                                            label: 'After insert' // no map
                                        },
                                        afterInsertSave: {
                                            label: 'After insert and save' // no map
                                        },
                                        afterInsertExecute: {
                                            label: 'After insert and execute' // no map
                                        },
                                        beforeClone: {
                                            label: 'Before clone' // no map
                                        },
                                        beforeEdit: {
                                            label: 'Before edit' // no map
                                        },
                                        beforeInsert: {
                                            label: 'Before insert' // no map
                                        },
                                        beforView: {
                                            label: 'Before view' // no map
                                        }
                                    }
                                },
                                javascriptScript: {
                                    label: 'Javascript script' // no map
                                },
                                status: {
                                    label: 'Status' // mapped
                                }
                            },
                            title: 'Form Triggers' // no map
                        },
                        formWidgets: 'Form Widgets', // no map
                        createnewwidget: 'Create new widget',
                        generalData: {
                            inputs: {
                                active: {
                                    label: 'Active' // mapped
                                },
                                classType: {
                                    label: 'Type' // mapped
                                },
                                description: {
                                    label: 'Description' // mapped
                                },
                                name: {
                                    label: 'Name' // mapped
                                },
                                parent: {
                                    label: 'Inherits from' // mapped // duplicate
                                },
                                superclass: {
                                    label: 'Supeclass' // mapped
                                }
                            }
                        },
                        icon: 'Icon', // mapped
                        validation: {
                            inputs: {
                                validationRule: {
                                    label: 'Validation Rule' // no map
                                }
                            },
                            title: 'Validation' // no map
                        }
                    },
                    inputs: {
                        events: 'Events', // no map
                        javascriptScript: 'Javascript Script', // no map
                        status: 'Status' // mapped
                    },
                    tooltips: {},
                    values: {
                        active: 'Active' // mapped
                    }
                },
                title: 'Properties', // mapped
                toolbar: {
                    cancelBtn: 'Cancel', // mapped
                    closeBtn: 'Close', // mapped
                    deleteBtn: {
                        tooltip: 'Delete' // mapped
                    },
                    disableBtn: {
                        tooltip: 'Disable' // mapped
                    },
                    editBtn: {
                        tooltip: 'Modify class' // mapped
                    },
                    enableBtn: {
                        tooltip: 'Enable' // mapped
                    },
                    printBtn: {
                        printAsOdt: 'OpenOffice Odt', // mapped
                        printAsPdf: 'Adobe Pdf', // mapped
                        tooltip: 'Print class' // mapped
                    },
                    saveBtn: 'Save' // mapped
                }
            },
            title: 'Classes', // mapped
            toolbar: {
                addClassBtn: {
                    text: 'Add class' // mapped
                },
                classLabel: 'Class', // mapped
                printSchemaBtn: {
                    text: 'Print schema' // mapped
                },
                searchTextInput: {
                    emptyText: 'Search all classes' // no map
                }
            }
        },
        dmsmodels: {
            dmsmodel: 'DMS model',
            adddmsmodel: 'Add DMS model',
            searchalldmsmodels: 'Search all DMS models',
            modelparameters: 'DMS model parameters',
            modelattachments: 'Attachments properties',
            allowedextensions: 'Allowed extensions',
            allowedfiletypesemptyvalue: 'Enter extensions separated by comma. Eg pdf,odt,doc. Leave this field empty to use system config setting as default.',
            countcheck: 'Count check',
            number: 'Number',
            nocheckemptytext: 'As configured in DMS model value as default',
            nocheck: 'No check',
            atleastnumber: 'At least number',
            exactlynumber: 'Exactly number',
            maxnumber: 'Max number'
        },
        dmscategories: {
            assignedon: 'Assigned on',
            dmscategory: 'DMS category',
            adddmscategory: 'Add DMS category',
            defaultcategory: 'Default category',
            searchalldmscategories: 'Search all DMS categories...',
            allowfiletypesemptyvalue: 'Enter extensions separated by comma. Eg pdf,odt,doc. Leave this field empty to use the DMS model setting as default.'
        },
        common: {
            actions: {
                add: 'Add', // mapped
                activate: 'Activate',
                cancel: 'Cancel', // mapped
                clone: 'Clone', // mapped
                close: 'Close', // mapped
                create: 'Create', // mapped
                delete: 'Delete', // mapped
                disable: 'Disable', // mapped
                edit: 'Edit', // mapped
                enable: 'Enable', // mapped
                no: 'No', // mapped
                print: 'Print', // mapped
                save: 'Save', // mapped
                prev: 'Prev',
                next: 'Next',
                saveandadd: 'Save and add',
                update: 'Update', // mapped
                yes: 'Yes', // mapped
                ok: 'Ok',
                open: 'Open',
                relationchart: 'Relation chart',
                moveup: 'Move up',
                movedown: 'Move down',
                remove: 'Remove',
                clonefrom: 'Clone from...',
                download: 'Download',
                viewallitemproperties: 'View all item properties'
            },
            messages: {
                applicationupdate: 'Application Update',
                applicationreloadquest: 'This application has an update, reload?',
                areyousuredeleteitem: 'Are you sure you want to delete this item?', // no map
                ascendingordescending: 'This value is not valid, please select "Ascending" or "Descending"', // no map
                attention: 'Attention', // mapped
                cannotsortitems: 'You can not reorder the items if some filters are present or the inherited attributes are hidden. Please remove them and try again.', // no map
                cantcontainchar: 'The class name can\'t contain {0} character.', // no map
                correctformerrors: 'Please correct indicated errors', // no map
                disabled: 'Disabled', // no map
                enabled: 'Enabled', // no map
                error: 'Error', // mapped
                greaterthen: 'The class name can\'t be greater than {0} characters', // no map
                itemwascreated: 'Item was created.', // no map
                loading: 'Loading...', // mapped
                saving: 'Saving...', // no map
                success: 'Success', // mapped
                warning: 'Warning', // mapped
                was: 'was', // no map
                wasdeleted: 'was deleted', // no map
                thisfieldisrequired: 'This field is required',
                youarenotabletochangeactive: 'You are not allowed to Active or Deactive this object',
                youarenotabletodelete: 'You are not allowed to delete this object',
                youarenotabletoedit: 'You are not allowed to edit this object',
                youarenotabletoadd: 'You are not allowed to add this type of object',
                cacheempities: 'The server cache memory has been emptied',
                servicessincronized: 'The services are now synchronized',
                allcardsunlocked: 'All the cards have been unlocked',
                connectedtoclass: 'Connected to a class',
                connectedtofunction: 'Connected to a function'
            },
            tooltips: {
                edit: 'Edit', // mapped
                open: 'Open', // mapped
                clone: 'Clone', // mapped
                localize: 'Localize',
                edittrigger: 'Edit trigger',
                add: 'Add'
            },
            strings: {
                attribute: 'Attribute',
                properties: 'Properties',
                generalproperties: 'General properties',
                ascending: 'Ascending',
                descending: 'Descending',
                default: '*Default*',
                never: 'Never',
                always: 'Always',
                mixed: 'Mixed',
                hidden: 'Hidden',
                readonly: 'Read only',
                visibleoptional: 'Visible optional',
                visiblemandatory: 'Visible mandatory',
                localization: 'Localization text',
                selectpngfile: 'Select an .png file',
                currenticon: 'Current icon',
                selectimage: 'Select image',
                iconimage: 'Image icon',
                none: 'None',
                image: 'Image',
                string: 'String',
                filtercql: 'Filter CQL',
                recursive: 'Recursive',
                definedinemailtemplate: 'Defined in email template'
            },
            labels: {
                active: 'Active',
                name: 'Name',
                description: 'Description',
                defaultfilter: 'Default filter',
                noteinline: 'Inline notes',
                noteinlineclosed: 'Closed inline notes',
                code: 'Code',
                icon: 'Icon',
                iconpreview: 'Icon preview',
                iconcolor: 'Icon color',
                note: 'Notes',
                colorpreview: 'Color preview',
                icontype: 'Icon type',
                type: 'Type',
                funktion: 'Function',
                tenant: 'Tenant',
                status: 'Status',
                tree: 'Tree',
                textcolor: 'Text color',
                default: 'Default',
                device: 'Device',
                mobile: 'Mobile',
                desktop: 'Desktop',
                helptext: 'Help text',
                show: 'Show'
            },
            fieldlabels: {

            }
        },
        domains: {
            pluralTitle: 'Domains', // TODO: change with domains
            fieldlabels: {
                cardinality: 'Cardinality',
                masterdetail: 'Master detail',
                destination: 'Destination', // mapped
                enabled: 'Enabled', // mapped
                origin: 'Origin', // mapped
                directdescription: 'Direct description', // mapped
                inversedescription: 'Inverse description', // mapped
                masterdetailshort: 'M/D',
                labelmasterdetail: 'Label M/D',
                labelmasterdataillong: 'Label master detail',
                origininline: 'Inline relation on origin',
                closedorigininline: 'Closed inline relation on origin',
                destinationinline: 'Inline relation on destination',
                closeddestinationinline: 'Closed inline relation on destination',
                link: 'Link',
                viewconditioncql: 'View Condition (CQL)'
            },

            domain: 'Domain', // mapped
            strings: {
                classshoulbeoriginordestination: 'The class \'{0}\' or a parent class of \'{0}\' must be set as `Origin` or `Destination`',
                referencealreadydefined: 'Domain \'{0}\' is already defined in attribute \'{1}\''
            },
            texts: {
                properties: 'Properties', // mapped
                enabledclasses: 'Enabled classes', // no map // changed
                emptyText: 'Search all domains',
                addlink: 'Add link',
                adddomain: 'Add domain',
                newdomain: 'New Domain',
                showsummaryfor: 'Show summary for',
                restrict: 'Do not delete if has relations',
                _delete: 'Delete also related cards',
                setnull: 'Delete relation',
                onorigincarddelete: 'On origin card delete',
                destinationcarddelete: 'On destination card delete',
                askconfirm: 'Ask user confirm'
            },
            properties: { // remove

                toolbar: {
                    cancelBtn: 'Cancel', // mappped
                    deleteBtn: {
                        tooltip: 'Delete' // mapped
                    },
                    disableBtn: {
                        tooltip: 'Disable' // mapped
                    },
                    editBtn: {
                        tooltip: 'Edit' // mapped
                    },
                    enableBtn: {
                        tooltip: 'Enable' // mapped
                    },
                    saveBtn: 'Save' // mapped
                }
            },
            singularTitle: 'Domain', // mapped
            toolbar: {
                addBtn: {
                    text: 'Add domain' // mapped
                },
                searchTextInput: {
                    emptyText: 'Search all domains' // no map
                }
            }
        },
        groupandpermissions: {
            singular: 'Group and permission', // no map
            plural: 'Groups and permissions', // no map
            emptytexts: {
                searchingrid: 'Search in grid...', // no map
                searchusers: 'Search users...', // no map
                searchgroups: 'Search groups...'
            },
            fieldlabels: {
                active: 'Active', // mapped
                actions: 'Actions', // mapped
                attachments: 'Attachments', // mapped
                datasheet: 'Data sheet', // no map
                defaultpage: 'Default page', // no map
                description: 'Description', // mapped
                detail: 'Detail', // mapped
                email: 'Email',
                exportcsv: 'Export CSV file', // mapped
                filters: 'Filters', // no map
                history: 'History', // mapped
                importcsvfile: 'Import CSV file', // mapped
                massiveeditingcards: 'Massive editing of cards', // no map
                name: 'Name', // mapped
                note: 'Notes', // mapped
                relations: 'Relations', // mapped
                schedules: 'Schedules',
                type: 'Type', // mapped
                username: 'Username', // mapped
                onfiltermismatch: 'Allow reading to records that do not match the filter',
                cardbulkedit: 'Bulk edit',
                cardbulkdeletion: 'Bulk deletion',
                bulkabort: 'Bulk abort'
            },
            strings: {
                admin: 'Admin', // no map
                limitedadmin: 'Limited administrator', // mapped
                normal: 'Normal', // mapped
                readonlyadmin: 'Read-only admin',
                usersadmin: 'Users admin',
                displaytotalrecords: '{2} records',
                displaynousersmessage: "No users to display"
            },
            texts: {
                addgroup: 'Add group',
                allow: 'Allow',
                class: 'Class',
                copyfrom: 'Clone from', // new
                default: 'Default',
                basic: 'Basic',
                enable: 'Enable',
                disable: 'Disable',
                defaultfilter: 'Default filter', // no map
                defaultfilters: 'Default filters', // mapped
                defaultread: 'Def. + R', // mapped
                description: 'Description', // mapped
                filters: 'Filters', // no map
                group: 'Group', // mapped
                name: 'Name', // mapped
                none: 'None', // mapped
                permissions: 'Permissions', // mapped
                read: 'Read', // mapped
                userslist: 'Users list', // no map
                uiconfig: 'UI configuration', // mapped
                write: 'Write', // mapped
                editfilters: 'Edit filters of {0}: {1}',
                viewfilters: 'View filters of {0}: {1}',
                columnsprivileges: 'Columns privileges',
                rowsprivileges: 'Rows privileges',
                otherpermissions: 'Other permissions',
                contextmenuitem: 'Context menu item',
                widget: 'Widget',
                tabs: 'Tabs',
                tab: 'Tab',
                config: 'Configuration',
                configurations: 'Configurations'
            },
            titles: {
                allusers: 'All users', // no map
                generalattributes: 'General Attributes', // no map
                disabledactions: 'Disabled actions', // no map
                enabledactions: 'Enabled actions',
                enabledallitems: 'Enabled items in the "All items" navigation menu folder',
                managementprocesstabs: 'Visible tabs on process instances management', // no map
                managementclasstabs: 'Visible tabs on cards management',
                usersassigned: 'Users assigned' // no map
            },
            tooltips: {
                filters: 'Filters', // no map
                removefilters: 'Remove filters', // no map
                manageconfigurations: 'Manage configurations',
                clearconfigurations: 'Clear configurations'
            }
        },
        lookuptypes: {
            title: 'Lookup Types',
            toolbar: {
                addClassBtn: {
                    text: 'Add lookup'
                },
                classLabel: 'List',
                printSchemaBtn: {
                    text: 'Print lookup'
                },
                searchTextInput: {
                    emptyText: 'Search all lookups...'
                }
            },
            strings: {
                lookuplist: 'Lookup List',
                values: 'Values',
                parentdescription: 'Parent description',
                textcolor: 'Text color',
                colorpreview: 'Color preview',
                addvalue: 'Add value',
                font: 'Font'
            },
            type: {
                form: {
                    fieldsets: {
                        generalData: {
                            inputs: {
                                active: {
                                    label: 'Active' // mapped
                                },
                                name: {
                                    label: 'Name' // mapped
                                },
                                parent: {
                                    label: 'Parent' // mapped
                                }
                            }
                        }
                    },
                    tooltips: {},
                    values: {
                        active: 'Active' // mapped
                    }
                },
                title: 'Properties',
                toolbar: {
                    cancelBtn: 'Cancel', // mapped
                    closeBtn: 'Close', // mapped
                    deleteBtn: {
                        tooltip: 'Delete' // mapped
                    },
                    editBtn: {
                        tooltip: 'Edit' // mapped
                    },
                    saveBtn: 'Save' // mapped
                }
            }
        },
        menus: {
            singular: 'Menu', // no map
            plural: 'Menus',
            emptytexts: {

            },
            fieldlabels: {
                newfolder: 'New folder'
            },
            strings: {
                emptyfoldername: 'Folder name empty',
                areyousuredeleteitem: 'Are you sure you want to delete this menu?',
                delete: 'Delete Menu'
            },
            texts: {
                add: 'Add menu'
            },
            titles: {


            },
            tooltips: {
                remove: 'Remove',
                addfolder: 'Add folder'
            }
        },
        navigation: {
            bim: 'BIM', // mapped
            classes: 'Classes', // mapped
            custompages: 'Custom pages', // mapped
            customcomponents: 'Custom components',
            dashboards: 'Dashboards', // no map
            dms: 'DMS', // mapped
            domains: 'Domains', // mapped
            email: 'Email', // mapped
            generaloptions: 'General options', // mapped
            gis: 'GIS', // mapped
            gisnavigation: 'Gis Navigation', // mapped
            groupsandpermissions: 'Groups and permissions', // no map
            importexports: 'Imports/Exports',
            datatemplate: 'File template',
            gisgatetemplate: 'GIS template',
            ifcgatetemplate: 'IFC template',
            databasegatetemplate: 'Database template',
            layers: 'Layers',
            languages: 'Localizations', // mapped
            lookuptypes: 'Lookup types', // mapped
            dmsmodels: 'DMS models', // mapped
            dmscategories: 'DMS categories',
            menus: 'Menus', // no map
            multitenant: 'Multitenant', // no map
            navigationtrees: 'Navigation trees', // mapped
            passwordpolicy: 'Password policy',
            processes: 'Processes', // mapped
            relationgraph: 'Relation graph',
            reports: 'Reports', // no map
            schedules: 'Scheduler',
            searchfilters: 'Search filters', // mapped
            servermanagement: 'Server management',
            simples: 'Simples', // no map
            standard: 'Standard', // mapped
            systemconfig: 'System config', // no map
            taskmanager: 'Task manager', // no map
            title: 'Navigation', // mapped
            users: 'Users', // mapped
            views: 'Views', // mapped
            workflow: 'Workflow', // no map
            importgis: 'Import GIS',
            settings: 'Settings'
        },
        schedules: {
            schedule: 'Schedule',
            active: 'Active',
            category: 'Category',
            condition: 'Condition',
            endtype: 'End type',
            scheduletime: 'Schedule time',
            frequency: 'Frequency',
            frequencymultiplier: 'Frequency multiplier',
            scheduleruleeditmode: 'Schedule rule edit mode',
            showschedulepreview: 'Show schedule preview',
            maxactiveschedules: "Max active schedules",
            addschedule: 'Add schedule rule definition',
            newschedule: 'New schedule rule definition',
            numberofoccurrences: 'Number of occurrences',
            searchschedules: 'Search schedules rule definition',
            scheduleeditmode: 'Schedule edit mode',
            actionondelete: 'Action on card delete',
            schedulerule: 'Schedule rule',
            instant: 'Instant',
            date: 'Date',
            hidden: 'Hidden',
            priority: 'Priority',
            extendeddescription: 'Extended description',
            klass: 'Class',
            group: 'Group',
            attribute: 'Attribute',
            user: 'User',
            read: 'Read',
            task: 'Task',
            delayperiod: 'Delay period',
            delayvalue: 'Delay value',
            delayfirstdeadline: 'Delay first deadline',
            delayfirstdeadlinevalue: 'Delay first deadline value',
            timezone: 'Time zone',
            write: 'Write',
            clear: 'Clear',
            deleteschedules: 'Delete schedules',
            keepschedules: 'Keep schedules',
            years: 'Years',
            months: 'Months',
            days: 'Days',
            daysadvancenotification: 'Days advance notification',
            notificationtemplate: 'Template used for notification',
            notificationreport: 'Report attached to notification',
            ruledefinitions: 'Rule definitions',
            createalsoviawebservice: 'Create schedules also via web service',
            applyruletoexistingcards: 'Apply rule to existing cards',
            apply: 'Apply',
            applyonallcards: 'This rule will be applied on all cards. Do you want to proceed?',
            applyonmatchingcards: 'This rule will be applied on matching cards. Do you want to proceed?',
            statuses: 'Statuses',
            categories: 'Categories',
            priorities: 'Priorities'
        },
        dashboards: {
            dashborad: 'Dashboards',
            active: 'Active',
            adddashboard: 'Add dashboard',
            newdashboard: 'New dashboard',
            searchdashboards: 'Search dashboards',
            fromclass: 'From class',
            defaultvalue: 'Default value',
            filter: 'Filter',
            lookuptype: 'Lookup type',
            showlegend: 'Show legend',
            valuefield: 'Value field',
            labelfield: 'Label field',
            maximum: 'Maximum',
            minimum: 'Minimum',
            steps: 'Steps',
            foregroundcolor: 'Foreground color',
            backgroundcolor: 'Background color',
            categoryaxis: 'Category axis',
            title: 'Title',
            valueaxis: 'Value axis',
            chartorientation: 'Chart orientation',
            required: 'Required',
            fieldtype: 'Field type',
            new: 'New',
            unabletoremovenonemptycolumn: 'Unable to remove non-empty column',
            layout: 'Layout',
            rowlimit: 'Row limit',
            view: 'View',
            autoload: 'Autoload',
            height: 'Height (px)',
            charttypeproperties: 'Chart type properties',
            datasourceproperties: 'Data source properties',
            parameter: 'Parameter',
            freestring: 'Free string',
            selectfromallclasses: 'Select from all CMDBuild classes',
            currentuser: 'Current user',
            currentgroup: 'Current group',
            selectfromlookup: 'Select from a lookup',
            card: 'Card',
            integer: 'Integer',
            string: 'String',
            preselectifunique: 'Preselect if unique',
            labeldescription: 'Label description',
            chartnamecharttypeproperties: '{0} chart type properties',
            deletechartparametertranslations: 'You may need to delete some translations, do you want to proceed?'

        },
        searchfilters: {
            fieldlabels: {
                filters: 'Filters',
                targetclass: 'Target class'
            },
            texts: {
                addfilter: 'Add filter',
                defaultforgroup: 'Default for groups',
                fromfilter: 'From filter',
                fromsql: 'From SQL',
                fromjoin: 'From join',
                fromschedule: 'From schedule',
                writefulltextquery: 'Write your full text query',
                fulltextquery: 'Full text query',
                fulltext: 'Full text',
                chooseafunction: 'Choose a function',
                grantpermissions: 'Following groups do not have read permission on this filter:{0} Do you want to grant it?'
            }
        },
        processes: {
            texts: {
                process: 'process',
                processdeactivated: 'Process correctly deactivated.',
                processactivated: 'Process correctly activated.',
                activityattributenotfountinprocess: 'The attribute {0} is not fount in process attribute list. It will be ignored.'
            },
            strings: {
                createnewcontextaction: 'Create new context action',
                processattachments: 'Process Attachments',
                engine: 'Engine',
                xpdlfile: 'XPDL file',
                selectxpdlfile: 'Select an XPDL file',
                template: 'Template'
            },
            fieldlabels: {
                applicability: 'Applicability',
                enginetype: 'Engine type'
            },
            properties: {
                form: {
                    fieldsets: {
                        defaultOrders: 'Default Orders', // no map
                        generalData: {
                            inputs: {
                                active: {
                                    label: 'Active' // mapped
                                },
                                description: {
                                    label: 'Description' // mapped
                                },
                                enableSaveButton: {
                                    label: 'Hide "Save" button' // no map
                                },
                                name: {
                                    label: 'Name' // mapped
                                },
                                parent: {
                                    label: 'Inherits from' // mapped
                                },
                                stoppableByUser: {
                                    label: 'Stoppable by User' // mapped
                                },
                                superclass: {
                                    label: 'Superclass' // mapped
                                }
                            }
                        },
                        contextMenus: {
                            actions: {
                                delete: {
                                    tooltip: 'Delete' // mapped
                                },
                                edit: {
                                    tooltip: 'Edit' // mapped
                                },
                                moveDown: {
                                    tooltip: 'Move Down' // no map
                                },
                                moveUp: {
                                    tooltip: 'Move Up' // no map
                                }
                            },
                            inputs: {
                                applicability: {
                                    label: 'Applicability', // no map
                                    values: {
                                        all: {
                                            label: 'All' // mapping
                                        },
                                        many: {
                                            label: 'Current and selected' // no map
                                        },
                                        one: {
                                            label: 'Current' // mapping
                                        }
                                    }
                                },
                                javascriptScript: {
                                    label: 'Javascript script / custom GUI Paramenters' // no map
                                },
                                menuItemName: {
                                    label: 'Menu item name', // no map
                                    values: {
                                        separator: {
                                            label: '[---------]' // no map
                                        }
                                    }
                                },
                                status: {
                                    label: 'Status', // mapped
                                    values: {
                                        active: {
                                            label: 'Active' // mapped
                                        }
                                    }
                                },
                                typeOrGuiCustom: {
                                    label: 'Type / GUI custom', // no map
                                    values: {
                                        component: {
                                            label: 'Custom GUI' // no map
                                        },
                                        custom: {
                                            label: 'Script Javascript' // no map
                                        },
                                        separator: {
                                            label: '[---------]'
                                        }
                                    }
                                }
                            },
                            title: 'Context Menus' // no map
                        },
                        icon: 'Icon',
                        processParameter: {
                            inputs: {
                                defaultFilter: {
                                    label: 'Default filter' // no map
                                },
                                messageAttr: {
                                    label: 'Message attribute' // no map
                                },
                                flowStatusAttr: {
                                    label: 'State attribute' // no map
                                }
                            },
                            title: 'Process parameters' // no map
                        },
                        validation: {
                            inputs: {
                                validationRule: {
                                    label: 'Validation Rule' // no map
                                }
                            },
                            title: 'Validation' // no map
                        }
                    },
                    inputs: {
                        status: 'Status' // mapped
                    },
                    tooltips: {},
                    values: {
                        active: 'Active' // mapped
                    }
                },
                title: 'Properties',
                toolbar: {
                    cancelBtn: 'Cancel', // mapped
                    closeBtn: 'Close', // mapped
                    deleteBtn: {
                        tooltip: 'Delete' // mapped
                    },
                    disableBtn: {
                        tooltip: 'Disable' // mapped
                    },
                    editBtn: {
                        tooltip: 'Edit' // mapped
                    },
                    enableBtn: {
                        tooltip: 'Enable' // mapped
                    },
                    saveBtn: 'Save', // mapped
                    versionBtn: {
                        tooltip: 'Version' // mapped
                    }
                }
            },
            title: 'Processes',
            toolbar: {
                addProcessBtn: {
                    text: 'Add process' // mapped
                },
                printSchemaBtn: {
                    text: 'Print schema' // mapped
                },
                processLabel: 'Process', // mapped
                searchTextInput: {
                    emptyText: 'Search all processes' // no map
                }
            }
        },
        viewfilters: {
            texts: {
                filterforgroup: 'Filters for groups',
                addfilter: 'Add filter'
            },
            emptytexts: {
                searchingrid: 'Search ...'
            }

        },
        navigationtrees: {
            singular: 'Navigation tree',
            plural: 'Navigation trees',
            emptytexts: {
                searchingrid: 'Search in grid...',
                searchnavigationtree: 'Search navigation tree...'
            },
            fieldlabels: {
                active: 'Active', // mapped
                actions: 'Actions', // mapped
                name: 'Name',
                description: 'Description',
                source: 'Source',
                label: 'Label',
                viewmode: 'View mode',
                subclasses: 'Subclasses',
                showintermediatesubclassnode: 'Add superclass node',
                allsubclassess: 'Superclass',
                onlysomesubclassesinsuperclassnode: 'Subclasses',
                visiblesubclasses: 'Visible subclasses',
                filtersubclasses: 'Filter superclasses'
            },
            strings: {
                sourceclass: 'Source class'
            },
            texts: {
                addnavigationtree: 'Add tree'
            },

            tooltips: {
                delete: 'Delete navigation tree',
                disable: 'Disable navigation tree',
                enable: 'Enable navigation tree',
                edit: 'Edit navigation tree'
            }
        },
        reports: {
            singular: 'Report',
            plural: 'Report',
            emptytexts: {
                searchingrid: 'Search in grid...',
                searchreports: 'Search reports...'
            },
            fieldlabels: {
                active: 'Active', // mapped
                actions: 'Actions', // mapped
                name: 'Name',
                description: 'Description',
                zipfile: 'ZIP file'
            },
            strings: {

            },
            texts: {
                addreport: 'Add report',
                selectfile: 'Select ZIP file'
            },
            titles: {
                file: 'File',
                reportsql: 'Report SQL'
            },
            tooltips: {
                delete: 'Delete report',
                disable: 'Disable report',
                enable: 'Enable report',
                edit: 'Edit report',
                viewsql: 'View report SQL',
                downloadpackage: 'Download report package'
            }
        },
        custompages: {
            singular: 'Custom page',
            plural: 'Custom pages',
            emptytexts: {
                searchingrid: 'Search in grid...',
                searchcustompages: 'Search custom pages...'
            },
            fieldlabels: {
                active: 'Active', // mapped
                actions: 'Actions', // mapped
                name: 'Name',
                description: 'Description',
                zipfile: 'ZIP file',
                componentid: 'Component ID'
            },
            texts: {
                addcustompage: 'Add custom page',
                selectfile: 'Select ZIP file'
            },
            titles: {
                file: 'File'
            },
            tooltips: {
                delete: 'Delete custom page',
                disable: 'Disable custom page',
                enable: 'Enable custom page',
                edit: 'Edit custom page',
                downloadpackage: 'Download custom page package'
            }
        },
       
        customcomponents: {
            singular: 'Custom component',
            plural: 'Custom components',
            emptytexts: {
                searchingrid: 'Search in grid...',
                searchcustompages: 'Search custom components...'
            },
            fieldlabels: {
                active: 'Active', // mapped
                actions: 'Actions', // mapped
                name: 'Name',
                description: 'Description',
                zipfile: 'ZIP file',
                componentid: 'Component ID'
            },
            strings: {
                addcontextmenu: 'Add context menu',
                addwidget: 'Add form widget',
                searchcontextmenus: 'Search context menus...',
                searchwidgets: 'Search widgets...',
                contextmenu: 'Context menu',
                widget: 'Widget'
            },
            texts: {
                addcustomcomponent: 'Add custom component',
                selectfile: 'Select ZIP file'
            },
            titles: {
                file: 'File'
            },
            tooltips: {
                delete: 'Delete custom component',
                disable: 'Disable custom component',
                enable: 'Enable custom component',
                edit: 'Edit custom component',
                downloadpackage: 'Download custom component package'
            }
        },
        title: 'Administration', // no map
        users: {
            fieldLabels: {
                user: 'User',
                language: 'Language',
                initialpage: 'Initial page',
                service: 'Service',
                confirmpassword: 'Confirm Password',
                groups: 'Groups',
                defaultgroup: 'Default group',
                multigroup: 'Multigroup',
                defaulttenant: 'Default tenant',
                multitenant: 'Multitenant',
                tenants: 'Tenants',
                tenant: 'Tenant',
                nodata: 'No data',
                multitenantactivationprivileges: 'Allow multitenant',
                changepasswordfirstlogin: 'Change password at first login'
            },
            messages: {
                passwordnotset: 'The password is not set, this user will not be able to log in to the system.</br>Are you sure?'
            },
            properties: {
                form: {
                    fieldsets: {
                        generalData: {
                            inputs: {
                                active: {
                                    label: 'Active' // mapped
                                },
                                description: {
                                    label: 'Description' // mapped
                                },
                                name: {
                                    label: 'Name' // mapped
                                },
                                stoppableByUser: {
                                    label: 'User stoppable' // mapped
                                }
                            }
                        }
                    }
                }
            },
            title: 'Users', // mapped
            toolbar: {
                addUserBtn: {
                    text: 'Add user' // mapped
                },
                searchTextInput: {
                    emptyText: 'Search all users' // no map
                }
            }
        }
    }
});