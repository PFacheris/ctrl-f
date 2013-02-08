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
        utils.hideAlert();

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
            utils.displayValidationErrors(check.messages);
            return false;
        }
        
        this.saveUser();
        return false; 
    },

    saveUser: function () {
        this.model.save(); 
        this.login();
        app.navigate('#home', false);
        utils.showAlert('Success!', 'You now have ctrl-f account.');
    },
    
    login: function () {
        var email = this.model.get('email');
        var password = this.model.get('password');
        window.activeSession.set(
            {
                email: email,
                password: password
            },{
                silent:true
            }
        );

        window.activeSession.save({}, {
            success: function (model, response) {
                 $.cookie('authtoken', window.activeSession.get('token'));
                 $.cookie('authemail', window.activeSession.get('email'));
                 },
            error: function (model, response) {
                console.log("Error saving session.");
            }
        });

    }
    
});

