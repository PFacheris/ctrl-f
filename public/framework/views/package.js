window.PackageView = Backbone.View.extend({

    initialize: function () {
        this.render();
    },

    render: function () {
        $(this.el).html(this.template({
            id: this.model.get('_id'),
            delivered: this.model.get('delivered'),
            name: this.model.get('name'),
            tracking: this.model.get('tracking'),
            service: this.model.get('service').toUpperCase()
        }));
        return this;
    },

    events: {
        "change":           "render",
        "click #view":      "viewOnMap"
    },

    viewOnMap: function () {
        var $button = $(this.el).find("#view");
        if ($button.html() == "View")
        {
            setLocations(this.model.get('trackingInfo'));
            $button.html("Hide");
            $button.css("color", "rgba(76, 76, 76, 0.7)");
        }
        else
        {
            //deleteFromMap();
            $button.html("View");
            $button.css("color", "");
        }
    }

});
