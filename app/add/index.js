define(['knockout', 'api/server', "./form", "./checkForm", "./tileForm"], function (ko, socket, form, checkForm, tileForm) {
   var ctor = function () {
    var self = this;
    
   
    this.collectionList = ko.observableArray();
    this.tileList = ko.observableArray();
    this.tileName = ko.observable();
    this.tileId = ko.observable();
    this.tabIndex = ko.observable(1);

    this.addCollection = function(){
     form.show().then(function(col){
       if(col){
        socket.emit('manager:collections', {command: 'set', longName:col.longName, shortName:col.shortName,
         description:col.description, price:col.price, flags: col.flags, type:"starter"}, 
         function(data){
           if (data.success){
            col.boosters = [];
            self.collectionList.push(col);
          }
        });
      }    
    })
   }

    this.editCollection = function(collection){
      form.show(collection).then(function(col){ 
       if(col){
        socket.emit('manager:collections', {command: 'set', longName:col.longName, shortName:collection.shortName,
         description:col.description, price:col.price,
         flags: col.flags, type:"starter"}, function(data){
          console.log(data);
          if(data.success){
            var pos = self.collectionList.indexOf(collection);
            col.boosters = collection.boosters;
            self.collectionList.splice(pos, 1, col);
          };
         });
        }
      });
    }


    this.removeCollection= function(col){
       checkForm.show(col).then(function(response){
        if(response){
           socket.emit('manager:collections', {command:'delete', collection: col.shortName},function(data){
          console.log(data);
          if(data.success){
          var pos = self.collectionList.indexOf(col);
          self.collectionList.splice(pos, 1);
        }
        });
         }

       })
    }

    this.addBooster = function (collection){
      form.show().then(function(booster){
        if(booster){
          socket.emit('manager:collections', {command: 'set', collection:collection.shortName ,longName:booster.longName, shortName:booster.shortName,
           description:booster.description, price:booster.price, flags: booster.flags, type:"booster"}, function(data){
            console.log(data);
            if(data.success){
             collection.boosters.push(booster);
             var pos = self.collectionList.indexOf(collection);
             self.collectionList.splice(pos, 1);
             self.collectionList.splice(pos, 0, collection)
           }
          });
        }
      });
    }

    this.editBooster= function(booster){
      form.show(booster).then(function(boost){
        if(boost == null){
         
        }else{
          var col = ko.utils.arrayFirst(self.collectionList(), function(collection){ return collection.boosters.indexOf(booster) >= 0 });
          socket.emit('manager:collections', {command: 'set', collection:col.shortName, shortName:booster.shortName, longName:boost.longName,
           description:boost.description, price:boost.price, flags: boost.flags, type:"booster"}, function(data){
            
            if(data.success){
              var pos = col.boosters.indexOf(booster);
              col.boosters[pos] = boost;
              var colPos = self.collectionList.indexOf(col);
              self.collectionList.splice(colPos, 1);
              self.collectionList.splice(colPos, 0, col);
            }
           });
        };

      });
    }

    this.addTile = function(){
      tileForm.show().then(function(tile){
        if(tile){
        socket.emit('manager:images', {command:'set', collection:tile.collection, id:tile.id, name: tile.name, related: []}, function(data){
          console.log(data);
          if(data.success){
            self.tileList.push(tile);
          }
        });
      }
      });
    };

    this.editTile = function(tile){
      tileForm.show(tile).then(function(editedTile){

      });
    };

    this.removeTile = function(tile){
      checkForm.show(tile).then(function(response){
        if(response){
          socket.emit('manager:images', {command:'delete', image:tile.name}, function(data){
            console.log(data);
            var pos = self.tileList.indexOf(tile);
            self.tileList.splice(pos, 1);
          });
        }
      })
      
    };





}    
ctor.prototype.activate = function () {
  var base = this;
  socket.emit('manager:collections', { command: 'getAll' }, function (data) {
    console.log(data);
    collections = data.collections;           
    base.collectionList(collections);
  })

  socket.emit('manager:images', {command:'getAll'}, function(data){
    console.log(data);
    base.tileList(data.images);
  });

}
return ctor;
});