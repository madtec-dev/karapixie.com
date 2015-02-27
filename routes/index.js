var express = require('express');
var router = express.Router();
var paints = require('../data/paints');
var path = require('path');
var mongoose = require('mongoose');
var gm = require('gm');

var Schema = mongoose.Schema;

var categorySchema = new Schema({
  
  name: {
    type: String,
    required: true
  },

});

var Category = mongoose.model('Category', categorySchema);

var paintImageSchema = new Schema({

  name: {
    type: String
  },

  width: {
    type: Number
  },

  height: {
    type: Number
  },

  sizeName: {
    type: String
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

  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category'
  },

  imageSet: [paintImageSchema]

});

function createImage(image, size) {
  console.log(image.title);
  var baseDir = 'public/images/';
  gm(baseDir + image.title + '.jpg')
  .options({imageMagick: true})
  .resize(size, '%')
  .write(baseDir + image.title + size + '.jpg', function(err) {
    if(err) {
      return console.log(err);
    } else {
      console.log('done');
      var width, height;
      gm(baseDir + image.title + size + '.jpg')
      .options({imageMagick: true})
      .size(function(err, size) {
        width = size.width;
        height = size.height;
        
      }) 
      return {
        name: image.title + size,
        width: width,
        height: height,
        sizeName: size + ''
      }
    }
  })

}

paintSchema.methods.createImages = function(image) {
  console.log(image.title);
  var sizes = [80, 40];
  for( var i = 0; i < sizes.length; i++ ) {
    this.imageSet.addToSet(createImage(image, sizes[i]));
  }
  
};

var Paint = mongoose.model('Paint', paintSchema);
  

var categoryOil = Category.create({
  name: 'oil'
}, function(err, cat){
  var newPaint = new Paint({
    title: 'fun',
    category: cat._id,
  });

  newPaint.imageSet.addToSet({
    name: 'sfdasfasfda',
    width: 1920,
    height: 800,
    sizeName: 'large'
  });
  
  newPaint.imageSet.addToSet({
    name: 'asdasd',
    width: 600,
    height: 400,
    sizeName: 'small'
  });

  newPaint.save();
});




router.get('/', function(req, res) {
  res.render('index');
});

router.get('/about', function(req, res) {
  res.render('about');
});

router.get('/contact', function(req, res) {
  res.render('contact');
});

/*
 *  API
 *
 *  determine if the paint ids are going to be the name of the
 *  paint or a generated id, if the id is the name of the paint 
 *  enable a put request over /api/paints to create a new paint,
 *  in the other way just enable the option via post.
 *
 *  media types for the images, jpg png
 *
 *  timestamp use ISO 8601 and UTC
 *
 *  enable /api/paints?_body=false and /api/paints/:paintId?_body=false
 *  in order to control when to download the actual img
 *
 *  implement pagination
 *  /api/paints?offset=10;limit=5
 *
 *  res
 *    {
 *      href: link of the current page
 *      offset: current offset
 *      limit: current limit
 *      
 *      first, last, next, prev as i.e
 *
 *      first: {
 *        href: link to first item in page
 *      }
 *
 *    }
 *
 *  partial representation
 *
 *  /api/paints/:paintId?fields=title,src
 *  returns title and src for a given paint
 *  
 *  reference expansion
 *
 *  /api/paints/:paintId?expand=category
 *  returns paint plus category data in one req
 */
router.get('/api/paints', function(req, res) {

  res.json(paints);
  

});

router.get('/api/paint/:id', function(req, res) {
  Paint.findById(req.params.id)
    .populate('category')
    .exec(function(err, paint) {
      if(err) { return console.log(err); }
      console.log(paint.category.name);
      res.json(paint);
  });
});

router.post('/api/paints', function(req, res) {
  console.log(req.body.title);
  var paint = new Paint();
  paint.createImages({
    title: req.body.title,
    category: req.body.category
  })
})

module.exports = router;
