(function() {
    var popuphtml = 
    '<div class="x-selectable">' +
    '    <p><strong>Version:</strong> (CMDBuild READY2USE {0})</p>' +
    '    <p><strong>License:</strong> the software is released under <a href="http://www.gnu.org/licenses/agpl-3.0.html" target="_blank">AGPL</a> license.</p>' +
    '    <p><strong>Credits:</strong> CMDBuild READY2USE is a verticalization of CMDBuild for IT Governance and is developed and maintained by <a href="http://tecnoteca.com" target="_blank">Tecnoteca srl</a>.' +
    '    <br />CMDBuild READY2USE ® is a registered trademark of <a href="http://tecnoteca.com" target="_blank">Tecnoteca srl</a> and can\'t be removed.</p>' +
    '    <p style="margin-top: 35px; color: #83878b;">For further information please visit <a href="http://www.cmdbuildready2use.org" target="_blank">www.cmdbuildready2use.org</a></p>' +
    '</div>';
    Ext.define('CMDBuildUI.view.main.footer.Container',{
        extend: 'Ext.container.Container',
    
        requires: [
            'CMDBuildUI.view.main.footer.ContainerController',
            'CMDBuildUI.view.main.footer.ContainerModel'
        ],
    
        xtype: 'main-footer-container',
        controller: 'main-footer-container',
        viewModel: {
            type: 'main-footer-container'
        },
    
        dock: 'bottom',
        padding: '5px 10px',
        cls: 'main-footer',
        layout: 'hbox',
    
        // add data-testid attribute to element
        autoEl: {
            'data-testid' : 'main-footer-container'
        },
    
        style: {
            textAlign: 'center'
        },
    
        items: [{
            xtype: 'component',
            flex: 1
        },{
            xtype: 'component',
            html: '<a href="http://www.cmdbuildready2use.org" target="_blank">www.cmdbuildready2use.org</a>',
            width: 200,
            style: {
                textAlign: 'right'
            }
        },{
            xtype: 'component',
            html: '&middot',
            width: 40
        },{
            xtype: 'component',
            html: CMDBuildUI.locales.Locales.main.info,
            localized: {
                html: 'CMDBuildUI.locales.Locales.main.info'
            },
            style: {
                cursor: 'pointer'
            },
            listeners: {
                click: {
                    element: 'el',
                    fn: function(){
                        var version = CMDBuildUI.util.helper.Configurations.get(CMDBuildUI.model.Configuration.common.fullversion);
                        CMDBuildUI.util.Utilities.openPopup(
                            null,
                            CMDBuildUI.locales.Locales.main.info, {
                                layout: {
                                    type: 'vbox',
                                    align: 'stretch'
                                },
                                items: [{
                                    xtype: 'main-header-logo',
                                    padding: "10 15"
                                }, {
                                    html: Ext.String.format(popuphtml, version),
                                    padding: "10 15"
                                }]
                            }, null, {
                                width: 400,
                                height: 420,
                                ui: 'managementlighttabpanel'
                            }
                        );
                    }
                }
            }
        },{
            xtype: 'component',
            html: '&middot',
            width: 40
        },{
            xtype: 'component',
            html: '<a href="http://www.tecnoteca.com" target="_blank">Copyright &copy; Tecnoteca srl</a>',
            width: 200,
            style: {
                textAlign: 'left'
            }
        },{
            xtype: 'component',
            flex: 1
        }]
    });
})();
