define(['api/datacontext', 'plugins/dialog', 'knockout', 'durandal/app'], function (ctx, dialog, ko, app) {

    var RuleForm = function (rule) {
        
        this.selectedSet = ko.observable();
        this.sets = ko.observableArray ([]);
        
        this.close = function (){
          app.showMessag('hallow');
        }
        
        this.save = function (){
            var rule = this.selectedSet();
            dialog.close(this, rule);
        }
        
        
      
    }
    
    RuleForm.show = function(rule) {
        return dialog.show(new RuleForm(rule || {}));
       
    };
    
    RuleForm.prototype.activate = function () {
        var base = this;
        
        ctx.load("sets").then(function (sets) {
            base.sets(sets);
            base.selectedSet(sets[0]);
        });
    }
    return RuleForm;
})