var app = app || {};

app.Controller = {

  paintCollection: new app.Paints(paints),

  paintFilteredCollection: new app.Paints(paints),

  categoryCollection: new app.Categories(categories),

  paint: null,

  
  initialize: function() {
    //app.PaintControlsView.bind('nextPaint', this.nextPaint, this);
    //app.PaintControlsView.bind('prevPaint', this.prevPaint, this);
    
    //app.PaginatorControlsView.bind('nextPage', this.nextPage, this);
    //app.PaginatorControlsView.bind('prevPage', this.prevPage, this);
  },
  
  showPaints: function(categoryName, pageNum) {  

    this.categoryName = categoryName || 'all';
    this.pageNum = pageNum || 0;

    this.paintFilteredCollection = app.PaintsFilter.byCategoryName(
      this.paintCollection,
      this.categoryName
    );
  
    app.CollectionPaginator.setCollection(this.paintFilteredCollection);

    var paginatorButtonsView = new app.PaginatorButtonsView();   
    var paintThumbListView = new app.PaintThumbListView(
        {collection: app.CollectionPaginator.getPage(this.pageNum)}
    );
    var categoryListView = new app.CategoryListView(
        {collection: this.categoryCollection}
    );
    
    var $paintApp = $('.paint-app');
    $paintApp.empty();
    $paintApp.append(categoryListView.render().el);
    $paintApp.append(paintThumbListView.render().el);
    $paintApp.append(paginatorButtonsView.render().el);

  },

}

function Controller() {
  
  this.paintCollection = new app.Paints(paints);

  this.paintFilteredCollection = new app.Paints(paints);

  this.categoryCollection = new app.Categories(categories);

  this.paint = null;

  this.categoryName = '';

  this.initialize = function() {
    app.PaintControlsView.bind('nextPaint', this.nextPaint, this);
    app.PaintControlsView.bind('prevPaint', this.prevPaint, this);
    
    app.PaginatorControlsView.bind('nextPage', this.nextPage, this);
    app.PaginatorControlsView.bind('prevPage', this.prevPage, this);
  };

  this.showPaint = function(categoryName, paintName) {
    
    this.categoryName = categoryName || 'all';

    //
    this.paintFilteredCollection = this.filterByCategory(this.categoryName);
    
    this.paint = this.paintFilteredCollection.findWhere({title: paintName});
 
    var paintFullView = new app.PaintFullView({model: this.paint});
   
    var $paintApp = $('.paint-app'); 
    $paintApp.empty();
    $paintApp.append(paintFullView.render().el);
    $paintApp.append(app.PaintControlsView.render().el);
 
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

  this.nextPage = function() {
     
  };

  this.showPaints = function(categoryName, pageNum) {  

    this.categoryName = categoryName || 'all';
    var pageNum = pageNum || 0;
    
    this.paintFilteredCollection = this.filterByCategory(this.categoryName); 
    this.categoryCollection.selectCategory(this.categoryName);
    
    var paintsPaginator = new app.CollectionPaginator(this.paintFilteredCollection.toArray());
    var page = paintsPaginator.getPage(pageNum);
  
    //paintsPaginator.selectPage(page);

    var paginatorButtonsView = new app.PaginatorButtonsView(
        {collection: paintsPaginator}  
    );
    var paintThumbListView = new app.PaintThumbListView(
        {collection: new app.Paints(page)}
    );
    var categoryListView = new app.CategoryListView(
        {collection: this.categoryCollection}
    );
    

    var $paintApp = $('.paint-app');
    $paintApp.empty();
    $paintApp.append(categoryListView.render().el);
    $paintApp.append(paintThumbListView.render().el);
    $paintApp.append(paginatorButtonsView.render().el);

  };

  this.filterByCategory = function(categoryName) {
    var categoryName = categoryName || 'all';
    return categoryName === 'all' ?
           this.paintCollection :
           new app.Paints(this.paintCollection.byCategory(categoryName)) 
  };

}

    
/*CONTROLLER*/
//app.Ctrl = new Controller();
//app.Ctrl.initialize();

app.Ctrl = app.Controller;
app.Ctrl.initialize();
