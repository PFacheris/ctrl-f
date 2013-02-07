var Package = Item.extend({

    type: "Parcel",

    defaults: {
        trackingNumber: "",
        deliveryService: "",
        arrived: false,
    },
    
    validate: function(attrs) {
        var invalid = [];
        if (attrs.trackingNumber.length <= 0) invalid.push("tracking number");
        if (attrs.deliveryService.length <= 0) invalid.push("delivery service");
    },

    getName: function() {
        return (name == "") ? ("Package from " + deliveryService) : name;
    }


});
