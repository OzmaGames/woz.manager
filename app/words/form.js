define(['api/datacontext', 'plugins/dialog', 'knockout','durandal/app'], function (ctx, dialog, ko, app) {

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
                set: base.selectedSet()
            };
            dialog.close(this, word);
        }

        this.removeVersion = function (version, e) {
            e.preventDefault();
            base.versionList.remove(version);
        }

        this.addVersion = function (a, b, c) {
            var version = this.version();
            if (version != "" && this.versionList.indexOf(version) < 0) {
                this.versionList.push(version);
            } else {
                app.showMessage('This version already exits.', 'Oops');
            }
            this.version('');
        }
        
        this.removeClass = function (clas, e) {
            e.preventDefault();
            base.classList.remove(clas);
        }

        this.addClass = function (a, b, c) {
            var selected = this.selectedClass();
            if (selected != "All" && this.classList.indexOf(selected) < 0) {
                this.classList.push(selected);
            } else if (selected == "All") {
                this.classList().splice(0, this.classList().length);
                this.classList.push("Noun", "Verb", "Adjective")
            }
        }
        
        this.removeCategory = function (category, e) {
            e.preventDefault();
            base.categoryList.remove(category);
        }

        this.addCategory = function (a, b, c) {
            var  selected = this.selectedCategory();
            if (this.categoryList.indexOf(selected) < 0) {
               this.categoryList.push(selected);
            } else {
                app.showMessage('This category already exists.', 'Oops');
            }
        }
        
         this.removeSet = function (set, e) {
            e.preventDefault();
            base.setList.remove(set);
        }
        
        this.addSet = function (a, b, c) {
            var selected =  this.selectedSet();
            if (this.setList.indexOf(selected) < 0) {
                this.setList.push(selected);
            } else {
                app.showMessage('This set already exsits.','Oops');
            }
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