window.User = Backbone.Model.extend({
    urlRoot: "/user",
    idAttribute: "_id",

    validate: function (attrs) {
        var invalid = [];
        
        if(![a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?.test(attrs.email)) invalid.push("email");
        if (attrs.firstName.length <= 0) invalid.push("first name");
        if (attrs.lastName.length <= 0) invalid.push("last name");
        if (attrs.password.length < 6) invalid.push("password length");

    },

    defaults: {
        _id: null,
        firstName: "",
        lastName: "",
        email: ""
    },
    
});
