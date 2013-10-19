define(['api/datacontext', './form', 'knockout'], function (ctx, form, ko) {

    var ctor = function () {
        var self = this;

        self.selectedClass = ko.observable();
        self.selectedCategory = ko.observable();
        self.selectedSet = ko.observable();

        self.words = ko.observableArray([]);
        self.classes = ko.observableArray([]);
        self.categories = ko.observableArray([]);
        self.sets = ko.observableArray([]);

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

        self.filteredWords = ko.computed(function () {
            var classKey = self.selectedClass();
            var categoryKey = self.selectedCategory();
            var setKey = self.selectedSet();
            return ko.utils.arrayFilter(self.words(), function (item) {
                return genericFilter(item["classes"], classKey) &&
                       genericFilter(item["categories"], categoryKey) &&
                       genericFilter(item["sets"], setKey);
            });
        });

        //*private function
        function genericFilter(item, filter) {
            if (filter === 'All') return true;
            console.log(item, filter);
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
            base.words(words);
        });

        ctx.load("classes").then(function (classes) {
            classes.unshift('All');
            base.classes(classes);
            base.selectedClass(classes[0]);
        });

        ctx.load("categories").then(function (categories) {
            categories.unshift('All');
            base.categories(categories);
            base.selectedCategory(categories[0]);
        });

        ctx.load("sets").then(function (sets) {
            sets.unshift('All');
            base.sets(sets);
            base.selectedSet(sets[0]);
        });
    }

    return ctor;
})