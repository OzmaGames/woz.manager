define(['api/datacontext', 'plugins/dialog', 'knockout', 'durandal/app', 'jquery', 'plugins/router', './conditions/class', './conditions/category', './conditions/begin', './conditions/end', './conditions/count', 'api/server'],
  function (ctx, dialog, ko, app, $, router, Class, Category, Begin, End, Count, socket) {

     //only for local storage purpose
     //var lastId = 100;

     var RuleForm = function () {
        var self = this;

        this.selectedLevel = ko.observable();
        this.bonus = ko.observable();
        this.mult = ko.observable();
        this.number = ko.observable();
        this.enableBonus = ko.observable();
        this.shortDes = ko.observable();
        this.longDes = ko.observable();
        this.id = ko.observable(-1);

        this.collectionList = ko.observableArray();
        this.collections = ko.observableArray();
        this.selectedCollection = ko.observable();

        this.conditions = ko.observableArray();
        this.newConditions = ko.observableArray();
        this.convertedCondition = ko.observableArray();

        this.validationMessage = ko.observable('');


        this.condit = ko.observableArray();
        this.save = function () {
           var shortCollections = [];
           for (var i = 0; i < self.collections().length; i++) {
              shortCollections.push(self.collections()[i].shortName);
           }
           var newRule = {
              id: self.id() * 1,
              shortDescription: self.shortDes(),
              longDescription: self.longDes(),
              collections: shortCollections,
              level: self.selectedLevel(),
              bonus: self.bonus() * 1,
              mult: self.mult() * 1,
           }

           newRule.conditions = [];
           for (var i = 0; i < self.conditions().length; i++) {
              var S = self.conditions()[i];
              newRule.conditions.push(S.type + " " + S.amount + " " + S.letter);
           }
           console.log(newRule);

           if (newRule.collections.length == 0) {
              self.validationMessage('You need to add at least one collection');
              return false;
           }
           if (newRule.level == 'select level') {
              self.validationMessage('You need to select a level');
              return false;
           }
           if (newRule.conditions == 0) {
              self.validationMessage('You need to add at least one condition');
              return false;
           }
                      
           socket.emit("manager:instructions", { command: 'set', instruction: newRule, id: newRule.id }, function (data) {
              console.log(data);
              router.navigate('#rules');
           });

           //if (self.id() == null) {
           //newRule["id"] = lastId++;
           //rules.push(newRule);
           //}else{
           //socket.emit("manager:instructions", {command: 'getAll'}, function(rules){
           //var i = rules.indexOf(self.id());
           //rules.splice(i, 0, newRule);
           //})
           //}
        }


        this.cancel = function () {
           router.navigate('#rules');
        }

        ko.computed(function () {
           var add = self.enableBonus();
           if (add == 'bonus') {
              self.bonus(self.number()); self.mult('0');
           }
           else { self.mult(self.number()); self.bonus('0'); }
        });

        this.addSet = function () {
           var select = this.selectedCollection();
           if (select == 'select at least one collection') {
              app.showMessage("Please select at least one collection", "Oops");
           } else if (this.collections.indexOf(select) < 0) {
              self.collections.push(select);
           } else {
              app.showMessage("This item already exists", "Oops");
           }
        }

        this.removeSet = function (item, e) {
           e.preventDefault();
           self.collections.remove(item);
        }

        this.addCondition = function (item) {
           if (self.conditions.indexOf(item) < 0) {
              self.conditions.push(item.getCondition());
           } else {
              app.showMessage('This condition already exists.', 'Oops');
           }
        }

        this.removeCondition = function (item) {
           self.conditions.remove(item);
        }

        //this.lineToInclude = ko.computed(function () {
        //  var line = this;
        //  line.amountValue = self.amountValue();
        //  line.enableAdd = self.enableAdd();
        //  ko.computed(function () {
        //    var add = self.enableAdd();
        //    if (add == "word class: ") { line.selected = self.selectedClass() }
        //    else if (add == "category: ") { line.selected = self.selectedCategory() }
        //    else if (add == "words that start with the letter: ") { line.selected = self.startWithValue() }
        //    else if (add == "words that end with the letter: ") { line.selected = self.endWithValue() }
        //    else { line.selected = self.numberOfLettersValue() }
        //  })
        //})


        //this.addToInclude = function () {
        //  self.listToInclude.push(self.lineToInclude());
        //}
     }



     RuleForm.prototype.activate = function (id) {
        var base = this;

        //Add new type of conditions here:
        base.newConditions.push(new Class());
        base.newConditions.push(new Category());
        base.newConditions.push(new Begin());
        base.newConditions.push(new End());
        base.newConditions.push(new Count());

        //A deferred object
        base.collectionReady = $.Deferred();

        if (id) {
           socket.emit("manager:instructions", { command: 'get', id: id }, function (data) {
              console.log(data);

              base.shortDes(data.instruction.shortDescription);
              base.longDes(data.instruction.longDescription);
              base.id(data.instruction.id);

              base.collectionReady.then(function (dic) {
                 //receiving instructions and collections from the server are async events, so here we make sure that collection is loaded first,
                 //and only then replace shortnames with the collection object
                 ko.utils.arrayForEach(data.instruction.collections, function (shortName) {
                    base.collections.push(dic[shortName]);
                 });
              });

              var condit = data.instruction.conditions;
              for (var i = 0; i < condit.length ; i++) {
                 var d = condit[i].split(" ");
                 var dd = {
                    type: d[0],
                    amount: d[1],
                    letter: d[2],
                    editMode: false
                 }
                 base.conditions.push(dd);
              }


              base.selectedLevel(data.instruction.level);
              if (data.instruction.bonus !== 0) {
                 base.number(data.instruction.bonus);
                 base.enableBonus('bonus');
              } if (data.instruction.bonus == 0) {
                 base.number(data.instruction.mult);
                 base.enableBonus('mult');
              }

              console.log(data.instruction);

           });
        }

        socket.emit('manager:collections', { command: 'getAll' }, function (data) {
           console.log(data);
           sets = $.merge([{ longName: 'select at least one collection', shortName: 'select at least one collection' }], data.collections);
           base.collectionList(sets);
           base.selectedCollection(sets[0]);

           //create a dictionary short name -> collection object
           var collectionDic = {};
           ko.utils.arrayForEach(sets, function (colObj) {
              collectionDic[colObj.shortName] = colObj;
           });

           //tell subscribers that the collections are loaded, and send them the dictionary of (short->obj)
           base.collectionReady.resolve(collectionDic);
        });

        /*ctx.load("sets").then(function (sets) {
           sets = $.merge(['select at least one collection'], sets);
           base.collectionList(sets);
           base.selectedCollection(sets[0]);
        });*/
     }

     return RuleForm;

  })