define (['./images', 'words/setList', './newTile' ,'knockout'] , function (images, setList,newTile, ko) {
   
    return {
        images: images,
        setList: setList,
        selectedSet: ko.observable(),
        newTile: function () {newTile.show();}
        
    }
})