define(['knockout', 'api/datacontext', './_Condition'], function (ko, ctx, Condition) {

  function Class(letter) {
    var self = this;

    this.letter = ko.observable(letter);
    this.classList = ko.observableArray();

    //return a new object that represent the condition
    this.getCondition = function () {      
      return {
        letter: self.letter(),
        amount: self.amount(),
        type: self.type,
        editMode: false
      };
    }

    ctx.load("classes").then(function (items) {
      self.classList(items);
      console.log(self.classList());
    });
  }

  //Class inherits from Condition
  Condition.Inherit(Class);

  return Class;
})