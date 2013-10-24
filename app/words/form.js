define(['api/datacontext', 'plugins/dialog', 'knockout', 'durandal/app'], function (ctx, dialog, ko, app) {

    var WordForm = function (word) {
        var base = this;
        this.input = ko.observable(word.lemma || '');
        this.version = ko.observable('');
        this.selectedClass = ko.observableArray([]);
        this.selectedCategory = ko.observable();
        this.selectedSet = ko.observable();

        this.classes = ko.observableArray([]);
        this.categories = ko.observableArray([]);
        this.sets = ko.observableArray([]);

        this.versionList = ko.observableArray(word.versions || []);
        this.categoryList = ko.observableArray(word.categories || []);
        this.setList = ko.observableArray(word.sets || []);
        this.classList = ko.computed (function () {
                           if (base.selectedClass() =="All") {
                              return base.classes();
                           } else {return base.selectedClass();}
                         });

        this.save = function () {
            var word = {
                lemma: base.input(),
                versions: base.versionList(),
                classes: base.classList(),
                categories: base.categoryList(),
                sets: base.setList()
            };
            dialog.close(this, word);
        }

        this.close = function () {
            dialog.close(this);
        }

        this.removeVersion = function (version, e) {
            e.preventDefault();
            base.versionList.remove(version);
        }

        this.removeCategory = function (category, e) {
            e.preventDefault();
            base.categoryList.remove(category);
        }

        this.removeSet = function (set, e) {
            e.preventDefault();
            base.setList.remove(set);
        }

        this.addVersion = function () {
            var version = base.version();
            if (version == "" ) {
                app.showMessage('Please enter a version.','Oops');
            } else if (!addIfNotExist(this.versionList, version)) {
                app.showMessage('This version already exits.', 'Oops');
            }
            this.version('');
        }

        this.addCategory = function () {
            addToList(this.categoryList, this.selectedCategory(), this.categories);
        }

        this.addSet = function () {
            addToList(this.setList, this.selectedSet(), this.sets);            
        }

        function addToList(list, item, collection) {
            if (item == "All") {
                list(collection.slice(1));
            } else if (!addIfNotExist(list, item)) {
                app.showMessage('This item already exists.', 'Oops');
            }
        }

        function addIfNotExist(list, item) {
            if (list.indexOf(item) < 0) {
                list.push(item);
                return true;
            }
            return false;
        }
    }

    WordForm.show = function (word) {
        return dialog.show(new WordForm(word || {}));
    };

    WordForm.prototype.activate = function () {
        var base = this;
        
        ctx.load("classes").then(function (classes) {
            base.classes(classes);
        });
        ctx.load("categories").then(function (categories) {
            base.categories(categories);
            base.selectedCategory(categories[0]);
        });
        ctx.load("sets").then(function (sets) {
            base.sets(sets);
            base.selectedSet(sets[0]);
        });
    }

    return WordForm;
})