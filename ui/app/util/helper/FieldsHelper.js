Ext.define('CMDBuildUI.util.helper.FieldsHelper', {
    singleton: true,

    /**
     * Generate fielcontainer with slider and numbierfield
     * 
     * @param {Object} config
     * @param {Number} config.multiplier the maxValue of slider, the input 
     * minValue will be set equal to minValue * multiplier
     * defaultValue = 1
     * 
     * @param {Number} config.minValue the maxValue of slider, the input 
     * minValue will be set  equal to minValue * multiplier
     * defaultValue = 0
     * 
     * @param {Number} config.maxValue the maxValue of slider, the input 
     * maxValue will be set equal to maxValue * multiplier
     * defaultValue = 100
     * 
     * @param {Boolean} config.showPercentage if true show percentage "%" symbol
     * in slider qtip
     * defaultValue = false
     * 
     * @param {Number} config.sliderDecimalPrecision use 0 if showPercentage 
     * otherwise use any number, value is used to format the slider qtip text
     * defaultValue = 0
     * 
     * @param {Number} config.inputDecimalPrecision use 0 if showPercentage 
     * otherwise use any number, value is used to format the input field value
     * defaultValue = 0
     * 
     * @param {String} config.name name used on input field
     * defaultValue = undefined
     * 
     * @param {String} config.columnWidth use this is the onwner of 
     * fieldcontainer is layout type "column"
     * defaultValue = undefined
     * 
     * @param {String|Number} config.padding the padding of field conainer
     * defaultValue = 0
     * 
     * @param {String} config.fieldLabel the label of fieldcontainer
     * defaultValue = undefined
     * 
     * @param {Object} config.bind the bind of slider
     * defaultValue = undefined
     * 
     * @param {Object} config.localized the locale object key
     * @param {String} config.loacalized.fieldLabel the localized key as string 
     * of fieldLabel
     * defaultValue = {}
     * 
     * @return {Ext.field.FieldContainer} 
     * 
     */
    getSliderWithInputField: function (config) {
        config = Ext.merge({
            multiplier: 1,
            minValue: 0,
            maxValue: 100,
            showPercentage: false,
            sliderDecimalPrecision: 0,
            inputDecimalPrecision: 0,
            name: undefined,
            columnWidth: undefined,
            padding: 0,
            fieldLabel: undefined,
            bind: {},
            localized: {}
        }, config);

        var fieldcontainer = {
            columnWidth: config.columnWidth,
            xtype: 'fieldcontainer',
            padding: config.padding,
            fieldLabel: config.fieldLabel,
            localized: config.localized,
            layout: 'column',
            items: [{
                xtype: 'fieldcontainer',
                layout: 'hbox',
                columnWidth: 1,
                bind: {
                    hidden: '{actions.view}'
                },
                items: [{
                    flex: 1,
                    xtype: 'slider',
                    increment: config.increment,
                    minValue: config.minValue,
                    maxValue: config.maxValue,
                    decimalPrecision: config.sliderDecimalPrecision,
                    padding: '0 15 0 0',
                    name: config.name,
                    bind: Ext.merge({
                        hidden: '{actions.view}'
                    }, config.bind),
                    tipText: function (thumb) {
                        if (config.showPercentage) {
                            return Ext.util.Format.percent(thumb.value);
                        } else {
                            return parseFloat(thumb.value * config.multiplier).toFixed(config.sliderDecimalPrecision);
                        }
                    },
                    listeners: {
                        change: function (slider, newValue) {
                            slider.up('fieldcontainer').down('numberfield').setValue(String(Ext.util.Format.number(newValue * config.multiplier, config.inputDecimalPrecision)));
                        }
                    }
                }, {
                    xtype: 'numberfield',
                    width: 50,
                    step: config.increment * config.multiplier,
                    minValue: config.minValue * config.multiplier,
                    maxValue: config.maxValue * config.multiplier,
                    decimalPrecision: config.inputDecimalPrecision,
                    // Remove spinner buttons, and arrow key and mouse wheel listeners
                    hideTrigger: true,
                    value: 0,
                    keyNavEnabled: false,
                    mouseWheelEnabled: false,
                    selectOnFocus: true,
                    fieldStyle: 'text-align: center;padding: 5px 5px 4px',
                    listeners: {
                        blur: function (numberfield, event, eOpts) {
                            var slider = numberfield.up('fieldcontainer').down('slider');
                            numberfield.validate();
                            numberfield.lookupViewModel().set(slider.getConfig().bind.value.stub.path, parseFloat(Number(numberfield.getValue()) / config.multiplier).toFixed(config.sliderDecimalPrecision));
                        }
                    }
                }]
            }, {
                xtype: 'displayfield',
                columnWidth: 1,
                bind: Ext.merge(config.bind, {
                    hidden: '{!actions.view}'
                }),
                hidden: true,
                renderer: function (value) {
                    if (config.showPercentage) {
                        return Ext.util.Format.percent(value);
                    } else {
                        return parseFloat(value * config.multiplier).toFixed(config.sliderDecimalPrecision);
                    }
                }
            }]
        };
        return fieldcontainer;

    },

    /**
     * Generate fielcontainer with slider and numbierfield
     * 
     * @param {Object} config
     * 
     * @param {String} config.name name used on input field
     * defaultValue = undefined
     * 
     * @param {String} config.columnWidth use this is the onwner of 
     * fieldcontainer is layout type "column"
     * defaultValue = undefined
     * 
     * @param {String|Number} config.padding the padding of field conainer
     * defaultValue = 0
     * 
     * @param {String} config.fieldLabel the label of fieldcontainer
     * defaultValue = undefined
     * 
     * @param {Object} config.bind the bind of slider
     * defaultValue = undefined
     * 
     * @param {Object} config.alt img alt tag attribute
     * [W] For WAI-ARIA compliance, IMG elements SHOULD have an alt attribute.
     * defaultValue = '-'
     * 
     * @param {Object} config.localized the localized object used in 
     * fieldconatiner and image
     * @param {String} config.localized.fieldLabel the localized key as string 
     * of fieldLabel
     * @param {String} config.localized.alt the localized key as string of alt
     * defaultValue = {}
     * 
     * @return {Ext.field.FieldContainer}
     */
    getColorpickerField: function (config) {
        config = Ext.applyIf(config, {
            itemId: undefined,
            name: undefined,
            columnWidth: undefined,
            padding: 0,
            fieldLabel: undefined,
            bind: {},
            localized: {},
            alt: '-'
        });

        var fieldcontainer = {

            columnWidth: config.columnWidth,
            xtype: 'fieldcontainer',
            fieldLabel: config.fieldLabel,
            localized: config.localized,
            layout: 'column',
            padding: config.padding,
            items: [{
                itemId: config.itemId,
                name: config.name,
                columnWidth: 1,
                xtype: 'cmdbuild-colorpicker',
                bind: config.bind,
                triggers: {
                    clear: {
                        cls: Ext.baseCSSPrefix + 'form-clear-trigger',
                        handler: function (input) {
                            input.lookupViewModel().set(input.getConfig().bind.value.stub.path, null);
                            input.up('fieldcontainer').down('image').setStyle('color', 'initial');
                            input.reset();
                        }
                    }
                },
                listeners: {
                    change: function (input, newValue) {
                        input.up('fieldcontainer').down('image').setStyle('color', newValue);
                    }
                }
            }, {
                xtype: 'image',
                autoEl: 'div',
                alt: config.alt || config.fieldLabel,
                localized: config.localized,
                width: 32,
                cls: 'fa-2x x-fa fa-square',
                style: {
                    lineHeight: '32px'
                }
            }]
        };
        return fieldcontainer;
    },

    /**
     * 
     * @param {Boolean} value 
     * @return {String}
     */
    renderBooleanField: function (value) {
        if (Ext.isEmpty(value)) {
            return Ext.String.format("<span class=\"{0}\"><span class=\"x-form-checkbox-default\"></span></span>", '');
        }
        var klass = '';
        if (value) {
            klass = 'x-form-cb-checked';
        }
        return Ext.String.format("<span class=\"{0}\"><span class=\"x-form-checkbox-default\"></span></span>", klass);
    },

    /**
     * 
     * @param {Boolean} value 
     * @return {String}
     */
    renderThreeStateBooleanField: function (value) {
        var css = '';
        if (value === false || value === "false") {
            css = Ext.baseCSSPrefix + 'form-tscb-unchecked';
        } else if (value === true || value === "true") {
            css = Ext.baseCSSPrefix + 'form-tscb-checked';
        }
        return Ext.String.format("<span class=\"x-form-tscb-readonly {0} x-item-disabled x-form-item-default\"><span class=\"x-form-checkbox-default x-form-tscb-default\"></span></span>", css);
    },

    /**
     * 
     * @param {Numeric} value 
     * @param {Object} config 
     * @param {Object} config.showThousandsSeparator
     * @param {Object} config.unitOfMeasure
     * @param {Object} config.unitOfMeasureLocation
     * @return {String}
     */
    renderIntegerField: function (value, config) {
        if (Ext.isEmpty(value)) {
            return value;
        }
        config = config || {};

        // show thousands separator
        if (config.showThousandsSeparator) {
            value = this.formatNumber(value, null, config.showThousandsSeparator);
        }

        // show unit of measure
        if (!Ext.isEmpty(config.unitOfMeasure)) {
            var format;
            if (config.unitOfMeasureLocation === CMDBuildUI.model.Attribute.unitOfMeasureLocations.before) {
                format = "{1} {0}";
            } else {
                format = "{0} {1}";
            }
            value = Ext.String.format(format, value, config.unitOfMeasure);
        }

        return value;
    },


    /**
     * 
     * @param {Numeric} value 
     * @param {Object} config 
     * @param {Object} config.scale
     * @param {Object} config.showThousandsSeparator
     * @param {Object} config.unitOfMeasure
     * @param {Object} config.unitOfMeasureLocation
     * @return {String}
     */
    renderDecimalField: function (value, config) {
        if (Ext.isEmpty(value)) {
            return value;
        }
        config = config || {};

        // show thousands separator
        value = this.formatNumber(value, config.scale, config.showThousandsSeparator);

        // show unit of measure
        if (!Ext.isEmpty(config.unitOfMeasure)) {
            var format;
            if (config.unitOfMeasureLocation === CMDBuildUI.model.Attribute.unitOfMeasureLocations.before) {
                format = "{1} {0}";
            } else {
                format = "{0} {1}";
            }
            value = Ext.String.format(format, value, config.unitOfMeasure);
        }

        return value;
    },


    /**
     * 
     * @param {Numeric} value 
     * @param {Object} config 
     * @param {Object} config.visibleDecimals
     * @param {Object} config.showThousandsSeparator
     * @param {Object} config.unitOfMeasure
     * @param {Object} config.unitOfMeasureLocation
     * @return {String}
     */
    renderDoubleField: function (value, config) {
        if (Ext.isEmpty(value)) {
            return value;
        }
        config = config || {};

        // show thousands separator
        value = this.formatNumber(value, config.visibleDecimals, config.showThousandsSeparator);

        // show unit of measure
        if (!Ext.isEmpty(config.unitOfMeasure)) {
            var format;
            if (config.unitOfMeasureLocation === CMDBuildUI.model.Attribute.unitOfMeasureLocations.before) {
                format = "{1} {0}";
            } else {
                format = "{0} {1}";
            }
            value = Ext.String.format(format, value, config.unitOfMeasure);
        }

        return value;
    },

    /**
     * 
     * @param {Date} value 
     * @return {String}
     */
    renderDateField: function (value) {
        if (Ext.isEmpty(value)) {
            return value;
        }
        if (typeof value === "string") {
            value = Ext.Date.parse(value, "Y-m-d");
        }
        return Ext.util.Format.date(value, CMDBuildUI.util.helper.UserPreferences.getDateFormat());
    },

    /**
     * 
     * @param {Date} value 
     * @param {Object} config
     * @param {Boolean} config.hideSeconds
     * @return {String}
     */
    renderTimeField: function (value, config) {
        if (Ext.isEmpty(value)) {
            return value;
        }
        config = config || {};
        var format;
        // convert to date
        if (typeof value === "string") {
            value = Ext.Date.parse(value, "H:i:s") || Ext.Date.parse(value, "H:i");
        }
        // get format
        if (config.hideSeconds) {
            format = CMDBuildUI.util.helper.UserPreferences.getTimeWithoutSecondsFormat();
        } else {
            format = CMDBuildUI.util.helper.UserPreferences.getTimeWithSecondsFormat();
        }
        return Ext.util.Format.date(value, format);
    },

    /**
     * 
     * @param {Date} value 
     * @param {Object} config
     * @param {Boolean} config.hideSeconds
     * @return {String}
     */
    renderTimestampField: function (value, config) {
        if (Ext.isEmpty(value)) {
            return value;
        }
        config = config || {};
        var format;
        if (config.hideSeconds) {
            format = CMDBuildUI.util.helper.UserPreferences.getTimestampWithoutSecondsFormat();
        } else {
            format = CMDBuildUI.util.helper.UserPreferences.getTimestampWithSecondsFormat();
        }
        return Ext.util.Format.date(value, format);
    },

    /**
     * 
     * @param {*} value 
     * @param {*} config 
     * @param {} config.lookupType
     * @param {} config.lookupIdField
     * @param {} config.record
     * @param {} config.fieldName
     */
    renderLookupField: function (value, config) {
        var output = "";
        if (value) {
            var lookupvalue;
            if (config.lookupIdField === 'code') {
                lookupvalue = CMDBuildUI.model.lookups.Lookup.getLookupValueByCode(config.lookupType, value);
            } else {
                lookupvalue = CMDBuildUI.model.lookups.Lookup.getLookupValueById(config.lookupType, value);
            }
            if (lookupvalue) {
                output = lookupvalue.getFormattedDescription();
            }
        }

        // if output is empty get description from record data
        if (value && !output && config.record) {
            var translation = config.record.get("_" + config.fieldName + "_description_translation");
            var description = config.record.get("_" + config.fieldName + "_description");
            output = translation ? translation : description;
            output = output || '';
        }
        return output;
    },

    /**
     * 
     * @param {Number|String} value 
     * @param {Object} config
     * @param {String} config.fieldName
     * @param {String} config.isHtml
     * @param {String} config.stripTags
     * @param {String} config.targetType
     * @param {String} config.targetTypeName
     * @param {Ext.data.Model} config.record
     */
    renderReferenceField: function(value, config) {
        var description = config.record.get("_" + config.fieldName + "_description");

        function renderText(value) {

            return CMDBuildUI.util.helper.FieldsHelper.renderTextField(value, {
                html: config.isHtml,
                record: config.record,
                fieldname: config.fieldName
            });
        }

        function renderStrippedText(value) {
            if (!config.isHtml) {
                value = CMDBuildUI.util.helper.FieldsHelper.renderTextField(value);
            }
            return Ext.util.Format.stripTags(value);
        }

        if (value && description !== undefined) {
            return config.stripTags ? renderStrippedText(description) : renderText(description);
        } else if (value && description == undefined) {
            CMDBuildUI.util.helper.ModelHelper.getModel(config.targetType, config.targetTypeName).then(function (m) {
                m.load(value, {
                    callback: function (r) {
                        config.record.set("_" + config.fieldName + "_description", r.get("Description"));
                    }
                });
            });
        }
    },

    /**
     * 
     * @param {String} value 
     * @param {Object} config
     * @param {Boolean} config.html
     * @param {String} config.fieldname
     * @param {String} config.record
     */
    renderTextField: function(value, config) {
        config = config || {};
        if (config.html) {
            if (config.record) {
                value = config.record.get(Ext.String.format('_{1}_html', config.fieldname)) || value;
            }
        } else {
            value = Ext.String.htmlEncode(value);
            value = Ext.util.Format.nl2br(value);
        }
        return value;
    },

    /**
     * Return base configuration for HTML editor
     * @param {Object} config 
     */
    getHTMLEditor: function (config) {
        return Ext.applyIf(config || {}, {
            xtype: 'cmdbuildhtmleditor',
            enableAlignments: true,
            enableColors: true,
            enableFont: false,
            enableFontSize: false,
            enableFormat: true,
            enableLinks: true,
            enableLists: true,
            enableSourceEdit: true
        });
    },

    privates: {
        /**
         * 
         * @param {Number} number 
         * @param {Number} decimalsToShow 
         * @param {Boolean} showThousandsSeparator 
         */
        formatNumber: function (number, decimalsToShow, showThousandsSeparator) {
            if (typeof number !== "number" && isNaN(number)) {
                return number;
            } else if (typeof number !== "number") {
                number = parseFloat(number);
            }
            var strnumber = number.toString();
            if (!Ext.isEmpty(decimalsToShow)) {
                strnumber = number.toFixed(decimalsToShow);
            }
            if (CMDBuildUI.util.helper.UserPreferences.getDecimalsSeparator() !== '.') {
                strnumber = strnumber.replace(".", CMDBuildUI.util.helper.UserPreferences.getDecimalsSeparator());
            }
            if (showThousandsSeparator) {
                strnumber = strnumber.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1' + CMDBuildUI.util.helper.UserPreferences.getThousandsSeparator());
            }
            return strnumber;
        },

        /**
         * 
         * @param {Date} date 
         */
        removeTimeStamp: function (date) {
            var dateStringUTC = date.toUTCString();
            return dateStringUTC.split(' ').slice(0, 5).join(' ');
        }
    }

});