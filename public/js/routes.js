/*
 * TODO:
 *   replace bind with listenTo in order to use
 *   stopListening in close methods.
 *
 *   build an event dispatcher to remove the event chains
 *   from model to views
 *
 *   remove getPaintfromurl and getCategoryfromurl, make
 *   this.categoryCurrent and this.PaintCurrent
 *
 *   make a composite view to render other views
 *
 *   make and appview to remove zombi views
 *
 *   make a controller object to remove logic from  router
 */
$(document).on('ready', function() {

/*
 * rewrite this class in literal form.
 *
 */
function Controller() {
  
  this.paintCollection = new Paints(paints);

  this.paintFilteredCollection = new Paints(paints);

  this.paint = null;

  this.categoryName = '';

  this.galleryView = null;

  this.initialize = function() {
    PaintControlsView.bind('nextPaint', this.nextPaint, this);
    PaintControlsView.bind('prevPaint', this.prevPaint, this);
  };

  this.showPaint = function(categoryName, paintName) {
    // method is called from clic event, just have one param   
    if (categoryName && !paintName) {
      paintName = categoryName;
    }
    // method is called from router, have two params
    else {
      this.categoryName = categoryName;

    }

    this.paintFilteredCollection = this.filterByCategory(this.categoryName);
    this.paint = this.paintFilteredCollection.findWhere({title: paintName});
 
    var paintFullView = new PaintFullView({model: this.paint});

    paintFullView.render();
    PaintControlsView.render(); 
    
    var url = '/paints/category-' + this.categoryName + '/paint-' + this.paint.get('title');
    Backbone.history.navigate(url);
  };

  this.nextPaint = function() {
    this.movePaint(1);
  };
  
  this.prevPaint = function() {
    this.movePaint(-1);
  };

  this.movePaint = function(shift) {
    var currentPaintIndex =  this.paintFilteredCollection.indexOf(this.paint);
 
    currentPaintIndex += shift; 
   
    var nextPaint = this.paintFilteredCollection.at(currentPaintIndex) ? 
                   this.paintFilteredCollection.at(currentPaintIndex) :
                   shift > 0 ?
                     this.paintFilteredCollection.at(0) :
                     this.paintFilteredCollection.at(this.paintFilteredCollection.length - 1)

    Backbone.history.navigate('/paints/category-' + this.categoryName + '/paint-' + nextPaint.get('title'), {trigger: true});
  };

  this.showPaints = function(categoryName) {
    
    this.categoryName = categoryName || 'all';
    

    this.paintFilteredCollection = this.filterByCategory(this.categoryName);
    var categoryCollection = new Categories(categories);
   
    /*
     * instead of creating a new view each time showPaints
     * is called, create the instance in the constructor and 
     * pass the collections when needed, ak.a dependency injection
     */ 
    this.galleryView = new GalleryView({
      paintCollection: this.paintFilteredCollection,
      categoryCollection: categoryCollection
    });

    /*
     * bind this in the constructor
     */
    this.galleryView.bind('paint:selected', this.showPaint, this);
    this.galleryView.bind('category:selected', this.showPaints, this);
    
    PageNavView.render();
    this.galleryView.render();
    var url = '/paints/category-' + this.categoryName;
    Backbone.history.navigate(url);
   
  };

  this.filterByCategory = function(categoryName) {
    var categoryName = categoryName || 'all';
    return categoryName === 'all' ?
           this.paintCollection :
           new Paints(this.paintCollection.byCategory(categoryName)) 
  };

}

var Ctrl = new Controller();
Ctrl.initialize();
  
var Router = new (Backbone.Router.extend({


  initialize: function() { 
  },

  routes: {
    'paints/category-:category/paint-:paint(/)': 'paint',
    'paints/category-:category(/)': 'paintList',
    'paints(/)': 'paintList'
  },

  paint: function(categoryName, paintName) {
    Ctrl.showPaint(categoryName, paintName);
  },

  paintList: function(categoryName) {
    Ctrl.showPaints(categoryName);
  },

}))();

Backbone.history.start();
});
