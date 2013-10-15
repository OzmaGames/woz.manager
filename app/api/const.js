define(function () {

    var vm = {
        images: [
           "barbed_wire",
           "bear",
           "black_cat",
           "clock_in_sand",
           "couple",
           "dark_forest",
           "deer_in_snow",
           "fire",
           "fox",
           "frozen_cattai",
            "girl_in_rain",
            "girl_in_white_dress",
            "goat",
            "golden_forest",
            "hands_with_soil",
            "misty_forest",
            "moon",
            "old_house",
            "old_woman",
            "rail",
            "statue",
            "still_water",
            "stream",
            "tomb",
            "white_flower"
        ]
    };

    for (var i = 0; i < vm.images.length; i++) {
        var name = vm.images[i];
        vm.images[i] = 'images/tiles/' + name.replace(' ', '_') + (name.indexOf('.') == -1 ? '.jpg' : '');
    }

    return vm;

});