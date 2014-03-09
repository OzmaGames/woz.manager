        define(['api/datacontext', 'plugins/dialog', 'knockout', 'durandal/app', './checkForm','api/server', 'bootstrap'], function (ctx, dialog, ko, app, checkForm,socket) {
           var VersionForm = function (word) {
              var self = this;
        
              self.word = word;
              self.input = ko.observable();
              self.classList =[{abv:"non", full:"noun"},{abv:"vrb", full:"verb"},{abv:"adj",full:"adjective"},{abv:"adv", full:"adverb"},{abv:"prep", full:"preposition"},{abv:"pron", full:"pronoun"},{abv:"conj", full:"conjuction"},{abv:"impt", full:"important"}];
              self.categoryList = ko.observableArray();
              self.categories = ko.observableArray($.merge([], word.categories) || []);
              self.selectedCategory = ko.observable();
              self.classes = ko.observableArray($.merge([], word.classes) || []);
              self.modClass = ko.observableArray();
              self.j = ko.observableArray();
              self.versions = ko.observableArray(word.versions || []);
              self.oldVersion = ko.observable();
              self.editMode = ko.observable(false);
        
              console.log($.merge([], word.classes));
              //ko.utils.arrayForEach(word.versions, function (v) {
                // v.editMode = ko.observable(false);
              //});
        
              this.save = function () {
                console.log(self.versions());
                 dialog.close(this, self.versions());
                 
              }
              
              var dic= {};
              for (var i=0; i<self.classList.length; i++) {
               dic[self.classList[i].full]= self.classList[i].abv;
              }
              console.log(dic);
              
              var dic1= {};
              for (var i=0; i<self.classList.length; i++) {
               dic1[self.classList[i].abv]= self.classList[i].full;
              }
              
              ko.utils.arrayForEach(self.classes(), function(classes){
                self.modClass.push(dic[classes]);
             })
              
              
              this.add = function () {
                 if (null == ko.utils.arrayFirst(self.versions(), function (v) { return v.lemma.toLowerCase() === self.input() }) && self.input()) {
                     ko.utils.arrayForEach(self.modClass(), function(classes){
                     self.j.push(dic1[classes]);
                     })
                    self.versions.push({
                       lemma: self.input(),
                       classes: self.j(),
                       //editMode: ko.observable(false),
                       categories: $.merge([], self.categories()),
                       collections:[],
                       oldlemma:self.input()
                    });
                 } else if (!self.input()) {
                    app.showMessage('Please enter a version.', 'Oops');
                 } else { app.showMessage('This version already exists.', 'Oops') }
        
              }
              
              this.edit = function (version) {
                self.editMode(true);
                //version.lemma = ko.observable(version.lemma);
                self.input(version.lemma);
                self.oldVersion(version.lemma);
                self.modClass().length = 0;
                for(var i=0; i< version.classes.length; i++){
                   self.modClass.push(dic[version.classes[i]]);
                };
                self.categories().length = 0;
                self.categories.push(version.categories);
                console.log(self.oldVersion());
                 
                //
                 //version.lemma = ko.observable(version.lemma);
                 //version.classes = ko.observableArray(version.classes);
                 //version.editMode(true);
              }
              
              
              this.update = function () {
                
                var oldold = ko.utils.arrayFirst(word.versions, function(version){
                    return version.lemma = self.oldVersion();
                    });
               
                ko.utils.arrayForEach(self.modClass(), function(classes){
                     self.j.push(dic1[classes]);
                     })
                var newnew = {
                    lemma: self.input(),
                    classes: self.j(),
                    categories: self.categories()
                }
                
                console.log(self.oldVersion());
                console.log(oldold);
                
                self.versions.replace(oldold, newnew);
                self.editMode(false);
                
                 //version.classes = self.modClass();
                 //version.editMode(false);
              }
        
              this.cancel = function (version) {
                 self.editMode(false);
              }
        
              this.remove = function (word) {
                 checkForm.show(word).then(function (response) {
                    if (response) {
                       var pos = self.versions.indexOf(response);
                       self.versions.splice(pos, 1);
                    }
                 })
              }
              
              this.addCategory = function () {
                if (self.selectedCategory() != "Select a category") {
                    if (self.categories.indexOf(self.selectedCategory()) < 0) {
                        self.categories.push(self.selectedCategory());
                    }else{app.showMessage('This item already exists.', 'Oops');}
                    
                }
             }
        
              this.removeCategory = function(category){
                self.categories.remove(category);
              }
               self.rows = ko.computed(function () {
                    var rows = [],
                    currentRow,
                    colLength = 4;
                     for (var i = 0, j = self.categories().length; i < j; i++) {
                          if (i % colLength === 0) {
                             if (currentRow) {
                                rows.push(currentRow);
                             }
                             currentRow = [];
                          }
                          currentRow.push(self.categories()[i]);
                       }
                       if (currentRow) {
                          rows.push(currentRow);
                       }
                       return rows;
                    
                 });
              
              this.close = function () {
                 dialog.close(this);
              }
           }
        
           VersionForm.show = function (word) {
              return dialog.show(new VersionForm(word || {}));
           };
        
           VersionForm.prototype.activate = function () {
              var base = this;
              socket.emit("manager:categories", { command: 'getAll' }, function (data) {
                 categories = $.merge(["Select a category"], data.categories);
                 categoryPos = categories.indexOf("");
                 categories.splice(categoryPos, 1);
                 base.categoryList(categories.sort());
                 base.selectedCategory(categories[0]);
              });
             // ctx.load("classes").then(function (items) {
               //  base.classList(items);
              //});
           }
        
           VersionForm.prototype.bindingComplete = function (el) {
        
           }
        
           return VersionForm;
        });
