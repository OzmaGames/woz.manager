define(['api/datacontext', 'plugins/dialog', 'knockout', 'durandal/app'], function (ctx, dialog, ko, app) {

    var WordForm = function (word) {
        this.input = ko.observable(word.lemma || '');
        this.version = ko.observable('');
        this.selectedClass = ko.observable();
        this.selectedCategory = ko.observable();
        this.selectedSet = ko.observable();

        this.classes = ko.observableArray([]);
        this.categories = ko.observableArray([]);
        this.sets = ko.observableArray([]);

        this.versionList = ko.observableArray(word.versions || []);
        this.classList = ko.observableArray(word.classes || []);
        this.categoryList = ko.observableArray(word.categories || []);
        this.setList = ko.observableArray(word.sets || []);

        var base = this;
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

        this.removeClass = function (clas, e) {
            e.preventDefault();
            base.classList.remove(clas);
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
            var version = this.version();
            if (version == "" || !addIfNotExist(this.versionList, version)) {
                app.showMessage('This version already exits.', 'Oops');
            }
            this.version('');
        }

        this.addClass = function () {
            addToList(this.classList, this.selectedClass(), this.classes);            
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
            base.selectedClass(classes[0]);
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