define(['api/datacontext', './form', 'durandal/app', './versionForm', './checkForm', 'knockout', 'jquery', 'api/server'],
   function (ctx, form, app, versionForm, checkForm, ko, $, socket) {

   var ctor = function () {
      var self = this;

      self.selectedClass = ko.observable();
      self.selectedCategory = ko.observable();
      self.selectedSet = ko.observable();
      
      self.words = ko.observableArray();
      self.classes = ko.observableArray();
      self.categories = ko.observableArray();
      self.collections = ko.observableArray();
     

      self.query = ko.observable();
      self.ByName = ko.observable(true);
      self.pageIndex = ko.observable(0);
      self.pageSize = ko.observable(20);
      self.pageNumberInput = ko.observable(self.pageIndex() + 1);

      var sortMethods = {
         lemma: function (a, b) { return a.lemma.localeCompare(b.lemma); },
         dateAdded: function (a, b) { return b.date - a.date }
      }
      
      
      self.sortMethod = ko.observable(sortMethods.lemma);
      self.sortByName = function () {
         self.sortMethod(sortMethods.lemma);
         self.words.valueHasMutated();
         self.ByName(true);
      }

      self.sortByDate = function () {
         self.sortMethod(sortMethods.dateAdded);
         self.words.valueHasMutated();
         self.ByName(false);
      }
      //var lastNumber = 0;
      ko.computed(function () {
         self.words().sort(self.sortMethod());
         ko.utils.arrayForEach(self.words(), function(word) {
             //word.number = lastNumber++;
             });

      })

      self.filteredWords = ko.computed(function () {
         var classKey = self.selectedClass();
         var categoryKey = self.selectedCategory();
         var setKey = self.selectedSet();
         var query = self.query();
         return ko.utils.arrayFilter(self.words(), function (item) {
            if (item.ignoreFilter) { delete item.ignoreFilter; return true; }
            if (query)  {return contains(item["lemma"], query); return true;}
            else {
            return genericFilter(item["classes"], classKey) &&
                   genericFilter(item["categories"], categoryKey) &&
                   genericFilter(item["collections"], setKey.shortName);
            }
                   
         });
      });

      function contains(item, query) {
         return !item || !query || item.search(query) !== -1;
      }

      function genericFilter(item, filter) {
         if (filter === 'All') return true;
         if (filter === 'No category' && item === '""') return true;
         if (typeof item === 'string' && item === filter) {
            return true;
         } else if (typeof item === 'object') {
            for (var i = 0; i < item.length; i++) {
               if (item[i] === filter) return true;
            }
         }
         return false;
      }
      
      self.pagedWords = ko.computed(function () {
         var size = self.pageSize();
         var start = self.pageIndex() * size;
         return self.filteredWords().slice(start, start + size);

      });

      self.previousPage = function () {
         if (self.pageIndex() > 0) {
            self.pageIndex(self.pageIndex() - 1);
         }
      };

      self.nextPage = function () {
         if (self.pageIndex() < self.maxPageIndex()) {
            self.pageIndex(self.pageIndex() + 1);
         }
      };

      self.maxPageIndex = ko.computed(function () {
         return Math.ceil(self.filteredWords().length / self.pageSize()) - 1;
      });

      self.allPages = ko.computed(function () {
         var pages = [],
             length = self.maxPageIndex();

         for (i = 0; i <= length; i++) {
            pages.push({ pageNumber: (i + 1) });
         }
         return pages;
      });

      self.moveToPage = function (index) {
         self.pageIndex(index);
      };

      self.addWord = function () {
         form.show().then(function (newWord) {
            if (newWord.lemma && null == ko.utils.arrayFirst(self.words(), function (word) { return word.lemma == newWord.lemma })) {
               newWord.command = "set";
               //newWord.oldLemma = ""; // not necessary, you can remove it, since we are adding
               socket.emit("manager:words", newWord, function (data) {                  
                  if (data.success) {
                     newWord.ignoreFilter = true;
                     newWord.displayCollections = ko.observableArray();
                     self.words.push(newWord);
                     //self.words.valueHasMutated(); no need for this, since the words knows it has been changed
                     /*
                     self.words.push -> notify changes / because "words" is observable
                     slef.words().push -> does not notify changes / because "words()" is a simple array
                     */
                     var wordPos = self.filteredWords().indexOf(newWord) + 1;
                     var newPage = Math.ceil(wordPos / self.pageSize()) - 1;
                     self.pageIndex(newPage);
                  }
               });
            } else if (!newWord.lemma) {
               app.showMessage('Please enter a word.', 'Oops');
            } else { app.showMessage('This word already exists.', 'Oops'); };
         });
      };

      self.edit = function (word) {
         form.show(word).then(function (newWord) {
            if (newWord) {
               //var wordPos = self.words.indexOf(word);
               //self.words.splice(wordPos, 1, newWord);
               newWord.command = 'set';
               newWord.oldLemma = word.lemma;
               socket.emit("manager:words", newWord, function (data) {
                  if (data.success) {
                     //update client
                     newWord.ignoreFilter = true;
                     newWord.displayCollections = ko.observableArray();                     

                     var pos = self.words.indexOf(word);
                     self.words.splice(pos, 1, newWord); //using "self.words" and not "self.words()" notify chanegs                     
                  }
               });
            }
         });
      }

      self.remove = function (word) {
         checkForm.show(word).then(function (response) {
            if (response)
               //self.words.remove(response);              
               socket.emit("manager:words", {command: "delete", lemma: response.lemma}, function (data) {
                  if (data.success) {
                     var pos = self.words.indexOf(word);
                     self.words.splice(pos, 1);
                  }
               });

         })
      }

      self.toVersions = function (word) {
         versionForm.show(word).then(function (response) {
            //var wordPos = self.words.indexOf(word);
            //self.words.splice(wordPos, 1);
            //self.words.splice(wordPos, 0, word);
            var toSend = {};
            toSend.command = 'setVersions';
            toSend.versions = response;
            toSend.lemma = word.lemma;
            //response.oldLemma = word.lemma; // Important for updates

            socket.emit("manager:words", toSend, function (data) {
                console.log(data);
                console.log(toSend);
               if (data.success) {                  
                  var pos = self.words.indexOf(word);
                  self.words().splice(pos, 1); //using "self.words()" to not cause chain notification yet
                  self.words.splice(pos, word);
               }
            });
         });
      }

      /*self.searchWord = ko.computed(function () {
        var search = self.query();
         return ko.utils.arrayFilter(self.words(), function (word) {
            console.log(word);
        
            return word.lemma == search;
         })
      })*/

   };

   ctor.prototype.activate = function () {
      var base = this;

      socket.emit("manager:words", { command: 'getAll' }, function (data) {
         console.log(data);
         ko.utils.arrayForEach(data.words, function (word) {
            word.displayCollections = ko.observableArray();
            word.date = new Date().getTime();
            //word.number = ko.observable();
         });
         base.words(data.words);

      });

      ctx.load("classes").then(function (classes) {
         classes = $.merge(['All'], classes);
         base.classes(classes);
         base.selectedClass(classes[0]);
      });

      socket.emit("manager:categories", { command: 'getAll' }, function (data) {
         categories = $.merge(["All"], data.categories);
         //categoryPos = categories.indexOf("");
         //categories.splice(categoryPos, 1);
         base.categories(categories);
         base.categories.sort();
         base.selectedCategory(categories[0]);
      });
      /*ctx.load("categories").then(function (categories) {
         categories = $.merge(["All"], categories);
         base.categories(categories);
         base.selectedCategory(categories[0]);
      });*/

      socket.emit('manager:collections', { command: 'getAll' }, function (data) {
         collections = $.merge([{longName: "All", shortName: 'All'}], data.collections);           
         base.collections(collections);
         base.selectedSet(collections[0]);
         
         /*
         create a dictionary so it is easier to map shortnames to longnames
         */
         var dic = {};
         for (var i = 0; i < collections.length; i++) {
            dic[collections[i].shortName] = collections[i].longName;
         }

         /*
         wait for words to be ready, then apply collections real name to it
         */
         var sub = ko.computed(function () {
            var words = base.words();
            if (words.length) {
               
               ko.utils.arrayForEach(words, function (word) {
                  //remove previous collections, so that they wont appear again if the user has removed them
                  word.displayCollections.splice(0, word.displayCollections().length);
                                    
                  ko.utils.arrayForEach(word.collections, function (col) {
                     if (!dic[col]) dic[col] = 'unknown';
                     word.displayCollections.push(dic[col]);
                  });                  
               });
               
               //sub.dispose(); //kill the computed func, so it wont run again               
            }
         });
      });

      /* ctx.load("sets").then(function (collections) {         
         collections = $.merge(["All"], collections);
         base.collections(collections);
         base.selectedSet(collections[0]);
      });*/
   }

   return ctor;
})