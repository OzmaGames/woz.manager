define(['knockout', 'api/datacontext', './_Condition'], function (ko, ctx, Condition) {

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

    ctx.load("categories").then(function (items) {
      self.categoryList(items);
    });
  }

  //Class inherits from Condition
  Condition.Inherit(Category);

  return Category;
})