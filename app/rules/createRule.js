define(['api/datacontext', 'plugins/dialog', 'knockout', 'durandal/app', 'jquery', 'plugins/router'], function (ctx, dialog, ko, app, $, router) {
    
    
    var RuleForm = function(){
        var self = this;
        
        this.shortDes = ko.observable();
        this.longDes = ko.observable();
        
        this.classList = ko.observableArray([]);
        this.categoryList = ko.observableArray([]);
        this.collectionList = ko.observableArray([]);
        this.selectedCollection = ko.observable();
        this.collections = ko.observableArray([]);
        
        this.selectedCategory = ko.observable();
        this.selectedClass = ko.observable();
        this.startWithValue = ko.observable();
        this.endWithValue = ko.observable();
        this.numberOfLettersValue = ko.observable();
        this.enableAdd = ko.observable();
        this.listToInclude = ko.observableArray([]);
        this.amountValue = ko.observable();
        
        this.save = function(){
            ctx.load('rules').then(function(rules){
                   var newRule = {
                        shortDescription: self.shortDes(),
                        longDescription: self.longDes(),
                        collections: self.collections(),
                    }
                    rules.push(newRule);
                    router.navigate('#rules');
                    })
        }
        
        this.cancel = function () {
            router.navigate('#rules');
            
        }
        
        this.addSet = function(){
            var select = this.selectedCollection();
            if(this.collections.indexOf(select)<0){
               self.collections.push(select);
            } else {app.showMessage("This item already exists","Oops");}
        }
        
        this.removeSet = function (item, e) {
            e.preventDefault();
            self.collections.remove(item);
        }
        
        
        this.lineToInclude = ko.computed(function() {
            var line = this;
            line.amountValue = self.amountValue();
            line.enableAdd = self.enableAdd();
            ko.computed(function() {
                var add = self.enableAdd(); 
                if(add == "word class: "){ line.selected = self.selectedClass()}
                else if (add == "category: ") {line.selected = self.selectedCategory()}
                else if (add == "words that start with the letter: ") {line.selected = self.startWithValue()}
                else if (add == "words that end with the letter: ") {line.selected = self.endWithValue()}
                else {line.selected = self.numberOfLettersValue()}
            })
        })
        
         
        this.addToInclude = function () {
            self.listToInclude.push(self.lineToInclude());
        }
    }
    
    RuleForm.prototype.activate = function (id) {
        var base = this;
        
        if (id!== null) {
            ctx.load('rules').then(function(rules){
            var foo =  ko.utils.arrayFirst(rules, function(rule){ return rule.id == id })
            if (foo) {
                base.shortDes(foo.shortDescription);
                base.longDes(foo.longDescription);
                base.collections(foo.collections);
            }
        });
        }
        
        ctx.load("classes").then(function (items) {
            base.classList(items);
            base.selectedClass(items[0]);
        });
        
        ctx.load("categories").then(function (items) {
            base.categoryList(items);
            base.selectedCategory(items[0]);
        });

        ctx.load("sets").then(function (sets) {
            base.collectionList(sets);
            base.selectedCollection(sets[0]);
        });
    }
    
    return RuleForm;

    })