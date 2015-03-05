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

categorySchema.statics.findOrCreate = function(name, cb) {
  /*
   * see if return whole category object or just the id
   */
  this.findOne({name: name}, function(err, category) {
    if ( err ) { cb.call(this, err) }
    else {
      if ( category ) {
        cb.call(this, null, category);
      }
      else {
        Category.create({name: name}, function(err, category) {
          if ( err ) { cb.call(this, err) }
          else {
            cb.call(this, null, category);
          }
        });
      }
    }  

  });

};

var Category = mongoose.model('Category', categorySchema);

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


paintSchema.methods.createImage = function(image, per, cb) {
  var self = this;
  var baseDir = 'public/images/';
 
  var img = gm(baseDir + image.title + '.jpg')
    img.options({imageMagick: true})
    .size(function(err, size) {
      if ( err ) {
        /*
         * know what the error code means
         */ 
        cb.call(self, err); 
      }
      else {
        var width = Math.round(size.width * per / 100);
        var height = Math.round(size.height * per / 100);
        img.resize(width, height)
        /*
         * know how to force an error on writing to disk
         */
        .write(baseDir + image.title + per + '.jpg', function(err) {
          if ( err ) { 
            cb.call(this, err); 
          }
          else { 
            self.addImage({
              name: image.title + per,
              width: width,
              height: height,
              sizeName: per + ''
            }, cb)
          }
        })
      }
    })
}

/*
 function a() {
  this.c = 'ok';
this.e = function() {
    console.log(this.c);
  }
  this.b = function(cb) {
    cb.call(this);
  }
}

var o = new a();
o.b(o.e);*/

paintSchema.virtual('sizes').get(function() {
  return [80, 40];
})

paintSchema.methods.addImage = function(image, cb) {
  this.imageSet.addToSet(image);
  if ( this.imageSet.length === this.sizes.length) {
    this.saveImages(cb);
  }
}

paintSchema.methods.saveImages = function(cb) {
  this.save(function(err, paint) { 
    err ? cb.call(this, err) : cb.call(this, paint)
  });
}

paintSchema.methods.createImages = function(image, cb) {
 
  var self = this; 
  Category.findOrCreate(image.category, function(err, category) {
    
    if ( err ) {
      cb.call(self, err);
    }
    else {
      self.title = image.title;
      self.category = category._id; 
      
      for( var i = 0; i < self.sizes.length; i++ ) {
        self.createImage(image, self.sizes[i], cb)
      }
    }
  });
  
};

var Paint = mongoose.model('Paint', paintSchema);
  
/*
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
*/


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

router.get('/api/paints/:id', function(req, res) {
  Paint.findById(req.params.id)
    .populate('category')
    .exec(function(err, paint) {
      if(err) { return console.log(err); }
      console.log(paint.category.name);
      res.json(paint);
  });
});

router.post('/api/paints', function(req, res) {
  var paint = new Paint();
  paint.createImages({
    title: req.body.title,
    category: req.body.category
  }, function(err, paint) {
    if ( err ) { 
      /*
       * login the erros with morgan
       * send back human readable errors
       */
      res.send(err);
    }
    else {
      res.json(paint) 
    }
  });
})

router.put('/api/paints/:id', function(req, res) {

});

module.exports = router;
