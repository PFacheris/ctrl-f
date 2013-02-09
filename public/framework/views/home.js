window.HomeView = Backbone.View.extend({

    initialize:function () {
        this.render();
    },

    render:function () {
        $(this.el).html(this.template());
        this.packages = new ItemList(this.model.items);
        _.each(this.packages, function(package){
            $(this.el).find('#packages').append(new PackageView({model: package}));
        });
        return this;
    },

    events: {
        "click #add"        : "beforeSave"
    },
    
    
    
    beforeSave: function () {
        var trackingNumber = $('#tracking').val();
        var $ups = /\b(1Z ?[0-9A-Z]{3} ?[0-9A-Z]{3} ?[0-9A-Z]{2} ?[0-9A-Z]{4} ?[0-9A-Z]{3} ?[0-9A-Z]|[\dT]\d\d\d ?\d\d\d\d ?\d\d\d)\b/i;
        var $fedex1 = /(\b96\d{20}\b)|(\b\d{15}\b)|(\b\d{12}\b)/;
        var $fedex2 = /\b((98\d\d\d\d\d?\d\d\d\d|98\d\d) ?\d\d\d\d ?\d\d\d\d( ?\d\d\d)?)\b/;
        var $fedex3 = /^[0-9]{15}$/;
        var $usps1 = /\b(91\d\d ?\d\d\d\d ?\d\d\d\d ?\d\d\d\d ?\d\d\d\d ?\d\d|91\d\d ?\d\d\d\d ?\d\d\d\d ?\d\d\d\d ?\d\d\d\d)\b/i;
        var $usps2 = /^E\D{1}\d{9}\D{2}$|^9\d{15,21}$/;
        var $usps3 = /^91[0-9]+$/;
        var $usps4 = /^[A-Za-z]{2}[0-9]+US$/;

        var pkg = new Package();

        if ($usps1.test(trackingNumber) || $usps2.test(trackingNumber) || $usps3.test(trackingNumber) || $usps4.test(trackingNumber))
        {
            pkg.set('service', 'usps');
        }
        else if ($ups.test(trackingNumber))
        {
            pkg.set('service', 'ups');
        }
        else if ($fedex1.test(trackingNumber) || $fedex2.test(trackingNumber) || $fedex3.test(trackingNumber))
        {
            pkg.set('service', 'fedex');
        }

        pkg.set('tracking', trackingNumber); 
        pkg.save(null, {
            success: function(model, result, xhr) {
                console.log(model.attributes);
                utils.showAlert("Success!", "You tracked a package.");
                this.model.addItem(pkg);
                this.render();
            },
            error: function(model, xhr, options) {
                if (xhr.status == 400 || xhr.status == 417) {
                    utils.addValidationError('tracking', 'Invalid tracking number; we currently support USPS, UPS, and DHL.');
                    utils.showAlert("Warning", "Sorry, we couldn't find any results for that tracking number.");
                    console.log(xhr);
                }
                else {
                    console.log(model.attributes);
                }
            }
        });
    }
});
