define(['api/server','api/datacontext', 'plugins/dialog', 'knockout', 'durandal/app', 'bootstrap', 'jquery'], function (socket, ctx, dialog, ko, app, $) {
    
    var tileForm = function (tile) {
      var self = this;

      this.tileName = ko.observable(tile.name || '');
      this.tileId = ko.observable(tile.id || '')
      this.collectionList = ko.observableArray();
      this.selectedCollection = ko.observable();
      
      

      this.saveTile = function(){
        var dic = {};
        var col = self.collectionList();
        for (var i = 0; i < col.length; i++) {
            dic[col[i].longName] = col[i].shortName;
            for (var j = 0; j < col[i].boosters.length; j++){
               dic[col[i].boosters[j].longName] = col[i].boosters[j].shortName;
             }
           }

        var tile = {
          collection: dic[this.selectedCollection()],
          id: this.tileId(),
          name: this.tileName(),
          related:[],
          displayCollection: this.selectedCollection()
        };
        console.log(tile);

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
    collections = $.merge([{longName: "Select a collection", shortName: 'select a collection', boosters:[]}], data.collections);   
    for(var i=0; i< collections.length; i++){
            collections[i].boosters.push({'longName': collections[i].longName, 'shortName': collections[i].shortName}); 
          }

    base.collectionList(collections);

  })
   }

   return tileForm;
});