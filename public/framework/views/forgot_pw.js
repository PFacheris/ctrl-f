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

        if ($("#email").val().length == 0) {
            utils.addValidationError(target.id, check.message);
        } else {
            utils.removeValidationError(target.id);
        }
    },

    beforeSend: function(event) {
        if ($("#email").val().length > 0)
            this.sendEmail();
    },

    sendEmail: function (value) {
        jQuery.ajax({
            type: "POST",
            url: "userpwReset",
            data: {email: value},
            success: function (evt, xhr, options) {
                utils.showAlert('Sent!', "Check your email.");
            },
            error: function (xhr, textStatus, error) {
                if (xhr.status == 417) {
                    utils.addValidationError('email', "Email doesn't exist.");
                    utils.showAlert("Warning", "Check your input and try again.");
                    console.log("Received error code because of nonexistent email.");
                }
            }
        });
    }
});

