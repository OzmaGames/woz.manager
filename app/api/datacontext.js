define(['durandal/system', 'durandal/app', 'api/server'], function (system, app) {
    var pool = {};

    return {
        pool: pool,

        load: function (event, forced) {            
            forced = forced || false;
            if (forced || !pool.hasOwnProperty(event)) {
                return system.defer(function (dfd) {
                    app.trigger('server:' + event, function (json) {
                        pool[event] = json;
                        dfd.resolve(pool[event]);
                    });
                })
            } else {
                return system.defer(function (dfd) {
                    dfd.resolve(pool[event]);
                });
            }
        }
    };
});