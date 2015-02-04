var Paints = Backbone.Collection.extend({

  model: Paint,

  byCategory: function(category) {
    var filtered = this.filter(function(paint) {
      return paint.get('category') === category;
    });
    return filtered;
  },

});
var Categories = Backbone.Collection.extend({

  model: Category,

});
