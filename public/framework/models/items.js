window.ItemList = Backbone.Collection.extend({
    model: Item,

    updateAll: function () {
        var self = this;
        for (var i = 0; i < self.models.length; i++)
        {
            (function (i) {
                self.updateOne(i);
            })(i);
        }
    },
    
    updateOne: function(index) {
        this.models[index].fetch();
    }
});
