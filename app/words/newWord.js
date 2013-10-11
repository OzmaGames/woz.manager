define(['plugins/dialog','./classList','knockout'], function(dialog,classList,ko) {
    
    var AddWordPage = function () {
        this.input = ko.observable('');
        this.selectedClass= ko.observable();
        
        
    }
    AddWordPage.prototype.save = function() {
       dialog.close(this, this.input());
    };
    
    AddWordPage.prototype.classList = classList;
    
    AddWordPage.show = function(){
        return dialog.show(new AddWordPage);
    };
    
    return AddWordPage;
        
       
})