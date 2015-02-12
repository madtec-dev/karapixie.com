app.Router = new (Backbone.Router.extend({


  initialize: function() { 
  },

  routes: {
    'paints(/)': 'paintList',
    'paints/category-:category/paint-:paint(/)': 'paint',
    'paints/category-:category(/)': 'paintList',
    
  },

  paint: function(categoryName, paintName) {
    app.Ctrl.showPaint(categoryName, paintName);
  },

  paintList: function(categoryName) {
    app.Ctrl.showPaints(categoryName);
  },

}));

Backbone.history.start();
