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

    displayValidationErrors: function (messages, parent) {
        for (var key in messages) {
            if (messages.hasOwnProperty(key)) {
                this.addValidationError(key, messages[key], parent);
            }
        }
        this.showAlert('Warning!', 'Fix validation errors and try again', 'alert', parent);
    },

    addValidationError: function (field, message, parent) {
        var controlGroup = parent.find('#' + field).siblings('small');
        controlGroup.addClass('error');
        controlGroup.html(message);
    },

    removeValidationError: function (field, parent) {
        var controlGroup = parent.find('#' + field).siblings('small');
        controlGroup.removeClass('error');
        controlGroup.html('');
    },

    showAlert: function(title, text, klass, parent) {
        parent.find('.alert-box').removeClass("alert success secondary");
        parent.find('.alert-box').addClass(klass);
        parent.find('.alert-box').html('<strong>' + title + '</strong> ' + text);
        parent.find('.alert-box').show();
    },

    hideAlert: function() {
        parent.find('.alert-box').hide();
    }
}
