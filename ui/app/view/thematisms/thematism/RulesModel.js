Ext.define('CMDBuildUI.view.thematisms.thematism.RulesModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.thematisms-thematism-rules',
    stores: {
        legendstore: {
            model: 'CMDBuildUI.model.thematisms.LegendModel',
            proxy: {
                type: 'memory'
            },
            data: '{legenddata}'
            //update listener defined in viewController
        }
    }
});
