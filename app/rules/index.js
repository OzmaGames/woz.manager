define(['./setList', './RuleList', 'knockout'], function(setList,RuleList, ko) {
    
    var Table = function () {
        var self = this;
        self.selectedClass= ko.observable(setList[0]);
        
        self.filter = function (item, filter) {
          return item.classe == filter;   
        }
        
        self.filteredTable = ko.computed(function(){
              
              if (self.selectedClass().name !=='All') {
                
                var filter = self.selectedClass().name;
                return result= ko.utils.arrayFilter(RuleList, function (item) {
                return self.filter (item, filter)
                });
              } else {
                return RuleList;
              }
            });
    }
    
    var table = new Table ();
    
    
    
    return {
        
        selectedClass: table.selectedClass,
        setList:setList,
        filteredTable:table.filteredTable,
        addRule: function () { router.navigate('new-rules'); }
     }
})

