/*
 * manages other views.
 */
var AppView = new (function() {
  this.showView = function(view) {
    if (this.currentView) {
      this.currentView.close();
    }
    else {
      this.currentView = view;
      this.currentView.render();
    }
  }
})();


app.PaintThumbView = Backbone.View.extend({

  model: app.Paint,

  tagName: 'p',

  className: 'paint paint--thumb',

  template: _.template($('#paint-thumb-template').html()),

  render: function() {
    this.$el.html(this.template({
      paint: this.model, 
      category: app.Ctrl.categoryName,
      pageNum: app.Ctrl.pageNum
    })
    );
    return this;
  },

});

app.PaintFullView = Backbone.View.extend({
  
  model: app.Paint,

  template: _.template($('#paint-full-template').html()),

  render: function() {
    this.$el.html(this.template({paint: this.model}));
    return this;
  }

});


app.PaintThumbListView = Backbone.View.extend({

  model: app.Paint,

  tagName: 'div',

  render: function(category) {   
    this.$el.empty();
    var self = this;
    this.collection.each(function(paint) {
      var paintThumbView = new app.PaintThumbView({model: paint});
      self.$el.append(paintThumbView.render().el);
      
    });
    return this;
  },

  close: function() {
    this.remove();
  }

});


app.PaintControlsView = new (Backbone.View.extend({

  className: 'navigation',

  template: _.template($('#paint-controls-template').html()),

  events: {
    'click .next': 'nextPaint',
    'click .prev': 'prevPaint'
  },

  render: function() {
    this.$el.html(this.template());
    return this;
  },

  nextPaint: function() {
    this.trigger('nextPaint');
  },

  prevPaint: function() {
    this.trigger('prevPaint');
  }

}))();

app.CategoryView = Backbone.View.extend({

  model: app.Category,

  tagName: 'li',

  className: 'category',

  template: _.template($('#category-template').html()),

  render: function() {
    if ( this.model.get('name') === app.Ctrl.categoryName  ) {
      this.$el.css('color', 'red');
    }
    this.$el.html(this.template({category: this.model}));
    return this;
  }

}); 

app.CategoryListView = Backbone.View.extend({

  tagName: 'div',

  render: function() {
    this.$el.empty();
    var self = this;
    this.collection.each(function(category) {
      var categoryView = new app.CategoryView({model: category});
      self.$el.append(categoryView.render().el);
    });
    return this;
  },


});
 

app.PageNavView = new (Backbone.View.extend({

  className: 'page-nav',

  template: _.template($('#page-nav-template').html()),

  render: function() {
    this.$el.empty();
    this.$el.html(this.template());
    return this;
  }

}))();


app.PaginatorButtonView = Backbone.View.extend({

  tagName: 'li',

  className: 'paints-paginator__item',

  template: _.template($('#paginator-button-template').html()),

  initialize: function(options) {
    this.pageNum = options.pageNum;
  },

  render: function() {

    if ( this.pageNum == app.Ctrl.pageNum ) {
      this.$el.css('background', 'red');
    }

    this.$el.html(this.template({pageNum: this.pageNum, category: app.Ctrl.categoryName}));
    return this;
  },

});

app.PaginatorButtonsView = Backbone.View.extend({

  tagName: 'ul',

  className: 'paints-paginator',

  render: function() {
    for ( var pageNum = 0; pageNum < app.Ctrl.paintsPaginator.getPageCount(); pageNum++ ) {
      var paginatorButtonView = new app.PaginatorButtonView({pageNum: pageNum});
      this.$el.append(paginatorButtonView.render().el);
    }
    return this;
  },

});

app.PaginatorControlsView = new (Backbone.View.extend({

  /*
   * access current num page and pageNumcount from the
   * current paginator;
   */

  className: 'paginator-controls',

  template: _.template($('#paginator-controls-template').html()),

  events: {
    'click .paginator-control--next': 'nextPage',
    'click .paginator-control--prev': 'prevPage'
  },

  render: function() {
    
    this.$el.html(this.template());
  
    this.delegateEvents();

    // in first page, not prev button 
    if (app.Ctrl.pageNum === 0) {
      this.$el.children('.paginator-control--prev').css('background', 'grey');
      this.$el.unbind('click', '.paginator-control--prev');
      
    };
    // in last page, no next button
    if (app.Ctrl.pageNum + 1 === app.Ctrl.paintsPaginator.getPageCount() ) {
      this.$el.children('.paginator-control--next').css('background', 'grey'); 
      this.$el.unbind('click', '.paginator-control--next');
    };

    return this;
  },

  nextPage: function() {
    this.trigger('nextPage');
  },

  prevPage: function() {
    this.trigger('prevPage');
  }

}))();
