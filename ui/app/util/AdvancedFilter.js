Ext.define('CMDBuildUI.util.AdvancedFilter', {
    isAdvancedFilter: true,

    config: {
        /**
         * @cfg {Object} attributes
         * 
         * An object containing attribute filter configuration.
         */
        attributes: {},

        /**
         * @cfg {Object} relations
         * 
         * An object containing relation filter configuration.
         */
        relations: {},

        /**
         * @cfg {String} attachmentsQuery
         * 
         * A string for fulltext filter on attachments
         */
        attachmentsQuery: null,

        /**
         * @cfg {Object} ecql
         * 
         * An object containing relation filter configuration.
         */
        ecql: {},

        /**
         * @cfg {String} query
         */
        query: null,

        /**
         * @cfg {String} cql
         */
        cql: null,

        /**
         * @cfg {Object} baseFilter
         * An object with a base filter to apply always.
         * 
         * @cfg {Object} baseFilter.attributes
         * @cfg {Object} baseFilter.relations
         * @cfg {Object} baseFilter.ecql
         * @cfg {String} baseFilter.query
         */
        baseFilter: {}
    },

    constructor: function (config) {
        config = config || {};
        var me = this;
        // decode config
        var newconfig = me.decodeFilter(config);
        // decode base filter
        if (config.baseFilter) {
            newconfig.baseFilter = me.decodeFilter(config.baseFilter);
        }
        // init configs
        this.initConfig(newconfig);
    },

    /**
     * @return {Object}
     * The filter to send to the server.
     */
    encode: function () {
        var filter = {};
        // attribute
        var attrfilter = Ext.merge({}, this._attributes || {}, this._baseFilter.attributes || {});
        if (!Ext.Object.isEmpty(attrfilter)) {
            var attributes = [];
            for (var a in attrfilter) {
                var af = [];
                attrfilter[a].forEach(function (attribute) {
                    af.push({
                        simple: {
                            attribute: a,
                            operator: attribute.operator,
                            value: attribute.value
                        }
                    });
                });
                if (af.length === 1) {
                    attributes.push(af[0]);
                } else {
                    attributes.push({
                        or: af
                    });
                }
            }
            if (attributes.length === 1) {
                filter.attribute = attributes[0];
            } else {
                filter.attribute = {
                    and: attributes
                };
            }
        }

        // relation
        var relfilter = Ext.merge({}, this._relations || {}, this._baseFilter.relations || {});
        if (!Ext.Object.isEmpty(relfilter)) {
            var relations = [];
            for (var domain in relfilter) {
                relations.push(Ext.apply({ domain: domain }, relfilter[domain]));
            }
            filter.relation = relations;
        }

        // ecql
        if (!Ext.Object.isEmpty(this._ecql)) {
            filter.ecql = this._ecql;
        } else if (this._baseFilter && !Ext.Object.isEmpty(this._baseFilter.ecql)) {
            filter.ecql = this._baseFilter.ecql;
        }

        // cql
        if (!Ext.Object.isEmpty(this._cql)) {
            filter.cql = this._cql;
        } else if (this._baseFilter && !Ext.Object.isEmpty(this._baseFilter.cql)) {
            filter.cql = this._baseFilter.cql;
        }

        // query
        var query = this._query || this._baseFilter.query;
        if (!Ext.isEmpty(query)) {
            filter.query = query;
        }

        // attachments
        var attachmentsquery = this._attachmentsQuery || this._baseFilter.attachmentsQuery;
        if (!Ext.isEmpty(attachmentsquery)) {
            filter.attachment = {
                query: attachmentsquery
            };
        }

        // return filter
        return !Ext.Object.isEmpty(filter) ? Ext.JSON.encode(filter) : null;
    },

    /**
     * Add an attribute filter to filter.
     * 
     * @param {String} attribute
     * @param {String} operator
     * @param {*} value
     * @param {string} attributeId
     */
    addAttributeFilter: function (attribute, operator, value, attributeId) {
        if (!this._attributes[attribute]) {
            this._attributes[attribute] = [];
        }
        if (!Ext.isArray(value)) {
            value = [value];
        }

        var f = {
            operator: operator,
            value: value
        }

        if (attributeId) {
            f.attributeId = attributeId
        }

        this._attributes[attribute].push(f);
    },

    /**
     * Remove an attribute filter from filter.
     * 
     * @param {String} attribute
     * @param {String} attributeId
     */
    removeAttributeFitler: function (attribute, attributeId) {
        if (this._attributes[attribute]) {
            if (attributeId) {
                var replacedAttributes = [];
                this._attributes[attribute].forEach(function (singleAttribute) {
                    if (singleAttribute.attributeId !== attributeId) {
                        replacedAttributes.push(singleAttribute);
                    }
                });

                if (replacedAttributes.length) {
                    this._attributes[attribute] = replacedAttributes;
                } else {
                    delete this._attributes[attribute];
                }
            } else {
                delete this._attributes[attribute];
            }
        }
    },

    /**
     * @deprecated
     * Clear attributes filter from filter.
     */
    clearAttributesFitler: function () {
        //<debug>
        Ext.log.warn('CMDBuildUI.util.AdvancedFilter.clearAttributesFitler() is deprecated. Use CMDBuildUI.util.AdvancedFilter.clearAttributesFilter() instead.');
        //</debug>
        this.clearAttributesFilter();
    },

    /**
     * Clear attributes filter from filter.
     */
    clearAttributesFilter: function () {
        this._attributes = {};
    },

    /**
     * Add a relation filter to filter.
     * 
     * @param {String} domain 
     * @param {String} source 
     * @param {String} destination 
     * @param {String} direction One of `_1` or `_2`
     * @param {String} type One of `any`, `noone` or `oneof`
     * @param {Object[]} cards Array of objects
     * @param {Object} filter Attributes filter
     */
    addRelationFilter: function (domain, source, destination, direction, type, cards, filter) {
        this._relations[domain] = {
            source: source,
            destination: destination,
            direction: direction,
            type: type
        };
        if (!Ext.isEmpty(cards)) {
            this._relations[domain].cards = cards;
        }
        if (!Ext.isEmpty(filter)) {
            this._relations[domain].filter = filter;
        }
    },

    /**
     * Remove a relation filter from filter.
     * 
     * @param {String} domain 
     */
    removeRelationFitler: function (domain) {
        if (this._relations[domain]) {
            delete this._relations[domain];
        }
    },

    /**
     * Clear relations filter from filter.
     */
    clearRelationsFitler: function () {
        this._relations = {};
    },

    /**
     * Add attachments filter
     * 
     * @param {Object} attachment 
     * @param {String} attachment.query
     */
    addAttachmentsFilter: function(attachment) {
        if (!Ext.Object.isEmpty(attachment) && attachment.query) {
            this._attachmentsQuery = attachment.query;
        }
    },

    /**
     * Add attachments query filter
     * @param {String} query
     */
    addAttachmentsQueryFilter: function(query) {
        if (query) {
            this._attachmentsQuery = query;
        }
    },

    /**
     * Clear attachments filter
     */
    clearAttachmentsFilter: function() {
        this.clearAttachmentsQueryFilter();
    },
    
    /**
     * Clear attachments query filter
     */
    clearAttachmentsQueryFilter: function() {
        this._attachmentsQuery = null;
    },

    /**
     * Set ecql filter to filter.
     * 
     * @param {String} ecql
     */
    addEcqlFilter: function (ecql) {
        this._ecql = ecql;
    },

    /**
     * Clear ecql filter from filter.
     */
    clearEcqlFitler: function () {
        this._ecql = {};
    },

    /**
     * Set cql filter to filter.
     * 
     * @param {String} cql
     */
    addCqlFilter: function (cql) {
        this._cql = cql;
    },

    /**
     * Clear cql filter from filter.
     */
    clearCqlFitler: function () {
        this._cql = {};
    },

    /**
     * Set query filter to filter.
     * 
     * @param {String} query
     */
    addQueryFilter: function (query) {
        this._query = query;
    },

    /**
     * Clear query filter from filter.
     */
    clearQueryFilter: function () {
        this._query = null;
    },

    /**
     * @param {Object} filter
     */
    addBaseFilter: function (filter) {
        this._baseFilter = this.decodeFilter(filter);
    },

    /**
     * Clear query filter from filter.
     */
    clearBaseFilter: function () {
        this._baseFilter = {};
    },

    /**
     * @return {Boolean}
     */
    isEmpty: function () {
        return Ext.Object.isEmpty(this._attributes) &&
            Ext.Object.isEmpty(this._relations) &&
            Ext.isEmpty(this._attachmentsQuery) &&
            Ext.Object.isEmpty(this._ecql) &&
            Ext.Object.isEmpty(this._cql) &&
            Ext.isEmpty(this._query);
    },

    /**
     * @return {Boolean}
     */
    isBaseFilterEmpty: function () {
        return Ext.Object.isEmpty(this._baseFilter);
    },

    /**
     * @return {Boolean}
     */
    isAttributesFilterEmpty: function () {
        return Ext.Object.isEmpty(this._attributes);
    },

    /**
     * @return {Boolean}
     */
    isAttachmentsFilterEmpty: function() {
        return Ext.isEmpty(this._attachmentsQuery);
    },

    /** 
     * Clear advanced filter
    */
    clearAdvancedFilter: function () {
        this.clearAttributesFilter();
        this.clearRelationsFitler();
        this.clearAttachmentsFilter();
        this.clearEcqlFitler();
        this.clearQueryFilter();
    },

    /**
     * 
     * @param {Object|String} filter An object with advanced filter structure.
     */
    applyAdvancedFilter: function (filter) {
        var decoded = this.decodeFilter(filter);

        if (decoded.attributes) {
            this._attributes = Ext.merge(this._attributes, decoded.attributes);
        }

        if (decoded.relations) {
            this._relations = Ext.merge(this._relations, decoded.relations);
        }

        if (decoded.ecql) {
            this._ecql = decoded.ecql;
        }

        if (decoded.cql) {
            this._cql = decoded.cql;
        }

        if (decoded.query) {
            this._query = decoded.query;
        }

        if (decoded.attachmentsQuery) {
            this._attachmentsQuery = decoded.attachmentsQuery;
        }
    },

    privates: {
        /**
         * Decode a filter.
         * @param {Object|String} filter 
         */
        decodeFilter: function (filter) {
            var newfilter = {};
            if (Ext.isString(filter)) {
                // Try to convert string to object. If the string is not an object
                // the string will be used as query filter.
                try {
                    filter = Ext.JSON.decode(filter);
                } catch (e) {
                    filter = {
                        query: filter
                    };
                }
            }

            filter = filter || {};

            // query
            if (filter.query) {
                newfilter.query = filter.query;
            }

            // ecql
            if (filter.ecql) {
                newfilter.ecql = filter.ecql;
            }

            // ecql
            if (filter.cql) {
                newfilter.cql = filter.cql;
            }

            // attributes
            if (filter.attribute && (filter.attribute.simple || filter.attribute.and || filter.attribute.or)) {
                newfilter.attributes = {};
                // extract simple attribute function
                function extractSimple(simple) {
                    if (!newfilter.attributes[simple.attribute]) {
                        newfilter.attributes[simple.attribute] = [];
                    }
                    newfilter.attributes[simple.attribute].push({
                        operator: simple.operator,
                        value: Ext.isArray(simple.value) ? simple.value : simple.value
                    });
                }
                // extract or operator function
                function extractOr(or) {
                    or.forEach(function (option) {
                        extractSimple(option.simple);
                    });
                }
                // extract data from advanced filter structure
                if (filter.attribute.and) {
                    filter.attribute.and.forEach(function (attr) {
                        if (attr.or) {
                            extractOr(attr.or);
                        } else if (attr.simple) {
                            extractSimple(attr.simple);
                        }
                    });
                } else if (filter.attribute.or) {
                    extractOr(filter.attribute.or);
                } else if (filter.attribute.simple) {
                    extractSimple(filter.attribute.simple);
                }
            } else if (filter.attribute || filter.attributes) {
                newfilter.attributes = {};
                var attributes = filter.attribute || filter.attributes;
                for (var attr in attributes) {
                    if (Ext.isArray(attributes[attr])) {
                        newfilter.attributes[attr] = attributes[attr];
                    } else if (Ext.isObject(attributes[attr])) {
                        newfilter.attributes[attr] = [attributes[attr]];
                    }
                }
            }

            // relations
            if (filter.relation) {
                if (Ext.isArray(filter.relation)) {
                    newfilter.relations = {};
                    filter.relation.forEach(function (r) {
                        newfilter.relations[r.domain] = {
                            source: r.source,
                            destination: r.destination,
                            direction: r.direction,
                            type: r.type
                        };
                        if (r.cards) {
                            newfilter.relations[r.domain].cards = r.cards;
                        }
                        if (r.filter) {
                            newfilter.relations[r.domain].filter = r.filter;
                        }
                    });
                } else if (Ext.isObject(filter.relation)) {
                    newfilter.relations = filter.relation;
                }
            } else if (filter.relations) {
                newfilter.relations = filter.relations;
            }

            // attachments
            if (filter.attachment) {
                if (filter.attachment.query) {
                    newfilter.attachmentsQuery = filter.attachment.query;
                }
            }

            return newfilter;
        }
    }
});