Ext.define('CMDBuildUI.mixins.model.Filter', {
    mixinId: 'model-filter-mixin', 

    _currentFilter: undefined,

    /**
     * Load domains relation
     * @param {Boolean} force If `true` load the store also if it is already loaded.
     * @return {Ext.Deferred} The promise has as paramenters the domains store and a boolean field.
     */
    getFilters: function (force) {
        var deferred = new Ext.Deferred();
        var filters = this.filters();

        if (!filters.isLoaded() || force) {
            filters.getProxy().setUrl(CMDBuildUI.util.api.Common.getFiltersUrl(this.objectType, this.get("name")));
            // load store
            filters.load({
                callback: function (records, operation, success) {
                    if (success) {
                        filters.getSorters().add("description");
                        deferred.resolve(filters, true);
                    }
                }
            });
        } else {
            // return promise
            deferred.resolve(filters, false);
        }
        return deferred.promise;
    },

    /**
     * @return {Numeric|CMDBuildUI.model.base.Filter}
     */
    getCurrentFilter: function() {
        if (this._currentFilter === undefined) {
            return CMDBuildUI.view.filters.Launcher.getDefaultFilter(this.objectType, this.get("name"));
        } else {
            return this._currentFilter;
        }
    },

    /**
     * 
     * @param {Numeric|CMDBuildUI.model.base.Filter} filter 
     */
    setCurrentFilter: function(filter) {
        if (filter) {
            this._currentFilter = filter;
        } else {
            this._currentFilter = null;
        }
    }
});