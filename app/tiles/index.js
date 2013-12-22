define(['api/datacontext', 'knockout', 'jquery', 'grid', 'plugins/router'], function (ctx, ko, $, router) {

   window.ko = ko;
   var ctor = function () {
      var self = this;

      self.setList = ko.observableArray();
      self.selectedSet = ko.observable();
      self.tileList = ko.observableArray();
      self.selectedTile = ko.observable();

      self.chooseTile = function (tile) {
         self.selectedTile(tile);
      }

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
            return rows;
         }
      });

      self.home = function () {
         console.log("home");
         router.navigate("#words");
      }

      self.remove = function (word) {
         var relatedWords = self.selectedTile().related;
         var pos = relatedWords.indexOf(word);
         relatedWords.splice(pos, 1);

         self.selectedTile.valueHasMutated();
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