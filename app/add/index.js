define(['knockout', 'api/server'], function (ko, socket) {
   var ctor = function () {
    var self = this;
    
    this.shortName = ko.observable();
    this.longName = ko.observable();
    this.description = ko.observable();
    this.price = ko.observable();
    this.featureFlag = ko.observable();
    this.newFlag = ko.observable();
    this.flags = ko.observableArray();
    this.collectionList = ko.observableArray();
    this.selectedCollection = ko.observable();
    this.tileName = ko.observable();
    this.tileId = ko.observable();
    this.tabIndex = ko.observable(1);
    this.labelText = ko.observable();
    
    ko.computed(function(){
    console.log(self.tabIndex());
      if (self.tabIndex() == 1) {
         self.labelText("Select to Edit");
         self.labelText.valueHasMutated();
      } else if (self.tabIndex() == 2){self.labelText("Collections")}
      });
    
   this.saveCollection = function () {
      if (self.tabIndex() == 1) {
         console.log(self.flags);
         socket.emit('manager:collections', {command: 'set', longName:self.longName(), shortName:self.shortName(),
                                             description:self.description(), price:self.price(),
                                             flags: self.flags(), type:"starter"},
      function (data){
         console.log(data);
         if(data.success){
            self.longName('');
            self.shortName('');
            self.description('');
           
           
         } 
         })
      }else if(self.tabIndex() == 2) {
         console.log("waiting fot the event");
          socket.emit('manager:collections', {command: 'set', longName:self.longName(), shortName:self.shortName(),
                                             description:self.description(), price:self.price(),
                                             flags: self.flags(), type:"booster", collection:self.selectedCollection().shortName},
                                             
         function (data){
         console.log(data);
         if(data.success){
            self.longName('');
            self.shortName('');
            self.description('');
         } 
         })
      }else if(self.tabIndex() == 3) {
         console.log(self.selectedCollection().shortName);
          socket.emit('manager:images', {command:'set', related:[], id:self.tileId(), name:self.tileName(), collection:self.selectedCollection().shortName}, function(data){
         console.log(data);
         if (data.success) {
             self.tileId('');
             self.tileName('');
         }
        
         });
      }
   }
   
   this.cancel = function(){
      if (self.tabIndex() == 1 || self.tabIndex() == 2) {
         self.longName('');
         self.shortName('');
         self.description('');
         self.price('');
         self.flags([]);
      } else if ( self.tabIndex() == 3){
         console.log('a');
         self.tileName('');
         self.tileId('');
      }
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