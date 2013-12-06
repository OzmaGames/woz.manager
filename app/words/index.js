define(['api/datacontext', './form', 'durandal/app', './versionForm', './checkForm', 'knockout', 'jquery','api/server'],
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

      ko.computed(function () {
         self.words().sort(self.sortMethod());

      })

      self.filteredWords = ko.computed(function () {
         var classKey = self.selectedClass();
         var categoryKey = self.selectedCategory();
         var setKey = self.selectedSet();
         var query = self.query();
         return ko.utils.arrayFilter(self.words(), function (item) {
            if (item.ignoreFilter) { delete item.ignoreFilter; return true; }
            return genericFilter(item["classes"], classKey) &&
                   genericFilter(item["categories"], categoryKey) &&
                   genericFilter(item["collections"], setKey) &&
                   contains(item["lemma"], query);
         });
      });

      function contains(item, query) {
         return !item || !query || item.search(query) !== -1;
      }

      function genericFilter(item, filter) {
         if (filter === 'All') return true;
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
               newWord.ignoreFilter = true;
               //self.words.push(newWord);
               socket.emit("manager:words", {command: "set", word: newWord, oldLemma: newWord.lemma});
               var wordPos = self.filteredWords().indexOf(newWord) + 1;
               var newPage = Math.ceil(wordPos / self.pageSize()) - 1;
               self.pageIndex(newPage);
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
               socket.emit("manager:words", {command: 'set', word:newWord, oldLemma:word.lemma});
            }
         });
      }

      self.remove = function (word) {
         checkForm.show(word).then(function (response) {
            if (response)
            //self.words.remove(response);
            socket.emit("manager:word", {command: "delete", word:word});
         })
      }

      self.versions = function (word) {
         versionForm.show(word).then(function () {
            var wordPos = self.words.indexOf(word);
            self.words.splice(wordPos, 1);
            self.words.splice(wordPos, 0, word);
            socket.emit("manager:words", {command: "set", word:word, oldLemma:word.lemma});
         });
      }

      self.searchWord = ko.computed(function () {
         var search = self.query();
         return ko.utils.arrayFilter(self.words, function (word) {
            return word.indexOf(search) >= 0;
         })
      })

   };

   ctor.prototype.activate = function () {
      var base = this;
      
      socket.emit("manager:words", {command:'getAll'}, function (data){
         ko.utils.arrayForEach(data.words, function (word) {
            if (!word.versions) word.versions = [];
            if (!word.collections) word.collections = [];            
            word.date = new Date().getTime();
         });
         base.words(data.words);
      });
      
      ctx.load("classes").then(function (classes) {
         classes = $.merge(['All'], classes);
         base.classes(classes);
         base.selectedClass(classes[0]);
      });

      ctx.load("categories").then(function (categories) {
         categories = $.merge(["All"], categories);
         base.categories(categories);
         base.selectedCategory(categories[0]);
      });

      ctx.load("sets").then(function (collections) {         
         collections = $.merge(["All"], collections);
         base.collections(collections);
         base.selectedSet(collections[0]);
      });
   }

   return ctor;
})