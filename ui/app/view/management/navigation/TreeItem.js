Ext.define('CMDBuildUI.view.management.navigation.TreeItem', {
    extend: 'Ext.list.TreeItem',
    alias: 'widget.management-treelistitem',

    listeners: {
        resize: function (item) {
            var textEl = item.component.textElement,
                div = item.el.child("div");
            if (div && textEl.dom.clientWidth - textEl.dom.scrollWidth < 0) {
                var tooltip = item.component.getNode().get('objectdescription_translation') || item.component.getNode().get('objectdescription');
                if (tooltip) {
                    div.dom.dataset.qtip = tooltip;
                    div.dom.dataset.qalign = 'tl-tr';
                }
            } else if (div && div.dom.dataset.qtip) {
                delete div.dom.dataset.qtip;
            }
        }
    },

    /**
     * @override
     * @param {Ext.list.TreeItem} item
     * @param {refItem} refItem
     */
    insertItem: function (item, refItem) {
        var node = item.getNode();
        var typename = node.get("objecttypename") || node.get("objectdescription");
        var testid = Ext.String.format(
            Ext.String.format(
                'management-navigation-{0}-{1}', node.get("menutype"), typename
            )
        );
        item.el.dom.dataset.testid = testid;
        if (refItem) {
            item.element.insertBefore(refItem.element);
        } else {
            this.itemContainer.appendChild(item.element);
        }
    }
});