window.ForgotPasswordView = Backbone.View.extend({

    initialize: function () {
        this.render();
    },

    render: function () {
        $(this.el).html(this.template());
        return this;
    },

    events: {
        "change"                : "change",
        "click #create"         : "beforeSend"
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
        app.navigate('home', true);
    },


    beforeSend: function () {
        var self = this;
        var check = this.model.validateAll();
        if (check.isValid === false) {
            utils.displayValidationErrors(check.messages);
            return false;
        }
        
        this.sendEmail();
        return false; 
    },

    sendEmail: function () {
        jQuery.ajax("/user/pwReset").ajaxSuccess(function (evt, xhr, options) {
            utils.showAlert('Sent!', "Check your email.");
        }).ajaxError(function (evt, xhr, settings, error) {
            if (xhr.status == 417) {
                utils.addValidationError('email', "Email doesn't exist.");
                utils.showAlert("Warning", "Check your input and try again.");
                console.log("Received error code because of nonexistent email.");
            }
        });
    }
});

