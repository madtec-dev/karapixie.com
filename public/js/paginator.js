/*
 * add exception for nextPage not found
 *
 *
 */
app.CollectionPaginator = {

  offset: 0,

  delta: 2,

  limit: 0,

  currentPageNum: 0,
 
  setCollection: function(collection) {
    this.offset = 0;
    this.delta = 2;
    this.limit = this.delta;
    this.collection = collection;
  },

  nextPage: function() {
    var collectionPage = this.collection;
    var nextPage = collectionPage.slice(this.offset, this.limit);
    this.offset += this.delta;
    this.limit += this.delta;

    return new app.Paints(nextPage);
  },

  prevPage: function() {
    this.offset -= this.delta;
    this.limit -= this.delta;

    var collectionPage = this.collection;
    var prevPage = collectionPage.slice(this.offset, this.limit);

    if ( this.offset < 0 ) this.offset = 0;
    if ( this.limit < this.delta) this.limit = this.delta;

    return new app.Paints(prevPage);
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
    return Math.ceil(this.collection.length / this.delta);
  },
};
