/*
 * TODO:
 *   replace bind with listenTo in order to use
 *   stopListening in close methods.
 *
 *   build an event dispatcher to remove the event chains
 *   from model to views
 */
$(document).on('ready', function() {
var Router = new (Backbone.Router.extend({

  initialize: function() { 
    //PaintNavigationView.bind('next', this.nextPaint, this);
    //PaintNavigationView.bind('prev', this.prevPaint, this);
  },

  routes: {
    'paints/category-:category/paint-:paint(/)': 'paint',
    'paints/category-:category(/)': 'paintList',
    'paints(/)': 'paintList'
  },

  paint: function(categoryName, paintName) {
    var paintCollection = new Paints(paints);

    var paintFilteredCollection;
    if (categoryName === 'all') {
      paintFilteredCollection = paintCollection;
    }
    else { 
      paintFilteredCollection = new Paints(paintCollection.byCategory(categoryName));
    }

    var paint = paintFilteredCollection.findWhere({title: paintName});
  
    var paintFullView = new PaintFullView({model: paint});
    paintFullView.bind('showPaint', this.showPaint, this);

    //AppView.showView(paintFullView);

    paintFullView.render();
    //PaintNavigationView.render(); 

  },

  getPaintNameFromURL: function() {
    var fragments = Backbone.history.fragment.split('/');
    // always returns the last fragment of the url althought
    // it ends with or without /
    var paintName = _.last(_.compact(fragments));  
    // this will not work if we have a paint which the url
    // contains paint-, use a regexp instead to macth just
    // the beginning of the fragment. 
    paintName = paintName.split('paint-')[1];
    return paintName;
  },

  getCategoryNameFromURL: function() { 
    var fragments = Backbone.history.fragment.split('/');
    // extract category name
    var categoryName = _.filter(fragments, function(fragment) {
      return fragment.indexOf('category-') != -1;
    })[0]; 
    categoryName = categoryName.split('category-')[1];
    return categoryName;
  },

  nextPaint: function() {
    this.movePaint(1);
  },
  
  prevPaint: function() {
    this.movePaint(-1);
  },

  movePaint: function(shift) {
    var paintName = this.getPaintNameFromURL(); 
    var categoryName = this.getCategoryNameFromURL(); 

    var currentPaint = this.paintFilteredCollection.findWhere({title: paintName});
    var currentPaintIndex =  this.paintFilteredCollection.indexOf(currentPaint);
 
    currentPaintIndex += shift; 
   
    currentPaint = this.paintFilteredCollection.at(currentPaintIndex) ? 
                   this.paintFilteredCollection.at(currentPaintIndex) :
                   shift > 0 ?
                     this.paintFilteredCollection.at(0) :
                     this.paintFilteredCollection.at(this.paintFilteredCollection.length - 1)

    Backbone.history.navigate('/paints/category-' + categoryName + '/paint-' + currentPaint.get('title'), {trigger: true});
  },

  paintList: function(categoryName) {

    var categoryName = categoryName || 'all'; 
    var paintCollection = new Paints(paints);
    
    var paintFilteredCollection;
    if (categoryName === 'all') {
      paintFilteredCollection = paintCollection;
    }
    else { 
      paintFilteredCollection = new Paints(paintCollection.byCategory(categoryName));
    }

    var categoryCollection = new Categories(categories);
    
    var galleryView = new GalleryView({
      paintCollection: paintFilteredCollection,
      categoryCollection: categoryCollection
    });
    galleryView.bind('showPaint', this.showPaint, this);
    galleryView.bind('showPaints', this.showPaints, this);
    galleryView.render();
    /*
    var paintThumbListView = new PaintThumbListView({collection: paintFilteredCollection});
    paintThumbListView.bind('showPaint', this.showPaint, this);
    paintThumbListView.render();
    
    var categoryCollection = new Categories(categories);
    var categoryListView = new CategoryListView({collection: categoryCollection});
    categoryListView.bind('showPaints', this.showPaints, this);
    categoryListView.render();
    */
  },

  showPaint: function(e) {
    var categoryName = this.getCategoryNameFromURL();
    var url = '/paints/category-' + categoryName + '/paint-' + e.model.get('title');
    Backbone.history.navigate(url, {trigger: true});
  },

  showPaints: function(e) {
    var categoryName = e.model.get('name');
    var url = '/paints/category-' + categoryName
    Backbone.history.navigate(url, {trigger: true});

  }

}))();

Backbone.history.start();
});
