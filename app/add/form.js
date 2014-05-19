define(['api/server','api/datacontext', 'plugins/dialog', 'knockout', 'durandal/app', 'bootstrap', 'jquery'], function (socket, ctx, dialog, ko, app, $) {
    
    var collForm = function (col) {
      var self = this;

      console.log(col);

      this.shortName = ko.observable(col.shortName || '');
      this.longName = ko.observable(col.longName || '');
      this.description = ko.observable(col.description || '');
      this.price = ko.observable(col.price || 0 );
      this.flags = ko.observable(col.flags || '');
      this.isEdit = ko.observable(false);

      if(col.longName){self.isEdit(true);}
      
      this.saveCollection = function(){
      	var col = {
      	longName : this.longName(),
      	shortName : this.shortName(),
      	description : this.description(),
      	price : this.price()* 1,
      	flags : this.flags(),
      	};

        console.log(col);


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