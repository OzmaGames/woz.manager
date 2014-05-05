define(['api/server','api/datacontext', 'plugins/dialog', 'knockout', 'durandal/app', 'bootstrap', 'jquery'], function (socket, ctx, dialog, ko, app, $) {
    
    var tileForm = function (tile) {
      var self = this;

      this.tileName = ko.observable(tile.name || '');
      this.tileId = ko.observable(tile.id || '')
      this.collectionList = ko.observableArray();
      this.selectedCollection = ko.observable();
      
      

      this.saveTile = function(){
        var tile = {
          collection: this.selectedCollection(),
          id: this.tileId(),
          name: this.tileName(),
          related:[]
        };

        dialog.close(this, tile)
      }
      
      
      this.close = function () {
         dialog.close(this);
      }
  }

   tileForm.show = function (tile) {
      return dialog.show(new tileForm(tile || {}));
   };

   tileForm.prototype.activate = function(){
    var base = this;
    
    socket.emit('manager:collections', { command: 'getAll' }, function (data) {     
    collections = $.merge([{longName: "Select a collection", shortName: 'select a collection'}], data.collections);    
    base.collectionList(collections);

  })
   }

   return tileForm;
});