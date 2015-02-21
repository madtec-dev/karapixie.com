/*
 * add exception for nextPage not found
 */
app.CollectionPaginator = function(options)  {

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
};
