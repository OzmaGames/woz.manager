define(['knockout', 'api/datacontext', './_Condition'], function (ko, ctx, Condition) {

  function Category(category) {
    var self = this;

    this.category = ko.observable(category);
    this.categoryList = ko.observableArray();


    //return a new object that represent the condition
    this.getCondition = function () {      
      return {
        category: self.category(),
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