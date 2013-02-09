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
        if (window.activeSession.isAuthorized())
        {
            app.navigate('home', true);
        }
        else
        {
            var package = new Package();
            $('.content').html(new IndexView({model: package}).el);
            //this.headerView.selectMenuItem('home-menu');
        }
        utils.showAlert('Welcome!', 'You can put in a tracking number or login by clicking the lock on the top right.');
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
        utils.showAlert('Hey!', 'It\'s good to see you. Get tracking!');
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
        utils.showAlert('Regsitering', 'I see that we have your curiousity, now we can get your attention.');
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
            
        utils.showAlert('Who am I?', 'Change the information associated with your account here.');
    },

    about: function () {
        if (!this.aboutView) {
            this.aboutView = new AboutView();
        }
        $('.content').html(this.aboutView.el);
        utils.showAlert('Who are we?', 'Well, that\'s explained over there. Why are you reading this?');
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

