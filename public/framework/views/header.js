window.HeaderView = Backbone.View.extend({

    initialize: function () {
        if (window.activeSession)
            this.listenTo(window.activeSession, "change", this.checkSession);
        this.render();
    },

    render: function () {
        var self = this;
        $(this.el).html(this.template());
        $(this.el).find('nav').css('background', 'none');
        $(this.el).find('#header').animate(
            {top: '0px'},
            500,
            function() {
                $('.ribbon').animate({marginTop: '-28px'}, 500);
            }
        );
        this.checkSession();
        return this;
    },

    events: {
        "click .login"        : "toggleLoginBox",
        "click #btnSubmit"    : "login",
        "click #btnCancel"    : "toggleLoginBox"
    },

    toggleLoginBox: function () {
        var newOpacity = ($('#login').css('opacity') == 0) ? 1 : 0;
        $('#login').animate({opacity: newOpacity}, 500);
    },

    checkSession: function () {
        if (window.activeSession.isAuthorized())
        {
            $('.error').removeClass('error');
            $('.login').toggleClass('login').toggleClass('logout');
            $('.settings').toggle();
            if ($('#login').css('opacity') == 1)
                this.toggleLoginBox();
            return true;
        }
        else
        {
            $('#txtEmail').addClass('error');
            $('#txtPassword').addClass('error');
            return false;
        }
    },

    login: function () {
        window.activeSession.set(
            {
                email: $('#txtEmail').val(),
                password: $('#txtPassword').val()
            },{
                silent:true
            }
        );
        var view = this;
        window.activeSession.save({}, {
            success: function (model, response) {
                if(view.checkSession())
                {
                    if ($("input[name='remember']").is(':checked'))
                        $.cookie('authtoken', window.activeSession.get('token'), { expires: 7 });
                    else
                        $.cookie('authtoken', window.activeSession.get('token'));
                }
            },
            error: function (model, response) {
                console.log("Error saving session.");
            }
        });

    },

    showActive: function (menuItem) {
        $('.ribbon').removeClass('active');
        if (menuItem) {
            $('.' + menuItem).addClass('active');
        }
    }

});

