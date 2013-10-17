define(['api/datacontext', 'plugins/dialog', 'knockout'], function (ctx, dialog, ko) {

    var WordForm = function () {
        this.input = ko.observable('');
        this.versions = ko.observable('');
        this.selectedClass = ko.observable();
        this.selectedCategory = ko.observable();
        this.selectedSet = ko.observable();
        
        this.classes = ko.observableArray([]);
        this.categories = ko.observableArray([]);
        this.sets= ko.observableArray([]);
        
        this.versionList = ko.observableArray([]);
        this.classList = ko.observableArray([]);
        this.categoryList = ko.observableArray([]);
        this.setList= ko.observableArray([]);
        
       
        this.save = function () {
            dialog.close(this, this.input());
        }
        
        this.removeVersion = function(version, e) {
            e.preventDefault();
            this.versionList.remove(version);
        }
        
        this.addVersion = function(){
            if (this.versionList().indexOf(this.versions) < 0) {
              this.versionList.push(this.versions);
              this.versions('');
            }
        }
          
        this.addClass = function() {
            this.classList.push(this.selectedClass());
        }
        
        this.addCategory = function() {
            this.categoryList.push(this.selectedCategory());
        }
        
        this.addSet = function() {
            this.setList.push(this.selectedSet());
        }
        
        
    }  
    WordForm.show = function () {
        return dialog.show(new WordForm);
    };

    WordForm.prototype.activate = function () {
        var base = this;
        ctx.load("classes").then(function (classes) {
            base.classes(classes);
            base.selectedClass(classes[0]);
        });
        ctx.load("categories").then(function (categories) {
            base.categories(categories);
            base.selectedCategory(categories[0]);
        });
        ctx.load("sets").then(function (sets) {
            base.sets(sets);
            base.selectedSet(sets[0]);
        });
    }

    return WordForm;
})