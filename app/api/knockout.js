define(['knockout'], function (ko) {
    ko.bindingHandlers["checkbox"] = {
        init: function (element, valueAccessor, allBindings, data, context) {
            data = valueAccessor();
            var $element = $(element).on("click", function () {
                var index;
                if ((index = data.pool.indexOf(data.value)) != -1) {
                    data.pool.splice(index, 1);
                } else {
                    data.pool.push(data.value);
                }
            }).text(data.value);

            ko.computed({
                disposeWhenNodeIsRemoved: element,
                read: function () {
                    $element.toggleClass("active btn-info", data.pool().indexOf(data.value) != -1);
                }
            });
        }
    };    
});