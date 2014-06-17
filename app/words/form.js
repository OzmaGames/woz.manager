define(['api/server','api/datacontext', 'plugins/dialog', 'knockout', 'durandal/app', 'bootstrap', 'jquery'], 
  function (socket, ctx, dialog, ko, app, $) {


    var _collectionList = ko.observableArray(), 
          _collections = ko.observableArray();
          _displayCollection = ko.computed(function(){
              return _collections().map(ToLongNames);
          });
    var dicToShortName, dicToLongName;

    ko.computed(function(){
      var col = _collectionList();
      dicToShortName = {};
      dicToLongName = {};
      for (var i = 0; i < col.length; i++) {
          dicToShortName[col[i].longName] = col[i].shortName;
          dicToLongName[col[i].shortName] = col[i].longName;
          for (var j = 0; j < col[i].boosters.length; j++){
             dicToShortName[col[i].boosters[j].longName] = col[i].boosters[j].shortName;
              dicToLongName[col[i].boosters[j].shortName] = col[i].boosters[j].longName;
          }
      }  


      _collections.valueHasMutated();
    });

    function ToShortNames(name){
      return dicToShortName[name];
    }
    
    function ToLongNames(name){
      return dicToLongName[name];
    }


   var WordForm = function (word) {
      var self = this;

      this.selectedCategory = ko.observable();
      this.selectedCollection = ko.observable();

      this.classList = ko.observableArray([]);
      this.categoryList = ko.observableArray([]);
      this.newCategory = ko.observable();
      this.collectionList = _collectionList;
      this.collections = _collections;
      this.displayCollections = _displayCollection;
      
      this.input = ko.observable(word.lemma || '');
      this.classes = ko.observableArray(word.classes || []);
      this.categories = ko.observableArray(word.categories || []);
      this.isEdit = word.lemma ? true : null;
      this.validationMessage = ko.observable('');

      _collections(word.collections || []);

      console.log(ToShortNames);

      this.save = function () {

       var word = {
            lemma: self.input(),
            classes: self.classes(),
            categories: self.categories(),
            collections: self.collections(),
            date: new Date().getTime(),
            versions:[]
         };

         console.log(word);

         if (word.classes.length == 0) {
            this.validationMessage('You need to select one class at least');
            return false;
         }

         if (word.collections.length == 0) {
            this.validationMessage('You need to select one collection at least');
            return false;
         }
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
         self.collections.remove(item);
         var itemPos = self.collections.indexOf(item);
         self.collections.splice(itemPos, 1);
         
      }

      this.addCategory = function () {
         addToList(this.categories, this.selectedCategory(), this.categoryList);
         
      }

      this.addCollection = function () {
        if (!(self.selectedCollection() === 'Select a collection')) {
           if (self.displayCollections().indexOf(self.selectedCollection()) < 0){
              self.collections.push(ToShortNames([self.selectedCollection()]));
              console.log(self.collections());
          
          } else {app.showMessage('This item already exists.', 'Oops');}
        }
        
      }
      
      function addToList(list, item, collection) {
         if (item == "Select a category") {
            return true;
            //list(collection.slice(1));
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
        
        
        /*if (this.selectedCollection().longName === 'All') {
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
          
          } else {app.showMessage('This item already exists.', 'Oops');}*/
   
   
   this.addNewCategory = function (){
      self.categoryList.push(self.newCategory());
       self.categoryList().sort();
       self.categoryList.valueHasMutated();
       self.newCategory("");
       alert("To save this new category, add it as a category for this word ");
     }
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
         categories = $.merge(["Select a category"], data.categories);
         categoryPos = categories.indexOf("");
         categories.splice(categoryPos, 1);
         base.categoryList(categories.sort());
         base.selectedCategory(categories[0]);
      });
      
      socket.emit('manager:collections', { command: 'getAll' }, function (data) {
        console.log(data);
         collections = $.merge([], data.collections); 
         //collections = $.merge([{longName: "All", shortName : 'All'}], data.collections);           
         for(var i=0; i< collections.length; i++){
            collections[i].boosters.unshift({'longName': collections[i].longName, 'shortName': collections[i].shortName});
         }
         base.collectionList(collections);
         base.selectedCollection(collections[0]);         
         //  var dic = {};

         // for (var i = 0; i < collections.length; i++) {
         //    dic[collections[i].shortName] = collections[i].longName;
         //    for (var j = 0; j < collections[i].boosters.length; j++){
         //       dic[collections[i].boosters[j].shortName] = collections[i].boosters[j].longName;
         //     }
         // }
         // console.log(dic);
         //  var sub = ko.computed(function () {
         //    base.displayCollections([]);
         //    var receivedCollections = base.collections();
         //    if (receivedCollections.length) {
               
         //       //ko.utils.arrayForEach(words, function (word) {
         //          //remove previous collections, so that they wont appear again if the user has removed them
         //          //word.displayCollections.splice(0, word.displayCollections().length);
         //            console.log(base.collections());                
         //          ko.utils.arrayForEach(receivedCollections, function (col) {
         //             if (!dic[col]) dic[col] = 'unknown';
         //             base.displayCollections().push(dic[col]);
         //             base.displayCollections.valueHasMutated();
                     
         //          });
         //       //});
               
         //       //sub.dispose(); //kill the computed func, so it wont run again               
         //    }
         // });
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

   return WordForm;
})