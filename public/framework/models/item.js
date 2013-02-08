var Item = Backbone.Model.extend({
    urlRoot: "/item",
    idAttribute: "_id",

    defaults: {
        _id: null,
        name: ""
    }
});
