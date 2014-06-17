define( ['api/datacontext', 'knockout', 'jquery', 'plugins/router', 'api/server', 'durandal/app', 'grid'],
   function ( ctx, ko, $, router, socket, app ) {


      window.ko = ko;


      var _collectionList = ko.observableArray();
      var dicToShortName, dicToLongName;

      ko.computed( function () {
         var col = _collectionList();
         dicToShortName = {};
         dicToLongName = {};
         for ( var i = 0; i < col.length; i++ ) {
            dicToShortName[col[i].longName] = col[i].shortName;
            dicToLongName[col[i].shortName] = col[i].longName;
            for ( var j = 0; j < col[i].boosters.length; j++ ) {
               dicToShortName[col[i].boosters[j].longName] = col[i].boosters[j].shortName;
               dicToLongName[col[i].boosters[j].shortName] = col[i].boosters[j].longName;
            }
         }

      } );

      function ToShortNames( name ) {
         return dicToShortName[name];
      }

      function ToLongNames( name ) {
         return dicToLongName[name];
      }

      var ctor = function () {
         var self = this;

         self.setList = _collectionList;
         self.selectedSet = ko.observable();
         self.tileList = ko.observableArray();
         self.selectedTile = ko.observable();
         self.words = ko.observableArray();
         self.query = ko.observable();
         self.add = ko.observable( false );
         self.colShort = ko.computed( function () {
            return ToShortNames( [self.selectedSet()] );

         } );

         self.colShort2 = ko.computed( function () {
            var colName = self.colShort();
            if ( !colName ) return "";
            var name = colName.slice( 0, 3 );
            return name[2] == '-' ? name.slice( 0, 2 ) : name;
         } );

         // self.colTogether = ko.computed(function(){
         //  if(self.colShort() == "woz-boost1"){
         //     return self.colShort(self.setList[0]);
         //   }
         // });



         self.chooseTile = function ( tile ) {
            self.selectedTile( tile );
         }

         //Start my changes


         self.filteredTiles = ko.computed( function () {
            //dont use observable object inside a loop, extract information before the loop

            if ( !self.selectedSet() ) return [];


            var colName = ToShortNames( [self.selectedSet()] );

            console.log( colName );


            return ko.utils.arrayFilter( self.tileList(), function ( item ) {
               return item.collection === colName;
            } );

         } );

         ko.computed( function () {
            //this method runs shortly after when filteredTiles changes
            var tiles = self.filteredTiles();



            //create grid only if there is any tile at all
            if ( tiles.length ) {
               grid().init();
            }
         } ).extend( { throttle: 1 } );
         //more info at: http://knockoutjs.com/documentation/throttle-extender.html
         //.extend({ throttle: 1 }); means that when filteredTiles changes, wait 1ms for browser to settle things down 
         //and let it have a chance to create elements on the page         

         // End My changes

         self.collectionName = ko.computed( function () {

         } );

         self.rows = ko.computed( function () {
            var rows = [],
            currentRow,
            colLength = 6;

            if ( self.selectedTile() ) {
               for ( var i = 0, j = self.selectedTile().related.length; i < j; i++ ) {
                  if ( i % colLength === 0 ) {
                     if ( currentRow ) {
                        rows.push( currentRow );
                     }
                     currentRow = [];
                  }
                  currentRow.push( self.selectedTile().related[i] );
               }
               if ( currentRow ) {
                  rows.push( currentRow );
               }
               return rows;
            }
         } );

         self.home = function () {
            router.navigate( "#words" );
         }

         self.remove = function ( word ) {
            var relatedWords = self.selectedTile().related;
            var pos = relatedWords.indexOf( word );
            relatedWords.splice( pos, 1 );
            var data = {
               command: 'setRelated',
               name: self.selectedTile().name,
               related: relatedWords
            };
            console.log( data );
            socket.emit( 'manager:images', data, function ( data ) {
               console.log( data );
               self.selectedTile.valueHasMutated();
            } );
         }


         function sortMethode( a, b ) {
            return a.lemma.localeCompare( b.lemma );
         }


         self.searchResult = ko.computed( function () {
            var words = self.words().sort( sortMethode );
            ko.utils.arrayForEach(self.words(), function(word){
               if(!word.versions) return [];
               for(var i=0; i < word.versions.length ; i++){
                 words.push(word.versions[i]);
              }
            })

            if ( self.query() ) {
               var query = self.query().toLowerCase();
               return ko.utils.arrayFilter( words, function ( word ) {
                  return word.lemma.toLowerCase().indexOf( query ) === 0;

               } )
            }
         } );

         self.displayResult = ko.computed( function () {
            if ( self.query() ) {
               if ( self.query().length > 0 ) return true;
            }
         } );

         $( '#searchResult' ).on( 'blur', function () {
            self.displayResult( false );
         } );

         self.hitResult = function ( result ) {
            if ( self.query() ) {
               self.query( result.lemma );
            }
         }

         self.enableAdd = ko.computed( function () {
            var words = self.words();
            if ( self.query() ) {
               if ( ko.utils.arrayFirst( words, function ( word )
               { return word.lemma.toLowerCase() === self.query().toLowerCase(); } ) ) {
                  self.add( true );
               } else { self.add( false ); };
            }
         } );

         self.addToRelated = function () {

            self.selectedTile().related.push( self.query() );
            var data = {
               command: 'setRelated',
               name: self.selectedTile().name,
               related: self.selectedTile().related
            };
            console.log( data );

            //if (self.selectedTile().related.indexOf(self.query()) == -1) {
            socket.emit( 'manager:images', data, function ( data ) {
               console.log( data );
               //self.selectedTile().related.push(self.query());
               self.selectedTile.valueHasMutated();
               self.query( "" );
               self.add( false );
            } );

            // } else {
            // app.showMessage('This word already exist', 'Oops').then(function () {
            // self.query('');
            // self.add(false);
            //});
            //}
         }
      }


      //ctor.prototype.compositionComplete = function () {
      //grid().init();
      //}

      ctor.prototype.activate = function () {
         var base = this;

         socket.emit( 'manager:images', { command: 'getAll' }, function ( data ) {
            console.log( data );

            ko.utils.arrayForEach( data.images, function ( img ) {
               img.related = img.related || [];
            } );

            base.tileList( data.images );
         } );

         //ctx.load("tiles").then(function (tiles) {
         //base.tileList(tiles);
         //});

         socket.emit( "manager:words", { command: 'getAll' }, function ( data ) {
            base.words( data.words );
         } );

         socket.emit( 'manager:collections', { command: 'getAll' }, function ( data ) {
            for ( var i = 0; i < data.collections.length; i++ ) {
               data.collections[i].boosters.unshift( { 'longName': data.collections[i].longName, 'shortName': data.collections[i].shortName } );

            }
            console.log( data.collections );
            base.setList( data.collections );
            base.selectedSet( data.collections[0] );

            var dic = {};
            for ( var i = 0; i < data.collections.length; i++ ) {
               dic[data.collections[i].longName] = data.collections[i].shortName;
               for ( var j = 0; j < data.collections[i].boosters.length; j++ ) {
                  dic[data.collections[i].boosters[j].longName] = data.collections[i].boosters[j].shortName;
               }
            }





         } );
         //ctx.load("sets").then(function (sets) {
         //sets = $.merge(['All'], sets);
         //base.setList(sets);
         //base.selectedSet(sets[0]);
         //});
      }
      return ctor;
   } )