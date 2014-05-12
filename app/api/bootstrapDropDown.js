define( ['knockout'], function ( ko ) {
   ko.bindingHandlers["bootstrapDropDown"] = {
      init: function ( element, valueAccessor, allBindings, data, context ) {
return;
         ko.computed( {
            disposeWhenNodeIsRemoved: element,
            read: function () {
               // data-bind="bootstrapDropDown: {options: observableArray, selectpickerOptions: selectpickerOptions}"               
               var data = valueAccessor();
               var options = ko.utils.unwrapObservable( data.options );

               setTimeout( function () {
                  //wait for ko to bind other stuff
                  $( element ).selectpicker( data.selectpickerOptions || undefined );
               }, 1 );
            }
         } );
      }
   };
} );