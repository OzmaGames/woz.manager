define(['api/datacontext','./tileForm' ,'knockout'], function(ctx,form,ko){
    var ctor = function(){
        var self=this;
        
        self.sets= ko.observableArray([]);
        self.tiles= ko.observableArray([]);
        
        self.selectedSet= ko.observable();
        
        self.addTile = function(){
            form.show().then(function(newTile){
                if(newTile) self.tiles.push(newTile);
                })
        }
    }
    ctor.prototype.activate = function () {
        var base = this;

        ctx.load("tiles").then(function (tiles) {
            base.tiles(tiles);
        });

        ctx.load("sets").then(function (sets) {
            sets.unshift('All');
            base.sets(sets);
            base.selectedSet(sets[0]);
        });
    }
    return ctor;
    })