Ext.define('CMDBuildUI.util.File', {
    singleton: true,

    /**
     * @param {String} method
     * @param {FormData} formData
     * @param {DOM} inputFile
     * @param {String} url
     * @param {Function|Object} callback
     * @param {Function} callback.success
     * @param {Function} callback.failure
     * @param {Function} callback.callback
     * @param {Object} callback.scope
     * @param {Object} params
     * 
     */
    upload: function (method, formData, inputFile, url, callback, params) {
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.withCredentials = true;

        // TODO: show progress bar
        // Uploading progress handler
        // xmlhttp.upload.onprogress = function (e) {
        //     if (e.lengthComputable) {
        //         var percentComplete = (e.loaded / e.total) * 100;
        //         Ext.Viewport.cmdbMask(percentComplete.toFixed(0) + '%');
        //     }
        // };

        // Response handler
        xmlhttp.onreadystatechange = function (e) {
            if (this.readyState === 4) {
                if (Ext.Array.indexOf([200, 201, 204], parseInt(this.status, 10)) !== -1) {
                    if (Ext.isFunction(callback)) {
                        Ext.callback(callback, null, [true, this.responseText, e]);
                    } else if (Ext.isObject(callback)) {
                        if (callback.success) {
                            Ext.callback(callback.success, callback.scope, [this.responseText, e]);
                        }
                        if (callback.callback) {
                            Ext.callback(callback.callback, callback.scope, [true, this.responseText, e]);
                        }
                    }
                } else {
                    if (Ext.isFunction(callback)) {
                        Ext.callback(callback, null, [false, this.responseText, e]);
                    } else if (Ext.isObject(callback)) {
                        if (callback.failure) {
                            Ext.callback(callback.failure, callback.scope, [this.responseText, e]);
                        }
                        if (callback.callback) {
                            Ext.callback(callback.callback, callback.scope, [false, this.responseText, e]);
                        }
                    }
                }
            }
        };

        // Error handler
        xmlhttp.upload.onerror = function () {
            if (Ext.isFunction(callback)) {
                Ext.callback(callback, null, [false, this.responseText]);
            } else if (Ext.isObject(callback)) {
                if (callback.failure) {
                    Ext.callback(callback.failure, callback.scope, [this.responseText]);
                }
                if (callback.callback) {
                    Ext.callback(callback.callback, callback.scope, [false, this.responseText]);
                }
            }
        };

        // update formData
        formData.append("file", inputFile);

        if (!Ext.Object.isEmpty(params)) {
            url += "?" + Ext.Object.toQueryString(params);
        }

        // open form with file using XMLHttpRequest POST request
        xmlhttp.open(method, url);

        // set headers
        xmlhttp.setRequestHeader("CMDBuild-ActionId", CMDBuildUI.util.Ajax.getActionId());
        xmlhttp.setRequestHeader("CMDBuild-RequestId", CMDBuildUI.util.Utilities.generateUUID());

        // finally send
        xmlhttp.send(formData);
    },

    /**
     * 
     * @param {String} url 
     * @param {String} [extension] extension || filename
     * @param {Boolean} [hideLoader] 
     * @param {Object} params Request parameters
     * @return {Ext.Deferred} a boolean field
     */
    download: function (url, extension, hideLoader, params) {
        var deferred = new Ext.Deferred();
        var me = this,
            filename;
        if (!hideLoader) {
            me.showLoader(true);
        }

        if (extension) {
            var isFullname = /\.[0-9a-z]+$/i.exec(extension);
            if (isFullname && isFullname.length) {
                filename = extension;
                extension = isFullname[0].replace('.', '');
            }
        }

        Ext.Ajax.request({
            url: url,
            method: 'GET',
            binary: true,
            params: params,
            failure: function (error) {
                me.showLoader(false);
                deferred.resolve(false);
            },
            success: function (response) {
                var _filename;
                var requestId = response.request.headers['CMDBuild-RequestId'] || CMDBuildUI.util.Utilities.generateUUID();
                try {
                    // normally this should work
                    var contentDisposition = response.request.xhr.getResponseHeader('Content-Disposition');
                    _filename = contentDisposition.match(/(?:"[^"]*"|^[^"]*$)/)[0].replace(/"/g, "");
                } catch (error) {
                    // in case of CORS error
                    var _extension = extension || /[^/]+$/.exec(response.request.xhr.getResponseHeader('Content-Type'))[0];
                    _filename = filename || Ext.String.format('{0}.{1}', requestId, _extension);
                    CMDBuildUI.util.Logger.log("Unable to read Content-Disposition header. This may depend by CORS. Filename will be generated.", CMDBuildUI.util.Logger.levels.info);
                }

                var blob = new Blob([response.responseBytes], { type: response.request.xhr.getResponseHeader('Content-Type') });

                if (typeof window.navigator.msSaveBlob !== 'undefined') {
                    // IE workaround for "HTML7007: One or more blob URLs were revoked by closing the blob for which they were created. These URLs will no longer resolve as the data backing the URL has been freed."
                    window.navigator.msSaveBlob(blob, _filename);
                    if (!hideLoader) {
                        me.showLoader(false);
                    }
                    deferred.resolve(true);
                } else {
                    var URL = window.URL || window.webkitURL;
                    var downloadUrl = URL.createObjectURL(blob);

                    if (_filename) {
                        // use HTML5 a[download] attribute to specify filename
                        var a = document.createElement("a");
                        // safari doesn't support this yet
                        if (typeof a.download === 'undefined') {
                            window.location = downloadUrl;
                        } else {
                            a.href = downloadUrl;
                            a.download = _filename;
                            document.body.appendChild(a);
                            a.click();
                            // remove the link from the DOM
                            a.parentElement.removeChild(a);
                        }
                    } else {
                        window.location = downloadUrl;
                    }

                    setTimeout(function () {
                        URL.revokeObjectURL(downloadUrl); // cleanup
                        if (!hideLoader) {
                            me.showLoader(false);
                        }
                        deferred.resolve(true);
                    }, 100);
                }
            }
        });
        return deferred.promise;
    },
    /**
     * 
     * @param {Boolean} [show=false] 
     */
    showLoader: function (show) {
        CMDBuildUI.util.Utilities.showLoader(show);
    },

    /**
     * 
     * @param {String} method 
     * @param {String} url 
     * @param {File} file 
     * @param {Object} metadata 
     * @param {Object} config 
     * @param {String} config.filePartName File part name
     * @param {String} config.metadataPartName Metadata part name
     * @param {Object} config.extraParams Params sent in request as query string
     * @return {Ext.promise.Promise}
     */
    uploadFileWithMetadata: function(method, url, file, metadata, config) {
        var deferred = new Ext.Deferred(),
            xmlhttp = new XMLHttpRequest(),
            formData = new FormData();

        // use cookie authentication
        xmlhttp.withCredentials = true;
        
        config = Ext.applyIf(config || {}, {
            filePartName: 'file',
            metadataPartName: 'attachment'
        });

        // Response handler
        xmlhttp.onreadystatechange = function (e) {
            if (this.readyState === 4) {
                if (Ext.Array.indexOf([200, 201, 204], parseInt(this.status, 10)) !== -1) {
                    deferred.resolve(JSON.parse(this.responseText).data);
                } else {
                    deferred.reject(JSON.parse(this.responseText));
                }
            }
        };

        // Error handler
        xmlhttp.upload.onerror = function () {
            deferred.reject(JSON.parse(this.responseText));
        };

        // append file part
        if (file) {
            formData.append(config.filePartName, file);
        }

        // append metadata part
        if (!Ext.isEmpty(metadata)) {
            formData.append(config.metadataPartName, new Blob([Ext.encode(metadata)], {
                type: "application/json"
            }));
        }

        // add extra params
        if (!Ext.Object.isEmpty(config.extraParams)) {
            url += "?" + Ext.Object.toQueryString(config.extraParams);
        }

        // open form with file using XMLHttpRequest POST request
        xmlhttp.open(method, url, true);

        // set headers
        xmlhttp.setRequestHeader("CMDBuild-ActionId", CMDBuildUI.util.Ajax.getActionId());
        xmlhttp.setRequestHeader("CMDBuild-RequestId", CMDBuildUI.util.Utilities.generateUUID());

        // finally send
        xmlhttp.send(formData);

        return deferred.promise;
    }
});
