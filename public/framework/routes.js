var AppRouter = Backbone.Router.extend({

    routes: {
        ""                  : "index",
        "home"            	: "home",
        "me"      	        : "settings",
        "about"             : "about"
    },

    initialize: function () {
        this.headerView = new HeaderView();
        $('.header').html(this.headerView.el);
    },

    home: function (id) {
        if (!this.homeView) {
            this.homeView = new HomeView();
        }
        $('.content').html(this.homeView.el);
        this.headerView.selectMenuItem('home-menu');
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
        this.headerView.selectMenuItem('about-menu');
    }

});

utils.loadTemplate(['IndexView', 'HomeView', 'HeaderView', 'AboutView'], function() {
    app = new AppRouter();
    
    window.activeSession = new window.Sesssion;

    Backbone.history.start({pushState: true});
});

