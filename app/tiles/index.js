define(['api/datacontext', 'knockout', 'jquery', 'grid'], function (ctx, ko, $) {
    
    var ctor = function () {
      var self = this;

      self.setList = ko.observableArray();
      self.selectedSet = ko.observable();
      self.tileList = ko.observableArray();
      console.log(self.tileList());
      
      self.rows = ko.computed(function () {
        var rows = [],
        currentRow,
        colLength = 5;
        console.log(self.tileList());
        
        for (var i = 0, j = self.tileList().related.length; i < j; i++) {
          if (i % colLength === 0) {
            if (currentRow) {
                rows.push(currentRow);
            }
            currentRow = [];
           }
            currentRow.push(self.tileList().related[i]);
           }
          if (currentRow) {
          rows.push(currentRow);
           }
          return rows;
           });
    
      
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