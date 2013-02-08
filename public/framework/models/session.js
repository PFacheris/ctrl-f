window.Session = Backbone.Model.extend({
    urlRoot: "/session",
    idAttribute: "_id", 

    defaults: {
        _id: null,
        token: "",
        email: "",
        password: "",
    },
    
    isAuthorized: function() {
        return Boolean(_.size(this.get("token")) > 0);
    }

});
