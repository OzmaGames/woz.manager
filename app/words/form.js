define(['api/server','api/datacontext', 'plugins/dialog', 'knockout', 'durandal/app', 'bootstrap', 'jquery'], function (socket, ctx, dialog, ko, app, $) {

   var WordForm = function (word) {
      var self = this;

      this.selectedCategory = ko.observable();
      this.selectedCollection = ko.observable();

      this.classList = ko.observableArray([]);
      this.categoryList = ko.observableArray([]);
      this.newCategory = ko.observableArray([]);
      this.collectionList = ko.observableArray([]);

      this.input = ko.observable(word.lemma || '');
      this.classes = ko.observableArray(word.classes || []);
      this.categories = ko.observableArray(word.categories || []);
      this.collections = ko.observableArray(word.collections || []);
      this.displayCollections = ko.observableArray();
      this.isEdit = word.lemma ? true : null;
      this.validationMessage = ko.observable('');

      console.log(word, this.isEdit);

      this.save = function () {
        
        console.log(self.displayCollections());
        console.log(self.collections());
        
        /*var shortCollections = [];
           for (var i = 0; i < self.collections().length; i++) {
              shortCollections.push(self.collections()[i].shortName);
           }*/
         var word = {
            lemma: self.input(),
            versions: [],
            classes: self.classes(),
            categories: self.categories(),
            collections: self.collections(),
            date: new Date().getTime()
         };

         if (word.classes.length == 0) {
            this.validationMessage('You need to select one class at least');
            return false;
         }

         if (word.collections.length == 0) {
            this.validationMessage('You need to select one collection at least');
            return false;
         }
         console.log(word);
         dialog.close(this, word);
      }

      this.close = function () {
         dialog.close(this);
      }

      this.removeCategory = function (item, e) {
         e.preventDefault();
         self.categories.remove(item);
      }

      this.removeCollection = function (item, e) {
         e.preventDefault();
         self.displayCollections.remove(item);
      }

      this.addCategory = function () {
         addToList(this.categories, this.selectedCategory(), this.categoryList);
      }

      this.addCollection = function () {
        if (this.selectedCollection().longName === 'All') {
            var forAll = this.collectionList.slice(1);
            var longNames = [],
                shortNames=[];
            for (var i=0; i<forAll.length; i++) {
                longNames.push(forAll[i].longName);
                shortNames.push(forAll[i].shortName);
            }
            this.displayCollections(longNames);
            this.collections(shortNames);
            
        } else if (self.displayCollections.indexOf(this.selectedCollection().longName) < 0){
          this.displayCollections.push(this.selectedCollection().longName);
          this.collections.push(this.selectedCollection().shortName);
          
          } else {app.showMessage('This item already exists.', 'Oops');}
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
   
   this.addNewCategory = function (){
       this.categoryList.push(this.newCategory());
    }

   WordForm.show = function (word) {
      return dialog.show(new WordForm(word || {}));
   };

   WordForm.prototype.activate = function () {
      var base = this;

      ctx.load("classes").then(function (items) {
         base.classList(items);
      });
      
      socket.emit("manager:categories", { command: 'getAll' }, function (data) {
         categories = $.merge(["All"], data.categories);
         categoryPos = categories.indexOf("");
         categories.splice(categoryPos, 1);
         base.categoryList(categories);
         base.selectedCategory(categories[0]);
      });
      
      socket.emit('manager:collections', { command: 'getAll' }, function (data) {
        console.log(data);
         collections = $.merge([{longName: "All", shortName : 'All'}], data.collections);           
         base.collectionList(collections);
         base.selectedCollection(collections[0]);
         
          var dic = {};
         for (var i = 0; i < collections.length; i++) {
            dic[collections[i].shortName] = collections[i].longName;
         }
          var sub = ko.computed(function () {
            var receivedCollections = base.collections();
            if (receivedCollections.length) {
               
               //ko.utils.arrayForEach(words, function (word) {
                  //remove previous collections, so that they wont appear again if the user has removed them
                  //word.displayCollections.splice(0, word.displayCollections().length);
                    console.log(base.collections());                
                  ko.utils.arrayForEach(receivedCollections, function (col) {
                     if (!dic[col]) dic[col] = 'unknown';
                     base.displayCollections().push(dic[col]);
                     base.displayCollections.valueHasMutated();
                     
                  });
               //});
               
               //sub.dispose(); //kill the computed func, so it wont run again               
            }
         });
      })

      /*ctx.load("categories").then(function (items) {
         items = $.merge(["All"], items);
         base.categoryList(items);
         base.selectedCategory(items[0]);
      });*/

      /*ctx.load("sets").then(function (items) {
         items = $.merge(["All"], items);
         base.collectionList(items);
         base.selectedCollection(items[0]);
      });*/
   }

   WordForm.prototype.bindingComplete = function (el) {

   }

   return WordForm;
})