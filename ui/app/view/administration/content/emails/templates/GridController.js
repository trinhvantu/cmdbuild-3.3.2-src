Ext.define('CMDBuildUI.view.administration.content.emails.templates.GridController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.administration-content-emails-templates-grid',
    listen: {
        global: {
            templateupdated: 'onTemplateUpdated',
            templatecreated: 'onTemplateCreated',
            templatedestroyed: 'onTemplateDestroyed'
        }
    },
    control: {
        tableview: {
            rowdblclick: 'onRowDblclick',
            deselect: 'onDeselect',
            select: 'onSelect'
        }
    },
    /**
     * @param {Ext.selection.RowModel} row
     * @param {Ext.data.Model} record
     * @param {Number} index
     * @param {Object} eOpts
     */
    onDeselect: function (row, record, index, eOpts) {

    },

    /**
     * @param {Ext.selection.RowModel} row
     * @param {Ext.data.Model} record
     * @param {Number} index
     * @param {Object} eOpts
     */
    onSelect: function (row, record, index, eOpts) {

    },
    /**
     * 
     * @param {Ext.data.Model} record
     */
    onTemplateUpdated: function (record) {

        var view = this.getView();
        view.getPlugin('administration-forminrowwidget').view.fireEventArgs('itemupdated', [view, record, this]);
    },

    /**
     * 
     * @param {Ext.data.Model} record
     */
    onTemplateDestroyed: function (record) {

        var view = this.getView();
        view.getPlugin('administration-forminrowwidget').view.fireEventArgs('itemremoved', [view, record, this]);
    },

    /**
     * 
     * @param {Ext.data.Model} record
     */
    onTemplateCreated: function (record) {

        var view = this.getView();
        view.getPlugin('administration-forminrowwidget').view.fireEventArgs('itemcreated', [view, record, this]);
    },

    /** 
     * @param {*} row 
     * @param {*} record 
     * @param {*} element 
     * @param {*} rowIndex 
     * @param {*} e 
     * @param {*} eOpts 
     */
    onRowDblclick: function (row, record, element, rowIndex, e, eOpts) {
        var container = Ext.getCmp(CMDBuildUI.view.administration.DetailsWindow.elementId) || Ext.create(CMDBuildUI.view.administration.DetailsWindow);

        var formInRow = row.ownerGrid.getPlugin('administration-forminrowwidget');
        formInRow.removeAllExpanded(record);
        row.setSelection(record);

        this.getView().ownerGrid.getPlugin('administration-forminrowwidget').view.fireEventArgs('togglerow', [null, record, rowIndex]);
        container.removeAll();
        container.add({
            xtype: 'administration-content-emails-templates-card-form',
            viewModel: {
                links: {
                    theTemplate: {
                        type: 'CMDBuildUI.model.emails.Template',
                        id: record.get('_id')
                    }
                },
                data: {
                    actions: {
                        view: false,
                        add: false,
                        edit: true
                    }
                }
            }
        });
    }

});