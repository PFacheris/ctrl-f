window.Session = Backbone.Model.extend({
    urlRoot: "/session",
    idAttribute: "_id", 

    defaults: {
        _id: "",
        email: "",
        password: "",
    },
    
    isAuthorized: function() {
       return Boolean(this.get("sessionId"));
    }

});
