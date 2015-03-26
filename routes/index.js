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
var router = express.Router();
var paints = require('../data/paints');
var path = require('path');
var mongoose = require('mongoose');
var gm = require('gm');
var Paint = require('../models/paint');

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
  
  var paint = new Paint({
      name: req.body.name
  });

  paint.save(function(err, paint) {
    if ( err ) return res.send(err);
    
    paint.createImagesDir(function(err, dir) {
      if ( err ) return console.log(err);
      
      paint.createImageFile('public/images/square.jpg', dir, function(err, path) {
        if ( err ) return console.log(err);
        console.log('created: ' + path);
      });
    });

    res
      .set({
        'location': '/api/paints/' + paint._id.toString() + '/status',
      })
      .status(202)
      .json(paint);
  });

});

/**********************************************
 * API Paint status
 *********************************************/

router.get('/api/paints/:paintId/status', function(req, res) {

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
