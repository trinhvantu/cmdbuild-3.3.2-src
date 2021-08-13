Ext.define('CMDBuildUI.view.administration.content.setup.elements.DocumentManagementSystemModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.administration-content-setup-elements-documentmanagementsystem',

    data: {
        isAlfresco: false,
        isCmis: false,
        isPostgres: false
    },

    formulas: {
        updateDisplayPassword: {
            bind: {
                password: '{theSetup.org__DOT__cmdbuild__DOT__dms__DOT__service__DOT__cmis__DOT__password}'
            },
            get: function (data) {
                var hiddenPassword = CMDBuildUI.util.administration.helper.RendererHelper.getDisplayPassword(data.password);
                this.set('hiddenPassword', hiddenPassword);
            }
        },        
        dmsType: {
            bind: '{theSetup.org__DOT__cmdbuild__DOT__dms__DOT__service__DOT__type}',
            get: function (type) {
                switch (type) {
                    case 'alfresco':
                        this.set('isAlfresco', true);
                        this.set('isCmis', false);
                        this.set('isPostgres', false);
                        break;
                    case 'cmis':
                        this.set('isAlfresco', false);
                        this.set('isCmis', true);
                        this.set('isPostgres', false);
                        break;
                    case 'postgres': // sperimental
                        this.set('isAlfresco', false);
                        this.set('isCmis', false);
                        this.set('isPostgres', true);
                        break;
                }
            }
        }
    },
    stores: {        
        dmsCategoryTypesStore: {
            source: 'dms.DMSCategoryTypes',
            autoDestroy: true       
        }
        // // TODO: set rigth proxy
        // attachmentsFilesTypesStore: {
        //     model: 'CMDBuildUI.model.attachments.AttachmentFileType',
        //     proxy: {
        //         type: 'memory'
        //     },
        //     data: [{
        //         name: 'CSV',
        //         extensions: ['csv', 'txt'],
        //         mimeTypes: ['text/csv', 'text/plain']
        //     }, {
        //         name: 'Documents',
        //         extensions: ['doc', 'docx', 'odt'],
        //         mimeTypes: ['application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.oasis.opendocument.text']
        //     }]
        // }

    }
});