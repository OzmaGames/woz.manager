define(['api/datacontext', './form', 'knockout'], function (ctx, form, ko) {

    var ctor = function () {
        var self = this;

        self.selectedClass = ko.observable();
        self.classes = ko.observableArray([]);
        self.words = ko.observableArray([]);

        self.addWord = function () {
            form.show();
        };

        self.filteredWords = ko.computed(function () {
            if (self.selectedClass() !== 'All') {
                var filterKey = self.selectedClass();
                return ko.utils.arrayFilter(self.words(), function (item) {
                    return filter(item, filterKey)
                });
            } else {
                return self.words();
            }
        });

        //private function
        function filter(item, filter) {
            for (var i = 0; i < item.classes.length; i++) {
                if (item.classes[i] == filter) return true;
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
    }

    return ctor;
})