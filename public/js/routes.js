app.Router = new (Backbone.Router.extend({


  initialize: function() { 
  },

  /*
   * handle the route paints/page-:pageNum
   * pageNum must be an integer
   */
  routes: {
    'paints(/)': 'paintList',
    'paints/category-:category/page-:pageNum/paint-:paint(/)': 'paint',
    'paints/category-:category(/)': 'paintList',
    /*
     * pageNum is a string so we need to cast it to integer.
     */
    'paints/category-:category/page-:pageNum(/)': 'paintList',
  },

  paint: function(categoryName, pageNum, paintName) {
    var pageNum = parseInt(pageNum, 10);
    app.Ctrl.showPaint(categoryName, pageNum,  paintName);
  },

  paintList: function(categoryName, pageNum) {
    var pageNum = parseInt(pageNum, 10);
    app.Ctrl.showPaints(categoryName, pageNum);
  },


}));

Backbone.history.start();
