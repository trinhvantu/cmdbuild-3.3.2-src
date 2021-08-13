Ext.define('CMDBuildUI.view.navcontent.ContainerController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.navcontent-container',

    listen: {
        global: {
            menunavtreeitemchanged: 'onMenuNavTreeItemChanged'
        }
    },

    updateView: function (currentNode) {
        var view = this.getView();
        view.removeAll();

        // set page title
        if (currentNode.get("_objectdescription")) {
            var label = currentNode.get("_label");
            if (!label) {
                label = CMDBuildUI.util.helper.ModelHelper.getObjectDescription(currentNode.get("_targettypename"));
            }
            view.setTitle(Ext.String.format(
                // "{0} of {1}",
                CMDBuildUI.locales.Locales.main.treenavcontenttitle,
                label,
                currentNode.get("_objectdescription")
            ));
        } else {
            view.setTitle(currentNode.get("text"));
        }

        // add grid
        if (currentNode.get("_targettype") === CMDBuildUI.util.helper.ModelHelper.objecttypes.klass) {
            view.add({
                xtype: 'classes-cards-grid-container',
                objectTypeName: currentNode.get("_targettypename"),
                filter: currentNode.get("_storefilter"),
                header: false,
                maingrid: true
            });
        }
    },

    onMenuNavTreeItemChanged: function (currentNode) {
        this.updateView(currentNode);

        // Need to write the context because would be empty due to previous clearcontext() call
        CMDBuildUI.util.Navigation.updateCurrentManagementContext(
            CMDBuildUI.util.helper.ModelHelper.objecttypes.navtreecontent,
            this.getView().getNavTreeName()
        );
    }

});