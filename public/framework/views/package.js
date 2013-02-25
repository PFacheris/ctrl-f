window.PackageView = Backbone.View.extend({

    initialize: function () {
        this.listenTo(this.model, "change", this.render);
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
        if (this.model.get('trackingInfo')) {
            for (var i = 0; i < this.model.get('trackingInfo').length; i++){
                var step = this.model.get('trackingInfo')[i];
                var date = new Date(parseInt(step.date));
                var formattedDate = date.toUTCString()
                var location = step.location.city && step.location.state ? step.location.city + ", " + step.location.state : "";
                $(this.el).find("#details").append(
                    "<li><p>" + step.status + " on " + formattedDate + "</p>" +
                    "<p style='color:grey;margin-top:-15px;'>" + location + "</p></li>"
                );
            }
        }
        return this;
    },

    events: {
        "change":           "render",
        "click #view":      "viewOnMap"
    },

    viewOnMap: function () {
        var $button = $(this.el).find("#view");
        if ($button.html().indexOf("View") != -1)
        {
            setLocations(this.model.get('trackingInfo'));
            $button.find("small").html("Hide");
            $button.css("color", "rgba(76, 76, 76, 0.7)");
        }
        else
        {
            deleteOverlays()
            $button.find("small").html("View");
            $button.css("color", "");
        }
    }

});
