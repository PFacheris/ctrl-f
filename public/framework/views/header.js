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
        $logo = $(this.el).find('#logo');
        return this;
    },

    events: {
        "change"                : "change",
        "click .login"          : "toggleLoginBox",
        "click .logout"         : "logout",
        "click #register"       : "toggleLoginBox",
        "click #btnSubmit"      : "login",
        "click #btnCancel"      : "toggleLoginBox"
    },

    change: function() {
        $('.alert-box').css('display', 'none');
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
            $logo.attr('href', '#home');
        }
        else
        {
            $loginRibbon.removeClass('logout').addClass('login');
            $settingsRibbon.css('display', 'none');
            $logo.attr('href', '#');
        }
    },

    checkSession: function () {
        if (window.activeSession.isAuthorized())
        {
            $('.error').removeClass('error');
            this.toggleLoginBox();
            return true;
        }
        else
        {
            $('.alert-box').css('display', '');
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
                    if ($("input[name='remember']").is(':checked')){
                        $.cookie('authtoken', window.activeSession.get('token'), { expires: 7 });
                    }
                    else{
                        $.cookie('authtoken', window.activeSession.get('token'));
                    }
                }
            },
            error: function (model, response) {
                console.log("Error saving session.");
            }
        });

    },

    logout: function () {
        window.activeSession.token = "";
        window.activeSession.clear();
        $.removeCookie('authtoken');
    },

    showActive: function (menuItem) {
        $('.ribbon').removeClass('active');
        if (menuItem) {
            $('.' + menuItem).addClass('active');
        }
    }

});

