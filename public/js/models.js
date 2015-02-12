var app = app || {};
app.Paint = Backbone.Model.extend({

  defaults: {
    title: 'untitled',
  }

});
app.Category = Backbone.Model.extend({

  defaults: {
    name: 'unnamed',
    selected: false
  }

});

