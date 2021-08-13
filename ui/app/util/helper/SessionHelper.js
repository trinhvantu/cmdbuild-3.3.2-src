Ext.define('CMDBuildUI.util.helper.SessionHelper', {
    singleton: true,

    authorization: 'CMDBuild-Authorization',
    localization: 'CMDBuild-Localization',

    logging: false,

    /**
     * @param {String} token
     */
    initSession: function (token) {
        if (token) {
            CMDBuildUI.util.Ajax.sessionexpired = false;
            this.initWebSoket();
        }
    },

    /**
     * @return {String}
     */
    getLanguage: function () {
        return Ext.util.Cookies.get(CMDBuildUI.util.helper.SessionHelper.localization);
    },

    /**
     * @param {String} lang
     */
    setLanguage: function (lang) {
        if (lang) {
            var oneyear = new Date();
            oneyear.setFullYear(oneyear.getFullYear() + 1);
            Ext.util.Cookies.set(CMDBuildUI.util.helper.SessionHelper.localization, lang, oneyear, this.getCookiesPath());
            this.loadLocale(lang);
        } else {
            CMDBuildUI.util.helper.SessionHelper.clearLanguage();
        }
    },

    /**
     * 
     */
    clearLanguage: function () {
        Ext.util.Cookies.clear(CMDBuildUI.util.helper.SessionHelper.localization, this.getCookiesPath());
    },

    /**
     * Check the validity of the token.
     * 
     * @return {Ext.promise.Promise}
     */
    checkSessionValidity: function () {
        var me = this;
        var deferred = new Ext.Deferred();

        function failure(response, opts) {
            var err = "Session token expired.";
            CMDBuildUI.util.Logger.log(err, CMDBuildUI.util.Logger.levels.debug, 401);
            Ext.asap(function () {
                deferred.reject(err);
                me._checksession = false;
            });
        }

        function success(response, opts) {
            var responseJson = JSON.parse(response.responseText);
            var session = Ext.create("CMDBuildUI.model.users.Session", responseJson.data);
            if (session.get("exists")) {
                CMDBuildUI.util.helper.SessionHelper.setSessionIntoViewport(session);
                if (session.get("role") && (Ext.isEmpty(session.get("availableTenants")) || !Ext.isEmpty(session.get("activeTenants")) || session.get("ignoreTenants"))) {
                    CMDBuildUI.util.Logger.log(
                        Ext.String.format('SessionHelper checkSessionValidity have id?: {0}', session.getId() ? true : false),
                        CMDBuildUI.util.Logger.levels.debug);

                    me.initWebSoket();
                    CMDBuildUI.util.Logger.log('SessionHelper checkSessionValidity resolve promise', CMDBuildUI.util.Logger.levels.debug);

                    Ext.asap(function () {
                        deferred.resolve();
                        CMDBuildUI.util.Logger.log('SessionHelper checkSessionValidity promise resolved', CMDBuildUI.util.Logger.levels.debug);
                    });
                } else {
                    var err = "Group or tenant not selected.";
                    CMDBuildUI.util.Logger.log(err, CMDBuildUI.util.Logger.levels.debug, 401);
                    Ext.asap(function () {
                        deferred.reject(err);
                    });
                }
            } else {
                failure();
            }
            me._checksession = false;
        }

        if (!this._checksession) {
            this._checksession = true;
            // get saved token
            Ext.Ajax.request({
                url: CMDBuildUI.util.Config.baseUrl + CMDBuildUI.util.api.Common.getCurrentSessionUrl(),
                hideErrorNotification: true,
                method: 'GET',
                params: {
                    ext: true,
                    if_exists: true
                }
            }).then(success, failure);
        }

        return deferred.promise;
    },

    /**
     * Set session object into Viewport
     * 
     * @param {CMDBuildUI.model.users.Session} session
     */
    setSessionIntoViewport: function (session) {
        this.getViewportVM().set("theSession", session);
    },

    /**
     * Get current session.
     * 
     * @return {CMDBuildUI.model.users.Session} Current session
     */
    getCurrentSession: function () {
        return this.getViewportVM().get("theSession");
    },

    /**
     * Get current session.
     * 
     * @param {String} instancename
     */
    updateInstanceName: function (instancename) {
        this.getViewportVM().set("instancename", instancename);
        var title = Ext.getHead().child("title");
        if (title) {
            var text = CMDBuildUI.view.main.header.Logo.applicationname;
            if (instancename) {
                var stripedinstancename = Ext.util.Format.stripTags(instancename);
                text += " - " + stripedinstancename;
            }
            title.setText(text);
        }
    },

    /**
     * Set changepasswordHidden viewModel var
     * @param {Boolean} value 
     */
    updateCanChangePasswordVisibility: function(value){
        this.getViewportVM().set("changepasswordHidden", value);
    },

    /**
     * Get current session.
     * 
     * @param {String} companylogoid
     */
    updateCompanyLogoId: function (companylogoid) {
        this.getViewportVM().set("companylogoid", companylogoid);
    },

    /**
     * Implementation of window.sessionStorage.setItem()
     * 
     * @param {String} key The key.
     * @param {*} value The new associated value for `key`.
     * 
     */
    setItem: function (key, value) {
        if (!this.localSessionStorage.id) {
            this.localSessionStorage = new Ext.util.LocalStorage({
                id: this.LOCAL_STORAGE_ID,
                session: true
            });
        }
        this.localSessionStorage.setItem(key, Ext.JSON.encode(value));
    },

    /**
     * Implementation of window.sessionStorage.getItem()
     * 
     * @param {String|Number} key The key.
     * @param {*} [defaultValue=null] The default associated value for `key`.
     * @returns {*}
     */
    getItem: function (key, defaultValue) {
        if (this.localSessionStorage.id) {
            return Ext.JSON.decode(this.localSessionStorage.getItem(key)) || defaultValue;
        }
        return defaultValue;
    },

    /**
     * Implementation of window.sessionStorage.removeItem()
     * 
     * @param {String|Number} key The key.
     */
    removeItem: function (key) {
        if (this.localSessionStorage.id) {
            this.localSessionStorage.removeItem(key);
        }
    },

    /**
     * Load localization file.
     * @param {String} lang
     */
    loadLocale: function (lang) {
        if (!lang) {
            lang = this.getLanguage();
        }
        if (lang && lang !== "en") {
            Ext.require([
                Ext.String.format("CMDBuildUI.locales.{0}.LocalesAdministration", lang),
                Ext.String.format("CMDBuildUI.locales.{0}.Locales", lang)
            ], function () {
                //HACK: here the languages are loaded
            });

            Ext.Loader.loadScript({
                url: Ext.String.format("app/locales/_ext/locale-{0}.js", lang)
            });
        }
    },

    /**
     * @param {String} url
     */
    setStartingUrl: function (url) {
        this._startingurl = url;
    },

    /**
     * @return {String} 
     */
    getStartingUrl: function () {
        return this._startingurl;
    },

    /**
     * Sets current url as starting url.
     */
    updateStartingUrlWithCurrentUrl: function () {
        var currentUrl = Ext.History.getToken();
        if (currentUrl.length > 1 && currentUrl !== 'patches') {
            CMDBuildUI.util.helper.SessionHelper.setStartingUrl(currentUrl);
        }
    },

    /**
     * Clear starting url.
     */
    clearStartingUrl: function () {
        CMDBuildUI.util.helper.SessionHelper.setStartingUrl(null);
    },

    /**
     * 
     */
    getActiveTenants: function () {
        var session = this.getCurrentSession();
        var activetenants = session.get("activeTenants");
        var availabletenants = session.get('availableTenantsExtendedData');
        var ignoretenants = session.get("ignoreTenants");

        function activeTenantsFilter(value) {
            return ignoretenants || Ext.Array.contains(activetenants, value.code);
        }
        return availabletenants.filter(activeTenantsFilter);
    },

    /**
     * 
     * @param {String[]} tenants 
     */
    updateActiveTenants: function (tenants) {
        this.getCurrentSession().set("activeTenants", tenants);
    },

    privates: {
        /**
         * An Object contains new Ext.util.LocalStorage
         * @type {Ext.util.LocalStorage}
         */
        localSessionStorage: {},
        /**
         * The id param used in new Ext.util.LocalStorage
         * @type {String}
         */
        LOCAL_STORAGE_ID: 'CMDBUILD-SESSION',

        /**
         * @property {String} _startingurl
         * The starting url
         */
        _startingurl: null,

        /**
         * @property {WebSocket} _socket
         * The web socket used by the application.
         */
        _socket: null,

        /**
         * Get Viewport ViewModel
         * 
         * @return {CMDBuildUI.view.main.MainModel}
         */
        getViewportVM: function () {
            var viewports = Ext.ComponentQuery.query('viewport');
            if (viewports.length) {
                return viewports[0].getViewModel();
            }
        },

        /**
         * 
         * @param {String} 
         */
        initWebSoket: function () {
            try {
                if (!this._socket) {
                    CMDBuildUI.util.Logger.log("socket is not initialized", CMDBuildUI.util.Logger.levels.debug);
                    var socket = this._socket = new WebSocket(CMDBuildUI.util.Config.socketUrl);
                    CMDBuildUI.util.Logger.log("socket is now initialized", CMDBuildUI.util.Logger.levels.debug);
                    socket.onmessage = function (e) {
                        var data = Ext.JSON.decode(e.data || '');
                        if (data && data.message && data._event == 'alert') {
                            CMDBuildUI.util.Notifier.showInfoMessage(data.message);
                        }
                    };
                    CMDBuildUI.util.Logger.log("socket onmessage initialized", CMDBuildUI.util.Logger.levels.debug);
                    socket.onopen = function (e) {
                        if (socket) {
                            socket.send(Ext.JSON.encode({
                                _action: 'socket.session.login',
                                _id: CMDBuildUI.util.Utilities.generateUUID()
                            }));
                        }
                    };
                    CMDBuildUI.util.Logger.log("socket onopen initialized", CMDBuildUI.util.Logger.levels.debug);
                } else {
                    CMDBuildUI.util.Logger.log("socket alredy opened", CMDBuildUI.util.Logger.levels.debug);
                }
            } catch (e) {
                CMDBuildUI.util.Logger.log(
                    "Error on creating socket.",
                    CMDBuildUI.util.Logger.levels.error,
                    null,
                    e
                );
            }
        },

        closeWebSocket: function () {
            if (this._socket) {
                this._socket.close();
                delete this._socket;
            }
        },

        /**
         * Get the path to use for cookies
         */
        getCookiesPath: function () {
            var path = window.location.pathname;
            return path.replace(/\/ui(_dev)?/, "");
        }
    }
});