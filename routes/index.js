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


Promise.promisifyAll(Paint);
Promise.promisifyAll(Paint.prototype);
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

//var status;

router.post('/api/paints', function(req, res) {
  
  // this is the path for req.files.path
  var originalImageSrcPath = 'public/images/lisa.jpg';
  var originalImageDstPath = req.app.get('paintbasedir') + req.body.name + '/' + uuid.v4() + '.jpg';
  
  // move the uploaded image from uploads to dst dir
  fs.copyAsync(originalImageSrcPath, originalImageDstPath).then(function() {
    return Promise.promisifyAll(gm(originalImageDstPath))
      .options({imageMagick: true})
      .sizeAsync();
  }).then(function(size) {
    var paint = new Paint({name: req.body.name});
    var paintImages = [];
    for ( var i = 0; i < Paint.sizes.length; i++ ) {
      var paintImage = new PaintImage({
        name: uuid.v4() + '.jpg',
        width: Math.round(size.width * Paint.sizes[i] / 100),
        height: Math.round(size.height * Paint.sizes[i] / 100)
      });  
      paintImages.push(paintImage);
    } 

    paint.imageVariants = paintImages;
    return paint;
  }).then(function(paint) {
    paint.saveAsync(); 
    return paint;
  }).then(function(paint) { 
    paint.createImageVariants(originalImageDstPath, function(){});
    res
      .set({
        'location': '/api/paints/' + paint._id.toString() + '/status'
      })
      .status(202)
      .json(paint);
  }).catch(function(e) {
    console.error(e);
       res.status(400).send(e);
  });
});

/**********************************************
 * API Paint status
 *********************************************/

router.get('/api/paints/:paintId/status', function(req, res) {
  Paint.findByIdAsync(req.params.paintId).then(function(paint) {
    console.log(paint);
    switch(paint.status) {
      case 'created':
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
  }).catch(function(e) {
    res.status(404).send(e);
  });

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
  Paint.findByIdAndUpdate(req.params.paintId, {name: req.body.name}, function(err, paint) {
    if ( err ) res.send(err);
    res.json(paint); 
  });
});

router.delete('/api/paints/:paintId', function(req, res) {
  Paint.findByIdAndRemove(req.params.paintId, function(err, paint) {
    if ( err ) res.send(err);
    res.json(paint); 
  });
});

module.exports = router;
