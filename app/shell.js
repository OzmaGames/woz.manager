define(['plugins/router'], function (router) {
    return {
        router: router,
        activate: function () {
            return router.map([
               
                { route: 'words',                       moduleId: 'words/index',            title: 'Words',             nav: true },
                { route: 'rules',                       moduleId: 'rules/index',            title: 'Rules',             nav: true },
                { route: 'tile-gallery',                moduleId: 'tiles/index',            title: 'Tiles',             nav: true },
                { route: 'create-rule',                 moduleId: 'rules/createRule'},
                { route: 'edit-rule/:id',               moduleId: 'rules/createRule'}
                
                
            ]).buildNavigationModel()
              .mapUnknownRoutes('words/index', 'not-found')
              .activate();
        }
    };
});