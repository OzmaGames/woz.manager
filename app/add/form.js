define(['api/server','api/datacontext', 'plugins/dialog', 'knockout', 'durandal/app', 'bootstrap', 'jquery'], function (socket, ctx, dialog, ko, app, $) {
    
    var collForm = function (col) {
      var self = this;


      this.shortName = ko.observable(col.shortName || '');
      this.longName = ko.observable(col.longName || '');
      this.description = ko.observable(col.description || '');
      this.price = ko.observable(col.price || '');
      this.featured = ko.observable(col.flags || false);
      this.new = ko.observable(col.flags || false);
      this.flags = ko.observableArray(col.flags || '');
      this.isEdit = ko.observable(false);

      if(col.longName){self.isEdit(true);}
      
      this.saveCollection = function(){
      	var col = {
      	longName : this.longName(),
      	shortName : this.shortName(),
      	description : this.description(),
      	price : this.price(),
      	flags : this.flags(),
      	};

        dialog.close(this, col);
   }

       this.close = function () {
         dialog.close(this);
      }

      this.deleteCol = function(col){
          dialog.close(this, null);
      }
  }

   collForm.show = function (col) {
      return dialog.show(new collForm(col || {}));
   };

   return collForm;
});