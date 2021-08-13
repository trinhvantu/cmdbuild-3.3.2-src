Ext.define('CMDBuildUI.view.dms.Preview', {
    extend: 'Ext.Img',
    alias: 'widget.dms-preview',

    config: {
        /**
         * @cfg {String} attachmentUrl
         */
        attachmentUrl: null,

        /**
         * @cfg {String} proxyUrl
         */
        proxyUrl: null,

        /**
         * @cfg {String} attachmentId
         */
        attachmentId: null,

        /**
         * @cfg {String} DMSCategoryType
         */
        DMSCategoryType: null,

        /**
         * @cfg {Numeric} DMSCategoryTypeValue
         */
        DMSCategoryTypeValue: null,

        /**
         * @cfg {String} fileName
         */
        fileName: null,

        /**
         * @cfg {String} fileMimeType
         */
        fileMimeType: null
    },

    maxHeight: 75,
    maxWidth: 75,
    style: {
        cursor: 'pointer'
    },

    // genericSrc: 'data:image/png;base64,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',
    genericSrc: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEsAAABLCAYAAAA4TnrqAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAABv9JREFUeNrsXAlsFVUUnc9aEXFBkELQCFplccGlFhQElEbUQE0hQdBYcQEUBKVUI0GBqIiIBWqwUSNQAyhWLC2m4lYjFFpREzEKKlWJRjZBLQjK6rlyXnr7UuzfgJnvu8lJ598/f97/Z+5979z7Jg0dPnzYcxaeNXAUOLIcWY4sR5Yjy5HlKHBkObIcWY4sR5Yjy1HgyDom1ijWC7xZVFzfKUlAR6ATkMwb9CvwDfAtUB3L+JkZA4JD1n9YY6AXMAi4EugAnAKEgD3AT8A6oARYHitpQSZLCHoMuOgo7wtpnYkhwC/ALCAP+Ov/MmedCiwG3qiDqEOMnh2MLG1tgWeAlSQw4SOrDdPpcuU7CJTJ1AasBrYCB4CmwLlAH0ZWF55/BVAB3A+8mqhknQaUApcq32fAaP74ukxSrxyYBtwGzABaMUULgL7AfcDeREvDmRZRC4CrLaLOYST1Y6o1UtEn518FrFLnZ/F1l0Qi6xZguHo9nz/0b77O4I/eAHwIvAt8SYyjtBD7AegNPKWudRnT985EIWuCOv4KeIDHIhHmAG8xypKscS8EcoH3GHUmyiYCg7kQiLUAXgGe51wXTLIgSIWE7solP3QXj0UKjFHvbQHeBgopRo1dA6xlBBor5ELxsfLJpL/mRKZlgxiIkjuu5bMITCPnb1ARZua084CbGTWdOKn/wfdbMQKnq++0iXPcNHWdbpwHs4IWWR0smSCywWxvj1R+SZ9s4E9Lcy0EenDVNJYDrGBZZM57lFG3nb7mwLwTkZaxkCXpkKJef8C/p5MEsd+tCdu2r5mGLynf9SSwv/ItA1LrSMsKRHjnIJB1FhW7sa382xI4Q034m+u5jpQ39wL3KE2VzJrxES4UYj+SyFnqsyJXVoGwIX4nK2Sl1UF1zZBa3cK1l4E0SgqxhpyvlrM6ENsPPAgMVGkpkbwYhM0FmvmVrK2qU9CAyttj++U3HncFWkdwzXVM4cXKdyPwOdBT+YrZyVijfKNEk4GwFD+StR7YaK1UYjuBT3gs6Tg2wuvuBoZyNd2n0vJ9ilhPrZbXAs8p3yWcx4b6jazvFCmepZPmqmNZzSZFcf08Tv7mhjShiC1kLfpvWmZmDBhPCbNTpeVCEJbtG7LwJaspMo31Vqvjci7vxqZSR50Z4TBrqf51OzYTqNSyBd+lhLXlanVeP7+VO1Lzfcrjk4CH1XsjrDZLBs/tG+EY2zihT1ALRgplxChF2EZeezrnsifiTVYo1sckEe6ZTA1jg9i/MjaOjb3GauUUUp+NYrienPzbKZ/ckJEga08QCmkh5jX1uoDljqdqRLnjVWrMGRSakablSq6Cpcp3Oyf1rkHpZ42mGhdrRiLGWOkqXdClyjeASr1XhGNtppyYonzSwq4EYVlBIGsHi+QNauWaw97Wyar0yWSduJ++s9miGRvFmJNJ+DZ1k+aBsNlAUz+TZZp3vawUuYPyopvVgeij0rIJU7UoirQsYc1Ypnyiz8qPhTiN9+7OdqbIZOXrzDTU3c5ypqWWBAOZlj0ilDCbKBNmKrfIirUgbLCfyTI2hV2DLSpFpNuZz2OTlgOZlgdUWpZZSj0cwg4C2UxzU2pJv20JCHsaaOhnssTe4cpVbmmvcjYC7bTcZCn1IqurEQ5pSzlmpXKLTFngd7LEfiYRdlulgnpMr5apVkUQbVpWccwXlXsYomuS38nSbZUMdiRMz0t2rWd7NRsZ27iijlerZUemZU6EhO0FRlifexyEpfqdLGPLWL9VWiuXbI+1Vz7pIqR7Rx4cMWk5nVVCiwhJE/H7uuqPjQ0KWWLfs63ygvJ1Z82oNz8+4mpZYhXQ5V5NFzaSxcaUQv0RXclBIUtMNl9lW36YV7OJ0ZqRJ8VvSKWlECitZVPASklzQYTRtZ7Ra9o3qUEiy9giTt5fKN9ErqJtlE9S8Dqmb56VxuGa3kFKCSJZYuvYr9K9r3SmZbryySSfxjnuUBTj6E2T5kEly2MqDmdvyrSR2zHCcuI0Rkt1vDfIZBnLZ1quN702pmA0rRzb9GZwVSKQZeaWtKO0ctKiarYVFbf3arqzu73a+waBJkusmjLhIauVU+bVfn4iXJMNE7PBUcbCO2HIMpZLTWbSJomKf0m4WgtRdZdX+7mL3Fi+UCPP37aGonU+Wz9i0na52DvyJE3FUUhqwgJat4ryEVVliUyWmPTIbqIGm8psEGEq/fhSEFNECSIqXdS5NCBvBc5X11gRadunLovH7s7xJE6afAWWaK3PZDfo7njs/gQhsrRJv74boyyrHoEpGyhPgqRF8Ro8aGSJSfdVdo7kCRt5BEn2EtuyO7GLJEnaVYKoffEcOOT+F01iSAdHliPLkeXMkeXIcmQ5shxZjixnjixHliPLkRVk+0eAAQBzHMDs5JHwRwAAAABJRU5ErkJggg==',

    /**
     * 
     * @param {String} newValue 
     * @param {String} oldValue 
     */
    updateAttachmentUrl: function (newValue, oldValue) {
        var me = this;
        if (newValue) {
            Ext.Ajax.request({
                url: newValue + '/preview',
                method: "GET",
                success: function (response, opts) {
                    var responseJson = Ext.decode(response.responseText);
                    if (responseJson.data.hasPreview) {
                        me.setSrc(responseJson.data.dataUrl);
                    } else {
                        me.setSrc(me.getHierarchyIconUrl());
                    }

                    me.on({
                        click: {
                            element: 'el', //bind to the underlying el property on the panel
                            fn: function () {
                                var metatype = me.getFileMimeType(),
                                    fileName = me.getFileName(),
                                    fileUrl = me.getAttachmentUrl() + '/' + fileName,
                                    popupTitle = Ext.String.format(
                                        "{0} - {1}",
                                        CMDBuildUI.locales.Locales.attachments.fileview,
                                        fileName
                                    );
                                
                                function openFile(type) {
                                    var popup = CMDBuildUI.util.Utilities.openPopup(
                                        null,
                                        popupTitle, {
                                            xtype: 'dms-file-view',
                                            fileUrl: fileUrl,
                                            fileType: type,
                                            fileName: fileName,
                                            // close popup fn
                                            closePopup: function() {
                                                popup.close();
                                            }
                                        }
                                    );
                                }
                                if (Ext.String.startsWith(metatype, "image/", true)) {
                                    openFile(CMDBuildUI.view.dms.file.View.types.image);
                                } else if (Ext.String.startsWith(metatype, "text/", true)) {
                                    openFile(CMDBuildUI.view.dms.file.View.types.text);
                                } else if (metatype === "application/pdf") {
                                    openFile(CMDBuildUI.view.dms.file.View.types.pdf);
                                } else {
                                    CMDBuildUI.util.File.download(
                                        fileUrl,
                                        fileName
                                    );
                                }
                            }
                        }
                    });
                }
            });
        }
    },

    updateProxyUrl: function (newValue, oldValue) {
        if (!Ext.isEmpty(newValue)) {

            var attachmentId = this.getAttachmentId();
            if (!Ext.isEmpty(attachmentId)) {
                var attachmentUrl = this.composeAttachmentUrl(newValue, attachmentId);
                this.setAttachmentUrl(attachmentUrl);
            }
        }
    },

    /**
     * 
     * @param {String} value 
     * @param {String} oldValue 
     * 
     * This function sets the attachmentid config only if the vm record (passed by the rowWidget) has a valid id. 
     * Useful when expanding the row and collapsing the parent grouping.
     */
    applyAttachmentId: function (value, oldValue) {
        return value;
        return Ext.isNumeric(value) ? value : null; //Was here for when collapsing the grouping and the passed record was a placeholder having defaul EXTJS id. it doesn't work for alfresco's id's
    },

    updateAttachmentId: function (newValue, oldValue) {
        if (!Ext.isEmpty(newValue)) {

            var proxyUrl = this.getProxyUrl();
            if (!Ext.isEmpty(proxyUrl)) {
                var attachmentUrl = this.composeAttachmentUrl(proxyUrl, newValue);
                this.setAttachmentUrl(attachmentUrl);
            }
        }
    },



    /**
     * this function returns the  image (base64 or the icon path) of the category.
     * If th category has an icon get's it. If not get the associated dmsModel class icon. If the last one is empty gets the defaul image
     */
    getHierarchyIconUrl: function () {
        var DMSCategoryType = this.getDMSCategoryType();

        var categoryValues = DMSCategoryType.values();

        //for the uncategorized attachments
        if (!this.getDMSCategoryTypeValue()) {
            return this.genericSrc;
        }

        var r = categoryValues.getById(this.getDMSCategoryTypeValue());

        var icon_type = r.get('icon_type');

        switch (icon_type) {
            case CMDBuildUI.model.dms.DMSCategory.icontypes.none:
                var dmsClassName = r.get('modelClass');
                var dmsClass = CMDBuildUI.util.helper.ModelHelper.getDMSModelFromName(dmsClassName);

                var iconPath = dmsClass.get('_iconPath');
                return iconPath ? iconPath : this.genericSrc;

            case CMDBuildUI.model.dms.DMSCategory.icontypes.image:
                return r.get('icon_image');
        }
    },

    privates: {
        composeAttachmentUrl: function (proxyUrl, attachmentId) {
            return CMDBuildUI.util.Config.baseUrl + proxyUrl + '/' + attachmentId;
        }
    }
});