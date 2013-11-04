define(['api/datacontext', 'plugins/dialog', 'knockout', 'durandal/app', 'bootstrap'], function (ctx, dialog, ko, app) {
    var VersionForm = function (word) {
        var self = this;

        self.word = word;
        self.input = ko.observable();
        self.classList = ko.observableArray();
        self.classes = ko.observableArray(word.classes || []);
        self.versions = ko.observableArray(word.versions || []);

        ko.utils.arrayForEach(word.versions, function (v) {
            v.editMode = ko.observable(false);
        });

        this.save = function () {
            dialog.close(this, self.versions());
        }

        this.add = function () {
            self.versions.push({
                lemma: self.input(),
                classes: self.classes(),
                editMode: ko.observable(false)
            });
        }

        this.edit = function (version) {
            version.lemma = ko.observable(version.lemma);
            version.classes = ko.observableArray(version.classes);
            version.editMode(true);
        }

        this.update = function (version) {
            version.lemma = version.lemma();
            version.classes = version.classes();
            version.editMode(false);
        }

        this.cancel = function (version) {
            //todo
        }

        this.remove = function (version) {
            var pos = self.versions.indexOf(version);
            self.versions.splice(pos, 1);
        }

        this.close = function () {
            dialog.close(this);
        }
    }

    VersionForm.show = function (word) {
        return dialog.show(new VersionForm(word || {}));
    };

    VersionForm.prototype.activate = function () {
        var base = this;

        ctx.load("classes").then(function (items) {
            base.classList(items);
        });
    }

    VersionForm.prototype.bindingComplete = function (el) {

    }

    return VersionForm;
});
