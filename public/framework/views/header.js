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
            500
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
        "click #btnCancel"      : "toggleLoginBox",
        "click #forgotPW"       : "toggleLoginBox"
    },

    change: function() {
        $('.alert-box').css('display', 'none');
    },

    toggleLoginBox: function () {
        var newOpacity = ($tooltip.css('opacity') == 0) ? 1 : 0;
        if (newOpacity == 0)
        {
            $tooltip.animate({opacity: newOpacity}, 500, function() {
                $tooltip.toggle();
            });
        }
        else
        {
            $tooltip.toggle();
            $tooltip.animate({opacity: newOpacity}, 500);
        }
    },

    changeView: function () {
        if (window.activeSession.isAuthorized())
        {
            $loginRibbon.removeClass('login').addClass('logout');
            $settingsRibbon.css('display', '');
            $logo.attr('href', '#home');
            app.navigate('home', true);
        }
        else
        {
            $loginRibbon.removeClass('logout').addClass('login');
            $settingsRibbon.css('display', 'none');
            $logo.attr('href', '#');
            app.navigate('', true);
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
                        $.cookie('authemail', window.activeSession.get('email'), { expires: 7 });
                    
                    }
                    else{
                        $.cookie('authtoken', window.activeSession.get('token'));
                        $.cookie('authemail', window.activeSession.get('email'));
                    }
                }
            },
            error: function (model, response) {
                console.log("Error saving session.");
            }
        });
        
        app.navigate('home', true);
    },

    logout: function () {
        window.activeSession.token = "";
        window.activeSession.email = "";
        window.activeSession.clear();
        $.removeCookie('authtoken');
        $.removeCookie('authemail');
    }

});

