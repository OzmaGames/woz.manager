define(['api/datacontext', 'knockout', 'jquery', 'plugins/router', 'api/server', 'durandal/app', 'grid'],
   function (ctx, ko, $, router, socket, app) {

      window.ko = ko;
      var ctor = function () {
         var self = this;

         self.setList = ko.observableArray();
         self.selectedSet = ko.observable(self.setList([0]));
         self.tileList = ko.observableArray();
         self.selectedTile = ko.observable();
         self.words = ko.observableArray();
         self.query = ko.observable();
         self.add = ko.observable(false);

         self.chooseTile = function (tile) {
            self.selectedTile(tile);
            console.log(self.selectedTile());
         }         



         //Start my changes

         self.filteredTiles = ko.computed(function () {
            //dont use observable object inside a loop, extract information before the loop
            var colName = self.selectedSet().shortName

            return ko.utils.arrayFilter(self.tileList(), function (item) {
               return item.collection === colName;
            });
         });

         ko.computed(function () {
            //this method runs shortly after when filteredTiles changes
            var tiles = self.filteredTiles(); 
            
            //create grid only if there is any tile at all
            if (tiles.length) {
               grid().init();
            }
         }).extend({ throttle: 1 });
         //more info at: http://knockoutjs.com/documentation/throttle-extender.html
         //.extend({ throttle: 1 }); means that when filteredTiles changes, wait 1ms for browser to settle things down 
         //and let it have a chance to create elements on the page         

         // End My changes

         self.collectionName = ko.computed(function(){
            
            });

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
            var data = {
               command: 'setRelated',
               name: self.selectedTile().name,
               related: relatedWords
            };
            console.log(data);
            socket.emit('manager:images', data, function (data) {
               console.log(data);
               self.selectedTile.valueHasMutated();
            });
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
            self.selectedTile().related.push(self.query());
            var data = {
               command: 'setRelated',
               name: self.selectedTile().name,
               related: self.selectedTile().related
            };
            console.log(data);

            //if (self.selectedTile().related.indexOf(self.query()) == -1) {
               socket.emit('manager:images', data, function (data) {
                  console.log(data);
                  //self.selectedTile().related.push(self.query());
                  self.selectedTile.valueHasMutated();
                  self.query("");
                  self.add(false);
                });

           // } else {
              // app.showMessage('This word already exist', 'Oops').then(function () {
                 // self.query('');
                 // self.add(false);
               //});
            //}
         }
      }


      //ctor.prototype.compositionComplete = function () {
      //grid().init();
      //}

      ctor.prototype.activate = function () {
         var base = this;

         socket.emit('manager:images', { command: 'getAll' }, function (data) {
            console.log(data);
            base.tileList(data.images);            
         });

         //ctx.load("tiles").then(function (tiles) {
         //base.tileList(tiles);
         //});

         socket.emit("manager:words", { command: 'getAll' }, function (data) {
            base.words(data.words);
         });

         socket.emit('manager:collections', { command: 'getAll' }, function (data) {
            console.log(data);
            base.setList(data.collections);
            base.setList.splice(0,1);
            base.selectedSet(base.setList()[0]);

         });
         //ctx.load("sets").then(function (sets) {
         //sets = $.merge(['All'], sets);
         //base.setList(sets);
         //base.selectedSet(sets[0]);
         //});
      }
      return ctor;
   })