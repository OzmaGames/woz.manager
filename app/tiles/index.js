define(['api/datacontext', 'knockout', 'jquery'], function (ctx, ko, $) {
   var ctor = function () {
      var self = this;

      self.setList = ko.observableArray([]);
      self.tileList = ko.observableArray([]);

      self.selectedSet = ko.observable();


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