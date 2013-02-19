var Package = Item.extend({

    defaults: {
        name: "",
        tracking: "",
        service: "",
        delivered: false,
        trackingInfo: []
    },
    
    initialize: function () {
        var self = this;
        this.validators = {};
        
        this.validators.tracking = function (value) {
            return value.length > 0 ? {isValid: true} : {isValid: false, message: "You must enter a tracking number."};
        };

        this.validators.service = function (value) {
            return value.length > 0 ? {isValid: true} : {isValid: false, message: "You must enter a delivery service."};
        };

        this.validators.delivered = function (value) {
            return typeof value == "boolean" ? {isValid: true} : {isValid: false, message: "A package arrival status must be a truth condition."};
        };
    },

    validateAll: function (attrs) {
        var messages = {};

        for (var key in this.validators) {
            if(this.validators.hasOwnProperty(key)) {
                var check = this.validators[key](this.get(key));
                if (check.isValid === false) {
                    messages[key] = check.message;
                }
            }
        }

        return _.size(messages) > 0 ? {isValid: false, messages: messages} : {isValid: true};
    },

    validateItem: function (key) {
        return (this.validators[key]) ? this.validators[key](this.get(key)) : {isValid: true};
    }

});
