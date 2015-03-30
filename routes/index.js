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
var PaintImage = require('../models/paintImage');
var fs = require('fs-extra');
var uuid = require('node-uuid');



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

var status;

router.post('/api/paints', function(req, res) {
  
  var paint = new Paint({
      name: req.body.name
  });
 
  status = '';

  var paintImageName = uuid.v4() + '.jpg';
  
  paint.createImagesDir(function(err, dir) {
    if ( err ) res.json(err);

    var filepath = path.join(dir, paintImageName);
    fs.copy('public/images/square.jpg', filepath, function(err) {
      if ( err ) res.json(err);
      gm(filepath)
        .options({imageMagick: true})
        .size(function(err, size) {
          var paintImage = new PaintImage({
            name: paintImageName,
            width: size.width,
            height: size.height
          });
          paint.imageSet.addToSet(paintImage);
          paint.save(function(err, paint) {
            if ( err ) res.json(err);
           
            status = 'processing';

            paint.createImageVariants(filepath, function(err, filepaths) {
              if ( err ) return status = 'gone';
              for ( var i = 0; i < filepaths.length; i++ ) {
                var filepath = filepaths[i];
                gm(filepaths[i])
                  .options({imageMagick: true})
                  .size(function(err, size) {
                    if ( err ) return status = 'gone';

                    var filename = path.basename(filepath);
                    paint.imageSet.addToSet({
                      name: filename,
                      width: size.width,
                      height: size.height
                    });
                    paint.save(function(err, paint) {
                      if ( err ) return status = 'gone';
                      status = 'created';
                    });
                  });
              }
            });
            res
              .set({
                'location': '/api/paints/' + paint._id.toString() + '/status',
              })
              .status(202)
              .json(paint);
          });

        });
        
    });

  });

});

/**********************************************
 * API Paint status
 *********************************************/

router.get('/api/paints/:paintId/status', function(req, res) {

  Paint.findById(req.params.paintId, function(err, paint) {
    
    if ( err ) return console.log(err);

    if (status === 'created') {
      res
        .set({
          'location': '/api/paints/' + paint._id.toString() 
        })
        .status(201)
        .json(paint);
    }
    else if (status === 'processing') {
        res.status(200);
    }
    else {
      res.status(410);
    }
    
    
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
