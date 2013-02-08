window.RegisterView = Backbone.View.extend({

    initialize: function () {
        this.render();
    },

    render: function () {
        $(this.el).html(this.template());
        return this;
    },

    events: {
        "change"                : "change",
        "click #create"         : "beforeSave",
        "click #cancel"         : "cancel",
    },

    change: function (event) {
        // Remove any existing alert message
        utils.hideAlert($(this.el));

        // Apply the change to the model
        var target = event.target;
        var change = {};
        change[target.name] = target.value;
        this.model.set(change);

        // Run validation rule (if any) on changed item
        var check = this.model.validateItem(target.id);
        if (check.isValid === false) {
            utils.addValidationError(target.id, check.message);
        } else {
            utils.removeValidationError(target.id);
        }
    },

    cancel: function () {
        app.navigate('home', false);
    },


    beforeSave: function () {
        var self = this;
        var check = this.model.validateAll();
        if (check.isValid === false) {
            utils.displayValidationErrors(check.messages, $(this.el));
            return false;
        }
        
        this.saveUser();
        return false; 
    },

    saveUser: function () {
        this.model.save(); 
        this.login();
        app.navigate('home', false);
    },
    
    login: function () {
        var self = this;
        window.activeSession.set(
            {
                email: self.model.email,
                password: self.model.password
            },{
                silent:true
            }
        );

        window.activeSession.save({}, {
            success: function (model, response) {
                if(window.activeSession.isAuthorized())
                        $.cookie('authtoken', window.activeSession.get('token'));
            },
            error: function (model, response) {
                console.log("Error saving session.");
            }
        });

    }
    
});

