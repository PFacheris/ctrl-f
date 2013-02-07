window.Session = Backbone.Model.extend({
    urlRoot: "/session",
    idAttribute: "_id", 

    defaults: {
        token: "",
        email: "",
        password: "",
    },
    
    isAuthorized: function() {
       return Boolean(this.get("token"));
    }

});
