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

  events: {
    'click': 'paintSelected'
  },

  render: function() {
        this.$el.html(this.template({paint: this.model, category: app.Ctrl.categoryName}));
    return this;
  },

  paintSelected: function() {
    this.trigger('paint:selected', this.model.get('title'));
       
  }

});

app.PaintFullView = Backbone.View.extend({
  
  model: app.Paint,

  //tagName: 'div',

  el: '.paint-app',

  template: _.template($('#paint-full-template').html()),

  render: function() {
    this.$el.html(this.template({paint: this.model}));
    return this;
  }

});


app.PaintThumbListView = Backbone.View.extend({

  model: app.Paint,

  //el: '.paints',

  tagName: 'div',

  render: function(category) {   
    this.$el.empty();
    var self = this;
    this.collection.each(function(paint) {
        var paintThumbView = new app.PaintThumbView({model: paint});
      self.$el.append(paintThumbView.render().el);
      
      paintThumbView.bind('paint:selected', self.paintSelected, self);
    });
    return this;
  },

  paintSelected: function(paintTitle) {
    this.trigger('paint:selected', paintTitle);
  },

  close: function() {
    this.remove();
  }


});
app.PaintControlsView = new (Backbone.View.extend({

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

app.CategoryView = Backbone.View.extend({

  model: app.Category,

  tagName: 'li',

  className: 'category',

  template: _.template($('#category-template').html()),

  /*events: {
    'click': 'categorySelected'
  },

  categorySelected: function() {
    this.trigger('category:selected', this.model.get('name'));
  },*/

  render: function() {
    if ( this.model.get('selected') ) {
      this.$el.css('color', 'red');
    }
    this.$el.html(this.template({category: this.model}));
    return this;
  }

}); 

app.CategoryListView = Backbone.View.extend({

  //el: '.categories',

  tagName: 'div',

  /*categorySelected: function(categoryName) {
    this.trigger('category:selected', categoryName);
  },*/

  render: function() {
    this.$el.empty();
    var self = this;
    this.collection.each(function(category) {
      var categoryView = new app.CategoryView({model: category});
      self.$el.append(categoryView.render().el);

      /*categoryView.bind('category:selected', self.categorySelected, self);*/
    });
    return this;
  } 

});


app.GalleryView = Backbone.View.extend({
 
  el: '.paint-app',

  initialize: function(options) {

    this.paintThumbListView = new app.PaintThumbListView({collection: options.paintCollection});
    this.categoryListView = new app.CategoryListView({collection: options.categoryCollection});

    this.paintThumbListView.bind('paint:selected', this.paintSelected, this);
    /*this.categoryListView.bind('category:selected', this.categorySelected, this);*/
  },


  render: function() {
    this.$el.empty();
    this.$el.append(this.categoryListView.render().el);   
    this.$el.append(this.paintThumbListView.render().el);
  },

  paintSelected: function(paintTitle) {
    this.trigger('paint:selected', paintTitle);
  },

  /*categorySelected: function(categoryName) {
    this.trigger('category:selected', categoryName);
  }*/

});
        

app.PageNavView = new (Backbone.View.extend({

  el: '.paint-app',

  template: _.template($('#page-nav-template').html()),

  render: function() {
    this.$el.empty();
    this.$el.append(this.template());
  }

}))();
