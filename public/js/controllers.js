var app = app || {};

app.Ctrl = {

  paintCollection: new app.Paints(paints),

  paintFilteredCollection: new app.Paints(paints),

  categoryCollection: new app.Categories(categories),

  paint: null,

  paintsPaginator: null,

  //paintPaginator: new app.CollectionPaginator({delta: 1}),

  initialize: function() {
    app.PaintControlsView.bind('nextPaint', this.nextPaint, this);
    app.PaintControlsView.bind('prevPaint', this.prevPaint, this);
    
    app.PaginatorControlsView.bind('nextPage', this.nextPage, this);
    app.PaginatorControlsView.bind('prevPage', this.prevPage, this);
  },

  showPaint: function(categoryName, paintName) {
  
    this.categoryName = categoryName || 'all';

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

    var nextPaintName = this.paintFilteredCollection.at(nextPaintIndex).get('title');
    
    Backbone.history.navigate(
      '/paints/category-' + this.categoryName + '/paint-' + nextPaintName + '/',
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
    var nextPageNum = this.pageNum + 1;
    Backbone.history.navigate(
        '/paints/category-' + this.categoryName + '/page-' + nextPageNum + '/',
        {trigger: true}
    )
  },
  
  prevPage: function() {
    var prevPageNum = this.pageNum - 1;
    Backbone.history.navigate(
        '/paints/category-' + this.categoryName + '/page-' + prevPageNum + '/',
        {trigger: true}
    )
  },

}

app.Ctrl.initialize();
