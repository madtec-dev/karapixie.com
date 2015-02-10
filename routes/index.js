var express = require('express');
var router = express.Router();
var paints = require('../data/paints');
var path = require('path');

/* GET home page. */
//router.get('/', function(req, res) {
//  res.render('index', { title: 'Express' });
//});

router.get('/', function(req, res) {
  res.render('index');
});


router.get('/#paints', function(req, res) {
  res.render('paints');
});


router.get('/paints/:id', function(req, res) {
  //res.sendFile(path.join(__dirname, '../public/images/', 'fun.jpg'));
  var paint = null;
  for (var i = 0; i < paints.length; i++) {
    if (paints[i].title == req.params.id) {
      paint = paints[i];
    }
  }
  res.json(paint);
});

module.exports = router;
