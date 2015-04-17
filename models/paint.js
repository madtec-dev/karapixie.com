var mongoose = require('mongoose');
var gm = require('gm');
var Category = require('./category');
var PaintImage = require('./paintImage');
var path = require('path');
var fs = require('fs-extra');
var uuid = require('node-uuid');
var _ = require('lodash');
var PaintImage = require('./paintImage');
var app = require('../app');

var paintSchema = new mongoose.Schema({
 
  title: {
    type: String,
    required: true
  },
  /*
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category'
  },
  */
  images: []

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
  // maybe this method should return 
  // only the (canonical) paintImage 
  // instead of the paint Object
  var self = this;
  return new Promise(function(resolve, reject) {
    var paintImage = new PaintImage(filepath);
    paintImage.setSizes().then(function(paintImage) {
      paintImage.setFileName(uuid.v4() + '.jpg');
      paintImage.move(path.join(self.filepath, paintImage.getFileName()));
      self.images.addToSet(paintImage);
      resolve(self);
    }).catch(function(e) {
      reject(e);
    });
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
  var self = this;
  return new Promise(function(resolve, reject) {
    _.map(self.images, function(image) {
      console.log('resizing...');
      image.resize(image.getWidth(), image.getHeight()).then(function(paintImage) {
        resizedCount += 1;
        if( resizedCount === self.images.length ) {
          console.log('DONE');
          resolve(self);
        }
      }).catch(function(e) {
        reject(e);
      });
    });
  });
};


paintSchema.methods.createImageVariants = function() {
  var self = this;
  var i;
  for ( i = 0; i < Paint.sizes.length; i++ ) {
    var canonicalImage = this.getCanonicalImage();
    var paintImage = new PaintImage(canonicalImage.getFilePath());
     paintImage.setFileName(uuid.v4() + '.jpg');
     paintImage.setWidth(
       Math.round(canonicalImage.getWidth() * Paint.sizes[i] / 100)
     );
     paintImage.setHeight(
       Math.round(canonicalImage.getHeight() * Paint.sizes[i] / 100)
     );
     console.log(paintImage.getSize());
     self.images.push(paintImage);
     if(self.images.length === Paint.sizes.length + 1) return self;
  }
};

paintSchema.methods.getCanonicalImage = function() {
  return this.images[0];
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
