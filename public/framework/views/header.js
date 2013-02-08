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
            $('.login').toggleClass('login').toggleClass('settings');
            this.toggleLoginBox();
        }
        else
        {
            $('#txtEmail').addClass('error');
            $('#txtPassword').addClass('error');
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
        window.activeSession.save();

        this.checkSession(); 
    },

    showActive: function (menuItem) {
        $('.ribbon').removeClass('active');
        if (menuItem) {
            $('.' + menuItem).addClass('active');
        }
    }

});

