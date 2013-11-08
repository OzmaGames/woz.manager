define(['api/datacontext', './form','durandal/app', './versionForm', './checkForm', 'knockout', 'jquery'], function (ctx, form, app,versionForm, checkForm, ko, $) {

    var ctor = function () {
        var self = this;

        self.selectedClass = ko.observable();
        self.selectedCategory = ko.observable();
        self.selectedSet = ko.observable();

        self.words = ko.observableArray([]);
        self.classes = ko.observableArray([]);
        self.categories = ko.observableArray([]);
        self.sets = ko.observableArray([]);

        self.query = ko.observable();
        self.pageIndex = ko.observable(0);
        self.pageSize = ko.observable(5);
        self.pageNumberInput = ko.observable(self.pageIndex() + 1);
         
        var sortMethods = {
            base : function (a,b){ return a.lemma > b.lemme},
            dateAdded : function (a,b){ return a.date < b.date}
        }
        
        self.sortMethod = ko.observable(sortMethods.base);
     
        ko.computed(function(){
            console.log("a");
            var tmp = self.words();
            tmp.sort(self.sortMethod());
        })
        

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
            return Math.ceil(self.words().length / self.pageSize()) - 1;
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
                if (newWord) {self.words.push(newWord);
                };
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

        self.remove = function (word) {
           checkForm.show(word).then(function(response){
            if (response) self.words.remove(response);
            })
        }

        self.versions = function (word) {
            versionForm.show(word).then(function () {
                var wordPos = self.words.indexOf(word);
                self.words.splice(wordPos, 1);
                self.words.splice(wordPos, 0, word);
            });
        }
        

        self.filteredWords = ko.computed(function () {
            var size = self.pageSize();
            var start = self.pageIndex() * size;
            var words = self.words.slice(start, start + size);

            var classKey = self.selectedClass();
            var categoryKey = self.selectedCategory();
            var setKey = self.selectedSet();
            var query = self.query();
            return ko.utils.arrayFilter(words, function (item) {
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
        
        self.searchWord = ko.computed(function () {
            var search = self.query();
            return ko.utils.arrayFilter(self.words, function (word) {
                return word.indexOf(search) >= 0;
            })
        })
            
    };

    ctor.prototype.activate = function () {
        var base = this;

        ctx.load("words").then(function (words) {
            ko.utils.arrayForEach(words, function (word) {
                if (!word.versions) word.versions = [];
                word.date = new Date().getTime();
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