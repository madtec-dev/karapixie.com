var mongoose = require('mongoose');
var gm = require('gm');
var Category = require('./category');
var path = require('path');
var fs = require('fs');


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

  imagesPath: {
    type: String,
    required: true,
    default: 'public/images'
  },

  imageCanonicalName: {
    type: String,
    required: true
  },

  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category'
  },

  imageSet: [paintImageSchema]

});

paintSchema.virtual('imageCanonicalPath').get(function() {

  return path.join(this.imagesPath, this.imageCanonicalName);

});

paintSchema.statics.createPaint = function(paintData) {
  var paint = new Paint(paintData);
  paint.createImageCanonical(paint, function(err, paint){
    if ( err ) {
      return console.log(err);
    }
    else {
      return paint;
    }
  });
}

paintSchema.methods.createImageCanonical = function(paint, cb) {
  gm(paint.imageCanonicalPath).size(function(err, size) {
    if ( err ) {
      console.log(err.code);
      cb('err');
    }
    else {
      paint.addImage({
          name: paint.imageCanonicalName
        , width: size.width
        , height: size.height
        , sizeName: '100'
      }, cb);
    }
  })
};

paintSchema.methods.createImage = function(per, cb) {
  var self = this;
  //var baseDir = 'public/images/';
  return gm(imagePath);
  var img = gm(self.imagesPath + self.title + '.jpg')
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
        .write(self.imagesPath + image.title + per + '.jpg', function(err) {
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
  //if ( this.imageSet.length === this.sizes.length) {
    this.saveImages(cb);
  //}
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
