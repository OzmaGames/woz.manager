define(['durandal/system', 'durandal/app', 'api/server'], function (system, app) {
   var pool = {};

   return {
      pool: pool,

      load: function (event, forced) {
         forced = forced || false;
         return system.defer(function (dfd) {
            if (forced || !pool.hasOwnProperty(event)) {
               app.trigger('server:' + event, {}, function (json) {                  
                  pool[event] = json;
                  dfd.resolve(pool[event]);
               });
            } else {
               dfd.resolve(pool[event]);
            }
         });
      }
   };
});