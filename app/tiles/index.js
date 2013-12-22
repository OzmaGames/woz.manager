define(['api/datacontext', 'knockout', 'jquery', 'grid', 'plugins/router'], function (ctx, ko, $, router) {
    
    var ctor = function () {
      var self = this;

      self.setList = ko.observableArray();
      self.selectedSet = ko.observable();
      self.tileList = ko.observableArray();
      self.selectedTile = ko.observable();
      
      self.chooseTile = function(tile){
        console.log("b");
        self.selectedTile(tile);
      }
      
      
      console.log("out");
      self.rows = ko.computed(function () {
        var rows = [],
        currentRow,
        colLength = 6;
        
        if (self.selectedTile()) {
            for (var i = 0, j = self.selectedTile().related.length; i < j; i++) {
                if (i % colLength === 0) {
                   if (currentRow) {
                     rows.push(currentRow);
                    }
                    currentRow = [];
            }
            currentRow.push(self.selectedTile().related[i]);
           }
          if (currentRow) {
              rows.push(currentRow);
           }
           console.log("in");
          return rows;
        }
    });
      
      self.home = function() {
         console.log("home");
        router.navigate("#words");
      }
     
     self.remove = function (e, word) {
        console.log("a");
        e.preventDefault();
        self.rows.remove(word);
        
    }
      
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