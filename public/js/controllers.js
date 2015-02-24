var app = app || {};
/*
 * add exception for nextPage not found
 */
app.CollectionPaginator = function(options) {

  this.offset = options.offset || 0;
  this.delta = options.delta || 2;
  this.limit = this.delta;
  this.collection = options.collection;

  
  this.nextPage = function() {
    var collectionPage = this.collection;
    var nextPage = collectionPage.slice(this.offset, this.limit);
    this.offset += this.delta;
    this.limit += this.delta;

    return nextPage;
  };

  this.prevPage = function() {
    this.offset -= this.delta;
    this.limit -= this.delta;

    var collectionPage = this.collection;
    var prevPage = collectionPage.slice(this.offset, this.limit);

    if ( this.offset < 0 ) this.offset = 0;
    if ( this.limit < this.delta) this.limit = this.delta;

    return prevPage;
  };

  this.getPage = function(pageNum) {
    var page = this.nextPage();
    var i = 0;
    while ( i < pageNum ) {
      page = this.nextPage();
      i++;
    }

    return page;
  };
  
  this.getPageCount = function() {
    return Math.ceil(this.collection.length / this.delta);
  };

  this.getNumPageFor = function(elem) {
    var itemIndex = this.collection.indexOf(elem); 
    return Math.floor(itemIndex / this.delta);
  };
  
};

app.Ctrl = {

  /*
   * put this collectionPaginator
   * make it a backbone collection
   * use on reset event to restore the pointers
   */

  paintCollection: new app.Paints(paints),

  paintFilteredCollection: new app.Paints(paints),

  categoryCollection: new app.Categories(categories),

  paintsPaginator: new app.CollectionPaginator({}),

  paint: null,

  paintsPaginator: null,

  pageNum: 0,

  initialize: function() {
    app.PaintControlsView.bind('nextPaint', this.nextPaint, this);
    app.PaintControlsView.bind('prevPaint', this.prevPaint, this);
    
    app.PaginatorControlsView.bind('nextPage', this.nextPage, this);
    app.PaginatorControlsView.bind('prevPage', this.prevPage, this);
  },

  showPaint: function(categoryName, pageNum,  paintName) {
   
    this.categoryName = categoryName || 'all';
    this.pageNum = pageNum || 0;

    this.paintFilteredCollection = app.PaintsFilter.byCategoryName(
      this.paintCollection,
      this.categoryName
    );
    
    this.paint = this.paintFilteredCollection.findWhere({title: paintName});
 
    var paintFullView = new app.PaintFullView({model: this.paint});
   
    var $paintApp = $('.paint-app'); 
    $paintApp.empty();
    $paintApp.append(app.PageNavView.render().el);
    $paintApp.append(paintFullView.render().el);
    $paintApp.append(app.PaintControlsView.render().el);
  },

  nextPaint: function() {
    this.movePaint(1); 
  },
  
  prevPaint: function() {
    this.movePaint(-1); 
  },

  movePaint: function(shift) { 
    /*
     * implement this logic using the paginator
     */
    var currentPaintIndex = this.paintFilteredCollection.indexOf(this.paint);
    var nextPaintIndex = currentPaintIndex + shift;

    if ( nextPaintIndex < 0 ) {
      nextPaintIndex = this.paintFilteredCollection.length - 1;
    }

    if ( nextPaintIndex === this.paintFilteredCollection.length ) {
      nextPaintIndex = 0;
    };

    var nextPaint = this.paintFilteredCollection.at(nextPaintIndex);
    var nextPaintName = nextPaint.get('title');
   
    this.paintsPaginator = new app.CollectionPaginator({
      collection: this.paintFilteredCollection
    });
    this.pageNum = this.paintsPaginator.getNumPageFor(nextPaint);

    Backbone.history.navigate(
      '/paints/category-' + this.categoryName + '/page-' + this.pageNum + '/paint-' + nextPaintName + '/',
      {trigger: true} 
    );
    
  },

  showPaints: function(categoryName, pageNum) {  

    this.categoryName = categoryName || 'all';
    this.pageNum = pageNum || 0;

    this.paintFilteredCollection = app.PaintsFilter.byCategoryName(
      this.paintCollection,
      this.categoryName
    );
  
    
    this.paintsPaginator = new app.CollectionPaginator({
      collection: this.paintFilteredCollection
    });
    

    var paginatorButtonsView = new app.PaginatorButtonsView();   
    var paintThumbListView = new app.PaintThumbListView({
      collection: new app.Paints(this.paintsPaginator.getPage(this.pageNum))
    });
    var categoryListView = new app.CategoryListView(
        {collection: this.categoryCollection}
    );
    
    var $paintApp = $('.paint-app');
    $paintApp.empty();
    $paintApp.append(app.PageNavView.render().el);
    $paintApp.append(categoryListView.render().el);
    $paintApp.append(paintThumbListView.render().el);
    $paintApp.append(paginatorButtonsView.render().el);
    $paintApp.append(app.PaginatorControlsView.render().el);
  
  },

  nextPage: function() {
    /*
     * this needs circular logic
     */
    var nextPageNum = this.pageNum + 1;
    Backbone.history.navigate(
        '/paints/category-' + this.categoryName + '/page-' + nextPageNum + '/',
        {trigger: true}
    )
  },
  
  prevPage: function() {
    /*
     * this needs circular logic
     */
    var prevPageNum = this.pageNum - 1;
    Backbone.history.navigate(
        '/paints/category-' + this.categoryName + '/page-' + prevPageNum + '/',
        {trigger: true}
    )
  },

}

app.Ctrl.initialize();
