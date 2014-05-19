define(['api/server','api/datacontext', 'plugins/dialog', 'knockout', 'durandal/app', 'bootstrap', 'jquery'], function (socket, ctx, dialog, ko, app, $) {
    
    var tileForm = function (tile) {
      var self = this;
      console.log(tile)

      this.tileName = ko.observable(tile.name || '');
      this.tileId = ko.observable(tile.id || '')
      this.collectionList = ko.observableArray();
      this.selectedCollection = ko.observable();
     
       ko.computed( function () {
         self.collectionList();

         self.selectedCollection( tile.displayCollection || '' );
      } ) 
      

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



      this.removeCollection = function(col){
           self.displayCollection.remove(col);
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
    for(var i=0; i< collections.length; i++){
            collections[i].boosters.unshift({'longName': collections[i].longName, 'shortName': collections[i].shortName}); 
          }

    base.collectionList(collections);

  })
   }

   return tileForm;
});