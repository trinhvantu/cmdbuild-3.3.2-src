Ext.define('CMDBuildUI.view.main.header.HeaderController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.main-header-header',

    control: {
        '#cmdbuildLogo': {
            afterrender: 'onImageAfterRender'
        },
        '#globalsearch': {
            click: 'onGlobalSearchClick'
        },
        '#administration': {
            click: 'onAdministrationClick'
        },
        '#administrationbtn': {
            afterrender: 'onLinkBtnClickAfterRender',
            click: 'onHrefBtnClick'
        },
        '#management': {
            click: 'onManagementClick'
        },
        '#managementbtn': {
            afterrender: 'onLinkBtnClickAfterRender',
            click: 'onHrefBtnClick'
        },
        '#logout': {
            click: 'onLogoutClick'
        },
        '#logoutbtn': {
            click: 'onLogoutClick'
        },
        '#schedulerbtn': {
            click: 'onSchedulerBtnClick'
        },
        '#companylogocontainer': {
            afterrender: 'onCompanyLogoContainerAfterRender'
        }
    },

    onImageAfterRender: function (image, e) {
        var img_tag = document.getElementById(image.id);
        // modify cursor style
        img_tag.style.cursor = 'pointer';
        // add click event listener
        img_tag.addEventListener("click", function () {
            window.open(image.getSiteUrl(), '_blank');
        });
        // update container height
        image.fireEvent('resize');
        this.getView().updateLayout();
    },

    /**
     * @param {Event} event
     * @param {Ext.dom.Element} el
     * @param {Object} eOpts
     */
    onCmdbuildLogoImageLoaded: function (event, el, eOpts) {
        // fix image width
        this.getView().updateLayout();
    },

    /**
     * @param {Event} event
     * @param {Ext.dom.Element} el
     * @param {Object} eOpts
     */
    onCompanyLogoImageLoaded: function (event, el, eOpts) {
        // fix image width
        this.getView().updateLayout();
    },

    /**
     * @param {Ext.button.Button} button
     * @param {Event} e
     * @param {Object} eOpts
     */
    onGlobalSearchClick: function (button, e, eOpts) {
        CMDBuildUI.util.Msg.alert('Warning', 'Action "Global search" not implemented!');
    },
    /**
     * @param {Ext.button.Button} button
     * @param {Event} e
     * @param {Object} eOpts
     */
    onLinkBtnClickAfterRender: function (button, e, eOpts) {
        if (button.href) {
            // wrap button with "a" tag
            button.el.dom.innerHTML = Ext.String.format(
                '<a class="header-button-link" href="{0}">{1}</a>',
                button.href,
                button.el.dom.innerHTML
            );
        }
    },

    /**
     * @param {Ext.button.Button} button
     * @param {Event} e
     * @param {Object} eOpts
     */
    onAdministrationClick: function (button, e, eOpts) {
        this.redirectTo('administration', true);
    },
    /**
     * @param {Ext.button.Button} button
     * @param {Event} e
     * @param {Object} eOpts
     */
    onManagementClick: function (button, e, eOpts) {
        this.redirectTo('', true);
    },

    /**
     * @param {Ext.button.Button} button
     * @param {Event} e
     * @param {Object} eOpts
     */
    onLogoutClick: function (button, e, eOpts) {
        this.redirectTo("logout", true);
    },

    /**
     * 
     * @param {Ext.button.Button} btn 
     */
    onHrefBtnClick: function (btn) {
        this.redirectTo(btn.getHref());
        window.location.reload();
        return false;
    },

    /**
     * @param {Ext.button.Button} button
     * @param {Event} e
     * @param {Object} eOpts
     */
    onSchedulerBtnClick: function (button, e, eOpts) {
        this.redirectTo('events', true);
    },

    /**
     * 
     * @param {Ext.Container} container 
     * @param {Object} eOpts 
     */
    onCompanyLogoContainerAfterRender: function (container, eOpts) {
        var vm = container.lookupViewModel();
        vm.bind({
            bindTo: {
                logo: '{companylogoid}'
            }
        }, function (binds) {
            if (binds.logo) {
                container.removeAll();
                vm.set("companylogoinfo.hidden", false);
                var img = Ext.create('Ext.Img', {
                    src: Ext.String.format("{0}/resources/company_logo/download?_dc={1}", CMDBuildUI.util.Config.baseUrl, new Date().getTime()),
                    alt: CMDBuildUI.locales.Locales.main.logo.companylogo,
                    height: 30,
                    cls: 'logo',
                    autoEl: {
                        'data-testid': 'header-companylogo'
                    },
                    listeners: {
                        afterrender: function () {
                            var imgDom = this.imgEl.dom;
                            imgDom.onload = function () {
                                container.update();
                            };
                        }
                    }
                });
                container.add(img);
            } else {
                vm.set("companylogoinfo.hidden", true);
            }
        });
    }


});