window.SettingsView = Backbone.View.extend({

    initialize: function () {
        this.render();
    },

    render: function () {
        utils.showAlert("Note", "Retype your password to confirm any changes.");
        $(this.el).html(this.template());
        var firstName = this.model.get('firstName');
        var lastName = this.model.get('lastName');
        var email = this.model.get('email');

        $(this.el).find("input[name='firstName']").val(firstName);
        $(this.el).find("input[name='lastName']").val(lastName);
        $(this.el).find("input[name='email']").val(email);
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
        app.navigate('home', true);
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
        this.model.save(null, {
            success: function(model, result, xhr) {
                utils.showAlert("Success!", "Updated your account information.");
                app.navigate('home', true);
            },
            error: function(model, xhr, options) {
                utils.addValidationError('email', 'Email already exists.');
                utils.showAlert("Warning", "Check your input and try again.");
                console.log(xhr);
            }
        });
    }
});

