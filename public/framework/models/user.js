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
            var regex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g;
            return regex.test(value) ? {isValid: true} : {isValid: false, message: "You must enter a valid email"};
        }

        this.validators.password = function (value) {
            return value.length > 0 ? {isValid: true} : {isValid: false, message: "Password must be 6 characters or longer"};
        };

        this.validators.passwordConfirm = function (value) {
            return value == this.get('password') ? {isValid: true} : {isValid: false, message: "Passwords must match."};
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
    },


    defaults: {
        _id: null,
        firstName: "",
        lastName: "",
        password: "",
        email: "",
        items: []
    },
    
});
