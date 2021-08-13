/**
 * Abstract base class for filter implementations.
 */
Ext.define('Overrides.grid.filters.filter.Base', {
    override: 'Ext.grid.filters.filter.Base',

    addStoreFilter: function (filter) {
        var store = this.getGridStore();
        this.addAdvancedFilter(store, filter);
        store.load();
    },
    removeStoreFilter: function (filter) {
        var store = this.getGridStore();
        this.removeAdvancedFilter(store, filter.getProperty(), filter.getId());
        store.load();
    },
    updateStoreFilter: function () {
        var store = this.getGridStore();
        this.removeAdvancedFilter(store, this.filter.getProperty(), this.filter.getId());
        this.addAdvancedFilter(store, this.filter);
        store.load();
    },

    privates: {
        /**
         * 
         * @param {Ext.data.ProxyStore} store 
         * @param {CMDBuildUI.util.AdvancedFilter} filter 
         */
        addAdvancedFilter: function (store, filter) {
            var advancedfilter = store.getAdvancedFilter();
            var attribute = filter.getProperty(),
                value = filter.getValue(),
                operator;
            switch (filter.getOperator()) {
                case 'in':
                    operator = 'in';
                    break;
                case 'lt':
                    operator = 'less';
                    break;
                case 'gt':
                    operator = 'greater';
                    break;
                case 'eq':
                case '==':
                    operator = 'equal';
                    break;
                case 'like':
                    operator = 'contain';
                    break;
                case 'description_like':
                    operator = 'description_contains';
                    break;
            }

            // for dates use between operator
            if (Ext.isDate(value) && operator === 'equal') {
                operator = 'between';
                value = [value, Ext.Date.subtract(value, Ext.Date.DAY, -0.99999)];
            }

            advancedfilter.removeAttributeFitler(attribute, filter.getId());
            advancedfilter.addAttributeFilter(attribute, operator, value, filter.getId());
        },

        /**
         * 
         * @param {Ext.data.ProxyStore} store 
         * @param {String} property 
         */
        removeAdvancedFilter: function (store, property, filterid) {
            var advancedfilter = store.getAdvancedFilter();
            advancedfilter.removeAttributeFitler(property, filterid);
        }
    }
});