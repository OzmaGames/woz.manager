requirejs.config({
   paths: {
      'text': '../lib/require/text',
      'durandal': '../lib/durandal/js',
      'plugins': '../lib/durandal/js/plugins',
      'transitions': '../lib/durandal/js/transitions',
      'knockout': '../lib/knockout/knockout-2.3.0',
      'bootstrap': '../lib/bootstrap/js/bootstrap',
      'jquery': '../lib/jquery/jquery-1.9.1',
      'socket': '../lib/socket.io',
      'grid':'../lib/grid'
   },
   urlArgs: 't' + (new Date).getTime(),
   shim: {
      'bootstrap': {
         deps: ['jquery'],
         exports: 'jQuery'
      }
   }
});

define(['durandal/system', 'durandal/app', 'durandal/viewLocator', 'api/server', 'api/knockout', 'api/_feed'],
function (system, app, viewLocator) {

   system.debug(true);


   app.title = 'Words Of Oz - Manager';


   app.configurePlugins({
      router: true,
      dialog: true,
      widget: {
         kinds: ['expander']
      }
   });

   app.start().then(function () {

      viewLocator.useConvention();

      app.setRoot('shell');
   });

   window.app = app;
});