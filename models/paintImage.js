var mongoose = require('mongoose');
var gm = require('gm');
var Category = require('./category');
var path = require('path');
var fs = require('fs');
var uuid = require('node-uuid');

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
  }


});

/*
 * resize
 * write
 * createPaintIMagefromFile
 *
 *
 */

paintImageSchema.statics.createPaintImageFromFile = function(filePath, cb) {

  /*fs.readFileAsync(filePath).then(function(val) {
    console.log(val);
  })*/
  gm(filePath)
    .options({imageMagick: true})
    .identify(function(err, fileData){
      if (err) { 
        cb(err)
      }
      else {
        cb(null, new PaintImage({
          width: fileData.size.width,
          height: fileData.size.height,
          name: path.basename(fileData.path)
        }));
      }
  });
  
};

/*
 * Given an image file path 
 * this creates a copy of the img
 * and resize it according with the per parameter
 * and write it on disk
 *
 * default toDir value is fromFile - dir
 */

paintImageSchema.statics.createFileImageFromFile = function(fromFile, toDir, per, cb) {
  var file = gm(fromFile);
  file.options({imageMagick: true})
    .size(function(err, size){
      if (err) { 
        cb(err)
      }
      else {
        var width = Math.round(size.width * per / 100);
        var height = Math.round(size.height * per / 100);
        
        if ( !fs.existsSync(toDir) ) {
            fs.mkdirSync(toDir);
        }
        var toFile = path.join(toDir, uuid.v4());
        toFile += '.jpg'
      
        file.resize(width, height)
          .write(toFile, function(err) {
            if ( err ) {
              console.log(err);
              cb(err);
            }
            else {
              cb(null, toFile);
            }
          })
      }
  });

};

var PaintImage = mongoose.model('PaintImage', paintImageSchema);

module.exports = PaintImage;
