var self;

window.HomeView = Backbone.View.extend({

    initialize:function () {
        self = this;
        this.listenTo(this.model.get('items'), "remove", self.addAll);
        this.render();
    },

    render:function () {
        $(this.el).html(this.template());
        makeMap($(this.el).find('#map').get(0));
        this.addAll();
        return this;
    },

    addAll: function () {
        $(self.el).find('#packages').html(" ");
        self.model.get('items').each(self.addOne);
    },

    addOne: function (package) {
        var view = new PackageView({model: package});
        view.render();
        $(self.el).find('#packages').append(view.el);
    },

    events: {
        "click #add"        : "beforeSave",
        "click #remove"     : "removePackage"
    },

    removePackage: function (ev) {
        var id = $(ev.target).parents('li').attr('id');
        var toRemove = self.model.get('items').get(id);
        self.model.get('items').remove(toRemove);
        toRemove.destroy({
            success: function(model, result, xhr) {
                utils.showAlert("Removed", "The selected package was removed.");
            },
            error: function(model, xhr, options) {
                utils.showAlert("Error", "The selected package could not be removed.");
            }
        });
        self.model.save();
    },

    beforeSave: function () {
        var package = new Package();

        var trackingNumber = $('#tracking').val();
        var $ups = /\b(1Z ?[0-9A-Z]{3} ?[0-9A-Z]{3} ?[0-9A-Z]{2} ?[0-9A-Z]{4} ?[0-9A-Z]{3} ?[0-9A-Z]|[\dT]\d\d\d ?\d\d\d\d ?\d\d\d)\b/i;
        var $fedex1 = /(\b96\d{20}\b)|(\b\d{15}\b)|(\b\d{12}\b)/;
        var $fedex2 = /\b((98\d\d\d\d\d?\d\d\d\d|98\d\d) ?\d\d\d\d ?\d\d\d\d( ?\d\d\d)?)\b/;
        var $fedex3 = /^[0-9]{15}$/;
        var $usps1 = /\b(91\d\d ?\d\d\d\d ?\d\d\d\d ?\d\d\d\d ?\d\d\d\d ?\d\d|91\d\d ?\d\d\d\d ?\d\d\d\d ?\d\d\d\d ?\d\d\d\d)\b/i;
        var $usps2 = /^E\D{1}\d{9}\D{2}$|^9\d{15,21}$/;
        var $usps3 = /^91[0-9]+$/;
        var $usps4 = /^[A-Za-z]{2}[0-9]+US$/;

        if ($usps1.test(trackingNumber) || $usps2.test(trackingNumber) || $usps3.test(trackingNumber) || $usps4.test(trackingNumber))
        {
            package.set('service', 'usps');
        }
        else if ($ups.test(trackingNumber))
        {
            package.set('service', 'ups');
        }
        else if ($fedex1.test(trackingNumber) || $fedex2.test(trackingNumber) || $fedex3.test(trackingNumber))
        {
            package.set('service', 'fedex');
        }

        package.set('tracking', trackingNumber); 
        package.save(null, {
            success: function(model, result, xhr) {
                utils.showAlert("Success!", "You tracked a package.");
                self.model.addItem(model);
            },
            error: function(model, xhr, options) {
                if (xhr.status == 400 || xhr.status == 417) {
                    utils.addValidationError('tracking', 'Invalid tracking number, we currently support USPS, UPS, and DHL.');
                    utils.showAlert("Warning", "We couldn't find any results for that tracking number, sorry.");
                }
                else {
                    utils.showAlert("Error", "Something went wrong, we'll check it out.");
                }
            }
        });
    }
});
