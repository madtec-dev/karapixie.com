var express = require('express');
var router = express.Router();
var paints = require('../data/paints');
var path = require('path');
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var categorySchema = new Schema({
  
  name: {
    type: String,
    required: true,
    unique: true
  },

});

var Category = mongoose.model('Category', categorySchema);

var paintSchema = new Schema({
  
  title: {
    type: String,
    required: true,
    unique: true
  },

  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category'
  },

  imageSrc: {
    type: String,
    required: true
  }

});

var Paint = mongoose.model('Paint', paintSchema);

var categoryOil = Category.create({
  name: 'oil'
}, function(err, cat){
  var newPaint = new Paint({
    title: 'fun',
    category: cat._id,
    imageSrc: 'fun.jpg'
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

module.exports = router;
