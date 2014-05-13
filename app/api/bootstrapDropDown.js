define( ['knockout'], function ( ko ) {
   ko.bindingHandlers["BDD"] = {
      init: function ( element, valueAccessor, allBindings, data, context ) {
         var $el = $( element );

         if ( $el.data( "BDD" ) ) return;
         $el.data( "BDD", true );

         ko.computed( {
            disposeWhenNodeIsRemoved: element,
            read: function () {
               // data-bind="BDD: {options: observableArray, spOptions: selectpickerOptions}"               
               var allBindingData = allBindings();               
               var data = allBindingData.BDD || allBindingData.options;
               var options = ko.utils.unwrapObservable( data.options || data );

               setTimeout( function () {
                  //wait for ko to bind other stuff
                  if ( $( element ).data( "selectpicker" ) ) {
                     $( element ).selectpicker( 'refresh' );
                  } else {
                     $( element ).selectpicker( data.spOptions || undefined );
                  }
               }, 100 );
            }
         } );
      }
   };

   var optionsInit = ko.bindingHandlers["options"].init;

   ko.bindingHandlers["options"].init = function () {
      var result = optionsInit.apply( this, arguments );

      ko.bindingHandlers.BDD.init.apply( this, arguments );

      return result;
   }
} );