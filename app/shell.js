define(['plugins/router', 'add/form','durandal/app'], function (router, form, app) {
    return {
        addCatCal: function(){form.show().then(function(){console.log('a')})},
        router: router,
        activate: function () {
            return router.map([
               
                { route: 'words',                       moduleId: 'words/index',            title: 'Words',             nav: true },
                { route: 'rules',                       moduleId: 'rules/index',            title: 'Rules',             nav: true },
                { route: 'tile-gallery',                moduleId: 'tiles/index',            title: 'Tiles',             nav: true },
                { route: 'create-rule',                 moduleId: 'rules/form'},
                { route: 'edit-rule/:id',               moduleId: 'rules/form'}
            
                
            ]).buildNavigationModel()
              .mapUnknownRoutes('words/index', 'not-found')
              .activate();
        }
    };
});