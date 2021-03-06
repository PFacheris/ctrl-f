window.User = Backbone.Model.extend({
    urlRoot: "/user",
    idAttribute: "_id",

    initialize: function () {
        var self = this;
        


        //Validators
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
            return value.length > 5 ? {isValid: true} : {isValid: false, message: "Password must be 6 characters or longer"};
        };

        this.validators.passwordConfirm = function (value) {
            return value == self.get('password') ? {isValid: true} : {isValid: false, message: "Passwords must match."};
        };

    },

    parse: function (response)
    {
        response.itemsList = new ItemList();
        return this.getItemsById(response);        
    },
    
    getItemsById: function (response)
    {
        for(var i = 0; i < response.items.length; i++)
        {
            (function(i) {
                var package = new Package();
                package.fetch({
                    data: { "_id": response.items[i]},
                    success: function(model, res) {
                        response.itemsList.add(package);
                    },
                    error: function (model, xhr) {
                        delete response.items[i];
                        response.items.splice(i, 1);
                    }
                });

            })(i);
        }
        return response;
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

    addItem: function(item) {
        this.get('items').push(item.get("_id"));
        this.get('itemsList').add(item);
        this.save();
    },
    
    removeItem: function(id) {
        this.get('items').splice(this.get('items').indexOf(id));
        var toRemove = this.get('itemsList').get(id);
        this.get('itemsList').remove(toRemove);
        this.save();
    },

    defaults: {
        _id: null,
        firstName: "",
        lastName: "",
        password: "",
        email: "",
        items: [],
        itemsList: new ItemList()
    },

});
