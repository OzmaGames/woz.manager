define(['knockout', 'api/datacontext', './_Condition'], function (ko, ctx, Condition) {

  function Class(amount, css) {
    var self = this;

    this.css = ko.observable(css);
    this.classList = ko.observableArray();

    //return a new object that represent the condition
    this.getCondition = function () {      
      return {
        css: self.css(),
        amount: self.amount(),
        type: self.type,
        editMode: false
      };
    }

    ctx.load("classes").then(function (items) {
      self.classList(items);
    });
  }

  //Class inherits from Condition
  Condition.Inherit(Class);

  return Class;
})