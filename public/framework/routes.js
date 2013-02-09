var AppRouter = Backbone.Router.extend({

    routes: {
        ""                  : "index",
        "home"            	: "home",
        "register"          : "register",
        "me"      	        : "settings",
        "about"             : "about",
        "reset_password"        : "forgotPW"
    },

    initialize: function () {
        window.activeSession = new window.Session;

        this.headerView = new HeaderView();
        $('header').html(this.headerView.el);
    },

    index: function (id) {
        if (!this.indexView) {
            this.indexView = new IndexView();
        }
        $('.content').html(this.indexView.el);
        //this.headerView.selectMenuItem('home-menu');
        utils.hideAlert();
    },

    home: function (id) {
        if (window.activeSession.isAuthorized())
        {
            var user = new User();
            user.fetch({
                data: { email: window.activeSession.get('email')},
                success: function(model, response) {
                    $('.content').html(new HomeView({model: user}).el);
                }
            });
        }
        else
        {
            app.navigate('', true);
        }
        utils.hideAlert();
    },

    register: function () {
        if (window.activeSession.isAuthorized())
        {
            app.navigate('home', true);
        }
        else
        {
            var user = new User();
            $('.content').html(new RegisterView({model: user}).el);
            //this.headerView.selectMenuItem('home-menu');
        }
        utils.hideAlert();
    },

    settings: function () {
        if (window.activeSession.isAuthorized())
        {
            var user = new User();
            user.fetch({
                data: { email: window.activeSession.get('email')},
                success: function(model, response) {
                    $('.content').html(new SettingsView({model: user}).el);
                }
            });
        }
        else
            app.navigate('#', true);
        utils.hideAlert();
    },

    about: function () {
        if (!this.aboutView) {
            this.aboutView = new AboutView();
        }
        $('.content').html(this.aboutView.el);
        utils.hideAlert();
    },

    forgotPW: function () {
        if (!this.forgotPWView) {
            this.forgotPWView = new ForgotPasswordView();
        }
        $('.content').html(this.forgotPWView.el);
        utils.hideAlert();

    }

});

utils.loadTemplate(['HeaderView', 'IndexView', 'HomeView', "AboutView", "RegisterView", "SettingsView", "ForgotPasswordView", "PackageView"], function() {
    app = new AppRouter();

    window.activeSession.set({token: $.cookie('authtoken')}); 

    Backbone.history.start();
});

