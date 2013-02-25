Backbone.View.prototype.close = function(){
  this.remove();
  this.unbind();
  if (this.onClose){
    this.onClose();
  }
};

var AppRouter = Backbone.Router.extend({

    routes: {
        ""                  : "index",
        "home"            	: "home",
        "register"          : "register",
        "me"      	        : "settings",
        "about"             : "about",
        "reset_password"    : "forgotPW"
    },

    initialize: function () {
        this.bind( "all", this.removeUnused);
        window.activeSession = new window.Session;


        this.headerView = new HeaderView();
        $('header').html(this.headerView.el);
    },
    
    removeUnused: function () {
        if (this.homeView) this.homeView.onClose();
    },

    index: function (id) {
        if (window.activeSession.isAuthorized())
        {
            app.navigate('home', true);
        }
        else
        {
            if (!this.indexView) {
                this.indexView = new IndexView();
            }
            $('.content').html(this.indexView.el);
            utils.showActive();
            utils.showAlert('Welcome!', 'You can put in a tracking number or login by clicking the lock on the top right.');
        }
    },

    home: function (id) {
        if (window.activeSession.isAuthorized())
        {
            var user = new User();
            var self = this;
            user.fetch({
                data: { email: window.activeSession.get('email')},
                success: function(model, response) {
                    self.homeView = new HomeView({model: user});
                    $('.content').html(self.homeView.el);
                    utils.showActive();
                    utils.showAlert('Hey!', 'It\'s good to see you. Get tracking!');
                }
            });
        }
        else
        {
            app.navigate('', true);
        }
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
            utils.showActive();
            utils.showAlert('Registering', 'I see that we have your curiosity, now we can get your attention.');
        }
    },

    settings: function () {
        if (window.activeSession.isAuthorized())
        {
            var user = new User();
            user.fetch({
                data: { email: window.activeSession.get('email')},
                success: function(model, response) {
                    $('.content').html(new SettingsView({model: user}).el);
                    utils.showActive("settings");
                    utils.showAlert('Who am I?', 'Change the information associated with your account here.');
                }
            });
        }
        else
        {
            app.navigate('#', true);
        }
            
    },

    about: function () {
        if (!this.aboutView) {
            this.aboutView = new AboutView();
        }
        $('.content').html(this.aboutView.el);
        utils.showAlert('Who are we?', 'Well, that\'s explained over there. Why are you reading this?');
        utils.showActive("info");
    },

    forgotPW: function () {
        if (!this.forgotPWView) {
            this.forgotPWView = new ForgotPasswordView();
        }
        $('.content').html(this.forgotPWView.el);
        utils.hideAlert();
        utils.showActive();

    }

});

utils.loadTemplate(['HeaderView', 'IndexView', 'HomeView', "AboutView", "RegisterView", "SettingsView", "ForgotPasswordView", "PackageView"], function() {
    app = new AppRouter();

    window.activeSession.set({token: $.cookie('authtoken'), email: $.cookie('authemail')}); 

    Backbone.history.start();
});
