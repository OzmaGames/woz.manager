define(function () {

    return [{
        lemma: 'hand',
        versions: [{
            lemma: 'hands',
            classes: ['Noun']
        }],
        classes: ['Noun'],
        categories: ['body part'],
        collections: ['words of oz']
    }, {
        lemma: 'work',
        classes: ['Verb', 'Noun'],
        categories: ['body part'],
        collections: ['basic']
    }, {
        lemma: 'answer',
        versions: [{
            lemma: 'answers',
            classes: ['Verb']
        }, {
            lemma: 'answering',
            classes: ['Noun', 'Verb']
        }],
        classes: ['Verb', 'Noun', 'Adjective'],
        categories: ['body part'],
        collections: ['basic']
    }, {
        lemma: 'blood',
        classes: ['Noun'],
        categories: ['body fluid'],
        collections: ['gothic-horror']
    }];

});