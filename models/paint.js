var mongoose = require('mongoose');
var gm = require('gm');
var Category = require('./category');
var PaintImage = require('./paintImage')
var path = require('path');
var fs = require('fs');

var Schema = mongoose.Schema;


var paintSchema = new Schema({
 
  name: {
    type: String,
    required: true
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category'
  },

  imageSet: [PaintImage.schema]

});

/*
 * Paint.createPaint (paintData) -> paint
 * PaintImage.createImageCanonical(paint) -> paintImage
 *   
 *   PaintImage.createImage() -> paintImage
 * paint.addImage(paintImage)
 * paint.save();
 *
 */


/*
 * 1. Create a imageFile from canonical
 * 2. Crerate a paintImage from imageFile
 * 3. Create a Paint obj
 * 4. Add paintImage to imageSet
 */
/*paintSchema.statics.createPaint = function(imagePath, paintData, cb) {
 
  Paint.createPaintImages(
      imagePath
    , path.join(paintData.imagesDir, paintData.title)
    , function(err, paintImages) {
        if ( err ) {
          cb(err)
        } 
        else {
          Category.findOrCreate(paintData.category, function(err, category) { 
            if ( err ) {
              cb(err)
            }
            else {
              // this is weird: (should we recieve category obj 
              // or category._id)
              paintData.category = category._id;
              var paint = new Paint(paintData);
              paint.imageSet = paintImages;
              cb(null, paint);
            }
          });
        }
      }); 
}


paintSchema.statics.createPaintImage = function(srcFilename, dstDir, per, cb) {

  PaintImage.createFileImageFromFile(srcFilename, dstDir, per, function(err, toFile) {
    if ( err ) {
      cb(err);
    }
    else {
      PaintImage.createPaintImageFromFile(toFile, function(err, paintImage) {
        if ( err ) {
          cb(err);
        }
        else {
          cb(null, paintImage);
        }
      })
    }
  });
};

paintSchema.statics.createPaintImages = function(srcFilename, dstDir, cb) {

  var sizes = Paint.getSizes();
  var paintImages = [];
  for ( var i = 0; i < sizes.length; i++ ) {
    Paint.createPaintImage(srcFilename, dstDir, sizes[i], function(err, paintImage) {
      if (err) {
        cb(err)
      }
      else {
        paintImages.push(paintImage);
        if ( paintImages.length === sizes.length ) {
          cb(null, paintImages);
        };
      }
    });
  }
};
  
paintSchema.statics.getSizes = function() {
  return [100, 80, 40];
};

/*
 * patch(/paints/:id)
 *
 * req.body
 *
 * req.files
 */

/*paintSchema.statics.updatePaint = function(filename, paintData, cb) {

  if ( arguments.length === 2 ) {
    var paintData = arguments[0];
    var cb = arguments[1];
    
  }

  Category.findOrCreate(paintData.category, function(err, category) {
    if ( err ) return cb(err); 
    Paint.findById(paintData._id, function(err, paint) {
      if (err) return cb(err);
      
      if ( filename ) {
        //Paint.createPaintImages(
        //  imagePath, path.join(paint.imagesDir, paintData.title))    
        }
      
      paintData.category = category._id;
      paint.update(paintData, function(err, paint) {
        if ( err ) return cb(err);
        cb(null, paint);
      });  
    });
  });
};

*/
var Paint = mongoose.model('Paint', paintSchema);

module.exports = Paint;
