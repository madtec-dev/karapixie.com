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

paintSchema.set('toObject', {
    getters: true
});

paintSchema.methods.move = function(dstpath) {
  fs.moveAsync(this.filepath, dstpath, true);
};

paintSchema.methods.createImageFile = function(srcfile, imageVariant, cb) {
  // get the extension of the file
  var dstpath = path.join(this.basedir, imageVariant.name);
  gm(srcfile)  
    .options({imageMagick: true})
    .resize(imageVariant.width, imageVariant.height)
    .write(dstpath, function(err) {
      if ( err ) return cb(err);
      cb(null, dstpath);
    });
};


paintSchema.methods.createImageVariants = function(srcfile, cb) {
  this.status = 'processing'; 
  var filepaths = [];
  var self = this;
  for ( var i = 0; i < this.imageVariants.length; i++ ) {

    this.createImageFile(srcfile, this.imageVariants[i], function(err, path) {
      if ( err ) {
        self.status = 'gone'; 
        return cb(err);
      }
      
      filepaths.push(path);
      if ( filepaths.length === self.imageVariants.length ) {
        self.status = 'created'; 
        console.log(self.status);
        cb(null, filepaths);
      }
    });
  };
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
