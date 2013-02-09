window.HomeView = Backbone.View.extend({

    initialize:function () {
        this.packages = new ItemList(this.model.items);
        this.render();
    },

    render:function () {
        $(this.el).html(this.template());
        _.each(this.packages, function(package){
            $(this.el).find('#packages').append(new PackageView({model: package}));
        });
        return this;
    }

});
