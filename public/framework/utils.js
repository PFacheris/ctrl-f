window.utils = {
    // Asynchronously load templates located in separate .html files
    loadTemplate: function(views, callback) {

        var deferreds = [];

        $.each(views, function(index, view) {
            if (window[view]) {
                deferreds.push($.get('/tpl/' + view + '.html', function(data) {
                    window[view].prototype.template = _.template(data);
                }));
            } else {
                alert(view + " not found");
            }
        });

        $.when.apply(null, deferreds).done(callback);
    },

    displayValidationErrors: function (messages) {
        for (var key in messages) {
            if (messages.hasOwnProperty(key)) {
                this.addValidationError(key, messages[key]);
            }
        }
        this.showAlert('Warning!', 'Check your input and try again.');
    },

    addValidationError: function (field, message) {
        var controlGroup = $('#' + field).siblings('small');
        controlGroup.addClass('error');
        controlGroup.html(message);
    },

    removeValidationError: function (field) {
        var controlGroup = $('#' + field).siblings('small');
        controlGroup.removeClass('error');
        controlGroup.html('');
    },

    showAlert: function(title, text) {
        $('.note').html('<strong>' + title + '</strong><p style="position:relative;top:10px;font-size: 22px;line-height:20px;">' + text + '</p>');
        $('.note').fadeIn();
    },

    hideAlert: function() {
        $('.note').fadeOut();
    }
}
