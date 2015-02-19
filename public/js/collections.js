app.Paints = Backbone.Collection.extend({

  model: app.Paint,

  byCategory: function(category) {
    var filtered = this.filter(function(paint) {
      return paint.get('category') === category;
    });
    return filtered;
  },

});
app.Categories = Backbone.Collection.extend({

  model: app.Category,
  
});
