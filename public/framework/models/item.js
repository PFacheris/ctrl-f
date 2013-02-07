var Item = Backbone.Model.extend({
    urlRoot: "/item",
    idAttribute = "_id",

    defaults: {
        _id: null,
        name: "",
        type: ""
    },

    validate: function() {
        var invalid = [];

        if (name.length <= 0) invalid.push("name");

        if (invalid.length > 0) return invalid;
    }
});
