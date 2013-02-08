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
            app.navigate('#');
    },

    register: function () {
        var user = new User();
        $('.content').html(new RegisterView({model: user}).el);
        //this.headerView.selectMenuItem('home-menu');
    },

    settings: function (id) {
        if (!this.homeView) {
            this.homeView = new SettingsView();
        }
        $('.content').html(this.homeView.el);
        this.headerView.selectMenuItem('settings-menu');
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

    var localToken = $.cookie('authtoken');
    if (localToken)
        window.activeSession.save({token: localToken}); 

    Backbone.history.start();
});

