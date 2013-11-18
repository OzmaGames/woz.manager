define(['knockout', 'api/datacontext'], function (ko, ctx) {

  /*All conditions have amount and type*/

  function Condition(type) {
    var self = this;

    this.amount = ko.observable(1);
    this.type = type;
    this.editMode = true;
  }

  Condition.Inherit = function (type) {    
    type.prototype = new Condition(type.name.toLowerCase());
    type.prototype.constructor = type;    
  }

  return Condition;
})