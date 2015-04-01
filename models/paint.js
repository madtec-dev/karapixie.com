var mongoose = require('mongoose');
var gm = require('gm');
var Category = require('./category');
var PaintImage = require('./paintImage');
var path = require('path');
var fs = require('fs-extra');
var uuid = require('node-uuid');
var PaintImage = require('./paintImage');

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

/*
paintSchema.methods.createImagesDir = function(cb) {

  var paintdir = path.join(Paint.basedir, this.name);
  
  fs.ensureDir(paintdir, function(err) {
    if ( err ) return cb(err);
    cb(null, paintdir);
  });  

};

paintSchema.methods.createImageFile = function(srcfile, per, cb) {
  // get the extension of the file

  var dstdir = path.dirname(srcfile);
  var dstpath = path.join(dstdir, uuid.v4() + '.jpg');
  gm(srcfile)  
    .options({imageMagick: true})
    .resize(per, '%')
    .write(dstpath, function(err) {
      if ( err ) return cb(err);
      cb(null, dstpath);
    });
};

paintSchema.methods.createImageVariants = function(srcfile, cb) {
  var filepaths = [];
  for ( var i = 0; i < Paint.sizes.length; i++ ) {

    this.createImageFile(srcfile, Paint.sizes[i], function(err, path) {
      if ( err ) return cb(err);
      
      filepaths.push(path);
      if ( filepaths.length === Paint.sizes.length ) {
        cb(null, filepaths);
      }
    });
  };
};
*/

var Paint = mongoose.model('Paint', paintSchema);
Paint.basedir = 'public/images/paints/';
Paint.sizes = [80, 60];


module.exports = Paint;
