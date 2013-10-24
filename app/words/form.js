define(['api/datacontext', 'plugins/dialog', 'knockout', 'durandal/app', 'bootstrap'], function (ctx, dialog, ko, app) {

    var WordForm = function (word) {
        var base = this;

        this.selectedCategory = ko.observable();
        this.selectedCollection = ko.observable();

        this.classList = ko.observableArray([]);
        this.categoryList = ko.observableArray([]);
        this.collectionList = ko.observableArray([]);

        this.input = ko.observable(word.lemma || '');
        this.classes = ko.observableArray(word.classes || []);
        this.categories = ko.observableArray(word.categories || []);
        this.collections = ko.observableArray(word.collections || []);
        this.isVersion = word.parent ? true : null;

        console.log(word, this.isVersion);

        this.save = function () {
            var word = {
                lemma: base.input(),
                versions: [],
                classes: base.classes(),
                categories: base.categories(),
                collections: base.collections()
            };            
            dialog.close(this, word);
        }

        this.close = function () {
            dialog.close(this);
        }

        this.removeCategory = function (item, e) {
            e.preventDefault();
            base.categories.remove(item);
        }

        this.removeCollection = function (item, e) {
            e.preventDefault();
            base.collections.remove(item);
        }

        this.addCategory = function () {
            addTo(this.categories, this.selectedCategory(), this.categoryList);
        }

        this.addCollection = function () {
            addTo(this.collections, this.selectedCollection(), this.collectionList);
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

        ctx.load("classes").then(function (items) {
            base.classList(items);
        });
        ctx.load("categories").then(function (items) {
            base.categoryList(items);
            base.selectedCategory(items[0]);
        });
        ctx.load("sets").then(function (items) {
            base.collectionList(items);
            base.selectedCollection(items[0]);
        });
    }

    WordForm.prototype.bindingComplete = function (el) {

    }

    return WordForm;
})