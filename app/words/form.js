define(['api/datacontext', 'plugins/dialog', 'knockout', 'durandal/app', 'bootstrap', 'jquery'], function (ctx, dialog, ko, app, $) {

   var WordForm = function (word) {
      var self = this;

      this.selectedCategory = ko.observable();
      this.selectedCollection = ko.observable();

      this.classList = ko.observableArray([]);
      this.categoryList = ko.observableArray([]);
      this.collectionList = ko.observableArray([]);

      this.input = ko.observable(word.lemma || '');
      this.classes = ko.observableArray(word.classes || []);
      this.categories = ko.observableArray(word.categories || []);
      this.collections = ko.observableArray(word.collections || []);
      this.isEdit = word.lemma ? true : null;
      this.validationMessage = ko.observable('');
      console.log(word, this.isEdit);

      this.save = function () {
         var word = {
            lemma: self.input(),
            versions: [],
            classes: self.classes(),
            categories: self.categories(),
            collections: self.collections(),
            date: new Date().getTime()
         };
         var index = word.classes.indexOf('other');
         if (index > -1) {
            word.classes.splice(index, 1, this.otherClass());
         }

         if (word.classes.length == 0) {
            this.validationMessage('You need to select one class at least');
            return false;
         }

         dialog.close(this, word);
      }

      this.close = function () {
         dialog.close(this);
      }

      this.otherClass = ko.observable('');
      this.ifOther = ko.computed(function () {
         return self.classes().indexOf('other') > -1;
      });


      this.removeCategory = function (item, e) {
         e.preventDefault();
         self.categories.remove(item);
      }

      this.removeCollection = function (item, e) {
         e.preventDefault();
         self.collections.remove(item);
      }

      this.addCategory = function () {
         addToList(this.categories, this.selectedCategory(), this.categoryList);
      }

      this.addCollection = function () {
         addToList(this.collections, this.selectedCollection(), this.collectionList);
      }

      function addToList(list, item, collection) {
         if (item == "All") {
            list(collection.slice(1));
         } else if (!addIfNotExist(list, item)) {
            app.showMessage('This item already exists.', 'Oops');
         }
      }

      function addIfNotExist(list, item) {
         if (list.indexOf(item) < 0) {
            list.push(item);

            return true;
         }
         return false;
      }
   }

   WordForm.show = function (word) {
      return dialog.show(new WordForm(word || {}));
   };

   WordForm.prototype.activate = function () {
      var base = this;

      ctx.load("classes").then(function (items) {
         base.classList(items);
         var classes = base.classes();
         for (var i = 0; i < classes.length; i++) {
            var css = classes[i];
            if (null == ko.utils.arrayFirst(items, function (css2) { return css == css2; })) {
               base.otherClass(css);
               base.classes.remove(css);
               base.classes.push('other')
            }
         }
      });
      ctx.load("categories").then(function (items) {
         items = $.merge(["All"], items);
         base.categoryList(items);
         base.selectedCategory(items[0]);
      });
      ctx.load("sets").then(function (items) {
         items = $.merge(["All"], items);
         base.collectionList(items);
         base.selectedCollection(items[0]);
      });
   }

   WordForm.prototype.bindingComplete = function (el) {

   }

   return WordForm;
})