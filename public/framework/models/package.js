var Package = Backbone.Model.extend({
    idAttribute = "_id",

    defaults: {
        _id: null,
        trackingNumber: "",
        deliveryService: "",
        arrived: false,
    },
    
    validate: function(attrs) {
        var invalid = [];
        if (attrs.trackingNumber.length <= 0) invalid.push("tracking number");
        if (attrs.deliveryService.length <= 0) invalid.push("delivery service");

    },

    startTrack: function(orderNum, service) {
        this.deliveryService = service;
        this.trackingNumber = orderNum;
    }

});
