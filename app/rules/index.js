define(['api/datacontext', 'knockout', './ruleForm'], function (ctx, ko, form) {

    var ctor = function () {
        var self = this;

        self.sets = ko.observableArray([]);
        self.rules = ko.observableArray([]);

        self.selectedSet = ko.observable();

        self.addRule = function () {
            form.show().then(function (newRule) {
                if (newRule) self.rules.push(newRule);
            });
        }

        self.filteredTable = ko.computed(function () {
            if (self.selectedSet() !== 'All') {
                return ko.utils.arrayFilter(self.rules(), function (item) {
                    return filter(item, self.selectedSet());
                });
            } else {
                return self.rules();
            }
        });

        function filter(item, filter) {
            return item.set == filter;
        }
    }

    ctor.prototype.activate = function () {
        var base = this;

        ctx.load("rules").then(function (rules) {
            base.rules(rules);
        });

        ctx.load("sets").then(function (sets) {
            sets = $.merge(['All'], sets);
            base.sets(sets);
            base.selectedSet(sets[0]);
        });
    }

    return ctor;
})
