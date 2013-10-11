define (['./images', 'words/setList', 'knockout'] , function (images, setList,ko) {
   
    return {
        images: images,
        setList: setList,
        selectedSet: ko.observable()
    }
})