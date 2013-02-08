window.HeaderView = Backbone.View.extend({

    initialize: function () {
        var $tooltip;
        var $loginRibbon;
        var $settingsRibbon;
        if (window.activeSession)
            this.listenTo(window.activeSession, "change", this.changeView);
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
        $tooltip = $(this.el).find('#login');
        $loginRibbon = $(this.el).find('.login');
        $settingsRibbon = $(this.el).find('.settings').parents('li');
        this.changeView();
        return this;
    },

    events: {
        "click .login"          : "toggleLoginBox",
        "click .logout"         : "logout",
        "click #btnSubmit"      : "login",
        "click #btnCancel"      : "toggleLoginBox"
    },

    toggleLoginBox: function () {
        var newOpacity = ($tooltip.css('opacity') == 0) ? 1 : 0;
        $tooltip.animate({opacity: newOpacity}, 500);
    },
    
    changeView: function () {
        if (window.activeSession.isAuthorized())
        {
            $loginRibbon.removeClass('login').addClass('logout');
            $settingsRibbon.css('display', '');
        }
        else
        {
            $loginRibbon.removeClass('logout').addClass('login');
            $settingsRibbon.css('display', 'none');
        }
    },

    checkSession: function () {
        if (window.activeSession.isAuthorized())
        {
            $('.error').removeClass('error');
            if ($tooltip.css('opacity') == 1)
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
    
    logout: function () {
        window.activeSession.id = "";
        window.activeSession.clear();
    },

    showActive: function (menuItem) {
        $('.ribbon').removeClass('active');
        if (menuItem) {
            $('.' + menuItem).addClass('active');
        }
    }

});

