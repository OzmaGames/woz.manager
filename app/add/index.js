define(['knockout', 'api/server'], function (ko, socket) {
   var ctor = function () {
    var self = this;
    this.shortName = ko.observable();
    this.longName = ko.observable();
    this.newBooster = ko.observable();
    this.collectionList = ko.observableArray();
    this.selectedCollection = ko.observable();
    this.tileName = ko.observable();
    this.tileId = ko.observable();
    this.tabIndex = ko.observable(1);
    console.log(this.tabIndex());
    
   
   this.saveCollection = function () {
      socket.emit('manager:collections', {command: 'set', longName:self.longName(), shortName:self.shortName()}, function (data){
         console.log(data);
         if(data.success){
            self.longName('');
            self.shortName('');
         }
         
         })
   }
   
   this.saveBooster = function(){
      //waiting for event
   }
   
   this.saveTile = function(){
      socket.emit('manager:images', {command:'set', related:[], id:self.tileId(), name:self.tileName()}, function(data){
         console.log(data);
         if (data.success) {
             self.tileId('');
             self.tileName('');
         }
        
         });
   }
    
   }
    
    ctor.prototype.activate = function () {
      var base = this;
      socket.emit('manager:collections', { command: 'getAll' }, function (data) {
        console.log(data);
        
        collections = $.merge([{longName:"Select a collection"}, {shortName:"Select a collection" }], data.collections);           
         base.collectionList(collections);
         base.selectedCollection(collections[0]);
      })
      
    }
   return ctor;
});