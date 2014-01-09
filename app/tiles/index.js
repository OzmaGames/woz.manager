define(['api/datacontext', 'knockout', 'jquery', 'plugins/router', 'api/server', 'durandal/app', 'grid'],
   function (ctx, ko, $, router, socket, app) {

   window.ko = ko;
   var ctor = function () {
      var self = this;

      self.setList = ko.observableArray();
      self.selectedSet = ko.observable();
      self.tileList = ko.observableArray();
      self.selectedTile = ko.observable();
      self.words = ko.observableArray();
      self.query = ko.observable();
      self.add = ko.observable(false);

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
         router.navigate("#words");
      }

      self.remove = function (word) {
         var relatedWords = self.selectedTile().related;
         var pos = relatedWords.indexOf(word);
         relatedWords.splice(pos, 1);

         self.selectedTile.valueHasMutated();
      }


      function sortMethode(a, b) {
         return a.lemma.localeCompare(b.lemma);
      }


      self.searchResult = ko.computed(function () {
         var words = self.words().sort(sortMethode);

         if (self.query()) {
            var query = self.query().toLowerCase();
            return ko.utils.arrayFilter(words, function (word) {
               return word.lemma.toLowerCase().indexOf(query) === 0;

            })
         }
      });

      self.displayResult = ko.computed(function () {
         if (self.query()) {
            if (self.query().length > 0) return true;
         }
      });

      $('#searchResult').on('blur', function () {
         self.displayResult(false);
      });

      self.hitResult = function (result) {
         if (self.query()) {
            self.query(result.lemma);
         }
      }

      self.enableAdd = ko.computed(function () {
         var words = self.words();
         if (self.query()) {
            if (ko.utils.arrayFirst(words, function (word)
            { return word.lemma.toLowerCase() === self.query().toLowerCase(); })) {
               self.add(true);
            } else { self.add(false); };
         }
      });

      self.addToRelated = function () {
         if (self.selectedTile().related.indexOf(self.query()) == -1) {
            self.selectedTile().related.push(self.query());
            self.selectedTile.valueHasMutated();
            self.query("");
            self.add(false);
         } else {
            app.showMessage('This word already exist', 'Oops').then(function () {
               self.query('');
               self.add(false);
            });
         }
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

      socket.emit("manager:words", { command: 'getAll' }, function (data) {
         base.words(data.words);
      });

      ctx.load("sets").then(function (sets) {
         sets = $.merge(['All'], sets);
         base.setList(sets);
         base.selectedSet(sets[0]);
      });
   }
   return ctor;
})