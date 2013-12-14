define(['api/datacontext', 'knockout', 'jquery', 'grid'], function (ctx, ko, $) {
    
    console.log(grid());
    
    var ctor = function () {
      var self = this;

      self.setList = ko.observableArray();
      self.selectedSet = ko.observable();
      self.tileList = ko.observableArray();
     
        
       
      
    }
    
    ctor.prototype.compositionComplete = function () {
      grid().init();
   }
   
   ctor.prototype.activate = function () {
      var base = this;

      ctx.load("tiles").then(function (tiles) {
         base.tileList(tiles);
      });

      ctx.load("sets").then(function (sets) {
         sets = $.merge(['All'], sets);
         base.setList(sets);
         base.selectedSet(sets[0]);
      });
   }
   return ctor;
})