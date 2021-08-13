Ext.define('CMDBuildUI.model.base.Filter', {
    extend: 'CMDBuildUI.model.base.Base',

    statics: {
        operators: {
            equal: "equal",
            notequal: "notequal",
            null: "isnull",
            notnull: "isnotnull",
            greater: "greater",
            less: "less",
            between: "between",
            contain: "contain",
            notcontain: "notcontain",
            begin: "begin",
            notbegin: "notbegin",
            end: "end",
            notend: "notend",
            netcontains: "net_contains",
            netcontained: "net_contained",
            netcontainsorequal: "net_containsorequal",
            netcontainedorequal: "net_containedorequal",
            in: "in",
            description_contains: "description_contains",
            description_notcontain: "description_notcontain",
            description_begin: "description_begin",
            description_notbegin: "description_notbegin",
            description_end: "description_end",
            description_notend: "description_notend"
        },
        parametersypes: {
            runtime: 'runtime',
            fixed: 'fixed'
        },
        relationstypes: {
            any: 'any',
            noone: 'noone',
            oneof: 'oneof',
            fromfilter: 'fromfilter'
        },
        cloneFilters: {
            ignore: 'ignore',
            migrates: 'migrates',
            clone: 'clone'
        },
        getOperatorDescription: function (operator) {
            switch (operator) {
                case this.operators.begin:
                    return CMDBuildUI.locales.Locales.filters.operators.beginswith;
                case this.operators.between:
                    return CMDBuildUI.locales.Locales.filters.operators.between;
                case this.operators.contain:
                    return CMDBuildUI.locales.Locales.filters.operators.contains;
                case this.operators.end:
                    return CMDBuildUI.locales.Locales.filters.operators.endswith;
                case this.operators.equal:
                    return CMDBuildUI.locales.Locales.filters.operators.equals;
                case this.operators.greater:
                    return CMDBuildUI.locales.Locales.filters.operators.greaterthan;
                case this.operators.less:
                    return CMDBuildUI.locales.Locales.filters.operators.lessthan;
                case this.operators.netcontained:
                    return CMDBuildUI.locales.Locales.filters.operators.contained;
                case this.operators.netcontainedorequal:
                    return CMDBuildUI.locales.Locales.filters.operators.containedorequal;
                case this.operators.netcontains:
                    return CMDBuildUI.locales.Locales.filters.operators.contains;
                case this.operators.netcontainsorequal:
                    return CMDBuildUI.locales.Locales.filters.operators.containsorequal;
                case this.operators.notbegin:
                    return CMDBuildUI.locales.Locales.filters.operators.doesnotbeginwith;
                case this.operators.notcontain:
                    return CMDBuildUI.locales.Locales.filters.operators.doesnotcontain;
                case this.operators.notend:
                    return CMDBuildUI.locales.Locales.filters.operators.doesnotendwith;
                case this.operators.notequal:
                    return CMDBuildUI.locales.Locales.filters.operators.different;
                case this.operators.notnull:
                    return CMDBuildUI.locales.Locales.filters.operators.isnotnull;
                case this.operators.null:
                    return CMDBuildUI.locales.Locales.filters.operators.isnull;
                case this.operators.description_contains:
                    return CMDBuildUI.locales.Locales.filters.operators.descriptioncontains;
                case this.operators.description_notcontain:
                    return CMDBuildUI.locales.Locales.filters.operators.descriptionnotcontain;
                case this.operators.description_begin:
                    return CMDBuildUI.locales.Locales.filters.operators.descriptionbegin;
                case this.operators.description_notbegin:
                    return CMDBuildUI.locales.Locales.filters.operators.descriptionnotbegin;
                case this.operators.description_end:
                    return CMDBuildUI.locales.Locales.filters.operators.descriptionends;
                case this.operators.description_notend:
                    return CMDBuildUI.locales.Locales.filters.operators.descriptionnotends;
            }
        },
        isOperatorForRefernceOrLookupDescription: function (operator) {
            return [
                this.operators.description_contains,
                this.operators.description_notcontain,
                this.operators.description_begin,
                this.operators.description_notbegin,
                this.operators.description_end,
                this.operators.description_notend
            ].indexOf(operator) > -1;
        }
    },

    fields: [{
        name: 'name',
        type: 'string',
        critical: true
    }, {
        name: 'description',
        type: 'string',
        critical: true,
        convert: function (value, record) {
            return record.get("_description_translation") || value || record.get("name");
        }
    }, {
        name: 'target',
        type: 'string',
        critical: true
    }, {
        name: 'configuration',
        type: 'auto',
        convert: function (value, record) {
            if (value && Ext.isString(value)) {
                value = Ext.JSON.decode(value);
            }
            return value;
        },
        serialize: function (value, record) {
            if (value && !Ext.isString(value)) {
                value = Ext.JSON.encode(value);
            }
            return value;
        },
        critical: true
    }, {
        name: 'shared',
        type: 'boolean',
        defaultValue: false,
        critical: true
    }],

    isFilter: true,

    proxy: {
        type: 'baseproxy'
    }
});