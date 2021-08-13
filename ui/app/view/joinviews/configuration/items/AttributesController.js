Ext.define('CMDBuildUI.view.joinviews.configuration.items.AttributesController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.joinviews-configuration-items-attributes',


    onClassChange: function (input, newValue, oldValue) {
        // actually do nothing 
        // required actions were performed in main controller

    },

    onClassAliasChange: function (input, newValue, oldValue) {
        var me = this;
        var grid = me.getView().down('grid');
        var store = grid.getStore();        
        // set new targetAlias and update expr
        store.each(function (item) {
            if (item.get('targetAlias') === oldValue) {
                item.set('targetAlias', newValue);
                item.set('expr', item.get('expr').replace(oldValue, newValue));
            }
        });


    },

    onDomainChange: function (record, context, eOpts) {
        var me = this;
        var grid = me.getView().down('grid');
        var store = grid.getStore();
        var mainView = grid.up('joinviews-configuration-main');
        switch (context.field) {
            case 'targetAlias':
                // set new targetAlias and update expr
                store.each(function (item) {
                    if (item.get('targetAlias') === record.getPrevious('targetAlias')) {                        
                        item.set('targetAlias', record.get('targetAlias'));
                        item.set('expr', item.get('expr').replace(record.getPrevious('targetAlias'), record.get('targetAlias')));
                    }
                });
                break;
            case 'targetType':
                // get all record of tarteType class
                var recordsStoreToRemove = store.queryBy(function (item) {
                    if (item.get('targetAlias') === record.getPrevious('targetAlias')) {
                        // remove stored alias of attribute
                        mainView.clearAliasIndex(record.get('name'));
                        return true;
                    }
                    return false;
                });
                // remove all attributes of targetType class
                store.remove(recordsStoreToRemove.getRange());
                recordsStoreToRemove.destroy();

                // add all attributes of new targetType class
                var targetClass = CMDBuildUI.util.helper.ModelHelper.getObjectFromName(record.get('targetType'));
                targetClass.getAttributes().then(function (attributesStore) {
                    attributesStore.each(function (attribute) {
                        // var nameAliasIndex = mainView.getNewAliasIndex(attribute.get('name'));

                        store.addSorted(CMDBuildUI.model.views.JoinViewAttribute.create({
                            _deepIndex: me.getDeepIndex(record),
                            targetAlias: record.get('targetAlias'),
                            expr: Ext.String.format('{0}.{1}', record.get('targetAlias'), attribute.get('name')),
                            name: '', // Ext.String.format('{0}{1}', attribute.get('name'), nameAliasIndex ? Ext.String.format('_{0}', nameAliasIndex) : ''), // alias
                            description: '',
                            group: '',
                            showInGrid: false,
                            showInReducedGrid: false
                        }));
                    });
                });
                break;

            default:
                break;
        }
        grid.getView().refresh();
    },

    onDomainCheckChange: function (node, ctx) {
        var me = this;
        var vm = me.getViewModel();
        var store = vm.get('allAttributesStore');

        if (node.get('checked')) {
            // add attributes of targetClass to grid                   
            var targetClass = CMDBuildUI.util.helper.ModelHelper.getObjectFromName(node.get('targetType'));
            targetClass.getAttributes().then(function (attributesStore) {
                attributesStore.each(function (attribute) {
                    var expr = Ext.String.format('{0}.{1}', node.get('targetAlias'), attribute.get('name'));
                    var storeAlreadyContain = store.findRecord('expr', expr);
                    if (attribute.canAdminShow() && !storeAlreadyContain) {
                        store.addSorted(CMDBuildUI.model.views.JoinViewAttribute.create({
                            _deepIndex: me.getDeepIndex(node),
                            targetAlias: node.get('targetAlias'),
                            targetType: node.get('targetType'),
                            expr: expr,
                            name: '', //
                            description: '',
                            group: '',
                            showInGrid: false,
                            showInReducedGrid: false,
                            _attributeDescription: attribute.getTranslatedDescription(),
                            attributeconf: attribute.getData(),
                            cmdbuildtype: attribute.get('type')
                        }));

                    } else if (storeAlreadyContain) {
                        storeAlreadyContain.set('_deepIndex', me.getDeepIndex(node));
                        storeAlreadyContain.set('_attributeDescription', attribute.getTranslatedDescription());
                        storeAlreadyContain.set('attributeconf', attribute.getData());
                        storeAlreadyContain.set('cmdbuildtype', attribute.get('type'));
                    }
                });
            });

            var domain = CMDBuildUI.util.helper.ModelHelper.getObjectFromName(node.get('domain'));
            domain.getAttributes().then(function (attributesStore) {
                attributesStore.each(function (attribute) {
                    var expr = Ext.String.format('{0}.{1}', node.get('domainAlias'), attribute.get('name'));
                    var storeAlreadyContain = store.findRecord('expr', expr);
                    if (attribute.canAdminShow() && !storeAlreadyContain) {
                        store.addSorted(CMDBuildUI.model.views.JoinViewAttribute.create({
                            _deepIndex: me.getDeepIndex(node),
                            targetAlias: node.get('domainAlias'),
                            targetType: node.get('domain'),
                            expr: expr,
                            name: '', //
                            description: '',
                            group: '',
                            showInGrid: false,
                            showInReducedGrid: false,
                            _attributeDescription: attribute.getTranslatedDescription(), 
                            attributeconf: attribute.getData(),
                            cmdbuildtype: attribute.get('type')
                        }));

                    } else if (storeAlreadyContain) {
                        storeAlreadyContain.set('_deepIndex', me.getDeepIndex(node));
                        storeAlreadyContain.set('_attributeDescription', attribute.getTranslatedDescription());
                        storeAlreadyContain.set('attributeconf', attribute.getData());
                        storeAlreadyContain.set('cmdbuildtype', attribute.get('type'));
                    }
                });
            });
        } else {

            var recordsStoreToRemove = store.queryBy(function (item) {
                return item.get('targetAlias') === node.getPrevious('targetAlias');
            });
            store.remove(recordsStoreToRemove.getRange());
            recordsStoreToRemove.destroy();
        }
    },
    onBeforeDeselect: function (grid, record) {
        var vm = this.getViewModel();

        if (vm.get('actions.view')) {
            return false;
        }
        return true;
    },

    onDeselect: function (grid, record, rowIndex, eOpts) {
        var mainView = this.getView().up('joinviews-configuration-main');
        mainView.lookupViewModel().get('theView').attributes().remove(record);
        mainView.clearAliasIndex(record.get('name'));
        record.set('description', '');
        record.set('name', '');
        record.set('showInGrid', false);
        record.set('showInReducedGrid', false);
        record.set('group', '');
        Ext.asap(function () {
            var gridSelection = grid.getSelection();
            mainView.lookupViewModel().set('selectedAttributes', gridSelection);
        });
    },

    onBeforeSelect: function (grid, record) {
        var vm = this.getViewModel();

        if (vm.get('actions.view') && !vm.get('theView.attributes').findRecord('expr', record.get('expr'))) {
            return false;
        }
        return true;
    },

    onSelect: function (grid, record, rowIndex, eOpts) {
        var mainView = this.getView().up('joinviews-configuration-main');
        var attributeName = record.get('expr').split('.')[1];
        var nameAliasIndex = mainView.getNewAliasIndex(attributeName);
        record.set('name', Ext.String.format('{0}{1}', attributeName, nameAliasIndex ? Ext.String.format('_{0}', nameAliasIndex) : ''));
        mainView.lookupViewModel().get('theView').attributes().add(record);
        Ext.asap(function () {
            var gridSelection = grid.getSelection();
            mainView.lookupViewModel().set('selectedAttributes', gridSelection);
        });
    },

    onAttributeDescriptionLocalizeBtnClick: function () {
        // debugger;
        //TODO define loacalization rules
    },

    onAttributeGroupsChanged: function (attributeGroup) {
        var grid = this.getView().down('grid');
        grid.getView().refresh();
    },

    onAttributeGroupsRemoved: function (attributeGroup) {
        var grid = this.getView().down('grid');
        var gridStore = grid.getStore();
        gridStore.each(function (item) {
            if (item.get('group') === attributeGroup.get('name')) {
                item.set('group', null);
            }
        });
    },

    privates: {
        domaintree: null,
        getDeepIndex: function (node) {

            if (!this.domaintree) {
                this.domaintree = this.getView().up('#joinviews-configuration-main').down('#domainstree');
            }
            var index = '';
            if (!node) {
                return String.fromCharCode(65);
            }
            if (node.parentNode && !node.parentNode.get('root')) {
                index += this.getDeepIndex(node.parentNode);
            }
            try {
                index += String.fromCharCode(66 + Number(this.domaintree.getView().getNodeById(node.internalId).dataset.recordindex));
            } catch (e) {
                index += String.fromCharCode(66);
            }
            return index;
        }
    }

});