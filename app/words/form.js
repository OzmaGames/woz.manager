define(['api/datacontext', 'plugins/dialog', 'knockout'], function (ctx, dialog, ko) {

    var WordForm = function () {
        this.input = ko.observable('');
        this.selectedClass = ko.observable();
        this.classes = ko.observableArray([]);

        var base = this;
        this.save = function () {
            dialog.close(base, base.input());
        }
    }

    WordForm.show = function () {
        return dialog.show(new WordForm);
    };

    WordForm.prototype.activate = function () {
        var base = this;
        ctx.load("classes").then(function (classes) {
            base.classes(classes);
            base.selectedClass(classes[0]);
        });
    }

    return WordForm;
})