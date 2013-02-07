window.User = Backbone.Model.extend({
    urlRoot: "/user",
    idAttribute: "_id",

    initialize: function () {
        this.validators = {};
        
        this.validators.firstName = function (value) {
            return value.length > 0 ? {isValid: true} : {isValid: false, message: "You must enter a first name"};
        };

        this.validators.lastName = function (value) {
            return value.length > 0 ? {isValid: true} : {isValid: false, message: "You must enter a last name"};
        };

        this.validators.email = function(value) {
            var regex = "[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?";
            return regex.test(attrs.email) ? {isValid: true} : {isValid: false, message: "You must enter a valid email"};
        }
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

    defaults: {
        _id: null,
        firstName: "",
        lastName: "",
        email: ""
    },
    
});
