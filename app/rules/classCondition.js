define(['knockout', 'api/datacontext'], function(ko, ctx){
    function Class(amount,css){
       var self = this;
       
       this.amountValue = ko.observable(amount);
       this.selectedClass = ko.observable(css);
       this.classList = ko.observableArray();
       
       ctx.load("classes").then(function (items) {
            this.classList(items);
        });
    }
       return Class;
})