define(['plugins/router'], function (router) {
    return {
        router: router,
        activate: function () {
            return router.map([
               
                { route: 'words',                       moduleId: 'words/index',            title: 'Words',             nav: true },
                { route: 'rules',                       moduleId: 'rules/index',            title: 'Rules',             nav: true },
                { route: 'new-rules',                   moduleId: 'newRule/index',          title: 'new',               hash: '#new-rules' },
                { route: 'tile-gallery',                moduleId: 'tiles/index',            title: 'Tiles',             nav: true }
                
            ]).buildNavigationModel()
              .mapUnknownRoutes('words/index', 'not-found')
              .activate();
        }
    };
});