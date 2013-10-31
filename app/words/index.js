define(['api/datacontext', './form', 'knockout', 'jquery'], function (ctx, form, ko, $) {

    var ctor = function () {
        var self = this;

        self.selectedClass = ko.observable();
        self.selectedCategory = ko.observable();
        self.selectedSet = ko.observable();

        self.words = ko.observableArray([]);
        self.classes = ko.observableArray([]);
        self.categories = ko.observableArray([]);
        self.sets = ko.observableArray([]);
        
        self.pageIndex = ko.observable(0);
        self.pageSize = ko.observable(5);
        
        
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
        return Math.ceil(self.words().length/self.pageSize())-1;
        });
        
        self.allPages = ko.computed(function () {
           var pages = [];
           for (i = 0; i <= self.maxPageIndex() ; i++) {
            pages.push({ pageNumber: (i + 1) });
           }
           return pages;
        });
        
        self.moveToPage = function (index) {
          self.pageIndex(index);
        };
    
        self.addWord = function () {
            form.show().then(function (newWord) {
                if (newWord) self.words.push(newWord);
            });
        };

        self.edit = function (word) {
            form.show(word).then(function (newWord) {
                if (newWord) {
                    var wordPos = self.words.indexOf(word);
                    self.words.splice(wordPos, 1, newWord);
                }
            });
        }
        
       self.addVersion = function(word){
            var version = {parent: word};
            form.show(version).then(function (newVersion) {
                if (newVersion) {
                    word.versionOf.push(newVersion);
                    
                    var wPos = self.words.indexOf(word);
                    self.words.splice(wPos, 1);
                    self.words.splice(wPos, 0, word);
                }
            });
       }

        self.editVersion = function (version) {
            form.show(version).then(function (newVersion) {
                if (newVersion) {
                    var word = newVersion.parent = version.parent;
                    var vPos = word.versions.indexOf(version);
                    word.versions.splice(vPos, 1, newVersion);
                    
                    //force ko to update its row
                    var wPos = self.words.indexOf(word);
                    self.words.splice(wPos, 1);
                    self.words.splice(wPos, 0, word);
                    //since the word is the same, two splices are needed, so ko can detect changes.
                }
            });
        }
        
        self.filteredWords = ko.computed(function () {            
            var size = self.pageSize();
            var start = self.pageIndex() * size;
            var words = self.words.slice(start, start + size);
        
            var classKey = self.selectedClass();
            var categoryKey = self.selectedCategory();
            var setKey = self.selectedSet();
            return ko.utils.arrayFilter(words, function (item) {
                return genericFilter(item["classes"], classKey) &&
                       genericFilter(item["categories"], categoryKey) &&
                       genericFilter(item["collections"], setKey);
            });
        });

        //*private function
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

    };

    ctor.prototype.activate = function () {
      var base = this;

       ctx.load("words").then(function (words) {
            ko.utils.arrayForEach(words, function (word) {
                if (!word.versions) word.versions = [];
                ko.utils.arrayForEach(word.versions, function (version) {
                    version.parent = word;
                });
            });
            base.words(words);
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

        ctx.load("sets").then(function (sets) {
            sets = $.merge(["All"], sets);
            base.sets(sets);
            base.selectedSet(sets[0]);
        });
    }

    return ctor;
})