window.IndexView = Backbone.View.extend({

    initialize:function () {
        this.render();
    },

    render:function () {
        $(this.el).html(this.template());
        return this;
    },

    events: {
        "click #add"        : "beforeSave"
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
                console.log(model.get('trackingInfo'));
                setLocations(model.get('trackingInfo'));
            },
            error: function(model, xhr, options) {
                if (xhr.status == 400 || xhr.status == 417) {
                    utils.addValidationError('tracking', 'Invalid tracking number, we currently support USPS, UPS, and DHL.');
                    utils.showAlert("Warning", "We couldn't find any results for that tracking number, sorry.");
                }
                else {
                    console.log(model.attributes);
                    console.log(xhr);
                }
            }
        });
    }
});
