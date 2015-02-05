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

var PaintThumbView = Backbone.View.extend({

  model: Paint,

  tagName: 'p',

  className: 'paint paint--thumb',

  template: _.template($('#paint-thumb-template').html()),

  events: {
    'click': 'show'
  },

  render: function() {
    this.$el.html(this.template({paint: this.model}));
    return this;
  },

  show: function() {
    this.trigger('showPaint', {model: this.model});
  }

});


var PaintFullView = Backbone.View.extend({
  
  model: Paint,

  //tagName: 'div',

  el: '.paint-app',

  template: _.template($('#paint-full-template').html()),

  render: function() {
    this.$el.html(this.template({paint: this.model}));
    return this;
  }

});


var PaintThumbListView = Backbone.View.extend({

  model: Paint,

  //el: '.paints',

  tagName: 'div',

  render: function() {   
    this.$el.empty();
    var self = this;
    this.collection.each(function(paint) {
      var paintThumbView = new PaintThumbView({model: paint});
      self.$el.append(paintThumbView.render().el);
      
      paintThumbView.bind('showPaint', self.showPaint, self);
    });
    return this;
  },

  showPaint: function(e) {
    this.trigger('showPaint', {model: e.model});
  },

  close: function() {
    this.remove();
  }


});
var PaintControlsView = new (Backbone.View.extend({

  el: '.paint-app',

  template: _.template($('#paint-controls-template').html()),

  events: {
    'click .next': 'nextPaint',
    'click .prev': 'prevPaint'
  },

  render: function() {
    this.$el.append(this.template());
  },

  nextPaint: function() {
    this.trigger('nextPaint');
  },

  prevPaint: function() {
    this.trigger('prevPaint');
  }

}))();

var CategoryView = Backbone.View.extend({

  model: Category,

  tagName: 'li',

  className: 'category',

  template: _.template($('#category-template').html()),

  events: {
    'click': 'showPaints'
  },

  showPaints: function() {
    this.trigger('showPaints', {model: this.model});
  },

  render: function() {
    this.$el.html(this.template({category: this.model}));
    return this;
  }

}); 

var CategoryListView = Backbone.View.extend({

  //el: '.categories',

  tagName: 'div',

  showPaints: function(e) {
    this.trigger('showPaints', {model: e.model});
  },

  render: function() {
    this.$el.empty();
    var self = this;
    this.collection.each(function(category) {
      var categoryView = new CategoryView({model: category});
      self.$el.append(categoryView.render().el);

      categoryView.bind('showPaints', self.showPaints, self);
    });
    return this;
  } 

});


var GalleryView = Backbone.View.extend({
 
  el: '.paint-app',

  initialize: function(params) {

    this.paintThumbListView = new PaintThumbListView({collection: params.paintCollection});
    this.categoryListView = new CategoryListView({collection: params.categoryCollection});

    this.paintThumbListView.bind('showPaint', this.showPaint, this);
    this.categoryListView.bind('showPaints', this.showPaints, this);
  },

  render: function() {
    this.$el.empty();
    this.$el.append(this.categoryListView.render().el);   
    this.$el.append(this.paintThumbListView.render().el);

  },

  showPaint: function(e) {
    this.trigger('showPaint', {model: e.model});
  },

  showPaints: function(e) {
    this.trigger('showPaints', {model: e.model});
  }

});

var PageNavView = new (Backbone.View.extend({

  el: '.paint-app',

  template: _.template($('#page-nav-template').html()),

  render: function() {
    this.$el.empty();
    this.$el.append(this.template());
  }

}))();
