define(['api/datacontext', 'knockout', './createRule','plugins/router'], function (ctx, ko, creatRule, router) {

    var ctor = function () {
        var self = this;

        self.sets = ko.observableArray([]);
        self.rules = ko.observableArray([]);

        self.selectedSet = ko.observable();

        self.filteredTable = ko.computed(function () {
                return ko.utils.arrayFilter(self.rules(), function (item) {
                    return filter(item['collections'], self.selectedSet());
                });
        });

        function filter(item, filter) {
            if (filter === "All") return true;
            for (var i=0; i< item.length; i++) {
               if (item[i] == filter) return true;
            }
            return false;
        }
        
        self.editRule = function(rule){
            var id = rule.id;
            router.navigate("#edit-rule/" + id);
        }
    }

    ctor.prototype.activate = function () {
        var base = this;

        ctx.load("rules").then(function (rules) {
            base.rules(rules);
        });

        ctx.load("sets").then(function (sets) {
            sets = $.merge(["All"], sets);
            base.sets(sets);
            base.selectedSet(sets[0]);
        });
    }

    return ctor;
})
