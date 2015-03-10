var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var categorySchema = new Schema({
  
  name: {
    type: String,
    required: true
  },

});

categorySchema.statics.findOrCreate = function(name, cb) {
  /*
   * see if return whole category object or just the id
   */
  this.findOne({name: name}, function(err, category) {
    if ( err ) { cb.call(this, err) }
    else {
      if ( category ) {
        cb.call(this, null, category);
      }
      else {
        Category.create({name: name}, function(err, category) {
          if ( err ) { cb.call(this, err) }
          else {
            cb.call(this, null, category);
          }
        });
      }
    }  

  });

};

var Category = mongoose.model('Category', categorySchema);

module.exports = Category;
