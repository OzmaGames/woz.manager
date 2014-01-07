define(['knockout'], function (ko) {
   var ctor = function () {
    var self = this;
    
    this.name = ko.observable();
    
    }
   return ctor;
});