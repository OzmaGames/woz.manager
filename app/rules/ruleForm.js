define(['api/datacontext', 'plugins/dialog', 'knockout', 'durandal/app', 'bootstrap', 'jquery'], function (ctx, dialog, ko, app, $) {
    
    
    var RuleForm = function(){
        var self = this;
        
        this.shortRule = ko.observable("");
        this.longRule = ko.observable("");
        
        this.classList = ko.observableArray([]);
        this.categoryList = ko.observableArray([]);
        this.setList = ko.observableArray([]);
        this.selectedSet = ko.observable();
        this.sets = ko.observableArray([]);
        
        this.selectedCategory = ko.observable();
        this.selectedClass = ko.observable();
        this.startWithValue = ko.observable();
        this.endWithValue = ko.observable();
        this.numberOfLettersValue = ko.observable();
        this.enableAdd = ko.observable();
        this.listToInclude = ko.observableArray([]);
        this.amountValue = ko.observable();
        this.value = ko.observable();
        
        
        
        this.save = function(){
            var toSave = {
                ruleList: [self.shortRule()]                
            }
            
            dialog.close(this, toSave);
        }
        
         this.cancel = function(){
            dialog.close(this);
        }
        
        this.addSet = function(){
            var select = this.selectedSet();
            if(select == "All"){
              this.sets(this.setList.slice(1));
            } else if( this.sets.indexOf(select)<0){
              self.sets.push(select);
            }else {app.showMessage("This item already exists","Oops");}
                
        }
        
        this.removeSet = function (item, e) {
            e.preventDefault();
            self.sets.remove(item);
        }
        
        this.lineToInclude = function() {
            var line = this;
            
            line.amountValue = self.amountValue();
            line.enableAdd = self.enableAdd();

         }
        
         
        this.addToInclude = function () {
            this.listToInclude.push(new this.lineToInclude());
        }
    }

    RuleForm.show = function () {
        return dialog.show(new RuleForm());
    };
    
    RuleForm.prototype.activate = function () {
        var base = this;
        ctx.load("classes").then(function (items) {
            items = $.merge(["All"], items);
            base.classList(items);
            base.selectedClass(items[0]);
        });
        
        ctx.load("categories").then(function (items) {
            items = $.merge(["All"], items);
            base.categoryList(items);
            base.selectedCategory(items[0]);
        });

        ctx.load("sets").then(function (items) {
            items = $.merge(["All"], items);
            base.setList(items);
            base.selectedSet(items[0]);
        });
    }
    
    return RuleForm;

    })