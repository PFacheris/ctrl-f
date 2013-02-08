window.Session = Backbone.Model.extend({
    urlRoot: "/session",
    idAttribute: "token", 

    defaults: {
        token: "",
        email: "",
        password: "",
    },
    
    isAuthorized: function() {
        return Boolean(_.size(this.get("token")) > 0);
    }

});
