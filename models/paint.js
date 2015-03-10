var mongoose = require('mongoose');
var gm = require('gm');
var Category = require('./category');


var Schema = mongoose.Schema;

var paintImageSchema = new Schema({

  name: {
    type: String,
    required: true
  },

  width: {
    type: Number,
    required: true
  },

  height: {
    type: Number,
    required: true
  },

  sizeName: {
    type: String,
    required: true
  }


});

var paintSchema = new Schema({
 
  /*
   * rename this to name
   */ 
  title: {
    type: String,
    required: true
  },

  baseDir: {
    type: String,
    required: true,
    default: 'public/images'
  },

  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category'
  },

  imageSet: [paintImageSchema]

});

paintSchema.methods.readCanonicalImage = function() {

  var imagePath = this.baseDir + this.title + '.jpg';
  return gm(imagePath);

};

paintSchema.methods.createImage = function(per, cb) {
  var self = this;
  //var baseDir = 'public/images/';
 
  var img = gm(self.baseDir + self.title + '.jpg')
    img.options({imageMagick: true})
    .size(function(err, size) {
      if ( err ) {
        /*
         * know what the error code means
         */ 
        cb.call(self, err); 
      }
      else {
        var width = Math.round(size.width * per / 100);
        var height = Math.round(size.height * per / 100);
        img.resize(width, height)
        /*
         * know how to force an error on writing to disk
         */
        .write(self.baseDir + image.title + per + '.jpg', function(err) {
          if ( err ) { 
            cb.call(this, err); 
          }
          else { 
            self.addImage({
                name: image.title + per
              , width: width
              , height: height
              , sizeName: per + ''
            }, cb)
          }
        })
      }
    })
}
  
paintSchema.virtual('sizes').get(function() {
  return [80, 40];
});


paintSchema.methods.addImage = function(image, cb) {
  this.imageSet.addToSet(image);
  if ( this.imageSet.length === this.sizes.length) {
    this.saveImages(cb);
  }
}

paintSchema.methods.saveImages = function(cb) {
  this.save(function(err, paint) { 
    err ? cb.call(this, err) : cb.call(this, null, paint)
  });
}

paintSchema.methods.createImages = function(image, cb) {
 
  var self = this; 
  Category.findOrCreate(image.category, function(err, category) {
    
    if ( err ) {
      cb.call(self, err);
    }
    else {
      self.title = image.title;
      self.category = category._id; 
      
      for( var i = 0; i < self.sizes.length; i++ ) {
        self.createImage(image, self.sizes[i], cb)
      }
    }
  });
  
};

var Paint = mongoose.model('Paint', paintSchema);

module.exports = Paint;
