Ext.define('CMDBuildUI.mixins.model.Attribute', {
    mixinId: 'model-attribute-mixin',

    /**
     * @cfg {Function} getAttributesUrl
     * A function that returns the url of the attributes.
     */
    getAttributesUrl: Ext.emptyFn,

    /**
     * @cfg {String} attributesStoreName
     */
    attributesStoreName: 'attributes',

    /**
     * Load attributes relation
     * @param {Boolean} force If `true` load the store also if it is already loaded.
     * @return {Ext.Deferred} The promise has as parameters the attributes store and a boolean field.
     */
    getAttributes: function (force) {
        var me = this;
        var deferred = new Ext.Deferred();
        var attributes = this[this.attributesStoreName]();

        if ((!attributes.isLoaded() || force) && !this.phantom) {
            
            attributes.setProxy({
                type: 'baseproxy',
                url: this.getAttributesUrl()
            });

            attributes.load({
                callback: function (records, operation, success) {
                    if (success) {
                        var done = false;
                        for (var i = 0; i < records.length && !done; i++) {
                            var record = records[i];
                            var calendarTriggers = record.get('calendarTriggers');

                            if (calendarTriggers && calendarTriggers.length) {

                                for (var j = 0; j < calendarTriggers.length && !done; j++) {
                                    var calendarTrigger = calendarTriggers[j];
                                    if (calendarTrigger.active == true) {
                                        me.set('_hasTriggers', true);
                                        done = true;
                                    }
                                }
                            }
                        }
                        deferred.resolve(attributes, true);
                    } else {
                        deferred.reject(operation);
                    }
                }
            });
        } else {
            // return promise
            deferred.resolve(attributes, false);
        }
        return deferred.promise;
    }

});