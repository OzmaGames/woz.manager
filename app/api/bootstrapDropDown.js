define(['knockout'], function (ko) {
    ko.bindingHandlers["bootstrapDropDown"] = {
        init: function (element, valueAccessor, allBindings, data, context) { 
                                          
            ko.computed({
                disposeWhenNodeIsRemoved: element,
                read: function () {
                   var bindings = allBindings();
                   //if options presents in data-binding then listen to its changes (computed will listen to its changes as soon as you read from an obs)
                   if ( bindings.options ) {
                      // data-bind="options:foo, value:selectedClass, bootstrapDropDown: selectpickerOptions"
                      //unwrap will unwrap the object if it is an obs, or return its value if it is not
                      var options = ko.unwrap( bindings.options );
                      setTimeout( function () {
                         var selectpickerOptions = valueAccessor();
                         $( element ).selectpicker( selectpickerOptions );
                      }, 200 );
                   } else {
                      // data-bind="bootstrapDropDown: {options: observableArray, selectpickerOptions: selectpickerOptions}"
                      // alternatively attach to options
                      setTimeout( function () {
                         var data = valueAccessor();
                         var options = ko.unwrap( data.options );
                         $(element).selectpicker();
                      }, 200 );                      
                   }
                }
            });
        }
    };    
});