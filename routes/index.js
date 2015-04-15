/*TODO
 * add a virtual method to get
 * the name of the paint + size
 *
 * add search interface for paints & category i.e
 * /paints?category=oil&name=square
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
//var app = require('../app');
var router = express.Router();
var paints = require('../data/paints');
var path = require('path');
var mongoose = require('mongoose');
var gm = require('gm');
var Paint = require('../models/paint');
var PaintImage = require('../models/paintImage');
var fs = require('fs-extra');
var uuid = require('node-uuid');
var Promise = require('bluebird');


//Promise.promisifyAll(Paint);
//Promise.promisifyAll(Paint.prototype);
Promise.promisifyAll(fs);



router.get('/', function(req, res) {
  res.render('index');
});

/**********************************************
 * API Paints
 *********************************************/

router.get('/api/paints', function(req, res) { 
  Paint.find(function(err, paints) {
    if ( err ) res.send(err);
    res.json(paints);
  });
});


router.post('/api/paints', function(req, res) {
  /*new PaintImage('public/images/fun.jpg').then(function(val) {
    console.log('res:', val);
  }).catch(function(e) {
    console.log('error:', e);
  });*/
  
    
  var paint = new Paint({title: 'lisa'});
  paint.createCanonicalImage('public/images/lisa.jpg').then(function(paint) {
    console.log(paint.images[0].getFilePath());
    //paint.createImageVariants();
  /*}).then(function(paint) {
    paint.save();
    // send 202 status code
  }).then(function(paint) {
    paint.createImageFileVariants();*/
  }).catch(function(e) {
    res.status(500).send(e);
  });
});

/**********************************************
 * API Paint status
 *********************************************/

router.get('/api/paints/:paintId/status', function(req, res) {
  
  var imageVariantProcesses = req.app.get('imageVariantProcesses');

  var paint;
  for ( var i = 0; i < imageVariantProcesses.length; i++ ) {
    if ( imageVariantProcesses[i]._id.toString() === req.params.paintId) {
      paint = imageVariantProcesses[i];
      break;
    }
  }  

  if (!paint) {
    res.status(404);
  }

  switch(paint.status) {
    case 'created':
      imageVariantProcesses.splice(imageVariantProcesses.indexOf(paint), 1); 
      res
        .set({
          'location': '/api/paints/' + paint._id.toString() 
        })
        .status(201)
        .json(paint);
      break;

    case 'gone':
      res.status(410);
      break;

    default:
      res.status(200);
  }
  
});

/**********************************************
 * API Paint
 *********************************************/

router.get('/api/paints/:paintId', function(req, res) {
  Paint.findById(req.params.paintId, function(err, paint) {
    if ( err ) res.send(err);
    res.json(paint); 
  });
});

router.patch('/api/paints/:paintId', function(req, res) {
  Paint.findByIdAsync(req.params.paintId)
  .then(function(paint) {
    
    if ( !req.files ) {
      fs.ensureDirAsync(path.join(req.app.get('paintbasedir'), 'trash'))
      .then(function() {
        var trashDir = path.join(req.app.get('paintbasedir'), 'trash', paint.name);
        var oldImagesDir = paint.basedir; 
        fs.moveAsync(oldImagesDir, trashDir, true)
      }).then(function() {
          res.status(200).json(paint); 
      }).catch(function(e) {
        res.status(500).send(e);
      });
    }
  });
});

router.delete('/api/paints/:paintId', function(req, res) {
  Paint.findByIdAndRemove(req.params.paintId, function(err, paint) {
    if ( err ) res.send(err);
    res.json(paint); 
  });
});

module.exports = router;
