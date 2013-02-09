var tracking = require('dhl');

var packet = {
    "service": "usps",
    "id": "9274892700352501752750"
};

tracking.track(packet, function (tracking) {
    console.log(tracking.data);
});

var packet2 = {
    "service": "ups",
    "id": "1ZX295600315873246"
};

tracking.track(packet2, function (tracking) {
    console.log(tracking.data);
});
