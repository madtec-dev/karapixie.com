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

  imageSet: [PaintImage.schema]

});

paintSchema.virtual('imageCanonicalPath').get(function() {

  return path.join(this.imagesPath, this.imageCanonicalName);

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
paintSchema.statics.createPaint = function(paintData, cb) {
  PaintImage.createFileImageFromFile(
    paintData.imageCanonicalName,
    path.join(paintData.imagesPath, paintData.title),
    80,
    function(err, toFile) {
      if ( err ) {
        cb(err);
      }
      else {
        PaintImage.createPaintImageFromFile(toFile, function(err, paintImage) {
          if ( err ) {
            cb(err);
          }
          else {
            Category.findOrCreate(paintData.category, function(err, category) {
              if ( err ) {
                cb(err);
              }
              else {
                // this is weird: (should we recieve category obj 
                // or category._id)
                paintData.category = category._id;
                var paint = new Paint(paintData);
                paint.imageSet.addToSet(paintImage);
                cb(null, paint);
              }
            });
          }
        })
      }
    })
}


  
paintSchema.virtual('sizes').get(function() {
  return [80, 40];
});

var Paint = mongoose.model('Paint', paintSchema);

module.exports = Paint;
