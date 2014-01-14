define(['knockout', 'api/datacontext', './_Condition', 'api/server'], function (ko, ctx, Condition, socket) {

  function Category(letter) {
    var self = this;

    this.letter = ko.observable(letter);
    this.categoryList = ko.observableArray();


    //return a new object that represent the condition
    this.getCondition = function () {      
      return {
        letter: self.letter(),
        amount: self.amount(),
        type: self.type,
        editMode: false
      };
    }
    
    socket.emit("manager:categories", {command:'getAll'}, function(items){
      self.categoryList(items.categories);
      categoryPos = self.categoryList.indexOf("");
      self.categoryList.splice(categoryPos, 1);
      });

    /*ctx.load("categories").then(function (items) {
      self.categoryList(items);
    });*/
  }

  //Class inherits from Condition
  Condition.Inherit(Category);

  return Category;
})