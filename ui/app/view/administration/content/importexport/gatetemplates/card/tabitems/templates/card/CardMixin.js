Ext.define('CMDBuildUI.view.administration.content.importexport.gatetemplates.card.tabitems.templates.card.CardMixin', {

    mixinId: 'administration-importexportgatemixin',

    onEditBtnClick: function () {
        var view = this.getView();
        var container = Ext.getCmp(CMDBuildUI.view.administration.DetailsWindow.elementId) || Ext.create(CMDBuildUI.view.administration.DetailsWindow);
        var vm = view.getViewModel();
        var viewModel = {
            data: {
                theGateTemplate: view.getViewModel().get('selected') || view.getViewModel().get('theGateTemplate'),
                grid: vm.get('grid') || this.getView().up().grid,
                action: CMDBuildUI.util.administration.helper.FormHelper.formActions.edit,
                actions: {
                    edit: true,
                    view: false,
                    add: false
                }
            }
        };

        container.removeAll();
        container.add({
            xtype: 'administration-content-importexport-gatetemplates-tabitems-templates-card-card',
            viewModel: viewModel
        });
    },

    onDeleteBtnClick: function (button) {
        var me = this;
        Ext.Msg.confirm(
            CMDBuildUI.locales.Locales.administration.common.messages.attention,
            CMDBuildUI.locales.Locales.administration.common.messages.areyousuredeleteitem,
            function (btnText) {
                if (btnText === "yes") {
                    var theGateTemplate = me.getViewModel().get('theGateTemplate');
                    var grid = CMDBuildUI.util.Navigation.getMainAdministrationContainer().down('administration-content-importexport-gatetemplates-tabitems-templates-grid');
                    grid.fireEventArgs('removetemplate', [theGateTemplate, grid]);
                    CMDBuildUI.util.Navigation.removeAdministrationDetailsWindow();
                }
            }, this);
    },


    onViewBtnClick: function () {        
        var view = this.getView();
        var container = Ext.getCmp(CMDBuildUI.view.administration.DetailsWindow.elementId) || Ext.create(CMDBuildUI.view.administration.DetailsWindow);
        var vm = view.getViewModel();
        var viewModel = {
            data: {
                theGate: view.getViewModel().get('theGate'),
                theGateTemplate: view.getViewModel().get('selected') || view.getViewModel().get('theGateTemplate'),
                grid: vm.get('grid') || this.getView().up().grid,
                action: CMDBuildUI.util.administration.helper.FormHelper.formActions.view,
                actions: {
                    edit: false,
                    view: true,
                    add: false
                }
            }
        };

        container.removeAll();
        container.add({
            xtype: 'administration-content-importexport-gatetemplates-tabitems-templates-card-card',
            viewModel: viewModel
        });
    },

    /**
     * @param {Ext.button.Button} button
     * @param {Event} e
     * @param {Object} eOpts
     */
    onActiveToggleBtnClick: function (button, e, eOpts) {
        var view = this.getView();
        var vm = view.getViewModel();
        var theGateTemplate = vm.get('theGateTemplate');
        theGateTemplate.set('active', !theGateTemplate.get('active'));
        theGateTemplate.save({
            success: function (record, operation) {
                view.up('administration-content-importexport-gatetemplates-tabitems-templates-grid').getPlugin('administration-forminrowwidget').view.fireEventArgs('itemupdated', [view.up('administration-content-importexport-gatetemplates-tabitems-templates-grid'), record, this]);
            }
        });

    },

    onCloneBtnClick: function () {        
        var view = this.getView();
        var vm = view.getViewModel();
        var container = Ext.getCmp(CMDBuildUI.view.administration.DetailsWindow.elementId) || Ext.create(CMDBuildUI.view.administration.DetailsWindow);
        var newImportExportTemplate = vm.get('theGateTemplate').copyForClone();
        var viewModel = {
            data: {
                theGateTemplate: newImportExportTemplate,
                grid: vm.get('grid') || this.getView().up().grid,
                action: CMDBuildUI.util.administration.helper.FormHelper.formActions.add,
                actions: {
                    edit: false,
                    view: false,
                    add: true
                }
            }
        };

        container.removeAll();
        container.add({
            xtype: 'administration-content-importexport-gatetemplates-tabitems-templates-card-card',
            viewModel: viewModel
        });
    },

    /**
     * 
     * @param {*} row 
     * @param {*} record 
     * @param {*} element 
     * @param {*} rowIndex 
     * @param {*} e 
     * @param {*} eOpts 
     */
    onRowDblclick: function (row, record, element, rowIndex, e, eOpts) {
        var view = this.getView(),
            container = Ext.getCmp(CMDBuildUI.view.administration.DetailsWindow.elementId) || Ext.create(CMDBuildUI.view.administration.DetailsWindow);

        var formInRow = view.ownerGrid.getPlugin('administration-forminrowwidget');
        formInRow.removeAllExpanded(record);
        view.setSelection(record);        
        var card = 'administration-content-importexport-gatetemplates-tabitems-templates-card-card';
        if(record.get('fileFormat') === 'ifc' || record.get('fileFormat') === 'database'){
            card = 'administration-content-importexport-datatemplates-card';
        }
        container.removeAll();
        container.add({
            xtype: card,
            viewModel: {
                data: {
                    theGateTemplate: record,
                    grid: view.ownerGrid,
                    action: CMDBuildUI.util.administration.helper.FormHelper.formActions.edit,
                    actions: {
                        view: false,
                        edit: true,
                        add: false
                    }
                }
            }
        });
    },
    privates: {

    }
});