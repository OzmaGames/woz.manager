define(['api/datacontext', 'knockout', 'plugins/router', 'api/server'], function (ctx, ko, router, socket) {

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
         for (var i = 0; i < item.length; i++) {
            if (item[i] == filter) return true;
         }
         return false;
      }

      self.editRule = function (instruction) {
         var id = instruction.id;
         router.navigate("#edit-rule/" + id);
      }

      self.removeRule = function (rule) {
         //self.rules.remove(rule);
         socket.emit("manager: instructions", { command: "delete", instruction: rule });
      }
   }

   ctor.prototype.activate = function () {
      var base = this;
      socket.emit("manager:instructions", { command: 'getAll' }, function (data) {
         base.rules(data.instructions);
         console.log(data);
        
      });

      ctx.load("sets").then(function (sets) {
         sets = $.merge(["All"], sets);
         base.sets(sets);
         base.selectedSet(sets[0]);
      });
   }

   return ctor;
})
