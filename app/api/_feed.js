define(['durandal/system', 'api/datacontext'], function (system, ctx) {
    var inject = ['words', 'rules', 'tiles', 'classes','categories','sets'];

    for (var i = 0; i < inject.length; i++) {
        load(inject[i])
    }

    function load(moduleName) { 
        system.acquire('api/feed/' + moduleName).then(function (data) {
            ctx.pool[moduleName] = data;
        });    
    }
});