define(function () {

   return [{
      id: 0,
      shortDescription: "The phrase must contain two adjectives",
      longDescription: "The phrase must contain two adjectivesThe phrase must contain two adjectives",
      collections: ["words of oz"],
      bonus: 0,
      mult: 5,
      level: 1,
      conditions: [ 'class 2 verb','category 1 body part','startWith 1 L','endWith 1 B','length 2 3']
          
      }, {
      id: 1,
      shortDescription: "The phrase must contain no adjectives",
      longDescription: "",
      collections: ["gothic-horror", "words of oz"],
      bonus: 6,
      mult: 0,
      level: 1,
      conditions: [ 'class 2 verb','category 1 body part','startWith 1 L','endWith 1 B','length 2 3']
   },

   {
      id: 2,
      shortDescription: "The phrase must contain lots of nouns",
      longDescription: "",
      collections: ["words of oz", "basic"],
      bonus: 15,
      mult: 0,
      level: 1,
      conditions: [ 'class 2 verb','category 1 body part','startWith 1 L','end 1 B','length 2 3']
   }
   ];
})