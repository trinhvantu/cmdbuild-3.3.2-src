Ext.define('CMDBuildUI.model.navigationTrees.TreeNode', {
    extend: 'CMDBuildUI.model.base.Base',
    statics: {
        subclassViewMode: {
            cards: 'cards',
            subclasses: 'subclasses'
        }
    },
    fields: [{
        name: 'domain',
        type: 'string'
    }, {
        name: 'filter',
        type: 'string'
    }, {
        name: 'recursionEnabled',
        type: 'boolean'
    }, {
        name: 'showOnlyOne',
        type: 'boolean'
    }, {
        name: 'direction',
        type: 'string'
    }, {
        name: 'parent',
        type: 'string'
    }, {
        name: 'targetClass',
        type: 'string'
    }, {
        name: 'params',
        type: 'string'
    }, {
        name: 'description',
        type: 'string' // optional, only for menu navtree type
    }, {
        name: 'subclassViewMode',
        type: 'string', // only if targetClass is superclass, values can be cards|subclasses
        defaultValue: 'cards'
    }, {
        // optional, only if subclassViewMode is subclasses. 
        // If true show intermedie subclass as node, else show sublclass as leaf
        name: 'subclassViewShowIntermediateNodes',
        type: 'boolean',
        defaultValue: true
    }, {
        // only if targetClass is superclass, contain subclasses as list, comma separated. If empty, show Superclass
        name: 'subclassFilter',
        type: 'string'

    }], //Recursion Enabled param is not inserted //TODO: avoid the inserting of the reade of metadata cmp.

    hasMany: [{
        name: 'childs',
        model: 'CMDBuildUI.model.navigationTrees.TreeNode',
        associationKey: 'nodes',
        inverse: {
            getterName: 'getParent'
        }
    }],

    proxy: {
        type: 'memory'
    },

    isNavRoot: function () {
        return Ext.isEmpty(this.getParent());
    },

    isNavLeaf: function () {
        return Ext.isEmpty(this.childs().getRange());
    }
});