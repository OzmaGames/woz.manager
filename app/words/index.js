define(['./newWord','./wordsList','./classList', './setList', 'knockout'],function (newWord,wordsList, classList, setList, ko){
    
    var Table = function () {
           var self = this;
           
           self.selectedClass= ko.observable(classList[0]);
          
           self.filter = function (item, filter) {
            return item.classe == filter;
           }
           
          self.filteredTable = ko.computed(function(){
              
              if (self.selectedClass().name!=='All') {
                var filter = self.selectedClass().name;
                return ko.utils.arrayFilter(wordsList, function (item) {
                 return self.filter (item, filter)
                });
              } else {
                return wordsList;
              }
            });
          
    };
    var table = new Table();
    return {
        
        addWord: function () {newWord.show();},
        classList:classList,
        setList:setList,
        filteredTable:table.filteredTable,
        selectedClass: table.selectedClass,
        
        };
})