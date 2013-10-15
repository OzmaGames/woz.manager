define(function () {

    return [{
        name: 'hand',
        versions: ['hands'],
        classes: ['Noun'],
        categories: ['body part'],
        set: 'words of oz'
    }, {
        name: 'work',
        versions: ['works', 'working'],
        classes: ['Verb','Noun'],
        categories: ['body part'],
        set: 'basic'
    }, {
        name: 'answer',
        versions: ['answer', 'answering'],
        classes: ['Verb','Noun', 'Adjective'],
        categories: ['body part'],
        set: 'basic'
    }, {
        name: 'blood',
        versions: [],
        classes: ['Noun'],
        categories: ['body fluid'],
        set: 'gothic-horror'
    }];

});