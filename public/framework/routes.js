var AppRouter = Backbone.Router.extend({

    routes: {
        ""                  : "index",
        "home"            	: "home",
        "register"          : "register",
        "me"      	        : "settings",
        "about"             : "about"
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
    },

    home: function (id) {
        if (window.activeSession.isAuthorized())
        {
            if (!this.homeView) {
                this.homeView = new HomeView();
            }
            $('.content').html(this.homeView.el);
            //this.headerView.selectMenuItem('home-menu');
        }
        else
            app.navigate('#', false);
    },

    register: function () {
        if (window.activeSession.isAuthorized())
        {
            app.navigate('home', false);
        }
        else
        {
            var user = new User();
            $('.content').html(new RegisterView({model: user}).el);
            //this.headerView.selectMenuItem('home-menu');
        }
    },

    settings: function (id) {
        if (window.activeSession.isAuthorized())
        {
            if (!this.homeView) {
                this.homeView = new SettingsView();
            }
            $('.content').html(this.homeView.el);
            this.headerView.selectMenuItem('settings-menu');
        }
        else
            app.navigate('#', false);
    },

    about: function () {
        if (!this.aboutView) {
            this.aboutView = new AboutView();
        }
        $('.content').html(this.aboutView.el);
    }

});

utils.loadTemplate(['HeaderView', 'IndexView', 'HomeView', "AboutView", "RegisterView", "SettingsView"], function() {
    app = new AppRouter();

    window.activeSession.set({token: $.cookie('authtoken')}); 

    Backbone.history.start();
});

