define(['plugins/dialog','words/setList','knockout'], function(dialog, setList,ko) {
    
    var newTile = function () {
        this.input = ko.observable('');
        this.selectedClass= ko.observable();
        
        
    }
    newTile.prototype.save = function() {
       dialog.close(this, this.input());
    };
    
    newTile.prototype.setList = setList;
    
    newTile.show = function(){
        return dialog.show(new newTile);
    };
    
    return newTile;
        
       
})