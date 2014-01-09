define(['knockout', 'api/datacontext', './_Condition'], function (ko, ctx, Condition) {

  function End(letter) {
    var self = this;

    this.letter = ko.observable(letter);

    this.getCondition = function () {      
      return {
        letter: self.letter(),
        amount: self.amount(),
        type: self.type,
        editMode: false
      };
    }
    }

  Condition.Inherit(End);

  return End;
})