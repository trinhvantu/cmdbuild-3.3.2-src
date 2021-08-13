Ext.define('CMDBuildUI.view.administration.content.setup.elements.EditLogConfigController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.administration-content-setup-elements-editlogconfig',

    control: {        
        '#saveBtn': {
            click: 'onSaveBtnClick'
        },
        '#cancelBtn': {
            click: 'onCancelBtnClick'
        },
        '#addConfigRow': {
            click: 'onAddRowConfigBtnCLick'
        }
    },

    /**
     * 
     * @param {Ext.button.Button} button 
     * @param {Event} event 
     * @param {Object} eOpts 
     */
    onSaveBtnClick: function (button, event, eOpts) {
        button.setDisabled(true);
        var view = this.getView();
        var store = view.getStore();
        var modifiedRecords = store.getModifiedRecords();
        var requests = 0;
        var closePopupIfIsLastRequest = function () {
            requests--;
            if (!view.destroyed) {
                if (requests === 0) {
                    view.up().close();
                }
            }
        };
        var onError = function () {
            if (button && !button.destroyed) {
                button.setDisabled(false);
            }
        };

        Ext.Array.forEach(modifiedRecords, function (item) {
            var key = item.get('category');
            var data = item.get('level');
            if (key) {
                requests++;
                CMDBuildUI.util.Ajax.setActionId('system.loggers.edit.post');
                Ext.Ajax.request({
                    url: Ext.String.format("{0}/system/loggers/{1}", CMDBuildUI.util.Config.baseUrl, key),
                    method: "POST",
                    jsonData: data
                }).then(closePopupIfIsLastRequest, onError);
            }
        });
        if (!requests) {
            closePopupIfIsLastRequest();
        }
    },

    /**
     * 
     * @param {Ext.button.Button} button 
     * @param {Event} event 
     * @param {Object} eOpts 
     */
    onCancelBtnClick: function (button, event, eOpts) {
        var view = this.getView();
        var store = view.getStore();
        store.reload();
        view.up().close();
    },
    /**
     * 
     * @param {Ext.button.Button} button 
     * @param {Event} event 
     * @param {Object} eOpts 
     */
    onAddRowConfigBtnCLick: function (button, event, eOpts)  {
        var view = this.getView();
        var store = view.getStore();
        store.add({ category: '', content: '', level: 'ERROR' });
        view.getView().getScrollable().scrollTo(0, Infinity, true);
    },

    /**
     * 
     * @param {Ext.grid.plugin.CellEditing} editor 
     * @param {Object} context 
     * @param {Object} eOpts 
     */
    onBeforeCellEdit: function (editor, context, eOpts) {
        if ((context.record.phantom === true && context.column.dataIndex !== 'description') || context.column.dataIndex === 'level') {
            return true;
        }
        return false;
    }

});