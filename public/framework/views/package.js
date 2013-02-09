window.PackageView = Backbone.View.extend({

    initialize: function () {
        this.render();
    },

    render: function () {
        $(this.el).html(this.template({
            name: this.model.getName(),
            tracking: this.model.tracking,
            service: this.model.service
        }));
        return this;
    }

});
