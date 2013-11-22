define(function () {

   return [{
      id: 0,
      shortDescription: "The phrase must contain two adjectives",
      longDescription: "The phrase must contain two adjectivesThe phrase must contain two adjectives",
      collections: ["words of oz"],
      bonus: 15,
      mult: 0,
      level: 1,
      details: [
          {
             amount: 2,
             css: "verb",
             type: "class"
          },
          {
             amount: 1,
             category: "body part",
             type: "category"
          },
          {
             amount: 1,
             letter: "L",
             type: "startWith"
          },
          {
             amount: 1,
             letter: "B",
             type: "endWith"
          },
          {
             amount: 2,
             letter: 3,
             type: "length"
          }
      ]
   }, {
      id: 1,
      shortDescription: "The phrase must contain no adjectives",
      longDescription: "",
      collections: ["gothic-horror", "words of oz"],
      bonus: 15,
      mult: 0,
      level: 1,
      details: [
          {
             amount: 2,
             css: "verb",
             type: "class"
          },
          {
             amount: 1,
             category: "body part",
             type: "category"
          },
          {
             amount: 1,
             letter: "L",
             type: "startWith"
          },
          {
             amount: 1,
             letter: "B",
             type: "endWith"
          },
          {
             amount: 2,
             letter: 3,
             type: "length"
          }
      ]
   },

   {
      id: 2,
      shortDescription: "The phrase must contain lots of nouns",
      longDescription: "",
      collections: ["words of oz", "basic"],
      bonus: 15,
      mult: 0,
      level: 1,
      details: [
          {
             amount: 2,
             css: "verb",
             type: "class"
          },
          {
             amount: 1,
             category: "body part",
             type: "category"
          },
          {
             amount: 1,
             letter: "L",
             type: "startWith"
          },
          {
             amount: 1,
             letter: "B",
             type: "endWith"
          },
          {
             amount: 2,
             letter: 3,
             type: "length"
          }
      ]
   }
   ];
})