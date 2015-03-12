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

/*
 * resize
 * write
 * createPaintIMagefromFile
 *
 *
 */

paintImageSchema.statics.createPaintImageFromFile = function(filePath, cb) {
 
  var per = per || 100;

  gm(filePath)
    .options({imageMagick: true})
    .size(function(err, size){
      if (err) { 
        cb(err)
      }
      else {

        cb(null, new PaintImage({
          width: size.width,
          height: size.height,
          sizeName: '100',
          name: 'xxx.jpg'
        }));
      }
  });
  
};

paintImageSchema.methods.createFileImageFromFile = function(filePath, per, cb) {

  var fileImage = gm(filePath);
  fileImage.options({imageMagick: true})
    .size(function(err, size){
      if (err) { 
        cb(err)
      }
      else {
        var width = Math.round(size.width * per / 100);
        var height = Math.round(size.height * per / 100);

        fileImage.resize(width, height)
          .write()
      }
  });

};

var PaintImage = mongoose.model('PaintImage', paintImageSchema);

module.exports = PaintImage;
