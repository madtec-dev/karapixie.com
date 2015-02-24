/*
 * add exception for nextPage not found
 */
app.CollectionPaginator = Backbone.Collection.extend({

  initialize: function(models, options) {

    this.offset = options.offset || 0;
    this.delta = options.delta || 2;
    this.limit = this.delta;
    this.models = models;
  },
  /*
  nextPage: function() {
    var modelsPage = this.models;
    var nextPage = modelsPage.slice(this.offset, this.limit);
    this.offset += this.delta;
    this.limit += this.delta;

    return nextPage;
  },

  prevPage: function() {
    this.offset -= this.delta;
    this.limit -= this.delta;

    var modelsPage = this.models;
    var prevPage = modelsPage.slice(this.offset, this.limit);

    if ( this.offset < 0 ) this.offset = 0;
    if ( this.limit < this.delta) this.limit = this.delta;

    return prevPage;
  },

  getPage: function(pageNum) {
    var page = this.nextPage();
    var i = 0;
    while ( i < pageNum ) {
      page = this.nextPage();
      i++;
    }

    return page;
  },
  
  getPageCount: function() {
    return Math.ceil(this.models.length / this.delta);
  },

  getNumPageFor: function(elem) {
    var itemIndex = this.models.indexOf(elem); 
    return Math.floor(itemIndex / this.delta);
  },
  */
});
