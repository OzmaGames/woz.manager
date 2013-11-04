define(['api/datacontext', 'plugins/dialog', 'knockout', 'durandal/app', 'bootstrap'], function (ctx, dialog, ko, app) {

    var VersionForm = function (word) {
        var self = this;
        
        self.word = word;
        self.input = ko.observable();
        self.classList = ko.observableArray([]);
        self.classes = ko.observableArray([word.versions || []]);
        
        this.save = function() {
            var version = {
                lemma: self.input(),
                classes:self.classes()
            }
            dialog.close(this, version);
        }
        
        this.addVersion = function () {
           
            
               
           
     }
    
    VersionForm.show = function (word) {
        return dialog.show(new VersionForm(word || {}));
    };
    
    VersionForm.prototype.activate = function () {
        var base = this;

        ctx.load("classes").then(function (items) {
            base.classList(items);
        });
    }
     
    VersionForm.prototype.bindingComplete = function (el) {

    }
        
    return VersionForm;
})
