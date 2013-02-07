window.Session = Backbone.Model.extend({
    urlRoot: "/session",
    idAttribute: "_id", 

    defaults: {
        token: "",
        email: "",
        password: "",
    },
    
    isAuthorized: function() {
        var isAuthed = _.size(this.get("token")) > 0;
        console.log(isAuthed);
        return isAuthed;
    }

});
