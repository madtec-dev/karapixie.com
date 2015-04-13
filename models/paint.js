var mongoose = require('mongoose');
var gm = require('gm');
var Category = require('./category');
var PaintImage = require('./paintImage');
var path = require('path');
var fs = require('fs-extra');
var uuid = require('node-uuid');
var PaintImage = require('./paintImage');
var app = require('../app');

var paintSchema = new mongoose.Schema({
 
  name: {
    type: String,
    required: true
  },
  /*
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category'
  },
  */
  imageVariants: [PaintImage.schema]

});

paintSchema.virtual('status')
  .get(function() {
    return this._status;
  })
  .set(function(status) {
    this._status = status;
    return;
  });

paintSchema.virtual('filename') 
 .get(function() {
   return path.join(this.title); 
 });

paintSchema.virtual('filepath')
  .get(function() {
    // 'public/images/paints' should be read from a config 
    // variable in the app object.
    return path.join('public/images/paints', this.filename);
  });

paintSchema.methods.createCanonicalImage = function(filepath) {
  new PaintImage(filepath).then(function(paintImage){
    paintImage.move(path.join(this.filepath, uuid.v4() + '.jpg'))
  }).then(function(paintImage) {
    this.images.addToSet(paintImage);  
    //return paint
  }).catch(function(e) {
    return e;
  });
};

paintSchema.set('toObject', {
    getters: true
});

paintSchema.methods.move = function(dstpath) {
  fs.moveAsync(this.filepath, dstpath, true);
};

paintSchema.methods.createImageFileVariants = function() {
  var resizedCount = 0;
  _.map(this.images, function(image) {
    image.resize(image.getWidth, image.getHeight).then(function(paintImage) {
      resizedCount += 1;
      if( resizedCount === this.images.length ) {
        return;
      }
    }).catch(function(e) {
      return e;
    });
  });
};


paintSchema.methods.createImageVariants = function() {
  var paintImage;
  for ( var i = 0; i < this.sizes.length; i++ ) {
    paintImage = this.getCanonicalImage()
      .copy(path.join(this.filepath, uuid.v4() + '.jpg'))
      .then(function(paintImage) {
        paintImage.setWidth(
          Math.round(paintImage.getWidth * this.sizes[i] / 100)
        );
        paintImage.setHeight(
          Math.round(paintImage.getHeight * this.sizes[i] / 100)
        );
        this.images.addToSet(paintImage);

      }).catch(function(e) {
        return e;
      });
  }
};

paintSchema.methods.getImageVariantPaths = function() {
  var paths = [];
  for ( var i = 0; i < this.imageVariants.length; i++ ) {
    console.log(path.join(this.basedir, this.imageVariants[i].name));
  }
  return paths;
};

var Paint = mongoose.model('Paint', paintSchema);
// this should be an APP property
Paint.prototype.imageVariantsStatus;
Paint.sizes = [80, 60];


module.exports = Paint;
