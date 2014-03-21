define(['knockout', 'plugins/dialog'], function (ko, dialog) {
   var ctor = function () {
    var self = this;
    
    this.name = ko.observable();
    
    }
    ctor.show = function () {
      return dialog.show(new ctor());
   };
   return ctor;
});