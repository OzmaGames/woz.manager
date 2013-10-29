define(['durandal/system', 'durandal/app', 'socket'], function (system, app, socket) {

    var dfd = system.defer(),
        URL = "wordsdevel.herokuapp.com";         

    socket = io.connect(URL);
    socket.on('connect', function () {
        dfd.resolve();
        console.log("connected");
    });
    socket.on('disconnect', function () {
        dfd.reject();
        console.log("disconnected");
    });

    var applicationEvents = [
     'manager:getAllWords', 'tiles', 'rules'
    ], customEvents = {
        "server:login": function (data, callback) {
            socket.emit("login", data, callback);
        }
    };

    for (var index = 0; index < applicationEvents.length; index++) {
        var event = applicationEvents[index];
        addEvent("server:" + event, function (data, callback) {
            socket.emit(event, data, callback);
        });
    }
    for (var event in customEvents) {
        addEvent(event, customEvents[event]);
    }

    function addEvent(event, func) {
        app.on(event).then(function (data, callback) {
            dfd.promise().then(function () {
                console.log('%c' + event + ' sent:', 'background: #222; color: #bada55', data);
                func(data, function (sdata) {
                    console.log('%c' + event + ' received:', 'background: #222; color: #bada55', sdata);
                    if (callback) callback(sdata);
                });
            });
        });
    }
});