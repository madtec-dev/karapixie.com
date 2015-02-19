app.PaintsFilter = {

  /*
   * filters a collection by the name of a category,
   * returns a backbone collection.
   */
  byCategoryName: function(collection, categoryName) {
   return categoryName == 'all' ? 
          collection : 
          new app.Paints(
            collection.where({category: categoryName})
          ); 
  },

};
