window.RegisterView = Backbone.View.extend({

    initialize: function () {
        this.render();
    },

    render: function () {
        $(this.el).html(this.template(this.model.toJSON()));
        $(this.el).parent('.column').toggleClass('eight').toggleClass('twelve');
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
        var self = this;
        this.model.save(null, {
            success: function (model) {
                app.navigate('home', false);
                utils.showAlert('Success!', 'You have registered a new account.', 'alert-success');
            },
            error: function () {
                utils.showAlert('Error', 'An error occurred while creating your account. Try again later.', 'alert-error');
            }
        }); 
    },

    session: function () {
        window.activeSession.set(
            {
                email: this.model.email,
                password: this.model.password
            },{
                silent:true
            }
        );
        window.activeSession.save();
    }

});

