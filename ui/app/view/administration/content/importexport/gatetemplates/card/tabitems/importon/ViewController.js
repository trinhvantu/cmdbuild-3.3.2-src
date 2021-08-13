Ext.define('CMDBuildUI.view.administration.content.importexport.gatetemplates.card.tabitems.importon.ViewController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.administration-content-importexport-gatetemplates-card-tabitems-importon-view',
    control: {
        '#editBtn': {
            click: 'onEditBtnClick'
        },
        '#saveBtn': {
            click: 'onSaveBtnClick'
        },
        '#cancelBtn': {
            click: 'onCancelBtnClick'
        }
    },
    onEditBtnClick: function () {
        var view = this.getView();
        var vm = view.getViewModel();
        vm.set('action', CMDBuildUI.util.administration.helper.FormHelper.formActions.edit);
        vm.getParent().set('enabledTab', 'importon');
    },

    onSaveBtnClick: function (button) {
        var vm = this.getViewModel();        
        var theGate = vm.get('theGate');
        if(!theGate.data.config){
            theGate.data.config = {};
        }
        theGate._config.set('showOnClasses',vm.get('theGate.importOn').join(','));        
        theGate.save();
        vm.set('action', CMDBuildUI.util.administration.helper.FormHelper.formActions.view);
        vm.getParent().set('enabledTab', null);
    },


    onCancelBtnClick: function (button) {
        var vm = this.getViewModel();
        vm.get("theGate").reject(); // discard changes
        vm.set('action', CMDBuildUI.util.administration.helper.FormHelper.formActions.view);
        vm.getParent().set('enabledTab', null);
    }


});