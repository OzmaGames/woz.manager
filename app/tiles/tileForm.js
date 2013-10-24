define(['api/datacontext','plugins/dialog','knockout'], function(ctx,dialog,ko) {
    
    var TileForm = function () {
        this.tile = ko.observable('');
        this.selectedSet= ko.observable();
        
        this.sets = ko.observableArray([]);
        
        var base=this;
        this.save = function() {
        dialog.close(this, base.tile());
        }
        
        this.cancel = function() {
            dialog.close(this);
        }
    }
    
    TileForm.show = function(){
        return dialog.show(new TileForm());
    };
    
    TileForm.prototype.activate = function () {
        var base = this;
        ctx.load("sets").then(function (sets) {
            base.sets(sets);
            base.selectedSet(sets[0]);
        });
    }
    
    return TileForm;
})