/*TODO
 * add a virtual method to get
 * the name of the paint + size
 *
 * add search interface for paints & category
 *
 * generate random paint names
 * when upload images
 *
 * add URL property to paint images
 * in order to download the resource
 *
 * add errors to morgan logger
 *
 *  timestamp use ISO 8601 and UTC
 *
 *  API
 *
 *  determine if the paint ids are going to be the name of the
 *  paint or a generated id, if the id is the name of the paint 
 *  enable a put request over /api/paints to create a new paint,
 *  in the other way just enable the option via post.
 *
 *  media types for the images, jpg png
 *
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
                name: image.title + per
              , width: width
              , height: height
              , sizeName: per + ''
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
    err ? cb.call(this, err) : cb.call(this, null, paint)
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

// DB reset middleware
// Move thise middleware to app.js (implement with app.use)
router.route('/api/*').all(function(req, res, next) {
    mongoose.connection.db.dropDatabase(function(err) {
      if ( err ) { 
        return console.log(err) 
      }
      else {
        Category.create({name: 'oil'}, function(err, category) {
          if ( err ) {
            return console.log(err);
          }
          else {
            var paint = new Paint();
            paint.createImages({title: 'square', category: 'oil'}, function(err, paint) {
              if( err ) {
                return console.log(err);
              }
              else {
                next();
              }
            })
          }
        });
      }
  });
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

// PAINTS API
router.get('/api/paints', function(req, res) {

  res.json(paints);
  

});

router.get('/api/paints/:id', function(req, res) {
  Paint.findById(req.params.id)
    .populate('category')
    .exec(function(err, paint) {
      if(err) { return console.log(err); }
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

router.patch('/api/paints/:id', function(req, res) {
  // findOneAndUpdate will update the fullfilled fields within req.body
  // it will skip the empty ones
  Paint.findOneAndUpdate({_id: req.params.id}, req.body, {new: true}, function(err, paint){
    if ( err ) {
      return console.log(err);
    } 
    else {
      res.json(paint); 
    }
  })
});

router.delete('/api/paints/:id', function(req, res) {
  Paint.findOneAndRemove({_id: req.params.id}, function(err, paint) {
    if ( err ) {
      return console.log(err);
    } 
    else {
      res.json(paint); 
    }
  }); 
});

// CATEGORY API
router.get('/api/categories', function(req, res) {
  Category.find({}, function(err, categories) {
    if ( err ) {
      return console.log(err);
    }
    else {
      res.json(categories);
    }
  });
});

router.get('/api/categories/:id', function(req, res) {
  Category.findById(req.params.id, function(err, category) {
      if ( err ) { 
        return console.log(err); 
      }
      else {
        res.json(category);
      }
  });
});

router.post('/api/categories', function(req, res) {
  Category.create({name: req.body.category}, function(err, category) {
    if ( err ) {
      return console.log(err);
    }
    else {
      res.json(category);
    }
  });
});

router.patch('/api/categories/:id', function(req, res) {
  // findOneAndUpdate will update the fullfilled fields within req.body
  // it will skip the empty ones
  Category.findOneAndUpdate({_id: req.params.id}, req.body, {new: true}, function(err, category){
    if ( err ) {
      return console.log(err);
    } 
    else {
      res.json(category); 
    }
  })
});

router.delete('/api/categories/:id', function(req, res) {
  Category.findOneAndRemove({_id: req.params.id}, function(err, category) {
    if ( err ) {
      return console.log(err);
    } 
    else {
      res.json(category); 
    }
  }); 
});

module.exports = router;
