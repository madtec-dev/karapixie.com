var app = app || {};
function Controller() {
  
  this.paintCollection = new app.Paints(paints);

  this.paintFilteredCollection = new app.Paints(paints);

  this.paint = null;

  this.categoryName = '';

  this.galleryView = null;

  this.initialize = function() {
    app.PaintControlsView.bind('nextPaint', this.nextPaint, this);
    app.PaintControlsView.bind('prevPaint', this.prevPaint, this);
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
 
    var paintFullView = new app.PaintFullView({model: this.paint});

    paintFullView.render();
    app.PaintControlsView.render(); 
    
    /*var url = '/paints/category-' + this.categoryName + '/paint-' + this.paint.get('title');
    Backbone.history.navigate(url);*/
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
    var categoryCollection = new app.Categories(categories);

    //. select the current category
    var categorySelected = categoryCollection.findWhere({name: this.categoryName});
    categorySelected.set('selected', true);
    /*
     * instead of creating a new view each time showPaints
     * is called, create the instance in the constructor and 
     * pass the collections when needed, ak.a dependency injection
     */ 
    this.galleryView = new app.GalleryView({
      paintCollection: this.paintFilteredCollection,
      categoryCollection: categoryCollection
    });

    /*
     * bind this in the constructor
     */
    /*this.galleryView.bind('paint:selected', this.showPaint, this);
    this.galleryView.bind('category:selected', this.showPaints, this);*/
    
    app.PageNavView.render();
    this.galleryView.render();
    /*var url = '/paints/category-' + this.categoryName;
    Backbone.history.navigate(url);*/
   
  };

  this.filterByCategory = function(categoryName) {
    var categoryName = categoryName || 'all';
    return categoryName === 'all' ?
           this.paintCollection :
           new app.Paints(this.paintCollection.byCategory(categoryName)) 
  };

}

    
/*CONTROLLER*/
app.Ctrl = new Controller();
app.Ctrl.initialize();
