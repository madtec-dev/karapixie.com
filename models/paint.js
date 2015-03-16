var mongoose = require('mongoose');
var gm = require('gm');
var Category = require('./category');
var PaintImage = require('./paintImage')
var path = require('path');
var fs = require('fs');


var Schema = mongoose.Schema;




var paintSchema = new Schema({
 
  /*
   * rename this to name
   */ 
  title: {
    type: String,
    required: true
  },

  imagesDir: {
    type: String,
    required: true,
    default: 'public/images'
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
paintSchema.statics.createPaint = function(imagePath, paintData, cb) {
 
  Paint.createPaintImages(
      imagePath
    , path.join(paintData.imagesDir, paintData.title)
    , function(err, paintImages) {
        if ( err ) {
          cb(err)
        } 
        else {
          Paint.findOrCreateCategory(paintData.category, function(err, category) { 
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


paintSchema.statics.findOrCreateCategory = function(categoryName, cb) {

  Category.findOrCreate(categoryName, function(err, category) {
    if ( err ) {
      cb(err);
    }
    else {
      cb(null, category);
    }
  });

}

paintSchema.statics.createPaintImage = function(fromFile, toDir, per, cb) {

  PaintImage.createFileImageFromFile(fromFile, toDir, per, function(err, toFile) {
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

paintSchema.statics.createPaintImages = function(fromFile, toDir, cb) {

  var sizes = Paint.getSizes();
  var paintImages = [];
  for ( var i = 0; i < sizes.length; i++ ) {
    Paint.createPaintImage(fromFile, toDir, sizes[i], function(err, paintImage) {
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

paintSchema.statics.updatePaint = function(imagePath, paintData, cb) {

  var paintData = paintData || imagePath;

  Paint.findById(paintData._id, function(err, paint) {
    if (err) {
      cb(err)
    } 
    else {
      if ( imagePath ) {
        //Paint.createPaintImages(
        //  imagePath, path.join(paint.imagesDir, paintData.title))    
      }
      paint.update(paintData);  
      
    }
  });

};


var Paint = mongoose.model('Paint', paintSchema);

module.exports = Paint;
