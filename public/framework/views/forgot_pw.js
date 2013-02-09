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
        "click #create"         : "sendEmail"
    },

    change: function (event) {
        // Remove any existing alert message
        utils.hideAlert();
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

